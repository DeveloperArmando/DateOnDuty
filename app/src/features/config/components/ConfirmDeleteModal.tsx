/**
 * Modal de confirmación para eliminar una configuración adicional.
 * La config default ("Mi turno") nunca puede eliminarse — este modal
 * nunca se abre para ella.
 *
 * Accesibilidad:
 * - Focus inicial: botón "Cancelar" (patrón de seguridad — nunca el destructivo)
 * - Focus trap: Tab circula dentro del modal
 * - Escape: equivale a Cancelar
 */

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/Button'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfirmDeleteModalProps {
  isOpen: boolean
  configName: string
  onConfirm: () => void
  onCancel: () => void
}

// ─── ConfirmDeleteModal ───────────────────────────────────────────────────────

export function ConfirmDeleteModal({
  isOpen,
  configName,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const { t } = useTranslation('config')
  const { t: tc } = useTranslation()

  const modalRef = useRef<HTMLDivElement>(null)
  const cancelWrapRef = useRef<HTMLDivElement>(null)

  // Al abrir: foco en "Cancelar" (seguridad — nunca en el botón destructivo)
  useEffect(() => {
    if (!isOpen) return
    const btn = cancelWrapRef.current?.querySelector<HTMLElement>('button')
    btn?.focus()
  }, [isOpen])

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
        aria-labelledby="delete-modal-title"
        className="w-full max-w-sm animate-modal-enter rounded-xl bg-surface-elevated p-6 shadow-lg"
      >
        {/* Ícono */}
        <div className="mb-4 flex justify-center">
          <Trash2 size={32} aria-hidden="true" className="text-feedback-error" />
        </div>

        {/* Título */}
        <h2
          id="delete-modal-title"
          className="mb-2 text-center text-base font-semibold text-text-primary"
        >
          {t('confirmDeleteTitle', { name: configName })}
        </h2>

        {/* Cuerpo */}
        <p className="mb-6 text-center text-sm text-text-secondary">{t('confirmDeleteBody')}</p>

        {/* Acciones */}
        <div className="space-y-3">
          <Button variant="destructive" fullWidth onClick={onConfirm}>
            {t('confirmDeleteBtn')}
          </Button>
          <div ref={cancelWrapRef} className="flex justify-center">
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
