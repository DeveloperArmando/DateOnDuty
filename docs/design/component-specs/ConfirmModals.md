# Componentes: ConfirmDeleteModal + ConfirmMakeDefaultModal
**Feature:** config
**Archivos en arquitectura:**
- `src/features/config/components/ConfirmDeleteModal.tsx`
- `src/features/config/components/ConfirmMakeDefaultModal.tsx`
**US de referencia:** US-004, US-005
**Descripción:** Modales de confirmación para acciones destructivas o de alto impacto en la lista de configuraciones. Se abren desde `ConfigRow` cuando el usuario elige "Eliminar" o "Hacer turno principal".
**Reutilización:** No — exclusivos de `features/config/`.

---

## ConfirmDeleteModal

### Descripción
Pide confirmación antes de eliminar una configuración adicional. La acción es irreversible. La config default ("Mi turno") nunca puede eliminarse — este modal nunca se abre para ella.

### Variantes y Props

| Prop | Valores | Efecto |
|---|---|---|
| `configName` | `string` | Nombre de la config a eliminar — se muestra en el texto de confirmación |
| `onConfirm` | `() => void` | Ejecuta la eliminación |
| `onCancel` | `() => void` | Cierra el modal sin acción |
| `isOpen` | `boolean` | Controla visibilidad |

### Anatomía Visual (ASCII)

```
┌──────────────────────────────────────────┐
│  [overlay rgba(0,0,0,0.45)]              │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  🗑  ¿Eliminar "Turno noche"?     │  │  ← Trash2, nombre de la config
│  │                                    │  │
│  │  Esta acción no se puede deshacer. │  │  ← text-sm, text-secondary
│  │                                    │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │      Sí, eliminar            │  │  │  ← Button destructive, fullWidth
│  │  └──────────────────────────────┘  │  │
│  │  Cancelar                          │  │  ← Button ghost, centrado
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
  Modal: width min(320px, 90vw)
  bg: surface-elevated, radius-xl, shadow-xl
  padding: 24px
```

### Estados visuales

| Estado | Cambios | Activado por |
|---|---|---|
| `idle` | Botón "Eliminar" normal | Estado base |
| `deleting` | Botón muestra `<LoadingDots />` | Click en "Eliminar" |

> La eliminación es síncrona (Zustand) — el estado `deleting` dura milisegundos pero visualmente se aplica para consistencia con RG-002.

### Tokens

| Propiedad CSS | Token |
|---|---|
| `background-color` (modal) | `--color-surface-elevated` |
| `background-color` (overlay) | `--color-surface-overlay` |
| `color` (ícono Trash2) | `--color-feedback-error` |
| `color` (texto descripción) | `--color-text-secondary` |

### Accesibilidad

```
- role="dialog" aria-modal="true" aria-labelledby="delete-modal-title"
- <h2 id="delete-modal-title">¿Eliminar "{configName}"?</h2>
- Focus trap: Tab se queda dentro del modal
- Al abrir: foco va al botón "Cancelar" (no al destructivo — patrón de seguridad)
- Escape: cierra (equivale a Cancelar)
- Al cerrar: foco regresa al botón ⋮ de la fila que lo abrió
```

---

## ConfirmMakeDefaultModal

### Descripción
Pide confirmación antes de cambiar la configuración predeterminada. La acción mueve "Mi turno" actual a adicional y convierte la seleccionada en el nuevo default. Por diseño, el usuario debe escribir el nombre de la nueva adicional (el nombre actual de "Mi turno") antes de confirmar — esto asegura que el usuario entiende el cambio.

### Variantes y Props

| Prop | Valores | Efecto |
|---|---|---|
| `newDefaultName` | `string` | Nombre de la config que se convertirá en default |
| `currentDefaultName` | `string` | Nombre actual del default ("Mi turno") |
| `onConfirm` | `(newNameForOldDefault: string) => void` | Ejecuta el cambio, recibe el nombre para la antigua default |
| `onCancel` | `() => void` | Cierra sin acción |
| `isOpen` | `boolean` | |

### Anatomía Visual (ASCII)

```
┌──────────────────────────────────────────┐
│  ⭐  Cambiar turno principal            │  ← Star icono
│                                          │
│  "Turno noche" se convertirá en tu      │
│  turno principal.                        │  ← text-sm, text-secondary
│                                          │
│  "Mi turno" pasará a ser un turno        │
│  adicional. ¿Con qué nombre?             │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ Mi turno anterior                │   │  ← input text, autoFocus, pre-filled
│  └──────────────────────────────────┘   │
│  (o elige un nombre para guardarlo)      │  ← helper text, text-xs
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Confirmar cambio                │   │  ← Button primary, fullWidth
│  └──────────────────────────────────┘   │
│  Cancelar                               │
└──────────────────────────────────────────┘
```

### Estados visuales

| Estado | Cambios | Activado por |
|---|---|---|
| `idle` | Input editable, botón activo | Estado base |
| `name-error` | Borde rojo en input + mensaje | Input vacío al intentar confirmar |
| `name-duplicate` | Borde rojo + "Ese nombre ya existe" | Nombre igual a otra config adicional |
| `saving` | Botón con `<LoadingDots />` | Click en "Confirmar" |

### Tokens

| Propiedad CSS | Token |
|---|---|
| `background-color` (modal) | `--color-surface-elevated` |
| `background-color` (overlay) | `--color-surface-overlay` |
| `color` (ícono Star) | `--color-feedback-warning` | Acción de alto impacto (no destructiva, pero significativa) |
| `border-color` (input error) | `--color-feedback-error` |

### Accesibilidad

```
- role="dialog" aria-modal="true" aria-labelledby="make-default-modal-title"
- <h2 id="make-default-modal-title">Cambiar turno principal</h2>
- autoFocus en el input al abrir
- Focus trap: Tab se queda dentro del modal
- Escape: cierra (equivale a Cancelar)
- Al cerrar: foco regresa al botón ⋮ o al botón "Hacer principal"
- Validar nombre en tiempo real con debounce 300ms (igual que ShiftConfigForm)
```

---

## Notas compartidas para el Developer Agent

- **Patrón de apertura:** El parent (`ConfigList`) gestiona qué modal está abierto. `ConfigRow` dispara el evento, el parent abre el modal correspondiente pasando los datos de la config seleccionada. No hay estado de modal dentro de `ConfigRow`.
- **Portales:** Ambos modales se renderizan en `document.body` via `createPortal` para evitar problemas de `z-index` y `overflow:hidden` en la lista.
- **ConfirmMakeDefaultModal — input pre-relleno:** El input se inicializa con `currentDefaultName` ("Mi turno" o el nombre que tenga). El usuario puede cambiarlo. Si no cambia nada y el nombre no colisiona, se confirma directamente.
- **ConfirmMakeDefaultModal — lógica en el store:** La lógica de "mover config actual a adicional + promover la seleccionada" va en `configStore.makeDefault(id, newNameForOldDefault)`. El modal no ejecuta ninguna lógica de negocio directamente.
- **Animaciones:** Mismo patrón que `ImportUrlModal` — fade-in + scale al montar, fade-out al cerrar. `duration-normal` para entrada, `duration-fast` para salida.
