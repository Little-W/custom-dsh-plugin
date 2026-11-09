export const VIEWPORT_PRESETS = Object.freeze([
  { id: 'phone-compact', label: '紧凑手机', width: 360, height: 800, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  { id: 'phone', label: '标准手机', width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  { id: 'phone-large', label: '大屏手机', width: 430, height: 932, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  { id: 'tablet', label: '平板', width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { id: 'desktop', label: '桌面', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
])

export function normalizeViewport(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('viewport 必须为对象')
  const preset = input.preset ?? 'desktop'
  const base = VIEWPORT_PRESETS.find(item => item.id === preset)
  if (!base && preset !== 'custom') throw new Error('未知设备预设')
  const width = input.width ?? base?.width, height = input.height ?? base?.height
  if (![width, height].every(value => Number.isInteger(value) && value >= 240 && value <= 4096)) throw new Error('视口宽高必须为 240–4096 的整数 CSS 像素')
  const orientation = input.orientation ?? (width > height ? 'landscape' : 'portrait')
  if (!['portrait', 'landscape'].includes(orientation)) throw new Error('orientation 必须是 portrait 或 landscape')
  const deviceScaleFactor = input.deviceScaleFactor ?? base?.deviceScaleFactor ?? 1
  if (!Number.isFinite(deviceScaleFactor) || deviceScaleFactor < 0.5 || deviceScaleFactor > 4) throw new Error('deviceScaleFactor 必须为 0.5–4')
  for (const key of ['isMobile', 'hasTouch']) if (input[key] !== undefined && typeof input[key] !== 'boolean') throw new Error(`${key} 必须为布尔值`)
  return {
    preset, orientation,
    width: orientation === 'landscape' ? Math.max(width, height) : Math.min(width, height),
    height: orientation === 'landscape' ? Math.min(width, height) : Math.max(width, height),
    deviceScaleFactor, isMobile: input.isMobile ?? base?.isMobile ?? false, hasTouch: input.hasTouch ?? base?.hasTouch ?? false,
  }
}

export function chromeEmulation(viewport) {
  return { viewport: `${viewport.width}x${viewport.height}x${viewport.deviceScaleFactor}${viewport.isMobile ? ',mobile' : ''}${viewport.hasTouch ? ',touch' : ''}${viewport.orientation === 'landscape' ? ',landscape' : ''}` }
}

export function devicePreviewUrl(base, viewport) {
  if (!base) return null
  const url = new URL(base)
  for (const [key, value] of Object.entries(viewport)) url.searchParams.set(key, String(value))
  return url.href
}
