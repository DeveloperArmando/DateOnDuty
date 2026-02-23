# Componente: DayExpandedPanel
**Feature:** calendar
**Archivo en arquitectura:** `src/features/calendar/components/DayExpandedPanel.tsx`
**US de referencia:** US-013
**Descripción:** Contenido del panel de detalle de un día. Se renderiza dentro de un `<BottomSheet>` (mobile) o modal centrado (desktop). Muestra el resumen completo de todas las configuraciones activas para un día específico, con navegación entre días/meses y acceso a la pantalla de búsqueda.
**Reutilización:** No — exclusivo de `features/calendar/`. Es el *contenido* del overlay, no el overlay en sí (eso es `BottomSheet`).

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `date` | `Date` | Día a mostrar |
| `configs` | `DayResult[]` | Resultados calculados por el Core Engine para ese día |
| `onClose` | `() => void` | Callback para cerrar el panel |
| `onNavigate` | `(direction: "prev" \| "next", unit: "day" \| "month") => void` | Callback de navegación |

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por |
|---|---|---|
| `with-configs` | Lista de configuraciones con franjas de color | `configs.length > 0` con al menos uno no `off_duty` |
| `all-off-duty` | Mensaje "Día libre" con ícono `Coffee` | Todas las configs son `off_duty` |
| `overflow-scroll` | Lista scrolleable + máscara de gradiente inferior | Más configs de las que caben en el viewport |
| `navigating` | Animación de transición suave al cambiar de día | `onNavigate` invocado |

---

## 4. Anatomía Visual (ASCII)

### Mobile — estado con-configs
```
┌──────────────────────────────────────────────┐
│              ─────                           │  ← drag handle (del BottomSheet)
├──────────────────────────────────────────────┤
│  [‹día] [‹mes]  Martes, 17 feb  [mes›] [día›]│  ← header sticky
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ████  Mi turno          [LogIn] 8:00  │  │  ← config row: color border-l-4
│  │       Entrada a las 8:00 am            │  │     ícono de estado + hora
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ ████  Turno noche     [Clock] en turno │  │
│  │       En turno desde las 20:00         │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ ████  Adicional-2  [Coffee] franco     │  │
│  │       Día libre                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  🔍  Ver en buscador de fechas  →     │  │  ← Button ghost, al final
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### Header sticky (sub-componente interno: DayExpandedHeader):
```
┌──────────────────────────────────────────────┐
│ [‹día] [‹mes]  Mar, 17 feb 2026  [mes›] [día›]│
└──────────────────────────────────────────────┘
  ChevronLeft ×2    text-base font-semibold    ChevronRight ×2
  (doble flecha      text-primary              (‹mes = mes ant.,
  = más salto)       centrado                   ‹día = día ant.)

  Anotación: ‹mes y mes› cambian el mes visualizado en el calendario subyacente.
             ‹día y día› cambian el día dentro del mes visible.
```

### Fila de configuración (sub-componente: DayConfigRow):
```
┌───────────────────────────────────────────────┐
│ ║  [ícono 18px]  Nombre config   hora (si hay)│
│ ║  Texto descriptivo del estado               │
└───────────────────────────────────────────────┘
  ║ = border-left-4 con style inline: color del config
      (opacidad 40% si es off_duty/franco)

  Íconos por estado:
  - ENTRADA:  LogIn    (lucide-react)
  - SALIDA:   LogOut   (lucide-react)
  - EN TURNO: Clock    (lucide-react)
  - FRANCO:   Coffee   (lucide-react)

  Textos descriptivos:
  - ENTRADA:  "Entrada a las {hora}"
  - SALIDA:   "Salida a las {hora}"
  - EN TURNO: "En turno" (sin hora)
  - FRANCO:   "Día libre"
```

### Desktop — modal centrado
```
┌──────────────────────────────────────────────┐
│  Mar, 17 feb 2026                      [✕]  │  ← header, botón cerrar en esquina
│  ‹mes ‹día                       día› mes›  │  ← controles de navegación
├──────────────────────────────────────────────┤
│  [fila config 1]                             │
│  [fila config 2]                             │
│  [fila config 3]                             │
│                                              │
│  [🔍  Ver en buscador]                      │
└──────────────────────────────────────────────┘
  max-w-lg, max-h-[70vh], overflow-y: auto
```

### Estado all-off-duty:
```
│              ☕                              │  ← Coffee 48px, text-disabled
│           Día libre                          │  ← text-secondary
│    Ningún turno activo este día              │  ← text-secondary, text-sm
```

### Máscara de gradiente (overflow):
```
│  [última fila visible]                       │
│  ████████████████████████████████████████   │  ← gradiente: surface-elevated → transparent
│                                              │     pseudo-elemento ::after, altura 32px
│  [🔍 Ver en buscador]                       │  ← siempre visible, fuera del scroll
```

---

## 5. Diseño Responsive

| Breakpoint | Cambio |
|---|---|
| mobile (< 1024px) | Contenido en `<BottomSheet size="lg">`. Drag handle visible. Sin botón ✕. |
| desktop (≥ 1024px) | Modal centrado `max-w-lg`. Botón ✕ en esquina superior derecha. Sin drag handle. Sin BottomSheet — modal propio. |

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` (panel) | Heredado del `BottomSheet` / modal — `--color-surface-elevated` | |
| `border-left-color` (config row) | `style inline: config.color` | Color dinámico del usuario |
| `border-left-color` (off-duty) | `style inline: config.color` con `opacity: 0.40` | Diferenciado visualmente |
| `color` (ícono de estado) | `--color-text-secondary` | Íconos neutros, no de color |
| `color` (hora) | `--color-text-primary` | Información de alta importancia |
| `color` (texto descriptivo) | `--color-text-secondary` | |
| `background-color` (gradiente máscara) | `--color-surface-elevated → transparent` | `linear-gradient(to bottom, ...)` |
| `padding` (config row) | `12px 16px` | |
| `gap` (entre filas) | `8px` | |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML contenedor: <section aria-label="Detalle del martes 17 de febrero">
- DayExpandedHeader: <div role="group" aria-label="Navegación de días">
- Botones navegación: aria-label="Día anterior" / "Día siguiente" / "Mes anterior" / "Mes siguiente"
- Lista de configs: <ul aria-label="Turnos activos">
- Cada config: <li> (no interactivo — solo informativo)
- Estado off-duty: aria-label descriptivo de que no hay turnos activos

TECLADO:
- Escape: cierra el panel (delegado al BottomSheet parent)
- Tab: navega header → filas de config → botón búsqueda
- Flechas en botones de navegación: no aplica (son botones independientes)

FOCUS:
- Al abrir: foco va al primer elemento del header (botón ‹día)
- Al navegar a otro día: foco se mantiene en el control que activó la navegación
- Al cerrar (desktop): foco regresa a la DayCell que abrió el panel

ANUNCIO:
- Cuando el panel cambia de día: aria-live="polite" en el contenedor del contenido
  para anunciar el nuevo día a lectores de pantalla
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Slide horizontal (cambio de día) | Botones ‹día / día› | `duration-fast` (150ms) | `ease-in-out` |
| Slide vertical (cambio de mes) | Botones ‹mes / mes› | `duration-fast` (150ms) | `ease-in-out` |
| Fade de máscara gradiente | Scroll | Inmediato | — |

> La apertura/cierre del panel la gestiona `BottomSheet`, no este componente.

---

## 9. Notas para el Developer Agent

- **Este componente NO calcula turnos.** Recibe `configs: DayResult[]` ya calculados del hook `useCalendar` o del store.
- **Casos edge de navegación:** Si el usuario navega al día 31 y el mes siguiente tiene 30, ir al último día disponible (`lastDayOfMonth(newDate)`). Silencioso, sin mensaje.
- **Header sticky dentro del scroll:** El header con los controles de navegación usa `position: sticky; top: 0` dentro del panel del BottomSheet. El `overflow-y: auto` está en el contenedor de la lista, no en el panel completo. El botón de búsqueda también es sticky (`bottom: 0`).
- **Botón "Ver en buscador":** Llama `uiStore.setSearchDate(date)` → `navigate("/search")`. El estado del search se pre-carga con la fecha del panel.
- **Íconos por estado:** Importar individualmente de lucide-react: `import { LogIn, LogOut, Clock, Coffee } from 'lucide-react'`.
- **timeFormat:** La hora en las filas se formatea según `config.timeFormat`. Usar el helper `formatShiftTime(time, timeFormat)` que se define en `src/features/calendar/utils/`.
- **DayExpandedHeader y DayConfigRow** pueden ser sub-componentes internos de DayExpandedPanel (no exportados como independientes), a menos que su complejidad justifique extraerlos.
