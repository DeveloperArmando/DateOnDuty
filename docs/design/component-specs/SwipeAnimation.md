# Componente: SwipeAnimation
**Feature:** onboarding
**Archivo en arquitectura:** `src/features/onboarding/components/SwipeAnimation.tsx`
**US de referencia:** US-009, US-011
**Descripción:** Card flotante de onboarding que enseña al usuario los gestos de navegación del calendario (swipe vertical para meses, swipe horizontal para años). Aparece simultáneamente con el ConfigBanner. Dura 8 segundos y desaparece con fade-out. No es interactivo — no bloquea el calendario.
**Reutilización:** No — exclusivo de `features/onboarding/`.

---

## 2. Variantes y Props Visuales

> Sin variantes. El componente siempre tiene la misma apariencia. No recibe props de contenido — todos los textos y configuraciones son internos.

| Prop visual | Valores | Efecto |
|---|---|---|
| `onComplete` | callback | Se llama cuando termina la animación (8s), para desmontar el componente |

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por |
|---|---|---|
| `entering` | Fade-in + scale 0.95 → 1 | Mount |
| `phase-vertical` | Cursor animado eje vertical (0s–2s) | Inicio de la animación |
| `phase-pause-1` | Cursor detenido (2s–2.5s) | — |
| `phase-horizontal` | Cursor animado eje horizontal (2.5s–4.5s) | — |
| `phase-pause-2` | Cursor detenido (4.5s–5s) | — |
| `phase-vertical-2` | Cursor animado eje vertical de nuevo (5s–7s) | — |
| `phase-pause-3` | Cursor detenido (7s–7.5s) | — |
| `leaving` | Fade-out del card completo (7.5s–8s) | Timer |
| `gone` | Desmontado | Tras fade-out, llama `onComplete()` |
| `reduced-motion` | Card estático sin cursor. Texto estático. Desaparece a 8s sin transición. | `prefers-reduced-motion` |

---

## 4. Anatomía Visual (ASCII)

### Card flotante — 240px × 88px
```
     ┌────────────────────────────────────────┐
     │   [▲]      meses      [▼]    •→       │  ← fila 1: eje vertical
     │   [◄]      años       [►]    ←•       │  ← fila 2: eje horizontal
     └────────────────────────────────────────┘
          ↑ ChevronUp          ↑ cursor animado (dot 8px)
```

### Detalle de posición:
```
  position: fixed
  left: 50%
  top: 50%   ← centrado en el área del calendario (no en toda la pantalla)
  transform: translateX(-50%) translateY(-50%)
  z-index: z-[15]  ← encima del calendario, debajo del ConfigBanner
```

### Cursor (pseudo-cursor):
```
  ●   ← círculo sólido 8px Ø, color: interactive-primary

  Durante fase vertical:
    ↑ viaja de [▲] hacia [▼] (top: 0 → calc(100% - 8px))

  Durante fase horizontal:
    → viaja de [◄] hacia [►] (left: 0 → calc(100% - 8px))
```

### Estructura interna del card:
```
┌────────────────────────────────────────────────┐
│  bg: surface-elevated, shadow-md, radius-lg    │
│  padding: 16px 20px                            │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │ [ChevronUp 18px] texto [ChevronDown 18px]│  │  ← fila vertical
│  │      gap: 8px      font-sm text-secondary │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │[ChevronLeft 18px] texto [ChevronRight 18px]│  ← fila horizontal
│  └──────────────────────────────────────────┘  │
│     gap entre filas: 12px                      │
└────────────────────────────────────────────────┘
```

---

## 5. Diseño Responsive

> Responsive: el componente no cambia estructuralmente. Siempre 240px × 88px, centrado en el área del calendario. El card se renderiza encima de la grilla del calendario, no afecta el layout.

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` (card) | `--color-surface-elevated` | |
| `box-shadow` (card) | `--shadow-md` | Elevación sobre el calendario |
| `border-radius` (card) | `--radius-lg` | |
| `color` (iconos ChevronUp/Down/Left/Right) | `--color-text-secondary` | |
| `color` (texto "meses"/"años") | `--color-text-secondary` | `font-sm` |
| `background-color` (cursor) | `--color-interactive-primary` | Punto azul |
| `border-radius` (cursor) | `50%` | Círculo |

### CSS Keyframes:
```css
@keyframes swipe-cursor-v {
  0%   { top: 4px; }
  45%  { top: calc(100% - 8px); }
  50%  { top: calc(100% - 8px); }
  95%  { top: 4px; }
  100% { top: 4px; }
}

@keyframes swipe-cursor-h {
  0%   { left: 4px; }
  45%  { left: calc(100% - 8px); }
  50%  { left: calc(100% - 8px); }
  95%  { left: 4px; }
  100% { left: 4px; }
}

@keyframes card-fade-in {
  from { opacity: 0; transform: translateX(-50%) translateY(-50%) scale(0.95); }
  to   { opacity: 1; transform: translateX(-50%) translateY(-50%) scale(1); }
}

@keyframes card-fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .swipe-cursor { display: none; }
  .swipe-card   { animation: none; }
}
```

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <div aria-hidden="true">
  (El componente es puramente decorativo/instruccional. Los gestos siempre tienen
   alternativa de botones — el aprendizaje de gestos es opcional)
- aria-hidden="true" excluye el card del árbol accesible
- No es focusable (tabIndex=-1 o ausente)

GESTOS Y MOTION:
- prefers-reduced-motion: cursor desaparece, card estático con texto visible.
  La información (gestos disponibles) sigue siendo legible sin animación.
- El card NO bloquea la interacción con el calendario subyacente (pointer-events: none)
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Card fade-in + scale | Mount | `300ms` | `ease-out` |
| Cursor vertical (fase 1) | Inicio inmediato | `2s`, `ease-in-out` | bounce suave |
| Pausa cursor (2s–2.5s) | Tras fase vertical | `500ms` | — |
| Cursor horizontal (fase 2) | 2.5s | `2s`, `ease-in-out` | bounce suave |
| Pausa cursor (4.5s–5s) | — | `500ms` | — |
| Cursor vertical (fase 3) | 5s | `2s`, `ease-in-out` | igual |
| Pausa final (7s–7.5s) | — | `500ms` | — |
| Card fade-out | 7.5s | `500ms` | `ease-in` |

> Implementar fases con CSS animation delay para las etapas del cursor. El card completo usa `animation: card-fade-out 500ms ease-in forwards` aplicado via `setState` a los 7.5s.

---

## 9. Notas para el Developer Agent

- **pointer-events: none:** El card flotante tiene `pointer-events: none` — el usuario puede tocar y hacer gestos en el calendario a través del card sin problema.
- **Timer de 8s:** `useEffect(() => { const id = setTimeout(() => { setLeaving(true); setTimeout(onComplete, 500); }, 7500); return () => clearTimeout(id); }, [])`. El cleanup previene bugs si el componente se desmonta antes.
- **NO bloquea el calendario:** Esto es fundamental. El onboarding es no-intrusivo por diseño. El usuario puede empezar a usar la app inmediatamente mientras el card está visible.
- **Cursor implementación:** El cursor es un `<div>` con `position: absolute` dentro de un contenedor relativo (área del card). Las animaciones CSS mueven el cursor via `top` / `left`. El contenedor es invisible y sirve solo como referencia de posicionamiento.
- **Flag `animationSeen`:** El flag `dod-onboarding.animationSeen` NO se gestiona en este componente — lo gestiona el parent (la feature de onboarding). Este componente solo llama `onComplete()` al terminar.
- **Relación con ConfigBanner:** Los dos componentes son independientes — no se comunican entre sí. El parent los monta ambos simultáneamente cuando `bannerSeen=false`.
