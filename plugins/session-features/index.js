// src/session-task-plan.ts
function savedTaskPlan(events) {
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    if (event.type !== "todo/write") continue;
    if (!Array.isArray(event.data.todos)) return void 0;
    const tasks = [];
    for (const value of event.data.todos) {
      if (!value || typeof value.content !== "string" || !["pending", "in_progress", "completed"].includes(value.status)) return void 0;
      tasks.push({ content: value.content, status: value.status });
    }
    return { tasks, seq: event.seq ?? i };
  }
  return void 0;
}
function eventsOf(agent) {
  return agent.session.snapshotEvents();
}
function restoreTaskPlan(agent) {
  const events = eventsOf(agent), saved = savedTaskPlan(events);
  if (!saved) return;
  const start = [...events].reverse().find((event) => event.type === "turn/start");
  if (!start || saved.seq > (start.seq ?? -1)) return;
  agent.session.append("todo/write", { todos: saved.tasks });
}
function taskPlanContext(tasks) {
  if (!tasks.length) return "";
  return `## \u5DF2\u4FDD\u5B58\u7684\u4F1A\u8BDD\u4EFB\u52A1\u8BA1\u5212
\u4EE5\u4E0B\u6E05\u5355\u6765\u81EA\u5F53\u524D\u4F1A\u8BDD\u5DF2\u6301\u4E45\u5316\u7684 todo_write \u5FEB\u7167\u3002\u7EE7\u7EED\u672A\u5B8C\u6210\u9879\uFF0C\u4FDD\u7559\u5DF2\u5B8C\u6210\u9879\u7684\u7ED3\u679C\uFF1B\u4EFB\u52A1\u53D8\u5316\u65F6\u4F7F\u7528 todo_write \u66F4\u65B0\u5B8C\u6574\u6E05\u5355\u3002\u53EA\u6709\u7528\u6237\u660E\u786E\u66F4\u6362\u4EFB\u52A1\u6216\u6E05\u7A7A\u8BA1\u5212\u65F6\u624D\u66FF\u6362\u5B83\u3002
${JSON.stringify(tasks)}`;
}
function installSessionTaskPlan(ctx) {
  ctx.on("agent/pre-step", async ({ agent }, next) => {
    restoreTaskPlan(agent);
    return next();
  });
  const prompt = ctx.get("systemPrompt");
  ctx.effect(() => prompt.context({ name: "studio:session-task-plan", order: 130, required: true, interpolate: false, text: ({ agent }) => agent ? taskPlanContext(savedTaskPlan(eventsOf(agent))?.tasks ?? []) : "" }), "studio: persistent task plan context");
}

// src/session-agent-loop.ts
var name = "@agent-studio/plugin-session-features";
var inject = ["agentLoop", "systemPrompt"];
function apply(ctx) {
  const loop = ctx.get("agentLoop");
  if (!loop) throw new Error("\u4F1A\u8BDD\u529F\u80FD\u589E\u5F3A\u9700\u8981 DSH \u539F\u751F AgentLoop");
  installSessionTaskPlan(ctx);
  const handles = /* @__PURE__ */ new Map();
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
  ctx.effect(() => () => {
    if (loop.createAgent === wrappedCreateAgent) loop.createAgent = createAgent;
    if (loop.resume === wrappedResume) loop.resume = resume;
  }, "session features: native agent lifecycle");
}
var session_agent_loop_default = { name, inject, apply };
export {
  apply,
  session_agent_loop_default as default,
  inject,
  name
};
