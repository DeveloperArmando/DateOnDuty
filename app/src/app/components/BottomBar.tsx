import { Search, CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/Button'
import { useUIStore } from '@/stores/ui-store'

/** Barra de acciones global, sticky en la parte inferior. */
export function BottomBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentMonth, currentYear, goToToday } = useUIStore()

  const now = new Date()
  const isCurrentMonth = currentMonth === now.getMonth() && currentYear === now.getFullYear()

  const handleBackToToday = () => {
    goToToday()
    if (location.pathname !== '/') navigate('/')
  }

  return (
    <nav
      aria-label={t('globalActions')}
      className="sticky bottom-0 z-[25] flex items-center justify-center gap-3 border-t border-border-default bg-surface-elevated px-4 py-2"
    >
      {!isCurrentMonth && (
        <Button
          variant="ghost"
          size="sm"
          aria-label={t('backToToday')}
          onClick={handleBackToToday}
          iconLeft={CalendarDays}
        >
          {t('backToToday')}
        </Button>
      )}
      <Button
        variant="secondary"
        size="sm"
        aria-label={t('nav.search')}
        onClick={() => navigate('/search')}
        iconLeft={Search}
      >
        {t('nav.search')}
      </Button>
    </nav>
  )
}
