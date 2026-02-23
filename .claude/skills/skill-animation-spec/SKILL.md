---
name: skill-animation-spec
description: Genera la especificación completa de una animación o transición para DateOnDuty — trigger, propiedades CSS animadas, duración, easing, keyframes, representación ASCII del movimiento y variante prefers-reduced-motion. Todas las animaciones usan CSS nativo (sin Framer Motion). Usar antes de implementar cualquier componente con movimiento.
---

# SKILL: Especificación de Animación
**Fase:** Diseño
**Cuándo usarlo:** Al documentar cualquier animación, transición o microinteracción del proyecto.
**Produce:** Spec de animación lista para implementación en CSS/React, incluyendo variante de movimiento reducido.

---

## CÓMO INVOCAR

```
/skill-animation-spec [NOMBRE_ANIMACION]
```

Ejemplos:
- `/skill-animation-spec onboarding-swipe-hint`
- `/skill-animation-spec calendar-month-transition`
- `/skill-animation-spec day-expanded-enter`
- `/skill-animation-spec config-banner-appear`
- `/skill-animation-spec loading-dots`

---

## ANIMACIONES A DOCUMENTAR EN DATEONDUTY

Estas son las animaciones identificadas en el PRD y la Arquitectura. Úsalas como referencia al invocar el skill:

| Nombre | Descripción breve | US / Regla |
|---|---|---|
| `onboarding-swipe-hint` | Animación que muestra al usuario cómo navegar con gestos | US-009 |
| `config-banner-slide` | Entrada y salida del banner de configuración inicial | US-009, US-011 |
| `calendar-month-transition` | Transición visual al cambiar de mes (swipe/botón) | US-002 |
| `calendar-year-transition` | Transición visual al cambiar de año | US-002 |
| `day-expanded-enter` | Apertura de la vista expandida del día | US-013 |
| `day-expanded-exit` | Cierre de la vista expandida del día | US-013 |
| `import-modal-enter` | Aparición del modal de importación de URL compartida | US-008 |
| `tab-change-notice` | Aparición de la notificación de cambios en otra pestaña | US-010 |
| `loading-dots` | Animación de los tres puntos suspensivos de carga | RG-002 |
| `error-field-highlight` | Resaltado del campo con error al intentar guardar | RG-004 |
| `help-tooltip-appear` | Aparición de tooltips de ayuda contextual | US-009 |
| `color-contrast-warning` | Aparición de la advertencia de contraste insuficiente | RG-007 |

---

## INSTRUCCIONES

Genera la especificación completa de la animación con las siguientes secciones.

---

## ESTRUCTURA DEL OUTPUT

### 1. Encabezado

```
## Animación: [nombre-animacion]
**Componente(s) afectado(s):** [NombreComponente.tsx]
**US / Regla de referencia:** US-XXX / RG-XXX
**Tipo:** entrada | salida | estado | transición de página | microinteracción
```

### 2. Descripción y Propósito

Una o dos oraciones explicando:
- Qué comunica visualmente esta animación al usuario
- Por qué existe (principio de UX que aplica: orientación, feedback, continuidad, etc.)

### 3. Especificación Técnica

```
TRIGGER
Qué activa la animación: tap, scroll, timer, cambio de estado, carga de componente...

ELEMENTO(S) ANIMADO(S)
Lista de propiedades CSS que cambian:
  - opacity: [valor inicial] → [valor final]
  - transform: [valor inicial] → [valor final]
  - height / max-height: [valor inicial] → [valor final]  ← solo si es necesario
  - (evitar animar: width, top, left, margin, padding — impactan layout)

DURACIÓN
  Usar tokens de duración del design system:
  - duration-fast (100ms): feedback inmediato
  - duration-normal (200ms): transiciones de componentes
  - duration-slow (300ms): entrada/salida de modales
  - duration-xslow (500ms): animaciones de onboarding

  Valor concreto: [Xms]

EASING
  Usar tokens del design system:
  - ease-default (ease-in-out): transiciones estándar
  - ease-bounce: para elementos que "aparecen con energía"
  - ease-snap: navegación de calendario (rápido y preciso, como cubic-bezier(0.4, 0, 0.2, 1))

  Valor concreto: [curva de bezier o nombre]

DELAY
  Ninguno / [Xms] — justificar si hay delay

ITERACIONES
  1 / infinito / [N] — para animaciones de loop (loading-dots, onboarding)
```

### 4. Keyframes (si la animación no es una simple transición)

Para animaciones con más de dos estados:

```
@keyframes [nombre-animacion]
  0%   → [estado inicial]
  [X%] → [estado intermedio si aplica]
  100% → [estado final]
```

### 5. Representación ASCII del Movimiento

Muestra visualmente qué ocurre en la animación. Usa varias "frames" consecutivos:

```
Frame 0% (inicio)          Frame 50% (medio)          Frame 100% (fin)

┌──────────────┐            ┌──────────────┐            ┌──────────────┐
│              │            │  ░░░░░░░░░░  │            │  ██████████  │
│  (invisible) │  ─────→    │  (aparece)   │  ─────→    │  (visible)   │
│              │            │  ░░░░░░░░░░  │            │  ██████████  │
└──────────────┘            └──────────────┘            └──────────────┘
  opacity: 0                  opacity: 0.5                opacity: 1
  translateY: -8px            translateY: -4px            translateY: 0
```

### 6. Interacción con Otras Animaciones

- ¿Esta animación puede ocurrir simultáneamente con otra? ¿Hay conflicto?
- ¿Cancela o es cancelada por alguna animación?
- ¿Hay una animación de salida que debe ser el espejo de la entrada?

### 7. Variante de Movimiento Reducido (`prefers-reduced-motion`)

**Obligatorio para todas las animaciones.**

Indicar el comportamiento cuando el usuario tiene activada la preferencia de movimiento reducido:

```
MOVIMIENTO REDUCIDO:
Comportamiento: [opción elegida]

Opciones:
  A) Sin animación — el elemento aparece/desaparece instantáneamente (duration: 0)
  B) Solo fade — eliminar transforms, mantener opacity con duration-fast
  C) Animación simplificada — describir la versión reducida

Justificación: [por qué esta opción es la correcta para esta animación]
```

### 8. Notas para el Developer Agent

Indicaciones de implementación:
- Si usar `CSS transition`, `CSS animation`, o `React Spring` / Framer Motion.

> **Restricción de arquitectura:** En DateOnDuty MVP no se agrega Framer Motion ni React Spring. Las animaciones se implementan con **CSS transitions y CSS animations nativas** via clases de Tailwind o CSS custom en el componente. Si una animación requiere JavaScript para coordinarse con el estado de React, usar `useEffect` con clases CSS.

- Indicar si la animación necesita coordinación con el estado de Zustand (ej: `isExpanded`, `isLoading`)
- Indicar si hay un callback `onAnimationEnd` que el componente debe exponer

---

## ESPECIFICACIONES ESPECIALES

### `onboarding-swipe-hint`
Esta animación es la más importante del onboarding. Debe:
- Demostrar visualmente el gesto de swipe vertical (para meses) y horizontal (para años)
- Ser lo suficientemente lenta para entenderse (duration-xslow o más)
- Repetirse en loop hasta que el flag de onboarding se guarde (50 segundos)
- Mostrar un elemento que simula un dedo/cursor deslizándose sobre el calendario

### `loading-dots`
Componente `<LoadingDots />` en `src/shared/components/LoadingDots.tsx`.
- Tres puntos (`•••`) que se animan en secuencia (bounce o fade)
- Se renderiza dentro de botones durante estado de carga (RG-002)
- Loop infinito mientras `isSubmitting = true`
- Movimiento reducido: los tres puntos aparecen estáticos sin animación

### `calendar-month-transition`
La Arquitectura define que el componente del calendario expone un callback `onNavigate`. La animación:
- Se activa al cambiar de mes (swipe vertical o click en flecha)
- Debe dar sensación de dirección: hacia arriba = mes anterior, hacia abajo = mes siguiente
- No debe bloquear input durante la animación (corta: duration-normal o duration-slow)
