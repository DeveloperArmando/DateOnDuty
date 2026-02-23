# Componente: BottomSheet
**Feature:** shared
**Archivo en arquitectura:** `src/shared/components/BottomSheet.tsx`
**US de referencia:** US-002 (day-expanded), HO wireframe (help overlay panel)
**Descripción:** Panel deslizable desde la parte inferior de la pantalla en mobile. Actúa como contenedor de contenido secundario que requiere overlay. En desktop se convierte en panel lateral derecho o modal centrado según el contexto.
**Reutilización:** Sí — `src/shared/`. Usado por: `DayExpandedPanel`, `HelpLegendPanel`.

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `size` | `sm` \| `md` \| `lg` \| `full` | Altura máxima del panel en mobile (25% / 50% / 75% / 100vh) |
| `hasHandle` | `true` \| `false` | Muestra la pastilla de arrastre en el top del panel |
| `hasOverlay` | `true` \| `false` | Oscurece el contenido detrás del panel |
| `isOpen` | `true` \| `false` | Controla visibilidad y animación |

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por | Regla |
|---|---|---|---|
| `closed` | Panel fuera de la vista (`translateY: 100%`). Overlay invisible. | `isOpen={false}` | — |
| `opening` | Panel desliza hacia arriba (`translateY: 0`). Overlay hace fade-in. | `isOpen` cambia a `true` | — |
| `open` | Panel visible en posición final. Overlay visible. | `isOpen={true}` estable | — |
| `closing` | Panel desliza hacia abajo. Overlay hace fade-out. | `isOpen` cambia a `false` | — |
| `dragging` | Panel sigue el gesto de arrastre en tiempo real. | `useDrag` hook activo | `@use-gesture/react` |

---

## 4. Anatomía Visual (ASCII)

### Mobile — open, size=md (50% de la pantalla)
```
┌──────────────────────────────────┐  ← overlay: rgba(0,0,0,0.45)
│                                  │
│         [contenido               │
│          del calendario          │
│          o pantalla base]        │
├──────────────────────────────────┤  ← handle de arrastre
│          ─────                   │  ← pastilla handle: 32px × 4px, radius-full
│                                  │  ← surface-elevated, shadow-lg
│   [slot: children]               │  ← contenido dinámico
│                                  │
│                                  │
└──────────────────────────────────┘
  max-height: 50vh, min-height: 120px
  border-radius: radius-xl en top-left + top-right solamente
```

### Desktop (≥ 1024px) — panel lateral derecho
```
┌─────────────────────────┬──────────────────┐
│                         │  ─────           │  ← sin handle, sin overlay oscuro
│   [contenido principal] │  [children]      │
│                         │                  │
│                         │                  │
└─────────────────────────┴──────────────────┘
  width fijo: 320px | border-left: border-default | height: 100%
```

---

## 5. Diseño Responsive

| Breakpoint | Cambio |
|---|---|
| mobile (< 1024px) | Bottom sheet — desliza desde abajo. Overlay oscuro. Handle de arrastre visible. |
| desktop (≥ 1024px) | Panel lateral derecho fijo. Sin animación de slide. Sin overlay. Sin handle. Border-left divide el layout. |

> El cambio de bottom sheet a panel lateral lo gestiona el componente internamente con una media query (o `useMediaQuery` hook). El consumer solo pasa `isOpen` y `children`.

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` | `--color-surface-elevated` | Panel |
| `background-color` (overlay) | `--color-surface-overlay` | `rgba(0,0,0,0.45)` claro / `0.70` oscuro |
| `border-radius` (top) | `--radius-xl` | Solo esquinas superiores en mobile |
| `box-shadow` | `--shadow-lg` | Elevación sobre el contenido |
| `border-left` | `1px solid --color-border-default` | Solo en desktop |
| `transition` (panel slide) | `--duration-normal ease-default` | 250ms |
| `transition` (overlay fade) | `--duration-normal ease-default` | |

### Handle:
| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` | `--color-border-strong` | Pastilla visible pero no prominente |
| `width` | `32px` | |
| `height` | `4px` | |
| `border-radius` | `--radius-full` | |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <div role="dialog"> (cuando hasOverlay=true) o <aside> (panel complementario)
- aria-modal="true": cuando es dialog con overlay
- aria-label o aria-labelledby: el consumer debe pasar el título del panel
- aria-hidden="true": cuando está cerrado, para excluirlo del árbol accesible

TECLADO:
- Escape: cierra el bottom sheet (cuando isOpen=true y hasOverlay=true)
- Tab: navega dentro del panel mientras está abierto
- Focus trap: SOLO cuando hasOverlay=true (el foco no debe salir al contenido de fondo)

FOCUS:
- Al abrir: el foco se mueve al primer elemento interactivo dentro del panel
- Al cerrar: el foco regresa al elemento que triggereó la apertura
- Focus trap: implementar con lista de elementos focusables dentro del panel

GESTOS:
- Handle de arrastre: también funciona con teclado — Up/Down arrows para resize
- Umbral de cierre por arrastre: 150px hacia abajo ó velocidad > 0.5
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Panel slide-up (open) | `isOpen` true | `duration-normal` (250ms) | `ease-out` |
| Panel slide-down (close) | `isOpen` false | `duration-normal` (250ms) | `ease-in` |
| Overlay fade-in | Con panel slide-up | `duration-normal` | `ease-default` |
| Overlay fade-out | Con panel slide-down | `duration-normal` | `ease-default` |
| Drag live | Gesto activo (`useDrag`) | — (tiempo real) | Sin easing |
| Snap-back (si drag cancelado) | Suelta sin superar umbral | `duration-fast` (150ms) | `ease-out` |

```css
/* @media (prefers-reduced-motion: reduce) */
/* Eliminar transición — aparición/desaparición instantánea */
.bottom-sheet { transition: none; }
.bottom-sheet-overlay { transition: none; }
```

---

## 9. Notas para el Developer Agent

- **@use-gesture/react `useDrag`:** Implementar arrastre para cerrar. Umbral: 150px desplazamiento hacia abajo O velocidad > 0.5. Al superar el umbral, llamar `onClose()`. Si no supera, snap-back animado a la posición original.
- **CSS transform vs height:** Usar `transform: translateY()` para la animación — NO animar `height`. `transform` corre en el compositor gráfico (60fps), `height` fuerza reflow.
- **Portal:** El BottomSheet se renderiza en un React Portal (`document.body`) para evitar problemas de `z-index` y `overflow:hidden` en ancestros. Usar `createPortal`.
- **Desktop sin gesture:** En breakpoint desktop (`≥ 1024px`), `useDrag` se desactiva. El panel lateral no es arrastrable.
- **onClose callback:** El componente llama `onClose` cuando detecta: Escape presionado, tap en overlay, o drag superó umbral. El consumer es responsable de actualizar `isOpen`.
- **Scroll interno:** Cuando el contenido del panel es más alto que `max-height`, el panel debe hacer scroll internamente (`overflow-y: auto`). El scroll del fondo debe estar bloqueado (`overflow: hidden` en `<body>`) mientras el panel esté abierto con overlay.
- **Unmount vs hide:** El componente debe usar `display:none` + `visibility:hidden` cuando está cerrado (no unmount inmediato) para evitar perder estado del contenido durante la animación de cierre. Unmount completo solo después de que la animación termine.
