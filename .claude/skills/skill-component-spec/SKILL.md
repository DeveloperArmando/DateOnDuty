---
name: skill-component-spec
description: Genera la especificación completa de un componente React para DateOnDuty — variantes, estados visuales, anatomía ASCII, responsive, tokens del design system, accesibilidad, animaciones y notas de implementación. Produce un documento listo para que el developer agent implemente el componente directamente.
---

# SKILL: Especificación de Componente
**Fase:** Diseño
**Cuándo usarlo:** Al especificar un componente reutilizable del design system o un componente complejo de una feature.
**Produce:** Spec completa lista para que el developer agent implemente el componente en React + Tailwind.

---

## CÓMO INVOCAR

```
/skill-component-spec [NOMBRE_COMPONENTE]
```

Ejemplos:
- `/skill-component-spec DayCell`
- `/skill-component-spec ShiftConfigForm`
- `/skill-component-spec ColorPicker`
- `/skill-component-spec LoadingButton`

---

## INSTRUCCIONES

Genera la especificación completa del componente con las siguientes secciones. No omitas ninguna.

---

## ESTRUCTURA DEL OUTPUT

### 1. Propósito y Contexto de Uso

```
## Componente: [NombreComponente]
**Feature:** calendar | config | search | shared | etc.
**Archivo en arquitectura:** src/features/[feature]/components/[NombreComponente].tsx
**US de referencia:** US-XXX
**Descripción:** Una frase que explique qué hace y por qué existe.
**Reutilización:** ¿Se usa en más de una feature? ¿Debería estar en shared/?
```

### 2. Variantes y Props Visuales

Lista todas las variantes que el componente debe soportar.
Formato: nombre de prop → valores posibles → efecto visual.

```
| Prop visual       | Valores                    | Efecto                         |
|---|---|---|
| variant           | primary | secondary | ghost  | Color de fondo y borde         |
| size              | sm | md | lg                | Padding y tamaño de fuente      |
| state             | (ver sección 3)            | Ver estados                    |
| color             | string (hex, dinámico)     | Solo en componentes de turno   |
```

> Nota: "Props visuales" no son props de React — son los parámetros de diseño. El developer agent los traduce a props TypeScript.

### 3. Estados Visuales

Para cada estado, describir:
- Cambios visuales respecto al estado `default`
- Qué lo activa / qué lo desactiva
- Regla UI asociada si aplica

```
| Estado     | Cambios visuales                         | Activado por              | Regla |
|---|---|---|---|
| default    | Estado base                              | —                         | —     |
| hover      | [describir cambio]                       | Cursor sobre el elemento  | —     |
| focus      | Focus ring visible (color: focus-ring)   | Tab o click               | A11Y  |
| active     | [describir cambio]                       | Click / tap sostenido     | —     |
| loading    | Muestra <LoadingDots /> dentro del botón | isSubmitting = true       | RG-002|
| error      | [describir cambio] + data-error="true"   | Validación fallida        | RG-004|
| disabled   | Solo visual (no el atributo HTML)        | Nunca para acciones ppal  | RG-001|
```

> Si el componente es un botón de acción principal: **nunca agregar el estado disabled funcional**. Solo visual cuando aplique.

### 4. Anatomía Visual (ASCII)

Dibuja la estructura interna del componente mostrando sus partes:

```
/* Ejemplo: DayCell — mobile, celda ocupada por 2 configuraciones */

┌──────────────┐
│ 15  [hoy]    │  ← número de día + distintivo de hoy [1]
│ ████ 08:00   │  ← franja config default (color dinámico) + hora [2]
│ ████ 20:00↑  │  ← franja config adicional (color dinámico) + hora [3]
│ +2 más       │  ← indicador de overflow [4]
└──────────────┘
```

### 5. Diseño Responsive

Describe cómo cambia el componente en cada breakpoint relevante:

```
| Breakpoint  | Cambio                                          |
|---|---|
| mobile (360px) | Descripción del layout en mobile             |
| tablet (768px) | Descripción si cambia                        |
| desktop (1280px) | Descripción si cambia                      |
```

Si el componente no cambia entre breakpoints, indicar: `> Responsive: el componente no cambia estructuralmente entre breakpoints. Escala con su contenedor.`

### 6. Especificación de Tokens

Lista los tokens del design system que este componente consume:

```
| Propiedad CSS      | Token                      | Nota                         |
|---|---|---|
| background-color   | --color-surface-elevated   | Para el fondo de la tarjeta  |
| color (texto)      | --color-text-primary       |                              |
| border-color       | --color-border-default     |                              |
| border-radius      | --radius-md                |                              |
| padding            | --spacing-4                |                              |
| transition         | --duration-normal ease-default | Para hover/focus         |
```

Para propiedades dinámicas (color de turno del usuario): indicar `style inline` con el valor calculado.

### 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <button> | <div> | <article> | etc.
- role ARIA: (si el elemento HTML no tiene semántica suficiente)
- aria-label: (si el contenido visible no es suficiente)
- aria-expanded / aria-selected / aria-current: (si aplica)
- aria-live: (si el componente actualiza contenido dinámicamente)

TECLADO:
- Tab: (qué pasa al llegar con Tab)
- Enter / Space: (acción principal)
- Escape: (si aplica — cerrar, cancelar)
- Flechas: (si el componente es navegable internamente)

FOCUS:
- Focus visible: outline usando el token focus-ring
- Primer elemento enfocado al abrir (si es modal/drawer)
- Trampa de foco (focus trap): solo si es modal que bloquea el resto

CONTRASTE:
- Verificar ratio texto/fondo en modo claro y modo oscuro
- Para colores de turno dinámicos: indicar que se evalúa en runtime con wcag-contrast.ts
```

### 8. Animaciones del Componente

Si el componente tiene animaciones propias (no de transición de página):

```
| Animación          | Trigger              | Duración         | Easing        |
|---|---|---|---|
| [nombre]           | [qué la activa]      | duration-normal  | ease-default  |
```

Si no tiene animaciones: `> Sin animaciones propias. Las transiciones de estado (hover, focus) usan duration-fast.`

### 9. Notas para el Developer Agent

Indicaciones específicas para la implementación que no son obvias desde el diseño:

- Restricciones de la Arquitectura que aplican a este componente
- Edge cases visuales a considerar
- Qué lógica NO debe estar en el componente (va en el store o en el Core Engine)

---

## COMPONENTES CRÍTICOS DE DATEONDUTY

Cuando se especifiquen estos componentes, prestar especial atención a los puntos indicados:

### DayCell (src/features/calendar/components/DayCell.tsx)
- El gradiente de color del turno es: más intenso al inicio del bloque, más tenue al final (PRD US-001).
- Si hay más configuraciones que espacio: mostrar las que quepan + indicador `+N más`.
- El día de hoy tiene un distintivo visual "notorio" — definir qué es notorio para el contexto.
- Los días sin configuración previa a la `cycleStartDate` no tienen color.

### ColorPicker (src/features/theme/components/ColorPicker.tsx)
- Si el navegador no soporta color picker nativo: mostrar solo paleta predeterminada + mensaje (PRD US-007).
- RG-007: Mostrar advertencia de contraste debajo del picker si el color seleccionado < 4.5:1.
- Mostrar aviso si el color elegido ya existe en otra configuración (PRD US-003, caso edge).

### LoadingButton (shared — o Button con estado loading)
- RG-001: `disabled` nunca en el HTML.
- RG-002: Mostrar `<LoadingDots />` en lugar del texto durante carga.
- El debounce es interno (flag `isSubmitting`), no visible externamente.

### ShiftConfigForm (src/features/config/components/ShiftConfigForm.tsx)
- Input de hora: solo horas completas (08:00) o medias horas (08:30). Restringir en el diseño del input.
- Campo condicional: si el usuario indica "estoy en franco", aparece el campo de próximo inicio.
- RG-004: Scroll al primer error al intentar guardar.
