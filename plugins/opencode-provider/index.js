// src/provider-plugin.ts
import z from "@deepseek-ai/schemastery";
import path2 from "node:path";
import { mkdir as mkdir2, readFile as readFile2, rename as rename2, rm as rm2, writeFile as writeFile2 } from "node:fs/promises";
import { randomUUID as randomUUID2 } from "node:crypto";

// ../server/src/services/opencode-provider-core.ts
import path from "node:path";
import { mkdir, readFile, writeFile, chmod, rename, rm } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { Context, Effect, Layer, ManagedRuntime, References } from "effect";
import { HttpEffect, HttpRouter, HttpServer } from "effect/http";
import { createEmbeddedRoutes } from "@opencode/server/routes";
import { OpenCode } from "@opencode/client";
import { make as makeNativeAI } from "@opencode/ai";
import { ModelsDev } from "@opencode/core/models-dev";
import { LocationServiceMap } from "@opencode/core/location-service-map";
import { Location } from "@opencode/core/location";
import { ModelResolver } from "@opencode/core/model-resolver";
import { Plugin } from "@opencode/core/plugin";
import { Credential } from "@opencode/core/credential";
import { Provider } from "@opencode/schema/provider";
import { Model } from "@opencode/schema/model";
async function createProviderHost(root, directory, options = {}) {
  await mkdir(root, { recursive: true, mode: 448 });
  let catalog;
  const runtime = ManagedRuntime.make(createEmbeddedRoutes({
    app: { name: "agent-studio", version: "0.1.0" },
    database: { path: path.join(root, "providers.db") },
    config: { directory: root, project: false, claude: false },
    fs: { filewatcher: false, fff: false },
    events: { persist: false }
  }, [ModelsDev.node.replace(ModelsDev.configured().mapLayer((layer) => Layer.tap(layer, (context2) => Effect.sync(() => {
    catalog = Context.get(context2, ModelsDev.Service);
  }))))]).pipe(Layer.provide(HttpServer.layerServices), Layer.provideMerge(Layer.succeed(References.MinimumLogLevel, "Warn"))));
  const context = await runtime.contextEffect.pipe(Effect.runPromise).then(async (context2) => {
    await chmod(path.join(root, "providers.db"), 384);
    return context2;
  }).catch(async (error) => {
    await runtime.dispose();
    throw error;
  });
  const location = Location.Ref.make({ directory });
  const ready = (signal) => runtime.runPromise(
    Plugin.awaitActivation.pipe(
      Effect.provide(LocationServiceMap.Service.get(location)),
      Effect.timeoutOrElse({ duration: options.activationTimeoutMs ?? 6e4, orElse: () => Effect.fail(new Error("OPENCODE_ACTIVATION_TIMEOUT: \u6A21\u578B\u670D\u52A1\u521D\u59CB\u5316\u8D85\u65F6\uFF0C\u8BF7\u68C0\u67E5 OpenCode \u63D2\u4EF6\u914D\u7F6E\u540E\u5728\u6A21\u578B\u4E0E\u63D0\u4F9B\u5546\u9875\u9762\u91CD\u8BD5\u3002")) })
    ),
    { signal }
  );
  const handler = HttpEffect.toWebHandlerWith(context)(Context.get(context, HttpRouter.HttpRouter).asHttpEffect());
  const fetchNative = async (input, init) => {
    const request = new Request(input, init);
    await ready(request.signal);
    const url = new URL(request.url);
    url.searchParams.set("location[directory]", directory);
    return handler(new Request(url, request));
  };
  const api = OpenCode.make({ baseUrl: "http://opencode.local", fetch: fetchNative });
  const resolve = async (providerID, modelID, variant, signal) => {
    await ready(signal);
    return runtime.runPromise(
      Effect.gen(function* () {
        yield* Plugin.awaitActivation;
        const resolver = yield* ModelResolver.Service;
        const resolved = yield* resolver.resolve(Model.Ref.make({ providerID: Provider.ID.make(providerID), id: Model.ID.make(modelID), ...variant && variant !== "default" ? { variant: Model.VariantID.make(variant === "off" ? "none" : variant) } : {} }));
        if (!resolved) return yield* Effect.fail(new Error(`Model unavailable: ${providerID}/${modelID}`));
        return resolved;
      }).pipe(Effect.provide(LocationServiceMap.Service.get(location))),
      { signal }
    );
  };
  const readConfiguration = async () => {
    try {
      return JSON.parse(await readFile(path.join(root, "opencode.json"), "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") return {};
      throw error;
    }
  };
  const revisionOf = (value) => createHash("sha256").update(JSON.stringify(value ?? {})).digest("hex");
  const providerConfiguration = async (providerID) => {
    const saved = await readConfiguration(), config = saved.provider?.[providerID] ?? {};
    return { config, revision: revisionOf({ legacy: config, native: saved.providers?.[providerID] ?? {} }) };
  };
  let configurationWrites = Promise.resolve();
  const configure = (providerID, config, expectedRevision) => {
    const next = configurationWrites.then(async () => {
      const file = path.join(root, "opencode.json"), existing = await readConfiguration();
      if (expectedRevision !== void 0 && revisionOf({ legacy: existing.provider?.[providerID] ?? {}, native: existing.providers?.[providerID] ?? {} }) !== expectedRevision) throw new Error("MODEL_CONFIG_CONFLICT: \u6A21\u578B\u914D\u7F6E\u5DF2\u66F4\u65B0\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u540E\u4FEE\u6539\u3002");
      const temporary = `${file}.${randomUUID()}.tmp`;
      try {
        await writeFile(temporary, JSON.stringify({ ...existing, provider: { ...existing.provider, [providerID]: config } }, null, 2), { mode: 384 });
        await rename(temporary, file);
      } finally {
        await rm(temporary, { force: true });
      }
      await runtime.runPromise(LocationServiceMap.reload());
      await api.integration.list({ location: { directory } });
    });
    configurationWrites = next.catch(() => {
    });
    return next;
  };
  const configuredModelLimits = async () => {
    let config;
    try {
      config = JSON.parse(await readFile(path.join(root, "opencode.json"), "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") return {};
      throw error;
    }
    return Object.fromEntries(Object.entries(config.provider ?? {}).flatMap(([provider, value]) => Object.entries(value.models ?? {}).map(([id, model]) => [
      `${provider}/${id}`,
      Object.fromEntries(Object.entries(model.limit ?? {}).filter(([key, value2]) => ["context", "input", "output"].includes(key) && typeof value2 === "number" && value2 > 0))
    ])));
  };
  const templates = async () => {
    await api.integration.list({ location: { directory } });
    if (!catalog) throw new Error("OpenCode catalog is unavailable");
    return Effect.runPromise(catalog.get());
  };
  const refresh = async () => {
    await templates();
    await Effect.runPromise(catalog.refresh(true));
    await runtime.runPromise(LocationServiceMap.reload());
  };
  const credentials = () => runtime.runPromise(Effect.flatMap(Credential.Service, (service) => service.all()));
  const importCredentials = (rows) => runtime.runPromise(Effect.gen(function* () {
    const service = yield* Credential.Service;
    const existing = yield* service.all();
    const known = new Set(existing.map((row) => `${row.integrationID}:${JSON.stringify(row.value)}`));
    for (const row of rows) {
      const key = `${row.integrationID}:${JSON.stringify(row.value)}`;
      if (known.has(key)) continue;
      yield* service.create({ integrationID: row.integrationID, label: row.label, value: row.value, activate: false });
      known.add(key);
    }
  }));
  return { runtime, api, fetch: fetchNative, resolve, configure, providerConfiguration, configuredModelLimits, templates, refresh, credentials, importCredentials, directory, close: async () => {
    await configurationWrites;
    await runtime.dispose();
  } };
}

// ../server/src/services/provider-discovery.ts
var record = (value) => value !== null && typeof value === "object" && !Array.isArray(value) ? value : {};
var positive = (...values) => values.find((v) => typeof v === "number" && Number.isSafeInteger(v) && v > 0);
var text = (...values) => values.find((v) => typeof v === "string" && !!v.trim())?.trim();
var modalities = (value) => {
  if (!Array.isArray(value)) return void 0;
  const valid = [...new Set(value.filter((v) => typeof v === "string" && ["text", "image", "audio", "video", "pdf"].includes(v)))];
  return valid.length ? valid : void 0;
};
function discoveryConnection(input) {
  const raw = record(input);
  let url;
  try {
    url = new URL(String(raw.baseURL ?? "").trim());
  } catch {
    throw new Error("\u8BF7\u8F93\u5165\u6709\u6548\u7684 HTTP(S) \u670D\u52A1\u5730\u5740\u3002");
  }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error("\u670D\u52A1\u5730\u5740\u987B\u4E3A\u4E0D\u542B\u8D26\u53F7\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u7247\u6BB5\u7684 HTTP(S) URL\u3002");
  url.pathname = url.pathname.replace(/\/(?:models|chat\/completions)\/?$/, "").replace(/\/+$/, "");
  const baseURL = url.href.replace(/\/$/, "");
  const headers = new Headers({ Accept: "application/json" });
  for (const [name2, value] of Object.entries(record(raw.headers))) {
    if (typeof value !== "string" || !name2.trim() || /[\r\n]/.test(name2 + value) || ["host", "content-length", "connection", "cookie"].includes(name2.toLowerCase())) throw new Error("\u81EA\u5B9A\u4E49\u8BF7\u6C42\u5934\u65E0\u6548\u3002");
    try {
      headers.set(name2, value);
    } catch {
      throw new Error("\u81EA\u5B9A\u4E49\u8BF7\u6C42\u5934\u65E0\u6548\u3002");
    }
  }
  if (typeof raw.key === "string" && raw.key.trim()) {
    if (/[\r\n]/.test(raw.key)) throw new Error("API \u5BC6\u94A5\u5305\u542B\u65E0\u6548\u5B57\u7B26\u3002");
    headers.set("Authorization", `Bearer ${raw.key.trim()}`);
  }
  return { baseURL, endpoint: `${baseURL}/models`, headers };
}
function catalogModels(catalog) {
  const index = /* @__PURE__ */ new Map(), fingerprints = /* @__PURE__ */ new Map();
  for (const model of catalog) {
    const fingerprint = JSON.stringify([model.limit, model.capabilities, model.variants]);
    fingerprints.set(model, fingerprint);
    for (const id of new Set([model.id, model.modelID].filter((id2) => !!id2))) {
      if (!index.has(id)) index.set(id, model);
      else if (!index.get(id) || fingerprints.get(index.get(id)) !== fingerprint) index.set(id, void 0);
    }
  }
  return index;
}
function discoveredModels(rows, catalog = []) {
  const seen = /* @__PURE__ */ new Set(), index = catalogModels(catalog);
  return rows.flatMap((value) => {
    const raw = typeof value === "string" ? { id: value } : record(value), id = text(raw.id, raw.model);
    if (!id || id.length > 512 || seen.has(id) || ["__proto__", "constructor", "prototype"].includes(id)) return [];
    seen.add(id);
    const known = index.get(id), limits = record(raw.limit), top = record(raw.top_provider), capabilities = record(raw.capabilities), architecture = record(raw.architecture);
    const context = positive(limits.context, raw.context_length, raw.context_window, raw.max_model_len, top.context_length);
    const output = positive(limits.output, raw.max_output_tokens, raw.max_completion_tokens, top.max_completion_tokens);
    const input = positive(limits.input, raw.max_input_tokens);
    const apiInput = modalities(capabilities.input ?? record(raw.modalities).input ?? architecture.input_modalities ?? raw.input_modalities);
    const apiOutput = modalities(capabilities.output ?? record(raw.modalities).output ?? architecture.output_modalities ?? raw.output_modalities);
    const efforts = raw.reasoning_efforts ?? raw.reasoning_levels;
    const explicitEfforts = Array.isArray(efforts) ? [...new Set(efforts.filter((v) => typeof v === "string" && /^[\w-]{1,64}$/.test(v) && !["__proto__", "constructor", "prototype"].includes(v)))] : void 0;
    const tools = typeof capabilities.tools === "boolean" ? capabilities.tools : typeof raw.tool_call === "boolean" ? raw.tool_call : Array.isArray(raw.supported_parameters) ? raw.supported_parameters.includes("tools") : void 0;
    const name2 = text(raw.name, raw.display_name, known?.name, id);
    const contextWindow = context ?? positive(known?.limit.context), maxOutputTokens = output ?? positive(known?.limit.output), maxInputTokens = input ?? positive(known?.limit.input);
    const inputModalities = apiInput ?? known?.capabilities.input ?? ["text"], outputModalities = apiOutput ?? known?.capabilities.output ?? ["text"];
    const reasoningLevels = explicitEfforts ?? known?.variants.map((v) => v.id) ?? [];
    const config = {
      name: name2,
      // Zero explicitly represents unavailable metadata instead of OpenCode's generic 200K/32K fallback.
      limit: { context: contextWindow ?? 0, output: maxOutputTokens ?? 0, ...maxInputTokens ? { input: maxInputTokens } : {} },
      modalities: { input: inputModalities, output: outputModalities },
      tool_call: tools ?? known?.capabilities.tools ?? false,
      variants: Object.fromEntries(reasoningLevels.map((effort) => [effort, { reasoningEffort: effort }]))
    };
    return [{ id, name: name2, contextWindow, maxOutputTokens, inputModalities: [...inputModalities], outputModalities: [...outputModalities], reasoningLevels, metadataSource: context || output || apiInput || apiOutput || tools !== void 0 || explicitEfforts ? "api" : known ? "catalog" : "unavailable", config }];
  });
}
async function discoverProvider(input, catalog = [], signal, fetcher = fetch, timeoutMs = 12e3) {
  const { baseURL, endpoint, headers } = discoveryConnection(input);
  const timeout = AbortSignal.timeout(timeoutMs), abort = signal ? AbortSignal.any([signal, timeout]) : timeout;
  try {
    const rows = [], cursors = /* @__PURE__ */ new Set();
    let cursor;
    for (let page = 0; page < 20; page++) {
      const url = new URL(endpoint);
      if (cursor) url.searchParams.set("after", cursor);
      const response = await fetcher(url, { headers, signal: abort, redirect: "manual" });
      if (!response.ok) {
        await response.body?.cancel();
        throw new Error(response.status === 401 || response.status === 403 ? `\u8BFB\u53D6\u6A21\u578B\u5931\u8D25\uFF08HTTP ${response.status}\uFF09\uFF0C\u8BF7\u68C0\u67E5 API \u5BC6\u94A5\u548C\u8BF7\u6C42\u5934\u3002` : `\u8BFB\u53D6\u6A21\u578B\u5931\u8D25\uFF08HTTP ${response.status}\uFF09\uFF0C\u8BF7\u68C0\u67E5\u670D\u52A1\u5730\u5740\u662F\u5426\u652F\u6301 /models\u3002`);
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("\u6A21\u578B\u63A5\u53E3\u8FD4\u56DE\u4E86\u7A7A\u54CD\u5E94\u3002");
      const chunks = [];
      let size = 0;
      try {
        for (; ; ) {
          const part = await reader.read();
          if (part.done) break;
          size += part.value.byteLength;
          if (size > 4 * 1024 * 1024) throw new Error("\u6A21\u578B\u5217\u8868\u54CD\u5E94\u8D85\u8FC7 4MB\u3002");
          chunks.push(part.value);
        }
      } finally {
        await reader.cancel().catch(() => {
        });
        reader.releaseLock();
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
      let data;
      try {
        data = JSON.parse(new TextDecoder().decode(bytes));
      } catch {
        throw new Error("\u6A21\u578B\u63A5\u53E3\u672A\u8FD4\u56DE\u6709\u6548 JSON\uFF0C\u8BF7\u68C0\u67E5\u670D\u52A1\u5730\u5740\u3002");
      }
      const object = record(data), entries = Array.isArray(data) ? data : Array.isArray(object.data) ? object.data : object.models;
      if (!Array.isArray(entries)) throw new Error("\u6A21\u578B\u63A5\u53E3\u7F3A\u5C11 data / models \u5217\u8868\u3002");
      rows.push(...entries);
      if (rows.length > 1e4) throw new Error("\u6A21\u578B\u5217\u8868\u8D85\u8FC7 10000 \u9879\uFF0C\u8BF7\u4F7F\u7528\u63D0\u4F9B\u5546\u7684\u7B5B\u9009\u63A5\u53E3\u3002");
      if (object.has_more !== true) {
        const models = discoveredModels(rows, catalog);
        if (!models.length) throw new Error("\u670D\u52A1\u672A\u8FD4\u56DE\u53EF\u7528\u6A21\u578B\uFF0C\u8BF7\u68C0\u67E5\u8D26\u53F7\u6743\u9650\u4E0E\u670D\u52A1\u5730\u5740\u3002");
        return { baseURL, endpoint, models };
      }
      cursor = text(object.last_id, record(entries.at(-1)).id);
      if (!cursor || cursors.has(cursor)) throw new Error("\u6A21\u578B\u63A5\u53E3\u8FD4\u56DE\u4E86\u65E0\u6548\u7684\u5206\u9875\u6E38\u6807\u3002");
      cursors.add(cursor);
    }
    throw new Error("\u6A21\u578B\u5217\u8868\u5206\u9875\u8FC7\u591A\uFF0C\u8BF7\u4F7F\u7528\u63D0\u4F9B\u5546\u7684\u7B5B\u9009\u63A5\u53E3\u3002");
  } catch (error) {
    if (signal?.aborted) throw new Error("\u8BFB\u53D6\u6A21\u578B\u5DF2\u53D6\u6D88\u3002");
    if (timeout.aborted) throw new Error("\u8BFB\u53D6\u6A21\u578B\u8D85\u65F6\uFF0C\u8BF7\u68C0\u67E5\u670D\u52A1\u5730\u5740\u540E\u91CD\u8BD5\u3002");
    if (error instanceof TypeError) throw new Error("\u65E0\u6CD5\u8FDE\u63A5\u6A21\u578B\u63A5\u53E3\uFF0C\u8BF7\u68C0\u67E5\u670D\u52A1\u5730\u5740\u3001\u7F51\u7EDC\u548C\u8BC1\u4E66\u3002");
    throw error;
  }
}

// ../server/src/services/provider-model-settings.ts
var limitValue = (value) => typeof value === "number" && value > 0 ? value : null;
async function readProviderModels(host, providerID) {
  if (!providerID || ["__proto__", "constructor", "prototype"].includes(providerID)) throw new Error("\u65E0\u6548\u7684\u63D0\u4F9B\u5546 ID\u3002");
  const location = { directory: host.directory };
  const [providers, models, saved, templates] = await Promise.all([host.api.provider.list({ location }), host.api.model.list({ location }), host.providerConfiguration(providerID), host.templates()]);
  const provider = providers.data.find((p) => p.id === providerID);
  if (!provider) throw new Error("\u63D0\u4F9B\u5546\u4E0D\u5B58\u5728\u6216\u5C1A\u672A\u8FDE\u63A5\u3002");
  const known = templates.some((t) => t.info.id === (provider.canonical ?? provider.id));
  return { providerID, name: provider.name, revision: saved.revision, canDiscover: !!saved.config.options?.baseURL, models: models.data.filter((m) => m.providerID === providerID && m.status !== "deprecated").map((m) => ({
    id: m.id,
    originalID: m.id,
    name: m.name,
    context: limitValue(saved.config.models?.[m.id]?.limit?.context ?? (known ? m.limit.context : void 0)),
    output: limitValue(saved.config.models?.[m.id]?.limit?.output ?? (known ? m.limit.output : void 0))
  })) };
}
function validateModelEdits(value) {
  if (!Array.isArray(value) || !value.length || value.length > 1e4) throw new Error("\u8BF7\u4FDD\u7559\u81F3\u5C11\u4E00\u4E2A\u6A21\u578B\uFF0C\u6700\u591A 10000 \u4E2A\u3002");
  const ids = /* @__PURE__ */ new Set();
  return value.map((row) => {
    if (!row || typeof row !== "object" || typeof row.id !== "string" || !row.id.trim() || row.id.length > 512 || ["__proto__", "constructor", "prototype"].includes(row.id.trim())) throw new Error("\u6A21\u578B ID \u4E0D\u80FD\u4E3A\u7A7A\u6216\u5305\u542B\u4FDD\u7559\u540D\u79F0\u3002");
    const id = row.id.trim();
    if (ids.has(id)) throw new Error(`\u6A21\u578B ID \u91CD\u590D\uFF1A${id}`);
    ids.add(id);
    const limits = Object.fromEntries(["context", "output"].map((key) => {
      const number = row[key];
      if (number !== null && number !== void 0 && (!Number.isSafeInteger(number) || number <= 0)) throw new Error(`${id} \u7684\u4E0A\u4E0B\u6587\u548C\u6700\u5927\u8F93\u51FA\u5FC5\u987B\u4E3A\u6B63\u6574\u6570\uFF0C\u6216\u7559\u7A7A\u3002`);
      return [key, number ?? null];
    }));
    if (limits.context && limits.output && limits.output > limits.context) throw new Error(`${id} \u7684\u6700\u5927\u8F93\u51FA\u4E0D\u80FD\u8D85\u8FC7\u4E0A\u4E0B\u6587\u7A97\u53E3\u3002`);
    return { id, ...typeof row.originalID === "string" && !["__proto__", "constructor", "prototype"].includes(row.originalID) ? { originalID: row.originalID } : {}, name: typeof row.name === "string" && row.name.trim() ? row.name.trim() : id, context: limits.context, output: limits.output };
  });
}
async function saveProviderModels(host, args) {
  const rows = validateModelEdits(args.models);
  const current = await readProviderModels(host, args.providerID), saved = await host.providerConfiguration(args.providerID);
  if (!args.revision || current.revision !== args.revision || saved.revision !== args.revision) throw new Error("MODEL_CONFIG_CONFLICT: \u6A21\u578B\u914D\u7F6E\u5DF2\u66F4\u65B0\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u540E\u4FEE\u6539\u3002");
  const config = saved.config;
  const models = Object.fromEntries(rows.map((row) => {
    const previous = config.models?.[row.originalID ?? row.id];
    const limit = { ...previous?.limit, context: row.context ?? 0, output: row.output ?? 0 };
    if (limit.input && limit.context && limit.input > limit.context) limit.input = limit.context;
    const defaults = current.models.some((m) => m.id === (row.originalID ?? row.id)) ? {} : { modalities: { input: ["text"], output: ["text"] }, tool_call: false, variants: {} };
    return [row.id, { ...previous ?? defaults, status: void 0, name: row.name, limit }];
  }));
  const { whitelist, blacklist, ...preserved } = config;
  const removed = Object.fromEntries([...Object.keys(config.models ?? {}), ...current.models.map((m) => m.id)].filter((id) => !rows.some((row) => row.id === id)).map((id) => [id, { ...config.models?.[id], status: "deprecated" }]));
  await host.configure(args.providerID, { ...preserved, models: { ...removed, ...models } }, args.revision);
  return readProviderModels(host, args.providerID);
}
async function discoverSavedProvider(host, providerID, signal) {
  await readProviderModels(host, providerID);
  const { config } = await host.providerConfiguration(providerID);
  if (!config.options?.baseURL) throw new Error("\u6B64\u63D0\u4F9B\u5546\u672A\u914D\u7F6E\u517C\u5BB9\u670D\u52A1\u5730\u5740\uFF0C\u53EF\u76F4\u63A5\u624B\u52A8\u7F16\u8F91\u6A21\u578B\u3002");
  const integrations = await host.api.integration.list({ location: { directory: host.directory } });
  const selected = integrations.data.find((i) => i.id === providerID)?.connections.find((c) => c.type === "credential");
  const credential = selected?.type === "credential" ? (await host.credentials()).find((c) => c.id === selected.id) : void 0;
  const key = credential?.value.type === "key" ? credential.value.key : config.options.apiKey;
  return discoverProvider({ baseURL: config.options.baseURL, headers: config.options.headers, key }, (await host.templates()).flatMap((p) => p.models), signal);
}

// src/opencode-adapter.ts
import { LlmAdapter, LlmError, CONTEXT_WINDOW_EXCEEDED_CODE, QUOTA_EXCEEDED_CODE, INVALID_CREDENTIAL_CODE, attributionHeaders, offloadedImageText } from "@deepseek-ai/dsh-llm";
import { make, Message, Media, ToolCallPart, ToolResultPart } from "@opencode/ai";
var providerRoute = (providerOrProjectId, legacyProviderId) => `opencode:${legacyProviderId ?? providerOrProjectId}`;
var canonicalProviderRoute = (route) => route.replace(/^opencode:[^:]+:([^:]+)$/, "opencode:$1");
var journalValue = (value) => JSON.parse(JSON.stringify(value));
var OpenCodeDshAdapter = class extends LlmAdapter {
  constructor(core, store, images, ai = make()) {
    super();
    this.core = core;
    this.store = store;
    this.images = images;
    this.ai = ai;
  }
  core;
  store;
  images;
  ai;
  routes = /* @__PURE__ */ new Map();
  async refresh() {
    const next = /* @__PURE__ */ new Map();
    await this.core.sync();
    const hidden = new Set((await this.core.preferences()).hidden);
    for (const record2 of this.core.listModels()) {
      next.set(providerRoute(record2.nativeProviderId), { record: record2, models: record2.models.filter((m) => !hidden.has(`${record2.nativeProviderId}/${m.id}`)) });
    }
    this.routes = next;
    return [...next.keys(), ...this.store.listProjects().flatMap((project) => [...next.keys()].map((route) => `opencode:${project.id}:${route.slice("opencode:".length)}`))];
  }
  providerInfo(provider) {
    const { record: record2 } = this.route(provider);
    return { id: provider, name: record2.name };
  }
  route(provider) {
    const route = this.routes.get(canonicalProviderRoute(provider));
    if (!route) throw new LlmError("\u63D0\u4F9B\u5546\u672A\u8FDE\u63A5\uFF0C\u8BF7\u5728\u8BBE\u7F6E \u2192 \u6A21\u578B\u4E0E\u63D0\u4F9B\u5546\u4E2D\u914D\u7F6E\u3002", "NO_ADAPTER");
    return route;
  }
  async listModels(provider) {
    if (canonicalProviderRoute(provider) !== provider) return [];
    return this.route(provider).models.map((m) => ({ provider, id: m.id, name: m.name ?? m.id, inputModalities: (m.inputModalities ?? ["text"]).filter((v) => v === "text" || v === "image") }));
  }
  async resolveModel(provider, model, signal) {
    signal?.throwIfAborted();
    const { record: record2, models } = this.route(provider);
    const selected = models.find((m) => m.id === model);
    if (!selected) throw new LlmError(`\u6A21\u578B\u4E0D\u53EF\u7528\uFF1A${model}`, "MODEL_NOT_FOUND");
    return {
      provider,
      id: model,
      name: selected.name ?? model,
      inputModalities: (selected.inputModalities ?? ["text"]).filter((v) => v === "text" || v === "image"),
      ...selected.contextWindow ? { context: { contextWindow: selected.contextWindow } } : {},
      ...selected.maxOutputTokens ? { defaultMaxTokens: selected.maxOutputTokens } : {},
      ...selected.reasoningLevels?.length ? { reasoning: { efforts: selected.reasoningLevels.map((id) => ({ id, name: id })) } } : {}
    };
  }
  async prepareCall(provider, model, signal) {
    const info = await this.resolveModel(provider, model, signal);
    const { record: record2 } = this.route(provider);
    const host = await this.core.host();
    const snapshots = new Map(await Promise.all([void 0, ...info.reasoning?.efforts.map((e) => e.id) ?? []].map(async (effort) => [effort, await host.resolve(record2.nativeProviderId, model, effort, signal)])));
    signal?.throwIfAborted();
    return { model: info, stream: (options) => this.streamResolved(options, record2, async (effort) => {
      const resolved = snapshots.get(effort);
      if (!resolved) throw new LlmError(`\u4E0D\u652F\u6301\u7684\u601D\u8003\u7B49\u7EA7\uFF1A${effort}`, "INVALID_REASONING_EFFORT");
      return resolved;
    }) };
  }
  async *stream(options) {
    yield* (await this.prepareCall(options.provider, options.model, options.signal)).stream(options);
  }
  async *streamResolved(options, record2, resolve) {
    options.signal?.throwIfAborted();
    const selected = await resolve(options.reasoningEffort);
    const messages = await toOpenCodeMessages(options.messages, this.images(), options.signal, { provider: options.provider, model: options.model });
    const sessionId = options.sessionId ?? "dsh-global";
    const request = {
      model: selected.model,
      http: { headers: { ...attributionHeaders(), "x-opencode-client": "agent-studio-dsh", "x-opencode-session-id": sessionId, "x-opencode-session": sessionId, "x-session-affinity": sessionId, "X-Session-Id": sessionId } },
      promptCacheKey: sessionId,
      system: [options.system, ...options.messages.filter((m) => m.role === "system").map((m) => m.content.filter((b) => b.type === "text").map((b) => b.text).join("\n"))].filter(Boolean).join("\n\n"),
      messages,
      tools: (options.tools ?? []).map((t) => ({ name: t.name, description: t.description, inputSchema: t.parameters })),
      generation: { ...selected.capabilities.temperature && options.temperature !== void 0 ? { temperature: options.temperature } : {}, ...options.maxTokens ? { maxTokens: selected.limit.output > 0 ? Math.min(options.maxTokens, selected.limit.output) : options.maxTokens } : {}, ...options.stop?.length ? { stop: options.stop } : {} }
    };
    const parts = /* @__PURE__ */ new Map();
    const indices = /* @__PURE__ */ new Map();
    const open = /* @__PURE__ */ new Set();
    const toolInputs = /* @__PURE__ */ new Set();
    const completed = /* @__PURE__ */ new Set();
    const indexFor = (key) => {
      if (!indices.has(key)) indices.set(key, indices.size);
      return indices.get(key);
    };
    let finished = false;
    try {
      for await (const event of this.ai.stream(request, { signal: options.signal })) {
        if (event.type === "provider-error") throw new LlmError(event.message, event.classification === "context-overflow" ? CONTEXT_WINDOW_EXCEEDED_CODE : event.classification === "payload-too-large" ? "PAYLOAD_TOO_LARGE" : "PROVIDER_ERROR");
        if (/^(text|reasoning)-(start|delta|end)$/.test(event.type) && "id" in event) {
          const type = event.type.startsWith("reasoning") ? "reasoning" : "text";
          const index = indexFor(`${type}:${event.id}`);
          if (!open.has(index) && !parts.has(index)) {
            open.add(index);
            yield { type: "block-start", index, blockType: type };
          }
          const previous = parts.get(index);
          const before = previous && "text" in previous ? previous.text : "";
          const delta = "text" in event && typeof event.text === "string" ? event.text : "";
          const content = event.type.endsWith("-end") && delta ? delta : before + (event.type.endsWith("-delta") ? delta : "");
          parts.set(index, { type, text: content, ..."providerMetadata" in event && event.providerMetadata ? { providerMetadata: event.providerMetadata } : previous && "providerMetadata" in previous ? { providerMetadata: previous.providerMetadata } : {} });
          if (event.type.endsWith("-delta")) yield { type: type === "text" ? "text-delta" : "reasoning-delta", index, text: delta };
          if (event.type.endsWith("-end")) {
            open.delete(index);
            yield { type: "block-end", index, block: { type, text: content } };
          }
        }
        if (event.type === "tool-input-start") {
          const index = indexFor(`tool:${event.id}`);
          toolInputs.add(event.id);
          open.add(index);
          yield { type: "block-start", index, blockType: "tool-call" };
          yield { type: "tool-call-delta", index, id: event.id, name: event.name, argumentsDelta: "" };
        }
        if (event.type === "tool-input-delta") yield { type: "tool-call-delta", index: indexFor(`tool:${event.id}`), id: event.id, argumentsDelta: event.text };
        if (event.type === "tool-input-error") throw new LlmError(`\u5DE5\u5177\u53C2\u6570\u4E0D\u662F\u6709\u6548 JSON\uFF1A${event.name}`, "INVALID_TOOL_ARGUMENTS");
        if (event.type === "tool-call" && !completed.has(event.id)) {
          completed.add(event.id);
          const index = indexFor(`tool:${event.id}`), args = JSON.stringify(event.input);
          if (!toolInputs.has(event.id)) {
            yield { type: "block-start", index, blockType: "tool-call" };
            yield { type: "tool-call-delta", index, id: event.id, name: event.name, argumentsDelta: args };
          }
          parts.set(index, ToolCallPart.make({ id: event.id, name: event.name, input: event.input, providerMetadata: event.providerMetadata }));
          open.delete(index);
          yield { type: "block-end", index, block: { type: "tool-call", id: event.id, name: event.name, arguments: args } };
        }
        if (event.type === "finish") {
          for (const index of open) {
            const p = parts.get(index);
            if (p?.type === "text" || p?.type === "reasoning") yield { type: "block-end", index, block: { type: p.type, text: p.text } };
          }
          if (event.usage) {
            const u = event.usage;
            yield { type: "usage", usage: journalValue({ inputTokens: u.nonCachedInputTokens ?? Math.max(0, (u.inputTokens ?? 0) - (u.cacheReadInputTokens ?? 0) - (u.cacheWriteInputTokens ?? 0)), outputTokens: u.outputTokens ?? 0, cacheReadTokens: u.cacheReadInputTokens, cacheWriteTokens: u.cacheWriteInputTokens, totalTokens: u.totalTokens, reasoningTokens: u.reasoningTokens }) };
          }
          const reason = event.reason.normalized;
          finished = true;
          if (reason === "error" || reason === "content-filter" || reason === "unknown") {
            yield { type: "finish", reason: { kind: "error", failure: { code: reason === "content-filter" ? "CONTENT_FILTER" : reason === "unknown" ? "STREAM_INTERRUPTED" : "PROVIDER_ERROR", message: event.reason.explanation ?? `\u6A21\u578B\u7EC8\u6B62\uFF1A${reason}` } } };
          } else yield { type: "finish", reason: { kind: reason === "length" ? "max-tokens" : reason === "tool-calls" || completed.size ? "tool-calls" : "stop" }, replayState: journalValue({ response: { adapter: "studio-opencode-v1" }, blocks: [...indices.values()].sort((a, b) => a - b).map((i) => parts.get(i) ?? null) }) };
        }
      }
      if (!finished) throw new LlmError("\u6A21\u578B\u8FDE\u63A5\u5728\u8FD4\u56DE\u5B8C\u6210\u6807\u8BB0\u524D\u4E2D\u65AD", "STREAM_INTERRUPTED");
    } catch (error) {
      if (options.signal?.aborted) throw options.signal.reason;
      throw openCodeFailure(error);
    }
  }
  async close() {
    await this.ai.dispose();
  }
};
function openCodeFailure(error) {
  if (error instanceof LlmError) return error;
  const reason = error !== null && typeof error === "object" && "reason" in error ? error.reason : void 0;
  const code = reason?.classification === "context-overflow" ? CONTEXT_WINDOW_EXCEEDED_CODE : reason?._tag === "QuotaExceeded" ? QUOTA_EXCEEDED_CODE : reason?._tag === "Authentication" ? INVALID_CREDENTIAL_CODE : reason?._tag === "RateLimit" ? "RATE_LIMIT" : reason?._tag === "Network" ? "NETWORK" : "PROVIDER_ERROR";
  return new LlmError(reason?.message || (error instanceof Error ? error.message : String(error)), code, { cause: error, ...reason?.http?.status ? { status: reason.http.status } : {}, ...reason?.retryAfterMs ? { providerRetryAfterMs: reason.retryAfterMs } : {} });
}
async function toOpenCodeMessages(messages, images, signal, target) {
  const names = /* @__PURE__ */ new Map();
  const result = [];
  for (const message of messages) {
    if (message.role === "system" || message.role === "developer") continue;
    for (const b of message.content) if (b.type === "tool-call") names.set(b.id, b.name);
    if (message.role === "assistant") {
      const replay = message.source.replayState;
      if ((!target || canonicalProviderRoute(target.provider) === canonicalProviderRoute(message.source.provider) && target.model === message.source.model) && replay?.response?.adapter === "studio-opencode-v1" && replay.blocks?.length === message.content.length && replay.blocks.every((b, i) => b?.type === message.content[i].type)) {
        result.push(Message.make({ role: "assistant", content: replay.blocks }));
        continue;
      }
    }
    const content = [];
    for (const block of message.content) {
      if (block.type === "text" || block.type === "reasoning") content.push({ type: block.type, text: block.text });
      else if (block.type === "tool-call") content.push(ToolCallPart.make({ id: block.id, name: block.name, input: JSON.parse(block.arguments) }));
      else if (block.type === "image") {
        if (block.offloaded) {
          content.push(Message.text(offloadedImageText(block.attachment)));
          continue;
        }
        if (!images) throw new LlmError("\u56FE\u7247\u9644\u4EF6\u670D\u52A1\u672A\u88C5\u914D", "IMAGE_UNAVAILABLE");
        const image = await images.readImageRequest(block.attachment, { width: block.attachment.width, height: block.attachment.height, maxBytes: 20 * 1024 * 1024 }, signal);
        content.push(Message.media(Media.parseDataUrl(`data:${image.mediaType};base64,${Buffer.from(image.data).toString("base64")}`)));
      } else if (block.type === "file") throw new LlmError("\u6587\u4EF6\u9644\u4EF6\u5FC5\u987B\u5148\u7531 DSH \u89E3\u6790\u4E3A\u53EF\u8BFB\u53D6\u7684\u6587\u4EF6\u8DEF\u5F84", "UNPROJECTED_FILE");
    }
    if (message.role === "tool") {
      const text2 = content.filter((p) => p.type === "text").map((p) => p.text).join("\n");
      const media = content.some((p) => p.type === "media");
      const resultContent = content.flatMap((p) => {
        if (p.type === "text") return [{ type: "text", text: p.text }];
        if (p.type === "media") {
          const inline = p.media.inline();
          if (inline) return [{ type: "file", uri: inline.dataUrl, mime: inline.mime }];
        }
        return [];
      });
      result.push(Message.make({ role: "tool", content: [ToolResultPart.make({ id: message.toolCallId, name: names.get(message.toolCallId) ?? "tool", result: media && !message.isError ? resultContent : text2, resultType: message.isError ? "error" : media ? "content" : "text" })] }));
    } else result.push(Message.make({ role: message.role, content }));
  }
  return result;
}

// src/provider-plugin.ts
var name = "@agent-studio/plugin-opencode-provider";
var inject = ["llm", "webServer"];
var Config = z.object({ dataDir: z.string().default(path2.resolve(process.env.DSH_DATA_DIR || ".data/dsh")) });
async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile2(file, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return fallback;
  }
}
async function atomicJson(file, value) {
  const temporary = `${file}.${randomUUID2()}.tmp`;
  try {
    await writeFile2(temporary, JSON.stringify(value, null, 2), { mode: 384 });
    await rename2(temporary, file);
  } finally {
    await rm2(temporary, { force: true });
  }
}
var ProviderDirectory = class {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.root = path2.join(dataDir, "opencode", "global");
  }
  dataDir;
  root;
  hostPromise;
  refreshPromise;
  records = [];
  writeQueue = Promise.resolve();
  host() {
    return this.hostPromise ??= (async () => {
      await mkdir2(this.root, { recursive: true, mode: 448 });
      const directory = path2.join(this.root, "workspace");
      await mkdir2(directory, { recursive: true });
      return createProviderHost(this.root, directory);
    })().catch((error) => {
      this.hostPromise = void 0;
      throw error;
    });
  }
  sync() {
    return this.refreshPromise ??= this.syncNow().finally(() => {
      this.refreshPromise = void 0;
    });
  }
  async syncNow() {
    const host = await this.host();
    const [providers, models, templates, settings] = await Promise.all([
      host.api.provider.list({ location: { directory: host.directory } }),
      host.api.model.list({ location: { directory: host.directory } }),
      host.templates(),
      this.preferences()
    ]);
    const customLimits = await host.configuredModelLimits();
    const next = providers.data.flatMap((provider) => {
      const known = templates.some((template) => template.info.id === (provider.canonical ?? provider.id));
      const entries = models.data.filter((model) => model.providerID === provider.id && model.status !== "deprecated").map((model) => ({
        id: model.id,
        name: model.name,
        contextWindow: known ? model.limit.context : customLimits[`${provider.id}/${model.id}`]?.context,
        maxInputTokens: known ? model.limit.input : customLimits[`${provider.id}/${model.id}`]?.input,
        maxOutputTokens: known ? model.limit.output : customLimits[`${provider.id}/${model.id}`]?.output,
        inputModalities: [...model.capabilities.input],
        outputModalities: [...model.capabilities.output],
        reasoningLevels: model.variants.map((variant) => variant.id),
        toolCall: model.capabilities.tools,
        temperature: model.capabilities.temperature,
        metadataSource: known ? "opencode" : "custom"
      }));
      if (!entries.length) return [];
      const preferred = entries.find((model) => `${provider.id}/${model.id}` === settings.defaultModel);
      return [{
        name: provider.name,
        nativeProviderId: provider.id,
        model: preferred?.id ?? entries[0].id,
        models: entries,
        baseUrl: typeof provider.settings?.baseURL === "string" ? provider.settings.baseURL : null
      }];
    });
    if (next.length || !this.records.length) this.records = next;
  }
  listModels() {
    return this.records.map((record2) => ({ ...record2, models: record2.models.map((model) => ({ ...model })) }));
  }
  async preferences() {
    await mkdir2(this.root, { recursive: true });
    return readJson(path2.join(this.root, "settings.json"), { hidden: [], defaultModel: null });
  }
  async updateSettings(patch) {
    await this.host();
    const next = this.writeQueue.then(async () => atomicJson(path2.join(this.root, "settings.json"), { ...await this.preferences(), ...patch }));
    this.writeQueue = next.catch(() => {
    });
    await next;
  }
  async setVisibility(hidden) {
    await this.updateSettings({ hidden });
  }
  async setDefault(providerID, modelID) {
    await this.sync();
    if (!this.records.some((provider) => provider.nativeProviderId === providerID && provider.models.some((model) => model.id === modelID))) throw new Error("\u6A21\u578B\u4E0D\u53EF\u7528");
    await this.updateSettings({ defaultModel: `${providerID}/${modelID}` });
  }
  async defaultSelection() {
    const preferred = (await this.preferences()).defaultModel;
    const provider = this.records.find((item) => item.models.some((model) => `${item.nativeProviderId}/${model.id}` === preferred)) ?? this.records[0];
    if (!provider) return null;
    return { provider: `opencode:${provider.nativeProviderId}`, model: provider.models.find((model) => `${provider.nativeProviderId}/${model.id}` === preferred)?.id ?? provider.model };
  }
  async close() {
    await this.writeQueue;
    await (await this.hostPromise)?.close();
  }
};
function json(res, value, status = 200) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(value));
}
async function requestBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 2 * 1024 * 1024) throw new Error("\u8BF7\u6C42\u8D85\u8FC7 2MB");
    chunks.push(Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : void 0;
}
function sameOrigin(req) {
  if (req.headers["sec-fetch-site"] === "cross-site") return false;
  if (!req.headers.origin) return true;
  try {
    return new URL(req.headers.origin).host === req.headers.host;
  } catch {
    return false;
  }
}
function registerProviderRoutes(ctx, server, core, refresh) {
  const handler = async (req, res) => {
    if (!sameOrigin(req)) return json(res, { message: "\u8DE8\u7AD9\u8BF7\u6C42\u5DF2\u62D2\u7EDD" }, 403);
    try {
      const url = new URL(req.url ?? "/", "http://dsh.local");
      const match = /^\/api\/v1\/(?:models|projects\/[^/]+)\/(provider-settings(?:\/[^/]+)?|opencode\/(.*))$/.exec(url.pathname);
      if (!match) return json(res, { message: "Not found" }, 404);
      const data = req.method === "GET" || req.method === "HEAD" ? void 0 : await requestBody(req);
      const host = await core.host();
      if (match[2] !== void 0) {
        if (!/^api\/(integration|credential|provider|model|form|config)(?:\/|$)/.test(match[2])) return json(res, { message: "Not found" }, 404);
        url.pathname = `/${match[2]}`;
        const response = await host.fetch(url, { method: req.method, headers: { "content-type": "application/json" }, ...data ? { body: JSON.stringify(data) } : {} });
        res.writeHead(response.status, { "content-type": response.headers.get("content-type") ?? "application/json", "cache-control": "no-store" });
        if (response.body) for await (const chunk of response.body) {
          if (res.destroyed) break;
          res.write(chunk);
        }
        res.end();
        if (response.ok && req.method !== "GET") void refresh().catch(() => {
        });
        return;
      }
      const action = match[1];
      if (action === "provider-settings/models" && req.method === "GET") return json(res, await readProviderModels(host, url.searchParams.get("providerID") ?? ""));
      if (action === "provider-settings" && req.method === "GET") {
        await refresh();
        return json(res, { directory: host.directory, templateIDs: (await host.templates()).map((provider) => provider.info.id), modelLimits: await host.configuredModelLimits(), ...await core.preferences() });
      }
      if (req.method !== "POST") return json(res, { message: "Method not allowed" }, 405);
      if (action === "provider-settings/discover") {
        const abort = new AbortController();
        const disconnected = () => abort.abort();
        res.once("close", disconnected);
        try {
          return json(res, data?.providerID ? await discoverSavedProvider(host, String(data.providerID), abort.signal) : await discoverProvider(data, (await host.templates()).flatMap((provider) => provider.models), abort.signal));
        } finally {
          res.off("close", disconnected);
        }
      }
      if (action === "provider-settings/models") return json(res, await saveProviderModels(host, { providerID: String(data?.providerID ?? ""), revision: String(data?.revision ?? ""), models: data?.models }));
      if (action === "provider-settings/refresh") await host.refresh();
      else if (action === "provider-settings/visibility") {
        if (!Array.isArray(data?.hidden) || !data.hidden.every((value) => typeof value === "string")) return json(res, { message: "hidden \u5FC5\u987B\u662F\u6A21\u578B ID \u5217\u8868" }, 400);
        await core.setVisibility(data.hidden);
      } else if (action === "provider-settings/default") {
        const providerID = String(data?.providerID ?? ""), modelID = String(data?.modelID ?? "");
        await core.setDefault(providerID, modelID);
        const defaults = ctx.get("agentDefaultModel");
        await defaults?.saveSelection({ provider: `opencode:${providerID}`, model: modelID });
      } else if (action === "provider-settings/custom") {
        if (!/^[\w.-]+$/.test(data?.providerID ?? "") || !/^https?:\/\//.test(data?.config?.options?.baseURL ?? "") || !data?.config?.models || !Object.keys(data.config.models).length || !String(data?.name ?? "").trim()) return json(res, { message: "\u81EA\u5B9A\u4E49\u63D0\u4F9B\u5546\u914D\u7F6E\u4E0D\u5B8C\u6574" }, 400);
        validateModelEdits(Object.entries(data.config.models).map(([id, value]) => ({ id, context: value?.limit?.context || null, output: value?.limit?.output || null })));
        await host.configure(data.providerID, { ...data.config, name: data.name });
        if (data.key) await host.api.integration.connect.key({ integrationID: data.providerID, key: data.key, location: { directory: host.directory } });
      } else return json(res, { message: "Not found" }, 404);
      await refresh();
      return json(res, { ok: true });
    } catch (error) {
      if (!res.destroyed) json(res, { message: error instanceof Error ? error.message : "\u8BF7\u6C42\u5931\u8D25" }, String(error).includes("MODEL_CONFIG_CONFLICT") ? 409 : 400);
    }
  };
  for (const route of ["/api/v1/models", "/api/v1/projects"]) ctx.effect(() => server.register({ kind: "prefix", path: route, handler }), `OpenCode provider routes: ${route}`);
}
async function apply(ctx, config) {
  const core = new ProviderDirectory(config.dataDir);
  const store = { listProjects: () => [] };
  const adapter = new OpenCodeDshAdapter(core, store, () => ctx.get("attachments"));
  const llm = ctx.get("llm");
  let registration;
  let pending;
  const refresh = () => pending ??= (async () => {
    const routes = await adapter.refresh();
    if (registration) registration.replace(routes);
    else if (routes.length) registration = llm.registerAdapter(routes, adapter);
    const defaults = ctx.get("agentDefaultModel");
    if (defaults && routes.length && !routes.includes(defaults.currentSelection().provider)) {
      const selection = await core.defaultSelection();
      if (selection) void defaults.saveSelection(selection).catch(() => {
      });
    }
  })().finally(() => {
    pending = void 0;
  });
  ctx.effect(() => async () => {
    registration?.();
    await adapter.close();
    await core.close();
  }, "OpenCode provider lifecycle");
  ctx.inject(["webServer"], (child) => registerProviderRoutes(child, child.get("webServer"), core, refresh));
  try {
    await refresh();
  } catch (error) {
    ctx.logger?.warn?.("OpenCode provider initialization failed", { error: String(error) });
  }
}
export {
  Config,
  apply,
  inject,
  name
};
