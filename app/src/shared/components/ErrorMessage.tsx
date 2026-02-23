/**
 * Mensaje de error estandarizado. Dos variantes:
 * - `field`:  Inline bajo un input (data-error="true" para scrollToFirstError)
 * - `global`: Banner de conexión (role="alert" aria-live="assertive")
 *
 * No renderiza nada cuando `message` está vacío (evita layout ghost y
 * lectores de pantalla anunciando elementos vacíos).
 */

import { AlertCircle, AlertTriangle } from 'lucide-react'

interface ErrorMessageProps {
  variant: 'field' | 'global'
  message?: string
  /** Para vincular con `aria-describedby` en el input asociado. Solo variant=field. */
  id?: string
}

export function ErrorMessage({ variant, message, id }: ErrorMessageProps) {
  if (!message) return null

  if (variant === 'field') {
    return (
      <p
        id={id}
        role="alert"
        aria-live="polite"
        data-error="true"
        className="mt-1 flex items-center gap-1 text-xs text-feedback-error"
      >
        <AlertCircle size={14} aria-hidden="true" />
        {message}
      </p>
    )
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-2 rounded-md border border-feedback-error/30 bg-feedback-error-surface px-4 py-3 text-sm text-feedback-error"
    >
      <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      {message}
    </div>
  )
}
