window.__ModuleLoader__.load({id:"@agent-studio/plugin-blue-theme",factory:(require)=>{var module={exports:{}};var exports=module.exports;
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

// src/client-blue-theme.ts
var client_blue_theme_exports = {};
__export(client_blue_theme_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_blue_theme_exports);

// src/theme.ts
var studioTheme = {
  "--dsw-alias-brand-primary": { light: "#4176e6", dark: "#7aaaff" },
  "--dsw-alias-state-business-primary": { light: "#4176e6", dark: "#7aaaff" },
  "--dsw-alias-bg-base": { light: "#f8fafb", dark: "#111827" },
  "--dsw-alias-bg-layer-1": { light: "#ffffff", dark: "#1f2937" },
  "--dsw-alias-bg-layer-2": { light: "#f1f5f9", dark: "#263244" },
  "--dsw-alias-border-l1": { light: "#e2e8f0", dark: "#334155" },
  "--dsw-alias-border-l2": { light: "#cbd5e1", dark: "#475569" },
  "--dsw-alias-label-primary": { light: "#172033", dark: "#f1f5f9" },
  "--dsw-alias-label-secondary": { light: "#64748b", dark: "#94a3b8" },
  "--dsw-alias-label-primary-inverse": { light: "#ffffff", dark: "#111827" }
};

// src/client-blue-theme.ts
var inject = ["theme"];
function apply(ctx) {
  const teamLayoutStyles = `
[data-team-panel] article { overflow-wrap: anywhere; }
[data-team-panel] article > div:first-child { display:flex; align-items:flex-start; gap:10px; min-width:0; }
[data-team-panel] article > div:first-child > strong { flex:1 1 auto; min-width:0; overflow-wrap:anywhere; line-height:18px; }
[data-team-panel] article > div:first-child > span { flex:0 0 auto; align-self:flex-start; white-space:nowrap; line-height:18px; }
[data-team-panel] article > p { overflow-wrap:anywhere; }
[data-team-panel] article > div:last-child { display:flex; flex-wrap:wrap; align-items:center; gap:4px 10px; }
[data-team-panel] article > div:last-child > span { margin-right:0; }
[data-team-panel] article > div:last-child > button { float:none; order:2; margin-left:auto; }
[data-team-panel] h3 { min-width:0; }
`;
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = "agent-studio-blue-theme";
    style.textContent = teamLayoutStyles;
    document.head.append(style);
    return () => style.remove();
  }, "agent-studio: theme styles");
  ctx.inject(["theme"], (child) => {
    const theme = child.get("theme");
    child.effect(() => theme.overrideTokens("agent-studio-blue", studioTheme), "DeepSeek \u84DD\u8272\u4E3B\u9898");
  });
}
return module.exports;}});
