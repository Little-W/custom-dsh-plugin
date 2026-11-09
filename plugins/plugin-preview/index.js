import { defineTool } from '@deepseek-ai/dsh-tools'
import { approveEscalation } from '@deepseek-ai/dsh-sandbox'
import { PreviewManager, redactLog } from './runtime.js'
import { VIEWPORT_PRESETS } from './devices.js'
import { bundledUiSkill } from './bundled-skill.js'
import { BrowserPreview } from './browser-preview.js'
import { browserInvoker } from './browser-invoker.js'
import { readFile } from 'node:fs/promises'

export const name = '插件页面预览'
export const inject = ['tools', 'systemPrompt', 'sandboxPolicy', 'webServer', 'connection', 'skills']
export const PREVIEW_GUIDANCE = `## Inspect a plugin in its real DSH host
For changes to a DSH plugin UI, use plugin_preview to start a separate DSH instance with the modified, built plugin_paths. Discover the available Chrome DevTools tools and open the returned loginUrl, which exchanges the preview instance's own native token for a browser cookie. Do not stop at the authentication screen or claim that the page cannot be viewed without trying this supported login path. Keep the production DSH process and its active sessions running.
Open the actual plugin via the DSH interface; inspect its DOM, interaction, console and screenshot. After an edit or build, call plugin_preview reload and open its new loginUrl; status must show sourceChanged=false and the expected clientSha256. Startup success proves the preview is serving, not that the UI is correct. An isolated HTML/CSS reconstruction is a layout probe and cannot be reported as verification of the full DSH application.
For UI style/layout work, load the bundled ui-style-design skill. Choose mode="mobile" for an explicit phone mode: the tool creates an owned blank Chrome page, applies a mobile UA plus touch/coarse pointer, DPR and mobile viewport BEFORE the first DSH load, then authenticates, verifies browser properties and captures the real screen. DSH caches mobile-device detection, so changing size or UA after loading without a reload is insufficient. mode="desktop" uses a desktop UA/no-touch; mode="layout" and devicePreviewUrl are CSS layout probes only. Check browser.verified and emulationAppliedByTool, not just the requested mode. Missing Chrome tools or denied calls must never be described as working phone mode. Native permissions, guards and cancellation apply to every nested Chrome call. A browser simulation does not validate native Android, OS keyboard or safe-area behavior.
If startup or a build fails, inspect the returned log and exact error, correct the cause, and retry with new evidence. Continue authorized code work even if a particular visual check is unavailable. Report file changes, installation, activation, and visual inspection as separate observed facts; do not claim changes based only on proposed patches, reads, syntax checks, or git diff --check.`

function json(res, value, status = 200) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(value))
}

async function readJson(req) {
  let body = ''
  for await (const chunk of req) {
    body += chunk.toString()
    if (Buffer.byteLength(body) > 16 * 1024) throw new Error('请求内容过大')
  }
  const value = JSON.parse(body || '{}')
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('请求应为 JSON 对象')
  return value
}

function ownerOf(exec) {
  const owner = exec.agent?.session?.id ?? exec.agent?.id
  if (typeof owner !== 'string' || !owner) throw new Error('预览工具需要一个可识别的调用会话')
  return owner
}

export async function dispatch(manager, args, owner, signal) {
  switch (args.action) {
    case 'list': return { previews: await manager.list(owner) }
    case 'start': return manager.start(args, owner, signal)
    case 'status': return manager.status(args.preview_id, owner)
    case 'reload': return manager.reload(args.preview_id, owner, signal)
    case 'stop': return manager.stop(args.preview_id, owner)
    case 'configure_view': return manager.setViewport(args.preview_id, args.viewport, owner, args.mode)
    default: throw new Error('action 必须是 start、reload、status、list、configure_view 或 stop')
  }
}

export function apply(ctx) {
  const profile = ctx.get('profileContext')?.name || 'web'
  const manager = new PreviewManager({ profile })
  ctx.provide('pluginPreview', manager)
  const skill = bundledUiSkill()
  ctx.effect(() => ctx.skills.register(skill), 'plugin preview: bundled UI style design skill')
  ctx.effect(() => () => manager.dispose(), 'plugin preview: owned child runtimes')
  ctx.systemPrompt.section({ name: 'studio:plugin-preview:guidance', order: 780, text: PREVIEW_GUIDANCE, interpolate: false })
  const browserFor = caller => new BrowserPreview({
    schemas: () => ctx.tools.schemas(caller?.agent, caller?.toolSet),
    invoke: browserInvoker(ctx, caller), cleanupInvoke: browserInvoker(ctx),
  })
  async function run(args, owner, signal, caller) {
    if (['open_browser', 'capture'].includes(args.action)) {
      const item = manager.own(args.preview_id, owner)
      if (item.state !== 'ready') throw new Error('请先启动预览实例')
      const fused = AbortSignal.any([signal, item.lifecycle.signal])
      await browserFor(caller)[args.action === 'capture' ? 'capture' : 'open'](item, fused)
      return manager.describe(item)
    }
    const result = await dispatch(manager, args, owner, signal)
    if (['start', 'reload', 'configure_view'].includes(args.action)) {
      const item = manager.own(result.id, owner)
      if (item.mode !== 'layout') {
        try { await browserFor(caller).open(item, AbortSignal.any([signal, item.lifecycle.signal])) }
        catch (error) {
          const detail = redactLog(error.message)
          item.browser = { state: 'failed', mode: item.mode, verified: false, error: detail }
          throw new Error(`${item.mode === 'mobile' ? '手机模式' : '桌面模式'}未启用：${detail}；独立 DSH 已启动，preview_id=${item.id}。请启用/修复 Chrome 后调用 open_browser 重试，或 stop 关闭；不能报告浏览器模式成功。`)
        }
      } else if (item.closeBrowser) {
        await item.closeBrowser(); item.closeBrowser = undefined
        if (item.browser) { item.browser.state = 'closed'; item.browser.verified = false }
      }
      return manager.describe(item)
    }
    return result
  }
  ctx.tools.register(defineTool({
    name: 'plugin_preview',
    timeoutMs: 120000,
    description: 'Load built local plugins into an independent real DSH. Choose mode=mobile for actual Chrome phone mode: apply mobile UA, touch, mobile viewport and DPR before loading DSH, then verify and capture the real browser screen. DSH caches mobile detection; resizing alone is insufficient. mode=desktop explicitly uses desktop UA/no-touch. mode=layout (default) creates only a CSS viewport frame. start/reload/configure_view activate the requested browser mode; open_browser retries activation and capture refreshes the owned page screenshot. Inspect browser.verified/emulationAppliedByTool; missing, denied or failed Chrome tools do not count as success. Every Chrome call uses the native policy/guard pipeline with the caller scope. Artifact hashes and sourceChanged identify the loaded files; read actual errors and refresh after a build. start/reload require native full-access or per-call approval, without changing session permissions. Includes ui-style-design skill.',
    parameters: {
      action: { type: 'string', required: true, enum: ['start', 'reload', 'status', 'list', 'stop', 'configure_view', 'open_browser', 'capture'], description: 'Start/reload/configure_view automatically configure and verify Chrome when mode is mobile or desktop. open_browser retries browser activation; capture refreshes an owned browser screenshot. status/list/stop manage owned previews.' },
      mode: { type: 'string', enum: ['mobile', 'desktop', 'layout'], description: 'mobile: real Chrome mobile UA, touch/coarse pointer, DPR and mobile viewport BEFORE first DSH load, then verify and capture; desktop: real Chrome desktop UA/no-touch; layout (default): CSS dimensions only. mobile/desktop require enabled Chrome DevTools tools. Missing/denied tools leave browser.verified=false; never report phone mode from size alone.' },
      viewport: { type: 'object', additionalProperties: false, description: 'For start/configure_view: CSS viewport and DPR. With mode=mobile/desktop, apply and verify these settings in Chrome; with mode=layout they are layout recommendations only.', properties: {
        preset: { type: 'string', enum: ['phone-compact', 'phone', 'phone-large', 'tablet', 'desktop', 'custom'], description: '360x800, 390x844, 430x932, 768x1024, 1440x900, or custom (requires width/height).' },
        orientation: { type: 'string', enum: ['portrait', 'landscape'], description: 'Swap dimensions to portrait/landscape. Defaults to the preset aspect ratio.' },
        width: { type: 'number', description: 'CSS pixels: integer 240–4096.' }, height: { type: 'number', description: 'CSS pixels: integer 240–4096.' },
        deviceScaleFactor: { type: 'number', description: 'Chrome DPR recommendation: 0.5–4; default 3 for phone, 2 for tablet, 1 for desktop.' },
        isMobile: { type: 'boolean', description: 'Chrome mobile viewport behavior; defaults true for phone/tablet.' }, hasTouch: { type: 'boolean', description: 'Chrome touch emulation; defaults true for phone/tablet.' },
      } },
      plugin_paths: { type: 'array', items: { type: 'string' }, description: 'For start: 1-8 absolute directories with package.json, dsh.bundle.patch and built main/client exports. The selected packages run together. Build via normal shell tools first if required; preview does not run arbitrary build commands or install dependencies.' },
      preview_id: { type: 'string', description: 'Exact id returned by start/list, required for status/reload/stop. reload returns a NEW id and auth URL.' },
      copy_workflow_templates: { type: 'boolean', description: 'For start: optionally snapshot current DSH workflow template JSON into the preview (default false); database secret fields are redacted. Instances, service jobs, session history and account credentials are excluded.' },
      ttl_seconds: { type: 'number', description: 'For start: preview lifetime from 60 to 3600 seconds; default 900. Stop/reload do not restart production DSH.' },
    },
    output: { schema: { type: 'object', additionalProperties: true }, render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }] },
    async execute(args, exec) {
      if (process.env.DSH_PLUGIN_PREVIEW === '1' && ['start', 'reload'].includes(args.action)) throw new Error('预览实例不能递归启动另一个预览；请在原会话调用')
      const owner = ownerOf(exec)
      if (['start', 'reload'].includes(args.action)) {
        const policy = ctx.sandboxPolicy.resolve({ session: exec.agent.session })
        await approveEscalation({
          requestedMode: 'danger-full-access', effectiveMode: policy.mode, subject: 'plugin preview runtime',
          justification: 'Load the requested local plugin Host code in an independent DSH preview. This needs the same Host execution authority as plugin management and does not change session permission or sandbox mode.',
        }, { approver: ctx.get('approval'), agent: exec.agent, callId: exec.callId, toolName: 'plugin_preview', signal: exec.signal })
      }
      exec.signal.throwIfAborted()
      const result = await run(args, owner, exec.signal, exec)
      const browserTools = ctx.tools.schemas(exec.agent, exec.toolSet).map(tool => tool.name).filter(tool => /chrome[-_]devtools/i.test(tool))
      return { ...result, browserTools, designSkill: { name: skill.name, path: skill.path } }
    },
  }))

  ctx.effect(() => ctx.webServer.register({ kind: 'exact', path: '/studio/plugin-preview', handler: async (req, res) => {
    const rejection = ctx.connection.requestRejection(req)
    if (rejection) return json(res, { error: rejection === 401 ? '请先通过 DSH 原生认证' : '请求来源不受信任' }, rejection)
    if (req.headers['sec-fetch-site'] === 'cross-site') return json(res, { error: '跨站请求已拒绝' }, 403)
    const controller = new AbortController()
    const abort = () => { if (!res.writableEnded) controller.abort(new Error('预览管理页面已断开')) }
    res.once('close', abort)
    try {
      if (req.method === 'GET') return json(res, { previews: await manager.list('gui'), viewportPresets: VIEWPORT_PRESETS, designSkill: { name: skill.name, path: skill.path } })
      if (req.method !== 'POST') return json(res, { error: '不支持的请求方法' }, 405)
      const args = await readJson(req)
      if (process.env.DSH_PLUGIN_PREVIEW === '1' && ['start', 'reload'].includes(args.action)) throw new Error('请在原 DSH 的插件设置中启动预览')
      return json(res, await run(args, 'gui', controller.signal))
    } catch (error) {
      if (!res.destroyed) json(res, { error: redactLog(error.message) }, 400)
    } finally { res.removeListener('close', abort) }
  } }), 'plugin preview: authenticated management API')
  ctx.effect(() => ctx.webServer.register({ kind: 'exact', path: '/studio/plugin-preview-screenshot', handler: async (req, res) => {
    const rejection = ctx.connection.requestRejection(req)
    if (rejection || req.headers['sec-fetch-site'] === 'cross-site') return json(res, { error: 'DSH authentication required' }, rejection || 403)
    if (req.method !== 'GET') return json(res, { error: 'GET required' }, 405)
    try {
      const item = manager.own(new URL(req.url, 'http://dsh.invalid').searchParams.get('preview_id'), 'gui')
      if (!item.browserScreenshotPath) return json(res, { error: '尚未采集真实浏览器画面' }, 404)
      const bytes = await readFile(item.browserScreenshotPath)
      res.writeHead(200, { 'content-type': 'image/png', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }); res.end(bytes)
    } catch { return json(res, { error: '截图不存在' }, 404) }
  } }), 'plugin preview: authenticated real browser screenshots')
}

export default { name, inject, apply }
