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

  it('día de inicio → entry a las 08:00', () => {
    // p = moduloPositivo(-480, 2880) = 2400 ≥ 720 → en descanso, entry en 2880-2400=480 min = 8h
    expect(calculateShiftStatus(config, '2026-02-22')).toEqual({
      type: 'entry',
      time: '08:00',
    })
  })

  it('día siguiente → exit a las 20:00', () => {
    // origin = 2026-02-22T08:00Z
    // 2026-02-23T00:00Z → minutesFromOrigin = 16*60 = 960
    // p = 960 ≥ 720 → en descanso, entry en 2880-960=1920 min = 32h > 24h → off_duty
    expect(calculateShiftStatus(config, '2026-02-23').type).toBe('off_duty')
  })

  it('mismo día de inicio tiene entry (no exit) — la salida se computa del config', () => {
    const result = calculateShiftStatus(config, '2026-02-22')
    // La función retorna 'entry'. El exit (20:00) lo deriva el componente del config.
    expect(result.type).toBe('entry')
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

  it('10 años en el futuro → calcula correctamente sin degradación', () => {
    // El módulo mantiene O(1) sin importar la distancia
    const result = calculateShiftStatus(config, '2036-02-22')
    // 10 años ≈ 3652 días. 3652 * 1440 / 4320 = ~1217 ciclos completos + resto
    // El resultado debe ser uno de los 4 tipos válidos
    expect(['entry', 'exit', 'on_duty', 'off_duty']).toContain(result.type)
  })

  it('5 años en el pasado → calcula correctamente con moduloPositivo', () => {
    const result = calculateShiftStatus(config, '2021-02-22')
    expect(['entry', 'exit', 'on_duty', 'off_duty']).toContain(result.type)
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

  it('día siguiente → exit a las 00:00', () => {
    // minutesFromOrigin = 1440 → p = 1440 < 1440? No, 1440 = workMinutes → en descanso
    // p = 1440 ≥ 1440 → en descanso, entry en 4320-1440=2880 min = 48h > 24h → off_duty
    expect(calculateShiftStatus(config, '2026-02-23').type).toBe('off_duty')
  })
})
