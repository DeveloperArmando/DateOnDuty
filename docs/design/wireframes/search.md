# Wireframe: Search — Búsqueda por Fecha
**Rol:** UX/UI Designer Senior
**Fecha:** Feb 2026
**Skill invocado:** /skill-wireframe search
**US de referencia:** US-006
**Artefacto:** docs/design/wireframes/search.md

---

## Descripción

La pantalla de búsqueda permite al usuario seleccionar cualquier fecha (pasada o futura, sin límite) mediante un calendario interactivo y ver el estado de turno de todas sus configuraciones activas para esa fecha.

**Comportamiento de apertura:** La pantalla pre-selecciona la fecha de hoy y muestra el resultado inmediatamente — sin estado vacío. El usuario puede cambiar la fecha tocando cualquier día del picker.

**Relación con el calendario principal:** El botón "Ver en calendario" al final de los resultados navega a `/` y posiciona el calendario principal en el mes de la fecha buscada (via `ui-store.setViewDate`).

---

## Estado: con-fecha-seleccionada (vista principal)

*Fecha seleccionada = hoy (pre-seleccionado al abrir). Default activo + 2 adicionales activas.*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Buscar fecha                      │  [1]
│──────────────────────────────────────│
│                                      │
│     ⟨ 2026 ⟩      ∧ FEB ∨          │  [2]
│                                      │
│  Do    Lu    Ma    Mi    Ju  Vi   Sá  │  [3]
│──────────────────────────────────────│
│   1     2     3     4     5    6    7 │
│   8     9    10    11    12   13   14 │
│  15    16    17    18    19   20   21 │
│ (22)   23    24    25    26   27   28 │  [4]
│                                      │
│──────────────────────────────────────│
│  vie 22 de febrero, 2026             │  [5]
│──────────────────────────────────────│
│                                      │
│  MI TURNO                            │  [6]
│ ┌────────────────────────────────┐   │
│ │ [●]  ↑  Entrada    8:00 AM    │   │  [7]
│ │      Mi turno  ·  24x48       │   │
│ └────────────────────────────────┘   │
│                                      │
│  ADICIONALES ACTIVAS  (2)            │  [8]
│ ┌────────────────────────────────┐   │
│ │ [●]  Turno de Armando  ○ Franco│   │  [9]
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ [●]  Turno de Lu…   ◉ En Turno│   │  [10]
│ └────────────────────────────────┘   │
│                                      │
│──────────────────────────────────────│
│ [ 📅  Ver febrero 2026 en calendario ]│  [11]
│──────────────────────────────────────│
│   Términos  ·  Privacidad  ·  Feedback│
└──────────────────────────────────────┘
```

**Leyenda de estado en filas de resultado:**

| Símbolo | Estado | Color del icono |
|---|---|---|
| `↑ Entrada  HH:MM` | Entrada ese día | `text-feedback-success` |
| `↓ Salida   HH:MM` | Salida ese día | `text-feedback-warning` |
| `◉ En Turno` | En turno (sin cambio de horario ese día) | `text-text-primary` |
| `○ Franco` | Día de descanso | `text-text-disabled` |

---

## Estado: fecha-futura-seleccionada

*Estructura idéntica al estado anterior. Solo cambian los valores de fecha y resultado.*

```
/* mobile — 360px (solo zona de picker, ilustración de fecha futura) */

│     ⟨ 2026 ⟩      ∧ MAR ∨          │
│                                      │
│  Do    Lu    Ma    Mi    Ju  Vi   Sá  │
│──────────────────────────────────────│
│   1     2     3     4     5    6    7 │
│   8     9    10    11    12   13   14 │
│  15    16    17    18    19   20   21 │
│  22    23   (24)   25    26   27   28 │  ← 24 seleccionado
│  29    30    31                       │
│                                      │
│──────────────────────────────────────│
│  mar 24 de marzo, 2026               │
│──────────────────────────────────────│
│  MI TURNO                            │
│ ┌────────────────────────────────┐   │
│ │ [●]  ○  Franco                │   │
│ │      Mi turno  ·  24x48       │   │
│ └────────────────────────────────┘   │
```

> La estructura de resultados es idéntica en todos los casos. Solo cambian los valores. Los estados `Entrada`, `Salida`, `En Turno` y `Franco` se renderizan con el mismo componente.

---

## Estado: solo-default (sin configuraciones adicionales activas)

*Solo Mi turno activo. No se muestra la sección ADICIONALES.*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Buscar fecha                      │
│──────────────────────────────────────│
│                                      │
│     ⟨ 2026 ⟩      ∧ FEB ∨          │
│                                      │
│  [... picker de febrero ...]         │
│  (22) seleccionado                   │
│                                      │
│──────────────────────────────────────│
│  vie 22 de febrero, 2026             │
│──────────────────────────────────────│
│                                      │
│  MI TURNO                            │
│ ┌────────────────────────────────┐   │
│ │ [●]  ↑  Entrada    8:00 AM    │   │
│ │      Mi turno  ·  24x48       │   │
│ └────────────────────────────────┘   │
│                                      │
│  (sin sección ADICIONALES)           │  [12]
│                                      │
│──────────────────────────────────────│
│ [ 📅  Ver febrero 2026 en calendario ]│
│──────────────────────────────────────│
│   Términos  ·  Privacidad  ·  Feedback│
└──────────────────────────────────────┘
```

---

## Estado: múltiples-configs — con todas las variantes de estado

*Muestra los cuatro posibles estados de resultado en un mismo día para distintas configs.*

```
/* mobile — 360px (solo zona de resultados) */

│──────────────────────────────────────│
│  jue 15 de enero, 2026               │
│──────────────────────────────────────│
│                                      │
│  MI TURNO                            │
│ ┌────────────────────────────────┐   │
│ │ [●]  ↓  Salida     8:00 AM    │   │  ← Salida
│ │      Mi turno  ·  24x48       │   │
│ └────────────────────────────────┘   │
│                                      │
│  ADICIONALES ACTIVAS  (3)            │
│ ┌────────────────────────────────┐   │
│ │ [●]  Turno A      ↑ Entrada    │   │  ← Entrada
│ │                   6:00 AM      │   │
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ [●]  Turno B     ◉ En Turno   │   │  ← En Turno
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ [●]  Turno de L…  ○ Franco    │   │  ← Franco
│ └────────────────────────────────┘   │
```

---

## Variante Desktop (1280px)

*Layout de dos columnas: picker a la izquierda, resultados a la derecha.*

```
/* desktop — 1280px, contenedor max-w-4xl centrado */

┌─────────────────────────────────────────────────────────────────────┐
│  ⟨  Buscar fecha                                                     │  [1]
│─────────────────────────────────────────────────────────────────────│
│                                                                     │
│  ┌──────────────────────────┐   ┌───────────────────────────────┐  │
│  │                          │   │                               │  │
│  │   ⟨ 2026 ⟩  ∧ FEB ∨   │   │  vie 22 de febrero, 2026      │  │  [5d]
│  │                          │   │ ─────────────────────────────│  │
│  │ Do  Lu  Ma  Mi  Ju Vi Sá │   │                               │  │
│  │ ─────────────────────── │   │  MI TURNO                     │  │
│  │  1   2   3   4   5  6  7 │   │ ┌─────────────────────────┐  │  │
│  │  8   9  10  11  12 13 14 │   │ │[●] ↑ Entrada  8:00 AM  │  │  │
│  │ 15  16  17  18  19 20 21 │   │ │    Mi turno  ·  24x48  │  │  │
│  │(22) 23  24  25  26 27 28 │   │ └─────────────────────────┘  │  │
│  │                          │   │                               │  │
│  └──────────────────────────┘   │  ADICIONALES ACTIVAS  (2)    │  │
│                                 │ ┌─────────────────────────┐  │  │
│                                 │ │[●] Turno de Armando  ○  │  │  │
│                                 │ └─────────────────────────┘  │  │
│                                 │ ┌─────────────────────────┐  │  │
│                                 │ │[●] Turno de Lu… ◉ En T. │  │  │
│                                 │ └─────────────────────────┘  │  │
│                                 │                               │  │
│                                 │ [📅 Ver feb 2026 en calend.] │  │  [11d]
│                                 └───────────────────────────────┘  │
│─────────────────────────────────────────────────────────────────────│
│              Términos de uso  ·  Privacidad  ·  Feedback            │
└─────────────────────────────────────────────────────────────────────┘
```

> En desktop el picker y los resultados están en columnas fijas (`max-w-xs` + `flex-1`). El picker tiene su propio scroll si el mes tiene 6 filas. Los resultados tienen scroll independiente si hay muchas configs adicionales.

---

## Anotaciones

**[1] — Top bar de Search**
- `⟨` = icono `ChevronLeft` de lucide-react. Retorna a `/` via `useNavigate(-1)` o `<Link to="/">`.
- `aria-label="Volver al calendario"`.
- Título "Buscar fecha" en `text-lg font-semibold text-text-primary`.
- No hay otras acciones en el top bar (sin ⚙, sin ☾, sin [?] — la búsqueda es una pantalla enfocada).

**[2] — Cabecera de navegación del date picker**
- Dos controles de navegación: `⟨ 2026 ⟩` (año) y `∧ FEB ∨` (mes).
- Misma convención que la barra principal del calendario, pero centrada y sin otros elementos.
- `⟨ 2026 ⟩`: flechas `ChevronLeft`/`ChevronRight` de lucide-react, 18px. Navegan por año (+1/-1).
- `∧ FEB ∨`: flechas `ChevronUp`/`ChevronDown` de lucide-react, 18px. Navegan por mes (+1/-1).
- Texto del mes: `text-base font-semibold text-text-primary` (nombre completo si cabe, abreviado si no).
- RG-001: todos los botones de navegación siempre activos. No hay límite de navegación.
- Los controles de navegación del picker mueven solo el picker — no afectan la vista del calendario principal (ui-store no se actualiza aquí, solo el estado interno del picker).
- El estado del picker (mes/año visible) se guarda en estado local del componente (`useState`), no en el store.

**[3] — Cabeceras de días de la semana**
- Idénticas al calendario principal: Do/Lu/Ma/Mi/Ju/Vi/Sá.
- `firstDayOfWeek` del `theme-store` aplica aquí también. Si el usuario configuró lunes como primer día, el orden cambia.
- `text-xs font-medium text-text-secondary`.

**[4] — Celda del date picker**
- Celdas: `min-w-[44px] min-h-[44px]` (touch target mínimo). Centrado de número en cada celda.
- Número: `text-sm font-medium`.
- **Seleccionado `(22)`:** `bg-interactive-primary text-white rounded-full`.
- **Hoy (si no está seleccionado):** `ring-2 ring-interactive-primary rounded-full text-interactive-primary`.
- **Hoy + seleccionado:** solo el fondo lleno (`bg-interactive-primary text-white`) — el ring no se muestra al mismo tiempo.
- **Días de otros meses** (días antes del 1 o después del último del mes mostrado): se muestran en `text-text-disabled`. Son tocables y seleccionables — seleccionarlos navega el picker al mes correspondiente.
- **No hay días deshabilitados** — todos los días son seleccionables sin restricción.
- `role="gridcell"`, `aria-selected="true|false"`, `aria-label="{día} de {mes} de {año}"`.
- Teclado: flechas navegan entre celdas, Enter/Space seleccionan.

**[5] — Línea de fecha seleccionada**
- Formato: `{día de semana abreviado} {número} de {mes}, {año}` — ej. "vie 22 de febrero, 2026".
- Renderizado con `format(selectedDate, "EEE d 'de' MMMM, yyyy", { locale: es })` de date-fns.
- `text-base font-semibold text-text-primary`. Actúa como separador visual entre picker y resultados.
- No es interactivo. Anuncio para screen readers via `aria-live="polite"` al cambiar (para anunciar la nueva fecha seleccionada).

**[6] — Sección "MI TURNO" (config default)**
- Etiqueta de sección: `text-xs font-semibold uppercase tracking-wide text-text-secondary`.
- Siempre presente — la config default siempre está activa.
- Solo una fila (la config default).

**[7] — Resultado de Mi turno (card)**
- `[●]` = color swatch 20px, `rounded-full`, `style={{ backgroundColor: config.color }}`, `border border-border-default` para colores claros.
- Ícono de estado (16px lucide-react):
  - `LogIn` para Entrada — `text-feedback-success`
  - `LogOut` para Salida — `text-feedback-warning`
  - `Clock` para En Turno — `text-text-primary`
  - `Coffee` para Franco — `text-text-disabled`
- Texto de estado en `text-base font-semibold`, mismo color que el ícono.
- Tiempo (si Entrada o Salida): en `text-sm text-text-secondary`. Formato según `config.timeFormat`.
- Texto secundario: "Mi turno · {scheme}" en `text-xs text-text-secondary`.
- Card: `bg-surface-elevated rounded-lg p-3 border border-border-default`.
- La card de Mi turno no tiene acciones (no tap target más allá de la info).

**[8] — Sección "ADICIONALES ACTIVAS (N)"**
- Solo se muestra si hay al menos una configuración adicional activa.
- Si no hay ninguna adicional activa: la sección no se renderiza (sin mensaje de estado vacío — simplemente no aparece).
- El `(N)` es el conteo de adicionales activas en este momento. No incluye las inactivas.
- Etiqueta de sección: mismo estilo que [6].

**[9][10] — Filas de configuraciones adicionales**
- Misma estructura que el card de Mi turno [7], pero más compactas y sin el subtexto del scheme.
- Nombre de configuración: `text-sm font-semibold text-text-primary`. Si el nombre supera el espacio disponible: `truncate` + `title={config.name}` (RG-006).
- La fila es `role="listitem"`. No es interactiva (no es tap target).
- [●] color swatch 16px (más pequeño que el de Mi turno).
- El ícono de estado es 14px (más pequeño que en Mi turno).
- Orden de las filas: mismo orden que en el store (orden de creación). Config default primero (MI TURNO), luego adicionales activas en orden.

**[11] — Botón "Ver en calendario"**
- Icono `CalendarDays` de lucide-react, 16px, a la izquierda del texto.
- Texto dinámico: "Ver {mes} {año} en el calendario" — ej. "Ver febrero 2026 en el calendario".
- Al tocar:
  1. `ui-store.setViewDate(selectedDate)` — posiciona el calendario principal en ese mes.
  2. `navigate("/")` — navega al calendario.
- Sticky: `position: sticky; bottom: 0`. Con fondo `bg-surface-base` para cubrir el contenido al hacer scroll.
- Botón primario: `bg-interactive-primary text-white rounded-lg`.
- RG-001: siempre activo. Se muestra desde el inicio (fecha pre-seleccionada = hoy).

**[12] — Sin sección ADICIONALES**
- Cuando no hay ninguna configuración adicional activa, la sección ADICIONALES ACTIVAS simplemente no se renderiza.
- No se muestra ningún mensaje de "sin configs" ni estado vacío — la pantalla de búsqueda es funcional con solo Mi turno.
- El botón "Ver en calendario" queda justo debajo del card de Mi turno.

---

## Comportamiento del date picker (detalle de interacción)

### Cambio de fecha
1. Usuario toca una celda → `setSelectedDate(date)` (estado local del picker).
2. El componente `<SearchResult />` recalcula inmediatamente con la nueva fecha.
3. El cálculo usa `calculateShiftForDay(config, date)` del Core Engine.
4. No hay loading state — el cálculo es síncrono y O(1).
5. La línea de fecha [5] se actualiza con la nueva fecha formateada.
6. `aria-live="polite"` en la línea de fecha anuncia el cambio a screen readers.

### Cambio de mes en el picker
1. Tocar `⟨ 2026 ⟩` o `∧ FEB ∨` actualiza solo el mes visible en el picker.
2. Si la fecha seleccionada estaba en el mes anterior, se mantiene seleccionada — los resultados no cambian.
3. Si el usuario selecciona un día en el nuevo mes, la fecha seleccionada cambia.
4. El picker navega hacia el mes que contiene la fecha seleccionada si el usuario navega lejos y luego regresa (no es obligatorio, pero es UX amigable).

### Días de meses adyacentes en el grid
- Los días del mes anterior o siguiente que aparecen en el grid (para completar la primera/última semana) se muestran en `text-text-disabled`.
- Son tocables. Tocarlos: (1) selecciona esa fecha, (2) navega el picker a ese mes.

---

## Estados cubiertos

| Estado | Wireframe |
|---|---|
| ✅ `con-fecha-seleccionada` (hoy, default + 2 adicionales activas) | Estado principal |
| ✅ `fecha-futura` (estructura idéntica, valores diferentes) | Ilustración parcial |
| ✅ `solo-default` (sin sección ADICIONALES) | Estado: solo-default |
| ✅ `todas-variantes-de-estado` (Entrada, Salida, En Turno, Franco en una vista) | Estado: múltiples-configs |
| ✅ Desktop (dos columnas) | Variante desktop |
| — `fecha-antes-de-cycleStartDate` | No dibujado — comportamiento idéntico (PRD US-006 edge case: cálculo normal) |
| — `picker-año-lejano` | No dibujado — misma estructura, picker navega mes a mes |

---

## Notas de Accesibilidad

```
A11Y:

TOP BAR:
- header landmark o role="banner" con aria-label="Buscar fecha".
- ⟨ back: role="button", aria-label="Volver al calendario".

DATE PICKER:
- El grid del picker: role="grid", aria-label="Seleccionar fecha".
- Cabecera del mes: aria-live="polite" — anuncia el mes cuando cambia.
- Cada fila de la semana: role="row".
- Cada celda de día: role="gridcell", aria-selected="true|false",
  aria-label="{número} de {mes} de {año}".
- Teclas de navegación:
  - Flechas (←→↑↓): navegan entre celdas del grid.
  - Enter / Space: seleccionan el día en foco.
  - PageUp / PageDown: mes anterior / siguiente.
  - Ctrl+PageUp / Ctrl+PageDown: año anterior / siguiente.
- Primer foco al abrir la pantalla: celda del día pre-seleccionado (hoy).
- Los días de meses adyacentes tienen aria-label con la fecha completa para que screen readers no confundan.

LÍNEA DE FECHA SELECCIONADA:
- aria-live="polite" — anuncia la nueva fecha al cambiar selección.
- Texto completo: "Resultado para el viernes 22 de febrero de 2026".

RESULTADOS:
- Sección "MI TURNO": role="region" con aria-label="Mi turno".
- Sección "ADICIONALES": role="region" con aria-label="Configuraciones adicionales activas".
- Cada fila de resultado: role="listitem" dentro de <ul role="list">.
- El ícono de estado (LogIn, LogOut, Clock, Coffee): aria-hidden="true".
- El texto del estado es visible y legible — suficiente para screen reader sin describir el ícono.
- El color swatch [●]: aria-hidden="true" (decorativo; el color no transmite información única).

BOTÓN "VER EN CALENDARIO":
- aria-label="Ver {mes} {año} en el calendario principal".
- Siempre visible y activo desde que hay una fecha seleccionada.
- Focus visible: ring-2 ring-focus-ring.
```

---

## Verificación PRD

| Criterio | US | Estado |
|---|---|---|
| Date picker tipo calendario interactivo (no text input) | US-006 | ✅ Grid de días con selección |
| Resultado: config default primero, con hora si aplica | US-006 | ✅ Sección MI TURNO [6][7] |
| Resultado: adicionales activas con nombre, estado, hora | US-006 | ✅ Sección ADICIONALES [8][9][10] |
| 4 estados: Entrada (hora), Salida (hora), Franco, En Turno | US-006 | ✅ Ilustrado en estado múltiples-configs |
| Botón para navegar al mes en el calendario principal | US-006 | ✅ [11] con ui-store.setViewDate |
| Fechas pasadas y futuras sin límite | US-006 | ✅ Sin días deshabilitados en picker [4] |
| Nombres truncados si overflow (RG-006) | US-006 | ✅ Anotación [9][10] con truncate + title |
| Edge case: fecha antes de cycleStartDate → cálculo normal | US-006 | ✅ Documentado, misma estructura de resultado |
| RG-001: botones siempre activos | Global | ✅ Todos los botones del picker y VER en calendario |

---

## Design Review: Search

**Fecha de revisión:** Feb 2026
**Revisado por:** UX/UI Designer Agent
**Resultado:** ✅ Aprobado

---

### Issues encontrados

#### 🔴 Bloqueantes
Sin issues bloqueantes.

#### 🟡 Importantes
Sin issues importantes.

#### 🟢 Sugerencias

- **[SR-001]** En la versión móvil, el picker ocupa mucho espacio vertical (≈260px), lo que obliga al usuario a hacer scroll para ver los resultados. Considerar un picker colapsable (mostrar/ocultar con toggle).
  - **Beneficio:** El usuario que conoce la fecha puede saltar directamente a los resultados sin ver el picker.
  - **Decisión:** Descartado para MVP. El picker siempre visible es más predecible y no requiere estado de UI extra. En v1.1 se puede considerar si el feedback indica fricción.

- **[SR-002]** Añadir indicadores en el picker para días que tienen "Entrada" (punto verde pequeño debajo del número), similar a los calendarios de citas.
  - **Beneficio:** El usuario puede identificar visualmente sus días de entrada sin seleccionar cada uno.
  - **Decisión:** Descartado para MVP. Añadiría N cálculos por cada celda visible (≈35 llamadas al Core Engine al renderizar el picker). Impacto en performance percibida. Candidato para v1.1 con memoización.

---

### Resumen
- Bloqueantes: 0
- Importantes: 0
- Sugerencias: 2 (ambas descartadas)
- **Próximo paso:** Puede avanzar a desarrollo.

---

*Siguiente artefacto: Import URL Modal — overlay de importación de configuración vía `?cfg=`.*
