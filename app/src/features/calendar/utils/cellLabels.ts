import type { ShiftStatus } from '@/core/shift-calculator/types'

export interface CellLabels {
  /** Hora "HH:mm" anclada al inicio de la franja (arriba / izquierda). */
  start?: string
  /** Hora "HH:mm" anclada al final de la franja (abajo / derecha). */
  end?: string
}

/**
 * Decide qué horas se muestran dentro de la franja de una celda del calendario.
 *
 * Decisión de producto (la celda mide ~50px en un teléfono, no cabe todo):
 *   · Día con un solo evento  → la entrada va al inicio, la salida al final.
 *   · Día con dos eventos     → orden cronológico: el primero al inicio, el segundo al final.
 *
 * Para cambiar qué ve el usuario en la celda (p. ej. mostrar solo la entrada),
 * este es el único lugar a tocar: el panel del día y la búsqueda siempre muestran ambas.
 */
export function getCellLabels(status: ShiftStatus): CellLabels {
  switch (status.type) {
    case 'entry':
      return { start: status.time, end: status.exitTime }
    case 'exit':
      return status.entryTime ? { start: status.time, end: status.entryTime } : { end: status.time }
    default:
      return {}
  }
}
