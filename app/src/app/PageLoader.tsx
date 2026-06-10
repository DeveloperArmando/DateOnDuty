import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

/** Fallback de pantalla completa mientras se carga un chunk lazy. */
export function PageLoader() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base">
      <span className="animate-pulse text-sm text-text-secondary">{t('loading')}</span>
    </div>
  )
}

/** Envuelve rutas lazy en un Suspense con el fallback estándar. */
export function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}
