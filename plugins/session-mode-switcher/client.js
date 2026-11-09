window.__ModuleLoader__.load({id:"@agent-studio/plugin-session-mode-switcher",factory:(require)=>{var module={exports:{}};var exports=module.exports;
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

// ../../../custom-dsh-plugin/plugins/session-mode-switcher/client.tsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var endpoint = "/studio/session-mode-switcher";
var styles = `
.studio-mode-settings{display:grid;gap:14px;max-width:760px;color:var(--dsw-alias-label-primary,#20242c);font:inherit}
.studio-mode-settings h3{margin:0;font-size:16px;font-weight:600}
.studio-mode-settings p{margin:-8px 0 2px;color:var(--dsw-alias-label-secondary,#687385);font-size:13px;line-height:1.6}
.studio-mode-settings__fields{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(180px,1fr);gap:12px}
.studio-mode-settings label{display:grid;gap:6px;font-size:13px;font-weight:500}
.studio-mode-settings select{box-sizing:border-box;width:100%;min-width:0;height:38px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2,#d9dee8);border-radius:8px;background:var(--dsw-alias-bg-layer-3,#fff);color:inherit;font:inherit;font-size:13px}
.studio-mode-settings select:focus-visible,.studio-mode-settings button:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,#4b7cff);outline-offset:2px}
.studio-mode-settings__actions{display:flex;align-items:center;gap:10px}
.studio-mode-settings button{height:34px;padding:0 14px;border:0;border-radius:8px;background:var(--dsw-alias-state-business-primary,#4b7cff);color:#fff;font:inherit;font-size:13px;cursor:pointer}
.studio-mode-settings button:disabled{opacity:.45;cursor:default}
.studio-mode-settings__secondary{background:var(--dsw-alias-bg-module-platform,#f3f5f8)!important;color:var(--dsw-alias-label-primary,#20242c)!important;border:1px solid var(--dsw-alias-border-l2,#d9dee8)!important}
.studio-mode-settings__note{padding:10px 12px;border-radius:8px;background:var(--dsw-alias-bg-module-platform,#f5f7fa);color:var(--dsw-alias-label-secondary,#687385);font-size:12px;line-height:1.6}
.studio-mode-settings__selected{display:grid;gap:4px;padding:10px 12px;border:1px solid var(--dsw-alias-border-l2,#d9dee8);border-radius:8px;background:var(--dsw-alias-bg-layer-3,#fff);font-size:12px;color:var(--dsw-alias-label-secondary,#687385);overflow-wrap:anywhere}
.studio-mode-settings__selected strong{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#20242c)}
.studio-mode-settings__message{font-size:13px;color:var(--dsw-alias-label-secondary,#687385)}
.studio-mode-settings__message[data-error=true]{color:var(--dsw-alias-state-error-primary,#e5484d)}
@media(max-width:640px){.studio-mode-settings__fields{grid-template-columns:minmax(0,1fr)}}
`;
function SessionModeSettings() {
  const [data, setData] = (0, import_react.useState)({ sessions: [], presets: [] });
  const [sessionId, setSessionId] = (0, import_react.useState)("");
  const [presetId, setPresetId] = (0, import_react.useState)("");
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [message, setMessage] = (0, import_react.useState)("");
  const [error, setError] = (0, import_react.useState)(false);
  const refresh = (0, import_react.useCallback)(async (keepMessage = false) => {
    setLoading(true);
    if (!keepMessage) setMessage("");
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `\u8BFB\u53D6\u5931\u8D25\uFF08${response.status}\uFF09`);
      const next = { sessions: result.sessions || [], presets: result.presets || [] };
      setData(next);
      setSessionId((current) => next.sessions.some((session) => session.id === current && session.selectable) ? current : next.sessions.find((session) => session.selectable)?.id || "");
      setPresetId((current) => next.presets.some((preset) => preset.id === current) ? current : "");
      setError(false);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : String(cause));
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);
  (0, import_react.useEffect)(() => {
    void refresh();
  }, [refresh]);
  const selectedSession = data.sessions.find((session) => session.id === sessionId);
  const targetMode = presetId || selectedSession?.mode || "";
  const statusLabel = (session) => session.status === "running" ? "\u8FD0\u884C\u4E2D" : session.status === "unloaded" ? "\u672A\u52A0\u8F7D" : session.status === "paused" ? "\u5DF2\u6682\u505C" : session.status === "idle" ? "\u7A7A\u95F2" : session.status;
  const switchMode = async () => {
    if (!sessionId || !targetMode || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, presetId: targetMode })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `\u5207\u6362\u5931\u8D25\uFF08${response.status}\uFF09`);
      setMessage("\u6A21\u5F0F\u5DF2\u5207\u6362\u3002\u8BE5\u4F1A\u8BDD\u540E\u7EED\u8F6E\u6B21\u5C06\u4F7F\u7528\u65B0\u6A21\u5F0F\uFF1B\u5DF2\u6709\u6D88\u606F\u548C\u8FD0\u884C\u8BB0\u5F55\u4F1A\u4FDD\u7559\u3002");
      setError(false);
      await refresh(true);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : String(cause));
      setError(true);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "studio-mode-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u4F1A\u8BDD\u6A21\u5F0F\u5207\u6362" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u9009\u62E9\u4EFB\u610F\u5DF2\u4FDD\u5B58\u7684\u4F1A\u8BDD\u548C\u76EE\u6807\u6A21\u5F0F\u3002\u5217\u8868\u663E\u793A\u51C6\u786E\u540D\u79F0\u3001\u5DE5\u4F5C\u76EE\u5F55\u4E0E\u72B6\u6001\uFF1B\u672A\u52A0\u8F7D\u7684\u4F1A\u8BDD\u4E5F\u53EF\u4EE5\u9009\u62E9\uFF0C\u8F6C\u6362\u4F1A\u4FDD\u7559\u539F\u6709\u8BB0\u5F55\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-mode-settings__fields", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        "\u76EE\u6807\u4F1A\u8BDD",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: sessionId, onChange: (event) => {
          setSessionId(event.target.value);
          setPresetId("");
        }, disabled: loading || !data.sessions.some((session) => session.selectable), children: [
          data.sessions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: loading ? "\u6B63\u5728\u8BFB\u53D6\u4F1A\u8BDD\u2026" : "\u6682\u65E0\u4F1A\u8BDD" }),
          data.sessions.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", { value: session.id, disabled: !session.selectable, children: [
            session.title,
            " \xB7 ",
            statusLabel(session),
            " \xB7 ",
            session.cwd || "\u65E0\u5DE5\u4F5C\u76EE\u5F55",
            " \xB7 ",
            session.id,
            session.selectable ? "" : " \xB7 \u683C\u5F0F\u6682\u4E0D\u652F\u6301"
          ] }, session.id))
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        "\u5207\u6362\u5230\u6A21\u5F0F",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { value: targetMode, onChange: (event) => setPresetId(event.target.value), disabled: loading || data.presets.length === 0, children: [
          !targetMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", children: "\u9009\u62E9\u6A21\u5F0F" }),
          data.presets.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: preset.id, children: preset.name }, preset.id))
        ] })
      ] })
    ] }),
    selectedSession && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-mode-settings__selected", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedSession.title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
        "\u4F1A\u8BDD ID\uFF1A",
        selectedSession.id
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
        "\u5DE5\u4F5C\u76EE\u5F55\uFF1A",
        selectedSession.cwd || "\u672A\u8BBE\u7F6E"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
        "\u72B6\u6001\uFF1A",
        statusLabel(selectedSession)
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "studio-mode-settings__note", children: "\u6B63\u5728\u8FD0\u884C\u7684\u4F1A\u8BDD\u4E0D\u80FD\u4E2D\u9014\u66F4\u6362\u6267\u884C\u73AF\u5883\u3002\u8BF7\u5148\u6682\u505C\u6216\u7B49\u5F85\u5F53\u524D\u8F6E\u6B21\u7ED3\u675F\uFF0C\u518D\u6267\u884C\u5F3A\u5236\u8F6C\u6362\u3002\u8F6C\u6362\u6210\u529F\u540E\u4F1A\u8BB0\u5F55\u65B0\u7684\u6A21\u5F0F\uFF0C\u91CD\u8F7D\u4F1A\u8BDD\u65F6\u4ECD\u4F1A\u6CBF\u7528\u3002" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-mode-settings__actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { disabled: loading || busy || !sessionId || !targetMode || !selectedSession?.selectable || targetMode === selectedSession?.mode || selectedSession?.status === "running", onClick: () => void switchMode(), children: busy ? "\u6B63\u5728\u5207\u6362\u2026" : "\u5F3A\u5236\u8F6C\u6362\u6A21\u5F0F" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "studio-mode-settings__secondary", disabled: loading || busy, onClick: () => void refresh(), children: "\u5237\u65B0" }),
      selectedSession?.mode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "studio-mode-settings__message", children: [
        "\u5F53\u524D\uFF1A",
        data.presets.find((preset) => preset.id === selectedSession.mode)?.name || selectedSession.mode
      ] })
    ] }),
    message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "studio-mode-settings__message", "data-error": error, children: message })
  ] });
}
var inject = [];
function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = "studio-session-mode-switcher";
    style.textContent = styles;
    document.head.append(style);
    return () => style.remove();
  }, "session mode switcher: styles");
  ctx.inject(["slots"], (child) => {
    const slots = child.get("slots");
    child.effect(() => slots.inject("plugins.bundle.config", () => slots.register({
      name: "plugins.bundle.config",
      key: "@agent-studio/plugin-session-mode-switcher"
    }, SessionModeSettings)), "session mode switcher: settings panel");
  });
}
return module.exports;}});
