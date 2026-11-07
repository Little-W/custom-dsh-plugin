// apps/dsh/src/session-agent-loop.ts
import { randomUUID } from "node:crypto";
var MAX_NETWORK_RETRIES = 3;
var retryDelay = (attempt) => 1e3 * 2 ** (attempt - 1);
var NETWORK_FAILURE = /UND_ERR_SOCKET|ERR_SOCKET|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|ENETUNREACH|EHOSTUNREACH|ECONNABORTED|EPIPE|socket hang up|other side closed|fetch failed|network (?:error|connection)|connect timeout|connection (?:reset|closed|timed out|refused)/i;
function isTransientNetworkFailure(error, seen = /* @__PURE__ */ new Set()) {
  if (typeof error === "string") return NETWORK_FAILURE.test(error);
  if (!error || typeof error !== "object" || seen.has(error)) return false;
  seen.add(error);
  const value = error;
  if (typeof value.message === "string" && NETWORK_FAILURE.test(value.message)) return true;
  if (typeof value.code === "string" && NETWORK_FAILURE.test(value.code)) return true;
  return isTransientNetworkFailure(value.cause, seen) || isTransientNetworkFailure(value.error, seen) || Array.isArray(value.errors) && value.errors.some((item) => isTransientNetworkFailure(item, seen));
}
function networkRetryMessage(attempt) {
  const summary = `\u7F51\u7EDC\u4E2D\u65AD \xB7 \u81EA\u52A8\u91CD\u8BD5 ${attempt}/${MAX_NETWORK_RETRIES}`;
  return {
    id: `network-retry-${randomUUID()}`,
    role: "user",
    source: { kind: "studio-continuation", form: "notice", summary },
    content: [{ type: "text", text: `\u3010\u7F51\u7EDC\u4E2D\u65AD\u81EA\u52A8\u6062\u590D \xB7 \u7B2C ${attempt}/${MAX_NETWORK_RETRIES} \u6B21\u3011\u4E0A\u4E00\u8F6E\u56E0\u7F51\u7EDC\u8FDE\u63A5\u4E2D\u65AD\u800C\u5931\u8D25\u3002\u8BF7\u68C0\u67E5\u6700\u8FD1\u7684\u5DE5\u5177\u8C03\u7528\u548C\u5DE5\u4F5C\u533A\u5B9E\u9645\u72B6\u6001\uFF1A\u5DF2\u6210\u529F\u7684\u64CD\u4F5C\u4E0D\u8981\u91CD\u590D\uFF0C\u4E0D\u786E\u5B9A\u65F6\u5148\u8BFB\u53D6\u7ED3\u679C\uFF1B\u7136\u540E\u4ECE\u672A\u5B8C\u6210\u5904\u7EE7\u7EED\u7528\u6237\u539F\u4EFB\u52A1\uFF0C\u4E0D\u8981\u628A\u6B64\u6062\u590D\u8BF4\u660E\u5F53\u6210\u65B0\u9700\u6C42\u3002` }]
  };
}
var NetworkRetryController = class {
  attempts = /* @__PURE__ */ new Map();
  timers = /* @__PURE__ */ new Map();
  failed(agent, turn, error) {
    if (!isTransientNetworkFailure(error) || this.timers.has(agent.id)) return;
    const attempt = (this.attempts.get(agent.id) ?? 0) + 1;
    if (attempt > MAX_NETWORK_RETRIES) return;
    this.attempts.set(agent.id, attempt);
    const timer = setTimeout(() => {
      this.timers.delete(agent.id);
      void this.resumeAfterFailure(agent, turn, attempt);
    }, retryDelay(attempt));
    timer.unref?.();
    this.timers.set(agent.id, timer);
  }
  completed(agent, status) {
    if (status !== "idle") return;
    try {
      const latest = [...agent.session.snapshotEvents()].reverse().find((event) => event.type === "turn/end");
      if (latest?.data?.reason?.kind === "completed") this.clear(agent.id);
    } catch {
    }
  }
  dispose(id) {
    this.clear(id);
  }
  disposeAll() {
    for (const id of this.timers.keys()) this.clear(id);
    this.attempts.clear();
  }
  clear(id) {
    const timer = this.timers.get(id);
    if (timer) clearTimeout(timer);
    this.timers.delete(id);
    this.attempts.delete(id);
  }
  async resumeAfterFailure(agent, failedTurn, attempt) {
    try {
      await agent.whenIdle();
      const latest = [...agent.session.snapshotEvents()].reverse().find((event) => event.type === "turn/end");
      if (agent.status !== "idle" || agent.inbox.hasPending || latest?.data?.turn !== failedTurn || latest.data.reason?.kind !== "error" || !isTransientNetworkFailure(latest.data.reason.error)) return;
      agent.send(networkRetryMessage(attempt), "next-turn", true);
    } catch {
    }
  }
};
var name = "@agent-studio/plugin-session-features";
var inject = ["agentLoop"];
function apply(ctx) {
  const loop = ctx.get("agentLoop");
  if (!loop) throw new Error("\u4F1A\u8BDD\u529F\u80FD\u589E\u5F3A\u9700\u8981 DSH \u539F\u751F AgentLoop");
  const handles = /* @__PURE__ */ new Map();
  const retries = new NetworkRetryController();
  ctx.provide("studioAgentHandles", {
    dispose: async (id) => {
      const handle = handles.get(id);
      if (!handle) throw new Error("SESSION_LIFECYCLE_UNAVAILABLE: \u4F1A\u8BDD\u53E5\u67C4\u672A\u767B\u8BB0\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u4F1A\u8BDD\u540E\u91CD\u8BD5");
      await handle.dispose();
      if (handles.get(id) === handle) handles.delete(id);
    }
  });
  const createAgent = loop.createAgent;
  const resume = loop.resume;
  const wrappedCreateAgent = async function(...args) {
    const handle = await Reflect.apply(createAgent, this, args);
    try {
      handles.set(handle.agent.id, handle);
    } catch {
    }
    return handle;
  };
  const wrappedResume = async function(...args) {
    const handle = await Reflect.apply(resume, this, args);
    try {
      handles.set(handle.agent.id, handle);
    } catch {
    }
    return handle;
  };
  loop.createAgent = wrappedCreateAgent;
  loop.resume = wrappedResume;
  ctx.on("agent/disposed", ({ agent }) => {
    try {
      if (handles.get(agent.id)?.agent === agent) handles.delete(agent.id);
      retries.dispose(agent.id);
    } catch {
    }
  });
  ctx.on("agent/error", ({ agent, turn, error }) => {
    try {
      retries.failed(agent, turn, error);
    } catch {
    }
  });
  ctx.on("agent/status", ({ agent, status }) => {
    try {
      retries.completed(agent, status);
    } catch {
    }
  });
  ctx.effect(() => () => {
    retries.disposeAll();
    if (loop.createAgent === wrappedCreateAgent) loop.createAgent = createAgent;
    if (loop.resume === wrappedResume) loop.resume = resume;
  }, "session features: native agent lifecycle");
}
var session_agent_loop_default = apply;
export {
  NetworkRetryController,
  apply,
  session_agent_loop_default as default,
  inject,
  isTransientNetworkFailure,
  name
};
