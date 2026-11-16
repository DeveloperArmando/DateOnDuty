import { describe, it, expect } from 'vitest'
import { calculateShiftStatus, resolveScheme } from './shift-calculator'
import type { ShiftConfiguration } from './types'

// ─── Configuraciones de prueba ────────────────────────────────────────────────

function makeConfig(overrides: Partial<ShiftConfiguration> = {}): ShiftConfiguration {
  return {
    id: 'test-id',
    isDefault: true,
    name: null,
    scheme: '24x48',
    entryTime: '08:00',
    cycleStartDate: '2026-02-22',
    timeFormat: '24h',
    color: '#2563EB',
    isActive: true,
    ...overrides,
  }
}

// ─── resolveScheme ────────────────────────────────────────────────────────────

describe('resolveScheme', () => {
  it('resuelve 24x48 correctamente', () => {
    expect(resolveScheme('24x48')).toEqual({ workHours: 24, restHours: 48 })
  })

  it('resuelve 12x36 correctamente', () => {
    expect(resolveScheme('12x36')).toEqual({ workHours: 12, restHours: 36 })
  })

  it('resuelve 48x48 correctamente', () => {
    expect(resolveScheme('48x48')).toEqual({ workHours: 48, restHours: 48 })
  })

  it('resuelve esquema custom correctamente', () => {
    expect(resolveScheme({ type: 'custom', workHours: 16, restHours: 32 })).toEqual({
      workHours: 16,
      restHours: 32,
    })
  })
})

// ─── calculateShiftStatus — 24x48 con entrada 08:00 ──────────────────────────

describe('calculateShiftStatus — 24x48, entrada 08:00', () => {
  const config = makeConfig({ scheme: '24x48', entryTime: '08:00', cycleStartDate: '2026-02-22' })

  it('día exacto de inicio → entry a las 08:00', () => {
    const result = calculateShiftStatus(config, '2026-02-22')
    expect(result).toEqual({ type: 'entry', time: '08:00' })
  })

  it('día siguiente → exit a las 08:00 (turno de 24h)', () => {
    const result = calculateShiftStatus(config, '2026-02-23')
    expect(result).toEqual({ type: 'exit', time: '08:00' })
  })

  it('primer día de franco → off_duty', () => {
    const result = calculateShiftStatus(config, '2026-02-24')
    expect(result).toEqual({ type: 'off_duty' })
  })

  it('único día de franco del ciclo (día 3) → off_duty', () => {
    // 24x48 tiene ciclo de 72h = 3 días. Patrón: entry, exit, off_duty (se repite)
    const result = calculateShiftStatus(config, '2026-02-24')
    expect(result).toEqual({ type: 'off_duty' })
  })

  it('inicio del siguiente ciclo (día 4 = 2026-02-25) → entry a las 08:00', () => {
    // Ciclo = 72h. 2026-02-22@08:00 + 72h = 2026-02-25@08:00 → nuevo ciclo empieza
    const result = calculateShiftStatus(config, '2026-02-25')
    expect(result).toEqual({ type: 'entry', time: '08:00' })
  })

  it('el patrón [entry, exit, off_duty] se repite cada 3 días', () => {
    // Ciclo 1:
    expect(calculateShiftStatus(config, '2026-02-22').type).toBe('entry')
    expect(calculateShiftStatus(config, '2026-02-23').type).toBe('exit')
    expect(calculateShiftStatus(config, '2026-02-24').type).toBe('off_duty')
    // Ciclo 2:
    expect(calculateShiftStatus(config, '2026-02-25').type).toBe('entry')
    expect(calculateShiftStatus(config, '2026-02-26').type).toBe('exit')
    expect(calculateShiftStatus(config, '2026-02-27').type).toBe('off_duty')
    // Ciclo 3:
    expect(calculateShiftStatus(config, '2026-02-28').type).toBe('entry')
    expect(calculateShiftStatus(config, '2026-03-01').type).toBe('exit')
    expect(calculateShiftStatus(config, '2026-03-02').type).toBe('off_duty')
  })
})

// ─── calculateShiftStatus — 48x48 (turno largo, día intermedio) ───────────────

describe('calculateShiftStatus — 48x48, entrada 08:00', () => {
  const config = makeConfig({ scheme: '48x48', entryTime: '08:00', cycleStartDate: '2026-02-22' })

  it('día de inicio → entry a las 08:00', () => {
    expect(calculateShiftStatus(config, '2026-02-22')).toEqual({
      type: 'entry',
      time: '08:00',
    })
  })

  it('día intermedio de turno (día 2) → on_duty', () => {
    // 2026-02-23 midnight: posición = 16h = 960 min → en trabajo, exit en 48-16=32h > 24h
    expect(calculateShiftStatus(config, '2026-02-23')).toEqual({ type: 'on_duty' })
  })

  it('día de salida (día 3) → exit a las 08:00', () => {
    // 2026-02-24 midnight: posición = 40h → 2880-2400=480 min → exit en 8h
    expect(calculateShiftStatus(config, '2026-02-24')).toEqual({
      type: 'exit',
      time: '08:00',
    })
  })

  it('día de franco → off_duty', () => {
    // 48x48 tiene ciclo de 96h (4 días). Patrón: entry, on_duty, exit, off_duty
    // 2026-02-25 = día 4 del ciclo → off_duty
    // 2026-02-26 = inicio del siguiente ciclo → entry (no off_duty)
    expect(calculateShiftStatus(config, '2026-02-25').type).toBe('off_duty')
  })
})

// ─── calculateShiftStatus — turno que cruza medianoche ───────────────────────

describe('calculateShiftStatus — 12x36, entrada 20:00 (cruza medianoche)', () => {
  const config = makeConfig({ scheme: '12x36', entryTime: '20:00', cycleStartDate: '2026-02-22' })

  it('día de inicio → entry a las 20:00', () => {
    expect(calculateShiftStatus(config, '2026-02-22')).toEqual({
      type: 'entry',
      time: '20:00',
    })
  })

  it('día siguiente → exit a las 08:00 (el turno cruzó medianoche)', () => {
    // origin = 2026-02-22T20:00Z
    // 2026-02-23T00:00Z → minutesFromOrigin = 4*60 = 240
    // p = 240 < 12*60=720 → en trabajo, exit en 720-240=480 min = 08:00
    expect(calculateShiftStatus(config, '2026-02-23')).toEqual({
      type: 'exit',
      time: '08:00',
    })
  })

  it('el ciclo 12x36 con entrada 20:00 no tiene días de franco puros (ciclo de 48h)', () => {
    // Ciclo de 48h: work 12h + rest 36h. Patrón: entry@20:00, exit@08:00 (sin días de descanso completo)
    // 2026-02-24: inicio del segundo ciclo → entry@20:00
    // 2026-02-25: salida del segundo ciclo → exit@08:00
    expect(calculateShiftStatus(config, '2026-02-24')).toEqual({ type: 'entry', time: '20:00' })
    expect(calculateShiftStatus(config, '2026-02-25')).toEqual({ type: 'exit', time: '08:00' })
  })
})

// ─── calculateShiftStatus — turno de día completo (12x36, entrada 08:00) ─────

describe('calculateShiftStatus — 12x36, entrada 08:00 (entrada y salida mismo día)', () => {
  const config = makeConfig({ scheme: '12x36', entryTime: '08:00', cycleStartDate: '2026-02-22' })

  it('día de inicio → entry a las 08:00 con salida a las 20:00 el mismo día', () => {
    // p = moduloPositivo(-480, 2880) = 2400 → entrada en 480 min (08:00), salida en 1200 min (20:00)
    expect(calculateShiftStatus(config, '2026-02-22')).toEqual({
      type: 'entry',
      time: '08:00',
      exitTime: '20:00',
    })
  })

  it('día siguiente → off_duty (el turno terminó el día anterior)', () => {
    // p = 960 ≥ 720 → en descanso; próxima entrada en 1920 min (32h) → sin eventos hoy
    expect(calculateShiftStatus(config, '2026-02-23')).toEqual({ type: 'off_duty' })
  })

  it('el patrón [entry+exit, off_duty] se repite cada 2 días', () => {
    expect(calculateShiftStatus(config, '2026-02-24')).toEqual({
      type: 'entry',
      time: '08:00',
      exitTime: '20:00',
    })
    expect(calculateShiftStatus(config, '2026-02-25')).toEqual({ type: 'off_duty' })
  })
})

// ─── calculateShiftStatus — descanso corto (sale y vuelve a entrar el mismo día) ─

describe('calculateShiftStatus — custom 12x12, entrada 19:00 (turno nocturno diario)', () => {
  const config = makeConfig({
    scheme: { type: 'custom', workHours: 12, restHours: 12 },
    entryTime: '19:00',
    cycleStartDate: '2026-02-22',
  })

  it('todos los días → exit a las 07:00 y nueva entrada a las 19:00', () => {
    // p = 300 → salida en 420 min (07:00), siguiente entrada en 1140 min (19:00).
    // El ciclo es infinito hacia atrás: el día de inicio también trae la salida del ciclo previo.
    const expected = { type: 'exit', time: '07:00', entryTime: '19:00' }
    expect(calculateShiftStatus(config, '2026-02-22')).toEqual(expected)
    expect(calculateShiftStatus(config, '2026-02-23')).toEqual(expected)
    expect(calculateShiftStatus(config, '2026-02-24')).toEqual(expected)
  })
})

describe('calculateShiftStatus — custom 12x24, entrada 07:00 (alterna día y noche)', () => {
  const config = makeConfig({
    scheme: { type: 'custom', workHours: 12, restHours: 24 },
    entryTime: '07:00',
    cycleStartDate: '2026-02-22',
  })

  it('recorre el ciclo de 36h a lo largo de 3 días calendario', () => {
    // 22: 07:00–19:00 · 23: entra 19:00 · 24: sale 07:00 · 25: 07:00–19:00 (se repite)
    expect(calculateShiftStatus(config, '2026-02-22')).toEqual({
      type: 'entry',
      time: '07:00',
      exitTime: '19:00',
    })
    expect(calculateShiftStatus(config, '2026-02-23')).toEqual({ type: 'entry', time: '19:00' })
    expect(calculateShiftStatus(config, '2026-02-24')).toEqual({ type: 'exit', time: '07:00' })
    expect(calculateShiftStatus(config, '2026-02-25')).toEqual({
      type: 'entry',
      time: '07:00',
      exitTime: '19:00',
    })
  })
})

// ─── calculateShiftStatus — fechas antes del cycleStartDate ──────────────────

describe('calculateShiftStatus — fechas antes del inicio', () => {
  const config = makeConfig({ scheme: '24x48', entryTime: '08:00', cycleStartDate: '2026-02-22' })

  it('día anterior al inicio → off_duty (período de descanso previo)', () => {
    // -1 día = -1440 min → p = moduloPositivo(-1440-480, 4320) = moduloPositivo(-1920, 4320) = 2400
    // p = 2400 ≥ 1440 → en descanso, entry en 4320-2400=1920 min = 32h > 24h → off_duty
    expect(calculateShiftStatus(config, '2026-02-21')).toEqual({ type: 'off_duty' })
  })

  it('dos días antes → exit (el ciclo anterior)', () => {
    // El ciclo previo comenzó 2026-02-19T08:00Z. Feb 20 es el día 2 (exit).
    // minutesFromOrigin = -3360, p = moduloPositivo(-3360, 4320) = 960 < 1440 → exit@08:00
    expect(calculateShiftStatus(config, '2026-02-20')).toEqual({ type: 'exit', time: '08:00' })
  })

  it('tres días antes → entry (el ciclo anterior)', () => {
    // -3 días = -4320 min → minutesFromOrigin = -4320 - 480 = -4800
    // p = moduloPositivo(-4800, 4320) = (-4800 + 4320*2) % 4320 = 3840
    // p = 3840 ≥ 1440 → en descanso, entry en 4320-3840=480 min = 8h → entry a las 08:00
    expect(calculateShiftStatus(config, '2026-02-19')).toEqual({
      type: 'entry',
      time: '08:00',
    })
  })
})

// ─── calculateShiftStatus — año bisiesto ─────────────────────────────────────

describe('calculateShiftStatus — año bisiesto (Feb 29)', () => {
  const config = makeConfig({
    scheme: '24x48',
    entryTime: '08:00',
    cycleStartDate: '2024-02-28',
  })

  it('2024-02-29 (29 de febrero) → calculado correctamente', () => {
    // origin = 2024-02-28T08:00Z
    // 2024-02-29T00:00Z → minutesFromOrigin = 16*60 = 960
    // p = 960 < 1440 → en trabajo, exit en 1440-960=480 min = 8h → exit
    expect(calculateShiftStatus(config, '2024-02-29')).toEqual({
      type: 'exit',
      time: '08:00',
    })
  })

  it('2024-03-01 (día posterior al bisiesto) → off_duty', () => {
    // minutesFromOrigin = (1+16)*60 = 40*60 = 2400
    // p = 2400 ≥ 1440 → en descanso, entry en 4320-2400=1920 min = 32h > 24h → off_duty
    expect(calculateShiftStatus(config, '2024-03-01')).toEqual({ type: 'off_duty' })
  })
})

// ─── calculateShiftStatus — fechas muy lejanas ────────────────────────────────

describe('calculateShiftStatus — fechas muy lejanas', () => {
  const config = makeConfig({ scheme: '24x48', entryTime: '08:00', cycleStartDate: '2026-02-22' })

  it('10 años en el futuro → mismo punto del ciclo que el inicio', () => {
    // 2026-02-22 → 2036-02-22 = 3652 días (bisiestos 2028 y 2032). 3652 % 3 = 1 → día 2 del ciclo
    expect(calculateShiftStatus(config, '2036-02-22')).toEqual({ type: 'exit', time: '08:00' })
  })

  it('5 años en el pasado → calcula correctamente con moduloPositivo', () => {
    // 2021-02-22 → 2026-02-22 = 1826 días (bisiesto 2024). -1826 mod 3 = 1 → día 2 del ciclo
    expect(calculateShiftStatus(config, '2021-02-22')).toEqual({ type: 'exit', time: '08:00' })
  })
})

// ─── calculateShiftStatus — entryTime con minutos ────────────────────────────

describe('calculateShiftStatus — hora de entrada con minutos', () => {
  const config = makeConfig({
    scheme: '24x48',
    entryTime: '08:30',
    cycleStartDate: '2026-02-22',
  })

  it('día de inicio → entry a las 08:30', () => {
    // origin = 2026-02-22T08:30Z → a medianoche faltan 8h30m = 510 min
    // p = moduloPositivo(-510, 4320) = 3810
    // p ≥ 1440 → en descanso, entry en 4320-3810=510 min = 08:30
    expect(calculateShiftStatus(config, '2026-02-22')).toEqual({
      type: 'entry',
      time: '08:30',
    })
  })
})

// ─── calculateShiftStatus — entrada a medianoche ─────────────────────────────

describe('calculateShiftStatus — entrada exactamente a medianoche', () => {
  const config = makeConfig({
    scheme: '24x48',
    entryTime: '00:00',
    cycleStartDate: '2026-02-22',
  })

  it('día de inicio con entrada a las 00:00 → entry a las 00:00', () => {
    // origin = 2026-02-22T00:00Z = dayStart → minutesFromOrigin = 0 → p = 0
    // p === 0 → entry a las 00:00
    expect(calculateShiftStatus(config, '2026-02-22')).toEqual({
      type: 'entry',
      time: '00:00',
    })
  })

  it('día siguiente → exit a las 00:00 (la salida se reporta el día en que ocurre)', () => {
    // minutesFromOrigin = 1440 → p = 1440 = workMinutes → la salida cae justo a las 00:00 de hoy
    expect(calculateShiftStatus(config, '2026-02-23')).toEqual({ type: 'exit', time: '00:00' })
  })

  it('tercer día → off_duty', () => {
    expect(calculateShiftStatus(config, '2026-02-24')).toEqual({ type: 'off_duty' })
  })
})

// ─── Paridad con la v1 (calendario-de-turno-laboral) ─────────────────────────

describe('paridad con la v1 — ciclo de 3 días anclado al 2023-08-02', () => {
  // Algoritmo original de la v1 (script.js): días desde el 2 de agosto de 2023, módulo 3,
  // con índices 0 = sale, 1 = franco, 2 = entra.
  const V1_TURNS = ['exit', 'off_duty', 'entry'] as const
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  const v1Reference = Date.UTC(2023, 7, 2)

  function v1Turn(utcDay: number): (typeof V1_TURNS)[number] {
    const diffDays = Math.round((utcDay - v1Reference) / MS_PER_DAY)
    return V1_TURNS[((diffDays % 3) + 3) % 3]
  }

  // Configuración equivalente en la v2: 24x48 cuyo ciclo inicia un día "entra" de la v1
  const config = makeConfig({ scheme: '24x48', entryTime: '08:00', cycleStartDate: '2023-08-01' })

  it('coincide con la v1 todos los días de 2020 a 2030', () => {
    const mismatches: string[] = []
    for (let day = Date.UTC(2020, 0, 1); day <= Date.UTC(2030, 11, 31); day += MS_PER_DAY) {
      const dateStr = new Date(day).toISOString().slice(0, 10)
      const actual = calculateShiftStatus(config, dateStr).type
      if (actual !== v1Turn(day)) mismatches.push(`${dateStr}: v1=${v1Turn(day)} v2=${actual}`)
    }
    expect(mismatches).toEqual([])
  })
})
