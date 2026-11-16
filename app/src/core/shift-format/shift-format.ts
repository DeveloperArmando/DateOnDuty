import type { ShiftStatus, TimeFormat } from '../shift-calculator/types'

// ─── Hora ─────────────────────────────────────────────────────────────────────

export interface FormatShiftTimeOptions {
  /** En 12h omite los minutos cuando son :00 ("8 AM"). Para espacios reducidos. */
  compact?: boolean
}

/**
 * Formatea una hora "HH:mm" (formato interno 24h) según el TimeFormat del usuario.
 *
 * - 24h      → "08:00"
 * - military → "0800"
 * - 12h      → "8:00 AM"  (compact: "8 AM")
 */
export function formatShiftTime(
  time: string,
  format: TimeFormat,
  options: FormatShiftTimeOptions = {}
): string {
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
  if (options.compact && m === 0) return `${h12} ${period}`
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

// ─── Descripción del estado ───────────────────────────────────────────────────

/**
 * Variante de texto de un ShiftStatus. Cada vista (panel del día, búsqueda,
 * lector de pantalla) la mapea a su propia clave i18n — el core no conoce textos.
 */
export type ShiftStatusMessageKey =
  | 'entry' // entra hoy; la salida cae otro día
  | 'exit' // sale hoy; no vuelve a entrar
  | 'entryExit' // entra y sale hoy
  | 'exitEntry' // sale y vuelve a entrar hoy
  | 'onDuty'
  | 'offDuty'

/** Valores de interpolación ya formateados: `time`, o bien `entry` + `exit`. */
export type ShiftStatusMessageValues = { time?: string; entry?: string; exit?: string }

export interface ShiftStatusMessage {
  key: ShiftStatusMessageKey
  values: ShiftStatusMessageValues
}

/**
 * Traduce un ShiftStatus a su variante de texto con las horas ya formateadas.
 * Única fuente de verdad para describir un día: evita que cada vista decida por
 * su cuenta qué hacer con los días que tienen entrada y salida.
 */
export function describeShiftStatus(status: ShiftStatus, format: TimeFormat): ShiftStatusMessage {
  switch (status.type) {
    case 'entry':
      return status.exitTime
        ? {
            key: 'entryExit',
            values: {
              entry: formatShiftTime(status.time, format),
              exit: formatShiftTime(status.exitTime, format),
            },
          }
        : { key: 'entry', values: { time: formatShiftTime(status.time, format) } }
    case 'exit':
      return status.entryTime
        ? {
            key: 'exitEntry',
            values: {
              exit: formatShiftTime(status.time, format),
              entry: formatShiftTime(status.entryTime, format),
            },
          }
        : { key: 'exit', values: { time: formatShiftTime(status.time, format) } }
    case 'on_duty':
      return { key: 'onDuty', values: {} }
    case 'off_duty':
      return { key: 'offDuty', values: {} }
  }
}
