import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { apply, inject } from './index.js'

function setup({ running = false } = {}) {
  const calls = []
  const eventStore = new Map([
    ['session-1', [
      { type: 'session/title', seq: 0, data: { title: '已命名会话' } },
    ]],
    ['session-2', [
      { type: 'user/message', seq: 0, data: { source: { kind: 'user' }, content: [{ type: 'text', text: '为第二个工程修复综合时序' }] } },
      { type: 'agent-preset/selected', seq: 1, data: { agentPreset: 'ptc' } },
    ]],
  ])
  const agent = {
    id: 'session-1', status: running ? 'running' : 'idle',
    session: {
      header: { id: 'session-1', cwd: '/work/project', agentPreset: 'standard' },
      snapshotEvents() { return eventStore.get('session-1') },
      append(type, data) { calls.push(['append', type, data]); eventStore.get('session-1').push({ type, seq: eventStore.get('session-1').length, time: Date.now(), data }) },
    },
    ctx: { key: 'agent-scope' },
  }
  let route
  const context = {
    agents: { list: () => [agent], get: id => id === agent.id ? agent : undefined },
    sessionPersistence: {
      async list() { return [...eventStore.keys()].map(id => ({ header: { id, version: 4, cwd: id === 'session-1' ? '/work/project' : '/work/second', agentPreset: id === 'session-1' ? 'standard' : undefined }, formatStatus: 'current' })) },
      async stat(id) { return eventStore.has(id) ? { header: { id, version: 4 }, formatStatus: 'current' } : undefined },
      async open(id, access) {
        const events = eventStore.get(id)
        if (!events) throw new Error('not found')
        return {
          async read() { return { events } },
          async append(batch) { events.push(...batch) },
          async flush() {}, async close() {},
        }
      },
    },
    agentPresets: {
      async list() { return [{ id: 'standard', name: '标准', broken: false }, { id: 'ptc', name: 'PTC', broken: false }] },
      composedPreset() { return 'standard' },
      presetForSession() { return 'standard' },
      async resolve(id) { return { id } },
      async recompose(ctx, id) { calls.push(['recompose', ctx, id]); return { id } },
    },
    get(name) {
      if (name === 'webServer') return { register(value) { route = value; return () => { route = undefined } } }
      if (name === 'sessionPersistence') return context.sessionPersistence
      assert.fail(`unexpected service ${name}`)
    },
    effect(callback) { callback() },
    emit() {},
    logger: { warn() {} },
  }
  apply(context)
  return { calls, agent, route, eventStore }
}

function response() {
  return {
    status: 200,
    writeHead(status) { this.status = status },
    end(body) { this.body = JSON.parse(body) },
  }
}

async function request(route, method, body = '') {
  const req = {
    method,
    headers: { host: 'localhost', origin: 'http://localhost' },
    async *[Symbol.asyncIterator]() { if (body) yield Buffer.from(body) },
  }
  const res = response()
  await route.handler(req, res)
  return res
}

test('settings endpoint lists all stored sessions with their title and persisted mode', async () => {
  const { route } = setup()
  const res = await request(route, 'GET')
  assert.equal(res.status, 200)
  assert.equal(res.body.sessions.length, 2)
  const loaded = res.body.sessions.find(row => row.id === 'session-1')
  const unloaded = res.body.sessions.find(row => row.id === 'session-2')
  assert.equal(loaded.title, '已命名会话')
  assert.equal(loaded.mode, 'standard')
  assert.equal(unloaded.title, '为第二个工程修复综合时序')
  assert.equal(unloaded.mode, 'ptc')
  assert.equal(unloaded.status, 'unloaded')
  assert.equal(unloaded.selectable, true)
  assert.deepEqual(res.body.presets.map(row => row.id), ['standard', 'ptc'])
})

test('force-switch recomposes an idle started session and persists the chosen mode', async () => {
  const { route, calls, agent } = setup()
  const res = await request(route, 'POST', JSON.stringify({ sessionId: 'session-1', presetId: 'ptc' }))
  assert.equal(res.status, 200)
  assert.deepEqual(calls, [
    ['recompose', agent.ctx, 'ptc'],
    ['append', 'agent-preset/selected', { agentPreset: 'ptc' }],
  ])
})

test('refuses to recompose a session while its agent is running', async () => {
  const { route, calls } = setup({ running: true })
  const res = await request(route, 'POST', JSON.stringify({ sessionId: 'session-1', presetId: 'ptc' }))
  assert.equal(res.status, 409)
  assert.match(res.body.error, /仍在运行/)
  assert.deepEqual(calls, [])
})

test('force-switches a persisted session without starting an agent loop', async () => {
  const { route, eventStore } = setup()
  const res = await request(route, 'POST', JSON.stringify({ sessionId: 'session-2', presetId: 'standard' }))
  assert.equal(res.status, 200)
  assert.deepEqual(eventStore.get('session-2').at(-1), {
    type: 'agent-preset/selected',
    seq: 2,
    time: eventStore.get('session-2').at(-1).time,
    data: { agentPreset: 'standard' },
  })
})

test('exposes a Chinese settings panel and uses the web server API instead of a chat command', async () => {
  const [pkg, en, zh, source] = await Promise.all([
    readFile(new URL('./package.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('./locale/en.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('./locale/zh.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('./client.tsx', import.meta.url), 'utf8'),
  ])
  assert.deepEqual(inject, ['webServer', 'agents', 'agentPresets', 'sessionPersistence'])
  assert.equal(pkg.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-sidebar-right'), true)
  assert.equal(en.meta.title, 'Session Mode Switcher')
  assert.equal(zh.meta.title, '会话模式切换')
  assert.match(source, /plugins\.bundle\.config/)
  assert.match(source, /强制转换模式/)
  assert.match(source, /会话 ID：/)
  assert.match(source, /session\.selectable/)
  assert.doesNotMatch(source, /conversation\.session\.header\.actions|commands\.register|\/mode/)
})
