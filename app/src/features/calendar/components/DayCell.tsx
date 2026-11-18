/**
 * Celda individual del calendario mensual.
 * Componente puramente presentacional — los cálculos de turno vienen ya resueltos.
 *
 * Cada turno es una columna que representa las 24 h del día de arriba (00:00) a
 * abajo (24:00). El color solo llena las horas en turno; el franco queda en blanco:
 *   · día de entrada → el color empieza en la hora de entrada (hora arriba) y baja
 *   · día de salida  → el color baja desde arriba hasta la hora de salida (hora abajo)
 *   · 12x36          → solo el tramo entre entrada y salida
 * La celda lleva borde marcado y el encabezado con el número del día, un fondo más oscuro;
 * el área donde se pinta el turno queda clara.
 *   · Mobile (<640px): máx 2 columnas, resto → badge +N
 *   · Desktop (≥640px): máx 3 columnas, resto → badge +N
 *
 * Celdas fuera del mes: div aria-hidden con opacity-40, no interactivas.
 */

import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { formatShiftTime, describeShiftStatus } from '@/core/shift-format/shift-format'
import { getDaySegments } from '@/core/shift-format/day-segments'
import type { DaySegment } from '@/core/shift-format/day-segments'
import { contrastRatio } from '@/core/wcag-contrast/wcag-contrast'
import type { CalendarCell, CalendarDayResult } from '../hooks/useCalendar'

// ─── Columna de turno ─────────────────────────────────────────────────────────

const MINUTES_PER_DAY = 24 * 60
/** Alto mínimo (px) de un tramo con hora, para que la etiqueta siempre quepa. */
const MIN_LABELED_HEIGHT = '14px'

/** Texto blanco u oscuro, el que mejor contraste dé sobre el color del turno. */
function labelColor(background: string): string {
  const onWhite = contrastRatio(background, '#FFFFFF') ?? 0
  const onDark = contrastRatio(background, '#1F2937') ?? 0
  return onWhite >= onDark ? '#FFFFFF' : '#1F2937'
}

/** Posición vertical del tramo; los que tocan un borde del día se anclan a él. */
function segmentStyle(seg: DaySegment): CSSProperties {
  const height = `${((seg.endMin - seg.startMin) / MINUTES_PER_DAY) * 100}%`
  const hasLabel = Boolean(seg.startLabel || seg.endLabel)
  const fitted = hasLabel ? `max(${height}, ${MIN_LABELED_HEIGHT})` : height
  if (seg.endMin === MINUTES_PER_DAY) return { bottom: 0, height: fitted }
  if (seg.startMin === 0) return { top: 0, height: fitted }
  return { top: `${(seg.startMin / MINUTES_PER_DAY) * 100}%`, height }
}

interface ShiftColumnProps {
  result: CalendarDayResult
  /** Índice entre las columnas visibles (0-based). Índice 2 = solo desktop. */
  index: number
  /** Cuántas columnas comparten la celda: con varias, las horas se acortan en mobile. */
  total: number
}

function ShiftColumn({ result, index, total }: ShiftColumnProps) {
  const { color, status, timeFormat } = result
  const textColor = labelColor(color)

  const renderTime = (time: string) =>
    total > 1 ? (
      <>
        <span className="sm:hidden">{formatShiftTime(time, timeFormat, { short: true })}</span>
        <span className="hidden sm:inline">
          {formatShiftTime(time, timeFormat, { compact: true })}
        </span>
      </>
    ) : (
      formatShiftTime(time, timeFormat, { compact: true })
    )

  return (
    <div className={`${index === 2 ? 'hidden sm:block' : ''} relative min-w-0 flex-1`}>
      {getDaySegments(status).map((seg) => (
        <div
          key={seg.startMin}
          className="absolute inset-x-0 overflow-hidden whitespace-nowrap text-[10px] leading-none"
          style={{ ...segmentStyle(seg), backgroundColor: color, color: textColor }}
        >
          {seg.startLabel && (
            <span className="absolute left-1 top-0.5">{renderTime(seg.startLabel)}</span>
          )}
          {seg.endLabel && (
            <span className="absolute bottom-0.5 right-1">{renderTime(seg.endLabel)}</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── DayCell ──────────────────────────────────────────────────────────────────

export interface DayCellProps {
  cell: CalendarCell
  isSelected: boolean
  tabIndex: number
  gridLineColor: string
  onSelect: (dateStr: string) => void
  onFocus: (dateStr: string) => void
}

export function DayCell({
  cell,
  isSelected,
  tabIndex,
  gridLineColor,
  onSelect,
  onFocus,
}: DayCellProps) {
  const { t } = useTranslation('calendar')
  const { isCurrentMonth, dayNumber, isToday, results, dateStr } = cell

  // Solo aplica inline style para gridLineColor personalizado (evita sobreescribir dark mode)
  const borderStyle = gridLineColor !== '#E5E7EB' ? { borderColor: gridLineColor } : undefined

  const cellBase = 'relative flex flex-col border-b border-r overflow-hidden'

  // Celdas fuera del mes: no interactivas, aria-hidden
  if (!isCurrentMonth) {
    return (
      <div
        aria-hidden="true"
        className={`${cellBase} border-border-default h-full opacity-40 pointer-events-none`}
        style={borderStyle}
      >
        <div className="flex justify-center shrink-0 pt-2.5">
          <span className="text-xs sm:text-sm text-text-secondary">{dayNumber}</span>
        </div>
      </div>
    )
  }

  // Turnos con algo que pintar hoy (excluye franco)
  const active = results.filter((r) => r.status.type !== 'off_duty')
  const columns = active.slice(0, 3)
  const visibleOnMobile = Math.min(columns.length, 2)
  const mobileOverflow = Math.max(0, active.length - 2)
  const desktopOverflow = Math.max(0, active.length - 3)

  // Aria-label descriptivo
  const statusText = (r: CalendarDayResult): string => {
    const message = describeShiftStatus(r.status, r.timeFormat)
    return t(`panel.${message.key}`, message.values)
  }
  const ariaLabel = [
    t('cell.day', { day: dayNumber }),
    ...results.map((r) =>
      t('cell.config', {
        name: r.configName ?? t('panel.defaultConfigName'),
        status: statusText(r),
      })
    ),
  ].join('. ')

  return (
    <button
      type="button"
      data-date={dateStr}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-expanded={isSelected}
      className={[
        cellBase,
        'h-full cursor-pointer border-day-cell-border bg-surface-base hover:bg-surface-elevated',
        'transition-colors duration-fast ease-default',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring',
        isSelected ? 'ring-2 ring-inset ring-interactive-primary' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={borderStyle}
      onClick={() => onSelect(dateStr)}
      onFocus={() => onFocus(dateStr)}
    >
      {/* Número del día */}
      {/* Encabezado oscuro con el número. Centrado vertical: el círculo de "hoy" queda con
          el mismo aire arriba y abajo. */}
      <div className="flex h-8 sm:h-9 shrink-0 items-center justify-center border-b border-inherit bg-day-header">
        {isToday ? (
          <span className="flex h-[22px] w-[22px] sm:h-7 sm:w-7 items-center justify-center rounded-full bg-interactive-primary text-interactive-primary-text text-xs sm:text-sm font-bold">
            {dayNumber}
          </span>
        ) : (
          <span className="text-xs sm:text-sm text-text-primary">{dayNumber}</span>
        )}
      </div>

      {/* Las 24 h del día: el color solo llena las horas en turno; el franco queda en blanco */}
      <div className="m-1 flex min-h-0 flex-1 gap-px overflow-hidden rounded-sm">
        {columns.map((r, i) => (
          <ShiftColumn
            key={r.configId}
            result={r}
            index={i}
            total={i === 2 ? columns.length : visibleOnMobile}
          />
        ))}
      </div>

      {/* Badges +N: en la esquina superior, junto al número del día. Abajo chocaban
          con la hora de salida de la última franja visible. */}
      {/* Badge overflow — mobile (>2) */}
      {mobileOverflow > 0 && (
        <span className="sm:hidden absolute top-1 right-0.5 text-[10px] text-text-secondary leading-none">
          +{mobileOverflow}
        </span>
      )}
      {/* Badge overflow — desktop (>3) */}
      {desktopOverflow > 0 && (
        <span className="hidden sm:block absolute top-1 right-0.5 text-[10px] text-text-secondary leading-none">
          +{desktopOverflow}
        </span>
      )}
    </button>
  )
}
