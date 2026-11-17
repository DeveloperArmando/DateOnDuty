# DateOnDuty

Calendario para personas con **turnos rotativos** (24x48, 12x36, 48x48 o un esquema propio). Responde en segundos a dos preguntas: *¿qué turno me toca hoy?* y *¿qué turno me toca el día X?*

Nació para un policía con rol 24x48 que calculaba sus turnos de memoria, y para que su familia y compañeros pudieran consultarlos sin preguntarle.

**Demo:** <https://dateonduty.pages.dev>

> **Estado:** en desarrollo. Calendario, configuración, búsqueda por fecha, onboarding y compartir por enlace están implementados. Faltan el formulario de feedback y las páginas legales. Ver [`docs/action-plan.md`](docs/action-plan.md).

## Qué hace

- **Calendario mensual** con una franja de color por cada turno activo: intensa el día que entras, se desvanece el día que sales.
- **Búsqueda por fecha**: elige cualquier día, pasado o futuro, y ve el estado de cada turno.
- **Varios turnos a la vez**: el tuyo y hasta 10 más (pareja, compañeros), cada uno con su color.
- **Compartir por enlace**: la configuración viaja en la URL (`?cfg=`); quien la recibe decide si la guarda como suya o como adicional.
- **Sin cuenta ni servidor**: todo se calcula en el navegador y se guarda en `localStorage`.
- Tema claro/oscuro, formato de hora 24h / 12h / militar, navegación por teclado y por gestos.

## De la v1 a la v2

La primera versión es [`calendario-de-turno-laboral`](https://github.com/DeveloperArmando/calendario-de-turno-laboral): HTML, CSS y ~120 líneas de JavaScript que pintan un año completo con un único rol fijo (ciclo de 3 días: *entra → sale → franco*).

| | v1 | v2 (este repo) |
|---|---|---|
| Esquemas | Solo 24x48, fijo en el código | 24x48, 12x36, 48x48 y personalizado (12–72 h) |
| Fecha de referencia | Constante en el código | Configurable por el usuario |
| Hora de entrada y salida | No | Sí, con turnos que cruzan medianoche |
| Consultar una fecha | Desplazarse por el año | Búsqueda directa |
| Compartir | No | Enlace con la configuración |
| Pruebas | No | 107 pruebas unitarias del motor de cálculo |

La v2 conserva el comportamiento de la v1: una prueba compara ambos algoritmos día por día de 2020 a 2030 (`shift-calculator.test.ts`, "paridad con la v1").

## Cómo se calcula un turno

El motor (`app/src/core/shift-calculator`) es una función pura, sin dependencias de React ni del navegador:

```
ciclo      = horas de trabajo + horas de descanso
origen     = fecha de inicio del ciclo + hora de entrada
posición   = (minutos entre el origen y las 00:00 del día consultado) mod ciclo
```

Con la posición se sabe, en tiempo constante y para cualquier fecha, si ese día hay entrada, salida, ambas, turno completo o descanso. No se itera día por día y las fechas anteriores al origen funcionan igual (módulo positivo). Los cálculos se hacen en UTC para que el horario de verano no desplace los turnos.

## Stack

React 19 · TypeScript (estricto) · Vite 7 · Tailwind CSS 4 · Zustand 5 · React Router 7 · react-i18next · date-fns · Vitest

Arquitectura en tres capas con dependencias en un solo sentido:

```
UI (componentes)  →  Estado (Zustand + localStorage)  →  Core (funciones puras)
```

## Desarrollo

Requiere Node 22.

```bash
cd app
npm ci
npm run dev          # servidor de desarrollo en http://localhost:5173
npm run test         # pruebas unitarias
npm run lint && npm run format:check && npm run typecheck
npm run build        # build de producción
```

El mismo pipeline corre en GitHub Actions en cada push, y Cloudflare Pages publica una vista previa por rama ([`ci.yml`](.github/workflows/ci.yml)).

## Estructura

```
app/src/
├── core/        Motor de turnos, formato de horas, codificador de URL, contraste WCAG (puro, con pruebas)
├── stores/      Estado global: configuraciones, preferencias, interfaz
├── features/    calendar · config · search · sharing · onboarding · feedback · legal
├── shared/      Componentes y utilidades reutilizables
└── i18n/        Textos de la interfaz (español)
docs/            PRD, arquitectura, decisiones, casos borde y especificaciones de diseño
.claude/         Agentes y skills con los que se construyó el proyecto
```

## Construido con asistencia de IA

Este proyecto también es un ejercicio de **desarrollo dirigido por especificaciones con agentes de IA** (Claude Code). La IA no trabajó sobre un prompt suelto, sino sobre artefactos versionados en este repo:

- **Roles como agentes** ([`.claude/agents/`](.claude/agents)): product owner, arquitecto, diseñador UX/UI, frontend, QA, DevOps, entre otros, cada uno con su alcance.
- **Skills reutilizables** ([`.claude/skills/`](.claude/skills)): generar wireframes, especificar componentes, definir tokens de diseño, implementar un componente a partir de su especificación.
- **Especificación antes que código**: [PRD](docs/DateOnDuty_PRD_v2.md), [arquitectura](docs/DateOnDuty_Architecture_v1.md), [especificaciones por componente](docs/design/component-specs) y [casos borde](docs/DOD_EDGE_CASES.md) resueltos por escrito.
- **Memoria de decisiones**: cada decisión de producto o arquitectura queda en [`docs/DOD_DECISIONS_LOG.md`](docs/DOD_DECISIONS_LOG.md) con sus alternativas y su razón, para que ni una persona ni un agente la reabran sin contexto.
- **Reglas del proyecto** en [`CLAUDE.md`](CLAUDE.md), que todo agente lee antes de tocar el código.

Lo aprendido en el camino: el código generado necesita la misma revisión que el escrito a mano. Una auditoría posterior encontró pruebas cuyo título decía una cosa y verificaban otra, y un caso (turnos de 12 horas) que el motor resolvía a medias; ambos están corregidos y documentados en el registro de decisiones (D-041 a D-046).
