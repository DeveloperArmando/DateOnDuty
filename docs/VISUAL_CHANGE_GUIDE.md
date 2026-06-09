# Guía para Implementar Cambios Visuales — DateOnDuty

**Última actualización:** 2026-03-06

---

## Estado actual del proyecto

| Área | Estado |
|---|---|
| Core Engine (shift-calculator, url-encoder, wcag-contrast) | ✅ Completo — 90 tests |
| Stores (config-store, ui-store, theme-store) | ✅ Completo |
| App Shell (AppShell, AppBar, BottomBar, Footer, router, i18n) | ✅ Completo |
| Shared components (Button, LoadingDots, ErrorMessage, Toast, BottomSheet) | ✅ Completo |
| Feature: Calendar (MonthGrid, DayCell, DayExpandedPanel) | ✅ Completo |
| Feature: Config (ConfigPage, ConfigDetailPage, ShiftConfigForm, ColorPicker, modals) | ✅ Completo |
| Feature: Search (SearchDatePicker, SearchPage) | ✅ Completo |
| Feature: Onboarding (SwipeAnimation, ConfigBanner) | ✅ Completo |
| Feature: Sharing (SharedConfigReceiver, ShareConfigModal) | ✅ Completo |
| Feature: Feedback (FeedbackPage) | 🔴 Stub — **Fase 4 pendiente** |
| Feature: Legal (TermsPage, PrivacyPage) | 🔴 Stub — **Fase 5 pendiente** |

**Fase actual:** Implementación tardía — ~85% del MVP completo. Faltan Feedback y Legal.

---

## Cómo clasificar un cambio visual

Antes de aplicar cualquier cambio visual, hazte estas preguntas en orden:

```
¿El cambio afecta una regla de negocio o un criterio de aceptación del PRD?
        │
       SÍ ──→ [1] Consultar PRODUCT OWNER primero
        │
       NO
        │
¿El cambio afecta la arquitectura técnica (nueva librería, patrón nuevo, localStorage)?
        │
       SÍ ──→ [2] Consultar ARQUITECTO primero
        │
       NO
        │
¿El cambio afecta el diseño visual (tokens, layouts, componentes, animaciones, spec)?
        │
       SÍ ──→ [3] Consultar UX/UI DESIGNER
        │
       NO
        │
¿Es un ajuste de implementación menor dentro de la spec existente?
        │
       SÍ ──→ [4] Ir directamente al FRONTEND DEVELOPER
```

---

## Tipos de cambio y quién los atiende

### [1] Product Owner

**Agente:** `product-owner` (`.claude/agents/product-owner.agent.md`)
**Cuándo invocarlo:**

| Tipo de cambio | Ejemplo |
|---|---|
| El cambio elimina o modifica un criterio de aceptación de un User Story | "El botón debería estar disabled si el formulario está vacío" (viola RG-001) |
| Se quiere agregar o quitar una pantalla del flujo | Añadir un onboarding step nuevo |
| Hay ambigüedad sobre si algo pertenece al MVP | "¿Debería mostrar el historial de consultas?" |
| Un cambio visual implica cambiar el comportamiento del producto | Cambiar el flujo de importación de URL |

**Proceso:**
1. Describe el cambio propuesto y por qué.
2. El PO valida contra `docs/DateOnDuty_PRD_v2.md`.
3. Si aprueba y hay impacto en PRD → actualiza `docs/DOD_DECISIONS_LOG.md`.
4. Si rechaza → la propuesta se difiere a v1.1 o v2.0.

**Artefactos que pueden cambiar:** `docs/DateOnDuty_PRD_v2.md`, `docs/DOD_DECISIONS_LOG.md`.

---

### [2] Arquitecto de Software

**Agente:** `arquitecto` (`.claude/agents/arquitecto.agent.md`)
**Cuándo invocarlo:**

| Tipo de cambio | Ejemplo |
|---|---|
| Se propone una librería nueva para un efecto visual | Usar Framer Motion para animaciones (prohibido por arquitectura) |
| El cambio requiere un patrón no definido en la arquitectura | Crear un nuevo tipo de store para estado UI complejo |
| Hay duda sobre en qué capa va la lógica de un cambio visual | "¿La lógica del color dinámico va en el componente o en el store?" |
| Se propone cambiar cómo se persiste o se pasa un dato visual | Guardar el color activo en URL en lugar de localStorage |

**Proceso:**
1. Presenta la propuesta técnica con alternativas evaluadas.
2. El Arquitecto valida contra `docs/DateOnDuty_Architecture_v1.md`.
3. Decisión: Aprobada / Rechazada / Aprobada con condiciones.
4. Actualiza `docs/DOD_DECISIONS_LOG.md`.

**Reglas que el Arquitecto protege:**
- Colores dinámicos: `style={{ backgroundColor: color }}` — nunca clases Tailwind dinámicas.
- Dark mode: clase `dark` en `<html>` — nunca `prefers-color-scheme`.
- Animaciones: CSS nativo — nunca Framer Motion.
- Iconos: solo `lucide-react`.
- Sin `dangerouslySetInnerHTML`.

---

### [3] UX/UI Designer

**Agente:** `uxui-designer` (`.claude/agents/uxui-designer.agent.md`)
**Cuándo invocarlo:**

| Tipo de cambio | Ejemplo |
|---|---|
| Se detecta un problema visual que no está cubierto en la spec | Un estado de error no tiene diseño definido |
| Se quiere modificar un diseño ya especificado | Cambiar el layout de DayCell en desktop |
| Se necesita una spec para un estado no documentado | El estado vacío del calendario cuando no hay configs |
| Se quiere revisar si la implementación respeta la spec | Validar que ConfigRow coincide con `docs/design/component-specs/ConfigRow.md` |
| Se detecta un problema de contraste o accesibilidad | Un color de turno no pasa WCAG 4.5:1 |

**Proceso:**
1. Describe el problema visual detectado con contexto (pantalla, estado, dispositivo).
2. El Designer lee la spec existente en `docs/design/component-specs/` o `docs/design/wireframes/`.
3. Si hay gap en la spec → actualiza o crea el artefacto correspondiente.
4. Usa los skills disponibles: `/skill-component-spec`, `/skill-wireframe`, `/skill-animation-spec`, `/skill-design-review`.
5. La spec actualizada es el insumo para el Frontend Developer.

**Fuentes de verdad del Designer:**
```
docs/design/
├── design-tokens.md          ← tokens CSS (colores, tipografía, espaciado)
├── animation-specs.md        ← 11 animaciones con keyframes
├── i18n-namespaces.md        ← todos los strings
├── wireframes/               ← layouts de cada pantalla
└── component-specs/          ← specs de cada componente
```

**El Designer NO escribe código.** Produce specs en markdown que el Frontend Developer implementa.

---

### [4] Frontend Developer

**Agente:** `frontend-developer` (`.claude/agents/frontend-developer.agent.md`)
**Cuándo invocarlo directamente (sin pasar por otros agentes):**

| Tipo de cambio | Ejemplo |
|---|---|
| Ajuste de implementación que respeta la spec existente | Corregir un className que no coincide con el token de la spec |
| Bug visual cuya causa y solución están claras | Un margen incorrecto, un breakpoint que falla |
| Añadir una clase Tailwind faltante que ya está en la spec | Agregar `truncate` que olvidó en un componente |
| Ajuste de accesibilidad técnico menor | Agregar `aria-label` faltante |
| Cambio de un literal i18n (sin cambiar la clave) | Ajustar el texto de un botón en `locales/es/common.json` |

**Proceso:**
1. Lee la spec del componente antes de tocar el código: `docs/design/component-specs/<Componente>.md`.
2. Lee el wireframe si es una pantalla: `docs/design/wireframes/<pantalla>.md`.
3. Lee `docs/DOD_DECISIONS_LOG.md` para no re-abrir decisiones ya tomadas.
4. Implementa el cambio.
5. Corre `npm run typecheck` + `npm run lint` + `npm run test`.
6. Si la implementación requirió una decisión nueva → registra en `docs/DOD_DECISIONS_LOG.md`.

**El Developer NO toma decisiones de diseño.** Si la spec es ambigua → escala al UX/UI Designer.

---

## Matriz de decisión rápida

| Pregunta clave | Agente |
|---|---|
| ¿Esto cambia lo que el producto hace? | **Product Owner** |
| ¿Esto cambia cómo está construido técnicamente? | **Arquitecto** |
| ¿Esto cambia cómo se ve o cómo se interactúa? | **UX/UI Designer** |
| ¿Esto es una corrección dentro de lo ya especificado? | **Frontend Developer** |

---

## Flujo de aprobación según impacto

### Cambio menor (dentro de spec, sin impacto en producto ni arquitectura)

```
Frontend Developer
       ↓
Implementa → typecheck + lint + test → Commit
```

### Cambio de diseño (visual, no en spec o spec incompleta)

```
UX/UI Designer
       ↓
Actualiza spec / wireframe en docs/design/
       ↓
Frontend Developer
       ↓
Implementa → typecheck + lint + test → Commit
```

### Cambio de diseño con implicación técnica (nueva dependencia, nuevo patrón)

```
UX/UI Designer  →  Arquitecto
       ↓               ↓
   Spec lista    Aprueba/rechaza
            ↓
     Frontend Developer
            ↓
    Implementa → CI → Commit
```

### Cambio de comportamiento del producto (afecta user story o scope)

```
Product Owner
       ↓
Aprueba/rechaza → DOD_DECISIONS_LOG.md
       ↓ (si aprueba)
UX/UI Designer  →  Arquitecto (si aplica)
       ↓
Frontend Developer → QA Tester
       ↓
CI → Merge a main
```

---

## Reglas visuales no negociables (no requieren consulta — son leyes)

Estas reglas ya están aprobadas y no deben consultarse. El Frontend Developer las aplica directamente:

| Regla | Implementación obligatoria |
|---|---|
| **RG-001** | Botones de acción NUNCA con `disabled`. Validar en submit. |
| **RG-002** | Loading: `<LoadingDots />` dentro del botón. Flag `isSubmitting`. |
| **RG-003** | Async: `AbortController`, warning a 10s, timeout a 30s. |
| **RG-004** | Error de validación: scroll a `[data-error="true"]`. |
| **RG-005** | Error de red: banner global no asociado a campo. |
| **RG-006** | Overflow: clase `truncate` + atributo `title`. |
| **RG-007** | Color con contraste < 4.5:1: warning no bloqueante (WCAG 2.1). |
| **Colores dinámicos** | Siempre `style={{ backgroundColor: color }}`. Nunca Tailwind dinámico. |
| **Dark mode** | Clase `dark` en `<html>`. Nunca `prefers-color-scheme`. |
| **Iconos** | Solo `lucide-react`. Sin otras librerías de iconos. |
| **Animaciones** | CSS nativo con keyframes. Sin Framer Motion. |
| **Strings** | Siempre `t()`. Cero strings hardcodeados en JSX. |

Si una propuesta de cambio viola alguna de estas reglas, **el Arquitecto debe aprobar una excepción** antes de implementarla.

---

## Agentes disponibles en `.claude/agents/`

| Archivo | Agente | Rol en cambios visuales |
|---|---|---|
| `product-owner.agent.md` | Product Owner | Autoridad de producto — aprueba o rechaza cambios de scope |
| `arquitecto.agent.md` | Arquitecto de Software | Protege la arquitectura — evalúa nuevas dependencias y patrones |
| `uxui-designer.agent.md` | UX/UI Designer | Actualiza specs, wireframes y design tokens |
| `frontend-developer.agent.md` | Frontend Developer | Implementa el código — es el ejecutor final |
| `qa-tester.agent.md` | QA Tester | Valida que el cambio cumple criterios de aceptación |
| `devops-engineer.agent.md` | DevOps Engineer | Solo si el cambio afecta build o deploy en Cloudflare Pages |
| `LLM OPS.agent.md` | LLM OPS | Solo si el cambio afecta la definición de agentes o skills |

---

## Dónde viven los artefactos relevantes

| Artefacto | Ubicación |
|---|---|
| Requisitos del producto (US, criterios de aceptación) | `docs/DateOnDuty_PRD_v2.md` |
| Arquitectura técnica | `docs/DateOnDuty_Architecture_v1.md` |
| Historial de decisiones | `docs/DOD_DECISIONS_LOG.md` |
| Edge cases resueltos | `docs/DOD_EDGE_CASES.md` |
| Design tokens (colores, tipografía, espaciado) | `docs/design/design-tokens.md` |
| Animaciones y keyframes | `docs/design/animation-specs.md` |
| Strings i18n | `docs/design/i18n-namespaces.md` |
| Wireframes por pantalla | `docs/design/wireframes/` |
| Specs de componentes | `docs/design/component-specs/` |
| Plan de implementación general | `docs/action-plan.md` |
