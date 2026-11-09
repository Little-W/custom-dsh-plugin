export function createOpenAIWebSearchRequest({ accessToken, model, query, signal }) {
  return {
    url: 'https://api.openai.com/v1/responses',
    init: {
      method: 'POST',
      redirect: 'error',
      signal,
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        model,
        input: [{ role: 'user', content: query }],
        stream: true,
        tools: [{ type: 'web_search' }],
        tool_choice: 'required',
        include: ['web_search_call.action.sources'],
        max_output_tokens: 1200,
        store: false,
      }),
    },
  }
}

export function openAIWebSearchError(response, payload, responseText) {
  const detail = payload?.error?.message
    ?? payload?.detail
    ?? payload?.message
    ?? responseText?.trim()
    ?? response.statusText
  const requestId = response.headers?.get?.('x-request-id')
    ?? response.headers?.get?.('x-codex-request-id')
  return new Error(`OpenAI 网页搜索失败（HTTP ${response.status}）${detail ? `：${String(detail).slice(0, 400)}` : ''}${requestId ? ` [request ${requestId}]` : ''}`)
}

export function parseOpenAIWebSearchResponse(responseText) {
  let payload
  try {
    payload = JSON.parse(responseText)
  } catch {}
  if (payload) return assertCompleteResponse(payload)

  // Token-sharing streams can leave response.completed.output empty. Keep
  // finalized output items, which carry the actual search sources and citations.
  const items = []
  const remember = (item, index) => {
    if (!item || typeof item !== 'object') return
    const existing = items.find(entry => (item.id && entry.item.id === item.id)
      || (!item.id && !entry.item.id && entry.index === index))
    if (existing) existing.item = { ...existing.item, ...item }
    else items.push({ item, index: Number.isInteger(index) ? index : items.length })
  }
  let completed

  for (const frame of responseText.split(/\r?\n\r?\n/)) {
    const data = frame.split(/\r?\n/)
      .filter(line => line.startsWith('data:'))
      .map(line => line.slice(5).trimStart())
      .join('\n')
    if (!data || data === '[DONE]') continue

    let event
    try {
      event = JSON.parse(data)
    } catch {
      continue
    }
    if (event.type === 'response.output_item.done') remember(event.item, event.output_index)
    if (event.type === 'response.completed') completed = assertCompleteResponse(event.response ?? event)
    if (event.type === 'response.incomplete') {
      throw new Error(`OpenAI 网页搜索响应未完成：${event.response?.incomplete_details?.reason ?? '响应提前结束'}。`)
    }
    if (event.type === 'response.failed' || event.type === 'error') {
      throw new Error(event.response?.error?.message ?? event.error?.message ?? event.message ?? 'OpenAI 网页搜索流式请求失败。')
    }
  }

  if (completed) {
    for (const [index, item] of (completed.output ?? []).entries()) remember(item, index)
    return { ...completed, output: items.sort((a, b) => a.index - b.index).map(entry => entry.item) }
  }
  throw new Error('OpenAI 网页搜索未返回完整的 Responses 结果。')
}

function assertCompleteResponse(payload) {
  if (payload.error || payload.status === 'failed') throw new Error(payload.error?.message ?? 'OpenAI 网页搜索请求失败。')
  if (payload.status && payload.status !== 'completed') {
    throw new Error(`OpenAI 网页搜索响应未完成：${payload.incomplete_details?.reason ?? payload.status}。`)
  }
  return payload
}

export function extractOpenAIWebSearchResult(payload, maxResults = 8) {
  assertCompleteResponse(payload)
  const output = Array.isArray(payload.output) ? payload.output : []
  const searches = output.filter(item => item.type === 'web_search_call')
  if (!searches.some(item => item.status === 'completed')) {
    throw new Error('OpenAI 未返回已完成的网页搜索调用，无法确认搜索已执行；请重试或检查模型与授权。')
  }
  const sources = new Map()
  const add = source => {
    if (typeof source?.url !== 'string') return
    try {
      const url = new URL(source.url)
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return
      url.hash = ''
      const snippet = source.snippet ?? source.content
      sources.set(url.href, {
        ...sources.get(url.href), url: url.href,
        ...(typeof source.title === 'string' && source.title ? { title: source.title.slice(0, 400) } : {}),
        ...(typeof snippet === 'string' && snippet ? { snippet: snippet.slice(0, 1800) } : {}),
      })
    } catch {}
  }
  // Keep the URLs actually cited in the answer ahead of the complete retrieval
  // list, so maxResults cannot discard the answer's relevant references.
  for (const item of output) for (const part of item.content ?? []) {
    for (const annotation of part.annotations ?? []) if (annotation.type === 'url_citation') add(annotation)
  }
  for (const item of searches) {
    if (item.status !== 'completed') continue
    for (const source of [...(item.action?.sources ?? []), ...(item.results ?? [])]) add(source)
  }
  const limit = Number.isFinite(maxResults) ? Math.max(1, Math.min(20, Math.floor(maxResults))) : 8
  const results = [...sources.values()].slice(0, limit)
  const text = typeof payload.output_text === 'string' ? payload.output_text : output
    .flatMap(item => item.content ?? [])
    .filter(part => part.type === 'output_text' && typeof part.text === 'string')
    .map(part => part.text).join('\n')
  return {
    sources: results,
    truncated: sources.size > results.length,
    content: text.slice(0, 8000) || `OpenAI 已完成网页搜索，返回 ${results.length} 条可用来源。`,
  }
}
