---
name: skill-component-from-spec
description: Implementa un componente React de DateOnDuty a partir de su archivo de spec en docs/design/component-specs/. Guía la lectura de la spec, aplica los patrones obligatorios del proyecto (i18n, dark mode, colores dinámicos, accesibilidad, animaciones CSS) y produce el componente TypeScript listo para pasar typecheck y lint. Usar cada vez que el Frontend Developer va a implementar un nuevo componente.
---

# SKILL: Component From Spec
**Fase:** Implementación — capa UI
**Cuándo usarlo:** Antes de implementar cualquier componente React. Leer la spec primero.
**Produce:** Componente `.tsx` tipado, accesible, con i18n, ready para `npm run typecheck`.

---

## PROTOCOLO DE LECTURA (OBLIGATORIO)

Antes de escribir una línea de código, leer en este orden:

1. **`docs/design/component-specs/[NombreComponente].md`** — spec principal. Si no existe spec para este componente, escalar: no inventar comportamiento.
2. **`docs/design/wireframes/[pantalla].md`** — contexto visual y estados.
3. **`docs/DOD_DECISIONS_LOG.md`** — decisiones que afectan al componente (buscar el nombre del componente).
4. **`docs/design/animation-specs.md`** — si el componente tiene animaciones.
5. **`docs/design/design-tokens.md`** — para nombres de tokens CSS correctos.

---

## PATRONES OBLIGATORIOS

### 1. Props Interface

```typescript
// Siempre exportar la interfaz de props
export interface NombreComponenteProps {
  // Props con tipos explícitos — sin 'any'
  // Props opcionales con '?' y valor por defecto en la desestructuración
}
```

### 2. i18n — Cero strings hardcodeados

```typescript
import { useTranslation } from 'react-i18next'

// En el componente:
const { t } = useTranslation('namespace') // namespace correcto del componente

// En JSX — nunca strings literales:
<span>{t('key.del.string')}</span>

// Con interpolación:
<span>{t('key.con.variable', { nombre: config.name })}</span>

// Con plurales:
<span>{t('key.plural', { count: items.length })}</span>
```

Namespaces disponibles: `common`, `calendar`, `config`, `search`, `feedback`, `onboarding`.
Consultar `docs/design/i18n-namespaces.md` para las keys exactas.

### 3. Dark mode

Usar **siempre tokens CSS** — nunca hardcodear colores:

```tsx
// ✅ Correcto — el token cambia automáticamente en .dark
<div className="bg-[var(--color-surface-base)] text-[var(--color-text-primary)]">

// ✅ También correcto con clases de Tailwind si los tokens están registrados en @theme
<div className="bg-surface-base text-text-primary">

// ❌ Incorrecto — el color no responde al dark mode
<div className="bg-white text-gray-900">
```

### 4. Colores dinámicos de turno

Los colores que elige el usuario van **siempre** en `style` inline. Nunca en clases de Tailwind:

```tsx
// ✅ Correcto
<div
  style={{
    background: `linear-gradient(to bottom, ${hexToRgba(config.color, 0.90)}, ${hexToRgba(config.color, 0.40)})`,
  }}
/>

// ✅ Border lateral de identificación
<div style={{ borderLeftColor: config.color }} className="border-l-4">

// ❌ Incorrecto — Tailwind no puede generar clases dinámicas en runtime
<div className={`bg-[${config.color}]`}>
```

Helper para rgba (implementar en `src/shared/utils/color.ts`):
```typescript
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
```

### 5. Validación de color hex (antes de aplicar al DOM)

```typescript
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

// Siempre validar antes de usar en style inline
const safeColor = HEX_COLOR_REGEX.test(config.color) ? config.color : '#2563EB'
```

### 6. Accesibilidad

```tsx
// Botones interactivos siempre tienen texto accesible
<button aria-label={t('action.cerrar')}>
  <X size={20} aria-hidden="true" />
</button>

// Roles semánticos para regiones importantes
<nav aria-label={t('nav.principal')}>
<main>
<section aria-labelledby="heading-id">

// Focus visible — usar clase de Tailwind del token
<button className="focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]">

// Elementos decorativos ocultos para screen readers
<span aria-hidden="true">→</span>

// Contenido dinámico que debe anunciarse
<div role="status" aria-live="polite">{mensaje}</div>
```

### 7. RG-001 — Botones NUNCA disabled

```tsx
// ❌ Incorrecto
<button disabled={isLoading || !isValid}>Guardar</button>

// ✅ Correcto — validar en el handler, no deshabilitar el botón
const handleSubmit = () => {
  const errors = validate(formData)
  if (errors.length > 0) {
    setErrors(errors)
    scrollToFirstError()  // RG-004
    return
  }
  // ... proceder
}

<button onClick={handleSubmit}>
  {isSubmitting ? <LoadingDots /> : t('action.guardar')}
</button>
```

### 8. RG-002 — Loading state

```tsx
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async () => {
  if (isSubmitting) return  // prevenir double-submit
  setIsSubmitting(true)
  try {
    await doAsyncOperation()
  } finally {
    setIsSubmitting(false)
  }
}

// En JSX — el botón siempre clickable pero muestra loading
<button onClick={handleSubmit} aria-busy={isSubmitting}>
  {isSubmitting ? <LoadingDots /> : t('action.enviar')}
</button>
```

### 9. Animaciones CSS (sin Framer Motion)

Las animaciones usan clases CSS definidas en `src/index.css` con los `@keyframes` de `docs/design/animation-specs.md`:

```tsx
// ✅ Animación via clase CSS
<div className={isVisible ? 'dod-modal-enter' : 'dod-modal-exit'}>

// ✅ Animación de entrada controlada por estado
const [mounted, setMounted] = useState(false)
useEffect(() => { setMounted(true) }, [])
<div className={mounted ? 'dod-fade-in' : 'opacity-0'}>
```

**Nunca** importar `framer-motion` ni `react-spring`.

### 10. Iconos — solo lucide-react

```tsx
// ✅ Correcto
import { Settings, ChevronLeft, X, LogIn } from 'lucide-react'

// Siempre con size explícito y aria-hidden si es decorativo
<Settings size={20} aria-hidden="true" />

// ❌ Incorrecto
import { FaSettings } from 'react-icons/fa'  // prohibido
```

### 11. Gestos con @use-gesture/react

```tsx
import { useDrag } from '@use-gesture/react'

const bind = useDrag(({ movement: [mx, my], velocity: [vx, vy], last }) => {
  if (!last) return
  const THRESHOLD_PX = 50
  const THRESHOLD_VEL = 0.3

  if (Math.abs(my) > THRESHOLD_PX && Math.abs(vy) > THRESHOLD_VEL) {
    // swipe vertical — navegar meses
    onSwipeVertical(my > 0 ? -1 : 1)
  }
}, { axis: 'y' })  // axis evita conflictos con scroll

// Siempre proveer fallback en botones
<button onClick={() => onSwipeVertical(-1)}>{t('nav.mes.anterior')}</button>
<div {...bind()} style={{ touchAction: 'none' }}>
  {/* contenido */}
</div>
```

### 12. Navegación — nunca `<a href>` para rutas internas

```tsx
import { Link, useNavigate } from 'react-router-dom'

// Para links estáticos
<Link to="/config">{t('nav.configuracion')}</Link>

// Para navegación programática
const navigate = useNavigate()
navigate('/config')                          // navegación normal
navigate('/', { replace: true })            // reemplazar historial (post-import URL)
```

---

## ESTRUCTURA DE UN COMPONENTE TÍPICO

```typescript
// src/features/[feature]/components/[NombreComponente].tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconName } from 'lucide-react'
import { useConfigStore } from '@/stores/config-store'
import { DESIGN } from '@/shared/constants/design'

export interface NombreComponenteProps {
  // props tipadas
}

export function NombreComponente({ /* props */ }: NombreComponenteProps) {
  const { t } = useTranslation('namespace')
  // hooks del store — solo los selectores necesarios, no todo el store
  const configs = useConfigStore((state) => state.configs)

  // estado local
  const [isOpen, setIsOpen] = useState(false)

  // handlers
  const handleAction = () => {
    // lógica
  }

  return (
    <div
      className="..." // clases Tailwind con tokens semánticos
      role="..." // rol ARIA si corresponde
    >
      {/* JSX */}
    </div>
  )
}
```

---

## INTEGRACIÓN CON EL STORE

Los componentes **no llaman al Core Engine directamente**. El flujo es:

```
Componente → Store action → Core Engine → Store state → Componente
```

```typescript
// ✅ Correcto — el store invoca el core
const result = useConfigStore((state) => state.getShiftStatus(config, date))

// ❌ Incorrecto — el componente invoca el core directamente
import { calculateShiftStatus } from '@/core/shift-calculator/shift-calculator'
const result = calculateShiftStatus(config, date)  // no hacer esto en UI
```

Excepción: `src/features/search/` puede usar el core directamente si el store no expone la función necesaria — documentar en el log si se hace.

---

## CHECKLIST DE COMPLETITUD

Antes de marcar un componente como implementado:

- [ ] Props interface exportada con tipos explícitos (sin `any`)
- [ ] Cero strings hardcodeados — todos pasan por `t()`
- [ ] Colores de turno solo en `style` inline (nunca en className dinámico)
- [ ] Colores hex validados antes de aplicar al DOM
- [ ] Dark mode funciona con los tokens correctos
- [ ] Iconos solo de `lucide-react`
- [ ] Botones nunca `disabled` (RG-001)
- [ ] Loading state con `<LoadingDots />` si hay operación async (RG-002)
- [ ] Textos largos con `truncate` + atributo `title` (RG-006)
- [ ] Focus visible con `focus-visible:ring-*`
- [ ] Elementos decorativos con `aria-hidden="true"`
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run lint` pasa sin warnings
- [ ] Decisión de implementación relevante registrada en `DOD_DECISIONS_LOG.md`
