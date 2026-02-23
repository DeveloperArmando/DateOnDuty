# DateOnDuty — Decisions Log
**Proyecto:** DateOnDuty
**Última actualización:** Febrero 2026
**Propósito:** Registro de las decisiones más relevantes del proyecto para que cualquier agente entienda el *por qué* detrás del *qué*. Las decisiones aquí documentadas no se reabren sin justificación explícita del Product Owner.

---

## CÓMO LEER ESTE DOCUMENTO
Cada entrada tiene:
- **Decisión:** Qué se decidió.
- **Alternativas consideradas:** Qué más se evaluó.
- **Razón:** Por qué se eligió esta opción.
- **Consecuencias:** Qué implica para el desarrollo y diseño.

---

## SECCIÓN 1 — Producto y Negocio

### D-001 — MVP sin backend
**Decisión:** v1.0 es frontend puro. Sin servidor, sin base de datos, sin autenticación.
**Alternativas:** Firebase, Supabase, backend propio Express/Node.
**Razón:** Reduce tiempo de lanzamiento. El valor central (cálculo de turnos) no requiere persistencia en nube. Minimiza costos operativos en la etapa de validación de mercado.
**Consecuencias:** Todo vive en localStorage. Al borrar caché se pierden los datos. La sincronización entre dispositivos llega en v2.0.

---

### D-002 — Compartir configuración por URL (sin cuenta)
**Decisión:** El mecanismo de compartir codifica los datos en la URL con Base64 (`?cfg=`). Sin backend, sin short URLs, sin QR.
**Alternativas:** Firebase Dynamic Links, short URL con backend, QR code.
**Razón:** Coherente con el principio de "sin backend en MVP". Zero dependencias externas adicionales. `btoa`/`atob` son nativos del navegador.
**Consecuencias:** El link es estático (no refleja cambios posteriores). Solo se comparte una configuración a la vez. La URL puede ser larga pero los datos son mínimos (~100 chars en Base64).

---

### D-003 — Onboarding: flag guardado al terminar, no al ver
**Decisión:** El flag de onboarding se guarda en localStorage después de 50 segundos de permanencia, no cuando aparece. Si el usuario cierra antes, se muestra de nuevo.
**Alternativas:** Guardar al aparecer, guardar al hacer click en cualquier lugar.
**Razón:** El objetivo del onboarding es que el usuario *vea* los gestos. Guardarlo al aparecer frustraría ese objetivo si el usuario cierra inmediatamente.
**Consecuencias:** Usuarios que cierran frecuentemente antes de 50s verán el onboarding repetidamente. Limitación aceptada intencionalmente.

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
**Consecuencias:** El usuario siempre ve al menos un turno en el calendario. Para "limpiar" la app debe modificar la config default, no eliminarla.

---

### D-006 — Hora de entrada: solo horas completas o medias horas
**Decisión:** `entryTime` acepta únicamente valores como `08:00` o `08:30`. No se permiten `08:15`, `08:45`, etc.
**Alternativas:** Cualquier hora con granularidad de 5 minutos, solo horas completas.
**Razón:** Los turnos industriales en México/LATAM típicamente inician a horas o medias horas. Simplifica el input y reduce errores de configuración. Granularidad de 30 minutos es suficiente para el 99% de los casos de uso.
**Consecuencias:** Usuarios con turnos en cuartos de hora no pueden configurarlos exactamente. Limitación documentada.

---

### D-007 — Horas absolutas para cálculo de turnos (sin zonas horarias en MVP)
**Decisión:** El cálculo de turnos usa horas nominales (1 día = 24 horas siempre). No se consulta la zona horaria del dispositivo ni se ajusta por horario de verano.
**Alternativas:** Usar `Intl.DateTimeFormat` y `Date.getTimezoneOffset()` para ajustar.
**Razón:** El 99% de los trabajadores objetivo están en la misma zona horaria. Los esquemas de turno (24h, 48h) son en horas nominales, no en horas de reloj. El soporte de zonas horarias se agrega en v3.0 sin romper la interfaz del Core Engine.
**Consecuencias:** En días con cambio de horario (verano/invierno), el cálculo puede diferir en 1 hora. Riesgo bajo para el mercado objetivo (México tiene cambios de horario pero pocos trabajadores nocturnos los notarán).

---

## SECCIÓN 2 — Arquitectura Técnica

### D-008 — React sobre Angular
**Decisión:** Frontend en React 19 con TypeScript.
**Alternativas:** Angular (experiencia del equipo humano), Vue 3, Svelte.
**Razón:** El desarrollo es realizado principalmente por agentes de IA (Claude). El criterio dominante es LLM-friendliness: React tiene el mayor corpus de entrenamiento, Claude genera React con mayor precisión y consistencia que Angular. El boilerplate de Angular ralentizaría la generación de código por IA.
**Consecuencias:** El equipo humano (con experiencia en Angular) tendrá una curva de aprendizaje, pero el código generado por IA será más limpio y consistente.

---

### D-009 — Vite sobre Next.js
**Decisión:** Build tool: Vite 6. No se usa Next.js ni ningún framework con SSR.
**Alternativas:** Next.js (popular en React), Create React App (deprecado).
**Razón:** DateOnDuty es un SPA frontend puro. Next.js introduce Server Components, hydration y complejidad de servidor innecesaria. Vite es más simple, más rápido y directo para este caso de uso.
**Consecuencias:** Sin SSR, sin SSG, sin API routes. Todo en el cliente. Deploy como sitio estático en Cloudflare Pages.

---

### D-010 — Zustand sobre Redux
**Decisión:** Estado global con Zustand 5 y middleware `persist`.
**Alternativas:** Redux Toolkit, MobX, Jotai, Recoil, Context API puro.
**Razón:** Zustand tiene API mínima (menos boilerplate = menos superficie de error para IA). El middleware `persist` integra localStorage sin código adicional. Redux es excesivo para la complejidad del MVP.
**Consecuencias:** Tres stores independientes: `config-store`, `theme-store`, `ui-store`. El `ui-store` NO persiste (estado transitorio de UI).

---

### D-011 — Arquitectura en capas: UI / State / Core Engine
**Decisión:** La app tiene tres capas con dependencia unidireccional: UI (React) → State (Zustand) → Core (funciones puras).
**Alternativas:** Lógica directamente en componentes, fat stores con lógica de negocio.
**Razón:** El Core Engine (cálculo de turnos, encoding, validaciones) debe ser testeable de forma aislada sin React ni localStorage. Funciones puras son predecibles y fáciles de testear unitariamente.
**Consecuencias:** El Core Engine en `src/core/` no importa React, Zustand, ni accede al DOM. Cada archivo en `core/` tiene su `.test.ts`.

---

### D-012 — localStorage con prefijo `dod-` y cuatro keys
**Decisión:** Cuatro keys fijas: `dod-configs`, `dod-preferences`, `dod-onboarding`, `dod-feedback-cooldown`.
**Alternativas:** Una sola key con todo el estado, keys sin prefijo.
**Razón:** El prefijo `dod-` evita colisiones con otros sitios en el mismo dominio. Separar en cuatro keys permite hidratar cada store de Zustand de forma independiente y escuchar cambios por key en el evento `storage` (detección de cambios entre pestañas).
**Consecuencias:** Al agregar features en v2.0, cualquier nueva key debe mantener el prefijo `dod-`.

---

### D-013 — Evento `storage` sobre BroadcastChannel para múltiples pestañas
**Decisión:** Detección de cambios entre pestañas via evento nativo `window.storage`.
**Alternativas:** BroadcastChannel API (más potente, bidireccional).
**Razón:** El evento `storage` cubre exactamente el caso de uso: detectar que otra pestaña escribió en localStorage. BroadcastChannel es más poderoso pero innecesario, agrega complejidad sin beneficio adicional para este caso.
**Consecuencias:** El listener reacciona solo a keys con prefijo `dod-`. La recarga de datos usa los métodos de rehidratación de Zustand, no `window.location.reload()`.

---

### D-014 — dark mode: clase en `<html>`, no media query
**Decisión:** Dark mode se controla con la clase `dark` en el elemento `<html>`. El usuario lo activa manualmente. Default: modo claro.
**Alternativas:** `prefers-color-scheme` media query (automático por preferencia del sistema).
**Razón:** El PRD especifica que el usuario elige manualmente. No se detecta ni respeta la preferencia del sistema operativo en MVP. Permite un control explícito y predecible.
**Consecuencias:** La app siempre abre en modo claro, sin importar la configuración del sistema. La preferencia del usuario se guarda en `dod-preferences` via Zustand persist.

---

### D-015 — Colores de turno: `style` inline, no clases Tailwind
**Decisión:** Los colores de turno elegidos por el usuario se aplican via `style={{ backgroundColor: color }}` en los componentes, nunca como clases de Tailwind.
**Alternativas:** Generar clases Tailwind dinámicamente, CSS custom properties por componente.
**Razón:** Tailwind no puede generar clases dinámicas en tiempo de ejecución (JIT purga las clases no usadas en build). El color del turno es un valor hex elegido por el usuario en runtime, imposible de anticipar en build time.
**Consecuencias:** Los colores de turno no participan del design system de Tailwind. Se validan con regex `/^#[0-9A-Fa-f]{6}$/` antes de aplicarse al DOM para prevenir XSS.

---

### D-016 — Iconos: solo `lucide-react`
**Decisión:** La única librería de iconos permitida es `lucide-react`.
**Alternativas:** Font Awesome, Material Icons, Heroicons, SVGs inline customizados.
**Razón:** `lucide-react` es tree-shakeable (solo se incluyen los iconos usados en el bundle), tiene un estilo consistente, y es la opción estándar de facto en el ecosistema Tailwind/React. Mantener una sola librería de iconos garantiza consistencia visual.
**Consecuencias:** Si un ícono específico no existe en `lucide-react`, se debe buscar el más cercano o crear un SVG inline como excepción documentada.

---

### D-017 — Animaciones CSS nativas (sin Framer Motion)
**Decisión:** Todas las animaciones y transiciones se implementan con CSS transitions y CSS animations nativas (via clases Tailwind o CSS en componente). No se agrega Framer Motion, React Spring ni ninguna librería de animación.
**Alternativas:** Framer Motion (estándar en el ecosistema React para animaciones complejas).
**Razón:** Las animaciones del MVP (transición de meses, entrada de modales, onboarding) son suficientemente simples para CSS nativo. Framer Motion agrega ~50KB al bundle. Objetivo de bundle < 150KB gzipped.
**Consecuencias:** Las animaciones más complejas (como el onboarding swipe hint) requieren más trabajo manual en CSS. Si en versiones futuras se requieren animaciones más complejas, se evalúa agregar Framer Motion.

---

## SECCIÓN 3 — Diseño y UX

### D-018 — Artefactos de diseño: texto/markdown (no Figma)
**Decisión:** Los artefactos de diseño del agente UX/UI son especificaciones en texto/markdown: wireframes ASCII, design tokens como CSS custom properties, specs de componentes en markdown.
**Alternativas:** Figma files, Zeplin, Storybook como fuente de verdad del diseño.
**Razón:** El desarrollo es AI-first. Los agentes de desarrollo consumen las specs directamente desde markdown. Eliminar la herramienta de diseño del pipeline reduce fricción y permite iteración más rápida.
**Consecuencias:** No hay "source of truth" visual en Figma. El diseño vive en `docs/design/` como archivos markdown. Si se incorpora un diseñador humano en el futuro, se evalúa agregar Figma.

---

### D-019 — Orden de diseño: design system primero
**Decisión:** El agente UX/UI debe comenzar siempre por el design system (tokens) antes de diseñar cualquier pantalla.
**Alternativas:** Diseñar pantallas primero y extraer tokens después.
**Razón:** Sin tokens definidos, los wireframes y specs de componentes usarán valores arbitrarios que generan inconsistencia. Los tokens son la fuente de verdad que garantiza coherencia visual entre todas las pantallas.
**Consecuencias:** El design system es un bloqueante para iniciar el diseño de pantallas. La fase de diseño comienza con `skill-design-tokens`.

---

## SECCIÓN 4 — Proceso y Agentes

### D-020 — Agentes específicos por proyecto, no genéricos
**Decisión:** Los archivos de agente en `agents/` son específicos de DateOnDuty. Incluyen contexto embebido del PRD, la arquitectura, los usuarios y las restricciones del proyecto.
**Alternativas:** Agentes genéricos reutilizables entre proyectos que leen el PRD al inicio de cada conversación.
**Razón:** El contexto embebido reduce el tiempo de "warm-up" del agente y garantiza que no trabaje con información desactualizada o interpretada libremente. Un agente que ya sabe que "los colores de turno son dinámicos" no cometerá el error de hardcodearlos.
**Consecuencias:** Al actualizar el PRD o la Arquitectura, los archivos de agente deben actualizarse también. Son documentos vivos.

---

### D-021 — Skills de diseño: formato libre por caso de uso
**Decisión:** Los skills en `agents/skills/` no siguen un formato único rígido. Cada skill define el formato más útil para su caso de uso.
**Alternativas:** Formato estándar Claude Code skills (slash commands con estructura fija).
**Razón:** Los skills de diseño tienen naturalezas diferentes: algunos son plantillas de output (wireframe, component-spec), otros son checklists de validación (design-review), otros son generadores completos (design-tokens). Un formato único no sirve igual a todos.
**Consecuencias:** Los skills son invocables con `/skill-nombre [parámetros]`. El agente lee el skill file y lo ejecuta como sub-instrucción.

---

*Última entrada: D-021 — Febrero 2026*
*Próxima actualización: al inicio de la fase de Desarrollo (agregar decisiones de implementación).*
