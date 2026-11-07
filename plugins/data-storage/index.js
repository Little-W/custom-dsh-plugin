// src/data-storage-plugin.ts
import { createWriteStream, existsSync } from "node:fs";
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rename, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
var STATE_FILE = ".agent-studio-data-location.json";
var LEFTOVERS = ".agent-studio-data-leftovers";
var BOOTSTRAP_ENTRIES = /* @__PURE__ */ new Set(["profiles", "bin", ".env", "studio-runtime.patch.yml", STATE_FILE, LEFTOVERS]);
var MAX_RESTORE_BYTES = 8 * 1024 * 1024 * 1024;
function dshHome() {
  return path.resolve(process.env.DSH_HOME || path.join(process.env.HOME || process.cwd(), ".dsh"));
}
function reply(res, value, status = 200) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(value));
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
async function readState(home) {
  try {
    const value = JSON.parse(await readFile(path.join(home, STATE_FILE), "utf8"));
    const validEntries = Array.isArray(value?.entries) && value.entries.every((name2) => typeof name2 === "string" && name2.length > 0 && path.basename(name2) === name2 && name2 !== "." && name2 !== ".." && !BOOTSTRAP_ENTRIES.has(name2));
    return value?.version === 1 && value.home === home && path.isAbsolute(value.target) && validEntries && ["prepared", "active"].includes(value.phase) ? value : void 0;
  } catch (error) {
    if (error.code === "ENOENT") return void 0;
    throw error;
  }
}
async function saveState(home, value) {
  const temporary = path.join(home, `${STATE_FILE}.tmp`);
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}
`, { mode: 384 });
  await rename(temporary, path.join(home, STATE_FILE));
}
function overlaps(a, b) {
  const relative = path.relative(a, b);
  return relative === "" || !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}
async function assertSeparateDirectory(home, requested) {
  if (!requested.trim()) throw new Error("\u8BF7\u9009\u62E9\u6570\u636E\u76EE\u5F55");
  const target = path.resolve(requested.replace(/^~(?=$|[\\/])/, process.env.HOME || process.cwd()));
  await mkdir(target, { recursive: true });
  const [realHome, realTarget] = await Promise.all([realpath(home), realpath(target)]);
  if (overlaps(realHome, realTarget) || overlaps(realTarget, realHome)) throw new Error("\u6570\u636E\u76EE\u5F55\u4E0D\u80FD\u4E0E DSH_HOME \u91CD\u53E0\uFF0C\u8BF7\u9009\u62E9\u5176\u4ED6\u4F4D\u7F6E");
  return realTarget;
}
async function currentEntries(home) {
  return (await readdir(home)).filter((name2) => !BOOTSTRAP_ENTRIES.has(name2)).sort();
}
async function sameLink(source, target) {
  try {
    return (await lstat(source)).isSymbolicLink() && await realpath(source) === target;
  } catch {
    return false;
  }
}
async function linkToTarget(source, destination) {
  const destinationStat = await lstat(destination);
  const type = process.platform !== "win32" ? "dir" : destinationStat.isDirectory() ? "junction" : "file";
  await symlink(destination, source, type);
}
async function linkEntry(home, target, name2, migrationId) {
  const source = path.join(home, name2), destination = path.join(target, name2);
  if (await sameLink(source, destination)) return;
  let sourceExists = true;
  try {
    await lstat(source);
  } catch (error) {
    if (error.code === "ENOENT") sourceExists = false;
    else throw error;
  }
  let destinationExists = true;
  try {
    await lstat(destination);
  } catch (error) {
    if (error.code === "ENOENT") destinationExists = false;
    else throw error;
  }
  if (sourceExists && !destinationExists) await cp(source, destination, { recursive: true, force: false, errorOnExist: true, dereference: true, preserveTimestamps: true });
  else if (sourceExists && destinationExists) {
    const sourceIsLink = (await lstat(source)).isSymbolicLink();
    if (!sourceIsLink) await cp(source, destination, { recursive: true, force: true, dereference: true, preserveTimestamps: true });
  }
  if (sourceExists) {
    const leftovers2 = path.join(home, LEFTOVERS, migrationId);
    await mkdir(leftovers2, { recursive: true });
    const backup = path.join(leftovers2, name2);
    await rename(source, backup);
  }
  await mkdir(path.dirname(source), { recursive: true });
  await linkToTarget(source, destination);
}
async function switchEntry(home, target, name2, migrationId) {
  const source = path.join(home, name2), destination = path.join(target, name2);
  if (await sameLink(source, destination)) return;
  let sourceExists = true;
  try {
    await lstat(source);
  } catch (error) {
    if (error.code === "ENOENT") sourceExists = false;
    else throw error;
  }
  if (sourceExists) {
    const backup = path.join(home, LEFTOVERS, migrationId, name2);
    await mkdir(path.dirname(backup), { recursive: true });
    await rename(source, backup);
  }
  await linkToTarget(source, destination);
}
async function mergeMissingTree(source, destination) {
  let sourceStat;
  try {
    sourceStat = await lstat(source);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  let destinationStat;
  try {
    destinationStat = await lstat(destination);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (!destinationStat) {
    await cp(source, destination, { recursive: true, force: false, errorOnExist: true, dereference: true, preserveTimestamps: true });
    return;
  }
  if (sourceStat.isDirectory() && !sourceStat.isSymbolicLink() && destinationStat.isDirectory() && !destinationStat.isSymbolicLink()) {
    for (const name2 of await readdir(source)) await mergeMissingTree(path.join(source, name2), path.join(destination, name2));
  }
}
async function activate(state) {
  const checkedTarget = await assertSeparateDirectory(state.home, state.target);
  if (checkedTarget !== state.target) throw new Error("\u6570\u636E\u76EE\u5F55\u8DEF\u5F84\u5DF2\u53D1\u751F\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u6570\u636E\u76EE\u5F55");
  await mkdir(state.target, { recursive: true });
  const migrationId = state.updatedAt.replace(/[:.]/g, "-");
  for (const name2 of state.entries) {
    if (state.mode === "merge") {
      await mergeMissingTree(path.join(state.home, name2), path.join(state.target, name2));
      await switchEntry(state.home, state.target, name2, migrationId);
    } else if (state.mode === "switch") await switchEntry(state.home, state.target, name2, migrationId);
    else await linkEntry(state.home, state.target, name2, migrationId);
  }
  const active = { ...state, phase: "active", restartPending: true, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
  await saveState(state.home, active);
  return active;
}
async function setStorageLocation(home, requested) {
  const target = await assertSeparateDirectory(home, requested);
  const current = await readState(home);
  if (current?.target === target && current.phase === "active") return current;
  const names = await currentEntries(home);
  const realTarget = await realpath(target);
  if (!current || current.target !== target) {
    const contents = await readdir(target);
    if (contents.length) throw new Error("\u6240\u9009\u76EE\u5F55\u4E0D\u662F\u7A7A\u76EE\u5F55\u3002\u8BF7\u9009\u4E00\u4E2A\u65B0\u76EE\u5F55\uFF0C\u907F\u514D\u8986\u76D6\u5176\u4E2D\u5DF2\u6709\u6570\u636E\u3002");
  }
  const state = { version: 1, home, target: realTarget, entries: current?.target === target ? current.entries : names, mode: "copy", phase: "prepared", updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
  await saveState(home, state);
  return activate(state);
}
async function switchStorageLocation(home, requested) {
  const target = await assertSeparateDirectory(home, requested);
  const current = await readState(home);
  if (current?.target === target && current.phase === "active") return current;
  const [sourceNames, targetNames] = await Promise.all([currentEntries(home), readdir(target)]);
  const targetSet = new Set(targetNames.filter((name2) => !BOOTSTRAP_ENTRIES.has(name2)));
  if (targetSet.size === 0) throw new Error("\u6240\u9009\u76EE\u5F55\u4E2D\u6CA1\u6709\u53EF\u5207\u6362\u7684\u6570\u636E\uFF0C\u8BF7\u9009\u62E9\u5DF2\u6709 DSH \u6570\u636E\u7684\u76EE\u5F55");
  const missing = sourceNames.filter((name2) => !targetSet.has(name2));
  if (missing.length) throw new Error(`\u76EE\u6807\u76EE\u5F55\u7F3A\u5C11\u5F53\u524D\u6570\u636E\u9879\uFF1A${missing.join("\u3001")}\u3002\u4E3A\u907F\u514D\u5207\u6362\u540E\u6570\u636E\u4E0D\u5B8C\u6574\uFF0C\u8BF7\u9009\u62E9\u5305\u542B\u8FD9\u4E9B\u6570\u636E\u7684\u76EE\u5F55\u3002`);
  const entries = [.../* @__PURE__ */ new Set([...sourceNames, ...targetSet])].sort();
  const state = { version: 1, home, target, entries, mode: "switch", phase: "prepared", updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
  await saveState(home, state);
  return activate(state);
}
async function mergeMissingStorageData(home, requested) {
  const target = await assertSeparateDirectory(home, requested);
  const current = await readState(home);
  if (current?.target === target && current.phase === "active") return current;
  const [sourceNames, targetNames] = await Promise.all([currentEntries(home), readdir(target)]);
  const targetSet = new Set(targetNames.filter((name2) => !BOOTSTRAP_ENTRIES.has(name2)));
  if (targetSet.size === 0) throw new Error("\u6240\u9009\u76EE\u5F55\u4E2D\u6CA1\u6709\u53EF\u5408\u5E76\u7684\u6570\u636E\uFF0C\u8BF7\u9009\u62E9\u5DF2\u6709 DSH \u6570\u636E\u7684\u76EE\u5F55");
  const entries = [.../* @__PURE__ */ new Set([...sourceNames, ...targetSet])].sort();
  const state = { version: 1, home, target, entries, mode: "merge", phase: "prepared", updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
  await saveState(home, state);
  return activate(state);
}
async function leftovers(home) {
  try {
    return await readdir(path.join(home, LEFTOVERS));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}
async function clearStorageLeftovers(home) {
  const root = path.join(home, LEFTOVERS);
  const resolvedHome = path.resolve(home);
  const resolvedRoot = path.resolve(root);
  if (!overlaps(resolvedHome, resolvedRoot) || resolvedHome === resolvedRoot) throw new Error("\u6E05\u7406\u8DEF\u5F84\u6821\u9A8C\u5931\u8D25");
  try {
    if ((await lstat(root)).isSymbolicLink()) throw new Error("\u6E05\u7406\u76EE\u5F55\u6821\u9A8C\u5931\u8D25");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  await rm(root, { recursive: true, force: true });
}
function runTar(args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn("tar", args, { cwd: opts.cwd, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "", stderr = "", bytes = 0;
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      bytes += Buffer.byteLength(chunk);
      if (bytes > (opts.maxOutput ?? 64 * 1024 * 1024)) child.kill("SIGTERM");
      else stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.once("error", reject);
    child.once("close", (code) => code === 0 ? resolve(stdout) : reject(new Error(stderr.trim() || `tar exited ${code}`)));
    if (opts.input) opts.input.pipe(child.stdin);
    else child.stdin.end();
    if (opts.output) child.stdout.pipe(opts.output);
  });
}
function validateStorageArchiveListing(lines, home) {
  for (const line of lines) {
    if (!line) continue;
    const normalized = line.replace(/^\.\//, "").replace(/\/$/, "");
    if (path.posix.isAbsolute(normalized) || /^[A-Za-z]:/.test(normalized) || normalized.includes("\\") || normalized.split("/").some((part) => part === "..")) throw new Error("\u5907\u4EFD\u5305\u5305\u542B\u8D8A\u754C\u8DEF\u5F84\uFF0C\u5DF2\u62D2\u7EDD\u6062\u590D");
    const resolved = path.resolve(home, ...normalized.split("/"));
    if (!overlaps(home, resolved)) throw new Error("\u5907\u4EFD\u5305\u5305\u542B\u8D8A\u754C\u8DEF\u5F84\uFF0C\u5DF2\u62D2\u7EDD\u6062\u590D");
    if (/(^|\/)node_modules(\/|$)/.test(normalized)) throw new Error("\u5907\u4EFD\u5305\u8BD5\u56FE\u8986\u76D6\u63D2\u4EF6\u4F9D\u8D56\uFF0C\u5DF2\u62D2\u7EDD\u6062\u590D");
  }
}
async function validateArchive(file, home) {
  const listing = await runTar(["-tzf", file]);
  validateStorageArchiveListing(listing.split("\n"), home);
  const verbose = await runTar(["-tvzf", file]);
  for (const line of verbose.split("\n")) {
    if (!line) continue;
    if (!["d", "-"].includes(line[0] ?? "")) throw new Error("\u5907\u4EFD\u5305\u5305\u542B\u7B26\u53F7\u94FE\u63A5\u6216\u7279\u6B8A\u6587\u4EF6\uFF0C\u5DF2\u62D2\u7EDD\u6062\u590D");
  }
}
async function saveUpload(req, file) {
  let bytes = 0;
  const guard = async function* () {
    for await (const chunk of req) {
      bytes += Buffer.byteLength(chunk);
      if (bytes > MAX_RESTORE_BYTES) throw new Error("\u5907\u4EFD\u5305\u8D85\u8FC7 8 GiB\uFF0C\u65E0\u6CD5\u6062\u590D");
      yield chunk;
    }
  };
  await pipeline(guard(), createWriteStream(file, { mode: 384 }));
}
var name = "dsh-data-storage";
var inject = ["webServer"];
function apply(ctx) {
  const server = ctx.get("webServer");
  const home = dshHome();
  const startup = readState(home).then(async (state) => {
    if (state?.phase === "prepared") await activate(state);
    else if (state?.phase === "active" && state.restartPending) await saveState(home, { ...state, restartPending: false, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
  });
  const handler = async (req, res) => {
    if (!isTrusted(req)) return reply(res, { message: "\u8DE8\u7AD9\u8BF7\u6C42\u5DF2\u62D2\u7EDD" }, 403);
    const endpoint = new URL(req.url ?? "/", "http://localhost").pathname;
    try {
      await startup;
      if (endpoint === "/studio/data-storage/status" && req.method === "GET") {
        const state = await readState(home);
        return reply(res, { home, directory: state?.target ?? home, relocated: !!state && state.phase === "active", restartRequired: state?.phase === "prepared" || !!state?.restartPending, leftovers: await leftovers(home) });
      }
      if (endpoint === "/studio/data-storage/location" && req.method === "POST") {
        const body = await reqBody(req);
        const directory = String(body.directory ?? "");
        const state = body.mode === "switch" ? await switchStorageLocation(home, directory) : body.mode === "merge" ? await mergeMissingStorageData(home, directory) : await setStorageLocation(home, directory);
        return reply(res, { ok: true, directory: state.target, restartRequired: true, leftovers: await leftovers(home) });
      }
      if (endpoint === "/studio/data-storage/restart" && req.method === "POST") {
        const root = [process.env.AGENT_STUDIO_ROOT, process.cwd(), path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")].filter((value) => !!value).map((value) => path.resolve(value)).find((value) => existsSync(path.join(value, "restart.sh")));
        if (process.platform === "win32" || !root) return reply(res, { message: "\u5F53\u524D\u542F\u52A8\u65B9\u5F0F\u4E0D\u652F\u6301\u4ECE\u9875\u9762\u91CD\u542F\uFF0C\u8BF7\u5728\u7EC8\u7AEF\u91CD\u542F DSH\u3002" }, 501);
        const argument = (name2) => {
          const index = process.argv.indexOf(name2);
          return index >= 0 ? process.argv[index + 1] : void 0;
        };
        const rawPort = process.env.STUDIO_PORT || argument("--port") || "8787";
        const port = /^\d{1,5}$/.test(rawPort) && Number(rawPort) > 0 && Number(rawPort) <= 65535 ? rawPort : "8787";
        const requestedHost = process.env.STUDIO_HOST || argument("--host") || "127.0.0.1";
        const host = /^[A-Za-z0-9.:[\]-]+$/.test(requestedHost) ? requestedHost : "127.0.0.1";
        res.once("finish", () => setTimeout(() => {
          const child = spawn("bash", [path.join(root, "restart.sh"), "--fast", "--no-open", "--port", port, "--host", host], {
            cwd: root,
            detached: true,
            stdio: "ignore",
            env: { ...process.env, STUDIO_PORT: port, STUDIO_HOST: host }
          });
          child.once("error", (error) => ctx.logger.warn(`\u65E0\u6CD5\u542F\u52A8 DSH \u91CD\u542F\u811A\u672C\uFF1A${String(error)}`));
          child.unref();
        }, 150));
        return reply(res, { restarting: true, message: "DSH \u6B63\u5728\u91CD\u542F\uFF0C\u9875\u9762\u4F1A\u77ED\u6682\u65AD\u5F00\uFF1B\u670D\u52A1\u6062\u590D\u540E\u5373\u53EF\u7EE7\u7EED\u3002" }, 202);
      }
      if (endpoint === "/studio/data-storage/cleanup" && req.method === "POST") {
        const state = await readState(home);
        if (state?.restartPending || state?.phase === "prepared") throw new Error("\u8BF7\u5148\u91CD\u542F DSH\uFF0C\u5E76\u786E\u8BA4\u65B0\u76EE\u5F55\u53EF\u4EE5\u6B63\u5E38\u52A0\u8F7D\u540E\u518D\u6E05\u7406\u65E7\u6570\u636E");
        await clearStorageLeftovers(home);
        return reply(res, { ok: true, leftovers: [] });
      }
      if (endpoint === "/studio/data-storage/backup" && req.method === "GET") {
        res.writeHead(200, { "content-type": "application/gzip", "content-disposition": `attachment; filename="dsh-data-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.tar.gz"`, "cache-control": "no-store" });
        const child = spawn("tar", ["-czhf", "-", "--exclude=./profiles/*/node_modules", `--exclude=./${LEFTOVERS}`, "-C", home, "."]);
        child.stderr.on("data", (chunk) => ctx.logger.warn(`\u5907\u4EFD\u5F52\u6863\u8B66\u544A\uFF1A${String(chunk)}`));
        child.once("error", (error) => {
          if (!res.headersSent) reply(res, { message: `\u65E0\u6CD5\u542F\u52A8 tar\uFF1A${error.message}` }, 500);
          else res.destroy(error);
        });
        child.once("close", (code) => {
          if (code && !res.destroyed) res.destroy(new Error(`tar exited ${code}`));
        });
        child.stdout.pipe(res);
        return;
      }
      if (endpoint === "/studio/data-storage/restore" && req.method === "POST") {
        const scratch = await mkdtemp(path.join(tmpdir(), "dsh-restore-"));
        const archive = path.join(scratch, "restore.tar.gz");
        try {
          await saveUpload(req, archive);
          await validateArchive(archive, home);
          await runTar(["-xzf", archive, "-C", home, "--no-same-owner", "--no-same-permissions"]);
          return reply(res, { ok: true, message: "\u5907\u4EFD\u6570\u636E\u5DF2\u6062\u590D\u3002\u8BF7\u91CD\u542F DSH \u4EE5\u91CD\u65B0\u52A0\u8F7D\u5168\u90E8\u6570\u636E\u3002", restartRequired: true });
        } finally {
          await rm(scratch, { recursive: true, force: true });
        }
      }
      return reply(res, { message: "Not found" }, 404);
    } catch (error) {
      return reply(res, { message: error instanceof Error ? error.message : String(error) }, 400);
    }
  };
  ctx.effect(() => server.register({ kind: "prefix", path: "/studio/data-storage", handler }), "dsh data storage: API");
  startup.catch((error) => ctx.logger.error(`\u6570\u636E\u76EE\u5F55\u8FC1\u79FB\u672A\u5B8C\u6210\uFF1A${String(error)}`));
}
async function reqBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += Buffer.byteLength(chunk);
    if (size > 64 * 1024) throw new Error("\u8BF7\u6C42\u6570\u636E\u8FC7\u5927");
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}
export {
  apply,
  clearStorageLeftovers,
  inject,
  mergeMissingStorageData,
  name,
  setStorageLocation,
  switchStorageLocation,
  validateStorageArchiveListing
};
