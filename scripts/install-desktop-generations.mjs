#!/usr/bin/env node
/**
 * Runs inside the packaged Electron runtime so it can import Desktop's own
 * generation installer from app.asar. This avoids sending generation-owned
 * packages through the ordinary pnpm add/remove path.
 */
const input = JSON.parse(process.argv[2] || '{}')
if (!input.dshHome || !input.dshEntryPath || !input.appAsar || !Array.isArray(input.bundles)) {
  throw new Error('Expected dshHome, dshEntryPath, appAsar and bundles.')
}

const prefix = `file://${input.appAsar}/node_modules/dsh-desktop-market-installer/`
const [{ createGenerationPackageBackend }, { resolvePnpmEntry }] = await Promise.all([
  import(`${prefix}generations/package-backend.mjs`),
  import(`${prefix}index.js`),
])
const backend = createGenerationPackageBackend({
  dshHome: input.dshHome,
  dshEntryPath: input.dshEntryPath,
  nodeExecutablePath: process.execPath,
  pnpmEntryPath: resolvePnpmEntry(),
})
const completed = []
try {
  for (const bundle of input.bundles) {
    const result = await backend.install({
      kind: 'path',
      path: bundle.directory,
      spec: bundle.directory,
      sourceSpec: bundle.directory,
      expectedName: bundle.name,
      expectedVersion: bundle.version,
      autoInstallPeers: true,
    })
    if (result?.packageResult?.exitCode !== 0 || typeof result.commit !== 'function') {
      const details = result?.packageResult?.output?.trim() || 'Desktop generation install failed.'
      throw new Error(`${bundle.name}@${bundle.version}: ${details}`)
    }
    completed.push({ bundle, result })
  }
  for (const item of completed) item.result.commit()
  process.stdout.write(JSON.stringify({
    ok: true,
    bundles: completed.map(({ bundle, result }) => ({
      name: bundle.name,
      version: bundle.version,
      replaced: result.replaced,
      logPath: result.packageResult.logPath,
    })),
  }) + '\n')
} catch (error) {
  for (const item of completed.reverse()) {
    try { await item.result.rollback() } catch (rollbackError) {
      process.stderr.write(`Rollback failed for ${item.bundle.name}: ${rollbackError.message}\n`)
    }
  }
  throw error
}
