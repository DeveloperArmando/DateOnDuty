import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import { isPresetScheme } from '@/core/shift-calculator/types'
import type { ShiftConfiguration, ShiftScheme } from '@/core/shift-calculator/types'
import type { SharedConfigPayload } from '@/core/url-encoder/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// generateId() requiere secure context (HTTPS/localhost).
// crypto.getRandomValues() funciona en cualquier contexto (incluye IP local en dev).
function generateId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const h = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

function createDefaultConfig(): ShiftConfiguration {
  return {
    id: generateId(),
    isDefault: true,
    name: null,
    scheme: '24x48',
    entryTime: '08:00',
    timeFormat: '12h',
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
  if (isPresetScheme(s)) return s
  const match = /^C(\d+):(\d+)$/.exec(s)
  if (match) {
    return { type: 'custom', workHours: parseInt(match[1], 10), restHours: parseInt(match[2], 10) }
  }
  return '24x48' // fallback defensivo
}

/** Máximo de configuraciones adicionales (sin contar la default). */
export const MAX_ADDITIONAL_CONFIGS = 10

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
   * - La nueva default queda con isDefault=true, name=null, isActive=true y pasa
   *   al inicio del array (invariante: el primer elemento es siempre la default).
   * - La anterior default pasa a adicional con isDefault=false, name=oldDefaultName.
   */
  promoteToDefault: (id: string, oldDefaultName: string) => void
  /** Activa o desactiva una config. No tiene efecto sobre la config default. */
  toggleActive: (id: string) => void
  /**
   * Importa una configuración desde URL compartida.
   * - asDefault=true: reemplaza la default actual (name → nombre para la config anterior).
   * - asDefault=false: agrega como adicional con nombre `name`.
   * En ambos casos el resultado suma una adicional: sin efecto si ya hay 10 (ver CE-51).
   */
  importFromUrl: (payload: SharedConfigPayload, asDefault: boolean, name: string) => void
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
          if (additionals.length >= MAX_ADDITIONAL_CONFIGS) return state
          return {
            configs: [...state.configs, { ...config, id: generateId() }],
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

          const newDefault: ShiftConfiguration = {
            ...target,
            isDefault: true,
            name: null,
            isActive: true,
          }
          const rest = state.configs
            .filter((c) => c.id !== id)
            .map((c) => (c.isDefault ? { ...c, isDefault: false, name: oldDefaultName } : c))

          return { configs: [newDefault, ...rest] }
        }),

      toggleActive: (id) =>
        set((state) => ({
          configs: state.configs.map((c) =>
            c.id === id && !c.isDefault ? { ...c, isActive: !c.isActive } : c
          ),
        })),

      importFromUrl: (payload, asDefault, name) =>
        set((state) => {
          // Importar siempre suma una adicional: la nueva, o la default anterior desplazada
          const additionals = state.configs.filter((c) => !c.isDefault)
          if (additionals.length >= MAX_ADDITIONAL_CONFIGS) return state

          const newConfig: ShiftConfiguration = {
            id: generateId(),
            isDefault: asDefault,
            name: asDefault ? null : name,
            scheme: parseScheme(payload.s),
            entryTime: payload.e,
            cycleStartDate: payload.d,
            timeFormat: '12h',
            color: payload.c,
            isActive: true,
          }

          if (!asDefault) return { configs: [...state.configs, newConfig] }

          // La nueva config encabeza el array. La anterior default pasa a adicional.
          return {
            configs: [
              newConfig,
              ...state.configs.map((c) => (c.isDefault ? { ...c, isDefault: false, name } : c)),
            ],
          }
        }),
    }),
    { name: 'dod-configs' }
  )
)
