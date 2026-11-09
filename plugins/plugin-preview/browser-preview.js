import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromeEmulation } from './devices.js'

export function jsonResult(result) {
  if (result?.structuredContent && typeof result.structuredContent === 'object') return result.structuredContent
  const text = (result?.content ?? []).filter(part => part.type === 'text').map(part => part.text).join('\n')
  const match = /```json\s*\n([\s\S]*?)\n```/.exec(text)
  if (!match) throw new Error('Chrome 没有返回可核验的 JSON 状态')
  return JSON.parse(match[1])
}

function pageIdOf(result) {
  if (Number.isInteger(result?.structuredContent?.pageId)) return result.structuredContent.pageId
  const text = (result?.content ?? []).filter(part => part.type === 'text').map(part => part.text).join('\n')
  const match = /^\s*(\d+):[^\n]*\[selected\]/m.exec(text)
  if (!match) throw new Error('Chrome 没有返回新标签页的 pageId；未操作已有标签页')
  return Number(match[1])
}

export function browserToolNames(schemas) {
  const names = {}
  for (const action of ['new_page', 'emulate', 'evaluate_script', 'navigate_page', 'take_screenshot', 'close_page']) {
    const candidates = schemas.filter(schema => /chrome[-_]devtools/i.test(schema.name) && new RegExp(`__${action}(?:_[a-f0-9]{12})?$`).test(schema.name))
    if (candidates.length !== 1) throw new Error(`需要启用唯一的 Chrome 开发者工具：缺少或无法确定 ${action}。仅调整尺寸不能作为手机模式成功。`)
    if (action !== 'new_page' && !candidates[0].parameters?.properties?.pageId) throw new Error('Chrome 工具版本不支持明确的 pageId，不能安全配置手机模式；请更新 Chrome 开发者工具')
    names[action] = candidates[0].name
  }
  return names
}

export const BROWSER_STATE_FUNCTION = `() => ({origin:location.origin,width:innerWidth,height:innerHeight,dpr:devicePixelRatio,touchPoints:navigator.maxTouchPoints,pointerCoarse:matchMedia('(pointer:coarse)').matches,hoverNone:matchMedia('(hover:none)').matches,userAgent:navigator.userAgent,mobileUa:/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)})`

export function assertBrowserMode(state, item) {
  const expected = item.viewport
  if (state.origin !== item.origin) throw new Error('Chrome 页面已经离开当前预览实例，未采集其他页面')
  if (state.width !== expected.width || state.height !== expected.height || Math.abs(state.dpr - expected.deviceScaleFactor) > .01) throw new Error('Chrome 实际视口/DPR 与请求不一致，未标记模式成功')
  if (item.mode === 'mobile' && !(state.mobileUa && state.touchPoints > 0 && state.pointerCoarse && state.hoverNone)) throw new Error('Chrome 手机模式核验失败：必须同时启用移动 UA、触控、粗指针和无悬停行为')
  if (item.mode === 'desktop' && (state.mobileUa || state.touchPoints > 0 || state.pointerCoarse)) throw new Error('Chrome 桌面模式核验失败：仍残留手机 UA 或触控配置')
}

export class BrowserPreview {
  constructor({ schemas, invoke, cleanupInvoke }) { this.schemas = schemas; this.invoke = invoke; this.cleanupInvoke = cleanupInvoke ?? invoke }

  async call(names, action, args, signal) {
    signal?.throwIfAborted()
    const result = await this.invoke(names[action], args, signal)
    if (result?.isError) throw new Error((result.content ?? []).filter(part => part.type === 'text').map(part => part.text).join('\n') || 'Chrome 工具失败')
    return result
  }

  async open(item, signal) {
    if (item.mode === 'layout') throw new Error('当前是仅布局模式，请先选择手机模式或桌面模式')
    if (item.browserBusy) throw new Error('当前预览的浏览器正在配置中')
    const names = browserToolNames(this.schemas())
    item.browserBusy = true
    const previousClose = item.closeBrowser
    let pageId
    try {
      item.browser = { state: 'configuring', mode: item.mode, verified: false }
      const created = await this.call(names, 'new_page', { url: 'about:blank', isolatedContext: `dsh-preview-${item.id}`, background: true }, signal)
      pageId = pageIdOf(created)
      const initial = jsonResult(await this.call(names, 'evaluate_script', { pageId, function: '() => ({userAgent:navigator.userAgent})' }, signal))
      const version = /(?:Headless)?Chrome\/([\d.]+)/.exec(initial.userAgent)?.[1]
      if (!version) throw new Error('无法识别 Chrome 版本，未猜造手机浏览器 UA')
      const userAgent = item.mode === 'mobile'
        ? `Mozilla/5.0 (Linux; Android 14; DSH Preview) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Mobile Safari/537.36`
        : initial.userAgent
      // DSH caches isMobileDevice on first use. All overrides MUST precede the first DSH load.
      await this.call(names, 'emulate', { pageId, ...chromeEmulation(item.viewport), userAgent }, signal)
      await this.call(names, 'navigate_page', { pageId, type: 'url', url: item.loginUrl }, signal)
      const state = jsonResult(await this.call(names, 'evaluate_script', { pageId, function: BROWSER_STATE_FUNCTION }, signal))
      assertBrowserMode(state, item)
      item.browser = { state: 'ready', pageId, mode: item.mode, verified: true, verification: state, verifiedAt: new Date().toISOString() }
      item.closeBrowser = async () => {
        try { await this.cleanupInvoke(names.close_page, { pageId }, AbortSignal.timeout(5000)) } catch {}
      }
      try { await this.captureImage(item, names, signal) } catch (error) { item.browser.screenshotError = error.message }
      if (previousClose) await previousClose()
      return item.browser
    } catch (error) {
      item.browser = { state: 'failed', mode: item.mode, verified: false, error: error.message }
      if (pageId !== undefined) { try { await this.cleanupInvoke(names.close_page, { pageId }, AbortSignal.timeout(5000)) } catch {} }
      throw error
    } finally { item.browserBusy = false }
  }

  async captureImage(item, names, signal) {
    const result = await this.call(names, 'take_screenshot', { pageId: item.browser.pageId, format: 'png', fullPage: false }, signal)
    const image = result.content?.find(part => part.type === 'image' && part.mimeType === 'image/png' && typeof part.data === 'string')
    if (!image || image.data.length > 24 * 1024 * 1024) throw new Error('Chrome 未返回可用的 PNG 画面，或画面超过大小限制')
    const bytes = Buffer.from(image.data, 'base64')
    if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error('Chrome 画面不是有效的 PNG')
    item.browserScreenshotPath = join(item.home, 'browser-preview.png')
    await writeFile(item.browserScreenshotPath, bytes, { mode: 0o600 })
    item.browser.screenshotAt = new Date().toISOString()
  }

  async capture(item, signal) {
    if (!item.browser?.verified || item.browser.pageId === undefined) throw new Error('请先启动并核验真实浏览器模式')
    if (item.browserBusy) throw new Error('浏览器正在配置中')
    item.browserBusy = true
    try {
      const names = browserToolNames(this.schemas())
      const state = jsonResult(await this.call(names, 'evaluate_script', { pageId: item.browser.pageId, function: BROWSER_STATE_FUNCTION }, signal))
      assertBrowserMode(state, item)
      await this.captureImage(item, names, signal)
      return item.browser
    } catch (error) { item.browser.verified = false; item.browser.state = 'failed'; item.browser.error = error.message; throw error }
    finally { item.browserBusy = false }
  }
}
