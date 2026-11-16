/**
 * Selector de fecha para la pantalla /search.
 * El mes visible es estado local — solo la fecha seleccionada se eleva al padre.
 * Sin días deshabilitados. Días fuera del mes: seleccionables y navegan el picker.
 * Roving tabindex: Arrow keys navegan celdas sin auto-seleccionar (Enter/Space selecciona).
 */

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isSameDay, isSameMonth, isToday } from 'date-fns'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchDatePickerProps {
  value: Date
  onChange: (date: Date) => void
  firstDayOfWeek: 'sunday' | 'monday'
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

const DAY_KEYS_SUN = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
const DAY_KEYS_MON = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Índice de columna (0–6) según primer día de semana configurado. */
function colOf(date: Date, firstDayOfWeek: 'sunday' | 'monday'): number {
  const day = date.getDay() // 0=Dom … 6=Sáb
  return firstDayOfWeek === 'monday' ? (day + 6) % 7 : day
}

/** Array de fechas para la cuadrícula mensual, incluyendo relleno de meses adyacentes. */
function buildGrid(viewDate: Date, firstDayOfWeek: 'sunday' | 'monday'): Date[] {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = colOf(firstDay, firstDayOfWeek)
  const lastCol = colOf(lastDay, firstDayOfWeek)
  const endPad = lastCol === 6 ? 0 : 6 - lastCol
  const days: Date[] = []
  for (let i = -startPad; i < lastDay.getDate() + endPad; i++) {
    days.push(new Date(year, month, 1 + i))
  }
  return days
}

/** Suma meses con clamp al último día válido del mes destino. */
function addMonthsClamped(date: Date, delta: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + delta, 1)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay))
}

// ─── SearchDatePicker ─────────────────────────────────────────────────────────

export function SearchDatePicker({ value, onChange, firstDayOfWeek }: SearchDatePickerProps) {
  const { t: tc } = useTranslation('calendar')
  const { t: ts } = useTranslation('search')

  const [pickerViewDate, setPickerViewDate] = useState<Date>(
    () => new Date(value.getFullYear(), value.getMonth(), 1)
  )
  const [focusedDate, setFocusedDate] = useState<Date>(value)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [animKey, setAnimKey] = useState(0)

  // Ref para aplicar foco programático solo tras navegación por teclado
  const shouldFocusRef = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const days = buildGrid(pickerViewDate, firstDayOfWeek)
  const dayKeys = firstDayOfWeek === 'monday' ? DAY_KEYS_MON : DAY_KEYS_SUN
  const monthName = tc(`months.${MONTH_KEYS[pickerViewDate.getMonth()]}`)
  const year = pickerViewDate.getFullYear()

  // Foco programático tras cambio por teclado (no roba foco en clicks ni al montar)
  useEffect(() => {
    if (!shouldFocusRef.current || !gridRef.current) return
    shouldFocusRef.current = false
    const btn = gridRef.current.querySelector<HTMLElement>(
      `[data-date="${toISODate(focusedDate)}"]`
    )
    btn?.focus()
  }, [focusedDate, animKey])

  // ─── Navegación de mes ─────────────────────────────────────────────────────

  const goToMonth = (date: Date, dir: 'next' | 'prev') => {
    setDirection(dir)
    setAnimKey((k) => k + 1)
    setPickerViewDate(new Date(date.getFullYear(), date.getMonth(), 1))
  }

  const handlePrevMonth = () => {
    const prev = new Date(pickerViewDate.getFullYear(), pickerViewDate.getMonth() - 1, 1)
    goToMonth(prev, 'prev')
  }

  const handleNextMonth = () => {
    const next = new Date(pickerViewDate.getFullYear(), pickerViewDate.getMonth() + 1, 1)
    goToMonth(next, 'next')
  }

  // ─── Click en celda ────────────────────────────────────────────────────────

  const handleDayClick = (date: Date) => {
    onChange(date)
    setFocusedDate(date)
    // Días fuera del mes: navegar el picker al mes de la fecha seleccionada
    if (!isSameMonth(date, pickerViewDate)) {
      goToMonth(date, date > pickerViewDate ? 'next' : 'prev')
    }
  }

  // ─── Teclado — roving tabindex ─────────────────────────────────────────────

  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    const cur = focusedDate
    let next: Date | null = null

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        next = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() - 1)
        break
      case 'ArrowRight':
        e.preventDefault()
        next = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        next = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() - 7)
        break
      case 'ArrowDown':
        e.preventDefault()
        next = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 7)
        break
      case 'PageUp':
        e.preventDefault()
        next = addMonthsClamped(cur, -1)
        break
      case 'PageDown':
        e.preventDefault()
        next = addMonthsClamped(cur, 1)
        break
      case 'Home': {
        e.preventDefault()
        const col = colOf(cur, firstDayOfWeek)
        next = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() - col)
        break
      }
      case 'End': {
        e.preventDefault()
        const col = colOf(cur, firstDayOfWeek)
        next = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + (6 - col))
        break
      }
      case 'Enter':
      case ' ':
        e.preventDefault()
        onChange(cur)
        return
      default:
        return
    }

    if (next) {
      shouldFocusRef.current = true
      setFocusedDate(next)
      if (!isSameMonth(next, pickerViewDate)) {
        goToMonth(next, next > pickerViewDate ? 'next' : 'prev')
      }
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-xs select-none">
      {/* Navegación de mes */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          aria-label={tc('prevMonth')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors duration-[100ms] hover:bg-surface-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="text-sm font-semibold text-text-primary"
        >
          {monthName} {year}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          aria-label={tc('nextMonth')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors duration-[100ms] hover:bg-surface-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Cabecera de días de la semana */}
      <div className="mb-1 grid grid-cols-7" aria-hidden="true">
        {dayKeys.map((key) => (
          <div
            key={key}
            className="flex h-8 items-center justify-center text-xs text-text-secondary"
          >
            {tc(`days.${key}`)}
          </div>
        ))}
      </div>

      {/* Cuadrícula de días */}
      <div
        key={animKey}
        ref={gridRef}
        role="grid"
        aria-label={ts('dateLabel')}
        onKeyDown={handleGridKeyDown}
        className={[
          'grid grid-cols-7',
          direction === 'next' ? 'animate-month-next' : 'animate-month-prev',
        ].join(' ')}
      >
        {days.map((date) => {
          const iso = toISODate(date)
          const isSelected = isSameDay(date, value)
          const isInMonth = isSameMonth(date, pickerViewDate)
          const isTodayDate = isToday(date)
          const isFocused = isSameDay(date, focusedDate)

          return (
            <div key={iso} role="gridcell">
              <button
                type="button"
                data-date={iso}
                tabIndex={isFocused ? 0 : -1}
                aria-label={ts('dayAriaLabel', {
                  day: date.getDate(),
                  month: tc(`months.${MONTH_KEYS[date.getMonth()]}`),
                  year: date.getFullYear(),
                })}
                aria-pressed={isSelected}
                aria-current={isTodayDate && !isSelected ? 'date' : undefined}
                onClick={() => handleDayClick(date)}
                className={[
                  'relative mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-full',
                  'transition-colors duration-[100ms]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1',
                  isSelected
                    ? 'bg-interactive-primary text-interactive-primary-text'
                    : [
                        isInMonth ? 'text-text-primary' : 'text-text-secondary opacity-50',
                        'hover:bg-surface-elevated',
                      ].join(' '),
                ].join(' ')}
              >
                <span className="text-sm leading-none">{date.getDate()}</span>
                {/* Punto indicador de "hoy" — oculto si está seleccionado */}
                {isTodayDate && !isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1.5 h-1 w-1 rounded-full bg-interactive-primary"
                  />
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
