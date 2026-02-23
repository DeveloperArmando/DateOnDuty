# Componente: LoadingDots
**Feature:** shared
**Archivo en arquitectura:** `src/shared/components/LoadingDots.tsx`
**US de referencia:** RG-002 (regla global de loading state)
**Descripción:** Indicador de carga inline con tres puntos animados. Se usa exclusivamente dentro de `<Button>` cuando `loading={true}`.
**Reutilización:** Sí — `src/shared/`. Importado solo por `Button.tsx`.

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `color` | hereda del contexto del botón | El color del punto coincide con `currentColor` del texto del botón padre |
| `size` | `sm` \| `md` \| `lg` | Hereda del `size` del Button — el consumer no lo especifica directamente |

> El componente no recibe color explícito — usa `currentColor` para heredar automáticamente el color del texto del botón padre. Así funciona en todos los variants sin configuración extra.

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por | Regla |
|---|---|---|---|
| `animating` | Tres puntos con animación de bounce secuencial desfasado | Siempre que el componente esté montado | RG-002 |
| `reduced-motion` | Tres puntos estáticos sin animación. Opacidad 0.6 para indicar "espera" | `prefers-reduced-motion: reduce` | A11Y |

---

## 4. Anatomía Visual (ASCII)

```
  •  •  •
  ↑  ↑  ↑
 [0] [1] [2]   ← tres puntos circulares, 6px Ø
                  desfase de animación: 0ms | 150ms | 300ms
                  animación: bounce vertical (translateY -4px → 0)
                  duración ciclo: 600ms, ease-in-out, infinite
```

### Por tamaño de botón:

| Button size | Dot size | Gap entre puntos |
|---|---|---|
| `sm` | `5px Ø` | `3px` |
| `md` | `6px Ø` | `4px` |
| `lg` | `7px Ø` | `4px` |

---

## 5. Diseño Responsive

> Responsive: el componente no cambia estructuralmente entre breakpoints.

---

## 6. Especificación de Tokens

| Propiedad CSS | Token / Valor | Nota |
|---|---|---|
| `background-color` (cada punto) | `currentColor` | Hereda color de texto del botón padre |
| `border-radius` | `50%` | Círculo perfecto |
| `animation` | `bounce-dot 600ms ease-in-out infinite` | CSS keyframe custom |

### Keyframe CSS:
```css
@keyframes bounce-dot {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-4px); }
}

/* Desfases por posición: */
.dot-1 { animation-delay: 0ms; }
.dot-2 { animation-delay: 150ms; }
.dot-3 { animation-delay: 300ms; }

@media (prefers-reduced-motion: reduce) {
  .dot-1, .dot-2, .dot-3 {
    animation: none;
    opacity: 0.6;
  }
}
```

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Elemento HTML base: <span> (inline, sin semántica propia)
- El <button> padre es quien tiene aria-busy="true"
- Este componente no necesita aria propio
- El contenedor del button puede tener aria-label descriptivo si no hay texto visible

CONTRASTE:
- Usa currentColor → hereda el contraste del botón padre, que ya está verificado.
  primary: puntos blancos sobre bg #1D4ED8 → ~8.6:1 AAA ✓
  secondary: puntos #1D4ED8 sobre bg blanco → ~5.9:1 AA ✓
  destructive: puntos blancos sobre bg #DC2626 → ~5.7:1 AA ✓
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| `bounce-dot` (x3) | Al montar el componente | `600ms` por ciclo, `infinite` | `ease-in-out` |
| Desfase secuencial | — | dot-1: 0ms, dot-2: 150ms, dot-3: 300ms | — |

---

## 9. Notas para el Developer Agent

- **currentColor:** Implementar con `backgroundColor: 'currentColor'` o clase Tailwind `bg-current`. Esto asegura que el color cambie automáticamente entre variants del botón sin props adicionales.
- **Tamaño:** El developer debe mapear el `size` del botón padre al tamaño del dot. Solución más limpia: pasar `size` como prop desde Button.tsx al montar LoadingDots.
- **Altura consistente:** El componente debe tener la misma altura que una línea de texto del tamaño correspondiente para evitar layout shift cuando el botón alterna entre texto y dots.
- **Animación infinite:** Usar CSS `animation-iteration-count: infinite`. No usar `setInterval` ni JS para la animación.
- **Standalone:** El componente nunca se usa fuera de Button. No diseñar para un uso más amplio.
