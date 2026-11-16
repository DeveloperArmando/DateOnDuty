/**
 * Página /config — lista de configuraciones de turno.
 *
 * Gestiona:
 * - openMenuId: garantiza que solo un menú esté abierto a la vez
 * - deleteTarget: config seleccionada para eliminar (abre ConfirmDeleteModal)
 * - makeDefaultTarget: config seleccionada para promover (abre ConfirmMakeDefaultModal)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { useConfigStore, MAX_ADDITIONAL_CONFIGS } from '@/stores/config-store'
import { Button } from '@/shared/components/Button'
import type { ShiftConfiguration } from '@/core/shift-calculator/types'
import { ConfigRow } from './ConfigRow'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'
import { ConfirmMakeDefaultModal } from './ConfirmMakeDefaultModal'
import { ShareConfigModal } from '@/features/sharing/components/ShareConfigModal'

// ─── ConfigPage ───────────────────────────────────────────────────────────────

export default function ConfigPage() {
  const { t } = useTranslation('config')
  const navigate = useNavigate()
  const { configs, removeConfig, promoteToDefault } = useConfigStore()

  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ShiftConfiguration | null>(null)
  const [makeDefaultTarget, setMakeDefaultTarget] = useState<ShiftConfiguration | null>(null)
  const [shareTarget, setShareTarget] = useState<ShiftConfiguration | null>(null)

  // ─── Derived ─────────────────────────────────────────────────────────────

  const defaultConfig = configs.find((c) => c.isDefault)!
  const additionals = configs.filter((c) => !c.isDefault)
  const canAddMore = additionals.length < MAX_ADDITIONAL_CONFIGS

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleMenuToggle = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id))
  }

  const handleOpenDelete = (config: ShiftConfiguration) => {
    setOpenMenuId(null)
    setDeleteTarget(config)
  }

  const handleOpenMakeDefault = (config: ShiftConfiguration) => {
    setOpenMenuId(null)
    setMakeDefaultTarget(config)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    removeConfig(deleteTarget.id)
    setDeleteTarget(null)
  }

  const handleConfirmMakeDefault = (newNameForOldDefault: string) => {
    if (!makeDefaultTarget) return
    promoteToDefault(makeDefaultTarget.id, newNameForOldDefault)
    setMakeDefaultTarget(null)
  }

  const handleOpenShare = (config: ShiftConfiguration) => {
    setOpenMenuId(null)
    setShareTarget(config)
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="bg-surface-base pb-24 pt-4">
      <div className="mx-auto max-w-lg px-4">
        {/* Lista de configuraciones */}
        <ul className="space-y-2" aria-label={t('title')}>
          {/* Turno principal siempre primero */}
          <ConfigRow
            config={defaultConfig}
            isMenuOpen={openMenuId === defaultConfig.id}
            onMenuToggle={handleMenuToggle}
            onMakeDefault={() => {
              /* el default no puede promoverse a sí mismo */
            }}
            onDelete={() => {
              /* el default no puede eliminarse */
            }}
            onShare={() => handleOpenShare(defaultConfig)}
          />

          {additionals.map((config) => (
            <ConfigRow
              key={config.id}
              config={config}
              isMenuOpen={openMenuId === config.id}
              onMenuToggle={handleMenuToggle}
              onMakeDefault={() => handleOpenMakeDefault(config)}
              onDelete={() => handleOpenDelete(config)}
              onShare={() => handleOpenShare(config)}
            />
          ))}
        </ul>

        {/* Botón agregar / mensaje límite */}
        <div className="mt-4">
          {canAddMore ? (
            <Button
              variant="secondary"
              fullWidth
              iconLeft={Plus}
              onClick={() => navigate('/config/new')}
            >
              {t('addConfig')}
            </Button>
          ) : (
            <p className="text-center text-sm text-text-secondary">{t('maxConfigsReached')}</p>
          )}
        </div>
      </div>

      {/* ─── Modales ── */}
      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        configName={deleteTarget?.name ?? t('defaultConfigName')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmMakeDefaultModal
        isOpen={makeDefaultTarget !== null}
        targetConfigId={makeDefaultTarget?.id ?? ''}
        newDefaultName={makeDefaultTarget?.name ?? ''}
        currentDefaultName={defaultConfig.name ?? t('defaultConfigName')}
        onConfirm={handleConfirmMakeDefault}
        onCancel={() => setMakeDefaultTarget(null)}
      />

      <ShareConfigModal config={shareTarget} onClose={() => setShareTarget(null)} />
    </div>
  )
}
