window.__ModuleLoader__.load({ id: '@agent-studio/plugin-plugin-preview', factory: require => {
  const React = require('react')
  const h = React.createElement
  const endpoint = '/studio/plugin-preview'
  const styles = `
  .studio-preview{display:grid;gap:14px;max-width:900px;min-width:0;width:100%;color:var(--dsw-alias-label-primary,#20242c);font:inherit}.studio-preview *{box-sizing:border-box;min-width:0}
  .studio-preview h3{margin:0;font-size:16px}.studio-preview p{margin:0;font-size:13px;line-height:1.6;color:var(--dsw-alias-label-secondary,#687385)}
  .studio-preview label{display:grid;gap:6px;font-size:13px}.studio-preview textarea{box-sizing:border-box;min-height:88px;padding:9px 11px;border:1px solid var(--dsw-alias-border-l2,#d9dee8);border-radius:8px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;font:12px/1.6 ui-monospace,monospace;resize:vertical}
  .studio-preview__actions{display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:8px}.studio-preview button,.studio-preview a{display:inline-flex;align-items:center;justify-content:center;min-height:32px;box-sizing:border-box;padding:5px 11px;border:1px solid var(--dsw-alias-border-l2,#d9dee8);border-radius:7px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;font:inherit;font-size:12px;text-decoration:none;cursor:pointer}
  .studio-preview button:disabled{opacity:.5;cursor:default}.studio-preview button:focus-visible,.studio-preview a:focus-visible,.studio-preview textarea:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4b7cff);outline-offset:2px}
  .studio-preview__check{display:flex!important;align-items:center;gap:8px}.studio-preview__card{display:grid;gap:9px;padding:12px;border:1px solid var(--dsw-alias-border-l2,#d9dee8);border-radius:9px;overflow-wrap:anywhere}.studio-preview__card small{font:11px/1.5 ui-monospace,monospace;color:var(--dsw-alias-label-secondary,#687385)}
  .studio-preview__error{font-size:13px;color:var(--dsw-alias-state-error-primary,#dc2626)}
  .studio-preview figcaption{font-size:12px;line-height:1.5;color:var(--dsw-alias-label-secondary,#687385);margin-top:6px}
  .studio-preview__screen{display:block;width:100%;max-width:430px;height:auto;margin-inline:auto;border:1px solid var(--dsw-alias-border-l2,#d9dee8);border-radius:9px}.studio-preview__verified{color:var(--dsw-alias-state-success-primary,#168354)!important}
  .studio-preview__fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.studio-preview select,.studio-preview input[type=number]{width:100%;min-height:36px;padding:7px 9px;border:1px solid var(--dsw-alias-border-l2,#d9dee8);border-radius:7px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;font:inherit}.studio-preview__card strong{font-size:13px;overflow-wrap:anywhere}.studio-preview select:focus-visible,.studio-preview input:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#4b7cff);outline-offset:2px}
  @media(max-width:640px){.studio-preview__fields{grid-template-columns:1fr}.studio-preview button,.studio-preview a,.studio-preview select,.studio-preview input[type=number]{min-height:44px}.studio-preview__check{min-height:44px}}
  `
  async function api(body) {
    const response = await fetch(endpoint, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : {})
    const text = await response.text()
    let data
    try { data = JSON.parse(text) } catch { throw new Error(`预览接口返回了非 JSON 内容（HTTP ${response.status}）`) }
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`)
    return data
  }
  function Settings() {
    const [paths, setPaths] = React.useState('')
    const [snapshot, setSnapshot] = React.useState(false)
    const [previews, setPreviews] = React.useState([])
    const [busy, setBusy] = React.useState(false)
    const [error, setError] = React.useState('')
    const [presets, setPresets] = React.useState([])
    const [viewport, setViewport] = React.useState({ preset: 'phone', orientation: 'portrait' })
    const [mode, setMode] = React.useState('mobile')
    const refresh = React.useCallback(async () => { const data = await api(); setPreviews(data.previews); setPresets(data.viewportPresets || []) }, [])
    React.useEffect(() => { void refresh().catch(error => setError(error.message)) }, [refresh])
    async function run(body) {
      setBusy(true); setError('')
      try { await api(body) } catch (error) { setError(error.message) } finally { try { await refresh() } catch (error) { setError(error.message) } setBusy(false) }
    }
    return h('section', { className: 'studio-preview' },
      h('h3', null, '插件页面预览'),
      h('p', null, '在独立 DSH 中加载已构建插件。手机模式会先启用移动 UA、触控、DPR 和移动视口，再加载页面；通过 Chrome 开发者工具核验实际状态并采集画面。'),
      h('p', null, '包含 UI 界面风格设计 skill（ui-style-design），启用后可由智能体通过原生技能工具读取。'),
      h('label', null, '插件目录（每行一个绝对路径）', h('textarea', { value: paths, onChange: event => setPaths(event.target.value), placeholder: '/path/to/custom-dsh-plugin/plugins/visual-workflow', spellCheck: false })),
      h('div', { className: 'studio-preview__fields' },
        h('label', null, '运行模式', h('select', { value: mode, onChange: event => { setMode(event.target.value); if (event.target.value === 'desktop') setViewport({ preset: 'desktop', orientation: 'landscape' }); else if (event.target.value === 'mobile') setViewport({ preset: 'phone', orientation: 'portrait' }) } }, h('option', { value: 'mobile' }, '手机模式 · 移动 UA / 触控'), h('option', { value: 'desktop' }, '桌面模式 · 鼠标 / 桌面 UA'), h('option', { value: 'layout' }, '仅布局视口 · 不启用手机模式'))),
        h('label', null, '预览设备', h('select', { value: viewport.preset, onChange: event => setViewport(event.target.value === 'custom' ? { preset: 'custom', width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true, orientation: 'portrait' } : { preset: event.target.value, orientation: event.target.value === 'desktop' ? 'landscape' : 'portrait' }) }, ...presets.map(preset => h('option', { value: preset.id, key: preset.id }, `${preset.label} · ${preset.width} × ${preset.height}`)), h('option', { value: 'custom' }, '自定义尺寸'))),
        h('label', null, '屏幕方向', h('select', { value: viewport.orientation, onChange: event => setViewport({ ...viewport, orientation: event.target.value }) }, h('option', { value: 'portrait' }, '竖屏'), h('option', { value: 'landscape' }, '横屏'))),
        ...(viewport.preset === 'custom' ? [['width', '宽度（CSS px）', 240, 4096, 1], ['height', '高度（CSS px）', 240, 4096, 1], ['deviceScaleFactor', 'Chrome 像素比（DPR）', 0.5, 4, 0.5]].map(([key, label, min, max, step]) => h('label', { key }, label, h('input', { type: 'number', min, max, step, value: viewport[key], onChange: event => setViewport({ ...viewport, [key]: Number(event.target.value) }) }))) : [])),
      h('p', null, mode === 'layout' ? '仅改变布局尺寸，不启用手机行为。' : '需要启用 Chrome 开发者工具插件。每次切换模式会先配置空白标签页再加载 DSH，使手机行为检测在首次渲染时生效；下方显示真实浏览器截图。'),
      h('label', { className: 'studio-preview__check' }, h('input', { type: 'checkbox', checked: snapshot, onChange: event => setSnapshot(event.target.checked) }), '复制当前工作流模板快照'),
      h('div', { className: 'studio-preview__actions' },
        h('button', { disabled: busy, onClick: () => void refresh().catch(error => setError(error.message)) }, '刷新'),
        h('button', { disabled: busy || !paths.trim(), onClick: () => void run({ action: 'start', plugin_paths: paths.split('\n').map(value => value.trim()).filter(Boolean), copy_workflow_templates: snapshot, viewport, mode }) }, busy ? '处理中…' : '启动预览')),
      error ? h('div', { className: 'studio-preview__error', role: 'alert' }, error) : null,
      ...previews.map(item => h('article', { className: 'studio-preview__card', key: item.id },
        h('strong', null, item.plugins.map(plugin => `${plugin.name} ${plugin.version}`).join(' · ')),
        h('p', null, `状态：${({ starting: '启动中', ready: '可访问', stopped: '已停止', failed: '失败' })[item.state] || item.state} · 模板快照 ${item.workflowTemplateCount} 个`),
        item.viewport ? h('p', null, `布局视口 ${item.viewport.width} × ${item.viewport.height} · ${item.viewport.orientation === 'landscape' ? '横屏' : '竖屏'} · Chrome DPR ${item.viewport.deviceScaleFactor}${item.viewport.hasTouch ? ' · 支持触控仿真' : ''}`) : null,
        item.mode !== 'layout' ? h('p', { className: item.emulationAppliedByTool ? 'studio-preview__verified' : 'studio-preview__error' }, item.emulationAppliedByTool ? `${item.mode === 'mobile' ? '手机模式' : '桌面模式'}已核验 · Chrome 标签页 ${item.browser.pageId} · 触控点 ${item.browser.verification.touchPoints} · ${item.browser.verification.mobileUa ? '移动 UA' : '桌面 UA'}` : `${item.mode === 'mobile' ? '手机模式' : '桌面模式'}尚未启用${item.browser?.error ? '：' + item.browser.error : ''}`) : h('p', null, '仅布局预览：未启用手机模式'),
        item.screenshotUrl ? h('figure', { style: { margin: 0 } }, h('img', { className: 'studio-preview__screen', src: item.screenshotUrl, alt: `${item.mode === 'mobile' ? '手机' : '桌面'}模式的真实 Chrome 页面截图` }), h('figcaption', null, `真实浏览器画面 · ${item.browser?.screenshotAt || '上次快照'}；使用 Chrome 工具交互后可刷新画面。`)) : null,
        item.browser?.screenshotError ? h('p', { className: 'studio-preview__error' }, `截图未获取：${item.browser.screenshotError}`) : null,
        ...item.plugins.map(plugin => h('small', { key: plugin.name }, `${plugin.clientPath || '仅服务端'} · SHA-256 ${plugin.clientSha256 || plugin.artifactHash}${plugin.sourceChanged ? ' · 源码已变化，请更新预览' : ''}`)),
        item.error ? h('div', { className: 'studio-preview__error' }, item.error) : null,
        h('small', null, `日志：${item.logPath || '尚未创建'} · 到期 ${item.expiresAt}`),
        h('div', { className: 'studio-preview__actions' },
          item.devicePreviewUrl ? h('a', { href: item.devicePreviewUrl, target: '_blank', rel: 'noopener noreferrer' }, '仅布局设备框') : null,
          item.loginUrl ? h('a', { href: item.loginUrl, target: '_blank', rel: 'noopener noreferrer', title: '普通浏览器链接不会应用手机模式；真实模式由受控 Chrome 标签页和画面提供' }, '普通浏览器访问') : null,
          h('button', { disabled: busy || item.state !== 'ready', onClick: () => void run({ action: 'configure_view', preview_id: item.id, viewport, mode }) }, '应用模式与视口'),
          item.mode !== 'layout' ? h('button', { disabled: busy || item.state !== 'ready', onClick: () => void run({ action: 'open_browser', preview_id: item.id }) }, item.emulationAppliedByTool ? '重新打开浏览器' : '启用真实浏览器模式') : null,
          item.emulationAppliedByTool ? h('button', { disabled: busy, onClick: () => void run({ action: 'capture', preview_id: item.id }) }, '刷新真实画面') : null,
          h('button', { disabled: busy || item.state !== 'ready', onClick: () => void run({ action: 'reload', preview_id: item.id }) }, '更新预览'),
          h('button', { disabled: busy || !['ready', 'starting'].includes(item.state), onClick: () => void run({ action: 'stop', preview_id: item.id }) }, '关闭')))))
  }
  return {
    inject: ['slots'],
    apply(ctx) {
      ctx.effect(() => { const style = document.createElement('style'); style.textContent = styles; style.dataset.plugin = 'studio-plugin-preview'; document.head.append(style); return () => style.remove() }, 'plugin preview: styles')
      ctx.effect(() => ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({ name: 'plugins.bundle.config', key: '@agent-studio/plugin-plugin-preview' }, Settings)), 'plugin preview: settings')
    },
  }
} })
