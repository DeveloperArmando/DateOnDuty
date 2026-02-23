# DateOnDuty — Decisions Log

Formato de cada entrada: **Fecha | Rol | Decisión | Razonamiento | Impacto en otros agentes**

---

## Decisiones de Producto (Product Owner)

| Fecha | Rol | Decisión | Razonamiento | Impacto en otros agentes |
|---|---|---|---|---|
| Feb 2026 | PO | MVP es frontend-only, sin backend. localStorage como única persistencia. | Velocidad de lanzamiento. El usuario no necesita cuenta para el valor central del producto. | Arquitecto: sin API layer. Developer: sin fetch excepto Formspree. |
| Feb 2026 | PO | Plataforma: web responsive únicamente. PWA, Android e iOS movidos a v3.0. | Reducir alcance del MVP. Navegador cubre >95% del caso de uso inmediato. | UX/UI: mobile-first pero sin manifest ni service worker. |
| Feb 2026 | PO | Autenticación movida a v2.0. El MVP no requiere registro para ninguna función. | El valor del producto (consultar turnos) no requiere identidad. Reducir fricción de adopción. | UX/UI: sin pantallas de login/registro. Developer: sin auth guards. |
| Feb 2026 | PO | Compartir configuración via URL con parámetro `?cfg=` en Base64. Sin backend. | Permite compartir sin cuenta ni servidor. Limitación aceptada: el link es estático. | Arquitecto: encoder/decoder en Core Engine. UX/UI: modal de importación en `/`. |
| Feb 2026 | PO | Esquemas predeterminados: 24x48, 12x36, 48x48. Personalizado: 12–72h trabajo, 12–72h descanso, solo enteros. | Cubren >90% de los esquemas reales en México/LATAM. Personalizado cubre el resto. | UX/UI: selector de esquema con 3 opciones + modo personalizado. |
| Feb 2026 | PO | Máximo 10 configuraciones adicionales (+ 1 default = 11 total). | Límite razonable para localStorage y visualización en calendario. | Developer: validar en store. UX/UI: estado de límite alcanzado. |
| Feb 2026 | PO | La configuración default no puede eliminarse ni desactivarse. Siempre es "Mi turno". | Siempre debe existir al menos una configuración activa. Simplifica lógica de estados vacíos. | Developer: validar en store. UX/UI: no mostrar controles de eliminar/desactivar en default. |
| Feb 2026 | PO | Feedback vía Formspree en MVP. Cooldown de 1 minuto entre envíos. | Sin backend propio. Formspree cubre el caso de uso sin infraestructura. | Developer: VITE_FORMSPREE_ID como env var. UX/UI: estado de cooldown con countdown. |
| Feb 2026 | PO | Onboarding: animación + banner simultáneos, 50 segundos, flag guardado al completarse (no al aparecer). | No bloquear el uso inmediato. Si el usuario cierra antes de 50s, se repite. | UX/UI: diseñar para convivencia simultánea de animación y banner. Developer: setTimeout de 50s con cleanup. |
| Feb 2026 | PO | Páginas legales (Términos + Privacidad) son bloqueantes para lanzamiento (US-014). | Requisito legal mínimo para operar en México (LFPDPPP). | UX/UI: contemplar footer con links legales en todas las pantallas. |
| Feb 2026 | PO | Cálculos en horas absolutas. Sin ajuste por horario de verano en MVP. | Simplicidad. DST afecta a <1% de los cálculos y el error es de 1 hora. Documentado como limitación conocida. | Arquitecto: la firma del Core Engine debe permitir `timezone?` como parámetro futuro. |
| Feb 2026 | PO | Primer día de la semana: domingo por defecto, configurable a lunes. Solo esas dos opciones. | Domingo es el estándar en México. Lunes cubre preferencias regionales de LATAM. | UX/UI: toggle domingo/lunes en configuración. |

---

## Decisiones de Arquitectura (Arquitecto de Software)

| Fecha | Rol | Decisión | Razonamiento | Impacto en otros agentes |
|---|---|---|---|---|
| Feb 2026 | Arquitecto | Stack frontend: React 19 + TypeScript 5 + Vite 6. | LLM-friendliness como criterio dominante. React tiene el mayor corpus de entrenamiento. Vite es build tool nativo para SPA sin complejidad de SSR. | Developer: todo el código en React + TS estricto. |
| Feb 2026 | Arquitecto | Estilos: Tailwind CSS 4. Dark mode via clase `dark` en `<html>`. | Utility-first simplifica generación de UI por IA. Dark mode integrado sin CSS custom. | UX/UI: specs en clases Tailwind. Colores de turno dinámicos van en `style` inline, no en clases Tailwind. |
| Feb 2026 | Arquitecto | Estado global: Zustand 5 con middleware `persist`. | API mínima. Sin boilerplate. Persist integrado para localStorage. Redux es excesivo para la complejidad del MVP. | Developer: tres stores independientes: config-store, theme-store, ui-store. |
| Feb 2026 | Arquitecto | Fechas: date-fns 4 (imports individuales). Prohibido Moment, dayjs, Luxon. | Tree-shakeable. Funciones puras. Soporte de locales para i18n futuro. | Developer: `import { addMonths } from "date-fns"`, nunca `import * as`. |
| Feb 2026 | Arquitecto | Routing: React Router 7 con `createBrowserRouter`. | Estándar para SPA. Necesario para `useSearchParams` (parámetro `?cfg=`). | UX/UI: 7 rutas + 4 overlays definidos. Developer: lazy load en todas las rutas excepto `/`. |
| Feb 2026 | Arquitecto | i18n: react-i18next. Solo locale `es` en MVP. | Permite preparar arquitectura de textos sin implementar múltiples idiomas. Cero strings hardcodeados en JSX. | Developer: 6 namespaces JSON en `src/i18n/locales/es/`. UX/UI: los textos en specs son las keys de traducción. |
| Feb 2026 | Arquitecto | Gestos: @use-gesture/react. Umbral: 50px + velocidad 0.3. | Librería ligera, bien documentada, compatible con React 19. | UX/UI: diseñar controles de botón como alternativa a gestos para desktop/accesibilidad. |
| Feb 2026 | Arquitecto | Testing: Vitest + React Testing Library. Sin Jest, sin Cypress en MVP. | Integración nativa con Vite. Testing orientado a comportamiento de usuario. E2E se agrega en v2.0. | Developer: cada archivo en `core/` tiene su `.test.ts` al lado. |
| Feb 2026 | Arquitecto | Patrón arquitectónico: SPA monolítica con Feature-Sliced (feature slices). Tres capas: UI → State → Core. | Simplicidad suficiente para MVP. El Core Engine es puro (sin React, sin DOM, sin localStorage). | Developer: los componentes no calculan turnos directamente; pasan por el store que invoca al Core. |
| Feb 2026 | Arquitecto | localStorage: 4 keys con prefijo `dod-`. `dod-configs`, `dod-preferences`, `dod-onboarding`, `dod-feedback-cooldown`. | Prefijo evita colisiones. Separación por dominio de datos. | Developer: `dod-onboarding` y `dod-feedback-cooldown` se leen/escriben directo, no via Zustand persist. |
| Feb 2026 | Arquitecto | URL sharing: `btoa(JSON.stringify({ s, e, d, c }))`. Parámetro `?cfg=`. Custom scheme: `"C{work}:{rest}"`. | Base64 nativo del navegador. Payload mínimo (~100 chars). Opaco por diseño. | Developer: validar TODOS los campos al decodificar con try/catch. UX/UI: modal de importación en `/`. |
| Feb 2026 | Arquitecto | Iconos: exclusivamente `lucide-react`. | Tree-shakeable. Consistente. Compatible con Tailwind. | UX/UI: no usar Font Awesome ni SVGs externos. |
| Feb 2026 | Arquitecto | Seguridad: sin `dangerouslySetInnerHTML`. Colores hex validados con `/^#[0-9A-Fa-f]{6}$/`. | Prevenir XSS. Los colores del usuario se aplican al DOM vía `style` inline. | Developer: validar colores antes de aplicar. `VITE_FORMSPREE_ID` como variable de entorno en Cloudflare Pages. |
| Feb 2026 | Arquitecto | Hosting: Cloudflare Pages. Deploy automático desde `main`. Variables de entorno configuradas en Cloudflare, no en el repo. | Sitio estático. CDN global. Integración nativa con GitHub. | DevOps: pipeline CI: lint → format:check → typecheck → test antes de merge. |
| Feb 2026 | Arquitecto | Algoritmo de turno: aritmética de módulo. `moduloPositivo(a,b) = ((a % b) + b) % b`. Sin iteración desde el origen. | O(1) para cualquier fecha, sin importar distancia temporal. Soporta fechas antes del origen. | Developer: función pura en `core/shift-calculator/shift-calculator.ts`. |

---

## Decisiones de Proceso (Claude Code / Sesión actual)

| Fecha | Rol | Decisión | Razonamiento | Impacto en otros agentes |
|---|---|---|---|---|
| Feb 2026 | Claude Code | Creado `CLAUDE.md` en raíz del proyecto como guía de contexto para instancias futuras de Claude Code. | El proyecto usa agentes de IA como equipo principal. El CLAUDE.md reduce el tiempo de onboarding de cada sesión. | Todos los agentes: leer CLAUDE.md y este log al inicio de cada sesión. |
| Feb 2026 | Claude Code | Creado `DOD_DECISIONS_LOG.md` con regla de actualización inmediata (no al final de sesión) y formato de handoff. | Garantizar continuidad de contexto entre agentes y sesiones. | Todos los agentes: actualizar este log antes de hacer handoff. |

---

## Handoff para UX/UI Designer

**Fecha:** Feb 2026
**De:** Claude Code (sesión de planificación inicial)
**Para:** Agente UX/UI Designer

### Estado del proyecto al momento del handoff

El proyecto tiene definidos y aprobados:
- **PRD v2.0** (`docs/DateOnDuty_PRD_v2.md`) — requisitos completos con user stories, criterios de aceptación y casos edge para todas las épicas.
- **Arquitectura v1.0** (`docs/DateOnDuty_Architecture_v1.md`) — stack, estructura de proyecto, esquema de datos, algoritmo de turno, reglas de UI (RG-001 a RG-007).
- **CLAUDE.md** (raíz) — reglas consolidadas para agentes de implementación.
- **DOD_DECISIONS_LOG.md** (este archivo) — historial de decisiones.

**No existe aún:** ningún archivo de código, ningún design system, ningún wireframe.

### Lo que el UX/UI Designer debe entregar primero

Seguir el orden recomendado en `agents/AGENTE UXUI DESIGNER.md`:
1. **Design system** (tokens: colores light/dark, tipografía, espaciado, radios, sombras, transiciones) — formato: CSS custom properties + extensión Tailwind config.
2. **Calendario principal** (`/`) — pantalla más compleja y de mayor uso. Incluir: estado sin configuración (primera vez), estado con 1 config activa, estado con múltiples configs, estado con configs desbordadas en día.
3. Continuar en el orden definido en el agente.

### Restricciones que el UX/UI Designer debe tener presentes

- Los colores de turno son **siempre dinámicos** (elegidos por el usuario). No proponer colores fijos para turnos. El diseño debe funcionar con cualquier hex.
- Dark mode: clase `dark` en `<html>`. **El usuario lo activa manualmente.** Default: modo claro. Sin detección automática de preferencia del sistema.
- Iconos: **solo `lucide-react`**.
- Gestos de swipe (vertical = meses, horizontal = años) deben tener **equivalente en botones** para desktop y accesibilidad.
- Colores de turno van en `style` inline, **no en clases Tailwind dinámicas**.
- La configuración default (Mi turno) no tiene controles de eliminar ni desactivar en la UI.
- El onboarding (animación + banner) son **simultáneos** y duran 50 segundos. No se muestran dos veces si el usuario esperó los 50 segundos.

### Preguntas abiertas que el UX/UI Designer debe definir

1. ¿Qué animación usa el onboarding para ilustrar los gestos de swipe? (El comportamiento de desaparición de la animación es responsabilidad del UX/UI según el PRD.)
2. ¿Cómo se visualiza el gradiente de color en los días del calendario? (El PRD especifica "más intenso al inicio del bloque, más tenue al final", pero la implementación visual exacta queda al criterio del diseñador.)
3. ¿Cuántas configuraciones caben visualmente en un bloque de día en mobile 360px antes de mostrar el indicador de desbordamiento?
4. ¿Cuál es la paleta predeterminada de colores para configuraciones de turno? (El usuario puede cambiarla, pero debe haber un set de colores iniciales bien contrastados para light y dark mode.)
