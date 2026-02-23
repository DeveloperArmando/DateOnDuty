# Componente: SearchDatePicker
**Feature:** search
**Archivo en arquitectura:** `src/features/search/components/SearchDatePicker.tsx`
**US de referencia:** US-006
**Descripción:** Selector de fecha para la pantalla `/search`. Muestra una cuadrícula mensual completa. La fecha seleccionada determina qué día se calcula. Pre-selecciona la fecha actual al montar. No tiene días deshabilitados — todas las fechas son seleccionables.
**Reutilización:** No — exclusivo de `features/search/`. Es más simple que `MonthGrid` (no tiene franjas de turno, solo selección).

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `value` | `Date` | Fecha actualmente seleccionada |
| `onChange` | `(date: Date) => void` | Callback al seleccionar una fecha |
| `firstDayOfWeek` | `"sunday"` \| `"monday"` | Orden de columnas del header |

> El estado del picker (mes visible) es local al componente — `useState`. Solo el `value` (fecha seleccionada) es controlado externamente.

---

## 3. Estados Visuales de una Celda

| Estado | Cambios visuales | Activado por |
|---|---|---|
| `default` | Número del día, texto `text-primary` | Estado base |
| `selected` | Círculo relleno `interactive-primary`, texto `text-inverse` | `date === value` |
| `today` | Subrayado o punto debajo del número | `date === hoy` + `date !== value` |
| `today-selected` | Círculo relleno (selección superpone el "hoy") | `date === hoy` + `date === value` |
| `out-of-month` | Opacidad reducida, aún seleccionable | `date` fuera del mes visible |
| `hover` | Borde circular sutil | Cursor sobre celda |

---

## 4. Anatomía Visual (ASCII)

### Mobile (360px)
```
┌──────────────────────────────────────────┐
│  ‹          Febrero 2026            ›    │  ← navegación de mes (local al picker)
├────┬────┬────┬────┬────┬────┬────┤
│ Do │ Lu │ Ma │ Mi │ Ju │ Vi │ Sa │  ← text-xs, text-secondary
├────┼────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │    │  1 │
├────┼────┼────┼────┼────┼────┼────┤
│  2 │  3 │  4 │  5 │  6 │  7 │  8 │
├────┼────┼────┼────┼────┼────┼────┤
│  9 │ 10 │ 11 │ 12 │ 13 │ 14 │[15]│  ← [15] = día seleccionado (círculo azul)
├────┼────┼────┼────┼────┼────┼────┤
│ 16 │ 17 │ 18·│ 19 │ 20 │ 21 │ 22 │  ← [18] = hoy (punto debajo, no seleccionado)
├────┼────┼────┼────┼────┼────┼────┤
│ 23 │ 24 │ 25 │ 26 │ 27 │ 28 │    │
└────┴────┴────┴────┴────┴────┴────┘
  Cada celda: ~44px × 44px (más cuadrado que DayCell — sin franjas)
  Toda la grilla: max-w-xs (320px)
```

### Celda — día seleccionado:
```
  ┌────┐
  │ ●15│  ← círculo 36px Ø centrado, bg: interactive-primary, texto: text-inverse
  └────┘
```

### Celda — hoy (no seleccionado):
```
  ┌────┐
  │  18│  ← texto normal
  │  • │  ← punto 4px, color: interactive-primary, debajo del número
  └────┘
```

### Desktop — layout de búsqueda (2 columnas)
```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  ┌─────────────────────┐   ┌──────────────────────────┐  │
│  │                     │   │  MI TURNO                 │  │
│  │  [SearchDatePicker] │   │  ████  Entrada: 08:00    │  │
│  │                     │   │                           │  │
│  │  max-w-xs           │   │  ADICIONALES ACTIVAS (1)  │  │
│  │                     │   │  ████  En turno           │  │
│  └─────────────────────┘   └──────────────────────────┘  │
│                                                           │
│  [Ver 15 feb en el calendario →]                          │  ← sticky bottom
└───────────────────────────────────────────────────────────┘
```

---

## 5. Diseño Responsive

| Breakpoint | Cambio |
|---|---|
| mobile (< 1024px) | Single column. Picker arriba, resultado debajo. |
| desktop (≥ 1024px) | Two columns. Picker izquierda (max-w-xs), resultado derecha (flex-1). |

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` (celda selected) | `--color-interactive-primary` | Círculo de selección |
| `color` (número en celda selected) | `--color-interactive-primary-text` | `#FFFFFF` |
| `background-color` (celda hover) | `--color-surface-elevated` | Sutil |
| `border-radius` (celda selected / hover) | `50%` | Circular |
| `color` (número celda default) | `--color-text-primary` | |
| `color` (número celda out-of-month) | `--color-text-secondary` con `opacity-50` | |
| `color` (header días semana) | `--color-text-secondary` | text-xs |
| `background-color` (punto "hoy") | `--color-interactive-primary` | Punto 4px Ø |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <div role="grid" aria-label="Seleccionar fecha">
- Header mes: <div aria-live="polite"> para anunciar cambio de mes
- Celdas: <button role="gridcell" aria-label="15 de febrero de 2026" aria-pressed={isSelected} aria-current={isToday ? "date" : undefined}>
- Botones ‹ ›: aria-label="Mes anterior" / "Mes siguiente"

TECLADO:
- Tab: llega a la grilla
- Flechas: navegan entre celdas (roving tabindex)
- PageUp/PageDown: mes anterior/siguiente
- Enter/Space: selecciona la fecha con foco
- Home/End: primer/último día del mes visible

FOCUS:
- Roving tabindex: solo la celda del día seleccionado (o hoy si no hay selección) tiene tabIndex=0
- Al cambiar de mes: foco se mueve al mismo número de día si existe, o al 1 del nuevo mes

CONTRASTE:
- Número seleccionado: texto blanco sobre interactive-primary → ~8.6:1 AAA ✓
- Número default: text-primary sobre surface-base → ~17:1 AAA ✓
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Slide de mes (igual que MonthGrid) | Botones ‹ › | `duration-normal` (250ms) | `ease-in-out` |
| Ripple de selección (opcional) | Click en celda | `duration-fast` | `ease-out` |

> El slide de mes es local al picker — NO sincronizado con el MonthGrid de la pantalla `/`. Son componentes independientes.

---

## 9. Notas para el Developer Agent

- **Estado local del picker:** El mes visible (`pickerViewDate`) es `useState` local — no va al `ui-store`. Solo el `value` (fecha seleccionada) se eleva al parent.
- **Pre-selección al montar:** El parent (`SearchPage`) inicializa `value` con `new Date()` — hoy. El picker comienza mostrando el mes de hoy con hoy seleccionado.
- **No hay días deshabilitados:** A diferencia de muchos date pickers, este acepta cualquier fecha — incluyendo fechas antes del `cycleStartDate`. El Core Engine devuelve `off_duty` para esas fechas, que es un resultado válido.
- **Out-of-month seleccionable:** Los días del mes anterior/siguiente son seleccionables. Al seleccionar uno, el picker navega automáticamente al mes de esa fecha (`setPickerViewDate(selectedDate)`).
- **Sin integración con gestos:** A diferencia de `MonthGrid`, este componente NO tiene swipe gesture — es un picker de formulario, no la vista principal. La navegación es solo con botones ‹ ›.
- **Sincronización con MonthGrid:** El botón "Ver [fecha] en el calendario" llama a `uiStore.setViewDate(value)` y luego `navigate("/")`. El picker no actualiza directamente el calendario.
- **Este componente NO calcula turnos:** Solo selecciona una fecha. El cálculo lo hace el parent (`SearchPage`) via hook `useShiftResults(value, configs)` que invoca el Core Engine.
