# Componente: ColorPicker
**Feature:** config
**Archivo en arquitectura:** `src/features/config/components/ColorPicker.tsx`
**US de referencia:** US-003, US-007
**Descripción:** Selector de color para la franja del turno. Combina un `<input type="color">` nativo (oculto) con una paleta de 10 colores predeterminados y un campo de entrada hex manual. Incluye evaluación de contraste WCAG en tiempo real.
**Reutilización:** No — exclusivo de `features/config/`. Usado dentro de `ShiftConfigForm`.

---

## 2. Variantes y Props Visuales

| Prop visual | Valores | Efecto |
|---|---|---|
| `value` | `string` (hex 6 dígitos) | Color actualmente seleccionado |
| `onChange` | `(color: string) => void` | Callback al cambiar color |
| `existingColors` | `string[]` | Colores ya usados por otras configs — muestra punto de indicación en paleta |
| `contrastWarning` | `boolean` | Si true, muestra advertencia de contraste debajo |

---

## 3. Estados Visuales

| Estado | Cambios visuales | Activado por |
|---|---|---|
| `default` | Swatch del color actual + valor hex + botón "Cambiar color" + paleta | Estado inicial |
| `color-selected` | El círculo de la paleta con el color activo muestra un check `✓` | `value` coincide con uno de los presets |
| `contrast-warning` | AlertTriangle ámbar + texto advertencia debajo del picker | Ratio WCAG < 4.5:1 en runtime |
| `color-in-use` | Círculo del preset muestra punto naranja en esquina (indicador) | Color ya usado en otra config |
| `browser-unsupported` | Oculta botón "Cambiar color". Muestra mensaje de fallback. Solo paleta disponible. | `<input type="color">` no soportado |
| `hex-input-error` | Borde rojo en input hex | El valor ingresado no cumple `/^#[0-9A-Fa-f]{6}$/` |

---

## 4. Anatomía Visual (ASCII)

### Estado default (browser soporta color picker nativo)
```
  Color del turno

  ┌──────────────────────────────────────────┐
  │  ████  #2563EB        [Cambiar color]    │
  └──────────────────────────────────────────┘
       ↑                        ↑
    swatch 32px Ø        Button ghost
    color dinámico        abre <input type="color">

  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○   ← paleta de 10 colores predeterminados
  [azul actual = ✓]          24px Ø cada círculo, gap 8px
  [uno en uso = punto naranja en esquina superior derecha]
```

### Con input hex manual (accesibilidad / precisión):
```
  ┌─────────────────┐
  │ #2563EB         │  ← input text, monospace, placeholder="#000000"
  └─────────────────┘
```

### Con advertencia de contraste:
```
  ⚠  El color elegido puede dificultar la lectura
     del texto sobre la franja del turno.
     (Contraste: 3.2:1. Mínimo recomendado: 4.5:1)
```

### Browser no soportado:
```
  ┌──────────────────────────────────────────┐
  │  ████  #2563EB                           │  ← sin botón "Cambiar color"
  └──────────────────────────────────────────┘
  ○ ○ ○ ○ ○ ○ ○ ○ ○ ○

  ⓘ Tu navegador no soporta el selector de color.
    Elige un color de la paleta o ingresa un código hex.
```

---

## 5. Diseño Responsive

> Responsive: el componente no cambia estructuralmente entre breakpoints. La paleta de 10 colores puede hacer wrap si el espacio es muy estrecho (< 280px), pero en 360px caben en una sola fila.

---

## 6. Especificación de Tokens

| Propiedad CSS | Token / Valor | Nota |
|---|---|---|
| `background-color` (swatch) | `style inline: config.color` | Color dinámico del usuario |
| `border-radius` (swatch) | `50%` | Círculo |
| `border` (swatch) | `2px solid --color-border-strong` | Borde sutil para visibilidad sobre fondos claros |
| `background-color` (círculos paleta) | `style inline: presetColor` | |
| `border` (círculo activo en paleta) | `3px solid --color-interactive-primary` | Indica selección |
| `color` (texto advertencia) | `--color-feedback-warning` | |
| `color` (ícono advertencia) | `--color-feedback-warning` | `AlertTriangle` de lucide-react |
| `border-color` (input hex error) | `--color-feedback-error` | |
| `font-family` (input hex) | monospace stack | Para alineación uniforme de caracteres |
| `color` (indicador "en uso") | `#EA580C` (naranja-600) | Punto de 6px en esquina del círculo |

---

## 7. Accesibilidad

```
SEMÁNTICA:
- Swatch + botón: <button> con aria-label="Color actual: #2563EB. Abrir selector de color"
- Paleta: <div role="radiogroup" aria-label="Colores predeterminados">
- Cada círculo de paleta: <button role="radio" aria-checked={isActive} aria-label="Azul (#2563EB)">
- Input hex: <input type="text" aria-label="Código de color hexadecimal" maxLength={7}>
- Input nativo oculto: <input type="color" aria-hidden="true" tabIndex={-1}>
- Advertencia de contraste: <p role="alert" aria-live="polite">

TECLADO:
- Tab: navega swatch → paleta → input hex
- Flechas en paleta: navegan entre círculos (roving tabindex)
- Enter/Space en círculo: selecciona el color
- Enter en swatch/botón: abre el picker nativo

CONTRASTE:
- Los colores de la paleta predeterminada tienen ratio ≥ 4.5:1 con blanco (verificado en design tokens)
- Los colores ingresados manualmente se evalúan en runtime con wcag-contrast.ts
```

---

## 8. Animaciones del Componente

| Animación | Trigger | Duración | Easing |
|---|---|---|---|
| Transición del swatch al cambiar color | `onChange` | `duration-fast` | `ease-default` |
| Aparición/desaparición del warning | Cambio de `contrastWarning` | `duration-fast` | `ease-default` |

> Sin animaciones de fade de la advertencia para evitar distracciones. El cambio es inmediato con suave transición de opacidad.

---

## 9. Notas para el Developer Agent

- **Input type="color" oculto:** `<input type="color" ref={nativePickerRef} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={handleNativeColorChange}>`. Se activa con `nativePickerRef.current?.click()`.
- **Detección de soporte:** Detectar si el browser soporta `<input type="color">` creando un elemento temporal y verificando si `input.type === "color"` (no cae back a "text"). Si no soporta, setear `browserSupportsColorPicker = false` y ocultar el botón "Cambiar color".
- **Validación hex en tiempo real:** El input hex valida con `/^#[0-9A-Fa-f]{6}$/` en `onChange`. Si es válido, llama `onChange(hexValue)`. Si no, muestra error pero NO llama `onChange` (no propaga un color inválido).
- **WCAG check:** `import { getContrastRatio } from '@/core/wcag-contrast'`. Llamar con `getContrastRatio(value, '#FFFFFF')`. Si resultado < 4.5, `setContrastWarning(true)`.
- **Color "en uso":** El prop `existingColors` viene del store (lista de `config.color` de todas las configs excepto la actual). El componente muestra el indicador visual pero NO impide seleccionar ese color.
- **Paleta predeterminada:** Los 10 colores se definen como constante en el propio componente o en `src/features/config/constants.ts`. No en el store ni en el Core Engine.
- **Sincronización swatch ↔ paleta ↔ hex:** Los tres controles deben reflejar el mismo estado `value` en todo momento. Solo hay una fuente de verdad: el prop `value` controlado por el parent (`ShiftConfigForm`).
- **Seguridad:** El `value` que llega al DOM via `style inline` YA viene validado por el parent. No re-validar aquí, pero tampoco confiar en valores que vengan de fuentes externas sin pasar por el store.
