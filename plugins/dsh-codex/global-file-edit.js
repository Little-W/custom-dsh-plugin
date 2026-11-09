const MUTATION_WRAPPER = Symbol.for('@agent-studio/plugin-dsh-codex/global-file-edit')
const SCHEMA_FILTER_WRAPPER = Symbol.for('@agent-studio/plugin-dsh-codex/global-file-edit/schema-filter')

export function hideLegacyMutationSchemas(tools) {
  if (!tools || typeof tools.schemas !== 'function' || tools.schemas[SCHEMA_FILTER_WRAPPER]) return false
  const original = tools.schemas
  const filtered = function (...args) {
    const schemas = original.apply(this, args)
    return Array.isArray(schemas) ? schemas.filter(schema => !['edit', 'write'].includes(schema?.name)) : schemas
  }
  Object.defineProperty(filtered, SCHEMA_FILTER_WRAPPER, { value: true })
  try {
    tools.schemas = filtered
    return tools.schemas === filtered
  } catch {
    return false
  }
}

export const GLOBAL_FILE_EDIT_RULES = `## Cohesive file editing (all session modes)
- Before the first mutation, inspect the relevant implementation, callers, and tests; decide the intended final state and collect every known change for each target file.
- Use apply_patch for every file mutation, in one apply_patch call with the complete known change and multiple hunks/files as needed. Do not use separate text-edit or file-write tools, or split a known change into successive small edits.
- Build each hunk from exact current file text. Include enough unchanged context to identify one location; preserve whitespace, line endings, and nearby syntax exactly. Do not infer stale context from an earlier conversation, a generated diff, or a guessed path.
- If the result says “Patch rejected before any change”, treat the operation as atomic: no hunk was applied. Do not resend the same patch. Use the reported file, patch line, and mismatch stage to inspect that exact region, then rebuild the complete patch against current contents and retry once. Keep hunks whose context still matches; rewrite only stale hunks. If the retry fails, inspect the new diagnostic and narrow the repair instead of looping.
- If the result says the patch stopped after operations began, some earlier operations may already have completed. Inspect every affected file and the reported operation statuses before constructing a follow-up patch; never assume rollback.
- In PTC, invoke apply_patch only through the SDK and its declared schema; do not call it as a direct tool when the selected executor exposes only run_code.
- After applying the complete change, inspect the diff and run focused checks. If review or a check identifies related corrections, combine them into one follow-up patch; do not fix each line separately.
- Keep edits limited to the requested behavior. Preserve the native DSH tool executor, permission approval, workspace boundaries, sandbox enforcement, and atomic mutation checks.`

export function globalToolGuidance(toolName, hasPatchTool) {
  const observation = 'A prior read-tool call is not required, but every hunk must still match exact current file text; metadata observation prevents races and does not replace source inspection. The global file-edit enhancement records the exact DSH file version, then calls the original native executor with the original arguments, preserving DSH permission, sandbox, and atomic-write behavior.'
  return {
    edit: `Do not call edit for file mutations. Use apply_patch for the complete change, with multiple hunks and files as needed. ${hasPatchTool ? observation : 'The global DSH composition enables apply_patch; if its schema is absent from this step, do not substitute edit or write.'}`,
    write: `Do not call write for file mutations. Use apply_patch for new files and complete file changes. ${hasPatchTool ? observation : 'The global DSH composition enables apply_patch; if its schema is absent from this step, do not substitute edit or write.'}`,
    apply_patch: `Apply the complete known change in one patch call. Include multiple hunks for a file and related files in the same patch; do not split a known change into repeated small patches. Build hunks from exact current text. If the result says "Patch rejected before any change", nothing was applied: inspect the reported file and hunk, rebuild the complete patch against current contents, and retry once; never resend the identical patch. If execution stopped after operations began, inspect all affected files and operation statuses before retrying because completed operations are not rolled back. ${observation}`,
  }[toolName]
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
  for (const match of patch.matchAll(/^\*\*\* (?:Update|Delete|Add) File:\s*(.+?)\s*$/gm)) {
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

export function registerMutationTool(ctx, toolName, guidance = GLOBAL_TOOL_GUIDANCE[toolName]) {
  const original = ctx.tools.get(toolName)
  if (!original || original[MUTATION_WRAPPER]) return
  // DSH already registers apply_patch as a native tool. Registering another tool
  // with the same name aborts preset startup; wrap the existing definition in
  // place so its executor, schema, approval path and sandbox remain intact.
  if (toolName === 'apply_patch') {
    const execute = original.execute
    if (typeof execute !== 'function') return
    try {
      Object.defineProperties(original, {
        [MUTATION_WRAPPER]: { value: true },
        description: { value: guidance || original.description, writable: true, configurable: true },
        execute: {
          value: async function (args, exec) {
            await seedMutationObservations(ctx, toolName, args, exec)
            return execute.call(original, args, exec)
          },
          writable: true,
          configurable: true,
        },
      })
    } catch (error) {
      ctx.logger?.warn?.(`[dsh-codex] could not wrap native apply_patch in place: ${error instanceof Error ? error.message : String(error)}`)
    }
    return
  }
  ctx.tools.register({
    ...original,
    [MUTATION_WRAPPER]: true,
    description: guidance || original.description,
    async execute(args, exec) {
      await seedMutationObservations(ctx, toolName, args, exec)
      return original.execute(args, exec)
    },
  })
}

function replaceMutationSections(assembled, hasPatchTool) {
  let changed = false
  const sections = assembled.sections.map(section => {
    const toolName = section.name.startsWith('tool:') ? section.name.slice('tool:'.length) : ''
    if (!Object.hasOwn(GLOBAL_TOOL_GUIDANCE, toolName)) return section
    changed = true
    return { ...section, text: globalToolGuidance(toolName, hasPatchTool) }
  })
  return changed ? { ...assembled, sections } : assembled
}

export const name = '@agent-studio/plugin-dsh-codex/global-edit'
export const inject = ['tools', 'systemPrompt', 'fs', 'workingDirectory']

export function apply(ctx) {
  hideLegacyMutationSchemas(ctx.tools)
  const hasPatchTool = Boolean(ctx.tools.get('apply_patch'))
  const guidance = Object.fromEntries(['edit', 'write', 'apply_patch'].map(toolName => [toolName, globalToolGuidance(toolName, hasPatchTool)]))
  for (const toolName of Object.keys(guidance)) registerMutationTool(ctx, toolName, guidance[toolName])
  ctx.systemPrompt.section({
    name: 'studio:dsh-codex:global-file-edit',
    order: 950,
    text: GLOBAL_FILE_EDIT_RULES,
  })
  ctx.on('system-prompt/assemble', async (_assembly, _context, next) => replaceMutationSections(await next(), Boolean(ctx.tools.get('apply_patch'))))
}

export const GLOBAL_TOOL_GUIDANCE = Object.freeze(Object.fromEntries(['edit', 'write', 'apply_patch'].map(toolName => [toolName, globalToolGuidance(toolName, false)])))
export default { name, inject, apply }
