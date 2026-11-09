import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeViewport, chromeEmulation, devicePreviewUrl, VIEWPORT_PRESETS } from './devices.js'
import { viewportFromUrl, renderDevicePreview } from './device-preview.js'
import { bundledUiSkill } from './bundled-skill.js'
import { access } from 'node:fs/promises'
import { join } from 'node:path'

test('phone, tablet and desktop presets produce exact CSS viewports and complete Chrome mobile/touch recommendations', () => {
  for (const preset of VIEWPORT_PRESETS) {
    const viewport = normalizeViewport({ preset: preset.id })
    assert.equal(viewport.width, preset.width)
    assert.equal(viewport.height, preset.height)
    assert.ok(chromeEmulation(viewport).viewport.startsWith(`${preset.width}x${preset.height}x${preset.deviceScaleFactor}`))
    assert.equal(chromeEmulation(viewport).viewport.includes(',touch'), preset.hasTouch)
    assert.equal(chromeEmulation(viewport).viewport.includes(',mobile'), preset.isMobile)
  }
  assert.equal(chromeEmulation(normalizeViewport({ preset: 'phone', orientation: 'landscape' })).viewport, '844x390x3,mobile,touch,landscape')
})

test('custom dimensions, DPR and touch are validated before browser/device URL creation', () => {
  const custom = normalizeViewport({ preset: 'custom', width: 412, height: 915, deviceScaleFactor: 2.5, isMobile: true, hasTouch: false })
  assert.equal(chromeEmulation(custom).viewport, '412x915x2.5,mobile')
  for (const input of [null, [], { preset: 'unknown' }, { preset: 'custom' }, { width: 239 }, { height: 4097 }, { width: 390.5 }, { deviceScaleFactor: Infinity }, { deviceScaleFactor: 0 }, { orientation: 'up' }, { isMobile: 'true' }]) assert.throws(() => normalizeViewport(input))
})

test('device link retains only its own auth origin/path and validated viewport state round trips', () => {
  const viewport = normalizeViewport({ preset: 'phone-compact', orientation: 'landscape' })
  const url = devicePreviewUrl('http://127.0.0.1:1234/studio/plugin-preview-device?token=private-fixture', viewport)
  const parsed = new URL(url)
  assert.equal(parsed.origin, 'http://127.0.0.1:1234')
  assert.equal(parsed.pathname, '/studio/plugin-preview-device')
  assert.equal(parsed.searchParams.get('token'), 'private-fixture')
  assert.deepEqual(viewportFromUrl(url), viewport)
  assert.throws(() => viewportFromUrl('/?preset=custom&width=NaN&height=844'))
  assert.throws(() => viewportFromUrl('/?hasTouch=script'))
  const html = renderDevicePreview(viewport)
  assert.ok(html.includes('src="/"'))
  assert.ok(!html.includes('private-fixture'))
})

test('bundled UI design skill resolves its packaged instruction and metadata resources', async () => {
  const skill = bundledUiSkill()
  assert.equal(skill.name, 'ui-style-design')
  assert.equal(skill.source, 'bundled')
  assert.equal(skill.resourceBase.kind, 'directory')
  assert.ok(skill.content.length > 400)
  assert.ok(!skill.content.startsWith('---'))
  await access(skill.path)
  await access(join(skill.resourceBase.path, 'agents/openai.yaml'))
})
