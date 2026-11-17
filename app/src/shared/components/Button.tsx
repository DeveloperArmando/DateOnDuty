/**
 * Botón de acción reutilizable. Es el único botón de la app.
 *
 * RG-001: El atributo HTML `disabled` NUNCA se usa. La prevención de doble
 * submit es responsabilidad del consumer via la prop `loading`.
 * RG-002: Estado loading muestra <LoadingDots /> en lugar del texto.
 */

import type { LucideIcon } from 'lucide-react'
import { LoadingDots } from './LoadingDots'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled'
> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  iconLeft?: LucideIcon
  iconRight?: LucideIcon
  /** Solo visual: aplica opacidad reducida. Nunca agrega `disabled` al DOM. */
  visuallyDisabled?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-interactive-primary hover:bg-interactive-primary-hover text-interactive-primary-text',
  secondary:
    'border border-interactive-secondary-border bg-transparent text-interactive-secondary-text hover:bg-surface-elevated',
  ghost: 'bg-transparent text-interactive-secondary-text hover:bg-surface-elevated/60',
  destructive: 'bg-feedback-error text-text-inverse hover:opacity-90',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 min-h-[32px] text-sm',
  md: 'px-4 py-2.5 min-h-[40px] text-base',
  lg: 'px-6 py-3 min-h-[48px] text-base font-semibold',
  // Solo ícono: compacto en mobile para que las barras con varios botones quepan en 360px
  icon: 'px-1 py-1.5 min-h-[32px] min-w-[28px] text-sm sm:px-3',
}

const iconSizes: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20, icon: 16 }

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  visuallyDisabled = false,
  className,
  onClick,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return
    onClick?.(e)
  }

  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-md',
    'transition-[background-color,transform] duration-fast ease-default',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
    'active:scale-[0.98]',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    loading ? 'cursor-wait' : 'cursor-pointer',
    visuallyDisabled ? 'opacity-50' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      aria-busy={loading ? true : undefined}
      onClick={handleClick}
      className={classes}
      {...rest}
    >
      {loading ? (
        <LoadingDots size={size === 'icon' ? 'sm' : size} />
      ) : (
        <>
          {IconLeft && <IconLeft size={iconSizes[size]} aria-hidden="true" />}
          {children}
          {IconRight && <IconRight size={iconSizes[size]} aria-hidden="true" />}
        </>
      )}
    </button>
  )
}
