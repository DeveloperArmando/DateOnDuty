/**
 * Contenedor deslizable desde abajo (mobile) o modal centrado (desktop ≥1024px).
 * Renderiza en un React Portal para evitar conflictos de z-index y overflow.
 *
 * Mobile:  slide-up / slide-down, drag handle, overlay oscuro.
 * Desktop: modal centrado con scale + bounce.
 */

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDrag } from '@use-gesture/react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'closed' | 'opening' | 'open' | 'closing'
type Size = 'sm' | 'md' | 'lg' | 'full'

export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  size?: Size
  hasHandle?: boolean
  hasOverlay?: boolean
  ariaLabel?: string
  children: React.ReactNode
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASS: Record<Size, string> = {
  sm: 'max-h-[25vh]',
  md: 'max-h-[50vh]',
  lg: 'max-h-[75vh]',
  full: 'max-h-screen',
}

// Drag-to-close thresholds
const DRAG_THRESHOLD_PX = 150
const DRAG_THRESHOLD_VEL = 0.5

// ─── BottomSheet ──────────────────────────────────────────────────────────────

export function BottomSheet({
  isOpen,
  onClose,
  size = 'md',
  hasHandle = true,
  hasOverlay = true,
  ariaLabel,
  children,
}: BottomSheetProps) {
  // Phase: derived from isOpen changes. Pattern: setState during render for prop→state sync.
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [phase, setPhase] = useState<Phase>(() => (isOpen ? 'open' : 'closed'))

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    setPhase(isOpen ? 'opening' : 'closing')
  }

  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  )

  const panelRef = useRef<HTMLDivElement>(null)

  // ─── Media query listener ────────────────────────────────────────────────

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleAnimationEnd = () => {
    setPhase((prev) => {
      if (prev === 'opening') return 'open'
      if (prev === 'closing') return 'closed'
      return prev
    })
  }

  // ─── Scroll lock ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!hasOverlay || !isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [hasOverlay, isOpen])

  // ─── Focus management ────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'open' && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      focusable[0]?.focus()
    }
  }, [phase])

  // ─── Drag handle (mobile only) ───────────────────────────────────────────

  const bindHandle = useDrag(
    ({ movement: [, my], velocity: [, vy], last }) => {
      if (isDesktop || !panelRef.current) return
      if (!last) {
        if (my > 0) panelRef.current.style.transform = `translateY(${my}px)`
      } else {
        panelRef.current.style.transform = ''
        if (my > DRAG_THRESHOLD_PX || vy > DRAG_THRESHOLD_VEL) onClose()
      }
    },
    { axis: 'y' }
  )

  // ─── Keyboard handler ────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose()
      return
    }
    // Focus trap
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )
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

  // ─── Render ───────────────────────────────────────────────────────────────

  if (phase === 'closed') return null

  // Animation class selection
  const openAnim = isDesktop ? 'animate-modal-enter' : 'animate-sheet-enter'
  const closeAnim = isDesktop ? 'animate-modal-exit' : 'animate-sheet-exit'
  const overlayOpenAnim = 'animate-overlay-enter'
  const overlayCloseAnim = 'animate-overlay-exit'

  const panelAnimClass = phase === 'opening' ? openAnim : phase === 'closing' ? closeAnim : ''

  const overlayAnimClass =
    phase === 'opening' ? overlayOpenAnim : phase === 'closing' ? overlayCloseAnim : ''

  // Desktop: position the panel centered; inline style prevents conflict with animation
  const panelStyle: React.CSSProperties = isDesktop
    ? {
        top: '50%',
        left: '50%',
        ...(phase === 'open' ? { transform: 'translate(-50%, -50%)' } : {}),
      }
    : {}

  const panelClasses = [
    'fixed bg-surface-elevated shadow-lg flex flex-col z-50',
    // Mobile layout
    !isDesktop ? 'bottom-0 left-0 right-0 rounded-t-xl' : '',
    !isDesktop ? SIZE_CLASS[size] : '',
    // Desktop layout
    isDesktop ? 'rounded-xl max-w-lg w-[calc(100%-2rem)] max-h-[70vh]' : '',
    panelAnimClass,
  ]
    .filter(Boolean)
    .join(' ')

  return createPortal(
    <div style={{ zIndex: 50 }} className="contents">
      {/* Overlay */}
      {hasOverlay && (
        <div
          className={`fixed inset-0 bg-surface-overlay ${overlayAnimClass}`}
          style={{ zIndex: 50 }}
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        role={hasOverlay ? 'dialog' : 'complementary'}
        aria-modal={hasOverlay ? true : undefined}
        aria-label={ariaLabel}
        className={panelClasses}
        style={{ ...panelStyle, zIndex: 51 }}
        onKeyDown={handleKeyDown}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* Drag handle */}
        {hasHandle && !isDesktop && (
          <div
            className="flex justify-center py-2 cursor-grab active:cursor-grabbing touch-none"
            {...bindHandle()}
          >
            <div className="h-1 w-8 rounded-full bg-border-strong" />
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  )
}
