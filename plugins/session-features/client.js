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

// src/session-continuation-ui.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var endpoint = "/studio/sessions/continuation";
async function responseState(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "\u65E0\u6CD5\u6062\u590D\u4F1A\u8BDD\uFF0C\u8BF7\u91CD\u8BD5");
  return data;
}
function SessionContinueAction({ sessionId, useSession, useInput }) {
  const running = useSession((state2) => state2.running ?? false);
  const removed = useSession((state2) => state2.removed ?? false);
  const empty = useInput((state2) => !state2?.draft.trim() && !state2?.attachmentIds.length);
  const [state, setState] = (0, import_react4.useState)(null);
  const [busy, setBusy] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)("");
  const inFlight = (0, import_react4.useRef)(false);
  const generation = (0, import_react4.useRef)(0);
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
  if (removed || running || !empty || !state?.resumable && !busy) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "studio-chat-continuation", "data-studio-resume": "", "data-phase": state?.phase, children: [
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
[data-slot="conversation.composer.bar"]:has([data-studio-resume]) button:is([aria-label="\u53D1\u9001\u6D88\u606F"], [aria-label="Send message"]) { display:none; }
@media (prefers-reduced-motion:reduce) { .studio-chat-resuming { animation:none; } }
`;

// src/session-resume-notice.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function registerSessionResumeNotice(slots) {
  function ResumeTrigger(props) {
    const source = props.node.data.source;
    if (source?.form === "notice" && typeof source.summary === "string" && (source.kind === "visual-workflow-resume" || source.kind === "studio-continuation")) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("details", { className: "studio-resume-notice", "data-studio-resume-notice": "", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("summary", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(RotateCcw, { size: 14, strokeWidth: 1.5, "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: source.summary })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { children: props.node.data.content.filter((block) => block.type === "text").map((block) => block.text ?? "").join("\n") })
      ] });
    }
    const fallback = slots.entries("conversation.chat.node").filter((entry) => entry.options.key === "turn-trigger" && entry.component !== ResumeTrigger).sort((a, b) => (a.options.priority ?? 0) - (b.options.priority ?? 0))[0];
    if (!fallback) throw new Error("Native turn-trigger renderer is unavailable");
    const Native = fallback.component;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Native, { ...props });
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
var import_jsx_runtime3 = require("react/jsx-runtime");
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

// src/client-session-ui.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var SESSION_FEATURES_PACKAGE = "@agent-studio/plugin-session-features";
function SessionFeaturesSettings() {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "studio-plugin-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { children: "\u4F1A\u8BDD\u63A7\u5236\u4E0E\u7F51\u7EDC\u6062\u590D" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: "\u53EF\u5728\u8F93\u5165\u680F\u6682\u505C\u6216\u7EE7\u7EED\u4F1A\u8BDD\u3002\u9047\u5230\u8FDE\u63A5\u65AD\u5F00\u3001\u8D85\u65F6\u7B49\u4E34\u65F6\u7F51\u7EDC\u6545\u969C\u65F6\uFF0C\u4F1A\u81EA\u52A8\u7B49\u5F85\u5E76\u91CD\u8BD5\u6700\u591A 3 \u6B21\uFF1B\u5DF2\u5B8C\u6210\u7684\u5DE5\u5177\u7ED3\u679C\u4F1A\u4FDD\u7559\uFF0C\u6062\u590D\u524D\u4F1A\u68C0\u67E5\u64CD\u4F5C\u72B6\u6001\u4EE5\u51CF\u5C11\u91CD\u590D\u6267\u884C\u3002" })
  ] });
}
var inject = [];
function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = "studio-session-features";
    style.textContent = continuationStyles + resumeNoticeStyles + pluginSettingsStyles;
    document.head.append(style);
    return () => style.remove();
  }, "session features: styles");
  ctx.inject(["slots"], (child) => {
    const slots = child.get("slots");
    child.effect(() => slots.inject("conversation.input.right", () => slots.register({ name: "conversation.input.right", id: "studio-chat-continue", order: 1e3 }, SessionContinueAction)), "session features: continue action");
    child.effect(() => slots.inject("conversation.chat.node", () => registerSessionResumeNotice(slots)), "session features: resume notice");
    child.effect(() => slots.inject("plugins.bundle.config", () => slots.register({ name: "plugins.bundle.config", key: SESSION_FEATURES_PACKAGE }, SessionFeaturesSettings)), "session features: bundle settings");
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
