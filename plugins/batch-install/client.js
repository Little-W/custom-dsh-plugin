window.__ModuleLoader__.load({id:"@agent-studio/plugin-batch-install",factory:(require)=>{var module={exports:{}};var exports=module.exports;
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

// apps/dsh/src/client-plugin-batch-install.tsx
var client_plugin_batch_install_exports = {};
__export(client_plugin_batch_install_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_plugin_batch_install_exports);
var import_react4 = require("react");

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
var import_react3 = require("react");

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
var import_react2 = require("react");

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
var import_react = require("react");
var LucideContext = (0, import_react.createContext)({});
var useLucideContext = () => (0, import_react.useContext)(LucideContext);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/Icon.mjs
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

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
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

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/check.mjs
var __iconData = {
  name: "check",
  size: 24,
  node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]
};
__iconData.node;
var Check = createLucideIcon(__iconData);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/folder-open.mjs
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

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/package-plus.mjs
var __iconData3 = {
  name: "package-plus",
  size: 24,
  node: [
    ["path", { d: "M12 22V12", key: "d0xqtd" }],
    ["path", { d: "M16 17h6", key: "1ook5g" }],
    ["path", { d: "M19 14v6", key: "1ckrd5" }],
    [
      "path",
      {
        d: "M21 10.535V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.675-.955",
        key: "28k6lz"
      }
    ],
    ["path", { d: "M3.29 7 12 12l8.71-5", key: "19ckod" }],
    ["path", { d: "m7.5 4.27 8.997 5.148", key: "9yrvtv" }]
  ]
};
__iconData3.node;
var PackagePlus = createLucideIcon(__iconData3);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs
var __iconData4 = {
  name: "refresh-cw",
  size: 24,
  node: [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
    ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
    ["path", { d: "M8 16H3v5", key: "1cv678" }]
  ]
};
__iconData4.node;
var RefreshCw = createLucideIcon(__iconData4);

// apps/dsh/src/client-plugin-batch-install.tsx
var import_jsx_runtime = require("react/jsx-runtime");
async function request(url, value) {
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(value) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || `\u8BF7\u6C42\u5931\u8D25 (${response.status})`);
  return body;
}
function BatchInstall({ picker }) {
  const [directory, setDirectory] = (0, import_react4.useState)("");
  const [scan, setScan] = (0, import_react4.useState)();
  const [results, setResults] = (0, import_react4.useState)([]);
  const [busy, setBusy] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)("");
  const [notice, setNotice] = (0, import_react4.useState)("");
  const scanDirectory = (0, import_react4.useCallback)(async (value, preserveResult = false) => {
    setBusy(true);
    setError("");
    if (!preserveResult) {
      setNotice("");
      setResults([]);
    }
    try {
      const next = await request("/studio/plugin-batch-install/scan", { directory: value });
      setDirectory(next.directory);
      setScan(next);
    } catch (reason) {
      setScan(void 0);
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  }, []);
  const choose = async () => {
    const result = await picker.pick();
    if (result.ok && result.value) await scanDirectory(result.value);
    else if (!result.ok) setError(result.error || "\u65E0\u6CD5\u9009\u62E9\u76EE\u5F55");
  };
  const install = async () => {
    if (!scan || !scan.installCount || !window.confirm(`\u5C06\u5B89\u88C5\u5E76\u542F\u7528 ${scan.installCount} \u4E2A\u6709\u6548\u63D2\u4EF6\u3002\u5B89\u88C5\u8FC7\u7A0B\u53EF\u80FD\u9700\u8981\u4E00\u4E9B\u65F6\u95F4\uFF0C\u5B8C\u6210\u540E\u5EFA\u8BAE\u91CD\u542F DSH\u3002\u7EE7\u7EED\u5417\uFF1F`)) return;
    setBusy(true);
    setError("");
    setNotice("\u6B63\u5728\u901A\u8FC7 DSH \u63D2\u4EF6\u7BA1\u7406\u5668\u6279\u91CF\u5B89\u88C5\uFF0C\u8BF7\u7A0D\u5019\u2026");
    setResults([]);
    try {
      const result = await request("/studio/plugin-batch-install/install", { directory: scan.directory });
      setResults(result.results);
      setNotice(result.failed ? `\u5DF2\u5B89\u88C5 ${result.installed} \u4E2A\uFF0C${result.failed} \u4E2A\u5931\u8D25\u3002\u5931\u8D25\u9879\u53EF\u67E5\u770B\u4E0B\u65B9\u8BE6\u60C5\u3002` : result.installed ? `\u5DF2\u5B89\u88C5\u5E76\u542F\u7528 ${result.installed} \u4E2A\u63D2\u4EF6\u3002\u8BF7\u91CD\u542F DSH \u4EE5\u786E\u4FDD\u6240\u6709\u63D2\u4EF6\u5B8C\u6574\u52A0\u8F7D\u3002` : result.message || "\u6CA1\u6709\u5F85\u5B89\u88C5\u7684\u63D2\u4EF6\u3002");
      await scanDirectory(scan.directory, true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
      setNotice("");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-plugin-batch", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-plugin-batch__intro", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackagePlus, { size: 22 }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u63D2\u4EF6\u6279\u91CF\u5B89\u88C5" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u9009\u62E9\u4E00\u4E2A\u5305\u542B\u591A\u4E2A\u63D2\u4EF6\u5B50\u76EE\u5F55\u7684\u6587\u4EF6\u5939\uFF0C\u626B\u63CF\u540E\u4E00\u6B21\u5B89\u88C5\u5E76\u542F\u7528\u5176\u4E2D\u6240\u6709\u6709\u6548\u7684 DSH \u63D2\u4EF6\u3002" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "studio-plugin-batch__card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u63D2\u4EF6\u76EE\u5F55" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
        "\u4F8B\u5982 Agent Studio \u7684 ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "plugins" }),
        " \u6587\u4EF6\u5939\u3002\u53EA\u626B\u63CF\u8BE5\u76EE\u5F55\u7684\u76F4\u63A5\u5B50\u6587\u4EF6\u5939\uFF1B\u5DF2\u5B89\u88C5\u63D2\u4EF6\u4F1A\u81EA\u52A8\u8DF3\u8FC7\u3002"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-plugin-batch__path", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { "aria-label": "\u63D2\u4EF6\u76EE\u5F55", value: directory, onChange: (event) => setDirectory(event.target.value), placeholder: "\u9009\u62E9\u63D2\u4EF6\u76EE\u5F55" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", disabled: busy, onClick: () => void choose(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { size: 16 }),
          "\u9009\u62E9\u76EE\u5F55"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", disabled: busy || !directory.trim(), onClick: () => void scanDirectory(directory), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { size: 15 }),
          "\u626B\u63CF"
        ] })
      ] }),
      scan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-plugin-batch__scan", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-plugin-batch__summary", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
            "\u53D1\u73B0 ",
            scan.candidates.length,
            " \u4E2A\u63D2\u4EF6\u76EE\u5F55"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            scan.installCount,
            " \u4E2A\u53EF\u5B89\u88C5 \xB7 ",
            scan.candidates.filter((item) => item.installed).length,
            " \u4E2A\u5DF2\u5B89\u88C5 \xB7 ",
            scan.candidates.filter((item) => !item.installable).length,
            " \u4E2A\u683C\u5F0F\u4E0D\u652F\u6301"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: scan.candidates.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: item.installable ? "" : "is-muted", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "studio-plugin-batch__item", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.installable ? item.version : item.reason })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "studio-plugin-batch__state", children: item.installed ? "\u5DF2\u5B89\u88C5" : item.installable ? "\u5F85\u5B89\u88C5" : "\u5DF2\u8DF3\u8FC7" })
        ] }, `${item.path}:${item.name}`)) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "is-primary", disabled: busy || !scan.installCount, onClick: () => void install(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackagePlus, { size: 16 }),
          "\u5B89\u88C5 ",
          scan.installCount,
          " \u4E2A\u63D2\u4EF6"
        ] })
      ] }) : null
    ] }),
    notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-plugin-batch__notice", role: "status", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }),
      notice
    ] }) : null,
    error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "studio-plugin-batch__error", role: "alert", children: error }) : null,
    results.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "studio-plugin-batch__card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u5B89\u88C5\u7ED3\u679C" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: results.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: item.status === "failed" ? "is-failed" : "", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "studio-plugin-batch__item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.message })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "studio-plugin-batch__state", children: item.status === "installed" ? "\u5B8C\u6210" : "\u5931\u8D25" })
      ] }, item.name)) })
    ] }) : null
  ] });
}
var inject = ["remote", "remote.directoryPicker"];
function apply(ctx) {
  const remote = ctx.get("remote");
  const picker = remote?.directoryPicker ?? { pick: async () => ({ ok: false, error: "\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u9009\u62E9\u76EE\u5F55\uFF0C\u8BF7\u624B\u52A8\u8F93\u5165\u5B8C\u6574\u8DEF\u5F84\u3002" }) };
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = "studio-plugin-batch-install";
    style.textContent = `.studio-plugin-batch{max-width:900px;padding:28px;color:var(--dsw-alias-text-primary,#1c2433);font-family:inherit;font-size:14px;line-height:1.55}.studio-plugin-batch h2,.studio-plugin-batch h3,.studio-plugin-batch p{margin:0}.studio-plugin-batch__intro{display:flex;gap:14px;align-items:flex-start;margin-bottom:24px;color:var(--dsw-alias-state-business-primary,#4778ec)}.studio-plugin-batch h2{font-size:20px;color:var(--dsw-alias-text-primary,#1c2433)}.studio-plugin-batch__intro p,.studio-plugin-batch__card>p{margin-top:7px;color:var(--dsw-alias-text-secondary,#6b7890)}.studio-plugin-batch__card{padding:20px;margin:14px 0;border:1px solid var(--dsw-alias-border-primary,#dce2eb);border-radius:14px;background:var(--dsw-alias-bg-base,#fff)}.studio-plugin-batch__card h3{font-size:16px}.studio-plugin-batch code,.studio-plugin-batch small{overflow-wrap:anywhere;color:var(--dsw-alias-text-secondary,#61718b)}.studio-plugin-batch__path{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px}.studio-plugin-batch input[aria-label="\u63D2\u4EF6\u76EE\u5F55"]{flex:1;min-width:150px;height:38px;padding:0 12px;border:1px solid var(--dsw-alias-border-primary,#d2dae6);border-radius:9px;background:var(--dsw-alias-bg-subtle,#f8fafc);color:inherit;font:inherit}.studio-plugin-batch button{display:inline-flex;gap:7px;align-items:center;justify-content:center;min-height:36px;padding:0 12px;border:1px solid var(--dsw-alias-border-primary,#d2dae6);border-radius:9px;background:var(--dsw-alias-bg-base,#fff);color:inherit;font:inherit;cursor:pointer}.studio-plugin-batch button:disabled{opacity:.55;cursor:default}.studio-plugin-batch button.is-primary{margin-top:14px;background:var(--dsw-alias-state-business-primary,#4778ec);border-color:transparent;color:#fff}.studio-plugin-batch__scan{margin-top:18px}.studio-plugin-batch__summary{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px}.studio-plugin-batch__summary span,.studio-plugin-batch__state{color:var(--dsw-alias-text-secondary,#6b7890);font-size:12px}.studio-plugin-batch ul{list-style:none;padding:0;margin:12px 0 0;border:1px solid var(--dsw-alias-border-primary,#e3e8ef);border-radius:10px;overflow:hidden}.studio-plugin-batch li{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-primary,#edf0f4)}.studio-plugin-batch li:last-child{border-bottom:0}.studio-plugin-batch li.is-muted{opacity:.62}.studio-plugin-batch li.is-failed{color:#bd3029}.studio-plugin-batch__item{display:grid;min-width:0;gap:2px}.studio-plugin-batch__item small{font-size:12px}.studio-plugin-batch__notice,.studio-plugin-batch__error{display:flex;gap:10px;align-items:flex-start;margin:12px 0;padding:12px;border-radius:10px;background:var(--dsw-alias-bg-subtle,#f4f7fb)}.studio-plugin-batch__notice{color:#167a52}.studio-plugin-batch__error{color:#bd3029;overflow-wrap:anywhere}`;
    document.head.append(style);
    return () => style.remove();
  }, "plugin batch install: styles");
  ctx.inject(["slots"], (child) => {
    const slots = child.get("slots");
    const View = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatchInstall, { picker });
    child.effect(() => slots.inject("plugins.bundle.config", () => slots.register({ name: "plugins.bundle.config", key: "@agent-studio/plugin-batch-install" }, View)), "plugin batch install: settings");
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
lucide-react/dist/esm/icons/check.mjs:
lucide-react/dist/esm/icons/folder-open.mjs:
lucide-react/dist/esm/icons/package-plus.mjs:
lucide-react/dist/esm/icons/refresh-cw.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.65.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
return module.exports;}});
