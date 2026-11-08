import React, { useCallback, useEffect, useState } from 'react'

const endpoint = '/studio/session-mode-switcher'
const styles = `
.studio-mode-settings{display:grid;gap:14px;max-width:760px;color:var(--dsw-alias-label-primary,#20242c);font:inherit}
.studio-mode-settings h3{margin:0;font-size:16px;font-weight:600}
.studio-mode-settings p{margin:-8px 0 2px;color:var(--dsw-alias-label-secondary,#687385);font-size:13px;line-height:1.6}
.studio-mode-settings__fields{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(180px,1fr);gap:12px}
.studio-mode-settings label{display:grid;gap:6px;font-size:13px;font-weight:500}
.studio-mode-settings select{box-sizing:border-box;width:100%;min-width:0;height:38px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2,#d9dee8);border-radius:8px;background:var(--dsw-alias-bg-layer-3,#fff);color:inherit;font:inherit;font-size:13px}
.studio-mode-settings select:focus-visible,.studio-mode-settings button:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,#4b7cff);outline-offset:2px}
.studio-mode-settings__actions{display:flex;align-items:center;gap:10px}
.studio-mode-settings button{height:34px;padding:0 14px;border:0;border-radius:8px;background:var(--dsw-alias-state-business-primary,#4b7cff);color:#fff;font:inherit;font-size:13px;cursor:pointer}
.studio-mode-settings button:disabled{opacity:.45;cursor:default}
.studio-mode-settings__secondary{background:var(--dsw-alias-bg-module-platform,#f3f5f8)!important;color:var(--dsw-alias-label-primary,#20242c)!important;border:1px solid var(--dsw-alias-border-l2,#d9dee8)!important}
.studio-mode-settings__note{padding:10px 12px;border-radius:8px;background:var(--dsw-alias-bg-module-platform,#f5f7fa);color:var(--dsw-alias-label-secondary,#687385);font-size:12px;line-height:1.6}
.studio-mode-settings__selected{display:grid;gap:4px;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2,#d9dee8);border-radius:8px;background:var(--dsw-alias-bg-layer-3,#fff);font-size:12px;color:var(--dsw-alias-label-secondary,#687385);overflow-wrap:anywhere}
.studio-mode-settings__selected strong{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#20242c)}
.studio-mode-settings__message{font-size:13px;color:var(--dsw-alias-label-secondary,#687385)}
.studio-mode-settings__message[data-error=true]{color:var(--dsw-alias-state-error-primary,#e5484d)}
@media(max-width:640px){.studio-mode-settings__fields{grid-template-columns:minmax(0,1fr)}}
`

type SessionRow = { id: string; title: string; cwd: string; status: string; mode: string; selectable: boolean }
type PresetRow = { id: string; name: string; description: string }
type SettingsData = { sessions: SessionRow[]; presets: PresetRow[] }

function SessionModeSettings() {
  const [data, setData] = useState<SettingsData>({ sessions: [], presets: [] })
  const [sessionId, setSessionId] = useState('')
  const [presetId, setPresetId] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  const refresh = useCallback(async (keepMessage = false) => {
    setLoading(true)
    if (!keepMessage) setMessage('')
    try {
      const response = await fetch(endpoint, { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || `读取失败（${response.status}）`)
      const next = { sessions: result.sessions || [], presets: result.presets || [] } as SettingsData
      setData(next)
      setSessionId(current => next.sessions.some(session => session.id === current && session.selectable)
        ? current
        : next.sessions.find(session => session.selectable)?.id || '')
      setPresetId(current => next.presets.some(preset => preset.id === current) ? current : '')
      setError(false)
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : String(cause))
      setError(true)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const selectedSession = data.sessions.find(session => session.id === sessionId)
  const targetMode = presetId || selectedSession?.mode || ''
  const statusLabel = (session: SessionRow) => session.status === 'running'
    ? '运行中'
    : session.status === 'unloaded'
      ? '未加载'
      : session.status === 'paused'
        ? '已暂停'
        : session.status === 'idle'
          ? '空闲'
          : session.status
  const switchMode = async () => {
    if (!sessionId || !targetMode || busy) return
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId, presetId: targetMode }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || `切换失败（${response.status}）`)
      setMessage('模式已切换。该会话后续轮次将使用新模式；已有消息和运行记录会保留。')
      setError(false)
      await refresh(true)
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : String(cause))
      setError(true)
    } finally { setBusy(false) }
  }

  return <section className="studio-mode-settings">
    <h3>会话模式切换</h3>
    <p>选择任意已保存的会话和目标模式。列表显示准确名称、工作目录与状态；未加载的会话也可以选择，转换会保留原有记录。</p>
    <div className="studio-mode-settings__fields">
      <label>目标会话
        <select value={sessionId} onChange={event => { setSessionId(event.target.value); setPresetId('') }} disabled={loading || !data.sessions.some(session => session.selectable)}>
          {data.sessions.length === 0 && <option value="">{loading ? '正在读取会话…' : '暂无会话'}</option>}
          {data.sessions.map(session => <option key={session.id} value={session.id} disabled={!session.selectable}>{session.title} · {statusLabel(session)} · {session.cwd || '无工作目录'} · {session.id}{session.selectable ? '' : ' · 格式暂不支持'}</option>)}
        </select>
      </label>
      <label>切换到模式
        <select value={targetMode} onChange={event => setPresetId(event.target.value)} disabled={loading || data.presets.length === 0}>
          {!targetMode && <option value="">选择模式</option>}
          {data.presets.map(preset => <option key={preset.id} value={preset.id}>{preset.name}</option>)}
        </select>
      </label>
    </div>
    {selectedSession && <div className="studio-mode-settings__selected">
      <strong>{selectedSession.title}</strong>
      <span>会话 ID：{selectedSession.id}</span>
      <span>工作目录：{selectedSession.cwd || '未设置'}</span>
      <span>状态：{statusLabel(selectedSession)}</span>
    </div>}
    <div className="studio-mode-settings__note">正在运行的会话不能中途更换执行环境。请先暂停或等待当前轮次结束，再执行强制转换。转换成功后会记录新的模式，重载会话时仍会沿用。</div>
    <div className="studio-mode-settings__actions">
      <button disabled={loading || busy || !sessionId || !targetMode || !selectedSession?.selectable || targetMode === selectedSession?.mode || selectedSession?.status === 'running'} onClick={() => void switchMode()}>{busy ? '正在切换…' : '强制转换模式'}</button>
      <button className="studio-mode-settings__secondary" disabled={loading || busy} onClick={() => void refresh()}>刷新</button>
      {selectedSession?.mode && <span className="studio-mode-settings__message">当前：{data.presets.find(preset => preset.id === selectedSession.mode)?.name || selectedSession.mode}</span>}
    </div>
    {message && <div className="studio-mode-settings__message" data-error={error}>{message}</div>}
  </section>
}

export const inject = []

export function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'studio-session-mode-switcher'
    style.textContent = styles
    document.head.append(style)
    return () => style.remove()
  }, 'session mode switcher: styles')

  ctx.inject(['slots'], child => {
    const slots = child.get('slots')
    child.effect(() => slots.inject('plugins.bundle.config', () => slots.register({
      name: 'plugins.bundle.config',
      key: '@agent-studio/plugin-session-mode-switcher',
    }, SessionModeSettings)), 'session mode switcher: settings panel')
  })
}
