import { describe, it, expect } from 'vitest'
import { getDaySegments } from './day-segments'
import { calculateShiftStatus } from '../shift-calculator/shift-calculator'
import type { ShiftConfiguration } from '../shift-calculator/types'

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

describe('getDaySegments', () => {
  it('día de entrada → desde la entrada hasta el final del día, con etiqueta arriba', () => {
    expect(getDaySegments({ type: 'entry', time: '08:00' })).toEqual([
      { startMin: 480, endMin: 1440, startLabel: '08:00' },
    ])
  })

  it('día de salida → desde el inicio del día hasta la salida, con etiqueta abajo', () => {
    expect(getDaySegments({ type: 'exit', time: '08:00' })).toEqual([
      { startMin: 0, endMin: 480, endLabel: '08:00' },
    ])
  })

  it('entrada y salida el mismo día → solo el tramo entre ambas', () => {
    expect(getDaySegments({ type: 'entry', time: '08:00', exitTime: '20:00' })).toEqual([
      { startMin: 480, endMin: 1200, startLabel: '08:00', endLabel: '20:00' },
    ])
  })

  it('salida y nueva entrada el mismo día → dos tramos', () => {
    expect(getDaySegments({ type: 'exit', time: '07:00', entryTime: '19:00' })).toEqual([
      { startMin: 0, endMin: 420, endLabel: '07:00' },
      { startMin: 1140, endMin: 1440, startLabel: '19:00' },
    ])
  })

  it('día intermedio de turno largo → el día completo, sin etiquetas', () => {
    expect(getDaySegments({ type: 'on_duty' })).toEqual([{ startMin: 0, endMin: 1440 }])
  })

  it('franco → sin tramos (casilla en blanco)', () => {
    expect(getDaySegments({ type: 'off_duty' })).toEqual([])
  })

  it('salida exactamente a las 00:00 → tramo de largo cero que conserva la etiqueta', () => {
    expect(getDaySegments({ type: 'exit', time: '00:00' })).toEqual([
      { startMin: 0, endMin: 0, endLabel: '00:00' },
    ])
  })

  it('con el motor real: 24x48 recorre entrada, salida y franco', () => {
    const config = makeConfig()
    const day = (d: string) => getDaySegments(calculateShiftStatus(config, d))
    expect(day('2026-02-22')).toEqual([{ startMin: 480, endMin: 1440, startLabel: '08:00' }])
    expect(day('2026-02-23')).toEqual([{ startMin: 0, endMin: 480, endLabel: '08:00' }])
    expect(day('2026-02-24')).toEqual([])
  })

  it('ningún tramo se sale del día ni queda invertido, en 3 años de 4 esquemas', () => {
    const configs = [
      makeConfig(),
      makeConfig({ scheme: '12x36', entryTime: '20:00' }),
      makeConfig({ scheme: '48x48', entryTime: '06:30' }),
      makeConfig({ scheme: { type: 'custom', workHours: 12, restHours: 12 }, entryTime: '19:00' }),
    ]
    const bad: string[] = []
    for (const config of configs) {
      for (let i = 0; i < 1095; i++) {
        const date = new Date(Date.UTC(2025, 0, 1 + i)).toISOString().slice(0, 10)
        for (const seg of getDaySegments(calculateShiftStatus(config, date))) {
          if (seg.startMin < 0 || seg.endMin > 1440 || seg.startMin > seg.endMin) {
            bad.push(`${JSON.stringify(config.scheme)} ${date} ${seg.startMin}-${seg.endMin}`)
          }
        }
      }
    }
    expect(bad).toEqual([])
  })
})
