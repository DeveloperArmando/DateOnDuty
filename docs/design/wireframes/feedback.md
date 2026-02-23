# Wireframe: Feedback
**Rol:** UX/UI Designer Senior
**Fecha:** Feb 2026
**Skill invocado:** /skill-wireframe feedback
**US de referencia:** US-012
**Artefacto:** docs/design/wireframes/feedback.md

---

## Descripción

Formulario de contacto accesible desde el footer de cualquier pantalla. Envía el mensaje vía Formspree usando `fetch` nativo. Solo dos campos: correo electrónico y mensaje.

**Reglas de negocio clave:**
- Cooldown de 60 segundos entre envíos. Almacenado en `dod-feedback-cooldown = { lastSentAt: number | null }`.
- Si hay cooldown activo al cargar la página: mostrar el countdown inmediatamente (no esperar a que el usuario toque el botón).
- Si el servicio falla: mensaje global de error (RG-005).
- RG-003: advertencia a los 10s, timeout y error a los 30s (`AbortController`).

---

## Estado 1: default (formulario limpio)

*Primera visita o después de que el cooldown expiró.*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Feedback                          │  [1]
│──────────────────────────────────────│
│                                      │
│  ¿Tienes algún comentario o          │  [2]
│  encontraste un problema?            │
│  Nos ayuda a mejorar la app.         │
│                                      │
│  Correo electrónico *                │  [3]
│  [ tu@correo.com               ]     │
│                                      │
│  Mensaje *                           │  [4]
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  │                              │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│──────────────────────────────────────│
│  [  Enviar mensaje             ]     │  [5]
│──────────────────────────────────────│
│   Términos  ·  Privacidad  ·  Feedback│
└──────────────────────────────────────┘
```

---

## Estado 2: cooldown-activo

*El usuario ya envió feedback hace menos de 60 segundos. El countdown se muestra al cargar.*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Feedback                          │
│──────────────────────────────────────│
│                                      │
│  ¿Tienes algún comentario o          │
│  encontraste un problema?            │
│  Nos ayuda a mejorar la app.         │
│                                      │
│  Correo electrónico *                │
│  [ tu@correo.com               ]     │
│                                      │
│  Mensaje *                           │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│──────────────────────────────────────│
│  [  Enviar mensaje             ]     │  [6]
│  ⏱ Espera {X} segundos antes de     │  [7]
│    enviar otro mensaje.              │
│──────────────────────────────────────│
│   Términos  ·  Privacidad  ·  Feedback│
└──────────────────────────────────────┘
```

---

## Estado 3: error-validacion

*El usuario tocó "Enviar" con campos inválidos. Scroll automático al primer error (RG-004).*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Feedback                          │
│──────────────────────────────────────│
│                                      │
│  Correo electrónico *                │
│ ┌──────────────────────────────┐     │
│ │ esto-no-es-un-correo         │     │  [8]
│ └──────────────────────────────┘     │
│  ⚠ Introduce un correo válido.      │  [9]
│                                      │
│  Mensaje *                           │
│ ┌──────────────────────────────┐     │
│ │ (campo vacío)                │     │
│ └──────────────────────────────┘     │
│  ⚠ El mensaje es obligatorio.       │  [10]
│                                      │
│──────────────────────────────────────│
│  [  Enviar mensaje             ]     │  [5]
│──────────────────────────────────────│
└──────────────────────────────────────┘
```

---

## Estado 4: sending (enviando)

*El usuario tocó "Enviar" con campos válidos. Fetch en progreso.*

```
/* mobile — 360px (zona del botón) */

│──────────────────────────────────────│
│  [  Enviando  · · ·            ]     │  [11]
│──────────────────────────────────────│
```

---

## Estado 5: warning-10s (RG-003)

*Han pasado 10 segundos desde el envío sin respuesta del servidor. Fetch sigue activo.*

```
/* mobile — 360px (zona del botón) */

│──────────────────────────────────────│
│  [  Enviando  · · ·            ]     │  [11]
│  ℹ La solicitud está tardando más   │  [12]
│    de lo esperado. Por favor espera. │
│──────────────────────────────────────│
```

---

## Estado 6: error-conexion (RG-005)

*Formspree no respondió en 30s o devolvió un error. AbortController canceló la solicitud.*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Feedback                          │
│──────────────────────────────────────│
│                                      │
│  ┌──────────────────────────────┐    │
│  │ ⚠ No se pudo enviar tu      │    │  [13]
│  │   mensaje. Verifica tu       │    │
│  │   conexión e inténtalo       │    │
│  │   de nuevo.                  │    │
│  └──────────────────────────────┘    │
│                                      │
│  Correo electrónico *                │
│  [ usuario@correo.com          ]     │  ← valores previos conservados
│                                      │
│  Mensaje *                           │
│  ┌──────────────────────────────┐    │
│  │ Mi mensaje previo...         │    │  ← valor previo conservado
│  └──────────────────────────────┘    │
│                                      │
│──────────────────────────────────────│
│  [  Enviar mensaje             ]     │
│──────────────────────────────────────│
└──────────────────────────────────────┘
```

---

## Estado 7: success (enviado con éxito)

*Formspree respondió con 200. El formulario es reemplazado por la confirmación.*

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  Feedback                          │
│──────────────────────────────────────│
│                                      │
│                                      │
│                                      │
│           ✓                          │  [14]
│                                      │
│     Mensaje enviado                  │  [15]
│                                      │
│     Gracias por tu comentario.       │  [16]
│     Lo leeremos con atención.        │
│                                      │
│                                      │
│──────────────────────────────────────│
│  [ ←  Volver al calendario     ]     │  [17]
│──────────────────────────────────────│
│   Términos  ·  Privacidad  ·  Feedback│
└──────────────────────────────────────┘
```

---

## Variante Desktop (1280px)

> El formulario se centra en un contenedor `max-w-md mx-auto`. La estructura de campos es idéntica a mobile — sin columnas paralelas (el formulario es corto y secuencial). El textarea tiene `rows="6"` en lugar de `rows="4"`. El botón sticky del mobile pasa a ser un botón estándar en el flujo del formulario (no fixed).

---

## Anotaciones

**[1] — Top bar**
- `⟨` retorna a la pantalla anterior (`useNavigate(-1)`). El feedback se accede desde el footer de cualquier pantalla, así que el "volver" lleva a donde se estaba.
- Título: "Feedback" en `text-lg font-semibold`.
- `aria-label="Volver"` en el botón de retroceso.

**[2] — Texto introductorio**
- Breve y orientado a la acción. `text-sm text-text-secondary`.
- No hay introducción larga — el formulario es mínimo por diseño (PRD: solo email + mensaje).

**[3] — Campo Correo electrónico**
- `<input type="email">` — activa teclado con @ en móvil.
- `autocomplete="email"` para sugerencias del navegador.
- Label: `<label>` asociado via `htmlFor`. El asterisco `*` indica campo obligatorio.
- Placeholder: `tu@correo.com` (i18n).
- Validación solo en submit (no en tiempo real — el email incompleto durante la escritura no debe marcarse como error).
- Regex de validación: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- `data-error="true"` al fallar — para scroll automático (RG-004).
- `aria-invalid="true"` cuando hay error. `aria-describedby="email-error"` enlaza con el mensaje [9].

**[4] — Campo Mensaje**
- `<textarea>` nativo. `rows="4"` mobile, `rows="6"` desktop.
- `resize="vertical"` en desktop (o `resize="none"` para mantener el layout controlado).
- Placeholder: "Describe tu sugerencia o problema..." (i18n).
- Sin límite de caracteres especificado en PRD. Si se desea añadir un contador visible, es una sugerencia opcional (ver [FB-002] en Design Review).
- `data-error="true"` al fallar — para scroll automático.
- `aria-invalid="true"` cuando vacío en submit. `aria-describedby="message-error"`.

**[5] — Botón Enviar mensaje (estado normal)**
- Primario. `bg-interactive-primary text-white rounded-lg`.
- Sticky en mobile: `position: sticky; bottom: 0; bg-surface-base`.
- RG-001: **nunca `disabled`**. Si hay cooldown activo, el botón sigue siendo tappable. El mensaje de cooldown [7] está visible antes de que el usuario toque.
- Si el usuario toca el botón durante cooldown: no hace nada nuevo (el mensaje ya está visible). Opcional: pequeña animación de "shake" en el mensaje de cooldown para feedback visual.
- Si el usuario toca el botón con campos vacíos/inválidos: ejecuta la validación y muestra errores [Estado 3].
- Si el formulario es válido y no hay cooldown: inicia el fetch y va al Estado 4 (sending).

**[6] — Botón durante cooldown**
- Visualmente idéntico al botón normal. El cambio visual está en el mensaje [7], no en el botón.
- RG-001: nunca `disabled`.

**[7] — Mensaje de cooldown**
- Aparece **al cargar la página** si hay cooldown activo (`Date.now() - lastSentAt < 60000`).
- Texto dinámico: "Espera {X} segundos antes de enviar otro mensaje."
- `{X}` se actualiza cada segundo via `setInterval` en un `useEffect`.
- `useEffect` cleanup cancela el `setInterval`.
- Cuando `{X}` llega a 0: el mensaje desaparece con `opacity: 0` (fade-out 300ms) y la interacción del botón se habilita normalmente.
- `role="status"` — el contador que baja informa al usuario sin ser urgente.
- Icono `Clock` de lucide-react, 14px, `text-feedback-warning`.

**[8] — Input con error**
- El campo tiene `border-feedback-error` y `ring-1 ring-feedback-error`.
- El valor que introdujo el usuario se conserva (no se borra al validar).

**[9] — Error correo inválido**
- `id="email-error"` — referenciado por `aria-describedby` del input.
- Icono `AlertCircle` de lucide-react, 14px, `text-feedback-error`.
- `role="alert"` — anunciado inmediatamente por screen reader.
- Texto: "Introduce un correo electrónico válido."
- `data-error="true"` en el contenedor del campo para `scrollToFirstError()` (RG-004).

**[10] — Error mensaje vacío**
- `id="message-error"`. Mismo estilo que [9].
- Texto: "El mensaje es obligatorio."

**[11] — Botón en estado loading (RG-002)**
- El texto "Enviar mensaje" es reemplazado por `<LoadingDots />`.
- `isSubmitting = true` (estado interno del componente). El botón no está `disabled` pero `onClick` no re-dispara el fetch si `isSubmitting === true`.
- El tamaño del botón no cambia — el `<LoadingDots />` ocupa el mismo espacio que el texto.
- `aria-label="Enviando mensaje..."` durante el loading.

**[12] — Advertencia de timeout a 10s (RG-003)**
- Aparece si el fetch no resuelve en 10 segundos.
- No cancela el fetch — el `AbortController` sigue activo hasta los 30s.
- Icono `Info` de lucide-react, 14px, `text-feedback-info`.
- Texto: "La solicitud está tardando más de lo esperado. Por favor espera."
- `role="status"` — informativo, no urgente.
- A los 30s: el `AbortController` hace `abort()`. El fetch falla → Estado 6 (error-conexion).

**[13] — Error de conexión global (RG-005)**
- Bloque de error encima del formulario (no en el footer).
- `bg-feedback-error-surface border border-feedback-error rounded-md p-3`.
- Icono `AlertTriangle` de lucide-react, 16px, `text-feedback-error`.
- Texto: "No se pudo enviar tu mensaje. Verifica tu conexión e inténtalo de nuevo."
- `role="alert"` — anunciado inmediatamente.
- Los valores de los campos se **conservan** — el usuario no debe volver a escribir todo.
- El `lastSentAt` NO se actualiza cuando hay error — el cooldown no se activa si el envío falló.

**[14] — Ícono de éxito**
- Icono `CheckCircle` de lucide-react, 48px, `text-feedback-success`.
- Centrado verticalmente en el área de contenido.
- `aria-hidden="true"` (decorativo — el texto [15] es el contenido real).

**[15] — Título de éxito**
- "Mensaje enviado" en `text-xl font-semibold text-text-primary`. Centrado.
- Es el primer elemento que lee el screen reader tras la transición (via `aria-live` o foco).

**[16] — Subtexto de éxito**
- "Gracias por tu comentario. Lo leeremos con atención."
- `text-sm text-text-secondary`. Centrado.

**[17] — Botón "Volver al calendario"**
- Primario. `bg-interactive-primary text-white`.
- `navigate("/")` o `useNavigate(-1)`.
- Al llegar aquí, `lastSentAt = Date.now()`. Si el usuario navega a `/feedback` de nuevo dentro de 60s → verá el Estado 2 (cooldown).

---

## Lógica del componente FeedbackPage

```
Estados posibles del componente:
─────────────────────────────────
IDLE         → formulario limpio o con cooldown visible
SUBMITTING   → fetch en curso, botón con LoadingDots
WARNING_10S  → fetch > 10s, advertencia visible
SUCCESS      → fetch respondió 200, formulario reemplazado
ERROR        → fetch falló o abortado, mensaje global visible
```

```
Al montar (useEffect):
  1. Leer dod-feedback-cooldown.lastSentAt de localStorage.
  2. Calcular remaining = 60000 - (Date.now() - lastSentAt).
  3. Si remaining > 0: mostrar countdown (setInterval cada 1s).
  4. Cleanup: clearInterval.

Al submit:
  1. Validar campos. Si error → scrollToFirstError(), no continuar.
  2. Si cooldown activo → no continuar (mensaje ya visible).
  3. setIsSubmitting(true).
  4. Crear AbortController con timeout de 30s.
  5. setTimeout de 10s → setShowWarning10s(true).
  6. fetch(FORMSPREE_ENDPOINT, { signal: controller.signal, method: 'POST', ... }).
  7. Si respuesta ok:
     - setStatus('SUCCESS').
     - localStorage.setItem('dod-feedback-cooldown', JSON.stringify({ lastSentAt: Date.now() })).
     - clearTimeout(warning10sTimer).
  8. Si error (fetch rechazado o abort):
     - setStatus('ERROR').
     - setIsSubmitting(false).
     - clearTimeout(warning10sTimer).
     - setShowWarning10s(false).
```

---

## Estados cubiertos

| Estado | Wireframe |
|---|---|
| ✅ `default` (sin cooldown, formulario limpio) | Estado 1 |
| ✅ `cooldown-activo` (countdown visible al cargar) | Estado 2 |
| ✅ `error-validacion` (campos vacíos o inválidos) | Estado 3 |
| ✅ `sending` (fetch en progreso, LoadingDots) | Estado 4 |
| ✅ `warning-10s` (10s sin respuesta, RG-003) | Estado 5 |
| ✅ `error-conexion` (Formspree fallo, RG-005) | Estado 6 |
| ✅ `success` (enviado, formulario reemplazado) | Estado 7 |
| — `campo-correo-con-autocompletado` | No dibujado — comportamiento nativo del browser |

---

## Notas de Accesibilidad

```
A11Y:

FORMULARIO:
- <form> con aria-label="Formulario de feedback".
- Cada campo tiene <label> con htmlFor asociado al id del input/textarea.
- Campos obligatorios: aria-required="true" + asterisco visual (*) + descripción en el label.
- Errores de validación: aria-invalid="true" en el input + aria-describedby apuntando al ID del mensaje de error.
- role="alert" en cada mensaje de error para anuncio inmediato por screen reader.

COUNTDOWN DE COOLDOWN:
- role="status" — actualiza en vivo sin interrumpir. El screen reader puede anunciar los cambios del contador sin ser invasivo.
- El countdown NO usa aria-live="assertive" (demasiado agresivo para un número que cambia cada segundo).

ESTADO DE CARGA (SUBMITTING):
- El botón durante loading tiene aria-label="Enviando mensaje...".
- El spinner/dots son aria-hidden="true".

ÉXITO:
- Al transicionar a SUCCESS: mover el foco al título "Mensaje enviado" [15].
  Implementación: ref + focus() en el useEffect cuando status cambia a 'SUCCESS'.
- El mensaje de éxito tiene role="main" o es el contenido principal del landmark.

ERROR DE CONEXIÓN:
- role="alert" en el bloque de error [13] — anunciado inmediatamente.
- El foco NO se mueve al error (el usuario estaba en el botón; el error aparece arriba).
  El screen reader lo anuncia via role="alert" sin mover el foco.

TAB ORDER:
  Top bar (⟨) → Input correo → Textarea mensaje → Botón enviar.
```

---

## Verificación PRD

| Criterio | US | Estado |
|---|---|---|
| Solo dos campos: correo y mensaje | US-012 | ✅ Sin nombre ni campos extra |
| Correo obligatorio + validación de formato | US-012 | ✅ Estado 3, anotación [9] |
| Mensaje obligatorio | US-012 | ✅ Estado 3, anotación [10] |
| Envío vía Formspree (fetch nativo) | US-012 | ✅ Lógica del componente |
| Cooldown 60s en localStorage | US-012 | ✅ Estado 2, anotación [7] |
| Countdown visible antes de que el usuario intente enviar | US-012 | ✅ Aparece al cargar si cooldown activo |
| Texto de cooldown con segundos restantes dinámicos | US-012 | ✅ "Espera {X} segundos" |
| Error si Formspree falla (RG-005) | US-012 | ✅ Estado 6 |
| Advertencia a 10s (RG-003) | Global | ✅ Estado 5 |
| Timeout a 30s con AbortController (RG-003) | Global | ✅ Lógica del componente |
| LoadingDots en botón durante envío (RG-002) | Global | ✅ Estado 4 |
| Botón Enviar nunca disabled (RG-001) | Global | ✅ Anotación [5][6] |
| Scroll al primer error en submit (RG-004) | Global | ✅ Anotación [9] |
| Valores de campos conservados tras error de conexión | UX | ✅ Anotación [13] |

---

## Design Review: Feedback

**Fecha de revisión:** Feb 2026
**Revisado por:** UX/UI Designer Agent
**Resultado:** ✅ Aprobado

---

### Issues encontrados

#### 🔴 Bloqueantes
Sin issues bloqueantes.

#### 🟡 Importantes
Sin issues importantes.

#### 🟢 Sugerencias

- **[FB-001]** Añadir un contador de caracteres visible bajo el textarea (ej: "0 / 1000").
  - **Beneficio:** El usuario sabe cuánto puede escribir sin verse sorprendido por un límite.
  - **Decisión:** El PRD no especifica un límite de caracteres. Formspree acepta mensajes largos. Descartado para MVP — se puede añadir con un `maxLength` en v1.1 si hay casos de mensajes extremadamente largos.

- **[FB-002]** Confirmar si el cooldown debe persistir entre recargas de página. El PRD dice "Si el usuario recarga la página o cierra el navegador antes de que pase el minuto, el timer se reinicia." — Esto podría interpretarse como: el cooldown se borra al recargar.
  - **Decisión:** Se diseña con el cooldown persistente (se calcula desde `lastSentAt` en localStorage al cargar la página). Si el PO confirma que debe borrarse al recargar, el cambio es trivial: borrar `dod-feedback-cooldown` en el `useEffect` de montaje del componente. Documentado para PO.

---

### Resumen
- Bloqueantes: 0
- Importantes: 0
- Sugerencias: 2 (ambas documentadas, descartadas para MVP)
- **Próximo paso:** Puede avanzar a desarrollo.

---

*Siguiente artefacto: Legal — Páginas Términos y Política de Privacidad (`/terms`, `/privacy`).*
