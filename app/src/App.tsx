// Inicializa i18next como side effect antes de montar cualquier componente.
import '@/i18n/config'

import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'

export default function App() {
  return <RouterProvider router={router} />
}
