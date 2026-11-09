import { readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'
import z from '@deepseek-ai/schemastery'

const MAX_CACHE_BYTES = 16 * 1024 * 1024
const MAX_TEMPLATE_CHARS = 256 * 1024
const DEFAULT_BASE_NAMES = ['harness:identity', 'studio:dsh-codex:identity']

export function normalizeModelId(model) {
  return typeof model === 'string' ? model.replace(/^(?:(?:opencode:)?openai[/:]|models\/)/, '') : ''
}

export function resolveRoute(context, assembly) {
  const selected = context.modelSelection ?? context.agent?.model?.current?.()
  const header = selected ? undefined : context.agent?.session?.requestHeader?.()?.config
  return {
    provider: selected?.provider ?? assembly.variables?.provider ?? header?.provider ?? context.agent?.options?.provider ?? '',
    model: selected?.model ?? assembly.variables?.model ?? header?.model ?? context.agent?.options?.model ?? '',
  }
}

export function createTemplateCatalog({ cachePath = path.join(process.env.CODEX_HOME || path.join(homedir(), '.codex'), 'models_cache.json'), bundledPath = new URL('./prompts/openai-models.json', import.meta.url), genericPath = new URL('./prompts/generic.md', import.meta.url), aliases = {} } = {}) {
  let bundled
  let generic
  let live = { key: '', models: new Map() }
  const valid = text => typeof text === 'string' && text.trim() && text.length <= MAX_TEMPLATE_CHARS
  async function snapshots() {
    bundled ??= readFile(bundledPath, 'utf8').then(JSON.parse).then(data => new Map(Object.entries(data.models).flatMap(([model, key]) => valid(data.templates[key]) ? [[model, data.templates[key]]] : [])))
    return bundled
  }
  async function local(signal) {
    try {
      const metadata = await stat(cachePath)
      if (metadata.size > MAX_CACHE_BYTES) return new Map()
      const key = `${metadata.mtimeMs}:${metadata.ctimeMs}:${metadata.size}`
      if (live.key === key) return live.models
      const data = JSON.parse(await readFile(cachePath, { encoding: 'utf8', signal }))
      const models = new Map((Array.isArray(data.models) ? data.models : []).flatMap(model => valid(model?.model_messages?.instructions_template) && typeof model.slug === 'string' ? [[model.slug, model.model_messages.instructions_template]] : []))
      live = { key, models }
      return models
    } catch (error) {
      if (signal?.aborted) throw error
      return new Map()
    }
  }
  return {
    async select(route, signal) {
      signal?.throwIfAborted()
      const model = normalizeModelId(Object.hasOwn(aliases, route.model) ? aliases[route.model] : route.model)
      const snapshot = await snapshots()
      const cached = await local(signal)
      const openAI = cached.has(model) || snapshot.has(model) || /^(?:gpt-|o\d(?:[-.]|$)|codex(?:[-.]|$))/.test(model) || /(?:^|[:/])openai$/.test(route.provider)
      if (openAI) {
        if (cached.has(model)) return { text: cached.get(model), source: 'codex-cache', model, openAI: true, codexTemplate: true }
        if (snapshot.has(model)) return { text: snapshot.get(model), source: 'bundled-codex', model, openAI: true, codexTemplate: true }
      }
      generic ??= readFile(genericPath, 'utf8')
      return { text: await generic, source: openAI ? 'generic-missing-template' : 'generic', model, openAI, codexTemplate: false }
    },
  }
}

export const Config = z.object({
  mode: z.union(['override', 'append']).default('override'),
  codexCachePath: z.string().default(''),
  modelAliases: z.dict(z.string()).default({}),
})
export const name = '模型基础提示词'
export const inject = ['systemPrompt', 'tools', 'studioPromptRenderer']

export function apply(ctx, config = {}) {
  const catalog = createTemplateCatalog({ ...(config.codexCachePath ? { cachePath: config.codexCachePath } : {}), aliases: config.modelAliases ?? {} })
  ctx.provide('studioModelPrompts', catalog)
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    const assembly = await next()
    const route = resolveRoute(context, assembly)
    const selected = await catalog.select(route, context.signal)
    const tools = ctx.tools.schemas(context.scope, context.toolSet)
    const ptc = assembly.sections.some(section => section.name === 'tools:ptc-only' && section.text.trim())
    const text = ctx.studioPromptRenderer.render(selected.text, { ...route, tools, ptc, codex: selected.codexTemplate })
    const replaceNames = [...DEFAULT_BASE_NAMES]
    for (const section of assembly.sections) {
      if (section.name !== 'deployment:persona-prefix') continue
      const persona = section.text.replaceAll('{{model}}', route.model).trim()
      if (!persona || persona === `You are a coding agent powered by the ${route.model} model.` || persona === `You are a Codex-style coding agent powered by the ${route.model} model. Work directly in the user's workspace and complete requested changes.` || persona === 'You are a helpful software engineer assistant.') replaceNames.push(section.name)
    }
    return ctx.studioPromptRenderer.transform(assembly, { text, mode: config.mode ?? 'override', replaceNames })
  })
}
export default { name, inject, Config, apply }
