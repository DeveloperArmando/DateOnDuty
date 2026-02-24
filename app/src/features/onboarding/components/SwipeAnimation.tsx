/**
 * Card flotante de onboarding que enseña los gestos de navegación del calendario.
 * - aria-hidden="true": puramente decorativo, no bloquea interacción (pointer-events: none)
 * - 8s totales: 7.5s visible → fade-out 500ms → llama onComplete()
 * - Dos cursores CSS animados: vertical (meses) y horizontal (años)
 */

import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SwipeAnimationProps {
  /** Llamado al completar los 8s. El parent escribe animationSeen y desmonta. */
  onComplete: () => void
}

// ─── SwipeAnimation ───────────────────────────────────────────────────────────

export function SwipeAnimation({ onComplete }: SwipeAnimationProps) {
  const { t } = useTranslation('onboarding')
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const leaveTimer = setTimeout(() => setIsLeaving(true), 7500)
    const doneTimer = setTimeout(onComplete, 8000)
    return () => {
      clearTimeout(leaveTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    // Capa de posicionamiento — no interfiere con transforms de animación
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-1/2 top-[calc(50%+1.75rem)] z-[15] -translate-x-1/2 -translate-y-1/2 select-none"
    >
      {/* Capa de animación de entrada/salida */}
      <div className={isLeaving ? 'animate-swipe-card-leave' : 'animate-swipe-card-enter'}>
        <div className="w-60 rounded-lg bg-surface-elevated px-5 py-4 shadow-md">
          {/* Fila 1: navegación vertical (meses) */}
          <div className="flex items-center gap-2">
            <ChevronUp size={16} aria-hidden="true" className="shrink-0 text-text-secondary" />
            <span className="text-xs text-text-secondary">{t('helpSwipeMonths')}</span>
            <ChevronDown size={16} aria-hidden="true" className="shrink-0 text-text-secondary" />
            {/* Pista del cursor vertical */}
            <div className="relative ml-auto h-8 w-2 overflow-hidden">
              <div className="animate-swipe-cursor-v absolute h-2 w-2 rounded-full bg-interactive-primary" />
            </div>
          </div>

          {/* Separador */}
          <div className="h-3" />

          {/* Fila 2: navegación horizontal (años) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <ChevronLeft size={16} aria-hidden="true" className="shrink-0 text-text-secondary" />
              <span className="text-xs text-text-secondary">{t('helpSwipeYears')}</span>
              <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-text-secondary" />
            </div>
            {/* Pista del cursor horizontal */}
            <div className="relative h-2 w-full overflow-hidden">
              <div className="animate-swipe-cursor-h absolute h-2 w-2 rounded-full bg-interactive-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
