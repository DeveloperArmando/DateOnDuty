# Componente: ShiftConfigForm
**Feature:** config
**Archivo en arquitectura:** `src/features/config/components/ShiftConfigForm.tsx`
**US de referencia:** US-004, US-005, US-007
**Descripción:** Formulario de creación y edición de una configuración de turno. Es el componente de mayor complejidad lógica de la app — gestiona validación, estados condicionales, y persistencia vía store.
**Reutilización:** No — exclusivo de `features/config/`. Usado en `/config/:id` (nueva y edición).

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `mode` | `"new"` \| `"edit"` | Título de la página, comportamiento del botón guardar |
| `isDefault` | `true` \| `false` | Muestra sección adicional "PREFERENCIAS GLOBALES" al final |
| `config` | `ShiftConfiguration \| undefined` | Config a editar (undefined en mode=new) |

---

## 3. Estados Visuales

Los estados son a nivel de campo/sección, no del formulario completo.

| Estado | Cambios visuales | Activado por | Regla |
|---|---|---|---|
| `default` | Campo con borde `border-default` | Estado inicial | — |
| `field-error` | Borde `border-feedback-error`, texto de error debajo, `data-error="true"` | Intento de guardar con campo inválido | RG-004 |
| `real-time-error` | Solo para nombre duplicado: borde rojo + mensaje, activado mientras escribe | `useEffect` con debounce 300ms | — |
| `scheme-custom-visible` | Aparecen 2 inputs adicionales (workHours, restHours) | `scheme === "custom"` | — |
| `franco-mode` | Campo de "próximo inicio de turno" aparece (`select` de 3-4 opciones) | `currentlyOnRest === true` | — |
| `contrast-warning` | AlertTriangle + texto en `feedback-warning`, debajo del color picker | Evaluación WCAG < 4.5:1 | RG-007 |
| `saving` | Botón muestra `<LoadingDots />` (aunque es síncrono, UI feedback RG-002) | Click en "Guardar" | RG-002 |
| `color-picker-unsupported` | Mensaje "Tu navegador no soporta selector de color" + paleta predeterminada únicamente | `<input type="color">` no disparó evento | — |

---

## 4. Anatomía Visual (ASCII)

### Formulario completo — modo nueva config adicional
```
┌──────────────────────────────────────────┐
│ ← Volver    Nuevo turno                  │  ← AppBar
├──────────────────────────────────────────┤
│                                          │
│  Nombre del turno                        │  ← label
│  ┌────────────────────────────────────┐  │
│  │ Turno noche                        │  │  ← input text, placeholder
│  └────────────────────────────────────┘  │
│                                          │
│  Esquema de turno                        │
│  ○ 24x48    ○ 12x36    ○ 48x48          │  ← radio group
│  ○ Personalizado                         │
│                                          │
│  [si Personalizado seleccionado:]        │
│  Horas de trabajo    Horas de descanso   │
│  ┌──────────┐        ┌──────────┐       │
│  │    24    │        │    48    │       │
│  └──────────┘        └──────────┘       │
│  (12–72, solo enteros)                   │  ← helper text
│                                          │
│  Hora de entrada                         │
│  ┌────────────────────────────────────┐  │
│  │ 08:00                         [🕐] │  │  ← input time (24h display) o select
│  └────────────────────────────────────┘  │
│                                          │
│  Inicio del ciclo                        │
│  ┌────────────────────────────────────┐  │
│  │ 15 de febrero de 2026         [📅] │  │  ← date picker nativo
│  └────────────────────────────────────┘  │
│                                          │
│  ¿Estás actualmente en franco?           │
│  ┌──────────────────┐                   │
│  │ No (por defecto) │  ▾               │  ← select/toggle
│  └──────────────────┘                   │
│                                          │
│  [si franco=Sí:]                         │
│  Tu próximo inicio de turno              │
│  ┌────────────────────────────────────┐  │
│  │ Mañana (mié. 18 feb)          ▾   │  │  ← select con 3-4 opciones
│  └────────────────────────────────────┘  │
│                                          │
│  Color del turno                         │
│  ┌─────────────────────────────────┐    │
│  │ 🔵  #2563EB    [Cambiar color] │    │  ← swatch + valor hex + botón
│  └─────────────────────────────────┘    │
│  ● ● ● ● ● ● ● ● ● ●                   │  ← paleta 10 colores predeterminados
│                                          │
│  [si contraste insuficiente:]            │
│  ⚠ El color elegido puede dificultar    │
│    la lectura del texto sobre la franja  │  ← feedback-warning, no bloquea
│                                          │
│  Formato de hora                         │
│  ○ 12 horas (8:00 AM)                   │
│  ○ 24 horas (20:00)                     │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │           Guardar turno           │  │  ← Button primary, fullWidth
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### Sección adicional — solo si isDefault=true (editar "Mi turno")
```
│  ──────────── PREFERENCIAS GLOBALES ──── │  ← separador con label
│                                          │
│  Primer día de la semana                 │
│  ○ Domingo (por defecto)                 │
│  ○ Lunes                                 │
│                                          │
│  Color de líneas del calendario          │
│  ┌─────────────────────────────────┐    │
│  │  ——  Gris por defecto      ▾   │    │  ← select con 3-4 opciones
│  └─────────────────────────────────┘    │
│                                          │
│  Tema de la aplicación                   │
│  ○ Claro   ○ Oscuro                     │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │           Guardar turno           │  │
│  └────────────────────────────────────┘  │
```

### Estado de error en campo:
```
│  Nombre del turno                        │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │  ← borde rojo (feedback-error)
│  └────────────────────────────────────┘  │
│  ⓘ El nombre ya existe. Elige otro.     │  ← text-xs, feedback-error, data-error="true"
```

---

## 5. Diseño Responsive

| Breakpoint | Cambio |
|---|---|
| mobile (< 640px) | Single column. Inputs a full width. |
| desktop (≥ 640px) | Max-width: 480px. Centrado. Campos horas de trabajo/descanso en 2 columnas. |

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` (página) | `--color-surface-base` | |
| `background-color` (input) | `--color-surface-elevated` | |
| `border-color` (input default) | `--color-border-default` | |
| `border-color` (input error) | `--color-feedback-error` | |
| `color` (label) | `--color-text-primary` | |
| `color` (helper / caption) | `--color-text-secondary` | |
| `color` (error text) | `--color-feedback-error` | |
| `color` (warning text + icon) | `--color-feedback-warning` | |
| `color` (separador "PREFERENCIAS GLOBALES") | `--color-text-secondary` | text-xs uppercase tracking-wide |
| `border-radius` (inputs) | `--radius-md` | |
| `padding` (inputs) | `px-3 py-2.5` | |
| `transition` (border-color al error) | `--duration-fast ease-default` | |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <form> con id único
- Cada campo: <label htmlFor="fieldId"> + <input id="fieldId">
- Radios: <fieldset> + <legend> para grupos de opciones relacionadas
- Mensajes de error: <p role="alert" aria-live="assertive"> para errores en submit
                     <p aria-live="polite"> para errores en tiempo real (nombre duplicado)
- data-error="true": en el elemento del campo con error (para scroll-to-first-error)

TECLADO:
- Tab: navega secuencialmente por todos los campos e inputs
- Enter en <form>: dispara submit (equivalente a click en botón Guardar)
- Flechas en radio groups: navegan entre opciones del grupo
- Escape: navega back a /config (si no hay cambios sin guardar)

FOCUS:
- Focus visible en todos los inputs: outline 2px solid --color-focus-ring
- Al intentar guardar con errores: scrollToFirstError() → foco al primer [data-error="true"]
- El scroll es suave: behavior: "smooth"

CONTRASTE:
- Labels: text-primary sobre surface-base → ~17:1 AAA ✓
- Placeholder: text-disabled → intencional (ayuda visual, no información crítica)
- Error text: feedback-error sobre surface-base → ~5.7:1 AA ✓
- Warning text: feedback-warning sobre surface-base → ~4.9:1 AA ✓
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Aparición de campos condicionales (custom scheme, franco) | Toggle de condición | `duration-fast` | `ease-out` |
| Shake en campo con error (opcional) | Submit fallido | `duration-fast` × 3 | `ease-in-out` |

```css
/* Campos condicionales aparecen con fade + slide */
.conditional-field {
  animation: field-appear duration-fast ease-out;
}
@keyframes field-appear {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

> Sin animaciones de shake por defecto — solo borde rojo + scroll es suficiente. El shake puede evaluarse como mejora en v2.0.

---

## 9. Notas para el Developer Agent

- **Validación al guardar, no en tiempo real** (excepción: nombre duplicado). La validación de campos vacíos, rangos numéricos y formatos ocurre solo al hacer click en "Guardar" (RG-001). Nunca mostrar errores al usuario mientras tipea (excepto nombre duplicado).
- **Nombre duplicado:** `useEffect` con debounce 300ms que compara el nombre ingresado contra `configStore.configs.map(c => c.name)`. Excluir el propio config en modo edit (comparar por `id`).
- **Input hora:** Usar `<input type="time">` nativo — soporta bien en los browsers objetivo. Almacenar siempre en formato `"HH:mm"` (24h). El `timeFormat` del config solo afecta la visualización en el calendario, no el almacenamiento.
- **Input fecha (cycleStartDate):** Usar `<input type="date">` nativo. Almacenar como `"YYYY-MM-DD"` ISO. Inicializar con fecha de hoy si es config nueva.
- **Franco select:** Si `currentlyOnRest === true`, calcular las opciones como: hoy, mañana, pasado mañana, en 3 días. Mostrar con etiqueta: `"Hoy (mar. 17 feb)"`, `"Mañana (mié. 18 feb)"`, etc. Usar `date-fns/format` y `date-fns/addDays`.
- **Color picker:** `<input type="color" className="sr-only" ref={colorInputRef}>` → trigger con `colorInputRef.current?.click()`. Si el browser no dispara el evento `change` después del click (detección por timeout de 500ms), mostrar mensaje de fallback y ocultar el botón "Cambiar color".
- **WCAG check:** Al cambiar de color, evaluar contraste del nuevo color contra `#FFFFFF` (texto blanco sobre franja). Si ratio < 4.5:1, mostrar advertencia `feedback-warning`. La evaluación usa `src/core/wcag-contrast.ts`. La advertencia no bloquea el guardado.
- **Persistencia:** Al guardar exitosamente → `configStore.saveConfig(formData)` (síncronamente) → mostrar `<Toast>` 2s → `navigate("/config")`. El `navigate` ocurre inmediatamente al llamar `saveConfig`, el toast se monta justo antes. El toast sobrevive la navegación si está en un portal.
- **scrollToFirstError:** `document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" })`.
- **Preferencias globales (isDefault=true):** Los campos "primer día de semana", "color de líneas" y "tema" actualizan `themeStore`, no `configStore`. El guardado del formulario debe llamar a ambos stores.
- **Lógica de negocio fuera del componente:** El componente no calcula turnos, no valida el esquema de turno matemáticamente, no lee localStorage directamente. Todo va a través de stores o core.
