import { isPresetScheme } from '../shift-calculator/types'
import type { SharedConfigPayload } from './types'

const CUSTOM_SCHEME_RE = /^C(\d+):(\d+)$/
const ENTRY_TIME_RE = /^\d{2}:\d{2}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/

/**
 * Valida el campo `s` (scheme):
 *   - Preset: cualquiera de PRESET_SCHEMES (24x48, 12x36, 12x24, 48x48)
 *   - Custom: "C{work}:{rest}" con workHours y restHours entre 12 y 72
 */
function validateScheme(s: unknown): s is string {
  if (typeof s !== 'string') return false
  if (isPresetScheme(s)) return true

  const match = CUSTOM_SCHEME_RE.exec(s)
  if (!match) return false

  const w = parseInt(match[1], 10)
  const r = parseInt(match[2], 10)
  return w >= 12 && w <= 72 && r >= 12 && r <= 72
}

/**
 * Valida el campo `e` (entryTime): "HH:mm" con horas 0–23 y minutos 0–59.
 */
function validateEntryTime(e: unknown): e is string {
  if (typeof e !== 'string' || !ENTRY_TIME_RE.test(e)) return false
  const [h, m] = e.split(':').map(Number)
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

/**
 * Valida el campo `d` (cycleStartDate): "YYYY-MM-DD" con fecha real del calendario.
 * `Date.parse` no sirve aquí: acepta fechas imposibles como "2026-02-31" y las
 * desborda al mes siguiente. Se reconstruye la fecha y se compara campo a campo.
 */
function validateDate(d: unknown): d is string {
  if (typeof d !== 'string' || !DATE_RE.test(d)) return false
  const [year, month, day] = d.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

/**
 * Valida el campo `c` (color): "#RRGGBB".
 */
function validateColor(c: unknown): c is string {
  return typeof c === 'string' && HEX_COLOR_RE.test(c)
}

/**
 * Decodifica el parámetro ?cfg= a un SharedConfigPayload validado.
 * Lanza un Error descriptivo si cualquier campo falla la validación.
 * Usar siempre con try/catch — nunca procesar un payload inválido.
 */
export function decodeConfig(encoded: string): SharedConfigPayload {
  let payload: unknown

  try {
    payload = JSON.parse(atob(encoded))
  } catch {
    throw new Error('URL inválida: no se pudo decodificar el parámetro cfg')
  }

  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error('URL inválida: formato de payload incorrecto')
  }

  const p = payload as Record<string, unknown>

  if (!validateScheme(p['s'])) {
    throw new Error('URL inválida: esquema de turno no reconocido')
  }
  if (!validateEntryTime(p['e'])) {
    throw new Error('URL inválida: hora de entrada incorrecta')
  }
  if (!validateDate(p['d'])) {
    throw new Error('URL inválida: fecha de inicio de ciclo incorrecta')
  }
  if (!validateColor(p['c'])) {
    throw new Error('URL inválida: color hexadecimal incorrecto')
  }

  return {
    s: p['s'] as string,
    e: p['e'] as string,
    d: p['d'] as string,
    c: p['c'] as string,
  }
}
