window.__ModuleLoader__.load({id:"@agent-studio/plugin-opencode-provider",factory:(require)=>{var module={exports:{}};var exports=module.exports;
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

// apps/dsh/src/client-opencode-provider.tsx
var client_opencode_provider_exports = {};
__export(client_opencode_provider_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_opencode_provider_exports);

// apps/web/src/components/models/ProviderSettings.tsx
var import_react9 = require("react");

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

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs
var __iconData = {
  name: "arrow-right",
  size: 24,
  node: [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
  ]
};
__iconData.node;
var ArrowRight = createLucideIcon(__iconData);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/boxes.mjs
var __iconData2 = {
  name: "boxes",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
        key: "lc1i9w"
      }
    ],
    ["path", { d: "m7 16.5-4.74-2.85", key: "1o9zyk" }],
    ["path", { d: "m7 16.5 5-3", key: "va8pkn" }],
    ["path", { d: "M7 16.5v5.17", key: "jnp8gn" }],
    [
      "path",
      {
        d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
        key: "8zsnat"
      }
    ],
    ["path", { d: "m17 16.5-5-3", key: "8arw3v" }],
    ["path", { d: "m17 16.5 4.74-2.85", key: "8rfmw" }],
    ["path", { d: "M17 16.5v5.17", key: "k6z78m" }],
    [
      "path",
      {
        d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
        key: "1xygjf"
      }
    ],
    ["path", { d: "M12 8 7.26 5.15", key: "1vbdud" }],
    ["path", { d: "m12 8 4.74-2.85", key: "3rx089" }],
    ["path", { d: "M12 13.5V8", key: "1io7kd" }]
  ]
};
__iconData2.node;
var Boxes = createLucideIcon(__iconData2);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/check.mjs
var __iconData3 = {
  name: "check",
  size: 24,
  node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]
};
__iconData3.node;
var Check = createLucideIcon(__iconData3);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/circle-check.mjs
var __iconData4 = {
  name: "circle-check",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m16 9-5.5 5.5L8 12", key: "xofnsj" }]
  ],
  aliases: ["check-circle-2"]
};
__iconData4.node;
var CircleCheck = createLucideIcon(__iconData4);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/cpu.mjs
var __iconData5 = {
  name: "cpu",
  size: 24,
  node: [
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M17 20v2", key: "1rnc9c" }],
    ["path", { d: "M17 2v2", key: "11trls" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M2 17h2", key: "7oei6x" }],
    ["path", { d: "M2 7h2", key: "asdhe0" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "M20 17h2", key: "1fpfkl" }],
    ["path", { d: "M20 7h2", key: "1o8tra" }],
    ["path", { d: "M7 20v2", key: "4gnj0m" }],
    ["path", { d: "M7 2v2", key: "1i4yhu" }],
    ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2", key: "1vbyd7" }],
    ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "1", key: "z9xiuo" }]
  ]
};
__iconData5.node;
var Cpu = createLucideIcon(__iconData5);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/download.mjs
var __iconData6 = {
  name: "download",
  size: 24,
  node: [
    ["path", { d: "M12 15V3", key: "m9g1x1" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
    ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
  ]
};
__iconData6.node;
var Download = createLucideIcon(__iconData6);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/earth.mjs
var __iconData7 = {
  name: "earth",
  size: 24,
  node: [
    ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54", key: "1djwo0" }],
    [
      "path",
      {
        d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
        key: "1tzkfa"
      }
    ],
    [
      "path",
      { d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05", key: "14pb5j" }
    ],
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
  ],
  aliases: ["globe-2"]
};
__iconData7.node;
var Earth = createLucideIcon(__iconData7);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/external-link.mjs
var __iconData8 = {
  name: "external-link",
  size: 24,
  node: [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
  ]
};
__iconData8.node;
var ExternalLink = createLucideIcon(__iconData8);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/key-round.mjs
var __iconData9 = {
  name: "key-round",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
        key: "1s6t7t"
      }
    ],
    ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
  ]
};
__iconData9.node;
var KeyRound = createLucideIcon(__iconData9);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs
var __iconData10 = {
  name: "loader-circle",
  size: 24,
  node: [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]],
  aliases: ["loader-2"]
};
__iconData10.node;
var LoaderCircle = createLucideIcon(__iconData10);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/plus.mjs
var __iconData11 = {
  name: "plus",
  size: 24,
  node: [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }]
  ]
};
__iconData11.node;
var Plus = createLucideIcon(__iconData11);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/power.mjs
var __iconData12 = {
  name: "power",
  size: 24,
  node: [
    ["path", { d: "M12 2v10", key: "mnfbl" }],
    ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
  ]
};
__iconData12.node;
var Power = createLucideIcon(__iconData12);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs
var __iconData13 = {
  name: "refresh-cw",
  size: 24,
  node: [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
    ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
    ["path", { d: "M8 16H3v5", key: "1cv678" }]
  ]
};
__iconData13.node;
var RefreshCw = createLucideIcon(__iconData13);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/save.mjs
var __iconData14 = {
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
__iconData14.node;
var Save = createLucideIcon(__iconData14);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/search.mjs
var __iconData15 = {
  name: "search",
  size: 24,
  node: [
    ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
  ]
};
__iconData15.node;
var Search = createLucideIcon(__iconData15);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/settings-2.mjs
var __iconData16 = {
  name: "settings-2",
  size: 24,
  node: [
    ["path", { d: "M14 17H5", key: "gfn3mx" }],
    ["path", { d: "M19 7h-9", key: "6i9tg" }],
    ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
    ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
  ]
};
__iconData16.node;
var Settings2 = createLucideIcon(__iconData16);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/trash.mjs
var __iconData17 = {
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
__iconData17.node;
var Trash = createLucideIcon(__iconData17);

// node_modules/.pnpm/lucide-react@1.65.0_@types+react@19.3.0_react@19.3.1/node_modules/lucide-react/dist/esm/icons/x.mjs
var __iconData18 = {
  name: "x",
  size: 24,
  node: [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ]
};
__iconData18.node;
var X = createLucideIcon(__iconData18);

// apps/dsh/src/provider-ui.tsx
var import_react4 = require("react");

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

// apps/dsh/src/provider-ui.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function Button({ variant = "secondary", size = "md", className = "", ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { ...props, className: `studio-native-button is-${variant} size-${size} ${className}` });
}
function Input({ className = "", ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { ...props, className: `studio-native-control ${className}` });
}
function Select({ className = "", ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("select", { ...props, className: `studio-native-control ${className}` });
}
function Switch({ checked, onCheckedChange, disabled, label }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PluginSwitch, { label: label ?? "\u542F\u7528", checked, disabled, onChange: () => onCheckedChange(!checked) });
}
function Badge({ children, tone = "neutral", className = "" }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `studio-native-badge tone-${tone} ${className}`, children });
}
function Spinner() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "studio-native-spinner", role: "status", "aria-label": "\u6B63\u5728\u52A0\u8F7D" });
}
function EmptyState({ title, description }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "studio-native-empty", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: title }),
    description && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: description })
  ] });
}
function Modal({ open, onClose, title, description, children, footer, wide }) {
  const ref = (0, import_react4.useRef)(null), titleId = (0, import_react4.useId)();
  (0, import_react4.useEffect)(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "dialog",
    {
      ref,
      className: `studio-native-providers studio-native-provider-dialog${wide ? " is-wide" : ""}`,
      "aria-labelledby": titleId,
      "data-shortcut-modal": "provider-settings",
      onCancel: (event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      },
      onKeyDown: (event) => {
        if (event.key === "Escape") event.stopPropagation();
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("header", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { id: titleId, children: title }),
            description && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: description })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Button, { size: "icon", variant: "ghost", "aria-label": "\u5173\u95ED", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(X, { size: 16 }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "studio-native-provider-dialog__body", children }),
        footer && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("footer", { children: footer })
      ]
    }
  );
}

// node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

// node_modules/.pnpm/tailwind-merge@3.7.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs
var concatArrays = (array1, array2) => {
  const combinedArray = new Array(array1.length + array2.length);
  for (let i = 0; i < array1.length; i++) {
    combinedArray[i] = array1[i];
  }
  for (let i = 0; i < array2.length; i++) {
    combinedArray[array1.length + i] = array2[i];
  }
  return combinedArray;
};
var createClassValidatorObject = (classGroupId, validator) => ({
  classGroupId,
  validator
});
var createClassPartObject = (nextPart = /* @__PURE__ */ new Map(), validators = null, classGroupId) => ({
  nextPart,
  validators,
  classGroupId
});
var CLASS_PART_SEPARATOR = "-";
var EMPTY_CONFLICTS = [];
var ARBITRARY_PROPERTY_PREFIX = "arbitrary..";
var createClassGroupUtils = (config) => {
  const classMap = createClassMap(config);
  const {
    conflictingClassGroups,
    conflictingClassGroupModifiers
  } = config;
  const getClassGroupId = (className) => {
    if (className.startsWith("[") && className.endsWith("]")) {
      return getGroupIdForArbitraryProperty(className);
    }
    const classParts = className.split(CLASS_PART_SEPARATOR);
    const startIndex = classParts[0] === "" && classParts.length > 1 ? 1 : 0;
    return getGroupRecursive(classParts, startIndex, classMap);
  };
  const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
    if (hasPostfixModifier) {
      const modifierConflicts = conflictingClassGroupModifiers[classGroupId];
      const baseConflicts = conflictingClassGroups[classGroupId];
      if (modifierConflicts) {
        if (baseConflicts) {
          return concatArrays(baseConflicts, modifierConflicts);
        }
        return modifierConflicts;
      }
      return baseConflicts || EMPTY_CONFLICTS;
    }
    return conflictingClassGroups[classGroupId] || EMPTY_CONFLICTS;
  };
  return {
    getClassGroupId,
    getConflictingClassGroupIds
  };
};
var getGroupRecursive = (classParts, startIndex, classPartObject) => {
  const classPathsLength = classParts.length - startIndex;
  if (classPathsLength === 0) {
    return classPartObject.classGroupId;
  }
  const currentClassPart = classParts[startIndex];
  const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  if (nextClassPartObject) {
    const result = getGroupRecursive(classParts, startIndex + 1, nextClassPartObject);
    if (result) return result;
  }
  const validators = classPartObject.validators;
  if (validators === null) {
    return void 0;
  }
  const classRest = startIndex === 0 ? classParts.join(CLASS_PART_SEPARATOR) : classParts.slice(startIndex).join(CLASS_PART_SEPARATOR);
  const validatorsLength = validators.length;
  for (let i = 0; i < validatorsLength; i++) {
    const validatorObj = validators[i];
    if (validatorObj.validator(classRest)) {
      return validatorObj.classGroupId;
    }
  }
  return void 0;
};
var getGroupIdForArbitraryProperty = (className) => className.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const content = className.slice(1, -1);
  const colonIndex = content.indexOf(":");
  const property = content.slice(0, colonIndex);
  return property ? ARBITRARY_PROPERTY_PREFIX + property : void 0;
})();
var createClassMap = (config) => {
  const {
    theme,
    classGroups
  } = config;
  return processClassGroups(classGroups, theme);
};
var processClassGroups = (classGroups, theme) => {
  const classMap = createClassPartObject();
  for (const classGroupId in classGroups) {
    const group = classGroups[classGroupId];
    processClassesRecursively(group, classMap, classGroupId, theme);
  }
  return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
  const len = classGroup.length;
  for (let i = 0; i < len; i++) {
    const classDefinition = classGroup[i];
    processClassDefinition(classDefinition, classPartObject, classGroupId, theme);
  }
};
var processClassDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
  if (typeof classDefinition === "string") {
    processStringDefinition(classDefinition, classPartObject, classGroupId);
    return;
  }
  if (typeof classDefinition === "function") {
    processFunctionDefinition(classDefinition, classPartObject, classGroupId, theme);
    return;
  }
  processObjectDefinition(classDefinition, classPartObject, classGroupId, theme);
};
var processStringDefinition = (classDefinition, classPartObject, classGroupId) => {
  const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
  classPartObjectToEdit.classGroupId = classGroupId;
};
var processFunctionDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
  if (isThemeGetter(classDefinition)) {
    processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
    return;
  }
  if (classPartObject.validators === null) {
    classPartObject.validators = [];
  }
  classPartObject.validators.push(createClassValidatorObject(classGroupId, classDefinition));
};
var processObjectDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
  const entries = Object.entries(classDefinition);
  const len = entries.length;
  for (let i = 0; i < len; i++) {
    const [key, value] = entries[i];
    processClassesRecursively(value, getPart(classPartObject, key), classGroupId, theme);
  }
};
var getPart = (classPartObject, path) => {
  let current = classPartObject;
  const parts = path.split(CLASS_PART_SEPARATOR);
  const len = parts.length;
  for (let i = 0; i < len; i++) {
    const part = parts[i];
    let next = current.nextPart.get(part);
    if (!next) {
      next = createClassPartObject();
      current.nextPart.set(part, next);
    }
    current = next;
  }
  return current;
};
var isThemeGetter = (func) => "isThemeGetter" in func && func.isThemeGetter === true;
var createLruCache = (maxCacheSize) => {
  if (maxCacheSize < 1) {
    return {
      get: () => void 0,
      set: () => {
      }
    };
  }
  let cacheSize = 0;
  let cache = /* @__PURE__ */ Object.create(null);
  let previousCache = /* @__PURE__ */ Object.create(null);
  const update = (key, value) => {
    cache[key] = value;
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = /* @__PURE__ */ Object.create(null);
    }
  };
  return {
    get(key) {
      let value = cache[key];
      if (value !== void 0) {
        return value;
      }
      if ((value = previousCache[key]) !== void 0) {
        update(key, value);
        return value;
      }
    },
    set(key, value) {
      if (key in cache) {
        cache[key] = value;
      } else {
        update(key, value);
      }
    }
  };
};
var IMPORTANT_MODIFIER = "!";
var MODIFIER_SEPARATOR = ":";
var EMPTY_MODIFIERS = [];
var createResultObject = (modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition, isExternal) => ({
  modifiers,
  hasImportantModifier,
  baseClassName,
  maybePostfixModifierPosition,
  isExternal
});
var createParseClassName = (config) => {
  const {
    prefix,
    experimentalParseClassName
  } = config;
  let parseClassName = (className) => {
    const modifiers = [];
    let bracketDepth = 0;
    let parenDepth = 0;
    let modifierStart = 0;
    let postfixModifierPosition;
    const len = className.length;
    for (let index = 0; index < len; index++) {
      const currentCharacter = className[index];
      if (bracketDepth === 0 && parenDepth === 0) {
        if (currentCharacter === MODIFIER_SEPARATOR) {
          modifiers.push(className.slice(modifierStart, index));
          modifierStart = index + 1;
          continue;
        }
        if (currentCharacter === "/") {
          postfixModifierPosition = index;
          continue;
        }
      }
      if (currentCharacter === "[") bracketDepth++;
      else if (currentCharacter === "]") bracketDepth--;
      else if (currentCharacter === "(") parenDepth++;
      else if (currentCharacter === ")") parenDepth--;
    }
    const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.slice(modifierStart);
    let baseClassName = baseClassNameWithImportantModifier;
    let hasImportantModifier = false;
    if (baseClassNameWithImportantModifier.endsWith(IMPORTANT_MODIFIER)) {
      baseClassName = baseClassNameWithImportantModifier.slice(0, -1);
      hasImportantModifier = true;
    } else if (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER)
    ) {
      baseClassName = baseClassNameWithImportantModifier.slice(1);
      hasImportantModifier = true;
    }
    const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
    return createResultObject(modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition);
  };
  if (prefix) {
    const fullPrefix = prefix + MODIFIER_SEPARATOR;
    const parseClassNameOriginal = parseClassName;
    parseClassName = (className) => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.slice(fullPrefix.length)) : createResultObject(EMPTY_MODIFIERS, false, className, void 0, true);
  }
  if (experimentalParseClassName) {
    const parseClassNameOriginal = parseClassName;
    parseClassName = (className) => experimentalParseClassName({
      className,
      parseClassName: parseClassNameOriginal
    });
  }
  return parseClassName;
};
var createSortModifiers = (config) => {
  const modifierWeights = /* @__PURE__ */ new Map();
  config.orderSensitiveModifiers.forEach((mod, index) => {
    modifierWeights.set(mod, 1e6 + index);
  });
  return (modifiers) => {
    const result = [];
    let currentSegment = [];
    for (let i = 0; i < modifiers.length; i++) {
      const modifier = modifiers[i];
      const isArbitrary = modifier[0] === "[";
      const isOrderSensitive = modifierWeights.has(modifier);
      if (isArbitrary || isOrderSensitive) {
        if (currentSegment.length > 0) {
          currentSegment.sort();
          result.push(...currentSegment);
          currentSegment = [];
        }
        result.push(modifier);
      } else {
        currentSegment.push(modifier);
      }
    }
    if (currentSegment.length > 0) {
      currentSegment.sort();
      result.push(...currentSegment);
    }
    return result;
  };
};
var createConfigUtils = (config) => ({
  cache: createLruCache(config.cacheSize),
  parseClassName: createParseClassName(config),
  sortModifiers: createSortModifiers(config),
  postfixLookupClassGroupIds: createPostfixLookupClassGroupIds(config),
  ...createClassGroupUtils(config)
});
var createPostfixLookupClassGroupIds = (config) => {
  const lookup = /* @__PURE__ */ Object.create(null);
  const classGroupIds = config.postfixLookupClassGroups;
  if (classGroupIds) {
    for (let i = 0; i < classGroupIds.length; i++) {
      lookup[classGroupIds[i]] = true;
    }
  }
  return lookup;
};
var SPLIT_CLASSES_REGEX = /\s+/;
var mergeClassList = (classList, configUtils) => {
  const {
    parseClassName,
    getClassGroupId,
    getConflictingClassGroupIds,
    sortModifiers,
    postfixLookupClassGroupIds
  } = configUtils;
  const classGroupsInConflict = [];
  const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
  let result = "";
  for (let index = classNames.length - 1; index >= 0; index -= 1) {
    const originalClassName = classNames[index];
    const {
      isExternal,
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    } = parseClassName(originalClassName);
    if (isExternal) {
      result = originalClassName + (result.length > 0 ? " " + result : result);
      continue;
    }
    let hasPostfixModifier = !!maybePostfixModifierPosition;
    let classGroupId;
    if (hasPostfixModifier) {
      const baseClassNameWithoutPostfix = baseClassName.substring(0, maybePostfixModifierPosition);
      classGroupId = getClassGroupId(baseClassNameWithoutPostfix);
      const classGroupIdWithPostfix = classGroupId && postfixLookupClassGroupIds[classGroupId] ? getClassGroupId(baseClassName) : void 0;
      if (classGroupIdWithPostfix && classGroupIdWithPostfix !== classGroupId) {
        classGroupId = classGroupIdWithPostfix;
        hasPostfixModifier = false;
      }
    } else {
      classGroupId = getClassGroupId(baseClassName);
    }
    if (!classGroupId) {
      if (!hasPostfixModifier) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      hasPostfixModifier = false;
    }
    const variantModifier = modifiers.length === 0 ? "" : modifiers.length === 1 ? modifiers[0] : sortModifiers(modifiers).join(":");
    const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    const classId = modifierId + classGroupId;
    if (classGroupsInConflict.indexOf(classId) > -1) {
      continue;
    }
    classGroupsInConflict.push(classId);
    const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
    for (let i = 0; i < conflictGroups.length; ++i) {
      const group = conflictGroups[i];
      classGroupsInConflict.push(modifierId + group);
    }
    result = originalClassName + (result.length > 0 ? " " + result : result);
  }
  return result;
};
var twJoin = (...classLists) => {
  let index = 0;
  let argument;
  let resolvedValue;
  let string = "";
  while (index < classLists.length) {
    if (argument = classLists[index++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
};
var toValue = (mix) => {
  if (typeof mix === "string") {
    return mix;
  }
  let resolvedValue;
  let string = "";
  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
};
var createTailwindMerge = (createConfigFirst, ...createConfigRest) => {
  let configUtils;
  let cacheGet;
  let cacheSet;
  let functionToCall;
  const initTailwindMerge = (classList) => {
    const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  };
  const tailwindMerge = (classList) => {
    const cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    const result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  };
  functionToCall = initTailwindMerge;
  return (...args) => functionToCall(twJoin(...args));
};
var fallbackThemeArr = [];
var fromTheme = (key) => {
  const themeGetter = (theme) => theme[key] || fallbackThemeArr;
  themeGetter.isThemeGetter = true;
  themeGetter.themeKey = key;
  return themeGetter;
};
var arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
var arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
var fractionRegex = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var isFraction = (value) => fractionRegex.test(value);
var isNumber = (value) => !!value && !Number.isNaN(Number(value));
var isInteger = (value) => !!value && Number.isInteger(Number(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var isAny = () => true;
var isLengthOnly = (value) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
var isNamedContainerQuery = (value) => value.startsWith("@container") && (value[10] === "/" && value[11] !== void 0 || value[11] === "s" && value[16] !== void 0 && value.startsWith("-size/", 10) || value[11] === "n" && value[18] !== void 0 && value.startsWith("-normal/", 10));
var isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
var isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber);
var isArbitraryWeight = (value) => getIsArbitraryValue(value, isLabelWeight, isAny);
var isArbitraryFamilyName = (value) => getIsArbitraryValue(value, isLabelFamilyName, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
var isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
var isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
var isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
var isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
var isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
var isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
var isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
var isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
var isArbitraryVariableWeight = (value) => getIsArbitraryVariable(value, isLabelWeight, true);
var getIsArbitraryValue = (value, testLabel, testValue) => {
  const result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return testLabel(result[1]);
    }
    return testValue(result[2]);
  }
  return false;
};
var getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
  const result = arbitraryVariableRegex.exec(value);
  if (result) {
    if (result[1]) {
      return testLabel(result[1]);
    }
    return shouldMatchNoLabel;
  }
  return false;
};
var isLabelPosition = (label) => label === "position" || label === "percentage";
var isLabelImage = (label) => label === "image" || label === "url";
var isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
var isLabelLength = (label) => label === "length";
var isLabelNumber = (label) => label === "number";
var isLabelFamilyName = (label) => label === "family-name";
var isLabelWeight = (label) => label === "number" || label === "weight";
var isLabelShadow = (label) => label === "shadow";
var getDefaultConfig = () => {
  const themeColor = fromTheme("color");
  const themeFont = fromTheme("font");
  const themeText = fromTheme("text");
  const themeFontWeight = fromTheme("font-weight");
  const themeTracking = fromTheme("tracking");
  const themeLeading = fromTheme("leading");
  const themeBreakpoint = fromTheme("breakpoint");
  const themeContainer = fromTheme("container");
  const themeSpacing = fromTheme("spacing");
  const themeRadius = fromTheme("radius");
  const themeShadow = fromTheme("shadow");
  const themeInsetShadow = fromTheme("inset-shadow");
  const themeTextShadow = fromTheme("text-shadow");
  const themeDropShadow = fromTheme("drop-shadow");
  const themeBlur = fromTheme("blur");
  const themePerspective = fromTheme("perspective");
  const themeAspect = fromTheme("aspect");
  const themeEase = fromTheme("ease");
  const themeAnimate = fromTheme("animate");
  const scaleBreak = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
  const scalePosition = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ];
  const scalePositionWithArbitrary = () => [...scalePosition(), isArbitraryVariable, isArbitraryValue];
  const scaleOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
  const scaleOverscroll = () => ["auto", "contain", "none"];
  const scaleUnambiguousSpacing = () => [isArbitraryVariable, isArbitraryValue, themeSpacing];
  const scaleInset = () => [isFraction, "full", "auto", ...scaleUnambiguousSpacing()];
  const scaleGridTemplateColsRows = () => [isInteger, "none", "subgrid", isArbitraryVariable, isArbitraryValue];
  const scaleGridColRowStartAndEnd = () => ["auto", {
    span: ["full", isInteger, isArbitraryVariable, isArbitraryValue]
  }, isInteger, isArbitraryVariable, isArbitraryValue];
  const scaleGridColRowStartOrEnd = () => [isInteger, "auto", isArbitraryVariable, isArbitraryValue];
  const scaleGridAutoColsRows = () => ["auto", "min", "max", "fr", isArbitraryVariable, isArbitraryValue];
  const scaleAlignPrimaryAxis = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"];
  const scaleAlignSecondaryAxis = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"];
  const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
  const scaleSizing = () => [isFraction, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...scaleUnambiguousSpacing()];
  const scaleSizingInline = () => [themeContainer, isFraction, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...scaleUnambiguousSpacing()];
  const scaleSizingBlock = () => [isFraction, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...scaleUnambiguousSpacing()];
  const scaleColor = () => [themeColor, isArbitraryVariable, isArbitraryValue];
  const scaleBgPosition = () => [...scalePosition(), isArbitraryVariablePosition, isArbitraryPosition, {
    position: [isArbitraryVariable, isArbitraryValue]
  }];
  const scaleBgRepeat = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }];
  const scaleBgSize = () => ["auto", "cover", "contain", isArbitraryVariableSize, isArbitrarySize, {
    size: [isArbitraryVariable, isArbitraryValue]
  }];
  const scaleGradientStopPosition = () => [isPercent, isArbitraryVariableLength, isArbitraryLength];
  const scaleRadius = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    themeRadius,
    isArbitraryVariable,
    isArbitraryValue
  ];
  const scaleBorderWidth = () => ["", isNumber, isArbitraryVariableLength, isArbitraryLength];
  const scaleLineStyle = () => ["solid", "dashed", "dotted", "double"];
  const scaleBlendMode = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
  const scaleMaskImagePosition = () => [isNumber, isPercent, isArbitraryVariablePosition, isArbitraryPosition];
  const scaleBlur = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    themeBlur,
    isArbitraryVariable,
    isArbitraryValue
  ];
  const scaleRotate = () => ["none", isNumber, isArbitraryVariable, isArbitraryValue];
  const scaleScale = () => ["none", isNumber, isArbitraryVariable, isArbitraryValue];
  const scaleSkew = () => [isNumber, isArbitraryVariable, isArbitraryValue];
  const scaleTranslate = () => [isFraction, "full", ...scaleUnambiguousSpacing()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [isTshirtSize],
      breakpoint: [isTshirtSize],
      color: [isAny],
      container: [isTshirtSize],
      "drop-shadow": [isTshirtSize],
      ease: ["in", "out", "in-out"],
      font: [isAnyNonArbitrary],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [isTshirtSize],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [isTshirtSize],
      shadow: [isTshirtSize],
      spacing: ["px", isNumber],
      text: [isTshirtSize],
      "text-shadow": [isTshirtSize],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", isFraction, isArbitraryValue, isArbitraryVariable, themeAspect]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Container Type
       * @see https://tailwindcss.com/docs/responsive-design#container-queries
       */
      "container-type": [{
        "@container": ["", "normal", "size", isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [isNamedContainerQuery],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isNumber, "auto", isArbitraryValue, isArbitraryVariable, themeContainer]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": scaleBreak()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": scaleBreak()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: scalePositionWithArbitrary()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: scaleOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": scaleOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": scaleOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: scaleOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": scaleOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": scaleOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: scaleInset()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": scaleInset()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": scaleInset()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": scaleInset(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: scaleInset()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": scaleInset(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: scaleInset()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": scaleInset()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": scaleInset()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: scaleInset()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: scaleInset()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: scaleInset()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: scaleInset()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [isInteger, "auto", isArbitraryVariable, isArbitraryValue]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [isFraction, "full", "auto", themeContainer, ...scaleUnambiguousSpacing()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [isNumber, isFraction, "auto", "initial", "none", isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [isInteger, "first", "last", "none", isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": scaleGridTemplateColsRows()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: scaleGridColRowStartAndEnd()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": scaleGridTemplateColsRows()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: scaleGridColRowStartAndEnd()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": scaleGridAutoColsRows()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": scaleGridAutoColsRows()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: scaleUnambiguousSpacing()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": scaleUnambiguousSpacing()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": scaleUnambiguousSpacing()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...scaleAlignPrimaryAxis(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...scaleAlignSecondaryAxis(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...scaleAlignSecondaryAxis()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...scaleAlignPrimaryAxis()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...scaleAlignSecondaryAxis(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...scaleAlignSecondaryAxis(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": scaleAlignPrimaryAxis()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...scaleAlignSecondaryAxis(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...scaleAlignSecondaryAxis()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: scaleUnambiguousSpacing()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: scaleMargin()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: scaleMargin()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: scaleMargin()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: scaleMargin()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: scaleMargin()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: scaleMargin()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: scaleMargin()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: scaleMargin()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: scaleMargin()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: scaleMargin()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: scaleMargin()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": scaleUnambiguousSpacing()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": scaleUnambiguousSpacing()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: scaleSizing()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/inline-size
       */
      "inline-size": [{
        inline: ["auto", ...scaleSizingInline()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-inline-size
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...scaleSizingInline()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-inline-size
       */
      "max-inline-size": [{
        "max-inline": ["none", ...scaleSizingInline()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/block-size
       */
      "block-size": [{
        block: ["auto", ...scaleSizingBlock()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-block-size
       */
      "min-block-size": [{
        "min-block": ["auto", ...scaleSizingBlock()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-block-size
       */
      "max-block-size": [{
        "max-block": ["none", ...scaleSizingBlock()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [themeContainer, "screen", ...scaleSizing()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          themeContainer,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...scaleSizing()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          themeContainer,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [themeBreakpoint]
          },
          ...scaleSizing()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...scaleSizing()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...scaleSizing()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", "none", ...scaleSizing()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", themeText, isArbitraryVariableLength, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [themeFontWeight, isArbitraryVariableWeight, isArbitraryWeight]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", isPercent, isArbitraryValue]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [isArbitraryVariableFamilyName, isArbitraryFamilyName, themeFont]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [isArbitraryValue]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [themeTracking, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [isNumber, "none", isArbitraryVariable, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          themeLeading,
          ...scaleUnambiguousSpacing()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: scaleColor()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: scaleColor()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...scaleLineStyle(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [isNumber, "from-font", "auto", isArbitraryVariable, isArbitraryLength]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: scaleColor()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [isNumber, "auto", isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: scaleUnambiguousSpacing()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [isInteger, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", isArbitraryVariable, isArbitraryValue]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: scaleBgPosition()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: scaleBgRepeat()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: scaleBgSize()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, isInteger, isArbitraryVariable, isArbitraryValue],
          radial: ["", isArbitraryVariable, isArbitraryValue],
          conic: ["", isInteger, isArbitraryVariable, isArbitraryValue]
        }, isArbitraryVariableImage, isArbitraryImage]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: scaleColor()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: scaleGradientStopPosition()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: scaleGradientStopPosition()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: scaleGradientStopPosition()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: scaleColor()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: scaleColor()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: scaleColor()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: scaleRadius()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": scaleRadius()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": scaleRadius()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": scaleRadius()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": scaleRadius()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": scaleRadius()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": scaleRadius()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": scaleRadius()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": scaleRadius()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": scaleRadius()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": scaleRadius()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": scaleRadius()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": scaleRadius()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": scaleRadius()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": scaleRadius()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: scaleBorderWidth()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": scaleBorderWidth()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": scaleBorderWidth()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": scaleBorderWidth()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": scaleBorderWidth()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": scaleBorderWidth()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": scaleBorderWidth()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": scaleBorderWidth()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": scaleBorderWidth()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": scaleBorderWidth()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": scaleBorderWidth()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": scaleBorderWidth()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": scaleBorderWidth()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...scaleLineStyle(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...scaleLineStyle(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: scaleColor()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": scaleColor()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": scaleColor()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": scaleColor()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": scaleColor()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": scaleColor()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": scaleColor()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": scaleColor()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": scaleColor()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": scaleColor()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": scaleColor()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: scaleColor()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...scaleLineStyle(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", isNumber, isArbitraryVariableLength, isArbitraryLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: scaleColor()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          // Deprecated since Tailwind CSS v4.0.0
          "inner",
          "none",
          themeShadow,
          isArbitraryVariableShadow,
          isArbitraryShadow
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: scaleColor()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", themeInsetShadow, isArbitraryVariableShadow, isArbitraryShadow]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": scaleColor()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: scaleBorderWidth()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: scaleColor()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [isNumber, isArbitraryLength]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": scaleColor()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": scaleBorderWidth()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": scaleColor()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", themeTextShadow, isArbitraryVariableShadow, isArbitraryShadow]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": scaleColor()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...scaleBlendMode(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": scaleBlendMode()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [isNumber]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": scaleMaskImagePosition()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": scaleMaskImagePosition()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": scaleColor()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": scaleColor()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": scaleMaskImagePosition()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": scaleMaskImagePosition()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": scaleColor()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": scaleColor()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": scaleMaskImagePosition()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": scaleMaskImagePosition()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": scaleColor()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": scaleColor()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": scaleMaskImagePosition()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": scaleMaskImagePosition()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": scaleColor()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": scaleColor()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": scaleMaskImagePosition()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": scaleMaskImagePosition()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": scaleColor()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": scaleColor()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": scaleMaskImagePosition()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": scaleMaskImagePosition()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": scaleColor()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": scaleColor()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": scaleMaskImagePosition()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": scaleMaskImagePosition()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": scaleColor()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": scaleColor()
      }],
      "mask-image-radial": [{
        "mask-radial": [isArbitraryVariable, isArbitraryValue]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": scaleMaskImagePosition()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": scaleMaskImagePosition()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": scaleColor()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": scaleColor()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": scalePosition()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [isNumber]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": scaleMaskImagePosition()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": scaleMaskImagePosition()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": scaleColor()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": scaleColor()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: scaleBgPosition()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: scaleBgRepeat()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: scaleBgSize()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", isArbitraryVariable, isArbitraryValue]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          isArbitraryVariable,
          isArbitraryValue
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: scaleBlur()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          themeDropShadow,
          isArbitraryVariableShadow,
          isArbitraryShadow
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": scaleColor()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          isArbitraryVariable,
          isArbitraryValue
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": scaleBlur()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": scaleUnambiguousSpacing()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": scaleUnambiguousSpacing()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": scaleUnambiguousSpacing()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [isNumber, "initial", isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", themeEase, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", themeAnimate, isArbitraryVariable, isArbitraryValue]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [themePerspective, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": scalePositionWithArbitrary()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: scaleRotate()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": scaleRotate()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": scaleRotate()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": scaleRotate()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: scaleScale()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": scaleScale()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": scaleScale()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": scaleScale()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: scaleSkew()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": scaleSkew()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": scaleSkew()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [isArbitraryVariable, isArbitraryValue, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: scalePositionWithArbitrary()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: scaleTranslate()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": scaleTranslate()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": scaleTranslate()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": scaleTranslate()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      /**
       * Zoom
       * @see https://tailwindcss.com/docs/zoom
       */
      zoom: [{
        zoom: [isInteger, isArbitraryVariable, isArbitraryValue]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: scaleColor()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: scaleColor()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scrollbar Thumb Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-thumb-color": [{
        "scrollbar-thumb": scaleColor()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": scaleColor()
      }],
      /**
       * Scrollbar Gutter
       * @see https://tailwindcss.com/docs/scrollbar-gutter
       */
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      /**
       * Scrollbar Width
       * @see https://tailwindcss.com/docs/scrollbar-width
       */
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", isArbitraryVariable, isArbitraryValue]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...scaleColor()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [isNumber, isArbitraryVariableLength, isArbitraryLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...scaleColor()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      "container-named": ["container-type"],
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["start", "end", "right", "left"],
      "inset-y": ["inset-bs", "inset-be", "top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["ps", "pe", "pr", "pl"],
      py: ["pbs", "pbe", "pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["ms", "me", "mr", "ml"],
      my: ["mbs", "mbe", "mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-s", "border-w-e", "border-w-r", "border-w-l"],
      "border-w-y": ["border-w-bs", "border-w-be", "border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-s", "border-color-e", "border-color-r", "border-color-l"],
      "border-color-y": ["border-color-bs", "border-color-be", "border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-ms", "scroll-me", "scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-ps", "scroll-pe", "scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    postfixLookupClassGroups: ["container-type"],
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
};
var twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);

// apps/web/src/lib/utils.ts
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// node_modules/.pnpm/@opencode+client@2.2.5_effect@4.0.6_solid-js@1.9.15/node_modules/@opencode/client/dist/chunks/rpc-runtime-9rqn6x4v.js
var __defProp2 = Object.defineProperty;
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export2 = (target, all) => {
  for (var name in all)
    __defProp2(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};

// node_modules/.pnpm/@opencode+client@2.2.5_effect@4.0.6_solid-js@1.9.15/node_modules/@opencode/client/dist/chunks/rpc-runtime-gecjxyvt.js
var exports_shared_events = {};
__export2(exports_shared_events, {
  SharedEvents: () => exports_shared_events,
  make: () => make7
});
function make7(connect) {
  let current;
  const capacity = 4096;
  function stop(connection) {
    connection.connected = void 0;
    connection.controller.abort();
    if (current === connection)
      current = void 0;
  }
  async function run(connection) {
    let iterator;
    let completion = {};
    try {
      if (connection.controller.signal.aborted)
        return;
      iterator = connect(connection.controller.signal, () => {
        connection.subscribers.forEach((subscriber) => subscriber.activity?.());
      })[Symbol.asyncIterator]();
      while (!connection.controller.signal.aborted) {
        const item = await iterator.next();
        if (item.done || connection.controller.signal.aborted)
          break;
        if (item.value.type === "server.connected")
          connection.connected = item.value;
        connection.subscribers.forEach((subscriber) => subscriber.push(item.value));
      }
    } catch (error) {
      completion = { error };
    } finally {
      stop(connection);
      try {
        await iterator?.return?.();
      } catch (error) {
        if (!("error" in completion))
          completion = { error };
      }
      connection.subscribers.forEach((subscriber) => subscriber.finish(completion));
    }
  }
  return {
    subscribe(options) {
      return {
        [Symbol.asyncIterator]() {
          const pending = [];
          const queued = [];
          let started = false;
          let completion;
          let connection;
          const types = options?.types?.length ? new Set(options.types) : void 0;
          const selected = (value) => !types || value.type === "server.connected" || types.has(value.type);
          function finish(result, discard = true) {
            completion = result;
            if (discard)
              queued.length = 0;
            options?.signal?.removeEventListener("abort", abort);
            if (connection?.subscribers.delete(subscriber) && !connection.subscribers.size)
              stop(connection);
            pending.splice(0).forEach((request) => {
              if ("error" in result)
                request.reject(result.error);
              else
                request.resolve({ done: true, value: void 0 });
            });
          }
          function abort() {
            finish({});
          }
          const subscriber = {
            activity: options?.onActivity,
            finish(result) {
              finish(result, false);
            },
            push(value) {
              if (completion)
                return;
              if (!selected(value))
                return;
              const request = pending.shift();
              if (request) {
                request.resolve({ done: false, value });
                return;
              }
              if (queued.length === capacity) {
                finish({ error: new Error(`Event subscriber exceeded its ${capacity}-event capacity`) });
                return;
              }
              queued.push(value);
            }
          };
          function start() {
            if (completion)
              return;
            const fresh = !current;
            connection = current ?? {
              controller: new AbortController(),
              subscribers: /* @__PURE__ */ new Set()
            };
            current = connection;
            connection.subscribers.add(subscriber);
            if (connection.connected)
              subscriber.push(connection.connected);
            if (fresh)
              run(connection);
          }
          return {
            next() {
              const value = queued.shift();
              if (value)
                return Promise.resolve({ done: false, value });
              if (completion) {
                if ("error" in completion)
                  return Promise.reject(completion.error);
                return Promise.resolve({ done: true, value: void 0 });
              }
              if (options?.signal?.aborted) {
                abort();
                return Promise.resolve({ done: true, value: void 0 });
              }
              const request = Promise.withResolvers();
              pending.push(request);
              if (!started) {
                started = true;
                options?.signal?.addEventListener("abort", abort, { once: true });
                start();
              }
              return request.promise;
            },
            return() {
              finish({});
              return Promise.resolve({ done: true, value: void 0 });
            }
          };
        }
      };
    }
  };
}

// node_modules/.pnpm/@opencode+client@2.2.5_effect@4.0.6_solid-js@1.9.15/node_modules/@opencode/client/dist/chunks/rpc-runtime-js54wxgp.js
var ClientError2 = class extends Error {
  reason;
  name = "ClientError";
  constructor(reason, options) {
    const detail = options?.detail ?? (options?.cause instanceof Error ? options.cause.message : void 0);
    super(detail ? `${reason}: ${detail}` : reason, options);
    this.reason = reason;
  }
};

// node_modules/.pnpm/@opencode+client@2.2.5_effect@4.0.6_solid-js@1.9.15/node_modules/@opencode/client/dist/chunks/rpc-runtime-t2ajednw.js
var exports_client2 = {};
__export2(exports_client2, {
  make: () => make3
});
var maxSseEventBytes = 16 * 1024 * 1024;
function make3(options) {
  const fetch2 = options.fetch ?? globalThis.fetch;
  const prepare = (descriptor, requestOptions) => {
    const baseUrl = new URL(options.baseUrl);
    if (!baseUrl.pathname.endsWith("/"))
      baseUrl.pathname += "/";
    const url = new URL(descriptor.path.slice(1), baseUrl);
    for (const [key, value] of Object.entries(descriptor.query ?? {}))
      appendQuery(url.searchParams, key, value);
    const headers = new Headers(options.headers);
    for (const [key, value] of Object.entries(descriptor.headers ?? {})) {
      if (value !== void 0 && value !== null)
        headers.set(key, String(value));
    }
    for (const [key, value] of new Headers(requestOptions?.headers))
      headers.set(key, value);
    if (descriptor.body !== void 0 && !headers.has("content-type"))
      headers.set("content-type", descriptor.binaryBody ? "application/octet-stream" : "application/json");
    return {
      url,
      init: {
        method: descriptor.method,
        signal: requestOptions?.signal,
        headers,
        body: descriptor.body === void 0 ? void 0 : descriptor.binaryBody ? descriptor.body : JSON.stringify(descriptor.body)
      }
    };
  };
  const execute = async (descriptor, requestOptions) => {
    try {
      const prepared = prepare(descriptor, requestOptions);
      return await fetch2(prepared.url, prepared.init);
    } catch (cause) {
      throw new ClientError2("Transport", { cause });
    }
  };
  const responseError = async (response, descriptor) => {
    if (descriptor.declaredStatuses.includes(response.status))
      throw declared(await json(response));
    try {
      await response.body?.cancel();
    } catch {
    }
    throw new ClientError2("UnexpectedStatus", { cause: { status: response.status }, detail: String(response.status) });
  };
  const request = async (descriptor, requestOptions) => {
    const response = await execute(descriptor, requestOptions);
    if (response.status !== descriptor.successStatus)
      return responseError(response, descriptor);
    if (descriptor.binary)
      return new Uint8Array(await response.arrayBuffer());
    if (descriptor.empty) {
      try {
        await response.body?.cancel();
      } catch {
      }
      return;
    }
    return await json(response);
  };
  const sse = (descriptor, requestOptions) => ({
    async *[Symbol.asyncIterator]() {
      const response = await execute(descriptor, requestOptions);
      if (response.status !== descriptor.successStatus)
        await responseError(response, descriptor);
      if (!isContentType(response, "text/event-stream")) {
        try {
          await response.body?.cancel();
        } catch {
        }
        throw new ClientError2("UnsupportedContentType", { detail: response.headers.get("content-type") });
      }
      if (response.body === null)
        throw new ClientError2("MalformedResponse");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      try {
        while (true) {
          let next;
          try {
            next = await reader.read();
          } catch (cause) {
            throw new ClientError2("Transport", { cause });
          }
          if (!next.done)
            requestOptions?.onActivity?.();
          buffer += decoder.decode(next.value, { stream: !next.done });
          if (buffer.length > maxSseEventBytes)
            throw new ClientError2("SseEventTooLarge");
          const trailingCarriageReturn = !next.done && buffer.endsWith("\r");
          if (trailingCarriageReturn)
            buffer = buffer.slice(0, -1);
          buffer = buffer.replaceAll(`\r
`, `
`).replaceAll("\r", `
`);
          if (trailingCarriageReturn)
            buffer += "\r";
          if (next.done && buffer !== "")
            buffer += `

`;
          let boundary = buffer.indexOf(`

`);
          while (boundary >= 0) {
            const block = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);
            const data = block.split(`
`).flatMap((line) => line.startsWith("data:") ? [line.slice(5).trimStart()] : []).join(`
`);
            if (data !== "") {
              try {
                yield JSON.parse(data);
              } catch (cause) {
                throw new ClientError2("MalformedResponse", { cause });
              }
            }
            boundary = buffer.indexOf(`

`);
          }
          if (next.done)
            return;
        }
      } finally {
        try {
          await reader.cancel();
        } catch {
        }
        reader.releaseLock();
      }
    }
  });
  const client = {
    server: {
      info: (requestOptions) => request({ method: "GET", path: `/api/info`, successStatus: 200, declaredStatuses: [400, 401], empty: false }, requestOptions),
      pair: (requestOptions) => request({ method: "POST", path: `/api/pair`, successStatus: 200, declaredStatuses: [400, 401], empty: false }, requestOptions),
      connect: (input, requestOptions) => request({
        method: "GET",
        path: `/auth/connect/${encodeURIComponent(input.code)}`,
        successStatus: 200,
        declaredStatuses: [400, 401],
        empty: false
      }, requestOptions)
    },
    location: {
      get: (input, requestOptions) => request({
        method: "GET",
        path: `/api/location`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      reload: (requestOptions) => request({
        method: "POST",
        path: `/api/location/reload`,
        successStatus: 204,
        declaredStatuses: [400, 401, 503],
        empty: true
      }, requestOptions)
    },
    agent: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/agent`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 503],
        empty: false
      }, requestOptions),
      get: (input, requestOptions) => request({
        method: "GET",
        path: `/api/agent/${encodeURIComponent(input.agentID)}`,
        query: { location: input["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions)
    },
    plugin: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/plugin`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      gui: (input, requestOptions) => request({
        method: "GET",
        path: `/api/plugin/gui`,
        query: { location: input["location"], id: input["id"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      check: (input, requestOptions) => request({
        method: "POST",
        path: `/api/plugin/check`,
        query: { location: input?.["location"] },
        body: { target: input?.["target"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      update: (input, requestOptions) => request({
        method: "POST",
        path: `/api/plugin/update`,
        query: { location: input["location"] },
        body: { targets: input["targets"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404, 503],
        empty: true
      }, requestOptions)
    },
    session: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/session`,
        query: {
          limit: input?.["limit"],
          order: input?.["order"],
          search: input?.["search"],
          parentID: input?.["parentID"],
          archived: input?.["archived"],
          directory: input?.["directory"],
          project: input?.["project"],
          subpath: input?.["subpath"],
          cursor: input?.["cursor"]
        },
        successStatus: 200,
        declaredStatuses: [400, 401],
        empty: false
      }, requestOptions),
      create: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session`,
        body: {
          id: input?.["id"],
          parentID: input?.["parentID"],
          title: input?.["title"],
          agent: input?.["agent"],
          model: input?.["model"],
          location: input?.["location"],
          metadata: input?.["metadata"],
          permissions: input?.["permissions"]
        },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions).then((value) => value.data),
      active: (requestOptions) => request({
        method: "GET",
        path: `/api/session/active`,
        successStatus: 200,
        declaredStatuses: [400, 401],
        empty: false
      }, requestOptions).then((value) => value.data),
      get: (input, requestOptions) => request({
        method: "GET",
        path: `/api/session/${encodeURIComponent(input.sessionID)}`,
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions).then((value) => value.data),
      remove: (input, requestOptions) => request({
        method: "DELETE",
        path: `/api/session/${encodeURIComponent(input.sessionID)}`,
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions),
      fork: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/fork`,
        body: { before: input["before"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions).then((value) => value.data),
      switchAgent: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/agent`,
        body: { agent: input["agent"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions),
      switchModel: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/model`,
        body: { model: input["model"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions),
      update: (input, requestOptions) => request({
        method: "PATCH",
        path: `/api/session/${encodeURIComponent(input.sessionID)}`,
        body: {
          title: input["title"],
          metadata: input["metadata"],
          permissions: input["permissions"],
          archived: input["archived"]
        },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions),
      move: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/move`,
        body: { directory: input["directory"], delivery: input["delivery"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions),
      prompt: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/prompt`,
        body: {
          id: input["id"],
          text: input["text"],
          files: input["files"],
          agents: input["agents"],
          skills: input["skills"],
          metadata: input["metadata"],
          delivery: input["delivery"],
          resume: input["resume"]
        },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 409],
        empty: false
      }, requestOptions).then((value) => value.data),
      command: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/command`,
        body: {
          name: input["name"],
          text: input["text"],
          files: input["files"],
          agents: input["agents"],
          skills: input["skills"],
          delivery: input["delivery"]
        },
        successStatus: 204,
        declaredStatuses: [400, 401, 404, 500],
        empty: true
      }, requestOptions),
      synthetic: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/synthetic`,
        body: {
          id: input["id"],
          text: input["text"],
          description: input["description"],
          metadata: input["metadata"],
          delivery: input["delivery"],
          resume: input["resume"]
        },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 409],
        empty: false
      }, requestOptions).then((value) => value.data),
      shell: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/shell`,
        body: { id: input["id"], command: input["command"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions),
      compact: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/compact`,
        body: { id: input["id"], delivery: input["delivery"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 409],
        empty: false
      }, requestOptions).then((value) => value.data),
      revert: {
        stage: (input, requestOptions) => request({
          method: "POST",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/revert/stage`,
          body: { messageID: input["messageID"], files: input["files"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 409, 500],
          empty: false
        }, requestOptions).then((value) => value.data),
        clear: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/revert`,
          successStatus: 204,
          declaredStatuses: [400, 401, 404, 409, 500],
          empty: true
        }, requestOptions),
        commit: (input, requestOptions) => request({
          method: "POST",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/revert/commit`,
          successStatus: 204,
          declaredStatuses: [400, 401, 404, 409],
          empty: true
        }, requestOptions)
      },
      context: (input, requestOptions) => request({
        method: "GET",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/context`,
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 500],
        empty: false
      }, requestOptions).then((value) => value.data),
      diff: (input, requestOptions) => request({
        method: "GET",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/diff`,
        query: { from: input["from"], to: input["to"], context: input["context"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 500],
        empty: false
      }, requestOptions).then((value) => value.data),
      inbox: {
        list: (input, requestOptions) => request({
          method: "GET",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/inbox`,
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions).then((value) => value.data),
        cancel: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/inbox/${encodeURIComponent(input.inboxID)}`,
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions),
        update: (input, requestOptions) => request({
          method: "PATCH",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/inbox/${encodeURIComponent(input.inboxID)}`,
          body: { delivery: input["delivery"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404, 409],
          empty: true
        }, requestOptions)
      },
      generate: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/generate`,
        body: { prompt: input["prompt"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 503],
        empty: false
      }, requestOptions).then((value) => value.data),
      interrupt: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/interrupt`,
        query: { resume: input["resume"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      background: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/background`,
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions),
      message: {
        get: (input, requestOptions) => request({
          method: "GET",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/message/${encodeURIComponent(input.messageID)}`,
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions).then((value) => value.data)
      },
      form: {
        list: (input, requestOptions) => request({
          method: "GET",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/form`,
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions).then((value) => value.data),
        create: (input, requestOptions) => request({
          method: "POST",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/form`,
          body: { id: input["id"], title: input["title"], metadata: input["metadata"], fields: input["fields"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 409],
          empty: false
        }, requestOptions).then((value) => value.data),
        get: (input, requestOptions) => request({
          method: "GET",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/form/${encodeURIComponent(input.formID)}`,
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions).then((value) => value.data),
        reply: (input, requestOptions) => request({
          method: "POST",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/form/${encodeURIComponent(input.formID)}/reply`,
          body: { answer: input["answer"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404, 409],
          empty: true
        }, requestOptions),
        cancel: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/session/${encodeURIComponent(input.sessionID)}/form/${encodeURIComponent(input.formID)}`,
          query: { message: input["message"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404, 409],
          empty: true
        }, requestOptions)
      },
      environment: (input, requestOptions) => request({
        method: "PUT",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/environment`,
        body: { variables: input["variables"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions),
      view: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/view`,
        body: { idle: input["idle"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions)
    },
    experimental: {
      session: {
        stats: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/session/stats`,
          query: {
            from: input?.["from"],
            to: input?.["to"],
            project: input?.["project"],
            timezone: input?.["timezone"],
            tools: input?.["tools"]
          },
          successStatus: 200,
          declaredStatuses: [400, 401],
          empty: false
        }, requestOptions).then((value) => value.data),
        import: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/session/import`,
          body: { info: input["info"], messages: input["messages"], location: input["location"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 409],
          empty: false
        }, requestOptions).then((value) => value.data),
        export: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/export`,
          query: { sanitize: input["sanitize"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 500],
          empty: false
        }, requestOptions).then((value) => value.data),
        skill: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/skill`,
          body: { id: input["id"], resume: input["resume"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions),
        wait: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/wait`,
          successStatus: 204,
          declaredStatuses: [400, 401, 404, 503],
          empty: true
        }, requestOptions),
        instructions: {
          entry: {
            list: (input, requestOptions) => request({
              method: "GET",
              path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/instructions/entries`,
              successStatus: 200,
              declaredStatuses: [400, 401, 404],
              empty: false
            }, requestOptions).then((value) => value.data),
            put: (input, requestOptions) => request({
              method: "PUT",
              path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/instructions/entries/${encodeURIComponent(input.key)}`,
              body: { value: input["value"] },
              successStatus: 204,
              declaredStatuses: [400, 401, 404, 413],
              empty: true
            }, requestOptions),
            remove: (input, requestOptions) => request({
              method: "DELETE",
              path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/instructions/entries/${encodeURIComponent(input.key)}`,
              successStatus: 204,
              declaredStatuses: [400, 401, 404],
              empty: true
            }, requestOptions)
          }
        },
        log: (input, requestOptions) => sse({
          method: "GET",
          path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/log`,
          query: { after: input["after"], follow: input["follow"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions)
      },
      generate: {
        text: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/generate/text`,
          body: { prompt: input["prompt"], model: input["model"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 422, 502, 503],
          empty: false
        }, requestOptions).then((value) => value.data),
        image: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/generate/image`,
          body: {
            model: input["model"],
            prompt: input["prompt"],
            images: input["images"],
            n: input["n"],
            aspect: input["aspect"],
            resolution: input["resolution"]
          },
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 422, 502, 503],
          empty: false
        }, requestOptions).then((value) => value.data),
        decisions: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/generate/decisions`,
          body: { model: input["model"], input: input["input"], questions: input["questions"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 422, 502, 503],
          empty: false
        }, requestOptions).then((value) => value.data)
      },
      voice: {
        models: (requestOptions) => request({
          method: "GET",
          path: `/api/experimental/voice/models`,
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 503],
          empty: false
        }, requestOptions).then((value) => value.data),
        session: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/voice/session`,
          body: { model: input["model"], session: input["session"], transport: input["transport"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 503],
          empty: false
        }, requestOptions).then((value) => value.data)
      },
      integration: {
        wellknown: {
          add: (input, requestOptions) => request({
            method: "POST",
            path: `/api/experimental/integration/wellknown`,
            query: { location: input["location"] },
            body: { url: input["url"] },
            successStatus: 204,
            declaredStatuses: [400, 401, 404],
            empty: true
          }, requestOptions)
        }
      },
      mcp: {
        add: (input, requestOptions) => request({
          method: "PUT",
          path: `/api/experimental/mcp/${encodeURIComponent(input.server)}`,
          query: { location: input["location"] },
          body: { config: input["config"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions),
        remove: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/experimental/mcp/${encodeURIComponent(input.server)}`,
          query: { location: input["location"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions),
        connect: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/mcp/${encodeURIComponent(input.server)}/connect`,
          query: { location: input["location"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions),
        disconnect: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/mcp/${encodeURIComponent(input.server)}/disconnect`,
          query: { location: input["location"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions),
        client: {
          token: (input, requestOptions) => request({
            method: "POST",
            path: `/api/experimental/client-mcp/token`,
            query: { location: input["location"], name: input["name"] },
            headers: { "x-opencode-ticket": input["x-opencode-ticket"] },
            successStatus: 200,
            declaredStatuses: [400, 401, 403, 404],
            empty: false
          }, requestOptions)
        }
      },
      file: {
        write: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/fs/write`,
          query: { location: input["location"], path: input["path"] },
          body: input["payload"],
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false,
          binaryBody: true
        }, requestOptions),
        watch: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/fs/watch`,
          query: { location: input["location"] },
          body: { path: input["path"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404, 503],
          empty: true
        }, requestOptions),
        unwatch: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/experimental/fs/watch`,
          query: { location: input["location"] },
          body: { path: input["path"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions)
      },
      persistentPty: {
        read: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/terminal/read`,
          query: { lines: input["lines"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 503],
          empty: false
        }, requestOptions).then((value) => value.data),
        list: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/terminal`,
          successStatus: 200,
          declaredStatuses: [400, 401, 503],
          empty: false
        }, requestOptions).then((value) => value.data),
        create: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/session/${encodeURIComponent(input.sessionID)}/terminal`,
          body: {
            command: input["command"],
            args: input["args"],
            cwd: input["cwd"],
            title: input["title"],
            env: input["env"],
            size: input["size"]
          },
          successStatus: 200,
          declaredStatuses: [400, 401, 503],
          empty: false
        }, requestOptions).then((value) => value.data),
        shutdown: (requestOptions) => request({
          method: "POST",
          path: `/api/experimental/persistent-pty/shutdown`,
          successStatus: 204,
          declaredStatuses: [400, 401, 503],
          empty: true
        }, requestOptions),
        handoff: (requestOptions) => request({
          method: "POST",
          path: `/api/experimental/persistent-pty/handoff`,
          successStatus: 200,
          declaredStatuses: [400, 401, 503],
          empty: false
        }, requestOptions),
        get: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/persistent-pty/${encodeURIComponent(input.ptyID)}`,
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 503],
          empty: false
        }, requestOptions).then((value) => value.data),
        update: (input, requestOptions) => request({
          method: "PUT",
          path: `/api/experimental/persistent-pty/${encodeURIComponent(input.ptyID)}`,
          body: { attachmentID: input["attachmentID"], size: input["size"], title: input["title"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 501, 503],
          empty: false
        }, requestOptions).then((value) => value.data),
        snapshot: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/persistent-pty/${encodeURIComponent(input.ptyID)}/snapshot`,
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 503],
          empty: false
        }, requestOptions).then((value) => value.data),
        remove: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/experimental/persistent-pty/${encodeURIComponent(input.ptyID)}`,
          successStatus: 204,
          declaredStatuses: [400, 401, 404, 503],
          empty: true
        }, requestOptions),
        connectToken: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/persistent-pty/${encodeURIComponent(input.ptyID)}/connect-token`,
          headers: { "x-opencode-ticket": input["x-opencode-ticket"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404, 503],
          empty: false
        }, requestOptions).then((value) => value.data)
      },
      media: {
        get: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/media/${encodeURIComponent(input.hash)}`,
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false,
          binary: true
        }, requestOptions)
      },
      schedule: {
        create: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/schedule`,
          body: {
            sessionID: input["sessionID"],
            name: input["name"],
            when: input["when"],
            if: input["if"],
            until: input["until"],
            ends: input["ends"],
            prompt: input["prompt"]
          },
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404],
          empty: false
        }, requestOptions).then((value) => value.data),
        list: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/schedule`,
          query: { sessionID: input["sessionID"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404],
          empty: false
        }, requestOptions).then((value) => value.data),
        get: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/schedule/${encodeURIComponent(input.scheduleID)}`,
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404],
          empty: false
        }, requestOptions).then((value) => value.data),
        pause: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/schedule/${encodeURIComponent(input.scheduleID)}/pause`,
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404],
          empty: false
        }, requestOptions).then((value) => value.data),
        resume: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/schedule/${encodeURIComponent(input.scheduleID)}/resume`,
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404],
          empty: false
        }, requestOptions).then((value) => value.data),
        delete: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/experimental/schedule/${encodeURIComponent(input.scheduleID)}`,
          successStatus: 204,
          declaredStatuses: [400, 401, 403, 404],
          empty: true
        }, requestOptions)
      },
      artifacts: {
        providers: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/artifacts/providers`,
          query: { location: input?.["location"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404, 503],
          empty: false
        }, requestOptions),
        list: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/artifacts`,
          query: { location: input?.["location"], sessionID: input?.["sessionID"], provider: input?.["provider"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404, 503],
          empty: false
        }, requestOptions),
        create: (input, requestOptions) => request({
          method: "POST",
          path: `/api/experimental/artifacts`,
          query: { location: input["location"] },
          body: {
            title: input["title"],
            files: input["files"],
            entry: input["entry"],
            provider: input["provider"],
            sessionID: input["sessionID"]
          },
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404, 503],
          empty: false
        }, requestOptions),
        get: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/artifacts/${encodeURIComponent(input.artifactID)}`,
          query: { location: input["location"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404, 503],
          empty: false
        }, requestOptions),
        update: (input, requestOptions) => request({
          method: "PATCH",
          path: `/api/experimental/artifacts/${encodeURIComponent(input.artifactID)}`,
          query: { location: input["location"] },
          body: {
            title: input["title"],
            files: input["files"],
            entry: input["entry"],
            sessionID: input["sessionID"]
          },
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404, 503],
          empty: false
        }, requestOptions),
        delete: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/experimental/artifacts/${encodeURIComponent(input.artifactID)}`,
          query: { location: input["location"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 403, 404, 503],
          empty: true
        }, requestOptions),
        view: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/artifacts/${encodeURIComponent(input.artifactID)}/view/${encodePath(input.path)}`,
          query: { location: input["location"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404, 503],
          empty: false,
          binary: true
        }, requestOptions)
      },
      migration: {
        v1: {
          status: (requestOptions) => request({
            method: "GET",
            path: `/api/experimental/migration/v1`,
            successStatus: 200,
            declaredStatuses: [400, 401],
            empty: false
          }, requestOptions)
        }
      },
      usage: {
        limits: (input, requestOptions) => request({
          method: "GET",
          path: `/api/experimental/usage/limits`,
          query: { location: input?.["location"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 503],
          empty: false
        }, requestOptions)
      },
      config: {
        update: (input, requestOptions) => request({
          method: "PATCH",
          path: `/api/experimental/config`,
          body: { shell: input["shell"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions)
      }
    },
    message: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/message`,
        query: { limit: input["limit"], order: input["order"], cursor: input["cursor"], type: input["type"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 500],
        empty: false
      }, requestOptions)
    },
    model: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/model`,
        query: { location: input?.["location"], types: input?.["types"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 503],
        empty: false
      }, requestOptions),
      default: (input, requestOptions) => request({
        method: "GET",
        path: `/api/model/default`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 503],
        empty: false
      }, requestOptions)
    },
    provider: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/provider`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 503],
        empty: false
      }, requestOptions),
      get: (input, requestOptions) => request({
        method: "GET",
        path: `/api/provider/${encodeURIComponent(input.providerID)}`,
        query: { location: input["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 503],
        empty: false
      }, requestOptions)
    },
    integration: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/integration`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      get: (input, requestOptions) => request({
        method: "GET",
        path: `/api/integration/${encodeURIComponent(input.integrationID)}`,
        query: { location: input["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      connect: {
        key: (input, requestOptions) => request({
          method: "POST",
          path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/key`,
          query: { location: input["location"] },
          body: { key: input["key"], answer: input["answer"], label: input["label"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions),
        external: (input, requestOptions) => request({
          method: "POST",
          path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/external`,
          query: { location: input["location"] },
          body: { methodID: input["methodID"], answer: input["answer"], label: input["label"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions)
      },
      oauth: {
        connect: (input, requestOptions) => request({
          method: "POST",
          path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/oauth`,
          query: { location: input["location"] },
          body: { methodID: input["methodID"], answer: input["answer"], label: input["label"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions),
        status: (input, requestOptions) => request({
          method: "GET",
          path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/oauth/${encodeURIComponent(input.attemptID)}`,
          query: { location: input["location"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions),
        complete: (input, requestOptions) => request({
          method: "POST",
          path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/oauth/${encodeURIComponent(input.attemptID)}/complete`,
          query: { location: input["location"] },
          body: { code: input["code"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions),
        cancel: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/oauth/${encodeURIComponent(input.attemptID)}`,
          query: { location: input["location"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions)
      },
      command: {
        connect: (input, requestOptions) => request({
          method: "POST",
          path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/command`,
          query: { location: input["location"] },
          body: { methodID: input["methodID"], label: input["label"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions),
        status: (input, requestOptions) => request({
          method: "GET",
          path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/command/${encodeURIComponent(input.attemptID)}`,
          query: { location: input["location"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions),
        cancel: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/integration/${encodeURIComponent(input.integrationID)}/connect/command/${encodeURIComponent(input.attemptID)}`,
          query: { location: input["location"] },
          successStatus: 204,
          declaredStatuses: [400, 401, 404],
          empty: true
        }, requestOptions)
      }
    },
    mcp: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/mcp`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      resource: {
        catalog: (input, requestOptions) => request({
          method: "GET",
          path: `/api/mcp/resource`,
          query: { location: input?.["location"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions)
      }
    },
    credential: {
      list: (requestOptions) => request({ method: "GET", path: `/api/credential`, successStatus: 200, declaredStatuses: [400, 401], empty: false }, requestOptions).then((value) => value.data),
      create: (input, requestOptions) => request({
        method: "POST",
        path: `/api/credential`,
        body: {
          id: input["id"],
          integrationID: input["integrationID"],
          label: input["label"],
          value: input["value"],
          activate: input["activate"]
        },
        successStatus: 200,
        declaredStatuses: [400, 401, 409],
        empty: false
      }, requestOptions).then((value) => value.data),
      update: (input, requestOptions) => request({
        method: "PATCH",
        path: `/api/credential/${encodeURIComponent(input.credentialID)}`,
        body: { label: input["label"] },
        successStatus: 204,
        declaredStatuses: [400, 401],
        empty: true
      }, requestOptions),
      activate: (input, requestOptions) => request({
        method: "POST",
        path: `/api/credential/${encodeURIComponent(input.credentialID)}/activate`,
        successStatus: 204,
        declaredStatuses: [400, 401],
        empty: true
      }, requestOptions),
      remove: (input, requestOptions) => request({
        method: "DELETE",
        path: `/api/credential/${encodeURIComponent(input.credentialID)}`,
        successStatus: 204,
        declaredStatuses: [400, 401],
        empty: true
      }, requestOptions)
    },
    project: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/project`,
        query: { archived: input?.["archived"] },
        successStatus: 200,
        declaredStatuses: [400, 401],
        empty: false
      }, requestOptions),
      update: (input, requestOptions) => request({
        method: "PATCH",
        path: `/api/project/${encodeURIComponent(input.projectID)}`,
        body: {
          canonical: input["canonical"],
          name: input["name"],
          icon: input["icon"],
          commands: input["commands"]
        },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions)
    },
    form: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/form`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions)
    },
    permission: {
      request: {
        list: (input, requestOptions) => request({
          method: "GET",
          path: `/api/permission/request`,
          query: { location: input?.["location"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions)
      },
      saved: {
        list: (input, requestOptions) => request({
          method: "GET",
          path: `/api/permission/saved`,
          query: { projectID: input?.["projectID"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions).then((value) => value.data),
        update: (input, requestOptions) => request({
          method: "PATCH",
          path: `/api/permission/saved/${encodeURIComponent(input.id)}`,
          body: { action: input["action"], resource: input["resource"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404, 409],
          empty: false
        }, requestOptions).then((value) => value.data),
        remove: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/permission/saved/${encodeURIComponent(input.id)}`,
          successStatus: 204,
          declaredStatuses: [400, 401],
          empty: true
        }, requestOptions)
      },
      create: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/permission`,
        body: {
          id: input["id"],
          action: input["action"],
          resources: input["resources"],
          save: input["save"],
          metadata: input["metadata"],
          source: input["source"],
          agent: input["agent"]
        },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions).then((value) => value.data),
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/permission`,
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions).then((value) => value.data),
      get: (input, requestOptions) => request({
        method: "GET",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/permission/${encodeURIComponent(input.requestID)}`,
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions).then((value) => value.data),
      reply: (input, requestOptions) => request({
        method: "POST",
        path: `/api/session/${encodeURIComponent(input.sessionID)}/permission/${encodeURIComponent(input.requestID)}/reply`,
        body: { decision: input["decision"], message: input["message"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions)
    },
    file: {
      read: (input, requestOptions) => request({
        method: "GET",
        path: `/api/fs/read/${encodePath(input.path)}`,
        query: { location: input["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false,
        binary: true
      }, requestOptions),
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/fs/list`,
        query: { location: input?.["location"], path: input?.["path"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      find: (input, requestOptions) => request({
        method: "GET",
        path: `/api/fs/find`,
        query: { location: input["location"], query: input["query"], type: input["type"], limit: input["limit"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions)
    },
    command: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/command`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions)
    },
    skill: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/skill`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions)
    },
    rpc: {
      call: (input, requestOptions) => request({
        method: "POST",
        path: `/api/rpc/${encodeURIComponent(input.rpcID)}/${encodeURIComponent(input.method)}`,
        query: { location: input["location"] },
        body: { input: input["input"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 500],
        empty: false
      }, requestOptions)
    },
    event: {
      subscribe: (input, requestOptions) => sse({
        method: "GET",
        path: `/api/event`,
        query: { types: input?.["types"] },
        successStatus: 200,
        declaredStatuses: [400, 401],
        empty: false
      }, requestOptions)
    },
    pty: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/pty`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      create: (input, requestOptions) => request({
        method: "POST",
        path: `/api/pty`,
        query: { location: input?.["location"] },
        body: {
          command: input?.["command"],
          args: input?.["args"],
          cwd: input?.["cwd"],
          title: input?.["title"],
          env: input?.["env"]
        },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      get: (input, requestOptions) => request({
        method: "GET",
        path: `/api/pty/${encodeURIComponent(input.ptyID)}`,
        query: { location: input["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      update: (input, requestOptions) => request({
        method: "PUT",
        path: `/api/pty/${encodeURIComponent(input.ptyID)}`,
        query: { location: input["location"] },
        body: { title: input["title"], size: input["size"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      remove: (input, requestOptions) => request({
        method: "DELETE",
        path: `/api/pty/${encodeURIComponent(input.ptyID)}`,
        query: { location: input["location"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions),
      connect: {
        token: (input, requestOptions) => request({
          method: "POST",
          path: `/api/pty/${encodeURIComponent(input.ptyID)}/connect-token`,
          query: { location: input["location"] },
          headers: { "x-opencode-ticket": input["x-opencode-ticket"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 403, 404],
          empty: false
        }, requestOptions)
      }
    },
    shell: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/shell`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      create: (input, requestOptions) => request({
        method: "POST",
        path: `/api/shell`,
        query: { location: input["location"] },
        body: {
          command: input["command"],
          cwd: input["cwd"],
          timeout: input["timeout"],
          metadata: input["metadata"]
        },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      get: (input, requestOptions) => request({
        method: "GET",
        path: `/api/shell/${encodeURIComponent(input.id)}`,
        query: { location: input["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      output: (input, requestOptions) => request({
        method: "GET",
        path: `/api/shell/${encodeURIComponent(input.id)}/output`,
        query: { location: input["location"], cursor: input["cursor"], limit: input["limit"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      remove: (input, requestOptions) => request({
        method: "DELETE",
        path: `/api/shell/${encodeURIComponent(input.id)}`,
        query: { location: input["location"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions)
    },
    reference: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/reference`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions)
    },
    worktree: {
      list: (input, requestOptions) => request({
        method: "GET",
        path: `/api/worktree`,
        query: { projectID: input["projectID"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      create: (input, requestOptions) => request({
        method: "POST",
        path: `/api/worktree`,
        body: {
          projectID: input["projectID"],
          from: input["from"],
          branch: input["branch"],
          directory: input["directory"],
          name: input["name"]
        },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      remove: (input, requestOptions) => request({
        method: "DELETE",
        path: `/api/worktree`,
        body: { projectID: input["projectID"], directory: input["directory"], force: input["force"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions),
      refresh: (input, requestOptions) => request({
        method: "POST",
        path: `/api/worktree/refresh`,
        body: { projectID: input["projectID"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404],
        empty: true
      }, requestOptions)
    },
    vcs: {
      init: (input, requestOptions) => request({
        method: "POST",
        path: `/api/vcs/init`,
        query: { location: input?.["location"], provider: input?.["provider"] },
        successStatus: 204,
        declaredStatuses: [400, 401, 404, 409, 501, 503],
        empty: true
      }, requestOptions),
      get: (input, requestOptions) => request({
        method: "GET",
        path: `/api/vcs`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      base: (input, requestOptions) => request({
        method: "GET",
        path: `/api/vcs/base`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 503],
        empty: false
      }, requestOptions),
      status: (input, requestOptions) => request({
        method: "GET",
        path: `/api/vcs/status`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      branch: {
        list: (input, requestOptions) => request({
          method: "GET",
          path: `/api/vcs/branch`,
          query: { location: input?.["location"], search: input?.["search"], limit: input?.["limit"] },
          successStatus: 200,
          declaredStatuses: [400, 401, 404],
          empty: false
        }, requestOptions)
      },
      diff: (input, requestOptions) => request({
        method: "GET",
        path: `/api/vcs/diff`,
        query: {
          location: input["location"],
          mode: input["mode"],
          base: input["base"],
          context: input["context"],
          untracked: input["untracked"]
        },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 503],
        empty: false
      }, requestOptions)
    },
    debug: {
      heapDump: (input, requestOptions) => request({
        method: "POST",
        path: `/api/debug/heap-dump`,
        query: { directory: input?.["directory"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 500],
        empty: false
      }, requestOptions),
      location: {
        list: (requestOptions) => request({
          method: "GET",
          path: `/api/debug/location`,
          successStatus: 200,
          declaredStatuses: [400, 401],
          empty: false
        }, requestOptions),
        evict: (input, requestOptions) => request({
          method: "DELETE",
          path: `/api/debug/location`,
          query: { location: input?.["location"] },
          successStatus: 204,
          declaredStatuses: [400, 401],
          empty: true
        }, requestOptions)
      }
    },
    websearch: {
      providers: (input, requestOptions) => request({
        method: "GET",
        path: `/api/websearch/provider`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 503],
        empty: false
      }, requestOptions),
      query: (input, requestOptions) => request({
        method: "POST",
        path: `/api/websearch`,
        query: { location: input["location"] },
        body: { query: input["query"], providerID: input["providerID"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404, 503],
        empty: false
      }, requestOptions)
    },
    config: {
      get: (input, requestOptions) => request({
        method: "GET",
        path: `/api/config`,
        query: { location: input?.["location"] },
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions),
      shells: (requestOptions) => request({
        method: "GET",
        path: `/api/config/shell`,
        successStatus: 200,
        declaredStatuses: [400, 401, 404],
        empty: false
      }, requestOptions)
    }
  };
  return {
    ...client,
    session: {
      ...client.session,
      stats: client.experimental.session.stats,
      import: client.experimental.session.import,
      export: client.experimental.session.export,
      skill: client.experimental.session.skill,
      wait: client.experimental.session.wait,
      instructions: {
        entry: {
          list: client.experimental.session.instructions.entry.list,
          put: client.experimental.session.instructions.entry.put,
          remove: client.experimental.session.instructions.entry.remove
        }
      },
      log: client.experimental.session.log
    },
    generate: {
      text: client.experimental.generate.text,
      image: client.experimental.generate.image,
      decisions: client.experimental.generate.decisions
    },
    voice: {
      models: client.experimental.voice.models,
      session: client.experimental.voice.session
    },
    integration: {
      ...client.integration,
      wellknown: {
        add: client.experimental.integration.wellknown.add
      }
    },
    mcp: {
      ...client.mcp,
      add: client.experimental.mcp.add,
      remove: client.experimental.mcp.remove,
      connect: client.experimental.mcp.connect,
      disconnect: client.experimental.mcp.disconnect,
      client: {
        token: client.experimental.mcp.client.token
      }
    },
    file: {
      ...client.file,
      write: client.experimental.file.write,
      watch: client.experimental.file.watch,
      unwatch: client.experimental.file.unwatch
    },
    migration: {
      v1: {
        status: client.experimental.migration.v1.status
      }
    },
    usage: {
      limits: client.experimental.usage.limits
    },
    config: {
      ...client.config,
      update: client.experimental.config.update
    }
  };
}
function encodePath(value) {
  return value.split("/").map(encodeURIComponent).join("/");
}
function appendQuery(params, key, value) {
  if (value === void 0)
    return;
  if (value === null) {
    params.append(key, "null");
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value)
      appendQuery(params, key, item);
    return;
  }
  if (typeof value === "object") {
    for (const [child, item] of Object.entries(value))
      appendQuery(params, `${key}[${child}]`, item);
    return;
  }
  params.append(key, String(value));
}
async function json(response) {
  if (!isContentType(response, "application/json") && !response.headers.get("content-type")?.includes("+json")) {
    try {
      await response.body?.cancel();
    } catch {
    }
    throw new ClientError2("UnsupportedContentType", { detail: response.headers.get("content-type") });
  }
  let text;
  try {
    text = await response.text();
  } catch (cause) {
    throw new ClientError2("Transport", { cause });
  }
  if (text === "")
    throw new ClientError2("MalformedResponse");
  try {
    return JSON.parse(text);
  } catch (cause) {
    throw new ClientError2("MalformedResponse", { cause });
  }
}
function declared(body) {
  const error = Object.assign(new Error(body.message ?? body.data?.message), body);
  if (body._tag)
    error.name = body._tag;
  return error;
}
function isContentType(response, expected) {
  return response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() === expected;
}

// node_modules/.pnpm/@opencode+client@2.2.5_effect@4.0.6_solid-js@1.9.15/node_modules/@opencode/client/dist/chunks/rpc-runtime-sdjh9vmn.js
var isRpcError2 = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "RpcError";
var isRpcInternalError2 = (value) => typeof value === "object" && value !== null && "_tag" in value && value["_tag"] === "RpcInternalError";

// node_modules/.pnpm/@opencode+client@2.2.5_effect@4.0.6_solid-js@1.9.15/node_modules/@opencode/client/dist/chunks/rpc-runtime-xqwq6bgr.js
function makeRpc2(raw, events) {
  return (definition) => {
    const subscribe = (name, options) => {
      if (!Object.hasOwn(definition.events, name))
        throw new Error(`Unknown RPC event: ${definition.id}.${name}`);
      const type = eventType(definition, name);
      return {
        [Symbol.asyncIterator]() {
          const controller = new AbortController();
          const signal = options?.signal ? AbortSignal.any([controller.signal, options.signal]) : controller.signal;
          const iterator = (async function* () {
            try {
              for await (const published of events.subscribe({ signal })) {
                if (signal.aborted)
                  return;
                if (published.type !== type)
                  continue;
                yield published;
              }
            } catch (error) {
              if (!signal.aborted)
                throw error;
            } finally {
              controller.abort();
            }
          })();
          return {
            next: () => iterator.next(),
            return: () => {
              controller.abort();
              return iterator.return();
            }
          };
        }
      };
    };
    return Object.assign(Object.fromEntries(Object.keys(definition.methods).map((name) => [
      name,
      async (input, options) => {
        try {
          const result = await raw.rpc.call({
            rpcID: definition.id,
            method: name,
            input,
            location: options?.location
          }, { signal: options?.signal, headers: options?.headers });
          return result.output;
        } catch (error) {
          if (!isRpcError2(error) && !isRpcInternalError2(error))
            throw error;
          throw error.data === void 0 ? { type: error.type, message: error.message } : { type: error.type, message: error.message, data: error.data };
        }
      }
    ])), {
      events: {
        subscribe,
        on: (name, handler, options) => {
          const controller = new AbortController();
          const signal = options?.signal ? AbortSignal.any([controller.signal, options.signal]) : controller.signal;
          const source = subscribe(name, { signal });
          (async () => {
            for await (const event of source)
              await handler(event);
          })().catch((error) => console.error(error));
          return () => controller.abort();
        }
      }
    });
  };
}
function eventType(definition, name) {
  return `rpc.${definition.id}.${name}`;
}

// node_modules/.pnpm/@opencode+client@2.2.5_effect@4.0.6_solid-js@1.9.15/node_modules/@opencode/client/dist/chunks/rpc-runtime-wbnz2gjn.js
var exports_client = {};
__export2(exports_client, {
  OpenCode: () => exports_client,
  make: () => make2
});
function make2(options) {
  const raw = make3(options);
  const events = make7((signal, onActivity) => raw.event.subscribe(void 0, { signal, onActivity }));
  return {
    ...raw,
    rpc: Object.assign(makeRpc2(raw, events), raw.rpc),
    event: events
  };
}

// apps/web/src/lib/provider-settings.ts
var accountConnections = (integration) => integration?.connections.filter((c) => c.type === "credential") ?? [];
var modelRef = (model) => `${model.providerID}/${model.id}`;
var modalityName = { text: "\u6587\u672C", image: "\u89C6\u89C9", pdf: "PDF", audio: "\u97F3\u9891", video: "\u89C6\u9891" };
function createProviderClient(projectId) {
  const root = projectId ? `/api/v1/projects/${encodeURIComponent(projectId)}` : "/api/v1/models";
  const native = exports_client.make({ baseUrl: `${typeof window === "undefined" ? "http://localhost" : window.location.origin}${root}/opencode` });
  async function settings(path = "", body, signal) {
    const response = await fetch(`${root}/provider-settings${path}`, { signal, ...body === void 0 ? {} : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? data.error ?? "\u8BF7\u6C42\u5931\u8D25");
    return data;
  }
  async function catalog() {
    const preferences = await settings();
    const location = { directory: preferences.directory };
    const [providers, models, integrations] = await Promise.all([native.provider.list({ location }), native.model.list({ location }), native.integration.list({ location })]);
    return { preferences, providers: providers.data, models: models.data.filter((m) => m.status !== "deprecated"), integrations: integrations.data };
  }
  return { native, settings, catalog };
}
function visibleField(field, answer) {
  return field.type === "external" || (field.when ?? []).every((c) => {
    const value = answer[c.key], equal = Array.isArray(value) ? value.includes(String(c.value)) : value === c.value;
    return value !== void 0 && (c.op === "eq" ? equal : !equal);
  });
}
function fieldDefaults(fields = []) {
  return Object.fromEntries(fields.flatMap((field) => field.type !== "external" && field.default !== void 0 ? [[field.key, field.default]] : []));
}
function errorText(error) {
  if (error instanceof Error) return error.message;
  return "\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002";
}

// apps/web/src/components/models/ProviderConnectionDialog.tsx
var import_react5 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var providerFieldClass = "flex min-w-0 flex-col gap-2 text-sm font-medium text-[var(--studio-text)]";
function ConnectionField({ field, answer, onChange }) {
  const fieldId = (0, import_react5.useId)();
  if (!visibleField(field, answer) || field.type !== "external" && field.hidden) return null;
  if (field.type === "external") return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("a", { href: field.url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 text-sm text-[var(--studio-accent)] underline", children: [
    field.title ?? field.key,
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ExternalLink, { className: "h-4 w-4" })
  ] });
  const value = answer[field.key];
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: providerFieldClass, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { htmlFor: fieldId, children: [
      field.title ?? field.key,
      field.required ? " *" : ""
    ] }),
    field.type === "boolean" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { id: fieldId, type: "checkbox", checked: value === true, onChange: (e) => onChange(field.key, e.target.checked), className: "h-4 w-4 accent-[var(--studio-accent)]" }) : field.type === "multiselect" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("select", { id: fieldId, multiple: true, required: field.required, value: Array.isArray(value) ? value : [], onChange: (e) => onChange(field.key, [...e.target.selectedOptions].map((o) => o.value)), className: "min-h-24 rounded-xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-3", children: field.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: o.value, children: o.label }, o.value)) }) : field.type === "string" && field.options && !field.custom ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Select, { id: fieldId, required: field.required, value: String(value ?? ""), onChange: (e) => onChange(field.key, e.target.value), children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: "\u8BF7\u9009\u62E9" }),
      field.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: o.value, children: o.label }, o.value))
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Input, { id: fieldId, className: "h-10 rounded-xl", required: field.required, type: field.type === "number" || field.type === "integer" ? "number" : field.format === "email" ? "email" : field.format === "uri" ? "url" : "text", step: field.type === "integer" ? 1 : field.type === "number" ? "any" : void 0, min: "minimum" in field && typeof field.minimum === "number" ? field.minimum : void 0, max: "maximum" in field && typeof field.maximum === "number" ? field.maximum : void 0, minLength: field.type === "string" ? field.minLength : void 0, maxLength: field.type === "string" ? field.maxLength : void 0, pattern: field.type === "string" ? field.pattern : void 0, placeholder: field.type === "string" ? field.placeholder : void 0, value: typeof value === "string" || typeof value === "number" ? value : "", onChange: (e) => onChange(field.key, field.type === "number" || field.type === "integer" ? e.target.value === "" ? "" : Number(e.target.value) : e.target.value) }),
    field.description ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "text-xs font-normal leading-5 text-[var(--studio-muted)]", children: field.description }) : null
  ] });
}
function ProviderConnectionDialog({ client, integration, directory, onClose, onConnected }) {
  const methods = (0, import_react5.useMemo)(() => {
    const choices = integration.methods.filter((m) => m.type === "key" || m.type === "oauth" || m.type === "external");
    return choices.length ? choices : [{ type: "key", label: "API \u5BC6\u94A5" }];
  }, [integration]);
  const [index, setIndex] = (0, import_react5.useState)(0), method = methods[index];
  const [answer, setAnswer] = (0, import_react5.useState)(() => fieldDefaults(method.form));
  const [key, setKey] = (0, import_react5.useState)(""), [code, setCode] = (0, import_react5.useState)("");
  const [authorization, setAuthorization] = (0, import_react5.useState)();
  const [busy, setBusy] = (0, import_react5.useState)(false), [error, setError] = (0, import_react5.useState)("");
  const attempt = (0, import_react5.useRef)(void 0), mounted = (0, import_react5.useRef)(true), finishing = (0, import_react5.useRef)(false);
  const location = (0, import_react5.useMemo)(() => ({ directory }), [directory]);
  (0, import_react5.useEffect)(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      const current = attempt.current;
      if (current) void client.native.integration.oauth.cancel({ integrationID: integration.id, attemptID: current.attemptID, location }).catch(() => {
      });
    };
  }, [client, integration.id, location]);
  const complete = async () => {
    if (finishing.current) return;
    finishing.current = true;
    attempt.current = void 0;
    setBusy(true);
    setKey("");
    try {
      await onConnected();
      if (mounted.current) onClose();
    } catch (e) {
      if (mounted.current) setError(errorText(e));
    } finally {
      finishing.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  (0, import_react5.useEffect)(() => {
    if (!authorization || authorization.mode !== "auto") return;
    let stopped = false, timer;
    const poll = async () => {
      try {
        const { data } = await client.native.integration.oauth.status({ integrationID: integration.id, attemptID: authorization.attemptID, location });
        if (stopped) return;
        if (data.status === "complete") {
          await complete();
          return;
        }
        if (data.status !== "pending") {
          attempt.current = void 0;
          setError(data.status === "failed" ? data.message : "\u6388\u6743\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u8FDE\u63A5\u3002");
          return;
        }
        timer = setTimeout(() => void poll(), 1e3);
      } catch (e) {
        if (!stopped) {
          setError(errorText(e));
          timer = setTimeout(() => void poll(), 3e3);
        }
      }
    };
    void poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [authorization, client, integration.id, location]);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (authorization) {
        await client.native.integration.oauth.complete({ integrationID: integration.id, attemptID: authorization.attemptID, code: code.trim(), location });
        if (mounted.current) await complete();
        return;
      }
      const values = Object.fromEntries((method.form ?? []).filter((f) => f.type !== "external" && visibleField(f, answer) && answer[f.key] !== void 0).map((f) => [f.key, answer[f.key]]));
      if (method.type === "key") {
        await client.native.integration.connect.key({ integrationID: integration.id, key: key.trim(), answer: values, location });
        if (mounted.current) await complete();
      } else if (method.type === "external") {
        await client.native.integration.connect.external({ integrationID: integration.id, methodID: method.id, answer: values, location });
        if (mounted.current) await complete();
      } else {
        const { data } = await client.native.integration.oauth.connect({ integrationID: integration.id, methodID: method.id, answer: values, location });
        if (!mounted.current) {
          await client.native.integration.oauth.cancel({ integrationID: integration.id, attemptID: data.attemptID, location });
          return;
        }
        attempt.current = data;
        setAuthorization(data);
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      if (mounted.current) setError(errorText(e));
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Modal, { open: true, onClose, title: `\u8FDE\u63A5 ${integration.name}`, description: "\u9009\u62E9\u8BA4\u8BC1\u65B9\u5F0F\uFF0C\u8FDE\u63A5\u540E\u5C06\u81EA\u52A8\u540C\u6B65\u53EF\u7528\u6A21\u578B\u3002", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("form", { onSubmit: (e) => void submit(e), className: "space-y-5", children: [
    error ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { role: "alert", className: "rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300", children: error }) : null,
    authorization ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "space-y-4 rounded-xl border border-[var(--studio-border)] bg-[var(--studio-panel-2)] p-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "whitespace-pre-wrap break-words text-sm leading-6", children: authorization.instructions }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("a", { href: authorization.url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 text-sm text-[var(--studio-accent)]", children: [
        "\u6253\u5F00\u6388\u6743\u9875\u9762",
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ExternalLink, { className: "h-4 w-4" })
      ] }),
      authorization.mode === "auto" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { className: "flex items-center gap-2 text-sm text-[var(--studio-muted)]", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Spinner, {}),
        "\u7B49\u5F85\u6D4F\u89C8\u5668\u6388\u6743\u2026"
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: providerFieldClass, children: [
        "\u6388\u6743\u7801",
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Input, { autoFocus: true, required: true, value: code, onChange: (e) => setCode(e.target.value), className: "h-10 rounded-xl" })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      methods.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: providerFieldClass, children: [
        "\u8BA4\u8BC1\u65B9\u5F0F",
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Select, { "aria-label": "\u8BA4\u8BC1\u65B9\u5F0F", value: index, onChange: (e) => {
          const next = Number(e.target.value);
          setIndex(next);
          setAnswer(fieldDefaults(methods[next].form));
          setKey("");
          setError("");
        }, children: methods.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: i, children: m.label ?? "API \u5BC6\u94A5" }, i)) })
      ] }) : null,
      (method.form ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ConnectionField, { field: f, answer, onChange: (name, value) => setAnswer((a) => ({ ...a, [name]: value })) }, f.key)),
      method.type === "key" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: providerFieldClass, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(KeyRound, { className: "h-4 w-4 text-[var(--studio-muted)]" }),
          "API \u5BC6\u94A5"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Input, { autoFocus: true, required: true, type: "password", autoComplete: "off", value: key, onChange: (e) => setKey(e.target.value), className: "h-10 rounded-xl", placeholder: "\u8F93\u5165 API \u5BC6\u94A5" })
      ] }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex justify-end gap-2 border-t border-[var(--studio-border)] pt-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Button, { type: "button", variant: "ghost", onClick: onClose, children: "\u53D6\u6D88" }),
      authorization?.mode !== "auto" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Button, { type: "submit", variant: "primary", disabled: busy, children: [
        busy ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Spinner, {}) : null,
        authorization ? "\u5B8C\u6210\u6388\u6743" : method.type === "oauth" ? "\u5F00\u59CB\u6388\u6743" : "\u8FDE\u63A5"
      ] }) : null
    ] })
  ] }) });
}

// apps/web/src/components/models/ProviderAccountsDialog.tsx
var import_react6 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function ProviderAccountsDialog({ client, integration, onChanged, onClose }) {
  const accounts = accountConnections(integration);
  const [names, setNames] = (0, import_react6.useState)({});
  const [busy, setBusy] = (0, import_react6.useState)(false), [error, setError] = (0, import_react6.useState)("");
  const mutate = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
      await onChanged();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Modal, { open: true, onClose, title: `${integration.name} \xB7 \u8D26\u6237`, description: "\u7BA1\u7406\u6B64\u63D0\u4F9B\u5546\u7684\u8BA4\u8BC1\u8D26\u6237\uFF0C\u9996\u4E2A\u8D26\u6237\u4E3A\u5F53\u524D\u4F7F\u7528\u7684\u8D26\u6237\u3002", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "space-y-3", children: [
    error ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { role: "alert", className: "text-sm text-rose-600", children: error }) : null,
    accounts.length ? accounts.map((account, i) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "space-y-3 rounded-xl border border-[var(--studio-border)] p-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-xs text-[var(--studio-muted)]", children: account.method === "oauth" ? "OAuth" : account.method === "key" ? "API \u5BC6\u94A5" : "\u5916\u90E8\u8BA4\u8BC1" }),
        i === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "rounded-full bg-[color-mix(in_srgb,var(--studio-accent)_10%,transparent)] px-2 py-0.5 text-xs text-[var(--studio-accent)]", children: "\u5F53\u524D\u8D26\u6237" }) : null
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Input, { "aria-label": "\u8D26\u6237\u540D\u79F0", value: names[account.id] ?? account.label, onChange: (e) => setNames((n) => ({ ...n, [account.id]: e.target.value })), className: "h-10 rounded-xl" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Button, { disabled: busy || !(names[account.id] ?? account.label).trim(), onClick: () => void mutate(() => client.native.credential.update({ credentialID: account.id, label: (names[account.id] ?? account.label).trim() })), children: "\u4FDD\u5B58\u540D\u79F0" }),
        i ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Button, { variant: "outline", disabled: busy, onClick: () => void mutate(() => client.native.credential.activate({ credentialID: account.id })), children: "\u5207\u6362\u81F3\u6B64\u8D26\u6237" }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Button, { variant: "ghost", className: "text-rose-600", disabled: busy, onClick: () => void mutate(() => client.native.credential.remove({ credentialID: account.id })), children: "\u79FB\u9664\u8D26\u6237" })
      ] })
    ] }, account.id)) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "py-4 text-sm text-[var(--studio-muted)]", children: "\u6B64\u63D0\u4F9B\u5546\u5DF2\u65E0\u4FDD\u5B58\u7684\u8D26\u6237\u3002" }),
    busy ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Spinner, {}) : null
  ] }) });
}

// apps/web/src/components/models/CustomProviderDialog.tsx
var import_react7 = require("react");

// apps/web/src/components/models/ModelLimitFields.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function ModelLimitFields({ id, context, output, disabled, onChange }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "studio-model-limit-fields", children: [{ key: "context", label: "\u4E0A\u4E0B\u6587\u7A97\u53E3" }, { key: "output", label: "\u6700\u5927\u8F93\u51FA" }].map((field) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { children: [
    field.label,
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Input, { type: "number", min: 1, max: Number.MAX_SAFE_INTEGER, step: 1, placeholder: "\u672A\u63D0\u4F9B", "aria-label": `${id} ${field.label}`, value: (field.key === "context" ? context : output) ?? "", disabled, onChange: (event) => onChange(field.key, event.target.value === "" ? null : Number(event.target.value)) }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "tokens" })
  ] }, field.key)) });
}

// apps/web/src/components/models/CustomProviderDialog.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
function CustomProviderDialog({ client, existingIds, onClose, onSaved }) {
  const [providerID, setId] = (0, import_react7.useState)(""), [name, setName] = (0, import_react7.useState)(""), [baseURL, setUrl] = (0, import_react7.useState)(""), [key, setKey] = (0, import_react7.useState)("");
  const [headers, setHeaders] = (0, import_react7.useState)([{ key: "", value: "" }]);
  const [error, setError] = (0, import_react7.useState)(""), [busy, setBusy] = (0, import_react7.useState)(false), [reading, setReading] = (0, import_react7.useState)(false);
  const [discovery, setDiscovery] = (0, import_react7.useState)();
  const [selected, setSelected] = (0, import_react7.useState)([]), [query, setQuery] = (0, import_react7.useState)(""), [limit, setLimit] = (0, import_react7.useState)(50);
  const [overrides, setOverrides] = (0, import_react7.useState)({});
  const overrideSignature = (0, import_react7.useRef)("");
  const request = (0, import_react7.useRef)(void 0), generation = (0, import_react7.useRef)(0), alive = (0, import_react7.useRef)(true);
  const debounce = (0, import_react7.useRef)(void 0);
  (0, import_react7.useEffect)(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      generation.current++;
      request.current?.abort();
    };
  }, []);
  const connection = (0, import_react7.useMemo)(() => {
    const values = headers.filter((h) => h.key.trim() || h.value.trim());
    const invalid = values.some((h) => !h.key.trim() || !h.value.trim()) || new Set(values.map((h) => h.key.trim().toLowerCase())).size !== values.length;
    return { baseURL: baseURL.trim(), key: key.trim() || void 0, headers: Object.fromEntries(values.map((h) => [h.key.trim(), h.value.trim()])), invalid };
  }, [baseURL, key, headers]);
  const signature = JSON.stringify(connection);
  const validURL = /^https?:\/\/[^\s]+$/i.test(connection.baseURL);
  const result = discovery?.signature === signature ? discovery.value : void 0;
  const discover = (0, import_react7.useCallback)(async () => {
    clearTimeout(debounce.current);
    if (!validURL) {
      setError("\u8BF7\u8F93\u5165\u6709\u6548\u7684\u670D\u52A1\u5730\u5740\u3002");
      return;
    }
    if (connection.invalid) {
      setError("\u8BF7\u5B8C\u6574\u586B\u5199\u8BF7\u6C42\u5934\uFF0C\u5E76\u786E\u4FDD\u540D\u79F0\u4E0D\u91CD\u590D\u3002");
      return;
    }
    request.current?.abort();
    const control = new AbortController(), id = ++generation.current;
    request.current = control;
    setReading(true);
    setError("");
    try {
      const value = await client.settings("/discover", connection, control.signal);
      if (!alive.current || id !== generation.current) return;
      setDiscovery({ signature, value });
      setSelected(value.models.map((m) => m.id));
      setLimit(50);
      setQuery("");
      return value;
    } catch (error2) {
      if (!control.signal.aborted && alive.current && id === generation.current) setError(errorText(error2));
    } finally {
      if (alive.current && id === generation.current) {
        setReading(false);
        request.current = void 0;
      }
    }
  }, [client, connection, signature, validURL]);
  (0, import_react7.useEffect)(() => {
    generation.current++;
    request.current?.abort();
    setReading(false);
    setError("");
    if (overrideSignature.current !== signature) {
      overrideSignature.current = signature;
      setOverrides({});
    }
    if (!validURL || connection.invalid) return;
    const timer = setTimeout(() => {
      void discover();
    }, 700);
    debounce.current = timer;
    return () => {
      clearTimeout(timer);
      generation.current++;
      request.current?.abort();
    };
  }, [discover, validURL, connection.invalid]);
  const save = async (event) => {
    event.preventDefault();
    setError("");
    const id = providerID.trim();
    if (existingIds.includes(id)) {
      setError("\u63D0\u4F9B\u5546 ID \u5DF2\u5B58\u5728\uFF0C\u8BF7\u4F7F\u7528\u5176\u4ED6 ID\u3002");
      return;
    }
    if (connection.invalid) {
      setError("\u8BF7\u5B8C\u6574\u586B\u5199\u8BF7\u6C42\u5934\uFF0C\u5E76\u786E\u4FDD\u540D\u79F0\u4E0D\u91CD\u590D\u3002");
      return;
    }
    setBusy(true);
    try {
      const value = result ?? await discover();
      if (!value || !alive.current) return;
      const models = value.models.filter((m) => !result || selected.includes(m.id));
      if (!models.length) {
        setError("\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u6A21\u578B\u3002");
        return;
      }
      await client.settings("/custom", { providerID: id, name: name.trim(), key: connection.key, config: { name: name.trim(), npm: "@ai-sdk/openai-compatible", options: { baseURL: value.baseURL, headers: connection.headers }, models: Object.fromEntries(models.map((m) => {
        const custom = overrides[m.id];
        return [m.id, { ...m.config, limit: { ...m.config.limit, ...custom?.context !== void 0 ? { context: custom.context ?? 0 } : {}, ...custom?.output !== void 0 ? { output: custom.output ?? 0 } : {} } }];
      })) } });
      if (!alive.current) return;
      await onSaved();
      onClose();
    } catch (error2) {
      if (alive.current) setError(errorText(error2));
    } finally {
      if (alive.current) setBusy(false);
    }
  };
  const filtered = (result?.models ?? []).filter((m) => `${m.id} ${m.name}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Modal, { open: true, onClose, title: "\u81EA\u5B9A\u4E49 OpenAI \u517C\u5BB9\u63D0\u4F9B\u5546", description: "\u586B\u5199\u670D\u52A1\u5730\u5740\u548C\u51ED\u636E\uFF0C\u81EA\u52A8\u8BFB\u53D6\u53EF\u7528\u6A21\u578B\u4E0E\u670D\u52A1\u63D0\u4F9B\u7684\u80FD\u529B\u914D\u7F6E\u3002", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("form", { onSubmit: (event) => void save(event), className: "space-y-5", children: [
    error ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { role: "alert", className: "rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300", children: error }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: providerFieldClass, children: [
        "\u63D0\u4F9B\u5546 ID",
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Input, { required: true, pattern: "[a-zA-Z0-9._-]+", disabled: busy, value: providerID, onChange: (event) => setId(event.target.value), className: "h-10 rounded-xl", placeholder: "my-provider" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: providerFieldClass, children: [
        "\u663E\u793A\u540D\u79F0",
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Input, { required: true, disabled: busy, value: name, onChange: (event) => setName(event.target.value), className: "h-10 rounded-xl", placeholder: "\u6211\u7684\u6A21\u578B\u670D\u52A1" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: providerFieldClass, children: [
      "\u57FA\u7840 URL",
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Input, { required: true, type: "url", pattern: "https?://.*", disabled: busy, value: baseURL, onChange: (event) => setUrl(event.target.value), className: "h-10 rounded-xl", placeholder: "https://api.example.com/v1" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: providerFieldClass, children: [
      "API \u5BC6\u94A5",
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Input, { type: "password", autoComplete: "off", disabled: busy, value: key, onChange: (event) => setKey(event.target.value), className: "h-10 rounded-xl", placeholder: "\u672C\u5730\u65E0\u8BA4\u8BC1\u670D\u52A1\u53EF\u7559\u7A7A" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Button, { type: "button", variant: "outline", "aria-label": "\u81EA\u52A8\u83B7\u53D6\u6A21\u578B", disabled: busy || reading || !validURL || connection.invalid, onClick: () => void discover(), children: [
      reading ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Spinner, {}) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(RefreshCw, { className: "h-4 w-4" }),
      reading ? "\u6B63\u5728\u83B7\u53D6\u2026" : "\u81EA\u52A8\u83B7\u53D6\u6A21\u578B"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("details", { className: "rounded-xl border border-[var(--studio-border)] p-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("summary", { className: "cursor-pointer text-sm font-medium", children: "\u81EA\u5B9A\u4E49\u8BF7\u6C42\u5934" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "mt-3 space-y-3", children: [
        headers.map((header, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Input, { "aria-label": `\u8BF7\u6C42\u5934\u540D\u79F0 ${index + 1}`, placeholder: "Header-Name", disabled: busy, value: header.key, onChange: (event) => setHeaders((rows) => rows.map((row, n) => n === index ? { ...row, key: event.target.value } : row)), className: "min-w-0" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Input, { "aria-label": `\u8BF7\u6C42\u5934\u503C ${index + 1}`, placeholder: "\u503C", disabled: busy, value: header.value, onChange: (event) => setHeaders((rows) => rows.map((row, n) => n === index ? { ...row, value: event.target.value } : row)), className: "min-w-0" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Button, { type: "button", variant: "ghost", size: "icon", "aria-label": `\u5220\u9664\u8BF7\u6C42\u5934 ${index + 1}`, disabled: busy, onClick: () => setHeaders((rows) => rows.filter((_, n) => n !== index)), children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Trash, { className: "h-4 w-4" }) })
        ] }, index)),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Button, { type: "button", variant: "outline", disabled: busy, onClick: () => setHeaders((rows) => [...rows, { key: "", value: "" }]), children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Plus, { className: "h-4 w-4" }),
          "\u6DFB\u52A0\u8BF7\u6C42\u5934"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("section", { "aria-label": "\u81EA\u52A8\u8BFB\u53D6\u7684\u6A21\u578B", className: "space-y-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { className: "text-sm font-medium", children: "\u53EF\u7528\u6A21\u578B" }),
      reading ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { role: "status", className: "text-xs text-[var(--studio-muted)]", children: "\u6B63\u5728\u4ECE\u670D\u52A1\u8BFB\u53D6\u6A21\u578B\u5217\u8868\u2026" }) : result ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("p", { role: "status", className: "text-xs text-[var(--studio-muted)]", children: [
          "\u53D1\u73B0 ",
          result.models.length,
          " \u4E2A\u6A21\u578B\uFF0C\u5DF2\u9009\u62E9 ",
          selected.length,
          " \u4E2A\u3002\u53EF\u4FEE\u6539\u4E0A\u4E0B\u6587\u7A97\u53E3\u548C\u6700\u5927\u8F93\u51FA\uFF1B\u7559\u7A7A\u8868\u793A\u672A\u63D0\u4F9B\u3002"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Input, { "aria-label": "\u7B5B\u9009\u8BFB\u53D6\u7684\u6A21\u578B", placeholder: "\u7B5B\u9009\u6A21\u578B\u540D\u79F0\u6216 ID", value: query, onChange: (event) => {
          setQuery(event.target.value);
          setLimit(50);
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Button, { type: "button", variant: "ghost", disabled: busy, onClick: () => setSelected(result.models.map((m) => m.id)), children: "\u5168\u9009" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Button, { type: "button", variant: "ghost", disabled: busy, onClick: () => setSelected([]), children: "\u6E05\u7A7A\u9009\u62E9" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "studio-provider-discovery-list", role: "group", "aria-label": "\u9009\u62E9\u5BFC\u5165\u6A21\u578B", children: filtered.slice(0, limit).map((model) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "studio-provider-import-model", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { className: "studio-provider-discovery-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("input", { type: "checkbox", "aria-label": `\u5BFC\u5165 ${model.id}`, checked: selected.includes(model.id), disabled: busy, onChange: (event) => setSelected((ids) => event.target.checked ? [...ids, model.id] : ids.filter((id) => id !== model.id)) }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("strong", { children: model.name }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("small", { children: model.id }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("small", { children: [
                "\u4E0A\u4E0B\u6587 ",
                model.contextWindow?.toLocaleString() ?? "\u672A\u63D0\u4F9B",
                " \xB7 \u6700\u5927\u8F93\u51FA ",
                model.maxOutputTokens?.toLocaleString() ?? "\u672A\u63D0\u4F9B",
                " \xB7 \u8F93\u5165 ",
                model.inputModalities.join(" / "),
                model.reasoningLevels.length ? ` \xB7 \u601D\u8003 ${model.reasoningLevels.join(" / ")}` : ""
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ModelLimitFields, { id: model.id, context: overrides[model.id]?.context !== void 0 ? overrides[model.id].context : model.contextWindow ?? null, output: overrides[model.id]?.output !== void 0 ? overrides[model.id].output : model.maxOutputTokens ?? null, disabled: busy || !selected.includes(model.id), onChange: (key2, value) => setOverrides((current) => ({ ...current, [model.id]: { ...current[model.id], [key2]: value } })) })
        ] }, model.id)) }),
        filtered.length > limit ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Button, { type: "button", variant: "ghost", onClick: () => setLimit((n) => n + 50), children: "\u663E\u793A\u66F4\u591A\u6A21\u578B" }) : null
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "text-xs text-[var(--studio-muted)]", children: "\u586B\u5199\u5730\u5740\u548C\u51ED\u636E\u540E\u81EA\u52A8\u8BFB\u53D6\uFF0C\u4E5F\u53EF\u70B9\u51FB\u201C\u81EA\u52A8\u83B7\u53D6\u6A21\u578B\u201D\u3002\u65E0\u9700\u624B\u52A8\u586B\u5199\u6A21\u578B ID\u3002" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex justify-end gap-2 border-t border-[var(--studio-border)] pt-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Button, { type: "button", variant: "ghost", onClick: onClose, children: "\u53D6\u6D88" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Button, { type: "submit", variant: "primary", disabled: busy || reading || !!result && !selected.length, children: [
        busy ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Spinner, {}) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Download, { className: "h-4 w-4" }),
        busy ? "\u8FDE\u63A5\u4E2D\u2026" : "\u8FDE\u63A5\u5E76\u5BFC\u5165\u6A21\u578B"
      ] })
    ] })
  ] }) });
}

// apps/web/src/components/models/ProviderModelsDialog.tsx
var import_react8 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
var rowsOf = (models) => models.map((model) => ({ ...model, rowKey: crypto.randomUUID() }));
function ProviderModelsDialog({ client, providerID, onClose, onSaved }) {
  const [snapshot, setSnapshot] = (0, import_react8.useState)(), [rows, setRows] = (0, import_react8.useState)([]);
  const [query, setQuery] = (0, import_react8.useState)(""), [limit, setLimit] = (0, import_react8.useState)(40), [error, setError] = (0, import_react8.useState)(""), [notice, setNotice] = (0, import_react8.useState)("");
  const [busy, setBusy] = (0, import_react8.useState)(false), [reading, setReading] = (0, import_react8.useState)(false);
  const alive = (0, import_react8.useRef)(true), operation = (0, import_react8.useRef)(void 0);
  (0, import_react8.useEffect)(() => {
    alive.current = true;
    const control = new AbortController();
    operation.current = control;
    void client.settings(`/models?providerID=${encodeURIComponent(providerID)}`, void 0, control.signal).then((value) => {
      if (alive.current) {
        setSnapshot(value);
        setRows(rowsOf(value.models));
      }
    }).catch((error2) => {
      if (!control.signal.aborted && alive.current) setError(errorText(error2));
    });
    return () => {
      alive.current = false;
      operation.current?.abort();
    };
  }, [client, providerID]);
  const patch = (key, update) => setRows((current) => current.map((row) => row.rowKey === key ? { ...row, ...update } : row));
  const discover = async () => {
    const control = new AbortController();
    operation.current = control;
    setReading(true);
    setError("");
    setNotice("");
    try {
      const found = await client.settings("/discover", { providerID }, control.signal);
      if (!alive.current) return;
      setRows((current) => {
        const additions = found.models.filter((m) => !current.some((row) => row.id === m.id)).map((m) => ({ id: m.id, name: m.name, context: m.contextWindow ?? null, output: m.maxOutputTokens ?? null }));
        return [...current.map((row) => {
          const model = found.models.find((m) => m.id === row.id);
          return model ? { ...row, context: row.context ?? model.contextWindow ?? null, output: row.output ?? model.maxOutputTokens ?? null } : row;
        }), ...rowsOf(additions)];
      });
      setNotice(`\u5DF2\u8BFB\u53D6 ${found.models.length} \u4E2A\u6A21\u578B\uFF1B\u65B0\u589E\u7F3A\u5931\u6A21\u578B\u5E76\u8865\u5145\u7A7A\u767D\u53C2\u6570\uFF0C\u4FDD\u7559\u5DF2\u586B\u5199\u7684\u503C\u3002`);
    } catch (error2) {
      if (!control.signal.aborted && alive.current) setError(errorText(error2));
    } finally {
      if (alive.current) setReading(false);
    }
  };
  const save = async (event) => {
    event.preventDefault();
    if (!snapshot) return;
    setBusy(true);
    setError("");
    try {
      await client.settings("/models", { providerID, revision: snapshot.revision, models: rows.map(({ rowKey, ...model }) => model) });
      if (!alive.current) return;
      await onSaved();
      onClose();
    } catch (error2) {
      if (alive.current) setError(errorText(error2));
    } finally {
      if (alive.current) setBusy(false);
    }
  };
  const filtered = rows.filter((row) => `${row.id} ${row.name}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Modal, { open: true, wide: true, title: "\u7F16\u8F91\u6A21\u578B\u5217\u8868", description: snapshot ? `${snapshot.name} \xB7 \u4FEE\u6539\u5168\u5C40\u6A21\u578B\u5217\u8868\u3001\u4E0A\u4E0B\u6587\u7A97\u53E3\u548C\u6700\u5927\u8F93\u51FA\u3002` : "\u6B63\u5728\u8BFB\u53D6\u6A21\u578B\u914D\u7F6E\u2026", onClose, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("form", { onSubmit: (event) => void save(event), className: "space-y-4", children: [
    error ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { role: "alert", className: "rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300", children: error }) : null,
    !snapshot ? !error && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("p", { role: "status", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Spinner, {}),
      "\u6B63\u5728\u8BFB\u53D6\u2026"
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-xs text-[var(--studio-muted)]", children: "\u6570\u91CF\u5355\u4F4D\u4E3A tokens\uFF1B\u7559\u7A7A\u8868\u793A\u672A\u63D0\u4F9B\u3002\u4FDD\u5B58\u540E Chat \u548C\u5DE5\u4F5C\u6D41\u5171\u7528\u8FD9\u4E9B\u914D\u7F6E\u3002" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Input, { "aria-label": "\u7B5B\u9009\u7F16\u8F91\u6A21\u578B", placeholder: "\u7B5B\u9009\u6A21\u578B\u540D\u79F0\u6216 ID", value: query, onChange: (event) => {
          setQuery(event.target.value);
          setLimit(40);
        }, className: "min-w-0 flex-1" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Button, { type: "button", variant: "outline", disabled: busy || reading || !snapshot.canDiscover, title: snapshot.canDiscover ? "\u4F7F\u7528\u5DF2\u4FDD\u5B58\u7684\u8FDE\u63A5\u8BFB\u53D6\u6A21\u578B" : "\u6B64\u63D0\u4F9B\u5546\u672A\u8BBE\u7F6E\u517C\u5BB9\u670D\u52A1\u5730\u5740", onClick: () => void discover(), children: [
          reading ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Spinner, {}) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(RefreshCw, { className: "h-4 w-4" }),
          "\u81EA\u52A8\u83B7\u53D6\u6A21\u578B"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Button, { type: "button", variant: "outline", disabled: busy || reading, onClick: () => {
          setRows((current) => [...rowsOf([{ id: "", name: "", context: null, output: null }]), ...current]);
          setQuery("");
          setLimit(40);
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Plus, { className: "h-4 w-4" }),
          "\u6DFB\u52A0\u6A21\u578B"
        ] })
      ] }),
      notice ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { role: "status", className: "text-xs text-[var(--studio-muted)]", children: notice }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "studio-model-editor-list", children: filtered.slice(0, limit).map((row) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("section", { className: "studio-model-editor-row", "data-testid": "editable-model-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "studio-model-editor-heading", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("label", { children: [
            "\u6A21\u578B ID",
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Input, { required: true, maxLength: 512, "aria-label": `${row.originalID ?? row.rowKey} \u6A21\u578B ID`, value: row.id, disabled: busy || reading, onChange: (event) => patch(row.rowKey, { id: event.target.value }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("label", { children: [
            "\u663E\u793A\u540D\u79F0",
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Input, { "aria-label": `${row.originalID ?? row.rowKey} \u663E\u793A\u540D\u79F0`, value: row.name, disabled: busy || reading, placeholder: "\u9ED8\u8BA4\u4F7F\u7528\u6A21\u578B ID", onChange: (event) => patch(row.rowKey, { name: event.target.value }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Button, { type: "button", variant: "ghost", size: "icon", "aria-label": `\u5220\u9664\u6A21\u578B ${row.id || "\u65B0\u6A21\u578B"}`, disabled: busy || reading, onClick: () => setRows((current) => current.filter((item) => item.rowKey !== row.rowKey)), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Trash, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ModelLimitFields, { id: row.id || "\u65B0\u6A21\u578B", context: row.context, output: row.output, disabled: busy || reading, onChange: (key, value) => patch(row.rowKey, { [key]: value }) })
      ] }, row.rowKey)) }),
      filtered.length > limit ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Button, { type: "button", variant: "ghost", onClick: () => setLimit((current) => current + 40), children: "\u663E\u793A\u66F4\u591A\u6A21\u578B" }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center justify-between gap-2 border-t border-[var(--studio-border)] pt-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "text-xs text-[var(--studio-muted)]", children: [
          "\u5171 ",
          rows.length,
          " \u4E2A\u6A21\u578B"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Button, { type: "button", variant: "ghost", onClick: onClose, children: "\u53D6\u6D88" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Button, { type: "submit", variant: "primary", disabled: busy || reading || !rows.length, children: [
            busy ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Spinner, {}) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Save, { className: "h-4 w-4" }),
            "\u4FDD\u5B58\u6A21\u578B\u8BBE\u7F6E"
          ] })
        ] })
      ] })
    ] })
  ] }) });
}

// apps/web/src/components/models/ProviderSettings.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
var panel = "rounded-2xl border border-[var(--studio-border)] bg-[var(--studio-panel)] shadow-sm";
var recommended = ["anthropic", "openai", "google", "deepseek", "openrouter", "minimax"];
var notes = { anthropic: "Claude \u6A21\u578B\u4E0E\u63A8\u7406\u80FD\u529B", openai: "GPT \u6A21\u578B\u4E0E ChatGPT \u8D26\u6237", google: "Gemini \u591A\u6A21\u6001\u6A21\u578B", deepseek: "DeepSeek \u6A21\u578B\u4E0E\u601D\u8003\u7B49\u7EA7", openrouter: "\u7EDF\u4E00\u63A5\u5165\u591A\u79CD\u6A21\u578B", minimax: "MiniMax \u6587\u672C\u4E0E\u591A\u6A21\u6001\u6A21\u578B" };
function ProviderMark({ name }) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { "aria-hidden": true, className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--studio-border)] bg-[var(--studio-panel-2)] text-base font-semibold text-[var(--studio-accent)]", children: name.slice(0, 2).toUpperCase() });
}
function SectionTitle({ title, description, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h2", { className: "text-base font-semibold", children: title }),
      description ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "mt-1 text-sm leading-6 text-[var(--studio-muted)]", children: description }) : null
    ] }),
    children
  ] });
}
function Capacity({ children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "rounded-lg bg-[var(--studio-panel-2)] px-2.5 py-1 text-xs leading-5 text-[var(--studio-muted)]", children });
}
function ModelGroup({ provider, models, catalog, disabled, onDefault, onVisible, onEdit }) {
  const [limit, setLimit] = (0, import_react9.useState)(30);
  const known = catalog.preferences.templateIDs.includes(provider.canonical ?? provider.id);
  const number = (value, model, key) => {
    const actual = known ? value : catalog.preferences.modelLimits?.[modelRef(model)]?.[key];
    return actual && actual > 0 ? actual.toLocaleString("en-US") : "\u672A\u63D0\u4F9B";
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { className: cn(panel, "overflow-hidden"), "aria-label": `${provider.name} \u6A21\u578B`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-3 border-b border-[var(--studio-border)] p-5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ProviderMark, { name: provider.name }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h2", { className: "min-w-0 break-words text-base font-semibold", children: provider.name }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "ml-auto shrink-0 text-sm text-[var(--studio-muted)]", children: [
        models.length,
        " \u4E2A\u6A21\u578B"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Button, { variant: "outline", onClick: onEdit, disabled, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Settings2, { className: "h-4 w-4" }),
        "\u7F16\u8F91\u6A21\u578B"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "divide-y divide-[var(--studio-border)]", children: models.slice(0, limit).map((model) => {
      const isDefault = catalog.preferences.defaultModel === modelRef(model), visible = !catalog.preferences.hidden.includes(modelRef(model));
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("article", { "data-testid": "provider-model-row", className: "studio-provider-model-row flex gap-4 p-5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { className: "break-words text-[15px] font-semibold", children: model.name }),
            isDefault ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Badge, { tone: "blue", className: "rounded-full px-2 text-xs", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Check, { className: "h-3 w-3" }),
              "\u9ED8\u8BA4"
            ] }) : null
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "mt-1 break-all font-mono text-xs leading-5 text-[var(--studio-muted)]", children: model.id }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "mt-3 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Capacity, { children: [
              "\u4E0A\u4E0B\u6587 ",
              number(model.limit.context, model, "context")
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Capacity, { children: [
              "\u6700\u5927\u8F93\u51FA ",
              number(model.limit.output, model, "output")
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Capacity, { children: [
              "\u8F93\u5165\uFF1A",
              model.capabilities.input.map((m) => modalityName[m] ?? m).join(" / ")
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Capacity, { children: [
              "\u8F93\u51FA\uFF1A",
              model.capabilities.output.map((m) => modalityName[m] ?? m).join(" / ")
            ] }),
            model.capabilities.tools ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Capacity, { children: "\u5DE5\u5177\u8C03\u7528" }) : null
          ] }),
          model.variants.length ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("p", { className: "mt-2 break-words text-xs leading-6 text-[var(--studio-muted)]", children: [
            "\u601D\u8003\uFF1A",
            model.variants.map((v) => v.id).join(" / ")
          ] }) : null
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex shrink-0 items-center justify-end gap-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { variant: isDefault ? "secondary" : "outline", className: "rounded-xl", disabled: disabled || isDefault, onClick: () => onDefault(model), children: isDefault ? "\u9ED8\u8BA4\u6A21\u578B" : "\u8BBE\u4E3A\u9ED8\u8BA4" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Switch, { label: `${model.name} \u5728\u6A21\u578B\u9009\u62E9\u5668\u4E2D\u663E\u793A`, checked: visible, disabled, onCheckedChange: (value) => onVisible(model, value) })
        ] })
      ] }, modelRef(model));
    }) }),
    models.length > limit ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "border-t border-[var(--studio-border)] p-4 text-center", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Button, { variant: "ghost", onClick: () => setLimit((n) => n + 50), children: [
      "\u663E\u793A\u66F4\u591A\u6A21\u578B\uFF08\u5269\u4F59 ",
      models.length - limit,
      "\uFF09"
    ] }) }) : null
  ] });
}
function ProviderSettings({ projectId, onChanged }) {
  const client = (0, import_react9.useMemo)(() => createProviderClient(projectId), [projectId]);
  const [catalog, setCatalog] = (0, import_react9.useState)();
  const [tab, setTab] = (0, import_react9.useState)("providers");
  const [query, setQuery] = (0, import_react9.useState)(""), [providerFilter, setProviderFilter] = (0, import_react9.useState)("");
  const [error, setError] = (0, import_react9.useState)(""), [busy, setBusy] = (0, import_react9.useState)(false);
  const [picker, setPicker] = (0, import_react9.useState)(false), [providerQuery, setProviderQuery] = (0, import_react9.useState)("");
  const [connect, setConnect] = (0, import_react9.useState)(), [account, setAccount] = (0, import_react9.useState)(), [custom, setCustom] = (0, import_react9.useState)(false);
  const [editor, setEditor] = (0, import_react9.useState)();
  const scroller = (0, import_react9.useRef)(null), alive = (0, import_react9.useRef)(true), request = (0, import_react9.useRef)(0);
  const reload = (0, import_react9.useCallback)(async () => {
    const version = ++request.current;
    const data = await client.catalog();
    if (alive.current && version === request.current) {
      setCatalog(data);
      setError("");
    }
  }, [client]);
  (0, import_react9.useEffect)(() => {
    alive.current = true;
    void reload().catch((e) => {
      if (alive.current) setError(errorText(e));
    });
    return () => {
      alive.current = false;
      request.current++;
    };
  }, [reload]);
  const update = (0, import_react9.useCallback)(async () => {
    await reload();
    await onChanged();
  }, [reload, onChanged]);
  const mutate = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
      await update();
    } catch (e) {
      if (alive.current) setError(errorText(e));
    } finally {
      if (alive.current) setBusy(false);
    }
  };
  const switchTab = (value) => {
    setTab(value);
    setQuery("");
    setProviderFilter("");
    scroller.current?.scrollTo(0, 0);
  };
  const integrations = catalog?.integrations ?? [], providers = catalog?.providers ?? [], models = catalog?.models ?? [];
  const activeProviders = providers.filter((p) => models.some((m) => m.providerID === p.id) || integrations.find((i) => i.id === (p.integrationID ?? p.id))?.connections.length);
  const quick = recommended.flatMap((id) => {
    const integration = integrations.find((i) => i.id === id);
    return integration ? [integration] : [];
  });
  const matches = (text, needle) => text.toLocaleLowerCase().includes(needle.trim().toLocaleLowerCase());
  const selectedIntegration = integrations.find((i) => i.id === connect), accountIntegration = integrations.find((i) => i.id === account);
  const filtered = models.filter((m) => (!providerFilter || m.providerID === providerFilter) && matches(`${m.name} ${m.id} ${providers.find((p) => p.id === m.providerID)?.name ?? ""}`, query));
  const groups = providers.flatMap((provider) => {
    const items = filtered.filter((m) => m.providerID === provider.id);
    return items.length ? [{ provider, models: items }] : [];
  });
  const openModels = (id) => {
    setProviderFilter(id);
    setQuery("");
    setTab("models");
    scroller.current?.scrollTo(0, 0);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { "data-testid": "provider-settings", className: "studio-provider-settings flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--studio-bg)] text-[var(--studio-text)]", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("header", { "data-testid": "provider-settings-header", className: "relative z-10 shrink-0 border-b border-[var(--studio-border)] bg-[var(--studio-panel)] px-5 pt-5 sm:px-7", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "mx-auto flex max-w-[1120px] flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "rounded-xl bg-[color-mix(in_srgb,var(--studio-accent)_10%,transparent)] p-2 text-[var(--studio-accent)]", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Cpu, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h1", { className: "text-xl font-semibold", children: "\u6A21\u578B\u4E0E\u63D0\u4F9B\u5546" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "mt-2 text-sm leading-6 text-[var(--studio-muted)]", children: "\u8FDE\u63A5\u6A21\u578B\u670D\u52A1\uFF0C\u7BA1\u7406\u53EF\u7528\u6A21\u578B\u4E0E\u539F\u751F\u80FD\u529B\u3002" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Button, { variant: "outline", className: "rounded-xl", disabled: busy || !catalog, onClick: () => void mutate(() => client.settings("/refresh", {})), children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(RefreshCw, { className: cn("h-4 w-4", busy && "animate-spin") }),
          "\u5237\u65B0\u6A21\u578B\u76EE\u5F55"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("nav", { "aria-label": "\u6A21\u578B\u8BBE\u7F6E", className: "mx-auto mt-5 flex max-w-[1120px] gap-2 pb-4", children: [{ id: "providers", name: "\u63D0\u4F9B\u5546", icon: Earth }, { id: "models", name: "\u6A21\u578B", icon: Boxes }].map((item) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("button", { "aria-current": tab === item.id ? "page" : void 0, type: "button", onClick: () => switchTab(item.id), className: cn("inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors", tab === item.id ? "bg-[color-mix(in_srgb,var(--studio-accent)_10%,transparent)] text-[var(--studio-accent)]" : "text-[var(--studio-muted)] hover:bg-[var(--studio-bg)]"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(item.icon, { className: "h-4 w-4" }),
        item.name
      ] }, item.id)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { ref: scroller, "data-testid": "provider-settings-scroll", className: "studio-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "mx-auto max-w-[1120px] space-y-6", children: [
      error ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { role: "alert", className: "flex flex-wrap items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-500/10 dark:text-rose-300", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "min-w-0 flex-1 break-words", children: error }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { variant: "outline", onClick: () => void reload().catch((e) => setError(errorText(e))), children: "\u91CD\u8BD5" })
      ] }) : null,
      !catalog ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { role: "status", className: cn(panel, "flex items-center justify-center gap-3 p-12 text-sm text-[var(--studio-muted)]"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Spinner, {}),
        "\u6B63\u5728\u8F7D\u5165\u63D0\u4F9B\u5546\u548C\u539F\u751F\u6A21\u578B\u80FD\u529B\u2026"
      ] }) : tab === "providers" ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(SectionTitle, { title: "\u5DF2\u8FDE\u63A5\u7684\u63D0\u4F9B\u5546", description: "\u6A21\u578B\u670D\u52A1\u3001\u8BA4\u8BC1\u53CA\u9ED8\u8BA4\u6A21\u578B\u5168\u5C40\u5171\u4EAB\uFF0C\u6240\u6709\u5DE5\u4F5C\u533A\u4E0E Flow \u901A\u7528\u3002", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Button, { variant: "primary", className: "rounded-xl", onClick: () => {
          setProviderQuery("");
          setPicker(true);
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Plus, { className: "h-4 w-4" }),
          "\u6DFB\u52A0\u63D0\u4F9B\u5546"
        ] }) }),
        activeProviders.length ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "studio-provider-cards", children: activeProviders.map((provider) => {
          const integration = integrations.find((i) => i.id === (provider.integrationID ?? provider.id));
          const accounts = accountConnections(integration), modelCount = models.filter((m) => m.providerID === provider.id).length;
          const environment = integration?.connections.some((c) => c.type === "env");
          return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { "data-testid": "connected-provider-card", className: cn(panel, "flex min-w-0 flex-col gap-5 p-5"), children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ProviderMark, { name: provider.name }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { className: "break-words text-base font-semibold", children: provider.name }),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "mt-1 break-all text-xs leading-5 text-[var(--studio-muted)]", children: provider.id })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Badge, { tone: "green", className: "shrink-0 rounded-full px-2 text-xs", children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(CircleCheck, { className: "h-3 w-3" }),
                accounts.length || environment ? "\u5DF2\u8FDE\u63A5" : "\u53EF\u7528"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--studio-muted)]", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { children: [
                modelCount,
                " \u4E2A\u53EF\u7528\u6A21\u578B"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: accounts.length ? accounts[0].method === "oauth" ? "OAuth \u8D26\u6237" : "API \u5BC6\u94A5" : environment ? "\u73AF\u5883\u53D8\u91CF" : "\u670D\u52A1\u914D\u7F6E" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "mt-auto flex flex-wrap gap-2 border-t border-[var(--studio-border)] pt-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Button, { variant: "outline", className: "rounded-xl", onClick: () => openModels(provider.id), children: [
                "\u67E5\u770B\u6A21\u578B",
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ArrowRight, { className: "h-4 w-4" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Button, { variant: "outline", onClick: () => setEditor(provider.id), children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Settings2, { className: "h-4 w-4" }),
                "\u7F16\u8F91\u6A21\u578B"
              ] }),
              integration ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { variant: "ghost", className: "rounded-xl", onClick: () => setConnect(integration.id), children: "\u6DFB\u52A0\u8FDE\u63A5" }) : null,
              accounts.length && integration ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Button, { variant: "ghost", className: "ml-auto rounded-xl", onClick: () => setAccount(integration.id), children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Settings2, { className: "h-4 w-4" }),
                "\u7BA1\u7406\u8D26\u6237"
              ] }) : null
            ] })
          ] }, provider.id);
        }) }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: panel, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(EmptyState, { title: "\u5C1A\u672A\u8FDE\u63A5\u6A21\u578B\u670D\u52A1", description: "\u9009\u62E9\u4E0B\u65B9\u63D0\u4F9B\u5546\uFF0C\u6216\u6DFB\u52A0\u81EA\u5B9A\u4E49 OpenAI \u517C\u5BB9\u670D\u52A1\u3002" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(SectionTitle, { title: "\u8FDE\u63A5\u66F4\u591A\u63D0\u4F9B\u5546", description: "\u4F7F\u7528\u63D0\u4F9B\u5546\u6A21\u677F\u81EA\u52A8\u53D1\u73B0\u6A21\u578B\u3001\u4E0A\u4E0B\u6587\u7A97\u53E3\u4E0E\u601D\u8003\u7B49\u7EA7\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "studio-provider-templates", children: quick.map((integration) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { className: cn(panel, "flex min-w-0 flex-col p-5"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ProviderMark, { name: integration.name }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { className: "break-words text-base font-semibold", children: integration.name })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "mt-3 flex-1 text-sm leading-6 text-[var(--studio-muted)]", children: notes[integration.id] ?? integration.id }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Button, { variant: "outline", className: "mt-4 w-full rounded-xl", onClick: () => setConnect(integration.id), children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Plus, { className: "h-4 w-4" }),
            "\u8FDE\u63A5"
          ] })
        ] }, integration.id)) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: cn(panel, "flex flex-wrap items-center justify-between gap-4 p-5"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("h3", { className: "text-sm font-semibold", children: "\u66F4\u591A\u6A21\u578B\u670D\u52A1" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "mt-1 text-sm leading-6 text-[var(--studio-muted)]", children: "\u641C\u7D22\u5168\u90E8\u63D0\u4F9B\u5546\u6A21\u677F\uFF0C\u6216\u63A5\u5165\u81EA\u5B9A\u4E49\u670D\u52A1\u5730\u5740\u3002" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { variant: "outline", className: "rounded-xl", onClick: () => {
              setProviderQuery("");
              setPicker(true);
            }, children: "\u67E5\u770B\u66F4\u591A\u63D0\u4F9B\u5546" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { variant: "ghost", className: "rounded-xl", onClick: () => setCustom(true), children: "\u81EA\u5B9A\u4E49 OpenAI \u517C\u5BB9\u63D0\u4F9B\u5546" })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(SectionTitle, { title: "\u53EF\u7528\u6A21\u578B", description: "\u4F7F\u7528\u63D0\u4F9B\u5546\u539F\u751F\u4E0A\u4E0B\u6587\u7A97\u53E3\uFF0C\u80FD\u529B\u4FE1\u606F\u7531\u6A21\u578B\u76EE\u5F55\u81EA\u52A8\u540C\u6B65\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: cn(panel, "flex flex-wrap items-center gap-3 p-4"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("label", { className: "relative min-w-0 flex-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Search, { "aria-hidden": true, className: "pointer-events-none absolute left-3 top-3 h-4 w-4 text-[var(--studio-muted)]" }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Input, { "aria-label": "\u641C\u7D22\u6A21\u578B", placeholder: "\u641C\u7D22\u6A21\u578B", value: query, onChange: (e) => setQuery(e.target.value), className: "h-10 rounded-xl pl-10" })
          ] }),
          providerFilter ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { variant: "ghost", onClick: () => setProviderFilter(""), children: "\u663E\u793A\u5168\u90E8\u63D0\u4F9B\u5546" }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "shrink-0 text-sm text-[var(--studio-muted)]", children: [
            filtered.length,
            " \u4E2A\u6A21\u578B"
          ] })
        ] }),
        groups.length ? groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ModelGroup, { ...g, catalog, disabled: busy, onEdit: () => setEditor(g.provider.id), onDefault: (m) => void mutate(() => client.settings("/default", { providerID: m.providerID, modelID: m.id })), onVisible: (m, visible) => void mutate(() => client.settings("/visibility", { hidden: visible ? catalog.preferences.hidden.filter((id) => id !== modelRef(m)) : [.../* @__PURE__ */ new Set([...catalog.preferences.hidden, modelRef(m)])] })) }, `${g.provider.id}:${query}`)) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: panel, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(EmptyState, { title: query ? "\u672A\u627E\u5230\u5339\u914D\u6A21\u578B" : "\u6682\u65E0\u53EF\u7528\u6A21\u578B", description: query ? "\u5C1D\u8BD5\u6A21\u578B\u540D\u79F0\u3001ID \u6216\u63D0\u4F9B\u5546\u540D\u79F0\u3002" : "\u5148\u8FDE\u63A5\u63D0\u4F9B\u5546\uFF0C\u518D\u67E5\u770B\u6A21\u578B\u80FD\u529B\u3002" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Modal, { open: picker, onClose: () => setPicker(false), title: "\u6DFB\u52A0\u63D0\u4F9B\u5546", description: "\u641C\u7D22\u5168\u90E8\u63D0\u4F9B\u5546\u6A21\u677F\uFF0C\u9009\u62E9\u670D\u52A1\u540E\u914D\u7F6E\u8BA4\u8BC1\u3002", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "space-y-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Input, { autoFocus: true, placeholder: "\u641C\u7D22\u63D0\u4F9B\u5546", value: providerQuery, onChange: (e) => setProviderQuery(e.target.value), className: "h-10 rounded-xl" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Button, { variant: "outline", className: "w-full rounded-xl", onClick: () => {
        setPicker(false);
        setCustom(true);
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Plus, { className: "h-4 w-4" }),
        "\u81EA\u5B9A\u4E49 OpenAI \u517C\u5BB9\u63D0\u4F9B\u5546"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "space-y-2", children: [
        integrations.filter((i) => matches(`${i.name} ${i.id}`, providerQuery)).sort((a, b) => a.name.localeCompare(b.name)).map((integration) => /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("button", { type: "button", onClick: () => {
          setPicker(false);
          setConnect(integration.id);
        }, className: "flex w-full items-center gap-3 rounded-xl border border-[var(--studio-border)] bg-[var(--studio-panel)] p-3 text-left hover:bg-[var(--studio-panel-2)]", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ProviderMark, { name: integration.name }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "block break-words text-sm font-medium", children: integration.name }),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "block break-all text-xs text-[var(--studio-muted)]", children: integration.id })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ArrowRight, { className: "h-4 w-4 shrink-0 text-[var(--studio-muted)]" })
        ] }, integration.id)),
        !integrations.some((i) => matches(`${i.name} ${i.id}`, providerQuery)) ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(EmptyState, { title: "\u672A\u627E\u5230\u5339\u914D\u63D0\u4F9B\u5546", description: "\u5C1D\u8BD5\u5176\u4ED6\u540D\u79F0\uFF0C\u6216\u4F7F\u7528\u81EA\u5B9A\u4E49\u670D\u52A1\u3002" }) : null
      ] })
    ] }) }),
    selectedIntegration && catalog ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ProviderConnectionDialog, { client, integration: selectedIntegration, directory: catalog.preferences.directory, onClose: () => setConnect(void 0), onConnected: update }, selectedIntegration.id) : null,
    accountIntegration ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ProviderAccountsDialog, { client, integration: accountIntegration, onChanged: update, onClose: () => setAccount(void 0) }, accountIntegration.id) : null,
    editor ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(ProviderModelsDialog, { providerID: editor, client, onClose: () => setEditor(void 0), onSaved: update }, editor) : null,
    custom ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(CustomProviderDialog, { client, existingIds: providers.map((p) => p.id), onClose: () => setCustom(false), onSaved: update }) : null
  ] });
}

// apps/dsh/src/native-providers.css
var native_providers_default = `/*! tailwindcss v4.3.3 | MIT License | https://tailwindcss.com */
@layer properties;
.studio-native-providers, .studio-native-providers {
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  --color-rose-50: oklch(96.9% 0.015 12.422);
  --color-rose-200: oklch(89.2% 0.058 10.001);
  --color-rose-300: oklch(81% 0.117 11.638);
  --color-rose-500: oklch(64.5% 0.246 16.439);
  --color-rose-600: oklch(58.6% 0.253 17.585);
  --color-rose-700: oklch(51.4% 0.222 16.935);
  --color-rose-900: oklch(41% 0.159 10.272);
  --spacing: 0.25rem;
  --text-xs: 0.75rem;
  --text-xs--line-height: calc(1 / 0.75);
  --text-sm: 0.875rem;
  --text-sm--line-height: calc(1.25 / 0.875);
  --text-base: 1rem;
  --text-base--line-height: calc(1.5 / 1);
  --text-xl: 1.25rem;
  --text-xl--line-height: calc(1.75 / 1.25);
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --animate-spin: spin 1s linear infinite;
  --default-transition-duration: 150ms;
  --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
:where(.studio-native-providers) .pointer-events-none {
  pointer-events: none;
}
:where(.studio-native-providers) .visible {
  visibility: visible;
}
:where(.studio-native-providers) .absolute {
  position: absolute;
}
:where(.studio-native-providers) .relative {
  position: relative;
}
:where(.studio-native-providers) .top-3 {
  top: calc(var(--spacing) * 3);
}
:where(.studio-native-providers) .left-3 {
  left: calc(var(--spacing) * 3);
}
:where(.studio-native-providers) .z-10 {
  z-index: 10;
}
:where(.studio-native-providers) .mx-auto {
  margin-inline: auto;
}
:where(.studio-native-providers) .mt-1 {
  margin-top: var(--spacing);
}
:where(.studio-native-providers) .mt-2 {
  margin-top: calc(var(--spacing) * 2);
}
:where(.studio-native-providers) .mt-3 {
  margin-top: calc(var(--spacing) * 3);
}
:where(.studio-native-providers) .mt-4 {
  margin-top: calc(var(--spacing) * 4);
}
:where(.studio-native-providers) .mt-5 {
  margin-top: calc(var(--spacing) * 5);
}
:where(.studio-native-providers) .mt-auto {
  margin-top: auto;
}
:where(.studio-native-providers) .ml-auto {
  margin-left: auto;
}
:where(.studio-native-providers) .block {
  display: block;
}
:where(.studio-native-providers) .flex {
  display: flex;
}
:where(.studio-native-providers) .grid {
  display: grid;
}
:where(.studio-native-providers) .hidden {
  display: none;
}
:where(.studio-native-providers) .inline-flex {
  display: inline-flex;
}
:where(.studio-native-providers) .h-3 {
  height: calc(var(--spacing) * 3);
}
:where(.studio-native-providers) .h-4 {
  height: calc(var(--spacing) * 4);
}
:where(.studio-native-providers) .h-5 {
  height: calc(var(--spacing) * 5);
}
:where(.studio-native-providers) .h-10 {
  height: calc(var(--spacing) * 10);
}
:where(.studio-native-providers) .h-11 {
  height: calc(var(--spacing) * 11);
}
:where(.studio-native-providers) .h-full {
  height: 100%;
}
:where(.studio-native-providers) .min-h-0 {
  min-height: 0px;
}
:where(.studio-native-providers) .min-h-24 {
  min-height: calc(var(--spacing) * 24);
}
:where(.studio-native-providers) .w-3 {
  width: calc(var(--spacing) * 3);
}
:where(.studio-native-providers) .w-4 {
  width: calc(var(--spacing) * 4);
}
:where(.studio-native-providers) .w-5 {
  width: calc(var(--spacing) * 5);
}
:where(.studio-native-providers) .w-11 {
  width: calc(var(--spacing) * 11);
}
:where(.studio-native-providers) .w-full {
  width: 100%;
}
:where(.studio-native-providers) .max-w-\\[1120px\\] {
  max-width: 1120px;
}
:where(.studio-native-providers) .min-w-0 {
  min-width: 0px;
}
:where(.studio-native-providers) .flex-1 {
  flex: 1;
}
:where(.studio-native-providers) .shrink-0 {
  flex-shrink: 0;
}
:where(.studio-native-providers) .animate-spin {
  animation: var(--animate-spin);
}
:where(.studio-native-providers) .cursor-pointer {
  cursor: pointer;
}
:where(.studio-native-providers) .flex-col {
  flex-direction: column;
}
:where(.studio-native-providers) .flex-wrap {
  flex-wrap: wrap;
}
:where(.studio-native-providers) .items-center {
  align-items: center;
}
:where(.studio-native-providers) .items-start {
  align-items: flex-start;
}
:where(.studio-native-providers) .justify-between {
  justify-content: space-between;
}
:where(.studio-native-providers) .justify-center {
  justify-content: center;
}
:where(.studio-native-providers) .justify-end {
  justify-content: flex-end;
}
:where(.studio-native-providers) .gap-2 {
  gap: calc(var(--spacing) * 2);
}
:where(.studio-native-providers) .gap-3 {
  gap: calc(var(--spacing) * 3);
}
:where(.studio-native-providers) .gap-4 {
  gap: calc(var(--spacing) * 4);
}
:where(.studio-native-providers) .gap-5 {
  gap: calc(var(--spacing) * 5);
}
:where(.studio-native-providers) :where(.space-y-2 > :not(:last-child)) {
  --tw-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)));
}
:where(.studio-native-providers) :where(.space-y-3 > :not(:last-child)) {
  --tw-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-reverse)));
}
:where(.studio-native-providers) :where(.space-y-4 > :not(:last-child)) {
  --tw-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)));
}
:where(.studio-native-providers) :where(.space-y-5 > :not(:last-child)) {
  --tw-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 5) * var(--tw-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 5) * calc(1 - var(--tw-space-y-reverse)));
}
:where(.studio-native-providers) :where(.space-y-6 > :not(:last-child)) {
  --tw-space-y-reverse: 0;
  margin-block-start: calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse));
  margin-block-end: calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-reverse)));
}
:where(.studio-native-providers) .gap-x-4 {
  column-gap: calc(var(--spacing) * 4);
}
:where(.studio-native-providers) .gap-y-2 {
  row-gap: calc(var(--spacing) * 2);
}
:where(.studio-native-providers) :where(.divide-y > :not(:last-child)) {
  --tw-divide-y-reverse: 0;
  border-bottom-style: var(--tw-border-style);
  border-top-style: var(--tw-border-style);
  border-top-width: calc(1px * var(--tw-divide-y-reverse));
  border-bottom-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
}
:where(.studio-native-providers) :where(.divide-\\[var\\(--studio-border\\)\\] > :not(:last-child)) {
  border-color: var(--studio-border);
}
:where(.studio-native-providers) .overflow-hidden {
  overflow: hidden;
}
:where(.studio-native-providers) .overflow-y-auto {
  overflow-y: auto;
}
:where(.studio-native-providers) .overscroll-contain {
  overscroll-behavior: contain;
}
:where(.studio-native-providers) .rounded-2xl {
  border-radius: var(--radius-2xl);
}
:where(.studio-native-providers) .rounded-full {
  border-radius: calc(infinity * 1px);
}
:where(.studio-native-providers) .rounded-lg {
  border-radius: var(--radius-lg);
}
:where(.studio-native-providers) .rounded-xl {
  border-radius: var(--radius-xl);
}
:where(.studio-native-providers) .border {
  border-style: var(--tw-border-style);
  border-width: 1px;
}
:where(.studio-native-providers) .border-t {
  border-top-style: var(--tw-border-style);
  border-top-width: 1px;
}
:where(.studio-native-providers) .border-b {
  border-bottom-style: var(--tw-border-style);
  border-bottom-width: 1px;
}
:where(.studio-native-providers) .border-\\[var\\(--studio-border\\)\\] {
  border-color: var(--studio-border);
}
:where(.studio-native-providers) .border-rose-200 {
  border-color: var(--color-rose-200);
}
:where(.studio-native-providers) .bg-\\[color-mix\\(in_srgb\\,var\\(--studio-accent\\)_10\\%\\,transparent\\)\\] {
  background-color: var(--studio-accent);
  @supports (color: color-mix(in lab, red, red)) {
    background-color: color-mix(in srgb,var(--studio-accent) 10%,transparent);
  }
}
:where(.studio-native-providers) .bg-\\[var\\(--studio-bg\\)\\] {
  background-color: var(--studio-bg);
}
:where(.studio-native-providers) .bg-\\[var\\(--studio-panel\\)\\] {
  background-color: var(--studio-panel);
}
:where(.studio-native-providers) .bg-\\[var\\(--studio-panel-2\\)\\] {
  background-color: var(--studio-panel-2);
}
:where(.studio-native-providers) .bg-rose-50 {
  background-color: var(--color-rose-50);
}
:where(.studio-native-providers) .p-2 {
  padding: calc(var(--spacing) * 2);
}
:where(.studio-native-providers) .p-3 {
  padding: calc(var(--spacing) * 3);
}
:where(.studio-native-providers) .p-4 {
  padding: calc(var(--spacing) * 4);
}
:where(.studio-native-providers) .p-5 {
  padding: calc(var(--spacing) * 5);
}
:where(.studio-native-providers) .p-12 {
  padding: calc(var(--spacing) * 12);
}
:where(.studio-native-providers) .px-2 {
  padding-inline: calc(var(--spacing) * 2);
}
:where(.studio-native-providers) .px-2\\.5 {
  padding-inline: calc(var(--spacing) * 2.5);
}
:where(.studio-native-providers) .px-4 {
  padding-inline: calc(var(--spacing) * 4);
}
:where(.studio-native-providers) .px-5 {
  padding-inline: calc(var(--spacing) * 5);
}
:where(.studio-native-providers) .py-0\\.5 {
  padding-block: calc(var(--spacing) * 0.5);
}
:where(.studio-native-providers) .py-1 {
  padding-block: var(--spacing);
}
:where(.studio-native-providers) .py-2\\.5 {
  padding-block: calc(var(--spacing) * 2.5);
}
:where(.studio-native-providers) .py-4 {
  padding-block: calc(var(--spacing) * 4);
}
:where(.studio-native-providers) .pt-4 {
  padding-top: calc(var(--spacing) * 4);
}
:where(.studio-native-providers) .pt-5 {
  padding-top: calc(var(--spacing) * 5);
}
:where(.studio-native-providers) .pb-4 {
  padding-bottom: calc(var(--spacing) * 4);
}
:where(.studio-native-providers) .pl-10 {
  padding-left: calc(var(--spacing) * 10);
}
:where(.studio-native-providers) .text-center {
  text-align: center;
}
:where(.studio-native-providers) .text-left {
  text-align: left;
}
:where(.studio-native-providers) .font-mono {
  font-family: var(--font-mono);
}
:where(.studio-native-providers) .text-base {
  font-size: var(--text-base);
  line-height: var(--tw-leading, var(--text-base--line-height));
}
:where(.studio-native-providers) .text-sm {
  font-size: var(--text-sm);
  line-height: var(--tw-leading, var(--text-sm--line-height));
}
:where(.studio-native-providers) .text-xl {
  font-size: var(--text-xl);
  line-height: var(--tw-leading, var(--text-xl--line-height));
}
:where(.studio-native-providers) .text-xs {
  font-size: var(--text-xs);
  line-height: var(--tw-leading, var(--text-xs--line-height));
}
:where(.studio-native-providers) .text-\\[15px\\] {
  font-size: 15px;
}
:where(.studio-native-providers) .leading-5 {
  --tw-leading: calc(var(--spacing) * 5);
  line-height: calc(var(--spacing) * 5);
}
:where(.studio-native-providers) .leading-6 {
  --tw-leading: calc(var(--spacing) * 6);
  line-height: calc(var(--spacing) * 6);
}
:where(.studio-native-providers) .font-medium {
  --tw-font-weight: var(--font-weight-medium);
  font-weight: var(--font-weight-medium);
}
:where(.studio-native-providers) .font-normal {
  --tw-font-weight: var(--font-weight-normal);
  font-weight: var(--font-weight-normal);
}
:where(.studio-native-providers) .font-semibold {
  --tw-font-weight: var(--font-weight-semibold);
  font-weight: var(--font-weight-semibold);
}
:where(.studio-native-providers) .break-words {
  overflow-wrap: break-word;
}
:where(.studio-native-providers) .break-all {
  word-break: break-all;
}
:where(.studio-native-providers) .whitespace-pre-wrap {
  white-space: pre-wrap;
}
:where(.studio-native-providers) .text-\\[var\\(--studio-accent\\)\\] {
  color: var(--studio-accent);
}
:where(.studio-native-providers) .text-\\[var\\(--studio-muted\\)\\] {
  color: var(--studio-muted);
}
:where(.studio-native-providers) .text-\\[var\\(--studio-text\\)\\] {
  color: var(--studio-text);
}
:where(.studio-native-providers) .text-rose-600 {
  color: var(--color-rose-600);
}
:where(.studio-native-providers) .text-rose-700 {
  color: var(--color-rose-700);
}
:where(.studio-native-providers) .underline {
  text-decoration-line: underline;
}
:where(.studio-native-providers) .accent-\\[var\\(--studio-accent\\)\\] {
  accent-color: var(--studio-accent);
}
:where(.studio-native-providers) .shadow-sm {
  --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
  box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
:where(.studio-native-providers) .outline {
  outline-style: var(--tw-outline-style);
  outline-width: 1px;
}
:where(.studio-native-providers) .transition-colors {
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;
  transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
  transition-duration: var(--tw-duration, var(--default-transition-duration));
}
@media (hover: hover) {
  :where(.studio-native-providers) .hover\\:bg-\\[var\\(--studio-bg\\)\\]:hover {
    background-color: var(--studio-bg);
  }
  :where(.studio-native-providers) .hover\\:bg-\\[var\\(--studio-panel-2\\)\\]:hover {
    background-color: var(--studio-panel-2);
  }
}
@media (width >= 40rem) {
  :where(.studio-native-providers) .sm\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  :where(.studio-native-providers) .sm\\:p-7 {
    padding: calc(var(--spacing) * 7);
  }
  :where(.studio-native-providers) .sm\\:px-7 {
    padding-inline: calc(var(--spacing) * 7);
  }
}
:where(.studio-native-providers) .dark\\:border-rose-900:where([data-ds-dark-theme], [data-ds-dark-theme] *) {
  border-color: var(--color-rose-900);
}
:where(.studio-native-providers) .dark\\:bg-rose-500\\/10:where([data-ds-dark-theme], [data-ds-dark-theme] *) {
  background-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 10%, transparent);
  @supports (color: color-mix(in lab, red, red)) {
    background-color: color-mix(in oklab, var(--color-rose-500) 10%, transparent);
  }
}
:where(.studio-native-providers) .dark\\:text-rose-300:where([data-ds-dark-theme], [data-ds-dark-theme] *) {
  color: var(--color-rose-300);
}
.studio-native-providers {
  --studio-bg: transparent;
  --studio-panel: var(--dsw-alias-bg-layer-3);
  --studio-panel-2: var(--dsw-alias-bg-layer-4);
  --studio-border: var(--dsw-alias-border-l2);
  --studio-text: var(--dsw-alias-label-primary);
  --studio-muted: var(--dsw-alias-label-tertiary);
  --studio-accent: var(--dsw-alias-state-business-primary);
  --studio-on-accent: var(--dsw-alias-label-primary-foreground);
  --text-sm: 13px;
  --text-base: 14px;
  --text-xl: 20px;
  font: inherit;
  font-size: 13px;
  line-height: 1.5;
  color: var(--dsw-alias-label-primary);
  min-width: 0;
}
.studio-native-providers :is(h1,h2,h3,p) {
  margin: 0;
}
.studio-native-providers :is(h1,h2,h3) {
  font-weight: 500;
}
.studio-native-providers button:where(:not(.studio-native-button):not(.studio-plugin-switch)) {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.studio-native-providers fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.studio-native-providers legend {
  padding: 0;
}
.studio-native-providers nav button {
  padding: 6px 12px;
  border-radius: var(--dsw-radius-md);
}
.studio-native-providers nav button[aria-current=page] {
  background: var(--dsw-alias-interactive-bg-active);
  color: var(--dsw-alias-label-primary);
}
.studio-native-providers .studio-provider-settings {
  height: auto;
  overflow: visible;
}
.studio-native-providers [data-testid=provider-settings-header] {
  padding: 0;
  border: 0;
  background: transparent;
  z-index: auto;
}
.studio-native-providers [data-testid=provider-settings-header] > div {
  gap: 12px;
}
.studio-native-providers [data-testid=provider-settings-header] h1 {
  font-size: 20px;
  line-height: 28px;
}
.studio-native-providers [data-testid=provider-settings-header] nav {
  padding-bottom: 16px;
  border-bottom: .5px solid var(--dsw-alias-border-l2);
}
.studio-native-providers [data-testid=provider-settings-scroll] {
  overflow: visible;
  padding: 24px 0 0;
}
.studio-native-providers .studio-provider-cards,.studio-native-providers .studio-provider-templates {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(min(100%,240px),1fr));
  gap: 12px;
}
.studio-native-providers :is(.rounded-2xl,.rounded-xl) {
  border-radius: var(--dsw-radius-md);
}
.studio-native-providers .shadow-sm {
  box-shadow: none;
}
.studio-native-providers [data-testid=connected-provider-card] {
  border: 0;
  border-bottom: .5px solid var(--dsw-alias-border-l2);
  background: transparent;
  padding: 16px 0;
  border-radius: 0;
}
.studio-native-providers .studio-provider-templates > section {
  padding: 16px;
  background: var(--dsw-alias-bg-layer-3);
}
.studio-native-providers .studio-provider-model-row {
  display: flex;
  flex-direction: column;
}
.studio-native-providers .studio-provider-discovery-list {
  max-height: 280px;
  overflow: auto;
}
.studio-native-providers .studio-provider-discovery-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: .5px solid var(--dsw-alias-border-l2);
  cursor: pointer;
}
.studio-native-providers .studio-provider-discovery-row > input {
  flex: none;
  width: 16px;
  height: 16px;
  margin: 2px 0 0;
  accent-color: var(--dsw-alias-state-business-primary);
}
.studio-native-providers .studio-provider-discovery-row > span {
  min-width: 0;
  overflow-wrap: anywhere;
}
.studio-native-providers .studio-provider-discovery-row strong {
  display: block;
  font-size: 13px;
  font-weight: 500;
}
.studio-native-providers .studio-provider-discovery-row small {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}
.studio-native-providers .studio-native-control {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  height: 34px;
  padding: 0 12px;
  border: .5px solid var(--dsw-alias-border-l4);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-3);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-weight: 400;
  font-size: 13px;
  line-height: 1.5;
  box-shadow: none;
}
.studio-native-providers .studio-native-control.pl-10 {
  padding-left: 36px;
}
.studio-native-providers .studio-native-control:focus-visible {
  outline: none;
  border-color: var(--dsw-alias-state-business-primary);
  box-shadow: none;
}
.studio-native-providers .studio-native-control::placeholder {
  color: var(--dsw-alias-label-dimmed);
}
.studio-native-providers .studio-native-control:disabled {
  color: var(--dsw-alias-label-tertiary);
}
.studio-native-providers .studio-native-button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 32px;
  border: .5px solid transparent;
  border-radius: var(--dsw-radius-md);
  background: transparent;
  color: var(--dsw-alias-label-primary);
  padding: 5px 12px;
  font: inherit;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  cursor: pointer;
  box-shadow: none;
  white-space: nowrap;
}
.studio-native-providers .studio-native-button.is-primary {
  background: var(--dsw-alias-label-primary);
  color: var(--dsw-alias-bg-layer-3);
}
.studio-native-providers .studio-native-button.is-outline {
  border-color: var(--dsw-alias-border-l3);
}
.studio-native-providers .studio-native-button.is-secondary {
  background: var(--dsw-alias-interactive-bg-hover);
}
.studio-native-providers .studio-native-button.is-danger {
  background: var(--dsw-alias-state-error-primary);
  color: var(--dsw-alias-label-primary-foreground);
}
.studio-native-providers .studio-native-button.size-icon {
  width: 28px;
  min-height: 28px;
  padding: 0;
}
.studio-native-providers .studio-native-button:disabled {
  opacity: .4;
  cursor: default;
}
.studio-native-providers .studio-native-button:focus-visible {
  outline: var(--dsw-focus-ring-width,2px) solid var(--dsw-alias-state-business-primary);
  outline-offset: 2px;
}
.studio-native-providers .studio-native-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: var(--dsw-radius-sm);
  font-size: 11px;
  background: var(--dsw-alias-bg-layer-4);
  color: var(--dsw-alias-label-secondary);
}
.studio-native-providers .studio-native-badge.tone-blue {
  color: var(--dsw-alias-state-business-primary);
}
.studio-native-providers .studio-native-empty {
  text-align: center;
  padding: 24px 12px;
  color: var(--dsw-alias-label-secondary);
}
.studio-native-providers .studio-native-empty p {
  margin-top: 6px;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}
.studio-native-providers .studio-native-spinner {
  display: inline-block;
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  border: 1.5px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: studio-native-spin .8s linear infinite;
}
.studio-native-provider-dialog {
  width: min(520px,calc(100vw - 32px));
  max-height: calc(100dvh - 48px);
  padding: 0;
  box-sizing: border-box;
  border: .5px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-panel);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  box-shadow: var(--dsw-elevation-prominent);
}
.studio-native-provider-dialog.is-wide {
  width: min(800px,calc(100vw - 32px));
}
.studio-native-provider-dialog[open] {
  display: flex;
  flex-direction: column;
}
.studio-native-provider-dialog::backdrop {
  background: var(--dsw-alias-bg-mask-1);
  backdrop-filter: var(--dsw-mask-blur);
}
.studio-native-provider-dialog > header {
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px 12px;
}
.studio-native-provider-dialog > header h2 {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}
.studio-native-provider-dialog > header p {
  margin-top: 4px;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}
.studio-native-provider-dialog__body {
  min-height: 0;
  padding: 12px 24px 24px;
  overflow: auto;
}
.studio-native-provider-dialog > footer {
  padding: 12px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
@media (hover:hover) {
  .studio-native-providers .studio-native-button:not(.is-primary):not(.is-danger):hover:not(:disabled) {
    background: var(--dsw-alias-interactive-bg-hover);
  }
  .studio-native-providers button:where(:not(.studio-native-button):not(.studio-plugin-switch)):hover {
    background: var(--dsw-alias-interactive-bg-hover);
  }
}
@media (pointer:coarse) {
  .studio-native-providers .studio-native-control {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion:reduce) {
  .studio-native-providers .studio-native-spinner {
    animation: none;
  }
}
@keyframes studio-native-spin {
  to {
    transform: rotate(360deg);
  }
}
:where(.studio-native-providers) .studio-provider-import-model {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--studio-border);
}
:where(.studio-native-providers) .studio-provider-import-model .studio-provider-discovery-row {
  border-bottom: 0;
}
:where(.studio-native-providers) .studio-model-limit-fields {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 12px;
}
:where(.studio-native-providers) .studio-model-limit-fields label,:where(.studio-native-providers) .studio-model-editor-heading label {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}
:where(.studio-native-providers) .studio-model-limit-fields label span {
  color: var(--studio-muted);
}
:where(.studio-native-providers) .studio-model-editor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
:where(.studio-native-providers) .studio-model-editor-row {
  padding: 14px;
  border: 1px solid var(--studio-border);
  border-radius: 12px;
  background: var(--studio-panel);
}
:where(.studio-native-providers) .studio-model-editor-heading {
  display: grid;
  grid-template-columns: minmax(0,1fr) minmax(0,1fr) auto;
  align-items: end;
  gap: 12px;
  margin-bottom: 12px;
}
@media (max-width:600px) {
  :where(.studio-native-providers) .studio-model-editor-heading {
    grid-template-columns: minmax(0,1fr) auto;
  }
  :where(.studio-native-providers) .studio-model-editor-heading label:nth-child(2) {
    grid-row: 2;
    grid-column: 1/-1;
  }
}
@property --tw-space-y-reverse {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --tw-divide-y-reverse {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --tw-border-style {
  syntax: "*";
  inherits: false;
  initial-value: solid;
}
@property --tw-leading {
  syntax: "*";
  inherits: false;
}
@property --tw-font-weight {
  syntax: "*";
  inherits: false;
}
@property --tw-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-shadow-alpha {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --tw-inset-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-inset-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-inset-shadow-alpha {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --tw-ring-color {
  syntax: "*";
  inherits: false;
}
@property --tw-ring-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-inset-ring-color {
  syntax: "*";
  inherits: false;
}
@property --tw-inset-ring-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-ring-inset {
  syntax: "*";
  inherits: false;
}
@property --tw-ring-offset-width {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}
@property --tw-ring-offset-color {
  syntax: "*";
  inherits: false;
  initial-value: #fff;
}
@property --tw-ring-offset-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-outline-style {
  syntax: "*";
  inherits: false;
  initial-value: solid;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
    :where(.studio-native-providers) *, :where(.studio-native-providers) ::before, :where(.studio-native-providers) ::after, :where(.studio-native-providers) ::backdrop {
      --tw-space-y-reverse: 0;
      --tw-divide-y-reverse: 0;
      --tw-border-style: solid;
      --tw-leading: initial;
      --tw-font-weight: initial;
      --tw-shadow: 0 0 #0000;
      --tw-shadow-color: initial;
      --tw-shadow-alpha: 100%;
      --tw-inset-shadow: 0 0 #0000;
      --tw-inset-shadow-color: initial;
      --tw-inset-shadow-alpha: 100%;
      --tw-ring-color: initial;
      --tw-ring-shadow: 0 0 #0000;
      --tw-inset-ring-color: initial;
      --tw-inset-ring-shadow: 0 0 #0000;
      --tw-ring-inset: initial;
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-color: #fff;
      --tw-ring-offset-shadow: 0 0 #0000;
      --tw-outline-style: solid;
    }
  }
}
`;

// apps/dsh/src/native-providers.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var unchanged = async () => {
};
function NativeProviderSettings() {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("section", { className: "studio-native-providers", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ProviderSettings, { onChanged: unchanged }) });
}

// apps/dsh/src/restart-settings.tsx
var import_react10 = require("react");

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
var directoryApi = {
  workspaces: (signal) => studioRequest("workspaces", void 0, signal),
  setWorkspace: (workspaceId, directory) => studioRequest("workspace-directory", { workspaceId, directory }),
  session: (sessionId, signal) => studioRequest(`sessions/directory?sessionId=${encodeURIComponent(sessionId)}`, void 0, signal),
  setSession: (sessionId, directory) => studioRequest("sessions/directory", { sessionId, directory }),
  deleteSession: (sessionId) => studioRequest("sessions/delete", { sessionId }),
  restartDsh: () => studioRequest("restart", {})
};

// apps/dsh/src/restart-settings.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
function RestartDshSettings({ view }) {
  const [busy, setBusy] = (0, import_react10.useState)(false);
  const [message, setMessage] = (0, import_react10.useState)("");
  if (view === "summary") return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: "\u91CD\u542F DSH \u670D\u52A1\u4EE5\u5E94\u7528\u9700\u8981\u91CD\u65B0\u52A0\u8F7D\u7684\u63D2\u4EF6\u4E0E\u914D\u7F6E\u3002" });
  const restart = async () => {
    setBusy(true);
    setMessage("");
    let accepted = false;
    try {
      const desktop = globalThis.dshDesktop;
      if (desktop?.restartHarness) {
        const result = await desktop.restartHarness();
        accepted = result.ok;
        if (!accepted) throw new Error("\u684C\u9762\u7AEF\u672A\u80FD\u786E\u8BA4\u91CD\u542F\u5B8C\u6210\u3002");
        setMessage("DSH \u670D\u52A1\u6B63\u5728\u91CD\u542F\uFF0C\u9875\u9762\u5C06\u77ED\u6682\u65AD\u5F00\u3002");
      } else {
        const result = await directoryApi.restartDsh();
        accepted = result.restarting;
        setMessage(result.message || "DSH \u670D\u52A1\u6B63\u5728\u91CD\u542F\uFF0C\u9875\u9762\u5C06\u77ED\u6682\u65AD\u5F00\u3002");
      }
    } catch (error) {
      setMessage(error instanceof Error ? `\u91CD\u542F\u8BF7\u6C42\u672A\u786E\u8BA4\uFF1A${error.message}` : "\u91CD\u542F\u8BF7\u6C42\u672A\u786E\u8BA4\u3002");
    } finally {
      if (!accepted) setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("section", { className: "studio-plugin-settings", "data-dsh-restart-settings": true, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "studio-plugin-settings__status", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "studio-plugin-settings__status-label", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: "\u91CD\u542F DSH \u670D\u52A1" }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("small", { children: "\u91CD\u542F\u4F1A\u4E2D\u65AD\u6B63\u5728\u8FD0\u884C\u7684\u4EFB\u52A1\uFF1B\u9875\u9762\u77ED\u6682\u65AD\u5F00\u540E\u53EF\u91CD\u65B0\u6253\u5F00\u3002" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("button", { type: "button", className: "studio-plugin-settings__save", disabled: busy, onClick: () => {
      void restart();
    }, children: [
      busy ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(LoaderCircle, { className: "is-spinning", size: 16, "aria-hidden": "true" }) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Power, { size: 16, strokeWidth: 1.5, "aria-hidden": "true" }),
      busy ? "\u6B63\u5728\u53D1\u9001\u91CD\u542F\u8BF7\u6C42\u2026" : "\u91CD\u542F DSH \u670D\u52A1"
    ] }),
    message && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { role: "status", children: message })
  ] });
}

// apps/dsh/src/client-opencode-provider.tsx
var inject = ["slots"];
function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = "studio-opencode-provider";
    style.textContent = pluginSettingsStyles + native_providers_default;
    document.head.append(style);
    return () => style.remove();
  }, "studio-opencode: settings styles");
  ctx.inject(["slots"], (child) => {
    const slots = child.get("slots");
    child.effect(() => slots.inject("settings.section", () => slots.register({ name: "settings.section", id: "models", order: 10, label: () => "\u6A21\u578B\u4E0E\u63D0\u4F9B\u5546" }, NativeProviderSettings)), "studio-opencode: provider settings");
    child.effect(() => slots.inject("plugins.bundle.config", () => slots.register({ name: "plugins.bundle.config", key: "@agent-studio/plugin-opencode-provider" }, RestartDshSettings)), "studio-opencode: restart settings");
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
lucide-react/dist/esm/icons/arrow-right.mjs:
lucide-react/dist/esm/icons/boxes.mjs:
lucide-react/dist/esm/icons/check.mjs:
lucide-react/dist/esm/icons/circle-check.mjs:
lucide-react/dist/esm/icons/cpu.mjs:
lucide-react/dist/esm/icons/download.mjs:
lucide-react/dist/esm/icons/earth.mjs:
lucide-react/dist/esm/icons/external-link.mjs:
lucide-react/dist/esm/icons/key-round.mjs:
lucide-react/dist/esm/icons/loader-circle.mjs:
lucide-react/dist/esm/icons/plus.mjs:
lucide-react/dist/esm/icons/power.mjs:
lucide-react/dist/esm/icons/refresh-cw.mjs:
lucide-react/dist/esm/icons/save.mjs:
lucide-react/dist/esm/icons/search.mjs:
lucide-react/dist/esm/icons/settings-2.mjs:
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
