/**
 * Modal para cambiar el turno principal.
 * El usuario puede renombrar el turno actual antes de confirmarlo como adicional.
 *
 * Accesibilidad:
 * - Focus inicial: input de nombre (autoFocus)
 * - Focus trap: Tab circula dentro del modal
 * - Escape: equivale a Cancelar
 */

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useConfigStore } from '@/stores/config-store'
import { Button } from '@/shared/components/Button'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfirmMakeDefaultModalProps {
  isOpen: boolean
  /** ID de la config que se promueve a default. */
  targetConfigId: string
  /** Nombre para mostrar de la config siendo promovida. */
  newDefaultName: string
  /** Nombre actual del default (pre-rellena el input). */
  currentDefaultName: string
  onConfirm: (newNameForOldDefault: string) => void
  onCancel: () => void
}

// ─── ConfirmMakeDefaultModal ──────────────────────────────────────────────────

export function ConfirmMakeDefaultModal({
  isOpen,
  targetConfigId,
  newDefaultName,
  currentDefaultName,
  onConfirm,
  onCancel,
}: ConfirmMakeDefaultModalProps) {
  const { t } = useTranslation('config')
  const { t: tc } = useTranslation()
  const { configs } = useConfigStore()

  const [nameInput, setNameInput] = useState(currentDefaultName)
  const [nameError, setNameError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Al abrir: reiniciar estado y foco en el input
  // setState en setTimeout para cumplir con react-hooks/set-state-in-effect
  useEffect(() => {
    if (!isOpen) return
    const t = setTimeout(() => {
      setNameInput(currentDefaultName)
      setNameError(null)
      setIsSaving(false)
    }, 0)
    inputRef.current?.focus()
    inputRef.current?.select()
    return () => clearTimeout(t)
  }, [isOpen, currentDefaultName])

  // Escape + focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = [
          ...modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
  }, [isOpen, onCancel])

  // Validación con debounce 300ms (nombre requerido + duplicado)
  useEffect(() => {
    if (!isOpen) return
    const trimmed = nameInput.trim()
    const timer = setTimeout(() => {
      if (!trimmed) {
        setNameError(t('validation.nameRequired'))
        return
      }
      const duplicate = configs.some(
        (c) =>
          !c.isDefault && c.id !== targetConfigId && c.name?.toLowerCase() === trimmed.toLowerCase()
      )
      setNameError(duplicate ? t('validation.nameTaken') : null)
    }, 300)
    return () => clearTimeout(timer)
  }, [nameInput, isOpen, configs, targetConfigId, t])

  const handleConfirm = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) {
      setNameError(t('validation.nameRequired'))
      inputRef.current?.focus()
      return
    }
    // Validación síncrona por si el debounce aún no ejecutó
    const duplicate = configs.some(
      (c) =>
        !c.isDefault && c.id !== targetConfigId && c.name?.toLowerCase() === trimmed.toLowerCase()
    )
    if (duplicate) {
      setNameError(t('validation.nameTaken'))
      inputRef.current?.focus()
      return
    }
    setIsSaving(true)
    onConfirm(trimmed)
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="make-default-modal-title"
        className="w-full max-w-sm animate-modal-enter rounded-xl bg-surface-elevated p-6 shadow-lg"
      >
        {/* Ícono */}
        <div className="mb-4 flex justify-center">
          <Star size={32} aria-hidden="true" className="text-feedback-warning" />
        </div>

        {/* Título */}
        <h2
          id="make-default-modal-title"
          className="mb-3 text-center text-base font-semibold text-text-primary"
        >
          {t('makeDefaultTitle')}
        </h2>

        {/* Cuerpo */}
        <p className="mb-2 text-center text-sm text-text-secondary">
          {t('makeDefaultBody', { name: newDefaultName })}
        </p>
        <p className="mb-4 text-center text-sm text-text-secondary">
          {t('makeDefaultBody2', { current: currentDefaultName })}
        </p>

        {/* Input nombre */}
        <div>
          <label
            htmlFor="make-default-name"
            className="mb-1.5 block text-sm font-medium text-text-primary"
          >
            {t('makeDefaultNameLabel')}
          </label>
          <input
            ref={inputRef}
            id="make-default-name"
            type="text"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value)
              setNameError(null)
            }}
            className={[
              'w-full rounded-md border px-3 py-2.5 text-sm',
              'bg-surface-elevated text-text-primary',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
              'transition-colors duration-[100ms]',
              nameError ? 'border-feedback-error' : 'border-border-default',
            ].join(' ')}
            aria-describedby={nameError ? 'make-default-name-err' : 'make-default-name-help'}
          />
          {nameError ? (
            <p
              id="make-default-name-err"
              role="alert"
              aria-live="assertive"
              className="mt-1 text-xs text-feedback-error"
            >
              {nameError}
            </p>
          ) : (
            <p id="make-default-name-help" className="mt-1 text-xs text-text-secondary">
              {t('makeDefaultHelper')}
            </p>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-5 space-y-3">
          <Button variant="primary" fullWidth loading={isSaving} onClick={handleConfirm}>
            {t('makeDefaultBtn')}
          </Button>
          <div className="flex justify-center">
            <Button variant="ghost" onClick={onCancel}>
              {tc('cancel')}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
