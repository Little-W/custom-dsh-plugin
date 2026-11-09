import assert from 'node:assert/strict'
import test from 'node:test'
import { createOpenAIWebSearchRequest, openAIWebSearchError, parseOpenAIWebSearchResponse, extractOpenAIWebSearchResult } from './openai-web-search.js'

test('ChatGPT OAuth Responses calls opt out of response storage', () => {
  const signal = new AbortController().signal
  const request = createOpenAIWebSearchRequest({
    accessToken: 'oauth-token', model: 'gpt-6-luna', query: 'current news', signal,
  })
  const body = JSON.parse(request.init.body)
  assert.equal(request.url, 'https://api.openai.com/v1/responses')
  assert.equal(request.init.signal, signal)
  assert.equal(request.init.headers.authorization, 'Bearer oauth-token')
  assert.equal(body.model, 'gpt-6-luna')
  assert.deepEqual(body.input, [{ role: 'user', content: 'current news' }])
  assert.equal(body.store, false)
  assert.equal(body.stream, true)
  assert.deepEqual(body.tools, [{ type: 'web_search' }])
  assert.equal(body.tool_choice, 'required')
  assert.deepEqual(body.include, ['web_search_call.action.sources'])
})

test('streaming Responses output parses the completed response event', () => {
  const response = { id: 'resp-1', output: [{ type: 'web_search_call', results: [{ url: 'https://example.com' }] }] }
  const stream = `event: response.completed\ndata: ${JSON.stringify({ type: 'response.completed', response })}\n\n`
  assert.deepEqual(parseOpenAIWebSearchResponse(stream), response)
})

test('OpenAI search errors preserve API detail and request id', () => {
  const error = openAIWebSearchError({
    status: 400,
    statusText: 'Bad Request',
    headers: { get: name => name === 'x-request-id' ? 'req-123' : null },
  }, { error: { message: 'store must be false' } }, '')
  assert.match(error.message, /HTTP 400/)
  assert.match(error.message, /store must be false/)
  assert.match(error.message, /req-123/)
})

const frame = event => `event: ${event.type}\r\ndata: ${JSON.stringify(event)}\r\n\r\n`
const search = {
  id: 'ws-1', type: 'web_search_call', status: 'completed',
  action: { type: 'search', sources: [{ url: 'https://example.com/guide#sources' }] },
}
const message = {
  id: 'msg-1', type: 'message', role: 'assistant', status: 'completed', content: [{
    type: 'output_text', text: 'Found the official guide.',
    annotations: [{ type: 'url_citation', url: 'https://example.com/guide', title: 'Official guide' }],
  }],
}

test('token-sharing streams retain search output and citations when response.completed.output is empty', () => {
  // This is the response shape observed in a real authorized OAuth search.
  const stream = [
    { type: 'response.created', response: { output: [] } },
    { type: 'response.output_item.added', output_index: 0, item: { id: 'ws-1', type: 'web_search_call', status: 'in_progress' } },
    { type: 'response.output_item.done', output_index: 1, item: message },
    { type: 'response.output_item.done', output_index: 0, item: search },
    { type: 'response.completed', response: { id: 'resp-1', status: 'completed', output: [] } },
  ].map(frame).join('') + 'data: [DONE]\r\n\r\n'
  const payload = parseOpenAIWebSearchResponse(stream)
  assert.deepEqual(payload.output, [search, message])
  const result = extractOpenAIWebSearchResult(payload)
  assert.deepEqual(result.sources, [{ url: 'https://example.com/guide', title: 'Official guide' }])
  assert.equal(result.content, 'Found the official guide.')
  assert.equal(result.truncated, false)
})

test('terminal output merges with streamed items by id without duplicating searches or losing absent items', () => {
  const stream = frame({ type: 'response.output_item.done', output_index: 0, item: search })
    + frame({ type: 'response.output_item.done', output_index: 1, item: message })
    + frame({ type: 'response.completed', response: { status: 'completed', output: [message] } })
  assert.deepEqual(parseOpenAIWebSearchResponse(stream).output, [search, message])
  const repeated = frame({ type: 'response.output_item.done', output_index: 0, item: search })
    + frame({ type: 'response.completed', response: { status: 'completed', output: [search, message] } })
  assert.deepEqual(parseOpenAIWebSearchResponse(repeated).output, [search, message])
})

test('failed, incomplete and truncated streams cannot masquerade as a successful empty search', () => {
  for (const event of [
    { type: 'response.failed', response: { error: { message: 'Search authorization rejected' } } },
    { type: 'response.incomplete', response: { incomplete_details: { reason: 'max_output_tokens' } } },
    { type: 'error', message: 'Search request failed' },
  ]) assert.throws(() => parseOpenAIWebSearchResponse(frame(event)), /Search|max_output_tokens/)
  assert.throws(() => parseOpenAIWebSearchResponse(frame({ type: 'response.output_item.done', item: search })), /未返回完整/)
  assert.throws(() => parseOpenAIWebSearchResponse(JSON.stringify({ status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' } })), /max_output_tokens/)
  assert.throws(() => parseOpenAIWebSearchResponse(JSON.stringify({ error: { message: 'Not authorized' } })), /Not authorized/)
})

test('only a completed search establishes execution, including genuine empty results', () => {
  assert.throws(() => extractOpenAIWebSearchResult({ output: [] }), /无法确认搜索已执行/)
  assert.throws(() => extractOpenAIWebSearchResult({ output: [message] }), /无法确认搜索已执行/)
  assert.throws(() => extractOpenAIWebSearchResult({ output: [{ ...search, status: 'in_progress' }] }), /无法确认搜索已执行/)
  const result = extractOpenAIWebSearchResult({ output: [{ ...search, action: { type: 'search', sources: [] } }] })
  assert.deepEqual(result.sources, [])
  assert.match(result.content, /已完成网页搜索，返回 0 条可用来源/)
})

test('sources are safely normalized, bounded and enriched by citations', () => {
  const payload = { output: [{ ...search, action: { sources: [
    { url: 'file:///etc/passwd' }, { url: 'https://user:secret@example.com/' },
    { url: 'https://example.com/guide#intro', title: 42, snippet: 'x'.repeat(3000) },
    { url: 'https://example.com/second', title: 'Second' },
  ] } }, message] }
  const result = extractOpenAIWebSearchResult(payload, 1)
  assert.equal(result.sources.length, 1)
  assert.equal(result.sources[0].url, 'https://example.com/guide')
  assert.equal(result.sources[0].title, 'Official guide')
  assert.equal(result.sources[0].snippet.length, 1800)
  assert.equal(result.truncated, true)
  assert.equal(extractOpenAIWebSearchResult(payload, NaN).sources.length, 2)
})

test('answer citations survive truncation of a much longer retrieval source list', () => {
  const payload = { output: [{ ...search, action: { sources: [
    { url: 'https://example.com/less-relevant-a' },
    { url: 'https://example.com/less-relevant-b' },
    { url: 'https://example.com/guide', snippet: 'The guide' },
  ] } }, message] }
  const result = extractOpenAIWebSearchResult(payload, 1)
  assert.deepEqual(result.sources, [{ url: 'https://example.com/guide', title: 'Official guide', snippet: 'The guide' }])
  assert.equal(result.truncated, true)
})
