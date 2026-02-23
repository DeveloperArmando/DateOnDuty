# Componente: Button
**Feature:** shared
**Archivo en arquitectura:** `src/shared/components/Button.tsx`
**US de referencia:** Aplica a todos (componente base de UI)
**Descripción:** Botón de acción reutilizable con soporte para estado de carga inline. Es el único botón de la app — no hay variaciones ad-hoc.
**Reutilización:** Sí — `src/shared/`. Usado en todas las features: config, search, feedback, onboarding, modales.

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `variant` | `primary` \| `secondary` \| `ghost` \| `destructive` | Color de fondo, borde y texto (ver estados) |
| `size` | `sm` \| `md` \| `lg` | Padding, tamaño de fuente, altura mínima |
| `fullWidth` | `true` \| `false` | `width: 100%` vs ancho por contenido |
| `loading` | `true` \| `false` | Reemplaza texto con `<LoadingDots />` (RG-002) |
| `iconLeft` | Icono lucide-react \| `undefined` | Icono a la izquierda del label |
| `iconRight` | Icono lucide-react \| `undefined` | Icono a la derecha del label |

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por | Regla |
|---|---|---|---|
| `default` | Estado base según variant (ver anatomía) | — | — |
| `hover` | Oscurece fondo ~10% (ver token `*-hover`) | Cursor sobre el botón | — |
| `focus-visible` | Outline 2px sólido, color `focus-ring`, offset 2px | Tab o click | A11Y |
| `active` | Escala `scale-[0.98]`, `duration-fast` | Click / tap sostenido | — |
| `loading` | Texto reemplazado por `<LoadingDots />`. Cursor `cursor-wait`. Puntero events bloqueados internamente (`isSubmitting` flag) | `loading={true}` | RG-002 |
| `disabled-visual` | Fondo y texto con opacidad reducida (`text-disabled`). Solo visual, **nunca** atributo HTML `disabled` | Prop `visuallyDisabled` \| Never para acciones principales | RG-001 |

> **RG-001 crítico:** El atributo HTML `disabled` NUNCA se agrega al `<button>`. La prevención de doble submit es interna via flag `isSubmitting`. La validación ocurre al intentar la acción.

---

## 4. Anatomía Visual (ASCII)

### variant=primary, size=md, fullWidth=false
```
┌─────────────────────────┐
│  [Icon?]  Guardar turno │  ← bg: interactive-primary, texto: text-inverse
└─────────────────────────┘
   14px px-4 py-2.5 radius-md
```

### variant=secondary, size=md
```
┌─────────────────────────┐
│  [Icon?]  Cancelar      │  ← bg: transparent, border: interactive-secondary-border
└─────────────────────────┘
   texto: interactive-secondary-text
```

### variant=ghost, size=md
```
  [Icon?]  Ver más         ← sin borde, sin fondo, texto: interactive-secondary-text
                             hover: bg-surface-elevated/60
```

### variant=destructive, size=md
```
┌─────────────────────────┐
│  [Trash2]  Eliminar     │  ← bg: feedback-error, texto: text-inverse
└─────────────────────────┘
```

### Estado loading (cualquier variant)
```
┌─────────────────────────┐
│     • • •               │  ← <LoadingDots /> centrado, ancho fijo (no colapsa)
└─────────────────────────┘
   min-width preservado para evitar layout shift
```

### Tamaños

| Size | padding | font | min-height | icon-size |
|---|---|---|---|---|
| `sm` | `px-3 py-1.5` | `text-sm` | `32px` | `16px` |
| `md` | `px-4 py-2.5` | `text-base` | `40px` | `18px` |
| `lg` | `px-6 py-3` | `text-base font-semibold` | `48px` | `20px` |

---

## 5. Diseño Responsive

> Responsive: el componente no cambia estructuralmente entre breakpoints. Escala con su contenedor. Usar `fullWidth={true}` en mobile cuando el diseño lo requiera (ej: botones CTA en modales y formularios).

---

## 6. Especificación de Tokens

### variant=primary
| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` | `--color-interactive-primary` | |
| `background-color` (hover) | `--color-interactive-primary-hover` | |
| `color` | `--color-interactive-primary-text` | `#FFFFFF` siempre |
| `border` | `none` | |
| `border-radius` | `--radius-md` | |
| `transition` | `--duration-fast ease-default` | hover + active |

### variant=secondary
| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` | `transparent` | |
| `background-color` (hover) | `--color-surface-elevated` | tono suave |
| `border` | `1.5px solid --color-interactive-secondary-border` | |
| `color` | `--color-interactive-secondary-text` | |
| `border-radius` | `--radius-md` | |

### variant=ghost
| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` | `transparent` | |
| `background-color` (hover) | `--color-surface-elevated` con `opacity-60` | |
| `border` | `none` | |
| `color` | `--color-interactive-secondary-text` | |

### variant=destructive
| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` | `--color-feedback-error` | |
| `color` | `--color-text-inverse` | `#FFFFFF` |
| `border` | `none` | |

### Estado focus-visible (todas las variants)
| Propiedad CSS | Token |
|---|---|
| `outline` | `2px solid --color-focus-ring` |
| `outline-offset` | `2px` |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <button type="button"> (o type="submit" cuando está en <form>)
- role ARIA: ninguno adicional (button nativo)
- aria-busy="true": cuando loading=true
- aria-label: requerido cuando el botón es solo icono (sin texto visible)

TECLADO:
- Tab: recibe foco, muestra focus ring visible
- Enter / Space: dispara onClick
- Escape: no aplica al botón en sí — lo gestiona el componente padre (modal, form)

FOCUS:
- Focus visible: outline con --color-focus-ring, offset 2px
- NO usar outline:none en ningún caso

CONTRASTE:
- primary: texto blanco #FFF sobre #1D4ED8 → ~8.6:1 AAA ✓
- secondary: texto #1D4ED8 sobre blanco → ~5.9:1 AA ✓
- destructive: texto blanco #FFF sobre #DC2626 → ~5.7:1 AA ✓
- Estado loading: LoadingDots usa --color-interactive-primary-text sobre fondo del botón ✓
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| hover fondo | `mousenter` | `duration-fast` | `ease-default` |
| active scale | `mousedown` | `duration-fast` | `ease-default` |

> `duration-fast` = 150ms. Los estados loading no tienen transición de entrada (cambio inmediato).

---

## 9. Notas para el Developer Agent

- **Flag isSubmitting:** La prevención de doble-submit es interna. El componente acepta prop `loading` desde fuera pero también puede manejar su estado internamente si se le pasa `onClickAsync`. NO agregar `disabled` al HTML bajo ninguna circunstancia (RG-001).
- **Layout shift en loading:** El botón debe mantener su ancho mínimo cuando pasa a estado loading. Usar `min-width` calculado en el primer render o `min-w-[Xpx]` explícito en el consumer. `<LoadingDots />` debe ser del mismo alto que el texto para evitar salto vertical.
- **type="submit" vs type="button":** Cuando el botón está dentro de un `<form>`, usar `type="submit"` para que funcione con Enter. En todos los demás contextos, `type="button"` para prevenir submit accidental.
- **Icono solo:** Si el botón no tiene texto (solo icono), es OBLIGATORIO incluir `aria-label` con la descripción de la acción.
- **fullWidth en mobile:** En formularios y modales, los botones CTA son `fullWidth={true}` en mobile. En desktop pueden ser de ancho natural — el consumer decide.
- **Lógica de negocio fuera:** El componente Button no contiene ninguna lógica de negocio. Solo renderiza y emite eventos. La lógica de validación y guardado va en el store o en el hook del formulario.
