import type { ShiftConfiguration } from '../shift-calculator/types'
import type { SharedConfigPayload } from './types'

/**
 * Convierte una ShiftConfiguration al string Base64 para el parámetro ?cfg=.
 * Solo incluye los campos necesarios para reconstruir el turno.
 */
export function encodeConfig(config: ShiftConfiguration): string {
  const schemeStr =
    typeof config.scheme === 'string'
      ? config.scheme
      : `C${config.scheme.workHours}:${config.scheme.restHours}`

  const payload: SharedConfigPayload = {
    s: schemeStr,
    e: config.entryTime,
    d: config.cycleStartDate,
    c: config.color,
  }

  return btoa(JSON.stringify(payload))
}
