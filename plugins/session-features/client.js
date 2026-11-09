window.__ModuleLoader__.load({id:"@agent-studio/plugin-session-features",factory:(require)=>{var module={exports:{}};var exports=module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client-session-ui.tsx
var client_session_ui_exports = {};
__export(client_session_ui_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_session_ui_exports);

// src/session-continuation-ui.tsx
var import_react4 = require("react");

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
var import_react3 = require("react");

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
var toKebabCase = (string) => string?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
function toLucideIconData(iconName, iconNode, aliases = []) {
  if (iconNode == null) {
    throw new Error("[lucide]: iconNode is required when icon name is used");
  }
  return {
    name: toKebabCase(iconName),
    size: 24,
    node: iconNode,
    ...aliases.length > 0 ? { aliases } : {}
  };
}

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
var toCamelCase = (string) => {
  let out = "";
  let upperNext = false;
  for (const ch of string) {
    if (ch === "-" || ch === "_" || ch <= " ") {
      upperNext = out.length > 0;
      continue;
    }
    if (out.length === 0) {
      out += ch.toLowerCase();
    } else {
      out += upperNext ? ch.toUpperCase() : ch;
    }
    upperNext = false;
  }
  return out;
};

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
var toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/Icon.mjs
var import_react2 = require("react");

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
function isDefined(value) {
  return value !== null && value !== void 0;
}
function buildLucideIconNode(icon, params = {}) {
  const attributeNames = params.attributeNames ?? {};
  const getAttributeName = (attributeName) => attributeNames[attributeName] ?? attributeName;
  const viewBoxWidth = icon.size ?? icon.width ?? defaultAttributes["width"];
  const viewBoxHeight = icon.size ?? icon.height ?? defaultAttributes["height"];
  const aliasClassNames = icon.aliases?.filter((alias) => typeof alias === "string" && alias.trim() !== "").map((alias) => `lucide-${alias}`) ?? [];
  const iconClassNames = [...icon.name ? [`lucide-${icon.name}`] : [], ...aliasClassNames];
  const classNamesFromClassName = params.className?.split(" ").filter(Boolean) ?? [];
  const className = params.includeDefaultClasses === false ? mergeClasses(...classNamesFromClassName) : mergeClasses("lucide", ...iconClassNames, ...classNamesFromClassName);
  const calculatedStrokeWidth = params.absoluteStrokeWidth ? Number(params.strokeWidth ?? defaultAttributes["stroke-width"]) * Number(icon.size ?? icon.width ?? defaultAttributes["width"]) / Number(params.size ?? params.width ?? defaultAttributes["width"]) : params.strokeWidth ?? defaultAttributes["stroke-width"];
  const attributes = {
    ...Object.entries(defaultAttributes).reduce((attrs, [attrName, value]) => {
      attrs[getAttributeName(attrName)] = value;
      return attrs;
    }, {}),
    ..."color" in params && params.color && {
      [getAttributeName("stroke")]: params.color
    },
    ..."size" in params && isDefined(params.size) && {
      [getAttributeName("width")]: params.size,
      [getAttributeName("height")]: params.size
    },
    ..."width" in params && isDefined(params.width) && {
      [getAttributeName("width")]: params.width
    },
    ..."height" in params && isDefined(params.height) && {
      [getAttributeName("height")]: params.height
    },
    [getAttributeName("stroke-width")]: calculatedStrokeWidth,
    ...className && {
      [getAttributeName("class")]: className
    },
    [getAttributeName("viewBox")]: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
    ...params.hasA11yProp === false ? {
      [getAttributeName("aria-hidden")]: "true"
    } : {},
    ..."attributes" in params && params.attributes
  };
  return [
    "svg",
    attributes,
    icon.node.map((child) => {
      const [name, attrs, children] = child;
      const nextAttrs = params.nonScalingStroke ? { [getAttributeName("vector-effect")]: "non-scaling-stroke", ...attrs } : attrs;
      return children ? [name, nextAttrs, children] : [name, nextAttrs];
    })
  ];
}

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
function buildLucideIconForReact(icon, params = {}) {
  return buildLucideIconNode(icon, {
    ...params,
    attributeNames: {
      ...params.attributeNames,
      class: "className",
      "stroke-width": "strokeWidth",
      "stroke-linecap": "strokeLinecap",
      "stroke-linejoin": "strokeLinejoin",
      "vector-effect": "vectorEffect"
    }
  });
}

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/context.mjs
var import_react = require("react");
var LucideContext = (0, import_react.createContext)({});
var useLucideContext = () => (0, import_react.useContext)(LucideContext);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/Icon.mjs
var Icon = (0, import_react2.forwardRef)(
  ({
    color,
    size,
    width,
    height,
    strokeWidth,
    absoluteStrokeWidth,
    nonScalingStroke,
    className = "",
    children,
    iconNode = [],
    icon = {
      node: iconNode,
      aliases: [],
      size: 24
    },
    ...rest
  }, ref) => {
    const {
      size: contextSize = 24,
      strokeWidth: contextStrokeWidth = 2,
      absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
      nonScalingStroke: contextNonScalingStroke = false,
      color: contextColor = "currentColor",
      className: contextClass = ""
    } = useLucideContext() ?? {};
    const hasAccessibleProp = Boolean(children) || hasA11yProp(rest);
    const [name, svgAttributes, builtIconNode = []] = buildLucideIconForReact(icon, {
      color: color ?? contextColor,
      width: width ?? size ?? contextSize,
      height: height ?? size ?? contextSize,
      strokeWidth: strokeWidth ?? contextStrokeWidth,
      absoluteStrokeWidth: absoluteStrokeWidth ?? contextAbsoluteStrokeWidth,
      nonScalingStroke: nonScalingStroke ?? contextNonScalingStroke,
      className: mergeClasses(contextClass, className),
      hasA11yProp: hasAccessibleProp,
      attributes: rest
    });
    return (0, import_react2.createElement)(
      name,
      {
        ref,
        ...svgAttributes
      },
      [
        ...builtIconNode.map(([tag, attrs]) => (0, import_react2.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function createLucideIcon(iconDataOrName, iconNode = [], aliases = []) {
  const iconData = typeof iconDataOrName === "string" ? toLucideIconData(iconDataOrName, iconNode, aliases) : iconDataOrName;
  const Component = (0, import_react3.forwardRef)(
    ({ className, ...props }, ref) => (0, import_react3.createElement)(Icon, {
      ref,
      icon: iconData,
      className,
      ...props
    })
  );
  if (iconData.name) {
    Component.displayName = toPascalCase(iconData.name);
  }
  return Component;
}

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs
var __iconData = {
  name: "loader-circle",
  size: 24,
  node: [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]],
  aliases: ["loader-2"]
};
__iconData.node;
var LoaderCircle = createLucideIcon(__iconData);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/play.mjs
var __iconData2 = {
  name: "play",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
        key: "10ikf1"
      }
    ]
  ]
};
__iconData2.node;
var Play = createLucideIcon(__iconData2);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs
var __iconData3 = {
  name: "rotate-ccw",
  size: 24,
  node: [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
    ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
  ]
};
__iconData3.node;
var RotateCcw = createLucideIcon(__iconData3);

// src/session-message-actions.ts
var pendingKey = "dsh.session-features.pending-message-action";
var pendingActions = /* @__PURE__ */ new Map();
function stagePendingMessageAction(action) {
  pendingActions.set(action.targetSessionId, action);
  try {
    window.sessionStorage.setItem(pendingKey, JSON.stringify(action));
  } catch {
  }
}
function takePendingMessageAction(sessionId) {
  let action = pendingActions.get(sessionId) ?? null;
  pendingActions.delete(sessionId);
  if (!action) {
    try {
      const raw = window.sessionStorage.getItem(pendingKey);
      if (raw) {
        const value = JSON.parse(raw);
        if (value.targetSessionId === sessionId && typeof value.text === "string" && (value.mode === "edit" || value.mode === "resend") && typeof value.createdAt === "number") action = value;
      }
    } catch {
    }
  }
  try {
    const raw = window.sessionStorage.getItem(pendingKey);
    if (raw && JSON.parse(raw).targetSessionId === sessionId) window.sessionStorage.removeItem(pendingKey);
  } catch {
  }
  return action;
}
function messageActionContent(content) {
  if (!Array.isArray(content)) return { text: "", supported: false, reason: "\u65E0\u6CD5\u8BFB\u53D6\u6B64\u6D88\u606F\u5185\u5BB9" };
  const text = content.filter((block) => !!block && typeof block === "object" && block.type === "text").map((block) => typeof block.text === "string" ? block.text : "").join("\n");
  const hasAttachment = content.some((block) => !!block && typeof block === "object" && block.type !== "text");
  if (hasAttachment) return { text, supported: false, reason: "\u542B\u9644\u4EF6\u7684\u6D88\u606F\u6682\u4E0D\u652F\u6301\u81EA\u52A8\u91CD\u53D1\uFF0C\u8BF7\u5728\u65B0\u5206\u652F\u4E2D\u624B\u52A8\u6DFB\u52A0\u9644\u4EF6" };
  if (!text.trim()) return { text, supported: false, reason: "\u6B64\u6D88\u606F\u6CA1\u6709\u53EF\u91CD\u65B0\u53D1\u9001\u7684\u6587\u672C" };
  return { text, supported: true };
}
function messageActionBoundary(seq, cwd) {
  if (!Number.isInteger(seq) || seq < 0) return { kind: "unsupported" };
  if (seq === 0) return cwd ? { kind: "create" } : { kind: "unsupported" };
  return { kind: "fork", atSeq: seq - 1 };
}
function pendingActionMatches(input) {
  const { action, sessionId, now = Date.now() } = input;
  return !!action && sessionId === action.targetSessionId && Number.isFinite(action.createdAt) && now >= action.createdAt && now - action.createdAt <= 6e4;
}

// src/session-continuation-ui.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var endpoint = "/studio/sessions/continuation";
function shouldShowContinueAction(input) {
  return !input.removed && (input.resumable || input.busy);
}
async function responseState(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "\u65E0\u6CD5\u6062\u590D\u4F1A\u8BDD\uFF0C\u8BF7\u91CD\u8BD5");
  return data;
}
function SessionContinueAction({ sessionId, useSession, useInput, inputActions }) {
  const running = useSession((state2) => state2.running ?? false);
  const removed = useSession((state2) => state2.removed ?? false);
  const empty = useInput((state2) => !state2?.draft.trim() && !state2?.attachmentIds.length);
  const draft = useInput((state2) => state2?.draft ?? "");
  const [state, setState] = (0, import_react4.useState)(null);
  const [busy, setBusy] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)("");
  const inFlight = (0, import_react4.useRef)(false);
  const generation = (0, import_react4.useRef)(0);
  const resendDraft = (0, import_react4.useRef)(null);
  const latestDraft = (0, import_react4.useRef)(draft);
  latestDraft.current = draft;
  (0, import_react4.useEffect)(() => {
    const action = takePendingMessageAction(sessionId);
    if (!action || !pendingActionMatches({ action, sessionId })) return;
    if (!inputActions) return;
    inputActions.setDraft(action.text);
    inputActions.persistDraft();
    if (action.mode === "resend") resendDraft.current = action.text;
  }, [sessionId, inputActions]);
  (0, import_react4.useEffect)(() => {
    const text = resendDraft.current;
    if (!text || draft !== text || running || !inputActions) return;
    const timer = window.setTimeout(() => {
      if (latestDraft.current !== text) {
        resendDraft.current = null;
        return;
      }
      resendDraft.current = null;
      inputActions.submit();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [draft, running, inputActions]);
  (0, import_react4.useEffect)(() => {
    const version = ++generation.current;
    const control = new AbortController();
    setState(null);
    setError("");
    setBusy(false);
    inFlight.current = false;
    if (removed) return () => control.abort();
    let timer;
    const update = async () => {
      try {
        const next = await responseState(await fetch(`${endpoint}?sessionId=${encodeURIComponent(sessionId)}`, { signal: control.signal }));
        if (version === generation.current && !inFlight.current && !control.signal.aborted) setState(next);
      } catch {
      }
      if (!control.signal.aborted) timer = setTimeout(() => {
        void update();
      }, 2e3);
    };
    void update();
    return () => {
      control.abort();
      clearTimeout(timer);
    };
  }, [sessionId, running, removed]);
  const resume = async () => {
    if (!state?.resumable || inFlight.current) return;
    const version = generation.current;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const next = await responseState(await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId, checkpoint: state.checkpoint }) }));
      if (generation.current === version) setState(next);
    } catch (cause) {
      if (generation.current === version) setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      if (generation.current === version) {
        inFlight.current = false;
        setBusy(false);
      }
    }
  };
  if (!shouldShowContinueAction({ removed, running, resumable: state?.resumable === true, busy })) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "studio-chat-continuation", "data-studio-resume": "", "data-replaces-send": empty ? "" : void 0, "data-phase": state?.phase, children: [
    error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "studio-chat-continuation-error", role: "alert", children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "studio-chat-play", "aria-label": busy ? "\u6B63\u5728\u7EE7\u7EED\u4F1A\u8BDD" : "\u7EE7\u7EED\u4F1A\u8BDD", title: busy ? "\u6B63\u5728\u6062\u590D\u2026" : state?.workflow ? "\u7EE7\u7EED\u5DE5\u4F5C\u6D41\u4E0E\u4F1A\u8BDD\uFF0C\u4FDD\u7559\u5DF2\u5B8C\u6210\u8282\u70B9" : state?.phase === "paused" ? "\u4F1A\u8BDD\u5DF2\u6682\u505C\uFF0C\u70B9\u51FB\u7EE7\u7EED" : "\u4F1A\u8BDD\u610F\u5916\u4E2D\u65AD\uFF0C\u70B9\u51FB\u7EE7\u7EED", disabled: busy, onClick: () => {
      void resume();
    }, children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { size: 16, "aria-hidden": "true", className: "studio-chat-resuming" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { size: 16, fill: "currentColor", strokeWidth: 1.5, "aria-hidden": "true" }) })
  ] });
}
var continuationStyles = `
.studio-chat-continuation { display:inline-flex; align-items:center; gap:8px; flex:none; order:10; }
.studio-chat-continuation > button.studio-chat-play { display:grid; place-items:center; flex:none; width:34px; height:34px; padding:0; border:0; border-radius:999px; corner-shape:round; background:var(--dsw-alias-button-info-fill); color:#fff; cursor:pointer; transform:translateY(-2px); transition:background-color .1s; }
.studio-chat-continuation > button.studio-chat-play:hover:not(:disabled) { background:var(--dsw-alias-button-info-hover); }
.studio-chat-play:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:3px; }
.studio-chat-play:disabled { opacity:.55; cursor:wait; }
.studio-chat-continuation-error { max-width:240px; overflow-wrap:anywhere; color:var(--dsw-alias-state-danger-primary, #b42318); font-size:12px; line-height:18px; }
.studio-chat-resuming { animation:studio-chat-spin 1s linear infinite; }
@keyframes studio-chat-spin { to { transform:rotate(360deg); } }
[data-slot="conversation.composer.bar"] div:has(> [data-slot="conversation.input.right"] > [data-studio-resume]) { display:contents; }
[data-slot="conversation.composer.bar"]:has([data-studio-resume][data-replaces-send]) button:is([aria-label="\u53D1\u9001\u6D88\u606F"], [aria-label="Send message"]) { display:none; }
@media (prefers-reduced-motion:reduce) { .studio-chat-resuming { animation:none; } }
`;

// src/session-message-actions-ui.tsx
var import_react5 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function registerSessionMessageActions(slots, services) {
  const Native = slots.entries("conversation.chat.node")
    .filter((entry) => entry.options.key === "user" && !entry.component?.__studioMessageActions && !entry.component?.type?.__studioMessageActions)
    .sort((a, b) => (a.options.priority ?? 0) - (b.options.priority ?? 0))[0]?.component;
  if (!Native) throw new Error("原生用户消息渲染器不可用");
  function UserMessageWithActions(props) {
    const running = props.useSession((state) => state.running === true);
    const removed = props.useSession((state) => state.removed === true);
    const canFork = props.useAccess("session/fork");
    const canCreate = props.useAccess("session/create");
    const { text, supported, reason } = messageActionContent(props.node.data.content);
    const [busy, setBusy] = (0, import_react5.useState)(false);
    const [error, setError] = (0, import_react5.useState)("");
    const boundary = messageActionBoundary(props.node.data.seq, props.cwd);
    const invalidBoundary = boundary.kind === "unsupported";
    const hasAccess = boundary.kind === "create" ? canCreate : canFork;
    const disabled = running || removed || !hasAccess || busy || !supported || invalidBoundary || !props.sessionId;
    const firstMessage = boundary.kind === "create";
    const actionTitle = running ? "请先等待当前会话结束" : removed ? "已删除的会话不能创建消息分支" : !hasAccess ? "当前账号无权创建消息分支" : invalidBoundary ? "无法在此消息之前建立分支" : reason;
    const startBranch = async (mode) => {
      if (!props.sessionId || running || removed || !hasAccess || !supported || invalidBoundary || busy) return;
      setError("");
      setBusy(true);
      try {
        const childId = boundary.kind === "create" ? await services.create({ cwd: props.cwd }) : await services.fork({ sessionId: props.sessionId, atSeq: boundary.atSeq, increaseTitle: true });
        stagePendingMessageAction({ targetSessionId: childId, text, mode, createdAt: Date.now() });
        services.openSession(childId);
        window.setTimeout(() => setBusy(false), 1800);
      } catch {
        setBusy(false);
        setError("创建消息分支失败，请稍后重试");
      }
    };
    if (props.node.kind !== "user") return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Native, { ...props, renderSlotChain: props.renderFactorySlot });
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "studio-message-actions-wrap", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Native, { ...props, renderSlotChain: props.renderFactorySlot }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "studio-message-actions", "aria-label": "消息操作", children: [
        error && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { role: "status", children: error }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", disabled, title: actionTitle ?? (firstMessage ? "新建会话并将文字放入输入框" : "在此消息之前创建分支，并将文字放入输入框"), onClick: () => {
          void startBranch("edit");
        }, children: "撤回并编辑" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", disabled, title: actionTitle ?? (firstMessage ? "新建会话并重新发送这条消息" : "在此消息之前创建分支并重新发送这条消息"), onClick: () => {
          void startBranch("resend");
        }, children: "重新发送" })
      ] })
    ] });
  }
  UserMessageWithActions.__studioMessageActions = true;
  return slots.register({ name: "conversation.chat.node", key: "user", priority: -10, locale: "chat" }, UserMessageWithActions);
}
var messageActionStyles = `
.studio-message-actions { display:flex; justify-content:flex-end; align-items:center; gap:4px; min-height:26px; margin-top:1px; }
.studio-message-actions button { border:0; border-radius:var(--dsw-radius-sm,6px); padding:3px 8px; background:transparent; color:var(--dsw-alias-label-tertiary,#87909e); font:inherit; font-size:12px; line-height:18px; cursor:pointer; }
.studio-message-actions button:hover:not(:disabled) { background:var(--dsw-alias-interactive-bg-hover,#eef1f5); color:var(--dsw-alias-label-secondary,#4f5968); }
.studio-message-actions button:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary,#4578ed); outline-offset:1px; }
.studio-message-actions button:disabled { opacity:.48; cursor:not-allowed; }
.studio-message-actions [role="status"] { color:var(--dsw-alias-state-danger-primary,#b42318); font-size:12px; }
@media (prefers-reduced-motion:reduce) { .studio-message-actions { transition:none; } }
`;

// src/session-resume-notice.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function registerSessionResumeNotice(slots) {
  function ResumeTrigger(props) {
    const source = props.node.data.source;
    if (source?.form === "notice" && typeof source.summary === "string" && (source.kind === "visual-workflow-resume" || source.kind === "studio-continuation")) {
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("details", { className: "studio-resume-notice", "data-studio-resume-notice": "", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("summary", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(RotateCcw, { size: 14, strokeWidth: 1.5, "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: source.summary })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("pre", { children: props.node.data.content.filter((block) => block.type === "text").map((block) => block.text ?? "").join("\n") })
      ] });
    }
    const fallback = slots.entries("conversation.chat.node").filter((entry) => entry.options.key === "turn-trigger" && entry.component !== ResumeTrigger).sort((a, b) => (a.options.priority ?? 0) - (b.options.priority ?? 0))[0];
    if (!fallback) throw new Error("Native turn-trigger renderer is unavailable");
    const Native = fallback.component;
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Native, { ...props });
  }
  return slots.register({ name: "conversation.chat.node", key: "turn-trigger", priority: -10, locale: "chat" }, ResumeTrigger);
}
var resumeNoticeStyles = `
.studio-resume-notice { margin:12px 0; color:var(--dsw-alias-text-secondary, #68778d); font-size:13px; line-height:20px; }
.studio-resume-notice > summary { display:flex; align-items:center; gap:8px; width:fit-content; cursor:pointer; list-style:none; border-radius:6px; }
.studio-resume-notice > summary::-webkit-details-marker { display:none; }
.studio-resume-notice > summary:hover { color:var(--dsw-alias-state-business-primary, #4578ed); }
.studio-resume-notice > summary:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary, #4578ed); outline-offset:3px; }
.studio-resume-notice > pre { white-space:pre-wrap; overflow-wrap:anywhere; margin:8px 0; padding:12px; border-radius:10px; background:var(--dsw-alias-bg-base, #f6f8fa); font:12px/20px ui-monospace,monospace; }
`;

// src/plugin-settings.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var pluginSettingsStyles = `
.studio-plugin-settings { width:100%; min-width:0; box-sizing:border-box; color:var(--dsw-alias-label-primary); font:inherit; font-size:13px; line-height:1.5; }
/* DSH renders sidebar.footer.action inside .footerActions and may wrap each
   registered component once. Target that shared row (or direct-child variant),
   not only the per-entry wrapper, so plugin shortcuts stack instead of squeeze. */
div:has(> button.wf-sidebar-entry),
div:has(> button.eda-sidebar-entry),
div:has(> div > button.wf-sidebar-entry),
div:has(> div > button.eda-sidebar-entry) { display:flex; flex-direction:column; align-items:stretch; gap:4px; }
.studio-plugin-settings p { margin:12px 0; color:var(--dsw-alias-label-tertiary); font-size:12px; line-height:1.5; overflow-wrap:anywhere; }
.studio-plugin-settings h3 { margin:0 0 12px; font-size:13px; line-height:1.5; font-weight:600; }
.studio-plugin-settings__status { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:16px 0; }
.studio-plugin-settings__status-label { display:flex; flex-direction:column; gap:4px; font-size:13px; }
.studio-plugin-settings__status-label small { font-size:12px; color:var(--dsw-alias-label-tertiary); }
.studio-plugin-settings__fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; padding:16px 0; }
.studio-plugin-settings label { display:flex; flex-direction:column; gap:6px; min-width:0; font-size:13px; font-weight:500; }
.studio-plugin-settings :is(input,select,textarea) { width:100%; min-width:0; box-sizing:border-box; height:34px; padding:0 12px; border:.5px solid var(--dsw-alias-border-l4); border-radius:var(--dsw-radius-md); background:var(--dsw-alias-bg-layer-3); color:var(--dsw-alias-label-primary); font:inherit; font-size:13px; font-weight:400; line-height:1.5; }
.studio-plugin-settings input[type=number] { font-variant-numeric:tabular-nums; }
.studio-plugin-settings input::placeholder { color:var(--dsw-alias-label-dimmed); }
.studio-plugin-settings :is(input,select,textarea):disabled { color:var(--dsw-alias-label-tertiary); cursor:default; }
.studio-plugin-settings :is(input,select,textarea):focus-visible { outline:none; border-color:var(--dsw-alias-state-business-primary); }
.studio-plugin-settings select { text-overflow:ellipsis; cursor:pointer; }
.studio-plugin-settings select:disabled { cursor:default; }
.studio-eda-tool-row { display:flex; flex-direction:column; gap:6px; }
.studio-eda-tool-row__toggle { display:flex; align-items:center; gap:8px; font-size:13px; font-weight:500; }
.studio-eda-tool-row input[type=checkbox] { width:auto; height:auto; margin:0; padding:0; }

.studio-plugin-settings__save { display:inline-flex; align-items:center; justify-content:center; gap:6px; appearance:none; border:1px solid transparent; border-radius:var(--dsw-radius-md); padding:5px 14px; background:var(--dsw-alias-label-primary); color:var(--dsw-alias-bg-layer-3); font:inherit; font-size:13px; line-height:1.5; cursor:pointer; white-space:nowrap; }
.studio-plugin-settings__save:disabled { opacity:.4; cursor:default; }
.studio-plugin-settings button:focus-visible { outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary)); outline-offset:2px; }
.studio-plugin-switch { box-sizing:border-box; position:relative; display:inline-flex; flex:0 0 auto; width:36px; height:20px; padding:2px; border:0; border-radius:999px; corner-shape:round; background:var(--dsw-alias-border-l3); cursor:pointer; }
.studio-plugin-switch span { display:block; width:16px; height:16px; border-radius:50%; corner-shape:round; background:var(--dsw-alias-switch-thumb); transition:transform 120ms ease; }
.studio-plugin-switch[aria-checked=true] { background:var(--dsw-alias-brand-primary); }
.studio-plugin-switch[aria-checked=true] span { transform:translateX(16px); background:var(--dsw-alias-label-primary-foreground); }
.studio-plugin-switch:disabled { opacity:.5; cursor:default; }
/* Keep the native select semantics and keyboard handling while theming its popup. */
@supports (appearance:base-select) {
  :is(.studio-plugin-settings,.studio-native-providers) select:not([multiple]),:is(.studio-plugin-settings,.studio-native-providers) select:not([multiple])::picker(select) { appearance:base-select; }
  :is(.studio-plugin-settings,.studio-native-providers) select:not([multiple]) { align-items:center; }
  :is(.studio-plugin-settings,.studio-native-providers) select:not([multiple])::picker-icon { color:var(--dsw-alias-label-tertiary); }
  :is(.studio-plugin-settings,.studio-native-providers) select:not([multiple])::picker(select) { box-sizing:border-box; margin:4px 0; padding:4px; max-height:320px; overflow:auto; border:.5px solid var(--dsw-alias-border-l4); border-radius:var(--dsw-radius-lg); background:var(--dsw-alias-bg-layer-3); color:var(--dsw-alias-label-primary); box-shadow:0 8px 24px #00000014; font:inherit; font-size:13px; }
  :is(.studio-plugin-settings,.studio-native-providers) option { box-sizing:border-box; min-height:32px; padding:6px 10px; gap:8px; border-radius:var(--dsw-radius-sm); }
  :is(.studio-plugin-settings,.studio-native-providers) option:is(:hover,:focus-visible) { background:var(--dsw-alias-interactive-bg-hover); outline:none; }
  :is(.studio-plugin-settings,.studio-native-providers) option:checked { background:var(--dsw-alias-interactive-bg-active); }
  :is(.studio-plugin-settings,.studio-native-providers) option::checkmark { color:var(--dsw-alias-state-business-primary); }
}
@media (max-width:640px) { .studio-plugin-settings__fields { grid-template-columns:minmax(0,1fr); } }
@media (pointer:coarse) { .studio-plugin-settings :is(input,select,textarea) { font-size:16px; } }
@media (prefers-reduced-motion:reduce) { .studio-plugin-switch span { transition:none; } }
`;

// src/session-thought-status.ts
function installUnifiedThoughtStatus(doc = document) {
  const processSelector = '[data-step-process][data-chat-turn]';
  const thoughtSelector = '[data-variant="think"]';
  const summaryAttribute = 'data-session-features-thought-summary';
  const memberAttribute = 'data-session-features-thought-member';
  const records = new Map();
  let queued = false, disposed = false, hideAll = false;
  const root = doc.documentElement;
  const previousMode = root.getAttribute('data-session-features-thoughts');
  const owns = (element, group) => element.closest(processSelector) === group;
  const contentOf = group => Array.from(group.querySelectorAll('[data-step-process-content]')).find(element => owns(element, group));
  const setAttribute = (element, key, value) => {
    if (element.getAttribute(key) !== value) element.setAttribute(key, value);
  };
  const pureThoughtRow = (row, group) => {
    if (!row || row === group) return false;
    if (row.dataset.chatGroupPart === 'reasoning') return true;
    if (row.querySelector('[data-tool-call], [data-chat-steering-batch], img, video, audio, canvas, table')) return false;
    const copy = row.cloneNode(true);
    copy.querySelectorAll(thoughtSelector).forEach(node => node.remove());
    return copy.textContent.trim() === '';
  };
  const makeSummary = group => {
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'studio-thought-subgroup-summary';
    button.setAttribute(summaryAttribute, '');
    const leading = doc.createElement('span');
    leading.className = 'studio-thought-subgroup-leading';
    leading.setAttribute('aria-hidden', 'true');
    for (const [iconName, className] of [
      ['dsw-icon-think-outline-regular', 'studio-thought-subgroup-think-icon'],
      ['dsw-icon-chevron-down-outline-regular', 'studio-thought-subgroup-chevron']
    ]) {
      const icon = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('width', '14'); icon.setAttribute('height', '14');
      icon.setAttribute('data-icon', iconName); icon.setAttribute('class', className);
      const use = doc.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', `#${iconName}`); icon.append(use); leading.append(icon);
    }
    const label = doc.createElement('span');
    label.className = 'studio-thought-subgroup-label';
    button.append(leading, label);
    button.onclick = () => {
      const expanded = group.dataset.sessionFeaturesThoughtExpanded !== 'true';
      group.dataset.sessionFeaturesThoughtExpanded = String(expanded);
      updateSummary(group, records.get(group));
    };
    return { button, label, count: 0, members: new Set() };
  };
  const updateSummary = (group, record) => {
    if (!record) return;
    const expanded = group.dataset.sessionFeaturesThoughtExpanded === 'true';
    const label = `思考 · ${record.count} 条`;
    if (record.label.textContent !== label) record.label.textContent = label;
    setAttribute(record.button, 'aria-expanded', String(expanded));
    setAttribute(record.button, 'aria-label', `${expanded ? '收起' : '展开'} ${record.count} 条思考记录`);
  };
  const release = (group, record) => {
    record.button.remove();
    for (const member of record.members) member.removeAttribute(memberAttribute);
    records.delete(group);
  };
  const reconcile = () => {
    queued = false;
    if (disposed) return;
    const groups = Array.from(doc.querySelectorAll(`[data-slot="conversation.chat.flow"] ${processSelector}`));
    for (const [group, record] of records) {
      if (!group.isConnected || !groups.includes(group)) release(group, record);
    }
    for (const group of groups) {
      const content = contentOf(group);
      const bubbles = Array.from(group.querySelectorAll(thoughtSelector)).filter(bubble => owns(bubble, group));
      let record = records.get(group);
      if (!content || bubbles.length === 0) {
        if (record) release(group, record);
        continue;
      }
      if (!record) {
        record = makeSummary(group);
        records.set(group, record);
      }
      record.count = bubbles.length;
      const members = new Set();
      for (const bubble of bubbles) {
        const row = bubble.closest('[data-chat-anchor-key]');
        if (pureThoughtRow(row, group)) members.add(row);
      }
      for (const member of record.members) {
        if (!members.has(member)) member.removeAttribute(memberAttribute);
      }
      for (const member of members) setAttribute(member, memberAttribute, '');
      record.members = members;
      // One stable button per primary group, always before its first tool row.
      // Never reparent a native row or take ownership of native hidden/motion state.
      if (record.button.parentElement !== content || content.firstElementChild !== record.button) {
        content.insertBefore(record.button, content.firstChild);
      }
      updateSummary(group, record);
    }
  };
  const schedule = mutations => {
    if (disposed || queued) return;
    // Streaming text updates inside an existing row do not change grouping.
    const relevant = !mutations || mutations.some(mutation => {
      if (mutation.type === 'attributes') return true;
      const target = mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
      if (target?.closest(`[${summaryAttribute}], ${thoughtSelector}`)) return false;
      // A legacy mixed Assistant row can gain an answer beside its reasoning.
      // Reclassify it before paint instead of leaving the answer hidden too.
      if (target?.closest(processSelector)) return true;
      return [...mutation.addedNodes, ...mutation.removedNodes].some(node => node.nodeType === 1
        && !node.hasAttribute(summaryAttribute)
        && (node.matches(`${processSelector}, ${thoughtSelector}, [data-chat-anchor-key]`)
          || node.querySelector(`${processSelector}, ${thoughtSelector}`)));
    });
    if (!relevant) return;
    queued = true;
    // MutationObserver and microtasks settle before paint, unlike a 50ms timer.
    queueMicrotask(reconcile);
  };
  const Observer = doc.defaultView?.MutationObserver ?? MutationObserver;
  const observer = new Observer(schedule);
  root.setAttribute('data-session-features-thoughts', 'grouped');
  observer.observe(root, { subtree: true, childList: true, attributes: true,
    attributeFilter: ['data-variant', 'data-chat-group-part', 'data-chat-flow-kind'] });
  reconcile();
  const stop = () => {
    disposed = true;
    observer.disconnect();
    for (const [group, record] of records) {
      release(group, record);
      delete group.dataset.sessionFeaturesThoughtExpanded;
    }
    if (previousMode === null) root.removeAttribute('data-session-features-thoughts');
    else root.setAttribute('data-session-features-thoughts', previousMode);
  };
  stop.setHideAll = value => {
    hideAll = value === true;
    root.setAttribute('data-session-features-thoughts', hideAll ? 'hidden' : 'grouped');
  };
  return stop;
}
var unifiedThoughtStatusStyles = `
/* CSS gates already cover newly inserted/replaced rows before the observer runs.
   Do not write native hidden attributes: React and flow-motion own those. */
html[data-session-features-thoughts="grouped"] [data-step-process][data-chat-turn]:not([data-session-features-thought-expanded="true"]) :is([data-variant="think"], [data-chat-group-part="reasoning"], [data-session-features-thought-member]),
html[data-session-features-thoughts="hidden"] :is([data-variant="think"], [data-chat-group-part="reasoning"], [data-session-features-thought-member], [data-session-features-thought-summary]) {
  display:none !important;
}
/* Reasoning can share an Assistant row with a visible answer. Remove just its
   otherwise empty inline wrapper so the answer keeps its normal spacing. */
html[data-session-features-thoughts="grouped"] [data-step-process][data-chat-turn]:not([data-session-features-thought-expanded="true"]) div:has(> [data-variant="think"]):not(:has(> :not([data-variant="think"]))),
html[data-session-features-thoughts="hidden"] div:has(> [data-variant="think"]):not(:has(> :not([data-variant="think"]))) {
  display:none !important;
}
.studio-thought-subgroup-summary {
  position:sticky; top:0; z-index:4;
  display:flex; align-items:center; gap:6px; box-sizing:border-box; width:100%; min-height:24px; margin:0 !important;
  padding:0 2px; border:0; border-radius:var(--dsw-radius-sm,6px);
  background:var(--dsw-alias-bg-base,#fff);
  color:var(--dsw-alias-label-tertiary,#87909e);
  font:inherit; font-size:var(--dsh-content-font-size,14px); font-weight:400;
  line-height:calc(24px + var(--dsh-content-font-delta,0px));
  text-align:left; cursor:pointer;
  transition:none !important; overflow-anchor:none;
}
.studio-thought-subgroup-leading {
  position:relative; flex:none; display:inline-flex; align-items:center; justify-content:center;
  width:calc(16px + var(--dsh-content-font-delta,0px)); height:calc(16px + var(--dsh-content-font-delta,0px));
  color:inherit;
}
.studio-thought-subgroup-leading svg {
  position:absolute; inset:0; width:calc(14px + var(--dsh-content-font-delta,0px));
  height:calc(14px + var(--dsh-content-font-delta,0px)); margin:auto;
  transition:opacity 100ms ease;
}
.studio-thought-subgroup-chevron { opacity:0; }
.studio-thought-subgroup-summary[aria-expanded="true"] .studio-thought-subgroup-think-icon,
.studio-thought-subgroup-summary:focus-visible .studio-thought-subgroup-think-icon { opacity:0; }
.studio-thought-subgroup-summary[aria-expanded="true"] .studio-thought-subgroup-chevron,
.studio-thought-subgroup-summary:focus-visible .studio-thought-subgroup-chevron { opacity:1; }
@media (hover:hover) {
  .studio-thought-subgroup-summary:hover .studio-thought-subgroup-think-icon { opacity:0; }
  .studio-thought-subgroup-summary:hover .studio-thought-subgroup-chevron { opacity:1; }
}
.studio-thought-subgroup-label { font:inherit; font-weight:400; line-height:inherit; }
.studio-thought-subgroup-summary:hover { background:var(--dsw-alias-interactive-bg-hover,#eef1f5); color:var(--dsw-alias-label-secondary,#4f5968); }
.studio-thought-subgroup-summary:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary,#4578ed); outline-offset:1px; }
@media (prefers-reduced-motion:reduce) { .studio-thought-subgroup-leading svg { transition:none; } }
`;

// src/client-session-ui.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var SESSION_FEATURES_PACKAGE = "@agent-studio/plugin-session-features";
var SESSION_FEATURES_ROW = "studio-session-features";
var emptyThoughtSettingsSnapshot = { status: "loading", writable: false, value: undefined };
var emptyThoughtSettingsForm = { getSnapshot: () => emptyThoughtSettingsSnapshot, subscribe: () => () => {}, mutate: async () => false };
function SessionFeaturesSettings({ view, form = emptyThoughtSettingsForm }) {
  const state = (0, import_react4.useSyncExternalStore)(listener => form.subscribe(listener), () => form.getSnapshot());
  const [saving, setSaving] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)("");
  const hidden = state.value?.hideAllThoughts === true;
  const change = async () => {
    if (saving || !state.writable) return;
    setSaving(true); setError("");
    try {
      const accepted = await form.mutate([{ op: "set", path: ["hideAllThoughts"], value: !hidden }], state.revision);
      if (!accepted) throw new Error("设置未保存，请刷新插件设置后重试。");
    } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
    finally { setSaving(false); }
  };
  if (view === "summary") return (0, import_jsx_runtime5.jsx)("span", { children: "保存任务进度，恢复中断会话，管理消息操作与思考气泡显示。" });
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("section", { className: "studio-plugin-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h3", { children: "\u4F1A\u8BDD\u529F\u80FD\u589E\u5F3A" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { children: "\u81EA\u52A8\u4FDD\u5B58\u4F1A\u8BDD TodoList \u548C TaskPlan\uFF0C\u652F\u6301\u4ECE\u68C0\u67E5\u70B9\u7EE7\u7EED\u4F1A\u8BDD\u3002\u666E\u901A\u6587\u672C\u6D88\u606F\u53EF\u64A4\u56DE\u5E76\u7F16\u8F91\uFF0C\u6216\u5728\u65B0\u5206\u652F\u4E2D\u91CD\u65B0\u53D1\u9001\uFF1B\u539F\u4F1A\u8BDD\u8BB0\u5F55\u4F1A\u4FDD\u7559\u3002" }),
    (0, import_jsx_runtime5.jsxs)("div", { className: "studio-plugin-settings__status", children: [
      (0, import_jsx_runtime5.jsxs)("div", { className: "studio-plugin-settings__status-label", children: [
        (0, import_jsx_runtime5.jsx)("span", { id: "studio-hide-thoughts-label", children: "隐藏全部思考气泡" }),
        (0, import_jsx_runtime5.jsx)("small", { children: "隐藏思考内容和汇总入口，保留工具、正文及一级组操作。设置保存后立即应用于所有会话。" })
      ] }),
      (0, import_jsx_runtime5.jsx)("button", { type: "button", role: "switch", className: "studio-plugin-switch", "aria-labelledby": "studio-hide-thoughts-label", "aria-checked": hidden, disabled: saving || state.status !== "ready" || !state.writable, onClick: change, children: (0, import_jsx_runtime5.jsx)("span", {}) })
    ] }),
    error && (0, import_jsx_runtime5.jsx)("p", { role: "alert", children: error }),
    state.status === "unavailable" && (0, import_jsx_runtime5.jsx)("p", { role: "status", children: "设置暂不可用，请重新加载插件设置。" })
  ] });
}
var inject = [];
function apply(ctx) {
  let stopThoughtStatus;
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = "studio-session-features";
    style.textContent = continuationStyles + resumeNoticeStyles + pluginSettingsStyles + messageActionStyles + unifiedThoughtStatusStyles;
    document.head.append(style);
    stopThoughtStatus = installUnifiedThoughtStatus(document);
    return () => {
      stopThoughtStatus();
      style.remove();
    };
  }, "session features: styles");
  ctx.inject(["slots", "configForms"], (child) => {
    const slots = child.get("slots"), form = child.get("configForms").get(SESSION_FEATURES_ROW);
    child.effect(() => {
      const sync = () => stopThoughtStatus?.setHideAll(form.getSnapshot().value?.hideAllThoughts === true);
      const unsubscribe = form.subscribe(sync);
      sync();
      return unsubscribe;
    }, "session features: native thought display preference");
    const Settings = props => (0, import_jsx_runtime5.jsx)(SessionFeaturesSettings, { ...props, form });
    child.effect(() => slots.inject("plugins.bundle.config", () => slots.register({ name: "plugins.bundle.config", key: SESSION_FEATURES_PACKAGE }, Settings)), "session features: bundle settings");
    child.effect(() => slots.inject("plugins.row.config", () => slots.register({ name: "plugins.row.config", key: `${SESSION_FEATURES_PACKAGE}#${SESSION_FEATURES_ROW}` }, Settings)), "session features: component settings");
  });
  ctx.inject(["slots", "sessions", "uiWorkspace"], (child) => {
    const slots = child.get("slots");
    const sessions = child.get("sessions");
    const uiWorkspace = child.get("uiWorkspace");
    child.effect(() => slots.inject("conversation.input.right", () => slots.register({ name: "conversation.input.right", id: "studio-chat-continue", order: 1e3 }, SessionContinueAction)), "session features: continue action");
    child.effect(() => {
      let disposed = false;
      let attempts = 0;
      let timer;
      let disposeInjection;
      const services = {
        fork: (request) => sessions.fork(request),
        create: (request) => sessions.create(request),
        openSession: (sessionId) => uiWorkspace.openSession(sessionId)
      };
      const connect = () => {
        if (disposed) return;
        const userEntry = slots.entries("conversation.chat.node").find((entry) => entry.options.key === "user");
        if (!userEntry?.children?.["conversation.chat.user.before"]) {
          if (attempts++ < 120) timer = window.setTimeout(connect, 100);
          else console.warn("[session-features] 用户消息操作槽未就绪，撤回与重发按钮未注册");
          return;
        }
        disposeInjection = slots.inject("conversation.chat.node", () => registerSessionMessageActions(slots, services));
      };
      connect();
      return () => {
        disposed = true;
        window.clearTimeout(timer);
        disposeInjection?.();
      };
    }, "session features: message retract and resend actions");
    child.effect(() => slots.inject("conversation.chat.node", () => registerSessionResumeNotice(slots)), "session features: resume notice");
  });
}
/*! Bundled license information:

lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs:
lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs:
lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs:
lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs:
lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs:
lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs:
lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs:
lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs:
lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs:
lucide-react/dist/esm/context.mjs:
lucide-react/dist/esm/Icon.mjs:
lucide-react/dist/esm/createLucideIcon.mjs:
lucide-react/dist/esm/icons/loader-circle.mjs:
lucide-react/dist/esm/icons/play.mjs:
lucide-react/dist/esm/icons/rotate-ccw.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.65.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
return module.exports;}});
