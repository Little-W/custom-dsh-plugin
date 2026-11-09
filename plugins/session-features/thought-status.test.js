import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import test from 'node:test';
import { Config } from './index.js';

const runtime = process.env.DSH_TEST_RUNTIME;
const JSDOM = runtime ? createRequire(resolve(runtime, 'package.json'))('jsdom').JSDOM : null;
const client = await readFile(new URL('./client.js', import.meta.url), 'utf8');
const source = client.slice(client.indexOf('// src/session-thought-status.ts'), client.indexOf('// src/client-session-ui.tsx', client.indexOf('// src/session-thought-status.ts')));
const settle = () => new Promise(resolve => setTimeout(resolve, 0));
const thought = (key, text = '思考内容') => `<div data-chat-anchor-key="${key}" data-chat-group-part="reasoning"><div><div data-variant="think">${text}</div></div></div>`;
function fixture(t, content = '') {
  const dom = new JSDOM(`<div data-slot="conversation.chat.flow"><div data-step-process data-chat-turn="1"><button data-primary-toggle>执行了命令，已读取文件</button><div data-step-process-body><div data-step-process-content><div data-chat-anchor-key="tool" data-tool-call>运行命令</div>${content}</div></div></div></div>`);
  const { document } = dom.window;
  const { installUnifiedThoughtStatus, unifiedThoughtStatusStyles } = new Function(source + ';return {installUnifiedThoughtStatus,unifiedThoughtStatusStyles};')();
  const style = document.createElement('style'); style.textContent = unifiedThoughtStatusStyles; document.head.append(style);
  const stop = installUnifiedThoughtStatus(document);
  t.after(() => { stop(); dom.window.close(); });
  return { dom, doc: document, stop, group: document.querySelector('[data-step-process]'), content: document.querySelector('[data-step-process-content]'), css: element => dom.window.getComputedStyle(element) };
}

test('native config exposes a persistent volatile hide-all flag, default off', () => {
  assert.equal(Config({}).hideAllThoughts.get(), false);
  assert.equal(Config({ hideAllThoughts: true }).hideAllThoughts.get(), true);
  assert.equal(Config.dict.hideAllThoughts.meta.volatile, true);
  assert.throws(() => Config({ hideAllThoughts: 'not a boolean' }));
});

test('summary is always the first row and keeps its identity during streaming updates', { skip: !JSDOM }, async t => {
  const f = fixture(t, thought('a') + thought('b'));
  const summary = f.content.firstElementChild;
  assert.ok(summary.hasAttribute('data-session-features-thought-summary'));
  assert.equal(summary.textContent, '思考 · 2 条');
  assert.equal(f.css(f.content.querySelector('[data-chat-anchor-key="a"]')).display, 'none');
  for (let i = 0; i < 30; i++) {
    f.doc.querySelector('[data-variant="think"]').textContent = `流式更新 ${i}`;
    f.content.insertAdjacentHTML('beforeend', thought(`new-${i}`));
    // A new reasoning row is hidden synchronously, before MutationObserver.
    assert.equal(f.css(f.content.lastElementChild).display, 'none');
    await settle();
    assert.equal(f.content.firstElementChild, summary);
    assert.equal(summary.getAttribute('aria-expanded'), 'false');
  }
  assert.equal(summary.textContent, '思考 · 32 条');
  assert.equal(f.doc.querySelectorAll('[data-session-features-thought-summary]').length, 1);
});

test('native hidden state is never overwritten and explicit expansion persists across new rows', { skip: !JSDOM }, async t => {
  const f = fixture(t, thought('a') + thought('b'));
  const summary = f.content.firstElementChild;
  const a = f.doc.querySelector('[data-chat-anchor-key="a"]');
  a.setAttribute('hidden', 'until-found');
  summary.click();
  assert.equal(a.getAttribute('hidden'), 'until-found');
  f.content.insertAdjacentHTML('beforeend', thought('c'));
  await settle();
  assert.equal(summary.getAttribute('aria-expanded'), 'true');
  summary.click();
  a.removeAttribute('hidden'); // A native React commit must not reveal this row.
  assert.equal(f.css(a).display, 'none');
  await settle();
  assert.equal(summary.getAttribute('aria-expanded'), 'false');
  assert.equal(a.hasAttribute('hidden'), false);
});

test('hide all removes thoughts and summary while retaining tools, mixed replies and primary controls', { skip: !JSDOM }, async t => {
  const f = fixture(t, thought('a') + `<div data-chat-anchor-key="mixed"><div><div data-variant="think">思考</div></div><p>最终答复</p></div>`);
  const summary = f.content.firstElementChild;
  summary.click();
  f.stop.setHideAll(true);
  assert.equal(f.css(summary).display, 'none');
  assert.equal(f.css(f.content.querySelector('[data-chat-anchor-key="a"]')).display, 'none');
  assert.notEqual(f.css(f.content.querySelector('[data-tool-call]')).display, 'none');
  assert.notEqual(f.css(f.content.querySelector('[data-chat-anchor-key="mixed"]')).display, 'none');
  assert.notEqual(f.css(f.content.querySelector('p')).display, 'none');
  assert.notEqual(f.css(f.doc.querySelector('[data-primary-toggle]')).display, 'none');
  f.content.insertAdjacentHTML('beforeend', thought('new-hidden'));
  assert.equal(f.css(f.content.lastElementChild).display, 'none');
  await settle();
  f.stop.setHideAll(false);
  assert.equal(summary.getAttribute('aria-expanded'), 'true');
  assert.notEqual(f.css(summary).display, 'none');
});

test('whole-group replacement defaults to collapsed without leaking newly rendered reasoning', { skip: !JSDOM }, async t => {
  const f = fixture(t, thought('a'));
  const old = f.content.firstElementChild;
  old.click();
  const next = f.group.cloneNode(true);
  next.removeAttribute('data-session-features-thought-expanded');
  next.querySelector('[data-session-features-thought-summary]').remove();
  f.group.replaceWith(next);
  assert.equal(f.css(next.querySelector('[data-chat-group-part="reasoning"]')).display, 'none');
  await settle();
  assert.equal(next.querySelector('[data-session-features-thought-summary]').getAttribute('aria-expanded'), 'false');
  assert.equal(f.doc.querySelectorAll('[data-session-features-thought-summary]').length, 1);
});

test('a legacy thought-only row becomes visible as soon as an answer is appended', { skip: !JSDOM }, async t => {
  const f = fixture(t, '<div data-chat-anchor-key="legacy"><div><div data-variant="think">思考</div></div></div>');
  const row = f.content.querySelector('[data-chat-anchor-key="legacy"]');
  assert.equal(f.css(row).display, 'none');
  row.insertAdjacentHTML('beforeend', '<p>新生成的正文</p>');
  await settle();
  assert.notEqual(f.css(row).display, 'none');
  assert.equal(row.hasAttribute('data-session-features-thought-member'), false);
});

test('unload restores native rendering and leaves original hidden state untouched', { skip: !JSDOM }, async t => {
  const f = fixture(t, thought('a') + thought('b'));
  const row = f.content.querySelector('[data-chat-anchor-key="a"]');
  row.setAttribute('hidden', 'until-found');
  f.stop();
  await settle();
  assert.equal(row.getAttribute('hidden'), 'until-found');
  assert.equal(f.doc.querySelector('[data-session-features-thought-summary]'), null);
  assert.equal(f.doc.documentElement.hasAttribute('data-session-features-thoughts'), false);
});
