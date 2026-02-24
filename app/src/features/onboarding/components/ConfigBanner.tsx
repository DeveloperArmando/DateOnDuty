/**
 * Banner de onboarding — aparece la primera vez que el usuario abre la app.
 *
 * Regla crítica del timer:
 * - La flag dod-onboarding.bannerSeen se escribe SOLO cuando el timer de 50s COMPLETA.
 * - Si el usuario navega a /config (tap) → el timer sigue corriendo.
 * - Si el componente se desmonta antes de 50s → clearInterval() cancela el tick
 *   → la flag NO se escribe → el banner reaparece en la próxima sesión.
 *
 * El timer sobrevive navegaciones gracias a onboardingStartTime en ui-store (no persistido).
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Settings, ChevronRight } from 'lucide-react'
import { useUIStore } from '@/stores/ui-store'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConfigBannerProps {
  /** Llamado tras la animación de salida (al completar el timer de 50s). */
  onDismiss: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DOD_ONBOARDING_KEY = 'dod-onboarding'

function isBannerSeen(): boolean {
  try {
    const raw = localStorage.getItem(DOD_ONBOARDING_KEY)
    if (!raw) return false
    return JSON.parse(raw).bannerSeen === true
  } catch {
    return false
  }
}

function markBannerSeen(): void {
  try {
    const raw = localStorage.getItem(DOD_ONBOARDING_KEY)
    const flags = raw ? JSON.parse(raw) : {}
    localStorage.setItem(DOD_ONBOARDING_KEY, JSON.stringify({ ...flags, bannerSeen: true }))
  } catch {
    // Silenciar errores de localStorage (modo privado, cuota llena, etc.)
  }
}

// ─── ConfigBanner ─────────────────────────────────────────────────────────────

export function ConfigBanner({ onDismiss }: ConfigBannerProps) {
  const { t } = useTranslation('onboarding')
  const navigate = useNavigate()

  const { onboardingStartTime, setOnboardingStartTime } = useUIStore()

  const [elapsed, setElapsed] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)

  // Verificar bannerSeen en render inicial (sin state para evitar re-render extra)
  const [seen] = useState(() => isBannerSeen())

  // Inicializar el tiempo de inicio (una sola vez por sesión)
  useEffect(() => {
    if (!onboardingStartTime) {
      setOnboardingStartTime(Date.now())
    }
  }, [onboardingStartTime, setOnboardingStartTime])

  // Timer de progreso — la flag se escribe SOLO cuando el intervalo alcanza 50s
  useEffect(() => {
    if (seen || !onboardingStartTime) return

    const tick = () => {
      const e = Math.min(50, Math.floor((Date.now() - onboardingStartTime) / 1000))
      setElapsed(e)

      if (e >= 50) {
        // Escribir flag SOLO aquí (timer completado)
        markBannerSeen()
        setIsLeaving(true)
        clearInterval(intervalId)
      }
    }

    tick() // primer tick inmediato (calcula elapsed real si viene de otra ruta)
    const intervalId = setInterval(tick, 1000)

    // Cleanup cancela el interval → si el componente se desmonta antes de 50s,
    // la flag NO se habrá escrito → el banner reaparece en la próxima sesión.
    return () => clearInterval(intervalId)
  }, [seen, onboardingStartTime])

  // Llama onDismiss tras la animación de salida (250ms)
  useEffect(() => {
    if (!isLeaving) return
    const t = setTimeout(onDismiss, 250)
    return () => clearTimeout(t)
  }, [isLeaving, onDismiss])

  // Ya fue visto en sesiones anteriores — no renderizar
  if (seen) return null

  const progressPct = Math.min(100, (elapsed / 50) * 100)

  return (
    <aside
      aria-live="polite"
      aria-label={t('bannerTitle')}
      className={[
        'fixed left-0 right-0 top-14 z-[20]',
        'cursor-pointer bg-feedback-info-surface shadow-[0_2px_4px_rgba(0,0,0,0.08)]',
        isLeaving ? 'animate-banner-leave' : 'animate-banner-enter',
      ].join(' ')}
    >
      {/* Área clickable */}
      <button
        type="button"
        onClick={() => navigate('/config')}
        aria-label={t('bannerSubtitle')}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
      >
        <Settings size={18} aria-hidden="true" className="shrink-0 text-feedback-info" />
        <span
          className="min-w-0 flex-1 truncate text-sm font-medium text-feedback-info"
          title={t('bannerSubtitle')}
        >
          {t('bannerSubtitle')}
        </span>
        <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-feedback-info" />
      </button>

      {/* Barra de progreso */}
      <div
        role="progressbar"
        aria-valuenow={elapsed}
        aria-valuemin={0}
        aria-valuemax={50}
        aria-label="Tiempo restante del aviso"
        className="h-0.5 w-full bg-border-default"
      >
        <div
          className="h-full bg-interactive-primary"
          style={{ width: `${progressPct}%`, transition: 'width 1s linear' }}
        />
      </div>
    </aside>
  )
}
