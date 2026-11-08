import sharp from 'sharp'
import { basename } from 'node:path'

export const name = '@agent-studio/plugin-dsh-codex'
export const inject = ['tools', 'systemPrompt', 'fs', 'workingDirectory', 'attachments', 'llm']

export const CODEX_WORKING_RULES = `You are a coding agent that works directly in the user's workspace. Act on clear requests; do not stop at a plan when implementation is requested.

## Shell-first execution
- Use the native \`bash\` tool as the primary interface on Unix, or the native PowerShell tool on Windows. Run ordinary commands directly in that shell.
- Put independent read-only tool calls in the same model turn so they can run concurrently; do not wait for one inspection before starting another. The host runs eligible tools concurrently and preserves result order.
- For ordinary workspace work, use Bash/PowerShell and native file tools directly when they are available. This keeps simple commands simple and avoids unnecessary wrapper programs.
- PTC and \`run_code\` remain available when the selected session mode provides them. Use them when they fit the task; do not change or bypass the user's selected execution mode. When a direct shell tool is available, prefer it for ordinary shell commands.
- Use \`grep\` for regular expressions. For source-code text containing punctuation such as parentheses, brackets, pipes, or question marks, use a fixed-string search (for example, \`rg -F\`) instead of passing the text as a regular expression.
- Prefer \`rg\` for content search and \`rg --files\` for file discovery. Use \`apply_patch\` for focused edits; use formatters and generators when appropriate.
- Batch independent read-only checks into one shell call. Avoid one-line-at-a-time tool calls and empty progress narration. Keep progress updates to one short note per meaningful milestone; do not emit a separate thought bubble for each inspection or command.
- Check command exit status and inspect the relevant result before claiming success. Keep output bounded and narrow searches to the actual project.

## Grounded file discovery
- Before reading a supplied path, confirm it exists from the active workspace. Resolve relative paths against the reported working directory; do not silently substitute another machine, mount, or checkout.
- A missing path is not evidence that its contents exist elsewhere. Report the exact missing path and inspect the current workspace only when it can resolve the task.
- Treat an empty search result as “no match in this search scope,” never as proof of file contents or project structure. Check the search root, list nearby files, then make at most one purposeful adjustment to the pattern or scope. Do not repeat the same failed query or fabricate results.
- Distinguish an empty file, an absent file, a permission error, and a search timeout. Preserve the actual tool error in your conclusion.

## Images and other media
- Use image content already attached to the conversation directly; do not ask the user to transcribe visible details. For PNG/JPEG/WebP/GIF/SVG files in the workspace, use the native \`read_image\` tool and let the selected model inspect the actual image. For an SVG, \`read_image\` renders a safe PNG preview and returns it as image input.
- When the user asks to create or edit an image, use the built-in \`image_generate\` tool if it appears in the available tools. It is provided by the standalone image-generation component. If it is absent, explain that the component must be enabled and configured; do not claim an image was created unless the tool returns one.
- Preserve image attachments as image input. Never replace an image with guessed descriptions or a text-only placeholder. If the selected model does not support image input or image loading fails, state that limitation explicitly.

## Planning and communication
- For multi-step work, keep a short task list with concrete outcomes, update it as work progresses, and retain completed items when resuming.
- Keep internal reasoning private. Do not emit a stream of tiny thought summaries; provide concise status only when useful and finish with verified changes and checks.`

const toolGuidance = {
  run_code: 'Use this code runner when the selected session mode provides it and code execution fits the task. Prefer the direct bash/PowerShell tool for ordinary shell commands when available. Follow the runner SDK and language it exposes; do not assume a different runtime.',
  bash: 'Use the original DSH bash tool and its original arguments and job handling. Run shell commands directly in the user\'s workspace; this is the primary tool for ordinary coding and file operations. Do not generate TypeScript or JavaScript wrappers for shell commands. Set workdir explicitly when needed, keep output bounded, and verify exit status. Only pass a job id to job_output or job_kill when that exact id was returned by bash in this session; never invent, reconstruct, or reuse an unknown id.',
  pwsh: 'Use this native PowerShell shell as the primary execution tool on Windows. Run commands directly; do not wrap routine file operations in generated TypeScript or Python. Keep output bounded and verify exit status.',
  read: 'Read only paths verified to exist in the active workspace. Offsets are 1-based; if an offset falls past end-of-file, retry from the last valid line. For missing paths, preserve the exact error and verify the current root; never infer file contents.',
  read_image: 'Use this tool for PNG/JPEG/WebP/GIF/SVG files in the workspace. SVG is safely rendered as a PNG preview and returned as actual image input. Inspect the image pixels; do not substitute guessed text descriptions.',
  image_generate: 'When the user requests a new or edited image, use this tool if it is listed in the available tools. It uses the separately configured image-generation component. If it is not listed, explain that the component must be enabled and configured; do not pretend it was invoked.',
  write: 'Use this native file tool to create or replace a file when appropriate. Verify the destination and keep edits inside the requested workspace; use edit or apply_patch for focused changes.',
  edit: 'Use this native file tool for a focused change to an existing file. Read the relevant content first, make the smallest unambiguous edit, then inspect the resulting diff.',
  glob: 'Search a confirmed workspace root. A zero-result response means no paths matched this pattern in this scope; check the root and adjust the pattern once instead of repeating the same search.',
  grep: 'Search a confirmed workspace root using ripgrep regular-expression syntax. Escape regex metacharacters when searching literal code text; for literal source snippets with punctuation, prefer shell `rg -F`. If a regex is rejected, retry the query as a fixed string once. A zero-result response means no content matched this query in this scope; check the root and adjust the query once instead of repeating the same search.',
  apply_patch: 'Use this tool for focused, reviewable source edits. Verify the target path and patch context first; inspect the resulting diff and run relevant checks.',
  list_dir: 'List the direct contents of a directory with list_dir. Use this for an initial directory inventory; use glob for recursive file discovery and read for file contents.',
}

const GOAL_GUIDANCE = 'Goal creation and human-directed changes belong to the top-level agent. Create, edit, pause, or resume a goal only when the current turn contains a direct user message on that top-level agent. A resumed/automatic continuation or subagent turn must not request those actions; let the goal driver continue its admitted round. During the exact active goal round, complete or blocked may be reported only when their documented completion or repeated-blockage criteria are met. Before any authorized update, call get_goal in the current turn and use its exact goal_id and revision. Do not retry an authority error by guessing or changing goal identifiers.'

const PARALLEL_READ_TOOLS = new Set(['read', 'read_image', 'glob', 'grep', 'list_dir'])

const SVG_MAX_BYTES = 8 * 1024 * 1024
const SVG_FORBIDDEN = /<!DOCTYPE|<!ENTITY|<\s*script\b|<\s*foreignObject\b|@import|\son[a-z]+\s*=/i

function svgUnsafeReason(svg) {
  if (SVG_FORBIDDEN.test(svg)) return 'SVG contains scripts, external resources, or declarations that are not allowed for preview.'
  for (const match of svg.matchAll(/(?:href|xlink:href)\s*=\s*(["'])(.*?)\1/gi)) {
    const value = match[2].trim()
    if (value && !value.startsWith('#')) return 'SVG references external content; remove external links before previewing.'
  }
  for (const match of svg.matchAll(/url\(\s*(?:(["'])(.*?)\1|([^)]*?))\s*\)/gi)) {
    const value = (match[2] ?? match[3] ?? '').trim()
    if (value && !value.startsWith('#')) return 'SVG references external content; remove external links before previewing.'
  }
  return undefined
}

function registerSvgCapableReadImage(ctx) {
  const original = ctx.tools.get('read_image')
  if (!original) return
  const replacement = {
    ...original,
    description: 'Read PNG/JPEG/WebP/GIF images or safely render an SVG file as a PNG preview. Returns the actual image to the model.',
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      if (typeof args?.file_path !== 'string' || !args.file_path.toLowerCase().endsWith('.svg')) {
        return original.execute(args, exec)
      }
      if (!args.file_path.trim()) throw new Error('file_path must be a non-empty string')
      const attachments = ctx.get('attachments')
      if (!attachments) throw new Error(`cannot read "${args.file_path}" as an image: no attachment service is mounted`)
      const routed = exec.agent?.session.requestHeader()?.config
      const provider = routed?.provider ?? exec.agent?.options.provider
      const model = routed?.model ?? exec.agent?.options.model
      const llm = ctx.get('llm')
      if (provider === undefined || model === undefined || !llm) throw new Error(`cannot read "${args.file_path}" as an image: the current model route could not be resolved`)
      const active = await llm.resolveModelInfo(provider, model, exec.signal)
      if (!active.inputModalities?.includes('image')) throw new Error(`cannot read "${args.file_path}" as an image: model "${model}" does not declare image input; switch to an image-capable model to read images`)

      const cwd = exec.agent === undefined ? undefined : await ctx.workingDirectory.ensure(exec.agent, exec.signal)
      const target = await ctx.fs.resolve(args.file_path, { ...(cwd ? { cwd } : {}), signal: exec.signal })
      const fileInfo = await ctx.fs.stat(target, exec.signal)
      if (!fileInfo) throw new Error(`cannot read "${target.displayPath}": not found`)
      if (fileInfo.type !== 'file') throw new Error(`cannot read "${target.displayPath}": not a regular file`)
      const source = await ctx.fs.readBytes(target, exec.signal, SVG_MAX_BYTES)
      const svg = Buffer.from(source).toString('utf8')
      if (!/^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(svg)) throw new Error(`cannot read "${target.displayPath}": the file is not a valid SVG document`)
      const unsafe = svgUnsafeReason(svg)
      if (unsafe) throw new Error(`cannot preview "${target.displayPath}": ${unsafe}`)

      const maxDimension = Math.max(1, attachments.imageLimits.maxImageDimension)
      const maxPixels = Math.max(1, attachments.imageLimits.maxImagePixels)
      const { data, info } = await sharp(Buffer.from(svg), { limitInputPixels: maxPixels, density: 96 })
        .resize({ width: maxDimension, height: maxDimension, fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer({ resolveWithObject: true })
      const image = await attachments.saveImage({ data, mediaType: 'image/png', name: `${basename(target.displayPath).replace(/\.svg$/i, '')}.png` })
      ctx.emit?.('fs/observed', target, { kind: 'present', version: fileInfo.version }, exec)
      return {
        path: ctx.fs.processPath(target),
        image: {
          attachmentId: image.attachmentId,
          mediaType: image.mediaType,
          bytes: image.bytes,
          width: image.width || info.width,
          height: image.height || info.height,
          ...(image.name ? { name: image.name } : {}),
          ...(image.originalDimensions ? { originalDimensions: image.originalDimensions } : {}),
        },
      }
    },
  }
  ctx.tools.register(replacement)
}

const promptSections = [
  { name: 'studio:dsh-codex:identity', order: 0, text: 'You are Codex, an AI coding agent working directly in the user\'s workspace.' },
  { name: 'studio:dsh-codex:rules', order: 750, text: CODEX_WORKING_RULES },
  { name: 'studio:dsh-codex:tool:pwsh', order: 1000, text: toolGuidance.pwsh },
  { name: 'studio:dsh-codex:tool:read', order: 1100, text: toolGuidance.read },
  { name: 'studio:dsh-codex:tool:read_image', order: 1100, text: toolGuidance.read_image },
  { name: 'studio:dsh-codex:tool:image_generate', order: 1100, text: toolGuidance.image_generate },
  { name: 'studio:dsh-codex:tool:write', order: 1100, text: toolGuidance.write },
  { name: 'studio:dsh-codex:tool:edit', order: 1100, text: toolGuidance.edit },
  { name: 'studio:dsh-codex:tool:glob', order: 1200, text: toolGuidance.glob },
  { name: 'studio:dsh-codex:tool:grep', order: 1200, text: toolGuidance.grep },
  { name: 'studio:dsh-codex:tool:apply_patch', order: 1300, text: toolGuidance.apply_patch },
  { name: 'studio:dsh-codex:tool:list_dir', order: 1200, text: toolGuidance.list_dir },
]

function registerListDir(ctx) {
  if (ctx.tools.get('list_dir')) return
  ctx.tools.register({
    name: 'list_dir',
    description: 'List the direct entries of a directory, like the Codex directory listing tool. Does not read file contents.',
    parameters: {
      path: { type: 'string', description: 'Directory to list. Relative paths resolve against the current session workspace; defaults to the workspace root.' },
    },
    output: {
      schema: {
        type: 'object', additionalProperties: false,
        required: ['path', 'entries', 'truncated'],
        properties: {
          path: { type: 'string' },
          entries: {
            type: 'array',
            items: {
              type: 'object', additionalProperties: false,
              required: ['name', 'type'],
              properties: {
                name: { type: 'string' },
                type: { type: 'string', enum: ['file', 'directory', 'other'] },
                size: { type: 'number' },
              },
            },
          },
          truncated: { type: 'boolean' },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `${value.path}${value.entries.length ? `\n${value.entries.map(entry => `${entry.type === 'directory' ? '[dir] ' : ''}${entry.name}`).join('\n')}` : '\n(empty directory)'}${value.truncated ? '\n[listing truncated at 500 entries]' : ''}`,
      }],
    },
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const cwd = exec.agent === undefined ? undefined : await ctx.workingDirectory.ensure(exec.agent, exec.signal)
      const target = await ctx.fs.resolve(args.path || '.', { ...cwd ? { cwd } : {}, signal: exec.signal })
      const listed = await ctx.fs.listDir(target, exec.signal)
      const entries = listed.slice(0, 500).map(({ name, type, size }) => ({
        name, type, ...(size === undefined ? {} : { size }),
      }))
      return { path: target.displayPath, entries, truncated: listed.length > entries.length }
    },
    presentCall: args => ({ card: 'generic', title: `List directory ${args.path || '.'}`, kind: 'read', rawInput: args.path || '.' }),
  })
}

/** Replace only model-facing descriptions; retain the upstream schemas and executors. */
export function apply(ctx) {
  const tools = ctx.tools
  const prompt = ctx.systemPrompt

  registerListDir(ctx)
  registerSvgCapableReadImage(ctx)

  for (const section of promptSections) prompt.section(section)

  // DSH's section registry rejects duplicate names within one scope. Replace
  // the built-in Bash guidance at assembly time instead of registering a
  // second `tool:bash` section beside it.
  ctx.on('system-prompt/assemble', async (_assembly, _context, next) => {
    const assembled = await next()
    let replaced = false
    const sections = assembled.sections.map(section => {
      if (section.name === 'tool:goal') {
        replaced = true
        return { ...section, text: GOAL_GUIDANCE }
      }
      if (section.name === 'tool:bash') {
        replaced = true
        return { ...section, text: toolGuidance.bash }
      }
      return section
    })
    return replaced ? { ...assembled, sections } : assembled
  })

  for (const [name, guidance] of Object.entries(toolGuidance)) {
    // Preserve DSH's original Bash registration, executor, job scope, schema,
    // presentation and concurrency policy. Codex behavior is expressed in the
    // assembled prompt, not by shadow-registering a copied Bash definition.
    if (name === 'bash' || name === 'read_image' || name === 'list_dir' || name === 'image_generate') continue
    const original = tools.get(name)
    if (!original) continue
    if (name === 'grep') {
      tools.register({
        ...original,
        description: guidance,
        ...(PARALLEL_READ_TOOLS.has(name) ? { isConcurrencySafe: () => true } : {}),
        async execute(args, exec) {
          try {
            return await original.execute(args, exec)
          } catch (error) {
            const message = error instanceof Error ? `${error.message}\n${String(error.cause ?? '')}` : String(error)
            if (!/(?:pattern rejected by ripgrep|regex parse error|error parsing regex|unclosed group)/i.test(message)
              || !args || typeof args !== 'object' || typeof args.pattern !== 'string') throw error

            // A common model mistake is passing a source-code snippet as a regex.
            // Retry it literally so punctuation cannot turn a useful search into a hard failure.
            const literalPattern = args.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            return original.execute({ ...args, pattern: literalPattern }, exec)
          }
        },
      })
    } else if (name === 'read') {
      tools.register({
        ...original,
        description: guidance,
        ...(PARALLEL_READ_TOOLS.has(name) ? { isConcurrencySafe: () => true } : {}),
        async execute(args, exec) {
          try {
            return await original.execute(args, exec)
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            const match = message.match(/offset (\d+) is out of range for .+ \((\d+) lines?\)/i)
            if (!match || !args || typeof args !== 'object') throw error
            const requestedOffset = Number(match[1])
            const totalLines = Number(match[2])
            if (!Number.isSafeInteger(requestedOffset) || !Number.isSafeInteger(totalLines) || totalLines < 1) throw error
            return original.execute({ ...args, offset: Math.min(requestedOffset, totalLines) }, exec)
          }
        },
      })
    } else {
      tools.register({
        ...original,
        description: guidance,
        ...(PARALLEL_READ_TOOLS.has(name) ? { isConcurrencySafe: () => true } : {}),
      })
    }
  }
}

export default { name, inject, apply }
