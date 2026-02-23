import type { TimeFormat } from '@/core/shift-calculator/types'

/**
 * Formatea una hora en "HH:mm" (formato interno 24h) según el TimeFormat del usuario.
 *
 * - 24h      → "08:00"
 * - military → "0800"
 * - 12h      → "8:00 AM" / "8 PM"
 */
export function formatShiftTime(time: string, format: TimeFormat): string {
  const [hStr, mStr] = time.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)

  if (format === '24h') return time

  if (format === 'military') {
    return `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}`
  }

  // 12h
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  if (m === 0) return `${h12} ${period}`
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}
