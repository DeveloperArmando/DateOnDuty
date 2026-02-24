/**
 * Formulario de creación y edición de una configuración de turno.
 * Gestiona validación, estados condicionales y persistencia vía stores.
 *
 * RG-001: Botón guardar nunca `disabled`. Validación solo al submit.
 * RG-002: Estado loading con <LoadingDots /> mientras guarda.
 * RG-004: scrollToFirstError() al intentar guardar con errores.
 * RG-007: Advertencia WCAG no bloqueante en ColorPicker.
 */

import { useId, useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format, addDays } from 'date-fns'
import type { ShiftConfiguration, ShiftScheme, TimeFormat } from '@/core/shift-calculator/types'
import { useConfigStore } from '@/stores/config-store'
import { useThemeStore } from '@/stores/theme-store'
import { Button } from '@/shared/components/Button'
import { Toast } from '@/shared/components/Toast'
import { scrollToFirstError } from '@/shared/utils/scroll-to-error'
import { ColorPicker } from './ColorPicker'

// ─── Types ────────────────────────────────────────────────────────────────────

type SchemeKey = '24x48' | '12x36' | '48x48' | 'custom'

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESET_SCHEMES: SchemeKey[] = ['24x48', '12x36', '48x48', 'custom']
const TIME_FORMATS: TimeFormat[] = ['24h', '12h', 'military']

const GRID_COLORS = [
  { value: '#E5E7EB', key: 'gridColorLight' },
  { value: '#9CA3AF', key: 'gridColorMedium' },
  { value: '#374151', key: 'gridColorDark' },
] as const

const DAY_ABBR = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MONTH_ABBR = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSchemeKey(scheme: ShiftScheme): SchemeKey {
  return typeof scheme === 'string' ? scheme : 'custom'
}

function buildScheme(key: SchemeKey, wh: number, rh: number): ShiftScheme {
  return key !== 'custom' ? key : { type: 'custom', workHours: wh, restHours: rh }
}

function shortDate(date: Date): string {
  return `${DAY_ABBR[date.getDay()]}. ${date.getDate()} ${MONTH_ABBR[date.getMonth()]}`
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ShiftConfigFormProps {
  mode: 'new' | 'edit'
  isDefault: boolean
  config?: ShiftConfiguration
}

// ─── ShiftConfigForm ──────────────────────────────────────────────────────────

export function ShiftConfigForm({ mode, isDefault, config }: ShiftConfigFormProps) {
  const { t } = useTranslation('config')
  const navigate = useNavigate()
  const uid = useId()
  const fId = (field: string) => `${uid.replace(/:/g, '')}-${field}`

  const { configs, updateConfig, addConfig } = useConfigStore()
  const { theme, firstDayOfWeek, gridLineColor, setTheme, setFirstDayOfWeek, setGridLineColor } =
    useThemeStore()

  // ─── Form state ───────────────────────────────────────────────────────────

  const [name, setName] = useState(config?.name ?? '')
  const [schemeKey, setSchemeKey] = useState<SchemeKey>(() =>
    config ? getSchemeKey(config.scheme) : '24x48'
  )
  const [workHours, setWorkHours] = useState(() =>
    config && typeof config.scheme !== 'string' ? String(config.scheme.workHours) : '24'
  )
  const [restHours, setRestHours] = useState(() =>
    config && typeof config.scheme !== 'string' ? String(config.scheme.restHours) : '48'
  )
  const [entryTime, setEntryTime] = useState(config?.entryTime ?? '08:00')
  const [cycleStartDate, setCycleStartDate] = useState(
    config?.cycleStartDate ?? format(new Date(), 'yyyy-MM-dd')
  )
  const [currentlyOnRest, setCurrentlyOnRest] = useState(false)
  const [nextShiftOffset, setNextShiftOffset] = useState(1)
  const [color, setColor] = useState(config?.color ?? '#2563EB')
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(config?.timeFormat ?? '24h')

  // Global preferences (only written when isDefault=true)
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(theme)
  const [localFirstDay, setLocalFirstDay] = useState<0 | 1>(firstDayOfWeek)
  const [localGridColor, setLocalGridColor] = useState(gridLineColor)

  // ─── Validation state ─────────────────────────────────────────────────────

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nameDuplicateError, setNameDuplicateError] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)

  // ─── Derived values ───────────────────────────────────────────────────────

  const configId = config?.id

  const existingColors = useMemo(
    () => configs.filter((c) => c.id !== configId).map((c) => c.color),
    [configs, configId]
  )

  const nextShiftOptions = useMemo(() => {
    const today = new Date()
    const labels = [t('francoToday'), t('francoTomorrow'), t('franco2Days'), t('franco3Days')]
    return [0, 1, 2, 3].map((offset) => ({
      offset,
      label: `${labels[offset]} (${shortDate(addDays(today, offset))})`,
      value: format(addDays(today, offset), 'yyyy-MM-dd'),
    }))
  }, [t])

  // ─── Debounced name duplicate check ───────────────────────────────────────

  useEffect(() => {
    if (isDefault) return
    const trimmed = name.trim()
    const timer = setTimeout(() => {
      if (!trimmed) {
        setNameDuplicateError(null)
        return
      }
      const dupe = configs.some(
        (c) => c.name?.toLowerCase() === trimmed.toLowerCase() && c.id !== configId
      )
      setNameDuplicateError(dupe ? t('validation.nameTaken') : null)
    }, 300)
    return () => clearTimeout(timer)
  }, [name, isDefault, configs, configId, t])

  // ─── Validation ───────────────────────────────────────────────────────────

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {}

    if (!isDefault && !name.trim()) {
      errs.name = t('validation.nameRequired')
    }

    if (schemeKey === 'custom') {
      const wh = parseInt(workHours, 10)
      const rh = parseInt(restHours, 10)
      if (isNaN(wh) || wh < 12 || wh > 72) errs.workHours = t('validation.workHoursRange')
      if (isNaN(rh) || rh < 12 || rh > 72) errs.restHours = t('validation.restHoursRange')
    }

    if (!/^\d{2}:\d{2}$/.test(entryTime)) {
      errs.entryTime = t('validation.entryTimeInvalid')
    }

    if (!currentlyOnRest && !/^\d{4}-\d{2}-\d{2}$/.test(cycleStartDate)) {
      errs.cycleStartDate = t('validation.dateInvalid')
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      errs.color = t('validation.colorInvalid')
    }

    return errs
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validate()
    if (Object.keys(newErrors).length > 0 || nameDuplicateError) {
      setErrors(newErrors)
      scrollToFirstError()
      return
    }

    setIsSubmitting(true)

    const effectiveCycleStart = currentlyOnRest
      ? (nextShiftOptions.find((o) => o.offset === nextShiftOffset)?.value ?? cycleStartDate)
      : cycleStartDate

    const scheme = buildScheme(schemeKey, parseInt(workHours, 10), parseInt(restHours, 10))

    const configData = {
      name: isDefault ? null : name.trim(),
      scheme,
      entryTime,
      cycleStartDate: effectiveCycleStart,
      color,
      timeFormat,
    }

    if (mode === 'new') {
      addConfig({ ...configData, isDefault: false, isActive: true })
    } else if (config) {
      updateConfig(config.id, configData)
    }

    if (isDefault) {
      setTheme(localTheme)
      setFirstDayOfWeek(localFirstDay)
      setGridLineColor(localGridColor)
    }

    setIsSubmitting(false)
    setShowToast(true)
  }

  // ─── Shared input class ───────────────────────────────────────────────────

  const inputCls = (field: string) =>
    [
      'w-full rounded-md border px-3 py-2.5 text-sm',
      'bg-surface-elevated text-text-primary',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
      'transition-colors duration-[100ms]',
      errors[field] ? 'border-feedback-error' : 'border-border-default',
    ].join(' ')

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <form
        id={fId('form')}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 p-4 sm:mx-auto sm:max-w-[480px]"
      >
        {/* ── Name (non-default only) ── */}
        {!isDefault && (
          <div data-error={errors.name ? 'true' : undefined}>
            <label
              htmlFor={fId('name')}
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              {t('name')}
            </label>
            <input
              id={fId('name')}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
              }}
              className={inputCls('name')}
              aria-describedby={
                errors.name ? fId('name-err') : nameDuplicateError ? fId('name-dup') : undefined
              }
            />
            {errors.name && (
              <p
                id={fId('name-err')}
                role="alert"
                aria-live="assertive"
                className="mt-1 text-xs text-feedback-error"
              >
                {errors.name}
              </p>
            )}
            {!errors.name && nameDuplicateError && (
              <p
                id={fId('name-dup')}
                aria-live="polite"
                className="mt-1 text-xs text-feedback-error"
              >
                {nameDuplicateError}
              </p>
            )}
          </div>
        )}

        {/* ── Scheme ── */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-text-primary">{t('scheme')}</legend>
          <div className="space-y-2">
            {PRESET_SCHEMES.map((key) => (
              <label key={key} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="radio"
                  name={fId('scheme')}
                  value={key}
                  checked={schemeKey === key}
                  onChange={() => setSchemeKey(key)}
                  className="accent-interactive-primary"
                />
                <span className="text-sm text-text-primary">
                  {key === '24x48'
                    ? t('scheme24x48')
                    : key === '12x36'
                      ? t('scheme12x36')
                      : key === '48x48'
                        ? t('scheme48x48')
                        : t('schemeCustom')}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* ── Custom scheme fields (conditional) ── */}
        {schemeKey === 'custom' && (
          <div className="animate-field-appear space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div data-error={errors.workHours ? 'true' : undefined}>
                <label
                  htmlFor={fId('wh')}
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  {t('customWorkHours')}
                </label>
                <input
                  id={fId('wh')}
                  type="number"
                  min={12}
                  max={72}
                  value={workHours}
                  onChange={(e) => setWorkHours(e.target.value)}
                  className={inputCls('workHours')}
                />
                {errors.workHours && (
                  <p
                    role="alert"
                    aria-live="assertive"
                    className="mt-1 text-xs text-feedback-error"
                  >
                    {errors.workHours}
                  </p>
                )}
              </div>
              <div data-error={errors.restHours ? 'true' : undefined}>
                <label
                  htmlFor={fId('rh')}
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  {t('customRestHours')}
                </label>
                <input
                  id={fId('rh')}
                  type="number"
                  min={12}
                  max={72}
                  value={restHours}
                  onChange={(e) => setRestHours(e.target.value)}
                  className={inputCls('restHours')}
                />
                {errors.restHours && (
                  <p
                    role="alert"
                    aria-live="assertive"
                    className="mt-1 text-xs text-feedback-error"
                  >
                    {errors.restHours}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-text-secondary">{t('workHoursHelper')}</p>
          </div>
        )}

        {/* ── Entry time ── */}
        <div data-error={errors.entryTime ? 'true' : undefined}>
          <label
            htmlFor={fId('time')}
            className="mb-1.5 block text-sm font-medium text-text-primary"
          >
            {t('entryTime')}
          </label>
          <input
            id={fId('time')}
            type="time"
            value={entryTime}
            onChange={(e) => setEntryTime(e.target.value)}
            className={inputCls('entryTime')}
          />
          {errors.entryTime && (
            <p role="alert" aria-live="assertive" className="mt-1 text-xs text-feedback-error">
              {errors.entryTime}
            </p>
          )}
        </div>

        {/* ── Currently on rest ── */}
        <div>
          <label
            htmlFor={fId('onrest')}
            className="mb-1.5 block text-sm font-medium text-text-primary"
          >
            {t('currentlyOnRest')}
          </label>
          <select
            id={fId('onrest')}
            value={currentlyOnRest ? 'yes' : 'no'}
            onChange={(e) => setCurrentlyOnRest(e.target.value === 'yes')}
            className={`${inputCls('')} cursor-pointer`}
          >
            <option value="no">{t('currentlyOnRestNo')}</option>
            <option value="yes">{t('currentlyOnRestYes')}</option>
          </select>
        </div>

        {/* ── Next shift start (conditional on currentlyOnRest) ── */}
        {currentlyOnRest && (
          <div className="animate-field-appear">
            <label
              htmlFor={fId('nextshift')}
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              {t('nextShiftStart')}
            </label>
            <select
              id={fId('nextshift')}
              value={nextShiftOffset}
              onChange={(e) => setNextShiftOffset(Number(e.target.value))}
              className={`${inputCls('')} cursor-pointer`}
            >
              {nextShiftOptions.map((opt) => (
                <option key={opt.offset} value={opt.offset}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ── Cycle start date (hidden when currentlyOnRest) ── */}
        {!currentlyOnRest && (
          <div data-error={errors.cycleStartDate ? 'true' : undefined}>
            <label
              htmlFor={fId('date')}
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              {t('cycleStartDate')}
            </label>
            <input
              id={fId('date')}
              type="date"
              value={cycleStartDate}
              onChange={(e) => setCycleStartDate(e.target.value)}
              className={inputCls('cycleStartDate')}
            />
            {errors.cycleStartDate && (
              <p role="alert" aria-live="assertive" className="mt-1 text-xs text-feedback-error">
                {errors.cycleStartDate}
              </p>
            )}
          </div>
        )}

        {/* ── Color picker ── */}
        <div data-error={errors.color ? 'true' : undefined}>
          <ColorPicker
            value={color}
            onChange={(c) => {
              setColor(c)
              if (errors.color) setErrors((prev) => ({ ...prev, color: '' }))
            }}
            existingColors={existingColors}
          />
          {errors.color && (
            <p role="alert" aria-live="assertive" className="mt-1 text-xs text-feedback-error">
              {errors.color}
            </p>
          )}
        </div>

        {/* ── Time format ── */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-text-primary">{t('timeFormat')}</legend>
          <div className="space-y-2">
            {TIME_FORMATS.map((fmt) => (
              <label key={fmt} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="radio"
                  name={fId('tf')}
                  value={fmt}
                  checked={timeFormat === fmt}
                  onChange={() => setTimeFormat(fmt)}
                  className="accent-interactive-primary"
                />
                <span className="text-sm text-text-primary">
                  {fmt === '24h'
                    ? t('timeFormat24h')
                    : fmt === '12h'
                      ? t('timeFormat12h')
                      : t('timeFormatMilitary')}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* ── Global preferences (isDefault only) ── */}
        {isDefault && (
          <div className="space-y-6">
            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-border-default" />
              <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                {t('globalPrefs')}
              </span>
              <div className="flex-1 border-t border-border-default" />
            </div>

            {/* First day of week */}
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-text-primary">
                {t('firstDayOfWeek')}
              </legend>
              <div className="space-y-2">
                {([0, 1] as const).map((day) => (
                  <label key={day} className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="radio"
                      name={fId('fdow')}
                      value={day}
                      checked={localFirstDay === day}
                      onChange={() => setLocalFirstDay(day)}
                      className="accent-interactive-primary"
                    />
                    <span className="text-sm text-text-primary">
                      {day === 0 ? t('firstDayOfWeekSunday') : t('firstDayOfWeekMonday')}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Grid line color */}
            <div>
              <label
                htmlFor={fId('grid')}
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                {t('gridLineColor')}
              </label>
              <select
                id={fId('grid')}
                value={localGridColor}
                onChange={(e) => setLocalGridColor(e.target.value)}
                className={`${inputCls('')} cursor-pointer`}
              >
                {GRID_COLORS.map(({ value, key }) => (
                  <option key={value} value={value}>
                    {t(key)}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme */}
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-text-primary">{t('theme')}</legend>
              <div className="space-y-2">
                {(['light', 'dark'] as const).map((th) => (
                  <label key={th} className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="radio"
                      name={fId('theme')}
                      value={th}
                      checked={localTheme === th}
                      onChange={() => setLocalTheme(th)}
                      className="accent-interactive-primary"
                    />
                    <span className="text-sm text-text-primary">
                      {th === 'light' ? t('themeLight') : t('themeDark')}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {/* ── Submit ── */}
        <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
          {t('saveConfig')}
        </Button>
      </form>

      {/* Toast de confirmación — navega a /config al cerrarse */}
      {showToast && (
        <Toast variant="success" message={t('configSaved')} onDismiss={() => navigate('/config')} />
      )}
    </>
  )
}
