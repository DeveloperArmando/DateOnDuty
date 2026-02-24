/**
 * Selector de color para la franja del turno.
 * Combina:
 *  - Swatch + botón que abre <input type="color"> nativo (oculto)
 *  - Paleta de 10 colores predeterminados (roving tabindex)
 *  - Campo hex manual con validación en tiempo real
 *  - Evaluación de contraste WCAG 2.1 en tiempo real
 */

import { useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Info } from 'lucide-react'
import { DESIGN } from '@/shared/constants/design'
import { contrastRatio } from '@/core/wcag-contrast/wcag-contrast'

// ─── Constants ────────────────────────────────────────────────────────────────

const HEX_RE = /^#[0-9A-Fa-f]{6}$/

function detectColorInputSupport(): boolean {
  const input = document.createElement('input')
  input.setAttribute('type', 'color')
  return input.type === 'color'
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  existingColors?: string[]
}

// ─── ColorPicker ──────────────────────────────────────────────────────────────

export function ColorPicker({ value, onChange, existingColors = [] }: ColorPickerProps) {
  const { t } = useTranslation('config')

  // Refs
  const nativePickerRef = useRef<HTMLInputElement>(null)
  const paletteRef = useRef<HTMLDivElement>(null)

  // Browser support (computed once on first render)
  const [supportsColorInput] = useState(() => detectColorInputSupport())

  // Local hex input — uncontrolled until user enters a valid hex
  const [hexInput, setHexInput] = useState(value)
  const [hexError, setHexError] = useState(false)

  // Roving tabindex — which preset button has tabIndex=0
  const [focusedPresetIdx, setFocusedPresetIdx] = useState(() => {
    const idx = DESIGN.shiftColorPalette.findIndex((c) => c === value)
    return idx >= 0 ? idx : 0
  })

  // Sync hexInput when value prop changes from outside (during-render setState pattern)
  const [prevValue, setPrevValue] = useState(value)
  if (prevValue !== value) {
    setPrevValue(value)
    setHexInput(value)
    setHexError(false)
  }

  // WCAG contrast check against white (#FFFFFF) — warns when text on franja is hard to read
  const ratio = contrastRatio(value, '#FFFFFF')
  const hasContrastWarning = ratio !== null && ratio < 4.5

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.toUpperCase())
  }

  const handlePresetClick = (color: string, idx: number) => {
    setFocusedPresetIdx(idx)
    onChange(color)
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setHexInput(raw)
    if (HEX_RE.test(raw)) {
      setHexError(false)
      onChange(raw.toUpperCase())
    } else {
      setHexError(true)
    }
  }

  const handlePaletteKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const len = DESIGN.shiftColorPalette.length
      let newIdx = focusedPresetIdx
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        newIdx = (focusedPresetIdx + 1) % len
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        newIdx = (focusedPresetIdx - 1 + len) % len
      } else {
        return
      }
      setFocusedPresetIdx(newIdx)
      const buttons = paletteRef.current?.querySelectorAll<HTMLButtonElement>('button')
      buttons?.[newIdx]?.focus()
    },
    [focusedPresetIdx]
  )

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* ── Label ── */}
      <p className="text-sm font-medium text-text-primary">{t('color')}</p>

      {/* ── Swatch row ── */}
      <div className="flex items-center gap-3 rounded-lg border border-border-default bg-surface-elevated px-3 py-2">
        {/* Color swatch — purely decorative */}
        <span
          className="h-8 w-8 shrink-0 rounded-full border-2 border-border-strong transition-colors duration-[100ms]"
          style={{ backgroundColor: value }}
          aria-hidden="true"
        />

        {/* Hex value display */}
        <span className="flex-1 font-mono text-sm uppercase text-text-primary">{value}</span>

        {/* Native picker trigger button */}
        {supportsColorInput && (
          <button
            type="button"
            aria-label={t('colorPicker.currentColor', { color: value })}
            className="rounded-sm text-sm text-interactive-secondary-text hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            onClick={() => nativePickerRef.current?.click()}
          >
            {t('colorPicker.changeColor')}
          </button>
        )}

        {/* Hidden native color input */}
        <input
          ref={nativePickerRef}
          type="color"
          value={value.toLowerCase()}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
          onChange={handleNativeChange}
        />
      </div>

      {/* ── Preset palette ── */}
      <div
        ref={paletteRef}
        role="radiogroup"
        aria-label={t('colorPicker.presetColors')}
        className="flex flex-wrap gap-2"
        onKeyDown={handlePaletteKeyDown}
      >
        {DESIGN.shiftColorPalette.map((color, idx) => {
          const isActive = value === color
          const isInUse = existingColors.includes(color)
          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={t('colorPicker.presetColor', { color })}
              tabIndex={focusedPresetIdx === idx ? 0 : -1}
              className="relative h-6 w-6 rounded-full transition-transform duration-[100ms] hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
              style={{
                backgroundColor: color,
                outline: isActive ? `3px solid var(--color-interactive-primary)` : undefined,
                outlineOffset: isActive ? '2px' : undefined,
              }}
              onClick={() => handlePresetClick(color, idx)}
            >
              {/* In-use indicator — orange dot, top-right corner */}
              {isInUse && !isActive && (
                <span
                  className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#EA580C]"
                  aria-label={t('colorPicker.colorInUse')}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Hex manual input ── */}
      <div>
        <input
          type="text"
          aria-label={t('colorPicker.hexLabel')}
          placeholder={t('colorPicker.hexPlaceholder')}
          value={hexInput}
          maxLength={7}
          className={[
            'w-full rounded-md border px-3 py-1.5 font-mono text-sm',
            'bg-surface-elevated text-text-primary',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
            hexError ? 'border-feedback-error' : 'border-border-default',
          ].join(' ')}
          onChange={handleHexChange}
        />
        {hexError && (
          <p className="mt-1 text-xs text-feedback-error">{t('validation.colorInvalid')}</p>
        )}
      </div>

      {/* ── Contrast warning ── */}
      {hasContrastWarning && (
        <p
          role="alert"
          aria-live="polite"
          className="flex items-start gap-2 text-xs text-feedback-warning"
        >
          <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            {t('colorContrastWarning')}
            {ratio !== null && (
              <> ({t('colorPicker.contrastRatio', { ratio: ratio.toFixed(1) })})</>
            )}
          </span>
        </p>
      )}

      {/* ── Browser unsupported notice ── */}
      {!supportsColorInput && (
        <p className="flex items-start gap-2 text-xs text-text-secondary">
          <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{t('colorPicker.browserUnsupported')}</span>
        </p>
      )}
    </div>
  )
}
