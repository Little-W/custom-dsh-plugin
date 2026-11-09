import { spawn } from 'node:child_process'
import { createHash, randomUUID } from 'node:crypto'
import { access, appendFile, chmod, copyFile, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rm, stat, symlink, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { normalizeViewport, chromeEmulation, devicePreviewUrl } from './devices.js'

const PACKAGE_NAME = /^(?:@[a-zA-Z0-9._-]+\/)?[a-zA-Z0-9._-]+$/
const DEFAULT_BUNDLES = ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app', '@deepseek-ai/dsh-experimental-agent-team-profile']
const MAX_COPY_BYTES = 256 * 1024 * 1024
const MAX_COPY_FILES = 20000

export function inside(root, target) {
  const tail = relative(root, target)
  return tail === '' || (tail !== '..' && !tail.startsWith('..' + sep) && !isAbsolute(tail))
}

async function exists(path) {
  try { await access(path); return true } catch (error) { if (error.code === 'ENOENT') return false; throw error }
}

function defaultExport(value) {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return undefined
  return defaultExport(value.default ?? value.import ?? value.browser)
}

async function packageFile(root, path, label) {
  if (typeof path !== 'string' || !path || isAbsolute(path)) throw new Error(`${label} 必须指向插件目录内的构建文件`)
  const target = resolve(root, path)
  if (!inside(root, target) || !inside(root, await realpath(target))) throw new Error(`${label} 越出插件目录`)
  if (!(await stat(target)).isFile()) throw new Error(`${label} 不是文件`)
  return target
}

async function packageDigest(root) {
  const hash = createHash('sha256')
  let bytes = 0, files = 0
  async function visit(path, logical) {
    const info = await lstat(path)
    if (info.isSymbolicLink()) {
      const physical = await realpath(path)
      if (!inside(root, physical) || !(await stat(physical)).isFile()) throw new Error(`插件文件链接不在包内或指向目录：${logical}`)
      return visit(physical, logical)
    }
    if (info.isDirectory()) {
      for (const entry of (await readdir(path)).sort()) {
        if (['node_modules', '.git'].includes(entry)) continue
        await visit(join(path, entry), logical ? logical + '/' + entry : entry)
      }
    } else if (info.isFile()) {
      bytes += info.size; files += 1
      if (bytes > MAX_COPY_BYTES || files > MAX_COPY_FILES) throw new Error('插件包超过预览读取上限（256MB / 20000 文件）')
      hash.update(logical).update('\0').update(await readFile(path)).update('\0')
    }
  }
  await visit(root, '')
  return hash.digest('hex')
}

export async function inspectPackage(input) {
  if (typeof input !== 'string' || !isAbsolute(input)) throw new Error('plugin_paths 必须是插件目录的绝对路径')
  const root = await realpath(input)
  const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  if (!PACKAGE_NAME.test(pkg.name ?? '') || typeof pkg.version !== 'string') throw new Error('插件缺少有效的 name/version')
  await packageFile(root, pkg.dsh?.bundle?.patch, 'dsh.bundle.patch')
  await packageFile(root, pkg.main ?? defaultExport(pkg.exports?.['.']), 'main')
  const clientExport = defaultExport(pkg.exports?.['./client'])
  const client = clientExport ? await packageFile(root, clientExport, 'exports[./client]') : undefined
  if (pkg.dsh?.client && !client) throw new Error('插件声明了客户端但缺少 ./client 构建产物；请先运行该插件已有的构建脚本')
  return {
    path: root, name: pkg.name, version: pkg.version,
    artifactHash: await packageDigest(root),
    clientPath: client ? relative(root, client) : null,
    clientSha256: client ? createHash('sha256').update(await readFile(client)).digest('hex') : null,
  }
}

export function previewEnvironment(parent, home, readyPath, expiresAt) {
  const env = {}
  for (const [key, value] of Object.entries(parent)) {
    if (/^(?:PATH|HOME|USERPROFILE|HOMEDRIVE|HOMEPATH|APPDATA|LOCALAPPDATA|SystemRoot|SYSTEMROOT|WINDIR|TEMP|TMP|TMPDIR|LANG|LC_.*|DISPLAY|WAYLAND_DISPLAY|XDG_RUNTIME_DIR|DSH_LOCALE|DSH_CLIENT_VERSION)$/i.test(key)) env[key] = value
  }
  return {
    ...env, DSH_HOME: home, ELECTRON_RUN_AS_NODE: '1', DSH_PLUGIN_PREVIEW: '1',
    DSH_PLUGIN_PREVIEW_PARENT_PID: String(process.pid),
    DSH_PLUGIN_PREVIEW_EXPIRES_AT: String(expiresAt), DSH_PLUGIN_PREVIEW_READY_PATH: readyPath,
  }
}

export function redactLog(text) {
  return text.replace(/([?&]token=)[^\s&"'<>]+/g, '$1[redacted]')
}

export async function discoverRuntime(entry = process.argv.find(arg => /[/\\]bin\.[cm]?js$/.test(arg))) {
  if (!entry || !isAbsolute(entry) || !await exists(entry)) throw new Error('无法定位当前 DSH CLI 入口；请从 DSH 内调用预览工具')
  const archive = entry.indexOf('app.asar' + sep)
  const resources = archive >= 0 ? dirname(entry.slice(0, archive) + 'app.asar') : undefined
  const wrapper = resources ? join(resources, 'harness-node-entry.mjs') : undefined
  const fallback = resources ? join(resources, 'app.asar/node_modules/dsh-desktop-hmr-fallback/index.js') : undefined
  return {
    executable: process.execPath,
    args: wrapper && await exists(wrapper) ? ['--expose-internals', wrapper, entry] : ['--expose-internals', entry],
    hmrFallback: fallback && await exists(fallback) ? fallback : undefined,
  }
}

async function copyPackage(source, target, signal) {
  let bytes = 0, count = 0
  async function copy(from, to) {
    signal?.throwIfAborted()
    const info = await lstat(from)
    if (info.isSymbolicLink()) {
      const physical = await realpath(from)
      if (!inside(source, physical) || !(await stat(physical)).isFile()) throw new Error(`插件文件链接不在包内或指向目录：${from}`)
      return copy(physical, to)
    }
    if (info.isDirectory()) {
      await mkdir(to, { recursive: true })
      for (const entry of (await readdir(from)).sort()) {
        if (['node_modules', '.git'].includes(entry)) continue
        await copy(join(from, entry), join(to, entry))
      }
    } else if (info.isFile()) {
      bytes += info.size; count += 1
      if (bytes > MAX_COPY_BYTES || count > MAX_COPY_FILES) throw new Error('插件包超过预览复制上限（256MB / 20000 文件），请使用构建输出包')
      await copyFile(from, to)
    }
  }
  await copy(source, target)
}

async function linkDirectory(source, target) {
  await mkdir(dirname(target), { recursive: true })
  await symlink(source, target, process.platform === 'win32' ? 'junction' : 'dir')
}

async function dependencyRoot(plugin, parentHome, profile) {
  const direct = join(plugin.path, 'node_modules')
  if (await exists(direct)) return realpath(direct)
  const installed = join(parentHome, 'profiles', profile, 'node_modules', plugin.name)
  if (!await exists(installed)) return undefined
  let path = await realpath(installed)
  if (await exists(join(path, 'node_modules'))) return realpath(join(path, 'node_modules'))
  while (dirname(path) !== path) {
    if (basename(path) === 'node_modules') return path
    path = dirname(path)
  }
  return undefined
}

async function copyWorkflowTemplates(from, home, signal) {
  const source = join(from, 'visual-workflow', 'flow-templates')
  if (!await exists(source)) return 0
  const target = join(home, 'visual-workflow', 'flow-templates')
  await mkdir(target, { recursive: true })
  let count = 0
  for (const name of await readdir(source)) {
    signal?.throwIfAborted()
    if (!name.endsWith('.json')) continue
    const file = join(source, name)
    const info = await lstat(file)
    if (!info.isFile() || info.size > 8 * 1024 * 1024) throw new Error(`工作流模板快照文件无效或过大：${name}`)
    if (++count > 200) throw new Error('工作流模板快照最多 200 个文件')
    const data = await readFile(file, 'utf8')
    const snapshot = JSON.parse(data, (key, value) => /^(?:password|apiKey|api_key|token|secret|accessToken|refreshToken|authorization)$/i.test(key) ? '' : value)
    await writeFile(join(target, name), JSON.stringify(snapshot), { mode: 0o600 })
  }
  return count
}

const delay = (ms, signal) => new Promise((resolvePromise, reject) => {
  if (signal?.aborted) return reject(signal.reason)
  const done = () => { signal?.removeEventListener('abort', abort); resolvePromise() }
  const timer = setTimeout(done, ms)
  const abort = () => { clearTimeout(timer); signal.removeEventListener('abort', abort); reject(signal.reason) }
  signal?.addEventListener('abort', abort, { once: true })
})

export class PreviewManager {
  constructor({ parentHome = process.env.DSH_HOME || join(homedir(), '.dsh'), profile = 'web', runtime, spawnProcess = spawn, startupTimeoutMs = 45000 } = {}) {
    this.parentHome = parentHome
    this.profile = profile
    this.runtime = runtime
    this.spawnProcess = spawnProcess
    this.startupTimeoutMs = startupTimeoutMs
    this.previews = new Map()
    this.disposed = false
  }

  own(id, owner) {
    const item = this.previews.get(id)
    if (!item || (owner !== 'gui' && item.owner !== owner)) throw new Error('找不到属于当前会话的预览实例')
    return item
  }

  async list(owner) {
    return Promise.all([...this.previews.values()].filter(item => owner === 'gui' || item.owner === owner).map(item => this.describe(item)))
  }

  async describe(item) {
    const current = await Promise.all(item.plugins.map(async plugin => {
      try { const now = await inspectPackage(plugin.path); return { ...plugin, sourceChanged: now.artifactHash !== plugin.artifactHash } }
      catch (error) { return { ...plugin, sourceChanged: true, sourceError: error.message } }
    }))
    return {
      id: item.id, state: item.state, pid: item.child?.pid ?? null,
      origin: item.origin ?? null, loginUrl: item.state === 'ready' ? item.loginUrl : null,
      mode: item.mode, viewport: item.viewport, chromeEmulation: chromeEmulation(item.viewport),
      devicePreviewUrl: item.state === 'ready' ? devicePreviewUrl(item.devicePreviewUrl, item.viewport) : null,
      browser: item.browser ?? { state: 'not-started', verified: false },
      screenshotUrl: item.browserScreenshotPath && item.browser?.verified && item.browser?.screenshotAt ? `/studio/plugin-preview-screenshot?preview_id=${encodeURIComponent(item.id)}&v=${encodeURIComponent(item.browser.screenshotAt)}` : null,
      emulationAppliedByTool: item.state === 'ready' && item.browser?.verified === true && item.browser.mode === item.mode,
      expiresAt: new Date(item.expiresAt).toISOString(), logPath: item.logPath,
      plugins: current, workflowTemplateCount: item.workflowTemplateCount,
      runtimeKind: 'isolated-dsh', hostCredentialsCopied: false,
      visualVerification: 'not-performed-by-this-tool',
      error: item.error ?? null,
      nextSteps: ['在 Chrome 开发者工具中打开 loginUrl，使用原生认证进入真实 DSH。', '通过真实界面打开目标插件，检查页面、交互、控制台并截图。', '修改后调用 reload，重新打开返回的新 loginUrl；确认 sourceChanged=false。', '仅按实际工具结果汇报：启动成功不等于视觉验证通过。'],
    }
  }

  async start(args, owner, signal) {
    signal?.throwIfAborted()
    if (this.disposed) throw new Error('预览管理器已关闭')
    if (!Array.isArray(args.plugin_paths) || args.plugin_paths.length < 1 || args.plugin_paths.length > 8) throw new Error('plugin_paths 需要 1 至 8 个已构建插件目录')
    const active = [...this.previews.values()].filter(item => item.state !== 'stopped' && item.state !== 'failed')
    if (active.length >= 2) throw new Error('最多同时运行两个预览，请先关闭一个')
    const ttl = args.ttl_seconds ?? 900
    const mode = args.mode ?? 'layout'
    if (!['mobile', 'desktop', 'layout'].includes(mode)) throw new Error('mode 必须是 mobile、desktop 或 layout')
    const selectedViewport = normalizeViewport(args.viewport ?? (mode === 'mobile' ? { preset: 'phone' } : {}))
    const viewport = normalizeViewport({ ...selectedViewport, ...(mode !== 'layout' ? { isMobile: mode === 'mobile', hasTouch: mode === 'mobile' } : {}) })
    if (!Number.isInteger(ttl) || ttl < 60 || ttl > 3600) throw new Error('ttl_seconds 必须为 60 至 3600 的整数')
    const plugins = await Promise.all(args.plugin_paths.map(inspectPackage))
    if (new Set(plugins.map(item => item.name)).size !== plugins.length) throw new Error('同一预览不能加载两个同名插件')
    // Reserve capacity before the first staging await; simultaneous starts cannot exceed the limit.
    if (this.disposed) throw new Error('预览管理器已关闭')
    if ([...this.previews.values()].filter(item => !['stopped', 'failed'].includes(item.state)).length >= 2) throw new Error('预览实例数量已达上限')
    const lifecycle = new AbortController()
    signal = signal ? AbortSignal.any([signal, lifecycle.signal]) : lifecycle.signal
    const item = { id: randomUUID(), owner, plugins, lifecycle, mode, viewport, args: { plugin_paths: plugins.map(p => p.path), ttl_seconds: ttl, copy_workflow_templates: args.copy_workflow_templates === true, viewport, mode }, state: 'starting', expiresAt: Date.now() + ttl * 1000, workflowTemplateCount: 0, busy: false }
    this.previews.set(item.id, item)
    try {
      const root = join(this.parentHome, 'plugin-previews')
      await mkdir(root, { recursive: true, mode: 0o700 })
      item.home = await mkdtemp(join(root, 'preview-'))
      await chmod(item.home, 0o700)
      const profile = join(item.home, 'profiles', 'preview')
      await mkdir(join(profile, 'node_modules'), { recursive: true })
      for (const plugin of plugins) {
        signal?.throwIfAborted()
        const staged = join(item.home, 'plugins', plugin.name.replaceAll('/', '+'))
        await copyPackage(plugin.path, staged, signal)
        const dependencies = await dependencyRoot(plugin, this.parentHome, this.profile)
        if (dependencies) await linkDirectory(dependencies, join(staged, 'node_modules'))
        await linkDirectory(staged, join(profile, 'node_modules', plugin.name))
        const copied = await inspectPackage(staged)
        if (copied.artifactHash !== plugin.artifactHash) throw new Error('插件在预览复制期间发生变化，请完成构建后重试')
      }
      if (args.copy_workflow_templates === true) item.workflowTemplateCount = await copyWorkflowTemplates(this.parentHome, item.home, signal)
      await writeFile(join(profile, 'package.json'), JSON.stringify({
        name: 'dsh-profile-plugin-preview', private: true,
        dependencies: Object.fromEntries(plugins.map(plugin => [plugin.name, 'file:' + join(item.home, 'plugins', plugin.name.replaceAll('/', '+'))])),
        dsh: { profile: { bundles: [...DEFAULT_BUNDLES, ...plugins.map(p => p.name)] } },
      }, null, 2))
      const runtime = this.runtime ?? await discoverRuntime()
      const lifecycle = pathToFileURL(fileURLToPath(new URL('./preview-lifecycle.js', import.meta.url))).href
      const rows = [{ id: 'plugin-preview-lifecycle', name: lifecycle }]
      if (runtime.hmrFallback) rows.push({ id: 'plugin-preview-hmr-fallback', name: pathToFileURL(runtime.hmrFallback).href })
      // JSON is a YAML subset; values stay data, never !!js expressions supplied by callers.
      await writeFile(join(profile, 'cordis.patch.yml'), JSON.stringify([{ insert: rows }]))
      item.logPath = join(item.home, 'preview.log')
      await writeFile(item.logPath, '', { mode: 0o600 })
      const readyPath = join(item.home, 'ready.json')
      signal?.throwIfAborted()
      item.child = this.spawnProcess(runtime.executable, [...runtime.args, '--profile', 'preview', '--no-open', '--host', '127.0.0.1', '--port', '0'], {
        cwd: item.home, env: previewEnvironment(process.env, item.home, readyPath, item.expiresAt),
        detached: process.platform !== 'win32', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
      })
      item.child.once('error', error => { item.error = error.message; item.state = 'failed' })
      item.child.once('exit', (code, exitSignal) => {
        clearTimeout(item.expiryTimer)
        if (item.state === 'stopped') return
        item.error = `预览进程退出（code=${code}, signal=${exitSignal}）`
        item.state = 'failed'
      })
      // Buffer by line so a token split across stdout chunks cannot leak into diagnostics.
      let logBytes = 0
      item.logWrites = Promise.resolve()
      const createLog = () => {
        let logTail = ''
        return chunk => {
        logTail += chunk.toString()
        const end = logTail.lastIndexOf('\n')
        if (end < 0) return
        const safe = redactLog(logTail.slice(0, end + 1)); logTail = logTail.slice(end + 1)
        if (logBytes >= 256 * 1024) return
        const bounded = safe.slice(0, 256 * 1024 - logBytes); logBytes += Buffer.byteLength(bounded)
        item.logWrites = item.logWrites.then(() => appendFile(item.logPath, bounded)).catch(() => {})
        }
      }
      item.child.stdout.on('data', createLog()); item.child.stderr.on('data', createLog())
      item.expiryTimer = setTimeout(() => { void this.stop(item.id, item.owner) }, Math.max(0, item.expiresAt - Date.now()))
      item.expiryTimer.unref()
      const deadline = Date.now() + this.startupTimeoutMs
      while (Date.now() < deadline) {
        signal?.throwIfAborted()
        if (item.state === 'failed') throw new Error(item.error)
        if (await exists(readyPath)) {
          const ready = JSON.parse(await readFile(readyPath, 'utf8'))
          const url = new URL(ready.loginUrl)
          if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || !url.searchParams.get('token') || url.origin !== ready.origin) throw new Error('预览实例返回了无效的本机认证地址')
          item.origin = ready.origin; item.loginUrl = ready.loginUrl
          if (ready.devicePreviewUrl) {
            const deviceUrl = new URL(ready.devicePreviewUrl)
            if (deviceUrl.origin !== url.origin || deviceUrl.pathname !== '/studio/plugin-preview-device' || !deviceUrl.searchParams.get('token')) throw new Error('预览实例返回了无效的设备预览地址')
            item.devicePreviewUrl = ready.devicePreviewUrl
          }
          await rm(readyPath, { force: true })
          const response = await fetch(item.loginUrl, { redirect: 'manual', signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(3000)]) : AbortSignal.timeout(3000) })
          await response.body?.cancel()
          if (![302, 303].includes(response.status) || !response.headers.get('set-cookie')) throw new Error(`预览认证握手失败：HTTP ${response.status}`)
          item.state = 'ready'
          return this.describe(item)
        }
        await delay(100, signal)
      }
      throw new Error('预览启动超时；请查看 preview.log 的真实加载错误，不要声称预览成功')
    } catch (error) {
      const cancelled = signal?.aborted
      const reason = signal?.reason
      const stopped = item.state === 'stopped'
      await this.stop(item.id, owner)
      item.state = stopped ? 'stopped' : 'failed'; item.error = error.message
      if (cancelled) throw reason
      throw new Error(`${error.message}${item.logPath ? `；日志：${item.logPath}` : ''}`, { cause: error })
    }
  }

  async status(id, owner) { return this.describe(this.own(id, owner)) }

  async setViewport(id, viewport, owner, mode) {
    const item = this.own(id, owner)
    if (item.state !== 'ready') throw new Error('仅可配置正在运行的预览视口')
    if (item.browserBusy) throw new Error('浏览器正在配置，请等待当前操作完成')
    mode ??= item.mode
    if (!['mobile', 'desktop', 'layout'].includes(mode)) throw new Error('mode 必须是 mobile、desktop 或 layout')
    item.viewport = normalizeViewport({ ...normalizeViewport(viewport ?? item.viewport), ...(mode !== 'layout' ? { isMobile: mode === 'mobile', hasTouch: mode === 'mobile' } : {}) })
    item.mode = mode
    item.args.mode = mode
    if (item.browser) item.browser.verified = false
    item.args.viewport = item.viewport
    return this.describe(item)
  }

  async stop(id, owner) {
    const item = this.own(id, owner)
    if (item.stopping) return item.stopping
    item.stopping = (async () => {
      item.lifecycle?.abort(new Error('预览实例已停止'))
      item.state = 'stopped'
      clearTimeout(item.expiryTimer)
      await item.closeBrowser?.()
      if (item.browser) { item.browser.state = 'closed'; item.browser.verified = false }
      const child = item.child
      if (child?.pid && child.exitCode === null && child.signalCode === null) {
        const terminate = async force => {
          if (process.platform === 'win32') {
            await new Promise(resolvePromise => {
              const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', ...(force ? ['/F'] : [])], { windowsHide: true, stdio: 'ignore' })
              killer.once('error', resolvePromise); killer.once('exit', resolvePromise)
            })
          } else {
            try { process.kill(-child.pid, force ? 'SIGKILL' : 'SIGTERM') }
            catch (error) { if (error.code !== 'ESRCH') throw error }
          }
        }
        await terminate(false)
        const deadline = Date.now() + 5000
        while (child.exitCode === null && child.signalCode === null && Date.now() < deadline) await delay(50)
        if (child.exitCode === null && child.signalCode === null) await terminate(true)
        if (child.exitCode === null && child.signalCode === null) await new Promise(resolvePromise => child.once('exit', resolvePromise))
      }
      await item.logWrites
      return { id, state: 'stopped' }
    })()
    return item.stopping
  }

  async reload(id, owner, signal) {
    const item = this.own(id, owner)
    if (item.busy) throw new Error('这个预览正在更新')
    item.busy = true
    try { await this.stop(id, owner); return await this.start(item.args, item.owner, signal) }
    finally { item.busy = false }
  }

  async dispose() {
    this.disposed = true
    await Promise.allSettled([...this.previews.values()].map(item => this.stop(item.id, item.owner)))
  }
}
