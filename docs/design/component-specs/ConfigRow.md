# Componente: ConfigRow
**Feature:** config
**Archivo en arquitectura:** `src/features/config/components/ConfigRow.tsx`
**US de referencia:** US-004, US-005, US-006
**Descripción:** Fila de una configuración de turno en la lista `/config`. Muestra nombre, color, badge de default, e icono de menú de acciones (kebab). En desktop, las acciones se muestran como botones inline.
**Reutilización:** No — exclusivo de `features/config/`.

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `isDefault` | `true` \| `false` | Badge "Principal" visible. Acciones limitadas (sin eliminar, sin "hacer principal"). |
| `isMenuOpen` | `true` \| `false` | Menú kebab expandido |
| `config` | `ShiftConfiguration` | Datos de la config a mostrar |

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por |
|---|---|---|
| `default` | Fila con nombre, color swatch, badge (si aplica), icono ⋮ | Estado normal |
| `menu-open` | Panel de opciones desplegado debajo de la fila (mobile) | Tap en ⋮ |
| `hover` | Fondo `surface-elevated` leve | Cursor sobre la fila (desktop) |
| `focus` | Focus ring en el elemento interactivo activo | Tab |

---

## 4. Anatomía Visual (ASCII)

### Mobile — config default
```
┌────────────────────────────────────────────┐
│  ████  Mi turno       [Principal]      ⋮  │
└────────────────────────────────────────────┘
    ↑        ↑                ↑           ↑
 swatch   nombre            badge       kebab
 20px Ø  text-base         text-xs     MoreVertical
          font-medium      rounded     24px, ghost btn
                           surface-info-surface
```

### Mobile — config adicional
```
┌────────────────────────────────────────────┐
│  ████  Turno noche                     ⋮  │
└────────────────────────────────────────────┘
```

### Mobile — menú kebab expandido
```
┌────────────────────────────────────────────┐
│  ████  Turno noche                     ✕  │  ← icono cambia a X
├────────────────────────────────────────────┤
│  ✏️  Editar                               │
│  ⭐  Hacer turno principal               │
│  🗑  Eliminar                             │  ← texto rojo (feedback-error)
└────────────────────────────────────────────┘
```

### Desktop — acciones inline (≥ 640px)
```
┌──────────────────────────────────────────────────────────────┐
│  ████  Mi turno       [Principal]     [Editar]               │
│  ████  Turno noche                    [Editar]  [Principal]  [Eliminar] │
└──────────────────────────────────────────────────────────────┘
         ← sin menú kebab en desktop — botones directos →
```

---

## 5. Diseño Responsive

| Breakpoint | Cambio |
|---|---|
| mobile (< 640px) | Menú kebab ⋮ con panel desplegable. Sin botones de acción visibles. |
| desktop (≥ 640px) | Botones de acción inline (ghost variant). Sin menú kebab. |

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` (fila) | `--color-surface-elevated` | Card/lista |
| `background-color` (fila hover) | `--color-surface-base` | Leve cambio |
| `background-color` (swatch) | `style inline: config.color` | Color dinámico |
| `border-radius` (swatch) | `50%` | Círculo |
| `color` (nombre) | `--color-text-primary` | |
| `background-color` (badge Principal) | `--color-feedback-info-surface` | |
| `color` (badge Principal) | `--color-feedback-info` | text-xs |
| `border-radius` (badge) | `--radius-full` | Pill |
| `color` (opción Eliminar) | `--color-feedback-error` | Destructive action |
| `border-top` (menú expandido) | `1px solid --color-border-default` | Separador |
| `transition` | `--duration-fast ease-default` | hover |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <li> dentro de <ul role="list">
- Botón kebab: <button aria-label="Opciones de Turno noche" aria-expanded={isMenuOpen} aria-controls="menu-{id}">
- Panel de menú: <div id="menu-{id}" role="menu">
- Cada opción del menú: <button role="menuitem">
- Botones desktop: <button> independientes con aria-label descriptivo

TECLADO:
- Tab: navega a la fila como unidad, luego al botón kebab (mobile) o botones inline (desktop)
- Enter en kebab: abre el menú
- Escape: cierra el menú kebab, foco regresa al botón kebab
- Flechas Up/Down dentro del menú: navegan entre opciones (roving tabindex)
- Enter en opción de menú: ejecuta la acción

CONTRASTE:
- Nombre: text-primary → AAA ✓
- Badge "Principal": feedback-info sobre feedback-info-surface → verificar en runtime
- Texto "Eliminar": feedback-error sobre surface-elevated → ~5.7:1 AA ✓
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Apertura del menú kebab | Tap en ⋮ | `duration-fast` | `ease-out` |
| Cierre del menú kebab | Tap en ✕ / Escape / acción | `duration-fast` | `ease-in` |

```css
@keyframes menu-expand {
  from { opacity: 0; transform: scaleY(0.95); transform-origin: top; }
  to   { opacity: 1; transform: scaleY(1); }
}
```

---

## 9. Notas para el Developer Agent

- **Cierre automático del menú:** Al hacer click fuera del menú (click en overlay invisible o `useClickOutside` hook), el menú se cierra. También se cierra al presionar Escape.
- **Solo un menú abierto a la vez:** El parent (`ConfigList`) gestiona qué ID de menú está abierto. `ConfigRow` recibe `isMenuOpen` como prop y llama `onMenuToggle(config.id)` — no gestiona el estado del menú internamente.
- **Default no puede eliminarse:** Si `isDefault=true`, la opción "Eliminar" no aparece en el menú. La opción "Hacer turno principal" tampoco (ya lo es).
- **Acción "Hacer turno principal":** Abre un modal de confirmación (`ConfirmMakeDefaultModal`) antes de ejecutar. El ConfigRow solo dispara el evento — el modal lo gestiona el parent.
- **Acción "Eliminar":** Abre un modal de confirmación (`ConfirmDeleteModal`). Igual que arriba.
- **Navegación a editar:** La opción "Editar" llama `navigate(\`/config/${config.id}\`)`. No hay modal intermedio.
- **Swatch color:** `backgroundColor: config.color` via `style` inline. Validado previamente en el store.
