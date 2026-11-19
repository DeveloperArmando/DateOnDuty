import type { ShiftStatus } from '../shift-calculator/types'

const MINUTES_PER_DAY = 24 * 60

/**
 * Tramo de un día calendario en el que la persona está en turno.
 * Los minutos se miden desde las 00:00 (0) hasta las 24:00 (1440): la celda del
 * calendario se pinta como una línea de tiempo vertical, de arriba abajo.
 */
export interface DaySegment {
  startMin: number
  endMin: number
  /** "HH:mm" si el turno EMPIEZA dentro de este día (se muestra arriba del tramo). */
  startLabel?: string
  /** "HH:mm" si el turno TERMINA dentro de este día (se muestra abajo del tramo). */
  endLabel?: string
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Traduce el estado de un día a los tramos que deben pintarse en la celda.
 *   · entry            → desde la hora de entrada hasta el final del día
 *   · entry + exitTime → solo entre entrada y salida (turno de 12 h)
 *   · exit             → desde el inicio del día hasta la hora de salida
 *   · exit + entryTime → dos tramos: hasta la salida y desde la nueva entrada
 *   · on_duty          → el día completo
 *   · off_duty         → ninguno (casilla en blanco)
 *
 * Una salida exactamente a las 00:00 produce un tramo de largo cero que solo
 * conserva su etiqueta, para que la hora no desaparezca de la celda.
 */
export function getDaySegments(status: ShiftStatus): DaySegment[] {
  switch (status.type) {
    case 'entry':
      return [
        {
          startMin: toMinutes(status.time),
          endMin: status.exitTime ? toMinutes(status.exitTime) : MINUTES_PER_DAY,
          startLabel: status.time,
          endLabel: status.exitTime,
        },
      ]
    case 'exit': {
      const first: DaySegment = {
        startMin: 0,
        endMin: toMinutes(status.time),
        endLabel: status.time,
      }
      if (!status.entryTime) return [first]
      return [
        first,
        {
          startMin: toMinutes(status.entryTime),
          endMin: MINUTES_PER_DAY,
          startLabel: status.entryTime,
        },
      ]
    }
    case 'on_duty':
      return [{ startMin: 0, endMin: MINUTES_PER_DAY }]
    case 'off_duty':
      return []
  }
}
