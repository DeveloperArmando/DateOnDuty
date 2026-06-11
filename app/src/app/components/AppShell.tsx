import { Outlet } from 'react-router-dom'
import { AppBar } from './AppBar'
import { BottomBar } from './BottomBar'
import { Footer } from './Footer'

/**
 * Layout raíz que envuelve todas las rutas.
 * Estructura: AppBar (sticky top) → main (flex-1) → BottomBar (sticky bottom) → Footer.
 */
export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-base">
      <AppBar />
      <main className="flex flex-col flex-1">
        <Outlet />
      </main>
      <BottomBar />
      <Footer />
    </div>
  )
}
