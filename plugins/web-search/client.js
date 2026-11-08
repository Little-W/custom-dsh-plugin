window.__ModuleLoader__.load({id:"@agent-studio/plugin-web-search",factory:(require)=>{var module={exports:{}};var exports=module.exports;
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

// apps/dsh/src/client-web-search.tsx
var client_web_search_exports = {};
__export(client_web_search_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_web_search_exports);

// apps/dsh/src/plugin-settings.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function PluginSwitch({ label, checked, disabled, onChange }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      type: "button",
      className: "studio-plugin-switch",
      role: "switch",
      "aria-label": label,
      "aria-checked": checked,
      disabled,
      onClick: onChange,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
    }
  );
}
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

// apps/dsh/src/search-native-settings.tsx
var import_react = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var emptySearchForm = { getSnapshot: () => emptySnapshot, subscribe: () => () => {
}, mutate: async () => false };
var emptySnapshot = { writable: false, status: "unavailable" };
function useSearchForm(form) {
  return (0, import_react.useSyncExternalStore)((listener) => form.subscribe(listener), () => form.getSnapshot());
}
function SearchCredentialEditor({ credentials, reference }) {
  const [configured, setConfigured] = (0, import_react.useState)(false), [writable, setWritable] = (0, import_react.useState)(false), [key, setKey] = (0, import_react.useState)(""), [message, setMessage] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false);
  const generation = (0, import_react.useRef)(0);
  (0, import_react.useEffect)(() => {
    const seq = ++generation.current;
    setKey("");
    setMessage("");
    void credentials.describe([reference]).then((result) => {
      if (generation.current !== seq) return;
      if (!result.ok) throw Error("\u65E0\u6CD5\u8BFB\u53D6\u51ED\u636E\u72B6\u6001");
      setConfigured(result.value[reference]?.configured ?? false);
      setWritable(result.value[reference]?.writable ?? true);
    }).catch((error) => {
      if (generation.current === seq) setMessage(String(error));
    });
    return () => {
      generation.current++;
    };
  }, [credentials, reference]);
  const save = async () => {
    const seq = generation.current;
    setBusy(true);
    setMessage("");
    try {
      const saved = await credentials.set(reference, key);
      if (!saved.ok) throw Error("API Key \u4FDD\u5B58\u5931\u8D25");
      const result = await credentials.describe([reference]);
      if (generation.current === seq) {
        if (!result.ok || !result.value[reference]?.configured) throw Error("\u51ED\u636E\u4FDD\u5B58\u672A\u6210\u529F");
        setConfigured(true);
        setKey("");
        setMessage("API Key \u5DF2\u4FDD\u5B58\u3002");
      }
    } catch (error) {
      if (generation.current === seq) setMessage(String(error));
    } finally {
      if (generation.current === seq) setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "studio-search-settings__connection", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { children: [
      "API Key",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { "aria-label": "\u641C\u7D22 API Key", type: "password", autoComplete: "new-password", placeholder: configured ? "\u5DF2\u914D\u7F6E\uFF1B\u7559\u7A7A\u4FDD\u7559\u539F\u5BC6\u94A5" : "\u53EF\u5728\u6B64\u914D\u7F6E\u63D0\u4F9B\u5546\u51ED\u636E", value: key, disabled: busy || !writable, onChange: (event) => setKey(event.target.value) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { children: [
      configured ? "\u5DF2\u914D\u7F6E\u51ED\u636E\u3002" : "\u5F53\u524D\u672A\u914D\u7F6E\u51ED\u636E\u3002",
      " \u51ED\u636E\u7531\u7CFB\u7EDF\u7EDF\u4E00\u4FDD\u7BA1\uFF0C\u4E0D\u5199\u5165\u641C\u7D22\u8BBE\u7F6E\u3002"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "studio-plugin-settings__save", disabled: busy || !writable || !key.trim(), onClick: () => {
      void save();
    }, children: "\u4FDD\u5B58 API Key" }),
    message && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { role: "status", children: message })
  ] });
}
function NativeSearchConnection({ provider, options }) {
  const form = provider === "deepseek-official" ? options.messages : options.api, state = useSearchForm(form), [draft, setDraft] = (0, import_react.useState)({}), [dirty, setDirty] = (0, import_react.useState)(false), [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)("");
  const mounted = (0, import_react.useRef)(true), revision = (0, import_react.useRef)(void 0);
  (0, import_react.useEffect)(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  (0, import_react.useEffect)(() => {
    if (!dirty && state.value) {
      setDraft(state.value);
      revision.current = state.revision;
    }
  }, [state.value, state.revision, dirty]);
  const save = async () => {
    setBusy(true);
    setMessage("");
    try {
      const fields = provider === "deepseek-official" ? ["baseURL", "model", "maxUses"] : ["baseURL", "count"];
      const ok = await form.mutate(fields.filter((key) => draft[key] !== void 0 && draft[key] !== "").map((key) => ({ op: "set", path: [key], value: draft[key] })), revision.current);
      if (mounted.current) {
        if (ok) setDirty(false);
        setMessage(ok ? "API \u8BBE\u7F6E\u5DF2\u4FDD\u5B58\u3002" : "API \u914D\u7F6E\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u540E\u68C0\u67E5\u3002");
      }
    } catch (error) {
      if (mounted.current) setMessage(String(error));
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  const set = (key, value) => {
    setDirty(true);
    setDraft((current) => ({ ...current, [key]: value }));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: "studio-search-settings__connection", "aria-label": "\u539F\u751F API \u641C\u7D22\u8BBE\u7F6E", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { children: provider === "deepseek-official" ? "DeepSeek \u539F\u751F\u8054\u7F51\u641C\u7D22" : "DeepSeek Search API" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "studio-plugin-settings__fields", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { children: [
        "API \u5730\u5740",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { "aria-label": "\u641C\u7D22 API \u5730\u5740", placeholder: provider === "deepseek-official" ? "https://api.deepseek.com/anthropic/v1" : "https://api.deepseek.com", value: String(draft.baseURL ?? ""), disabled: busy || !state.writable, onChange: (event) => set("baseURL", event.target.value) })
      ] }),
      provider === "deepseek-official" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { children: [
        "\u641C\u7D22\u6A21\u578B",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { "aria-label": "\u641C\u7D22\u6A21\u578B", value: String(draft.model ?? ""), disabled: busy || !state.writable, onChange: (event) => set("model", event.target.value) })
      ] }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { children: [
        provider === "deepseek-official" ? "\u6700\u5927\u641C\u7D22\u6B21\u6570" : "API \u7ED3\u679C\u6570\u91CF",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { "aria-label": "API \u641C\u7D22\u6570\u91CF", type: "number", min: 1, max: 50, value: Number(draft[provider === "deepseek-official" ? "maxUses" : "count"] ?? 5), disabled: busy || !state.writable, onChange: (event) => set(provider === "deepseek-official" ? "maxUses" : "count", Number(event.target.value)) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "\u6CBF\u7528\u539F\u6709\u63D0\u4F9B\u5546\u3001API \u53C2\u6570\u4E0E\u51ED\u636E\u914D\u7F6E\u3002\u6B64\u6765\u6E90\u53EF\u80FD\u4EA7\u751F\u63D0\u4F9B\u5546\u8D39\u7528\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { type: "button", className: "studio-plugin-settings__save", disabled: busy || !dirty || !state.writable, onClick: () => {
      void save();
    }, children: "\u4FDD\u5B58 API \u8BBE\u7F6E" }),
    message && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { role: "status", children: message }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SearchCredentialEditor, { credentials: options.credentials, reference: String(state.value?.apiKeyEnv ?? "DEEPSEEK_API_KEY") })
  ] });
}

// apps/dsh/src/search-settings.tsx
var import_react5 = require("react");

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
var import_react4 = require("react");

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
var toKebabCase = (string) => string?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toLucideIconData.mjs
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

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
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

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
var toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/Icon.mjs
var import_react3 = require("react");

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs
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

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconNode.mjs
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

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/build/buildLucideIconForReact.mjs
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

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
var hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/context.mjs
var import_react2 = require("react");
var LucideContext = (0, import_react2.createContext)({});
var useLucideContext = () => (0, import_react2.useContext)(LucideContext);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/Icon.mjs
var Icon = (0, import_react3.forwardRef)(
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
    return (0, import_react3.createElement)(
      name,
      {
        ref,
        ...svgAttributes
      },
      [
        ...builtIconNode.map(([tag, attrs]) => (0, import_react3.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
function createLucideIcon(iconDataOrName, iconNode = [], aliases = []) {
  const iconData = typeof iconDataOrName === "string" ? toLucideIconData(iconDataOrName, iconNode, aliases) : iconDataOrName;
  const Component = (0, import_react4.forwardRef)(
    ({ className, ...props }, ref) => (0, import_react4.createElement)(Icon, {
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

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/save.mjs
var __iconData = {
  name: "save",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        key: "1c8476"
      }
    ],
    ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
    ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
  ]
};
__iconData.node;
var Save = createLucideIcon(__iconData);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/search.mjs
var __iconData2 = {
  name: "search",
  size: 24,
  node: [
    ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
  ]
};
__iconData2.node;
var Search = createLucideIcon(__iconData2);

// apps/dsh/src/directory-api.ts
async function studioRequest(endpoint, data, signal) {
  const response = await fetch(`studio/${endpoint}`, { signal, credentials: "same-origin", ...data ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) } : {} });
  const body = await response.text();
  let result;
  if (body.trim()) {
    try {
      result = JSON.parse(body);
    } catch {
      if (response.ok && !(endpoint === "restart" && response.status === 202)) {
        throw new Error("\u670D\u52A1\u5668\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u54CD\u5E94\u3002");
      }
    }
  }
  if (!response.ok) {
    const message = typeof result === "object" && result !== null && "message" in result && typeof result.message === "string" ? result.message : `HTTP ${response.status}`;
    throw new Error(message);
  }
  if (result === void 0 && endpoint === "restart" && response.status === 202) {
    return { restarting: true, message: "DSH \u670D\u52A1\u6B63\u5728\u91CD\u542F\uFF0C\u9875\u9762\u5C06\u77ED\u6682\u65AD\u5F00\u3002" };
  }
  if (result === void 0) throw new Error("\u670D\u52A1\u5668\u672A\u8FD4\u56DE\u786E\u8BA4\u4FE1\u606F\u3002");
  return result;
}

// apps/dsh/src/search-settings.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var defaults = { provider: "auto", mode: "fallback", searxngURL: "", maxResults: 8, timeoutSeconds: 15, cacheSeconds: 300, language: "auto" };
function SearchPluginSettings({ view, form, manager, native }) {
  const [draft, setDraft] = (0, import_react5.useState)(defaults), [dirty, setDirty] = (0, import_react5.useState)(false), [saving, setSaving] = (0, import_react5.useState)(false), [message, setMessage] = (0, import_react5.useState)("");
  const [query, setQuery] = (0, import_react5.useState)(""), [searching, setSearching] = (0, import_react5.useState)(false), [result, setResult] = (0, import_react5.useState)(), [searchError, setSearchError] = (0, import_react5.useState)("");
  const [entry, setEntry] = (0, import_react5.useState)();
  const [openCodeConfigured, setOpenCodeConfigured] = (0, import_react5.useState)(false);
  const isOpenAI = draft.provider === "openai-web-search";
  const isNative = isOpenAI || draft.provider === "deepseek-official" || draft.provider === "deepseek-search-api";
  const webState = useSearchForm(native?.web ?? emptySearchForm);
  const mounted = (0, import_react5.useRef)(true), revision = (0, import_react5.useRef)(void 0), request = (0, import_react5.useRef)(void 0);
  (0, import_react5.useEffect)(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      request.current?.abort();
    };
  }, []);
  (0, import_react5.useEffect)(() => {
    if (!dirty && form?.state.value) {
      const provider = webState.value?.searchProvider;
      setDraft({ ...defaults, ...form.state.value, ...provider === "deepseek-official" || provider === "deepseek-search-api" ? { provider } : provider === "opencode-openai-web-search" ? { provider: "openai-web-search" } : {} });
      revision.current = form.state.revision;
    }
  }, [form?.state.value, form?.state.revision, dirty, webState.value]);
  (0, import_react5.useEffect)(() => {
    if (view !== "page") return;
    let current = true;
    void manager.listPlugins().then(async (response) => {
      if (!response.ok) throw new Error("\u65E0\u6CD5\u8BFB\u53D6\u63D2\u4EF6\u72B6\u6001");
      if (!current) return;
      setEntry(response.value?.find((item) => item.patchId === "studio-web-search" || item.moduleName === "@agent-studio/plugin-web-search"));
      const opencodeActive = response.value?.some((item) => (item.patchId === "studio-opencode" || item.moduleName === "@agent-studio/plugin-opencode-provider") && item.enabled && item.fiberPhase === "active") ?? false;
      setOpenCodeConfigured(false);
      if (opencodeActive) {
        try {
          const status = await fetch("/api/v1/models/opencode/status", { credentials: "same-origin", cache: "no-store" });
          if (!status.ok) throw new Error(`HTTP ${status.status}`);
          const data = await status.json();
          if (current) setOpenCodeConfigured(data.configured === true);
        } catch (error) {
          if (current) setMessage(`\u65E0\u6CD5\u68C0\u67E5 OpenCode \u641C\u7D22\u6388\u6743\uFF1A${String(error)}`);
        }
      }
    }).catch((error) => {
      if (current) setMessage(String(error));
    });
    return () => {
      current = false;
    };
  }, [manager, view]);
  if (view === "summary") return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: "\u7EDF\u4E00\u7BA1\u7406\u641C\u7D22\u6765\u6E90\u3001API \u8FDE\u63A5\u3001\u81EA\u52A8\u5207\u6362\u4E0E\u591A\u6E90\u805A\u5408\u3002" });
  const clearSearch = () => {
    request.current?.abort();
    request.current = void 0;
    setSearching(false);
    setResult(void 0);
    setSearchError("");
  };
  const change = (key, value) => {
    clearSearch();
    setDirty(true);
    setMessage("");
    setDraft((current) => ({ ...current, [key]: value }));
  };
  const toggle = async () => {
    if (!entry) return;
    clearSearch();
    setSaving(true);
    setMessage("");
    try {
      const selected = isOpenAI ? "opencode-openai-web-search" : isNative ? draft.provider : "studio-search";
      if (entry.enabled && native && !await native.web.mutate([{ op: "set", path: ["searchProvider"], value: "studio-search" }])) throw new Error("\u65E0\u6CD5\u5173\u95ED\u5F53\u524D\u641C\u7D22\u6765\u6E90");
      const response = await manager.setPluginEnabled(entry.entryId, !entry.enabled);
      if (!response.ok) {
        if (native) await native.web.mutate([{ op: "set", path: ["searchProvider"], value: selected }]);
        throw new Error("\u63D2\u4EF6\u5F00\u5173\u66F4\u65B0\u5931\u8D25");
      }
      if (!entry.enabled && native && !await native.web.mutate([{ op: "set", path: ["searchProvider"], value: selected }])) throw new Error("\u63D2\u4EF6\u5DF2\u542F\u7528\uFF0C\u4F46\u63D0\u4F9B\u5546\u5207\u6362\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u4FDD\u5B58\u641C\u7D22\u8BBE\u7F6E");
      if (mounted.current) {
        setEntry({ ...entry, enabled: !entry.enabled });
        setMessage(response.value?.application === "restart-required" ? "\u72B6\u6001\u5DF2\u4FDD\u5B58\uFF0C\u91CD\u542F\u5E94\u7528\u540E\u751F\u6548\u3002" : "\u63D2\u4EF6\u72B6\u6001\u5DF2\u66F4\u65B0\u3002");
      }
    } catch (error) {
      if (mounted.current) setMessage(String(error));
    } finally {
      if (mounted.current) setSaving(false);
    }
  };
  const save = async () => {
    if (!form) return;
    if ((draft.provider === "searxng" || draft.searxngURL.trim()) && draft.searxngURL.trim()) {
      try {
        const url = new URL(draft.searxngURL);
        if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error();
      } catch {
        setMessage("SearXNG \u5B9E\u4F8B\u9700\u8981\u4E0D\u542B\u51ED\u636E\u7684 HTTP(S) \u5730\u5740\u3002");
        return;
      }
    } else if (draft.provider === "searxng") {
      setMessage("\u8BF7\u8F93\u5165 SearXNG \u5B9E\u4F8B\u5730\u5740\u3002");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const ok = await form.mutate(Object.entries(draft).map(([key, value]) => ({ op: "set", path: [key], value })), revision.current);
      if (!ok) throw new Error("\u641C\u7D22\u914D\u7F6E\u4FDD\u5B58\u5931\u8D25\u6216\u5DF2\u53D1\u751F\u53D8\u5316");
      if (native) {
        const selected = isOpenAI ? "opencode-openai-web-search" : draft.provider === "deepseek-official" || draft.provider === "deepseek-search-api" ? draft.provider : "studio-search";
        const accepted = await native.web.mutate([{ op: "set", path: ["searchProvider"], value: selected }], webState.revision);
        if (!accepted) throw new Error("\u63D0\u4F9B\u5546\u5207\u6362\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u540E\u68C0\u67E5");
      }
      if (mounted.current) {
        setMessage(ok ? "\u641C\u7D22\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\u3002" : "\u914D\u7F6E\u5DF2\u88AB\u5176\u4ED6\u9875\u9762\u4FEE\u6539\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u540E\u68C0\u67E5\u3002");
        if (ok) setDirty(false);
      }
    } catch (error) {
      if (mounted.current) setMessage(String(error));
    } finally {
      if (mounted.current) setSaving(false);
    }
  };
  const test = async () => {
    clearSearch();
    const control = new AbortController();
    request.current = control;
    setSearching(true);
    try {
      const response = await studioRequest("search/test", { query }, control.signal);
      if (!control.signal.aborted) setResult(response);
    } catch (error) {
      if (!control.signal.aborted) setSearchError(error instanceof Error ? error.message : String(error));
    } finally {
      if (!control.signal.aborted) {
        setSearching(false);
        request.current = void 0;
      }
    }
  };
  const disabled = saving || !form?.state.writable || !entry?.enabled;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "studio-search-settings studio-plugin-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "studio-plugin-settings__status", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "studio-plugin-settings__status-label", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: "\u542F\u7528\u7F51\u9875\u641C\u7D22" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("small", { children: entry?.enabled ? "\u5DF2\u542F\u7528" : entry ? "\u5DF2\u5173\u95ED" : "\u6B63\u5728\u8BFB\u53D6\u72B6\u6001\u2026" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PluginSwitch, { label: "\u542F\u7528\u7F51\u9875\u641C\u7D22", checked: entry?.enabled ?? false, disabled: !entry || saving || dirty, onChange: () => {
        void toggle();
      } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: isOpenAI ? "\u4F7F\u7528 OpenCode \u4E2D\u5DF2\u8FDE\u63A5\u7684 ChatGPT \u8D26\u53F7 OAuth\uFF0C\u901A\u8FC7 OpenAI \u7684 web_search \u641C\u7D22\uFF1B\u9700\u8981\u542F\u7528\u5E76\u52A0\u8F7D OpenCode \u6A21\u578B\u63D0\u4F9B\u5546\u63D2\u4EF6\u3002" : isNative ? "Agent \u548C\u5DE5\u4F5C\u6D41\u5171\u7528\u6B64\u63D0\u4F9B\u5546\uFF0C\u6CBF\u7528\u539F\u751F API \u8FDE\u63A5\u4E0E\u51ED\u636E\u8BBE\u7F6E\u3002" : "Agent \u548C\u5DE5\u4F5C\u6D41\u5171\u7528\u4EE5\u4E0B\u8BBE\u7F6E\u3002\u81EA\u52A8\u9009\u62E9\u9ED8\u8BA4\u4F7F\u7528 Bing\uFF1B\u5FEB\u901F\u6A21\u5F0F\u53EA\u8BF7\u6C42\u9996\u4E2A\u6765\u6E90\uFF1B\u81EA\u52A8\u5207\u6362\u5728\u5931\u8D25\u6216\u65E0\u7ED3\u679C\u65F6\u5C1D\u8BD5\u5907\u7528\u6765\u6E90\uFF1B\u591A\u6E90\u805A\u5408\u5E76\u884C\u641C\u7D22\u5E76\u53BB\u91CD\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "studio-plugin-settings__fields", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
        "\u641C\u7D22\u63D0\u4F9B\u5546",
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { "aria-label": "\u641C\u7D22\u63D0\u4F9B\u5546", value: draft.provider, disabled, onChange: (event) => change("provider", event.target.value), children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "auto", children: "\u81EA\u52A8\u9009\u62E9" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "bing", children: "Bing" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "duckduckgo", children: "DuckDuckGo" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "searxng", children: "SearXNG\uFF08\u81EA\u5B9A\u4E49\u5B9E\u4F8B\uFF09" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "exa", children: "Exa" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "tavily", children: "Tavily" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "deepseek-official", children: "DeepSeek \u539F\u751F\u8054\u7F51\u641C\u7D22" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "deepseek-search-api", children: "DeepSeek Search API" }),
          openCodeConfigured || isOpenAI ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("option", { value: "openai-web-search", disabled: !openCodeConfigured, children: [
            "OpenAI web_search\uFF08ChatGPT OAuth\uFF09",
            !openCodeConfigured ? "\uFF08\u9700\u914D\u7F6E OpenCode OAuth\uFF09" : ""
          ] }) : null
        ] })
      ] }),
      !isNative && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
          "\u641C\u7D22\u6A21\u5F0F",
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { "aria-label": "\u641C\u7D22\u6A21\u5F0F", value: draft.mode, disabled: disabled || draft.provider !== "auto", onChange: (event) => change("mode", event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "fast", children: "\u5FEB\u901F\u641C\u7D22" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "fallback", children: "\u5931\u8D25\u81EA\u52A8\u5207\u6362" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "merge", children: "\u591A\u6E90\u805A\u5408" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
          "\u641C\u7D22\u8BED\u8A00",
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { "aria-label": "\u641C\u7D22\u8BED\u8A00", value: draft.language, disabled, onChange: (event) => change("language", event.target.value), children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "auto", children: "\u81EA\u52A8" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "zh-CN", children: "\u4E2D\u6587" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "en-US", children: "English" })
          ] })
        ] }),
        [["maxResults", "\u6700\u591A\u7ED3\u679C\u6570", 1, 20], ["timeoutSeconds", "\u8BF7\u6C42\u8D85\u65F6\uFF08\u79D2\uFF09", 5, 45], ["cacheSeconds", "\u7ED3\u679C\u7F13\u5B58\uFF08\u79D2\uFF0C0 \u4E3A\u5173\u95ED\uFF09", 0, 3600]].map(([key, label, min, max]) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { children: [
          label,
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { "aria-label": label, type: "number", min, max, step: 1, value: draft[key], disabled, onChange: (event) => change(key, Math.min(max, Math.max(min, Number(event.target.value)))) })
        ] }, key)),
        (draft.provider === "auto" || draft.provider === "searxng") && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: "studio-search-settings__wide", children: [
          "SearXNG \u5B9E\u4F8B\u5730\u5740",
          draft.provider === "auto" ? "\uFF08\u53EF\u9009\uFF09" : "",
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { "aria-label": "SearXNG \u5B9E\u4F8B\u5730\u5740", placeholder: "https://search.example.com", value: draft.searxngURL, disabled, onChange: (event) => change("searxngURL", event.target.value) })
        ] })
      ] })
    ] }),
    !isNative && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { children: [
      draft.provider === "auto" ? "\u81EA\u52A8\u9009\u62E9\u6309 Bing \u2192 DuckDuckGo \u2192 SearXNG\uFF08\u5DF2\u914D\u7F6E\u65F6\uFF09\u7684\u987A\u5E8F\u641C\u7D22\uFF1B\u591A\u6E90\u805A\u5408\u4F1A\u5E76\u884C\u8BF7\u6C42\u8FD9\u4E9B\u6765\u6E90\u3002" : "\u6307\u5B9A\u63D0\u4F9B\u5546\u65F6\u4EC5\u8BF7\u6C42\u8BE5\u6765\u6E90\uFF1B\u9700\u8981\u5907\u7528\u6765\u6E90\u6216\u8DE8\u6765\u6E90\u805A\u5408\u65F6\uFF0C\u8BF7\u9009\u62E9\u201C\u81EA\u52A8\u9009\u62E9\u201D\u3002",
      " SearXNG \u5B9E\u4F8B\u9700\u542F\u7528 JSON \u641C\u7D22\u63A5\u53E3\u3002\u516C\u5F00\u641C\u7D22\u670D\u52A1\u53EF\u80FD\u9650\u6D41\u6216\u8981\u6C42\u9A8C\u8BC1\uFF0C\u5931\u8D25\u539F\u56E0\u4F1A\u4FDD\u7559\u5728\u5DE5\u5177\u8F93\u51FA\u4E2D\u3002"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: "studio-plugin-settings__save", type: "button", disabled: disabled || !dirty, onClick: () => {
      void save();
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Save, { size: 16, strokeWidth: 1.5, "aria-hidden": "true" }),
      "\u4FDD\u5B58\u641C\u7D22\u8BBE\u7F6E"
    ] }),
    message && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { role: "status", children: message }),
    native && (draft.provider === "deepseek-official" || draft.provider === "deepseek-search-api") ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(NativeSearchConnection, { provider: draft.provider, options: native }, draft.provider) : null,
    native && (draft.provider === "exa" || draft.provider === "tavily") ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(SearchCredentialEditor, { credentials: native.credentials, reference: draft.provider === "exa" ? "EXA_API_KEY" : "TAVILY_API_KEY" }, draft.provider) : null,
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "studio-search-settings__test", "aria-label": "\u6D4B\u8BD5\u7F51\u9875\u641C\u7D22", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { children: "\u6D4B\u8BD5\u641C\u7D22" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: "\u6309\u7167\u5DF2\u4FDD\u5B58\u914D\u7F6E\u8BF7\u6C42\u6240\u9009\u63D0\u4F9B\u5546\uFF0C\u5E76\u663E\u793A\u6765\u6E90\u4E0E\u8BCA\u65AD\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("form", { onSubmit: (event) => {
        event.preventDefault();
        if (!dirty && !searching && query.trim()) void test();
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { "aria-label": "\u6D4B\u8BD5\u641C\u7D22\u8BCD", placeholder: "\u8F93\u5165\u641C\u7D22\u8BCD\u2026", maxLength: 2e3, value: query, onChange: (event) => {
          clearSearch();
          setQuery(event.target.value);
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: "studio-plugin-settings__save", disabled: saving || searching || dirty || !entry?.enabled || isOpenAI && !openCodeConfigured || !query.trim(), type: "submit", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Search, { size: 16, strokeWidth: 1.5, "aria-hidden": "true" }),
          searching ? "\u641C\u7D22\u4E2D\u2026" : "\u6D4B\u8BD5\u641C\u7D22"
        ] })
      ] }),
      dirty && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: "\u8BF7\u5148\u4FDD\u5B58\u8BBE\u7F6E\uFF0C\u518D\u6D4B\u8BD5\u3002" }),
      searchError && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { role: "alert", children: searchError }),
      result && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { role: "status", children: [
          "\u627E\u5230 ",
          result.sources.length,
          " \u6761\u7ED3\u679C",
          result.truncated ? "\uFF08\u5DF2\u622A\u53D6\uFF09" : "",
          "\u3002",
          result.content
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("ol", { children: result.sources.map((source) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("a", { href: source.url, target: "_blank", rel: "noopener noreferrer", children: source.title || source.url }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("small", { children: source.url }),
          source.snippet && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: source.snippet })
        ] }, source.url)) })
      ] })
    ] })
  ] });
}
var searchSettingsStyles = `
.studio-search-settings .studio-search-settings__wide { grid-column:1/-1; }
.studio-search-settings__connection { margin-top:24px; padding-top:16px; border-top:.5px solid var(--dsw-alias-border-l2); }
.studio-search-settings__test { margin-top:32px; padding-top:16px; border-top:.5px solid var(--dsw-alias-border-l2); }
.studio-search-settings__test form { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.studio-search-settings__test input { flex:1; min-width:min(160px,100%); }
.studio-search-settings__test ol { padding-left:24px; }
.studio-search-settings__test li { padding:12px 0; overflow-wrap:anywhere; }
.studio-search-settings__test li p { margin:5px 0; }
.studio-search-settings__test small { display:block; color:var(--dsw-alias-label-tertiary); margin-top:4px; }
.studio-search-settings__test a { color:var(--dsw-alias-link,var(--dsw-alias-brand-primary)); text-decoration:none; }
.studio-search-settings__test a:hover { text-decoration:underline; }
.studio-search-settings [role=alert] { color:var(--dsw-alias-state-error-primary); }
`;

// apps/dsh/src/client-web-search.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var inject = ["remote.pluginManager", "remote.credentials", "configForms"];
function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.textContent = pluginSettingsStyles + searchSettingsStyles;
    document.head.append(style);
    return () => style.remove();
  }, "web search: settings styles");
  ctx.inject(["slots", "configForms"], (child) => {
    const forms = child.get("configForms");
    const remote = child.get("remote");
    const native = { web: forms.get("web"), messages: forms.get("web-search-deepseek"), api: forms.get("web-deepseek-api"), credentials: remote.credentials };
    const slots = child.get("slots");
    const Settings = (props) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SearchPluginSettings, { ...props, manager: remote.pluginManager, native });
    child.effect(() => slots.inject("plugins.bundle.config", () => slots.register({ name: "plugins.bundle.config", key: "@agent-studio/plugin-web-search" }, Settings)), "web search: settings");
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
lucide-react/dist/esm/icons/save.mjs:
lucide-react/dist/esm/icons/search.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.65.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
return module.exports;}});
