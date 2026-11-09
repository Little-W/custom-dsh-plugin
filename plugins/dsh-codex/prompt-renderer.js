const CAPABILITIES = [
  ['shell', ['bash', 'pwsh', 'shell', 'exec_command']],
  ['job output', ['job_output', 'write_stdin']],
  ['job cancellation', ['job_kill']],
  ['file reading', ['read', 'read_file']],
  ['directory listing', ['list_dir']],
  ['file discovery', ['glob']],
  ['content search', ['grep']],
  ['file patches', ['apply_patch']],
  ['image inspection', ['read_image', 'view_image']],
  ['task tracking', ['update_todo', 'todo', 'todo_write', 'todowrite', 'update_plan']],
  ['user questions', ['ask_user_question', 'ask_user', 'request_user_input']],
  ['web search', ['web_search']],
  ['web fetching', ['web_fetch']],
  ['skills', ['skill', 'read_skill', 'list_skills']],
]

function parameterNames(tool) {
  const schema = tool.parameters ?? {}
  return Object.keys(schema.type === 'object' ? schema.properties ?? {} : schema)
    .filter(key => !['$schema', '$defs', 'additionalProperties'].includes(key))
}

export function renderToolDefinitions({ tools = [], ptc = false } = {}) {
  // Project the executor's complete admitted registry. A partial allowlist
  // would make a valid DSH tool look like an undocumented foreign API.
  const definitions = tools.filter(tool => !['edit', 'write'].includes(tool.name)).map(({ name, description, parameters }) => ({ name, description, parameters }))
  if (!definitions.length) return ''
  return [
    ptc ? '### Native capability definitions for the PTC SDK' : '### Native DSH tool definitions',
    ptc
      ? 'These are the admitted underlying capability schemas, reached only through the SDK whose signatures DSH supplies separately. They are not additional direct-call declarations.'
      : 'These definitions are projected from the current DSH tool registry. Descriptions and parameter maps are retained exactly, including required flags, types, enums, and permission arguments. Use DSH read, glob, and grep for bounded file access and targeted discovery; shell rg and rg --files are available for broader searches. File mutations must use apply_patch; do not call edit or write.',
    '```json',
    JSON.stringify(definitions, null, 2),
    '```',
  ].join('\n')
}

export function renderToolGuidance({ tools = [], ptc = false } = {}) {
  const byName = new Map(tools.map(tool => [tool.name, tool]))
  const lines = [
    '## DSH execution contract',
    'The tool declarations and current mode instructions supplied by DSH are authoritative. Use their exact names, arguments, job identifiers, and permission contracts. Tool references in a model template are not additional callable APIs.',
    ptc
      ? 'Only run_code is directly callable in this PTC executor. Reach the capabilities below through the supplied SDK; follow its actual language, signatures, and parallel-call semantics. Do not emit direct calls to the underlying capabilities or assume Codex functions.exec exists.'
      : 'Call the tools declared by the current executor. For independent operations use its supported parallel calls; keep dependent operations sequential. Do not assume a Codex functions namespace or multi_tool_use transport.',
  ]
  for (const [label, names] of CAPABILITIES) {
    const tool = names.map(name => byName.get(name)).find(Boolean)
    if (!tool) continue
    const parameters = parameterNames(tool)
    lines.push(`- ${label}: ${tool.name}${parameters.length ? ` (arguments: ${parameters.join(', ')})` : ''}${ptc ? ' through the supplied SDK' : ''}.`)
  }
  if (byName.has('bash') || byName.has('pwsh') || byName.has('shell')) {
    lines.push('Use the native shell for system work, broader searches, and bounded experiments. Use DSH read, glob, and grep when their bounded schemas fit the task; rg and rg --files are flexible shell alternatives. Follow the actual background-job protocol and use only returned identifiers. Shell command text is executable code: quote data safely and inspect exit status.')
  }
  if (byName.has('apply_patch')) lines.push('Combine related edits into one multi-file, multi-hunk apply_patch when practical. Build each hunk from exact current file text and include enough unchanged context to identify one location. If the tool says "Patch rejected before any change", nothing was applied: inspect the reported file and hunk, rebuild the complete patch against current contents, and retry once; never resend the identical patch. If execution stopped after operations began, inspect every affected file and operation status before retrying because completed operations may remain on disk.')
  lines.push('Use apply_patch as the only file-mutation tool. Do not use edit or write even if another component exposes those schemas. The plugin registers apply_patch across session modes; in PTC, call it only through the supplied SDK. Preserve plan/read-only restrictions, approval decisions, sandbox boundaries, and goal lifecycle rules.')
  const definitions = renderToolDefinitions({ tools, ptc })
  if (definitions) lines.push('', definitions)
  return lines.join('\n')
}

function replaceMarkdownSection(text, heading, replacement) {
  const lines = text.split('\n')
  const start = lines.findIndex(line => line.trim().toLowerCase() === heading.toLowerCase())
  if (start < 0) return text
  const level = heading.match(/^#+/)[0].length
  let end = start + 1
  for (; end < lines.length; end++) {
    const next = lines[end].match(/^(#+)\s/)
    if (next && next[1].length <= level) break
  }
  return [...lines.slice(0, start), replacement.trim(), '', ...lines.slice(end)].join('\n')
}

const FILE_LINK_POLICY = `## Local file links
When a link is useful for opening a local file, use its confirmed absolute filesystem path and the DSH-supported single-line fragment: [file.ext](/absolute/path/file.ext#L24). Use \`#L<n>\` for one line; do not use \`:line\`, line ranges, relative targets, or file/editor URIs. Do not invent paths or line numbers, and avoid repeating the same link when it adds no value.`

function normalizeFileLinkInstructions(text) {
  const lines = text.split('\n').filter(line => !/(?:clickable file links?|file links? should|file links? use|when (?:referencing|linking) (?:a |an )?(?:real )?local file|line ranges?|line-number ranges?|#L\d+(?:-L\d+)?|file:\/\/|absolute target.*link|link.*relative path|relative path.*link|relative target|\[[^\]]+\]\([^)]+:\d+\))/i.test(line))
  const normalized = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
  return `${normalized}\n\n${FILE_LINK_POLICY}`
}

function normalizeForeignToolReferences(text, byName) {
  const actualQuestionTool = ['ask_user_question', 'ask_user', 'request_user_input'].find(name => byName.has(name))
  const replacements = []
  if (['spawn_teammate', 'list_agents', 'send_message'].some(name => !byName.has(name))) replacements.push({ pattern: /\b(?:spawn_teammate|list_agents|send_message)\b|Agent Teams API/i, text: 'Use only collaboration or agent-management tools declared by the current DSH registry. Follow their exact schemas and lifecycle; if none are available, continue directly and do not invent teammate APIs.' })
  if (['create_goal', 'update_goal'].some(name => !byName.has(name))) replacements.push({ pattern: /\b(?:create_goal|update_goal)\b/, text: 'Use the goal or task-lifecycle tools declared by the current DSH registry. Follow their exact names, arguments, and lifecycle rules; do not invent goal APIs.' })
  if (['list_mcp_resources', 'list_mcp_resource_templates', 'read_mcp_resource'].some(name => !byName.has(name)) || !byName.has('ALL_TOOLS')) replacements.push({ pattern: /\b(?:list_mcp_resources|list_mcp_resource_templates|read_mcp_resource|ALL_TOOLS)\b/, text: 'Discover connected capabilities only through discovery tools declared by the current DSH registry. Tool documentation from another runtime does not make its discovery APIs available here.' })
  if (!byName.has('plugin_preview')) replacements.push({ pattern: /\bplugin_preview\b/, text: 'For UI preview, use a preview or browser capability only when it is declared by the current DSH registry. Otherwise validate the implementation with available local checks and describe the specific preview limitation.' })
  if (!byName.has('subagent_fork')) replacements.push({ pattern: /\bsubagent_fork\b/, text: 'Use only agent-forking tools declared by the current DSH registry; follow their exact schemas and lifecycle.' })
  if (!byName.has('exec_command') && !byName.has('bash') && !byName.has('pwsh') && !byName.has('shell')) replacements.push({ pattern: /\bexec_command\b/, text: 'Use the shell capability declared by the current DSH registry when available; do not assume a Codex command-execution API.' })
  if (!actualQuestionTool) replacements.push({ pattern: /\bfunctions\.request_user_input(?:_async)?\b|\brequest_user_input(?:_async)?\b/, text: 'Ask necessary questions in the normal user-facing response when no dedicated DSH question tool is available.' })
  replacements.push({ pattern: /\b(?:call|use|prefer|invoke)\s+`?(?:edit|write)`?\b|\bfunctions\.(?:edit|write)\b/i, text: 'Use apply_patch as the only file-mutation tool. Put all known changes into one patch, grouping hunks and files when practical.' })
  let result = text
  for (const item of replacements) result = result.split(/\n\s*\n/).map(paragraph => item.pattern.test(paragraph) ? item.text : paragraph).join('\n\n')
  result = result.split(/\n\s*\n/).map(paragraph => /\bfunctions\.[a-z_][a-z0-9_.]*/i.test(paragraph) ? 'Use only the current DSH tool names and schemas. Platform-specific function namespaces in source templates are not callable interfaces in this session.' : paragraph).join('\n\n')
  return result
}

export function adaptCodexTemplate(template, options = {}) {
  const tools = options.tools ?? []
  const byName = new Set(tools.map(tool => tool.name))
  const question = ['ask_user_question', 'ask_user', 'request_user_input'].find(name => byName.has(name))
  const questionText = question
    ? `Use ${question}${options.ptc ? ' through the supplied run_code SDK' : ''} for necessary user questions, following its declared schema. Continue independent work when possible. A question does not grant approval; wait for a required answer before dependent work.`
    : 'Resolve discoverable facts using the available tools. When a necessary user-only decision remains, ask a concise question in the normal user-facing response. Do not invent an asynchronous question tool.'
  const parallelText = options.ptc
    ? 'Group independent calls using the actual run_code SDK and runtime supplied by DSH. Follow its parallel-call semantics and inspect every result. Keep dependent operations sequential.'
    : 'Group independent calls using the current DSH executor and its declared tools. Inspect every result and keep dependent operations sequential. Do not assume a separate code-orchestration tool.'
  const jobText = 'Use the native shell job protocol and only identifiers it returned. Collect results with the declared job-output tool and cancel with the declared cancellation tool when available. Forward process input only if a tool explicitly supports it; a job-output reader is not an interactive stdin channel.'
  let text = template
  for (const heading of ['# Tools', '# Tool Guidelines', '## Shell commands', '## apply_patch', '## `apply_patch`', '## update_plan', '## `update_plan`']) {
    text = replaceMarkdownSection(text, heading, `${heading}\nUse the native DSH tool definitions and execution contract supplied below. Follow the actual schemas instead of the model template's original platform-specific tool interface.`)
  }
  text = replaceMarkdownSection(text, '# Using skills', '# Skills and project instructions\nRead applicable project instructions and use the skill discovery/reading capabilities actually supplied by DSH. Follow their declared locators and schemas; use filesystem tools for confirmed local skill files when appropriate. Do not assume Codex-specific skills.list or skills.read APIs. User instructions and current execution policy remain authoritative.')
  text = replaceMarkdownSection(text, '# Plugins and Apps', '# Connected capabilities\nDiscover and use connected tools when they help complete the task. Use only discovery APIs, tool namespaces, and schemas actually supplied by DSH. A description of Codex plugins, ALL_TOOLS, or resources does not establish that those APIs exist in this session.')
  const seen = new Set()
  text = text.split(/\n\s*\n/).map(paragraph => {
    let result = paragraph
    if (/functions\.(?:request_user_input(?:_async)?|send_user_message_async)|\brequest_user_input(?:_async)?\b/.test(result)) result = questionText
    else if (/functions\.exec\b|multi_tool_use\.parallel/.test(result)) result = parallelText
    else if (/\bwrite_stdin\b/.test(result) && !byName.has('write_stdin')) result = jobText
    else if (/\bexec_command\b/.test(result)) result = 'Treat shell command text as executable code. Quote data safely so command substitution cannot expose secrets or change the command. Use the actual shell tool schema and argument names supplied by DSH.'
    else if (/\bapply_patch\b/.test(result) && !byName.has('apply_patch')) result = 'Make coherent changes with the file mutation capabilities actually supplied by DSH. Collect related replacements, preserve user work, and verify the resulting diff. Follow their declared schemas and the current execution interface; do not invent a patch tool.'
    else if (/\bview_image\b/.test(result) && !byName.has('view_image') && !byName.has('read_image')) result = 'Use attached image inputs directly. Inspect confirmed local images with an available image-reading capability when one is supplied; do not invent an image tool or claim to have seen pixels that were not loaded.'
    else if (/\bupdate_plan\b/.test(result) && !['update_todo', 'todo', 'todo_write', 'todowrite', 'update_plan'].some(name => byName.has(name))) result = 'Keep a concise plan for multi-step work and update it as evidence changes. Use an available task-tracking capability when supplied, otherwise track the plan in the conversation.'
    if ([questionText, parallelText, jobText].includes(result)) {
      if (seen.has(result)) return ''
      seen.add(result)
    }
    return result
  }).filter(Boolean).join('\n\n')
  const aliases = {
    view_image: ['read_image', 'view_image'],
    update_plan: ['update_todo', 'todo', 'todo_write', 'todowrite', 'update_plan'],
  }
  for (const [original, candidates] of Object.entries(aliases)) {
    const actual = candidates.find(name => byName.has(name))
    if (actual && actual !== original) text = text.replace(new RegExp(`\\b${original}\\b`, 'g'), actual)
  }
  text = normalizeForeignToolReferences(text, byName)
  return normalizeFileLinkInstructions(text)
}

export function render(template, options = {}) {
  const guidance = renderToolGuidance(options)
  // Model-specific wording is normalized for every provider. Otherwise the
  // generic path could reintroduce foreign tool names or contradictory links.
  let text = adaptCodexTemplate(template, options)
  let inserted = false
  text = text.replace(/\$\{(?:OPENCODE|DSH)_TOOL_GUIDANCE\}/g, () => {
    if (inserted) return ''
    inserted = true
    return guidance
  })
  for (const key of ['model', 'provider']) if (typeof options[key] === 'string') text = text.replaceAll(`{{${key}}}`, options[key])
  if (!text.includes(guidance)) text = `${text.trim()}\n\n${guidance}`
  return text
}

export function compose(original, rendered, mode = 'override') {
  if (!['override', 'replace', 'append'].includes(mode)) throw new Error(`Unsupported prompt composition mode: ${mode}`)
  return mode === 'append' && original.trim() ? `${original}\n\n${rendered}` : rendered
}

export function transform(assembly, { text, mode = 'override', replaceNames = [], sectionName = 'studio:dsh-codex:model-base' }) {
  compose('', '', mode)
  const replaced = new Set(replaceNames)
  const sections = assembly.sections.filter(section => section.name !== sectionName)
  if (mode === 'append') return { ...assembly, sections: [...sections, { name: sectionName, text, interpolate: false }] }
  const first = sections.findIndex(section => replaced.has(section.name))
  const retained = sections.filter(section => !replaced.has(section.name))
  const insertion = first < 0 ? 0 : sections.slice(0, first).filter(section => !replaced.has(section.name)).length
  retained.splice(insertion, 0, { name: sectionName, text, interpolate: false })
  return { ...assembly, sections: retained }
}

export const name = '提示词渲染与组合'
export function apply(ctx) {
  ctx.provide('studioPromptRenderer', { render, definitions: renderToolDefinitions, compose, transform })
}
export default { name, apply }
