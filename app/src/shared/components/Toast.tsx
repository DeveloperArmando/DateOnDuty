/**
 * Notificación flotante no intrusiva (portal a document.body).
 * Auto-desaparece tras `duration` ms. No requiere interacción del usuario.
 *
 * RG-002: Ninguna interacción requerida. Solo confirmación visual.
 */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'info' | 'warning' | 'error'

export interface ToastProps {
  variant?: ToastVariant
  message: string
  /** Auto-dismiss timer en ms. Default: 2000ms */
  duration?: number
  onDismiss: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export function Toast({ variant = 'success', message, duration = 2000, onDismiss }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false)
  const Icon = ICON_MAP[variant]
  const tokenColor = `var(--color-feedback-${variant})`

  // Inicia la animación de salida tras `duration` ms
  useEffect(() => {
    const t = setTimeout(() => setIsLeaving(true), duration)
    return () => clearTimeout(t)
  }, [duration])

  // Llama a onDismiss una vez que la animación de salida termina (200ms)
  useEffect(() => {
    if (!isLeaving) return
    const t = setTimeout(onDismiss, 200)
    return () => clearTimeout(t)
  }, [isLeaving, onDismiss])

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={[
        'fixed bottom-4 z-[60]',
        'left-4 right-4 sm:left-auto sm:right-4 sm:max-w-xs',
        'flex items-center gap-2',
        'rounded-md bg-surface-elevated px-4 py-3 shadow-md',
        'border-l-[3px]',
        isLeaving ? 'animate-toast-leave' : 'animate-toast-enter',
      ].join(' ')}
      style={{ borderLeftColor: tokenColor }}
    >
      <Icon size={18} aria-hidden="true" style={{ color: tokenColor }} />
      <span className="text-sm text-text-primary">{message}</span>
    </div>,
    document.body
  )
}
