# Componente: ErrorMessage
**Feature:** shared
**Archivo en arquitectura:** `src/shared/components/ErrorMessage.tsx`
**US de referencia:** RG-005 (error de conexión global), RG-004 (error de campo)
**Descripción:** Muestra mensajes de error de forma estandarizada. Dos variantes: error de campo (inline, bajo el input) y error global de conexión (banner full-width, no intrusivo). No es un modal — se integra en el flujo del formulario o de la página.
**Reutilización:** Sí — `src/shared/`. Usado en: `ShiftConfigForm`, `FeedbackPage`.

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `variant` | `"field"` \| `"global"` | Layout y posicionamiento del error |
| `message` | `string` | Texto del error (siempre via `t()`) |
| `id` | `string` | Para vincular con `aria-describedby` en el input asociado |

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por |
|---|---|---|
| `visible` | Mensaje visible con ícono | `message` prop tiene contenido |
| `hidden` | Componente no montado | `message` es `undefined` o vacío |

> No hay animación de entrada/salida — el error aparece y desaparece síncronamente con la validación. El scroll al primer error lo gestiona `scrollToFirstError()` externo.

---

## 4. Anatomía Visual (ASCII)

### variant=field (error de campo — inline bajo el input)
```
  ┌────────────────────────────────────┐
  │ Nombre del campo                   │
  │ ┌──────────────────────────────┐   │
  │ │ valor ingresado              │   │  ← input con borde rojo
  │ └──────────────────────────────┘   │
  │ ⓘ El mensaje de error aquí        │  ← ErrorMessage variant=field
  └────────────────────────────────────┘

  Estructura del componente:
  [AlertCircle 14px]  texto del error
  text-xs, color: feedback-error
  margin-top: 4px
  data-error="true"   ← para scrollToFirstError()
```

### variant=global (error de conexión — banner)
```
  ┌──────────────────────────────────────────────────┐
  │  ⚠  No se pudo conectar. Revisa tu conexión     │
  │     a internet e intenta de nuevo.               │
  └──────────────────────────────────────────────────┘
  background: feedback-error-surface
  border: 1px solid feedback-error (con opacity 30%)
  border-radius: radius-md
  padding: 12px 16px
  color texto: feedback-error
  margin: 16px 0 (dentro del formulario, sobre el botón de envío)
  AlertTriangle 16px al inicio
  role="alert", aria-live="assertive"
```

---

## 5. Diseño Responsive

> Responsive: el componente no cambia estructuralmente. `variant=field` es siempre inline. `variant=global` ocupa el ancho disponible de su contenedor.

---

## 6. Especificación de Tokens

### variant=field
| Propiedad CSS | Token |
|---|---|
| `color` (texto + ícono) | `--color-feedback-error` |
| `font-size` | `text-xs` |

### variant=global
| Propiedad CSS | Token |
|---|---|
| `background-color` | `--color-feedback-error-surface` |
| `border-color` | `--color-feedback-error` con `opacity: 0.30` |
| `color` (texto + ícono) | `--color-feedback-error` |
| `border-radius` | `--radius-md` |
| `font-size` | `text-sm` |

---

## 7. Accesibilidad

```
SEMÁNTICA variant=field:
- <p id={id} role="alert" aria-live="polite" data-error="true">
- El input asociado debe tener aria-describedby={id} + aria-invalid="true"
- role="alert" para anuncio en lectores de pantalla al aparecer

SEMÁNTICA variant=global:
- <div role="alert" aria-live="assertive"> (interrupción inmediata en lector)
- aria-live="assertive" porque es un error que bloquea el progreso del usuario

CONTRASTE:
- feedback-error (#DC2626) sobre surface-base → ~5.7:1 AA ✓
- feedback-error (#DC2626) sobre feedback-error-surface (#FEF2F2) → verificar en runtime
```

---

## 8. Animaciones del Componente

> Sin animaciones. Los errores aparecen y desaparecen instantáneamente. La claridad visual prima sobre la suavidad de la transición en contextos de error.

---

## 9. Notas para el Developer Agent

- **`data-error="true"`:** Siempre presente en `variant=field`. `scrollToFirstError()` en `ShiftConfigForm` y `FeedbackPage` usa este selector: `document.querySelector('[data-error="true"]')?.scrollIntoView(...)`.
- **`aria-describedby` en el input:** El consumer es responsable de vincular el input con el ErrorMessage via `id`. Ejemplo: `<input aria-describedby="name-error" aria-invalid={!!nameError}>` + `<ErrorMessage id="name-error" message={nameError}>`.
- **No renderizar cuando no hay error:** `if (!message) return null`. No renderizar un elemento vacío — afecta al layout y confunde a lectores de pantalla.
- **Un componente, dos variantes:** No crear dos componentes separados. La variante se pasa como prop. Si en el futuro aparece una tercera variante, se añade al mismo componente.
