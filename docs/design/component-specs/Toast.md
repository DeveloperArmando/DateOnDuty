# Componente: Toast
**Feature:** shared
**Archivo en arquitectura:** `src/shared/components/Toast.tsx`
**US de referencia:** US-004, US-005 (confirmación de guardado de config)
**Descripción:** Notificación flotante no intrusiva que aparece brevemente para confirmar una acción completada. Auto-desaparece después de 2 segundos. No requiere interacción del usuario.
**Reutilización:** Sí — `src/shared/`. Usado por `ShiftConfigForm` al guardar exitosamente.

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `variant` | `success` \| `info` \| `warning` \| `error` | Color de borde izquierdo e ícono (ver anatomía) |
| `message` | `string` | Texto del toast (siempre via `t()`) |
| `duration` | `number` (ms) | Auto-dismiss timer. Default: `2000ms` |

> En MVP solo se usa `variant=success` con `duration=2000`. Las demás variantes están especificadas para consistencia futura.

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por |
|---|---|---|
| `entering` | Slide-in desde abajo + fade-in | Al montar el componente |
| `visible` | Posición final, opacidad 1 | Tras `entering` |
| `leaving` | Fade-out + slide-down | Al cumplirse `duration` ms |
| `gone` | Componente desmontado | Tras `leaving` |

---

## 4. Anatomía Visual (ASCII)

### variant=success (el único usado en MVP)
```
                      ┌─────────────────────────────┐
                      │ ✓  Turno guardado           │  ← borde izq: feedback-success
                      └─────────────────────────────┘
                            ↑
              esquina inferior derecha de la pantalla
              margin: 16px desde el borde
              max-width: 320px
              min-width: 200px
```

### Estructura interna:
```
┌──────────────────────────────────────┐
│ ║  [CheckCircle 18px]  Texto aquí   │
└──────────────────────────────────────┘
  ║ = borde izquierdo 3px sólido
  padding: 12px 16px
  gap entre ícono y texto: 8px
  bg: surface-elevated
  shadow: shadow-md
  border-radius: radius-md
```

### Iconos por variant:
| variant | Icono lucide-react | Color de borde + ícono |
|---|---|---|
| `success` | `CheckCircle` | `--color-feedback-success` |
| `info` | `Info` | `--color-feedback-info` |
| `warning` | `AlertTriangle` | `--color-feedback-warning` |
| `error` | `XCircle` | `--color-feedback-error` |

---

## 5. Diseño Responsive

| Breakpoint | Cambio |
|---|---|
| mobile (< 640px) | `width: calc(100% - 32px)`, centrado horizontalmente, esquina inferior |
| desktop (≥ 640px) | `max-width: 320px`, alineado a la derecha, esquina inferior derecha |

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` | `--color-surface-elevated` | |
| `color` (texto) | `--color-text-primary` | |
| `border-left` | `3px solid --color-feedback-{variant}` | Color según variant |
| `border-radius` | `--radius-md` | |
| `box-shadow` | `--shadow-md` | Elevación sobre el resto |
| `color` (ícono) | `--color-feedback-{variant}` | Mismo que borde |

### Posicionamiento:
| Propiedad | Valor |
|---|---|
| `position` | `fixed` |
| `bottom` | `16px` |
| `right` | `16px` (desktop) / `50%` centrado (mobile) |
| `z-index` | Token `z-toast` (ver nota en dev) |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <div role="status" aria-live="polite" aria-atomic="true">
- role="status": anuncia el mensaje a lectores de pantalla sin interrumpir la lectura actual
- aria-live="polite": se anuncia cuando el lector termine de leer lo actual
- aria-atomic="true": lee el mensaje completo, no solo los cambios

TECLADO:
- No es focusable ni interactivo (no hay botón de cerrar)
- No interfiere con la navegación por teclado

CONTRASTE:
- Texto text-primary sobre surface-elevated → ~17:1 AAA ✓
- Ícono feedback-success (#15803D) sobre surface-elevated → ~5.1:1 AA ✓
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Entrada (slide-up + fade) | Mount | `duration-normal` (250ms) | `ease-out` |
| Salida (fade-out) | Auto-dismiss timer | `duration-normal` (250ms) | `ease-in` |

```css
@keyframes toast-enter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes toast-leave {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .toast { animation: none; }
}
```

---

## 9. Notas para el Developer Agent

- **Portal:** El Toast se renderiza en un React Portal (`document.body`) para evitar problemas de `z-index` y `overflow:hidden`.
- **Timer con cleanup:** `useEffect(() => { const id = setTimeout(onDismiss, duration); return () => clearTimeout(id); }, [])`. Sin cleanup, el toast puede intentar actualizar estado en un componente ya desmontado.
- **Unmount con animación:** El toast debe completar la animación de salida antes de desmontarse. Patrón sugerido: estado `leaving → setTimeout(250ms) → onDismiss()`.
- **z-index:** Debe estar por encima de modales (`z-50`) y bottom sheets (`z-40`). Sugerencia: `z-[60]`. Documentar en el design system como token `z-toast`.
- **Cola de toasts:** En MVP solo hay un toast a la vez (solo se usa en guardado de config). No implementar una cola de toasts multi-elemento.
- **No hay botón de cerrar:** Por diseño. El mensaje es breve (2s) y no requiere confirmación del usuario.
- **Instanciación:** El consumer (ShiftConfigForm) lo monta condicionalmente: `{showToast && <Toast message={t('config.saved')} variant="success" onDismiss={() => setShowToast(false)} />}`.
