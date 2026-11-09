// Pending input already has a durable native inbox projection. Keep that single
// source of truth: a shadow queue can replay canceled or already claimed input.
const guardedAgents = new WeakSet();
const originalObject = value => value[Symbol.for("cordis.original")] ?? value;

export function preserveInboxOnDispose(agent) {
  agent = originalObject(agent);
  if (guardedAgents.has(agent)) return;
  const cancel = agent.cancel;
  agent.cancel = function(cause, options, ...rest) {
    // AgentLoop teardown currently passes keepInbox: false for published agents.
    // Disposal releases runtime resources; it is not a user queue cancellation.
    return Reflect.apply(cancel, this, [cause,
      cause?.kind === "disposed" ? { ...options, keepInbox: true } : options,
      ...rest]);
  };
  guardedAgents.add(agent);
  // Intentionally owned by the Agent lifetime, not the plugin's effect lifetime:
  // plugin teardown can run BEFORE AgentLoop teardown during client shutdown.
  // This guard retains no plugin Context and remains safe across plugin reloads.
}

export function wrapDurableQueueCommand(controller, method, flushSession) {
  // Read the untraced method, then call it with the incoming receiver. Capturing
  // a Cordis shadow method would pin the plugin Context and lose the Remote
  // caller's invocation/permission context. It also breaks identity cleanup.
  controller = originalObject(controller);
  const descriptor = Object.getOwnPropertyDescriptor(controller, method);
  const original = controller[method];
  if (typeof original !== "function") return () => {};
  const wrapped = async function(request, ...args) {
    const result = await Reflect.apply(original, this, [request, ...args]);
    if (result?.accepted === true) await flushSession(request.sessionId);
    return result;
  };
  controller[method] = wrapped;
  return () => {
    if (controller[method] !== wrapped) return;
    if (descriptor) Object.defineProperty(controller, method, descriptor);
    else delete controller[method];
  };
}

export function installQueueDurability(ctx) {
  ctx.on("agent/created", ({ agent }) => { preserveInboxOnDispose(agent); });
  ctx.inject(["agents", "sessions"], child => {
    const agents = child.get("agents");
    const sessions = child.get("sessions");
    for (const agent of agents.list()) preserveInboxOnDispose(agent);
    // Flush inserts, edits, removals AND claims. In particular a claimed message
    // must not reappear in the queue after the process crashes.
    child.on("session/event", (session, event) => {
      if (event.type !== "agent/inbox/spliced") return;
      void sessions.flush(session).catch(error => {
        child.logger.warn(`session queue durability failed for ${session.id}: ${String(error)}`);
      });
    });
    child.inject(["sessionController"], owner => {
      const controller = owner.get("sessionController");
      const flushSession = async id => {
        const session = agents.get(id)?.session ?? sessions.get(id);
        if (!session) throw new Error("无法确认排队消息已保存：会话已关闭，请重新打开会话核对消息队列");
        const persisted = await sessions.flush(session);
        if (!persisted) throw new Error("无法确认排队消息已保存：会话持久化服务未就绪");
      };
      for (const method of ["prompt", "updateQueue"]) {
        owner.effect(() => wrapDurableQueueCommand(controller, method, flushSession),
          `session features: durable ${method} acknowledgement`);
      }
    });
  });
}
