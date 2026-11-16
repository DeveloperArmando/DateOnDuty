/**
 * Ayuda del calendario (US-009) — versión de leyenda.
 * Se abre con el botón [?] del AppBar (ui-store.helpActive) y explica gestos y
 * elementos en un BottomSheet (mobile) / modal centrado (desktop).
 *
 * La especificación completa (badges numerados superpuestos a la UI) está en
 * docs/design/component-specs/HelpOverlay.md y queda como mejora posterior.
 */

import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronUp, ChevronRight, CalendarDays, Clock, Search, Share2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useUIStore } from '@/stores/ui-store'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { Button } from '@/shared/components/Button'

// ─── Constants ────────────────────────────────────────────────────────────────

const HELP_ITEMS: { key: string; Icon: LucideIcon }[] = [
  { key: 'helpSwipeMonths', Icon: ChevronUp },
  { key: 'helpSwipeYears', Icon: ChevronRight },
  { key: 'helpTapDay', Icon: CalendarDays },
  { key: 'helpColors', Icon: Clock },
  { key: 'helpSearch', Icon: Search },
  { key: 'helpShare', Icon: Share2 },
]

// ─── HelpOverlay ──────────────────────────────────────────────────────────────

export function HelpOverlay() {
  const { t } = useTranslation('onboarding')
  const { helpActive, closeHelp } = useUIStore()

  // Al cerrar, el foco regresa al botón [?] que abrió la ayuda
  const wasOpenRef = useRef(false)
  useEffect(() => {
    if (helpActive) {
      wasOpenRef.current = true
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false
      document.querySelector<HTMLElement>('[data-help-toggle]')?.focus()
    }
  }, [helpActive])

  return (
    <BottomSheet isOpen={helpActive} onClose={closeHelp} size="lg" ariaLabel={t('helpTitle')}>
      <div className="overflow-y-auto px-4 pb-4 pt-1">
        <h2 className="mb-3 text-base font-semibold text-text-primary">{t('helpTitle')}</h2>
        <ul className="mb-4 space-y-3">
          {HELP_ITEMS.map(({ key, Icon }) => (
            <li key={key} className="flex items-start gap-3 text-sm text-text-primary">
              <Icon
                size={18}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-interactive-primary"
              />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
        <Button variant="primary" fullWidth onClick={closeHelp}>
          {t('helpClose')}
        </Button>
      </div>
    </BottomSheet>
  )
}
