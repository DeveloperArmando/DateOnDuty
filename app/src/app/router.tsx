import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import CalendarPage from '@/features/calendar/components/CalendarPage'
import { Lazy } from '@/app/PageLoader'

// Rutas secundarias — lazy loaded para mantener el bundle inicial pequeño
const ConfigPage = lazy(() => import('@/features/config/components/ConfigPage'))
const ConfigDetailPage = lazy(() => import('@/features/config/components/ConfigDetailPage'))
const SearchPage = lazy(() => import('@/features/search/components/SearchPage'))
const FeedbackPage = lazy(() => import('@/features/feedback/components/FeedbackPage'))
const TermsPage = lazy(() => import('@/features/legal/components/TermsPage'))
const PrivacyPage = lazy(() => import('@/features/legal/components/PrivacyPage'))

export const router = createBrowserRouter([
  // Ruta principal: carga eagerly para minimizar TTI
  {
    path: '/',
    element: <CalendarPage />,
  },
  // Configuración de turnos
  {
    path: '/config',
    element: (
      <Lazy>
        <ConfigPage />
      </Lazy>
    ),
  },
  {
    path: '/config/:id',
    element: (
      <Lazy>
        <ConfigDetailPage />
      </Lazy>
    ),
  },
  // Búsqueda por fecha
  {
    path: '/search',
    element: (
      <Lazy>
        <SearchPage />
      </Lazy>
    ),
  },
  // Feedback
  {
    path: '/feedback',
    element: (
      <Lazy>
        <FeedbackPage />
      </Lazy>
    ),
  },
  // Páginas legales
  {
    path: '/terms',
    element: (
      <Lazy>
        <TermsPage />
      </Lazy>
    ),
  },
  {
    path: '/privacy',
    element: (
      <Lazy>
        <PrivacyPage />
      </Lazy>
    ),
  },
])
