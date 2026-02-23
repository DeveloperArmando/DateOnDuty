# Componente: HelpOverlay
**Feature:** calendar
**Archivo en arquitectura:** `src/features/calendar/components/HelpOverlay.tsx`
**US de referencia:** US-009 (ayuda contextual)
**Descripción:** Sistema de ayuda contextual para la pantalla del calendario (`/`). Al activarse, superpone badges numerados sobre los elementos de la UI y muestra un panel/sidebar con las descripciones. El botón [?] convierte en [✕] mientras está activo.
**Reutilización:** No — exclusivo de `features/calendar/` en MVP (ver issue HO-001).

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `isOpen` | `true` \| `false` | Activa/desactiva el overlay completo |
| `calendarState` | `"current-month"` \| `"other-month"` | Determina qué badges se muestran (⑨ solo en otro mes) |
| `hasActiveFranjas` | `boolean` | Badge ⑥ solo si hay configs activas en el calendario |
| `hasOverflowBadge` | `boolean` | Badge ⑦ solo si hay días con `+N` |

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por |
|---|---|---|
| `closed` | Sin overlay. Botón [?] visible en AppBar. | `isOpen={false}` |
| `opening` | Overlay fade-in. Badges aparecen con stagger. Panel desliza desde abajo (mobile). | `isOpen` → true |
| `open` | Overlay visible. Badges numerados sobre UI. Panel de leyenda visible. | `isOpen={true}` |
| `closing` | Fade-out del overlay y badges. Panel cierra. | `isOpen` → false |

---

## 4. Anatomía Visual (ASCII)

### Mobile — estado open (mes actual, con franjas activas)
```
┌──────────────────────────────────────────────┐
│ ①DateOnDuty    ②Febrero 2026      ③[?→✕]   │  ← AppBar con badges, botón cambia
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  [overlay rgba(0,0,0,0.60) sobre todo]       │
│                                              │
│   Dom  Lun  Mar  Mié  Jue  Vie  Sáb  ④      │  ← badge en header de días
│  ┌──┬──┬──┬──┬──┬──┬──┐                     │
│  │  │⑤│  │  │  │  │  │                     │  ← badge ⑤ en celda sample
│  │  │██│  │  │  │  │  │  ⑥                  │  ← badge ⑥ en franja de turno
│  │  │+2│  │  │  │  │  │  ⑦                  │  ← badge ⑦ en badge +N
│  └──┴──┴──┴──┴──┴──┴──┘                     │
│                                    ⑧         │  ← badge ⑧ en área de gestos
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  AYUDA — ¿Qué ves en el calendario?  [✕]    │  ← panel inferior: BottomSheet
│  ① DateOnDuty — Toca para ir al mes actual  │
│  ② Mes y año actual                         │
│  ③ Cerrar esta ayuda                        │
│  ④ Días de la semana (D/L configurable)     │
│  ⑤ Toca un día para ver detalles           │
│  ⑥ Franja de color = turno activo          │
│  ⑦ +N = más turnos activos ese día         │
│  ⑧ Desliza ↕ para cambiar mes              │
└──────────────────────────────────────────────┘
```

### Badge numerado individual:
```
  ┌──┐
  │ ① │  ← círculo 20px Ø, bg: interactive-primary, texto: text-inverse
  └──┘    font-xs, font-bold, posicionado absolute sobre el elemento
```

### Desktop — sidebar
```
┌─────────────────────────────────┬───────────────┐
│   [overlay sobre el calendario] │ AYUDA         │  ← panel lateral fijo 280px
│                                 │ ① ...         │
│   ① ② ③ ④ badges en AppBar    │ ② ...         │
│   ⑤ ⑥ ⑦ badges en grilla     │ ③ ...         │
│   ⑧ en zona de gestos          │ ④ ...         │
│                                 │ ⑤ ...         │
│                                 │ ⑥ ...         │
│                                 │ ⑦ ...         │
│                                 │ ⑧ ...         │
│                                 │               │
│                                 │ [Cerrar ayuda]│
└─────────────────────────────────┴───────────────┘
```

---

## 5. Diseño Responsive

| Breakpoint | Cambio |
|---|---|
| mobile (< 1024px) | Panel leyenda: BottomSheet desde abajo, height sm/md. Overlay oscurece el calendario pero NO el AppBar ni el panel. |
| desktop (≥ 1024px) | Panel leyenda: sidebar derecho fijo, width 280px. El overlay solo cubre la grilla del calendario. |

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` (overlay) | `rgba(0,0,0,0.60)` | Más oscuro que surface-overlay estándar para que los badges destaquen |
| `background-color` (badge) | `--color-interactive-primary` | |
| `color` (número en badge) | `--color-interactive-primary-text` | `#FFFFFF` |
| `background-color` (panel leyenda) | `--color-surface-elevated` | |
| `color` (texto leyenda) | `--color-text-primary` | |
| `color` (número en leyenda) | `--color-interactive-primary` | Coincide con badge |
| `border-left` (sidebar desktop) | `1px solid --color-border-default` | |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Overlay: <div role="dialog" aria-modal="true" aria-label="Ayuda del calendario">
- Panel: <section aria-label="Leyenda de elementos">
- Botón [?]: <button aria-expanded={isOpen} aria-controls="help-panel" aria-label="Abrir ayuda">
- Botón [✕]: aria-label="Cerrar ayuda" (mismo elemento, cambia cuando isOpen=true)
- Lista de leyenda: <ol> con <li> por cada item

TECLADO:
- Escape: cierra el overlay
- Tab: navega dentro del panel de leyenda (los badges sobre el calendario no son focusables)
- Focus trap: el foco queda atrapado en el panel mientras el overlay está abierto
- Al cerrar: foco regresa al botón [?]

FOCUS:
- Al abrir: foco va al botón [✕] del panel
- Los badges numerados tienen aria-hidden="true" (decorativos — la info está en el panel)

CONTRASTE:
- Número en badge: blanco sobre interactive-primary → ~8.6:1 AAA ✓
- Texto leyenda: text-primary sobre surface-elevated → ~17:1 AAA ✓
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Overlay fade-in | `isOpen` → true | `duration-normal` (250ms) | `ease-out` |
| Badges aparecen (stagger) | Tras overlay | 50ms por badge, stagger 30ms | `ease-out` |
| Panel slide-up (mobile) | Simultáneo con overlay | `duration-normal` | `ease-out` |
| Cierre (reverse) | `isOpen` → false | `duration-fast` | `ease-in` |

```css
/* Badges con stagger via animation-delay */
.help-badge:nth-child(1) { animation-delay: 50ms; }
.help-badge:nth-child(2) { animation-delay: 80ms; }
/* ... etc */

@keyframes badge-pop {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .help-badge { animation: none; opacity: 1; }
  .help-overlay { transition: none; }
}
```

---

## 9. Notas para el Developer Agent

- **Posicionamiento de badges:** Los badges son elementos `position: absolute` dentro de un `position: relative` wrapper que rodea a cada elemento objetivo. El HelpOverlay gestiona qué wrappers tienen badge activo. Alternativa: calcular la posición del elemento con `getBoundingClientRect()` y posicionar los badges con `position: fixed`. La segunda opción es más robusta pero más compleja.
- **Los badges NO son interactivos:** `pointer-events: none`. La información está en el panel de leyenda, no en los badges.
- **Badges condicionales:**
  - ⑥ (franja) solo si `hasActiveFranjas=true`
  - ⑦ (+N badge) solo si `hasOverflowBadge=true`
  - ⑨ ("Volver a hoy") solo si `calendarState === "other-month"`
- **isOpen en ui-store:** El estado del overlay está en `uiStore.helpOverlayOpen`. No es estado local del componente.
- **Scope MVP:** Solo existe en `/`. En otras rutas, el botón [?] no aparece en el AppBar (ver issue HO-001).
- **BottomSheet vs panel propio:** Para el panel de leyenda en mobile, usar el componente `<BottomSheet>` existente como contenedor. No implementar bottom sheet custom aquí.
- **Scroll del panel:** Si el dispositivo es pequeño y hay muchos items, el panel debe ser scrollable internamente. Los badges sobre el calendario permanecen fijos — no se re-calculan al hacer scroll del panel.
