/**
 * Evaluación de contraste WCAG 2.1 — Relative Luminance.
 * Fórmula: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 *
 * Uso principal: advertencia no bloqueante al elegir un color de turno (RG-007).
 */

const HEX_COLOR_RE = /^#([0-9A-Fa-f]{6})$/

/**
 * Descompone un color hex en sus canales RGB (0–255).
 * Retorna null si el formato es inválido.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = HEX_COLOR_RE.exec(hex)
  if (!match) return null
  return {
    r: parseInt(match[1].slice(0, 2), 16),
    g: parseInt(match[1].slice(2, 4), 16),
    b: parseInt(match[1].slice(4, 6), 16),
  }
}

/**
 * Linealiza un canal de color sRGB (0–255) al espacio lineal.
 * Fórmula WCAG 2.1 sección 1.4.3.
 */
function linearize(channel: number): number {
  const sRGB = channel / 255
  return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
}

/**
 * Calcula la luminancia relativa de un color hex.
 * Resultado en rango [0, 1] donde 0 = negro, 1 = blanco.
 * Retorna null si el hex es inválido.
 */
export function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b)
}

/**
 * Calcula el ratio de contraste entre dos colores hex.
 * Resultado en rango [1, 21] donde 21 = máximo contraste (negro/blanco).
 * Retorna null si cualquier hex es inválido.
 */
export function contrastRatio(hex1: string, hex2: string): number | null {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  if (l1 === null || l2 === null) return null

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Verifica si dos colores cumplen el nivel AA de WCAG 2.1 (ratio ≥ 4.5:1).
 * Retorna false si cualquier hex es inválido.
 */
export function meetsWCAGAA(hex1: string, hex2: string): boolean {
  const ratio = contrastRatio(hex1, hex2)
  return ratio !== null && ratio >= 4.5
}

/**
 * Evalúa si un color de turno tiene suficiente contraste sobre los fondos
 * del design system (light y dark). Devuelve el ratio para cada modo.
 *
 * lightSurface: #F9FAFB (surface-base modo claro)
 * darkSurface:  #111827 (surface-base modo oscuro)
 */
export function evaluateShiftColorContrast(
  shiftColor: string,
  lightSurface = '#F9FAFB',
  darkSurface = '#111827'
): {
  lightRatio: number | null
  darkRatio: number | null
  passesLight: boolean
  passesDark: boolean
} {
  const lightRatio = contrastRatio(shiftColor, lightSurface)
  const darkRatio = contrastRatio(shiftColor, darkSurface)
  return {
    lightRatio,
    darkRatio,
    passesLight: lightRatio !== null && lightRatio >= 4.5,
    passesDark: darkRatio !== null && darkRatio >= 4.5,
  }
}
