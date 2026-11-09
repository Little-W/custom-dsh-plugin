import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { classifyProviderFailure } from './provider-failure.js';

test('body/header/connect timeouts are retryable even after HTTP 200 or inside nested AggregateError', () => {
    for (const value of [
        'Connection lost while reading the response: UND_ERR_BODY_TIMEOUT: Body Timeout Error',
        { message: 'HTTP 200 response failed', cause: { code: 'UND_ERR_HEADERS_TIMEOUT' } },
        new AggregateError([new Error('UND_ERR_CONNECT_TIMEOUT')], 'request failed'),
        { reason: { message: 'response timed out', http: { status: 200 } } },
    ]) assert.equal(classifyProviderFailure(value), 'TIMEOUT');
});
test('HTTP transient failures retry; invalid payload and authentication do not', () => {
    for (const status of [500, 502, 503, 504]) assert.equal(classifyProviderFailure({ reason: { http: { status } } }), 'SERVER');
    for (const status of [408, 409]) assert.equal(classifyProviderFailure(`Provider request failed with HTTP ${status}`), 'TIMEOUT');
    assert.equal(classifyProviderFailure('HTTP 429'), 'RATE_LIMIT');
    for (const status of [400, 404, 422]) assert.equal(classifyProviderFailure(`HTTP ${status}: rejected request`), 'PROVIDER_ERROR');
    for (const status of [401, 403]) assert.equal(classifyProviderFailure(`HTTP ${status}`), 'INVALID_CREDENTIAL');
    assert.equal(classifyProviderFailure('context', 'context-overflow'), 'CONTEXT_WINDOW_EXCEEDED');
    assert.equal(classifyProviderFailure('payload', 'payload-too-large'), 'PAYLOAD_TOO_LARGE');
});
test('OpenAI server_is_overloaded is a retryable server failure even without an HTTP status', () => {
    for (const value of [
        'server_is_overloaded: Our servers are currently overloaded. Please try again later.',
        { code: 'server_is_overloaded', message: 'Our servers are currently overloaded. Please try again later.' },
        { cause: { message: 'The servers are overloaded', status: 503 } },
    ]) assert.equal(classifyProviderFailure(value), 'SERVER');
});
test('nested transport errors and cyclic causes are handled without classifying arbitrary errors as retryable', () => {
    const error = { message: 'failed', cause: { code: 'ECONNRESET' } }; error.cause.cause = error;
    assert.equal(classifyProviderFailure(error), 'TRANSPORT');
    assert.equal(classifyProviderFailure(new TypeError('invalid tool schema')), 'PROVIDER_ERROR');
});

async function adapter(ai) {
    const source = await readFile(new URL('./index.js', import.meta.url), 'utf8');
    const begin = source.indexOf('var providerRoute ='), end = source.indexOf('async function toOpenCodeMessages(', begin);
    assert.ok(begin > 0 && end > begin);
    class LlmError extends Error { constructor(message, code, rest = {}) { super(message); this.code = code; this.failure = { message, code, ...rest }; } }
    const context = vm.createContext({ LlmAdapter: class {}, LlmError, resolveRetryPolicy: value => value, CONTEXT_WINDOW_EXCEEDED_CODE: 'CONTEXT_WINDOW_EXCEEDED', INVALID_CREDENTIAL_CODE: 'INVALID_CREDENTIAL', QUOTA_EXCEEDED_CODE: 'QUOTA_EXCEEDED', classifyDshProviderFailure: classifyProviderFailure, attributionHeaders: () => ({}), toOpenCodeMessages: async () => [], ToolCallPart: { make: value => ({ type: 'tool-call', ...value }) } });
    vm.runInContext(source.slice(begin, end) + '\nglobalThis.Adapter=OpenCodeDshAdapter;', context);
    return new context.Adapter({}, {}, () => undefined, ai);
}
const options = signal => ({ provider: 'opencode:openai', model: 'test', system: '', messages: [], tools: [], signal });
const resolve = async () => ({ model: {}, capabilities: {}, limit: { output: 100 } });
const collect = async iterable => { const events = []; for await (const event of iterable) events.push(event); return events; };

test('actual adapter converts streamed and thrown body timeout failures into its native retry policy', async () => {
    for (const kind of ['event', 'throw', 'finish']) {
        const client = await adapter({ async *stream() {
            if (kind === 'throw') throw new Error('failed', { cause: { code: 'UND_ERR_BODY_TIMEOUT' } });
            if (kind === 'event') yield { type: 'provider-error', message: 'Connection lost while reading the response: UND_ERR_BODY_TIMEOUT: Body Timeout Error', classification: 'unknown' };
            else yield { type: 'finish', reason: { normalized: 'error', explanation: 'UND_ERR_BODY_TIMEOUT: Body Timeout Error' } };
        } });
        const events = await collect(client.streamResolved(options(new AbortController().signal), {}, resolve));
        const failure = events.at(-1).reason.failure;
        assert.equal(failure.code, 'TIMEOUT');
        assert.ok(client.providerRetryPolicy('opencode:openai').retryableCodes.includes(failure.code));
        assert.equal(client.providerRetryPolicy('opencode:openai').maxRetries, 5);
    }
});
test('actual OpenCode adapter surfaces server_is_overloaded as retryable SERVER failures', async () => {
    for (const kind of ['event', 'throw', 'finish']) {
        const client = await adapter({ async *stream() {
            if (kind === 'throw') throw new Error('server_is_overloaded: Our servers are currently overloaded. Please try again later.');
            if (kind === 'event') yield { type: 'provider-error', message: 'server_is_overloaded: Our servers are currently overloaded. Please try again later.' };
            else yield { type: 'finish', reason: { normalized: 'error', explanation: 'server_is_overloaded: Our servers are currently overloaded. Please try again later.' } };
        } });
        const events = await collect(client.streamResolved(options(new AbortController().signal), {}, resolve));
        const failure = events.at(-1).reason.failure;
        assert.equal(failure.code, 'SERVER');
        assert.ok(client.providerRetryPolicy('opencode:openai').retryableCodes.includes(failure.code));
    }
});
test('a cancelled request exits without emitting a retryable finish', async () => {
    const controller = new AbortController(), cancelled = new Error('user stopped');
    const client = await adapter({ async *stream() { controller.abort(cancelled); throw new Error('UND_ERR_BODY_TIMEOUT'); } });
    await assert.rejects(collect(client.streamResolved(options(controller.signal), {}, resolve)), error => error === cancelled);
});
