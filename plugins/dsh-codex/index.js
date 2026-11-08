import sharp from 'sharp'
import path, { basename, win32 } from 'node:path'

export const name = '@agent-studio/plugin-dsh-codex'
export const inject = ['tools', 'systemPrompt', 'fs', 'workingDirectory', 'attachments', 'llm']

export const CODEX_WORKING_RULES = `You are a coding agent that works directly in the user's workspace. Act on clear requests; do not stop at a plan when implementation is requested.

## Shell-first execution
- Use the native \`bash\` tool as the primary interface on Unix, or the native PowerShell tool on Windows. Run ordinary commands directly in that shell.
- Parallelize independent discovery calls. Once exact file paths are established by the user, \`list_dir\`, or \`glob\`, reads of different files may run concurrently. Never batch speculative file reads.
- For ordinary workspace work, use Bash/PowerShell and native file tools directly when they are available. This keeps simple commands simple and avoids unnecessary wrapper programs.
- Inspect the current file contents before designing a change. Codex-style edits verify current file content and sandbox rules at mutation time; they do not require a prior read-tool call. The plugin establishes the exact target's metadata/version before invoking the native mutation tool, which retains DSH's permission, sandbox, and atomic version checks.
- PTC and \`run_code\` remain available when the selected session mode provides them. Use them when they fit the task; do not change or bypass the user's selected execution mode. When a direct shell tool is available, prefer it for ordinary shell commands.
- Use \`grep\` for regular expressions. For source-code text containing punctuation such as parentheses, brackets, pipes, or question marks, use a fixed-string search (for example, \`rg -F\`) instead of passing the text as a regular expression.
- Prefer \`rg\` for content search and \`rg --files\` for file discovery. Use \`apply_patch\` for focused edits; use formatters and generators when appropriate.
- For an implementation request, inspect the relevant code, callers, and tests first, then form one complete change plan before editing. Once the scope is understood, batch all known changes for the same task into one coherent \`apply_patch\` call, using multiple hunks and files as needed. Do not make a series of speculative one-line edits or repeatedly reread unchanged context between them. Make another patch only when review, a test, or newly discovered evidence identifies a concrete remaining change; combine related fixes from the same failure into one follow-up patch.
- Keep a patch cohesive and reviewable: include every required part of the requested behavior, but do not expand into unrelated cleanup. After the batch, inspect the diff and run the relevant checks before making evidence-driven corrections.
- Avoid one-line-at-a-time tool calls and empty progress narration. Keep progress updates to one short note per meaningful milestone; do not emit a separate thought bubble for each inspection or command.
- Check command exit status and inspect the relevant result before claiming success. Keep output bounded and narrow searches to the actual project.

## Grounded file discovery
- Treat a file path as unverified until it appears exactly in a user-supplied path or a current \`list_dir\`/\`glob\` result. Never derive a sibling filename from naming patterns or from another file's contents.
- Resolve relative paths against the active session workspace. For a new target, list its parent directory or run a narrow \`glob\` first; then read only the exact returned path. Do not substitute another mount, checkout, or machine.
- A successful read is authoritative for that exact path and line window. Reuse its visible result; do not reread the same window unless the file changed or more lines are needed. Keep a compact evidence note with exact paths and whether each is present, absent, empty, or truncated.
- If a read reports \`not found\`, stop that candidate. List the parent once and choose from the returned entries, or make one targeted \`glob\` search. Never retry the same inferred path. After context compaction, rediscover paths whose listing or read evidence is no longer visible.
- A read reporting zero total lines means an existing empty file; do not invent contents. An absent path, permission failure, empty search, and search timeout are different outcomes. Preserve the exact outcome and scope. Do not infer project contents from an empty result. Do not repeat the same failed query.
- Keep file listings, search scopes, and read windows narrow and bounded. If a listing is truncated, narrow it before selecting a path.

## Images and other media
- Use image content already attached to the conversation directly; do not ask the user to transcribe visible details. For PNG/JPEG/WebP/GIF/SVG files in the workspace, use the native \`read_image\` tool and let the selected model inspect the actual image. For an SVG, \`read_image\` renders a safe PNG preview and returns it as image input.
- When the user asks to create or edit an image, use the built-in \`image_generate\` tool if it appears in the available tools. It is provided by the standalone image-generation component. If it is absent, explain that the component must be enabled and configured; do not claim an image was created unless the tool returns one.
- Preserve image attachments as image input. Never replace an image with guessed descriptions or a text-only placeholder. If the selected model does not support image input or image loading fails, state that limitation explicitly.

## Planning and communication
- For multi-step work, keep a short task list with concrete outcomes, update it as work progresses, and retain completed items when resuming.
- Keep internal reasoning private. Do not emit a stream of tiny thought summaries; provide concise status only when useful and finish with verified changes and checks.`

const toolGuidance = {
  run_code: 'Use this code runner when the selected session mode provides it and code execution fits the task. Prefer the direct bash/PowerShell tool for ordinary shell commands when available. Follow the runner SDK and language it exposes; do not assume a different runtime.',
  bash: 'Use the original DSH bash tool and its original arguments and job handling. Run shell commands directly in the user\'s workspace; this is the primary tool for ordinary coding and file operations. Do not generate TypeScript or JavaScript wrappers for shell commands. Set workdir explicitly when needed, keep output bounded, and verify exit status. Only pass a job id to job_output or job_kill when that exact id was returned by bash in this session; never invent, reconstruct, or reuse an unknown id.',
  pwsh: 'Use this native PowerShell shell as the primary execution tool on Windows. Run commands directly; do not wrap routine file operations in generated TypeScript or Python. Keep output bounded and verify exit status.',
  read: 'Read only an exact path returned by a current list_dir/glob result or supplied by the user. The result identifies the canonical path and total line count; totalLines=0 means the file exists and is empty. Reuse a visible read result instead of repeating the same window. Offsets are 1-based; if an offset falls past end-of-file, retry from the last valid line. If not found, stop and inspect the parent listing; never infer a sibling filename or file contents.',
  read_image: 'Use this tool for PNG/JPEG/WebP/GIF/SVG files in the workspace. SVG is safely rendered as a PNG preview and returned as actual image input. Inspect the image pixels; do not substitute guessed text descriptions.',
  image_generate: 'When the user requests a new or edited image, use this tool if it is listed in the available tools. It uses the separately configured image-generation component. If it is not listed, explain that the component must be enabled and configured; do not pretend it was invoked.',
  write: 'Use this native file tool to create or replace a file when appropriate. Verify the destination and inspect the result. A prior read-tool call is not required; the plugin establishes the exact target metadata/version before invoking the native mutation tool, which retains DSH permission and sandbox checks.',
  edit: 'Use this native file tool for a focused change to an existing file. Before editing, inspect relevant context and plan the complete change. Avoid repeated one-line edits; combine related changes in one multi-hunk apply_patch call where possible. A prior read-tool call is not required; the plugin establishes the exact target metadata/version before invoking the native mutation tool, which retains DSH permission, sandbox, and atomic version checks. Inspect the diff and run relevant checks.',
  glob: 'Search a confirmed workspace root. A zero-result response means no paths matched this pattern in this scope; check the root and adjust the pattern once instead of repeating the same search.',
  grep: 'Search a confirmed workspace root using ripgrep regular-expression syntax. Escape regex metacharacters when searching literal code text; for literal source snippets with punctuation, prefer shell `rg -F`. If a regex is rejected, retry the query as a fixed string once. A zero-result response means no content matched this query in this scope; check the root and adjust the query once instead of repeating the same search.',
  apply_patch: 'Use this tool for focused, reviewable source edits. Its patch format supports multiple hunks and files in one call: after inspecting the relevant code, callers, and tests, combine all known changes for the task into one coherent patch instead of a sequence of tiny edits. Codex parses and verifies patches against current filesystem content and sandbox rules without requiring a prior read-tool call. The plugin establishes metadata/version observations for exact update/delete targets before invoking the native patch tool; DSH then performs its normal content matching, permission approval, sandbox enforcement, and atomic mutation. Inspect the resulting diff and run relevant checks.',
  list_dir: 'List the direct entries of a confirmed directory in the active session workspace. Use this to verify exact file names before reading; the listing is bounded and reports whether entries were omitted. Use glob for recursive file discovery.',
}

const GOAL_GUIDANCE = 'Goal creation and human-directed changes belong to the top-level agent. Create, edit, pause, or resume a goal only when the current turn contains a direct user message on that top-level agent. A resumed/automatic continuation or subagent turn must not request those actions; let the goal driver continue its admitted round. During the exact active goal round, complete or blocked may be reported only when their documented completion or repeated-blockage criteria are met. Before any authorized update, call get_goal in the current turn and use its exact goal_id and revision. Do not retry an authority error by guessing or changing goal identifiers.'

const PARALLEL_READ_TOOLS = new Set(['read', 'read_image', 'glob', 'grep', 'list_dir'])
const MUTATING_TOOLS = new Set(['edit', 'write', 'apply_patch'])
const DIRECTORY_LIST_LIMIT = 120
const MISSING_READ_CONTEXT_LIMIT = 20

const SVG_MAX_BYTES = 8 * 1024 * 1024
const SVG_FORBIDDEN = /<!DOCTYPE|<!ENTITY|<\s*script\b|<\s*foreignObject\b|@import|\son[a-z]+\s*=/i

function svgUnsafeReason(svg) {
  if (SVG_FORBIDDEN.test(svg)) return 'SVG contains scripts, external resources, or declarations that are not allowed for preview.'
  for (const match of svg.matchAll(/(?:href|xlink:href)\s*=\s*(["'])(.*?)\1/gi)) {
    const value = match[2].trim()
    if (value && !value.startsWith('#')) return 'SVG references external content; remove external links before previewing.'
  }
  for (const match of svg.matchAll(/url\(\s*(?:(["'])(.*?)\1|([^)]*?))\s*\)/gi)) {
    const value = (match[2] ?? match[3] ?? '').trim()
    if (value && !value.startsWith('#')) return 'SVG references external content; remove external links before previewing.'
  }
  return undefined
}

function pathApiFor(filePath) {
  return /^[A-Za-z]:[\\/]/.test(filePath) || filePath.startsWith('\\\\') ? win32 : path
}

function mutationTargetPaths(toolName, args) {
  if (typeof args?.file_path === 'string' && args.file_path.trim()) return [args.file_path]
  if (toolName !== 'apply_patch') return []
  const patch = typeof args === 'string'
    ? args
    : args !== null && typeof args === 'object'
      ? Object.values(args).find(value => typeof value === 'string' && value.includes('*** Begin Patch'))
      : undefined
  if (typeof patch !== 'string') return []
  const paths = new Set()
  for (const match of patch.matchAll(/^\*\*\* (?:Update|Delete) File:\s*(.+?)\s*$/gm)) {
    if (match[1]) paths.add(match[1])
  }
  return [...paths]
}

async function seedMutationObservations(ctx, toolName, args, exec) {
  const targets = mutationTargetPaths(toolName, args)
  if (!ctx.fs || targets.length === 0) return
  const cwd = exec.agent === undefined ? undefined : await ctx.workingDirectory.ensure(exec.agent, exec.signal)
  for (const filePath of targets) {
    const target = await ctx.fs.resolve(filePath, { ...(cwd ? { cwd } : {}), signal: exec.signal })
    const info = await ctx.fs.stat(target, exec.signal)
    ctx.emit('fs/observed', target, info === undefined
      ? { kind: 'absent' }
      : { kind: 'present', version: info.version }, exec)
  }
}

async function explainMissingRead(ctx, args, exec, cause) {
  const fs = ctx.fs
  if (!fs || typeof args?.file_path !== 'string' || !/(?:not found|does not exist|ENOENT|FS_NOT_FOUND)/i.test(String(cause))) return cause

  try {
    const cwd = exec.agent === undefined ? undefined : await ctx.workingDirectory.ensure(exec.agent, exec.signal)
    const target = await fs.resolve(args.file_path, { ...(cwd ? { cwd } : {}), signal: exec.signal })
    if (await fs.stat(target, exec.signal) !== undefined) return cause
    const paths = pathApiFor(target.displayPath)
    const parentPath = paths.dirname(target.displayPath)
    const parent = await fs.resolve(parentPath, { ...(cwd ? { cwd } : {}), signal: exec.signal })
    const entries = await fs.listDir(parent, exec.signal)
    const visible = entries.slice(0, MISSING_READ_CONTEXT_LIMIT)
    const names = visible.map(entry => `${entry.type === 'directory' ? '[dir] ' : ''}${entry.name}`)
    const listing = names.length > 0 ? names.join('\n') : '(empty directory)'
    const more = entries.length > visible.length ? `\n[${entries.length - visible.length} more entries omitted]` : ''
    return new Error(
      `The requested file does not exist: "${target.displayPath}". No file content was read. `
      + `The active workspace parent directory is "${parent.displayPath}"; use only an exact listed path or run one targeted glob search. `
      + `Do not retry this inferred path. Parent entries (up to ${MISSING_READ_CONTEXT_LIMIT}):\n${listing}${more}\nOriginal read error: ${String(cause)}`,
      { cause },
    )
  } catch (contextError) {
    if (contextError === cause) return cause
    return new Error(
      `The requested file was not found and no content was read. Do not retry this inferred path; list its parent directory or run one targeted glob search. Original read error: ${String(cause)}. File-discovery context was unavailable: ${String(contextError)}`,
      { cause },
    )
  }
}

function registerSvgCapableReadImage(ctx) {
  const original = ctx.tools.get('read_image')
  if (!original) return
  const replacement = {
    ...original,
    description: 'Read PNG/JPEG/WebP/GIF images or safely render an SVG file as a PNG preview. Returns the actual image to the model.',
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      if (typeof args?.file_path !== 'string' || !args.file_path.toLowerCase().endsWith('.svg')) {
        return original.execute(args, exec)
      }
      if (!args.file_path.trim()) throw new Error('file_path must be a non-empty string')
      const attachments = ctx.get('attachments')
      if (!attachments) throw new Error(`cannot read "${args.file_path}" as an image: no attachment service is mounted`)
      const routed = exec.agent?.session.requestHeader()?.config
      const provider = routed?.provider ?? exec.agent?.options.provider
      const model = routed?.model ?? exec.agent?.options.model
      const llm = ctx.get('llm')
      if (provider === undefined || model === undefined || !llm) throw new Error(`cannot read "${args.file_path}" as an image: the current model route could not be resolved`)
      const active = await llm.resolveModelInfo(provider, model, exec.signal)
      if (!active.inputModalities?.includes('image')) throw new Error(`cannot read "${args.file_path}" as an image: model "${model}" does not declare image input; switch to an image-capable model to read images`)

      const cwd = exec.agent === undefined ? undefined : await ctx.workingDirectory.ensure(exec.agent, exec.signal)
      const target = await ctx.fs.resolve(args.file_path, { ...(cwd ? { cwd } : {}), signal: exec.signal })
      const fileInfo = await ctx.fs.stat(target, exec.signal)
      if (!fileInfo) throw new Error(`cannot read "${target.displayPath}": not found`)
      if (fileInfo.type !== 'file') throw new Error(`cannot read "${target.displayPath}": not a regular file`)
      const source = await ctx.fs.readBytes(target, exec.signal, SVG_MAX_BYTES)
      const svg = Buffer.from(source).toString('utf8')
      if (!/^\s*(?:<\?xml[^>]*>\s*)?<svg\b/i.test(svg)) throw new Error(`cannot read "${target.displayPath}": the file is not a valid SVG document`)
      const unsafe = svgUnsafeReason(svg)
      if (unsafe) throw new Error(`cannot preview "${target.displayPath}": ${unsafe}`)

      const maxDimension = Math.max(1, attachments.imageLimits.maxImageDimension)
      const maxPixels = Math.max(1, attachments.imageLimits.maxImagePixels)
      const { data, info } = await sharp(Buffer.from(svg), { limitInputPixels: maxPixels, density: 96 })
        .resize({ width: maxDimension, height: maxDimension, fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer({ resolveWithObject: true })
      const image = await attachments.saveImage({ data, mediaType: 'image/png', name: `${basename(target.displayPath).replace(/\.svg$/i, '')}.png` })
      ctx.emit?.('fs/observed', target, { kind: 'present', version: fileInfo.version }, exec)
      return {
        path: ctx.fs.processPath(target),
        image: {
          attachmentId: image.attachmentId,
          mediaType: image.mediaType,
          bytes: image.bytes,
          width: image.width || info.width,
          height: image.height || info.height,
          ...(image.name ? { name: image.name } : {}),
          ...(image.originalDimensions ? { originalDimensions: image.originalDimensions } : {}),
        },
      }
    },
  }
  ctx.tools.register(replacement)
}

const promptSections = [
  { name: 'studio:dsh-codex:identity', order: 0, text: 'You are Codex, an AI coding agent working directly in the user\'s workspace.' },
  { name: 'studio:dsh-codex:rules', order: 750, text: CODEX_WORKING_RULES },
  { name: 'studio:dsh-codex:tool:pwsh', order: 1000, text: toolGuidance.pwsh },
  { name: 'studio:dsh-codex:tool:read', order: 1100, text: toolGuidance.read },
  { name: 'studio:dsh-codex:tool:read_image', order: 1100, text: toolGuidance.read_image },
  { name: 'studio:dsh-codex:tool:image_generate', order: 1100, text: toolGuidance.image_generate },
  { name: 'studio:dsh-codex:tool:write', order: 1100, text: toolGuidance.write },
  { name: 'studio:dsh-codex:tool:edit', order: 1100, text: toolGuidance.edit },
  { name: 'studio:dsh-codex:tool:glob', order: 1200, text: toolGuidance.glob },
  { name: 'studio:dsh-codex:tool:grep', order: 1200, text: toolGuidance.grep },
  { name: 'studio:dsh-codex:tool:apply_patch', order: 1300, text: toolGuidance.apply_patch },
  { name: 'studio:dsh-codex:tool:list_dir', order: 1200, text: toolGuidance.list_dir },
]

function registerListDir(ctx) {
  if (ctx.tools.get('list_dir')) return
  ctx.tools.register({
    name: 'list_dir',
    description: 'List the direct entries of a directory, like the Codex directory listing tool. Does not read file contents.',
    parameters: {
      path: { type: 'string', description: 'Directory to list. Relative paths resolve against the current session workspace; defaults to the workspace root.' },
    },
    output: {
      schema: {
        type: 'object', additionalProperties: false,
        required: ['path', 'entries', 'truncated'],
        properties: {
          path: { type: 'string' },
          entries: {
            type: 'array',
            items: {
              type: 'object', additionalProperties: false,
              required: ['name', 'type'],
              properties: {
                name: { type: 'string' },
                type: { type: 'string', enum: ['file', 'directory', 'other'] },
                size: { type: 'number' },
              },
            },
          },
          truncated: { type: 'boolean' },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `${value.path}${value.entries.length ? `\n${value.entries.map(entry => `${entry.type === 'directory' ? '[dir] ' : ''}${entry.name}`).join('\n')}` : '\n(empty directory)'}${value.truncated ? `\n[listing truncated at ${DIRECTORY_LIST_LIMIT} entries]` : ''}`,
      }],
    },
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const cwd = exec.agent === undefined ? undefined : await ctx.workingDirectory.ensure(exec.agent, exec.signal)
      const target = await ctx.fs.resolve(args.path || '.', { ...cwd ? { cwd } : {}, signal: exec.signal })
      const listed = await ctx.fs.listDir(target, exec.signal)
      const entries = listed.slice(0, DIRECTORY_LIST_LIMIT).map(({ name, type, size }) => ({
        name, type, ...(size === undefined ? {} : { size }),
      }))
      return { path: target.displayPath, entries, truncated: listed.length > entries.length }
    },
    presentCall: args => ({ card: 'generic', title: `List directory ${args.path || '.'}`, kind: 'read', rawInput: args.path || '.' }),
  })
}

/** Replace only model-facing descriptions; retain the upstream schemas and executors. */
export function apply(ctx) {
  const tools = ctx.tools
  const prompt = ctx.systemPrompt
  registerListDir(ctx)
  registerSvgCapableReadImage(ctx)

  for (const section of promptSections) prompt.section(section)

  // DSH's section registry rejects duplicate names within one scope. Replace
  // the built-in Bash guidance at assembly time instead of registering a
  // second `tool:bash` section beside it.
  ctx.on('system-prompt/assemble', async (_assembly, _context, next) => {
    const assembled = await next()
    let replaced = false
    const sections = assembled.sections.map(section => {
      if (section.name === 'tool:goal') {
        replaced = true
        return { ...section, text: GOAL_GUIDANCE }
      }
      if (section.name === 'tool:bash') {
        replaced = true
        return { ...section, text: toolGuidance.bash }
      }
      if (section.name === 'tool:edit' || section.name === 'tool:write' || section.name === 'tool:apply_patch') {
        replaced = true
        return { ...section, text: toolGuidance[section.name.slice('tool:'.length)] }
      }
      return section
    })
    return replaced ? { ...assembled, sections } : assembled
  })

  for (const [name, guidance] of Object.entries(toolGuidance)) {
    // Preserve DSH's original Bash registration, executor, job scope, schema,
    // presentation and concurrency policy. Codex behavior is expressed in the
    // assembled prompt, not by shadow-registering a copied Bash definition.
    if (name === 'bash' || name === 'read_image' || name === 'list_dir' || name === 'image_generate') continue
    const original = tools.get(name)
    if (!original) continue
    if (name === 'grep') {
      tools.register({
        ...original,
        description: guidance,
        ...(PARALLEL_READ_TOOLS.has(name) ? { isConcurrencySafe: () => true } : {}),
        async execute(args, exec) {
          try {
            return await original.execute(args, exec)
          } catch (error) {
            const message = error instanceof Error ? `${error.message}\n${String(error.cause ?? '')}` : String(error)
            if (!/(?:pattern rejected by ripgrep|regex parse error|error parsing regex|unclosed group)/i.test(message)
              || !args || typeof args !== 'object' || typeof args.pattern !== 'string') throw error

            // A common model mistake is passing a source-code snippet as a regex.
            // Retry it literally so punctuation cannot turn a useful search into a hard failure.
            const literalPattern = args.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            return original.execute({ ...args, pattern: literalPattern }, exec)
          }
        },
      })
    } else if (name === 'read') {
      tools.register({
        ...original,
        description: guidance,
        ...(PARALLEL_READ_TOOLS.has(name) ? { isConcurrencySafe: () => true } : {}),
        async execute(args, exec) {
          try {
            return await original.execute(args, exec)
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            const groundedError = await explainMissingRead(ctx, args, exec, error)
            if (groundedError !== error) throw groundedError
            const match = message.match(/offset (\d+) is out of range for .+ \((\d+) lines?\)/i)
            if (!match || !args || typeof args !== 'object') throw error
            const requestedOffset = Number(match[1])
            const totalLines = Number(match[2])
            if (!Number.isSafeInteger(requestedOffset) || !Number.isSafeInteger(totalLines) || totalLines < 1) throw error
            return original.execute({ ...args, offset: Math.min(requestedOffset, totalLines) }, exec)
          }
        },
      })
    } else {
      tools.register({
        ...original,
        description: guidance,
        ...(PARALLEL_READ_TOOLS.has(name) ? { isConcurrencySafe: () => true } : {}),
        ...(MUTATING_TOOLS.has(name) ? {
          async execute(args, exec) {
            // Establish the exact target's current CAS basis from metadata, not
            // a read-tool call. Then invoke the original tool once so escalation
            // approval and sandbox enforcement keep their native semantics.
            await seedMutationObservations(ctx, name, args, exec)
            return original.execute(args, exec)
          },
        } : {}),
      })
    }
  }
}

export default { name, inject, apply }
