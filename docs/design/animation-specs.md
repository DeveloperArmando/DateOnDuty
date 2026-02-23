# DateOnDuty — Animation Specs v1.0

**Rol:** UX/UI Designer Senior
**Fecha:** Feb 2026
**Estado:** Completo — listo para implementación
**Referencia:** `docs/design/design-tokens.md` (Grupo 6 — duraciones, easings, matriz)

---

## Tokens de referencia (resumen rápido)

| Token | Valor | Uso |
|---|---|---|
| `duration-fast` | `100ms` | Hover, focus, tap feedback |
| `duration-normal` | `200ms` | Transiciones de componentes |
| `duration-slow` | `300ms` | Apertura/cierre de overlays y modales |
| `duration-xslow` | `500ms` | Animaciones de onboarding |
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Mayoría de transiciones |
| `ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Modales, cards, confirmaciones |
| `ease-snap` | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | Navegación del calendario |

> **Restricción de arquitectura:** Cero Framer Motion ni React Spring en MVP. Todo es CSS transitions + CSS animations nativas. JS (`useEffect`) solo para coordinar con estado de React.

> **Nota para el Developer:** Los component specs escritos antes de este documento usan `250ms` para "duration-normal" y `150ms` para "duration-fast". Los valores correctos son los del design system (`200ms` y `100ms` respectivamente). **Este documento es la fuente de verdad** — ajustar las implementaciones a estos valores.

---

## ÍNDICE

1. [loading-dots](#1-loading-dots) — `LoadingDots.tsx`
2. [config-banner-slide](#2-config-banner-slide) — `ConfigBanner.tsx`
3. [onboarding-swipe-hint](#3-onboarding-swipe-hint) — `SwipeAnimation.tsx`
4. [calendar-month-transition](#4-calendar-month-transition) — `MonthGrid.tsx`
5. [calendar-year-transition](#5-calendar-year-transition) — `MonthGrid.tsx`
6. [day-expanded-enter](#6-day-expanded-enter) — `BottomSheet.tsx`
7. [day-expanded-exit](#7-day-expanded-exit) — `BottomSheet.tsx`
8. [import-modal-enter](#8-import-modal-enter) — `ImportUrlModal.tsx`
9. [help-overlay-appear](#9-help-overlay-appear) — `HelpOverlay.tsx`
10. [error-field-highlight](#10-error-field-highlight) — `ErrorMessage.tsx`
11. [color-contrast-warning](#11-color-contrast-warning) — `ColorPicker.tsx`
12. [tab-change-notice — N/A](#12-tab-change-notice--na)

---

## 1. loading-dots

**Componente(s) afectado(s):** `LoadingDots.tsx`
**US / Regla de referencia:** RG-002
**Tipo:** microinteracción — estado (loop infinito mientras `loading=true`)

### Descripción y Propósito
Tres puntos que hacen bounce secuencial para indicar que una operación está en curso. Reemplaza el texto del botón durante el estado de carga. Comunica "espera activa" sin un spinner que implique duración indeterminada larga.

### Especificación Técnica

```
TRIGGER
  El componente se monta cuando Button recibe loading={true}.
  La animación comienza inmediatamente al montar.

ELEMENTOS ANIMADOS
  - transform: translateY(0) → translateY(-4px) → translateY(0)
  (cada punto en su propio ciclo, desfasados 150ms entre sí)

DURACIÓN
  600ms por ciclo (un bounce completo por punto)

EASING
  ease-in-out (cubic-bezier nativo — no usa tokens de easing de DateOnDuty)

DELAY
  dot-1: 0ms | dot-2: 150ms | dot-3: 300ms

ITERACIONES
  infinite — mientras el componente esté montado
```

### Keyframes

```css
@keyframes dod-bounce-dot {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-4px); }
}

.dod-dot-1 { animation: dod-bounce-dot 600ms ease-in-out infinite; animation-delay: 0ms; }
.dod-dot-2 { animation: dod-bounce-dot 600ms ease-in-out infinite; animation-delay: 150ms; }
.dod-dot-3 { animation: dod-bounce-dot 600ms ease-in-out infinite; animation-delay: 300ms; }
```

### Representación ASCII del Movimiento

```
t=0ms          t=150ms        t=300ms        t=450ms        t=600ms
(inicio)       (dot-1 sube)   (dot-2 sube)   (dot-3 sube)   (reset)

 • • •          ↑ • •          • ↑ •          • • ↑          • • •
               (•) • •        • (•) •        • • (•)
```

### Interacción con Otras Animaciones
- Sin conflicto. Se monta/desmonta con el estado `loading` del botón.
- No convive con el texto del botón — uno u otro, nunca ambos.

### Variante de Movimiento Reducido

```
MOVIMIENTO REDUCIDO:
Comportamiento: C) Animación simplificada
Los tres puntos aparecen estáticos sin bounce. Opacidad 0.6.
Sin animación ninguna.

CSS:
@media (prefers-reduced-motion: reduce) {
  .dod-dot-1, .dod-dot-2, .dod-dot-3 {
    animation: none;
    opacity: 0.6;
  }
}

Justificación: El bounce es decorativo. Los tres puntos estáticos
comunican igualmente "estado de espera" sin movimiento.
```

### Notas para el Developer Agent
- Implementar con `CSS animation` (no `transition`) — necesita `keyframes` para el bounce.
- `currentColor` en `background-color` del punto — hereda automáticamente del botón padre.
- No usar `setInterval` ni JS para la animación — CSS puro es más eficiente y no genera re-renders.

---

## 2. config-banner-slide

**Componente(s) afectado(s):** `ConfigBanner.tsx`
**US / Regla de referencia:** US-009, US-011
**Tipo:** entrada + salida

### Descripción y Propósito
El banner de configuración inicial desliza hacia abajo al aparecer (comunicando que es contenido nuevo que "llega") y hace fade-out + colapso al desaparecer (comunicando que ha cumplido su propósito y se retira limpiamente). La continuidad del movimiento orienta al usuario sobre qué cambió en la pantalla.

### Especificación Técnica — Entrada

```
TRIGGER
  Mount del componente al detectar onboarding.bannerSeen = false.
  Se ejecuta una sola vez por sesión (o hasta que el flag se guarde).

ELEMENTOS ANIMADOS (entrada)
  - opacity: 0 → 1
  - transform: translateY(-100%) → translateY(0)

DURACIÓN
  duration-slow (300ms)

EASING
  ease-default (cubic-bezier(0.4, 0, 0.2, 1))

DELAY
  Ninguno — aparece inmediatamente con el calendario.

ITERACIONES
  1
```

### Especificación Técnica — Salida

```
TRIGGER
  Timer de 50 segundos completa. ui-store.onboardingComplete = true.

ELEMENTOS ANIMADOS (salida)
  - opacity: 1 → 0
  - max-height: [altura del banner, ~58px] → 0px
  (max-height animado para que el calendario suba suavemente y ocupe el espacio)

DURACIÓN
  duration-slow (300ms)

EASING
  ease-default

DELAY
  Ninguno.

ITERACIONES
  1
```

### Keyframes

```css
@keyframes dod-banner-enter {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* La salida usa CSS transition (no keyframe) para poder animar max-height: */
.dod-banner-leaving {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition:
    opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
    max-height 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Representación ASCII del Movimiento

```
ENTRADA:
t=0ms (inicio)         t=150ms (medio)        t=300ms (fin)
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   (fuera de  │        │ ░░ Banner ░░ │        │ ██ Banner ██ │
│    vista)    │ ──→    │ ░░░░░░░░░░░░ │ ──→    │ ████████████ │
└──────────────┘        └──────────────┘        └──────────────┘
opacity: 0              opacity: 0.5            opacity: 1
translateY: -100%       translateY: -50%        translateY: 0

SALIDA:
t=0ms (inicio)         t=150ms (medio)        t=300ms (fin)
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│ ██ Banner ██ │        │ ░░ Banner ░░ │        │              │ ← colapsado
│ ████████████ │ ──→    │ ░░░░░ (½h) ░ │ ──→    └──────────────┘
└──────────────┘        └──────────────┘
opacity: 1              opacity: 0.5            opacity: 0
max-height: 58px        max-height: ~30px       max-height: 0
```

### Interacción con Otras Animaciones
- Convive con `onboarding-swipe-hint` (SwipeAnimation) — ambos se montan simultáneamente y son independientes.
- La salida del banner libera espacio que el calendario ocupa fluidamente (max-height animado).

### Variante de Movimiento Reducido

```
MOVIMIENTO REDUCIDO:
Comportamiento: A) Sin animación
Entrada: aparece instantáneamente (display block).
Salida: desaparece instantáneamente (display none).

CSS:
@media (prefers-reduced-motion: reduce) {
  .dod-banner { animation: none; }
  .dod-banner-leaving { transition: none; max-height: 0; opacity: 0; }
}

Justificación: El banner es funcional, no decorativo. El usuario
solo necesita verlo — no cómo llegó.
```

### Notas para el Developer Agent
- La entrada usa `CSS animation` (keyframe) para el slide-down.
- La salida usa `CSS transition` porque necesita animar `max-height` (no animable con `@keyframes` en modo declarativo desde React).
- La clase `.dod-banner-leaving` se agrega via `setState` cuando el timer de 50s completa. Después de 300ms, el componente se desmonta.
- **No animar `height: auto`** — usar `max-height` con un valor concreto mayor que la altura real del banner (58px → usar `max-height: 80px` para seguridad).

---

## 3. onboarding-swipe-hint

**Componente(s) afectado(s):** `SwipeAnimation.tsx`
**US / Regla de referencia:** US-009, US-011
**Tipo:** entrada + loop de demostración + salida

### Descripción y Propósito
Card flotante que enseña visualmente los gestos de navegación del calendario. Un pseudo-cursor (punto azul) se desliza alternativamente en el eje vertical (meses) y horizontal (años). La animación en loop continuo durante 8 segundos refuerza la instrucción sin texto extenso.

### Especificación Técnica — Entrada del card

```
TRIGGER
  Mount del componente (simultáneo con ConfigBanner, t=0).

ELEMENTOS ANIMADOS
  - opacity: 0 → 1
  - transform: scale(0.95) → scale(1)

DURACIÓN
  duration-xslow (500ms)

EASING
  ease-bounce (cubic-bezier(0.34, 1.56, 0.64, 1))

ITERACIONES
  1
```

### Especificación Técnica — Cursor animado (loop)

```
TRIGGER
  Inmediatamente tras la entrada del card.

FASES DEL CURSOR (secuencia dentro de los 8 segundos):
  0.5s – 2.5s  → Fase vertical   (cursor viaja ↕ entre íconos ChevronUp/Down)
  2.5s – 3.0s  → Pausa 1
  3.0s – 5.0s  → Fase horizontal (cursor viaja ↔ entre íconos ChevronLeft/Right)
  5.0s – 5.5s  → Pausa 2
  5.5s – 7.5s  → Fase vertical   (segundo ciclo)
  7.5s – 8.0s  → Fade-out del card completo

CURSOR FASE VERTICAL:
  - transform/top: 4px → calc(100% - 8px) → 4px
  - Duración de cada viaje: 900ms
  - Easing: ease-in-out

CURSOR FASE HORIZONTAL:
  - transform/left: 4px → calc(100% - 8px) → 4px
  - Duración de cada viaje: 900ms
  - Easing: ease-in-out

ITERACIONES DEL CURSOR: 1 (no loop — la secuencia completa dura exactamente 7.5s)
```

### Keyframes

```css
/* Entrada del card */
@keyframes dod-swipe-card-enter {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(-50%) scale(1);
  }
}

/* Cursor fase vertical (ida y vuelta) */
@keyframes dod-cursor-vertical {
  0%   { top: 4px; }
  45%  { top: calc(100% - 8px); }
  55%  { top: calc(100% - 8px); }
  100% { top: 4px; }
}

/* Cursor fase horizontal (ida y vuelta) */
@keyframes dod-cursor-horizontal {
  0%   { left: 4px; }
  45%  { left: calc(100% - 8px); }
  55%  { left: calc(100% - 8px); }
  100% { left: 4px; }
}

/* Salida del card (fade-out) */
@keyframes dod-swipe-card-exit {
  from { opacity: 1; }
  to   { opacity: 0; }
}
```

### Coordinación de fases (via JS + CSS animation-delay)

```javascript
// El cursor usa animation-delay para las fases.
// La lógica de aplicar la clase correcta según la fase se gestiona
// con un setTimeout en useEffect, no con JS continuo:

useEffect(() => {
  // Fase 1: vertical (0.5s–2.5s) — animación activa desde el inicio con delay 500ms
  // Fase 2: horizontal (3.0s–5.0s) — clase 'phase-h' se agrega a t=2.5s
  const t1 = setTimeout(() => setPhase('horizontal'), 2500)
  // Fase 3: vertical de nuevo (5.5s–7.5s)
  const t2 = setTimeout(() => setPhase('vertical-2'), 5000)
  // Salida del card
  const t3 = setTimeout(() => setLeaving(true), 7500)
  // Desmontar
  const t4 = setTimeout(() => onComplete(), 8000)

  return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
}, [])
```

### Representación ASCII del Movimiento

```
FASE VERTICAL (t=0.5s – 2.5s):

 ┌──────────────────────────────┐
 │  [▲]   meses   [▼]    ●←   │  ← cursor en zona vertical
 │  [◄]   años    [►]         │    (eje izq-der del card)
 └──────────────────────────────┘

 cursor viaja: top ──→──→──→ bottom ──→──→──→ top

FASE HORIZONTAL (t=3.0s – 5.0s):

 ┌──────────────────────────────┐
 │  [▲]   meses   [▼]         │
 │  [◄]   años    [►]   ←●→  │  ← cursor en zona horizontal
 └──────────────────────────────┘

 cursor viaja: left ──→──→──→ right ──→──→──→ left
```

### Interacción con Otras Animaciones
- Independiente de `config-banner-slide` — ambos se montan a t=0, sin conflicto.
- `pointer-events: none` en todo el componente — no interfiere con gestos del calendario subyacente.
- La salida del card (t=7.5s) NO afecta el banner (que continúa hasta t=50s).

### Variante de Movimiento Reducido

```
MOVIMIENTO REDUCIDO:
Comportamiento: C) Animación simplificada
El cursor desaparece completamente (display: none).
El card aparece estático con los iconos y textos visibles.
A los 8s, desaparece instantáneamente (sin fade-out).

CSS:
@media (prefers-reduced-motion: reduce) {
  .dod-swipe-cursor { display: none; }
  .dod-swipe-card   { animation: none; }
  .dod-swipe-card.leaving { display: none; }
}

Justificación: El cursor en movimiento puede causar mareos.
La información (íconos + labels "meses"/"años") es comprensible
sin animación.
```

### Notas para el Developer Agent
- El cursor (`div` de 8px Ø) tiene `position: absolute` dentro de su zona de referencia relativa. Dos zonas: una para eje vertical (columna derecha del card), una para eje horizontal (fila inferior).
- **No animar `top` y `left` con CSS animation al mismo tiempo** en el mismo elemento — usarlos en elementos distintos (uno por eje). El cursor se intercambia entre zonas según la fase activa.
- El card usa `pointer-events: none` — no es interactivo, el usuario puede tapear el calendario a través de él.

---

## 4. calendar-month-transition

**Componente(s) afectado(s):** `MonthGrid.tsx`
**US / Regla de referencia:** US-002
**Tipo:** transición de contenido (swipe vertical ↕ = meses)

### Descripción y Propósito
Al cambiar de mes, la grilla actual sale por arriba/abajo mientras la nueva entra desde el lado opuesto. La dirección de la animación comunica el sentido temporal: mes siguiente entra desde abajo (futuro = abajo), mes anterior entra desde arriba (pasado = arriba). Principio UX de continuidad espacial.

### Especificación Técnica

```
TRIGGER
  - Swipe vertical hacia arriba (mes siguiente)
  - Swipe vertical hacia abajo (mes anterior)
  - Click en botón ∨ (mes siguiente) o ∧ (mes anterior)
  - PageDown / PageUp (teclado)

DIRECCIÓN:
  → Mes siguiente: saliente translateY(0→-100%), entrante translateY(100%→0)
  → Mes anterior:  saliente translateY(0→+100%), entrante translateY(-100%→0)

ELEMENTOS ANIMADOS
  - transform: translateY([dirección]) en grilla saliente
  - transform: translateY([dirección opuesta]) en grilla entrante
  - opacity: 1→0 (saliente) / 0→1 (entrante) — suaviza el cruce

DURACIÓN
  duration-normal (200ms)

EASING
  ease-snap (cubic-bezier(0.25, 0.1, 0.25, 1.0)) — rápido y preciso

DELAY
  Ninguno.

ITERACIONES
  1 por cambio de mes.
```

### Keyframes

```css
/* Mes siguiente — saliente sale por arriba, entrante viene de abajo */
@keyframes dod-month-exit-up {
  from { transform: translateY(0); opacity: 1; }
  to   { transform: translateY(-8%); opacity: 0; }
}
@keyframes dod-month-enter-from-bottom {
  from { transform: translateY(8%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

/* Mes anterior — saliente sale por abajo, entrante viene de arriba */
@keyframes dod-month-exit-down {
  from { transform: translateY(0); opacity: 1; }
  to   { transform: translateY(8%); opacity: 0; }
}
@keyframes dod-month-enter-from-top {
  from { transform: translateY(-8%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
```

> El desplazamiento es solo **8%** (no 100%). Un slide completo de pantalla sería demasiado lento para una acción frecuente. 8% + fade crea la sensación de dirección sin el costo visual de un slide total.

### Representación ASCII del Movimiento

```
SIGUIENTE MES (swipe up ↑):

t=0ms                 t=100ms               t=200ms
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Feb 2026     │     │ ░ Feb 2026 ░  │     │               │ ← sale
│  [grilla feb] │ ──→ │ [grilla ░░░]  │ ──→ │               │
└───────────────┘     └───────────────┘     └───────────────┘
                      ┌───────────────┐     ┌───────────────┐
                      │ ░ Mar 2026 ░  │     │  Mar 2026     │ ← entra
                      │ [grilla ░░░]  │     │  [grilla mar] │
                      └───────────────┘     └───────────────┘
```

### Interacción con Otras Animaciones
- **No interruptible durante la animación** — ignorar nuevos swipes mientras `isNavigating = true`. La animación es de 200ms, prácticamente instantánea.
- Comparte el mismo mecanismo de `isNavigating` que `calendar-year-transition`.
- No convive con `day-expanded-enter` — el panel expandido bloquea el swipe del calendario mientras está abierto.

### Variante de Movimiento Reducido

```
MOVIMIENTO REDUCIDO:
Comportamiento: A) Sin animación
El mes cambia instantáneamente sin transición.
Solo se actualiza el contenido del grid.

CSS:
@media (prefers-reduced-motion: reduce) {
  .dod-month-grid { animation: none !important; }
}

Justificación: El slide de grilla es movimiento de contenido grande —
exactamente el tipo de animación que puede causar mareo en usuarios
sensibles al movimiento.
```

### Notas para el Developer Agent
- **Técnica de dos grillas:** El contenedor `MonthGrid` tiene `position: relative; overflow: hidden`. Las dos grillas (saliente y entrante) tienen `position: absolute; width: 100%`. Tras la animación, la saliente se desmonta.
- La altura del contenedor debe ser fija (no colapsar durante la transición). Usar la altura de la grilla saliente como referencia durante la animación.
- `isNavigating` en `ui-store` previene swipes accidentales durante los 200ms de transición.
- En swipe con `useDrag`: la animación se activa cuando el gesto supera el umbral (50px + velocidad 0.3). El `transform` del drag en tiempo real se convierte en la animación al soltar.

---

## 5. calendar-year-transition

**Componente(s) afectado(s):** `MonthGrid.tsx`
**US / Regla de referencia:** US-002
**Tipo:** transición de contenido (swipe horizontal ↔ = años)

### Descripción y Propósito
Al cambiar de año, la grilla se desliza horizontalmente. Año siguiente → entra por la derecha (futuro = derecha). Año anterior → entra por la izquierda (pasado = izquierda). Mismo principio de continuidad espacial que la transición de mes, pero en eje perpendicular.

### Especificación Técnica

```
TRIGGER
  - Swipe horizontal hacia la izquierda (año siguiente)
  - Swipe horizontal hacia la derecha (año anterior)
  - Click en botón › (año siguiente) o ‹ (año anterior)

DIRECCIÓN:
  → Año siguiente: saliente translateX(0→-8%), entrante translateX(8%→0)
  → Año anterior:  saliente translateX(0→+8%), entrante translateX(-8%→0)

ELEMENTOS ANIMADOS
  - transform: translateX([dirección]) en grilla saliente
  - transform: translateX([dirección opuesta]) en grilla entrante
  - opacity: 1→0 / 0→1

DURACIÓN
  duration-normal (200ms)

EASING
  ease-snap (cubic-bezier(0.25, 0.1, 0.25, 1.0))

DELAY
  Ninguno.

ITERACIONES
  1 por cambio de año.
```

### Keyframes

```css
@keyframes dod-year-exit-left {
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(-8%); opacity: 0; }
}
@keyframes dod-year-enter-from-right {
  from { transform: translateX(8%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
@keyframes dod-year-exit-right {
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(8%); opacity: 0; }
}
@keyframes dod-year-enter-from-left {
  from { transform: translateX(-8%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
```

### Representación ASCII del Movimiento

```
AÑO SIGUIENTE (swipe left ←):

t=0ms                    t=200ms
┌──────────────────┐     ┌──────────────────┐
│  Feb 2026  →→→→  │     │      Feb 2027     │
│  [grilla]  →→→→  │ ──→ │      [grilla]     │
└──────────────────┘     └──────────────────┘
 (sale por izquierda)     (entra por derecha)
```

### Interacción con Otras Animaciones
- Comparte `isNavigating` con `calendar-month-transition` — no pueden ocurrir simultáneamente.
- Si el usuario hace swipe diagonal, el eje dominante (mayor desplazamiento) determina si es mes o año.

### Variante de Movimiento Reducido

```
MOVIMIENTO REDUCIDO:
Comportamiento: A) Sin animación — cambio instantáneo.
Misma justificación que calendar-month-transition.
```

### Notas para el Developer Agent
- Implementación idéntica a `calendar-month-transition` pero en eje X. Reutilizar el mismo mecanismo de dos grillas.
- `useDrag` de `@use-gesture/react` detecta el eje dominante automáticamente con `axis: 'lock'` — bloquear al eje con mayor desplazamiento inicial del gesto.

---

## 6. day-expanded-enter

**Componente(s) afectado(s):** `BottomSheet.tsx` + `DayExpandedPanel.tsx`
**US / Regla de referencia:** US-013
**Tipo:** entrada de overlay

### Descripción y Propósito
El panel de detalle del día emerge desde la parte inferior de la pantalla (mobile) o aparece como modal centrado (desktop). El movimiento desde abajo refuerza que el panel es contenido contextual del elemento tocado, no una nueva pantalla.

### Especificación Técnica — Mobile (BottomSheet)

```
TRIGGER
  Tap en DayCell. ui-store.selectedDay cambia a la fecha tocada.

ELEMENTOS ANIMADOS
  Panel:   transform: translateY(100%) → translateY(0)
  Overlay: opacity: 0 → 0.45 (surface-overlay)

DURACIÓN
  duration-slow (300ms)

EASING
  ease-default (cubic-bezier(0.4, 0, 0.2, 1))

DELAY
  Panel y overlay se animan simultáneamente. Sin delay.

ITERACIONES
  1
```

### Especificación Técnica — Desktop (Modal)

```
TRIGGER
  Tap/click en DayCell.

ELEMENTOS ANIMADOS
  Modal:   opacity: 0→1, transform: scale(0.96)→scale(1)
  Overlay: opacity: 0→0.45

DURACIÓN
  duration-slow (300ms)

EASING
  ease-bounce (cubic-bezier(0.34, 1.56, 0.64, 1))
  (el modal aparece con ligero rebote — más "vivo" que un fade plano)

ITERACIONES
  1
```

### Keyframes

```css
/* Mobile — panel desde abajo */
@keyframes dod-sheet-enter {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

/* Desktop — modal con bounce */
@keyframes dod-modal-enter {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Overlay */
@keyframes dod-overlay-enter {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

### Representación ASCII del Movimiento

```
MOBILE:
t=0ms                  t=150ms               t=300ms
┌─────────────────┐    ┌─────────────────┐   ┌─────────────────┐
│   [calendario]  │    │   [calendario]  │   │   [calendario]  │
│                 │    │  ░░░ overlay ░░░│   │  ░░░ overlay ░░░│
│                 │    ├─────────────────┤   ├─────────────────┤
│                 │    │  [panel mitad]  │   │  [panel lleno]  │
└─────────────────┘    └─────────────────┘   └─────────────────┘
(sin panel)            (translateY 50%)       (translateY 0)
```

### Interacción con Otras Animaciones
- Al abrir, el calendario subyacente NO tiene animación — permanece estático.
- Si el banner de onboarding sigue visible, el panel del día lo tapa (z-index mayor).
- No puede abrirse mientras `isNavigating = true` (transición de mes/año en curso).

### Variante de Movimiento Reducido

```
MOVIMIENTO REDUCIDO:
Comportamiento: B) Solo fade
Mobile: sin translateY — el panel aparece con opacity 0→1 solamente.
Desktop: sin scale — solo opacity 0→1.
Duración: duration-fast (100ms) para minimizar la espera.

@media (prefers-reduced-motion: reduce) {
  .dod-sheet { animation: none; opacity: 1; /* aparece directo */ }
  .dod-modal { animation: none; transform: translate(-50%, -50%); opacity: 1; }
}
```

### Notas para el Developer Agent
- El panel usa `CSS animation` (no `transition`) porque el elemento se monta durante la animación — `transition` solo funciona si el elemento ya está en el DOM en el estado inicial.
- Usar `onAnimationEnd` del panel para mover el foco al primer elemento interactivo (accesibilidad).
- El scroll del body debe bloquearse (`overflow: hidden` en `<body>`) mientras el panel está abierto con overlay.

---

## 7. day-expanded-exit

**Componente(s) afectado(s):** `BottomSheet.tsx` + `DayExpandedPanel.tsx`
**US / Regla de referencia:** US-013
**Tipo:** salida de overlay

### Descripción y Propósito
El panel se retira hacia abajo (mobile) o hace fade-out (desktop), devolviendo la atención al calendario. El movimiento inverso al de entrada refuerza la reversibilidad de la acción.

### Especificación Técnica

```
TRIGGER
  - Tap fuera del panel (en el overlay)
  - Swipe hacia abajo en el drag handle superando umbral (150px o velocidad > 0.5)
  - Tecla Escape
  - Click en botón ✕ (desktop)

MOBILE — ELEMENTOS ANIMADOS
  Panel:   transform: translateY(0) → translateY(100%)
  Overlay: opacity: 0.45 → 0

DESKTOP — ELEMENTOS ANIMADOS
  Modal:   opacity: 1→0, transform: scale(1)→scale(0.96)
  Overlay: opacity: 0.45 → 0

DURACIÓN
  duration-normal (200ms) — más rápida que la entrada (cierre debe sentirse ágil)

EASING
  ease-default

ITERACIONES
  1 — al final, desmontar el componente y restaurar foco.
```

### Keyframes

```css
@keyframes dod-sheet-exit {
  from { transform: translateY(0); }
  to   { transform: translateY(100%); }
}

@keyframes dod-modal-exit {
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to   { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }
}
```

### Interacción con Otras Animaciones
- Si el usuario estaba arrastrando (drag activo), la animación de salida debe arrancar desde la posición actual del drag, no desde translateY(0).
- El foco debe regresar a la DayCell que originó el panel al completar la salida (`onAnimationEnd`).

### Variante de Movimiento Reducido

```
MOVIMIENTO REDUCIDO:
Comportamiento: A) Sin animación — desmontar directamente.
@media (prefers-reduced-motion: reduce) {
  .dod-sheet-exit, .dod-modal-exit { animation: none; }
  /* El componente se desmonta inmediatamente sin esperar animación */
}
```

---

## 8. import-modal-enter

**Componente(s) afectado(s):** `ImportUrlModal.tsx`
**US / Regla de referencia:** US-008
**Tipo:** entrada de modal

### Descripción y Propósito
El modal de importación aparece al detectar el parámetro `?cfg=` en la URL. La aparición con escala + fade comunica que es contenido nuevo que requiere atención (sin ser intrusivo). Mismo patrón que otros modales — consistencia visual.

### Especificación Técnica

```
TRIGGER
  Mount del componente al detectar useSearchParams() con parámetro cfg.

ELEMENTOS ANIMADOS
  Modal:   opacity: 0→1, transform: translate(-50%,-50%) scale(0.95)→scale(1)
  Overlay: opacity: 0→1

DURACIÓN
  duration-slow (300ms)

EASING
  ease-bounce (cubic-bezier(0.34, 1.56, 0.64, 1))

ITERACIONES
  1
```

### Keyframes

```css
/* Reutiliza el mismo keyframe que dod-modal-enter */
/* Ver animación #6 (day-expanded-enter, desktop) */
```

> Nota: todos los modales centrados de DateOnDuty usan el mismo patrón de entrada (`opacity + scale + ease-bounce`). El developer puede crear una clase utilitaria `.dod-modal-enter` reutilizable.

### Transiciones entre vistas del modal

```
TRIGGER: Click en opción dentro del modal (ej: "Guardar como adicional")

ELEMENTOS ANIMADOS
  Vista saliente: opacity: 1→0
  Vista entrante: opacity: 0→1

DURACIÓN: duration-fast (100ms) para salida, duration-fast (100ms) para entrada
EASING: ease-default

El cambio de vista es casi instantáneo — no debe sentirse como navegación
sino como actualización de contenido.
```

### Variante de Movimiento Reducido

```
MOVIMIENTO REDUCIDO:
Comportamiento: B) Solo fade
Sin scale. Solo opacity 0→1 en duration-fast.

@media (prefers-reduced-motion: reduce) {
  .dod-import-modal {
    animation: none;
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
```

---

## 9. help-overlay-appear

**Componente(s) afectado(s):** `HelpOverlay.tsx`
**US / Regla de referencia:** US-009
**Tipo:** entrada de overlay + microinteracción (badges con stagger)

### Descripción y Propósito
Al activar la ayuda, el overlay oscuro aparece con fade, seguido de los badges numerados que emergen con stagger secuencial (escalonados) para guiar el ojo del usuario de un elemento al siguiente. El stagger convierte la aparición simultánea en una secuencia legible.

### Especificación Técnica — Overlay

```
TRIGGER: Click/tap en botón [?]

ELEMENTOS ANIMADOS
  Overlay: opacity: 0 → 0.60

DURACIÓN: duration-slow (300ms)
EASING: ease-default
```

### Especificación Técnica — Badges (stagger)

```
TRIGGER: Inmediatamente tras el overlay (sin delay adicional)

ELEMENTOS ANIMADOS (por badge)
  opacity: 0 → 1
  transform: scale(0.6) → scale(1)

DURACIÓN: duration-normal (200ms) por badge
EASING: ease-bounce

DELAY STAGGER:
  badge-①: delay 50ms
  badge-②: delay 80ms
  badge-③: delay 110ms
  badge-④: delay 140ms
  badge-⑤: delay 170ms
  badge-⑥: delay 200ms (condicional)
  badge-⑦: delay 230ms (condicional)
  badge-⑧: delay 260ms
  badge-⑨: delay 290ms (condicional)
```

### Keyframes

```css
@keyframes dod-badge-pop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Aplicar con delay escalonado: */
.dod-help-badge:nth-child(1) { animation: dod-badge-pop 200ms ease-bounce 50ms both; }
.dod-help-badge:nth-child(2) { animation: dod-badge-pop 200ms ease-bounce 80ms both; }
/* ... etc. */
/* "both" = animation-fill-mode: both (mantiene estado inicial/final) */
```

### Representación ASCII del Movimiento

```
t=0ms           t=100ms          t=200ms          t=350ms
[overlay fade]  [badge ① pop]   [badges ②③ pop]  [todos visibles]

 ░░░░░░░░░░      ░░░░░░░░░░      ░░░░░░░░░░       ████████████
 ░░  ①  ░░      ██  ①  ░░      ██  ①②  ░░       █  ①②③④  █
 ░░░░░░░░░░      ░░░░░░░░░░      ░░░░░░░░░░       ████████████
```

### Salida del help overlay

```
TRIGGER: Click en [✕] o tecla Escape

OVERLAY: opacity: 0.60→0 en duration-fast (100ms)
BADGES: opacity: 1→0 en duration-fast (100ms) — sin stagger en salida
Panel: cierre del BottomSheet (ver day-expanded-exit — mismo patrón)
```

### Variante de Movimiento Reducido

```
MOVIMIENTO REDUCIDO:
Comportamiento: A) Sin animación
Overlay y badges aparecen instantáneamente (opacity: 1, sin scale).
Sin stagger — todos los badges visibles al mismo tiempo.

@media (prefers-reduced-motion: reduce) {
  .dod-help-overlay { animation: none; opacity: 1; }
  .dod-help-badge   { animation: none; opacity: 1; transform: scale(1); }
}
```

---

## 10. error-field-highlight

**Componente(s) afectado(s):** `ErrorMessage.tsx`, `ShiftConfigForm.tsx`, `FeedbackPage.tsx`
**US / Regla de referencia:** RG-004
**Tipo:** microinteracción de estado — aparición de error

### Descripción y Propósito
Cuando el usuario intenta guardar un formulario con errores, el mensaje de error aparece con un ligero slide-down + fade que llama la atención sin ser agresivo. El borde del input cambia a rojo instantáneamente (sin transición) para feedback inmediato de dónde está el problema.

### Especificación Técnica

```
TRIGGER
  Intento de submit con validación fallida. El campo error
  aparece/desaparece síncronamente con la validación.

ELEMENTOS ANIMADOS — Mensaje de error (ErrorMessage variant=field)
  opacity: 0 → 1
  transform: translateY(-4px) → translateY(0)

DURACIÓN: duration-normal (200ms)
EASING: ease-default

ELEMENTOS ANIMADOS — Borde del input
  border-color: border-default → feedback-error
  DURACIÓN: duration-fast (100ms) — más rápido, feedback primario
  EASING: ease-default
```

### Keyframes

```css
@keyframes dod-error-appear {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Representación ASCII del Movimiento

```
t=0ms (intento submit)    t=100ms              t=200ms
┌─────────────────────┐   ┌─────────────────┐  ┌─────────────────┐
│ [input borde rojo]  │   │ [input rojo]    │  │ [input rojo]    │
└─────────────────────┘   │ ░ Error msg ░░  │  │ █ Error msg ██  │
                          └─────────────────┘  └─────────────────┘
 (borde cambia instant.)   (msg aparece arriba) (msg visible)
```

### Interacción con Otras Animaciones
- Tras la aparición, `scrollToFirstError()` hace scroll suave al primer `[data-error="true"]`. El scroll y la animación son independientes — no esperan una a la otra.
- Si el error desaparece (el usuario corrige el campo), el mensaje desaparece instantáneamente (sin animación de salida).

### Variante de Movimiento Reducido

```
MOVIMIENTO REDUCIDO:
Comportamiento: A) Sin animación para el mensaje.
El borde del input cambia instantáneamente (siempre).
El mensaje aparece instantáneamente (sin slide).

@media (prefers-reduced-motion: reduce) {
  .dod-error-message { animation: none; }
}
```

---

## 11. color-contrast-warning

**Componente(s) afectado(s):** `ColorPicker.tsx`
**US / Regla de referencia:** RG-007
**Tipo:** microinteracción de estado — aparición/desaparición de advertencia

### Descripción y Propósito
La advertencia de contraste insuficiente aparece debajo del color picker cuando el color seleccionado no cumple WCAG AA (4.5:1). Es una advertencia no bloqueante — el usuario puede ignorarla. La animación suave evita que parezca un error crítico.

### Especificación Técnica

```
TRIGGER
  onChange del ColorPicker → getContrastRatio(color, '#FFFFFF') < 4.5
  Se evalúa en tiempo real al cambiar de color.

APARICIÓN — ELEMENTOS ANIMADOS
  opacity: 0 → 1
  max-height: 0 → [altura del mensaje, ~40px]

DESAPARICIÓN — ELEMENTOS ANIMADOS
  opacity: 1 → 0
  max-height: [~40px] → 0

DURACIÓN: duration-normal (200ms)
EASING: ease-default

ITERACIONES: 1 por cambio de estado (puede ocurrir múltiples veces
  mientras el usuario selecciona diferentes colores)
```

### Keyframes

```css
/* Usar CSS transition (no keyframe) — permite animar max-height dinámicamente */
.dod-contrast-warning {
  overflow: hidden;
  transition:
    opacity 200ms cubic-bezier(0.4, 0, 0.2, 1),
    max-height 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.dod-contrast-warning--hidden {
  opacity: 0;
  max-height: 0;
}

.dod-contrast-warning--visible {
  opacity: 1;
  max-height: 80px; /* mayor que la altura real para seguridad */
}
```

### Interacción con Otras Animaciones
- Sin conflictos. La advertencia puede aparecer/desaparecer múltiples veces sin problema.
- No está relacionada con la animación de errores de formulario — es una advertencia, no un error de validación.

### Variante de Movimiento Reducido

```
MOVIMIENTO REDUCIDO:
Comportamiento: A) Sin animación
La advertencia aparece/desaparece instantáneamente.
Sigue siendo visible — solo sin transición.

@media (prefers-reduced-motion: reduce) {
  .dod-contrast-warning { transition: none; }
}
```

---

## 12. tab-change-notice — N/A

**US de referencia:** US-010
**Estado:** **No implementado en MVP**

**Razón:** El CLAUDE.md y la Arquitectura v1.0 tienen `BroadcastChannel` en la lista de **adiciones estrictamente prohibidas** en el MVP. US-010 describe notificación entre pestañas del navegador — lo que requiere `BroadcastChannel` o `localStorage` events para comunicación entre tabs.

**Para v2.0:** Si se habilita la comunicación entre pestañas, la animación correspondiente sería un toast `variant="info"` (ver `Toast.tsx`) con `aria-live="polite"` que aparece cuando otra pestaña modifica la configuración. La animación usaría el mismo patrón que `toast-enter` (slide-up + fade, `duration-slow`).

---

## Resumen de implementación

### Clases CSS globales a definir en `src/index.css`

```css
/* Animar solo propiedades seguras (opacity, transform) */
/* Nunca animar: width, height (usar max-height), top, left, margin */

/* Convención de nombres: prefijo dod- para evitar colisiones */

/* @keyframes necesarios: */
/* dod-bounce-dot       → loading-dots */
/* dod-banner-enter     → config-banner-slide */
/* dod-swipe-card-enter → onboarding-swipe-hint */
/* dod-cursor-vertical  → onboarding-swipe-hint */
/* dod-cursor-horizontal → onboarding-swipe-hint */
/* dod-swipe-card-exit  → onboarding-swipe-hint */
/* dod-month-exit-up / dod-month-enter-from-bottom → calendar-month */
/* dod-month-exit-down / dod-month-enter-from-top  → calendar-month */
/* dod-year-exit-left / dod-year-enter-from-right  → calendar-year */
/* dod-year-exit-right / dod-year-enter-from-left  → calendar-year */
/* dod-sheet-enter / dod-sheet-exit   → day-expanded (mobile) */
/* dod-modal-enter / dod-modal-exit   → day-expanded (desktop) + import modal */
/* dod-overlay-enter                  → overlays genérico */
/* dod-badge-pop                      → help-overlay */
/* dod-error-appear                   → error-field */
```

### Clases utilitarias reutilizables

```css
/* Modal centrado (day-expanded desktop + import-modal) — mismo keyframe */
.dod-modal-enter { animation: dod-modal-enter 300ms ease-bounce both; }
.dod-modal-exit  { animation: dod-modal-exit 200ms ease-default both; }

/* Overlay (day-expanded + help + import-modal) */
.dod-overlay-enter { animation: dod-overlay-enter 300ms ease-default both; }
```

### Bloque global prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Deshabilitar todas las animaciones de DateOnDuty */
  [class*="dod-"] {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Excepciones funcionales (no decorativas): */
  /* La barra de progreso del banner SÍ debe animarse — es feedback funcional */
  .dod-banner-progress {
    transition-duration: 1s !important; /* mantener la transición de 1s linear */
  }
}
```
