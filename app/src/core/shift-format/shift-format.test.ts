import { describe, it, expect } from 'vitest'
import { formatShiftTime, describeShiftStatus } from './shift-format'
import type { ShiftStatus } from '../shift-calculator/types'

// ─── formatShiftTime ──────────────────────────────────────────────────────────

describe('formatShiftTime', () => {
  it('24h devuelve la hora interna sin cambios', () => {
    expect(formatShiftTime('08:00', '24h')).toBe('08:00')
    expect(formatShiftTime('20:30', '24h')).toBe('20:30')
  })

  it('military quita los dos puntos y conserva los ceros', () => {
    expect(formatShiftTime('08:00', 'military')).toBe('0800')
    expect(formatShiftTime('00:05', 'military')).toBe('0005')
    expect(formatShiftTime('20:30', 'military')).toBe('2030')
  })

  it('12h convierte con AM/PM', () => {
    expect(formatShiftTime('08:00', '12h')).toBe('8:00 AM')
    expect(formatShiftTime('20:30', '12h')).toBe('8:30 PM')
  })

  it('12h trata medianoche y mediodía como 12', () => {
    expect(formatShiftTime('00:00', '12h')).toBe('12:00 AM')
    expect(formatShiftTime('12:00', '12h')).toBe('12:00 PM')
    expect(formatShiftTime('00:15', '12h')).toBe('12:15 AM')
  })

  it('compact omite :00 solo en 12h', () => {
    expect(formatShiftTime('08:00', '12h', { compact: true })).toBe('8 AM')
    expect(formatShiftTime('20:30', '12h', { compact: true })).toBe('8:30 PM')
    expect(formatShiftTime('08:00', '24h', { compact: true })).toBe('08:00')
    expect(formatShiftTime('08:00', 'military', { compact: true })).toBe('0800')
  })
})

// ─── describeShiftStatus ──────────────────────────────────────────────────────

describe('describeShiftStatus', () => {
  it('entrada sin salida el mismo día → entry con time', () => {
    expect(describeShiftStatus({ type: 'entry', time: '08:00' }, '24h')).toEqual({
      key: 'entry',
      values: { time: '08:00' },
    })
  })

  it('salida sin nueva entrada → exit con time', () => {
    expect(describeShiftStatus({ type: 'exit', time: '08:00' }, 'military')).toEqual({
      key: 'exit',
      values: { time: '0800' },
    })
  })

  it('entrada y salida el mismo día → entryExit con ambas horas', () => {
    const status: ShiftStatus = { type: 'entry', time: '08:00', exitTime: '20:00' }
    expect(describeShiftStatus(status, '12h')).toEqual({
      key: 'entryExit',
      values: { entry: '8:00 AM', exit: '8:00 PM' },
    })
  })

  it('salida y nueva entrada el mismo día → exitEntry con ambas horas', () => {
    const status: ShiftStatus = { type: 'exit', time: '07:00', entryTime: '19:00' }
    expect(describeShiftStatus(status, '24h')).toEqual({
      key: 'exitEntry',
      values: { exit: '07:00', entry: '19:00' },
    })
  })

  it('días sin eventos → onDuty / offDuty sin valores', () => {
    expect(describeShiftStatus({ type: 'on_duty' }, '24h')).toEqual({ key: 'onDuty', values: {} })
    expect(describeShiftStatus({ type: 'off_duty' }, '24h')).toEqual({ key: 'offDuty', values: {} })
  })
})
