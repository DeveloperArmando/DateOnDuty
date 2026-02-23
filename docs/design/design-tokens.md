# DateOnDuty — Design Tokens v1.0

**Rol:** UX/UI Designer Senior
**Fecha:** Feb 2026
**Estado:** Primera versión — lista para implementación
**Referencia PRD:** DateOnDuty_PRD_v2.md
**Referencia Arquitectura:** DateOnDuty_Architecture_v1.md

---

## Decisiones de diseño resueltas en este documento

Las siguientes preguntas estaban abiertas en el handoff. Se documentan aquí como decisiones del UX/UI Designer con su justificación. Cada una se registra también en `DOD_DECISIONS_LOG.md`.

### D-UX-001 — Animación de onboarding (gestos)

**Decisión:** La animación es un card flotante no bloqueante centrado verticalmente sobre el área del calendario. Dura **8 segundos** (2 ciclos completos), luego hace fade-out en 300ms. El banner de configuración sigue visible hasta los 50 segundos.

**Diseño del card:**
- Dimensiones: ~240px × 88px
- Fondo: `surface-elevated`, `shadow-md`, `radius-lg`
- Centering: `position: fixed`, centrado en el área del calendario (no en toda la pantalla)
- Contenido: dos filas — eje vertical (arriba) y eje horizontal (abajo)
  - Fila 1: icono `ChevronUp` — "meses" — icono `ChevronDown` (lucide-react)
  - Fila 2: icono `ChevronLeft` — "años" — icono `ChevronRight` (lucide-react)
- Un pseudo-cursor (punto circular 8px, color `interactive-primary`) anima:
  - 0s–2s: se desliza verticalmente entre ChevronUp y ChevronDown (bounce suave)
  - 2s–2.5s: pausa
  - 2.5s–4.5s: se desliza horizontalmente entre ChevronLeft y ChevronRight
  - 4.5s–5s: pausa
  - 5s–7s: ciclo vertical de nuevo
  - 7s–7.5s: pausa
  - 7.5s–8s: fade-out del card completo (`opacity: 1 → 0`, `duration-slow`)

**Con `prefers-reduced-motion`:** card estático sin cursor animado, solo iconos + labels. Desaparece a los 8s sin transición de fade.

**Justificación:** Card flotante no bloquea la interacción inmediata con el calendario (principio 2 — Cero fricción). 8 segundos = 2 ciclos completos de aprendizaje sin extenderse. Independiente del banner (50s) permite al usuario descubrir los controles de botón mientras el banner sigue siendo visible.

---

### D-UX-002 — Gradiente de color en días del calendario

**Decisión:** Cada configuración activa ocupa una **franja horizontal** dentro de la celda del día. El color del usuario se aplica como fondo de la franja con gradiente vertical.

**Valores de opacidad:**
- Inicio de franja (top): `rgba(userColor, 0.90)`
- Final de franja (bottom): `rgba(userColor, 0.40)`
- CSS: `linear-gradient(to bottom, rgba(userColor, 0.90), rgba(userColor, 0.40))`

**Comportamiento por estado:**
| Estado | Franja | Texto |
|---|---|---|
| **Entrada** | Gradiente normal | Hora de entrada (ej. "8:00") — esquina superior derecha de la franja |
| **Salida** | Gradiente normal | Hora de salida (ej. "18:00") — esquina inferior derecha de la franja |
| **En Turno** | Gradiente normal | Sin texto de hora |
| **Franco** | Sin franja | Sin texto |

**Justificación:** El gradiente 0.90→0.40 mantiene el color claramente identificable en ambos extremos sin quedar plano. La opacidad (no el color sólido) garantiza que la cifra del día sea legible a través de la franja cuando se combinan múltiples configuraciones.

---

### D-UX-003 — Configuraciones visibles por celda antes de overflow

**Decisión:**
- **Mobile (< 640px):** Máximo **2 franjas** visibles. Overflow → badge `+N` en esquina inferior derecha.
- **Desktop (≥ 640px):** Máximo **3 franjas** visibles. Overflow → badge `+N`.

**Regla invariante:** La configuración default ("Mi turno") siempre ocupa la primera franja. Las adicionales se apilan en orden de creación.

**Cálculo que respalda mobile:**
Celda mobile: ~47px ancho × 56px alto. Número del día: ~18px altura. Espacio restante: ~38px para franjas. Cada franja: mínimo 14px (text-xs + padding vertical 1px). 2 franjas × 14px = 28px. Margen: 10px ✓.

**Justificación:** Cumple US-003: "garantizar que al menos la configuración default sea siempre visible en el bloque del día sin importar el tamaño de pantalla."

---

### D-UX-004 — Paleta predeterminada de colores de turno

Aparece en el color picker al crear/editar configuraciones. Son puntos de partida; el usuario puede ingresar cualquier hex válido.

| # | Nombre | Hex | Contraste texto blanco | Nivel WCAG |
|---|---|---|---|---|
| 1 | Azul | `#2563EB` | ~5.2:1 | AA ✓ |
| 2 | Rojo | `#DC2626` | ~4.6:1 | AA ✓ |
| 3 | Verde | `#15803D` | ~5.1:1 | AA ✓ |
| 4 | Ámbar | `#B45309` | ~4.9:1 | AA ✓ |
| 5 | Violeta | `#7C3AED` | ~5.9:1 | AA ✓ |
| 6 | Rosa | `#BE185D` | ~5.2:1 | AA ✓ |
| 7 | Cian | `#0E7490` | ~5.1:1 | AA ✓ |
| 8 | Naranja | `#C2410C` | ~4.7:1 | AA ✓ |
| 9 | Teal | `#0F766E` | ~4.8:1 | AA ✓ |
| 10 | Índigo | `#4338CA` | ~5.6:1 | AA ✓ |

**Nota:** El color 1 (Azul `#2563EB`) coincide con el color inicial de "Mi turno" definido en la Arquitectura (`defaultConfig.color`). Todos los colores de la paleta predeterminada son de tonalidad "700" o equivalente para garantizar que texto blanco supere 4.5:1 sobre el color de turno.

**Asignación automática al crear adicional:** el sistema asigna el siguiente color disponible de la paleta en orden (2, 3, 4…). Si todos están en uso, rota desde el inicio. El usuario puede cambiar el color inmediatamente.

---

## GRUPO 1 — Colores

### Criterios de selección de paleta

- **Superficie y texto:** escala `gray` de Tailwind para modo claro; `gray-900` como base de modo oscuro — alineado con la Arquitectura (sección 8.3) que define `#111827` (gray-900) como referencia de fondo oscuro para evaluación WCAG.
- **Acento interactivo:** azul `blue-700` / `blue-600` — profesional, culturalmente neutro en México/LATAM, contraste sólido en ambos modos.
- **Feedback:** rojo/verde/ámbar/azul semántico estándar — comprensión universal.
- **Todos los pares texto/fondo** cumplen WCAG AA (≥4.5:1), excepto estados `disabled` que son intencionalmente de bajo contraste.

### Tabla de tokens

| Token | Modo claro | Modo oscuro | Uso principal |
|---|---|---|---|
| `surface-base` | `#F9FAFB` | `#111827` | Fondo principal de la app |
| `surface-elevated` | `#FFFFFF` | `#1F2937` | Cards, modales, drawers |
| `surface-overlay` | `rgba(0,0,0,0.45)` | `rgba(0,0,0,0.70)` | Overlay semi-transparente bajo modales |
| `text-primary` | `#111827` | `#F9FAFB` | Texto principal |
| `text-secondary` | `#4B5563` | `#9CA3AF` | Subtítulos, texto de apoyo |
| `text-disabled` | `#9CA3AF` | `#4B5563` | Texto inactivo |
| `text-inverse` | `#FFFFFF` | `#111827` | Texto sobre fondos de color contrario |
| `border-default` | `#E5E7EB` | `#374151` | Líneas divisoras, contornos |
| `border-strong` | `#9CA3AF` | `#4B5563` | Separadores de sección con énfasis |
| `feedback-error` | `#DC2626` | `#F87171` | Color de error |
| `feedback-error-surface` | `#FEF2F2` | `rgba(239,68,68,0.15)` | Fondo suave de zona de error |
| `feedback-success` | `#15803D` | `#4ADE80` | Color de éxito |
| `feedback-success-surface` | `#F0FDF4` | `rgba(74,222,128,0.15)` | Fondo suave de zona de éxito |
| `feedback-warning` | `#B45309` | `#FCD34D` | Color de advertencia |
| `feedback-warning-surface` | `#FFFBEB` | `rgba(252,211,77,0.15)` | Fondo suave de advertencia |
| `feedback-info` | `#1D4ED8` | `#60A5FA` | Color informativo |
| `feedback-info-surface` | `#EFF6FF` | `rgba(96,165,250,0.15)` | Fondo suave informativo |
| `interactive-primary` | `#1D4ED8` | `#2563EB` | Botones CTA, acciones principales |
| `interactive-primary-hover` | `#1E40AF` | `#1D4ED8` | Estado hover de botón primario |
| `interactive-primary-text` | `#FFFFFF` | `#FFFFFF` | Texto sobre botón primario |
| `interactive-secondary-border` | `#1D4ED8` | `#3B82F6` | Borde de botón secundario/ghost |
| `interactive-secondary-text` | `#1D4ED8` | `#93C5FD` | Texto de botón secundario |
| `focus-ring` | `#3B82F6` | `#93C5FD` | Outline de focus-visible (accesibilidad) |
| `shift-text-on-light` | `#1F2937` | — | Hora de entrada/salida sobre franja de turno en modo claro |
| `shift-text-on-dark` | — | `#F9FAFB` | Hora de entrada/salida sobre franja de turno en modo oscuro |

> **Nota sobre `shift-gradient-opacity`:** Los valores de opacidad del gradiente de turno son constantes en ambos modos: `start = 0.90`, `end = 0.40`. Ver D-UX-002.

### Ratios de contraste WCAG verificados

**Modo claro (surface-base: #F9FAFB):**

| Par | Ratio aprox. | Nivel |
|---|---|---|
| text-primary `#111827` / surface-base `#F9FAFB` | ~17:1 | AAA ✓ |
| text-secondary `#4B5563` / surface-base `#F9FAFB` | ~7.2:1 | AA ✓ |
| text-disabled `#9CA3AF` / surface-base `#F9FAFB` | ~2.5:1 | Intencional — estado inactivo |
| interactive-primary text `#FFF` / btn `#1D4ED8` | ~8.6:1 | AAA ✓ |
| interactive-primary btn `#1D4ED8` / surface-base | ~5.9:1 | WCAG 1.4.11 ✓ |
| feedback-error `#DC2626` / surface-base `#F9FAFB` | ~5.7:1 | AA ✓ |
| feedback-warning `#B45309` / surface-base `#F9FAFB` | ~4.9:1 | AA ✓ |

**Modo oscuro (surface-base: #111827):**

| Par | Ratio aprox. | Nivel |
|---|---|---|
| text-primary `#F9FAFB` / surface-base `#111827` | ~17:1 | AAA ✓ |
| text-secondary `#9CA3AF` / surface-base `#111827` | ~6.6:1 | AA ✓ |
| text-disabled `#4B5563` / surface-base `#111827` | ~2.3:1 | Intencional — estado inactivo |
| interactive-primary text `#FFF` / btn `#2563EB` | ~5.2:1 | AA ✓ |
| interactive-primary btn `#2563EB` / surface-base | ~3.4:1 | WCAG 1.4.11 ✓ (≥3:1) |

---

## GRUPO 2 — Tipografía

### Decisión de fuente

**Principal: Inter** (Google Fonts, variable font)

- **Legibilidad numérica:** glifos de números claros y distinguibles — crítico para horas de turno (8:00, 18:30, 0800). El número `1` y la letra `l` son claramente distintos.
- **Cobertura latina:** soporte completo de caracteres españoles (ñ, á, é, í, ó, ú, ü, ¿, ¡).
- **Pantallas de gama media:** Inter fue diseñada específicamente para interfaces de pantalla, optimizada para rendering en pantallas de baja a media resolución.
- **Disponibilidad:** Google Fonts, carga con `display=swap` para evitar FOIT.
- **Carga:** se importan solo los pesos necesarios (400, 500, 600, 700) mediante font variable (`ital,opsz,wght`).

**Fallback:** `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

**Monospace (formato militar):** pila de sistema — sin carga extra de red.
Stack: `ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace`
Uso: solo cuando el usuario configura `timeFormat: "military"` en una configuración (US-004).

### Escala tipográfica

| Token | Valor | px equiv. | Uso en DateOnDuty |
|---|---|---|---|
| `text-xs` | `0.75rem` | 12px | Hora en franja de turno, badge +N, label de día de semana |
| `text-sm` | `0.875rem` | 14px | Número de día en celda, texto de apoyo, notas |
| `text-base` | `1rem` | 16px | Cuerpo de texto, botones, labels de inputs |
| `text-lg` | `1.125rem` | 18px | Títulos de sección en config y search |
| `text-xl` | `1.25rem` | 20px | Encabezados secundarios, nombre de config en lista |
| `text-2xl` | `1.5rem` | 24px | Nombre del mes en el calendario (`MonthHeader`) |
| `text-3xl` | `1.875rem` | 30px | Reservado — posible uso en estados vacíos hero |

> Esta escala coincide con la escala default de Tailwind CSS 4. No requiere override en `@theme` salvo para valores futuros no estándar.

### Pesos y line-heights

| Token | Valor | Uso principal |
|---|---|---|
| `font-normal` | 400 | Cuerpo, texto descriptivo, textos legales |
| `font-medium` | 500 | Énfasis leve, números de día en celda |
| `font-semibold` | 600 | Botones, labels activos, nombre del mes |
| `font-bold` | 700 | Encabezados de página, mes en header del calendario |
| `leading-tight` | 1.25 | Encabezados, nombre del mes, número de día |
| `leading-normal` | 1.5 | Cuerpo de texto, formularios |
| `leading-relaxed` | 1.625 | Texto de ayuda, páginas legales, tooltips |

---

## GRUPO 3 — Espaciado

### Escala base (múltiplos de 4px)

| Token | Valor | px equiv. |
|---|---|---|
| `spacing-1` | `0.25rem` | 4px |
| `spacing-2` | `0.5rem` | 8px |
| `spacing-3` | `0.75rem` | 12px |
| `spacing-4` | `1rem` | 16px |
| `spacing-5` | `1.25rem` | 20px |
| `spacing-6` | `1.5rem` | 24px |
| `spacing-8` | `2rem` | 32px |
| `spacing-10` | `2.5rem` | 40px |
| `spacing-12` | `3rem` | 48px |
| `spacing-16` | `4rem` | 64px |

> Esta escala coincide con la escala default de Tailwind CSS 4. Se documenta para referencia explícita en wireframes y specs de componentes.

### Tokens semánticos

| Token | Mapea a | px equiv. | Uso |
|---|---|---|---|
| `padding-component-sm` | `spacing-2` | 8px | Chips, badges, botones pequeños (ej. badge +N) |
| `padding-component-md` | `spacing-4` | 16px | Botones estándar, inputs, items de lista |
| `padding-page` | `spacing-4` | 16px | Margen lateral de pantalla en mobile (360px) |
| `padding-page-desktop` | `spacing-6` | 24px | Margen lateral de pantalla en desktop (1280px) |
| `gap-calendar-cell` | `1px` | 1px | Separación entre celdas del calendario (border approach) |
| `height-calendar-cell-mobile` | `3.5rem` | 56px | Altura de celda de día en mobile |
| `height-calendar-cell-desktop` | `5rem` | 80px | Altura de celda de día en desktop |
| `height-tap-target` | `2.75rem` | 44px | Mínimo de altura/anchura para tap targets accesibles |

---

## GRUPO 4 — Bordes y Radios

### Radio de borde

| Token | Valor | px equiv. | Uso en DateOnDuty |
|---|---|---|---|
| `radius-sm` | `0.25rem` | 4px | Franjas de turno en celda, badges, chips |
| `radius-md` | `0.5rem` | 8px | Botones estándar, inputs, cards pequeñas |
| `radius-lg` | `0.75rem` | 12px | Modales, drawers, cards de configuración |
| `radius-xl` | `1rem` | 16px | Bottom sheets en mobile (solo esquinas superiores) |
| `radius-full` | `9999px` | — | Badge +N, pills, cursor del onboarding |

### Notas de uso de radios

- **Celdas del calendario:** sin radio (`rounded-none`). El grid mantiene bordes rectos para consistencia visual de la cuadrícula.
- **Franjas de turno dentro de la celda:** `radius-sm` en todos los lados si es la única franja; sin radio lateral si toca los bordes de la celda.
- **Bottom sheets mobile:** `border-radius: radius-xl radius-xl 0 0` (solo esquinas superiores).
- **Badge +N de overflow:** `radius-full`.

### Grosor de borde

| Token | Valor | Uso |
|---|---|---|
| `border-1` | `1px` | Separadores de calendario, contornos de input, bordes de card |
| `border-2` | `2px` | Focus ring, borde de día actual en el calendario |

---

## GRUPO 5 — Sombras

| Token | Modo claro | Modo oscuro | Uso |
|---|---|---|---|
| `shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.06)` | `0 1px 2px 0 rgba(0,0,0,0.40)` | Inputs con focus, onboarding card |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)` | `0 4px 6px -1px rgba(0,0,0,0.50), 0 2px 4px -2px rgba(0,0,0,0.50)` | Cards de configuración, dropdowns, header |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)` | `0 10px 15px -3px rgba(0,0,0,0.60), 0 4px 6px -4px rgba(0,0,0,0.60)` | Modales, bottom sheets, vista expandida del día |

**Modo oscuro — regla adicional:** Complementar `shadow-md` y `shadow-lg` con `border: 1px solid var(--color-border-default)` para reforzar la elevación visual cuando las sombras son difíciles de percibir sobre fondos oscuros.

### Tabla de uso de sombras

| Elemento | Sombra |
|---|---|
| Input con foco | `shadow-sm` |
| Onboarding card animada | `shadow-md` |
| Card de configuración | `shadow-md` |
| Header / top bar | `shadow-sm` |
| Dropdown / menú contextual | `shadow-md` |
| Modal vista expandida del día | `shadow-lg` |
| Modal importación de config (`?cfg=`) | `shadow-lg` |
| Bottom sheet mobile | `shadow-lg` |

---

## GRUPO 6 — Transiciones y Animaciones Base

### Duraciones

| Token | Valor | Uso |
|---|---|---|
| `duration-fast` | `100ms` | Hover, aparición de focus ring, feedback de tap |
| `duration-normal` | `200ms` | Transiciones de componentes (inputs, botones, toggles) |
| `duration-slow` | `300ms` | Apertura/cierre de modales, overlays, bottom sheets |
| `duration-xslow` | `500ms` | Fade-in del onboarding card |

### Curvas de easing

| Token | Valor cubic-bezier | Descripción de movimiento | Uso |
|---|---|---|---|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Suave, natural — entra rápido, frena al final | Mayoría de transiciones de UI |
| `ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Ligero rebote al final — sensación de vida | Onboarding card fade-in, confirmaciones de guardado |
| `ease-snap` | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | Rápido y preciso — sin aceleración visible | Navegación del calendario (cambio de mes/año) |

### Matriz de transiciones por elemento

| Componente / Acción | Duración | Easing | Propiedad animada |
|---|---|---|---|
| Botón: hover | `duration-fast` | `ease-default` | `background-color`, `box-shadow` |
| Botón: focus | `duration-fast` | `ease-default` | `outline`, `box-shadow` |
| Input: focus | `duration-fast` | `ease-default` | `border-color`, `box-shadow` |
| Modal: apertura | `duration-slow` | `ease-bounce` | `opacity` (0→1), `transform` (scale 0.95→1) |
| Modal: cierre | `duration-normal` | `ease-default` | `opacity` (1→0), `transform` (1→0.95) |
| Bottom sheet: apertura | `duration-slow` | `ease-default` | `transform` (translateY 100%→0) |
| Bottom sheet: cierre | `duration-normal` | `ease-default` | `transform` (0→100%) |
| Calendario: cambio de mes (swipe) | `duration-normal` | `ease-snap` | `transform` translateY, `opacity` |
| Calendario: cambio de año (swipe) | `duration-normal` | `ease-snap` | `transform` translateX, `opacity` |
| Toggle de tema | `duration-normal` | `ease-default` | CSS vars (automático via cascade) |
| Tooltip: aparición | `duration-fast` | `ease-default` | `opacity`, `transform` (translateY 4px→0) |
| Tooltip: desaparición | `duration-fast` | `ease-default` | `opacity` |
| Onboarding card: fade-in | `duration-xslow` | `ease-bounce` | `opacity` (0→1), `transform` (scale 0.92→1) |
| Onboarding card: fade-out | `duration-slow` | `ease-default` | `opacity` (1→0) |
| Banner de configuración: fade-out | `duration-slow` | `ease-default` | `opacity` (1→0), `max-height` (auto→0) |
| Error field: aparición | `duration-normal` | `ease-default` | `opacity`, `transform` (translateY -4px→0) |

### Reduced Motion

Cuando el usuario tiene activo `prefers-reduced-motion: reduce`:

| Elemento | Comportamiento normal | Comportamiento reduced |
|---|---|---|
| Transiciones de UI (botones, inputs, modales) | Animadas con duración normal | Duración mínima (≤0.01ms), sin transform |
| Navegación del calendario (swipe) | Slide con `ease-snap` | Cambio instantáneo sin transición |
| Onboarding card fade-in/out | Fade + scale | Aparece/desaparece instantáneamente |
| Cursor animado del onboarding | Deslizamiento continuo | Eliminado — card estático con iconos solamente |
| Banner fade-out | Fade + collapse | Desaparece instantáneamente a los 8s |

---

## Implementación CSS — Archivo `src/index.css`

Este bloque es el punto de entrada para el developer. Combina la importación de fuente, la configuración de Tailwind v4 (`@theme`), y las variables de modo oscuro.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700&display=swap');
@import "tailwindcss";

/* ─── Tailwind v4: Variante de dark mode via clase en <html> ─────────────── */
@custom-variant dark (&:where(.dark, .dark *));

/* ─── Design Tokens: valores default (modo claro) ───────────────────────── */
@theme {

  /* TIPOGRAFÍA — FAMILIA */
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;

  /* COLORES — SUPERFICIE */
  --color-surface-base:        #F9FAFB;
  --color-surface-elevated:    #FFFFFF;
  --color-surface-overlay:     rgba(0, 0, 0, 0.45);

  /* COLORES — TEXTO */
  --color-text-primary:        #111827;
  --color-text-secondary:      #4B5563;
  --color-text-disabled:       #9CA3AF;
  --color-text-inverse:        #FFFFFF;

  /* COLORES — BORDE */
  --color-border-default:      #E5E7EB;
  --color-border-strong:       #9CA3AF;

  /* COLORES — FEEDBACK */
  --color-feedback-error:           #DC2626;
  --color-feedback-error-surface:   #FEF2F2;
  --color-feedback-success:         #15803D;
  --color-feedback-success-surface: #F0FDF4;
  --color-feedback-warning:         #B45309;
  --color-feedback-warning-surface: #FFFBEB;
  --color-feedback-info:            #1D4ED8;
  --color-feedback-info-surface:    #EFF6FF;

  /* COLORES — INTERACTIVO */
  --color-interactive-primary:          #1D4ED8;
  --color-interactive-primary-hover:    #1E40AF;
  --color-interactive-primary-text:     #FFFFFF;
  --color-interactive-secondary-border: #1D4ED8;
  --color-interactive-secondary-text:   #1D4ED8;
  --color-focus-ring:                   #3B82F6;

  /* COLORES — TURNO DINÁMICO (apoyo) */
  /* Los colores de turno son dinámicos (style inline). */
  /* Estos tokens son valores de soporte para texto sobre franjas. */
  --color-shift-text-on-light:          #1F2937;
  --color-shift-text-on-dark:           #F9FAFB;

  /* BORDES — RADIO */
  --radius-sm:   0.25rem;
  --radius-md:   0.5rem;
  --radius-lg:   0.75rem;
  --radius-xl:   1rem;
  --radius-full: 9999px;

  /* SOMBRAS */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10);

  /* TRANSICIONES — DURACIÓN */
  --duration-fast:   100ms;
  --duration-normal: 200ms;
  --duration-slow:   300ms;
  --duration-xslow:  500ms;

  /* TRANSICIONES — EASING */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce:  cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-snap:    cubic-bezier(0.25, 0.1, 0.25, 1.0);

  /* ESPACIADO — SEMÁNTICO (no en escala Tailwind, son valores específicos de componente) */
  --height-calendar-cell-mobile:  3.5rem;
  --height-calendar-cell-desktop: 5rem;
  --height-tap-target:            2.75rem;
}

/* ─── Design Tokens: overrides modo oscuro ───────────────────────────────── */
.dark {
  /* SUPERFICIE */
  --color-surface-base:        #111827;
  --color-surface-elevated:    #1F2937;
  --color-surface-overlay:     rgba(0, 0, 0, 0.70);

  /* TEXTO */
  --color-text-primary:        #F9FAFB;
  --color-text-secondary:      #9CA3AF;
  --color-text-disabled:       #4B5563;
  --color-text-inverse:        #111827;

  /* BORDE */
  --color-border-default:      #374151;
  --color-border-strong:       #4B5563;

  /* FEEDBACK */
  --color-feedback-error:           #F87171;
  --color-feedback-error-surface:   rgba(239, 68, 68, 0.15);
  --color-feedback-success:         #4ADE80;
  --color-feedback-success-surface: rgba(74, 222, 128, 0.15);
  --color-feedback-warning:         #FCD34D;
  --color-feedback-warning-surface: rgba(252, 211, 77, 0.15);
  --color-feedback-info:            #60A5FA;
  --color-feedback-info-surface:    rgba(96, 165, 250, 0.15);

  /* INTERACTIVO */
  --color-interactive-primary:          #2563EB;
  --color-interactive-primary-hover:    #1D4ED8;
  --color-interactive-primary-text:     #FFFFFF;
  --color-interactive-secondary-border: #3B82F6;
  --color-interactive-secondary-text:   #93C5FD;
  --color-focus-ring:                   #93C5FD;

  /* SOMBRAS (más profundas en dark mode) */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.40);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.50), 0 2px 4px -2px rgba(0, 0, 0, 0.50);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.60), 0 4px 6px -4px rgba(0, 0, 0, 0.60);
}

/* ─── Reduced Motion ─────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ─── Base styles ────────────────────────────────────────────────────────── */
html {
  font-family: var(--font-sans);
  background-color: var(--color-surface-base);
  color: var(--color-text-primary);
}
```

---

## Tailwind Config — `tailwind.config.ts`

En Tailwind v4, la mayor parte de la configuración se hace en CSS (`@theme`). El `tailwind.config.ts` queda mínimo:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
}

export default config
```

### Clases Tailwind generadas por `@theme`

Los tokens definidos en `@theme` generan automáticamente clases de utilidad en Tailwind v4. Referencia de uso más frecuente:

| Token `@theme` | Clases Tailwind generadas | Ejemplo de uso |
|---|---|---|
| `--color-surface-base` | `bg-surface-base`, `text-surface-base` | `<main class="bg-surface-base">` |
| `--color-surface-elevated` | `bg-surface-elevated` | `<div class="bg-surface-elevated shadow-md">` |
| `--color-text-primary` | `text-text-primary` | `<p class="text-text-primary">` |
| `--color-text-secondary` | `text-text-secondary` | `<span class="text-text-secondary">` |
| `--color-text-disabled` | `text-text-disabled` | `<label class="text-text-disabled">` |
| `--color-border-default` | `border-border-default` | `<div class="border border-border-default">` |
| `--color-feedback-error` | `text-feedback-error`, `bg-feedback-error` | `<p class="text-feedback-error">` |
| `--color-feedback-error-surface` | `bg-feedback-error-surface` | `<div class="bg-feedback-error-surface">` |
| `--color-interactive-primary` | `bg-interactive-primary` | `<button class="bg-interactive-primary">` |
| `--color-focus-ring` | `ring-focus-ring` | `focus-visible:ring-2 focus-visible:ring-focus-ring` |
| `--shadow-sm` / `--shadow-md` / `--shadow-lg` | `shadow-sm`, `shadow-md`, `shadow-lg` | `<div class="shadow-md">` |
| `--radius-sm` / `--radius-md` / etc. | `rounded-sm`, `rounded-md`, etc. | `<button class="rounded-md">` |

> **Nota sobre colores de turno:** Los colores de turno del usuario se aplican **siempre** via `style={{ background: ... }}` inline, **nunca** via clases Tailwind dinámicas. Esta es una restricción de la Arquitectura (sección 8.3).

---

## Constantes de diseño (no CSS — para componentes)

Estos valores no son custom properties CSS sino decisiones de diseño que los componentes deben implementar directamente:

```ts
// src/shared/constants/design.ts — para uso en componentes

export const DESIGN = {
  // Turno dinámico
  shift: {
    gradientOpacityStart: 0.90,
    gradientOpacityEnd:   0.40,
  },

  // Calendario
  calendar: {
    maxConfigsMobile:  2,  // franjas visibles antes de badge +N en mobile (<640px)
    maxConfigsDesktop: 3,  // franjas visibles antes de badge +N en desktop (≥640px)
  },

  // Onboarding
  onboarding: {
    animationDurationMs: 8_000,   // duración de la animación de gestos
    bannerDurationMs:    50_000,  // duración del banner de configuración
  },

  // Color picker — paleta predeterminada (orden de asignación automática)
  shiftColorPalette: [
    '#2563EB', // 1 — Azul (default de "Mi turno")
    '#DC2626', // 2 — Rojo
    '#15803D', // 3 — Verde
    '#B45309', // 4 — Ámbar
    '#7C3AED', // 5 — Violeta
    '#BE185D', // 6 — Rosa
    '#0E7490', // 7 — Cian
    '#C2410C', // 8 — Naranja
    '#0F766E', // 9 — Teal
    '#4338CA', // 10 — Índigo
  ],

  // Validación WCAG (compartidos con core/contrast/wcag-contrast.ts)
  wcag: {
    lightSurface: '#F9FAFB',  // surface-base modo claro
    darkSurface:  '#111827',  // surface-base modo oscuro
    minContrastAA: 4.5,
  },
} as const
```

> **Importante:** Los valores `wcag.lightSurface` y `wcag.darkSurface` deben coincidir exactamente con los tokens `--color-surface-base` definidos en `@theme` y `.dark`. Cualquier cambio a esos tokens debe actualizarse también aquí.

---

## Checklist de implementación (developer)

- [ ] Agregar import de Inter en `index.html` o `src/index.css`
- [ ] Insertar el bloque `@theme` en `src/index.css`
- [ ] Insertar el bloque `.dark { }` en `src/index.css`
- [ ] Agregar `@media (prefers-reduced-motion: reduce)` en `src/index.css`
- [ ] Configurar `tailwind.config.ts` con `darkMode: 'class'`
- [ ] Crear `src/shared/constants/design.ts` con las constantes
- [ ] Verificar que `core/contrast/wcag-contrast.ts` use `DESIGN.wcag.lightSurface` y `DESIGN.wcag.darkSurface`
- [ ] Verificar que `config-store.ts` use `DESIGN.shiftColorPalette[0]` como color inicial del default config (debe coincidir con `#2563EB` definido en la Arquitectura)

---

## Próximo artefacto

Wireframes del calendario principal (`/`) — invocar `/skill-wireframe calendario`.
Cubrir: estado vacío (primera vez), 1 config activa, múltiples configs con overflow, día actual resaltado.

---

*Generado por: Agente UX/UI Designer — DateOnDuty Design System v1.0 — Feb 2026*
