import { useMemo } from 'react'
import { endOfMonth, eachDayOfInterval, format, isToday } from 'date-fns'
import { useConfigStore } from '@/stores/config-store'
import { useThemeStore } from '@/stores/theme-store'
import { useUIStore } from '@/stores/ui-store'
import { calculateShiftStatus } from '@/core/shift-calculator/shift-calculator'
import type { TimeFormat, ShiftStatus } from '@/core/shift-calculator/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalendarDayResult {
  configId: string
  configName: string | null
  color: string
  timeFormat: TimeFormat
  status: ShiftStatus
}

export interface CalendarCell {
  date: Date
  dateStr: string // "YYYY-MM-DD"
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  results: CalendarDayResult[]
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Computa las celdas del calendario para el mes/año actual del ui-store.
 * Incluye celdas de relleno del mes anterior y siguiente para completar filas de 7.
 */
export function useCalendar() {
  const { currentMonth, currentYear } = useUIStore()
  const configs = useConfigStore((s) => s.configs)
  const { firstDayOfWeek, gridLineColor } = useThemeStore()

  const activeConfigs = useMemo(() => configs.filter((c) => c.isActive), [configs])

  const cells = useMemo((): CalendarCell[] => {
    const monthStart = new Date(currentYear, currentMonth, 1)
    const monthEnd = endOfMonth(monthStart)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Relleno inicial: días del mes anterior para completar la primera fila
    const startDay = monthStart.getDay() // 0=Dom, 1=Lun…
    const leadingCount = firstDayOfWeek === 1 ? (startDay + 6) % 7 : startDay
    const leadingCells: CalendarCell[] = []
    for (let i = leadingCount - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth, -i)
      leadingCells.push({
        date,
        dateStr: format(date, 'yyyy-MM-dd'),
        dayNumber: date.getDate(),
        isCurrentMonth: false,
        isToday: false,
        results: [],
      })
    }

    // Celdas del mes actual con resultados calculados
    const monthCells: CalendarCell[] = daysInMonth.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const results: CalendarDayResult[] = activeConfigs.map((config) => ({
        configId: config.id,
        configName: config.name,
        color: config.color,
        timeFormat: config.timeFormat,
        status: calculateShiftStatus(config, dateStr),
      }))
      return {
        date,
        dateStr,
        dayNumber: date.getDate(),
        isCurrentMonth: true,
        isToday: isToday(date),
        results,
      }
    })

    // Relleno final: días del mes siguiente para completar la última fila
    const total = leadingCells.length + monthCells.length
    const trailingCount = total % 7 === 0 ? 0 : 7 - (total % 7)
    const trailingCells: CalendarCell[] = []
    for (let i = 1; i <= trailingCount; i++) {
      const date = new Date(currentYear, currentMonth + 1, i)
      trailingCells.push({
        date,
        dateStr: format(date, 'yyyy-MM-dd'),
        dayNumber: date.getDate(),
        isCurrentMonth: false,
        isToday: false,
        results: [],
      })
    }

    return [...leadingCells, ...monthCells, ...trailingCells]
  }, [currentMonth, currentYear, activeConfigs, firstDayOfWeek])

  return { cells, gridLineColor, firstDayOfWeek }
}
