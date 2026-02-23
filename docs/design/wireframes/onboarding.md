# Wireframe: Onboarding
**Rol:** UX/UI Designer Senior
**Fecha:** Feb 2026
**Skill invocado:** /skill-wireframe onboarding
**US de referencia:** US-009, US-011
**Artefacto:** docs/design/wireframes/onboarding.md

---

## Descripción

El onboarding no es una pantalla independiente. Son **dos componentes superpuestos** sobre el calendario (`/`) que aparecen simultáneamente en la primera apertura de la app:

| Componente | Rol | Duración | Interacción |
|---|---|---|---|
| `<ConfigBanner />` | Invita a configurar el turno | 50 segundos (auto-dismiss) | Tap → `/config` |
| `<SwipeAnimation />` | Enseña los gestos de navegación | 8 segundos (fade-out) | Ninguna (solo visual) |

**El calendario es completamente usable mientras ambos están visibles.** Ninguno es un gate ni un bloqueo. El estado default del calendario (24x48, hoy como día 1, entrada 8:00) se muestra inmediatamente detrás de los componentes de onboarding.

**Flag de onboarding:** guardado en `dod-onboarding.animationSeen` y `dod-onboarding.bannerSeen` — únicamente cuando el temporizador de 50s completa. Si el usuario cierra el navegador o navega fuera antes de que expiren los 50s, el flag NO se guarda y el onboarding se repite en la siguiente apertura.

---

## Estado 1: primer-acceso-completo (0–8s)

*SwipeAnimation visible + ConfigBanner visible. Ambos sobre el calendario con estado default.*

```
/* mobile — 360px */
/* Estado: primer-acceso-completo (0s – 8s) */

┌──────────────────────────────────────────┐
│ ⚙    ⟨ 2026 ⟩    ∧ FEB ∨    [?]  ☾   │  [1]
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
│                                          │
│ ✦  Configura tu horario de trabajo   ⟩  │  [2]
│    Toca aquí para personalizar tus turnos│
│                                          │
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
│  Do    Lu    Ma    Mi    Ju    Vi    Sá  │  [3]
│──────────────────────────────────────────│
│   1     2     3     4     5     6     7  │
│  (─)   (─)   (─)   (─)   (─)   (─)  (─)│  [4]
│                                          │
│   8     9    10    11    12    13    14  │
│  (─)   (─)   (─)   (─)   (─)   (─)  (─)│
│                                          │
│       ╔══════════════════╗               │  [5]
│       ║  ∧   meses   ∨  ║               │
│       ║  ~ ~ ~ ● ~ ~ ~  ║               │
│       ║  ⟨   años    ⟩  ║               │
│       ╚══════════════════╝               │
│                                          │
│  15    16    17    18    19    20    21  │
│  (─)   (─)   (─)   (─)   (─)   (─)  (─)│
│                                          │
│  22◉   23    24    25    26    27    28  │
│ [████ ][████ ]      ·    ·   [████ ]    │  [6]
│ ↑8:00                          ↑8:00    │
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
│          [🔍  Buscar fecha]              │  [7]
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
│    Términos  ·  Privacidad  ·  Feedback  │
└──────────────────────────────────────────┘
```

**Leyenda:**
- `(─)` = día antes de `cycleStartDate` (hoy). Sin franja. Número en `text-text-disabled`.
- `[████]` = franja de turno con gradiente del color del usuario.
- `·` = día franco (sin franja). Número en `text-text-primary`.
- `◉` = hoy (22). Número en `rounded-full bg-interactive-primary text-white`.
- `∼∼` = separador visual animado (solo representación ASCII; en la UI son bordes reales).

---

## Estado 2: primer-acceso-solo-banner (8s–50s)

*SwipeAnimation ya ha hecho fade-out. Solo ConfigBanner permanece. El calendario es totalmente visible.*

```
/* mobile — 360px */
/* Estado: primer-acceso-solo-banner (8s – 50s) */

┌──────────────────────────────────────────┐
│ ⚙    ⟨ 2026 ⟩    ∧ FEB ∨    [?]  ☾   │
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
│                                          │
│ ✦  Configura tu horario de trabajo   ⟩  │  [8]
│    Toca aquí para personalizar tus turnos│
│                                          │
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
│  Do    Lu    Ma    Mi    Ju    Vi    Sá  │
│──────────────────────────────────────────│
│   1     2     3     4     5     6     7  │
│  (─)   (─)   (─)   (─)   (─)   (─)  (─)│
│                                          │
│   8     9    10    11    12    13    14  │
│  (─)   (─)   (─)   (─)   (─)   (─)  (─)│
│                                          │
│  15    16    17    18    19    20    21  │
│  (─)   (─)   (─)   (─)   (─)   (─)  (─)│
│                                          │
│  22◉   23    24    25    26    27    28  │
│ [████ ][████ ]      ·    ·   [████ ]    │
│ ↑8:00                          ↑8:00    │
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
│          [🔍  Buscar fecha]              │
│~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│
│    Términos  ·  Privacidad  ·  Feedback  │
└──────────────────────────────────────────┘
```

> En este estado el layout es idéntico al calendario normal, con la única diferencia del ConfigBanner en la parte superior. No hay diferencia estructural — solo la presencia del banner.

---

## Variante Desktop (1280px)

```
/* desktop — 1280px */
/* Estado: primer-acceso-completo (0s – 8s) */
/* Layout centrado en contenedor max-w-5xl */

┌──────────────────────────────────────────────────────────────────────────────────────┐
│              ⚙     ⟨ 2026 ⟩     ∧ FEBRERO ∨          [?]  ☾                        │  [1]
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│                                                                                      │
│     ✦  Configura tu horario de trabajo — Toca aquí para personalizar tus turnos  ⟩  │  [9]
│                                                                                      │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│   Dom       Lun       Mar       Mié       Jue       Vie       Sáb                   │
│─────────────────────────────────────────────────────────────────────────────────────│
│    1         2         3         4         5         6         7                    │
│   (─)       (─)       (─)       (─)       (─)       (─)       (─)                   │
│                                                                                      │
│    8         9        10        11        12        13        14                    │
│   (─)       (─)       (─)       (─)       (─)       (─)       (─)                   │
│                                                                                      │
│   15        16        17        18        19        20        21                    │
│   (─)       (─)       (─)       (─)       (─)                        ╔══════════╗   │
│                                                            (─)        ║ ∧ meses ∨║  │  [5]
│   22◉       23        24        25        26        27        28      ║ ~ ~ ● ~  ║  │
│  [████ ] [████ ]              ·     ·    [████ ]           ║ ⟨ años ⟩║  │
│  ↑8:00                                   ↑8:00             ╚══════════╝   │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│                         [🔍  Buscar fecha]                                           │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│                   Términos de uso  ·  Privacidad  ·  Feedback                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

> En desktop el ConfigBanner ocupa todo el ancho del contenedor pero su texto se condensa en una sola línea. La SwipeAnimation se posiciona en la esquina inferior-derecha del grid (o en el centro si el grid es visible en esa zona).

---

## Anotaciones

**[1] — Top bar**
- Idéntico al calendario normal. El onboarding no modifica la barra de navegación.
- El botón `[?]` (ayuda) sigue funcionando aunque el onboarding esté activo. Ver Help Overlay (artefacto #10).

**[2] — ConfigBanner (mobile)**
- **Componente:** `<ConfigBanner />`
- Posición: inmediatamente debajo del top bar, en el flujo del documento (no fixed).
- Dimensiones: ancho 100%, altura ~60px (con padding vertical).
- Fondo: `bg-interactive-primary/10` (10% opacidad del color primario).
- Borde izquierdo: 3px sólido `border-interactive-primary`.
- Ícono izquierdo: `Sparkles` de lucide-react (16px, color `interactive-primary`).
- Texto principal: "Configura tu horario de trabajo" — `text-sm font-semibold text-text-primary`.
- Texto secundario: "Toca aquí para personalizar tus turnos" — `text-xs text-text-secondary`.
- Ícono derecho: `ChevronRight` de lucide-react (16px, `text-text-secondary`).
- **El banner completo es el área de toque.** `role="button"`, `aria-label="Ir a configurar horario de trabajo"`.
- **Sin botón de cierre** — el usuario puede ignorarlo; desaparece automáticamente a los 50s.
- **Tap** → navega a `/config` vía `useNavigate`. El flag NO se guarda al navegar; se guarda solo cuando el temporizador de 50s completa.
- **Auto-dismiss a los 50s:** animación `height: auto → 0` + `opacity: 1 → 0`, `duration-normal`, `ease-default`. Luego el componente se desmonta.
- **Entrada:** `height: 0 → auto` + `opacity: 0 → 1` al montar. `duration-normal`, `ease-default`.
- **RG-001:** El banner (que actúa como botón) nunca está deshabilitado. No hay ningún estado `disabled`.

**[3] — Cabeceras de días de la semana**
- Idénticas al calendario normal: Do / Lu / Ma / Mi / Ju / Vi / Sá.
- `firstDayOfWeek` del store aplica: si el usuario tiene lunes como primer día, el orden cambia.
- En el estado "primer acceso", el valor del store es el default (domingo primero).

**[4] — Días antes de cycleStartDate**
- Los días 1-21 (anteriores a hoy, Feb 22, que es `cycleStartDate` del estado default) muestran solo el número del día en `text-text-disabled`.
- Sin franja de color, sin indicador de hora.
- **Esto es correcto y esperado.** No es un error de diseño.
- `aria-label="{día} de febrero: sin turno asignado"`.

**[5] — SwipeAnimation (card flotante)**
- **Componente:** `<SwipeAnimation />`
- Posición: `position: fixed`, centrado horizontalmente en el área del calendario.
- Vertical: centrado en la zona visible del grid del calendario (aproximadamente `top: 45%`, ajustado para no cubrir el día actual).
- Dimensiones: ~240px × 88px.
- Estilos: `bg-surface-elevated`, `shadow-md`, `rounded-lg`, `border border-border-default`.
- Contenido:
  ```
  ┌──────────────────────────┐
  │  ∧     meses      ∨      │   ← fila 1: ChevronUp + texto + ChevronDown
  │     ~ ~ ~ ● ~ ~ ~        │   ← cursor animado (punto 8px, bg-interactive-primary)
  │  ⟨     años       ⟩      │   ← fila 2: ChevronLeft + texto + ChevronRight
  └──────────────────────────┘
  ```
- **Animación del cursor** (CSS `@keyframes`):
  - 0s–2s: cursor se mueve verticalmente entre fila 1 y fila 2 (bounce suave, `ease-in-out`).
  - 2s–2.5s: pausa.
  - 2.5s–4.5s: cursor se mueve horizontalmente de extremo a extremo de la fila activa.
  - 4.5s–5s: pausa.
  - 5s–7s: ciclo vertical de nuevo.
  - 7s–7.5s: pausa.
  - 7.5s–8s: fade-out del card completo (`opacity: 1 → 0`, `duration-slow`).
- **Entrada:** `opacity: 0 → 1`, `duration-normal`, `ease-bounce`. Se monta simultáneamente con el ConfigBanner.
- **El card NO es interactivo.** `aria-hidden="true"` — es puramente visual/decorativo.
- **Con `prefers-reduced-motion`:** card estático (sin cursor animado, solo iconos + texto estáticos). Desaparece a los 8s sin transición de fade (visibilidad corta, no confusión).
- **Desktop:** posicionado en la zona de la 3ª o 4ª fila del calendario, a la derecha si hay espacio, centrado si no. Mismas dimensiones.

**[6] — Calendario de fondo (estado default)**
- El calendario muestra el estado default: 24x48, `cycleStartDate = hoy` (Feb 22 en la ilustración), entrada a las 8:00.
- **Días 1-21:** `text-text-disabled`, sin franja (antes de `cycleStartDate`).
- **Día 22 (◉ hoy):** franja con gradiente del color default (`#2563EB`), indicador "↑8:00" (entrada).
- **Día 23:** franja sin hora (en turno, el turno empezó ayer).
- **Día 24:** franja con "↓8:00" en esquina inferior derecha (salida). [No visible en wireframe por espacio, pero aplica la misma lógica que day-expanded.]
- **Días 25-26:** sin franja (franco).
- **Día 27:** nueva franja con "↑8:00" (entrada del siguiente ciclo).
- Este fondo es el resultado de la función `calculateShiftForDay()` del Core Engine — el UI no hace ningún cálculo.

**[7] — Sticky bottom bar**
- Idéntica al calendario normal: `[🔍 Buscar fecha]` siempre visible.
- El botón "Volver a hoy" NO aparece porque el mes mostrado ES el mes actual.
- La barra sticky no interactúa con el banner ni con la animación.

**[8] — ConfigBanner en estado solo-banner (8s–50s)**
- El banner es visualmente idéntico al del estado anterior.
- La SwipeAnimation ya no existe en el DOM (fue desmontada tras su fade-out a los 8s).
- El calendario ocupa su espacio visible habitual, sin la card flotante.
- El contador de 50s sigue corriendo desde que el banner montó (no desde que la animación desapareció).
- **Comportamiento al navegar a /config desde el banner:**
  - El banner se desmonta al navegar.
  - Al volver a `/`, si el temporizador aún no completó 50s: el banner se monta de nuevo y el temporizador continúa desde el tiempo restante (implementación recomendada: guardar `startTime` en `ui-store` no persistido, calcular tiempo restante al remontar).
  - Si al volver a `/` ya pasaron 50s: el flag se guarda y el banner no aparece.
  - Developer: documentar esta lógica en el store.

**[9] — ConfigBanner en desktop**
- Misma estructura visual que mobile.
- Una sola línea de texto (sin subtext por espacio): "Configura tu horario de trabajo — Toca para personalizar tus turnos".
- O dos líneas en el caso de pantallas de entre 640px y 900px de ancho.
- Texto: `text-sm` en mobile, `text-base` en desktop.

---

## Especificación de Componentes

### `<ConfigBanner />`

```
Archivo:       src/features/onboarding/components/ConfigBanner.tsx
Props:         ninguna (lee flag de dod-onboarding vía lógica interna)
Estado interno: visible (boolean), montado/desmontado
```

**Lógica de montaje:**
1. Al montar: leer `dod-onboarding` de localStorage.
2. Si `bannerSeen === true`: no renderizar nada.
3. Si `bannerSeen !== true`: mostrar el banner + iniciar o recuperar `startTime` del `ui-store`.
4. `setTimeout` de 50s (duración completa desde `startTime`):
   - Al completar: ejecutar la animación de cierre (height → 0, opacity → 0).
   - Callback al completar animación: escribir `{ bannerSeen: true }` en `dod-onboarding` + desmontar.
5. `useEffect` cleanup: cancelar `setTimeout` si el componente se desmonta antes de 50s (ej. al navegar).
   - NO escribir el flag en el cleanup — el flag solo se escribe cuando el timer completa.

**Tokens utilizados:**
- Background: `bg-interactive-primary/10`
- Border-left: `border-l-[3px] border-interactive-primary`
- Text primary: `text-text-primary text-sm font-semibold`
- Text secondary: `text-text-secondary text-xs`
- Icon: `text-interactive-primary` (Sparkles, 16px) + `text-text-secondary` (ChevronRight, 16px)
- Height transition: `overflow-hidden transition-[height,opacity] duration-normal`

**Accesibilidad:**
- `role="button"` (o `<button>` nativo con `onClick`)
- `aria-label="Ir a configurar horario de trabajo"`
- Focus ring: `focus-visible:ring-2 focus-visible:ring-focus-ring`

---

### `<SwipeAnimation />`

```
Archivo:       src/features/onboarding/components/SwipeAnimation.tsx
Props:         ninguna (auto-contenido)
Duración:      8 segundos total (configurado en DESIGN.onboarding.animationDurationMs)
```

**Lógica:**
1. Se monta simultáneamente con `<ConfigBanner />`.
2. Inicia la animación CSS inmediatamente al montar.
3. A los 8s: la animación de fade-out se activa (CSS `animation-fill-mode: forwards`).
4. `useEffect` cleanup: cancelar cualquier `setTimeout` pendiente.
5. No escribe nada en localStorage — es puramente visual.

**Estructura JSX:**
```tsx
<div
  className="fixed z-50 left-1/2 -translate-x-1/2
             bg-surface-elevated shadow-md rounded-lg
             border border-border-default
             px-4 py-3 w-[240px]
             animate-swipe-hint"   // keyframe de fade-in + fade-out
  style={{ top: 'calc(var(--calendar-area-top) + 40%)' }}
  aria-hidden="true"
>
  <div className="flex items-center justify-between text-text-secondary text-sm mb-1">
    <ChevronUp size={16} />
    <span className="text-xs text-text-disabled">meses</span>
    <ChevronDown size={16} />
  </div>
  <div className="relative h-[8px] my-1">
    <span
      className="absolute w-2 h-2 rounded-full bg-interactive-primary
                 animate-swipe-cursor"  // keyframe de movimiento
    />
  </div>
  <div className="flex items-center justify-between text-text-secondary text-sm mt-1">
    <ChevronLeft size={16} />
    <span className="text-xs text-text-disabled">años</span>
    <ChevronRight size={16} />
  </div>
</div>
```

**CSS keyframes (en `src/index.css`):**
```css
@keyframes swipe-hint {
  0%   { opacity: 0; transform: translateX(-50%) scale(0.95); }
  5%   { opacity: 1; transform: translateX(-50%) scale(1); }
  90%  { opacity: 1; }
  100% { opacity: 0; }
  /* Duración total: var(--animation-duration-onboarding, 8000ms) */
}

@keyframes swipe-cursor-v {
  0%, 100% { top: 0; opacity: 1; }
  45%      { top: calc(100% - 8px); }
  50%      { opacity: 0.4; }
}

@keyframes swipe-cursor-h {
  0%, 100% { left: 0; opacity: 1; }
  45%      { left: calc(100% - 8px); }
  50%      { opacity: 0.4; }
}

@media (prefers-reduced-motion: reduce) {
  @keyframes swipe-hint {
    0%   { opacity: 0; }
    5%   { opacity: 1; }
    90%  { opacity: 1; }
    100% { opacity: 0; }
  }
  .animate-swipe-cursor { display: none; }
}
```

**Tokens utilizados:**
- Fondo: `bg-surface-elevated`
- Sombra: `shadow-md`
- Radio: `rounded-lg`
- Iconos: lucide-react `ChevronUp`, `ChevronDown`, `ChevronLeft`, `ChevronRight` (16px)
- Cursor: `bg-interactive-primary`, 8px × 8px, `rounded-full`
- Z-index: `z-50` (por encima de todo excepto modales)

---

## Timeline de Onboarding

```
t=0s    ┌─────────────────────────────────────────────────────────┐
        │ App abre por primera vez                                 │
        │ Calendario render con estado default (24x48)            │
        │ ConfigBanner monta → slide-down (300ms)                 │
        │ SwipeAnimation monta → fade-in + scale (400ms)         │
        └─────────────────────────────────────────────────────────┘

t=0.4s  ┌─────────────────────────────────────────────────────────┐
        │ Ambos visibles. Cursor de SwipeAnimation en movimiento. │
        │ Usuario puede usar el calendario normalmente.           │
        └─────────────────────────────────────────────────────────┘

t=7.5s  ┌─────────────────────────────────────────────────────────┐
        │ SwipeAnimation inicia fade-out (500ms).                 │
        └─────────────────────────────────────────────────────────┘

t=8s    ┌─────────────────────────────────────────────────────────┐
        │ SwipeAnimation desmontado del DOM.                      │
        │ ConfigBanner sigue visible.                             │
        └─────────────────────────────────────────────────────────┘

t=49.7s ┌─────────────────────────────────────────────────────────┐
        │ ConfigBanner inicia animación de cierre (300ms).        │
        └─────────────────────────────────────────────────────────┘

t=50s   ┌─────────────────────────────────────────────────────────┐
        │ Flag guardado: dod-onboarding = { bannerSeen: true }    │
        │ ConfigBanner desmontado.                                │
        │ Calendario en modo normal — sin elementos de onboarding.│
        └─────────────────────────────────────────────────────────┘

        ALTERNATIVA (usuario toca el banner):
t=Xs    ┌─────────────────────────────────────────────────────────┐
        │ Tap en ConfigBanner → navigate("/config").              │
        │ Banner se desmonta. Timer se detiene (cleanup).         │
        │ Flag NO guardado.                                       │
        │ Al volver a "/" → banner se monta, timer continúa.     │
        └─────────────────────────────────────────────────────────┘
```

---

## Estados cubiertos

| Estado | Wireframe | Notas |
|---|---|---|
| ✅ `primer-acceso-completo` (0–8s) | Mobile + Desktop | SwipeAnimation + ConfigBanner simultáneos |
| ✅ `primer-acceso-solo-banner` (8s–50s) | Mobile (descrito) | Solo ConfigBanner, calendario libre |
| ✅ `usuario-regresa-desde-config` | Timeline | Banner remonta, timer continúa |
| ✅ `onboarding-completado` | Implícito | Ambos componentes ausentes, calendario normal |
| ✅ `prefers-reduced-motion` | Anotación [5] | Card estático, sin cursor animado |
| — `segunda-apertura-sin-completar` | No dibujado | Idéntico a primer-acceso; timer reinicia desde 0 |

---

## Notas de Accesibilidad

```
A11Y:

ConfigBanner:
- Elemento: <button> o <div role="button" tabIndex={0}>
- aria-label: "Ir a configurar horario de trabajo"
- focus-visible: ring-2 ring-focus-ring (del design system)
- Teclado: Enter o Space activan la navegación a /config
- El texto del banner es suficientemente descriptivo; no requiere aria-describedby adicional.

SwipeAnimation:
- aria-hidden="true" — es decorativa, no transmite información funcional.
- El usuario que usa teclado/screen reader no necesita interactuar con ella.
- Los gestos que enseña tienen equivalente en los botones del top bar (∧ FEB ∨ / ⟨ 2026 ⟩) que SÍ son accesibles.

Calendario de fondo:
- Durante el onboarding, el calendario es completamente accesible.
- Tab order: top bar → ConfigBanner → celdas del calendario → bottom bar.
- El ConfigBanner se inserta en el DOM después del top bar, por lo que el Tab order es correcto.
- La SwipeAnimation tiene z-50 pero aria-hidden="true" — no interrumpe el focus trap ni el tab order.

Anuncio de onboarding para screen readers:
- Al montar el ConfigBanner, incluir un <div role="status" aria-live="polite"> con texto:
  "Tip: Configura tu horario de trabajo para personalizar el calendario."
- El texto del aria-live se anuncia una vez al montar; no interrumpe la navegación por teclado.
- Cuando el banner desaparece, no es necesario anunciarlo.

Primer foco al abrir la app:
- El foco inicial está en el botón ⚙ del top bar (primer elemento interactivo).
- El ConfigBanner es el segundo elemento en el tab order.
```

---

## Verificación PRD

| Criterio | US | Estado |
|---|---|---|
| Animación de gestos visible en primera apertura | US-009 | ✅ SwipeAnimation monta en primer acceso |
| Banner de configuración en primera apertura | US-011 | ✅ ConfigBanner monta simultáneamente |
| Ambos simultáneos | US-009/011 | ✅ Montan al mismo tiempo |
| Banner superior | US-011 | ✅ Posicionado bajo el top bar |
| Banner auto-dismiss 50s | US-011 | ✅ Timeline documentado |
| Tap en banner → /config | US-011 | ✅ Anotación [2] |
| Calendario usable durante onboarding | US-011 | ✅ Ningún elemento bloquea la interacción |
| Estado default del calendario visible inmediatamente | US-011 | ✅ 24x48 + hoy + 8:00 detrás del onboarding |
| Flag NO guardado si cierra antes de 50s | US-009 | ✅ Cleanup en useEffect cancelan el timer |
| Banner se muestra solo una vez | US-011 | ✅ Lógica de flag en localStorage |
| Animación dura sus propios 8s independientes | D-UX-001 | ✅ SwipeAnimation tiene lifecycle propio |

---

## Design Review: Onboarding

**Fecha de revisión:** Feb 2026
**Revisado por:** UX/UI Designer Agent
**Resultado:** ✅ Aprobado

---

### Issues encontrados

#### 🔴 Bloqueantes
Sin issues bloqueantes.

#### 🟡 Importantes

- **[ON-001]** El banner sin botón de cierre puede percibirse como agresivo si el usuario no quiere configurar y no quiere esperar 50s.
  - **Qué viola:** Principio UX — Control del usuario. No viola ningún criterio del PRD (el PRD no dice que deba haber X de cierre).
  - **Decisión:** **Se mantiene sin X de cierre**, fiel al PRD. El banner desaparece solo. El usuario puede ignorarlo y usar el calendario normalmente. Si en QA el comportamiento genera fricción, añadir X como mejora en v1.1. **Documentado para PO.**

#### 🟢 Sugerencias

- **[ON-002]** El banner podría incluir un indicador visual del progreso del temporizador (barra de progreso de 50s debajo del banner).
  - **Beneficio:** El usuario sabe exactamente cuándo desaparece el banner, reduciendo la incertidumbre.
  - **Decisión:** Descartado para MVP — añade complejidad visual y puede hacer el banner más llamativo de lo deseado. Candidato para v1.1 si el feedback indica confusión.

- **[ON-003]** En desktop, el ancho del ConfigBanner podría estar limitado al ancho del contenedor (max-w-5xl) para no quedar demasiado estirado en pantallas muy anchas.
  - **Beneficio:** Mejor legibilidad en ≥1280px.
  - **Decisión:** ✅ Aplicado — el banner respeta el mismo max-width que el contenedor del calendario.

---

### Resumen

- Bloqueantes: 0
- Importantes: 1 (decisión tomada, documentada para PO)
- Sugerencias: 3 (1 aplicada, 2 descartadas)
- **Próximo paso:** Puede avanzar a desarrollo.

---

*Siguiente artefacto: Config — Lista de configuraciones (`/config`) + Formulario de configuración (`/config/:id`).*
