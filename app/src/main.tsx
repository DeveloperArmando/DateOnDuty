import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Aplicar el tema guardado antes del primer render para evitar el flash de
// tema incorrecto (FOUC). El theme-store lo confirma después de hidratarse.
try {
  const raw = localStorage.getItem('dod-preferences')
  if (raw) {
    const parsed = JSON.parse(raw) as { state?: { theme?: string } }
    if (parsed.state?.theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }
} catch {
  // Primera visita o dato corrupto — sin problema, el store inicializa 'light'.
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
