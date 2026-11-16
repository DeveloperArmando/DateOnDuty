export type PresetScheme = '24x48' | '12x36' | '48x48'

export interface CustomScheme {
  type: 'custom'
  workHours: number // 12–72, entero
  restHours: number // 12–72, entero
}

export type ShiftScheme = PresetScheme | CustomScheme

export type TimeFormat = '12h' | '24h' | 'military'

export interface ShiftConfiguration {
  id: string // UUID v4
  isDefault: boolean
  name: string | null // null para la config default
  scheme: ShiftScheme
  entryTime: string // "HH:mm" — siempre 24h internamente
  timeFormat: TimeFormat // solo afecta la visualización
  cycleStartDate: string // "YYYY-MM-DD" ISO
  color: string // "#RRGGBB"
  isActive: boolean
}

/**
 * Estado de un día calendario para una configuración.
 *
 * Regla: toda entrada y toda salida se reporta en el día calendario en que ocurre
 * (intervalo [00:00, 24:00)). Con trabajo y descanso ≥ 12h caben como máximo dos
 * eventos en un día; el primero define `type` y el segundo va en el campo opcional:
 *   · entry + exitTime  → entra y sale el mismo día (ej. 12x36 con entrada 08:00)
 *   · exit + entryTime  → sale y vuelve a entrar el mismo día (ej. 12x12 con entrada 19:00)
 */
export type ShiftStatus =
  | { type: 'entry'; time: string; exitTime?: string } // inicia el bloque de trabajo
  | { type: 'exit'; time: string; entryTime?: string } // termina el bloque de trabajo
  | { type: 'on_duty' } // día completo dentro de un turno largo
  | { type: 'off_duty' } // día completo de franco

export interface DayShiftResult {
  configId: string
  configName: string | null
  color: string
  status: ShiftStatus
}

export interface ResolvedScheme {
  workHours: number
  restHours: number
}
