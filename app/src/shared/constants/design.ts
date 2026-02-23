export const DESIGN = {
  shift: {
    gradientOpacityStart: 0.9,
    gradientOpacityEnd: 0.4,
  },

  calendar: {
    maxConfigsMobile: 2,
    maxConfigsDesktop: 3,
  },

  onboarding: {
    animationDurationMs: 8_000,
    bannerDurationMs: 50_000,
  },

  feedback: {
    cooldownMs: 60_000,
    timeoutMs: 30_000,
    warningMs: 10_000,
  },

  shiftColorPalette: [
    '#2563EB', // 1 — Azul (default "Mi turno")
    '#DC2626', // 2 — Rojo
    '#15803D', // 3 — Verde
    '#B45309', // 4 — Ámbar
    '#7C3AED', // 5 — Violeta
    '#BE185D', // 6 — Rosa
    '#0E7490', // 7 — Cian
    '#C2410C', // 8 — Naranja
    '#0F766E', // 9 — Teal
    '#4338CA', // 10 — Índigo
  ] as const,

  wcag: {
    lightSurface: '#F9FAFB',
    darkSurface: '#111827',
    minContrastAA: 4.5,
  },
} as const
