# Componente: ConfigBanner
**Feature:** onboarding
**Archivo en arquitectura:** `src/features/onboarding/components/ConfigBanner.tsx`
**US de referencia:** US-009, US-011
**Descripción:** Banner de onboarding que aparece la primera vez que el usuario accede a la app. Ocupa el ancho completo en la parte superior de la pantalla, sobre el contenido del calendario. Auto-desaparece a los 50 segundos. Tap navega a `/config`.
**Reutilización:** No — exclusivo de `features/onboarding/`.

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `timeElapsed` | `number` (segundos desde `onboardingStartTime`) | Controla la barra de progreso |
| `onDismiss` | callback | Se llama cuando el timer llega a 50s |

> No hay variantes visuales. El componente siempre es igual, solo cambia la barra de progreso.

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por |
|---|---|---|
| `visible` | Banner completo visible, barra de progreso avanzando | `bannerSeen=false` y timer < 50s |
| `leaving` | Fade-out + slide-up del banner | Timer llega a 50s |
| `gone` | Componente desmontado | Tras animación de salida |

> No hay un botón de cierre. El usuario no puede descartar el banner manualmente (per PRD — ver issue CF-001 pendiente con PO).

---

## 4. Anatomía Visual (ASCII)

### Mobile (360px)
```
┌──────────────────────────────────────────────────────┐
│  ⚙  Configura tu turno para ver tu horario real  › │  ← tap = navigate("/config")
│  ══════════════════════════════════(barra progreso)  │  ← progreso de 0 a 50s
└──────────────────────────────────────────────────────┘
  position: fixed, top: [altura del AppBar], left: 0, right: 0
  z-index: z-banner (encima del calendario, debajo del AppBar)
  height: 56px + barra 2px
  padding: 0 16px
  cursor: pointer
```

### Estructura interna:
```
┌──────────────────────────────────────────────────────┐
│  [Settings 18px]  Configura tu turno para...  [›]   │  ← icono + texto + chevron
└──────────────────────────────────────────────────────┘
│ ████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← barra de progreso
```

### Barra de progreso:
```
  ┌────────────────────────────────────────────────────┐
  │ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
  └────────────────────────────────────────────────────┘
    height: 2px
    filled: interactive-primary (width = (timeElapsed / 50) * 100%)
    unfilled: border-default
    transition: width 1s linear (se actualiza cada segundo)
```

---

## 5. Diseño Responsive

| Breakpoint | Cambio |
|---|---|
| mobile (< 640px) | Full width. Texto truncado si no cabe: `truncate` + `title` atributo (RG-006). |
| desktop (≥ 640px) | Full width igualmente. Texto siempre cabe. Altura: 60px. |

---

## 6. Especificación de Tokens

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` | `--color-feedback-info-surface` | Azul suave para destacar sin agresividad |
| `color` (texto + iconos) | `--color-feedback-info` | |
| `background-color` (barra progreso filled) | `--color-interactive-primary` | |
| `background-color` (barra progreso unfilled) | `--color-border-default` | |
| `box-shadow` (banner) | `0 2px 4px rgba(0,0,0,0.08)` | Separación suave del calendario |
| `transition` (barra progreso) | `width 1s linear` | Actualización cada segundo |
| `transition` (salida banner) | `opacity, transform -- duration-normal ease-in` | Fade + slide up |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <aside aria-label="Aviso de configuración inicial">
- El elemento completo es un <button> o <a> que navega a /config
  (o un <div role="button" tabIndex={0}>)
- aria-label del elemento clickable: "Ir a configurar mi turno"
- La barra de progreso: <div role="progressbar" aria-valuenow={timeElapsed} aria-valuemin={0} aria-valuemax={50} aria-label="Tiempo restante del aviso">

TECLADO:
- Tab: el banner recibe foco
- Enter / Space: navega a /config (equivalente al tap)

FOCUS:
- Focus visible: outline 2px solid --color-focus-ring
- El banner NO roba el foco al aparecer (el usuario puede estar interactuando con el calendario)

ANUNCIO A LECTOR DE PANTALLA:
- aria-live="polite" en el banner para que se anuncie al aparecer sin interrumpir
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Entrada (slide-down + fade) | Mount | `duration-normal` (250ms) | `ease-out` |
| Progreso de barra | Cada segundo via `setInterval` | `1s linear` | `linear` |
| Salida (fade-out + slide-up) | Timer llega a 50s | `duration-normal` (250ms) | `ease-in` |

---

## 9. Notas para el Developer Agent

- **Timer persistente entre navegaciones:** El `onboardingStartTime` se guarda en `ui-store` (no persistido). Al montar el componente, calcula `timeElapsed = (Date.now() - uiStore.onboardingStartTime) / 1000`. Si el usuario navega a `/config` y vuelve, el banner retoma donde estaba.
- **setInterval para la barra:** `useEffect(() => { const id = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(id); }, [])`. El `clearInterval` en el cleanup previene que el flag se guarde si el usuario cierra el browser antes de 50s.
- **Flag `bannerSeen`:** Se escribe a `dod-onboarding.bannerSeen = true` SOLO cuando el timer de 50s completa. NO se escribe si el usuario toca el banner y navega a `/config`. NO se escribe si cierra el browser.
- **Tap → /config:** El banner completo es el target clickable. Al tocar, `navigate("/config")`. El banner sigue corriendo en el fondo (el timer no se pausa). Si el usuario vuelve a `/`, el banner continúa visible con el tiempo ya transcurrido.
- **No hay botón X:** Por diseño del PRD. El issue CF-001 está documentado para que el PO decida si agregar cierre manual en v1.1.
- **z-index:** El banner debe estar por encima del contenido del calendario pero por debajo del AppBar y cualquier modal. Sugerencia: `z-[20]` si AppBar es `z-[30]`.
- **Posición top:** El `top` del banner debe ser igual a la altura del AppBar (normalmente `56px` o `64px`). Usar una CSS variable o constante compartida para este valor.
- **prefers-reduced-motion:** La animación de entrada/salida se omite. La barra de progreso sigue animándose (es funcional, no decorativa) — aunque con `transition: none` si el usuario lo prefiere.
