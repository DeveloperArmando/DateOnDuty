/**
 * Pantalla /search — Búsqueda de turno por fecha.
 * Mobile (< 1024px): una columna. Desktop (≥ 1024px): dos columnas.
 * Fecha pre-seleccionada: hoy. El cálculo es inmediato y síncrono (O(1) Core Engine).
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogIn, LogOut, Clock, Coffee, CalendarDays } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useConfigStore } from '@/stores/config-store'
import { useThemeStore } from '@/stores/theme-store'
import { useUIStore } from '@/stores/ui-store'
import { calculateShiftStatus } from '@/core/shift-calculator/shift-calculator'
import { describeShiftStatus } from '@/core/shift-format/shift-format'
import type { ShiftStatusMessageKey } from '@/core/shift-format/shift-format'
import type { ShiftConfiguration, ShiftStatus } from '@/core/shift-calculator/types'
import { Button } from '@/shared/components/Button'
import { SearchDatePicker } from './SearchDatePicker'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Clave i18n (namespace search) para cada variante de estado del día. */
const STATUS_KEYS: Record<ShiftStatusMessageKey, string> = {
  entry: 'statusEntry',
  exit: 'statusExit',
  entryExit: 'statusEntryExit',
  exitEntry: 'statusExitEntry',
  onDuty: 'statusOnDuty',
  offDuty: 'statusOffDuty',
}

function getSchemeLabel(scheme: ShiftConfiguration['scheme']): string {
  if (typeof scheme === 'string') return scheme
  return `${scheme.workHours}x${scheme.restHours}`
}

// ─── ShiftResultCard ──────────────────────────────────────────────────────────

const STATUS_STYLE: Record<ShiftStatus['type'], { Icon: LucideIcon; colorClass: string }> = {
  entry: { Icon: LogIn, colorClass: 'text-feedback-success' },
  exit: { Icon: LogOut, colorClass: 'text-feedback-warning' },
  on_duty: { Icon: Clock, colorClass: 'text-text-primary' },
  off_duty: { Icon: Coffee, colorClass: 'text-text-disabled' },
}

interface ShiftResultCardProps {
  config: ShiftConfiguration
  status: ShiftStatus
  isDefault?: boolean
}

function ShiftResultCard({ config, status, isDefault = false }: ShiftResultCardProps) {
  const { t: ts } = useTranslation('search')
  const { t: tc } = useTranslation('calendar')

  const configName = isDefault
    ? tc('panel.defaultConfigName')
    : (config.name ?? tc('panel.defaultConfigName'))

  const schemeLabel = getSchemeLabel(config.scheme)

  const { Icon, colorClass } = STATUS_STYLE[status.type]
  const message = describeShiftStatus(status, config.timeFormat)
  const statusText = ts(STATUS_KEYS[message.key], message.values)

  const swatchSize = isDefault ? 'h-5 w-5' : 'h-4 w-4'
  const iconSize = isDefault ? 16 : 14
  const textSize = isDefault ? 'text-base' : 'text-sm'

  return (
    <div className="rounded-lg border border-border-default bg-surface-elevated p-3">
      <div className="flex items-center gap-3">
        {/* Color del turno */}
        <span
          aria-hidden="true"
          className={`${swatchSize} shrink-0 rounded-full border border-border-default`}
          style={{ backgroundColor: config.color }}
        />

        <div className="min-w-0 flex-1">
          {/* Estado */}
          <div className="flex items-center gap-1.5">
            <Icon size={iconSize} aria-hidden="true" className={colorClass} />
            <span className={`font-semibold ${textSize} ${colorClass}`}>{statusText}</span>
          </div>

          {/* Nombre · esquema (solo default) */}
          <p
            className="truncate text-xs text-text-secondary"
            title={isDefault ? `${configName} · ${schemeLabel}` : configName}
          >
            {isDefault ? `${configName} · ${schemeLabel}` : configName}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── SearchPage ───────────────────────────────────────────────────────────────

export default function SearchPage() {
  const { t: ts } = useTranslation('search')
  const { t: tc } = useTranslation('calendar')

  const { configs } = useConfigStore()
  const { firstDayOfWeek } = useThemeStore()
  const { setViewDate } = useUIStore()
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())

  // Configs activas
  const activeConfigs = configs.filter((c) => c.isActive)
  const defaultConfig = activeConfigs.find((c) => c.isDefault)
  const additionals = activeConfigs.filter((c) => !c.isDefault)

  // Fecha ISO para el Core Engine
  const isoDate = format(selectedDate, 'yyyy-MM-dd')

  // Resultados por config (cálculo síncrono O(1))
  const defaultStatus = defaultConfig ? calculateShiftStatus(defaultConfig, isoDate) : null
  const additionalResults = additionals.map((c) => ({
    config: c,
    status: calculateShiftStatus(c, isoDate),
  }))

  // Textos formateados
  const formattedDate = format(selectedDate, "EEE d 'de' MMMM, yyyy", { locale: es })
  const monthName = format(selectedDate, 'MMMM', { locale: es })

  const firstDayStr: 'sunday' | 'monday' = firstDayOfWeek === 1 ? 'monday' : 'sunday'

  const handleViewInCalendar = () => {
    setViewDate(selectedDate.getFullYear(), selectedDate.getMonth())
    navigate('/')
  }

  // ─── Estado vacío (sin configs activas) ─────────────────────────────────────

  if (!defaultConfig) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-surface-base px-4 py-12 text-center">
        <p className="text-sm text-text-secondary">{ts('noActiveConfigs')}</p>
        <Button variant="primary" onClick={() => navigate('/config')}>
          {ts('goToConfig')}
        </Button>
      </div>
    )
  }

  // ─── Render principal ────────────────────────────────────────────────────────

  return (
    <div className="min-h-full bg-surface-base">
      <div className="mx-auto max-w-4xl px-4 pb-28 pt-6">
        <div className="lg:grid lg:grid-cols-[auto_1fr] lg:gap-12 lg:items-start">
          {/* ── Columna izquierda: Date Picker ───────────────────────────── */}
          <div className="mb-6 flex justify-center lg:mb-0 lg:pt-1 lg:sticky lg:top-6">
            <SearchDatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              firstDayOfWeek={firstDayStr}
            />
          </div>

          {/* ── Columna derecha: Resultados ──────────────────────────────── */}
          <div>
            {/* Separador + fecha seleccionada */}
            <div className="mb-4 border-t border-border-default" />
            <p
              aria-live="polite"
              aria-atomic="true"
              className="mb-4 text-base font-semibold capitalize text-text-primary"
            >
              {formattedDate}
            </p>
            <div className="mb-5 border-t border-border-default" />

            {/* MI TURNO */}
            <section aria-label={ts('sectionMyShift')} className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {ts('sectionMyShift')}
              </p>
              <ShiftResultCard config={defaultConfig} status={defaultStatus!} isDefault />
            </section>

            {/* ADICIONALES ACTIVAS (solo si existen) */}
            {additionals.length > 0 && (
              <section aria-label={ts('sectionAdditionals')} className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {ts('sectionAdditionals')} ({additionals.length})
                </p>
                <ul role="list" className="space-y-2">
                  {additionalResults.map(({ config, status }) => (
                    <li key={config.id}>
                      <ShiftResultCard config={config} status={status} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Botón Ver en calendario */}
            <div className="sticky bottom-0 z-10 bg-surface-base py-3">
              <Button
                variant="primary"
                fullWidth
                onClick={handleViewInCalendar}
                aria-label={tc('calendarNavLabel')}
              >
                <span className="flex items-center justify-center gap-2">
                  <CalendarDays size={16} aria-hidden="true" />
                  <span>
                    {ts('viewInCalendar', {
                      month: monthName,
                      year: selectedDate.getFullYear(),
                    })}
                  </span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
