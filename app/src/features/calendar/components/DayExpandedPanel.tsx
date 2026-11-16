/**
 * Contenido del panel de detalle de un día.
 * Muestra el resumen de todas las configuraciones activas para una fecha.
 *
 * Se renderiza dentro de <BottomSheet> (que gestiona la animación de apertura/cierre).
 * Navegación: ‹día / día› cambian el día, ‹mes / mes› cambian el mes del calendario.
 * El contenido interno anima en eje X (día) o Y (mes) al navegar.
 */

import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, X, Search, LogIn, LogOut, Clock, Coffee } from 'lucide-react'
import { parseISO, format, addDays, subDays, addMonths, subMonths, getDaysInMonth } from 'date-fns'
import { useUIStore } from '@/stores/ui-store'
import { useConfigStore } from '@/stores/config-store'
import { calculateShiftStatus } from '@/core/shift-calculator/shift-calculator'
import type { ShiftStatus, TimeFormat, ShiftConfiguration } from '@/core/shift-calculator/types'
import { Button } from '@/shared/components/Button'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { describeShiftStatus } from '@/core/shift-format/shift-format'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DayResult {
  config: ShiftConfiguration
  status: ShiftStatus
}

type ContentAnim = 'enter-left' | 'enter-right' | 'enter-top' | 'enter-bottom'

const ANIM_CLASS: Record<ContentAnim, string> = {
  'enter-left': 'animate-panel-enter-left',
  'enter-right': 'animate-panel-enter-right',
  'enter-top': 'animate-panel-enter-top',
  'enter-bottom': 'animate-panel-enter-bottom',
}

const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

// ─── DayConfigRow (sub-componente interno) ────────────────────────────────────

interface DayConfigRowProps {
  result: DayResult
  timeFormat: TimeFormat
}

function DayConfigRow({ result, timeFormat }: DayConfigRowProps) {
  const { t: tc } = useTranslation('calendar')
  const { config, status } = result
  const isOffDuty = status.type === 'off_duty'

  // Border-left: color del config a 40% si es franco, 100% si tiene turno
  const borderColor = isOffDuty ? `${config.color}66` : config.color

  const Icon =
    status.type === 'entry'
      ? LogIn
      : status.type === 'exit'
        ? LogOut
        : status.type === 'on_duty'
          ? Clock
          : Coffee

  const message = describeShiftStatus(status, timeFormat)
  const descText = tc(`panel.${message.key}`, message.values)

  // Hora(s) destacadas a la derecha: una sola, o las dos en orden cronológico
  const { time, entry, exit } = message.values
  const range = status.type === 'entry' ? [entry, exit] : [exit, entry]
  const timeLabel = time ?? (entry && exit ? range.join(' – ') : null)

  const configName = config.name ?? tc('panel.defaultConfigName')

  return (
    <li className="rounded-lg overflow-hidden border-l-4" style={{ borderLeftColor: borderColor }}>
      <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
        <Icon size={18} className="text-text-secondary shrink-0" aria-hidden="true" />
        <span className="flex-1 text-sm font-medium text-text-primary truncate" title={configName}>
          {configName}
        </span>
        {timeLabel && (
          <span className="text-sm font-medium text-text-primary tabular-nums">{timeLabel}</span>
        )}
      </div>
      <p className="px-3 pb-2.5 text-xs text-text-secondary">{descText}</p>
    </li>
  )
}

// ─── DayExpandedPanel ─────────────────────────────────────────────────────────

export function DayExpandedPanel() {
  const { t: tc } = useTranslation('calendar')
  const navigate = useNavigate()

  const { expandedDay, setExpandedDay, navigateMonth } = useUIStore()
  const configs = useConfigStore((s) => s.configs)
  const activeConfigs = useMemo(() => configs.filter((c) => c.isActive), [configs])

  // ─── Content animation ───────────────────────────────────────────────────

  const [contentKey, setContentKey] = useState(0)
  const [contentAnim, setContentAnim] = useState<ContentAnim | null>(null)

  const triggerContentAnim = useCallback((anim: ContentAnim) => {
    setContentAnim(anim)
    setContentKey((k) => k + 1)
    setTimeout(() => setContentAnim(null), 100)
  }, [])

  // ─── Focus restoration on close ─────────────────────────────────────────

  const prevExpandedDayRef = useRef<string | null>(null)

  useEffect(() => {
    if (expandedDay) {
      prevExpandedDayRef.current = expandedDay
    } else if (prevExpandedDayRef.current) {
      const dateToFocus = prevExpandedDayRef.current
      setTimeout(() => {
        document.querySelector<HTMLElement>(`[data-date="${dateToFocus}"]`)?.focus()
      }, CLOSE_DELAY)
    }
  }, [expandedDay])

  // ─── Navigation handlers ─────────────────────────────────────────────────

  const handlePrevDay = () => {
    if (!expandedDay) return
    const date = parseISO(expandedDay)
    const prev = subDays(date, 1)
    const prevStr = format(prev, 'yyyy-MM-dd')
    if (prev.getMonth() !== date.getMonth() || prev.getFullYear() !== date.getFullYear()) {
      navigateMonth(-1)
    }
    triggerContentAnim('enter-right')
    setExpandedDay(prevStr)
  }

  const handleNextDay = () => {
    if (!expandedDay) return
    const date = parseISO(expandedDay)
    const next = addDays(date, 1)
    const nextStr = format(next, 'yyyy-MM-dd')
    if (next.getMonth() !== date.getMonth() || next.getFullYear() !== date.getFullYear()) {
      navigateMonth(1)
    }
    triggerContentAnim('enter-left')
    setExpandedDay(nextStr)
  }

  const handlePrevMonth = () => {
    if (!expandedDay) return
    const date = parseISO(expandedDay)
    const prevMonthDate = subMonths(date, 1)
    const maxDay = getDaysInMonth(prevMonthDate)
    const newDay = Math.min(date.getDate(), maxDay)
    const newDate = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), newDay)
    navigateMonth(-1)
    triggerContentAnim('enter-bottom')
    setExpandedDay(format(newDate, 'yyyy-MM-dd'))
  }

  const handleNextMonth = () => {
    if (!expandedDay) return
    const date = parseISO(expandedDay)
    const nextMonthDate = addMonths(date, 1)
    const maxDay = getDaysInMonth(nextMonthDate)
    const newDay = Math.min(date.getDate(), maxDay)
    const newDate = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), newDay)
    navigateMonth(1)
    triggerContentAnim('enter-top')
    setExpandedDay(format(newDate, 'yyyy-MM-dd'))
  }

  const handleClose = () => setExpandedDay(null)

  const handleViewInSearch = () => {
    handleClose()
    navigate('/search')
  }

  // ─── Date parsing + results ──────────────────────────────────────────────

  if (!expandedDay) {
    return (
      <BottomSheet isOpen={false} onClose={handleClose} size="lg" ariaLabel="">
        {null}
      </BottomSheet>
    )
  }

  const expandedDate = parseISO(expandedDay)
  const dayOfWeek = expandedDate.getDay()
  const monthIdx = expandedDate.getMonth()
  const dayNum = expandedDate.getDate()
  const yearNum = expandedDate.getFullYear()

  const dayName = tc(`daysLong.${DAY_KEYS[dayOfWeek]}`)
  const monthName = tc(`months.${MONTH_KEYS[monthIdx]}`)
  const dateLabel = `${dayName}, ${dayNum} ${monthName.slice(0, 3).toLowerCase()} ${yearNum}`

  const results: DayResult[] = activeConfigs.map((config) => ({
    config,
    status: calculateShiftStatus(config, expandedDay),
  }))

  const allOffDuty = results.every((r) => r.status.type === 'off_duty')

  return (
    <BottomSheet
      isOpen={true}
      onClose={handleClose}
      size="lg"
      hasHandle={true}
      hasOverlay={true}
      ariaLabel={tc('closeDay')}
    >
      {/* ── Header sticky ── */}
      <div
        role="group"
        aria-label={tc('calendarNavLabel')}
        className="sticky top-0 z-10 flex items-center gap-1 border-b border-border-default bg-surface-elevated px-2 py-1.5"
      >
        {/* Prev month */}
        <Button variant="ghost" size="sm" aria-label={tc('prevMonth')} onClick={handlePrevMonth}>
          <ChevronLeft size={14} aria-hidden="true" />
          <ChevronLeft size={14} className="-ml-2.5" aria-hidden="true" />
        </Button>

        {/* Prev day */}
        <Button variant="ghost" size="sm" aria-label={tc('prevDay')} onClick={handlePrevDay}>
          <ChevronLeft size={16} aria-hidden="true" />
        </Button>

        {/* Date label */}
        <h2
          className="flex-1 text-center text-sm font-semibold text-text-primary capitalize truncate px-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {dateLabel}
        </h2>

        {/* Next day */}
        <Button variant="ghost" size="sm" aria-label={tc('nextDay')} onClick={handleNextDay}>
          <ChevronRight size={16} aria-hidden="true" />
        </Button>

        {/* Next month */}
        <Button variant="ghost" size="sm" aria-label={tc('nextMonth')} onClick={handleNextMonth}>
          <ChevronRight size={14} aria-hidden="true" />
          <ChevronRight size={14} className="-ml-2.5" aria-hidden="true" />
        </Button>

        {/* Desktop close button */}
        <Button
          variant="ghost"
          size="sm"
          aria-label={tc('panel.closePanel')}
          onClick={handleClose}
          className="hidden lg:flex"
        >
          <X size={18} aria-hidden="true" />
        </Button>
      </div>

      {/* ── Content (animates on navigation) ── */}
      <div
        key={contentKey}
        className={['flex-1 overflow-y-auto py-3 px-3', contentAnim ? ANIM_CLASS[contentAnim] : '']
          .filter(Boolean)
          .join(' ')}
        aria-live="polite"
        aria-atomic="true"
      >
        {allOffDuty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-text-secondary">
            <Coffee size={48} aria-hidden="true" />
            <p className="text-base font-medium">{tc('panel.allOffDuty')}</p>
            <p className="text-sm">{tc('panel.allOffDutyDesc')}</p>
          </div>
        ) : (
          <ul className="space-y-2" aria-label={tc('panel.activeShifts')}>
            {results.map((r) => (
              <DayConfigRow key={r.config.id} result={r} timeFormat={r.config.timeFormat} />
            ))}
          </ul>
        )}
      </div>

      {/* ── Footer sticky ── */}
      <div className="sticky bottom-0 border-t border-border-default bg-surface-elevated px-3 py-2">
        <Button variant="ghost" size="sm" fullWidth iconLeft={Search} onClick={handleViewInSearch}>
          {tc('panel.viewInSearch')}
        </Button>
      </div>
    </BottomSheet>
  )
}

// Close animation duration (must match dod-sheet-exit: 200ms)
const CLOSE_DELAY = 220
