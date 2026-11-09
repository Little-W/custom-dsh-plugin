import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { createServer } from 'node:http'
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { PassThrough } from 'node:stream'
import test from 'node:test'
import { inspectPackage, previewEnvironment, PreviewManager, redactLog } from './runtime.js'

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'plugin-preview-test-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const source = join(root, 'source')
  await mkdir(source)
  await writeFile(join(source, 'package.json'), JSON.stringify({
    name: 'preview-fixture', version: '1.0.0', type: 'module', main: './index.js',
    exports: { '.': './index.js', './client': { default: './client.js' } },
    dsh: { bundle: { patch: './cordis.patch.yml' }, client: { platform: 'web' } },
  }))
  await writeFile(join(source, 'index.js'), 'export function apply() {}')
  await writeFile(join(source, 'client.js'), 'window.fixture = 1')
  await writeFile(join(source, 'helper.js'), 'export const helper = 1')
  await writeFile(join(source, 'cordis.patch.yml'), '[]')
  return { root, source }
}

async function managerFixture(t, { ready = true, auth = true } = {}) {
  const files = await fixture(t)
  const server = createServer((_req, res) => {
    res.writeHead(auth ? 302 : 401, auth ? { 'set-cookie': 'preview=fixture; HttpOnly; SameSite=Strict', location: '/' } : {})
    res.end()
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  const origin = `http://127.0.0.1:${server.address().port}`
  const children = []
  const manager = new PreviewManager({
    parentHome: files.root, runtime: { executable: '/fixture/dsh', args: [] }, startupTimeoutMs: 1000,
    spawnProcess(executable, args, options) {
      assert.equal(executable, '/fixture/dsh')
      assert.deepEqual(args, ['--profile', 'preview', '--no-open', '--host', '127.0.0.1', '--port', '0'])
      assert.notEqual(options.env.DSH_HOME, files.root)
      const child = Object.assign(new EventEmitter(), { stdout: new PassThrough(), stderr: new PassThrough(), exitCode: null, signalCode: null })
      children.push(child)
      if (ready) setImmediate(() => {
        child.stdout.write('dsh web: ' + origin + '/?token=split-')
        child.stderr.write('a separate stderr line\n')
        child.stdout.write('secret\n')
        void writeFile(options.env.DSH_PLUGIN_PREVIEW_READY_PATH, JSON.stringify({ origin, loginUrl: origin + '/?token=fixture', devicePreviewUrl: origin + '/studio/plugin-preview-device?token=fixture' }))
      })
      return child
    },
  })
  t.after(() => manager.dispose())
  return { ...files, manager, children }
}

test('artifact identity includes imported modules, tracks actual client bytes, and rejects escaping exports', async t => {
  const { source } = await fixture(t)
  const before = await inspectPackage(source)
  await writeFile(join(source, 'helper.js'), 'export const helper = 2')
  const after = await inspectPackage(source)
  assert.notEqual(after.artifactHash, before.artifactHash)
  assert.equal(after.clientSha256, before.clientSha256)
  const pkg = JSON.parse(await readFile(join(source, 'package.json'), 'utf8'))
  pkg.exports['./client'] = '../outside.js'
  await writeFile(join(source, 'package.json'), JSON.stringify(pkg))
  await assert.rejects(inspectPackage(source), /越出插件目录/)
})

test('environment and diagnostics exclude production account and launch credentials', () => {
  const env = previewEnvironment({ PATH: '/bin', HOME: '/home/test', OPENAI_API_KEY: 'secret', DSH_WEB_URL: 'private', NODE_OPTIONS: '--import secret-loader', DSH_HOME: '/production' }, '/preview', '/preview/ready.json', 1234)
  assert.equal(env.DSH_HOME, '/preview')
  assert.equal(env.OPENAI_API_KEY, undefined)
  assert.equal(env.DSH_WEB_URL, undefined)
  assert.equal(env.NODE_OPTIONS, undefined)
  assert.equal(env.PATH, '/bin')
  assert.equal(redactLog('dsh web: http://127.0.0.1/?token=SECRET\n'), 'dsh web: http://127.0.0.1/?token=[redacted]\n')
})

test('device configuration keeps owner isolation and child process identity, and reload retains its viewport', async t => {
  const { source, manager, children } = await managerFixture(t)
  const started = await manager.start({ plugin_paths: [source], viewport: { preset: 'phone' } }, 'mobile-owner')
  assert.equal(started.viewport.width, 390)
  assert.equal(started.emulationAppliedByTool, false)
  assert.equal(started.chromeEmulation.viewport, '390x844x3,mobile,touch')
  assert.equal(new URL(started.devicePreviewUrl).searchParams.get('width'), '390')
  await assert.rejects(manager.setViewport(started.id, { preset: 'tablet' }, 'another-owner'), /当前会话/)
  const configured = await manager.setViewport(started.id, { preset: 'phone', orientation: 'landscape' }, 'mobile-owner')
  assert.equal(configured.id, started.id)
  assert.equal(children.length, 1)
  assert.equal(configured.viewport.width, 844)
  const reloaded = await manager.reload(started.id, 'mobile-owner')
  assert.notEqual(reloaded.id, started.id)
  assert.equal(reloaded.viewport.orientation, 'landscape')
  assert.equal(reloaded.chromeEmulation.viewport, '844x390x3,mobile,touch,landscape')
  await manager.stop(reloaded.id, 'mobile-owner')
  await assert.rejects(manager.setViewport(reloaded.id, { preset: 'desktop' }, 'mobile-owner'), /正在运行/)
})

test('an explicit mobile mode forces touch/mobile but is not marked applied until Chrome verification', async t => {
  const { source, manager } = await managerFixture(t)
  const started = await manager.start({ plugin_paths: [source], mode: 'mobile', viewport: { preset: 'phone', isMobile: false, hasTouch: false } }, 'owner')
  assert.equal(started.mode, 'mobile')
  assert.equal(started.viewport.isMobile, true)
  assert.equal(started.viewport.hasTouch, true)
  assert.equal(started.emulationAppliedByTool, false)
  assert.equal(started.browser.verified, false)
  const item = manager.own(started.id, 'owner'); item.browserBusy = true
  await assert.rejects(manager.setViewport(started.id, { preset: 'desktop' }, 'owner', 'desktop'), /浏览器正在配置/)
  item.browserBusy = false
  const desktop = await manager.setViewport(started.id, { preset: 'desktop' }, 'owner', 'desktop')
  assert.equal(desktop.viewport.isMobile, false); assert.equal(desktop.viewport.hasTouch, false)
  await assert.rejects(manager.start({ plugin_paths: [source], mode: 'unknown' }, 'owner'), /mode 必须/)
})

test('start serves an authenticated isolated snapshot; status detects stale source and reload updates it', async t => {
  const { source, root, manager } = await managerFixture(t)
  const templates = join(root, 'visual-workflow', 'flow-templates')
  await mkdir(templates, { recursive: true })
  await writeFile(join(templates, 'fixture.json'), JSON.stringify({ id: 'fixture', nodes: [{ data: { conn: { password: 'SECRET', host: 'localhost' } } }] }))
  const started = await manager.start({ plugin_paths: [source], copy_workflow_templates: true }, 'session-one')
  assert.equal(started.state, 'ready')
  assert.equal(started.runtimeKind, 'isolated-dsh')
  assert.equal(started.visualVerification, 'not-performed-by-this-tool')
  assert.equal(started.plugins[0].sourceChanged, false)
  assert.equal(started.workflowTemplateCount, 1)
  const home = manager.previews.get(started.id).home
  const profile = JSON.parse(await readFile(join(home, 'profiles/preview/package.json'), 'utf8'))
  assert.ok(profile.dependencies['preview-fixture'].startsWith('file:'))
  const copied = JSON.parse(await readFile(join(home, 'visual-workflow/flow-templates/fixture.json'), 'utf8'))
  assert.equal(copied.nodes[0].data.conn.password, '')
  assert.equal(JSON.parse(await readFile(join(templates, 'fixture.json'), 'utf8')).nodes[0].data.conn.password, 'SECRET')
  await assert.rejects(manager.status(started.id, 'session-two'), /当前会话/)
  const log = await readFile(started.logPath, 'utf8')
  assert.ok(!log.includes('split-secret'))
  assert.ok(log.includes('token=[redacted]'))
  await writeFile(join(source, 'client.js'), 'window.fixture = 2')
  assert.equal((await manager.status(started.id, 'session-one')).plugins[0].sourceChanged, true)
  const next = await manager.reload(started.id, 'session-one')
  assert.notEqual(next.id, started.id)
  assert.equal(next.plugins[0].sourceChanged, false)
  assert.notEqual(next.plugins[0].clientSha256, started.plugins[0].clientSha256)
  assert.equal((await manager.status(started.id, 'session-one')).state, 'stopped')
})

test('auth failure is reported as failure rather than readiness or an unrelated cleanup cancellation', async t => {
  const { manager, source } = await managerFixture(t, { auth: false })
  await assert.rejects(manager.start({ plugin_paths: [source] }, 'owner'), /认证握手失败：HTTP 401.*日志/)
  assert.equal((await manager.list('owner'))[0].state, 'failed')
})

test('cancellation during startup settles cleanup and does not report a successful preview', async t => {
  const { manager, source } = await managerFixture(t, { ready: false })
  const controller = new AbortController()
  const work = manager.start({ plugin_paths: [source] }, 'owner', controller.signal)
  const timer = setTimeout(() => controller.abort(new Error('caller cancelled')), 30)
  t.after(() => clearTimeout(timer))
  await assert.rejects(work, /caller cancelled/)
  assert.ok((await manager.list('owner')).every(item => item.state !== 'ready'))
})

test('concurrent starts cannot exceed capacity; duplicate package names fail before spawn', async t => {
  const { manager, source, children } = await managerFixture(t)
  await assert.rejects(manager.start({ plugin_paths: [source, source] }, 'owner'), /同名插件/)
  const results = await Promise.allSettled(Array.from({ length: 3 }, () => manager.start({ plugin_paths: [source] }, 'owner')))
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 2)
  assert.equal(children.length, 2)
})

test('source directory symlinks cannot pull arbitrary trees into preview packages', async t => {
  const { source, root } = await fixture(t)
  const outside = join(root, 'private')
  await mkdir(outside)
  await symlink(outside, join(source, 'linked'), process.platform === 'win32' ? 'junction' : 'dir')
  await assert.rejects(inspectPackage(source), /链接/)
})
