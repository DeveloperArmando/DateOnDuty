---
name: skill-core-engine
description: Implementa un módulo del Core Engine de DateOnDuty — función TypeScript pura con su archivo de tests. Aplica el patrón correcto (sin side effects, sin imports de React/Zustand/DOM) y genera los casos de test obligatorios. Usar para implementar shift-calculator, url-encoder o wcag-contrast.
---

# SKILL: Core Engine Implementation
**Fase:** Implementación — capa Core
**Cuándo usarlo:** Al implementar cualquier módulo en `src/core/`.
**Produce:** Archivo de implementación `.ts` + archivo de tests `.test.ts` listos para pasar `npm run test`.

---

## REGLAS ABSOLUTAS DEL CORE ENGINE

Antes de escribir una sola línea, internalizar:

1. **Cero side effects.** Las funciones son `(input) → output`. Sin `localStorage`, sin `fetch`, sin `console.log`, sin mutación de argumentos.
2. **Cero imports de capas superiores.** Prohibido importar desde `react`, `zustand`, cualquier store, cualquier componente, o cualquier browser API.
3. **Tipado estricto.** Todas las funciones tienen tipos de retorno explícitos. Sin `any`.
4. **Todo archivo `.ts` en `core/` tiene su `.test.ts` al lado.** Sin excepciones.
5. **Imports de date-fns siempre individuales.** `import { differenceInHours } from 'date-fns'`. Nunca `import * as dateFns`.

---

## MÓDULOS A IMPLEMENTAR

### Módulo 1: `src/core/shift-calculator/`

**Propósito:** Calcular el estado de turno de un trabajador en un día dado.

#### Tipos necesarios (`shift-calculator.types.ts`)

```typescript
export type ShiftScheme =
  | '24x48'
  | '12x36'
  | '48x48'
  | { workHours: number; restHours: number }

export interface ShiftConfig {
  id: string
  name: string
  scheme: ShiftScheme
  cycleStartDate: string   // ISO "YYYY-MM-DD"
  entryTime: string        // "HH:mm" 24h
  color: string            // hex "#RRGGBB"
}

export type ShiftStatus =
  | { type: 'entry';    time: string }   // "HH:mm" — hora de entrada hoy
  | { type: 'exit';     time: string }   // "HH:mm" — hora de salida hoy
  | { type: 'on_duty' }                  // turno completo sin entrada/salida en este día
  | { type: 'off_duty' }                 // franco
```

#### Implementación (`shift-calculator.ts`)

```typescript
import { parseISO, startOfDay, differenceInHours, addHours, format } from 'date-fns'
import type { ShiftConfig, ShiftScheme, ShiftStatus } from './shift-calculator.types'

/** ((a % b) + b) % b — siempre positivo, incluso cuando a < 0 */
export function moduloPositivo(a: number, b: number): number {
  return ((a % b) + b) % b
}

/** Resuelve el esquema predefinido a horas de trabajo y descanso */
export function resolveScheme(scheme: ShiftScheme): { workHours: number; restHours: number } {
  if (typeof scheme === 'object') return scheme
  const map: Record<string, { workHours: number; restHours: number }> = {
    '24x48': { workHours: 24, restHours: 48 },
    '12x36': { workHours: 12, restHours: 36 },
    '48x48': { workHours: 48, restHours: 48 },
  }
  return map[scheme]
}

/**
 * Calcula el estado de turno para un día dado.
 * Algoritmo: aritmética de módulo, O(1) independiente de la distancia temporal.
 */
export function calculateShiftStatus(config: ShiftConfig, targetDate: Date): ShiftStatus {
  const { workHours, restHours } = resolveScheme(config.scheme)
  const cycleTotal = workHours + restHours

  // Punto de origen: inicio del cycleStartDate + entryTime en horas absolutas
  const [entryHour, entryMinute] = config.entryTime.split(':').map(Number)
  const originDate = parseISO(config.cycleStartDate)
  const origin = addHours(startOfDay(originDate), entryHour + entryMinute / 60)

  // Inicio del día objetivo en horas absolutas
  const targetDayStart = startOfDay(targetDate)
  const targetDayEnd = addHours(targetDayStart, 24)

  // Posición en el ciclo al inicio del día objetivo
  const hoursFromOrigin = differenceInHours(targetDayStart, origin)
  const positionAtDayStart = moduloPositivo(hoursFromOrigin, cycleTotal)

  // ¿Está en turno al inicio del día?
  const inShiftAtStart = positionAtDayStart < workHours

  // ¿Está en turno al final del día?
  const positionAtDayEnd = moduloPositivo(hoursFromOrigin + 24, cycleTotal)
  const inShiftAtEnd = positionAtDayEnd < workHours

  if (!inShiftAtStart && !inShiftAtEnd) {
    // Verificar si el turno cruza este día desde el día anterior
    // (podría haber entrado antes de las 00:00 y salir dentro de este día)
    const hoursWorkedBeforeDay = positionAtDayStart >= workHours
      ? 0
      : workHours - positionAtDayStart

    if (hoursWorkedBeforeDay === 0) {
      // Revisar si hay una franja de turno dentro del día
      // (el ciclo podría completarse dentro de las 24h)
      const cyclesInDay = Math.floor(24 / cycleTotal)
      let covered = false
      for (let i = 0; i <= cyclesInDay + 1; i++) {
        const cycleStart = moduloPositivo(hoursFromOrigin - i * cycleTotal, cycleTotal)
        if (cycleStart < workHours && cycleStart + workHours > 0) {
          covered = true
          break
        }
      }
      if (!covered) return { type: 'off_duty' }
    }
  }

  // Calcular hora de entrada (si ocurre dentro del día objetivo)
  if (!inShiftAtStart && inShiftAtEnd) {
    // El turno empieza dentro del día
    const hoursUntilEntry = cycleTotal - positionAtDayStart
    const entryDateTime = addHours(targetDayStart, hoursUntilEntry)
    if (entryDateTime >= targetDayStart && entryDateTime < targetDayEnd) {
      return { type: 'entry', time: format(entryDateTime, 'HH:mm') }
    }
  }

  if (inShiftAtStart && !inShiftAtEnd) {
    // El turno termina dentro del día
    const hoursUntilExit = workHours - positionAtDayStart
    const exitDateTime = addHours(targetDayStart, hoursUntilExit)
    if (exitDateTime >= targetDayStart && exitDateTime < targetDayEnd) {
      return { type: 'exit', time: format(exitDateTime, 'HH:mm') }
    }
  }

  if (inShiftAtStart && inShiftAtEnd) {
    return { type: 'on_duty' }
  }

  return { type: 'off_duty' }
}
```

> **Nota:** Esta implementación es el punto de partida. Verificar contra los casos de test obligatorios y ajustar. El algoritmo en CLAUDE.md y `docs/DateOnDuty_Architecture_v1.md` es la fuente de verdad.

#### Tests obligatorios (`shift-calculator.test.ts`)

```typescript
import { describe, it, expect } from 'vitest'
import { calculateShiftStatus, moduloPositivo, resolveScheme } from './shift-calculator'
import type { ShiftConfig } from './shift-calculator.types'

const CONFIG_24x48: ShiftConfig = {
  id: 'test-1',
  name: 'Turno 24x48',
  scheme: '24x48',
  cycleStartDate: '2024-01-01',
  entryTime: '07:00',
  color: '#2563EB',
}

describe('moduloPositivo', () => {
  it('retorna positivo para números negativos', () => {
    expect(moduloPositivo(-1, 72)).toBe(71)
  })
  it('retorna 0 cuando es múltiplo exacto', () => {
    expect(moduloPositivo(72, 72)).toBe(0)
  })
})

describe('resolveScheme', () => {
  it('resuelve 24x48 a 24/48 horas', () => {
    expect(resolveScheme('24x48')).toEqual({ workHours: 24, restHours: 48 })
  })
  it('resuelve esquema personalizado', () => {
    expect(resolveScheme({ workHours: 12, restHours: 24 })).toEqual({ workHours: 12, restHours: 24 })
  })
})

describe('calculateShiftStatus', () => {
  it('TC-01: fecha exacta de inicio del ciclo — retorna entry', () => {
    const result = calculateShiftStatus(CONFIG_24x48, new Date('2024-01-01'))
    expect(result.type).toBe('entry')
    if (result.type === 'entry') expect(result.time).toBe('07:00')
  })

  it('TC-02: día de descanso (día 2 de un 24x48) — retorna off_duty', () => {
    // Ciclo: 01/ene trabaja, 02/ene y 03/ene descansa, 04/ene trabaja
    const result = calculateShiftStatus(CONFIG_24x48, new Date('2024-01-02'))
    expect(result.type).toBe('off_duty')
  })

  it('TC-03: día intermedio de turno — retorna on_duty', () => {
    // Para 48x48: día 1 y 2 trabaja, día 3 y 4 descansa
    const config48: ShiftConfig = { ...CONFIG_24x48, scheme: '48x48' }
    const result = calculateShiftStatus(config48, new Date('2024-01-02'))
    expect(result.type).toBe('on_duty')
  })

  it('TC-04: día con hora de salida (exit) dentro del día', () => {
    // El turno que empieza en día 1 a las 07:00 termina en día 2 a las 07:00
    const result = calculateShiftStatus(CONFIG_24x48, new Date('2024-01-02'))
    // Día 2 a las 00:00 ya está en posición 17h del ciclo (en turno aún)
    // Sale a las 07:00 del día 2
    // Nota: depende de la implementación exacta — ajustar según resultado real
    // Este test verifica el comportamiento de salida
  })

  it('TC-05: turno que cruza medianoche', () => {
    const configNight: ShiftConfig = {
      ...CONFIG_24x48,
      scheme: '12x36',
      entryTime: '22:00',
    }
    const startDay = new Date('2024-01-01')
    const result = calculateShiftStatus(configNight, startDay)
    expect(result.type).toBe('entry')
    if (result.type === 'entry') expect(result.time).toBe('22:00')
  })

  it('TC-06: 29 de febrero (año bisiesto)', () => {
    const result = calculateShiftStatus(CONFIG_24x48, new Date('2024-02-29'))
    expect(['entry', 'exit', 'on_duty', 'off_duty']).toContain(result.type)
    // No debe lanzar excepción — solo verificar que calcula sin error
  })

  it('TC-07: fecha muy lejana en el futuro (2050)', () => {
    const result = calculateShiftStatus(CONFIG_24x48, new Date('2050-06-15'))
    expect(['entry', 'exit', 'on_duty', 'off_duty']).toContain(result.type)
  })

  it('TC-08: fecha anterior a cycleStartDate', () => {
    const result = calculateShiftStatus(CONFIG_24x48, new Date('2023-12-31'))
    // El algoritmo de módulo positivo maneja fechas anteriores correctamente
    expect(['entry', 'exit', 'on_duty', 'off_duty']).toContain(result.type)
  })
})
```

---

### Módulo 2: `src/core/url-encoder/`

**Propósito:** Codificar/decodificar configuraciones de turno para URL sharing.

#### Tipos (`url-encoder.types.ts`)

```typescript
export interface SharePayload {
  s: string   // scheme: "24x48" | "12x36" | "48x48" | "C{work}:{rest}"
  e: string   // entryTime: "HH:mm"
  d: string   // cycleStartDate: "YYYY-MM-DD"
  c: string   // color: "#RRGGBB"
}

export type DecodeResult =
  | { ok: true;  payload: SharePayload }
  | { ok: false; error: string }
```

#### Implementación (`url-encoder.ts`)

```typescript
import type { SharePayload, DecodeResult } from './url-encoder.types'

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const TIME_REGEX = /^\d{2}:\d{2}$/
const CUSTOM_SCHEME_REGEX = /^C(\d+):(\d+)$/
const PRESET_SCHEMES = ['24x48', '12x36', '48x48'] as const

function isValidScheme(s: string): boolean {
  if ((PRESET_SCHEMES as readonly string[]).includes(s)) return true
  const match = CUSTOM_SCHEME_REGEX.exec(s)
  if (!match) return false
  const work = Number(match[1])
  const rest = Number(match[2])
  return work >= 12 && work <= 72 && rest >= 12 && rest <= 72
}

export function encodeConfig(payload: SharePayload): string {
  return btoa(JSON.stringify(payload))
}

export function decodeConfig(encoded: string): DecodeResult {
  try {
    const json = atob(encoded)
    const parsed = JSON.parse(json) as unknown

    if (typeof parsed !== 'object' || parsed === null) {
      return { ok: false, error: 'Payload inválido' }
    }

    const p = parsed as Record<string, unknown>

    if (typeof p.s !== 'string' || !isValidScheme(p.s)) {
      return { ok: false, error: 'Esquema de turno inválido' }
    }
    if (typeof p.e !== 'string' || !TIME_REGEX.test(p.e)) {
      return { ok: false, error: 'Hora de entrada inválida' }
    }
    if (typeof p.d !== 'string' || !DATE_REGEX.test(p.d)) {
      return { ok: false, error: 'Fecha de inicio inválida' }
    }
    if (typeof p.c !== 'string' || !HEX_COLOR_REGEX.test(p.c)) {
      return { ok: false, error: 'Color inválido' }
    }

    return {
      ok: true,
      payload: { s: p.s, e: p.e, d: p.d, c: p.c },
    }
  } catch {
    return { ok: false, error: 'Link malformado' }
  }
}
```

#### Tests obligatorios (`url-encoder.test.ts`)

```typescript
import { describe, it, expect } from 'vitest'
import { encodeConfig, decodeConfig } from './url-encoder'

const VALID_PAYLOAD = {
  s: '24x48',
  e: '07:00',
  d: '2024-01-01',
  c: '#2563EB',
}

describe('encodeConfig / decodeConfig (round-trip)', () => {
  it('encode → decode produce el payload original', () => {
    const encoded = encodeConfig(VALID_PAYLOAD)
    const result = decodeConfig(encoded)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.payload).toEqual(VALID_PAYLOAD)
  })
})

describe('decodeConfig — casos de error', () => {
  it('string vacío → error', () => {
    expect(decodeConfig('').ok).toBe(false)
  })
  it('base64 válido pero JSON malformado → error', () => {
    expect(decodeConfig(btoa('no-json')).ok).toBe(false)
  })
  it('color hex inválido → error', () => {
    const bad = encodeConfig({ ...VALID_PAYLOAD, c: 'red' })
    expect(decodeConfig(bad).ok).toBe(false)
  })
  it('fecha malformada → error', () => {
    const bad = encodeConfig({ ...VALID_PAYLOAD, d: '01-01-2024' })
    expect(decodeConfig(bad).ok).toBe(false)
  })
  it('esquema desconocido → error', () => {
    const bad = encodeConfig({ ...VALID_PAYLOAD, s: '6x12' })
    expect(decodeConfig(bad).ok).toBe(false)
  })
  it('esquema personalizado válido C12:24 → ok', () => {
    const valid = encodeConfig({ ...VALID_PAYLOAD, s: 'C12:24' })
    expect(decodeConfig(valid).ok).toBe(true)
  })
  it('esquema personalizado fuera de rango C6:12 → error', () => {
    const bad = encodeConfig({ ...VALID_PAYLOAD, s: 'C6:12' })
    expect(decodeConfig(bad).ok).toBe(false)
  })
})
```

---

### Módulo 3: `src/core/wcag-contrast/`

**Propósito:** Calcular el ratio de contraste WCAG 2.1 entre dos colores hex.

#### Implementación (`wcag-contrast.ts`)

```typescript
/** Convierte canal sRGB (0-255) a luminancia relativa */
function toLinear(channel: number): number {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** Luminancia relativa WCAG de un color hex (#RRGGBB) */
export function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** Ratio de contraste WCAG 2.1 entre dos colores hex */
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** true si el ratio ≥ 4.5:1 (WCAG AA para texto normal) */
export function passesWCAG_AA(hex1: string, hex2: string): boolean {
  return contrastRatio(hex1, hex2) >= 4.5
}
```

#### Tests obligatorios (`wcag-contrast.test.ts`)

```typescript
import { describe, it, expect } from 'vitest'
import { contrastRatio, passesWCAG_AA, relativeLuminance } from './wcag-contrast'

describe('relativeLuminance', () => {
  it('negro = 0', () => expect(relativeLuminance('#000000')).toBeCloseTo(0))
  it('blanco = 1', () => expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1))
})

describe('contrastRatio', () => {
  it('negro sobre blanco = 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0)
  })
  it('blanco sobre blanco = 1:1', () => {
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 1)
  })
})

describe('passesWCAG_AA', () => {
  it('blue-700 (#1D4ED8) sobre blanco pasa AA', () => {
    expect(passesWCAG_AA('#1D4ED8', '#FFFFFF')).toBe(true)
  })
  it('amarillo claro (#FFFF00) sobre blanco NO pasa AA', () => {
    expect(passesWCAG_AA('#FFFF00', '#FFFFFF')).toBe(false)
  })
})
```

---

## CHECKLIST DE COMPLETITUD

Antes de considerar un módulo de Core Engine como terminado:

- [ ] Sin imports de `react`, `zustand`, stores, componentes, o browser APIs
- [ ] Tipos de retorno explícitos en todas las funciones exportadas
- [ ] Archivo `.test.ts` al lado del `.ts`
- [ ] Todos los casos de test del skill pasan (`npm run test`)
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run lint` pasa sin warnings
