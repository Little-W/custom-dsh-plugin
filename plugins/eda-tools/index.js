// apps/dsh/src/eda/plugin.ts
import * as mcp from "@deepseek-ai/dsh-mcp-client";
import z from "@deepseek-ai/schemastery";
import { fileURLToPath } from "node:url";
import path2 from "node:path";

// apps/dsh/src/eda/activity.ts
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
async function activeEdaJobs(jobsDir, sessionId) {
  let entries;
  try {
    entries = await readdir(jobsDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const ids = [];
  for (const entry of entries) {
    let directory;
    if (entry.isDirectory() && /^[0-9a-f-]{36}$/i.test(entry.name)) directory = path.join(jobsDir, entry.name);
    else if (entry.isFile() && /^[0-9a-f-]{36}\.location\.json$/i.test(entry.name)) directory = JSON.parse(await readFile(path.join(jobsDir, entry.name), "utf8")).directory;
    else continue;
    let job;
    try {
      job = JSON.parse(await readFile(path.join(directory, "job.json"), "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    if (job.ownerSessionId !== sessionId || job.status !== "running") continue;
    try {
      process.kill(job.ownerPid, 0);
      ids.push(job.id);
    } catch (error) {
      if (error.code !== "ESRCH") ids.push(job.id);
    }
  }
  return ids;
}

// apps/dsh/src/eda/plugin.ts
var name = "EDA MCP Tool";
var inject = ["tools"];
var Config = z.object({
  jobsDir: z.string().default(path2.resolve(process.env.STUDIO_DATA_DIR || ".data", "eda-jobs")).description("\u4F5C\u4E1A\u7D22\u5F15\u53CA\u65E0\u4F1A\u8BDD\u8C03\u7528\u7684\u5907\u7528\u76EE\u5F55\u3002\u4F1A\u8BDD\u5185\u7684\u5B9E\u9645\u811A\u672C\u3001\u65E5\u5FD7\u548C\u62A5\u544A\u4FDD\u5B58\u5728\u5DE5\u4F5C\u76EE\u5F55\u7684 eda-jobs \u4E0B\u3002"),
  dcShell: z.string().default("dc_shell").description("Synopsys Design Compiler \u53EF\u6267\u884C\u6587\u4EF6\u6216 PATH \u4E2D\u7684\u547D\u4EE4\uFF1B\u4E0D\u4F7F\u7528 Yosys \u66FF\u4EE3\u3002"),
  dcEnabled: z.boolean().default(true).description("\u542F\u7528 Design Compiler"),
  vcs: z.string().default("vcs").description("VCS \u4EFF\u771F\u547D\u4EE4"),
  vcsEnabled: z.boolean().default(true).description("\u542F\u7528 VCS"),
  verilator: z.string().default("verilator").description("Verilator \u547D\u4EE4"),
  verilatorEnabled: z.boolean().default(true).description("\u542F\u7528 Verilator"),
  iverilog: z.string().default("iverilog").description("Icarus Verilog \u7F16\u8BD1\u547D\u4EE4\uFF08\u9ED8\u8BA4\u5173\u95ED\uFF0C\u9700\u663E\u5F0F\u542F\u7528\uFF09"),
  vvp: z.string().default("vvp").description("Icarus Verilog \u4EFF\u771F\u547D\u4EE4\uFF08\u9ED8\u8BA4\u5173\u95ED\uFF0C\u9700\u663E\u5F0F\u542F\u7528\uFF09"),
  vcStatic: z.string().default("vc_static").description("VC Static \u9759\u6001\u68C0\u67E5\u547D\u4EE4"),
  vcFormal: z.string().default("vc_formal").description("VC Formal \u5F62\u5F0F\u9A8C\u8BC1\u547D\u4EE4"),
  innovus: z.string().default("innovus").description("Innovus \u7269\u7406\u5B9E\u73B0\u547D\u4EE4"),
  iverilogEnabled: z.boolean().default(false).description("\u542F\u7528 Icarus Verilog \u7F16\u8BD1"),
  vvpEnabled: z.boolean().default(false).description("\u542F\u7528 vvp \u4EFF\u771F"),
  vcStaticEnabled: z.boolean().default(false).description("\u542F\u7528 VC Static"),
  vcFormalEnabled: z.boolean().default(false).description("\u542F\u7528 VC Formal"),
  innovusEnabled: z.boolean().default(false).description("\u542F\u7528 Innovus"),
  ptShell: z.string().default("pt_shell").description("PrimeTime \u547D\u4EE4"),
  ptEnabled: z.boolean().default(true).description("\u542F\u7528 PrimeTime"),
  sta: z.string().default("sta").description("OpenSTA \u547D\u4EE4"),
  staEnabled: z.boolean().default(true).description("\u542F\u7528 OpenSTA"),
  maxConcurrent: z.number().min(1).max(16).step(1).default(4).description("EDA \u4F5C\u4E1A\u6700\u5927\u5E76\u884C\u6570")
}).volatile();
async function apply(ctx, config) {
  const server = fileURLToPath(new URL("./eda-mcp.js", import.meta.url));
  const connectionConfig = () => {
    const values = config.get();
    return {
      transport: "stdio",
      serverName: "eda",
      command: process.execPath,
      args: [server],
      cwd: path2.dirname(server),
      toolCallTimeoutMs: 3e4,
      failOnStartupError: true,
      env: { STUDIO_EDA_CONFIG: JSON.stringify({ jobsDir: path2.resolve(values.jobsDir), maxConcurrent: values.maxConcurrent, commands: { dc: values.dcShell, vcs: values.vcs, verilator: values.verilator, iverilog: values.iverilog, vvp: values.vvp, vc_static: values.vcStatic, vc_formal: values.vcFormal, innovus: values.innovus, pt: values.ptShell, sta: values.sta }, enabled: { dc: values.dcEnabled, vcs: values.vcsEnabled, verilator: values.verilatorEnabled, iverilog: values.iverilogEnabled, vvp: values.vvpEnabled, vc_static: values.vcStaticEnabled, vc_formal: values.vcFormalEnabled, innovus: values.innovusEnabled, pt: values.ptEnabled, sta: values.staEnabled } }) }
    };
  };
  const connection = ctx.plugin(mcp, connectionConfig());
  ctx.on("loader/volatile-update", () => {
    connection.update(connectionConfig(), true);
  });
  ctx.on("workspace/session-activity", async ({ sessionId }, next) => {
    const jobs = await activeEdaJobs(path2.resolve(config.get().jobsDir), sessionId);
    return [...await next(), ...jobs.map((id) => ({ kind: "eda-job", id, label: `EDA ${id}` }))];
  });
  ctx.on("tools/execute", async (exec, next) => {
    if (!exec.agent || !["mcp__eda__run", "mcp__eda__synthesize"].includes(exec.name)) return next();
    const tools = ctx.get("tools");
    const definition = tools.get(exec.name, exec.agent);
    if (!definition) throw new Error("EDA_UNAVAILABLE: EDA \u5DE5\u5177\u5DF2\u7981\u7528\u6216\u6B63\u5728\u91CD\u65B0\u8FDE\u63A5");
    const directory = await ctx.get("workingDirectory").ensure(exec.agent, exec.signal);
    const args = { ...exec.arguments, workingDirectory: directory, ownerSessionId: exec.agent.id };
    const contexts = [];
    let concludesTurn = false;
    const execution = { ...exec, deferContext: (context) => contexts.push(context), concludeTurn: () => {
      concludesTurn = true;
    } };
    const value = await definition.execute(args, execution);
    return {
      isError: false,
      value,
      content: definition.output.render(args, value),
      ...contexts.length ? { additionalContexts: contexts } : {},
      ...concludesTurn ? { concludesTurn: true } : {},
      ...definition.output.presentationMeta ? { meta: definition.output.presentationMeta(args, value) } : {}
    };
  });
}
export {
  Config,
  apply,
  inject,
  name
};
