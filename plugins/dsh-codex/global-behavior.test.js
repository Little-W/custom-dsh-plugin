import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { apply, inject, GLOBAL_AGENT_RULES, GLOBAL_SEARCH_GUIDANCE, GLOBAL_SHELL_GUIDANCE } from './global-behavior.js'

function mountPolicy() {
  const sections = new Map()
  let assemble
  apply({
    systemPrompt: { section: section => sections.set(section.name, section) },
    on(event, listener) {
      assert.equal(event, 'system-prompt/assemble')
      assemble = listener
    },
  })
  return { sections, assemble }
}

test('global behavior mounts without shell, filesystem, or a preset-specific service', () => {
  assert.deepEqual(inject, ['systemPrompt'])
  const { sections } = mountPolicy()
  assert.equal(sections.size, 1)
  const policy = sections.get('studio:dsh-codex:global-behavior')
  assert.equal(policy.text, GLOBAL_AGENT_RULES)
  assert.equal(policy.interpolate, false)
})

test('shell guidance preserves native instructions, tool contracts, and policy contexts', async () => {
  const { assemble } = mountPolicy()
  const assembly = Object.freeze({
    sections: Object.freeze([
      Object.freeze({ name: 'tool:bash', text: 'Check exit codes. Native sandbox escalation requires approval.', interpolate: false }),
      Object.freeze({ name: 'tool:pwsh', text: 'PowerShell native instructions.' }),
      Object.freeze({ name: 'plan:policy', text: 'Read-only plan mode.' }),
      Object.freeze({ name: 'tools:ptc-only', text: 'Use run_code and the SDK only.' }),
      Object.freeze({ name: 'toString', text: 'Unrelated section.' }),
    ]),
    contexts: Object.freeze([{ name: 'sandbox:policy', text: 'workspace-write; approval never' }]),
    variables: Object.freeze({ model: 'test-model' }),
    tools: Object.freeze([{ name: 'bash', description: 'Native shell', parameters: { sandbox_permissions: { type: 'string' } } }]),
  })
  let nextCalls = 0
  const result = await assemble(assembly, {}, async () => { nextCalls += 1; return assembly })
  assert.equal(nextCalls, 1)
  assert.equal(result.sections[0].text, `${assembly.sections[0].text}\n${GLOBAL_SHELL_GUIDANCE['tool:bash']}`)
  assert.equal(result.sections[0].interpolate, false)
  assert.equal(result.sections[1].text, `${assembly.sections[1].text}\n${GLOBAL_SHELL_GUIDANCE['tool:pwsh']}`)
  for (const index of [2, 3, 4]) assert.equal(result.sections[index], assembly.sections[index])
  for (const field of ['contexts', 'variables', 'tools']) assert.equal(result[field], assembly[field])
  assert.equal(assembly.sections[0].text, 'Check exit codes. Native sandbox escalation requires approval.')
  assert.equal(await assemble(result, {}, async () => result), result, 'reassembly must not accumulate shell instructions')
})

test('global search guidance preserves DSH tools and supplements their bounded retrieval instructions', async () => {
  const { assemble } = mountPolicy()
  const assembly = {
    sections: [
      { name: 'tool:grep', text: 'Call grep with pattern and path.' },
      { name: 'tool:glob', text: 'Call glob with a pattern.' },
      { name: 'tool:bash', text: 'Native shell.' },
    ],
    tools: [{ name: 'bash' }, { name: 'read' }, { name: 'grep' }, { name: 'glob' }],
    contexts: [],
  }
  const result = await assemble(assembly, {}, async () => assembly)
  assert.match(result.sections[0].text, /^Call grep with pattern and path\.\n/)
  assert.match(result.sections[0].text, /Use DSH read for bounded.*Use shell rg/)
  assert.match(result.sections[1].text, /^Call glob with a pattern\.\n/)
  assert.match(GLOBAL_SEARCH_GUIDANCE, /read.*glob.*grep.*rg --files.*rg/)
  assert.equal(result.tools, assembly.tools, 'prompt adaptation does not mutate or falsely remove runtime schemas')
  assert.equal(await assemble(result, {}, async () => result), result, 'search guidance must not accumulate on reassembly')
})

test('PTC-only assemblies retain their original tool set without fabricated shell tools', async () => {
  const { assemble } = mountPolicy()
  const assembly = {
    sections: [{ name: 'tools:ptc-only', text: 'Call run_code using the supplied SDK.' }],
    tools: [{ name: 'run_code', parameters: { code: { type: 'string' } } }],
    contexts: [{ name: 'sandbox:policy', text: 'read-only' }],
  }
  const result = await assemble(assembly, {}, async () => assembly)
  assert.equal(result.tools, assembly.tools)
  assert.equal(result.contexts, assembly.contexts)
  assert.equal(result.sections[0], assembly.sections[0])
  assert.equal(result.sections.at(-1).text, GLOBAL_AGENT_RULES)
})

test('global evidence policy survives workflow role prose filters in both assembly orders', async () => {
  const { createChildPromptSetup } = await import('../visual-workflow/lib/agent/prompt-setup.js')
  const setup = createChildPromptSetup()
  let filter
  setup.registerGlobalAssemblyHook({ on(_name, listener) { filter = listener; return () => {} } })
  const { assemble } = mountPolicy()
  const input = {
    sections: [
      { name: 'harness:identity', text: 'Persona.' },
      { name: 'studio:dsh-codex:global-behavior', text: GLOBAL_AGENT_RULES },
      { name: 'studio:plugin-preview:guidance', text: 'Inspect the actual preview.' },
      { name: 'tools:ptc-only', text: 'Use run_code.' },
    ],
    tools: [{ name: 'run_code' }], contexts: [],
  }
  await setup.withPending({ systemPrompt: 'UI engineer', injectSystemPrompt: false, injectToolSections: false }, async () => {
    for (const result of [
      await assemble(input, {}, () => filter(input, {}, async () => input)),
      await filter(input, {}, () => assemble(input, {}, async () => input)),
    ]) {
      assert.equal(result.tools, input.tools)
      assert.ok(result.sections.some(section => section.name === 'studio:dsh-codex:global-behavior'))
      assert.ok(result.sections.some(section => section.name === 'studio:plugin-preview:guidance'))
      assert.ok(result.sections.some(section => section.name === 'tools:ptc-only'))
      assert.ok(!result.sections.some(section => section.name === 'harness:identity'))
    }
  })
})

test('behavior middleware enhances the downstream preset replacement rather than stale input', async () => {
  const { assemble } = mountPolicy()
  const original = { sections: [{ name: 'tool:bash', text: 'Original shell.' }] }
  const replacement = { sections: [{ name: 'tool:bash', text: 'Codex native Bash and job rules.' }] }
  const result = await assemble(original, {}, async () => replacement)
  assert.equal(result.sections[0].text, `${replacement.sections[0].text}\n${GLOBAL_SHELL_GUIDANCE['tool:bash']}`)
})

test('the shipped bundle mounts and exports global behavior outside the Codex preset', async () => {
  const [patch, pkg] = await Promise.all([
    readFile(new URL('./cordis.patch.yml', import.meta.url), 'utf8'),
    readFile(new URL('./package.json', import.meta.url), 'utf8').then(JSON.parse),
  ])
  const globalIndex = patch.indexOf('id: studio-dsh-codex-global-behavior')
  assert.ok(globalIndex >= 0 && globalIndex < patch.indexOf('id: preset-codex'))
  assert.equal(pkg.exports['./global-behavior'], './global-behavior.js')
  assert.ok(pkg.files.includes('global-behavior.js'))
  assert.match(patch, /id: tool-fs-search\n\s+name: '@deepseek-ai\/dsh-tool-fs-search'/)
  assert.doesNotMatch(patch, /id: tool-fs-search\n\s+name: '@deepseek-ai\/dsh-tool-fs-search'\n\s+disabled:/)
  const exported = await import(pkg.exports['./global-behavior'])
  assert.equal(exported.apply, apply)
})
