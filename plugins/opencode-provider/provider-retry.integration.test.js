import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyProviderFailure } from './provider-failure.js';

test('native DSH recovery schedules five durable retries for the observed body timeout, then stops', { skip: !process.env.DSH_RETRY_TEST_ENTRY }, async () => {
    const { apply } = await import(process.env.DSH_RETRY_TEST_ENTRY);
    let recover, projection, state;
    const events = [], cleanup = [];
    const ctx = {
        fiber: { uid: 1 }, logger: { warn() {} },
        sessionProjections: { register(definition) { projection = definition; state = definition.init(); return Promise.resolve({ stateOf: () => state }); } },
        on(name, handler) { assert.equal(name, 'agent/request-error'); recover = handler; return () => {}; },
        effect(factory) { cleanup.push(factory()); },
    };
    const agent = { session: { append(type, data) { const event = { type, data }; events.push(event); state = projection.apply(state, event); } } };
    await apply(ctx);
    try {
        const failure = { message: 'Connection lost while reading the response: UND_ERR_BODY_TIMEOUT: Body Timeout Error', status: 200 };
        failure.code = classifyProviderFailure(failure);
        const policy = { mode: 'normal', maxRetries: 5, retryableCodes: ['EMPTY_RESPONSE', 'RATE_LIMIT', 'SERVER', 'TIMEOUT', 'TRANSPORT', 'STREAM_INTERRUPTED', 'NETWORK'], initialDelayMs: 0, maxDelayMs: 0, jitterRatio: 0 };
        const payload = { agent, turn: 92, step: 6, provider: 'opencode:openai', failure, retryPolicy: policy, signal: new AbortController().signal };
        for (let attempt = 1; attempt <= 5; attempt++) assert.deepEqual(await recover(payload, async () => undefined), { kind: 'retry' });
        assert.equal(await recover(payload, async () => undefined), undefined);
        assert.equal(events.filter(event => event.type === 'llm/retry').length, 5);
        assert.equal(events.filter(event => event.type === 'llm/retry-started').length, 5);
        assert.deepEqual(events.filter(event => event.type === 'llm/retry').map(event => event.data.retry), [1, 2, 3, 4, 5]);
        state = projection.apply(state, { type: 'step/start' });
        const overloaded = { ...payload, step: 7, failure: { message: 'server_is_overloaded: Our servers are currently overloaded. Please try again later.', code: classifyProviderFailure('server_is_overloaded: Our servers are currently overloaded. Please try again later.') } };
        assert.equal(overloaded.failure.code, 'SERVER');
        for (let attempt = 1; attempt <= 5; attempt++) assert.deepEqual(await recover(overloaded, async () => undefined), { kind: 'retry' });
        assert.equal(await recover(overloaded, async () => undefined), undefined);
        assert.equal(events.filter(event => event.type === 'llm/retry').length, 10);
        for (const code of ['PROVIDER_ERROR', 'INVALID_CREDENTIAL']) assert.equal(await recover({ ...payload, failure: { code, message: 'permanent failure' } }, async () => undefined), undefined);
        const controller = new AbortController(); controller.abort(new Error('user cancelled'));
        assert.equal(await recover({ ...payload, signal: controller.signal }, async () => undefined), undefined);
        assert.equal(events.length, 20);
    } finally { for (const dispose of cleanup) await dispose(); }
});
