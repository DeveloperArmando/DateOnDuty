/**
 * Celda individual del calendario mensual.
 * Componente puramente presentacional — los cálculos de turno vienen ya resueltos.
 *
 * Franjas: se muestran solo cuando el turno es entry/exit/on_duty.
 *   · Mobile (<640px): máx 2 franjas visibles, resto → badge +N
 *   · Desktop (≥640px): máx 3 franjas visibles, resto → badge +N
 *
 * Celdas fuera del mes: div aria-hidden con opacity-40, no interactivas.
 */

import { useTranslation } from 'react-i18next'
import { formatShiftTime, describeShiftStatus } from '@/core/shift-format/shift-format'
import { getCellLabels } from '../utils/cellLabels'
import type { CalendarCell, CalendarDayResult } from '../hooks/useCalendar'

// ─── Franja helper ────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

interface FranjaProps {
  result: CalendarDayResult
  /** Índice dentro del array de franjas visibles (0-based). Índice 2 = solo desktop. */
  index: number
}

function getFranjaBackground(color: string, status: CalendarDayResult['status']): string {
  const strong = hexToRgba(color, 0.95)
  const medium = hexToRgba(color, 0.6)
  const faint = hexToRgba(color, 0.08)

  if (status.type === 'entry') {
    // Shift starts here — most intense, fades slightly to right (shift continues)
    return `linear-gradient(to right, ${strong}, ${hexToRgba(color, 0.65)})`
  }
  if (status.type === 'exit' && status.entryTime) {
    // Shift ends and a new one starts the same day — dips in the middle (the rest)
    return `linear-gradient(to right, ${medium}, ${faint} 50%, ${strong})`
  }
  if (status.type === 'exit') {
    // Shift ends here — medium on left (still running), fades to near-transparent (ending)
    return `linear-gradient(to right, ${medium}, ${faint})`
  }
  // on_duty — uniform medium, shift is stable
  return hexToRgba(color, 0.72)
}

const FRANJA_LABEL_CLASS =
  'text-[10px] leading-none text-shift-text-on-light dark:text-shift-text-on-dark'

function Franja({ result, index }: FranjaProps) {
  const { color, status, timeFormat } = result
  const { start, end } = getCellLabels(status)

  // Con dos horas: apiladas en mobile (arriba-izquierda / abajo-derecha), en línea desde md
  return (
    <div
      className={`${index === 2 ? 'hidden sm:flex' : 'flex'} flex-col justify-between md:flex-row md:items-start flex-1 min-h-0 py-0.5`}
      style={{ background: getFranjaBackground(color, status) }}
    >
      {start && (
        <span className={`${FRANJA_LABEL_CLASS} px-1.5`}>
          {formatShiftTime(start, timeFormat, { compact: true })}
        </span>
      )}
      {end && (
        <span className={`${FRANJA_LABEL_CLASS} ml-auto px-2`}>
          {formatShiftTime(end, timeFormat, { compact: true })}
        </span>
      )}
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

  const cellBase = 'relative flex flex-col border-b border-r border-border-default overflow-hidden'

  // Celdas fuera del mes: no interactivas, aria-hidden
  if (!isCurrentMonth) {
    return (
      <div
        aria-hidden="true"
        className={`${cellBase} h-full opacity-40 pointer-events-none`}
        style={borderStyle}
      >
        <div className="flex justify-center shrink-0 pt-2.5">
          <span className="text-xs sm:text-sm text-text-secondary">{dayNumber}</span>
        </div>
      </div>
    )
  }

  // Franjas visibles (excluye off_duty)
  const franjas = results.filter((r) => r.status.type !== 'off_duty')
  const displayedFranjas = franjas.slice(0, 3)
  const mobileOverflow = Math.max(0, franjas.length - 2)
  const desktopOverflow = Math.max(0, franjas.length - 3)

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
        'h-full cursor-pointer bg-surface-base hover:bg-surface-elevated',
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
      <div className="flex h-8 sm:h-9 justify-center pt-2 shrink-0">
        {isToday ? (
          <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-interactive-primary text-interactive-primary-text text-xs sm:text-sm font-bold">
            {dayNumber}
          </span>
        ) : (
          <span className="text-xs sm:text-sm text-text-primary">{dayNumber}</span>
        )}
      </div>

      {/* Franjas de turno */}
      {displayedFranjas.length > 0 && (
        <div className="flex flex-col flex-1 min-h-0 pt-2 gap-px">
          {displayedFranjas.map((r, i) => (
            <Franja key={r.configId} result={r} index={i} />
          ))}
        </div>
      )}

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
