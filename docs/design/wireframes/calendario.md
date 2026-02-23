# Wireframe: Calendario Principal
**Ruta:** `/`
**US de referencia:** US-001, US-002, US-003, US-009, US-011, US-013
**Archivo de tokens:** `docs/design/design-tokens.md`
**Fecha:** Feb 2026

---

## Convenciones de este documento

```
████ ▒▒▒   → franja de turno: izquierda opacidad 0.90, derecha 0.40 (gradiente)
[●]         → indicador de color de config (dinámico, inline style)
(22)        → número de día actual (resaltado con borde)
·· ·· ··   → día sin turno (franco / fuera del rango)
E 8:00      → hora de entrada en la franja
S 8:00      → hora de salida en la franja
+N          → badge de overflow de configuraciones
~ ~ ~       → animación en curso
{VAR}       → valor calculado en runtime
⟨ ⟩         → flechas de año (lucide: ChevronLeft / ChevronRight)
∧ ∨         → flechas de mes (lucide: ChevronUp / ChevronDown)
```

---

## Estado 1: `empty` — Primera apertura (sin config previa)

**Describe:** Primera vez que el usuario abre la app. localStorage vacío. El sistema muestra el esquema 24x48 con hoy como día de entrada, 8:00 AM. Aparecen la animación de onboarding y el banner de configuración.

### Mobile — 360px

```
/* mobile — 360px */
┌────────────────────────────────────────┐
│                                        │  [1]
│ ⚙   ⟨ 2026 ⟩   ∧ FEBRERO ∨   [?][☾] │
│                                        │
├────────────────────────────────────────┤  [2]
│ ⚡ Configura tu turno para empezar  →  │
│                      desaparece en 50s │
├────────────────────────────────────────┤
│  Dom   Lun   Mar   Mié   Jue   Vie  Sáb│  [3]
├───────┬──────┬─────┬─────┬─────┬─────┬─┤
│  1    │  2   │  3  │  4  │  5  │  6  │7│  [4]
│ ████▒▒│ ░░██▒│ ··· │ ████│ ░░██│ ··· │█│
│ E8:00 │ S8:00│     │E8:00│S8:00│     │E│
├───────┼──────┼─────┼─────┼─────┼─────┼─┤
│  8    │  9   │ 10  │ 11  │ 12  │ 13  │14│
│ ░░██▒ │ ···  │████▒│░░██▒│ ··· │████▒│░│
│ S8:00 │      │E8:00│S8:00│     │E8:00│S│
├───────┼──────┼─────┼─────┼─────┼─────┼─┤
│ 15    │ 16   │ 17  │ 18  │ 19  │ 20  │21│
│ ···   │████▒▒│░░██▒│ ··· │████▒│░░██▒│·│
│       │E8:00 │S8:00│     │E8:00│S8:00│ │
├───────┼──────┼─────┼─────┼─────┼─────┼─┤
│ (22)  │ 23   │ 24  │ 25  │ 26  │ 27  │28│  [5]
│ ████▒▒│ ░░██▒│ ··· │████▒│░░██▒│ ··· │█│
│ E8:00 │ S8:00│     │E8:00│S8:00│     │E│
├───────┴──────┴─────┴─────┴─────┴─────┴─┤
│                                         │
│     ╔══════════════════════╗            │  [6]
│     ║ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ║            │
│     ║   ∧  meses  ∨        ║            │
│     ║   ⟨  años   ⟩        ║            │
│     ║        ●             ║            │
│     ╚══════════════════════╝            │
│                                         │
├─────────────────────────────────────────┤
│         [🔍  Buscar una fecha  ]        │  [7]
├─────────────────────────────────────────┤
│    Términos · Privacidad · Feedback     │  [8]
└─────────────────────────────────────────┘
```

### Anotaciones — Estado `empty`

**[1] — Top bar**
- `⚙` Icono Settings (lucide: `Settings2`). Navega a `/config`. Tap target mínimo: 44px.
- `⟨ 2026 ⟩` — flechas de año: `ChevronLeft` y `ChevronRight`. Tap ejecuta `navigateYear(±1)` en `ui-store`. El número del año se muestra en `text-base font-semibold`.
- `∧ FEBRERO ∨` — flechas de mes: `ChevronUp` y `ChevronDown`. Tap ejecuta `navigateMonth(±1)`. Nombre del mes en `text-lg font-bold uppercase tracking-wide`.
- `[?]` — Botón de ayuda. Icono lucide `HelpCircle`. Activa modo ayuda contextual (ver US-009). Siempre visible.
- `[☾]` — Toggle de tema. Icono lucide `Moon` (modo claro) / `Sun` (modo oscuro). Ejecuta `theme-store.setTheme()` de inmediato sin recargar página.
- Todo el top bar: `height: 56px`, `px-4`, `bg-surface-elevated`, `shadow-sm`, `border-b border-border-default`.

**[2] — Banner de onboarding (US-009, US-011)**
- Visible solo en primera apertura. Se lee `dod-onboarding.bannerSeen`. Si `false` → muestra banner.
- Fondo: `bg-feedback-info-surface`, borde izquierdo `4px solid interactive-primary`, `px-4 py-3`.
- Texto: "Configura tu turno para empezar" + flecha → `text-sm font-medium text-interactive-primary`.
- La flecha → (`ChevronRight`, lucide) indica que es clickeable.
- Al tap → navega a `/config`. **El click NO guarda el flag.** El flag se guarda solo cuando el timer de 50s completa.
- El banner desaparece con `opacity 1→0 + max-height auto→0` en `duration-slow` a los 50 segundos.
- El texto "desaparece en 50s" es solo anotación del wireframe — no aparece en la UI real.
- Con `prefers-reduced-motion`: desaparece instantáneamente en el segundo 50.

**[3] — Encabezado de días de la semana**
- Texto: "Dom Lun Mar Mié Jue Vie Sáb" (abreviado 3 letras). `text-xs font-semibold text-text-secondary uppercase`.
- Sticky dentro del área del calendario (no se desplaza al hacer scroll si el mes tiene 6 semanas).
- El primer día de la semana se configura en `theme-store.firstDayOfWeek` (0=Dom, 1=Lun). En wireframe: default domingo.
- Separador: `border-b border-border-default`.

**[4] — Celdas del calendario**
- Cada celda: `~51px ancho × 56px alto` (en mobile).
- Número de día: `text-sm font-medium text-text-primary`. Posición: `top-left` de la celda, `p-1`.
- Días del mes anterior/siguiente: `text-text-disabled` sin franja de turno.
- Franja de turno `████▒▒`: representa `linear-gradient(to bottom, rgba(color, 0.90), rgba(color, 0.40))`. Altura: 14px. `radius-sm`. Ocupa el ancho completo de la celda menos 2px de padding lateral.
- `E 8:00` = hora de entrada: `text-xs font-semibold font-mono`. Posición: `top-right` dentro de la franja.
- `S 8:00` = hora de salida: misma tipografía. Posición: `bottom-right` dentro de la franja.
- `···` = franco: celda sin franja, sin texto adicional. Solo número de día.
- Las celdas del grid tienen `border-right border-bottom border-border-default` (para el separador de 1px). Sin border-radius en la celda.

**[5] — Día actual (hoy = 22)**
- Número de día envuelto en: `w-6 h-6 rounded-full bg-interactive-primary text-text-inverse font-bold text-sm`. Centrado verticalmente arriba de la celda.
- La celda del día actual NO tiene borde especial — el círculo en el número es suficiente distintivo visual.
- Este indicador siempre es visible independientemente del estado del turno ese día.

**[6] — Card de animación de onboarding (D-UX-001)**
- Visible solo si `dod-onboarding.animationSeen === false`.
- Posición: `fixed`, centrado horizontalmente sobre el área del calendario.
- Dimensiones: `240px × 88px`.
- Fondo: `bg-surface-elevated`, `shadow-md`, `rounded-lg`, `border border-border-default`.
- Contenido: eje vertical (∧∨) con label "meses", eje horizontal (⟨⟩) con label "años". El `●` representa el cursor animado CSS.
- Secuencia: 0-2s cursor sube/baja, 2.5-4.5s cursor izquierda/derecha, 5-7s repite vertical. A los 8s: fade-out en `duration-slow`.
- Este card se posiciona SOBRE el calendario pero NO bloquea interacción (pointer-events: none sobre el overlay, excepto si se añade botón de cierre — no aplica aquí).
- Con `prefers-reduced-motion`: card estático sin cursor. Desaparece a 8s sin transición.

**[7] — Bottom action bar**
- Sticky bottom: `position: fixed`, `bottom: 0`, ancho completo.
- `[🔍 Buscar una fecha]`: botón primario full-width. Icono lucide `Search`. Navega a `/search`.
- RG-001: nunca `disabled`.
- Fondo del bottom bar: `bg-surface-elevated`, `border-t border-border-default`, `px-4 py-3`.
- **Nota:** Cuando el usuario está en un mes diferente al actual, este bottom bar muestra ADICIONALMENTE un botón secundario: `[↩ Volver a hoy]`. Ver Estado `single-config` anotación [7b].

**[8] — Footer**
- No sticky. Aparece al final del contenido de la página (debajo del bottom bar en layout de columna).
- En mobile: links centrados, `text-xs text-text-secondary`. Separados por `·`.
- "Términos" → `/terms`, "Privacidad" → `/privacy`, "Feedback" → `/feedback`.
- Usa `<Link>` de React Router (nunca `<a href>`).

---

### Desktop — 1280px (estado `empty`)

```
/* desktop — 1280px, max-w-3xl centrado */
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ⚙  ⟨ 2026 ⟩    ∧ FEBRERO 2026 ∨             [?] [☾]  │  [1d]
│                                                          │
├──────────────────────────────────────────────────────────┤
│  ⚡ Configura tu turno para visualizar tu calendario →   │  [2d]
├──────────────────────────────────────────────────────────┤
│   Dom      Lun      Mar      Mié      Jue      Vie   Sáb │
├────────┬────────┬────────┬────────┬────────┬────────┬────┤
│   1    │   2    │   3    │   4    │   5    │   6    │ 7  │
│ ██████▒│ ░████▒ │  ···   │ ██████ │ ░█████ │  ···   │ ██ │
│ E 8:00 │ S 8:00 │        │ E 8:00 │ S 8:00 │        │ E  │
├────────┼────────┼────────┼────────┼────────┼────────┼────┤
│   8    │   9    │  10    │  11    │  12    │  13    │ 14 │
│ ░█████ │  ···   │ ██████ │ ░█████ │  ···   │ ██████ │ ░█ │
│ S 8:00 │        │ E 8:00 │ S 8:00 │        │ E 8:00 │ S  │
├────────┼────────┼────────┼────────┼────────┼────────┼────┤
│  15    │  16    │  17    │  18    │  19    │  20    │ 21 │
│  ···   │ ██████ │ ░█████ │  ···   │ ██████ │ ░█████ │ ·· │
│        │ E 8:00 │ S 8:00 │        │ E 8:00 │ S 8:00 │    │
├────────┼────────┼────────┼────────┼────────┼────────┼────┤
│  (22)  │  23    │  24    │  25    │  26    │  27    │ 28 │
│ ██████▒│ ░█████ │  ···   │ ██████ │ ░█████ │  ···   │ ██ │
│ E 8:00 │ S 8:00 │        │ E 8:00 │ S 8:00 │        │ E  │
├────────┴────────┴────────┴────────┴────────┴────────┴────┤
│                                                          │
│           ╔═════════════════════════╗                    │  [6d]
│           ║  ∧ meses ∨   ⟨ años ⟩  ║                    │
│           ║          ●              ║                    │
│           ╚═════════════════════════╝                    │
│                                                          │
│            [ 🔍  Buscar una fecha  ]                     │  [7d]
│                                                          │
│         Términos · Privacidad · Feedback                 │
└──────────────────────────────────────────────────────────┘
```

**[1d]** El top bar se expande a ancho completo. El layout sigue siendo una barra horizontal única. El mes+año se muestra como texto completo "FEBRERO 2026" en lugar de solo el nombre del mes (más espacio disponible).

**[2d]** El banner de configuración ocupa el ancho completo con más texto visible.

**[6d]** En desktop el card de onboarding se posiciona más arriba del calendario y no interfiere tanto con la lectura del grid. Aun así usa `position: fixed` centrado.

**[7d]** El botón de búsqueda en desktop tiene ancho `max-w-xs` centrado (no full-width).

---

## Estado 2: `single-config` — 1 configuración activa, usuario en mes actual

**Describe:** El usuario tiene configurado "Mi turno" (24x48). Es el estado de uso diario más común. No hay onboarding activo. El usuario está viendo el mes actual.

### Mobile — 360px

```
/* mobile — 360px */
┌────────────────────────────────────────┐
│ ⚙   ⟨ 2026 ⟩   ∧ FEBRERO ∨  [?] [☾] │  [1]
├────────────────────────────────────────┤
│ Dom   Lun   Mar   Mié   Jue   Vie  Sáb │
├──────┬──────┬─────┬─────┬─────┬─────┬──┤
│  1   │  2   │  3  │  4  │  5  │  6  │7 │
│ ████▒│ ░░██▒│ ··· │████▒│░░██▒│ ··· │██│  [A]
│E8:00 │S8:00 │     │E8:00│S8:00│     │E │
├──────┼──────┼─────┼─────┼─────┼─────┼──┤
│  8   │  9   │ 10  │ 11  │ 12  │ 13  │14│
│ ░░██▒│ ···  │████▒│░░██▒│ ··· │████▒│░░│  [B]
│S8:00 │      │E8:00│S8:00│     │E8:00│S │
├──────┼──────┼─────┼─────┼─────┼─────┼──┤
│ 15   │ 16   │ 17  │ 18  │ 19  │ 20  │21│
│ ···  │████▒▒│░░██▒│ ··· │████▒│░░██▒│··│
│      │E8:00 │S8:00│     │E8:00│S8:00│  │
├──────┼──────┼─────┼─────┼─────┼─────┼──┤
│ (22) │ 23   │ 24  │ 25  │ 26  │ 27  │28│  [C]
│ ████▒│ ░░██▒│ ··· │████▒│░░██▒│ ··· │██│
│E8:00 │S8:00 │     │E8:00│S8:00│     │E │
└──────┴──────┴─────┴─────┴─────┴─────┴──┘
│                                         │  [2]
│         [🔍  Buscar una fecha  ]        │
├─────────────────────────────────────────┤
│    Términos · Privacidad · Feedback     │
└─────────────────────────────────────────┘
```

**Detalle de celda — día de ENTRADA (ej: 22, hoy)**
```
/* celda ~51px × 56px */
┌──────┐
│(22)  │  ← número en círculo azul (hoy)
│██████│  ← franja: linear-gradient 0.90→0.40
│████▒▒│  ← color del turno del usuario (inline style)
│E8:00 │  ← text-xs semibold, esquina superior derecha de la franja [D]
└──────┘
```

**Detalle de celda — día de SALIDA (ej: 23)**
```
┌──────┐
│ 23   │
│████▒▒│
│░░████│
│S8:00 │  ← esquina inferior derecha de la franja [D]
└──────┘
```

**Detalle de celda — día FRANCO (ej: 24)**
```
┌──────┐
│ 24   │  ← texto normal, sin círculo
│      │  ← celda vacía, sin franja
│      │
└──────┘
```

### Anotaciones — Estado `single-config`

**[A] — Días de turno con franja de color**
- La franja ocupa todo el ancho de la celda (de borde a borde) con 2px de margen lateral.
- Altura: 14px. Posición: ocupa la mitad inferior de la celda (debajo del número del día).
- El color de la franja viene de `ShiftConfiguration.color` via `style={{ background: 'linear-gradient(...)' }}`.
- En este estado solo hay 1 config activa → 1 sola franja por celda. Queda espacio de ~10px debajo del número antes de la franja.

**[B] — Días intermedios (En Turno)**
- Para esquemas donde `workHours > 24`, puede haber días intermedios donde el turno ni entra ni sale.
- En 24x48 no ocurre (24h trabajo < 24h = siempre hay entrada Y salida el mismo día).
- En esquemas como 48x48 sí ocurre. La celda mostraría la franja sin texto de hora.

**[C] — Día actual resaltado (hoy)**
- El número "22" va envuelto en un círculo: `w-6 h-6 rounded-full bg-interactive-primary text-text-inverse`.
- Este indicador es independiente del estado de turno. Un día franco también puede ser "hoy".

**[D] — Hora en la franja**
- El texto de hora usa `font-family-mono` SOLO si el usuario configuró `timeFormat: "military"`.
- Para `12h` muestra "8:00 AM" / "8:00 PM".
- Para `24h` muestra "8:00" / "20:00".
- Para `military` muestra "0800" / "2000" en `font-mono`.
- El texto debe contrastar con el color de turno del usuario. Se usa `--color-shift-text-on-light` o `--color-shift-text-on-dark` como punto de partida. Si el contraste calculado por WCAG es insuficiente, se invierte (texto oscuro/claro). Esto ocurre en `DayCell.tsx` al renderizar.

**[2] — Botón "Volver a hoy" (ausente en este estado)**
- Cuando el usuario está EN el mes actual, el botón "Volver a hoy" NO aparece.
- Cuando el usuario navega a otro mes, el bottom bar muestra AMBOS botones:
  ```
  [ ↩ Volver a hoy ]   [ 🔍 Buscar fecha ]
  ```
  El primero es secundario (ghost), el segundo es primario.
- RG-001: ninguno de los dos se deshabilita nunca.

> Desktop: layout idéntico al mobile. Celdas más anchas (~160px) y más altas (80px). Las horas de entrada/salida tienen más espacio y se muestran con texto más grande (`text-sm` en lugar de `text-xs`).

---

## Estado 3: `multiple-configs` — Múltiples configs activas con overflow

**Describe:** El usuario tiene 3 configuraciones activas: "Mi turno" (24x48, azul), "Turno Ana" (12x36, rojo) y "Turno Carlos" (48x48, verde). En mobile caben 2 franjas → la tercera genera badge `+1`. Al tap en la celda → vista expandida del día.

### Mobile — 360px

```
/* mobile — 360px */
┌────────────────────────────────────────┐
│ ⚙   ⟨ 2026 ⟩   ∧ FEBRERO ∨  [?] [☾] │
├────────────────────────────────────────┤
│ Dom   Lun   Mar   Mié   Jue   Vie  Sáb │
├──────┬──────┬─────┬─────┬─────┬─────┬──┤
│  1   │  2   │  3  │  4  │  5  │  6  │7 │  [1]
│ ████▒│ ░░██▒│ ··· │████▒│░░██▒│ ··· │██│  ← "Mi turno" (azul)
│ ████▒│ ░░██▒│████▒│████▒│░░██▒│████▒│██│  ← "Turno Ana" (rojo)
│      │      │     │     │     │     │  │  ← "Turno Carlos" no cabe → [+1]
├──────┼──────┼─────┼─────┼─────┼─────┼──┤
│  8   │  9   │ 10  │ 11  │ 12  │ 13  │14│
│ ░░██▒│ ···  │████▒│░░██▒│████▒│████▒│░░│  ← "Mi turno"
│ ████▒│████▒▒│░░██▒│████▒│░░██▒│ ··· │██│  ← "Turno Ana"
│ +1   │ +1   │ +1  │ +1  │ +1  │ +1  │+1│  [2]
├──────┼──────┼─────┼─────┼─────┼─────┼──┤
│ 15   │ 16   │ 17  │ 18  │ 19  │ 20  │21│
│ ···  │████▒▒│░░██▒│████▒│████▒│░░██▒│··│
│████▒▒│ ···  │████▒│░░██▒│░░██▒│████▒│··│
│ +1   │ +1   │ +1  │ +1  │ +1  │ +1  │+1│
├──────┼──────┼─────┼─────┼─────┼─────┼──┤
│ (22) │ 23   │ 24  │ 25  │ 26  │ 27  │28│  [3]
│ ████▒│ ░░██▒│ ··· │████▒│░░██▒│ ··· │██│  ← "Mi turno"
│ ████▒│████▒▒│████▒│░░██▒│████▒│████▒│░░│  ← "Turno Ana"
│ +1   │ +1   │ +1  │ +1  │ +1  │ +1  │+1│  ← "Turno Carlos" oculto
└──────┴──────┴─────┴─────┴─────┴─────┴──┘
│          [🔍  Buscar una fecha  ]       │
├─────────────────────────────────────────┤
│    Términos · Privacidad · Feedback     │
└─────────────────────────────────────────┘
```

**Detalle de celda con 2 configs + overflow (ej: día 1)**
```
/* celda ~51px × 56px */
┌────────┐
│ 1      │  ← número de día (text-sm, font-medium)
│ ████▒▒ │  ← franja "Mi turno" (azul, 14px, E 8:00 en el extremo derecho)
│ E8:00  │     (dentro de la franja, alineado a la derecha)
│ ████▒▒ │  ← franja "Turno Ana" (rojo, 14px)
│ E6:00  │
│     +1 │  [2] ← badge overflow en esquina inferior derecha
└────────┘
```

**Detalle de celda con 2 configs, sin overflow (ej: si solo hay 2 configs)**
```
┌────────┐
│ 1      │
│ ████▒▒ │  ← "Mi turno"
│ E8:00  │
│ ████▒▒ │  ← segunda config
│ E6:00  │
└────────┘  ← sin badge, todo visible
```

### Anotaciones — Estado `multiple-configs`

**[1] — Franjas apiladas verticalmente**
- Las franjas se apilan de arriba hacia abajo dentro de la celda.
- Orden fijo: config default ("Mi turno") siempre primera.
- Las adicionales siguen el orden definido en `config-store.configs` (índice).
- Cada franja: `height: 14px`, `margin-top: 2px`, color via `style` inline, `radius-sm`.
- El texto de hora (`E 8:00` / `S 8:00`) es `text-xs font-semibold` dentro de la franja, alineado a la derecha.

**[2] — Badge de overflow `+N`**
- Aparece cuando hay más configs activas de las que caben (>2 en mobile, >3 en desktop).
- Posición: esquina inferior derecha de la celda.
- Estilo: `min-w-[18px] h-[18px] rounded-full bg-surface-overlay text-text-inverse text-[10px] font-bold flex items-center justify-center`.
- El número N = total de configs activas - configs visibles.
- Al tap/click en cualquier celda del calendario → abre vista expandida del día (US-013). El badge hace la celda más "clickable" intuitivamente.
- US-003: "Al hacer tap o click en un día con configuraciones desbordadas, se abre la vista expandida del día."
- **Importante:** las celdas SON siempre tappeables. El badge solo indica que hay más contenido.

**[3] — Día actual con múltiples configs**
- El círculo del número "hoy" sigue siendo visible en la esquina superior izquierda, encima de las franjas.
- La celda es un poco más "densa" visualmente — el diseño soporta esto correctamente con el espaciado definido.

### Desktop — 1280px (múltiples configs)

El layout cambia significativamente en desktop:

```
/* desktop — 1280px, max-w-4xl centrado */
┌────────────────────────────────────────────────────────────┐
│  ⚙   ⟨ 2026 ⟩     ∧ FEBRERO 2026 ∨              [?] [☾]  │
├────────────────────────────────────────────────────────────┤
│   Dom       Lun       Mar       Mié       Jue      Vie  Sáb│
├─────────┬─────────┬─────────┬─────────┬─────────┬────────┬─┤
│    1    │    2    │    3    │    4    │    5    │    6   │ 7│
│ ███████▒│ ░██████▒│   ···   │ ███████ │ ░██████ │   ···  │██│  ← "Mi turno"
│ E 8:00  │ S 8:00  │         │ E 8:00  │ S 8:00  │        │E │
│ ███████▒│ ░██████▒│ ███████▒│ ██████▒ │ ░██████ │ ███████│░█│  ← "Turno Ana"
│ E 6:00  │         │ E 6:00  │ S 18:00 │         │ E 6:00 │  │
│ ███████▒│ ░██████▒│ ██████▒ │ ██████▒ │ ░██████ │ ███████│██│  ← "Turno Carlos"
│ E 8:00  │         │         │ E 8:00  │         │ E 8:00 │E │
│         │         │         │         │         │        │  │
├─────────┴─────────┴─────────┴─────────┴─────────┴────────┴─┤
│  (continuación del mes...)                                  │
├─────────────────────────────────────────────────────────────┤
│                   [ 🔍 Buscar una fecha ]                   │
│              Términos · Privacidad · Feedback               │
└─────────────────────────────────────────────────────────────┘
```

**Anotaciones desktop múltiples configs:**
- Celda desktop: ~155px ancho × 80px alto.
- 3 franjas visibles antes de overflow (D-UX-003). Con 3 configs activas: NO hay badge +N en desktop.
- Franjas: `height: 16px` en desktop (vs 14px mobile) — ligeramente más altas por el espacio disponible.
- Hora en franjas: `text-sm` en desktop (vs `text-xs` mobile) para mejor legibilidad.
- Con 4+ configs activas en desktop, la 4ª genera badge `+N` en esquina inferior derecha de la celda.

---

## Estados cubiertos

| Estado | Mobile | Desktop |
|---|---|---|
| `empty` — primera apertura con onboarding | ✅ | ✅ |
| `single-config` — 1 config activa, mes actual | ✅ | Indicado (escala) |
| `single-config` — 1 config, fuera del mes actual | Anotado [2] | Anotado [2] |
| `multiple-configs` — 2+ configs, con overflow | ✅ | ✅ |
| `multiple-configs` — 2 configs sin overflow | Anotado | — |

**Pendientes de wireframe en este archivo:**
- [ ] Vista expandida del día (`day-expanded`) — overlay sobre el calendario
- [ ] Estado de mes anterior/siguiente con botón "Volver a hoy" (detalle del bottom bar)
- [ ] Modal de importación de config compartida (`?cfg=`) — `import-url-modal`
- [ ] Overlay de ayuda contextual (`help-overlay`) — tooltips en todos los elementos visibles

---

## Notas de accesibilidad

```
A11Y:

TOP BAR:
- <header role="banner">
- Botón config: role="button" aria-label="Ir a configuración"
- Botón año anterior: aria-label="Año anterior" (ChevronLeft)
- Botón año siguiente: aria-label="Año siguiente" (ChevronRight)
- Texto año: aria-live="polite" — se anuncia al cambiar
- Botón mes anterior: aria-label="Mes anterior" (ChevronUp)
- Botón mes siguiente: aria-label="Mes siguiente" (ChevronDown)
- Texto mes: aria-live="polite" — se anuncia al cambiar
- Botón ayuda: aria-label="Mostrar ayuda" aria-pressed={helpActive}
- Toggle tema: aria-label="Cambiar a modo oscuro/claro" aria-pressed={isDark}

BANNER ONBOARDING:
- role="alert" aria-live="polite" — se anuncia al aparecer
- El banner es clickeable: role="button" aria-label="Ir a configuración de turno"

CALENDARIO:
- <main role="main">
- <table> o CSS grid con role="grid"
- Encabezado días: <th scope="col"> con abreviatura y aria-label completo ej: aria-label="Domingo"
- Cada celda: role="gridcell" aria-label="{día} de {mes}: {estado del turno}"
  - Ej: aria-label="22 de febrero: Entrada a las 8:00"
  - Ej: aria-label="24 de febrero: Franco"
  - Día actual: aria-current="date"
- Celdas con overflow (+N): aria-label="...más {N} configuraciones. Toca para ver todas."
- Celda clickeable: role="button" (o <button> wrapper). Foco visible.

NAVEGACIÓN POR TECLADO:
- Tab order: top bar izquierda→derecha → grid → bottom bar → footer
- Dentro del grid: flechas del teclado navegan entre celdas (arrow key navigation en grid)
- Enter/Space en celda: abre vista expandida del día
- Escape: cierra cualquier overlay activo

GESTOS:
- Los gestos de swipe son ADICIONALES. Los controles de botón (top bar) son el fallback primario y accesible.
- Screen readers anuncian el mes/año actual al navegar.

FOCUS VISIBLE:
- Primer elemento con foco al cargar la página: el botón ⚙ (Config) — primer elemento interactivo en tab order.
- Focus ring: `outline: 2px solid var(--color-focus-ring)`, `outline-offset: 2px`.
- Las celdas del calendario también reciben foco individual para navegación con teclado.

ONBOARDING:
- La animación de gestos tiene aria-hidden="true" (decorativa, no comunica información nueva)
- El banner de onboarding usa aria-live="polite" al aparecer
- El card de animación usa aria-label="Guía de navegación: desliza verticalmente para cambiar de mes, horizontalmente para cambiar de año"
```

---

## Notas de animación y transición

```
NAVEGACIÓN DE CALENDARIO:
- Cambio de mes (swipe vertical / botón ∧∨):
  Saliente: translateY(-20px) + opacity 0, duration-normal, ease-snap
  Entrante: translateY(20px)→0 + opacity 0→1, duration-normal, ease-snap
  Las dos animaciones ocurren en paralelo (saliente sale y entrante entra simultáneamente).

- Cambio de año (swipe horizontal / botón ⟨⟩):
  Saliente: translateX(±30px) + opacity 0, duration-normal, ease-snap
  Entrante: translateX(∓30px)→0 + opacity 0→1, duration-normal, ease-snap

- Con prefers-reduced-motion: cambio instantáneo sin transición.

INDICADORES DE DIRECCIÓN DE SWIPE:
- Los chevrons de navegación (⟨⟩ y ∧∨) tienen opacity: 0.4 en estado normal.
- Al hover/focus: opacity: 1. Transición: duration-fast, ease-default.
- No desaparecen nunca — son "permanentes sutiles" (US-002).

DÍA ACTUAL (círculo):
- El círculo aparece sin animación — es estático, no transiciona.

BADGE +N:
- Aparece sin animación — renderizado estático condicionado por número de configs.

BOTTOM BAR (aparición del botón "Volver a hoy"):
- Al navegar fuera del mes actual, el botón "Volver a hoy" aparece con:
  opacity 0→1, translateY(8px)→0, duration-normal, ease-default.
- Al regresar al mes actual: opacity 1→0, duration-fast, ease-default.
```

---

## Verificación contra criterios de aceptación del PRD

| Criterio (US-001 / US-002 / US-003) | Cubierto | Dónde |
|---|---|---|
| Mes actual al abrir sin acción | ✅ | Estado `empty` y `single-config` |
| Días de turno con gradiente de color | ✅ | Franjas `████▒▒` en todas las celdas |
| Indicador de hora de entrada | ✅ | `E 8:00` en celda de entrada |
| Indicador de hora de salida | ✅ | `S 8:00` en celda de salida |
| Días intermedios coloreados sin hora | ✅ | Franja sin texto (En Turno) |
| Días de franco sin color | ✅ | Celdas `···` vacías |
| Día actual con distintivo visual | ✅ | Número en círculo `(22)` |
| Sin config previa → 24x48, hoy entrada 8:00 AM | ✅ | Estado `empty` |
| Deslizar vertical → cambio de mes | ✅ | Anotación [1] + A11Y gestos |
| Deslizar horizontal → cambio de año | ✅ | Anotación [1] + A11Y gestos |
| Iconos sutiles permanentes de dirección | ✅ | ∧∨⟨⟩ en top bar |
| "Volver al día actual" solo si no estoy en mes actual | ✅ | Anotación [2] |
| Sin límite de navegación pasado/futuro | ✅ | Anotación [1] — sin restricciones |
| Primer día configurable (dom/lun) | ✅ | A11Y: nota en encabezado de días |
| Múltiples configs: franjas por config | ✅ | Estado `multiple-configs` |
| Overflow con indicador | ✅ | Badge `+N` anotación [2] |
| Tap en celda → vista expandida | ✅ | Anotación [2] múltiples configs |
| Config default siempre visible (primera franja) | ✅ | Anotación [1] múltiples configs |
| Banner onboarding al abrir por primera vez | ✅ | Estado `empty` anotación [2] |
| Animación de gestos al abrir por primera vez | ✅ | Estado `empty` anotación [6] |
| Animación + banner simultáneos | ✅ | Estado `empty` — ambos visibles a la vez |
| Banner no bloquea el calendario | ✅ | El calendario es usable debajo del banner |
| Banner lleva a /config al tap | ✅ | Anotación [2] |

---

## Checklist de entrega

- [x] Wireframe mobile completo — estado `empty`
- [x] Wireframe mobile completo — estado `single-config`
- [x] Wireframe mobile completo — estado `multiple-configs`
- [x] Wireframe desktop — estado `empty`
- [x] Wireframe desktop — estado `multiple-configs`
- [x] Detalle de celdas individuales (entrada, salida, franco, overflow)
- [x] Anotaciones cubren comportamientos no obvios
- [x] Estados alternativos identificados
- [x] Notas de accesibilidad completas
- [x] Notas de animación/transición
- [x] Verificación contra criterios de aceptación del PRD
- [x] Sin funcionalidades fuera del MVP

---

*Generado por: Agente UX/UI Designer — DateOnDuty — Feb 2026*
*Siguiente artefacto: Vista expandida del día (`day-expanded`) — overlay crítico del calendario*
