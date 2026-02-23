/**
 * Cuadrícula mensual del calendario.
 *
 * Gestiona:
 *   · Renderizado de 7 columnas con header de días de semana
 *   · Swipe vertical (↕) → navegación de meses
 *   · Swipe horizontal (↔) → navegación de años
 *   · Animación de entrada (8% desplazamiento + fade, 200ms ease-snap)
 *   · Roving tabindex para accesibilidad de teclado
 *
 * La navegación con AppBar buttons también dispara animaciones.
 * El componente escucha cambios en currentMonth/currentYear del ui-store.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDrag } from '@use-gesture/react'
import { format } from 'date-fns'
import { useUIStore } from '@/stores/ui-store'
import { useThemeStore } from '@/stores/theme-store'
import { useCalendar } from '../hooks/useCalendar'
import { DayCell } from './DayCell'

// ─── Types ────────────────────────────────────────────────────────────────────

type AnimType = 'month-next' | 'month-prev' | 'year-next' | 'year-prev'

const ANIM_CLASS: Record<AnimType, string> = {
  'month-next': 'animate-month-next',
  'month-prev': 'animate-month-prev',
  'year-next': 'animate-year-next',
  'year-prev': 'animate-year-prev',
}

// ─── Week day header keys ──────────────────────────────────────────────────────

const DAYS_SUN_FIRST = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
const DAYS_MON_FIRST = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

type DayKey = (typeof DAYS_SUN_FIRST)[number]

// ─── MonthGrid ────────────────────────────────────────────────────────────────

export function MonthGrid() {
  const { t } = useTranslation('calendar')

  const { currentMonth, currentYear, navigateMonth, navigateYear, expandedDay, setExpandedDay } =
    useUIStore()
  const { firstDayOfWeek } = useThemeStore()
  const { cells, gridLineColor } = useCalendar()

  // ─── Animation state ──────────────────────────────────────────────────────

  const [animType, setAnimType] = useState<AnimType | null>(null)
  // Track the last navigated month/year to detect AppBar-initiated navigations
  const lastViewRef = useRef({ month: currentMonth, year: currentYear })

  // Detect AppBar navigation (currentMonth/currentYear changed from outside)
  useEffect(() => {
    const prev = lastViewRef.current
    if (prev.month === currentMonth && prev.year === currentYear) return
    // Determine direction
    const prevAbsMonth = prev.year * 12 + prev.month
    const currAbsMonth = currentYear * 12 + currentMonth
    if (currAbsMonth > prevAbsMonth) setAnimType('month-next')
    else if (currAbsMonth < prevAbsMonth) setAnimType('month-prev')
    lastViewRef.current = { month: currentMonth, year: currentYear }
    const id = setTimeout(() => setAnimType(null), 200)
    return () => clearTimeout(id)
  }, [currentMonth, currentYear])

  // ─── Navigation lock ──────────────────────────────────────────────────────

  const isNavigatingRef = useRef(false)

  const handleNavigate = useCallback(
    (type: AnimType) => {
      if (isNavigatingRef.current) return
      isNavigatingRef.current = true
      setAnimType(type)
      lastViewRef.current = { month: currentMonth, year: currentYear }
      switch (type) {
        case 'month-next':
          navigateMonth(1)
          break
        case 'month-prev':
          navigateMonth(-1)
          break
        case 'year-next':
          navigateYear(1)
          break
        case 'year-prev':
          navigateYear(-1)
          break
      }
      setTimeout(() => {
        isNavigatingRef.current = false
        setAnimType(null)
      }, 200)
    },
    [currentMonth, currentYear, navigateMonth, navigateYear]
  )

  // ─── Swipe gesture ────────────────────────────────────────────────────────

  const bind = useDrag(
    ({ last, movement: [mx, my], velocity: [vx, vy] }) => {
      if (!last) return
      const THRESHOLD = 50
      const MIN_VEL = 0.3
      const absX = Math.abs(mx)
      const absY = Math.abs(my)
      if (absY > absX) {
        if (absY >= THRESHOLD || Math.abs(vy) >= MIN_VEL) {
          handleNavigate(my < 0 ? 'month-next' : 'month-prev')
        }
      } else {
        if (absX >= THRESHOLD || Math.abs(vx) >= MIN_VEL) {
          handleNavigate(mx < 0 ? 'year-next' : 'year-prev')
        }
      }
    },
    { axis: 'lock', filterTaps: true }
  )

  // ─── Roving tabindex ──────────────────────────────────────────────────────

  const [focusedDateStr, setFocusedDateStr] = useState<string>(() =>
    format(new Date(), 'yyyy-MM-dd')
  )

  // When month changes, keep same day number or fall back to day 1
  useEffect(() => {
    const isInCurrentMonth = cells.some((c) => c.dateStr === focusedDateStr && c.isCurrentMonth)
    if (!isInCurrentMonth) {
      const firstDay = cells.find((c) => c.isCurrentMonth)
      if (firstDay) setFocusedDateStr(firstDay.dateStr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells])

  // Focus DOM element when focusedDateStr changes
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`[data-date="${focusedDateStr}"]`)
    // Only auto-focus if the grid already has focus (avoid stealing focus on mount)
    const gridEl = document.querySelector('[role="grid"]')
    if (el && gridEl?.contains(document.activeElement)) {
      el.focus()
    }
  }, [focusedDateStr])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const idx = cells.findIndex((c) => c.dateStr === focusedDateStr)
    if (idx === -1) return

    switch (e.key) {
      case 'ArrowLeft': {
        e.preventDefault()
        if (idx > 0) {
          const prev = cells[idx - 1]
          setFocusedDateStr(prev.dateStr)
          if (!prev.isCurrentMonth) handleNavigate('month-prev')
        }
        break
      }
      case 'ArrowRight': {
        e.preventDefault()
        if (idx < cells.length - 1) {
          const next = cells[idx + 1]
          setFocusedDateStr(next.dateStr)
          if (!next.isCurrentMonth) handleNavigate('month-next')
        }
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        if (idx >= 7) setFocusedDateStr(cells[idx - 7].dateStr)
        break
      }
      case 'ArrowDown': {
        e.preventDefault()
        if (idx + 7 < cells.length) setFocusedDateStr(cells[idx + 7].dateStr)
        break
      }
      case 'PageUp': {
        e.preventDefault()
        handleNavigate('month-prev')
        break
      }
      case 'PageDown': {
        e.preventDefault()
        handleNavigate('month-next')
        break
      }
      case 'Home': {
        e.preventDefault()
        const first = cells.find((c) => c.isCurrentMonth)
        if (first) setFocusedDateStr(first.dateStr)
        break
      }
      case 'End': {
        e.preventDefault()
        const last = [...cells].reverse().find((c) => c.isCurrentMonth)
        if (last) setFocusedDateStr(last.dateStr)
        break
      }
    }
  }

  // ─── Day select ───────────────────────────────────────────────────────────

  const handleSelect = (dateStr: string) => {
    setExpandedDay(expandedDay === dateStr ? null : dateStr)
    setFocusedDateStr(dateStr)
  }

  // ─── Week day header ──────────────────────────────────────────────────────

  const dayKeys: readonly DayKey[] = firstDayOfWeek === 1 ? DAYS_MON_FIRST : DAYS_SUN_FIRST

  // ─── Grid key: changes on every navigation → remount triggers CSS animation ──

  const gridKey = currentYear * 12 + currentMonth

  return (
    <div
      role="grid"
      aria-label={t('calendarNavLabel')}
      className="select-none touch-none"
      onKeyDown={handleKeyDown}
      {...bind()}
    >
      {/* Header: días de la semana */}
      <div role="row" className="grid grid-cols-7 border-b border-border-default">
        {dayKeys.map((key) => (
          <div
            key={key}
            role="columnheader"
            aria-label={t(`daysLong.${key}`)}
            className="py-1 text-center text-xs font-medium text-text-secondary"
          >
            {t(`days.${key}`)}
          </div>
        ))}
      </div>

      {/* Celdas del mes — key fuerza remount en cada navegación */}
      <div
        key={gridKey}
        className={['grid grid-cols-7', animType ? ANIM_CLASS[animType] : '']
          .filter(Boolean)
          .join(' ')}
      >
        {cells.map((cell) => (
          <div key={cell.dateStr} role="gridcell">
            <DayCell
              cell={cell}
              isSelected={expandedDay === cell.dateStr}
              tabIndex={cell.isCurrentMonth && cell.dateStr === focusedDateStr ? 0 : -1}
              gridLineColor={gridLineColor}
              onSelect={handleSelect}
              onFocus={setFocusedDateStr}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
