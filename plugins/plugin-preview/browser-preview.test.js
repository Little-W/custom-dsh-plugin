import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { BrowserPreview, browserToolNames } from './browser-preview.js'
import { normalizeViewport } from './devices.js'

const actions = ['new_page', 'emulate', 'evaluate_script', 'navigate_page', 'take_screenshot', 'close_page']
const schemas = () => actions.map(action => ({ name: `mcp__chrome-devtools__${action}`, parameters: { properties: { pageId: {} } } }))
const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jFJkAAAAASUVORK5CYII='
function json(value) { return { content: [{ type: 'text', text: '```json\n' + JSON.stringify(value) + '\n```' }] } }
async function fixture(t, { wrongUA = false, denyEmulation = false } = {}) {
  const home = await mkdtemp(join(tmpdir(), 'dsh-browser-mode-test-')); t.after(() => rm(home, { recursive: true, force: true }))
  const calls = []; let emulation, loaded = false
  const item = { id: 'preview-test', origin: 'http://127.0.0.1:12345', loginUrl: 'http://127.0.0.1:12345/?token=private-fixture', home, mode: 'mobile', viewport: normalizeViewport({ preset: 'phone' }) }
  const invoke = async (name, args) => {
    calls.push({ name, args })
    if (name.endsWith('__new_page')) { assert.equal(args.url, 'about:blank'); return { content: [{ type: 'text', text: '## Pages\n8: about:blank [selected]' }] } }
    if (name.endsWith('__emulate')) { if (denyEmulation) throw new Error('native guard denied Chrome'); emulation = args; return {} }
    if (name.endsWith('__navigate_page')) { assert.ok(emulation); loaded = true; assert.match(emulation.userAgent, /Android.*Mobile/); return {} }
    if (name.endsWith('__evaluate_script')) return !loaded ? json({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/152.0.0.0 Safari/537.36' }) : json({ origin: item.origin, width: item.viewport.width, height: item.viewport.height, dpr: 3, touchPoints: 1, pointerCoarse: true, hoverNone: true, mobileUa: !wrongUA, userAgent: wrongUA ? 'Desktop Chrome' : emulation.userAgent })
    if (name.endsWith('__take_screenshot')) return { content: [{ type: 'image', mimeType: 'image/png', data: png }] }
    return {}
  }
  return { item, calls, controller: new BrowserPreview({ schemas, invoke }) }
}

test('phone mode applies mobile UA/touch/DPR BEFORE the first DSH load and saves a real browser image', async t => {
  const { item, calls, controller } = await fixture(t)
  const browser = await controller.open(item, new AbortController().signal)
  assert.equal(browser.verified, true); assert.equal(browser.pageId, 8)
  assert.ok(calls.findIndex(call => call.name.endsWith('__emulate')) < calls.findIndex(call => call.name.endsWith('__navigate_page')))
  assert.equal(calls.find(call => call.name.endsWith('__emulate')).args.viewport, '390x844x3,mobile,touch')
  assert.equal((await readFile(item.browserScreenshotPath)).toString('base64'), png)
  await controller.capture(item, new AbortController().signal)
  await item.closeBrowser()
  assert.equal(calls.at(-1).name, 'mcp__chrome-devtools__close_page')
  assert.equal(calls.at(-1).args.pageId, 8)
})

test('a narrow desktop UA cannot masquerade as phone mode; only the newly owned page is closed', async t => {
  const { item, calls, controller } = await fixture(t, { wrongUA: true })
  await assert.rejects(controller.open(item, new AbortController().signal), /手机模式核验失败/)
  assert.equal(item.browser.verified, false)
  assert.equal(calls.at(-1).args.pageId, 8)
  assert.ok(!calls.some(call => call.name.endsWith('__take_screenshot')))
})

test('native denial is preserved and does not fall back to fake mobile properties or a CSS frame', async t => {
  const { item, calls, controller } = await fixture(t, { denyEmulation: true })
  await assert.rejects(controller.open(item, new AbortController().signal), /native guard denied/)
  assert.equal(item.browser.verified, false)
  assert.ok(!calls.some(call => call.name.endsWith('__navigate_page')))
  assert.ok(!calls.some(call => call.args.function?.includes('defineProperty')))
})

test('missing/ambiguous Chrome or a tool without explicit page targeting fails before browser work', async t => {
  assert.throws(() => browserToolNames([]), /需要启用唯一/)
  const { item, controller } = await fixture(t)
  controller.schemas = () => []
  await assert.rejects(controller.open(item, new AbortController().signal), /Chrome/)
  assert.ok(!item.browserBusy)
  const old = schemas(); old.find(tool => tool.name.endsWith('__emulate')).parameters.properties = {}
  assert.throws(() => browserToolNames(old), /pageId/)
  item.mode = 'layout'; await assert.rejects(controller.open(item, new AbortController().signal), /仅布局模式/)
})
