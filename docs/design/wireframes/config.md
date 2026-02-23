# Wireframe: Config — Lista y Formulario
**Rol:** UX/UI Designer Senior
**Fecha:** Feb 2026
**Skill invocado:** /skill-wireframe config-list, config-form
**US de referencia:** US-004, US-005, US-007
**Artefacto:** docs/design/wireframes/config.md

---

## Descripción de pantallas

| Pantalla | Ruta | Carga |
|---|---|---|
| Lista de configuraciones | `/config` | lazy |
| Formulario crear/editar | `/config/:id` (`:id` = UUID o `"new"`) | lazy |

La ruta `/config` es la puerta de entrada. El formulario `/config/:id` se abre al tocar ✎ (editar default), **Añadir**, o **Editar** en el kebab menú de una adicional.

---

## PANTALLA A — Lista de Configuraciones (`/config`)

---

### A.1 — Estado: default (solo Mi turno, sin adicionales)

*Estado al entrar por primera vez a la pantalla de configuración, o tras haber eliminado todas las adicionales.*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Configuración                     │  [1]
│──────────────────────────────────────│
│                                      │
│  MI TURNO                            │  [2]
│ ┌────────────────────────────────┐   │
│ │ [●]  Mi turno             ✎   │   │  [3]
│ │      24x48  ·  8:00  ·  Claro │   │
│ └────────────────────────────────┘   │
│                                      │
│──────────────────────────────────────│
│  ADICIONALES  0 / 10                 │  [4]
│                                      │
│      Sin configuraciones añadidas.   │  [5]
│      Agrega el turno de un familiar  │
│      o compañero para compararlo en  │
│      el calendario.                  │
│                                      │
│──────────────────────────────────────│
│  [+  Añadir configuración      ]     │  [6]
│──────────────────────────────────────│
│   Términos  ·  Privacidad  ·  Feedback│
└──────────────────────────────────────┘
```

---

### A.2 — Estado: multiple-configs (default + adicionales)

*Vista habitual de un usuario con 2 configuraciones adicionales, una activa y una inactiva.*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Configuración                     │
│──────────────────────────────────────│
│                                      │
│  MI TURNO                            │
│ ┌────────────────────────────────┐   │
│ │ [●]  Mi turno             ✎   │   │  [3]
│ │      24x48  ·  8:00  ·  Claro │   │
│ └────────────────────────────────┘   │
│                                      │
│──────────────────────────────────────│
│  ADICIONALES  2 / 10                 │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ [●]  Turno de Armando   ◉  ⋮  │   │  [7]
│ │      12x36  ·  7:00           │   │
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ [●]  Turno de Luis      ○  ⋮  │   │  [8]
│ │      24x48  ·  8:00  Inactiva │   │
│ └────────────────────────────────┘   │
│                                      │
│──────────────────────────────────────│
│  [+  Añadir configuración      ]     │  [9]
│──────────────────────────────────────│
│   Términos  ·  Privacidad  ·  Feedback│
└──────────────────────────────────────┘
```

---

### A.3 — Kebab menú (⋮) expandido

*Bottom sheet que aparece al tocar ⋮ sobre cualquier configuración adicional.*

```
/* mobile — bottom sheet / 360px */

┌──────────────────────────────────────┐
│         ─────                        │  [10]  ← drag handle
│  Turno de Armando                    │
│──────────────────────────────────────│
│  ✎  Editar                           │  [11]
│  ⭐ Hacer configuración principal    │  [12]
│  ↗  Compartir enlace                 │  [13]
│  🗑  Eliminar                         │  [14]
│──────────────────────────────────────│
│  [  Cancelar                   ]     │  [15]
└──────────────────────────────────────┘
```

---

### A.4 — Modal confirmación: Eliminar

```
/* overlay / 360px */

┌──────────────────────────────────────┐
│  Eliminar configuración          ✕   │  [16]
│──────────────────────────────────────│
│  ¿Eliminar "Turno de Armando"?       │
│  Esta acción no se puede deshacer.   │
│                                      │
│  [  Eliminar                   ]     │  [17]
│  [  Cancelar                   ]     │
└──────────────────────────────────────┘
```

---

### A.5 — Modal confirmación: Hacer predeterminada

*Flujo especial cuando una adicional se convierte en default: la antigua default pasa a ser adicional y necesita un nombre.*

```
/* overlay / 360px */

┌──────────────────────────────────────┐
│  Nueva configuración principal   ✕   │  [18]
│──────────────────────────────────────│
│  "Turno de Armando" será tu          │
│  configuración principal.            │
│                                      │
│  Asigna un nombre a la anterior:     │
│  [ Mi turno anterior           ]     │  [19]
│                                      │
│  [  Confirmar cambio           ]     │  [20]
│  [  Cancelar                   ]     │
└──────────────────────────────────────┘
```

---

### A.6 — Estado: límite alcanzado (10/10)

*Idéntico a A.2 pero con 10 adicionales. El botón "Añadir" sigue activo (RG-001).*

```
│  ADICIONALES  10 / 10                │
│                                      │
│ [[ ...10 filas de configs... ]]      │
│                                      │
│──────────────────────────────────────│
│  [+  Añadir configuración      ]     │  [21]
│──────────────────────────────────────│
```

*Al tocar "Añadir" con 10 adicionales:*

```
/* Toast / mensaje inline bajo el botón */

│  [+  Añadir configuración      ]     │
│  ⚠ Límite alcanzado. Elimina al     │  [22]
│    menos una para añadir otra.       │
```

---

### Variante Desktop (1280px)

```
/* desktop — 1280px, centrado en max-w-2xl */

┌──────────────────────────────────────────────────────────────┐
│  ⟨  Configuración                                             │
│──────────────────────────────────────────────────────────────│
│                                                              │
│  MI TURNO                                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [●]  Mi turno                 24x48 · 8:00 · Claro  ✎ │ │  [3]
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ADICIONALES  2 / 10                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [●]  Turno de Armando    12x36 · 7:00     ◉  ✎ ↗ 🗑  │  │  [7d]
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [●]  Turno de Luis       24x48 · 8:00 Inactiva  ○  ✎ ↗ 🗑 │  [8d]
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [+  Añadir configuración                              ]     │
│──────────────────────────────────────────────────────────────│
│   Términos de uso  ·  Privacidad  ·  Feedback                │
└──────────────────────────────────────────────────────────────┘
```

> En desktop los botones de acción (✎ editar, ↗ compartir, 🗑 eliminar) son visibles inline en la fila — sin kebab menú. El toggle de activo/inactivo sigue siendo el mismo (◉ / ○). La opción "⭐ Hacer predeterminada" se accede por hover sobre la fila o como ítem de un menú secundario (no critical-path en desktop).

---

## PANTALLA B — Formulario de Configuración (`/config/:id`)

---

### B.1 — Estado: nueva-adicional (crear modo — campos vacíos)

*Ruta: `/config/new`*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Nueva configuración               │  [23]
│──────────────────────────────────────│
│                                      │
│  IDENTIFICACIÓN                      │
│  [ Nombre de la configuración   ]    │  [24]
│                                      │
│  ESQUEMA DE TURNO                    │  [25]
│  ◉ 24x48          ○ 12x36           │
│  ○ 48x48          ○ Personalizado    │
│                                      │
│  HORA DE ENTRADA                     │  [26]
│  [ 8:00                        ▾ ]  │
│                                      │
│  FORMATO DE HORA                     │  [27]
│  ◉ 12 horas   ○ 24 horas   ○ Militar│
│                                      │
│  SITUACIÓN ACTUAL                    │  [28]
│  ◉ Estoy en turno hoy               │
│  ○ Estoy en franco                  │
│                                      │
│  COLOR DEL TURNO                     │  [29]
│                                      │
│   [●] [●] [●] [●] [●]               │
│   [●] [●] [●] [●] [●]               │
│                                      │
│   [+  Más colores              ]     │  [30]
│                                      │
│──────────────────────────────────────│
│  [  Guardar configuración      ]     │  [31]
└──────────────────────────────────────┘
```

---

### B.2 — Estado: esquema-personalizado (Personalizado seleccionado)

*Campos de horas de trabajo y descanso aparecen al seleccionar "Personalizado".*

```
/* mobile — 360px (solo sección ESQUEMA DE TURNO) */

│  ESQUEMA DE TURNO                    │
│  ○ 24x48          ○ 12x36           │
│  ○ 48x48          ◉ Personalizado    │
│                                      │
│  Horas de trabajo (12–72)            │  [32]
│  [ 24                          ]     │
│                                      │
│  Horas de descanso (12–72)           │  [33]
│  [ 48                          ]     │
```

---

### B.3 — Estado: en-franco (Franco seleccionado)

*Campo de fecha aparece al seleccionar "Estoy en franco".*

```
/* mobile — 360px (solo sección SITUACIÓN ACTUAL) */

│  SITUACIÓN ACTUAL                    │
│  ○ Estoy en turno hoy               │
│  ◉ Estoy en franco                  │
│                                      │
│  ¿Cuándo inicia tu próximo turno?    │  [34]
│  [ sáb 28 de feb, 2026         ▾ ]  │
│  Máximo 3 días desde hoy.            │
```

---

### B.4 — Estado: error (validaciones activas)

*Scroll automático al primer campo con error (RG-004).*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Nueva configuración               │
│──────────────────────────────────────│
│                                      │
│  IDENTIFICACIÓN                      │
│ ┌────────────────────────────────┐   │
│ │ Turno de Armando               │   │
│ └────────────────────────────────┘   │
│  ⚠ Ya tienes una configuración con  │  [35]
│    ese nombre.                       │
│                                      │
│  ESQUEMA DE TURNO                    │
│  ○ 24x48          ○ 12x36           │
│  ○ 48x48          ◉ Personalizado    │
│                                      │
│ ┌──────────────────────────────┐     │
│ │ 8                            │     │
│ └──────────────────────────────┘     │
│  ⚠ Horas de trabajo: mínimo 12.     │  [36]
│                                      │
│  COLOR DEL TURNO                     │
│  ⚠ Este color ya lo usa "Mi turno". │  [37]
│    Pueden ser difíciles de           │
│    distinguir en el calendario.      │
│                                      │
│──────────────────────────────────────│
│  [  Guardar configuración      ]     │  [31]
└──────────────────────────────────────┘
```

---

### B.5 — Estado: contraste insuficiente (advertencia WCAG)

*Advertencia no bloqueante bajo el color picker cuando el color seleccionado falla 4.5:1.*

```
/* mobile — 360px (solo sección COLOR DEL TURNO) */

│  COLOR DEL TURNO                     │
│                                      │
│   [●] [●] [●] [●] [●]              │
│   [●] [●] [●] [●] [●]              │
│                                      │
│  ⚠ Este color puede ser difícil de  │  [38]
│    leer sobre el fondo del tema      │
│    actual (contraste insuficiente).  │
│    Puedes continuar de todas formas. │
│                                      │
│   [+  Más colores              ]     │
```

---

### B.6 — Estado: color picker no soportado

*Solo la paleta, sin botón "Más colores". Aparece mensaje informativo.*

```
/* mobile — 360px (solo sección COLOR DEL TURNO) */

│  COLOR DEL TURNO                     │
│                                      │
│   [●] [●] [●] [●] [●]              │
│   [●] [●] [●] [●] [●]              │
│                                      │
│  ℹ Tu navegador no soporta el       │  [39]
│    selector de color personalizado.  │
```

---

### B.7 — Estado: saving (guardando)

*Botón en estado loading mientras el store procesa la escritura en localStorage.*

```
│──────────────────────────────────────│
│  [  Guardando  · · ·           ]     │  [40]
└──────────────────────────────────────┘
```

---

### B.8 — Formulario para editar Mi turno (`/config/[defaultId]`)

*Sin campo de nombre. Incluye sección PREFERENCIAS GLOBALES al final.*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Mi turno                          │  [41]
│──────────────────────────────────────│
│                                      │
│  ESQUEMA DE TURNO                    │
│  ◉ 24x48          ○ 12x36           │
│  ○ 48x48          ○ Personalizado    │
│                                      │
│  HORA DE ENTRADA                     │
│  [ 8:00                        ▾ ]  │
│                                      │
│  FORMATO DE HORA                     │
│  ◉ 12 horas   ○ 24 horas   ○ Militar│
│                                      │
│  SITUACIÓN ACTUAL                    │
│  ◉ Estoy en turno hoy               │
│  ○ Estoy en franco                  │
│                                      │
│  COLOR DEL TURNO                     │
│   [●] [●] [●] [●] [●]              │
│   [●] [●] [●] [●] [●]              │
│   [+  Más colores              ]     │
│                                      │
│──────────────────────────────────────│
│  PREFERENCIAS GLOBALES               │  [42]
│                                      │
│  Color de líneas del calendario      │  [43]
│   [●] [●] [●] [●] [●]              │
│   [●] [●] [●] [●] [●]              │
│   [+  Más colores              ]     │
│                                      │
│  Primer día de la semana             │  [44]
│  [■ Domingo     ] [   Lunes    ]    │
│                                      │
│  Tema de la app                      │  [45]
│  [■ Claro       ] [   Oscuro   ]    │
│                                      │
│──────────────────────────────────────│
│  [  Guardar cambios            ]     │
└──────────────────────────────────────┘
```

---

### Variante Desktop (1280px)

> Ambos formularios (nueva adicional y editar default) se muestran centrados en un contenedor `max-w-lg` con `mx-auto`. La estructura de campos es idéntica a mobile. El mayor ancho añade padding horizontal pero no divide el formulario en columnas — los campos siguen apilados verticalmente para mantener el flujo de lectura en un formulario de configuración. El sticky bottom bar se convierte en un botón alineado al final del formulario (no fijo en la pantalla).

---

## Anotaciones

**[1] — Navegación de regreso desde `/config`**
- `⟨` retorna a `/` (calendario). Usa `useNavigate(-1)` o `<Link to="/">`.
- No `<a href>` — usar React Router.
- `aria-label="Volver al calendario"`.

**[2] — Sección "MI TURNO"**
- Etiqueta de sección: `text-xs font-semibold text-text-secondary uppercase tracking-wide`.
- La config default siempre existe y siempre está en primer lugar.
- No tiene toggle de activo/inactivo — siempre activa.
- No tiene botón de eliminar ni de hacer predeterminada.
- Solo tiene ✎ (editar) que lleva a `/config/[defaultId]`.

**[3] — Fila de Mi turno**
- `[●]` = color swatch circular, 20px, `style={{ backgroundColor: config.color }}`. `border border-border-default` para colores muy claros.
- Texto principal "Mi turno" en `text-base font-semibold text-text-primary`.
- Texto secundario "{scheme} · {entryTime} · {theme}" en `text-sm text-text-secondary`.
- ✎ = icono `Pencil` de lucide-react, 16px. `aria-label="Editar Mi turno"`.
- Toda la fila tiene `role="button"` con `onClick → /config/[defaultId]`. El ✎ es el único tap target intencional, pero tocar la fila también funciona.

**[4] — Contador de adicionales**
- Formato: "N / 10". Actualiza reactivamente desde el store.
- Si N=0: muestra el estado vacío [5]. Si N>0: muestra las filas.

**[5] — Estado vacío de adicionales**
- Solo texto de ayuda contextual. Sin ícono decorativo (simplicidad).
- Texto: `text-sm text-text-secondary text-center` con padding vertical generoso.

**[6] — Botón "Añadir configuración"**
- Tipo: botón secundario (ghost style): `border border-interactive-primary text-interactive-primary`.
- `aria-label="Añadir nueva configuración de turno"`.
- **RG-001:** nunca `disabled`. Si el límite de 10 está alcanzado, el tap muestra el mensaje de error [22] inline debajo del botón. El botón NO cambia a estado deshabilitado visualmente.
- Al tocar (con límite no alcanzado): navega a `/config/new`.

**[7] — Fila de configuración adicional activa**
- `[●]` = color swatch 20px.
- Nombre en `text-base font-semibold text-text-primary`. Si el nombre supera el espacio disponible, se trunca con `truncate` y `title={config.name}` para tooltip nativo (RG-006).
- `◉` = toggle activo. Representado como `<button role="switch" aria-checked="true">`. Al tocar: cambia a inactiva inmediatamente (optimistic update en el store).
- `⋮` = icono `MoreVertical` de lucide-react. `aria-label="Opciones de Turno de Armando"`. Al tocar: abre el bottom sheet [A.3].
- Texto secundario "{scheme} · {entryTime}" en `text-sm text-text-secondary`.

**[8] — Fila de configuración adicional inactiva**
- Igual que [7] pero `○` (toggle inactivo, `aria-checked="false"`).
- Toda la fila tiene `opacity-60` para indicar visualmente que está inactiva.
- El texto secundario añade "Inactiva" en `text-text-disabled`.
- El toggle al activar: quita el `opacity-60` y actualiza el store.

**[9] — Posición del botón "Añadir" con múltiples configs**
- Siempre al final de la lista, antes del footer.
- Si hay muchas adicionales, la página scrollea y el botón está al fondo.
- El botón NO es sticky — pertenece al flujo del documento.

**[10] — Bottom sheet del kebab menú**
- Misma estructura que el bottom sheet de day-expanded: drag handle pill + overlay semitransparente.
- `role="dialog"`, `aria-label="Opciones de [nombre]"`. Focus trap.
- Se cierra con drag down, tap en overlay, tap en Cancelar, o Escape.
- La opción "⭐ Hacer configuración principal" solo aparece si hay una config adicional que no sea ya la default.

**[11] — Opción Editar (kebab)**
- Navega a `/config/[id]` (el ID de la config adicional seleccionada).
- Icono `Pencil` de lucide-react.

**[12] — Opción Hacer configuración principal (kebab)**
- Icono `Star` de lucide-react.
- Al tocar: cierra el kebab → abre el modal de confirmación [A.5].
- La acción requiere que el usuario asigne un nombre a la antigua default antes de confirmar.

**[13] — Opción Compartir (kebab)**
- Icono `Share2` de lucide-react.
- Al tocar: genera el `?cfg=` URL con los datos de esta config → copia al portapapeles → muestra toast "Link copiado".
- El modal de importación (artefacto #7) se activa cuando el receptor abre el link, no aquí.
- Si `navigator.clipboard` no está disponible: muestra modal con el link en un input para copiar manualmente.

**[14] — Opción Eliminar (kebab)**
- Icono `Trash2` de lucide-react, color `text-feedback-error`.
- Al tocar: cierra el kebab → abre el modal de confirmación [A.4].

**[15] — Cancelar en kebab**
- Botón ghost. Cierra el bottom sheet sin hacer nada.
- `aria-label="Cancelar"`. Siempre accesible vía Escape.

**[16] — Modal Confirmar Eliminar**
- `role="dialog"`, `aria-modal="true"`, focus trap (Tab cicla entre los dos botones y el ✕).
- Overlay: `bg-surface-overlay`.
- Fondo del modal: `bg-surface-elevated rounded-lg shadow-lg`.
- El botón "Eliminar" es destructivo: `bg-feedback-error text-white`.
- RG-001: el botón "Eliminar" nunca está deshabilitado. Ejecuta la acción al primer tap.
- Tras eliminar: modal se cierra, fila desaparece con animación `fade-out + height collapse`.

**[17] — Botón Eliminar (destructivo)**
- `bg-feedback-error text-white rounded-lg`. Nunca `disabled`.
- Al tocar: `config-store.deleteConfig(id)` → cierra modal → actualiza la lista reactivamente.

**[18] — Modal Hacer predeterminada**
- `role="dialog"`, `aria-modal="true"`, focus trap.
- El campo de nombre [19] tiene foco automático al abrir (`autoFocus`).
- Validación del nombre: igual que en el formulario (no vacío, no duplicado).
- El botón "Confirmar" [20] nunca está `disabled` (RG-001). Si el campo está vacío al confirmar, muestra error en el campo.

**[19] — Input nombre para la antigua default**
- Placeholder: "Nombre de la configuración anterior" (i18n key).
- Validado en el submit, no en tiempo real (el campo aparece nuevo, no puede ser duplicado todavía).
- El store maneja la transacción: (1) nueva default recibe la antigua config, (2) antigua default recibe nombre nuevo y pasa a adicional, (3) todo en una sola operación atómica en localStorage.

**[20] — Botón Confirmar (hacer predeterminada)**
- Primario. Al confirmar con campo válido: ejecuta la transacción, cierra modal, actualiza lista.
- Si campo inválido (vacío): muestra error en campo [19], NO ejecuta la transacción.

**[21] — Botón Añadir con 10/10 adicionales**
- Visualmente idéntico al botón en [6]. Sin cambio de estilo.
- Al tocar con 10 adicionales: en lugar de navegar, muestra el mensaje de error [22].

**[22] — Mensaje de límite alcanzado**
- Aparece como texto inline debajo del botón, `text-sm text-feedback-warning`.
- `role="alert"` para anunciar a screen readers.
- No es un toast — es contextual y permanente hasta que el usuario elimine una config.

---

**[23] — Navegación formulario nuevo/edición**
- `⟨` retorna a `/config`. El texto del título cambia según modo:
  - Nuevo adicional: "Nueva configuración"
  - Editar adicional: "Editar {nombre}"
  - Editar default: "Mi turno"

**[24] — Campo Nombre (solo adicionales)**
- Input de texto libre, `type="text"`, `maxLength={50}`.
- Placeholder: "Nombre de la configuración" (i18n).
- Solo para adicionales — el formulario de la default NO incluye este campo.
- Validación en submit:
  - Vacío → "El nombre es obligatorio."
  - Duplicado → "Ya tienes una configuración con ese nombre." (verificado en tiempo real mientras el usuario escribe, con debounce de 300ms).
- `data-error="true"` cuando hay error — permite el scroll automático de RG-004.

**[25] — Esquema de turno (radio group)**
- `<fieldset>` + `<legend>`. Cuatro opciones: 24x48, 12x36, 48x48, Personalizado.
- Al seleccionar Personalizado: los inputs de horas [32][33] aparecen con animación `height: 0 → auto`.
- Al deseleccionar Personalizado: los inputs colapsan con `height: auto → 0`.
- Los radios son `<input type="radio">` nativos estilizados con Tailwind (no custom component).

**[26] — Hora de entrada (select)**
- `<select>` nativo. Opciones: horas completas y medias horas del día (0:00, 0:30, 1:00, … 23:30).
- Las opciones se muestran en el formato actualmente seleccionado [27] (12h, 24h, o militar).
- Almacenamiento siempre en "HH:mm" (24h) — el formato es solo de display.
- `title` attribute en cada `<option>` no aplicable aquí; el select nativo muestra el texto de la opción.

**[27] — Formato de hora (radio group)**
- Tres opciones: "12 horas", "24 horas", "Militar".
- Al cambiar el formato: las opciones del select de entrada [26] se re-renderizan en el nuevo formato.
- "Militar" formatea como `HHMM` (sin separador). Rango válido: 0000–2359.
- `<fieldset>` + `<legend>` para accesibilidad.

**[28] — Situación actual (radio group)**
- Dos opciones: "Estoy en turno hoy" y "Estoy en franco".
- Al seleccionar "en franco": el date picker de próximo turno [34] aparece.
- Al seleccionar "en turno": el date picker desaparece (collapse animado).
- `<fieldset>` + `<legend>`.

**[29] — Color del turno (paleta)**
- 10 círculos de colores (32×32px mobile, 36×36px desktop). Grid de 5 columnas.
- El color actualmente seleccionado tiene `ring-2 ring-offset-2 ring-interactive-primary`.
- `role="radiogroup"`. Cada círculo: `role="radio"`, `aria-checked="true/false"`, `aria-label="{nombre del color}"`.
- Teclado: flechas para navegar entre colores, Enter/Space para seleccionar.
- Al cambiar el color: validar contraste WCAG (RG-007) inmediatamente.
- Si contraste falla: mostrar advertencia [38] debajo de la paleta.
- Si el color coincide con otra config: mostrar aviso [37].

**[30] — Botón "Más colores"**
- Botón ghost pequeño. Icono `Plus` de lucide-react, 14px.
- Al tocar: hace programmatic click en un `<input type="color" hidden>`.
- Si el browser soporta `<input type="color">`: abre el native color picker del OS.
- Detección de soporte: via `document.createElement('input'); el.type='color'; return el.type === 'color'`.
- Si NO soporta: oculta el botón y muestra el mensaje [39] en su lugar.
- El valor del native picker se refleja inmediatamente en la paleta como "color personalizado" seleccionado (no reemplaza los 10 de la paleta — es una selección fuera de la paleta).

**[31] — Botón Guardar / CTA principal**
- Sticky: `position: sticky; bottom: 0`. Padding superior para separar del contenido.
- Fondo: `bg-surface-base` para cubrir el contenido al hacer scroll.
- RG-001: nunca `disabled`. Valida al submit.
- RG-002: al tocar → el texto cambia a `<LoadingDots />` [40]. Flag interno `isSubmitting` previene doble-tap.
- Al guardar exitosamente: `navigate("/config")` con animación de salida.
- Error de sistema (store falla): mostrar `<ErrorMessage />` global encima del botón (RG-005).

**[32][33] — Inputs de esquema personalizado**
- `<input type="number">` con `min="12"` y `max="72"` y `step="1"`.
- HTML5 constraint validation + validación custom en submit.
- `inputMode="numeric"` para teclado numérico en móvil.
- Error [36]: aparece debajo del input si el valor está fuera de rango al submit.
- `data-error="true"` en el input cuando hay error.

**[34] — Date picker de próximo turno (en-franco)**
- `<select>` o lista de opciones nativa (no calendar picker — basta con 3-4 opciones).
- Opciones: hoy, mañana, pasado mañana, en 3 días (máximo). Mostrar fecha completa: "sáb 28 de feb".
- El valor seleccionado se convierte a `cycleStartDate` (ISO date) en el store.
- `aria-label="Fecha de inicio del próximo turno"`.

**[35] — Error nombre duplicado**
- Texto en `text-sm text-feedback-error`.
- Icono `AlertTriangle` de lucide-react, 14px, mismo color.
- Aparece en tiempo real (debounce 300ms) y persiste en el submit.
- El campo de input tiene `border-feedback-error` cuando hay error.

**[36] — Error rango de horas**
- Mismo estilo que [35].
- Aparece en submit y se elimina cuando el usuario corrige el valor.

**[37] — Aviso color duplicado**
- Icono `Info` de lucide-react (no `AlertTriangle` — es aviso, no error).
- Color: `text-feedback-warning`.
- Aparece en tiempo real al seleccionar el color.
- NO bloquea el guardado. El usuario puede continuar.

**[38] — Aviso contraste WCAG insuficiente (RG-007)**
- Icono `AlertTriangle` de lucide-react, color `text-feedback-warning`.
- Texto explica el problema y que el usuario puede continuar.
- NO bloquea el guardado.
- La evaluación usa `core/contrast/wcag-contrast.ts` con `DESIGN.wcag.lightSurface` o `DESIGN.wcag.darkSurface` según el tema activo.

**[39] — Fallback sin color picker**
- Solo aparece si el navegador no soporta `<input type="color">`.
- La paleta de 10 colores sigue siendo funcional y suficiente para el 99% de los casos.
- Icono `Info` de lucide-react, `text-feedback-info`.

**[40] — Estado loading en botón Guardar**
- El texto "Guardar configuración" es reemplazado por `<LoadingDots />`.
- El tamaño del botón no cambia (evitar layout shift).
- `isSubmitting` flag en estado local del componente. No se expone al store.

**[41] — Formulario de edición de Mi turno**
- Sin campo "Nombre" (la default siempre se llama "Mi turno" en toda la UI).
- El título del top bar es "Mi turno" (no editable).
- La sección de turno es idéntica al formulario de adicional.
- La sección de Preferencias Globales [42] aparece después de la sección de color.

**[42] — Sección PREFERENCIAS GLOBALES**
- Solo visible en el formulario de la config default.
- Separada visualmente con un divider y etiqueta de sección `text-xs uppercase`.
- Contiene: color de líneas [43], primer día de semana [44], tema [45].

**[43] — Color de líneas del calendario**
- Misma paleta de 10 colores + botón "Más colores".
- El valor default es `#E5E7EB` (token `border-default`). Ese color puede no estar en la paleta principal → el selector lo muestra como "color activo fuera de paleta" (círculo resaltado sin pertenecer a los 10).
- La advertencia de contraste aquí usa WCAG 1.4.11 (3:1 para componentes UI), no 4.5:1.
- `aria-label="Color de líneas divisoras del calendario"`.

**[44] — Primer día de la semana**
- Dos botones tipo tab/pill: [■ Domingo] y [Lunes]. El activo tiene fondo `bg-interactive-primary text-white`.
- `role="radiogroup"`. Cada opción: `role="radio"`, `aria-checked`.
- Cambio aplica inmediatamente en preview del calendario (si hay preview) — el store `theme-store.setFirstDayOfWeek` se llama al guardar, no en tiempo real.

**[45] — Tema de la app**
- Mismo patrón que [44]: dos botones pill — [■ Claro] y [Oscuro].
- Cambio aplica al guardar (no en tiempo real desde este formulario).
- Nota: el tema también tiene un toggle en el top bar del calendario (☾/☀). Ambos son equivalentes y sincronizados via `theme-store`.

---

## Estados cubiertos

| Estado | Pantalla | Wireframe |
|---|---|---|
| ✅ `default` (solo Mi turno, sin adicionales) | Lista `/config` | A.1 |
| ✅ `multiple-configs` | Lista `/config` | A.2 |
| ✅ `kebab-menu-open` | Lista `/config` | A.3 |
| ✅ `confirm-delete` | Lista `/config` | A.4 |
| ✅ `confirm-make-default` | Lista `/config` | A.5 |
| ✅ `limit-reached` (10/10) | Lista `/config` | A.6 |
| ✅ `nueva-adicional` (crear) | Formulario `/config/new` | B.1 |
| ✅ `esquema-personalizado` | Formulario | B.2 |
| ✅ `en-franco` | Formulario | B.3 |
| ✅ `error-validacion` | Formulario | B.4 |
| ✅ `contraste-insuficiente` | Formulario | B.5 |
| ✅ `color-picker-no-soportado` | Formulario | B.6 |
| ✅ `saving` (loading) | Formulario | B.7 |
| ✅ `editar-default` (Mi turno + prefs globales) | Formulario `/config/:id` | B.8 |
| — `editar-adicional-existente` | Formulario `/config/:id` | Igual a B.1 con campos pre-filled |

---

## Notas de Accesibilidad

```
A11Y:

TOP BAR (ambas pantallas):
- role="navigation" en el top bar o landmark header con aria-label="Configuración".
- El ⟨ back button: role="button", aria-label="Volver al calendario" (lista) o "Volver a Configuración" (formulario).

LISTA DE CONFIGS:
- La sección "MI TURNO" y "ADICIONALES" usan <section> con <h2> visibles o aria-label para definir regiones.
- Cada fila de config: role="listitem" dentro de <ul role="list">.
- Toggle ◉/○: <button role="switch" aria-checked="true|false" aria-label="{nombre} activa|inactiva">.
- Botón kebab ⋮: aria-label="Opciones de {nombre}", aria-haspopup="menu".

BOTTOM SHEET (kebab):
- role="dialog", aria-modal="true", aria-label="Opciones de {nombre}".
- Focus trap: Tab cicla entre opciones y Cancelar.
- Primer foco al abrir: primera opción ("Editar").
- Escape cierra el sheet.

MODALES (eliminar, hacer predeterminada):
- role="dialog", aria-modal="true".
- Focus trap activo. Primer foco: botón de acción destructiva o campo de texto.
- Escape cierra el modal.

FORMULARIO:
- Cada sección usa <fieldset> + <legend> para agrupar radios.
- Todos los inputs tienen <label> asociado via htmlFor/id.
- Los mensajes de error tienen role="alert" para anuncio inmediato por screen reader.
- RG-004: al submit con errores, `scrollToFirstError()` hace scroll al primer elemento con data-error="true".
- Tab order: Nombre → Esquema → (custom inputs si aplica) → Hora → Formato → Situación → (date picker si aplica) → Color → (prefs globales si default) → Guardar.

PRIMER FOCO:
- En `/config` lista: foco inicial en el ✎ de Mi turno (primer elemento interactivo).
- En `/config/new`: foco inicial en el campo "Nombre".
- En `/config/:id` (editar): foco inicial en el primer campo del formulario (campo Nombre si adicional, primer radio de esquema si default).
```

---

## Verificación PRD

| Criterio | US | Estado |
|---|---|---|
| Esquemas predeterminados: 24x48, 12x36, 48x48 | US-004 | ✅ Radios en B.1 |
| Opción Personalizado con restricciones 12-72h | US-004 | ✅ B.2, error [36] |
| Hora de entrada: solo horas completas y medias | US-004 | ✅ Select con opciones válidas [26] |
| Formatos: 12h, 24h, militar | US-004 | ✅ Radio group [27] |
| Estoy en turno / estoy en franco | US-004 | ✅ B.3, radio group [28] |
| Config default siempre existe, no se puede eliminar | US-005 | ✅ Sin toggle ni eliminar en fila default |
| Config default = "Mi turno", sin nombre editable | US-005 | ✅ Sin campo Nombre en B.8 |
| Prefs globales solo en config default | US-005 | ✅ Sección [42] solo en B.8 |
| Límite 10 adicionales | US-005 | ✅ A.6, mensaje [22] |
| Error nombre duplicado en tiempo real | US-005 | ✅ [35] con debounce 300ms |
| Activar / desactivar / editar / eliminar / hacer default adicional | US-005 | ✅ Toggle [7][8] + kebab A.3 |
| Confirmación explícita al eliminar | US-005 | ✅ Modal A.4 |
| Nombre necesario al hacer default (antigua default pasa a adicional) | US-005 | ✅ Modal A.5 |
| Paleta de colores predeterminados | US-007 | ✅ [29] con 10 colores |
| Color picker nativo + fallback si no soportado | US-007 | ✅ B.5 y B.6 |
| Cambio de tema claro/oscuro | US-007 | ✅ [45] en B.8 |
| Advertencia contraste no bloqueante (RG-007) | US-007 | ✅ [38] |
| Aviso de color duplicado entre configs | US-003 | ✅ [37] |
| Botones nunca disabled (RG-001) | Global | ✅ [6][31][17] todos activos siempre |
| Loading state con LoadingDots (RG-002) | Global | ✅ B.7 |
| Scroll al primer error en formulario (RG-004) | Global | ✅ Documentado en [31] y A11Y |
| Texto truncado con tooltip (RG-006) | Global | ✅ [7] con truncate + title |

---

## Design Review: Config

**Fecha de revisión:** Feb 2026
**Revisado por:** UX/UI Designer Agent
**Resultado:** ⚠️ Aprobado con observaciones

---

### Issues encontrados

#### 🔴 Bloqueantes
Sin issues bloqueantes.

#### 🟡 Importantes

- **[CF-001]** El formulario no especifica el comportamiento de navegación tras guardar con éxito.
  - **Qué viola:** UX — Feedback de acción completada. El usuario no sabe si la acción fue exitosa.
  - **Corrección sugerida:** Al guardar exitosamente: navigate("/config"). Agregar un toast temporal (2s, `role="status"`) con "Configuración guardada" que aparece en la lista. Developer debe implementar el toast como `<Toast />` en el shared/components.

- **[CF-002]** La opción "Tema de la app" está en el formulario de Mi turno, pero el toggle ☾/☀ del top bar del calendario también cambia el tema. Si el usuario cambia el tema desde el top bar, el radio en el formulario de config debe reflejar el valor actualizado.
  - **Qué viola:** Consistencia — dos fuentes de verdad para el tema.
  - **Corrección sugerida:** Ambos controles leen y escriben al mismo token en `theme-store`. El formulario de config NO hace cambio optimista — aplica al guardar. El toggle del top bar sí hace cambio inmediato. Esta asimetría es aceptable pero debe documentarse para el developer. Documentado en anotación [45].

#### 🟢 Sugerencias

- **[CF-003]** La selección del primer día de semana y del tema podrían ser controles de cambio inmediato (como el toggle del top bar) en lugar de requerir "Guardar".
  - **Beneficio:** Feedback inmediato. El usuario puede ver el efecto antes de confirmar.
  - **Decisión:** Descartado para MVP. El formulario tiene una sola acción de guardado para mantener el modelo mental simple. El toggle del top bar ya provee acceso inmediato al tema.

---

### Resumen

- Bloqueantes: 0
- Importantes: 2 (resueltos como anotaciones y documentación)
- Sugerencias: 1 (descartada)
- **Próximo paso:** Puede avanzar a desarrollo.

---

*Siguiente artefacto: Search — Búsqueda por fecha (`/search`).*
