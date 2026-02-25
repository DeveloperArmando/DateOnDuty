/**
 * Modal para compartir una configuración de turno via URL.
 * - Genera la URL con encodeConfig(config)
 * - Botón de copiar al portapapeles con feedback "¡Enlace copiado!"
 * - Botón de compartir nativo (navigator.share) si el browser lo soporta
 */

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Copy, Share2 } from 'lucide-react'
import { encodeConfig } from '@/core/url-encoder/encoder'
import { Button } from '@/shared/components/Button'
import type { ShiftConfiguration } from '@/core/shift-calculator/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShareConfigModalProps {
  config: ShiftConfiguration | null
  onClose: () => void
}

// ─── ShareConfigModal ─────────────────────────────────────────────────────────

export function ShareConfigModal({ config, onClose }: ShareConfigModalProps) {
  const { t } = useTranslation('config')
  const { t: tc } = useTranslation()

  const [copied, setCopied] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const isOpen = config !== null
  const shareUrl = config ? `${window.location.origin}/?cfg=${encodeConfig(config)}` : ''

  // Focus first focusable element when modal opens
  useEffect(() => {
    if (!isOpen) return
    const btn = modalRef.current?.querySelector<HTMLElement>('button')
    btn?.focus()
  }, [isOpen])

  // Escape + focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
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
  }, [isOpen, onClose])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silenciar errores de clipboard (modo privado, permisos denegados)
    }
  }

  const handleNativeShare = async () => {
    try {
      await navigator.share({ url: shareUrl })
    } catch {
      // Silenciar errores de share (usuario canceló, navegador no soporta)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="w-full max-w-sm animate-modal-enter rounded-xl bg-surface-elevated p-6 shadow-lg"
      >
        {/* Title */}
        <h2 id="share-modal-title" className="mb-4 text-base font-semibold text-text-primary">
          {t('shareButton')}
        </h2>

        {/* URL display + copy button */}
        <div className="mb-2 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            aria-label={t('shareLink')}
            className="min-w-0 flex-1 rounded-md border border-border-default bg-surface-base px-3 py-2 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            onFocus={(e) => e.currentTarget.select()}
          />
          <button
            type="button"
            aria-label={copied ? t('shareCopied') : t('shareCopyLink')}
            title={copied ? t('shareCopied') : t('shareCopyLink')}
            onClick={handleCopy}
            className="shrink-0 rounded-md border border-border-default bg-surface-base p-2 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <Copy size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Copied feedback */}
        <p
          role="status"
          aria-live="polite"
          className={[
            'mb-4 text-sm text-interactive-primary transition-opacity duration-fast',
            copied ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          {t('shareCopied')}
        </p>

        {/* Native share — only shown if browser supports it */}
        {'share' in navigator && (
          <Button
            variant="secondary"
            fullWidth
            iconLeft={Share2}
            onClick={handleNativeShare}
            className="mb-4"
          >
            {t('shareNative')}
          </Button>
        )}

        {/* Close */}
        <div className="flex justify-center">
          <Button variant="ghost" onClick={onClose}>
            {tc('close')}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
