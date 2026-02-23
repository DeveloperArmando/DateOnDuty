/**
 * RG-004: Hace scroll al primer elemento con data-error="true".
 * Llamar después de validar un formulario para que el usuario vea el primer error.
 */
export function scrollToFirstError(): void {
  const el = document.querySelector('[data-error="true"]')
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
