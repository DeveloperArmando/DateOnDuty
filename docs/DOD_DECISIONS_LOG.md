# DateOnDuty — Decisions Log

**Proyecto:** DateOnDuty
**Última actualización:** Noviembre 2026
**Propósito:** Registro único de todas las decisiones del proyecto. Cualquier agente o persona que vaya a implementar algo debe leer este archivo antes de proponer alternativas — las decisiones aquí documentadas **no se reabren sin justificación explícita del Product Owner**.

---

## CÓMO AÑADIR UNA DECISIÓN

Añadir al final de la sección correspondiente. Formato obligatorio:

```
### D-XXX — Título corto
**Decisión:** Qué se decidió.
**Alternativas:** Qué más se evaluó (puede ser "ninguna documentada").
**Razón:** Por qué se eligió esta opción.
**Consecuencias:** Qué implica para implementación, diseño u otros agentes.
```

Incrementar el número de la última entrada. No reordenar entradas existentes.

---

## SECCIÓN 1 — Producto y Negocio

### D-001 — MVP sin backend
**Decisión:** v1.0 es frontend puro. Sin servidor, sin base de datos, sin autenticación.
**Alternativas:** Firebase, Supabase, backend propio Express/Node.
**Razón:** Reduce tiempo de lanzamiento. El valor central (cálculo de turnos) no requiere persistencia en nube. Minimiza costos operativos en la etapa de validación de mercado.
**Consecuencias:** Todo vive en localStorage. Al borrar caché se pierden los datos. La sincronización entre dispositivos llega en v2.0.

---

### D-002 — Compartir configuración por URL (sin cuenta)
**Decisión:** El mecanismo de compartir codifica los datos en la URL con Base64 (`?cfg=`). Payload: `{ s, e, d, c }`. Sin backend, sin short URLs, sin QR.
**Alternativas:** Firebase Dynamic Links, short URL con backend, QR code.
**Razón:** Coherente con el principio de "sin backend en MVP". Zero dependencias externas adicionales. `btoa`/`atob` son nativos del navegador.
**Consecuencias:** El link es estático (no refleja cambios posteriores). Solo se comparte una configuración a la vez. Validar TODOS los campos al decodificar con try/catch. Limpiar URL con `navigate("/", { replace: true })` tras procesar.

---

### D-003 — Onboarding: flag guardado al terminar, no al ver
**Decisión:** El flag de onboarding se guarda en localStorage después de 50 segundos de permanencia, no cuando aparece. Si el usuario cierra antes, se muestra de nuevo.
**Alternativas:** Guardar al aparecer, guardar al hacer click en cualquier lugar.
**Razón:** El objetivo del onboarding es que el usuario *vea* los gestos. Guardarlo al aparecer frustraría ese objetivo si el usuario cierra inmediatamente.
**Consecuencias:** Implementar con `setTimeout` de 50s + cleanup en `useEffect` para no guardar si el componente se desmonta antes.

---

### D-004 — Cooldown de feedback: client-side, se resetea al recargar
**Decisión:** El cooldown de 1 minuto entre envíos de feedback se guarda en localStorage y se pierde al recargar.
**Alternativas:** Cooldown persistente que sobreviva recargas, cooldown en servidor.
**Razón:** El cooldown es una medida de UX (evitar spam accidental), no de seguridad. Formspree tiene sus propias protecciones anti-spam. Implementar un cooldown resistente agrega complejidad sin beneficio real en MVP.
**Consecuencias:** Un usuario puede saltear el cooldown recargando la página. Limitación conocida y aceptada.

---

### D-005 — Configuración default: no se puede eliminar ni desactivar
**Decisión:** La configuración default ("Mi turno") siempre existe y siempre está activa.
**Alternativas:** Permitir eliminar si hay otra configuración activa.
**Razón:** Simplifica la lógica de la app (siempre hay al menos una config activa). Evita el estado vacío de "sin configuraciones activas" que complicaría el calendario.
**Consecuencias:** El usuario siempre ve al menos un turno en el calendario. No mostrar controles de eliminar/desactivar en la config default. Para "limpiar" la app debe modificar la config default, no eliminarla.

---

### D-006 — Hora de entrada: solo horas completas o medias horas
**Decisión:** `entryTime` acepta únicamente valores como `08:00` o `08:30`. No se permiten `08:15`, `08:45`, etc.
**Alternativas:** Cualquier hora con granularidad de 5 minutos, solo horas completas.
**Razón:** Los turnos industriales en México/LATAM típicamente inician a horas o medias horas. Simplifica el input y reduce errores de configuración.
**Consecuencias:** Validar en el formulario de config. Granularidad de 30 minutos es suficiente para el 99% de los casos de uso. Usuarios con turnos en cuartos de hora no pueden configurarlos exactamente — limitación documentada.

---

### D-007 — Horas absolutas para cálculo de turnos (sin zonas horarias en MVP)
**Decisión:** El cálculo de turnos usa horas nominales (1 día = 24 horas siempre). No se consulta la zona horaria del dispositivo ni se ajusta por horario de verano.
**Alternativas:** Usar `Intl.DateTimeFormat` y `Date.getTimezoneOffset()` para ajustar.
**Razón:** El 99% de los trabajadores objetivo están en la misma zona horaria. Los esquemas de turno (24h, 48h) son en horas nominales, no en horas de reloj. El soporte de zonas horarias se agrega en v3.0 sin romper la interfaz del Core Engine.
**Consecuencias:** Calcular con fechas UTC en el Core Engine (`new Date(\`${date}T${time}:00Z\``). En días con cambio de horario, el cálculo puede diferir en 1 hora — riesgo bajo y aceptado.

---

### D-022 — Plataforma: web responsive únicamente
**Decisión:** MVP es una web app responsive. Sin PWA, sin app nativa Android/iOS.
**Alternativas:** PWA con manifest + service worker, React Native.
**Razón:** Reducir alcance del MVP. El navegador cubre >95% del caso de uso inmediato.
**Consecuencias:** UX/UI: mobile-first pero sin manifest ni service worker. Sin instalación desde tiendas. PWA/native movidos a v3.0.

---

### D-023 — Autenticación movida a v2.0
**Decisión:** El MVP no requiere registro ni login para ninguna función.
**Alternativas:** Auth desde v1.0 para sincronización entre dispositivos.
**Razón:** El valor central del producto (consultar turnos) no requiere identidad. Reducir fricción de adopción en etapa de validación.
**Consecuencias:** Sin pantallas de login/registro. Sin auth guards en rutas. Sin sesiones. La sincronización entre dispositivos llega con la cuenta en v2.0.

---

### D-024 — Esquemas de turno predeterminados y límites
**Decisión:** Tres presets: 24x48, 12x36, 48x48. Esquema personalizado: mínimo 12h, máximo 72h para trabajo y descanso. Solo números enteros.
**Alternativas:** Rango libre sin límite, granularidad de 0.5h.
**Razón:** Los tres presets cubren >90% de los esquemas reales en México/LATAM. Los límites (12–72h) evitan configuraciones absurdas sin restringir casos legítimos.
**Consecuencias:** Validar en formulario de config. Rechazar decimales. `custom` scheme almacenado como `{ type: "custom", workHours: number, restHours: number }`.

---

### D-025 — Límite de 10 configuraciones adicionales
**Decisión:** Máximo 10 configuraciones adicionales (+ 1 default = 11 total).
**Alternativas:** Sin límite, límite de 5.
**Razón:** Límite razonable para localStorage y para la visualización en el calendario. Más de 10 adicionales degradaría la legibilidad visual.
**Consecuencias:** Validar en el store al agregar. UX/UI: mostrar estado de límite alcanzado. CE-51 define el comportamiento al recibir un link cuando el límite está lleno.

---

### D-026 — Páginas legales: bloqueantes para lanzamiento
**Decisión:** Términos y Condiciones + Política de Privacidad son requisitos de lanzamiento (US-014). Sin ellas no se publica.
**Alternativas:** Publicar sin legales y agregar después.
**Razón:** Requisito legal mínimo para operar en México (LFPDPPP). El riesgo regulatorio supera el beneficio de lanzar antes.
**Consecuencias:** Footer con links legales en todas las pantallas. Rutas `/terms` y `/privacy` deben existir antes del deploy a producción.

---

### D-027 — Primer día de la semana: domingo por defecto, configurable a lunes
**Decisión:** El calendario inicia en domingo por defecto. El usuario puede cambiarlo a lunes. Solo esas dos opciones.
**Alternativas:** Detectar configuración del sistema operativo, soportar cualquier día.
**Razón:** Domingo es el estándar en México. Lunes cubre preferencias regionales de LATAM. Soportar otros días no agrega valor para el mercado objetivo.
**Consecuencias:** Guardado en `dod-preferences` vía `theme-store`. UX/UI: toggle domingo/lunes en configuración de preferencias.

---

## SECCIÓN 2 — Arquitectura Técnica

### D-008 — React sobre Angular
**Decisión:** Frontend en React 19 con TypeScript.
**Alternativas:** Angular (experiencia del equipo humano), Vue 3, Svelte.
**Razón:** El desarrollo es realizado principalmente por agentes de IA (Claude). El criterio dominante es LLM-friendliness: React tiene el mayor corpus de entrenamiento, Claude genera React con mayor precisión y consistencia que Angular.
**Consecuencias:** El equipo humano (con experiencia en Angular) tendrá una curva de aprendizaje, pero el código generado por IA será más limpio y consistente.

---

### D-009 — Vite sobre Next.js
**Decisión:** Build tool: Vite 6. Sin Next.js ni ningún framework con SSR.
**Alternativas:** Next.js (popular en React), Create React App (deprecado).
**Razón:** DateOnDuty es un SPA frontend puro. Next.js introduce Server Components, hydration y complejidad de servidor innecesaria para este caso de uso.
**Consecuencias:** Sin SSR, sin SSG, sin API routes. Todo en el cliente. Deploy como sitio estático en Cloudflare Pages.

---

### D-010 — Zustand sobre Redux
**Decisión:** Estado global con Zustand 5 y middleware `persist`.
**Alternativas:** Redux Toolkit, MobX, Jotai, Context API puro.
**Razón:** Zustand tiene API mínima (menos boilerplate = menos superficie de error para IA). El middleware `persist` integra localStorage sin código adicional.
**Consecuencias:** Tres stores: `config-store` (persist), `theme-store` (persist), `ui-store` (sin persist). La lógica de negocio vive en el Core Engine, no en los stores.

---

### D-011 — Arquitectura en capas: UI / State / Core Engine
**Decisión:** Tres capas con dependencia unidireccional: UI (React) → State (Zustand) → Core (funciones puras).
**Alternativas:** Lógica directamente en componentes, fat stores con lógica de negocio.
**Razón:** El Core Engine (cálculo de turnos, encoding, validaciones) debe ser testeable de forma aislada sin React ni localStorage. Funciones puras son predecibles y fáciles de testear.
**Consecuencias:** El Core Engine en `src/core/` no importa React, Zustand, ni accede al DOM. Cada archivo en `core/` tiene su `.test.ts`.

---

### D-012 — localStorage con prefijo `dod-` y cuatro keys
**Decisión:** Cuatro keys fijas: `dod-configs`, `dod-preferences`, `dod-onboarding`, `dod-feedback-cooldown`.
**Alternativas:** Una sola key con todo el estado, keys sin prefijo.
**Razón:** El prefijo `dod-` evita colisiones con otros sitios en el mismo dominio. Separar en cuatro keys permite hidratar cada store de Zustand de forma independiente.
**Consecuencias:** `dod-onboarding` y `dod-feedback-cooldown` se leen/escriben directamente, no vía Zustand persist. Cualquier nueva key en v2.0 debe mantener el prefijo `dod-`.

---

### D-013 — Evento `storage` sobre BroadcastChannel para múltiples pestañas
**Decisión:** Detección de cambios entre pestañas vía evento nativo `window.storage`.
**Alternativas:** BroadcastChannel API (más potente, bidireccional).
**Razón:** El evento `storage` cubre exactamente el caso de uso: detectar que otra pestaña escribió en localStorage. BroadcastChannel es innecesario y agrega complejidad.
**Consecuencias:** El listener reacciona solo a keys con prefijo `dod-`. La recarga de datos usa los métodos de rehidratación de Zustand.

---

### D-014 — Dark mode: clase en `<html>`, no media query
**Decisión:** Dark mode se controla con la clase `dark` en el elemento `<html>`. El usuario lo activa manualmente. Default: modo claro.
**Alternativas:** `prefers-color-scheme` media query (automático por preferencia del sistema).
**Razón:** El PRD especifica que el usuario elige manualmente. Permite control explícito y predecible.
**Consecuencias:** La app siempre abre en modo claro sin importar la configuración del sistema. La preferencia del usuario se guarda en `dod-preferences` vía Zustand persist.

---

### D-015 — Colores de turno: `style` inline, no clases Tailwind
**Decisión:** Los colores de turno elegidos por el usuario se aplican vía `style={{ backgroundColor: color }}`, nunca como clases Tailwind.
**Alternativas:** Generar clases Tailwind dinámicamente, CSS custom properties por componente.
**Razón:** Tailwind no puede generar clases dinámicas en tiempo de ejecución (JIT purga las clases no usadas en build). El color del turno es un valor hex elegido en runtime, imposible de anticipar en build time.
**Consecuencias:** Los colores de turno no participan del design system de Tailwind. Se validan con regex `/^#[0-9A-Fa-f]{6}$/` antes de aplicarse al DOM para prevenir XSS.

---

### D-016 — Iconos: solo `lucide-react`
**Decisión:** La única librería de iconos permitida es `lucide-react`.
**Alternativas:** Font Awesome, Material Icons, Heroicons, SVGs inline customizados.
**Razón:** `lucide-react` es tree-shakeable, tiene estilo consistente y es el estándar de facto en el ecosistema Tailwind/React.
**Consecuencias:** Si un ícono específico no existe en `lucide-react`, buscar el más cercano o crear un SVG inline como excepción documentada.

---

### D-017 — Animaciones CSS nativas (sin Framer Motion)
**Decisión:** Todas las animaciones se implementan con CSS transitions y CSS animations nativas. Sin Framer Motion, React Spring ni ninguna librería de animación.
**Alternativas:** Framer Motion (estándar en el ecosistema React para animaciones complejas).
**Razón:** Las animaciones del MVP son suficientemente simples para CSS nativo. Framer Motion agrega ~50KB al bundle.
**Consecuencias:** Las animaciones más complejas requieren más trabajo manual en CSS. Specs completas en `docs/design/animation-specs.md` — es la fuente de verdad de todas las animaciones.

---

### D-028 — Fechas: date-fns 4, imports individuales
**Decisión:** Librería de fechas: `date-fns` 4. Importar funciones individualmente. Prohibido Moment.js, dayjs, Luxon.
**Alternativas:** Moment.js (deprecado), dayjs, Luxon, Date nativo.
**Razón:** Tree-shakeable (solo se incluyen las funciones usadas). Funciones puras. Soporte de locales para i18n futuro.
**Consecuencias:** `import { addMonths } from "date-fns"`, nunca `import * as dateFns from "date-fns"`.

---

### D-029 — Routing: React Router 7 con `createBrowserRouter`
**Decisión:** Client-side routing con React Router 7, usando `createBrowserRouter`.
**Alternativas:** TanStack Router, routing manual.
**Razón:** Estándar para SPA React. Necesario para `useSearchParams` (parámetro `?cfg=`). 7 rutas definidas, lazy load en todas excepto `/`.
**Consecuencias:** Usar `<Link>` o `useNavigate` para navegación interna — nunca `<a href>`. Lazy load vía `React.lazy()` + `<Suspense>`.

---

### D-030 — i18n: react-i18next, solo locale `es` en MVP
**Decisión:** Internacionalización con `react-i18next`. Un único locale `es` en MVP. 6 namespaces: `common`, `calendar`, `config`, `search`, `feedback`, `onboarding`.
**Alternativas:** i18n-ally, lingui, strings hardcodeados.
**Razón:** Permite preparar la arquitectura de textos para múltiples idiomas sin implementarlos. Cero strings hardcodeados en JSX desde el inicio.
**Consecuencias:** Todo texto visible al usuario pasa por `t('namespace:key')`. Mapa completo de keys en `docs/design/i18n-namespaces.md`.

---

### D-031 — Gestos: @use-gesture/react, umbral 50px + velocidad 0.3
**Decisión:** Detección de swipe con `@use-gesture/react`. Umbral: 50px de distancia + 0.3 de velocidad mínima. Swipe vertical = meses, horizontal = años.
**Alternativas:** Hammer.js, event listeners nativos de touch.
**Razón:** Librería ligera, bien documentada, compatible con React 19. Umbral evita activaciones accidentales.
**Consecuencias:** Siempre proveer controles de botón equivalentes para desktop y accesibilidad. Cada swipe ejecuta exactamente una acción.

---

### D-032 — Testing: Vitest + React Testing Library
**Decisión:** Testing con Vitest + React Testing Library. Sin Jest, sin Cypress en MVP.
**Alternativas:** Jest + RTL, Playwright (E2E), Cypress.
**Razón:** Integración nativa con Vite. Testing orientado a comportamiento de usuario. E2E se agrega en v2.0.
**Consecuencias:** Cada archivo en `src/core/` tiene su `.test.ts` al lado. Tests de componentes en `*.test.tsx`.

---

### D-033 — Algoritmo de turno: aritmética de módulo O(1)
**Decisión:** El cálculo de estado de turno para cualquier fecha usa aritmética de módulo con `moduloPositivo(a,b) = ((a % b) + b) % b`. Sin iteración desde el origen.
**Alternativas:** Iterar día por día desde `cycleStartDate`, lookup table pre-calculada.
**Razón:** O(1) para cualquier fecha, sin importar la distancia temporal. Soporta fechas antes del origen con módulo positivo.
**Consecuencias:** El cálculo hacia atrás (fechas antes de `cycleStartDate`) es correcto por diseño — no se omiten resultados. Implementado en `src/core/shift-calculator/shift-calculator.ts`.

---

### D-034 — Hosting: Cloudflare Pages con CI/CD desde `main`
**Decisión:** Deploy en Cloudflare Pages. Auto-deploy desde rama `main`. CI: `lint → format:check → typecheck → test` antes de merge.
**Alternativas:** Vercel, Netlify, GitHub Pages.
**Razón:** Sitio estático. CDN global. Integración nativa con GitHub. Plan gratuito suficiente para MVP.
**Consecuencias:** `VITE_FORMSPREE_ID` configurado en Cloudflare Pages, no en el repo. Variables de entorno nunca en archivos versionados.

---

## SECCIÓN 3 — Diseño y UX

### D-018 — Artefactos de diseño: texto/markdown (no Figma)
**Decisión:** Los artefactos de diseño son especificaciones en markdown: wireframes ASCII, design tokens como CSS custom properties, specs de componentes en markdown.
**Alternativas:** Figma files, Zeplin, Storybook como fuente de verdad del diseño.
**Razón:** El desarrollo es AI-first. Los agentes de desarrollo consumen las specs directamente desde markdown. Eliminar la herramienta de diseño del pipeline reduce fricción y permite iteración más rápida.
**Consecuencias:** El diseño vive en `docs/design/`. Si se incorpora un diseñador humano, se evalúa agregar Figma. Los docs de diseño son la fuente de verdad.

---

### D-019 — Orden de diseño: design system primero
**Decisión:** El diseño comienza siempre por los tokens (design system) antes de diseñar cualquier pantalla o componente.
**Alternativas:** Diseñar pantallas primero y extraer tokens después.
**Razón:** Sin tokens definidos, los wireframes y specs de componentes usarán valores arbitrarios que generan inconsistencia. Los tokens son la fuente de verdad que garantiza coherencia visual.
**Consecuencias:** El design system es un bloqueante para iniciar el diseño de pantallas. **Estado actual: design system completo** (`docs/design/design-tokens.md`).

---

## SECCIÓN 4 — Proceso y Agentes

### D-020 — Agentes específicos por proyecto, no genéricos
**Decisión:** Los archivos de agente en `agents/` son específicos de DateOnDuty con contexto embebido del PRD, arquitectura, restricciones y usuarios.
**Alternativas:** Agentes genéricos reutilizables que leen el PRD al inicio de cada conversación.
**Razón:** El contexto embebido reduce el tiempo de warm-up del agente y garantiza que no trabaje con información desactualizada. Un agente que ya sabe que "los colores son dinámicos" no los hardcodeará.
**Consecuencias:** Al actualizar el PRD o la Arquitectura, los archivos de agente deben actualizarse también. Son documentos vivos.

---

### D-021 — Skills de diseño: formato libre por caso de uso
**Decisión:** Los skills en `agents/skills/` no siguen un formato único rígido. Cada skill define el formato más útil para su caso de uso.
**Alternativas:** Formato estándar único para todos los skills.
**Razón:** Los skills de diseño tienen naturalezas diferentes: algunos son plantillas de output (wireframe, component-spec), otros son checklists de validación (design-review), otros son generadores completos (design-tokens).
**Consecuencias:** Los skills son invocables como slash commands desde Claude Code. El agente lee el skill file y lo ejecuta como sub-instrucción.

---

---

### D-035 — Modal de importación: radio replace/add + nombres independientes
**Decisión:** El modal de `SharedConfigReceiver` usa dos radio buttons ("Reemplazar mi turno actual" / "Guardar como nuevo turno") con dos campos de nombre independientes (`replaceName`, `addName`) que conservan su valor al cambiar de modo.
**Alternativas:** Flujo multi-paso (seleccionar modo → siguiente pantalla → ingresar nombre), un solo campo de nombre que cambia de label.
**Razón:** Un único modal plano evita la complejidad de múltiples pasos. Los dos estados de nombre son independientes para no perder lo que el usuario escribió si cambia de opinión sobre el modo.
**Consecuencias:** Para "replace", `name` se pasa a `importFromUrl(payload, true, replaceName)` → es el nombre que recibirá el turno actual al ser "demotido" a adicional. Para "add", se pasa a `importFromUrl(payload, false, addName)` → es el nombre del turno importado.

---

### D-036 — Feedback "enlace copiado": opacidad CSS, no Toast
**Decisión:** En `ShareConfigModal`, el mensaje "¡Enlace copiado!" se renderiza siempre con `opacity-0` y pasa a `opacity-100` durante 2 segundos al copiar. No usa el componente `Toast`.
**Alternativas:** Usar el componente `Toast` (aparece desde bottom), cambiar el ícono del botón de Copy a Check.
**Razón:** La confirmación de copia es inline y puntual — no requiere una notificación global que compita visualmente con el modal. El espacio reservado (`role="status" aria-live="polite"`) evita que el layout salte.
**Consecuencias:** El elemento siempre ocupa espacio en el DOM (evita layout shift). `aria-live="polite"` anuncia el mensaje a lectores de pantalla cuando aparece.

---

### D-037 — SwipeAnimation: estructura de dos divs para evitar conflicto de transforms
**Decisión:** `SwipeAnimation` usa un div externo para el posicionamiento fijo (`-translate-x-1/2 -translate-y-1/2`) y un div interno para la animación de entrada/salida (que usa `scale` en el keyframe). Nunca en el mismo elemento.
**Alternativas:** Un solo div con ambas clases.
**Razón:** CSS no permite combinar `translate` de Tailwind con `scale` de un keyframe en el mismo elemento sin que se sobreescriban. Separar las responsabilidades evita el conflicto.
**Consecuencias:** El div externo solo gestiona posición; el interno solo gestiona opacidad/escala de animación. Patrón aplicable a cualquier componente que combine posicionamiento fijo con animación de transform.

---

### D-038 — ConfigBanner: `onboardingStartTime` en ui-store (no persistido)
**Decisión:** El timestamp de inicio del onboarding se guarda en `ui-store` (memoria de sesión, no `persist`) para que el timer de 50s sobreviva navegaciones internas sin persistirse entre sesiones.
**Alternativas:** `useRef` local en el componente (se pierde al navegar), `localStorage` directo (sobreviviría entre sesiones, lo que rompería la regla del timer).
**Razón:** El timer debe sobrevivir si el usuario toca el banner y navega a `/config` y vuelve — pero debe reiniciarse en una nueva sesión del browser. `ui-store` sin persist es exactamente ese ciclo de vida.
**Consecuencias:** Al recargar la página, `onboardingStartTime` se resetea a `null` y el timer arranca de cero si `bannerSeen` no está escrito en localStorage. Comportamiento intencional.

---

### D-039 — Vite 7.x (no downgrade a 6.x)
**Decisión:** El proyecto usa Vite 7.3.1. CLAUDE.md y Architecture_v1 se actualizan a `7.x`. No se baja la versión.
**Alternativas:** Fijar en Vite 6.x para coincidir con la spec original.
**Razón:** Vite 7 es compatible con el stack actual; no hay razón técnica para hacer downgrade. Mantener la versión más reciente reduce deuda de actualización.
**Consecuencias:** La tabla de stack en CLAUDE.md y en Architecture_v1 debe reflejar `7.x`.

---

### D-040 — Lectura directa de `dod-preferences` en `main.tsx` (excepción pre-render)
**Decisión:** `main.tsx` lee `dod-preferences` de localStorage de forma síncrona antes del primer render de React para aplicar el tema y evitar FOUC (flash of unstyled content). Esta es la tercera excepción documentada al acceso directo a localStorage.
**Alternativas:** Leer el tema desde `theme-store` tras el primer render (produce FOUC), usar una cookie (requiere servidor).
**Razón:** No existe alternativa viable sin FOUC en una SPA estática. La lectura es read-only y ocurre una sola vez en el arranque, antes de que Zustand se inicialice.
**Consecuencias:** Las tres excepciones de localStorage directo son: `dod-onboarding`, `dod-feedback-cooldown`, y la lectura pre-render de `dod-preferences` en `main.tsx`. El código no debe modificarse.

---

### D-041 — Un día puede tener entrada y salida: ambas se reportan
**Decisión:** `calculateShiftStatus` reporta toda entrada y toda salida en el día calendario en que ocurre (`[00:00, 24:00)`). Si un día contiene dos eventos, el primero define `type` y el segundo viaja en un campo opcional: `entry` + `exitTime` (ej. 12x36 con entrada 08:00) o `exit` + `entryTime` (ej. personalizado 12x12 con entrada 19:00). Una salida exactamente a las 00:00 se reporta en el día que inicia.
**Alternativas:** Dejar `entry` solo y que cada componente derivara la salida del config (era el plan anotado en los tests, pero ningún componente lo hacía); devolver una lista de eventos por día (más general, rompe a todos los consumidores).
**Razón:** Con turnos de 12h la app mostraba "Entrada 08:00" y nunca la salida; con descansos < 24h se perdía la reentrada del mismo día. Con trabajo y descanso ≥ 12h caben como máximo dos eventos por día, así que dos campos opcionales bastan y son retrocompatibles.
**Consecuencias:** `describeShiftStatus` (`core/shift-format`) es la única fuente de verdad para describir un día; DayCell, DayExpandedPanel y SearchPage la consumen. Qué horas caben en la celda del calendario se decide en `features/calendar/utils/cellLabels.ts`.

### D-042 — Paridad con la v1 como prueba de regresión
**Decisión:** La suite del core incluye una prueba que compara la v2 contra el algoritmo original de `calendario-de-turno-laboral` (ciclo de 3 días anclado al 2023-08-02) para todos los días de 2020 a 2030.
**Alternativas:** Ninguna documentada.
**Razón:** La v1 es la referencia validada por el usuario real (esquema 24x48). La configuración equivalente en la v2 es `24x48` con `cycleStartDate: 2023-08-01`.
**Consecuencias:** Cualquier cambio al algoritmo que altere el calendario del usuario original rompe la suite.

### D-043 — HelpOverlay: versión de leyenda en el MVP
**Decisión:** El botón [?] abre un BottomSheet/modal con la leyenda de gestos y elementos. Los badges numerados superpuestos a la UI (spec completa en `docs/design/component-specs/HelpOverlay.md`) quedan como mejora posterior.
**Alternativas:** Implementar la spec completa; ocultar el botón hasta tenerla.
**Razón:** El botón existía y cambiaba `helpActive`, pero ningún componente lo leía: era un control muerto en la pantalla principal.
**Consecuencias:** `ui-store` expone `closeHelp` (idempotente). Las claves `helpColors` y `helpSearch` se añadieron al namespace `onboarding`.

### D-044 — `/search?date=YYYY-MM-DD`
**Decisión:** La pantalla de búsqueda acepta la fecha inicial por query string. "Ver en buscador de fechas" del panel del día la envía.
**Alternativas:** Pasar la fecha por `location.state` (se pierde al recargar); guardarla en `ui-store`.
**Razón:** El botón llevaba a la búsqueda abierta en hoy, perdiendo el día que se estaba consultando. El query string además permite enlazar una fecha concreta.
**Consecuencias:** Un valor ausente o inválido cae a hoy, sin mensaje de error.

### D-045 — El tema se aplica al instante también desde el formulario
**Decisión:** El radio de tema del formulario de la config principal escribe directo en `theme-store`, igual que el botón del AppBar. Primer día de la semana y color de líneas siguen aplicándose al guardar.
**Alternativas:** Mantener la copia local y sincronizarla con el store.
**Razón:** La copia local quedaba desfasada si el tema se cambiaba desde el AppBar con el formulario abierto, y al guardar revertía ese cambio.
**Consecuencias:** Ninguna para otros componentes.

### D-046 — CI en GitHub Actions
**Decisión:** `.github/workflows/ci.yml` corre `lint → format:check → typecheck → test → build` en cada push de cualquier rama (así una rama de trabajo se valida antes de abrir el pull request).
**Alternativas:** Depender solo del hook pre-commit de Husky.
**Razón:** `CLAUDE.md` describía este pipeline pero no existía ningún workflow; el hook de Husky solo corre en máquinas donde se instalaron dependencias.
**Consecuencias:** La rama por defecto del repo es `master` (D-034 menciona `main`). Cloudflare Pages ya despliega producción desde `master` y una vista previa por rama; esa vista previa es la que permite revisar lo visual de un cambio antes de mergearlo.

---

### D-047 — Celda del día como línea de tiempo vertical
**Decisión:** Cada turno es una columna que representa las 24 h del día, de arriba (00:00) a abajo (24:00). El color llena solo las horas en turno y el franco queda en blanco. La hora de entrada va arriba del bloque de color y la de salida abajo. La celda lleva borde marcado (`--color-day-cell-border`) y el encabezado con el número del día, un fondo más oscuro (`--color-day-header`); el área donde se pinta queda clara. Con varios turnos las columnas van lado a lado (máx. 2 en móvil, 3 en escritorio) y las horas se acortan en móvil (`formatShiftTime` con `short`).
**Alternativas:** Degradado de izquierda a derecha por franja horizontal (versión anterior; no distinguía bien entrada, salida y franco); fondo oscuro en el área de horarios (probado, descartado por Armando) y en la celda completa (probado, descartado: el oscuro va en el encabezado del día).
**Razón:** Pedido de Armando tras revisar la vista previa: se entiende de un vistazo cuándo empieza y termina el turno y que "en blanco" es franco.
**Consecuencias:** `core/shift-format/day-segments.ts` traduce un `ShiftStatus` a tramos; `DayCell` solo los dibuja. El color del texto de las horas se elige por contraste con el color del turno.

### D-048 — Formato de hora por defecto: 12 h (AM/PM)
**Decisión:** El formato de hora por defecto es `12h`, tanto en la config inicial como en el formulario y al importar un enlace. En el formulario aparece primero.
**Alternativas:** Mantener `24h`.
**Razón:** Pedido de Armando: es el formato que usa su público (México).
**Consecuencias:** Solo cambia el valor inicial. Una configuración ya guardada conserva su formato, porque no se puede distinguir lo elegido de lo heredado. El formato interno de `entryTime` sigue siendo `HH:mm` de 24 h.

### D-049 — Nuevo esquema predeterminado 12x24 y lista única de presets
**Decisión:** Se agrega el preset `12x24` (12 h de trabajo, 24 de descanso; ciclo de 36 h). Los presets viven en `PRESET_SCHEMES` (`core/shift-calculator/types.ts`) y decoder, store y formulario derivan de ahí.
**Alternativas:** Dejarlo solo como esquema personalizado (ya era posible con 12 y 24).
**Razón:** Pedido de Armando; es un rol real y frecuente. Tener cada lista de presets copiada en cuatro archivos hacía fácil olvidar uno.
**Consecuencias:** Los enlaces compartidos con `s: "12x24"` solo los entienden versiones que incluyan este preset; los anteriores mostrarán "enlace no válido".

### D-050 — Al guardar un turno se regresa al calendario
**Decisión:** Tras guardar una configuración (nueva o editada) y cerrarse el toast de confirmación, la app navega a `/` (calendario) en lugar de `/config`.
**Alternativas:** Regresar a "Mis turnos" (comportamiento anterior, de la spec de `ShiftConfigForm`).
**Razón:** Pedido de Armando: lo que la persona quiere ver después de guardar es cómo quedó su calendario.
**Consecuencias:** Para agregar otro turno seguido hay que volver a entrar a Configuración. El botón de volver del AppBar sigue usando el historial.

---

*Última entrada: D-050 — Noviembre 2026*
