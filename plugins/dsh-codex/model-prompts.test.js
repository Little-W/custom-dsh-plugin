import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, writeFile, rm, readFile, utimes } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { createTemplateCatalog, resolveRoute, apply } from './model-prompts.js'
import { render, renderToolDefinitions, compose, transform, adaptCodexTemplate } from './prompt-renderer.js'
import { GLOBAL_FILE_EDIT_RULES, globalToolGuidance } from './global-file-edit.js'

async function fixture(t) {
  const directory = await mkdtemp(path.join(tmpdir(), 'dsh-model-prompts-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const cachePath = path.join(directory, 'cache.json')
  const bundledPath = path.join(directory, 'bundled.json')
  const genericPath = path.join(directory, 'generic.md')
  await writeFile(bundledPath, JSON.stringify({ models: { 'gpt-one': 'one', 'gpt-two': 'two' }, templates: { one: 'Bundled ONE', two: 'Bundled TWO' } }))
  await writeFile(genericPath, 'Generic agent\n\n${DSH_TOOL_GUIDANCE}')
  return { directory, cachePath, bundledPath, genericPath }
}

test('exact OpenAI templates prefer live metadata and do not substitute another model for a missing one', async t => {
  const files = await fixture(t)
  await writeFile(files.cachePath, JSON.stringify({ models: [{ slug: 'gpt-one', model_messages: { instructions_template: 'LIVE ONE' } }, { slug: 'chatgpt-new', model_messages: { instructions_template: 'LIVE NEW' } }] }))
  const catalog = createTemplateCatalog(files)
  assert.equal((await catalog.select({ provider: 'opencode:project:openai', model: 'openai/gpt-one' })).text, 'LIVE ONE')
  assert.equal((await catalog.select({ provider: 'openai', model: 'gpt-two' })).text, 'Bundled TWO')
  assert.equal((await catalog.select({ provider: 'custom-route', model: 'chatgpt-new' })).text, 'LIVE NEW')
  const missing = await catalog.select({ provider: 'openai', model: 'gpt-one-new-version' })
  assert.equal(missing.source, 'generic-missing-template')
  assert.equal(missing.codexTemplate, false)
  assert.match(missing.text, /^Generic agent/)
  assert.equal((await catalog.select({ provider: 'opencode:anthropic', model: 'claude-model' })).source, 'generic')
})

test('cache updates, corruption, explicit aliases, and cancellation are handled without leaking another model template', async t => {
  const files = await fixture(t)
  const save = async text => writeFile(files.cachePath, JSON.stringify({ models: [{ slug: 'gpt-one', model_messages: { instructions_template: text } }] }))
  await save('first')
  const catalog = createTemplateCatalog({ ...files, aliases: { 'private-model-alias': 'gpt-one' } })
  const route = { provider: 'custom', model: 'private-model-alias' }
  assert.equal((await catalog.select(route)).text, 'first')
  await save('updated template')
  await utimes(files.cachePath, new Date(), new Date(Date.now() + 2000))
  assert.equal((await catalog.select(route)).text, 'updated template')
  await writeFile(files.cachePath, '{invalid json')
  assert.equal((await catalog.select(route)).source, 'bundled-codex')
  const controller = new AbortController()
  controller.abort(new Error('cancelled selection'))
  await assert.rejects(catalog.select(route, controller.signal), /cancelled selection/)
})

test('captured step route wins over stale headers and options', () => {
  const context = { modelSelection: { provider: 'new-provider', model: 'gpt-two' }, agent: { options: { provider: 'old-provider', model: 'gpt-one' }, session: { requestHeader: () => ({ config: { provider: 'older-provider', model: 'gpt-one' } }) } } }
  assert.deepEqual(resolveRoute(context, { variables: { provider: 'stale', model: 'stale' } }), context.modelSelection)
  assert.deepEqual(resolveRoute({}, { variables: { provider: 'deepseek', model: 'deepseek-flash' } }), { provider: 'deepseek', model: 'deepseek-flash' })
})

test('rendering adapts platform-specific tool paragraphs to actual DSH schemas and PTC', () => {
  const tools = [{ name: 'bash', parameters: { command: { type: 'string' }, workdir: { type: 'string' } } }, { name: 'ask_user_question', parameters: {} }]
  const template = '# Personality\nKeep this voice.\n\nCall functions.request_user_input_async for a question.\n\nBatch in functions.exec using Promise.allSettled.\n\n# Using skills\nCall skills.list in the cloud.\n\n# Other\nPreserve this section.'
  const text = render(template, { tools, ptc: true, codex: true })
  assert.match(text, /Keep this voice/)
  assert.match(text, /Preserve this section/)
  assert.match(text, /Only run_code is directly callable/)
  assert.match(text, /ask_user_question through the supplied run_code SDK/)
  assert.match(text, /arguments: command, workdir/)
  assert.doesNotMatch(text, /Call functions\.request_user_input_async|Batch in functions\.exec|Call skills\.list/)
  assert.doesNotMatch(text, /file patches: apply_patch/)
  const placeholders = render('${OPENCODE_TOOL_GUIDANCE}\n${DSH_TOOL_GUIDANCE}', { tools })
  assert.equal(placeholders.match(/## DSH execution contract/g).length, 1)
  assert.match(adaptCodexTemplate('Preserve unrelated instructions.', { tools }), /^Preserve unrelated instructions\./)
  const jobs = render('Use write_stdin to send input.\n\nUse apply_patch.\n\nUse update_plan.\n\nUse view_image.', { codex: true, tools: [{ name: 'job_output', parameters: {} }] })
  assert.match(jobs, /a job-output reader is not an interactive stdin channel/)
  assert.doesNotMatch(jobs, /Use write_stdin|Use apply_patch\.\n\nUse update_plan|Use update_plan|Use view_image/)
})

test('all provider templates use only the admitted DSH tools and one GUI-compatible file-link format', () => {
  const template = [
    'Use [app.py](/workspace/app.py:12) for source references.',
    '* Clickable file links should look like [app.py](/abs/path/app.py:12), with optional line number inside the target.',
    '* Do not use URIs like file://, vscode://, or https:// for file links.',
    'The link may use a relative path and #L24-L30.',
    'Use edit for the complete change.',
    'Call spawn_teammate, list_agents, send_message, create_goal, update_goal, plugin_preview, and list_mcp_resources.',
    'Use functions.exec and functions.request_user_input_async for tool calls.',
  ].join('\n\n')
  const tools = [
    { name: 'bash', description: 'DSH shell', parameters: { command: { type: 'string' } } },
    { name: 'read', description: 'DSH read', parameters: { file_path: { type: 'string' } } },
    { name: 'edit', description: 'DSH edit', parameters: { file_path: { type: 'string' }, old_string: { type: 'string' }, new_string: { type: 'string' } } },
    { name: 'grep', description: 'DSH grep', parameters: { pattern: { type: 'string' } } },
    { name: 'glob', description: 'DSH glob', parameters: { pattern: { type: 'string' } } },
    { name: 'custom_preview', description: 'DSH preview', parameters: {} },
  ]
  const text = render(template, { tools, codex: false })
  assert.match(text, /confirmed absolute filesystem path.*#L24/)
  assert.doesNotMatch(text, /\/workspace\/app\.py:12|#L24-L30|Clickable file links should|file:\/\/|Use edit for the complete change|"name": "edit"/)
  assert.match(text, /Use apply_patch as the only file-mutation tool/)
  assert.doesNotMatch(text, /spawn_teammate|list_agents|create_goal|plugin_preview|list_mcp_resources|functions\.exec|functions\.request_user_input_async/)
  const definitions = JSON.parse(text.match(/```json\n([\s\S]*?)\n```/)[1])
  assert.deepEqual(definitions.map(tool => tool.name), tools.map(tool => tool.name).filter(name => !['edit', 'write'].includes(name)))
  assert.match(text, /custom_preview/)
  assert.match(text, /Use DSH read, glob, and grep when their bounded schemas fit the task/)
  assert.match(text, /"name": "grep"/)
  assert.match(text, /"name": "glob"/)
})

test('global file-edit guidance uses apply_patch exclusively in every mode', () => {
  assert.match(GLOBAL_FILE_EDIT_RULES, /apply_patch for every file mutation/)
  assert.match(GLOBAL_FILE_EDIT_RULES, /Patch rejected before any change.*no hunk was applied/s)
  assert.match(GLOBAL_FILE_EDIT_RULES, /retry once/)
  assert.match(GLOBAL_FILE_EDIT_RULES, /patch stopped after operations began.*may already have completed/s)
  assert.match(globalToolGuidance('edit', false), /apply_patch/)
  assert.match(globalToolGuidance('write', false), /Do not call write/)
  assert.match(globalToolGuidance('edit', true), /apply_patch/)
  assert.match(globalToolGuidance('apply_patch', true), /native executor/)
  assert.match(globalToolGuidance('apply_patch', true), /never resend the identical patch/)
})

test('tool definitions retain native descriptions and exact argument schemas instead of Codex parameter names', () => {
  const tools = [{ name: 'bash', description: 'Original native Bash contract.', parameters: { command: { type: 'string', required: true }, timeoutMs: { type: 'number' }, sandbox_permissions: { type: 'string', enum: ['read-only', 'workspace-write'] } } }, { name: 'apply_patch', description: 'Original native patch contract.', parameters: { patch: { type: 'string', required: true } } }]
  const definitionText = renderToolDefinitions({ tools })
  const definitions = JSON.parse(definitionText.match(/```json\n([\s\S]*?)\n```/)[1])
  assert.deepEqual(definitions, tools)
  assert.equal(Object.hasOwn(definitions[0].parameters, 'cmd'), false)
  const text = render('# Tool Guidelines\n\n## Shell commands\nUse exec_command with cmd and yield_time_ms.\n\n# Keep\nKeep this behavior.', { tools, codex: true })
  assert.doesNotMatch(text, /Use exec_command with cmd and yield_time_ms/)
  assert.match(text, /Original native Bash contract/)
  assert.match(text, /Keep this behavior/)
  const ptc = renderToolDefinitions({ tools, ptc: true })
  assert.match(ptc, /not additional direct-call declarations/)
  assert.deepEqual(JSON.parse(ptc.match(/```json\n([\s\S]*?)\n```/)[1]), tools)
})

test('override and append preserve tools, runtime contexts, specialized roles and policy sections', () => {
  const assembly = Object.freeze({ sections: Object.freeze([
    Object.freeze({ name: 'harness:identity', text: 'Original base' }),
    Object.freeze({ name: 'task:reviewer', text: 'Review only' }),
    Object.freeze({ name: 'plan:policy', text: 'Read-only plan mode' }),
  ]), tools: Object.freeze([{ name: 'read' }]), contexts: Object.freeze([{ name: 'sandbox:policy', text: 'read-only' }]), variables: Object.freeze({ model: 'gpt-one' }) })
  const replacement = transform(assembly, { text: 'New base', replaceNames: ['harness:identity'] })
  assert.deepEqual(replacement.sections.map(section => section.text), ['New base', 'Review only', 'Read-only plan mode'])
  for (const key of ['tools', 'contexts', 'variables']) assert.equal(replacement[key], assembly[key])
  const appended = transform(assembly, { text: 'Extra', mode: 'append' })
  assert.deepEqual(appended.sections.map(section => section.text), ['Original base', 'Review only', 'Read-only plan mode', 'Extra'])
  assert.equal(transform(appended, { text: 'Extra', mode: 'append' }).sections.length, 4)
  assert.equal(compose('Old', 'New', 'append'), 'Old\n\nNew')
  assert.equal(compose('Old', 'New', 'replace'), 'New')
  assert.throws(() => compose('Old', 'New', 'unknown'), /Unsupported/)
})

test('global middleware reevaluates model switches and the admitted scoped tools on every assembly', async t => {
  const files = await fixture(t)
  await writeFile(files.cachePath, JSON.stringify({ models: [{ slug: 'gpt-one', model_messages: { instructions_template: 'OPENAI EXACT ONE' } }, { slug: 'gpt-two', model_messages: { instructions_template: 'OPENAI EXACT TWO' } }] }))
  let middleware
  const scoped = {}
  const admitted = {}
  const ctx = { provide() {}, studioPromptRenderer: { render, transform }, tools: { schemas(scope, toolSet) { assert.equal(scope, scoped); assert.equal(toolSet, admitted); return [{ name: 'bash', parameters: { command: { type: 'string' } } }] } }, on(_event, listener) { middleware = listener } }
  apply(ctx, { codexCachePath: files.cachePath })
  const original = { sections: [{ name: 'harness:identity', text: 'DSH old base' }, { name: 'deployment:persona-prefix', text: 'You are a coding agent powered by the {{model}} model.' }, { name: 'tools:ptc-only', text: 'Only run_code is callable' }, { name: 'tool:goal', text: 'Native goal authority' }], contexts: [{ name: 'sandbox:policy', text: 'read-only' }], variables: {} }
  for (const model of ['gpt-one', 'gpt-two', 'non-openai']) {
    const result = await middleware(original, { scope: scoped, toolSet: admitted, modelSelection: { provider: model === 'non-openai' ? 'deepseek' : 'opencode:openai', model } }, async () => original)
    const base = result.sections.find(section => section.name === 'studio:dsh-codex:model-base')
    assert.match(base.text, model === 'gpt-one' ? /OPENAI EXACT ONE/ : model === 'gpt-two' ? /OPENAI EXACT TWO/ : /You are a capable AI agent/)
    assert.match(base.text, /Only run_code is directly callable/)
    assert.equal(result.sections.some(section => section.name === 'harness:identity'), false)
    assert.equal(result.sections.some(section => section.name === 'deployment:persona-prefix'), false)
    assert.equal(result.contexts, original.contexts)
    assert.equal(result.sections.find(section => section.name === 'tool:goal').text, 'Native goal authority')
  }
})

test('bundled templates retain exact exported contents behind their hashes', async () => {
  const bundled = JSON.parse(await readFile(new URL('./prompts/openai-models.json', import.meta.url), 'utf8'))
  for (const [model, key] of Object.entries(bundled.models)) {
    const text = bundled.templates[key]
    assert.equal(typeof text, 'string', model)
    assert.equal(createHash('sha256').update(text).digest('hex'), key, model)
  }
  assert.ok(Object.keys(bundled.models).length >= 10)
})
