const NAME = /^[A-Za-z0-9_./:\[\]-]+$/;
const ORIENTS = new Set(['R0', 'R180', 'MX', 'MY']);
const finite = (values) => values.every(Number.isFinite);
const rect = (m) => [m.x, m.y, m.x + m.width, m.y + m.height];
const haloRect = (m) => { const r = rect(m), [l, b, right, t] = m.halo; return [r[0] - l, r[1] - b, r[2] + right, r[3] + t]; };
const overlaps = (a, b) => Math.min(a[2], b[2]) - Math.max(a[0], b[0]) > 1e-9 && Math.min(a[3], b[3]) - Math.max(a[1], b[1]) > 1e-9;
export function analyzeFloorplan(plan) {
    const errors = [], warnings = [], info = [];
    if (!plan || plan.units !== 'um')
        errors.push('units must be explicitly "um"');
    if (!Array.isArray(plan?.core) || plan.core.length !== 4 || !finite(plan.core) || plan.core[0] >= plan.core[2] || plan.core[1] >= plan.core[3])
        errors.push('core must be finite [lx,ly,ux,uy] with positive area');
    if (!Array.isArray(plan?.macros) || plan.macros.length < 1 || plan.macros.length > 64)
        errors.push('macros must contain 1..64 entries');
    if (errors.length)
        return { valid: false, errors, warnings, info, weightedCenterL1: null };
    const names = new Set();
    for (const [i, m] of plan.macros.entries()) {
        if (!m || typeof m.name !== 'string' || !NAME.test(m.name) || /[{};$`\\\s]/.test(m.name)) {
            errors.push(`macro[${i}] has unsafe or invalid instance name`);
            continue;
        }
        if (names.has(m.name))
            errors.push(`duplicate macro instance: ${m.name}`);
        names.add(m.name);
        if (!ORIENTS.has(m.orient))
            errors.push(`${m.name}: unsupported orientation ${m.orient}`);
        if (!finite([m.x, m.y, m.width, m.height]) || m.width <= 0 || m.height <= 0) {
            errors.push(`${m.name}: coordinates/dimensions must be finite and dimensions positive`);
            continue;
        }
        if (!Array.isArray(m.halo) || m.halo.length !== 4 || !finite(m.halo) || m.halo.some(x => x < 0))
            errors.push(`${m.name}: halo must be [left,bottom,right,top] nonnegative microns`);
        const r = rect(m), c = plan.core;
        if (r[0] < c[0] || r[1] < c[1] || r[2] > c[2] || r[3] > c[3])
            errors.push(`${m.name}: macro rectangle is outside core`);
        if (Array.isArray(m.halo) && m.halo.length === 4 && finite(m.halo) && m.halo.every(x => x >= 0)) {
            const h = haloRect(m);
            if (h[0] < c[0] || h[1] < c[1] || h[2] > c[2] || h[3] > c[3])
                warnings.push(`${m.name}: placement halo extends outside core`);
        }
    }
    for (let i = 0; i < plan.macros.length; i++)
        for (let j = i + 1; j < plan.macros.length; j++) {
            const a = plan.macros[i], b = plan.macros[j];
            if (overlaps(rect(a), rect(b)))
                errors.push(`macro overlap: ${a.name} and ${b.name}`);
            if (Array.isArray(a.halo) && a.halo.length === 4 && Array.isArray(b.halo) && b.halo.length === 4 && overlaps(haloRect(a), haloRect(b)))
                warnings.push(`halo overlap: ${a.name} and ${b.name}`);
            const ar = rect(a), br = rect(b), dx = Math.max(0, Math.max(ar[0] - br[2], br[0] - ar[2])), dy = Math.max(0, Math.max(ar[1] - br[3], br[1] - ar[3]));
            if (plan.min_channel !== undefined && dx + dy < plan.min_channel && !overlaps(ar, br))
                warnings.push(`channel proxy below min_channel: ${a.name} / ${b.name}`);
        }
    for (const [i, k] of (plan.keepouts ?? []).entries()) {
        if (!k || typeof k.name !== 'string' || !Array.isArray(k.box) || k.box.length !== 4 || !finite(k.box) || k.box[0] >= k.box[2] || k.box[1] >= k.box[3]) {
            errors.push(`keepout[${i}] is invalid`);
            continue;
        }
        for (const m of plan.macros)
            if (overlaps(rect(m), k.box))
                errors.push(`${m.name}: macro overlaps keepout ${k.name}`);
    }
    const points = new Map();
    for (const m of plan.macros)
        points.set(m.name, [m.x + m.width / 2, m.y + m.height / 2]);
    for (const [i, a] of (plan.anchors ?? []).entries()) {
        if (!a || typeof a.name !== 'string' || !NAME.test(a.name) || !finite([a.x, a.y]) || points.has(a.name))
            errors.push(`anchor[${i}] is invalid or duplicates a macro/anchor name`);
        else
            points.set(a.name, [a.x, a.y]);
    }
    let weightedCenterL1 = 0;
    for (const [i, edge] of (plan.connections ?? []).entries()) {
        const a = points.get(edge?.from), b = points.get(edge?.to), weight = edge?.weight ?? 1;
        if (!a || !b || !Number.isFinite(weight) || weight <= 0) {
            errors.push(`connection[${i}] has unknown endpoint or nonpositive/nonfinite weight`);
            continue;
        }
        weightedCenterL1 += weight * (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]));
    }
    if (plan.min_channel !== undefined && (!Number.isFinite(plan.min_channel) || plan.min_channel < 0))
        errors.push('min_channel must be a nonnegative finite number');
    info.push('weightedCenterL1 is a geometry-only proxy from declared center/anchor points, not HPWL or Innovus QoR');
    info.push('dimensions, orientation, core, anchors, connectivity and constraints are caller-supplied; tool does not read LEF/DEF');
    info.push('does not check pin access, routing capacity, PG/IR, MMMC timing, site/grid snapping, DRC/LVS, or signoff');
    return { valid: errors.length === 0, errors, warnings, info, weightedCenterL1: errors.length ? null : Number(weightedCenterL1.toFixed(4)) };
}
function proxy(plan) {
    const points = new Map();
    for (const m of plan.macros)
        points.set(m.name, [m.x + m.width / 2, m.y + m.height / 2]);
    for (const a of plan.anchors ?? [])
        points.set(a.name, [a.x, a.y]);
    return (plan.connections ?? []).reduce((sum, e) => { const a = points.get(e.from), b = points.get(e.to); return sum + (e.weight ?? 1) * (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])); }, 0);
}
function rng(seed) { let state = seed >>> 0; return () => { state = (1664525 * state + 1013904223) >>> 0; return state / 0x100000000; }; }
export function optimizeFloorplan(plan, iterations, seed, gridUm, maxStepUm) {
    const baseline = analyzeFloorplan(plan);
    if (!baseline.valid)
        throw new Error(`baseline has hard geometry errors: ${baseline.errors.join('; ')}`);
    if (!Number.isInteger(iterations) || iterations < 1 || iterations > 2000)
        throw new Error('iterations must be an integer from 1 to 2000');
    if (!Number.isInteger(seed) || seed < 0 || seed > 2147483647)
        throw new Error('seed must be an integer from 0 to 2147483647');
    if (!Number.isFinite(gridUm) || gridUm <= 0 || !Number.isFinite(maxStepUm) || maxStepUm < gridUm || maxStepUm > 1000)
        throw new Error('gridUm must be positive and maxStepUm must be between gridUm and 1000 um');
    const movable = plan.macros.filter(m => !m.locked).map(m => m.name);
    if (!movable.length)
        throw new Error('all macros are locked; no candidate moves are permitted');
    const random = rng(seed), baselineScore = proxy(plan), baselineWarningCount = baseline.warnings.length;
    let best = structuredClone(plan), bestScore = baselineScore, accepted = 0;
    const c = plan.core, steps = Math.max(1, Math.floor(maxStepUm / gridUm));
    for (let i = 0; i < iterations; i++) {
        const candidate = structuredClone(best), m = candidate.macros.find(row => row.name === movable[Math.floor(random() * movable.length)]);
        const key = random() < 0.5 ? 'x' : 'y', sign = random() < 0.5 ? -1 : 1;
        const delta = (1 + Math.floor(random() * steps)) * gridUm * sign;
        m[key] = Number((m[key] + delta).toFixed(6));
        const report = analyzeFloorplan(candidate);
        if (!report.valid || report.warnings.length > baselineWarningCount)
            continue;
        const score = proxy(candidate);
        if (score < bestScore - 1e-9) {
            best = candidate;
            bestScore = score;
            accepted++;
        }
    }
    const final = analyzeFloorplan(best);
    return { plan: best, report: { algorithm: 'bounded deterministic local coordinate search', seed, iterations, gridUm, maxStepUm, baselineProxy: Number(baselineScore.toFixed(4)), candidateProxy: Number(bestScore.toFixed(4)), acceptedImprovements: accepted, baselineWarnings: baselineWarningCount, candidateWarnings: final.warnings.length, proxyDelta: Number((bestScore - baselineScore).toFixed(4)), disclaimer: 'Proxy-only candidate search. Improvement applies only to declared weighted-center Manhattan distance; it is not measured Innovus QoR or signoff.' } };
}
function word(value) { return `{${value}}`; }
export function emitMacroTcl(plan, ui) {
    const mode = ui === 'legacy' ? 'Legacy' : 'Stylus Common UI';
    const lines = [`# PROPOSAL ONLY - ${mode}`, '# Geometry checks are preliminary and are not Innovus legality/signoff.', '# Review macro names, dimensions, orientation, pin access, PG, and tool-version syntax before use.'];
    for (const m of plan.macros) {
        if (ui === 'legacy') {
            lines.push(`placeInstance ${word(m.name)} ${m.x} ${m.y} ${m.orient}`, `setInstancePlacementStatus -name ${word(m.name)} -status fixed`);
            if (m.halo.some(x => x > 0))
                lines.push(`addHaloToBlock ${m.halo.join(' ')} ${word(m.name)}`);
        }
        else {
            lines.push(`place_inst ${word(m.name)} {${m.x} ${m.y}} ${m.orient} -fixed`);
            if (m.halo.some(x => x > 0))
                lines.push(`create_place_halo -insts ${word(m.name)} -halo_deltas {${m.halo.join(' ')}}`);
        }
    }
    lines.push(ui === 'legacy' ? 'checkFPlan -reportUtil' : 'check_floorplan -report_density', '');
    return lines.join('\n');
}
