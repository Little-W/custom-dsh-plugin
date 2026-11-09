import { rename, writeFile } from 'node:fs/promises'
import { renderDevicePreview, viewportFromUrl } from './device-preview.js'

export const name = '插件预览实例生命周期'
export const inject = ['appReady', 'connection', 'webServer']

export function apply(ctx) {
  const parentPid = Number(process.env.DSH_PLUGIN_PREVIEW_PARENT_PID)
  const expiresAt = Number(process.env.DSH_PLUGIN_PREVIEW_EXPIRES_AT)
  const readyPath = process.env.DSH_PLUGIN_PREVIEW_READY_PATH
  if (!readyPath || !Number.isSafeInteger(parentPid) || !Number.isFinite(expiresAt)) {
    throw new Error('插件预览实例缺少生命周期参数')
  }
  let stopping = false
  const timer = setInterval(() => {
    if (stopping || (Date.now() < expiresAt && process.ppid === parentPid)) return
    stopping = true
    process.kill(process.pid, 'SIGTERM')
  }, 1000)
  timer.unref()
  ctx.effect(() => () => clearInterval(timer), 'plugin preview: parent and expiry monitor')
  ctx.effect(() => ctx.webServer.register({ kind: 'exact', path: '/studio/plugin-preview-device', handler(req, res) {
    const rejection = ctx.connection.requestRejection(req)
    if (rejection === 403 || req.headers['sec-fetch-site'] === 'cross-site') { res.writeHead(403); res.end('Untrusted request origin'); return }
    if (req.method !== 'GET') { res.writeHead(405, { allow: 'GET' }); res.end(); return }
    try {
      const url = new URL(req.url, 'http://dsh.invalid')
      if (url.searchParams.has('token')) {
        // Reuse the native root exchange; only its post-auth destination changes.
        const auth = new URL('http://dsh.invalid/')
        for (const token of url.searchParams.getAll('token')) auth.searchParams.append('token', token)
        url.searchParams.delete('token')
        const admitted = ctx.connection.authorizeIndex({ headers: req.headers, method: req.method, url: auth.href }, {
          writeHead(status, headers) { res.writeHead(status, { ...headers, ...([302, 303].includes(status) ? { location: url.pathname + url.search } : {}) }) },
          end(body) { res.end(body) },
        })
        if (!admitted) return
      } else if (rejection) { res.writeHead(rejection); res.end('DSH authentication required'); return }
      const html = renderDevicePreview(viewportFromUrl(url.href))
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer', 'x-frame-options': 'SAMEORIGIN' })
      res.end(html)
    } catch (error) { res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }); res.end(error.message) }
  } }), 'plugin preview: authenticated device frame')
  ctx.effect(() => ctx.appReady.onReady(() => {
    const origin = ctx.webServer.getOrigin()
    void writeFile(readyPath + '.tmp', JSON.stringify({
      origin,
      loginUrl: ctx.connection.authenticatedUrl(origin + '/'),
      devicePreviewUrl: ctx.connection.authenticatedUrl(origin + '/studio/plugin-preview-device'),
      pid: process.pid,
    }), { mode: 0o600 }).then(() => rename(readyPath + '.tmp', readyPath)).catch(error => {
      console.error('plugin-preview: readiness file failed:', error.message)
      process.kill(process.pid, 'SIGTERM')
    })
  }), 'plugin preview: authenticated readiness')
}
