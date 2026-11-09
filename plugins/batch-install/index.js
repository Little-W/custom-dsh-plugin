import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);

// src/plugin-batch-install.ts
import { lstat, readFile, readdir, realpath } from "node:fs/promises";
import path from "node:path";
function reply(res, body2, status = 200) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body2));
}
function isTrusted(req) {
  if (req.headers["sec-fetch-site"] === "cross-site") return false;
  if (!req.headers.origin) return true;
  try {
    return new URL(req.headers.origin).host === req.headers.host;
  } catch {
    return false;
  }
}
async function body(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += Buffer.byteLength(chunk);
    if (size > 64 * 1024) throw new Error("\u8BF7\u6C42\u6570\u636E\u8FC7\u5927");
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}
function inside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}
async function scanDirectory(requested, installedNames) {
  if (typeof requested !== "string" || !requested.trim()) throw new Error("\u8BF7\u9009\u62E9\u63D2\u4EF6\u76EE\u5F55");
  const directory = await realpath(path.resolve(requested.replace(/^~(?=$|[\\/])/, process.env.HOME || process.cwd())));
  const rootStat = await lstat(directory);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) throw new Error("\u6240\u9009\u8DEF\u5F84\u4E0D\u662F\u6709\u6548\u7684\u63D2\u4EF6\u76EE\u5F55");
  const candidates = [];
  const seenNames = /* @__PURE__ */ new Set();
  const entries = (await readdir(directory, { withFileTypes: true })).filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const packageDirectory = path.join(directory, entry.name);
    const manifestPath = path.join(packageDirectory, "package.json");
    let manifest;
    try {
      const stat = await lstat(manifestPath);
      if (!stat.isFile() || stat.isSymbolicLink()) continue;
      manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    } catch {
      continue;
    }
    const name2 = typeof manifest.name === "string" ? manifest.name : "";
    const version = typeof manifest.version === "string" ? manifest.version : "";
    const bundlePatch = manifest.dsh?.bundle?.patch;
    let reason;
    if (!/^(?:@[a-zA-Z0-9._-]+\/)?[a-zA-Z0-9._-]+$/.test(name2)) reason = "package.json \u7F3A\u5C11\u6709\u6548\u7684\u63D2\u4EF6\u540D\u79F0";
    else if (!version) reason = "package.json \u7F3A\u5C11\u7248\u672C\u53F7";
    else if (typeof manifest.deprecated === "string" && manifest.deprecated.trim()) reason = `\u63D2\u4EF6\u5DF2\u505C\u7528\uFF1A${manifest.deprecated}`;
    else if (seenNames.has(name2)) reason = "\u76EE\u5F55\u4E2D\u5B58\u5728\u540C\u540D\u63D2\u4EF6";
    else if (typeof bundlePatch !== "string" || !bundlePatch.trim()) reason = "\u672A\u58F0\u660E DSH \u63D2\u4EF6\u914D\u7F6E";
    else {
      const patchPath = path.resolve(packageDirectory, bundlePatch);
      if (!inside(packageDirectory, patchPath)) reason = "\u63D2\u4EF6\u914D\u7F6E\u6587\u4EF6\u8DEF\u5F84\u8D85\u51FA\u63D2\u4EF6\u76EE\u5F55";
      else {
        try {
          const [realPackage, realPatch, patchStat] = await Promise.all([realpath(packageDirectory), realpath(patchPath), lstat(patchPath)]);
          if (!inside(realPackage, realPatch) || !patchStat.isFile()) reason = "\u627E\u4E0D\u5230\u6709\u6548\u7684 DSH \u63D2\u4EF6\u914D\u7F6E\u6587\u4EF6";
        } catch {
          reason = "\u627E\u4E0D\u5230\u6709\u6548\u7684 DSH \u63D2\u4EF6\u914D\u7F6E\u6587\u4EF6";
        }
      }
    }
    if (name2) seenNames.add(name2);
    candidates.push({ name: name2 || entry.name, version, path: packageDirectory, installable: !reason, installed: name2 ? installedNames.has(name2) : false, ...reason ? { reason } : {} });
  }
  return { directory, candidates: candidates.sort((a, b) => a.name.localeCompare(b.name)) };
}
var name = "\u63D2\u4EF6\u6279\u91CF\u5B89\u88C5\u5DE5\u5177";
var inject = ["webServer", "pluginManager"];
function apply(ctx) {
  const server = ctx.get("webServer");
  const manager = ctx.get("pluginManager");
  const handler = async (req, res) => {
    if (!isTrusted(req)) return reply(res, { message: "\u8DE8\u7AD9\u8BF7\u6C42\u5DF2\u62D2\u7EDD" }, 403);
    try {
      const endpoint = new URL(req.url ?? "/", "http://localhost").pathname;
      if (req.method !== "POST" || !["/studio/plugin-batch-install/scan", "/studio/plugin-batch-install/install"].includes(endpoint)) return reply(res, { message: "Not found" }, 404);
      const data = await body(req);
      const installedNames = new Set((await manager.listBundles()).map((bundle) => bundle.name));
      const { directory, candidates } = await scanDirectory(data.directory, installedNames);
      const installable = candidates.filter((candidate) => candidate.installable && !candidate.installed);
      if (endpoint.endsWith("/scan")) return reply(res, { directory, candidates, installCount: installable.length });
      if (!installable.length) return reply(res, { directory, results: [], message: "\u6CA1\u6709\u5F85\u5B89\u88C5\u7684\u6709\u6548\u63D2\u4EF6\u3002" });
      const results = [];
      for (const candidate of installable) {
        try {
          const result = await manager.installBundle(candidate.path, { enabled: true });
          if (result.application === "failed" || result.application === "cancelled") {
            results.push({ name: candidate.name, status: "failed", message: result.error?.message || result.packageResult?.output || `\u5B89\u88C5\u672A\u5B8C\u6210\uFF1A${result.application}` });
          } else {
            results.push({ name: candidate.name, status: "installed", message: result.application === "restart-required" ? "\u5DF2\u5B89\u88C5\u5E76\u542F\u7528\uFF0C\u91CD\u542F\u540E\u751F\u6548" : "\u5DF2\u5B89\u88C5\u5E76\u542F\u7528" });
          }
        } catch (error) {
          results.push({ name: candidate.name, status: "failed", message: error instanceof Error ? error.message : String(error) });
        }
      }
      return reply(res, { directory, results, installed: results.filter((result) => result.status === "installed").length, failed: results.filter((result) => result.status === "failed").length });
    } catch (error) {
      return reply(res, { message: error instanceof Error ? error.message : String(error) }, 400);
    }
  };
  ctx.effect(() => server.register({ kind: "prefix", path: "/studio/plugin-batch-install", handler }), "plugin batch install: API");
}
export {
  apply,
  inject,
  name
};
