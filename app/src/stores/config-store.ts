import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import type { ShiftConfiguration, ShiftScheme } from '@/core/shift-calculator/types'
import type { SharedConfigPayload } from '@/core/url-encoder/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

function createDefaultConfig(): ShiftConfiguration {
  return {
    id: crypto.randomUUID(),
    isDefault: true,
    name: null,
    scheme: '24x48',
    entryTime: '08:00',
    timeFormat: '24h',
    cycleStartDate: todayISO(),
    color: '#2563EB',
    isActive: true,
  }
}

/**
 * Convierte la representación string de esquema del payload URL al tipo ShiftScheme.
 * El decoder ya valida el string antes de llamar a esta función.
 */
function parseScheme(s: string): ShiftScheme {
  if (s === '24x48' || s === '12x36' || s === '48x48') return s
  const match = /^C(\d+):(\d+)$/.exec(s)
  if (match) {
    return { type: 'custom', workHours: parseInt(match[1], 10), restHours: parseInt(match[2], 10) }
  }
  return '24x48' // fallback defensivo
}

// ─── Interface ────────────────────────────────────────────────────────────────

interface ConfigStore {
  configs: ShiftConfiguration[]

  /** Retorna la config default (siempre existe, el array nunca está vacío). */
  getDefaultConfig: () => ShiftConfiguration
  /** Retorna todas las configs activas (incluye la default). */
  getActiveConfigs: () => ShiftConfiguration[]

  /** Actualiza campos de una config. La default no puede perder isActive ni isDefault. */
  updateConfig: (id: string, updates: Partial<ShiftConfiguration>) => void
  /** Agrega una nueva config adicional. Límite: 10 adicionales. */
  addConfig: (config: Omit<ShiftConfiguration, 'id'>) => void
  /** Elimina una config. No tiene efecto sobre la config default. */
  removeConfig: (id: string) => void
  /**
   * Promueve una config adicional a default de forma atómica:
   * - La nueva default queda con isDefault=true, name=null, isActive=true.
   * - La anterior default pasa a adicional con isDefault=false, name=oldDefaultName.
   */
  promoteToDefault: (id: string, oldDefaultName: string) => void
  /** Activa o desactiva una config. No tiene efecto sobre la config default. */
  toggleActive: (id: string) => void
  /**
   * Importa una configuración desde URL compartida.
   * - asDefault=true: reemplaza la default actual (name → nombre para la config anterior).
   * - asDefault=false: agrega como adicional con nombre `name`.
   */
  importFromUrl: (payload: SharedConfigPayload, asDefault: boolean, name?: string) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      configs: [createDefaultConfig()],

      getDefaultConfig: () => get().configs.find((c) => c.isDefault)!,

      getActiveConfigs: () => get().configs.filter((c) => c.isActive),

      updateConfig: (id, updates) =>
        set((state) => ({
          configs: state.configs.map((c) => {
            if (c.id !== id) return c
            // La default nunca pierde su estado ni se desactiva
            const safeUpdates = c.isDefault
              ? { ...updates, isDefault: true, isActive: true }
              : updates
            return { ...c, ...safeUpdates }
          }),
        })),

      addConfig: (config) =>
        set((state) => {
          const additionals = state.configs.filter((c) => !c.isDefault)
          if (additionals.length >= 10) return state
          return {
            configs: [...state.configs, { ...config, id: crypto.randomUUID() }],
          }
        }),

      removeConfig: (id) =>
        set((state) => ({
          configs: state.configs.filter((c) => !(c.id === id && !c.isDefault)),
        })),

      promoteToDefault: (id, oldDefaultName) =>
        set((state) => {
          const target = state.configs.find((c) => c.id === id)
          if (!target || target.isDefault) return state

          return {
            configs: state.configs.map((c) => {
              if (c.isDefault) return { ...c, isDefault: false, name: oldDefaultName }
              if (c.id === id) return { ...c, isDefault: true, name: null, isActive: true }
              return c
            }),
          }
        }),

      toggleActive: (id) =>
        set((state) => ({
          configs: state.configs.map((c) =>
            c.id === id && !c.isDefault ? { ...c, isActive: !c.isActive } : c
          ),
        })),

      importFromUrl: (payload, asDefault, name) =>
        set((state) => {
          const scheme = parseScheme(payload.s)

          const newConfig: ShiftConfiguration = {
            id: crypto.randomUUID(),
            isDefault: asDefault,
            name: asDefault ? null : (name ?? 'Turno importado'),
            scheme,
            entryTime: payload.e,
            cycleStartDate: payload.d,
            timeFormat: '24h',
            color: payload.c,
            isActive: true,
          }

          if (asDefault) {
            // La nueva config encabeza el array. La anterior default pasa a adicional.
            const oldDefaultName = name ?? 'Mi turno anterior'
            return {
              configs: [
                newConfig,
                ...state.configs.map((c) =>
                  c.isDefault ? { ...c, isDefault: false, name: oldDefaultName } : c
                ),
              ],
            }
          }

          const additionals = state.configs.filter((c) => !c.isDefault)
          if (additionals.length >= 10) return state
          return { configs: [...state.configs, newConfig] }
        }),
    }),
    { name: 'dod-configs' }
  )
)
