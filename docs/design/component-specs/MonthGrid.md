# Componente: MonthGrid
**Feature:** calendar
**Archivo en arquitectura:** `src/features/calendar/components/MonthGrid.tsx`
**US de referencia:** US-001, US-002, US-003
**Descripción:** Cuadrícula de 7 columnas que renderiza todas las celdas de un mes. Gestiona la navegación entre meses (swipe + botones), el header de días de la semana, y el roving tabindex para accesibilidad. Es el componente contenedor principal de la vista calendario.
**Reutilización:** No — exclusivo de `features/calendar/`.

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `viewDate` | `Date` | Mes y año a mostrar (primer día del mes) |
| `selectedDate` | `Date \| null` | Día actualmente seleccionado / expandido |
| `firstDayOfWeek` | `"sunday"` \| `"monday"` | Ordena las columnas del header y la grilla |
| `configs` | `ShiftConfiguration[]` | Configs activas a calcular |

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por |
|---|---|---|
| `idle` | Grilla completa del mes actual, sin animación | Estado normal |
| `navigating-next` | Mes actual desliza hacia la izquierda, mes siguiente entra por la derecha | Swipe left / botón `›` |
| `navigating-prev` | Mes actual desliza hacia la derecha, mes anterior entra por la izquierda | Swipe right / botón `‹` |
| `loading-cells` | Las celdas muestran un esqueleto muy ligero mientras el Core Engine calcula (si hay delay perceptible) | Cambio de `viewDate` |

> En la práctica, el cálculo es O(1) síncrono — el estado `loading-cells` puede no ser necesario en MVP. Documentado por si el mes tiene 35-42 celdas con múltiples configs y hay lag perceptible en dispositivos lentos.

---

## 4. Anatomía Visual (ASCII)

### Mobile (360px) — mes completo
```
┌────────────────────────────────────────────┐
│  ‹   Febrero 2026                      ›  │  ← MonthHeader: botones + nombre mes
├────────────────────────────────────────────┤
│  Dom  Lun  Mar  Mié  Jue  Vie  Sáb        │  ← WeekDayHeader: 7 columnas, text-xs
├───┬───┬───┬───┬───┬───┬───┤
│   │   │   │   │   │   │ 1 │  ← fila 1 (días del mes anterior grises)
├───┼───┼───┼───┼───┼───┼───┤
│ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │  ← DayCell ×7
├───┼───┼───┼───┼───┼───┼───┤
│ 9 │10 │11 │12 │13 │14 │15 │
├───┼───┼───┼───┼───┼───┼───┤
│16 │17 │18 │19 │20 │21 │22 │
├───┼───┼───┼───┼───┼───┼───┤
│23 │24 │25 │26 │27 │28 │   │  ← último día, resto grises
└───┴───┴───┴───┴───┴───┴───┘
  total: 28-35 celdas (4-5 filas completas)
  ancho total: 100%
  cada celda: calc(100% / 7) × altura fija (56px mobile)
```

### Desktop (≥ 640px)
```
┌──────────────────────────────────────────────────────────────┐
│  ‹        Febrero 2026                                   ›   │
├──────────────────────────────────────────────────────────────┤
│  Dom     Lun     Mar     Mié     Jue     Vie     Sáb         │
├────────┬────────┬────────┬────────┬────────┬────────┬────────┤
│        │        │        │        │        │        │   1    │
│ [Dcell]│ [Dcell]│ [Dcell]│ [Dcell]│ [Dcell]│ [Dcell]│ [Dcell]│
├────────┼────────┼────────┼────────┼────────┼────────┼────────┤
  ...
  cada celda: ~120px × 80px aprox.
```

### MonthHeader (sub-componente interno):
```
  ┌──────────────────────────────────────────────┐
  │  [ChevronLeft]  Febrero 2026  [ChevronRight] │
  └──────────────────────────────────────────────┘
     botón ghost      text-2xl        botón ghost
                     font-bold
                     text-primary
```

---

## 5. Diseño Responsive

| Breakpoint | Cambio |
|---|---|
| mobile (< 640px) | Celdas: calc(100%/7) ancho, 56px alto. Texto xs en celdas. Swipe gesture activo. |
| desktop (≥ 640px) | Celdas más anchas y altas (~80px). Swipe desactivado. Botones ‹ › siempre visibles. |

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` (grilla) | `--color-surface-base` | |
| `color` (header días semana) | `--color-text-secondary` | Dom, Lun... |
| `border-color` (líneas separadoras de celda) | `--color-border-default` | Grid lines — configurable via `gridLineColor` en `AppPreferences` |
| `color` (nombre del mes) | `--color-text-primary` | |
| `color` (botones ‹ ›) | `--color-interactive-secondary-text` | |
| `transition` (navegación de mes) | `--duration-normal ease-default` | Slide animation |

### Grid lines:
El `gridLineColor` en `AppPreferences` permite al usuario cambiar el color de las líneas divisoras del calendario. Solo afecta a `border-color` de las celdas, nunca al fondo. Valor default: `border-default`. El color adicional se aplica via `style inline` si el usuario eligió un color personalizado.

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base de la grilla: <div role="grid" aria-label="Calendario de febrero 2026">
  (No usar <table> — no es datos tabulares, es una grilla de navegación)
- Filas: <div role="row">
- Celdas: <div role="gridcell"> → contiene el <button> DayCell
- Header días semana: <div role="columnheader" aria-label="Domingo"> (columna)
- MonthHeader botones: <button aria-label="Mes anterior"> / <button aria-label="Mes siguiente">

TECLADO:
- Tab: llega a la grilla, luego flechas la navegan (roving tabindex)
- Flechas Left/Right: navegan días anterior/siguiente
- Flechas Up/Down: navegan semana anterior/siguiente (7 días)
- PageUp/PageDown: mes anterior/siguiente
- Home/End: primer/último día del mes
- Enter/Space: abre day-expanded del día con foco
- Escape: desde day-expanded, cierra el panel (vuelve foco a la celda)

FOCUS:
- Roving tabindex: solo UNA celda tiene tabIndex=0 en la grilla a la vez
- Al cambiar de mes con flechas: el foco se mueve al mismo número de día si existe, o al último día del nuevo mes
- Al cambiar de mes con botones ‹ ›: el foco va al día 1 del nuevo mes

CONTRASTE:
- Días de semana (header): text-secondary sobre surface-base → ~7.2:1 AA ✓
- Nombre del mes: text-primary sobre surface-base → ~17:1 AAA ✓
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Slide-out izq. (mes actual) + slide-in der. (mes sig.) | Swipe left / botón › | `duration-normal` (250ms) | `ease-in-out` |
| Slide-out der. (mes actual) + slide-in izq. (mes ant.) | Swipe right / botón ‹ | `duration-normal` (250ms) | `ease-in-out` |

```css
/* Técnica: contenedor overflow-hidden + dos grillas absolutas */
.month-grid-container { position: relative; overflow: hidden; }
.month-grid-current   { position: absolute; transition: transform duration-normal; }
.month-grid-incoming  { position: absolute; transition: transform duration-normal; }

/* Navegando a siguiente mes: */
.month-grid-current  { transform: translateX(-100%); }
.month-grid-incoming { transform: translateX(0); /* viene de translateX(100%) */ }

@media (prefers-reduced-motion: reduce) {
  .month-grid-current, .month-grid-incoming { transition: none; }
}
```

---

## 9. Notas para el Developer Agent

- **El cálculo de turnos ocurre FUERA de este componente.** `MonthGrid` recibe una función `getResultsForDate(date: Date): DayResult[]` del hook `useCalendar` — que internamente llama al Core Engine via el store. El componente no importa nada de `src/core/`.
- **Celdas fuera del mes:** Para completar la grilla de 35 celdas (5 filas × 7), se agregan días del mes anterior y siguiente con `isCurrentMonth=false`. Estas celdas son visibles pero con opacidad reducida y no son interactivas.
- **Número de filas:** Febrero puede tener 4 filas (28 días + alineación exacta). La mayoría de meses tienen 5 filas. Algunos meses tienen 6 filas (ej: octubre 2023 que empieza en domingo). El layout debe ser flexible en altura de fila, no fijo.
- **`firstDayOfWeek`:** Viene de `themeStore.preferences.firstDayOfWeek`. Si es `"monday"`, reordenar columnas: Lun-Mar-Mié-Jue-Vie-Sáb-Dom. Afecta el cálculo de qué posición ocupa cada día en la fila.
- **Gesture config:** `useDrag({ axis: 'x', threshold: 50, velocity: 0.3 })` — solo eje horizontal. El swipe vertical NO cambia de mes (ese gesto está reservado para scroll de página o el onboarding).
- **Estado `viewDate` en ui-store:** El mes visible está en `ui-store.viewDate`. Al navegar con botones o swipe, se llama `uiStore.setViewDate(newDate)`. El componente es controlado por el store, no mantiene su propio estado de mes.
- **`gridLineColor` personalizado:** Si el usuario eligió un `gridLineColor` diferente al default, se aplica via `style={{ borderColor: gridLineColor }}` en las celdas. El developer debe validar el hex antes de aplicar: `/^#[0-9A-Fa-f]{6}$/`.
