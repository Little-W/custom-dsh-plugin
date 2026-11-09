import assert from 'node:assert/strict'
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import test from 'node:test'
import { discoverRuntime, PreviewManager } from './runtime.js'

test('packaged DSH loads actual local client packages and accepts its own browser login', {
  skip: !process.env.DSH_PREVIEW_TEST_ENTRY,
  timeout: 60000,
}, async t => {
  const runtime = await discoverRuntime(process.env.DSH_PREVIEW_TEST_ENTRY)
  const manager = new PreviewManager({ parentHome: process.env.DSH_HOME, runtime })
  t.after(() => manager.dispose())
  const source = fileURLToPath(new URL('./', import.meta.url))
  const preview = await manager.start({ plugin_paths: [source], ttl_seconds: 60 }, 'integration')
  assert.equal(preview.state, 'ready')
  const auth = await fetch(preview.loginUrl, { redirect: 'manual' })
  const cookie = auth.headers.get('set-cookie')?.split(';')[0]
  assert.ok([302, 303].includes(auth.status))
  assert.ok(cookie)
  const denied = await fetch(preview.origin + '/')
  assert.equal(denied.status, 401)
  const page = await fetch(preview.origin + '/', { headers: { cookie } })
  assert.equal(page.status, 200)
  assert.match(await page.text(), /__DSH_BOOT__|__ModuleLoader__/)
  assert.equal((await fetch(preview.origin + '/studio/plugin-preview')).status, 401)
  const api = await fetch(preview.origin + '/studio/plugin-preview', { headers: { cookie } })
  assert.equal(api.status, 200)
  const metadata = await api.json()
  assert.deepEqual(metadata.previews, [])
  assert.ok(metadata.viewportPresets.some(preset => preset.id === 'phone' && preset.width === 390))
  assert.equal(metadata.designSkill.name, 'ui-style-design')
  assert.ok(preview.devicePreviewUrl)
  const deviceAuth = await fetch(preview.devicePreviewUrl, { redirect: 'manual' })
  assert.ok([302, 303].includes(deviceAuth.status))
  assert.ok(deviceAuth.headers.get('location').startsWith('/studio/plugin-preview-device'))
  assert.ok(!deviceAuth.headers.get('location').includes('token='))
  const deviceCookie = deviceAuth.headers.get('set-cookie')?.split(';')[0]
  const device = await fetch(new URL(preview.devicePreviewUrl).origin + '/studio/plugin-preview-device?preset=phone', { headers: { cookie: deviceCookie } })
  assert.equal(device.status, 200)
  assert.match(await device.text(), /iframe[^>]+src="\/"/)
  assert.equal((await fetch(preview.origin + '/studio/plugin-preview-device')).status, 401)
  assert.equal((await fetch(preview.origin + '/studio/plugin-preview-screenshot?preview_id=unknown')).status, 401)
  assert.equal((await fetch(preview.origin + '/studio/plugin-preview-device?token=invalid-token')).status, 401)
  assert.equal((await fetch(preview.devicePreviewUrl, { headers: { origin: 'https://untrusted.invalid' }, redirect: 'manual' })).status, 403)
  const saved = await readFile(preview.logPath, 'utf8')
  assert.ok(!/token=(?!\[redacted\])[^\s]+/.test(saved))
})

test('the tool preserves native full-access approval semantics and cannot launch after denial', {
  skip: !process.env.DSH_PREVIEW_TEST_ENTRY,
}, async t => {
  const entry = process.env.DSH_PREVIEW_TEST_ENTRY
  const resources = entry.slice(0, entry.indexOf('/app.asar/'))
  const { registerHostModuleFallback } = await import(pathToFileURL(resources + '/host-module-fallback.mjs').href)
  const hooks = registerHostModuleFallback(entry)
  t.after(() => hooks.deregister())
  const { apply } = await import('./index.js')
  let tool, mode = 'read-only'
  const disposers = []
  const services = {
    skills: { register(skill) { assert.equal(skill.name, 'ui-style-design'); return () => {} } },
    tools: { register(value) { tool = value }, schemas: () => [] },
    systemPrompt: { section() {} },
    sandboxPolicy: { resolve: () => ({ mode, workspaceRoot: '/tmp' }) },
    webServer: { register: () => () => {} },
    connection: { requestRejection: () => 401 },
  }
  const ctx = {
    ...services,
    get: key => services[key], provide: (key, value) => { services[key] = value },
    effect: factory => { disposers.push(factory()) },
  }
  apply(ctx)
  t.after(async () => { for (const dispose of disposers.reverse()) await dispose?.() })
  const exec = { agent: { id: 'caller', session: { id: 'caller' } }, callId: 'test', signal: new AbortController().signal }
  await assert.rejects(tool.execute({ action: 'start', plugin_paths: [] }, exec), /requires approval/)
  assert.equal(services.pluginPreview.previews.size, 0)
  mode = 'danger-full-access'
  await assert.rejects(tool.execute({ action: 'start', plugin_paths: [] }, exec), /plugin_paths/)
  const root = await mkdtemp(join(tmpdir(), 'dsh-native-mobile-mode-'))
  services.pluginPreview.parentHome = root
  services.pluginPreview.runtime = await discoverRuntime(entry)
  t.after(async () => { await services.pluginPreview.dispose(); await rm(root, { recursive: true, force: true }) })
  await assert.rejects(tool.execute({ action: 'start', mode: 'mobile', plugin_paths: [fileURLToPath(new URL('./', import.meta.url))] }, exec), /手机模式未启用/)
  const previews = await services.pluginPreview.list('caller')
  assert.equal(previews.length, 1)
  assert.equal(previews[0].state, 'ready')
  assert.equal(previews[0].emulationAppliedByTool, false)
  assert.equal(previews[0].browser.verified, false)
  assert.equal(mode, 'danger-full-access')
})

test('nested Chrome calls go through actual native pre-policy and guards', { skip: !process.env.DSH_PREVIEW_TEST_ENTRY }, async t => {
  const entry = process.env.DSH_PREVIEW_TEST_ENTRY
  const resources = entry.slice(0, entry.indexOf('/app.asar/'))
  const { registerHostModuleFallback } = await import(pathToFileURL(resources + '/host-module-fallback.mjs').href)
  const hooks = registerHostModuleFallback(entry); t.after(() => hooks.deregister())
  const { browserInvoker } = await import('./browser-invoker.js')
  let bodies = 0, guards = 0, deny = true
  const definition = { name: 'mcp__chrome-devtools__emulate', parameters: { type: 'object', additionalProperties: true }, output: { schema: { type: 'object', additionalProperties: true }, render: () => [] }, execute() { bodies++; return { applied: true } } }
  const ctx = { tools: { executable: () => definition, checkGuards() { guards++; return deny ? 'native permission denied' : undefined } }, events: { dispatch: () => [] }, logger: { warn() {} }, waterfall(...args) { return args.at(-1)() } }
  const invoke = browserInvoker(ctx)
  await assert.rejects(invoke(definition.name, { pageId: 1 }, new AbortController().signal), /native permission denied/)
  assert.equal(bodies, 0); assert.equal(guards, 1)
  deny = false
  assert.deepEqual(await invoke(definition.name, { pageId: 1 }, new AbortController().signal), { applied: true })
  assert.equal(bodies, 1); assert.equal(guards, 2)
})
