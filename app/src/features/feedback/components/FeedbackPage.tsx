import { useTranslation } from 'react-i18next'

export default function FeedbackPage() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base">
      <p className="text-text-primary">{t('comingSoon')}</p>
    </div>
  )
}
