window.__ModuleLoader__.load({id:"@agent-studio/plugin-data-storage",factory:(require)=>{var module={exports:{}};var exports=module.exports;
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

// src/client-data-storage.tsx
var client_data_storage_exports = {};
__export(client_data_storage_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_data_storage_exports);
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

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/archive.mjs
var __iconData = {
  name: "archive",
  size: 24,
  node: [
    ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
    ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
    ["path", { d: "M10 12h4", key: "a56b0p" }]
  ]
};
__iconData.node;
var Archive = createLucideIcon(__iconData);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/check.mjs
var __iconData2 = {
  name: "check",
  size: 24,
  node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]
};
__iconData2.node;
var Check = createLucideIcon(__iconData2);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/folder-open.mjs
var __iconData3 = {
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
__iconData3.node;
var FolderOpen = createLucideIcon(__iconData3);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/hard-drive.mjs
var __iconData4 = {
  name: "hard-drive",
  size: 24,
  node: [
    ["path", { d: "M10 16h.01", key: "1bzywj" }],
    [
      "path",
      {
        d: "M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
        key: "18tbho"
      }
    ],
    ["path", { d: "M21.946 12.013H2.054", key: "zqlbp7" }],
    ["path", { d: "M6 16h.01", key: "1pmjb7" }]
  ]
};
__iconData4.node;
var HardDrive = createLucideIcon(__iconData4);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs
var __iconData5 = {
  name: "rotate-ccw",
  size: 24,
  node: [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
    ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
  ]
};
__iconData5.node;
var RotateCcw = createLucideIcon(__iconData5);

// ../../node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/trash.mjs
var __iconData6 = {
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
__iconData6.node;
var Trash = createLucideIcon(__iconData6);

// src/client-data-storage.tsx
var import_jsx_runtime = require("react/jsx-runtime");
async function request(url, init) {
  const response = await fetch(url, init);
  const value = response.headers.get("content-type")?.includes("json") ? await response.json() : void 0;
  if (!response.ok) throw new Error(value?.message ?? `\u8BF7\u6C42\u5931\u8D25 (${response.status})`);
  return value;
}
function post(url, body) {
  return request(url, { method: "POST", ...body === void 0 ? {} : { headers: { "content-type": "application/json" }, body: JSON.stringify(body) } });
}
function DataStorageSettings({ picker }) {
  const [status, setStatus] = (0, import_react4.useState)();
  const [directory, setDirectory] = (0, import_react4.useState)("");
  const [busy, setBusy] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)("");
  const [notice, setNotice] = (0, import_react4.useState)("");
  const [confirmCleanup, setConfirmCleanup] = (0, import_react4.useState)(false);
  const refresh = (0, import_react4.useCallback)(async () => {
    const next = await request("/studio/data-storage/status");
    setStatus(next);
    setDirectory(next.relocated ? next.directory : "");
  }, []);
  (0, import_react4.useEffect)(() => {
    void refresh().catch((reason) => setError(String(reason)));
  }, [refresh]);
  const run = async (task) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await task();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  };
  const choose = async () => {
    const result = await picker.pick();
    if (result.ok && result.value) setDirectory(result.value);
    else if (!result.ok) setError(result.error || "\u65E0\u6CD5\u9009\u62E9\u76EE\u5F55");
  };
  const relocate = () => run(async () => {
    const result = await post("/studio/data-storage/location", { directory, mode: "copy" });
    await refresh();
    setNotice(`\u6570\u636E\u5DF2\u590D\u5236\u5E76\u5207\u6362\u5230\u6240\u9009\u4F4D\u7F6E\uFF1A${result.directory}\u3002\u4E3A\u786E\u4FDD\u6240\u6709\u670D\u52A1\u91CD\u65B0\u6253\u5F00\u65B0\u76EE\u5F55\uFF0C\u5FC5\u987B\u91CD\u542F DSH\u3002`);
  });
  const switchOnly = () => run(async () => {
    if (!window.confirm("\u4EC5\u5207\u6362\u5B58\u50A8\u4F4D\u7F6E\uFF0C\u4E0D\u4F1A\u590D\u5236\u5F53\u524D\u6570\u636E\u3002\u5207\u6362\u540E DSH \u5C06\u76F4\u63A5\u4F7F\u7528\u76EE\u6807\u76EE\u5F55\u5DF2\u6709\u7684\u6570\u636E\uFF1B\u5F53\u524D DSH_HOME \u6570\u636E\u4F1A\u6682\u65F6\u4FDD\u7559\uFF0C\u786E\u8BA4\u65B0\u76EE\u5F55\u6B63\u5E38\u542F\u52A8\u540E\u518D\u6E05\u7406\u3002\u7EE7\u7EED\u5417\uFF1F")) return;
    const result = await post("/studio/data-storage/location", { directory, mode: "switch" });
    await refresh();
    setNotice(`\u5DF2\u5207\u6362\u5230\u73B0\u6709\u6570\u636E\u76EE\u5F55\uFF1A${result.directory}\u3002DSH_HOME \u4E2D\u7684\u65E7\u6570\u636E\u5DF2\u4FDD\u7559\uFF1B\u8BF7\u91CD\u542F\u5E76\u786E\u8BA4\u65B0\u76EE\u5F55\u6B63\u5E38\u52A0\u8F7D\u3002`);
  });
  const mergeMissing = () => run(async () => {
    if (!window.confirm("\u5C06 DSH_HOME \u4E2D\u76EE\u6807\u76EE\u5F55\u7F3A\u5C11\u7684\u6570\u636E\u8865\u5165\u76EE\u6807\u76EE\u5F55\uFF1B\u540C\u540D\u5185\u5BB9\u4FDD\u7559\u76EE\u6807\u7248\u672C\uFF0C\u539F\u59CB\u6570\u636E\u5B8C\u6574\u4FDD\u5B58\u5728\u65E7\u6570\u636E\u526F\u672C\u4E2D\u3002\u684C\u9762\u7248\u914D\u7F6E\u548C\u8DEF\u5F84\u4E5F\u4F1A\u4E00\u5E76\u8FC1\u79FB\u3002\u7EE7\u7EED\u5417\uFF1F")) return;
    const result = await post("/studio/data-storage/location", { directory, mode: "merge" });
    await refresh();
    setNotice(`\u7F3A\u5931\u6570\u636E\u5DF2\u5408\u5E76\u5230\uFF1A${result.directory}\u3002\u684C\u9762\u7248\u8DEF\u5F84\u4E5F\u5DF2\u6307\u5411\u65B0\u76EE\u5F55\uFF1B\u8BF7\u91CD\u542F\u5E76\u68C0\u67E5\u6570\u636E\u3002\u65E7\u6570\u636E\u526F\u672C\u5DF2\u4FDD\u7559\u3002`);
  });
  const backup = () => run(async () => {
    const response = await fetch("/studio/data-storage/backup");
    if (!response.ok) throw new Error("\u521B\u5EFA\u5907\u4EFD\u5931\u8D25");
    const blob = await response.blob(), link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `dsh-data-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.tar.gz`;
    link.click();
    URL.revokeObjectURL(link.href);
    setNotice("\u6570\u636E\u5907\u4EFD\u5305\u5DF2\u4E0B\u8F7D\u3002\u8BF7\u59A5\u5584\u4FDD\u7BA1\uFF0C\u5176\u4E2D\u53EF\u80FD\u5305\u542B\u4F1A\u8BDD\u548C\u63D0\u4F9B\u5546\u914D\u7F6E\u3002");
  });
  const restore = (file) => file && run(async () => {
    if (!window.confirm(`\u786E\u5B9A\u4ECE\u201C${file.name}\u201D\u6062\u590D\u6570\u636E\u5417\uFF1F\u6062\u590D\u4F1A\u8986\u76D6\u540C\u540D\u7684\u5F53\u524D\u6587\u4EF6\u3002`)) return;
    const result = await request("/studio/data-storage/restore", { method: "POST", headers: { "content-type": "application/gzip", "x-file-name": encodeURIComponent(file.name) }, body: file });
    setNotice(result.message);
    await refresh();
  });
  const clear = () => run(async () => {
    await post("/studio/data-storage/cleanup");
    setConfirmCleanup(false);
    await refresh();
    setNotice("\u5DF2\u6E05\u9664 DSH_HOME \u4E2D\u4FDD\u7559\u7684\u65E7\u6570\u636E\u526F\u672C\u3002");
  });
  const restart = () => run(async () => {
    await post("/studio/data-storage/restart");
    setNotice("DSH \u6B63\u5728\u91CD\u542F\uFF0C\u8BF7\u7A0D\u5019\u91CD\u65B0\u6253\u5F00\u9875\u9762\u3002");
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "studio-data-storage", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-data-storage__intro", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { size: 22 }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "\u6570\u636E\u5B58\u50A8\u7BA1\u7406" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u9009\u62E9 DSH \u4E3B\u6570\u636E\u7684\u5B58\u50A8\u4F4D\u7F6E\uFF0C\u6216\u521B\u5EFA\u5907\u4EFD\u5E76\u4ECE\u5907\u4EFD\u6062\u590D\u3002\u542F\u52A8\u914D\u7F6E\u4F1A\u4FDD\u7559\u5728\u539F\u4F4D\u7F6E\u3002" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-data-storage__card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u6570\u636E\u5B58\u50A8\u4F4D\u7F6E" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
        "\u5F53\u524D\u6570\u636E\u76EE\u5F55\uFF1A",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: status?.directory ?? "\u6B63\u5728\u8BFB\u53D6\u2026" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-data-storage__field", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { "aria-label": "\u6570\u636E\u76EE\u5F55", value: directory, onChange: (event) => setDirectory(event.target.value), placeholder: "\u9009\u62E9\u76EE\u6807\u76EE\u5F55" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", disabled: busy, onClick: () => void choose(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { size: 16 }),
          "\u9009\u62E9\u76EE\u5F55"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "is-primary", disabled: busy || !directory.trim() || status?.relocated && directory === status.directory, onClick: relocate, children: "\u590D\u5236\u5E76\u5207\u6362" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", disabled: busy || !directory.trim() || status?.relocated && directory === status.directory, onClick: switchOnly, children: "\u5207\u6362" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "studio-data-storage__hint", children: "\u201C\u590D\u5236\u5E76\u5207\u6362\u201D\u9002\u7528\u4E8E\u65B0\u76EE\u5F55\uFF1B\u201C\u5207\u6362\u201D\u76F4\u63A5\u4F7F\u7528\u76EE\u6807\u76EE\u5F55\u4E2D\u5DF2\u6709\u7684\u6570\u636E\uFF0C\u4E0D\u590D\u5236\u5F53\u524D\u6570\u636E\u3002\u4E24\u79CD\u65B9\u5F0F\u90FD\u4F1A\u5728 DSH_HOME \u4E2D\u4FDD\u7559\u65E7\u6570\u636E\uFF0C\u91CD\u542F\u5E76\u786E\u8BA4\u65B0\u76EE\u5F55\u6B63\u5E38\u52A0\u8F7D\u540E\u624D\u53EF\u6E05\u7406\u3002" }),
      status?.leftovers.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-data-storage__pending", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: status.restartRequired ? "\u65E7\u6570\u636E\u526F\u672C\u5DF2\u4FDD\u7559\uFF0C\u7B49\u5F85\u91CD\u542F\u9A8C\u8BC1" : "\u53D1\u73B0 DSH_HOME \u4E2D\u4FDD\u7559\u7684\u65E7\u6570\u636E\u526F\u672C" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: status.restartRequired ? "\u5148\u91CD\u542F DSH \u5E76\u786E\u8BA4\u65B0\u76EE\u5F55\u6B63\u5E38\u52A0\u8F7D\uFF0C\u4E4B\u540E\u624D\u53EF\u4EE5\u6E05\u7406\u65E7\u526F\u672C\u3002" : "\u65B0\u76EE\u5F55\u5DF2\u5728\u672C\u6B21\u542F\u52A8\u4E2D\u52A0\u8F7D\u3002\u786E\u8BA4\u8FD0\u884C\u6B63\u5E38\u540E\uFF0C\u53EF\u4EE5\u6E05\u7406\u65E7\u526F\u672C\uFF1B\u4FDD\u7559\u526F\u672C\u53EF\u7528\u4E8E\u56DE\u6EDA\u6216\u627E\u56DE\u6570\u636E\u3002" })
        ] }),
        status.restartRequired ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", disabled: busy, onClick: restart, children: "\u7ACB\u5373\u91CD\u542F" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "is-danger", disabled: busy, onClick: () => setConfirmCleanup(true), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { size: 15 }),
          "\u6E05\u7406\u65E7\u526F\u672C"
        ] })
      ] }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-data-storage__card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "\u5907\u4EFD\u4E0E\u6062\u590D" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u5907\u4EFD\u4F1A\u6253\u5305 DSH_HOME \u4E0E\u91CD\u5B9A\u5411\u540E\u7684\u6570\u636E\u76EE\u5F55\uFF0C\u63D2\u4EF6\u4F9D\u8D56\u76EE\u5F55\u4E0D\u4F1A\u6253\u5305\u3002\u5907\u4EFD\u53EF\u80FD\u5305\u542B\u4F1A\u8BDD\u3001\u5BC6\u94A5\u914D\u7F6E\u548C\u4E2A\u4EBA\u6570\u636E\uFF0C\u8BF7\u59A5\u5584\u4FDD\u7BA1\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-data-storage__actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", disabled: busy, onClick: backup, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { size: 16 }),
          "\u4E0B\u8F7D\u6570\u636E\u5907\u4EFD"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: `studio-data-storage__upload${busy ? " is-disabled" : ""}`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { size: 16 }),
          "\u4ECE\u5907\u4EFD\u6062\u590D",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "file", accept: ".gz,.tgz,.tar.gz,application/gzip", disabled: busy, onChange: (event) => {
            void restore(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          } })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "studio-data-storage__hint", children: "\u6062\u590D\u540E\u9700\u8981\u91CD\u542F DSH\uFF0C\u624D\u80FD\u8BA9\u6240\u6709\u4F1A\u8BDD\u548C\u63D2\u4EF6\u91CD\u65B0\u8BFB\u53D6\u6570\u636E\u3002" })
    ] }),
    notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-data-storage__notice", role: "status", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: notice }),
      notice.includes("\u5FC5\u987B\u91CD\u542F") || notice.includes("\u9700\u8981\u91CD\u542F") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", disabled: busy, onClick: restart, children: "\u7ACB\u5373\u91CD\u542F" }) : null
    ] }) : null,
    error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-data-storage__error", role: "alert", children: [
      error,
      error.includes("\u76EE\u6807\u76EE\u5F55\u7F3A\u5C11\u5F53\u524D\u6570\u636E\u9879") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", disabled: busy || !directory.trim(), onClick: mergeMissing, children: "\u5408\u5E76\u7F3A\u5931\u6570\u636E" }) : null
    ] }) : null,
    confirmCleanup ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "studio-data-storage__scrim", role: "presentation", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "studio-data-storage__dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "studio-data-cleanup-title", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { id: "studio-data-cleanup-title", children: "\u6E05\u9664\u65E7\u6570\u636E\u526F\u672C\uFF1F" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u8FD9\u4F1A\u6C38\u4E45\u5220\u9664 DSH_HOME \u4E2D\u4E3A\u8FC1\u79FB\u4FDD\u7559\u7684\u5197\u4F59\u526F\u672C\uFF0C\u4E0D\u4F1A\u5220\u9664\u65B0\u6570\u636E\u76EE\u5F55\u3001\u63D2\u4EF6\u914D\u7F6E\u6216 profile\u3002\u8BF7\u5148\u786E\u8BA4\u65B0\u76EE\u5F55\u4E2D\u7684\u6570\u636E\u53EF\u4EE5\u6B63\u5E38\u4F7F\u7528\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", disabled: busy, onClick: () => setConfirmCleanup(false), children: "\u6682\u65F6\u4FDD\u7559" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "is-danger", disabled: busy, onClick: () => void clear(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { size: 15 }),
          "\u786E\u8BA4\u6E05\u9664"
        ] })
      ] })
    ] }) }) : null
  ] });
}
function apply(ctx) {
  const remote = ctx.get("remote");
  const picker = remote?.directoryPicker ?? { pick: async () => ({ ok: false, error: "\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u9009\u62E9\u76EE\u5F55\uFF0C\u8BF7\u624B\u52A8\u8F93\u5165\u5B8C\u6574\u8DEF\u5F84\u3002" }) };
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = "studio-data-storage";
    style.textContent = `.studio-data-storage{max-width:900px;padding:28px;color:var(--dsw-alias-text-primary,#1c2433);font-family:inherit;font-size:14px;line-height:1.55}.studio-data-storage__intro{display:flex;gap:14px;align-items:flex-start;margin-bottom:24px;color:var(--dsw-alias-state-business-primary,#4778ec)}.studio-data-storage h2,.studio-data-storage h3,.studio-data-storage p{margin:0}.studio-data-storage h2{font-size:20px;color:var(--dsw-alias-text-primary,#1c2433)}.studio-data-storage__intro p,.studio-data-storage__card>p{margin-top:7px;color:var(--dsw-alias-text-secondary,#6b7890)}.studio-data-storage__card{padding:20px;margin:14px 0;border:1px solid var(--dsw-alias-border-primary,#dce2eb);border-radius:14px;background:var(--dsw-alias-bg-base,#fff)}.studio-data-storage__card h3{font-size:16px}.studio-data-storage code{overflow-wrap:anywhere;color:var(--dsw-alias-text-secondary,#61718b)}.studio-data-storage__field,.studio-data-storage__actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px}.studio-data-storage input[aria-label="\u6570\u636E\u76EE\u5F55"]{flex:1;min-width:100px;height:38px;padding:0 12px;border:1px solid var(--dsw-alias-border-primary,#d2dae6);border-radius:9px;background:var(--dsw-alias-bg-subtle,#f8fafc);color:inherit}.studio-data-storage button,.studio-data-storage__upload{display:inline-flex;gap:7px;align-items:center;justify-content:center;min-height:36px;padding:0 12px;border:1px solid var(--dsw-alias-border-primary,#d2dae6);border-radius:9px;background:var(--dsw-alias-bg-base,#fff);color:inherit;font:inherit;cursor:pointer}.studio-data-storage button:disabled,.studio-data-storage__upload.is-disabled{opacity:.55;cursor:default}.studio-data-storage button.is-primary{background:var(--dsw-alias-state-business-primary,#4778ec);border-color:transparent;color:#fff}.studio-data-storage button.is-danger{color:#d92d20;border-color:#f0b3ae}.studio-data-storage__upload input{display:none}.studio-data-storage__hint{margin-top:10px!important;font-size:12px}.studio-data-storage__pending,.studio-data-storage__notice{display:flex;gap:12px;align-items:center;justify-content:space-between;margin-top:16px;padding:13px;border-radius:10px;background:var(--dsw-alias-bg-subtle,#f4f7fb)}.studio-data-storage__pending div{display:grid;gap:4px}.studio-data-storage__pending span{font-size:12px;color:var(--dsw-alias-text-secondary,#6b7890)}.studio-data-storage__notice{justify-content:flex-start;color:#167a52}.studio-data-storage__notice button{margin-left:auto}.studio-data-storage__error{display:flex;gap:12px;align-items:center;justify-content:space-between;margin-top:12px;color:#c8332b}.studio-data-storage__error button{flex:none;border-color:#e4a6a1;color:#a62922}.studio-data-storage__scrim{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:20px;background:#10182766;backdrop-filter:blur(3px)}.studio-data-storage__dialog{width:min(480px,100%);padding:22px;border-radius:16px;background:var(--dsw-alias-bg-base,#fff);box-shadow:0 24px 80px #10182740}.studio-data-storage__dialog h3{font-size:18px}.studio-data-storage__dialog p{margin:10px 0 20px;color:var(--dsw-alias-text-secondary,#6b7890)}.studio-data-storage__dialog>div{display:flex;justify-content:flex-end;gap:8px}`;
    document.head.append(style);
    return () => style.remove();
  }, "dsh data storage: styles");
  ctx.inject(["slots"], (child) => {
    const slots = child.get("slots");
    const View = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataStorageSettings, { picker });
    child.effect(() => slots.inject("plugins.bundle.config", () => slots.register({ name: "plugins.bundle.config", key: "@agent-studio/plugin-data-storage" }, View)), "dsh data storage: settings");
  });
}
var inject = ["remote", "remote.directoryPicker"];
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
lucide-react/dist/esm/icons/archive.mjs:
lucide-react/dist/esm/icons/check.mjs:
lucide-react/dist/esm/icons/folder-open.mjs:
lucide-react/dist/esm/icons/hard-drive.mjs:
lucide-react/dist/esm/icons/rotate-ccw.mjs:
lucide-react/dist/esm/icons/trash.mjs:
lucide-react/dist/esm/lucide-react.mjs:
  (**
   * @license lucide-react v1.65.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
return module.exports;}});
