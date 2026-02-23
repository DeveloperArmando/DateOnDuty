# Wireframe: Import URL Modal
**Rol:** UX/UI Designer Senior
**Fecha:** Feb 2026
**Skill invocado:** /skill-wireframe import-url-modal
**US de referencia:** US-008
**Artefacto:** docs/design/wireframes/import-url-modal.md

---

## Descripción

El Import URL Modal es un overlay que aparece automáticamente sobre el calendario (`/`) cuando la URL contiene el parámetro `?cfg=`. Es responsabilidad de la ruta `/` detectar el parámetro, decodificarlo, validarlo y mostrar este modal.

**Posición:** Modal centrado con overlay. No es un bottom sheet — aparece en el centro de la pantalla sobre el calendario. El calendario queda visible pero no interactivo detrás del overlay.

**Flujo de entrada:**
1. La app carga en `/` con `?cfg=[valor Base64]`.
2. Se intenta `atob()` + `JSON.parse()` + validación de campos (todo síncrono, sin loading state).
3. **Si el link es inválido:** se muestra el modal de error directamente.
4. **Si el link es válido:** se muestra el modal de elección (o el de límite alcanzado si corresponde).
5. Tras cualquier acción del usuario (guardar, reemplazar, cancelar, entendido): `navigate("/", { replace: true })` limpia la URL.

**Datos del payload decodificado:** `{ s: scheme, e: entryTime, d: cycleStartDate, c: color }`.
El nombre NO viene en el payload — el receptor debe asignarlo.

---

## Estado 1: link-valido-eleccion

*El link es válido. El receptor tiene < 10 configuraciones adicionales. Se presentan las dos opciones.*

```
/* mobile — 360px / overlay centrado max-w-sm */

            ░░░░░░░░░░░░░░░░░░░░░░░
            ░  [calendario de      ░
            ░   fondo, visible     ░
            ░   pero inactivo]     ░

        ┌───────────────────────────┐
        │  Configuración recibida ✕ │  [1]
        │───────────────────────────│
        │                           │
        │  Alguien compartió un     │  [2]
        │  horario de turno contigo.│
        │                           │
        │  Esquema:   24x48         │  [3]
        │  Entrada:   8:00 AM       │
        │  Color:     [●]           │
        │                           │
        │───────────────────────────│
        │  ¿Qué quieres hacer       │  [4]
        │  con este horario?        │
        │───────────────────────────│
        │                           │
        │ [  Reemplazar Mi turno  ] │  [5]
        │ [  Guardar como adicional]│  [6]
        │ [  Cancelar             ] │  [7]
        │                           │
        └───────────────────────────┘

            ░░░░░░░░░░░░░░░░░░░░░░░
```

---

## Estado 2: reemplazar-confirmacion

*El usuario eligió "Reemplazar Mi turno". Se pide confirmación antes de ejecutar.*

```
/* mobile — overlay centrado */

        ┌───────────────────────────┐
        │  Reemplazar Mi turno    ✕ │  [8]
        │───────────────────────────│
        │                           │
        │  ⚠  Tu configuración     │  [9]
        │     actual de "Mi turno"  │
        │     será reemplazada.     │
        │     Esta acción no se     │
        │     puede deshacer.       │
        │                           │
        │───────────────────────────│
        │ [  Confirmar reemplazo  ] │  [10]
        │ [  Volver               ] │  [11]
        │                           │
        └───────────────────────────┘
```

---

## Estado 3: guardar-adicional (nombre libre)

*El usuario eligió "Guardar como adicional". Debe ingresar un nombre.*

```
/* mobile — overlay centrado */

        ┌───────────────────────────┐
        │  Guardar configuración  ✕ │  [12]
        │───────────────────────────│
        │                           │
        │  Nombre de la             │
        │  configuración:           │
        │  [ Ej: Turno de Armando ] │  [13]
        │                           │
        │───────────────────────────│
        │ [  Guardar              ] │  [14]
        │ [  Volver               ] │  [15]
        │                           │
        └───────────────────────────┘
```

---

## Estado 4: guardar-adicional-colision (nombre duplicado)

*El usuario escribió un nombre que ya existe. Se muestra el error y la sugerencia automática.*

```
/* mobile — overlay centrado */

        ┌───────────────────────────┐
        │  Guardar configuración  ✕ │
        │───────────────────────────│
        │                           │
        │  Nombre de la             │
        │  configuración:           │
        │ ┌───────────────────────┐ │
        │ │ Turno de Armando      │ │  [16]
        │ └───────────────────────┘ │
        │  ⚠ Ya existe una config  │  [17]
        │    con ese nombre.        │
        │                           │
        │  Sugerencia:              │
        │  [ Turno de Armando (2) ] │  [18]
        │                           │
        │───────────────────────────│
        │ [  Guardar              ] │
        │ [  Volver               ] │
        │                           │
        └───────────────────────────┘
```

---

## Estado 5: link-invalido

*El link no se pudo decodificar o contiene valores inválidos.*

```
/* mobile — overlay centrado */

        ┌───────────────────────────┐
        │  Link no válido           │  [19]
        │───────────────────────────│
        │                           │
        │  Este link no es válido   │  [20]
        │  o está dañado.           │
        │                           │
        │  Solicítalo de nuevo      │
        │  al remitente.            │
        │                           │
        │───────────────────────────│
        │ [  Entendido            ] │  [21]
        │                           │
        └───────────────────────────┘
```

---

## Estado 6: limite-adicionales (10/10)

*El link es válido pero el receptor ya tiene 10 configuraciones adicionales.*

```
/* mobile — overlay centrado */

        ┌───────────────────────────┐
        │  Configuración recibida ✕ │  [22]
        │───────────────────────────│
        │                           │
        │  Has alcanzado el límite  │  [23]
        │  de 10 configuraciones    │
        │  adicionales.             │
        │                           │
        │  Elimina al menos una     │
        │  para poder guardar esta. │
        │                           │
        │───────────────────────────│
        │ [  Ir a Configuración   ] │  [24]
        │ [  Cancelar             ] │  [25]
        │                           │
        └───────────────────────────┘
```

---

## Desktop

> El modal es idéntico en desktop. Ancho máximo `max-w-sm` centrado con `mx-auto`. El overlay de fondo cubre toda la pantalla. No hay diferencias estructurales respecto al layout mobile — el modal es compacto por diseño.

---

## Anotaciones

**[1] — Cabecera del modal (estado: link-valido-eleccion)**
- Título: "Configuración recibida" en `text-lg font-semibold text-text-primary`.
- `✕` = `<button>` con icono `X` de lucide-react, 16px, `aria-label="Cerrar sin guardar"`.
- Al tocar ✕: `navigate("/", { replace: true })` — cierra el modal, limpia la URL, no guarda nada.
- El modal: `bg-surface-elevated rounded-lg shadow-lg`. Overlay de fondo: `bg-surface-overlay`.
- `role="dialog"`, `aria-modal="true"`, `aria-label="Configuración de turno recibida"`.
- Focus trap activo. Primer foco al abrir: primer botón de acción ("Reemplazar Mi turno").
- Escape = equivalente a ✕ (cierra sin guardar).

**[2] — Texto introductorio**
- Texto conciso en `text-sm text-text-secondary`.
- No describe el origen del link (no sabemos quién lo envió — el payload no incluye nombre del emisor).
- El mensaje es neutro: "Alguien compartió un horario de turno contigo."

**[3] — Preview del payload decodificado**
- Muestra los datos legibles del payload: Esquema, Entrada, Color.
- `cycleStartDate` NO se muestra — es un dato técnico sin valor para el usuario final.
- **Esquema:** si es preset (24x48, 12x36, 48x48) → mostrar la etiqueta. Si es personalizado (e.g. "C16:32") → mostrar "Personalizado: 16h trabajo / 32h descanso".
- **Entrada:** formateada según el `timeFormat` del usuario (no el del emisor, ya que el formato es una preferencia de display). Default si no hay config: 12h.
- **Color `[●]`:** círculo sólido `style={{ backgroundColor: payload.c }}`, 20px. `aria-label="Color del turno: {payload.c}"`.
- Texto: `text-sm`. Labels en `font-medium text-text-primary`, valores en `text-text-secondary`.

**[4] — Pregunta de decisión**
- Texto claro y orientado a la acción. `text-sm font-medium text-text-primary`.
- Separador visual arriba para marcar la sección de acción.

**[5] — Botón "Reemplazar Mi turno"**
- Tipo: secundario/ghost. `border border-interactive-primary text-interactive-primary`.
- Al tocar: no ejecuta la acción directamente — va al estado de confirmación [Estado 2].
- `aria-label="Reemplazar mi configuración actual de Mi turno con esta"`.
- RG-001: nunca `disabled`.

**[6] — Botón "Guardar como adicional"**
- Tipo: primario. `bg-interactive-primary text-white`.
- Al tocar: va al estado de ingreso de nombre [Estado 3].
- `aria-label="Guardar esta configuración como configuración adicional"`.
- RG-001: nunca `disabled`.

**[7] — Botón "Cancelar"**
- Tipo: ghost sin borde. `text-text-secondary`.
- Al tocar: `navigate("/", { replace: true })`. No guarda nada.
- Equivalente funcional a ✕.

**[8] — Cabecera confirmación de reemplazo**
- Título: "Reemplazar Mi turno".
- ✕ en esta pantalla = volver al estado de elección [Estado 1], NO cancelar del todo.
- `aria-label="Volver a las opciones anteriores"`.

**[9] — Advertencia de reemplazo (destructiva)**
- Icono `AlertTriangle` de lucide-react, 16px, `text-feedback-warning`.
- El texto explica claramente que la acción es irreversible.
- `bg-feedback-warning-surface rounded-md p-3` para el bloque de advertencia.
- **Qué NO se reemplaza:** las preferencias globales (gridLineColor, tema, firstDayOfWeek) y el nombre "Mi turno" se mantienen. Solo se reemplazan scheme, entryTime, cycleStartDate y color.
- Esta distinción NO se muestra en el modal (demasiado técnico). El Developer debe implementarlo correctamente en el store.

**[10] — Botón "Confirmar reemplazo"**
- Tipo: destructivo. `bg-feedback-error text-white rounded-lg`.
- Al tocar: `config-store.replaceDefaultConfig(payload)` → `navigate("/", { replace: true })`.
- RG-001: nunca `disabled`. RG-002: si hay latencia (improbable — es localStorage), mostrar `<LoadingDots />` en el botón.
- Tras guardar: el modal se cierra, el calendario refleja la nueva configuración inmediatamente.

**[11] — Botón "Volver" (en confirmación)**
- Regresa al estado de elección [Estado 1] sin ejecutar ninguna acción.
- No limpia la URL — el modal sigue abierto en Estado 1.
- `text-text-secondary`.

**[12] — Cabecera "Guardar configuración"**
- ✕ aquí = volver al estado de elección [Estado 1]. Mismo comportamiento que [11].

**[13] — Input de nombre**
- `<input type="text">`, `maxLength={50}`.
- Placeholder: "Ej: Turno de Armando" (i18n, sugestivo pero no pre-llenado).
- `autoFocus` al montar este estado — el foco va directamente al input.
- Validación en tiempo real (debounce 300ms):
  - Si el nombre coincide con una config existente → mostrar error [17] + sugerencia [18].
  - Si el nombre está vacío → no mostrar error hasta el submit.
- `aria-label="Nombre de la nueva configuración adicional"`.

**[14] — Botón "Guardar" (adicional)**
- Tipo: primario. `bg-interactive-primary text-white`.
- Al tocar con nombre válido: `config-store.addConfig({ ...payload, name })` → `navigate("/", { replace: true })`.
- Al tocar con nombre vacío: mostrar error "El nombre es obligatorio." debajo del input.
- Al tocar con nombre duplicado sin corregir: el error [17] ya estaba visible; no permite guardar hasta que el nombre sea único.
- RG-001: nunca `disabled`.

**[15] — Botón "Volver" (guardar adicional)**
- Mismo comportamiento que [11]. Regresa al Estado 1.

**[16] — Input con nombre duplicado**
- El input tiene `border-feedback-error` cuando hay colisión de nombre.
- El valor en el input es lo que el usuario escribió (no se sobreescribe automáticamente).

**[17] — Error de nombre duplicado**
- Icono `AlertCircle` de lucide-react, 14px, `text-feedback-error`.
- Texto: "Ya existe una configuración con ese nombre."
- `role="alert"` para anuncio inmediato por screen reader.

**[18] — Sugerencia automática de nombre**
- Aparece debajo del error [17] cuando hay colisión.
- Formato: "[nombre ingresado] (2)" — o "(3)", "(4)" si "(2)" también existe (el sistema verifica recursivamente).
- La sugerencia es un botón/chip tappable: `role="button"`, `text-sm text-interactive-primary underline`.
- Al tocar la sugerencia: llena el input con el nombre sugerido + limpia el error.
- `aria-label="Usar como nombre: [nombre sugerido]"`.

**[19] — Modal de link inválido**
- Sin botón ✕ — solo "Entendido". El modal es informativo y no tiene estado alternativo.
- Título: "Link no válido".
- Sin icono en el header — el contexto de error es evidente.

**[20] — Texto de error**
- Texto exacto del PRD: "Este link no es válido o está dañado. Solicítalo de nuevo al remitente."
- `text-sm text-text-secondary`.

**[21] — Botón "Entendido"**
- Primario. `bg-interactive-primary text-white`.
- Al tocar: `navigate("/", { replace: true })`. El modal se cierra, la URL se limpia.
- Este botón recibe el foco automáticamente al abrir el modal (único botón de acción).

**[22] — Modal de límite alcanzado**
- Mismo header que el Estado 1 pero sin ✕ explícito — el botón "Cancelar" [25] cumple esa función.
- `role="dialog"`, `aria-modal="true"`.

**[23] — Mensaje de límite**
- Texto exacto del PRD: "Has alcanzado el límite de 10 configuraciones adicionales. Elimina al menos una para poder guardar esta."
- `text-sm text-text-secondary`.
- No muestra el preview del payload importado (la acción inmediata es gestionar configs, no ver el preview).

**[24] — Botón "Ir a Configuración"**
- Primario. `bg-interactive-primary text-white`.
- Al tocar: `navigate("/config")`.
- **Limitación conocida (PRD):** si el usuario recarga la página durante este proceso, el link `?cfg=` se pierde y el usuario debe abrir el link nuevamente. El modal NO puede persistir el estado pendiente de importación.
- No se muestra ningún aviso sobre esta limitación en el modal (es un caso edge aceptado).

**[25] — Botón "Cancelar" (límite alcanzado)**
- Ghost. `text-text-secondary`.
- Al tocar: `navigate("/", { replace: true })`. Descarta el link importado y limpia la URL.

---

## Flujo completo de estados

```
URL cargada con ?cfg=
         │
         ▼
   Decode + Validate
   (síncrono, atob + JSON.parse + field check)
         │
         ├─── INVÁLIDO ──────────────────────────► Estado 5: link-invalido
         │                                              │
         │                                         [Entendido]
         │                                              │
         └─── VÁLIDO                            navigate("/", replace)
                  │
                  ├─── additionals.length === 10 ► Estado 6: limite-adicionales
                  │                                     │
                  │                           [Ir a Config] → navigate("/config")
                  │                           [Cancelar]   → navigate("/", replace)
                  │
                  └─── additionals.length < 10  ► Estado 1: link-valido-eleccion
                               │
                               ├─── [Cancelar / ✕]  ─────────► navigate("/", replace)
                               │
                               ├─── [Reemplazar Mi turno]
                               │         │
                               │         ▼
                               │    Estado 2: reemplazar-confirmacion
                               │         │
                               │    [Confirmar] → replaceDefaultConfig()
                               │         │           → navigate("/", replace)
                               │    [Volver]   → Estado 1
                               │
                               └─── [Guardar como adicional]
                                         │
                                         ▼
                                    Estado 3: guardar-adicional
                                         │
                                    [input nombre]
                                         │
                                    [nombre duplicado] → Estado 4 (mismo modal + error)
                                         │
                                    [Guardar] (nombre válido) → addConfig()
                                         │                     → navigate("/", replace)
                                    [Volver] → Estado 1
```

---

## Estados cubiertos

| Estado | Wireframe |
|---|---|
| ✅ `link-valido-eleccion` (< 10 adicionales, ambas opciones) | Estado 1 |
| ✅ `reemplazar-confirmacion` (advertencia antes de sobrescribir) | Estado 2 |
| ✅ `guardar-adicional` (nombre vacío, input limpio) | Estado 3 |
| ✅ `guardar-adicional-colision` (nombre duplicado + sugerencia) | Estado 4 |
| ✅ `link-invalido` (malformado o datos inválidos) | Estado 5 |
| ✅ `limite-adicionales` (10/10, solo ir a config) | Estado 6 |
| — `loading` | No aplica — decode/validate es síncrono, sin latencia observable |
| — `link-abierto-en-nuevo-navegador` | No aplica — comportamiento idéntico al Estado 1 (localStorage vacío, 0 adicionales) |

---

## Notas de Accesibilidad

```
A11Y:

MODAL (todos los estados):
- role="dialog", aria-modal="true".
- aria-label cambia por estado:
  - Estado 1: "Configuración de turno recibida"
  - Estado 2: "Confirmar reemplazo de Mi turno"
  - Estado 3/4: "Nombrar nueva configuración adicional"
  - Estado 5: "Link no válido"
  - Estado 6: "Límite de configuraciones alcanzado"
- Focus trap: Tab cicla solo entre los elementos interactivos del modal.
- Escape: equivalente a ✕ o "Volver" según el estado (nunca ejecuta acciones destructivas).

FOCUS AL ABRIR:
- Estado 1: foco en "Guardar como adicional" (acción no destructiva preferida).
- Estado 2: foco en "Volver" (seguro por defecto — evitar foco en botón destructivo).
- Estado 3: foco en el input de nombre (campo a completar).
- Estado 4: foco en el input de nombre (para corregir).
- Estado 5: foco en "Entendido".
- Estado 6: foco en "Cancelar" (acción segura por defecto).

COLOR SWATCH EN PREVIEW:
- aria-label="Color del turno: {hex code}".
- No es el único indicador del color — el hex también podría mostrarse como texto accesorio
  si se considera necesario para a11y, pero para MVP el aria-label es suficiente.

SUGERENCIA DE NOMBRE [18]:
- role="button" con aria-label="Usar como nombre: Turno de Armando (2)".
- También puede marcarse con role="option" dentro de un listbox si hay múltiples sugerencias
  (para MVP solo hay una sugerencia — role="button" es suficiente).

ANUNCIO DE ERRORES:
- El error de nombre duplicado [17]: role="alert".
- El bloque de advertencia de reemplazo [9]: role="note" (no urgente — el usuario debe leerlo
  pero no interrumpe la navegación).
```

---

## Verificación PRD

| Criterio | US | Estado |
|---|---|---|
| Modal aparece al detectar `?cfg=` en la URL | US-008 | ✅ Flujo documentado |
| Decode + validación: link inválido → mensaje de error | US-008 | ✅ Estado 5 |
| Link válido + < 10 adicionales → dos opciones | US-008 | ✅ Estado 1 |
| Opción: Reemplazar default | US-008 | ✅ Estado 2 con confirmación |
| Opción: Guardar como adicional con nombre | US-008 | ✅ Estado 3 |
| Nombre duplicado → sugerencia automática "Nombre (2)" | US-008 | ✅ Estado 4 |
| Receptor con 10 adicionales → mensaje + ir a configuración | US-008 | ✅ Estado 6 |
| URL limpiada con navigate("/", replace) tras cualquier acción | US-008 | ✅ Todas las salidas |
| Limitación conocida: si recarga durante proceso, link se pierde | US-008 | ✅ Anotación [24] |
| Datos del payload: s, e, d, c (sin nombre) | US-008 | ✅ Preview en Estado 1 sin nombre |

---

## Design Review: Import URL Modal

**Fecha de revisión:** Feb 2026
**Revisado por:** UX/UI Designer Agent
**Resultado:** ⚠️ Aprobado con observaciones

---

### Issues encontrados

#### 🔴 Bloqueantes
Sin issues bloqueantes.

#### 🟡 Importantes

- **[IU-001]** El PRD no contempla la opción "Reemplazar Mi turno" cuando el receptor tiene 10 adicionales (Estado 6 solo muestra "Ir a Configuración" o "Cancelar"). Sin embargo, reemplazar el default NO requiere espacio adicional — el usuario podría importar sin tener que eliminar nada. La ausencia de esta opción en el Estado 6 es una posible limitación del PRD.
  - **Qué viola:** Principio UX — accesibilidad a funcionalidades útiles. El usuario puede quedarse bloqueado sin necesidad.
  - **Corrección sugerida:** Seguir el PRD literalmente para MVP. Documentar para PO como mejora en v1.1: añadir "Reemplazar Mi turno" como tercera opción en el Estado 6.
  - **Estado actual:** Seguido el PRD. Documentado para PO.

#### 🟢 Sugerencias

- **[IU-002]** Mostrar el hex del color además del swatch en el preview [3] para usuarios con daltonismo u otras condiciones visuales.
  - **Beneficio:** El hex `#2563EB` no es usable directamente por el usuario, pero comunicar "azul" como texto sería más accesible.
  - **Decisión:** Descartado para MVP. El `aria-label` del swatch ya incluye el hex. El color en el preview es informativo, no decisivo. El usuario puede editar el color después de importar.

- **[IU-003]** Añadir un botón "Vista previa en calendario" que muestre cómo quedaría el calendario con la config importada antes de confirmar.
  - **Beneficio:** El usuario toma una decisión más informada.
  - **Decisión:** Descartado para MVP. Requiere state management complejo (estado temporal de preview que no se persiste). Candidato para v2.0.

---

### Resumen
- Bloqueantes: 0
- Importantes: 1 (seguido PRD, documentado para PO)
- Sugerencias: 2 (ambas descartadas)
- **Próximo paso:** Puede avanzar a desarrollo.

---

*Siguiente artefacto: Feedback — Formulario de contacto (`/feedback`).*
