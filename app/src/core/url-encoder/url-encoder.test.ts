import { describe, it, expect } from 'vitest'
import { encodeConfig } from './encoder'
import { decodeConfig } from './decoder'
import type { ShiftConfiguration } from '../shift-calculator/types'
import type { SharedConfigPayload } from './types'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeConfig(overrides: Partial<ShiftConfiguration> = {}): ShiftConfiguration {
  return {
    id: 'test-uuid',
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

// ─── encodeConfig ─────────────────────────────────────────────────────────────

describe('encodeConfig', () => {
  it('genera un string Base64 válido para esquema preset', () => {
    const config = makeConfig()
    const encoded = encodeConfig(config)
    // Debe ser decodificable por atob
    expect(() => atob(encoded)).not.toThrow()
  })

  it('incluye todos los campos obligatorios', () => {
    const config = makeConfig()
    const encoded = encodeConfig(config)
    const payload = JSON.parse(atob(encoded)) as SharedConfigPayload
    expect(payload.s).toBe('24x48')
    expect(payload.e).toBe('08:00')
    expect(payload.d).toBe('2026-02-22')
    expect(payload.c).toBe('#2563EB')
  })

  it('serializa esquema custom como "C{work}:{rest}"', () => {
    const config = makeConfig({ scheme: { type: 'custom', workHours: 16, restHours: 32 } })
    const encoded = encodeConfig(config)
    const payload = JSON.parse(atob(encoded)) as SharedConfigPayload
    expect(payload.s).toBe('C16:32')
  })

  it('no incluye campos innecesarios (id, name, etc.)', () => {
    const config = makeConfig()
    const encoded = encodeConfig(config)
    const payload = JSON.parse(atob(encoded)) as Record<string, unknown>
    expect(payload['id']).toBeUndefined()
    expect(payload['name']).toBeUndefined()
    expect(payload['isDefault']).toBeUndefined()
    expect(payload['timeFormat']).toBeUndefined()
  })

  it('produce resultados diferentes para configuraciones distintas', () => {
    const a = encodeConfig(makeConfig({ color: '#DC2626' }))
    const b = encodeConfig(makeConfig({ color: '#15803D' }))
    expect(a).not.toBe(b)
  })
})

// ─── decodeConfig — casos válidos ────────────────────────────────────────────

describe('decodeConfig — payloads válidos', () => {
  function makeEncoded(payload: SharedConfigPayload): string {
    return btoa(JSON.stringify(payload))
  }

  it('decodifica preset 24x48 correctamente', () => {
    const encoded = makeEncoded({ s: '24x48', e: '08:00', d: '2026-02-22', c: '#2563EB' })
    const result = decodeConfig(encoded)
    expect(result).toEqual({ s: '24x48', e: '08:00', d: '2026-02-22', c: '#2563EB' })
  })

  it('decodifica preset 12x36', () => {
    const encoded = makeEncoded({ s: '12x36', e: '20:00', d: '2026-01-15', c: '#DC2626' })
    expect(decodeConfig(encoded).s).toBe('12x36')
  })

  it('decodifica preset 48x48', () => {
    const encoded = makeEncoded({ s: '48x48', e: '00:00', d: '2026-03-01', c: '#15803D' })
    expect(decodeConfig(encoded).s).toBe('48x48')
  })

  it('decodifica esquema custom C12:24', () => {
    const encoded = makeEncoded({ s: 'C12:24', e: '08:00', d: '2026-02-22', c: '#7C3AED' })
    expect(decodeConfig(encoded).s).toBe('C12:24')
  })

  it('decodifica esquema custom en rangos límite (12 y 72)', () => {
    const encoded = makeEncoded({ s: 'C12:72', e: '08:00', d: '2026-02-22', c: '#7C3AED' })
    expect(() => decodeConfig(encoded)).not.toThrow()
  })

  it('acepta entryTime con minutos', () => {
    const encoded = makeEncoded({ s: '24x48', e: '08:30', d: '2026-02-22', c: '#2563EB' })
    expect(decodeConfig(encoded).e).toBe('08:30')
  })

  it('acepta entryTime a medianoche "00:00"', () => {
    const encoded = makeEncoded({ s: '24x48', e: '00:00', d: '2026-02-22', c: '#2563EB' })
    expect(decodeConfig(encoded).e).toBe('00:00')
  })

  it('acepta entryTime a las 23:59', () => {
    const encoded = makeEncoded({ s: '24x48', e: '23:59', d: '2026-02-22', c: '#2563EB' })
    expect(decodeConfig(encoded).e).toBe('23:59')
  })
})

// ─── decodeConfig — round-trip ────────────────────────────────────────────────

describe('decodeConfig — round-trip encode → decode', () => {
  it('encode/decode de preset preserva todos los campos', () => {
    const config = makeConfig()
    const encoded = encodeConfig(config)
    const decoded = decodeConfig(encoded)
    expect(decoded.s).toBe('24x48')
    expect(decoded.e).toBe(config.entryTime)
    expect(decoded.d).toBe(config.cycleStartDate)
    expect(decoded.c).toBe(config.color)
  })

  it('encode/decode de custom scheme preserva el esquema', () => {
    const config = makeConfig({ scheme: { type: 'custom', workHours: 20, restHours: 40 } })
    const encoded = encodeConfig(config)
    const decoded = decodeConfig(encoded)
    expect(decoded.s).toBe('C20:40')
  })
})

// ─── decodeConfig — casos inválidos ──────────────────────────────────────────

describe('decodeConfig — payloads inválidos (deben lanzar Error)', () => {
  it('lanza error con string no-Base64', () => {
    expect(() => decodeConfig('!!!no-es-base64!!!')).toThrow()
  })

  it('lanza error con Base64 válido pero no JSON', () => {
    expect(() => decodeConfig(btoa('no es json'))).toThrow()
  })

  it('lanza error con JSON que no es objeto', () => {
    expect(() => decodeConfig(btoa('[1,2,3]'))).toThrow()
    expect(() => decodeConfig(btoa('"string"'))).toThrow()
  })

  it('lanza error con esquema desconocido', () => {
    const encoded = btoa(JSON.stringify({ s: '24x24', e: '08:00', d: '2026-02-22', c: '#2563EB' }))
    expect(() => decodeConfig(encoded)).toThrow(/esquema/)
  })

  it('lanza error con custom scheme fuera de rango (< 12)', () => {
    const encoded = btoa(JSON.stringify({ s: 'C8:24', e: '08:00', d: '2026-02-22', c: '#2563EB' }))
    expect(() => decodeConfig(encoded)).toThrow(/esquema/)
  })

  it('lanza error con custom scheme fuera de rango (> 72)', () => {
    const encoded = btoa(JSON.stringify({ s: 'C80:24', e: '08:00', d: '2026-02-22', c: '#2563EB' }))
    expect(() => decodeConfig(encoded)).toThrow(/esquema/)
  })

  it('lanza error con entryTime inválido (hora > 23)', () => {
    const encoded = btoa(JSON.stringify({ s: '24x48', e: '25:00', d: '2026-02-22', c: '#2563EB' }))
    expect(() => decodeConfig(encoded)).toThrow(/hora de entrada/)
  })

  it('lanza error con entryTime con formato incorrecto', () => {
    const encoded = btoa(JSON.stringify({ s: '24x48', e: '8:00', d: '2026-02-22', c: '#2563EB' }))
    expect(() => decodeConfig(encoded)).toThrow(/hora de entrada/)
  })

  it('lanza error con fecha inválida', () => {
    const encoded = btoa(JSON.stringify({ s: '24x48', e: '08:00', d: '2026-13-01', c: '#2563EB' }))
    expect(() => decodeConfig(encoded)).toThrow(/fecha/)
  })

  it('lanza error con color inválido (sin #)', () => {
    const encoded = btoa(JSON.stringify({ s: '24x48', e: '08:00', d: '2026-02-22', c: '2563EB' }))
    expect(() => decodeConfig(encoded)).toThrow(/color/)
  })

  it('lanza error con color de longitud incorrecta', () => {
    const encoded = btoa(JSON.stringify({ s: '24x48', e: '08:00', d: '2026-02-22', c: '#25EB' }))
    expect(() => decodeConfig(encoded)).toThrow(/color/)
  })

  it('lanza error con campos faltantes', () => {
    const encoded = btoa(JSON.stringify({ s: '24x48', e: '08:00' })) // falta d y c
    expect(() => decodeConfig(encoded)).toThrow()
  })

  it('lanza error con string vacío', () => {
    expect(() => decodeConfig('')).toThrow()
  })
})
