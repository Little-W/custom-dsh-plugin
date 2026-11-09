#!/usr/bin/env node
/** Update repository bundles through DSH Desktop's generation manager. */
import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { resolve, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const config = process.env.DSH_DESKTOP_CONFIG || resolve(process.env.HOME || '', '.config/dsh-desktop')
const dshHomeDefault = resolve(config, 'harness')
const logPath = resolve(config, 'logs/harness.log')
const helperPath = resolve(root, 'scripts/install-desktop-generations.mjs')
const dryRun = process.argv.includes('--dry-run')
const bundles = await Promise.all(['dsh-codex', 'visual-workflow'].map(async name => {
  const directory = resolve(root, 'plugins', name)
  const manifest = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'))
  if (!manifest.name || !manifest.version || !manifest.dsh?.bundle?.patch) {
    throw new Error(`Invalid DSH bundle: ${directory}`)
  }
  return { directory, name: manifest.name, version: manifest.version }
}))

function latestMatch(log, pattern, label) {
  const matches = [...log.matchAll(pattern)]
  if (!matches.length) throw new Error(`Could not find ${label} in ${logPath}. Start DSH Desktop first.`)
  return matches.at(-1)[1].trim()
}

const log = await readFile(logPath, 'utf8')
const desktopExecutable = process.env.DSH_DESKTOP_EXECUTABLE || latestMatch(log, /^.*execPath=(.+)$/gm, 'Desktop executable')
const dshEntryPath = latestMatch(log, /^.*loading=(.+\/bin\.js)$/gm, 'DSH entry path')
const dshHome = process.env.DSH_HOME || latestMatch(log, /^.*DSH_HOME=(.+)$/gm, 'DSH_HOME') || dshHomeDefault
const appAsarMatch = dshEntryPath.match(/^(.*\/resources\/app\.asar)\/node_modules\//)
if (!appAsarMatch) throw new Error(`Cannot locate app.asar from DSH entry: ${dshEntryPath}`)
const appAsar = appAsarMatch[1]

const currentVersions = new Map()
for (const bundle of bundles) {
  try {
    const installed = JSON.parse(await readFile(resolve(dshHome, 'profiles/.generations/live', bundle.name.replaceAll('/', '+'), 'package.json'), 'utf8'))
    currentVersions.set(bundle.name, installed.version)
  } catch {
    // Generation directory IDs are hashed, so fall back to scanning below.
  }
}
if (currentVersions.size < bundles.length) {
  const { readdir } = await import('node:fs/promises')
  const generations = await readdir(resolve(dshHome, 'profiles/.generations/live'), { withFileTypes: true })
  for (const entry of generations) {
    if (!entry.isDirectory()) continue
    const bundle = bundles.find(item => item.name.replace(/^@/u, '').replaceAll('/', '+') === entry.name.split('+').slice(0, -2).join('+'))
    if (!bundle) continue
    try {
      const manifest = JSON.parse(await readFile(resolve(dshHome, 'profiles/.generations/live', entry.name, 'node_modules', ...bundle.name.split('/'), 'package.json'), 'utf8'))
      if (manifest.name === bundle.name) currentVersions.set(manifest.name, manifest.version)
    } catch {}
  }
}

const plan = bundles.map(bundle => ({
  name: bundle.name,
  from: currentVersions.get(bundle.name) ?? null,
  to: bundle.version,
  path: bundle.directory,
}))
process.stdout.write(`${JSON.stringify({ mode: dryRun ? 'dry-run' : 'generation-install', plan }, null, 2)}\n`)
if (dryRun) process.exit(0)

const result = spawnSync(desktopExecutable, [helperPath, JSON.stringify({ dshHome, dshEntryPath, appAsar, bundles })], {
  encoding: 'utf8',
  env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
  maxBuffer: 16 * 1024 * 1024,
  timeout: 15 * 60 * 1000,
})
if (result.stdout) process.stdout.write(result.stdout)
if (result.stderr) process.stderr.write(result.stderr)
if (result.error) throw result.error
if (result.status !== 0) throw new Error(`${basename(desktopExecutable)} generation installer exited with status ${result.status}`)

// Verify the projected package manifests on disk. This catches stale live
// symlinks even when the running Harness still has the previous modules loaded.
for (const bundle of bundles) {
  const manifestPath = resolve(dshHome, 'profiles/web/node_modules', ...bundle.name.split('/'), 'package.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  if (manifest.version !== bundle.version) {
    throw new Error(`Verification failed for ${bundle.name}: expected ${bundle.version}, found ${manifest.version}`)
  }
}
process.stdout.write('Verified both new package versions in the Desktop web profile. Restart DSH Desktop to load them into the running Harness.\n')
