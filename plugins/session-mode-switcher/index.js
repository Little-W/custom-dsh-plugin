export const name = '@agent-studio/plugin-session-mode-switcher'
export const inject = ['webServer', 'agents', 'agentPresets', 'sessionPersistence']

const routePath = '/studio/session-mode-switcher'

function reply(res, value, status = 200) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  res.end(JSON.stringify(value))
}

function isTrusted(req) {
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  if (!req.headers.origin) return true
  try { return new URL(req.headers.origin).host === req.headers.host }
  catch { return false }
}

async function readJson(req) {
  let data = ''
  for await (const chunk of req) {
    data += chunk.toString()
    if (data.length > 32_000) throw new Error('请求内容过大')
  }
  return JSON.parse(data || '{}')
}

function firstPromptTitle(events) {
  const event = events.find(item => item.type === 'user/message' && item.data?.source?.kind === 'user')
  if (!event || !Array.isArray(event.data.content)) return ''
  return event.data.content
    .filter(block => block?.type === 'text' && typeof block.text === 'string')
    .map(block => block.text)
    .join(' ')
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
}

function modeFromEvents(events, header) {
  const selection = events.findLast(item => item.type === 'agent-preset/selected')
  return selection?.data?.agentPreset || header.agentPreset || ''
}

async function mapLimit(values, limit, mapper) {
  const output = new Array(values.length)
  let cursor = 0
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, async () => {
    for (;;) {
      const index = cursor++
      if (index >= values.length) return
      output[index] = await mapper(values[index])
    }
  }))
  return output
}

async function storedEvents(persistence, id) {
  const handle = await persistence.open(id, 'read')
  try { return (await handle.read()).events }
  finally { await handle.close() }
}

async function sessionRows(ctx) {
  const persistence = ctx.get('sessionPersistence')
  const [snapshots, liveAgents] = await Promise.all([
    persistence.list(),
    Promise.resolve(ctx.agents.list()),
  ])
  const liveById = new Map(liveAgents.map(agent => [agent.id, agent]))
  const rows = await mapLimit(snapshots, 6, async snapshot => {
    const { header } = snapshot
    const agent = liveById.get(header.id)
    let events = []
    try { events = agent ? agent.session.snapshotEvents() : await storedEvents(persistence, header.id) }
    catch (error) { ctx.logger.warn(`Could not read session label ${header.id}: ${String(error)}`) }
    const explicitTitle = events.findLast(item => item.type === 'session/title')?.data?.title
    const title = typeof explicitTitle === 'string' && explicitTitle.trim()
      ? explicitTitle.trim()
      : Array.from(firstPromptTitle(events)).slice(0, 120).join('') || '未命名会话'
    const liveMode = agent
      ? ctx.agentPresets.composedPreset(agent.ctx)
        ?? ctx.agentPresets.presetForSession(agent.session)
        ?? ''
      : ''
    return {
      id: header.id,
      title,
      cwd: header.cwd || '',
      status: agent ? agent.status || 'idle' : 'unloaded',
      mode: liveMode || modeFromEvents(events, header),
      selectable: snapshot.formatStatus !== 'migration-required',
    }
  })
  return rows.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN') || a.id.localeCompare(b.id))
}

export function apply(ctx) {
  const server = ctx.get('webServer')
  const dispose = server.register({
    kind: 'exact',
    path: routePath,
    handler: async (req, res) => {
      if (!isTrusted(req)) return reply(res, { error: '跨站请求已拒绝' }, 403)
      try {
        if (req.method === 'GET') {
          const presets = (await ctx.agentPresets.list())
            .filter(preset => preset && typeof preset.id === 'string' && !preset.broken)
            .map(({ id, name, description }) => ({ id, name: name || id, description: description || '' }))
          return reply(res, { sessions: await sessionRows(ctx), presets })
        }
        if (req.method !== 'POST') return reply(res, { error: '不支持的请求方法' }, 405)

        const body = await readJson(req)
        const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
        const presetId = typeof body.presetId === 'string' ? body.presetId : ''
        const agent = sessionId ? ctx.agents.get(sessionId) : undefined
        const persistence = ctx.get('sessionPersistence')
        const stored = sessionId ? await persistence.stat(sessionId) : undefined
        if (!stored) return reply(res, { error: '找不到这个会话，列表可能已过期，请刷新后重试。' }, 404)
        if (stored.formatStatus === 'migration-required') return reply(res, { error: '该会话格式需要先完成迁移，暂时不能切换模式。' }, 409)
        if (agent?.status === 'running') return reply(res, { error: '会话仍在运行。请先暂停或等待本轮结束，再强制切换模式。' }, 409)
        const preset = await ctx.agentPresets.resolve(presetId)
        if (preset.broken) return reply(res, { error: `模式暂不可用：${preset.broken}` }, 400)

        // This deliberately bypasses the UI's first-turn guard in agentPresets.select.
        // recompose rebinds the existing scoped Agent to the chosen preset revision;
        // appending the event makes the choice survive a later session reload.
        if (agent) {
          const selected = await ctx.agentPresets.recompose(agent.ctx, presetId)
          agent.session.append('agent-preset/selected', { agentPreset: selected.id })
          try { ctx.emit('tools/change') } catch (error) { ctx.logger.warn(`Mode switch tools observer: ${String(error)}`) }
          return reply(res, { ok: true, sessionId, presetId: selected.id })
        }

        // A persisted session does not need to be loaded (and its agent loop
        // must not be started just to change a setting). Persist the same
        // selection event that preset reconstruction reads when it resumes.
        const handle = await persistence.open(sessionId, 'write')
        try {
          const events = (await handle.read()).events
          const lastSeq = events.at(-1)?.seq ?? -1
          await handle.append([{
            type: 'agent-preset/selected',
            seq: lastSeq + 1,
            time: Date.now(),
            data: { agentPreset: preset.id },
          }])
          await handle.flush()
        } finally { await handle.close() }
        return reply(res, { ok: true, sessionId, presetId: preset.id })
      } catch (error) {
        ctx.logger.warn(`Session mode switch failed: ${String(error)}`)
        return reply(res, { error: error instanceof Error ? error.message : String(error) }, 500)
      }
    },
  })
  ctx.effect(() => dispose, 'session mode switcher: API route')
}
