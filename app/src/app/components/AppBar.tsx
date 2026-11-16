import {
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Moon,
  Sun,
  HelpCircle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/Button'
import { useUIStore } from '@/stores/ui-store'
import { useThemeStore } from '@/stores/theme-store'

const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const

/** Barra de navegación superior. Sticky en el top, presente en todas las rutas. */
export function AppBar() {
  const { t } = useTranslation()
  const { t: tc } = useTranslation('calendar')
  const location = useLocation()
  const navigate = useNavigate()

  const { currentMonth, currentYear, navigateMonth, navigateYear, toggleHelp, helpActive } =
    useUIStore()
  const { theme, setTheme } = useThemeStore()

  const isCalendarRoute = location.pathname === '/'
  const isDark = theme === 'dark'
  const monthName = tc(`months.${MONTH_KEYS[currentMonth]}`)
  const themeAriaLabel = isDark ? t('theme.toLight') : t('theme.toDark')

  const pageTitle = (() => {
    const p = location.pathname
    if (p === '/config') return t('pageTitle.config')
    if (p.startsWith('/config/')) return t('pageTitle.configDetail')
    if (p === '/search') return t('pageTitle.search')
    if (p === '/feedback') return t('pageTitle.feedback')
    if (p === '/terms') return t('pageTitle.terms')
    if (p === '/privacy') return t('pageTitle.privacy')
    return t('appName')
  })()

  return (
    <header
      role="banner"
      className="sticky top-0 z-[30] flex h-14 items-center gap-1 border-b border-border-default bg-surface-elevated px-4 sm:h-16"
    >
      {isCalendarRoute ? (
        <>
          {/* Left: Settings */}
          <Button
            variant="ghost"
            size="sm"
            aria-label={t('settings')}
            onClick={() => navigate('/config')}
          >
            <Settings size={20} aria-hidden="true" />
          </Button>

          {/* Center: Year + Month navigation */}
          <nav
            aria-label={tc('calendarNavLabel')}
            className="flex flex-1 items-center justify-center gap-0.5"
          >
            <Button
              variant="ghost"
              size="sm"
              aria-label={tc('prevYear')}
              onClick={() => navigateYear(-1)}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </Button>
            <span className="min-w-[3.25rem] text-center text-sm font-medium text-text-primary">
              {currentYear}
            </span>
            <Button
              variant="ghost"
              size="sm"
              aria-label={tc('nextYear')}
              onClick={() => navigateYear(1)}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              aria-label={tc('prevMonth')}
              onClick={() => navigateMonth(-1)}
            >
              <ChevronUp size={16} aria-hidden="true" />
            </Button>
            <span className="min-w-[5.5rem] text-center text-sm font-medium capitalize text-text-primary">
              {monthName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              aria-label={tc('nextMonth')}
              onClick={() => navigateMonth(1)}
            >
              <ChevronDown size={16} aria-hidden="true" />
            </Button>
          </nav>

          {/* Right: Theme + Help */}
          <Button
            variant="ghost"
            size="sm"
            aria-label={themeAriaLabel}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-help-toggle
            aria-label={tc('helpButton')}
            aria-expanded={helpActive}
            onClick={toggleHelp}
          >
            <HelpCircle size={20} aria-hidden="true" />
          </Button>
        </>
      ) : (
        <>
          {/* Left: Back */}
          <Button variant="ghost" size="sm" aria-label={t('back')} onClick={() => navigate(-1)}>
            <ChevronLeft size={20} aria-hidden="true" />
          </Button>

          {/* Center: Page title */}
          <h1 className="flex-1 truncate px-2 text-center text-lg font-semibold text-text-primary">
            {pageTitle}
          </h1>

          {/* Right: Theme */}
          <Button
            variant="ghost"
            size="sm"
            aria-label={themeAriaLabel}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </Button>
        </>
      )}
    </header>
  )
}
