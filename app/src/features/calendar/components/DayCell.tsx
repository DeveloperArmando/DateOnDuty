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

import { formatShiftTime } from '../utils/formatShiftTime'
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
  if (status.type === 'entry') {
    // Shift starts here — most intense, fades slightly to right (shift continues)
    return `linear-gradient(to right, ${hexToRgba(color, 0.95)}, ${hexToRgba(color, 0.65)})`
  }
  if (status.type === 'exit') {
    // Shift ends here — medium on left (still running), fades to near-transparent (ending)
    return `linear-gradient(to right, ${hexToRgba(color, 0.6)}, ${hexToRgba(color, 0.08)})`
  }
  // on_duty — uniform medium, shift is stable
  return hexToRgba(color, 0.72)
}

function Franja({ result, index }: FranjaProps) {
  const { color, status, timeFormat } = result
  const bg = getFranjaBackground(color, status)

  return (
    <div
      className={`${index === 2 ? 'hidden sm:flex' : 'flex'} items-center justify-end h-[14px] sm:h-[18px] shrink-0`}
      style={{ background: bg }}
    >
      {(status.type === 'entry' || status.type === 'exit') && (
        <span className="text-[10px] leading-none px-0.5 text-shift-text-on-light dark:text-shift-text-on-dark">
          {formatShiftTime(status.time, timeFormat)}
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
  const { isCurrentMonth, dayNumber, isToday, results, dateStr } = cell

  // Solo aplica inline style para gridLineColor personalizado (evita sobreescribir dark mode)
  const borderStyle = gridLineColor !== '#E5E7EB' ? { borderColor: gridLineColor } : undefined

  const cellBase =
    'relative flex flex-col border-b border-r border-border-default h-[3.5rem] sm:h-[5rem] overflow-hidden'

  // Celdas fuera del mes: no interactivas, aria-hidden
  if (!isCurrentMonth) {
    return (
      <div
        aria-hidden="true"
        className={`${cellBase} opacity-40 pointer-events-none`}
        style={borderStyle}
      >
        <div className="flex h-6 sm:h-7 items-center justify-center shrink-0">
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
    const s = r.status
    if (s.type === 'off_duty') return 'franco'
    if (s.type === 'on_duty') return 'en turno'
    if (s.type === 'entry') return `entrada ${formatShiftTime(s.time, r.timeFormat)}`
    return `salida ${formatShiftTime(s.time, r.timeFormat)}`
  }
  const ariaLabel = [
    `Día ${dayNumber}`,
    ...results.map((r) => `${r.configName ?? 'Mi turno'}: ${statusText(r)}`),
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
        'cursor-pointer bg-surface-base hover:bg-surface-elevated',
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
      <div className="flex h-6 sm:h-7 items-center justify-center shrink-0">
        {isToday ? (
          <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-interactive-primary text-interactive-primary-text text-xs sm:text-sm font-bold">
            {dayNumber}
          </span>
        ) : (
          <span className="text-xs sm:text-sm text-text-primary">{dayNumber}</span>
        )}
      </div>

      {/* Franjas de turno */}
      {displayedFranjas.map((r, i) => (
        <Franja key={r.configId} result={r} index={i} />
      ))}

      {/* Badge overflow — mobile (>2) */}
      {mobileOverflow > 0 && (
        <span className="sm:hidden absolute bottom-0.5 right-0.5 text-xs text-text-secondary leading-none">
          +{mobileOverflow}
        </span>
      )}
      {/* Badge overflow — desktop (>3) */}
      {desktopOverflow > 0 && (
        <span className="hidden sm:block absolute bottom-0.5 right-0.5 text-xs text-text-secondary leading-none">
          +{desktopOverflow}
        </span>
      )}
    </button>
  )
}
