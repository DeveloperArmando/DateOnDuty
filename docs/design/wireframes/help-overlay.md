# Wireframe: Help Overlay
**Rol:** UX/UI Designer Senior
**Fecha:** Feb 2026
**Skill invocado:** /skill-wireframe help-overlay
**US de referencia:** US-009
**Artefacto:** docs/design/wireframes/help-overlay.md

---

## Descripción

El Help Overlay es un overlay contextual sobre el calendario (`/`) que se activa al tocar el botón `[?]` del top bar. Muestra tooltips numerados para cada elemento visible en pantalla, con un panel de leyenda deslizable desde la parte inferior.

**Reglas clave del PRD (US-009):**
- Solo se muestran tooltips para los elementos visibles en pantalla en ese momento.
- El botón "Volver a hoy" solo aparece fuera del mes actual — su tooltip aplica lo mismo.
- El botón `[?]` permanece accesible desde cualquier pantalla de la app.

**Alcance del overlay:** Solo aplica a la pantalla `/` (calendario). Las rutas `/config`, `/search`, `/feedback`, `/terms` y `/privacy` son pantallas enfocadas que no requieren este overlay para MVP (el [?] no está en su top bar).

---

## Estado 1: mes-actual (sin "Volver a hoy")

*Help activo mientras el usuario está en el mes actual. 7 elementos visibles con badge.*

```
/* mobile — 360px */
/* Help Overlay — mes actual */

┌──────────────────────────────────────┐
│①⚙  ②⟨ 2026 ⟩  ③∧ FEB ∨  [✕]  ④☾  │  [1]
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  [2]
│⑤ Do   Lu   Ma   Mi   Ju   Vi   Sá  │
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│   1    2    3    4    5    6    7   │
│   8    9   10   11   12   13   14  │
│  15   16   17   18   19   20   21  │
│  22◉  23   24   25   26   27   28  │
│       ⑥[████]       ⑦             │  [3]
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│      ⑧ [🔍  Buscar fecha]          │  [4]
│════════════════════════════════════│  [5]
│           ─────                    │  drag handle
│  ① Configuración                   │  [6]
│    Edita tu horario de turno        │
│                                    │
│  ② Año                             │
│    ← → Flechas o desliza horizontal│
│                                    │
│  ③ Mes                             │
│    ∧ ∨ Flechas o desliza vertical  │
│                                    │
│  ④ Tema                            │
│    Cambia entre modo claro y oscuro│
│                                    │
│  ⑤ Días                            │
│    Toca un día para ver tu turno   │
│                                    │
│  ⑥ Franja de turno                 │
│    ↑ entrada  ↓ salida  ▐ en turno │
│                                    │
│  ⑦ Badge +N                        │
│    Más configs — toca el día       │
│                                    │
│  ⑧ Buscar                          │
│    Consulta cualquier fecha        │
│                                    │
│  [  Cerrar ayuda             ]     │  [7]
└──────────────────────────────────────┘
```

**Leyenda de símbolos en el wireframe:**
- `▒▒` = overlay semitransparente oscuro cubriendo el calendario
- `[✕]` = el botón [?] ha cambiado a ✕ (cerrar) cuando el help está activo
- `①②...` = badge numerado circular flotante sobre el elemento correspondiente
- `════` = separador entre overlay y panel de leyenda

---

## Estado 2: otro-mes (con "Volver a hoy" visible)

*Help activo mientras el usuario está en un mes diferente al actual. "Volver a hoy" tiene su propio badge.*

```
/* mobile — 360px */
/* Help Overlay — mes diferente al actual */

┌──────────────────────────────────────┐
│①⚙  ②⟨ 2026 ⟩  ③∧ ENE ∨  [✕]  ④☾  │
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│⑤ Do   Lu   Ma   Mi   Ju   Vi   Sá  │
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│   1    2    3    4    5    6    7   │
│   8    9   10   11   12   13   14  │
│  15   16   17   18   19   20   21  │
│  22   23   24   25   26   27   28  │
│  29   30   31                      │
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│ ⑧[🔍 Buscar]  ⑨[↩ Volver a hoy]   │  [8]
│════════════════════════════════════│
│           ─────                    │
│  ① - ⑧  (mismos que Estado 1)     │
│                                    │
│  ⑨ Volver a hoy                    │  [9]
│    Regresa al mes actual           │
│                                    │
│  [  Cerrar ayuda             ]     │
└──────────────────────────────────────┘
```

---

## Variante Desktop (1280px)

```
/* desktop — 1280px */
/* El panel de leyenda se muestra como sidebar derecho, no como bottom sheet */

┌──────────────────────────────────────────────────────────────────────┐
│①⚙    ②⟨ 2026 ⟩    ③∧ FEB ∨         [✕]  ④☾                        │
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│⑤ Do    Lu    Ma    Mi    Ju    Vi    Sá  │  ┌───────────────────┐  │
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  │                   │  │
│   1     2     3     4     5     6     7   │  │ ① Configuración   │  │
│   8     9    10    11    12    13    14   │  │   Edita tu horario│  │
│  15    16    17    18    19    20    21   │  │                   │  │
│  22◉   23    24    25    26    27    28   │  │ ② Año             │  │
│         ⑥[████]      ⑦                  │  │   ← → o desliza   │  │
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  │                   │  │
│              ⑧ [🔍  Buscar fecha]        │  │ ③ Mes ∧ ∨ o desl. │  │
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  │ ④ Tema claro/osc. │  │
│                                          │  │ ⑤ Días → detalle  │  │
│                                          │  │ ⑥ Franja de turno │  │
│                                          │  │ ⑦ Badge +N        │  │
│                                          │  │ ⑧ Buscar fechas   │  │
│                                          │  │                   │  │
│                                          │  │ [Cerrar ayuda]    │  │
│                                          │  └───────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

> En desktop el panel de leyenda es un sidebar flotante a la derecha del calendario (max-w-xs, posición fija). No es un bottom sheet. El overlay semitransparente cubre el calendario pero no el sidebar.

---

## Anotaciones

**[1] — Botón [?] se convierte en [✕] al abrir el help**
- El botón `[?]` en el top bar tiene dos estados:
  - Estado normal: icono `HelpCircle` de lucide-react, `aria-label="Abrir ayuda"`.
  - Estado help-activo: icono `X` de lucide-react, `aria-label="Cerrar ayuda"`.
- Al tocar [✕] = cerrar el overlay. Mismo efecto que el botón "Cerrar ayuda" [7].
- El botón ocupa el mismo espacio en ambos estados — sin layout shift.

**[2] — Overlay semitransparente**
- `bg-surface-overlay` (`rgba(0,0,0,0.45)` en claro, `rgba(0,0,0,0.70)` en oscuro).
- Posición: `fixed inset-0 z-40`. Cubre todo el viewport.
- El top bar y la bottom bar quedan encima del overlay (z-index más alto) para que los badges sean visibles y los elementos sean reconocibles.
- Tap en el overlay (fuera del panel de leyenda): cierra el help.

**[3] — Badges numerados ①②... (posicionamiento)**
- Cada badge es un `<span>` circular, 20×20px, `bg-interactive-primary text-white text-xs font-bold rounded-full`.
- Posición: `absolute` relativo al elemento que describe. Offset pequeño para no obstruir el elemento.
  - ① ⚙: esquina superior derecha del ícono
  - ② ⟨ AÑO ⟩: sobre el año (entre las dos flechas)
  - ③ ∧ MES ∨: sobre el mes
  - ④ ☾: sobre el ícono de tema
  - ⑤ Headers de días: sobre la fila "Do Lu Ma..."
  - ⑥ Primera franja de turno visible: sobre la franja
  - ⑦ Badge +N (si hay overflow de configs): sobre el badge +N (si no hay, ⑦ no aparece)
  - ⑧ Botón Buscar: sobre el botón
  - ⑨ Botón Volver a hoy (solo si visible): sobre el botón
- `aria-hidden="true"` en los badges — son decorativos (el panel de leyenda [6] es el contenido accesible).

**[4] — Sticky bottom bar con badges**
- La bottom bar (con [🔍 Buscar] y opcionalmente [↩ Volver a hoy]) tiene z-index superior al overlay.
- Los badges correspondientes (⑧, ⑨) se posicionan encima de los botones.

**[5] — Panel de leyenda (bottom sheet en mobile)**
- Se desliza desde la parte inferior: `translateY(100%) → 0`, `duration-normal`, `ease-default`.
- Altura: variable según cantidad de elementos (aprox. 50-55% del viewport).
- `bg-surface-elevated rounded-t-xl shadow-lg`.
- Drag handle en la parte superior (misma convención que day-expanded y kebab menú).
- Scroll interno si el contenido supera la altura del panel.
- `role="dialog"`, `aria-modal="true"`, `aria-label="Ayuda — guía de elementos"`.
- Focus trap: Tab cicla entre los items del panel y el botón "Cerrar ayuda".

**[6] — Items del panel de leyenda**
- Cada item: badge numerado (mismo estilo que [3]) + nombre del elemento en `text-sm font-semibold text-text-primary` + descripción en `text-xs text-text-secondary`.
- Separación vertical: `gap-3` entre items.
- El badge en el panel es decorativo (ya es visible en la pantalla).
- Los items del panel se generan dinámicamente según los elementos visibles en pantalla.
  - ⑦ Badge +N: solo aparece en el panel si hay al menos una celda con overflow en el mes actual.
  - ⑨ Volver a hoy: solo aparece si el usuario está en un mes diferente al actual.

**[7] — Botón "Cerrar ayuda"**
- Botón primario en la parte inferior del panel.
- Al tocar: cierra el panel con animación `translateY(0) → 100%` + fade del overlay.
- `aria-label="Cerrar ayuda"`.
- Recibe el foco automáticamente al abrir el panel (primer elemento del focus trap).

**[8] — Estado: otro mes — bottom bar con "Volver a hoy"**
- Ambos botones reciben badge: ⑧ para Buscar, ⑨ para Volver a hoy.
- El panel de leyenda añade el ítem ⑨ al final.
- El número ⑦ (Badge +N) sigue siendo condicional.

**[9] — Ítem ⑨ en la leyenda (Volver a hoy)**
- Solo visible cuando el usuario está en un mes diferente al actual y el botón [↩ Volver a hoy] está en pantalla.
- Texto: "Volver a hoy — Regresa al mes actual del calendario".

---

## Comportamiento de apertura/cierre

```
Tap [?]
  │
  ├── Si help CERRADO:
  │     - Renderizar badges sobre cada elemento visible
  │     - Mostrar overlay (fade-in, duration-fast)
  │     - Deslizar panel desde abajo (duration-normal)
  │     - [?] se convierte en [✕]
  │     - Foco va al botón "Cerrar ayuda"
  │
  └── Si help ABIERTO:
        - Ocultar overlay (fade-out)
        - Deslizar panel hacia abajo (duration-normal)
        - [✕] se convierte en [?]
        - Foco regresa al botón [?]

Tap en overlay (fuera del panel):
  - Cierra igual que tap en [✕]

Escape (teclado):
  - Cierra igual que tap en [✕]
```

---

## Elementos y sus descripciones (tabla completa)

| Badge | Elemento | Siempre visible | Descripción en panel |
|---|---|---|---|
| ① | ⚙ Configuración | Sí | "Edita tu horario de turno y preferencias" |
| ② | ⟨ AÑO ⟩ | Sí | "Usa las flechas o desliza horizontal para cambiar de año" |
| ③ | ∧ MES ∨ | Sí | "Usa las flechas o desliza vertical para cambiar de mes" |
| ④ | ☾ Tema | Sí | "Cambia entre modo claro y oscuro" |
| ⑤ | Grid del calendario | Sí | "Toca cualquier día para ver el detalle de tus turnos" |
| ⑥ | Franja de turno | Condicional* | "↑ Entrada al turno · ↓ Salida · Bloque lleno = en turno ese día" |
| ⑦ | Badge +N | Condicional** | "Hay más configuraciones activas — toca el día para verlas todas" |
| ⑧ | [🔍 Buscar] | Sí | "Consulta cualquier fecha sin navegar mes a mes" |
| ⑨ | [↩ Volver a hoy] | Solo fuera del mes actual | "Regresa al mes actual del calendario" |

*⑥ Solo si hay al menos una config activa (hay franjas en el mes visible). Si el mes está completamente vacío de turnos, no aparece.

**⑦ Solo si hay al menos una celda del mes visible con overflow (+N badge).

---

## Estados cubiertos

| Estado | Wireframe |
|---|---|
| ✅ `mes-actual` (7 items en panel, sin ⑨) | Estado 1 |
| ✅ `otro-mes` (8 items en panel, con ⑨) | Estado 2 |
| ✅ Desktop (sidebar derecho en lugar de bottom sheet) | Variante desktop |
| — `mes-sin-turnos` | No dibujado — ⑥ y ⑦ ausentes, 5-6 items en panel. Misma estructura. |
| — `durante-onboarding` | No dibujado — si el help se activa mientras ConfigBanner y/o SwipeAnimation están activos, los badges de onboarding no reciben número (son temporales). La SwipeAnimation es `aria-hidden`. |

---

## Notas de Accesibilidad

```
A11Y:

OVERLAY:
- role="presentation" en el div del overlay semitransparente.
- Tap en overlay cierra el help. El overlay tiene un aria-label invisible o es aria-hidden
  ya que la acción de cerrar está disponible en el botón [✕] y en "Cerrar ayuda".

PANEL DE LEYENDA (BOTTOM SHEET):
- role="dialog", aria-modal="true", aria-label="Guía de ayuda".
- Focus trap: Tab cicla entre el drag handle (si es focusable), los items y el botón Cerrar.
- Primer foco al abrir: botón "Cerrar ayuda" (acción clara para el usuario que quiere salir).
- Escape cierra el overlay.

BADGES NUMERADOS:
- aria-hidden="true" — son elementos decorativos que complementan el panel de texto.
- La información completa está en el panel de leyenda, accesible por screen reader.

BOTÓN [?] / [✕]:
- aria-label="Abrir ayuda" / "Cerrar ayuda" según estado.
- aria-expanded="false" / "true" según estado del overlay.
- aria-controls="[id del panel de leyenda]".

ANUNCIO DE APERTURA:
- Al abrir el panel: aria-live="polite" anuncia "Ayuda activada. 8 elementos explicados."
  (o el número dinámico de items).
- Esto orienta al usuario de screen reader sobre el contenido antes de navegar.

NAVEGACIÓN POR TECLADO DENTRO DEL PANEL:
- Los items de la leyenda son texto estático (no interactivos).
- Solo el botón "Cerrar ayuda" es interactivo dentro del panel.
- Tab order dentro del panel: drag handle (si focusable) → botón Cerrar.
```

---

## Verificación PRD

| Criterio | US | Estado |
|---|---|---|
| Botón de ayuda accesible desde el calendario | US-009 | ✅ [?] en top bar del calendario |
| Tooltips/mensajes para cada elemento visible | US-009 | ✅ Badges + panel de leyenda |
| No mostrar tooltip de elementos no visibles | US-009 | ✅ ⑦ y ⑨ son condicionales, tabla completa |
| Ayuda accesible desde cualquier pantalla | US-009 | ✅ (aclaración: [?] está en el top bar del calendario; las demás pantallas tienen un top bar simplificado sin [?] — ver Design Review) |

---

## Design Review: Help Overlay

**Fecha de revisión:** Feb 2026
**Revisado por:** UX/UI Designer Agent
**Resultado:** ⚠️ Aprobado con observaciones

---

### Issues encontrados

#### 🔴 Bloqueantes
Sin issues bloqueantes.

#### 🟡 Importantes

- **[HO-001]** El PRD dice "botón de ayuda accesible desde cualquier pantalla", pero el [?] está diseñado solo en el top bar del calendario (`/`). Las pantallas de `/config`, `/search`, `/feedback`, `/terms` y `/privacy` no incluyen [?] en sus top bars.
  - **Qué viola:** US-009 criterio: "Existe un botón de ayuda accesible desde cualquier pantalla."
  - **Corrección sugerida para MVP:** Definir que el botón [?] aplica solo al calendario (`/`) ya que es la pantalla principal y donde el onboarding ocurre. Las demás pantallas son formularios o listas con UX estándar que no requieren explicación contextual. Documentar la decisión para el PO — si quieren [?] en todas las pantallas, requiere diseñar los tooltips para cada pantalla adicional.
  - **Decisión:** Restringir a `/` para MVP con nota al PO. Esto simplifica significativamente la implementación sin impacto real en el UX (las demás pantallas son self-explanatory).

#### 🟢 Sugerencias

- **[HO-002]** El help overlay podría implementarse como una guía paso a paso (sequential walkthrough) en lugar de mostrar todos los tooltips simultáneamente.
  - **Beneficio:** Más enfocado, el usuario presta atención a un elemento a la vez.
  - **Decisión:** Descartado para MVP. El approach simultáneo es más rápido de usar para usuarios recurrentes (no tienen que hacer clic N veces para cerrar). El sequential walkthrough podría añadirse como alternativa en v1.1.

---

### Resumen
- Bloqueantes: 0
- Importantes: 1 (alcance de [?] restringido a `/` para MVP — documentado para PO)
- Sugerencias: 1 (descartada)
- **Próximo paso:** Puede avanzar a desarrollo.

---

*Todos los wireframes de pantallas han sido completados.*
*Siguientes artefactos opcionales: Component Specs y Animation Specs.*
