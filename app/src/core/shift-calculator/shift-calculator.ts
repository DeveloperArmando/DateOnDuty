import type { ShiftConfiguration, ShiftStatus, ResolvedScheme } from './types'

const MINUTES_PER_DAY = 24 * 60
const MS_PER_MINUTE = 60 * 1000

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Módulo positivo — maneja correctamente valores negativos.
 * Necesario para fechas anteriores a cycleStartDate.
 */
function moduloPositivo(a: number, b: number): number {
  return ((a % b) + b) % b
}

/**
 * Convierte minutos desde medianoche al formato "HH:mm".
 * Ejemplo: 480 → "08:00", 1320 → "22:00"
 */
function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// ─── Exports públicos ─────────────────────────────────────────────────────────

/**
 * Resuelve el esquema a sus valores numéricos de horas.
 * Los presets son alias; el custom usa directamente los valores.
 */
export function resolveScheme(scheme: ShiftConfiguration['scheme']): ResolvedScheme {
  if (typeof scheme === 'string') {
    const presets: Record<string, ResolvedScheme> = {
      '24x48': { workHours: 24, restHours: 48 },
      '12x36': { workHours: 12, restHours: 36 },
      '48x48': { workHours: 48, restHours: 48 },
    }
    return presets[scheme]!
  }
  return { workHours: scheme.workHours, restHours: scheme.restHours }
}

/**
 * Calcula el estado del turno para una fecha objetivo.
 *
 * Algoritmo O(1): posición = moduloPositivo(minutosDesdeOrigen, cicloTotal)
 *
 * Usa UTC para todos los cálculos, evitando interferencia de DST
 * (regla de arquitectura: 1 día = 24 horas absolutas exactas).
 *
 * @param config - Configuración del turno
 * @param targetDate - Fecha objetivo en formato "YYYY-MM-DD"
 * @returns ShiftStatus para ese día
 */
export function calculateShiftStatus(config: ShiftConfiguration, targetDate: string): ShiftStatus {
  const { workHours, restHours } = resolveScheme(config.scheme)
  const cycleMinutes = (workHours + restHours) * 60
  const workMinutes = workHours * 60

  // Parsear como UTC para evitar ajustes de DST (1 día = exactamente 24*60 min)
  const origin = new Date(`${config.cycleStartDate}T${config.entryTime}:00Z`)
  const dayStart = new Date(`${targetDate}T00:00:00Z`)

  // Minutos desde el origen hasta la medianoche del día objetivo
  // Puede ser negativo para fechas anteriores al origen — moduloPositivo lo maneja
  const minutesFromOrigin = Math.floor((dayStart.getTime() - origin.getTime()) / MS_PER_MINUTE)

  // Posición dentro del ciclo a la medianoche del día objetivo
  const p = moduloPositivo(minutesFromOrigin, cycleMinutes)

  // ─── Fase de descanso a medianoche ───────────────────────────────────────
  if (p >= workMinutes) {
    const minutesUntilEntry = cycleMinutes - p
    if (minutesUntilEntry < MINUTES_PER_DAY) {
      // La entrada ocurre hoy
      return { type: 'entry', time: minutesToTime(minutesUntilEntry) }
    }
    // El ciclo no llega al inicio del trabajo hoy
    return { type: 'off_duty' }
  }

  // ─── Fase de trabajo a medianoche (p < workMinutes) ──────────────────────

  // Caso especial: el bloque de trabajo inicia exactamente a medianoche
  if (p === 0) {
    return { type: 'entry', time: '00:00' }
  }

  // Estamos en la mitad del bloque de trabajo — ¿termina hoy?
  const minutesUntilExit = workMinutes - p
  if (minutesUntilExit < MINUTES_PER_DAY) {
    // El turno termina durante este día
    return { type: 'exit', time: minutesToTime(minutesUntilExit) }
  }

  // El turno continúa todo el día (día intermedio de turno largo)
  return { type: 'on_duty' }
}
