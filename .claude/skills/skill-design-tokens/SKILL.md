---
name: skill-design-tokens
description: Genera la especificación completa de design tokens para DateOnDuty — colores semánticos light/dark, tipografía, espaciado, radios, sombras y transiciones. Produce CSS custom properties + fragmento de extensión para Tailwind CSS 4. Usar al inicio del design system o al añadir nuevos tokens.
---

# SKILL: Design Tokens
**Fase:** Diseño
**Cuándo usarlo:** Al inicio del design system, antes de diseñar cualquier pantalla.
**Produce:** Especificación completa de tokens lista para que el developer agent configure Tailwind CSS 4 + CSS custom properties.

---

## INSTRUCCIONES

Al ejecutar este skill, genera la especificación completa de design tokens para DateOnDuty.
El output tiene **6 grupos** obligatorios. No omitas ninguno.

Restricciones que debes respetar:
- Dark mode se implementa con la clase `dark` en `<html>`. Define variantes `dark:` para cada token que cambie entre temas.
- Los **colores de turno del usuario son dinámicos** (hex elegido por el usuario). No los incluyas en los tokens — van como `style` inline.
- La paleta de tokens cubre **solo** la UI base: fondos, textos, bordes, feedback (error, success, warning, info), overlays y superficies.
- Usa nombres **semánticos** (ej: `color-surface-primary`, no `color-white`). Los tokens semánticos hacen el dark mode trivial.
- Incluye un **fragmento de Tailwind config** para cada grupo de tokens.

---

## OUTPUT REQUERIDO

### GRUPO 1 — Colores

Estructura obligatoria:

```
SUPERFICIE
  surface-base        → fondo principal de la app
  surface-elevated    → tarjetas, modales, drawers
  surface-overlay     → overlays semi-transparentes

TEXTO
  text-primary        → texto principal
  text-secondary      → texto secundario / subtítulos
  text-disabled       → texto inactivo
  text-inverse        → texto sobre superficies oscuras (en modo claro) o claras (en modo oscuro)

BORDE
  border-default      → líneas divisoras, contornos
  border-strong       → énfasis, separadores de sección

FEEDBACK
  feedback-error      → color + variante de fondo suave
  feedback-success    → color + variante de fondo suave
  feedback-warning    → color + variante de fondo suave
  feedback-info       → color + variante de fondo suave

INTERACTIVO
  interactive-primary         → botones primarios, CTA
  interactive-primary-hover   → estado hover
  interactive-primary-text    → texto sobre botón primario
  interactive-secondary       → botones secundarios / ghost
  focus-ring                  → outline de focus visible (accesibilidad)

TURNO (dinámico, solo tokens de apoyo)
  shift-gradient-start   → opacidad alta del color del turno (inicio del bloque)
  shift-gradient-end     → opacidad baja del color del turno (final del bloque)
  shift-text-on-light    → color del texto de hora sobre fondo claro
  shift-text-on-dark     → color del texto de hora sobre fondo oscuro
```

Para cada token especifica:
- Valor en modo claro (hex o rgba)
- Valor en modo oscuro (hex o rgba)
- Ratio de contraste WCAG contra su par más frecuente (texto sobre superficie)

### GRUPO 2 — Tipografía

```
FAMILIA
  font-family-base    → fuente principal (considera: Inter, Roboto, o system-ui)
  font-family-mono    → para horas en formato militar (opcional)

ESCALA DE TAMAÑO (en rem)
  text-xs     → etiquetas pequeñas, badges
  text-sm     → texto de apoyo, notas
  text-base   → texto de cuerpo
  text-lg     → títulos de sección
  text-xl     → encabezados secundarios
  text-2xl    → encabezado del mes en el calendario
  text-3xl    → (si aplica para elementos hero)

PESO
  font-normal   → texto de cuerpo
  font-medium   → énfasis leve
  font-semibold → botones, etiquetas activas
  font-bold     → encabezados

LINE-HEIGHT
  leading-tight   → encabezados
  leading-normal  → cuerpo
  leading-relaxed → texto de ayuda / legal
```

### GRUPO 3 — Espaciado

Define la escala base (múltiplos de 4px) y asígnale nombres semánticos para los usos más frecuentes:
```
spacing-1  = 4px
spacing-2  = 8px
spacing-3  = 12px
spacing-4  = 16px
spacing-5  = 20px
spacing-6  = 24px
spacing-8  = 32px
spacing-10 = 40px
spacing-12 = 48px
spacing-16 = 64px

SEMÁNTICOS (mapean a la escala base)
  padding-component-sm   → padding interno de componentes pequeños
  padding-component-md   → padding interno estándar
  padding-page           → margen lateral de pantalla en mobile
  padding-page-desktop   → margen lateral de pantalla en desktop
  gap-calendar-cell      → gap entre celdas del calendario
```

### GRUPO 4 — Bordes y Radios

```
RADIO DE BORDE
  radius-sm   → botones pequeños, badges, chips
  radius-md   → botones estándar, inputs, cards
  radius-lg   → modales, drawers, overlays
  radius-xl   → bottom sheets en mobile
  radius-full → pills, avatares circulares

GROSOR DE BORDE
  border-1  = 1px
  border-2  = 2px
```

### GRUPO 5 — Sombras

```
shadow-sm   → elevación leve (inputs con foco, hover de tarjeta)
shadow-md   → elevación media (cards, dropdowns)
shadow-lg   → elevación alta (modales, drawers)
shadow-none → sin sombra (modo oscuro frecuentemente prefiere esto)
```

Define variantes para modo oscuro si corresponde (las sombras en dark mode suelen ser más sutiles o reemplazadas por bordes).

### GRUPO 6 — Transiciones y Animaciones Base

```
DURACIÓN
  duration-fast    = 100ms  → feedback inmediato (hover, focus)
  duration-normal  = 200ms  → transiciones de componentes
  duration-slow    = 300ms  → animaciones de entrada/salida de modales
  duration-xslow   = 500ms  → animaciones onboarding

EASING
  ease-default   → ease-in-out para la mayoría
  ease-bounce    → para animaciones de onboarding
  ease-snap      → para navegación del calendario (rápido y preciso)

REDUCED MOTION
  Indicar el valor equivalente para prefers-reduced-motion:
  todas las animaciones de UI → duration-fast con ease-default
  onboarding → desactivar animaciones, mostrar estado final directamente
```

---

## FRAGMENTO DE TAILWIND CONFIG

Al final del output, genera el fragmento `theme.extend` para `tailwind.config.ts` que registre todos los tokens anteriores como clases de Tailwind, usando `var(--token-name)` como valores.

Ejemplo del formato esperado:
```ts
// tailwind.config.ts — fragmento theme.extend
colors: {
  'surface-base': 'var(--color-surface-base)',
  'text-primary': 'var(--color-text-primary)',
  // ...
},
```

---

## NOTAS FINALES DEL SKILL

- Los valores de los tokens para turno dinámico (`shift-gradient-start`, `shift-gradient-end`) deben ser opacidades (0.0 a 1.0), no colores fijos.
- Justifica la elección de la fuente con al menos un criterio (legibilidad en pantalla, cobertura de caracteres latinos, disponibilidad en Google Fonts o sistema).
- Verifica que el ratio de contraste texto/fondo cumple WCAG AA (4.5:1) en ambos modos.
