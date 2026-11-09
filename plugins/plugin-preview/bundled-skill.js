import { readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export function bundledUiSkill() {
  const path = fileURLToPath(new URL('./skills/ui-style-design/SKILL.md', import.meta.url))
  const raw = readFileSync(path, 'utf8')
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw)
  const name = /^name:\s*(.+)$/m.exec(frontmatter?.[1] ?? '')?.[1]?.trim()
  const description = /^description:\s*(.+)$/m.exec(frontmatter?.[1] ?? '')?.[1]?.trim()
  if (name !== 'ui-style-design' || !description) throw new Error('打包的 UI 设计 skill 缺少有效元数据')
  return { name, description, path, content: raw.slice(frontmatter[0].length).trim(), source: 'bundled', resourceBase: { kind: 'directory', path: dirname(path) } }
}
