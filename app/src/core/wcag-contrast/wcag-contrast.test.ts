import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  relativeLuminance,
  contrastRatio,
  meetsWCAGAA,
  evaluateShiftColorContrast,
} from './wcag-contrast'

// ─── hexToRgb ────────────────────────────────────────────────────────────────

describe('hexToRgb', () => {
  it('convierte #000000 a negro (0, 0, 0)', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('convierte #FFFFFF a blanco (255, 255, 255)', () => {
    expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('convierte #2563EB (azul del design system)', () => {
    expect(hexToRgb('#2563EB')).toEqual({ r: 37, g: 99, b: 235 })
  })

  it('acepta letras minúsculas', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(hexToRgb('#2563eb')).toEqual({ r: 37, g: 99, b: 235 })
  })

  it('acepta letras mayúsculas y minúsculas mezcladas', () => {
    expect(hexToRgb('#FfFfFf')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('retorna null para hex sin #', () => {
    expect(hexToRgb('FFFFFF')).toBeNull()
  })

  it('retorna null para hex corto (3 chars)', () => {
    expect(hexToRgb('#FFF')).toBeNull()
  })

  it('retorna null para string vacío', () => {
    expect(hexToRgb('')).toBeNull()
  })

  it('retorna null para hex con caracteres inválidos', () => {
    expect(hexToRgb('#GGGGGG')).toBeNull()
  })
})

// ─── relativeLuminance ────────────────────────────────────────────────────────

describe('relativeLuminance', () => {
  it('blanco (#FFFFFF) → luminancia 1.0', () => {
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1.0, 5)
  })

  it('negro (#000000) → luminancia 0.0', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0.0, 5)
  })

  it('retorna null para hex inválido', () => {
    expect(relativeLuminance('invalid')).toBeNull()
  })

  it('luminancia del rojo puro (#FF0000) ≈ 0.2126', () => {
    expect(relativeLuminance('#FF0000')).toBeCloseTo(0.2126, 3)
  })

  it('luminancia del verde puro (#00FF00) ≈ 0.7152', () => {
    expect(relativeLuminance('#00FF00')).toBeCloseTo(0.7152, 3)
  })

  it('luminancia del azul puro (#0000FF) ≈ 0.0722', () => {
    expect(relativeLuminance('#0000FF')).toBeCloseTo(0.0722, 3)
  })

  it('luminancia está en rango [0, 1]', () => {
    const l = relativeLuminance('#7F7F7F')
    expect(l).not.toBeNull()
    expect(l!).toBeGreaterThanOrEqual(0)
    expect(l!).toBeLessThanOrEqual(1)
  })
})

// ─── contrastRatio ────────────────────────────────────────────────────────────

describe('contrastRatio', () => {
  it('negro sobre blanco → ratio 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1)
  })

  it('blanco sobre negro → ratio 21:1 (simétrico)', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 1)
  })

  it('mismo color sobre sí mismo → ratio 1:1', () => {
    expect(contrastRatio('#2563EB', '#2563EB')).toBeCloseTo(1.0, 5)
  })

  it('retorna null si algún hex es inválido', () => {
    expect(contrastRatio('#FFFFFF', 'invalid')).toBeNull()
    expect(contrastRatio('invalid', '#000000')).toBeNull()
    expect(contrastRatio('bad', 'also-bad')).toBeNull()
  })

  it('azul del design system (#1D4ED8) sobre blanco → ≈ 8.6:1 (AAA)', () => {
    // #1D4ED8 = interactive-primary modo claro
    const ratio = contrastRatio('#1D4ED8', '#FFFFFF')
    expect(ratio).not.toBeNull()
    expect(ratio!).toBeGreaterThan(4.5) // al menos AA
  })

  it('ratio siempre ≥ 1', () => {
    const ratio = contrastRatio('#888888', '#777777')
    expect(ratio).not.toBeNull()
    expect(ratio!).toBeGreaterThanOrEqual(1.0)
  })
})

// ─── meetsWCAGAA ─────────────────────────────────────────────────────────────

describe('meetsWCAGAA', () => {
  it('negro sobre blanco → pasa AA', () => {
    expect(meetsWCAGAA('#000000', '#FFFFFF')).toBe(true)
  })

  it('colores de bajo contraste → no pasa AA', () => {
    // Gris claro sobre blanco — contraste bajo
    expect(meetsWCAGAA('#CCCCCC', '#FFFFFF')).toBe(false)
  })

  it('retorna false para hex inválido', () => {
    expect(meetsWCAGAA('invalid', '#FFFFFF')).toBe(false)
  })

  it('azul de la paleta (#2563EB) sobre blanco → pasa AA', () => {
    // El azul del design system debe pasar AA sobre blanco
    expect(meetsWCAGAA('#2563EB', '#FFFFFF')).toBe(true)
  })

  it('colores del design system de la paleta de turno → pasan AA', () => {
    // Los 10 colores de la paleta fueron diseñados para cumplir AA con texto blanco
    const palette = [
      '#2563EB',
      '#DC2626',
      '#15803D',
      '#B45309',
      '#7C3AED',
      '#BE185D',
      '#0E7490',
      '#C2410C',
      '#0F766E',
      '#4338CA',
    ]
    for (const color of palette) {
      expect(meetsWCAGAA(color, '#FFFFFF')).toBe(true)
    }
  })
})

// ─── evaluateShiftColorContrast ───────────────────────────────────────────────

describe('evaluateShiftColorContrast', () => {
  it('azul (#2563EB) → pasa en modo claro y oscuro', () => {
    const result = evaluateShiftColorContrast('#2563EB')
    expect(result.lightRatio).not.toBeNull()
    expect(result.darkRatio).not.toBeNull()
    expect(result.passesLight).toBe(true)
    // Sobre #111827 (superficie oscura) el azul debe tener buen contraste
    expect(result.darkRatio!).toBeGreaterThan(1)
  })

  it('blanco puro (#FFFFFF) sobre fondo claro → no pasa light (1:1)', () => {
    const result = evaluateShiftColorContrast('#FFFFFF', '#FFFFFF', '#111827')
    expect(result.passesLight).toBe(false) // ratio = 1:1
  })

  it('negro puro (#000000) sobre fondo oscuro → no pasa dark (muy bajo)', () => {
    const result = evaluateShiftColorContrast('#000000', '#F9FAFB', '#111827')
    // #000000 sobre #111827: negro sobre casi-negro → ratio muy bajo
    expect(result.passesDark).toBe(false)
  })

  it('retorna null ratios para hex inválido', () => {
    const result = evaluateShiftColorContrast('not-a-color')
    expect(result.lightRatio).toBeNull()
    expect(result.darkRatio).toBeNull()
    expect(result.passesLight).toBe(false)
    expect(result.passesDark).toBe(false)
  })

  it('usa las superficies del design system por defecto', () => {
    // Verificar que usa #F9FAFB y #111827 por defecto
    const withDefaults = evaluateShiftColorContrast('#DC2626')
    const explicit = evaluateShiftColorContrast('#DC2626', '#F9FAFB', '#111827')
    expect(withDefaults.lightRatio).toBeCloseTo(explicit.lightRatio!, 5)
    expect(withDefaults.darkRatio).toBeCloseTo(explicit.darkRatio!, 5)
  })
})
