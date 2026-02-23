import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/** Pie de página no sticky. Visible al final del contenido de cada ruta. */
export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border-default px-4 py-4">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Link to="/terms" className="text-text-secondary hover:underline">
            {t('termsShort')}
          </Link>
          <span className="text-text-secondary" aria-hidden="true">
            ·
          </span>
          <Link to="/privacy" className="text-text-secondary hover:underline">
            {t('privacyShort')}
          </Link>
        </div>
        <Link to="/feedback" className="text-interactive-secondary-text hover:underline">
          {t('feedbackCta')}
        </Link>
      </div>
    </footer>
  )
}
