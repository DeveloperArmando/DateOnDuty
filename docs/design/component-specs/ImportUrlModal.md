# Componente: ImportUrlModal
**Feature:** calendar
**Archivo en arquitectura:** `src/features/calendar/components/ImportUrlModal.tsx`
**US de referencia:** US-008
**Descripción:** Modal que se muestra en `/` cuando la URL contiene el parámetro `?cfg=`. Guía al usuario a través del proceso de importar una configuración de turno compartida. Se cierra siempre limpiando la URL con `navigate("/", { replace: true })`.
**Reutilización:** No — exclusivo de `features/calendar/`.

---

## 2. Variantes y Props Visuales

El componente gestiona su propio estado interno con 6 vistas (screens):

| Vista interna | Condición |
|---|---|
| `link-valid-choice` | Payload decodificado correctamente |
| `replace-confirm` | Usuario eligió "Reemplazar Mi turno" |
| `save-additional` | Usuario eligió "Guardar como adicional" |
| `save-additional-collision` | El nombre del payload ya existe |
| `link-invalid` | Error al decodificar / validar el payload |
| `limit-reached` | Ya hay 10 configuraciones adicionales |

---

## 3. Estados Visuales del Modal Contenedor

| Estado | Cambios visuales | Activado por |
|---|---|---|
| `mounting` | Fade-in + scale 0.95 → 1 del modal | Detección de `?cfg=` en URL |
| `open` | Modal visible, overlay activo | Tras mounting |
| `closing` | Fade-out | Cualquier acción de cierre |
| `closed` | Desmontado + URL limpiada | Tras fade-out |

---

## 4. Anatomía Visual (ASCII)

### Vista 1: link-valid-choice
```
┌──────────────────────────────────────────┐
│  ✕                                       │  ← botón cerrar (esquina sup-der)
│                                          │
│  📋  Turno compartido recibido          │  ← Share2 icono 24px
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Esquema:    12 horas / 36 descanso │ │  ← preview del payload
│  │  Entrada:    08:00               │   │
│  │  Color:  ████  #2563EB          │   │  ← swatch del color
│  └──────────────────────────────────┘   │
│                                          │
│  ¿Qué quieres hacer con este turno?     │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Reemplazar Mi turno actual      │   │  ← Button secondary, fullWidth
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  Guardar como turno adicional    │   │  ← Button primary, fullWidth
│  └──────────────────────────────────┘   │
│                                          │
│  Cancelar                               │  ← ghost, centrado
└──────────────────────────────────────────┘
  width: min(360px, 90vw)
  position: fixed, centered (top:50% left:50% translate(-50%,-50%))
  bg: surface-elevated, radius-xl, shadow-xl
  overlay: surface-overlay
```

### Vista 2: replace-confirm
```
│  ⚠  ¿Reemplazar Mi turno?             │
│                                          │
│  Esta acción reemplazará tu turno        │
│  predeterminado. No se puede deshacer.   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Sí, reemplazar Mi turno         │   │  ← Button destructive, fullWidth
│  └──────────────────────────────────┘   │
│  Cancelar                               │
```

### Vista 3: save-additional
```
│  Guardar como turno adicional           │
│                                          │
│  Nombre del turno                        │
│  ┌──────────────────────────────────┐   │
│  │ [nombre del payload o vacío]    │   │  ← input text, autoFocus
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Guardar turno                   │   │  ← Button primary, fullWidth
│  └──────────────────────────────────┘   │
│  Cancelar                               │
```

### Vista 4: save-additional-collision (nombre duplicado)
```
│  Guardar como turno adicional           │
│                                          │
│  Nombre del turno                        │
│  ┌──────────────────────────────────┐   │
│  │ Turno noche                      │   │  ← borde rojo
│  └──────────────────────────────────┘   │
│  ⓘ Ya existe un turno con ese nombre.  │  ← feedback-error, text-xs
│     ¿Usar "Turno noche (2)"?           │
│     ┌───────────────┐                  │
│     │ Turno noche (2) │                │  ← chip clickable con sugerencia
│     └───────────────┘                  │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Guardar turno                   │   │
│  └──────────────────────────────────┘   │
```

### Vista 5: link-invalid
```
│  🔗  Link no válido                    │
│                                          │
│  El link compartido no se pudo leer.    │
│  Puede estar incompleto o dañado.        │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Entendido                        │   │  ← Button primary, cierra modal
│  └──────────────────────────────────┘   │
```

### Vista 6: limit-reached
```
│  Límite alcanzado                       │
│                                          │
│  Ya tienes 10 turnos adicionales.       │
│  Elimina uno antes de importar otro.    │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Ir a Configuración               │   │  ← Button primary → navigate("/config")
│  └──────────────────────────────────┘   │
│  Cancelar                               │
```

---

## 5. Diseño Responsive

| Breakpoint | Cambio |
|---|---|
| mobile (< 640px) | Modal centrado. `width: min(360px, 90vw)`. Botones fullWidth. |
| desktop (≥ 640px) | Modal centrado. `width: 400px`. Sin cambio en botones. |

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` (modal) | `--color-surface-elevated` | |
| `background-color` (overlay) | `--color-surface-overlay` | |
| `border-radius` (modal) | `--radius-xl` | |
| `box-shadow` (modal) | `--shadow-xl` | Mayor elevación que BottomSheet |
| `background-color` (preview payload) | `--color-surface-base` | Bloque de info del turno importado |
| `border-radius` (preview) | `--radius-md` | |
| `color` (texto error) | `--color-feedback-error` | Vista collision |
| `background-color` (chip sugerencia) | `--color-feedback-info-surface` | |
| `color` (chip sugerencia) | `--color-feedback-info` | |
| `border-radius` (chip) | `--radius-full` | Pill |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
- Título: <h2 id="modal-title"> — cambia según la vista actual
- Overlay: <div aria-hidden="true"> (decorativo)
- Botón cerrar [✕]: <button aria-label="Cerrar">

TECLADO:
- Escape: cierra el modal (equivale a "Cancelar")
- Tab: navega dentro del modal únicamente (focus trap)
- Enter en input de nombre: ejecuta la acción de guardar

FOCUS:
- Al abrir: foco va al primer elemento interactivo del modal (botón primario o input)
- Vista save-additional: autoFocus en el input de nombre
- Al cerrar: foco regresa al elemento que triggereó el modal (en este caso, ninguno — fue auto-abierto por URL). Foco va al botón [?] o al primer elemento del AppBar.
- Focus trap: implementado — el Tab no sale del modal

CONTRASTE:
- Todos los textos verificados en design tokens ✓
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Modal fade-in + scale | Mount | `duration-normal` (250ms) | `ease-out` |
| Modal fade-out | Cierre | `duration-fast` (150ms) | `ease-in` |
| Overlay fade-in | Con modal | `duration-normal` | `ease-default` |
| Transición entre vistas | Click en opción | `duration-fast` | `ease-default` |

```css
@keyframes modal-enter {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .modal { animation: none; }
}
```

---

## 9. Notas para el Developer Agent

- **Decodificación al montar:** El componente decodifica el payload `?cfg=` en `useEffect` inmediatamente al montar. Flujo: `atob(cfgParam)` → `JSON.parse()` → validar campos → determinar vista inicial. Todo con `try/catch`.
- **Validación completa:** Validar que el objeto tenga `s` (scheme string `"C{n}:{m}"`), `e` (time `"HH:mm"`), `d` (date `"YYYY-MM-DD"`), `c` (hex válido). Si cualquier campo falla, vista `link-invalid`.
- **Limpiar URL siempre:** En TODOS los paths de cierre (éxito, cancelar, error, límite alcanzado), llamar `navigate("/", { replace: true })` para limpiar `?cfg=` de la URL.
- **Chip de sugerencia (collision):** El nombre sugerido es `{nombreOriginal} (2)`. Si `{nombre} (2)` también existe, intentar `(3)`, `(4)`, etc. Implementar como función helper.
- **Guardar como adicional:** Llama `configStore.addConfig({ ...payloadDecoded, name: nombreIngresado })`. Si el store rechaza por nombre duplicado, mostrar vista collision.
- **Reemplazar Mi turno:** Llama `configStore.replaceDefaultConfig({ ...payloadDecoded })`. Vista replace-confirm primero, luego ejecución.
- **Estado del modal es local:** El modal gestiona su propia vista interna (qué pantalla mostrar) con `useState`. No va al store — este flujo es transitorio y desaparece tras cerrarse.
- **Limit check:** Verificar `configStore.configs.filter(c => !c.isDefault).length >= 10` ANTES de mostrar las opciones. Si el límite está alcanzado, mostrar vista `limit-reached` directamente.
