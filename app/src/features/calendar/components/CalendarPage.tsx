// Página principal — carga eagerly (no lazy) para minimizar TTI.
import { useState } from 'react'
import { MonthGrid } from './MonthGrid'
import { DayExpandedPanel } from './DayExpandedPanel'
import { ConfigBanner } from '@/features/onboarding/components/ConfigBanner'
import { SwipeAnimation } from '@/features/onboarding/components/SwipeAnimation'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isAnimationSeen(): boolean {
  try {
    const raw = localStorage.getItem('dod-onboarding')
    if (!raw) return false
    return JSON.parse(raw).animationSeen === true
  } catch {
    return false
  }
}

function markAnimationSeen(): void {
  try {
    const raw = localStorage.getItem('dod-onboarding')
    const flags = raw ? JSON.parse(raw) : {}
    localStorage.setItem('dod-onboarding', JSON.stringify({ ...flags, animationSeen: true }))
  } catch {
    // Silenciar errores de localStorage (modo privado, cuota llena, etc.)
  }
}

// ─── CalendarPage ─────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const [showAnimation, setShowAnimation] = useState(() => !isAnimationSeen())

  const handleAnimationComplete = () => {
    markAnimationSeen()
    setShowAnimation(false)
  }

  return (
    <div className="bg-surface-base">
      {/* ConfigBanner se auto-gestiona: return null si bannerSeen=true */}
      <ConfigBanner onDismiss={() => {}} />

      <MonthGrid />
      <DayExpandedPanel />

      {showAnimation && <SwipeAnimation onComplete={handleAnimationComplete} />}
    </div>
  )
}
