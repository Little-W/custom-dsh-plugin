import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { apply, CODEX_WORKING_RULES, inject } from './index.js'
import { apply as applyGlobalFileEdit, GLOBAL_FILE_EDIT_RULES, hideLegacyMutationSchemas } from './global-file-edit.js'

test('Codex guidance retains DSH bounded search and routes text mutations through apply_patch', () => {
  assert.match(CODEX_WORKING_RULES, /native `bash` tool as the primary interface/)
  assert.match(CODEX_WORKING_RULES, /Do not repeat the same failed query/)
  assert.match(CODEX_WORKING_RULES, /dedicated `read`, `glob`, and `grep`/)
  assert.match(CODEX_WORKING_RULES, /shell `rg` and `rg --files`/)
  assert.match(CODEX_WORKING_RULES, /do not use `edit` or `write`/)
  assert.match(CODEX_WORKING_RULES, /native `read_image` tool/)
  assert.match(CODEX_WORKING_RULES, /built-in `image_generate` tool/)
  assert.match(CODEX_WORKING_RULES, /renders a safe PNG preview/)
  assert.match(CODEX_WORKING_RULES, /Parallelize independent discovery calls/)
  assert.match(CODEX_WORKING_RULES, /PTC and `run_code` remain available/)
  assert.doesNotMatch(CODEX_WORKING_RULES, /Never use `run_code`|do not submit it to `run_code`/)
  assert.match(CODEX_WORKING_RULES, /one short note per meaningful milestone/)
  assert.match(CODEX_WORKING_RULES, /Never derive a sibling filename/)
  assert.match(CODEX_WORKING_RULES, /After context compaction, rediscover paths/)
  assert.match(CODEX_WORKING_RULES, /zero total lines means an existing empty file/)
  assert.match(CODEX_WORKING_RULES, /Never batch speculative file reads/)
  assert.match(CODEX_WORKING_RULES, /form one complete change plan before editing/)
  assert.match(CODEX_WORKING_RULES, /apply them together in one `apply_patch` call/)
  assert.match(CODEX_WORKING_RULES, /Never make a series of speculative one-line edits/)
  assert.match(CODEX_WORKING_RULES, /inspect the diff and run the relevant checks/)
  assert.match(CODEX_WORKING_RULES, /do not require a prior read-tool call/)
  assert.match(CODEX_WORKING_RULES, /metadata\/version/)
})

test('invalid grep regex retries once as a literal query', async () => {
  let calls = 0
  const grep = {
    name: 'grep', description: '', parameters: {}, output: { schema: { type: 'object' } },
    async execute(args) {
      calls += 1
      if (calls === 1) throw new Error('grep pattern rejected by ripgrep: rg: regex parse error: unclosed group')
      return { pattern: args.pattern }
    },
  }
  const registered = new Map()
  apply({
    tools: { get: name => name === 'grep' ? grep : undefined, register: tool => registered.set(tool.name, tool) },
    systemPrompt: { section: () => () => {} },
    on: () => () => {},
  })
  const result = await registered.get('grep').execute({ pattern: 'if (selectedTab != CHAT)' }, {})
  assert.equal(calls, 2)
  assert.equal(result.pattern, 'if \\(selectedTab != CHAT\\)')
})

test('unsupported grep look-around returns shell rg PCRE2 guidance without retrying', async () => {
  let calls = 0
  const grep = {
    name: 'grep', description: '', parameters: {}, output: { schema: { type: 'object' } },
    async execute() {
      calls += 1
      throw new Error('regex parse error: look-around, including look-ahead and look-behind, is not supported')
    },
  }
  const registered = new Map()
  apply({
    tools: { get: name => name === 'grep' ? grep : undefined, register: tool => registered.set(tool.name, tool) },
    systemPrompt: { section: () => () => {} },
    on: () => () => {},
  })
  await assert.rejects(registered.get('grep').execute({ pattern: 'className="eda-actions(?![^\"]*eda-wrap)' }, {}), /does not support look-around or backreferences[\s\S]*rg --pcre2/)
  assert.equal(calls, 1)
})

test('edit refreshes DSH observation from metadata without calling the read tool', async () => {
  const registered = new Map()
  const reads = []
  const editCalls = []
  let observed = false
  const metadata = []
  const exec = { agent: { session: {} }, callId: 'call-1', signal: new AbortController().signal }
  const read = {
    name: 'read', description: '', parameters: {}, output: {},
    async execute(args, actualExec) {
      reads.push(args.file_path)
      return { path: args.file_path }
    },
  }
  const edit = {
    name: 'edit', description: '', parameters: {}, output: {},
    async execute(args, actualExec) {
      editCalls.push(args.file_path)
      assert.equal(actualExec, exec)
      assert.equal(args.sandbox_permissions, 'workspace-write')
      if (!observed) throw Object.assign(new Error('file has not been read'), { code: 'FS_NOT_OBSERVED' })
      return { changed: args.file_path }
    },
  }
  apply({
    tools: { get: name => name === 'edit' ? edit : name === 'read' ? read : undefined, register: tool => registered.set(tool.name, tool) },
    systemPrompt: { section: () => () => {} },
    on: () => () => {},
    fs: {
      async resolve(filePath, opts) { metadata.push(['resolve', filePath, opts]); return { displayPath: filePath } },
      async stat(target) { metadata.push(['stat', target.displayPath]); return { type: 'file', version: 'v1' } },
    },
    workingDirectory: { async ensure(agent) { assert.equal(agent, exec.agent); return '/workspace' } },
    emit(event, target, observation, actor) {
      assert.equal(event, 'fs/observed')
      assert.equal(target.displayPath, '/workspace/file.kt')
      assert.deepEqual(observation, { kind: 'present', version: 'v1' })
      assert.equal(actor, exec)
      observed = true
    },
  })
  const result = await registered.get('edit').execute({ file_path: '/workspace/file.kt', old_string: 'old', new_string: 'new', sandbox_permissions: 'workspace-write' }, exec)
  assert.deepEqual(result, { changed: '/workspace/file.kt' })
  assert.deepEqual(reads, [])
  assert.deepEqual(metadata.map(call => call.slice(0, 2)), [['resolve', '/workspace/file.kt'], ['stat', '/workspace/file.kt']])
  assert.deepEqual(editCalls, ['/workspace/file.kt'])
})

test('apply_patch seeds update/delete metadata once and preserves native execution', async () => {
  const registered = new Map()
  const reads = []
  const observed = []
  let patchCalls = 0
  const patchText = [
    '*** Begin Patch',
    '*** Update File: /workspace/first.kt',
    '@@',
    '-before',
    '+after',
    '*** Delete File: /workspace/old.kt',
    '*** Add File: /workspace/new.kt',
    '+new content',
    '*** End Patch',
  ].join('\n')
  const read = {
    name: 'read', description: '', parameters: {}, output: {},
    async execute(args) { reads.push(args.file_path); return { path: args.file_path } },
  }
  const applyPatch = {
    name: 'apply_patch', description: '', parameters: {}, output: {},
    async execute(args, exec) {
      patchCalls += 1
      assert.equal(exec.signal, undefined)
      assert.equal(observed.length, 3)
      assert.equal(args.patch, patchText)
      return { applied: true }
    },
  }
  apply({
    tools: { get: name => name === 'apply_patch' ? applyPatch : name === 'read' ? read : undefined, register: tool => registered.set(tool.name, tool) },
    systemPrompt: { section: () => () => {} },
    on: () => () => {},
    fs: {
      async resolve(filePath) { return { displayPath: filePath } },
      async stat(target) {
        if (target.displayPath.endsWith('/new.kt')) return undefined
        return { type: 'file', version: `v:${target.displayPath}` }
      },
    },
    emit(event, target, observation) { observed.push([event, target.displayPath, observation]) },
  })
  const result = await applyPatch.execute({ patch: patchText }, {})
  assert.deepEqual(result, { applied: true })
  assert.deepEqual(reads, [])
  assert.deepEqual(observed, [
    ['fs/observed', '/workspace/first.kt', { kind: 'present', version: 'v:/workspace/first.kt' }],
    ['fs/observed', '/workspace/old.kt', { kind: 'present', version: 'v:/workspace/old.kt' }],
    ['fs/observed', '/workspace/new.kt', { kind: 'absent' }],
  ])
  assert.equal(patchCalls, 1)
})

test('native apply_patch is wrapped in place without duplicate registration', async () => {
  const metadata = []
  const exec = { agent: { session: {} }, signal: new AbortController().signal }
  const native = {
    name: 'apply_patch', description: 'native patch tool', parameters: {}, output: {},
    async execute(args, actualExec) { assert.equal(actualExec, exec); return { applied: args.patch } },
  }
  const tools = {
    get(name) { return name === 'apply_patch' ? native : undefined },
    register() { throw new Error('duplicate tool registration') },
    schemas() { return [native] },
  }
  applyGlobalFileEdit({
    tools,
    systemPrompt: { section: () => () => {} },
    on: () => () => {},
    fs: {
      async resolve(filePath, options) { metadata.push(['resolve', filePath, options.cwd]); return { displayPath: filePath } },
      async stat(target) { metadata.push(['stat', target.displayPath]); return { version: 'v1' } },
    },
    workingDirectory: { async ensure() { return '/workspace' } },
    emit(event, target, observation, actor) { metadata.push([event, target.displayPath, observation, actor === exec]) },
  })
  const result = await native.execute({ patch: '*** Begin Patch\n*** Update File: /workspace/a.js\n@@\n-old\n+new\n*** End Patch' }, exec)
  assert.equal(result.applied.includes('Update File: /workspace/a.js'), true)
  assert.deepEqual(metadata, [
    ['resolve', '/workspace/a.js', '/workspace'],
    ['stat', '/workspace/a.js'],
    ['fs/observed', '/workspace/a.js', { kind: 'present', version: 'v1' }, true],
  ])
  assert.equal(native.description.includes('complete known change'), true)
})

test('global editing component applies one-patch guidance and native metadata seeding outside Codex preset', async () => {
  const registered = new Map()
  const sections = new Map()
  const metadata = []
  let assemble
  const exec = { agent: { session: {} }, signal: new AbortController().signal }
  const originals = new Map(['edit', 'write', 'apply_patch'].map(name => [name, {
    name, description: `native ${name}`, parameters: { type: 'object' }, output: { schema: { type: 'object' } },
    async execute(args, actualExec) { assert.equal(actualExec, exec); return { name, args } },
  }]))
  applyGlobalFileEdit({
    tools: { get: name => originals.get(name), register: tool => registered.set(tool.name, tool) },
    systemPrompt: { section: section => sections.set(section.name, section) },
    on: (name, listener) => { assert.equal(name, 'system-prompt/assemble'); assemble = listener; return () => {} },
    fs: {
      async resolve(filePath, options) { return { displayPath: filePath, options } },
      async stat(target) { return { type: 'file', version: `v:${target.displayPath}` } },
    },
    workingDirectory: { async ensure() { return '/workspace' } },
    emit(event, target, observation, actor) { metadata.push([event, target.displayPath, observation, actor]) },
  })

  assert.match(GLOBAL_FILE_EDIT_RULES, /all session modes/)
  assert.match(GLOBAL_FILE_EDIT_RULES, /Do not use separate text-edit or file-write tools/)
  assert.match(GLOBAL_FILE_EDIT_RULES, /one apply_patch call/)
  assert.ok(sections.has('studio:dsh-codex:global-file-edit'))
  const originalAssembly = { sections: [
    { name: 'tool:edit', text: 'native edit guidance' },
    { name: 'tool:write', text: 'native write guidance' },
    { name: 'tool:apply_patch', text: 'native patch guidance' },
    { name: 'other', text: 'unchanged' },
  ] }
  const assembled = await assemble(originalAssembly, {}, async () => originalAssembly)
  assert.match(assembled.sections[0].text, /Do not call edit for file mutations/)
  assert.match(assembled.sections[2].text, /one patch call/)
  assert.equal(assembled.sections[3], originalAssembly.sections[3])

  const patch = '*** Begin Patch\n*** Update File: /workspace/A.kt\n@@\n-a\n+b\n*** Update File: /workspace/B.kt\n@@\n-c\n+d\n*** End Patch'
  const result = await originals.get('apply_patch').execute({ patch }, exec)
  assert.deepEqual(result, { name: 'apply_patch', args: { patch } })
  assert.deepEqual(metadata.map(row => row.slice(0, 3)), [
    ['fs/observed', '/workspace/A.kt', { kind: 'present', version: 'v:/workspace/A.kt' }],
    ['fs/observed', '/workspace/B.kt', { kind: 'present', version: 'v:/workspace/B.kt' }],
  ])
})

test('Codex bundle installs global edit policy separately from the Codex preset', async () => {
  const patch = await readFile(new URL('./cordis.patch.yml', import.meta.url), 'utf8')
  assert.match(patch, /id: studio-dsh-codex-global-apply-patch\s+name: '@deepseek-ai\/dsh-tool-fs'\s+config:\s+read: false\s+readImage: false\s+write: false\s+edit: false\s+applyPatch: true/)
  assert.match(patch, /id: studio-dsh-codex-global-file-edit\s+name: '@agent-studio\/plugin-dsh-codex\/global-edit'/)
  assert.match(patch, /id: preset-codex/)
  assert.match(patch, /edit: false\s+write: false\s+applyPatch: true/)
})

test('global file-edit plugin removes edit/write from model-facing schemas while retaining read/search/patch', () => {
  const calls = []
  const tools = {
    schemas(scope, toolSet) {
      calls.push([scope, toolSet, this === tools])
      return ['read', 'glob', 'grep', 'edit', 'write', 'apply_patch'].map(name => ({ name }))
    },
  }
  const registered = new Map()
  tools.get = name => name === 'apply_patch' ? { name } : undefined
  tools.register = tool => registered.set(tool.name, tool)
  applyGlobalFileEdit({
    tools,
    systemPrompt: { section: () => () => {} },
    on: () => () => {},
  })
  const exposed = tools.schemas('workspace', ['allowed'])
  assert.deepEqual(exposed, [{ name: 'read' }, { name: 'glob' }, { name: 'grep' }, { name: 'apply_patch' }])
  assert.deepEqual(calls, [['workspace', ['allowed'], true]])
  assert.equal(hideLegacyMutationSchemas(tools), false, 'the registry schema filter is installed only once')
})

test('read retries an out-of-range offset at the last existing line', async () => {
  const offsets = []
  const read = {
    name: 'read', description: '', parameters: {}, output: { schema: { type: 'object' } },
    async execute(args) {
      offsets.push(args.offset)
      if (offsets.length === 1) throw new Error('offset 115 is out of range for "build.gradle.kts" (96 lines)')
      return { offset: args.offset }
    },
  }
  const registered = new Map()
  apply({
    tools: { get: name => name === 'read' ? read : undefined, register: tool => registered.set(tool.name, tool) },
    systemPrompt: { section: () => () => {} },
    on: () => () => {},
  })

  const result = await registered.get('read').execute({ file_path: 'build.gradle.kts', offset: 115 }, {})
  assert.deepEqual(offsets, [115, 96])
  assert.equal(result.offset, 96)
})

test('missing reads return bounded parent-directory evidence and do not retry the guessed path', async () => {
  let readCalls = 0
  let listedPath
  const registered = new Map()
  apply({
    tools: {
      get: name => name === 'read' ? {
        name: 'read', description: '', parameters: {}, output: { schema: { type: 'object' } },
        async execute() { readCalls += 1; throw new Error('cannot read "/workspace/app/DshWire.kt": not found') },
      } : undefined,
      register: tool => registered.set(tool.name, tool),
    },
    fs: {
      async resolve(filePath) { return { displayPath: filePath } },
      async stat() { return undefined },
      async listDir(target) { listedPath = target.displayPath; return [{ name: 'DshApiClient.kt', type: 'file' }, { name: 'DshHttpClient.kt', type: 'file' }] },
    },
    workingDirectory: { async ensure() { return '/workspace' } },
    systemPrompt: { section: () => () => {} },
    on: () => () => {},
  })

  await assert.rejects(registered.get('read').execute({ file_path: '/workspace/app/DshWire.kt' }, {
    agent: {}, signal: new AbortController().signal,
  }), error => {
    assert.match(error.message, /No file content was read/)
    assert.match(error.message, /DshApiClient\.kt/)
    assert.match(error.message, /Do not retry this inferred path/)
    return true
  })
  assert.equal(readCalls, 1)
  assert.equal(listedPath, '/workspace/app')
})

test('a confirmed zero-line file remains an empty file result, not a missing-path diagnosis', async () => {
  const empty = { path: '/workspace/empty.txt', offset: 1, lines: [], totalLines: 0 }
  const registered = new Map()
  apply({
    tools: {
      get: name => name === 'read' ? { name: 'read', description: '', parameters: {}, output: {}, async execute() { return empty } } : undefined,
      register: tool => registered.set(tool.name, tool),
    },
    systemPrompt: { section: () => () => {} },
    on: () => () => {},
  })
  const result = await registered.get('read').execute({ file_path: '/workspace/empty.txt' }, { signal: new AbortController().signal })
  assert.equal(result.totalLines, 0)
  assert.deepEqual(result.lines, [])
})

test('native read_image converts safe SVG into an attached PNG for multimodal inspection', async () => {
  const registered = new Map()
  const original = {
    name: 'read_image', description: 'native image reader', parameters: { file_path: { type: 'string' } },
    output: { schema: { type: 'object' }, render: (_args, value) => value },
    async execute() { throw new Error('native reader should not receive SVG') },
  }
  let saved
  apply({
    tools: { get: name => name === 'read_image' ? original : undefined, register: tool => registered.set(tool.name, tool) },
    systemPrompt: { section: () => () => {} },
    on: () => () => {},
    get(name) {
      if (name === 'attachments') return {
        imageLimits: { maxImageDimension: 2048, maxImagePixels: 4_000_000 },
        async saveImage(input) { saved = input; return { attachmentId: 'preview-1', mediaType: 'image/png', bytes: input.data.length, width: 24, height: 24, name: input.name } },
      }
      if (name === 'llm') return { async resolveModelInfo() { return { inputModalities: ['text', 'image'] } } }
    },
    fs: {
      async resolve(path) { return { displayPath: `/workspace/${path}` } },
      async stat() { return { type: 'file', version: 'v1' } },
      async readBytes() { return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="blue"/></svg>') },
      processPath(target) { return target.displayPath },
    },
    workingDirectory: { async ensure() { return '/workspace' } },
  })
  const result = await registered.get('read_image').execute({ file_path: 'icon.svg' }, {
    agent: { session: { requestHeader: () => ({ config: { provider: 'test', model: 'vision' } }) }, options: {} },
    signal: new AbortController().signal,
  })
  assert.equal(saved.mediaType, 'image/png')
  assert.deepEqual([...saved.data.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
  assert.equal(result.path, '/workspace/icon.svg')
  assert.equal(result.image.attachmentId, 'preview-1')
  assert.equal(result.image.mediaType, 'image/png')
})

test('SVG previews reject external resources and scripts', async () => {
  const registered = new Map()
  const original = { name: 'read_image', parameters: {}, output: {}, async execute() {} }
  apply({
    tools: { get: name => name === 'read_image' ? original : undefined, register: tool => registered.set(tool.name, tool) },
    systemPrompt: { section: () => () => {} }, on: () => () => {},
    get(name) {
      if (name === 'attachments') return { imageLimits: { maxImageDimension: 100, maxImagePixels: 10000 }, saveImage: async () => ({}) }
      if (name === 'llm') return { resolveModelInfo: async () => ({ inputModalities: ['image'] }) }
    },
    fs: { resolve: async path => ({ displayPath: `/workspace/${path}` }), stat: async () => ({ type: 'file' }), readBytes: async () => Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>') },
    workingDirectory: { ensure: async () => '/workspace' },
  })
  await assert.rejects(registered.get('read_image').execute({ file_path: 'unsafe.svg' }, {
    agent: { session: { requestHeader: () => ({ config: { provider: 'p', model: 'm' } }) }, options: {} },
    signal: new AbortController().signal,
  }), /scripts, external resources/)
})

test('plugin display metadata has an English fallback and Chinese title', async () => {
  const [en, zh] = await Promise.all(['en', 'zh'].map(async language =>
    JSON.parse(await readFile(new URL(`./locale/${language}.json`, import.meta.url), 'utf8'))))
  const pkg = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'))
  assert.equal(en.meta.title, 'Codex Coding Assistant')
  assert.equal(zh.meta.title, 'Codex 编程助手')
  assert.equal(pkg.exports['./locale/*.json'], './locale/*.json', 'DSH must be able to resolve the localized plugin title')
  assert.ok(zh.meta.description)
})

test('plugin descriptions reflect implemented features without claiming image generation', async () => {
  const [pkg, zh, en, preset] = await Promise.all([
    readFile(new URL('./package.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('./locale/zh.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('./locale/en.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('./cordis.patch.yml', import.meta.url), 'utf8'),
  ])
  for (const description of [pkg.description, zh.meta.description, en.meta.description]) {
    assert.match(description, /Codex.*编程提示|Codex-style (?:coding )?prompts/)
    assert.match(description, /并行检查|parallel inspection/)
    assert.match(description, /apply_patch 文本修改|apply_patch as the only text mutation tool/)
    assert.match(description, /shell rg|基于 rg/)
    assert.match(description, /沙箱|sandbox/)
    assert.doesNotMatch(description, /OpenAI.*图片生成|OpenAI image generation/i)
  }
  assert.match(preset, /description: Codex 风格编程提示与 shell 优先流程/)
  assert.doesNotMatch(preset, /OpenAI 图片生成/)
})

test('Codex plan mode provides the required deployment guidance', async () => {
  const patch = await readFile(new URL('./cordis.patch.yml', import.meta.url), 'utf8')
  const planSection = patch.match(/name: '@deepseek-ai\/dsh-plan-mode'\s+config:\s+section: (?:\||>-)\s*\n((?:\s+.*\n)+)/)
  assert.ok(planSection, 'Codex plan-mode declaration must include its section config')
  assert.ok(planSection[1].split('\n').some(line => line.trim().length > 0), 'plan-mode section must not be blank')
  assert.match(patch, /present a concise, ordered plan with concrete verification steps/)
  assert.doesNotMatch(patch, /preset-ptc[\s\S]*?disabled:\s*true/, 'Codex must not disable the independent PTC preset')
})

test('preset-scoped tool overrides preserve contracts and replace the single native Bash prompt section', async () => {
  const originals = new Map(['bash', 'pwsh', 'read', 'read_image', 'write', 'edit', 'glob', 'grep', 'apply_patch', 'run_code'].map(name => [name, {
    name, description: 'upstream description', parameters: { type: 'object' }, output: { schema: { type: 'object' } },
    execute: async () => ({ unchanged: true }), render: () => [],
    ...(name === 'read' || name === 'read_image' ? { isConcurrencySafe: () => true } : {}),
  }]))
  const registered = new Map(), sections = new Map()
  let assemblePrompt
  const occupiedPromptNames = new Set(['harness:identity', 'tool:bash', 'tool:pwsh', 'tool:read', 'tool:read_image', 'tool:write', 'tool:edit', 'tool:glob', 'tool:grep', 'tool:apply_patch'])
  apply({
    tools: { get: name => name === 'list_dir' ? undefined : originals.get(name), register: definition => { registered.set(definition.name, definition); return () => {} } },
    fs: {
      async resolve(path, opts) { return { displayPath: `${opts.cwd || '/workspace'}/${path}`, targetKey: path } },
      async listDir(target) {
        if (target.displayPath.endsWith('/large')) return Array.from({ length: 130 }, (_, index) => ({ name: `file-${index}.ts`, type: 'file' }))
        return [{ name: 'src', type: 'directory' }, { name: 'index.ts', type: 'file', size: 12 }]
      },
    },
    workingDirectory: { async ensure() { return '/workspace' } },
    systemPrompt: { section: section => {
      assert.ok(!occupiedPromptNames.has(section.name), `prompt section collides with DSH: ${section.name}`)
      assert.ok(!sections.has(section.name), `duplicate Codex prompt section: ${section.name}`)
      sections.set(section.name, section)
      return () => {}
    } },
    on: (name, listener) => {
      assert.equal(name, 'system-prompt/assemble')
      assemblePrompt = listener
      return () => {}
    },
  })
  assert.equal(inject.includes('fs'), true)
  assert.equal(inject.includes('workingDirectory'), true)
  assert.equal(registered.size, originals.size - 1, 'native apply_patch is wrapped in place; Codex extends the other dedicated tools')
  for (const [name, original] of originals) {
    const replacement = registered.get(name)
    if (name === 'bash') {
      assert.equal(replacement, undefined, `${name} must remain the native registration`)
      continue
    }
    if (name === 'read_image') {
      assert.equal(replacement.execute === original.execute, false, 'read_image adds SVG preview support around the native reader')
      assert.deepEqual(replacement.parameters, original.parameters)
      continue
    }
    if (name === 'apply_patch') {
      assert.equal(replacement, undefined, 'apply_patch must not be registered twice')
      assert.match(original.execute.toString(), /seedMutationObservations/, 'native apply_patch receives the metadata wrapper')
      continue
    }
    if (!['read', 'grep', 'edit', 'write', 'apply_patch'].includes(name)) assert.equal(replacement.execute, original.execute)
    assert.deepEqual(replacement.parameters, original.parameters)
    assert.notEqual(replacement.description, original.description)
  }
  assert.equal(registered.get('list_dir').name, 'list_dir')
  const listSchema = registered.get('list_dir').output.schema
  assert.deepEqual(listSchema.required, ['path', 'entries', 'truncated'])
  assert.deepEqual(listSchema.properties.entries.items.required, ['name', 'type'])
  assert.ok(!Object.hasOwn(listSchema.properties.path, 'required'))
  assert.ok(!Object.hasOwn(listSchema.properties.entries, 'required'))
  assert.equal(registered.get('list_dir').isConcurrencySafe({}), true)
  assert.equal(registered.get('grep').isConcurrencySafe({}), true)
  assert.equal(registered.get('glob').isConcurrencySafe({}), true)
  assert.equal(registered.get('read').isConcurrencySafe({}), true)
  assert.equal(registered.get('bash'), undefined, 'Codex must keep DSH native bash definition intact')
  assert.equal(typeof registered.get('read_image').execute, 'function', 'Codex extends native read_image with SVG support')
  assert.equal(originals.get('read_image').isConcurrencySafe({}), true, 'native image reads remain parallel-safe')
  assert.equal(sections.has('studio:dsh-codex:tool:run_code'), false, 'Codex must not add a prompt section that restricts run_code')
  assert.match(registered.get('run_code').description, /Use this code runner when the selected session mode provides it/)
  assert.match(sections.get('studio:dsh-codex:tool:read_image').text, /actual image input/)
  assert.match(sections.get('studio:dsh-codex:tool:image_generate').text, /use this tool if it is listed/)
  assert.match(sections.get('studio:dsh-codex:identity').text, /^You are Codex/)
  assert.ok(!sections.has('studio:dsh-codex:tool:bash'), 'Bash guidance replaces its native prompt section at assembly time, not by adding a duplicate')

  const originalAssembly = { sections: [
    { name: 'tool:bash', text: 'native Bash guidance' },
    { name: 'tool:goal', text: 'native goal guidance' },
    { name: 'tool:edit', text: 'read before editing' },
    { name: 'tool:write', text: 'read before overwriting' },
    { name: 'tool:apply_patch', text: 'read before patching' },
    { name: 'other', text: 'keep this' },
  ] }
  const assembled = await assemblePrompt(originalAssembly, {}, async () => originalAssembly)
  assert.equal(assembled.sections.filter(section => section.name === 'tool:bash').length, 1)
  assert.match(assembled.sections.find(section => section.name === 'tool:bash').text, /original DSH bash tool/)
  assert.match(assembled.sections.find(section => section.name === 'tool:goal').text, /top-level agent/)
  assert.match(assembled.sections.find(section => section.name === 'tool:goal').text, /exact active goal round/)
  for (const name of ['tool:edit', 'tool:write', 'tool:apply_patch']) {
    const text = assembled.sections.find(section => section.name === name).text
    assert.doesNotMatch(text, /read (?:a file|an existing file) before/i)
    if (name === 'tool:apply_patch') {
      assert.match(text, /prior read-tool call is not required/i)
      assert.match(text, /Patch rejected before any change.*retry once/s)
    } else if (name === 'tool:edit') {
      assert.match(text, /Do not call edit.*apply_patch as the only file-mutation tool/)
    } else {
      assert.match(text, /Do not call write.*Use apply_patch/)
    }
  }
  assert.equal(assembled.sections.find(section => section.name === 'other').text, 'keep this')

  const listed = await registered.get('list_dir').execute({ path: 'src' }, { agent: {}, signal: new AbortController().signal })
  assert.deepEqual(listed, {
    path: '/workspace/src',
    entries: [{ name: 'src', type: 'directory' }, { name: 'index.ts', type: 'file', size: 12 }],
    truncated: false,
  })
  assert.equal(registered.get('list_dir').output.render({}, listed)[0].text, '/workspace/src\n[dir] src\nindex.ts')
  const bounded = await registered.get('list_dir').execute({ path: 'large' }, { agent: {}, signal: new AbortController().signal })
  assert.equal(bounded.entries.length, 120)
  assert.equal(bounded.truncated, true)
  assert.match(registered.get('list_dir').output.render({}, bounded)[0].text, /listing truncated at 120 entries/)
})
