import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { apply, CODEX_WORKING_RULES, inject } from './index.js'

test('Codex guidance makes shell primary and prevents repeating empty searches', () => {
  assert.match(CODEX_WORKING_RULES, /native `bash` tool as the primary interface/)
  assert.match(CODEX_WORKING_RULES, /Do not repeat the same failed query/)
  assert.match(CODEX_WORKING_RULES, /native `read_image` tool/)
  assert.match(CODEX_WORKING_RULES, /built-in `image_generate` tool/)
  assert.match(CODEX_WORKING_RULES, /renders a safe PNG preview/)
  assert.match(CODEX_WORKING_RULES, /independent read-only tool calls in the same model turn/)
  assert.match(CODEX_WORKING_RULES, /PTC and `run_code` remain available/)
  assert.doesNotMatch(CODEX_WORKING_RULES, /Never use `run_code`|do not submit it to `run_code`/)
  assert.match(CODEX_WORKING_RULES, /one short note per meaningful milestone/)
})

test('invalid grep regex retries as a literal source search', async () => {
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
    assert.match(description, /并行检查|parallel inspections/)
    assert.match(description, /搜索容错|resilient search/)
    assert.doesNotMatch(description, /OpenAI.*图片生成|OpenAI image generation/i)
  }
  assert.match(preset, /description: 采用 Codex 编程提示与 shell 优先流程/)
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
      async listDir() { return [{ name: 'src', type: 'directory' }, { name: 'index.ts', type: 'file', size: 12 }] },
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
  assert.equal(registered.size, originals.size)
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
    if (name !== 'grep' && name !== 'read') assert.equal(replacement.execute, original.execute)
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

  const originalAssembly = { sections: [{ name: 'tool:bash', text: 'native Bash guidance' }, { name: 'tool:goal', text: 'native goal guidance' }, { name: 'other', text: 'keep this' }] }
  const assembled = await assemblePrompt(originalAssembly, {}, async () => originalAssembly)
  assert.equal(assembled.sections.filter(section => section.name === 'tool:bash').length, 1)
  assert.match(assembled.sections.find(section => section.name === 'tool:bash').text, /original DSH bash tool/)
  assert.match(assembled.sections.find(section => section.name === 'tool:goal').text, /top-level agent/)
  assert.match(assembled.sections.find(section => section.name === 'tool:goal').text, /exact active goal round/)
  assert.equal(assembled.sections.find(section => section.name === 'other').text, 'keep this')

  const listed = await registered.get('list_dir').execute({ path: 'src' }, { agent: {}, signal: new AbortController().signal })
  assert.deepEqual(listed, {
    path: '/workspace/src',
    entries: [{ name: 'src', type: 'directory' }, { name: 'index.ts', type: 'file', size: 12 }],
    truncated: false,
  })
  assert.equal(registered.get('list_dir').output.render({}, listed)[0].text, '/workspace/src\n[dir] src\nindex.ts')
})
