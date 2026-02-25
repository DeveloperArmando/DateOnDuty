/**
 * Fila de una configuración en la lista /config.
 * Mobile  (< 640px): botón ⋮ con panel desplegable + navegación por teclado.
 * Desktop (≥ 640px): botones de acción inline — sin kebab.
 *
 * El estado de apertura del menú es controlado por el parent (ConfigPage),
 * que garantiza que solo un menú esté abierto a la vez.
 */

import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MoreVertical, X, Pencil, Star, Trash2, Share2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ShiftConfiguration } from '@/core/shift-calculator/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuItem {
  key: string
  label: string
  Icon: LucideIcon
  onClick: () => void
  danger: boolean
}

export interface ConfigRowProps {
  config: ShiftConfiguration
  isMenuOpen: boolean
  onMenuToggle: (id: string) => void
  onMakeDefault: () => void
  onDelete: () => void
  onShare: () => void
}

// ─── ConfigRow ────────────────────────────────────────────────────────────────

export function ConfigRow({
  config,
  isMenuOpen,
  onMenuToggle,
  onMakeDefault,
  onDelete,
  onShare,
}: ConfigRowProps) {
  const { t } = useTranslation('config')
  const navigate = useNavigate()

  const rowRef = useRef<HTMLLIElement>(null)
  const kebabRef = useRef<HTMLButtonElement>(null)
  const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const displayName = config.name ?? t('defaultConfigName')

  // ─── Menu effects: focus + click outside ─────────────────────────────────

  useEffect(() => {
    if (!isMenuOpen) return

    // Focus first item when menu opens
    const first = menuItemRefs.current.find((r): r is HTMLButtonElement => r !== null)
    first?.focus()

    // Capture ref value for cleanup (react-hooks/exhaustive-deps)
    const kebabEl = kebabRef.current

    // Close on click outside the row
    const handleMouseDown = (e: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) {
        onMenuToggle(config.id)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      // Restore focus to kebab button when menu closes
      kebabEl?.focus()
    }
  }, [isMenuOpen, config.id, onMenuToggle])

  // ─── Action handlers ─────────────────────────────────────────────────────

  const handleEdit = () => navigate(`/config/${config.id}`)

  const handleMakeDefault = () => {
    onMenuToggle(config.id)
    onMakeDefault()
  }

  const handleDelete = () => {
    onMenuToggle(config.id)
    onDelete()
  }

  const handleShare = () => {
    onMenuToggle(config.id)
    onShare()
  }

  // ─── Menu keyboard navigation ─────────────────────────────────────────────

  const handleMenuKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const items = menuItemRefs.current.filter((r): r is HTMLButtonElement => r !== null)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(idx + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(idx - 1 + items.length) % items.length]?.focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onMenuToggle(config.id) // cleanup restores focus to kebab
    }
  }

  // ─── Menu items ───────────────────────────────────────────────────────────

  const menuItems: MenuItem[] = [
    { key: 'edit', label: t('menuEdit'), Icon: Pencil, onClick: handleEdit, danger: false },
    { key: 'share', label: t('menuShare'), Icon: Share2, onClick: handleShare, danger: false },
    ...(!config.isDefault
      ? [
          {
            key: 'default',
            label: t('menuMakeDefault'),
            Icon: Star,
            onClick: handleMakeDefault,
            danger: false,
          },
          {
            key: 'delete',
            label: t('menuDelete'),
            Icon: Trash2,
            onClick: handleDelete,
            danger: true,
          },
        ]
      : []),
  ]

  // ─── Desktop inline button class ─────────────────────────────────────────

  const inlineBtnCls = (danger?: boolean) =>
    [
      'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium',
      'transition-colors duration-[100ms] hover:bg-surface-base',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
      danger ? 'text-feedback-error' : 'text-interactive-secondary-text',
    ].join(' ')

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <li ref={rowRef} className="overflow-hidden rounded-lg bg-surface-elevated shadow-sm">
      {/* ── Row content ── */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Color swatch */}
        <span
          className="h-5 w-5 shrink-0 rounded-full border border-black/10"
          style={{ backgroundColor: config.color }}
          aria-hidden="true"
        />

        {/* Config name */}
        <span
          className="flex-1 truncate text-base font-medium text-text-primary"
          title={displayName}
        >
          {displayName}
        </span>

        {/* Badge "Principal" */}
        {config.isDefault && (
          <span className="shrink-0 rounded-full bg-feedback-info-surface px-2 py-0.5 text-xs font-medium text-feedback-info">
            {t('badgePrincipal')}
          </span>
        )}

        {/* Desktop inline actions */}
        <div className="hidden shrink-0 items-center gap-1 sm:flex">
          <button
            type="button"
            aria-label={`${t('menuEdit')} ${displayName}`}
            className={inlineBtnCls()}
            onClick={handleEdit}
          >
            <Pencil size={14} aria-hidden="true" />
            {t('menuEdit')}
          </button>

          <button
            type="button"
            aria-label={`${t('menuShare')} ${displayName}`}
            className={inlineBtnCls()}
            onClick={handleShare}
          >
            <Share2 size={14} aria-hidden="true" />
            {t('menuShare')}
          </button>

          {!config.isDefault && (
            <>
              <button
                type="button"
                aria-label={`${t('menuMakeDefault')} ${displayName}`}
                className={inlineBtnCls()}
                onClick={handleMakeDefault}
              >
                <Star size={14} aria-hidden="true" />
                {t('menuMakeDefault')}
              </button>
              <button
                type="button"
                aria-label={`${t('menuDelete')} ${displayName}`}
                className={inlineBtnCls(true)}
                onClick={handleDelete}
              >
                <Trash2 size={14} aria-hidden="true" />
                {t('menuDelete')}
              </button>
            </>
          )}
        </div>

        {/* Mobile kebab button */}
        <button
          ref={kebabRef}
          type="button"
          aria-label={t('menuLabel', { name: displayName })}
          aria-expanded={isMenuOpen}
          aria-controls={`menu-${config.id}`}
          className="shrink-0 rounded-md p-1.5 text-text-secondary transition-colors hover:bg-surface-base hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring sm:hidden"
          onClick={() => onMenuToggle(config.id)}
        >
          {isMenuOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <MoreVertical size={20} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {isMenuOpen && (
        <div
          id={`menu-${config.id}`}
          role="menu"
          aria-label={t('menuLabel', { name: displayName })}
          className="animate-menu-expand border-t border-border-default sm:hidden"
        >
          {menuItems.map((item, idx) => (
            <button
              key={item.key}
              ref={(el) => {
                menuItemRefs.current[idx] = el
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              className={[
                'flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium',
                'transition-colors hover:bg-surface-base',
                'focus:outline-none focus-visible:bg-surface-base',
                item.danger ? 'text-feedback-error' : 'text-text-primary',
              ].join(' ')}
              onClick={item.onClick}
              onKeyDown={(e) => handleMenuKeyDown(e, idx)}
            >
              <item.Icon size={16} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </li>
  )
}
