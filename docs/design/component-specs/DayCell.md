# Componente: DayCell
**Feature:** calendar
**Archivo en arquitectura:** `src/features/calendar/components/DayCell.tsx`
**US de referencia:** US-001, US-002, US-003
**Descripción:** Celda individual del calendario mensual. Muestra el número de día y franjas de color para cada configuración activa (default + adicionales). Es el componente más denso de la app — gestiona múltiples estados visuales simultáneos.
**Reutilización:** No — exclusivo de `features/calendar/`.

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `isToday` | `true` \| `false` | Distintivo visual notorio en el número del día |
| `isCurrentMonth` | `true` \| `false` | Días de mes anterior/siguiente: opacidad reducida |
| `isSelected` | `true` \| `false` | Borde de selección al tocar/expandir (estado day-expanded) |
| `configs` | `DayResult[]` | Lista de resultados de cálculo por configuración |
| `overflowCount` | `number` (0+) | Cantidad de configs no visibles → badge `+N` |

### Tipo DayResult (viene del Core Engine):
```typescript
type DayResult = {
  configId: string
  configName: string
  color: string       // hex validado
  result: ShiftResult // { type: "entry" | "exit" | "on_duty" | "off_duty", time?: string }
}
```

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por | Regla |
|---|---|---|---|
| `off-duty` | Sin franja. Número del día en `text-secondary`. Fondo `surface-base`. | `result.type === "off_duty"` para todas las configs | — |
| `entry` | Franja con gradiente + hora de entrada (esquina superior derecha de la franja). | `result.type === "entry"` | D-UX-002 |
| `exit` | Franja con gradiente + hora de salida (esquina inferior derecha de la franja). | `result.type === "exit"` | D-UX-002 |
| `on-duty` | Franja con gradiente. Sin hora. | `result.type === "on_duty"` | D-UX-002 |
| `today` | Número del día en círculo de color `interactive-primary`. Texto `text-inverse`. | `isToday === true` | D-UX-003 |
| `out-of-month` | Toda la celda a `opacity-40`. Sin interacción visual | `isCurrentMonth === false` | — |
| `selected` | Borde `2px solid interactive-primary`, `ring-offset-1` | `isSelected === true` | — |
| `overflow` | Badge `+N` en esquina inferior derecha sobre el fondo de la celda | `overflowCount > 0` | D-UX-003 |
| `pre-origin` | Sin franja (antes del `cycleStartDate`). Como `off-duty` visualmente. | `date < cycleStartDate` | Arquitectura |

> El estado `today` y `entry/exit/on-duty` pueden coexistir — "hoy es día de entrada" es válido.

---

## 4. Anatomía Visual (ASCII)

### Mobile — celda con entrada + adicional (2 franjas)
```
┌────────────┐
│ 15  [HOY]  │  ← número de día + badge "HOY" (círculo azul)         [1]
│████  8:00  │  ← franja config default (color dinámico) + hora      [2]
│████ 20:00↑ │  ← franja config adicional + hora de salida           [3]
└────────────┘
  47px × 56px aprox.
```

### Mobile — celda con overflow (3+ configs)
```
┌────────────┐
│ 22          │  ← número del día                                     [1]
│████  8:00   │  ← franja default                                     [2]
│████         │  ← franja adicional-1 (en turno, sin hora)            [3]
│         +2  │  ← badge overflow esquina inferior derecha            [4]
└────────────┘
```

### Mobile — día franco (todas las configs en franco)
```
┌────────────┐
│ 23          │  ← número del día, texto: text-secondary
│             │  ← sin franjas
│             │
└────────────┘
```

### Desktop — celda expandida (≥640px, más espacio)
```
┌───────────────────┐
│ 15   ●HOY         │  ← número + distintivo hoy                      [1]
│ ████████  8:00    │  ← franja más alta, texto más visible            [2]
│ ████████          │  ← franja adicional-1 en turno                   [3]
│ ████████ 20:00↑   │  ← franja adicional-2 con salida                 [4]
│              +1   │  ← badge overflow si hay más de 3                [5]
└───────────────────┘
  ~120px × 80px aprox. en grid 7 columnas
```

### Anatomía de una franja:
```
┌──────────────────────────────────────────────────────┐
│  [gradiente: rgba(color, 0.90) → rgba(color, 0.40)]  │
│                                                 8:00 │  ← text-xs, shift-text-on-light/dark
└──────────────────────────────────────────────────────┘
  height: 14px mobile / 18px desktop
  Hora: solo si type=entry (arriba) o type=exit (abajo)
  Dirección: entry → texto en top-right; exit → texto en bottom-right
```

### Distintivo "hoy":
```
  ┌──┐
  │15│  ← número centrado en círculo de 24px Ø, bg: interactive-primary, text: text-inverse
  └──┘
     font-weight: 700, text-sm
```

### Badge overflow:
```
         +2
  ← text-xs, color: text-secondary, esquina inferior derecha, no es clickable
```

---

## 5. Diseño Responsive

| Breakpoint | Cambio |
|---|---|
| mobile (< 640px) | Celda ~47px × 56px. Máx 2 franjas visibles. Número: `text-sm`. Hora en franja: `text-xs`. Badge hoy: 24px Ø. |
| desktop (≥ 640px) | Celda más ancha y alta según grid. Máx 3 franjas visibles. Número: `text-base`. Hora en franja: `text-xs` (igual). Badge hoy: 28px Ø. |

> El componente no conoce su propio tamaño — responde al grid que lo contiene (`MonthGrid`).

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` (celda base) | `--color-surface-base` | Fondo de la celda |
| `background-color` (celda hover) | `--color-surface-elevated` | Feedback visual de tap/hover |
| `color` (número día, default) | `--color-text-primary` | |
| `color` (número día, out-of-month) | `--color-text-secondary` con `opacity-40` | |
| `color` (hora en franja, modo claro) | `--color-shift-text-on-light` | |
| `color` (hora en franja, modo oscuro) | `--color-shift-text-on-dark` | |
| `border-color` (celda selected) | `--color-interactive-primary` | |
| `border-color` (separador de celda) | `--color-border-default` | Grid line entre celdas |
| `background` (franja de turno) | `linear-gradient(to bottom, rgba(color, 0.90), rgba(color, 0.40))` | **style inline** — color viene de `config.color` |
| `background-color` (badge hoy) | `--color-interactive-primary` | |
| `color` (badge hoy) | `--color-interactive-primary-text` | `#FFFFFF` |
| `color` (badge +N) | `--color-text-secondary` | |
| `transition` (hover) | `--duration-fast ease-default` | |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <button> (es interactivo — abre day-expanded al tap)
- role: ninguno adicional (button nativo con texto accesible)
- aria-label: "Día {número}, {mes} {año}. {config}: {estado del turno}."
  Ejemplo: "Día 15 de febrero. Mi turno: entrada a las 8:00. Turno noche: en turno."
- aria-expanded: true cuando está en estado day-expanded (open)
- aria-pressed: no aplica (no es toggle permanente)

TECLADO:
- Tab: recibe foco, muestra focus ring en el borde de la celda
- Enter / Space: abre day-expanded (bottom sheet / panel lateral)
- Flechas: navegación entre celdas gestionada por MonthGrid (roving tabindex)

FOCUS:
- Focus visible: outline 2px solid --color-focus-ring, inset para no afectar layout del grid
- El focus ring debe ser visible sobre el gradiente de color de las franjas

CONTRASTE:
- Número del día: text-primary sobre surface-base → ~17:1 AAA ✓
- Hora sobre franja: shift-text-on-light (#1F2937) / shift-text-on-dark (#F9FAFB)
  → Verificar runtime con wcag-contrast.ts para colores dinámicos del usuario
- Badge "hoy": texto blanco sobre interactive-primary → ~8.6:1 AAA ✓
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| hover fondo celda | `mouseenter` / `touchstart` | `duration-fast` | `ease-default` |
| press scale | `mousedown` / `touchstart` | `duration-fast` | `ease-default` |

> El componente NO gestiona la animación de apertura del day-expanded — eso lo gestiona `BottomSheet`.

---

## 9. Notas para el Developer Agent

- **Los cálculos NO van aquí.** `DayCell` recibe resultados ya calculados. El cálculo ocurre en el store, que invoca `src/core/shift-calculator/shift-calculator.ts`. El componente es puramente presentacional.
- **Franja de gradiente:** `background: linear-gradient(to bottom, rgba(${config.color}CC, 1), rgba(${config.color}66, 1))` — donde `CC` = 0.90 alpha hex, `66` = 0.40 alpha hex. Alternativamente usar `rgba()` en JS. El gradiente se aplica via `style` inline — nunca Tailwind dinámico.
- **Validación de color:** El color hex ya viene validado desde el store (`/^#[0-9A-Fa-f]{6}$/`). `DayCell` puede confiar en el valor. No re-validar aquí.
- **Orden de franjas:** La config default ("Mi turno") siempre va primero. Las adicionales se ordenan por fecha de creación. El store entrega los resultados ya ordenados.
- **Celdas fuera del mes:** Los días del mes anterior/siguiente que aparecen para completar la grilla se muestran con `opacity-40` y no son interactivos (`pointer-events-none` o simplemente no tienen onClick).
- **Pre-origin:** Si `date < cycleStartDate`, no hay franja — visualmente idéntico a `off-duty`. El Core Engine devuelve `{ type: "off_duty" }` para estas fechas.
- **Roving tabindex:** `MonthGrid` gestiona qué celda tiene `tabIndex={0}` en un momento dado. `DayCell` recibe `tabIndex` como prop. Solo una celda tiene `tabIndex={0}` a la vez.
- **Overflow badge:** No es un botón — es informativo. No tiene `onClick`. El badge `+N` lleva al tap sobre la celda a abrir el day-expanded donde SÍ se ven todas las configs.
- **Texto hora:** Solo se muestra si `type === "entry"` (hora en franja top) o `type === "exit"` (hora en franja bottom). Para `type === "on_duty"` la franja se muestra sin texto. Para `type === "off_duty"` no hay franja.
- **timeFormat:** La hora se formatea según `config.timeFormat` — `"12h"` → `"8:00 AM"` / `"military"` → `"0800"`. Esta lógica de presentación SÍ puede ir en el componente o en un helper de presentación `src/features/calendar/utils/formatShiftTime.ts`.
