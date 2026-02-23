# Componente: AppShell (Layout + AppBar + BottomBar + Footer)
**Feature:** app (raíz)
**Archivos en arquitectura:**
- `src/app/components/AppShell.tsx` — wrapper de layout
- `src/app/components/AppBar.tsx` — barra superior
- `src/app/components/BottomBar.tsx` — barra inferior sticky
- `src/app/components/Footer.tsx` — pie de página no-sticky
**US de referencia:** US-001, US-002, US-003 (estructura visible en todas las pantallas)
**Descripción:** El AppShell envuelve todas las rutas y define la estructura vertical de la app: AppBar fija en la cima, contenido principal en el centro, BottomBar sticky antes del footer, y Footer al final.
**Reutilización:** Sí — `src/app/`. Wrappea todas las rutas definidas en el router.

---

## Estructura general del layout

```
┌──────────────────────────────────────────┐  ← AppBar (position: sticky, top: 0)
│ [⚙] [‹AÑO›] [∧MES∨]          [☾] [?] │
├──────────────────────────────────────────┤
│                                          │
│   [slot: <Outlet /> — contenido de ruta]│  ← flex-1, overflow-y: auto
│                                          │
├──────────────────────────────────────────┤  ← BottomBar (position: sticky, bottom: 0)
│   [🔍 Buscar]        [← Hoy] (cond.)   │
├──────────────────────────────────────────┤
│ Términos · Privacidad    Enviar feedback │  ← Footer (no sticky)
└──────────────────────────────────────────┘
```

> El Footer solo es visible cuando el usuario hace scroll hasta el final de la página — no es sticky. En la pantalla principal (/) el contenido del calendario no genera scroll vertical normalmente, por lo que el footer puede no ser visible sin scroll. Eso es correcto y esperado.

---

## AppBar

### Descripción
Barra de navegación superior. Presente en todas las rutas. Sticky en el top (z-index alto). Contiene: botón de configuración, controles de navegación de año/mes, toggle de tema, y botón de ayuda (solo en `/`).

### Anatomía Visual (ASCII)

#### Ruta `/` (calendario)
```
┌──────────────────────────────────────────────────┐
│ [⚙️]  ‹ 2026 ›    ∧ Febrero ∨         [☾] [?]  │
└──────────────────────────────────────────────────┘
  Settings   año      mes            tema   ayuda
  24px      icon+texto icon+texto   20px   20px
  ghost btn  ghost btn ghost btn   ghost  ghost
```

#### Rutas `/config`, `/config/:id`, `/search`, `/feedback`, `/terms`, `/privacy`
```
┌──────────────────────────────────────────────────┐
│ [←]  Configuración                         [☾]  │
└──────────────────────────────────────────────────┘
  back btn   page title               tema toggle
  ChevronLeft  text-lg font-semibold    Moon/Sun
  ghost        text-primary            ghost btn
```
> Los controles de año/mes y el botón [?] NO aparecen en rutas secundarias. El botón ← navega con `navigate(-1)` (historial) o a `/` si no hay historial.

### Variantes por ruta

| Ruta | Botón izquierdo | Centro | Botón derecho 1 | Botón derecho 2 |
|---|---|---|---|---|
| `/` | `⚙` → `/config` | `‹ 2026 ›` + `∧ Mes ∨` | `☾/☀` toggle | `[?]` ayuda |
| `/config` | `←` → back | "Configuración" | `☾/☀` | — |
| `/config/:id` | `←` → back | "Nuevo turno" / "Editar turno" | `☾/☀` | — |
| `/search` | `←` → back | "Buscar fecha" | `☾/☀` | — |
| `/feedback` | `←` → back | "Enviar feedback" | `☾/☀` | — |
| `/terms` | `←` → back | "Términos y condiciones" | `☾/☀` | — |
| `/privacy` | `←` → back | "Política de privacidad" | `☾/☀` | — |

### Tokens del AppBar

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` | `--color-surface-elevated` | Ligeramente elevado sobre surface-base |
| `border-bottom` | `1px solid --color-border-default` | Separación del contenido |
| `height` | `56px` (mobile) / `64px` (desktop) | Constante compartida `DESIGN.appBarHeight` |
| `padding` | `0 16px` | |
| `z-index` | `z-[30]` | Por encima de ConfigBanner (z-[20]) y HelpOverlay |
| `position` | `sticky` / `top: 0` | Se queda fija al hacer scroll |

### Accesibilidad del AppBar

```
SEMÁNTICA:
- Elemento HTML: <header role="banner">
- Nav controles año/mes: <nav aria-label="Navegación del calendario">
- Botón ⚙: aria-label="Ir a configuración"
- Botón ‹/› año: aria-label="Año anterior" / "Año siguiente"
- Botón ∧/∨ mes: aria-label="Mes anterior" / "Mes siguiente"
- Toggle tema: aria-label="Cambiar a modo oscuro" / "Cambiar a modo claro"
- Botón [?]: aria-label="Abrir ayuda" (aria-expanded cuando está activo)
- Botón ←: aria-label="Volver"
```

---

## BottomBar

### Descripción
Barra de acciones global, sticky en la parte inferior. Siempre visible mientras el usuario interactúa con la app. Contiene el botón de búsqueda y condicionalmente el botón "Volver a hoy".

### Anatomía Visual (ASCII)

#### Con botón "Volver a hoy" (cuando viewDate ≠ mes actual)
```
┌──────────────────────────────────────────────────┐
│   [🔍  Buscar fecha]      [← Volver a hoy]      │
└──────────────────────────────────────────────────┘
  Button secondary            Button ghost
  → navigate("/search")       → ui-store.setViewDate(today)
                                + navigate("/") si no está en /
```

#### Sin botón "Volver a hoy" (cuando viewDate === mes actual)
```
┌──────────────────────────────────────────────────┐
│              [🔍  Buscar fecha]                  │
└──────────────────────────────────────────────────┘
  Centrado cuando es el único botón
```

### Tokens del BottomBar

| Propiedad CSS | Token | Nota |
|---|---|---|
| `background-color` | `--color-surface-elevated` | |
| `border-top` | `1px solid --color-border-default` | |
| `padding` | `8px 16px` | Padding vertical menor que el AppBar |
| `position` | `sticky` / `bottom: 0` | |
| `z-index` | `z-[25]` | Encima del contenido, debajo del AppBar |

### Accesibilidad del BottomBar

```
SEMÁNTICA:
- Elemento HTML: <nav aria-label="Acciones globales">
- Botón buscar: aria-label="Ir a buscar fecha"
- Botón volver hoy: aria-label="Volver al mes actual"
```

---

## Footer

### Descripción
Pie de página no sticky. Aparece al final del contenido de la página. Contiene los links de navegación legal y el link a feedback.

### Anatomía Visual (ASCII)

```
┌──────────────────────────────────────────────────┐
│  Términos  ·  Privacidad        Enviar feedback  │
└──────────────────────────────────────────────────┘
  text-xs, text-secondary          text-xs, interactive-secondary-text
  <Link to="/terms">               <Link to="/feedback">
  <Link to="/privacy">
```

### Tokens del Footer

| Propiedad CSS | Token | Nota |
|---|---|---|
| `color` (links legales) | `--color-text-secondary` | Peso visual bajo — no es acción primaria |
| `color` (link feedback) | `--color-interactive-secondary-text` | Destaca ligeramente |
| `border-top` | `1px solid --color-border-default` | |
| `padding` | `16px` | |
| `font-size` | `text-xs` | No protagonismo |

### Accesibilidad del Footer

```
SEMÁNTICA:
- Elemento HTML: <footer>
- Links: <Link> de React Router (se renderiza como <a>) con texto descriptivo
- No usar <a href> — siempre <Link to="">
```

---

## AppShell (wrapper)

### Descripción
Componente raíz que compone AppBar + Outlet + BottomBar + Footer en la estructura vertical correcta.

### Estructura JSX aproximada

```tsx
<div className="flex flex-col min-h-screen bg-surface-base">
  <AppBar />
  {/* ConfigBanner y SwipeAnimation se montan aquí condicionalmente */}
  <main className="flex-1">
    <Outlet />
  </main>
  <BottomBar />
  <Footer />
</div>
```

### Notas para el Developer Agent

- **`DESIGN.appBarHeight`:** Definir como constante en `src/shared/constants/design.ts`. Usada por ConfigBanner (para su `top`) y SwipeAnimation (para calcular el centro del área del calendario).
- **Título dinámico del AppBar:** Pasar el título como prop o via React Context / `useMatches()` de React Router 7. No hardcodear en AppBar — cada ruta define su propio título.
- **"Volver a hoy" condicional:** Comparar `ui-store.viewDate` con `startOfMonth(new Date())`. Si son iguales, no mostrar el botón. Usar `isSameMonth` de date-fns.
- **ConfigBanner y SwipeAnimation:** Se montan en AppShell (o en el componente de la ruta `/`), no dentro de AppBar. El AppShell es el lugar correcto porque necesita el espacio completo de la pantalla.
- **Footer en rutas secundarias:** El footer aparece en todas las rutas dentro del AppShell. Si en alguna ruta el footer no debe mostrarse (ej: feedback tiene su propio footer-like content), usar `useLocation()` para condicionarlo.
- **Scroll del contenido:** El `<main>` tiene `overflow-y: auto` en mobile para que el contenido (calendario, formularios) sea scrollable. AppBar y BottomBar permanecen fijos gracias a `sticky`.
