/**
 * Página /config/:id — creación o edición de una configuración de turno.
 *
 * - id === 'new'  → modo creación (ShiftConfigForm mode="new")
 * - id existente → modo edición   (ShiftConfigForm mode="edit")
 * - id no encontrado → redirige a /config
 */

import { Navigate, useParams } from 'react-router-dom'
import { useConfigStore } from '@/stores/config-store'
import { ShiftConfigForm } from './ShiftConfigForm'

// ─── ConfigDetailPage ─────────────────────────────────────────────────────────

export default function ConfigDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { configs } = useConfigStore()

  if (id === 'new') {
    return (
      <div className="bg-surface-base pb-24 pt-4">
        <ShiftConfigForm mode="new" isDefault={false} />
      </div>
    )
  }

  const config = configs.find((c) => c.id === id)
  if (!config) return <Navigate to="/config" replace />

  return (
    <div className="bg-surface-base pb-24 pt-4">
      <ShiftConfigForm mode="edit" isDefault={config.isDefault} config={config} />
    </div>
  )
}
