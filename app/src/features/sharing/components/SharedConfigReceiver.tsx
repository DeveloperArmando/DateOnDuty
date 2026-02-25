/**
 * Lee el parámetro ?cfg= de la URL, decodifica y muestra el modal de importación.
 * Debe montarse en CalendarPage para ejecutarse en la ruta raíz.
 *
 * Flujo:
 * - Sin ?cfg=: no renderiza nada.
 * - ?cfg= inválido: modal de error con botón Cerrar.
 * - ?cfg= válido: modal con opciones (reemplazar / agregar / ignorar).
 * - En todos los casos, al cerrar: navigate("/", { replace: true }).
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { decodeConfig } from '@/core/url-encoder/decoder'
import { useConfigStore } from '@/stores/config-store'
import { Button } from '@/shared/components/Button'
import type { SharedConfigPayload } from '@/core/url-encoder/types'

// ─── SharedConfigReceiver ─────────────────────────────────────────────────────

export function SharedConfigReceiver() {
  const [searchParams] = useSearchParams()
  const [dismissed, setDismissed] = useState(false)

  const cfgParam = searchParams.get('cfg')

  if (!cfgParam || dismissed) return null

  return <ReceiverModal encoded={cfgParam} onDone={() => setDismissed(true)} />
}

// ─── ReceiverModal ────────────────────────────────────────────────────────────

interface ReceiverModalProps {
  encoded: string
  onDone: () => void
}

function ReceiverModal({ encoded, onDone }: ReceiverModalProps) {
  const { t } = useTranslation('calendar')
  const { t: tc } = useTranslation()
  const navigate = useNavigate()
  const { importFromUrl, getDefaultConfig } = useConfigStore()

  const defaultConfig = getDefaultConfig()

  const [decodeResult] = useState<{ payload: SharedConfigPayload | null; error: string | null }>(
    () => {
      try {
        return { payload: decodeConfig(encoded), error: null }
      } catch {
        return { payload: null, error: tc('invalidLink') }
      }
    }
  )

  const [mode, setMode] = useState<'replace' | 'add'>('add')
  const [replaceName, setReplaceName] = useState(defaultConfig.name ?? t('panel.defaultConfigName'))
  const [addName, setAddName] = useState(t('importDefaultAddName'))

  const modalRef = useRef<HTMLDivElement>(null)

  const cleanAndClose = useCallback(() => {
    navigate('/', { replace: true })
    onDone()
  }, [navigate, onDone])

  // Focus first focusable element when modal mounts
  useEffect(() => {
    const btn = modalRef.current?.querySelector<HTMLElement>('button')
    btn?.focus()
  }, [])

  // Escape + focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        cleanAndClose()
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = [
          ...modalRef.current.querySelectorAll<HTMLElement>(
            'button, input, [tabindex]:not([tabindex="-1"])'
          ),
        ]
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [cleanAndClose])

  const handleConfirm = () => {
    if (!decodeResult.payload) return
    if (mode === 'replace') {
      importFromUrl(decodeResult.payload, true, replaceName.trim() || replaceName)
    } else {
      importFromUrl(decodeResult.payload, false, addName.trim() || addName)
    }
    cleanAndClose()
  }

  // ─── Error state ────────────────────────────────────────────────────────────

  if (!decodeResult.payload) {
    return createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) cleanAndClose()
        }}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-error-title"
          className="w-full max-w-sm animate-modal-enter rounded-xl bg-surface-elevated p-6 shadow-lg"
        >
          <div className="mb-4 flex justify-center">
            <AlertCircle size={32} aria-hidden="true" className="text-feedback-error" />
          </div>
          <h2
            id="import-error-title"
            className="mb-2 text-center text-base font-semibold text-text-primary"
          >
            {tc('error')}
          </h2>
          <p className="mb-6 text-center text-sm text-text-secondary">
            {decodeResult.error ?? tc('invalidLink')}
          </p>
          <div className="flex justify-center">
            <Button variant="secondary" onClick={cleanAndClose}>
              {tc('close')}
            </Button>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  // ─── Import modal ────────────────────────────────────────────────────────────

  const { payload } = decodeResult
  const nameValue = mode === 'replace' ? replaceName : addName
  const nameLabel = mode === 'replace' ? t('importOldNameLabel') : t('importNameLabel')
  const setNameValue = mode === 'replace' ? setReplaceName : setAddName

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) cleanAndClose()
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-modal-title"
        className="w-full max-w-sm animate-modal-enter rounded-xl bg-surface-elevated p-6 shadow-lg"
      >
        {/* Title */}
        <h2 id="import-modal-title" className="mb-4 text-base font-semibold text-text-primary">
          {t('importTitle')}
        </h2>

        {/* Payload preview */}
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-surface-base px-3 py-2.5">
          <span
            className="h-4 w-4 shrink-0 rounded-full border border-black/10"
            style={{ backgroundColor: payload.c }}
            aria-hidden="true"
          />
          <span className="text-sm text-text-primary">
            {payload.s} · {payload.e}
          </span>
        </div>

        {/* Mode radio group */}
        <div className="mb-4 space-y-2" role="radiogroup" aria-label={t('importTitle')}>
          {(['replace', 'add'] as const).map((m) => (
            <label
              key={m}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-default px-3 py-2.5 text-sm text-text-primary transition-colors has-[:checked]:border-interactive-primary has-[:checked]:bg-feedback-info-surface"
            >
              <input
                type="radio"
                name="import-mode"
                value={m}
                checked={mode === m}
                onChange={() => setMode(m)}
                className="accent-interactive-primary"
              />
              {m === 'replace' ? t('importReplace') : t('importAdd')}
            </label>
          ))}
        </div>

        {/* Name input */}
        <div className="mb-6">
          <label
            className="mb-1.5 block text-xs font-medium text-text-secondary"
            htmlFor="import-name"
          >
            {nameLabel}
          </label>
          <input
            id="import-name"
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            className="w-full rounded-md border border-border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
          />
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="primary" fullWidth onClick={handleConfirm}>
            {t('importConfirm')}
          </Button>
          <div className="flex justify-center">
            <Button variant="ghost" onClick={cleanAndClose}>
              {t('importDiscard')}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
