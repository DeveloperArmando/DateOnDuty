import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppPreferences {
  theme: 'light' | 'dark'
  firstDayOfWeek: 0 | 1 // 0 = domingo, 1 = lunes
  gridLineColor: string // "#RRGGBB"
}

interface ThemeStore extends AppPreferences {
  setTheme: (theme: 'light' | 'dark') => void
  setFirstDayOfWeek: (day: 0 | 1) => void
  setGridLineColor: (color: string) => void
}

// ─── DOM side-effect ──────────────────────────────────────────────────────────

/**
 * Aplica/remueve la clase `dark` en <html> de forma síncrona.
 * Separada como función pura para usarla tanto en setTheme como en onRehydrateStorage.
 */
function applyThemeToDom(theme: 'light' | 'dark'): void {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      firstDayOfWeek: 0,
      gridLineColor: '#E5E7EB',

      setTheme: (theme) => {
        applyThemeToDom(theme)
        set({ theme })
      },

      setFirstDayOfWeek: (firstDayOfWeek) => set({ firstDayOfWeek }),

      setGridLineColor: (gridLineColor) => set({ gridLineColor }),
    }),
    {
      name: 'dod-preferences',
      /**
       * Al rehidratar desde localStorage, aplicar el tema guardado al DOM
       * antes del primer render para evitar el flash de tema incorrecto.
       */
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeToDom(state.theme)
      },
    }
  )
)
