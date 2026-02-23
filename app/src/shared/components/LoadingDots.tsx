/**
 * Tres puntos animados para estados de carga inline (RG-002).
 * Usa currentColor para heredar el color del texto del botón padre —
 * funciona en todas las variantes sin configuración adicional.
 * Solo se usa dentro de <Button loading={true}>. No diseñar para uso externo.
 */

type DotSize = 'sm' | 'md' | 'lg'

const dotSizeClass: Record<DotSize, string> = {
  sm: 'w-[5px] h-[5px]',
  md: 'w-[6px] h-[6px]',
  lg: 'w-[7px] h-[7px]',
}

const gapClass: Record<DotSize, string> = {
  sm: 'gap-[3px]',
  md: 'gap-[4px]',
  lg: 'gap-[4px]',
}

interface LoadingDotsProps {
  size?: DotSize
}

export function LoadingDots({ size = 'md' }: LoadingDotsProps) {
  return (
    <span className={`inline-flex items-center ${gapClass[size]}`} aria-hidden="true">
      {([0, 1, 2] as const).map((i) => (
        <span
          key={i}
          className={`${dotSizeClass[size]} rounded-full bg-current`}
          style={{
            animation: 'bounce-dot 600ms ease-in-out infinite',
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </span>
  )
}
