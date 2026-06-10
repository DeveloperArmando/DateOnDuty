import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function TermsPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-prose px-4 py-8 text-text-primary">
      <h1 className="mb-4 text-2xl font-semibold">{t('pageTitle.terms')}</h1>
      <p className="mb-4 text-text-secondary">{t('comingSoon')}</p>
      <Link to="/" className="text-interactive-primary underline">
        {t('backToCalendar')}
      </Link>
    </div>
  )
}
