import { Suspense } from 'react'

/** Fallback de pantalla completa mientras se carga un chunk lazy. */
export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base">
      <span className="animate-pulse text-sm text-text-secondary">Cargando...</span>
    </div>
  )
}

/** Envuelve rutas lazy en un Suspense con el fallback estándar. */
export function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}
