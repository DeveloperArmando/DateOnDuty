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

export type ShiftStatus =
  | { type: 'entry'; time: string } // primer día del bloque de trabajo
  | { type: 'exit'; time: string } // último día del bloque de trabajo
  | { type: 'on_duty' } // día intermedio de turno largo
  | { type: 'off_duty' } // día de franco

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
