window.__ModuleLoader__.load({id:"@agent-studio/plugin-session-workspace-settings",factory:(require)=>{var module={exports:{}};var exports=module.exports;
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

// src/client-session-workspace-settings.tsx
var client_session_workspace_settings_exports = {};
__export(client_session_workspace_settings_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_session_workspace_settings_exports);

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

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/folder-cog.mjs
var __iconData = {
  name: "folder-cog",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3",
        key: "128dxu"
      }
    ],
    ["path", { d: "m14.305 19.53.923-.382", key: "3m78fa" }],
    ["path", { d: "m15.228 16.852-.923-.383", key: "npixar" }],
    ["path", { d: "m16.852 15.228-.383-.923", key: "5xggr7" }],
    ["path", { d: "m16.852 20.772-.383.924", key: "dpfhf9" }],
    ["path", { d: "m19.148 15.228.383-.923", key: "1reyyz" }],
    ["path", { d: "m19.53 21.696-.382-.924", key: "1goivc" }],
    ["path", { d: "m20.772 16.852.924-.383", key: "htqkph" }],
    ["path", { d: "m20.772 19.148.924.383", key: "9w9pjp" }],
    ["circle", { cx: "18", cy: "18", r: "3", key: "1xkwt0" }]
  ],
  aliases: ["folder-cog-2"]
};
__iconData.node;
var FolderCog = createLucideIcon(__iconData);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/folder-open.mjs
var __iconData2 = {
  name: "folder-open",
  size: 24,
  node: [
    [
      "path",
      {
        d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
        key: "usdka0"
      }
    ]
  ]
};
__iconData2.node;
var FolderOpen = createLucideIcon(__iconData2);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs
var __iconData3 = {
  name: "loader-circle",
  size: 24,
  node: [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]],
  aliases: ["loader-2"]
};
__iconData3.node;
var LoaderCircle = createLucideIcon(__iconData3);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/save.mjs
var __iconData4 = {
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
__iconData4.node;
var Save = createLucideIcon(__iconData4);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/trash.mjs
var __iconData5 = {
  name: "trash",
  size: 24,
  node: [
    ["path", { d: "M10 11v6", key: "nco0om" }],
    ["path", { d: "M14 11v6", key: "outv1u" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
  ],
  aliases: ["trash-2"]
};
__iconData5.node;
var Trash = createLucideIcon(__iconData5);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/x.mjs
var __iconData6 = {
  name: "x",
  size: 24,
  node: [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ]
};
__iconData6.node;
var X = createLucideIcon(__iconData6);

// src/directory-settings.tsx
var import_react4 = require("react");

// src/directory-api.ts
async function studioRequest(endpoint, data, signal) {
  const response = await fetch(`studio/${endpoint}`, { signal, credentials: "same-origin", ...data ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) } : {} });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message ?? `HTTP ${response.status}`);
  return result;
}
var directoryApi = {
  workspaces: (signal) => studioRequest("workspaces", void 0, signal),
  setWorkspace: (workspaceId, directory) => studioRequest("workspace-directory", { workspaceId, directory }),
  session: (sessionId, signal) => studioRequest(`sessions/directory?sessionId=${encodeURIComponent(sessionId)}`, void 0, signal),
  setSession: (sessionId, directory) => studioRequest("sessions/directory", { sessionId, directory }),
  deleteSession: (sessionId) => studioRequest("sessions/delete", { sessionId }),
  restartDsh: () => studioRequest("restart", {})
};

// src/directory-settings.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var DirectoryDialogs = class {
  listeners = /* @__PURE__ */ new Set();
  show(dialog) {
    for (const listener of this.listeners) listener(dialog);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
};
async function pick(picker) {
  const result = await picker.pick();
  if (!result.ok) throw new Error("\u76EE\u5F55\u9009\u62E9\u5668\u4E0D\u53EF\u7528\uFF0C\u8BF7\u76F4\u63A5\u586B\u5199\u7EDD\u5BF9\u8DEF\u5F84");
  return result.value ?? null;
}
function WorkspaceDirectorySettings({ picker }) {
  const [items, setItems] = (0, import_react4.useState)([]), [draft, setDraft] = (0, import_react4.useState)({}), [busy, setBusy] = (0, import_react4.useState)(""), [message, setMessage] = (0, import_react4.useState)("");
  const alive = (0, import_react4.useRef)(true);
  (0, import_react4.useEffect)(() => {
    alive.current = true;
    const controller = new AbortController();
    void directoryApi.workspaces(controller.signal).then((rows) => {
      setItems(rows);
      setDraft(Object.fromEntries(rows.map((item) => [item.id, item.directory])));
    }).catch((error) => {
      if (!controller.signal.aborted) setMessage(String(error));
    });
    return () => {
      alive.current = false;
      controller.abort();
    };
  }, []);
  const save = async (item) => {
    setBusy(item.id);
    setMessage("");
    try {
      const result = await directoryApi.setWorkspace(item.id, draft[item.id] ?? "");
      if (alive.current) {
        setItems((rows) => rows.map((row) => row.id === item.id ? { ...row, directory: result.directory } : row));
        setDraft((values) => ({ ...values, [item.id]: result.directory }));
        setMessage("\u5DE5\u4F5C\u533A\u76EE\u5F55\u5DF2\u4FDD\u5B58\uFF0C\u65B0\u5EFA\u4F1A\u8BDD\u5C06\u4F7F\u7528\u8BE5\u76EE\u5F55\u3002");
      }
    } catch (error) {
      if (alive.current) setMessage(String(error));
    } finally {
      if (alive.current) setBusy("");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "studio-directories studio-plugin-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u8BF7\u9009\u62E9\u5DF2\u5B58\u5728\u7684\u76EE\u5F55\u3002\u66F4\u6539\u76EE\u5F55\u4E0D\u4F1A\u79FB\u52A8\u6216\u5220\u9664\u5DF2\u6709\u6587\u4EF6\u3002" }),
    items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "studio-directory-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        "\u5DE5\u4F5C\u533A\u76EE\u5F55",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { "aria-label": `${item.title} \u5DE5\u4F5C\u533A\u76EE\u5F55`, value: draft[item.id] ?? "", onChange: (event) => setDraft((values) => ({ ...values, [item.id]: event.target.value })) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-directory-actions", children: [
        picker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { disabled: !!busy, onClick: () => {
          void pick(picker).then((value) => {
            if (alive.current && value) setDraft((values) => ({ ...values, [item.id]: value }));
          }).catch((error) => {
            if (alive.current) setMessage(String(error));
          });
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { size: 16, "aria-hidden": "true" }),
          "\u9009\u62E9\u76EE\u5F55"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: "is-primary", disabled: !!busy || draft[item.id] === item.directory, onClick: () => {
          void save(item);
        }, children: [
          busy === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "is-spinning", size: 16, "aria-hidden": "true" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 16, "aria-hidden": "true" }),
          busy === item.id ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58\u76EE\u5F55"
        ] })
      ] })
    ] }, item.id)),
    message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", children: message })
  ] });
}
function SessionDirectoryDialogs({ dialogs, picker, onDeleted }) {
  const [dialog, setDialog] = (0, import_react4.useState)(null), [directory, setDirectory] = (0, import_react4.useState)(""), [busy, setBusy] = (0, import_react4.useState)(false), [message, setMessage] = (0, import_react4.useState)("");
  const generation = (0, import_react4.useRef)(0);
  const modal = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => dialogs.subscribe((value) => {
    generation.current++;
    setDialog(value);
    setDirectory("");
    setMessage("");
    setBusy(false);
  }), [dialogs]);
  (0, import_react4.useEffect)(() => {
    if (!dialog || dialog.kind === "delete") return;
    const controller = new AbortController();
    setBusy(true);
    const load = dialog.kind === "workspace" ? directoryApi.workspaces(controller.signal).then((items) => {
      const item = items.find((row) => row.id === dialog.workspaceId);
      if (!item) throw new Error("\u5DE5\u4F5C\u533A\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5237\u65B0\u9875\u9762");
      return item;
    }) : directoryApi.session(dialog.sessionId, controller.signal);
    void load.then((result) => {
      if (!controller.signal.aborted) setDirectory(result.directory);
    }).catch((error) => {
      if (!controller.signal.aborted) setMessage(String(error));
    }).finally(() => {
      if (!controller.signal.aborted) setBusy(false);
    });
    return () => controller.abort();
  }, [dialog]);
  (0, import_react4.useEffect)(() => {
    if (!dialog || !modal.current) return;
    const element = modal.current;
    if (!element.open) element.showModal();
    return () => {
      if (element.open) element.close();
    };
  }, [dialog]);
  (0, import_react4.useEffect)(() => () => {
    generation.current++;
  }, []);
  if (!dialog) return null;
  const commit = async () => {
    const expected = generation.current;
    setBusy(true);
    setMessage("");
    try {
      if (dialog.kind === "delete") {
        await directoryApi.deleteSession(dialog.sessionId);
        if (expected === generation.current) {
          setDialog(null);
          onDeleted?.();
        }
      } else {
        const result = dialog.kind === "workspace" ? await directoryApi.setWorkspace(dialog.workspaceId, directory) : await directoryApi.setSession(dialog.sessionId, directory);
        if (expected === generation.current) {
          setDirectory(result.directory);
          setMessage(dialog.kind === "workspace" ? "\u5DE5\u4F5C\u533A\u76EE\u5F55\u5DF2\u4FDD\u5B58\uFF0C\u65B0\u5EFA\u4F1A\u8BDD\u5C06\u4F7F\u7528\u8BE5\u76EE\u5F55\u3002" : "\u5DE5\u4F5C\u76EE\u5F55\u5DF2\u4FDD\u5B58\u3002\u540E\u7EED\u6587\u4EF6\u64CD\u4F5C\u3001\u7EC8\u7AEF\u4E0E\u65B0\u5EFA\u5B50\u667A\u80FD\u4F53\u5C06\u4F7F\u7528\u6B64\u76EE\u5F55\u3002");
        }
      }
    } catch (error) {
      if (expected === generation.current) setMessage(String(error));
    } finally {
      if (expected === generation.current) setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dialog", { ref: modal, className: "studio-directory-backdrop", "aria-labelledby": "studio-directory-title", onCancel: (event) => {
    event.preventDefault();
    if (!busy) setDialog(null);
  }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "studio-directory-dialog", onClick: (event) => event.stopPropagation(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { id: "studio-directory-title", children: [
      dialog.kind === "delete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { size: 22, "aria-hidden": "true" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderCog, { size: 22, "aria-hidden": "true" }),
      dialog.kind === "delete" ? "\u5220\u9664\u4F1A\u8BDD" : dialog.kind === "workspace" ? "\u5DE5\u4F5C\u533A\u76EE\u5F55" : "\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55"
    ] }),
    dialog.kind === "delete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
      "\u786E\u5B9A\u6C38\u4E45\u5220\u9664\u201C",
      dialog.title || dialog.sessionId,
      "\u201D\u7684\u4F1A\u8BDD\u8BB0\u5F55\u3001\u5B50\u667A\u80FD\u4F53\u4F1A\u8BDD\u548C\u7ED1\u5B9A\u7684\u5DE5\u4F5C\u6D41\u5B9E\u4F8B\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002\u5DE5\u4F5C\u76EE\u5F55\u4E2D\u7684\u5DE5\u7A0B\u6587\u4EF6\u3001\u62A5\u544A\u548C EDA \u7ED3\u679C\u5C06\u4FDD\u7559\u3002"
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: dialog.kind === "workspace" ? "\u8BBE\u7F6E\u9879\u76EE\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55\u3002\u65B0\u4F1A\u8BDD\u9ED8\u8BA4\u4F7F\u7528\u5176 sessions / \u4F1A\u8BDD ID \u5B50\u76EE\u5F55\uFF0C\u4E5F\u53EF\u4EE5\u5355\u72EC\u4FEE\u6539\u3002\u5DF2\u6709\u6587\u4EF6\u4FDD\u7559\u539F\u4F4D\u3002" : "\u4E2D\u95F4\u4EA7\u7269\u548C\u62A5\u544A\u5199\u5165\u6B64\u76EE\u5F55\uFF0CEDA \u4F5C\u4E1A\u5199\u5165\u5176 eda-jobs \u5B50\u76EE\u5F55\u3002\u76EE\u5F55\u4E0D\u5B58\u5728\u65F6\u4F1A\u81EA\u52A8\u521B\u5EFA\uFF1B\u66F4\u6539\u76EE\u5F55\u4E0D\u4F1A\u79FB\u52A8\u5DF2\u6709\u6587\u4EF6\uFF1B\u8BF7\u5148\u505C\u6B62\u8FD0\u884C\u4E2D\u7684\u4EFB\u52A1\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        "\u5DE5\u4F5C\u76EE\u5F55",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { autoFocus: true, "aria-label": dialog.kind === "workspace" ? "\u5DE5\u4F5C\u533A\u76EE\u5F55" : "\u4F1A\u8BDD\u5DE5\u4F5C\u76EE\u5F55", value: directory, disabled: busy, onChange: (event) => setDirectory(event.target.value) })
      ] }),
      picker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { disabled: busy, onClick: () => {
        const expected = generation.current;
        void pick(picker).then((value) => {
          if (expected === generation.current && value) setDirectory(value);
        }).catch((error) => {
          if (expected === generation.current) setMessage(String(error));
        });
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { size: 16, strokeWidth: 1.5, "aria-hidden": "true" }),
        "\u9009\u62E9\u76EE\u5F55"
      ] })
    ] }),
    message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", className: "studio-directory-message", children: message }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { disabled: busy, onClick: () => setDialog(null), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16, "aria-hidden": "true" }),
        "\u5173\u95ED"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { className: dialog.kind === "delete" ? "is-danger" : "is-primary", disabled: busy || dialog.kind !== "delete" && !directory.trim(), onClick: () => {
        void commit();
      }, children: [
        busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "is-spinning", size: 16, "aria-hidden": "true" }) : dialog.kind === "delete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { size: 16, "aria-hidden": "true" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 16, "aria-hidden": "true" }),
        busy ? "\u5904\u7406\u4E2D\u2026" : dialog.kind === "delete" ? "\u6C38\u4E45\u5220\u9664" : dialog.kind === "workspace" ? "\u4FDD\u5B58\u5DE5\u4F5C\u533A\u76EE\u5F55" : "\u4FDD\u5B58\u5DE5\u4F5C\u76EE\u5F55"
      ] })
    ] })
  ] }) });
}
var directoryStyles = `
.studio-directories{display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;padding:0;margin:0;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:1.5}
.studio-directories p{display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;margin:12px 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5;white-space:normal;overflow-wrap:anywhere;word-break:break-word}
.studio-directory-dialog p{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5;overflow-wrap:anywhere}
.studio-directory-dialog h2{font-size:20px;font-weight:500;margin:0 0 16px;display:flex;align-items:center;gap:10px}
.studio-directory-dialog h2 svg{color:currentColor}
.studio-directory-card{min-width:0;border:0;border-bottom:.5px solid var(--dsw-alias-border-l2);padding:16px 0;margin-top:16px;background:transparent}
.studio-directories .studio-directory-card h3{font-size:13px;font-weight:600;margin:0 0 12px}
.studio-directory-card label,.studio-directory-dialog label{display:grid;gap:6px;font-size:13px;font-weight:500;margin:12px 0}
.studio-directory-card input,.studio-directory-dialog input{width:100%;box-sizing:border-box;min-width:0;height:34px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);padding:0 12px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;font-weight:400}
.studio-directory-actions,.studio-directory-dialog footer{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}
.studio-directories button,.studio-directory-dialog button,.studio-directory-trigger{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:34px;font:inherit;font-size:13px;font-weight:400;line-height:1.5;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);padding:5px 14px;background:transparent;color:var(--dsw-alias-label-primary);cursor:pointer;white-space:nowrap;transition:background .15s,border-color .15s,box-shadow .15s}
.studio-directories button:hover,.studio-directory-dialog button:hover,.studio-directory-trigger:hover{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2)}
.studio-directories button:focus-visible,.studio-directory-dialog button:focus-visible,.studio-directory-trigger:focus-visible,.studio-directory-menuitem:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.studio-directory-trigger{min-height:28px;padding:3px 9px;font-size:13px}
.studio-directory-trigger svg,.studio-directory-menuitem svg{color:currentColor;flex:none}
.studio-directory-menuitem{display:flex;align-items:center;gap:8px;width:100%;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);padding:8px 12px;text-align:left;font-size:14px;line-height:20px;cursor:pointer}
.studio-directory-menuitem:hover{background:var(--dsw-alias-bg-layer-2)}
.studio-directory-menuitem.is-danger{color:#dc2626}
.studio-directories .is-spinning,.studio-directory-dialog .is-spinning{animation:studio-directory-spin 1s linear infinite}
@keyframes studio-directory-spin{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.studio-directories .is-spinning,.studio-directory-dialog .is-spinning{animation:none}}
.studio-directories button.is-primary,.studio-directory-dialog button.is-primary{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-3);border-color:transparent}
.studio-directory-dialog button.is-danger{background:#dc2626;color:white;border-color:transparent}
.studio-directories button:disabled,.studio-directory-dialog button:disabled{opacity:.5;cursor:default}
.studio-directory-backdrop{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;width:100%;height:100%;max-width:none;max-height:none;margin:0;border:0;box-sizing:border-box;padding:20px;background:#10182855;backdrop-filter:blur(3px);pointer-events:auto}
.studio-directory-backdrop::backdrop{background:transparent}
.studio-directory-dialog{width:min(640px,100%);max-height:85vh;overflow:auto;box-sizing:border-box;border-radius:var(--dsw-radius-panel);padding:24px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);box-shadow:0 20px 80px #0003}
.studio-directory-message{white-space:pre-wrap}
`;

// src/workspace-menu.ts
function extendWorkspaceMenu(dialogs) {
  let selected;
  const added = /* @__PURE__ */ new Set();
  const click = (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest('button[aria-haspopup="menu"],button[aria-label]');
    const row = button?.closest('[data-row-key^="workspace:"]');
    if (!row || !button || button.getAttribute("aria-label")?.includes("\u65B0\u5EFA\u4F1A\u8BDD")) {
      if (!target?.closest('[role="menu"]')) selected = void 0;
      return;
    }
    selected = { id: row.dataset.rowKey.slice("workspace:".length), title: row.textContent?.trim() || "" };
  };
  const observer = new MutationObserver(() => {
    for (const button2 of added) if (!button2.isConnected) added.delete(button2);
    if (!selected) return;
    const menus = [...document.querySelectorAll('[role="menu"]')];
    const menu = menus.at(-1);
    if (!menu) {
      selected = void 0;
      return;
    }
    if (menu.querySelector("[data-studio-workspace-directory]")) return;
    const items = menu.querySelectorAll('[role="menuitem"]');
    if (items.length < 2) return;
    const identity = selected;
    const button = document.createElement("button");
    button.type = "button";
    button.role = "menuitem";
    button.dataset.studioWorkspaceDirectory = "true";
    button.className = items[0].className;
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    for (const [key, value] of Object.entries({ width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" })) icon.setAttribute(key, value);
    const outline = document.createElementNS("http://www.w3.org/2000/svg", "path");
    outline.setAttribute("d", "M3 8V5a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v2M3 8h18l-3 12H5L2 10a2 2 0 0 1 1-2Z");
    icon.append(outline);
    const iconSeat = document.createElement("span");
    iconSeat.className = items[0].firstElementChild?.className || "";
    iconSeat.append(icon);
    const label = document.createElement("span");
    label.textContent = "\u8BBE\u7F6E\u5DE5\u4F5C\u533A\u76EE\u5F55\u2026";
    label.className = items[0].lastElementChild?.className || "";
    button.append(iconSeat, label);
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      menu.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      dialogs.show({ kind: "workspace", sessionId: "", workspaceId: identity.id, title: identity.title });
      selected = void 0;
    });
    const wrapper = items[1].parentElement.cloneNode(false);
    wrapper.append(button);
    items[1].parentElement.before(wrapper);
    added.add(wrapper);
  });
  document.addEventListener("click", click, true);
  observer.observe(document.body, { childList: true, subtree: true });
  const keyboard = (event) => {
    const menu = event.target instanceof Element ? event.target.closest('[role="menu"]') : null;
    if (!menu?.querySelector("[data-studio-workspace-directory]")) return;
    const items = [...menu.querySelectorAll('button[role="menuitem"]:not(:disabled)')];
    const index = items.indexOf(document.activeElement);
    let next;
    if (event.key === "ArrowDown") next = (index + 1) % items.length;
    if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (next !== void 0) {
      event.preventDefault();
      event.stopPropagation();
      items[next]?.focus();
    } else if ((event.key === "Enter" || event.key === " ") && index >= 0) {
      event.preventDefault();
      event.stopPropagation();
      items[index].click();
    }
  };
  document.addEventListener("keydown", keyboard, true);
  return () => {
    observer.disconnect();
    document.removeEventListener("click", click, true);
    document.removeEventListener("keydown", keyboard, true);
    for (const button of added) button.remove();
    added.clear();
  };
}

// src/client-session-workspace-settings.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var inject = ["remote", "remote.pluginManager", "remote.directoryPicker"];
function apply(ctx) {
  const dialogs = new DirectoryDialogs();
  ctx.provide("sessionDirectoryEditor", { edit: (sessionId) => dialogs.show({ kind: "directory", sessionId }) });
  ctx.effect(() => extendWorkspaceMenu(dialogs), "session and workspace settings: workspace menu");
  const remotePicker = ctx.get("remote").directoryPicker;
  const picker = { async pick() {
    const ui = ctx.get("uiWorkspace");
    return ui?.pickDirectory ? { ok: true, value: await ui.pickDirectory() } : remotePicker.pick();
  } };
  ctx.effect(() => {
    const style = document.createElement("style");
    style.textContent = directoryStyles;
    document.head.append(style);
    return () => style.remove();
  }, "session and workspace settings: styles");
  ctx.inject(["slots"], (child) => {
    const slots = child.get("slots");
    const Dialogs = () => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SessionDirectoryDialogs, { dialogs, picker });
    const DirectoryAction = ({ sessionId }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { className: "studio-directory-trigger", title: "\u8BBE\u7F6E\u6B64\u4F1A\u8BDD\u7684\u5DE5\u4F5C\u76EE\u5F55", onClick: () => dialogs.show({ kind: "directory", sessionId }), children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FolderOpen, { size: 14, strokeWidth: 1.5, "aria-hidden": "true" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "\u5DE5\u4F5C\u76EE\u5F55" })
    ] });
    const DeleteAction = ({ sessionId, displayTitle, useMenuOpenState }) => {
      const [, setOpen] = useMenuOpenState();
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { className: "studio-directory-menuitem is-danger", role: "menuitem", onClick: () => {
        dialogs.show({ kind: "delete", sessionId, title: displayTitle });
        setOpen(false);
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Trash, { size: 14, strokeWidth: 1.5, "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "\u5220\u9664\u4F1A\u8BDD\u2026" })
      ] });
    };
    const DirectoryMenuAction = ({ sessionId, useMenuOpenState }) => {
      const [, setOpen] = useMenuOpenState();
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { className: "studio-directory-menuitem", role: "menuitem", onClick: () => {
        dialogs.show({ kind: "directory", sessionId });
        setOpen(false);
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FolderOpen, { size: 14, strokeWidth: 1.5, "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "\u5DE5\u4F5C\u76EE\u5F55\u2026" })
      ] });
    };
    const WorkspaceSettings = ({ view }) => view === "summary" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "\u8BBE\u7F6E\u5DE5\u4F5C\u533A\u9ED8\u8BA4\u76EE\u5F55\uFF1B\u652F\u6301\u4E3A\u5355\u4E2A\u4F1A\u8BDD\u8BBE\u7F6E\u5DE5\u4F5C\u76EE\u5F55\uFF0C\u5E76\u4ECE\u4F1A\u8BDD\u83DC\u5355\u5220\u9664\u4F1A\u8BDD\u3002" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(WorkspaceDirectorySettings, { picker });
    child.effect(() => slots.inject("shell.overlay", () => slots.register({ name: "shell.overlay", id: "studio-directory-dialogs", order: 90 }, Dialogs)), "session and workspace settings: dialogs");
    child.effect(() => slots.inject("conversation.session.header.actions", () => slots.register({ name: "conversation.session.header.actions", id: "studio-directory", order: 5 }, DirectoryAction)), "session and workspace settings: session directory");
    child.effect(() => slots.inject("sidebar.workspaces.session.menu.item", () => slots.register({ name: "sidebar.workspaces.session.menu.item", id: "studio-delete-session", order: 700 }, DeleteAction)), "session and workspace settings: delete session");
    child.effect(() => slots.inject("sidebar.workspaces.session.menu.item", () => slots.register({ name: "sidebar.workspaces.session.menu.item", id: "studio-session-directory", order: 650 }, DirectoryMenuAction)), "session and workspace settings: directory menu");
    child.effect(() => slots.inject("plugins.bundle.config", () => slots.register({ name: "plugins.bundle.config", key: "@agent-studio/plugin-session-workspace-settings" }, WorkspaceSettings)), "session and workspace settings: workspace paths");
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
lucide-react/dist/esm/icons/folder-cog.mjs:
lucide-react/dist/esm/icons/folder-open.mjs:
lucide-react/dist/esm/icons/loader-circle.mjs:
lucide-react/dist/esm/icons/save.mjs:
lucide-react/dist/esm/icons/trash.mjs:
lucide-react/dist/esm/icons/x.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.65.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
return module.exports;}});
