import { create } from 'zustand'

// ─── Interface ────────────────────────────────────────────────────────────────

interface UIStore {
  currentMonth: number // 0–11
  currentYear: number
  /** Fecha del día expandido en vista detalle, o null si está cerrado. */
  expandedDay: string | null // "YYYY-MM-DD"
  helpActive: boolean

  /** Avanza o retrocede N meses, ajustando el año automáticamente. */
  navigateMonth: (delta: number) => void
  /** Avanza o retrocede N años sin cambiar el mes. */
  navigateYear: (delta: number) => void
  /** Regresa al mes y año actual del sistema. */
  goToToday: () => void
  /** Abre o cierra la vista expandida de un día (null para cerrar). */
  setExpandedDay: (date: string | null) => void
  /** Activa/desactiva el overlay de ayuda. */
  toggleHelp: () => void
  /** Salta directamente a un mes y año concretos (usado desde Search). */
  setViewDate: (year: number, month: number) => void
  /** Marca el inicio del onboarding para que el timer de ConfigBanner sobreviva navegaciones. */
  onboardingStartTime: number | null
  setOnboardingStartTime: (time: number) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

// ui-store NO usa persist — el estado es transitorio por sesión.
export const useUIStore = create<UIStore>()((set) => {
  const now = new Date()

  return {
    currentMonth: now.getMonth(),
    currentYear: now.getFullYear(),
    expandedDay: null,
    helpActive: false,
    onboardingStartTime: null,

    navigateMonth: (delta) =>
      set((state) => {
        // Date constructor normaliza automáticamente (ej: mes 13 → enero del año siguiente)
        const date = new Date(state.currentYear, state.currentMonth + delta)
        return { currentMonth: date.getMonth(), currentYear: date.getFullYear() }
      }),

    navigateYear: (delta) => set((state) => ({ currentYear: state.currentYear + delta })),

    goToToday: () => {
      const today = new Date()
      set({ currentMonth: today.getMonth(), currentYear: today.getFullYear() })
    },

    setExpandedDay: (expandedDay) => set({ expandedDay }),

    toggleHelp: () => set((state) => ({ helpActive: !state.helpActive })),

    setViewDate: (year, month) => set({ currentYear: year, currentMonth: month }),

    setOnboardingStartTime: (time) => set({ onboardingStartTime: time }),
  }
})
