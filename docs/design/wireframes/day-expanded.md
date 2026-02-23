# Wireframe: Vista Expandida del Día
**Ruta:** Overlay sobre `/` (no es una ruta separada)
**US de referencia:** US-013, US-001, US-003
**Archivo de tokens:** `docs/design/design-tokens.md`
**Fecha:** Feb 2026

---

## Contexto y comportamiento general

La vista expandida del día es un **bottom sheet** (mobile) o **modal centrado** (desktop) que aparece sobre el calendario principal. **No es una página ni una ruta**. El calendario queda visible y semi-transparente detrás del overlay.

### Apertura
- Tap/click en cualquier celda del calendario → abre la vista expandida mostrando ese día.
- Especialmente relevante cuando la celda tiene badge `+N` (hay más configs de las que caben en la celda).
- También es la forma de ver el detalle de cualquier día, aunque no haya overflow.

### Navegación dentro de la vista expandida

| Gesto / Botón | Acción |
|---|---|
| Swipe horizontal izquierda / `⟩` | Día siguiente |
| Swipe horizontal derecha / `⟨` | Día anterior |
| Swipe vertical abajo / `∨` | Mes siguiente |
| Swipe vertical arriba / `∧` | Mes anterior |
| Swipe abajo en drag handle | Cierra la vista expandida |
| Tap en overlay oscuro | Cierra la vista expandida |
| Botón `✕` | Cierra la vista expandida |

### Cierre
- Al cerrar, el calendario principal refleja el mes donde estaba la vista expandida en ese momento — **no** el mes desde el que se abrió.
- El `ui-store.setExpandedDay(null)` limpia el overlay. El `ui-store.currentMonth` y `currentYear` ya fueron actualizados durante la navegación en el expanded view.

### Navegación de mes — comportamiento del día
- Al cambiar de mes (∧∨), el sistema mantiene el mismo número de día si existe en el mes destino.
- Si el día no existe (ej: día 31 en un mes de 30 días), se navega al **último día disponible** del mes destino.
- Este ajuste es silencioso (sin mensaje al usuario).

### Zonas de gesto (sin conflicto)
La hoja se divide en dos zonas de gesto:
1. **Zona de drag handle** (~40px en el tope de la hoja): swipe vertical hacia abajo → cierra. Swipe vertical hacia arriba → expande.
2. **Zona de contenido** (resto de la hoja): swipe horizontal → día, swipe vertical → mes.

---

## Convenciones adicionales para este wireframe

```
░░░░░░░░   → zona del calendario detrás del overlay (semi-transparente, dimmed)
─────────  → drag handle de la bottom sheet (pill pill pill)
[████]     → franja de color de turno del usuario (inline style)
▐█▌        → indicador de color lateral (borde izquierdo 4px del row de config)
ENTRADA    → estado de turno en tag semántico
FRANCO     → estado en texto muted
↑ 8:00     → hora con icono de dirección (lucide ArrowUp / ArrowDown)
```

---

## Estado 1: `default` — 1 configuración activa, día de entrada

### Mobile — 360px (Bottom Sheet)

```
/* mobile — 360px */
/* el calendario está visible detrás, dimmed */

┌────────────────────────────────────────┐
│ ░░ ⚙  ⟨ 2026 ⟩  ∧ FEBRERO ∨  ░░[?][☾]│  [1]
│ ░░─────────────────────────────────░░ │
│ ░░Dom  Lun  Mar  Mié  Jue  Vie  Sáb░░ │
│ ░░─────────────────────────────────░░ │
│ ░░ 1    2    3    4    5    6    7  ░░ │  [2]
│ ░░ 8    9   10   11   12   13   14 ░░ │
│ ░░15   16   17   18   19   20   21 ░░ │
│ ░░══════════════════════════════════  │  ← overlay empieza aquí
│                                        │
│              ───────                   │  [3] drag handle
│                                        │
│ ✕  Sábado, 22 de febrero de 2026      │  [4]
│                                        │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │  [5]
│  ⟨  Día anterior     Día siguiente  ⟩  │
│  ∧  Mes anterior     Mes siguiente  ∨  │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│                                        │
│ ┌──────────────────────────────────┐   │  [6]
│ │▐█▌ Mi turno                      │   │
│ │    ↑ Entrada · 8:00 AM           │   │
│ └──────────────────────────────────┘   │
│                                        │
│                                        │  [7]
└────────────────────────────────────────┘
```

**Detalle de la bottom sheet (capa superior):**
```
/* bottom sheet — 360px ancho, ~85vh alto */
/* radius-xl en esquinas superiores        */

┌────────────────────────────────────────┐
│                                        │
│              ───────                   │  drag handle: 4px × 32px,
│                                        │  bg-border-strong, rounded-full
│ ✕  Sábado, 22 de febrero de 2026      │
│                                        │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│  ⟨  Día anterior     Día siguiente  ⟩  │
│  ∧  Mes anterior     Mes siguiente  ∨  │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│                                        │
│ ┌──────────────────────────────────┐   │
│ │▐█▌ Mi turno                      │   │  [A]
│ │    ↑ Entrada                     │   │
│ │    8:00 AM                       │   │
│ └──────────────────────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

### Anotaciones — Estado `default`

**[1] — Calendario detrás (dimmed)**
- El overlay `surface-overlay` (`rgba(0,0,0,0.45)` light / `rgba(0,0,0,0.70)` dark) cubre el área del calendario.
- El calendario sigue siendo visible detrás pero no interactuable mientras el overlay está activo.
- Tap sobre el overlay (zona `░░░`) → cierra la vista expandida.
- El top bar sigue visible sobre el overlay (z-index mayor que el overlay pero menor que la sheet).

**[2] — Calendario visible en el fondo**
- Se muestra simplificado/borroso detrás del overlay. En la implementación real: el calendario se renderiza normalmente, el overlay `div` con `bg-surface-overlay` va por encima.
- El mes visible en el fondo se actualiza a medida que el usuario navega con ∧∨ dentro de la vista expandida.

**[3] — Drag handle**
- Componente: pill centrado horizontalmente, `4px tall × 32px wide`, `bg-border-strong`, `rounded-full`.
- Zona táctil: 40px de altura (por encima del pill hasta el borde de la sheet).
- Swipe down en esta zona → `transition translateY 100%` + cierra la sheet.
- Accesibilidad: el drag handle tiene `role="button"` `aria-label="Cerrar vista del día"`.

**[4] — Header de la sheet**
- Botón ✕: `ChevronDown` (lucide) o `X` (lucide). 24px, tap target 44px. Alineado a la izquierda. Cierra la sheet.
- Fecha: formato completo — "Sábado, 22 de febrero de 2026". `text-xl font-bold text-text-primary`. Ocupa el espacio restante del header.
- Si la fecha es "hoy" → mostrar badge sutil "(Hoy)" en `text-sm text-interactive-primary` al lado de la fecha.
- Altura del header: 56px. `px-4`. `border-b border-border-default`.

**[5] — Controles de navegación**
- Dos filas simétricas, cada una de `height-tap-target` (44px).
- Botones: texto + icono lucide.
  - `⟨` = `ChevronLeft` + "Día anterior" (texto, `text-sm`). Alineado izquierda.
  - `⟩` = "Día siguiente" + `ChevronRight`. Alineado derecha.
  - `∧` = `ChevronUp` + "Mes anterior". Alineado izquierda.
  - `∨` = "Mes siguiente" + `ChevronDown`. Alineado derecha.
- Color del texto: `text-interactive-primary`. Fondo: transparente.
- RG-001: Nunca `disabled`. No hay límite de navegación en pasado ni futuro.
- Separador: líneas `┄┄` representan `border-t border-b border-border-default` alrededor del bloque de nav.
- Los gestos de swipe en la zona de contenido ejecutan la misma acción que los botones correspondientes.

**[6] — Row de configuración**
- Cada configuración activa ocupa un card/row separado.
- Card: `bg-surface-elevated`, `rounded-md`, `shadow-sm`, `border-l-4` con el color del usuario (`style={{ borderLeftColor: config.color }}`), `px-4 py-3`.
- Nombre: `text-base font-semibold text-text-primary`. "Mi turno" para la config default.
- Estado + hora: `text-sm text-text-secondary` → ver anotación **[A]** para detalles por estado.
- Separación entre cards: `gap-3` (12px).
- La franja de color es solo el borde izquierdo de 4px — no el fondo completo. Esto mantiene la legibilidad del texto en ambos modos.

**[A] — Variantes de estado del row de configuración**

```
/* Estado ENTRADA */
┌──────────────────────────────────────┐
│▐█▌ Mi turno                          │  ← border-l-4 color usuario
│    ↑ Entrada · 8:00 AM               │  ← lucide LogIn + text-feedback-success
└──────────────────────────────────────┘

/* Estado SALIDA */
┌──────────────────────────────────────┐
│▐█▌ Mi turno                          │
│    ↓ Salida · 8:00 AM                │  ← lucide LogOut + text-feedback-warning
└──────────────────────────────────────┘

/* Estado EN TURNO (día intermedio, sin hora) */
┌──────────────────────────────────────┐
│▐█▌ Mi turno                          │
│    ◉ En turno                        │  ← lucide Clock + text-text-primary
└──────────────────────────────────────┘

/* Estado FRANCO */
┌──────────────────────────────────────┐
│▐█▌ Mi turno                          │  ← border-l-4 mucho más transparente
│    ○ Franco                          │  ← sin icono directional + text-text-disabled
└──────────────────────────────────────┘
```

**Iconos semánticos por estado (lucide-react):**
- Entrada: `LogIn` (o `ArrowRightToLine`) — color `feedback-success`
- Salida: `LogOut` (o `ArrowLeftFromLine`) — color `feedback-warning`
- En Turno: `Clock` — color `text-primary`
- Franco: `Coffee` (o `Moon`) — color `text-disabled`

**[7] — Espacio restante de la sheet**
- El contenido tiene `overflow-y: auto` para scroll cuando hay múltiples configs.
- La bottom sheet siempre muestra el primer config (Mi turno) sin necesidad de scroll inicial.
- Con 1 solo config, la sheet tiene bastante espacio vacío abajo — esto es aceptable y se ve limpio.

---

### Desktop — 1280px (Modal Centrado)

En desktop, la vista expandida es un **modal dialog centrado** en lugar de un bottom sheet.

```
/* desktop — 1280px */
/* El calendario está visible detrás, dimmed */

┌──────────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░                                                       ░░ │
│ ░░   ┌────────────────────────────────────────────────┐  ░░ │
│ ░░   │                                          [✕]   │  ░░ │  [1d]
│ ░░   │  Sábado, 22 de febrero de 2026 · (Hoy)         │  ░░ │  [4d]
│ ░░   │                                                 │  ░░ │
│ ░░   │ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │  ░░ │
│ ░░   │  ⟨ Día anterior           Día siguiente ⟩       │  ░░ │  [5d]
│ ░░   │  ∧ Mes anterior           Mes siguiente ∨       │  ░░ │
│ ░░   │ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │  ░░ │
│ ░░   │                                                 │  ░░ │
│ ░░   │  ┌───────────────────────────────────────────┐  │  ░░ │
│ ░░   │  │▐█▌ Mi turno                    ↑ Entrada  │  │  ░░ │
│ ░░   │  │                                 8:00 AM   │  │  ░░ │
│ ░░   │  └───────────────────────────────────────────┘  │  ░░ │
│ ░░   │                                                 │  ░░ │
│ ░░   └────────────────────────────────────────────────┘  ░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└──────────────────────────────────────────────────────────────┘
```

**[1d]** El modal tiene `max-w-lg` (512px), centrado con `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)`. `rounded-lg`, `shadow-lg`, `bg-surface-elevated`. No hay drag handle.

**[4d]** El botón ✕ (`X` de lucide) está en la esquina superior derecha del modal. Tap target 44px.

**[5d]** Los controles de navegación en desktop tienen más espacio. El texto "Día anterior / Día siguiente" es completo. En mobile podría abreviarse a "Anterior / Siguiente" si el espacio es insuficiente.

**Cierre desktop:** Click en overlay (`░░░`) → cierra. Botón ✕ → cierra. Tecla `Escape` → cierra.

---

## Estado 2: `multiple-configs` — 3 configs activas, mix de estados

**Describe:** El usuario tiene 3 configs activas ("Mi turno", "Turno Ana", "Turno Carlos"). Se visualiza el día 22 (hoy). Todos los configs caben sin scroll (≤6 en mobile).

### Mobile — 360px

```
/* mobile — bottom sheet */

┌────────────────────────────────────────┐
│ ░░░ [calendario dimmed detrás] ░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│════════════════════════════════════════│
│              ───────                   │
│                                        │
│ ✕  Sábado, 22 de febrero · (Hoy)      │
│                                        │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│  ⟨  Día anterior     Día siguiente  ⟩  │
│  ∧  Mes anterior     Mes siguiente  ∨  │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│                                        │
│ ┌──────────────────────────────────┐   │
│ │▐█▌ Mi turno                      │   │  [A]
│ │    ↑ Entrada · 8:00 AM           │   │
│ └──────────────────────────────────┘   │
│                                        │
│ ┌──────────────────────────────────┐   │
│ │▐█▌ Turno Ana                     │   │  [B]
│ │    ○ Franco                      │   │
│ └──────────────────────────────────┘   │
│                                        │
│ ┌──────────────────────────────────┐   │
│ │▐█▌ Turno Carlos                  │   │  [C]
│ │    ◉ En turno                    │   │
│ └──────────────────────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

### Anotaciones — Estado `multiple-configs`

**[A] — Mi turno (config default, siempre primera)**
- El nombre "Mi turno" es el placeholder para la config default. No es editable.
- Siempre aparece en primera posición en la lista, sin importar el orden de creación.
- Estado en este día: **Entrada** a las 8:00 AM → prominente, con color `feedback-success` en el icono y texto.

**[B] — Turno Ana (config adicional, Franco)**
- Nombre en `text-base font-semibold`. Viene de `config.name` en el store.
- Estado: **Franco**. Texto `text-text-disabled`, icono `Coffee` o `Moon`. El borde izquierdo sigue mostrando el color del usuario pero con `opacity: 0.4` para indicar visualmente que es un día de descanso.
- RG-006: Si el nombre es largo y no cabe en una línea, se trunca con `...`. `title` attribute con el nombre completo.

**[C] — Turno Carlos (En Turno, día intermedio)**
- Estado: **En Turno** — el turno inició antes de este día y termina después.
- Icono `Clock` (lucide) + texto "En turno". Color: `text-text-primary`.
- Sin indicador de hora (no hay entrada ni salida en este día específico).

---

## Estado 3: `multiple-configs-overflow` — 7+ configs activas, con scroll

**Describe:** El usuario tiene 7 configuraciones activas. La sheet necesita scroll para verlas todas.

### Mobile — 360px

```
/* mobile — bottom sheet con scroll */

┌────────────────────────────────────────┐
│              ───────                   │
│                                        │
│ ✕  Sábado, 22 de febrero              │
│                                        │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│  ⟨  Día anterior     Día siguiente  ⟩  │
│  ∧  Mes anterior     Mes siguiente  ∨  │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│                            ← scrollable│  [1]
│ ┌──────────────────────────────────┐ ↑ │
│ │▐█▌ Mi turno         ↑ Entrada   │   │
│ │                      8:00 AM    │   │
│ └──────────────────────────────────┘   │
│ ┌──────────────────────────────────┐   │
│ │▐█▌ Turno Ana         ○ Franco   │   │
│ └──────────────────────────────────┘   │
│ ┌──────────────────────────────────┐   │
│ │▐█▌ Turno Carlos      ◉ En turno │   │
│ └──────────────────────────────────┘   │
│ ┌──────────────────────────────────┐   │
│ │▐█▌ Turno Pedro       ↓ Salida   │   │
│ │                      20:00      │   │
│ └──────────────────────────────────┘   │
│ ┌──────────────────────────────────┐   │  [2]
│ │▐█▌ Turno María       ↑ Entrada  │ ↓ │  ← indicador de scroll
│ │                      6:00 AM    │   │
│ └──────────────────────────────────┘   │
│   (2 configs más ↓ — hacer scroll)     │  [3]
└────────────────────────────────────────┘
```

### Anotaciones — Estado `overflow`

**[1] — Área de scroll**
- El bloque de configuraciones es `overflow-y: auto`.
- El drag handle, el header (fecha + ✕), y los controles de navegación son `sticky top-0` dentro de la sheet — no hacen scroll.
- Solo la lista de configs hace scroll.
- En iOS: `overscroll-behavior: contain` para evitar que el scroll de la lista active el dismiss de la sheet.

**[2] — Indicador de scroll**
- Una sombra gradiente en la parte inferior de la zona scrollable (`mask-image: linear-gradient(to bottom, black 80%, transparent 100%)`) indica visualmente que hay más contenido abajo.
- Esta sombra desaparece cuando se llega al final del scroll.

**[3] — Texto de ayuda de overflow (opcional)**
- "2 configuraciones más" es una ayuda contextual que desaparece al hacer scroll.
- Alternativa: simplemente confiar en el gradiente de máscara sin texto.
- El texto NO muestra el número total para evitar actualización dinámica innecesaria. Solo la sombra es suficiente signal visual.

---

## Estado 4: `empty-day` — Día sin turno asignado (antes de `cycleStartDate`)

**Describe:** El usuario navega a un día anterior a la fecha de inicio de su configuración. Ninguna config tiene turno asignado para ese día.

### Mobile — 360px

```
/* mobile — bottom sheet */

┌────────────────────────────────────────┐
│              ───────                   │
│                                        │
│ ✕  Lunes, 1 de enero de 2026          │
│                                        │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│  ⟨  Día anterior     Día siguiente  ⟩  │
│  ∧  Mes anterior     Mes siguiente  ∨  │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│                                        │
│ ┌──────────────────────────────────┐   │
│ │▐░▌ Mi turno                      │   │  [1]
│ │    — Sin turno asignado          │   │
│ └──────────────────────────────────┘   │
│                                        │
│ ┌──────────────────────────────────┐   │
│ │▐░▌ Turno Ana                     │   │
│ │    — Sin turno asignado          │   │
│ └──────────────────────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

### Anotaciones — Estado `empty-day`

**[1] — Sin turno asignado**
- El borde izquierdo usa `bg-border-default` (el color del usuario en `opacity: 0.2` o el token de borde neutro).
- Texto: "— Sin turno asignado". `text-text-disabled`, sin icono de estado.
- Este estado ocurre cuando la fecha visualizada es anterior a `cycleStartDate` de la config. No es un error — es una limitación del rango configurado.
- No se muestra ningún mensaje de error ni prompt de reconfiguración.

---

## Estados cubiertos

| Estado | Mobile | Desktop |
|---|---|---|
| `default` — 1 config, día de entrada | ✅ | ✅ |
| `multiple-configs` — 3 configs, mix de estados | ✅ | Indicado (escala) |
| `multiple-configs-overflow` — 7+ configs con scroll | ✅ | — |
| `empty-day` — antes de cycleStartDate | ✅ | — |
| Día de salida (config default) | Anotado [A] | — |
| Día en turno intermedio | Anotado [C] | — |
| Navegación de mes con ajuste de día (31→28/30) | Anotado comportamiento | — |

---

## Notas de accesibilidad

```
A11Y:

OVERLAY / FONDO:
- El overlay tiene role="dialog", aria-modal="true", aria-label="Detalle del día {fecha completa}"
- Foco: al abrir, el foco se mueve al primer elemento interactivo dentro del dialog (botón ✕)
- Focus trap: Tab y Shift+Tab circulan dentro del dialog mientras está abierto
- Escape: cierra el dialog y devuelve el foco a la celda del calendario que lo abrió

DRAG HANDLE:
- role="button" aria-label="Cerrar detalle del día"
- Accesible por teclado: Enter/Space → cierra

HEADER:
- Botón ✕: aria-label="Cerrar" (lucide X)
- Fecha: role="heading" aria-level="2"
- Badge "(Hoy)": aria-label="Hoy" — visible para screen readers

CONTROLES DE NAVEGACIÓN:
- Botón día anterior: aria-label="Ir al día anterior: {fecha calculada}" — el label se actualiza dinámicamente
- Botón día siguiente: aria-label="Ir al día siguiente: {fecha calculada}"
- Botón mes anterior: aria-label="Ir al mes anterior"
- Botón mes siguiente: aria-label="Ir al mes siguiente"
- Todos: role="button", focus-visible con focus-ring token

LISTA DE CONFIGURACIONES:
- Lista: role="list" aria-label="Turnos del día"
- Cada item: role="listitem"
- El color del borde izquierdo tiene aria-hidden="true" (decorativo)
- El nombre de la config: visible para screen readers
- El estado: aria-label descriptivo completo:
  - "Mi turno: Entrada a las 8:00 AM"
  - "Turno Ana: Franco"
  - "Turno Carlos: En turno"
  - "Mi turno: Sin turno asignado"

NAVEGACIÓN POR TECLADO dentro del dialog:
- Tab order: ✕ → Día anterior → Día siguiente → Mes anterior → Mes siguiente → configs (no interactivas)
- Las configs del listado NO son interactivas (no son botones — son solo info)
- Flechas del teclado no navegan dentro del dialog (para no conflictuar con el Tab)

LIVE REGION:
- Al navegar a un nuevo día (botón o swipe), la fecha y el contenido se actualizan.
- La fecha usa aria-live="polite" para anunciar el cambio al screen reader sin interrumpir.

SCROLL:
- La zona de scroll tiene role="region" aria-label="Lista de configuraciones del día"
- aria-describedby apunta a un texto oculto: "Desliza para ver más configuraciones"
```

---

## Notas de animación y transición

```
APERTURA DE LA SHEET (mobile):
- Tipo: slide-up desde fuera de pantalla
- Animación entrada: translateY(100%) → translateY(0), duration-slow, ease-default
- Overlay entrada: opacity 0 → 1, duration-slow, ease-default (paralelo con la sheet)
- Con prefers-reduced-motion: sheet aparece instantáneamente en su posición final

CIERRE DE LA SHEET (mobile):
- Tipo: slide-down
- Animación: translateY(0) → translateY(100%), duration-normal, ease-default
- Overlay: opacity 1 → 0, duration-normal (paralelo)

APERTURA DEL MODAL (desktop):
- opacity 0 → 1, transform scale(0.95) → scale(1), duration-slow, ease-bounce
- Overlay: opacity 0 → 1, duration-slow

CIERRE DEL MODAL (desktop):
- opacity 1 → 0, transform scale(1) → scale(0.95), duration-normal, ease-default

NAVEGACIÓN ENTRE DÍAS (horizontal):
- Contenido de configs: translateX(±20px) + opacity 0 durante 100ms, luego entra nuevo contenido
- La fecha del header también anima: fade + slide suave
- Duration: duration-fast para salida, duration-normal para entrada
- ease-snap en ambas fases

NAVEGACIÓN ENTRE MESES (vertical):
- Idéntico al cambio de día pero en eje Y: translateY(±12px) + opacity 0→1
- La fecha refleja el nuevo mes

DRAG DISMISS (mobile):
- Durante el drag: transform translateY={offset} — seguimiento directo del dedo, sin easing
- Al soltar con ≥50px de distancia o velocidad ≥0.3: completar dismiss (slide-down, duration-normal)
- Al soltar con <50px: spring-back a posición 0 (ease-bounce, duration-normal)

INDICADOR DE SCROLL (gradiente inferior):
- El gradiente de máscara se desvanece cuando el scroll llega al fondo
- Transición: opacity 1→0, duration-fast, ease-default al llegar al último elemento visible
```

---

## Verificación contra criterios de aceptación del PRD

| Criterio US-013 | Cubierto | Dónde |
|---|---|---|
| Muestra todas las configs activas con color, nombre y estado | ✅ | Estados 1, 2, 3 |
| Estado "Mi turno" para config default | ✅ | Anotación [A] |
| Scroll si configs superan el espacio | ✅ | Estado 3 |
| Navegación lateral día siguiente/anterior | ✅ | Controles ⟨⟩ + anotación [5] |
| Navegación vertical mes siguiente/anterior | ✅ | Controles ∧∨ + anotación [5] |
| Al cruzar mes con nav lateral → sheet muestra nuevo mes | ✅ | Anotación comportamiento general |
| Nav vertical: mantener número de día, ajustar si no existe | ✅ | Sección de comportamiento general |
| Al cerrar → calendario muestra el mes de la vista expandida | ✅ | Sección comportamiento general |
| "Volver al día actual" en el calendario independiente de cómo se llegó | ✅ | Comportamiento del ui-store |
| Entrada con hora | ✅ | Estado [A] variante ENTRADA |
| Salida con hora | ✅ | Estado [A] variante SALIDA |
| Franco | ✅ | Estado [A] variante FRANCO |
| En Turno (sin hora) | ✅ | Estado [A] variante EN TURNO |

---

## Design Review: wireframe-day-expanded

**Fecha de revisión:** Feb 2026
**Revisado por:** UX/UI Designer Agent
**Resultado:** ✅ Aprobado

---

### Issues encontrados

#### 🔴 Bloqueantes
Sin issues bloqueantes.

#### 🟡 Importantes

- **[EXP-001]** La zona de gesture del drag handle puede entrar en conflicto con el gesto vertical de navegación de meses dentro de la zona de contenido.
  - **Qué viola:** Architecture sección 13 — "Deshabilitar scroll nativo del navegador en el área del calendario durante un gesto activo para evitar conflictos."
  - **Estado:** Es un problema de implementación técnica, no de diseño visual. El wireframe ya define las dos zonas (drag handle vs contenido). La resolución técnica corresponde al developer en `useSwipeGestures.ts` usando `@use-gesture/react` con detección de zona de inicio del gesto.
  - **Acción diseño:** Documentado en notas de animación (sección DRAG DISMISS vs NAVEGACIÓN ENTRE MESES).

#### 🟢 Sugerencias

- **[EXP-002]** Para la navegación rápida por días (ej: el usuario quiere ir 7 días adelante), actualmente requiere 7 taps o swipes. Considerar long-press en los botones ⟨⟩ para navegación acelerada.
  - **Beneficio:** Mejora la usabilidad para usuarios que hacen búsquedas de fechas lejanas.
  - **Decisión:** No se implementa en MVP (Out of scope). La pantalla `/search` cubre el caso de búsqueda de fecha específica.

---

### Resumen

- 🔴 Bloqueantes: 0
- 🟡 Importantes: 1 — conflicto de gestos documentado para el developer, no requiere cambio de diseño
- 🟢 Sugerencias: 1 — long-press descartado en favor de `/search` para MVP
- **Próximo paso:** Puede avanzar a desarrollo.

---

## Checklist de entrega

- [x] Wireframe mobile — estado `default` (1 config)
- [x] Wireframe desktop — estado `default`
- [x] Wireframe mobile — estado `multiple-configs`
- [x] Wireframe mobile — estado `overflow` (7+ configs)
- [x] Wireframe mobile — estado `empty-day` (antes de cycleStartDate)
- [x] Detalle de variantes de estado por config (entrada, salida, en turno, franco)
- [x] Comportamiento general (apertura, cierre, navegación, ajuste de día)
- [x] Zonas de gesto definidas (drag handle vs contenido)
- [x] Notas de accesibilidad completas (focus trap, aria-modal, live regions)
- [x] Notas de animación y transición (apertura, cierre, navegación, drag dismiss)
- [x] Verificación contra criterios US-013
- [x] Design review ejecutado (✅ Aprobado)

---

*Generado por: Agente UX/UI Designer — DateOnDuty — Feb 2026*
*Siguiente artefacto: Onboarding — SwipeAnimation + ConfigBanner simultáneos*
