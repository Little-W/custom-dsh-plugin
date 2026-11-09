window.__ModuleLoader__.load({id:"@agent-studio/plugin-eda-tools",factory:(require)=>{var module={exports:{}};var exports=module.exports;
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

// src/client-eda-tools.tsx
var client_eda_tools_exports = {};
__export(client_eda_tools_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_eda_tools_exports);

// src/plugin-settings.tsx
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

// src/eda-settings.tsx
var import_react = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var fields = [["jobsDir", "\u4F5C\u4E1A\u7D22\u5F15 / \u5907\u7528\u76EE\u5F55"]];
var optionalTools = [
  ["dcShell", "Design Compiler", "dcEnabled"],
  ["vcs", "VCS", "vcsEnabled"],
  ["verilator", "Verilator", "verilatorEnabled"],
  ["iverilog", "Icarus Verilog", "iverilogEnabled"],
  ["vvp", "VVP", "vvpEnabled"],
  ["vcStatic", "VC Static", "vcStaticEnabled"],
  ["vcFormal", "VC Formal", "vcFormalEnabled"],
  ["innovus", "Innovus", "innovusEnabled"],
  ["ptShell", "PrimeTime", "ptEnabled"],
  ["sta", "OpenSTA", "staEnabled"]
];
function EdaToolsSettings({ view, form, manager }) {
  const [entry, setEntry] = (0, import_react.useState)(), [draft, setDraft] = (0, import_react.useState)({}), [dirty, setDirty] = (0, import_react.useState)(false), [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)("");
  const mounted = (0, import_react.useRef)(true), revision = (0, import_react.useRef)(void 0);
  (0, import_react.useEffect)(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  (0, import_react.useEffect)(() => {
    if (view !== "page") return;
    let current = true;
    void manager.listPlugins().then((result) => {
      if (!result.ok) throw new Error(JSON.stringify(result.error));
      if (current) setEntry(result.value?.find((item) => item.patchId === "studio-eda-mcp" || item.moduleName === "@agent-studio/plugin-eda-tools"));
    }).catch((error) => {
      if (current) setMessage(String(error));
    });
    return () => {
      current = false;
    };
  }, [manager, view]);
  (0, import_react.useEffect)(() => {
    if (!dirty && form?.state.value) {
      setDraft(form.state.value);
      revision.current = form.state.revision;
    }
  }, [form?.state.value, form?.state.revision, dirty]);
  if (view === "summary") return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "DC \u7EFC\u5408\u3001RTL \u4EFF\u771F\u4E0E EDA \u4F5C\u4E1A\u7BA1\u7406\uFF0C\u4FDD\u7559\u6BCF\u6B21\u6267\u884C\u7684\u811A\u672C\u3001\u65E5\u5FD7\u53CA\u62A5\u544A\u3002" });
  const toggle = async () => {
    if (!entry) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await manager.setPluginEnabled(entry.entryId, !entry.enabled);
      if (!result.ok) throw new Error(JSON.stringify(result.error));
      const current = await manager.listPlugins();
      if (!current.ok) throw new Error(JSON.stringify(current.error));
      if (mounted.current) {
        setEntry(current.value?.find((item) => item.entryId === entry.entryId));
        setMessage(result.value?.application === "restart-required" ? "\u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u91CD\u542F\u5E94\u7528\u540E\u751F\u6548\u3002" : "\u63D2\u4EF6\u72B6\u6001\u5DF2\u66F4\u65B0\u3002");
      }
    } catch (error) {
      if (mounted.current) setMessage(String(error));
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  const save = async () => {
    if (!form) return;
    setBusy(true);
    setMessage("");
    try {
      const ok = await form.mutate(Object.entries(draft).filter(([key]) => fields.some(([name]) => name === key) || optionalTools.some(([, , enabledKey]) => enabledKey === key) || optionalTools.some(([pathKey]) => pathKey === key) || key === "maxConcurrent").map(([key, value]) => ({ op: "set", path: [key], value })), revision.current);
      if (mounted.current) {
        setMessage(ok ? "\u914D\u7F6E\u5DF2\u4FDD\u5B58\uFF0CEDA MCP \u6B63\u5728\u91CD\u65B0\u8FDE\u63A5\u3002" : "\u914D\u7F6E\u53D1\u751F\u53D8\u5316\u6216\u4FDD\u5B58\u88AB\u62D2\u7EDD\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u540E\u68C0\u67E5\u3002");
        if (ok) setDirty(false);
      }
    } catch (error) {
      if (mounted.current) setMessage(String(error));
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "studio-eda-settings studio-plugin-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "studio-plugin-settings__status", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "studio-plugin-settings__status-label", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "\u542F\u7528 EDA MCP Tool" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("small", { children: !entry ? "\u6B63\u5728\u8BFB\u53D6\u72B6\u6001\u2026" : entry.enabled ? entry.fiberPhase === "active" ? "\u5DF2\u542F\u7528" : "\u8FDE\u63A5\u672A\u5C31\u7EEA" : "\u5DF2\u5173\u95ED" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PluginSwitch, { label: "\u542F\u7528 EDA MCP Tool", checked: entry?.enabled ?? false, disabled: busy || !entry, onChange: () => {
        void toggle();
      } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "\u901A\u8FC7 MCP \u4E3A Agent \u63D0\u4F9B\u73AF\u5883\u68C0\u67E5\u3001DC \u7EFC\u5408\u3001\u4EFF\u771F\u4F5C\u4E1A\u542F\u52A8\u3001\u72B6\u6001\u3001\u65E5\u5FD7\u4E0E\u53D6\u6D88\u5DE5\u5177\u3002\u903B\u8F91\u7EFC\u5408\u4F7F\u7528 Synopsys DC\u3002" }),
    entry?.enabled && form?.state.value ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "studio-plugin-settings__fields", children: [
        fields.map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { children: [
          label,
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { "aria-label": label, value: String(draft[key] ?? ""), disabled: busy || !form.state.writable, onChange: (event) => {
            setDirty(true);
            setDraft((current) => ({ ...current, [key]: event.target.value }));
          } })
        ] }, key)),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { children: [
          "\u6700\u5927\u5E76\u884C\u4F5C\u4E1A\u6570",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { "aria-label": "\u6700\u5927\u5E76\u884C\u4F5C\u4E1A\u6570", type: "number", min: 1, max: 16, step: 1, value: Number(draft.maxConcurrent ?? 4), disabled: busy || !form.state.writable, onChange: (event) => {
            setDirty(true);
            setDraft((current) => ({ ...current, maxConcurrent: Number(event.target.value) }));
          } })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "studio-plugin-settings__fields", children: optionalTools.map(([key, label, enabledKey]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "studio-eda-tool-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "studio-eda-tool-row__toggle", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { type: "checkbox", "aria-label": `\u542F\u7528 ${label}`, checked: draft[enabledKey] === true, disabled: busy || !form.state.writable, onChange: (event) => {
            setDirty(true);
            setDraft((current) => ({ ...current, [enabledKey]: event.target.checked }));
          } }),
          label
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { "aria-label": `${label} \u53EF\u6267\u884C\u6587\u4EF6`, value: String(draft[key] ?? ""), disabled: busy || !form.state.writable, onChange: (event) => {
          setDirty(true);
          setDraft((current) => ({ ...current, [key]: event.target.value }));
        } })
      ] }, key)) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "\u6240\u6709 EDA \u5DE5\u5177\u90FD\u53EF\u901A\u8FC7\u5F00\u5173\u542F\u7528\u6216\u5173\u95ED\u3002Design Compiler\u3001VCS\u3001Verilator\u3001PrimeTime\u3001OpenSTA \u9ED8\u8BA4\u5F00\u542F\uFF1BIcarus/VVP\u3001VC Static\u3001VC Formal\u3001Innovus \u9ED8\u8BA4\u5173\u95ED\u3002\u53EA\u6709\u5F00\u5173\u6253\u5F00\u7684\u5DE5\u5177\u624D\u4F1A\u5728 EDA MCP \u4E2D\u53EF\u7528\u3002\u4EFF\u771F\u63A8\u8350\u4F7F\u7528 Verilator \u6216 VCS\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "\u4F7F\u7528\u7EDD\u5BF9\u53EF\u6267\u884C\u6587\u4EF6\u8DEF\u5F84\u6216 PATH \u4E2D\u7684\u547D\u4EE4\uFF1B\u4FDD\u5B58\u8FDE\u63A5\u8BBE\u7F6E\u4F1A\u91CD\u542F MCP\uFF0C\u8BF7\u5148\u5B8C\u6210\u6216\u53D6\u6D88\u6B63\u5728\u8FD0\u884C\u7684 EDA \u4F5C\u4E1A\u3002\u6280\u672F\u5E93\u4E0E SDC \u7531\u6BCF\u4E2A\u7EFC\u5408\u4EFB\u52A1\u6307\u5B9A\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "studio-plugin-settings__save", type: "button", disabled: busy || !dirty || !form.state.writable, onClick: () => {
        void save();
      }, children: "\u4FDD\u5B58\u8BBE\u7F6E" })
    ] }) : null,
    message ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { role: "status", children: message }) : null
  ] });
}

// src/client-eda-tools.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var inject = ["remote.pluginManager"];
function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.textContent = pluginSettingsStyles;
    document.head.append(style);
    return () => style.remove();
  }, "eda tools: settings styles");
  ctx.inject(["slots"], (child) => {
    const slots = child.get("slots");
    const manager = child.get("remote").pluginManager;
    const Settings = (props) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(EdaToolsSettings, { ...props, manager });
    child.effect(() => slots.inject("plugins.bundle.config", () => slots.register({ name: "plugins.bundle.config", key: "@agent-studio/plugin-eda-tools" }, Settings)), "eda tools: settings");
  });
}
return module.exports;}});
