# DateOnDuty — Documento de Arquitectura de Software
**Version:** 1.0
**Fecha:** Febrero 2026
**Arquitecto:** Claude (AI-Assisted Architecture)
**Estado:** Borrador para revisión
**PRD de referencia:** DateOnDuty_PRD_v2.md

---

## Historial de Cambios

| Version | Fecha | Cambio |
|---|---|---|
| 1.0 | Feb 2026 | Version inicial. Arquitectura completa para MVP (v1.0). |

---

## 1. Stack Tecnologico Recomendado

### 1.1 Criterio de Seleccion

El desarrollo de DateOnDuty sera realizado principalmente mediante agentes de IA (Claude). Por tanto, el criterio dominante de seleccion de stack es **LLM-friendliness**: volumen de datos de entrenamiento, precision del codigo generado, y consistencia en patrones. La experiencia del equipo humano (Angular / ASP.NET) es un criterio secundario.

### 1.2 Frontend

| Tecnologia | Version | Justificacion |
|---|---|---|
| **React** | 19.x | Mayor corpus de entrenamiento en LLMs. Claude genera React con alta precision y consistencia. Ecosistema mas grande de la industria. |
| **TypeScript** | 5.x | Tipado estatico reduce errores generados por IA. Autocompletado y validacion en IDE. Documentacion implicita en el codigo. |
| **Vite** | 6.x | Build tool nativo para React SPAs. Configuracion minima. Hot Module Replacement rapido. Sin complejidad de SSR innecesaria para un frontend-only MVP. |
| **Tailwind CSS** | 4.x | Utility-first simplifica generacion de CSS por IA. Soporte nativo de dark mode via clase `dark`. Responsive integrado. Minimo CSS custom necesario. |
| **Zustand** | 5.x | Estado global ligero con API minimal. Middleware `persist` integrado para localStorage. Sin boilerplate de Redux. Patron de store simple que los LLMs manejan bien. |
| **date-fns** | 4.x | Funciones puras tree-shakeable para manipulacion de fechas. Mas ligera que Moment/dayjs para operaciones especificas. Soporte de locales para i18n futuro. |
| **React Router** | 7.x | Enrutamiento client-side estandar. Necesario para rutas de paginas legales, configuracion, y manejo de parametros de URL (`?cfg=`). |
| **react-i18next** | 15.x | Estandar de la industria para i18n en React. Permite preparar la arquitectura de textos sin implementar multiples idiomas en MVP. |
| **@use-gesture/react** | 10.x | Deteccion de gestos tactiles (swipe) para navegacion por meses/anos. Ligera, bien documentada, compatible con React 19. |

### 1.3 Alternativas Descartadas

| Alternativa | Razon de descarte |
|---|---|
| **Next.js** | Introduce Server Components, SSR y complejidad de servidor que no se necesita en un frontend-only MVP. Vite + React Router es mas simple y directo. |
| **Angular** | Aunque el equipo tiene experiencia, Angular es mas verboso y los LLMs generan codigo Angular con menor consistencia que React. Mayor boilerplate por feature. |
| **Vue 3** | Buen framework pero menor corpus de entrenamiento en LLMs comparado con React. Ecosistema mas pequeno. |
| **Svelte/SvelteKit** | Codigo mas conciso, pero menor volumen de datos de entrenamiento. Riesgo de generacion imprecisa en edge cases. |
| **Redux Toolkit** | Excesivo para el nivel de complejidad del estado en MVP. Zustand cubre el 100% de las necesidades con una fraccion del boilerplate. |
| **Moment.js** | Deprecada. No es tree-shakeable. date-fns es la alternativa moderna. |
| **CSS Modules / styled-components** | Mas codigo por componente. Tailwind permite generar UI responsive de forma mas concisa y predecible via IA. |

### 1.4 Herramientas de Desarrollo

| Herramienta | Proposito |
|---|---|
| **Vitest** | Testing unitario y de integracion. Integrado nativamente con Vite. Compatible con Testing Library. |
| **React Testing Library** | Testing de componentes orientado a comportamiento del usuario. |
| **ESLint** | Linting con reglas de TypeScript y React. |
| **Prettier** | Formateo consistente del codigo. |
| **Husky + lint-staged** | Pre-commit hooks para linting y formateo automatico. |

### 1.5 Infraestructura

| Servicio | Uso |
|---|---|
| **Cloudflare Pages** | Hosting del frontend como sitio estatico. Deploy automatico desde repositorio. |
| **Cloudflare DNS** | Dominio propio ya configurado. Subdominio para frontend (ej: `app.dateonduty.com`). |
| **Formspree** | Servicio externo para recibir formularios de feedback sin backend propio. |
| **GitHub** | Repositorio de codigo. CI/CD integrado con Cloudflare Pages. |

---

🤖 **AGENT RULES — Stack y Dependencias**
- Usar React 19 con TypeScript estricto (`strict: true` en tsconfig).
- Build tool: Vite 6. NO usar Next.js, Remix, ni ningun framework con SSR.
- Estilos: Tailwind CSS 4 con estrategia de dark mode via clase `dark` en `<html>`.
- Estado global: Zustand con middleware `persist` apuntando a localStorage.
- Fechas: usar exclusivamente `date-fns`. NO importar Moment, dayjs, ni Luxon.
- Routing: React Router 7 en modo SPA (createBrowserRouter).
- i18n: react-i18next. Todos los textos visibles al usuario salen de archivos de traduccion, nunca hardcodeados.
- Gestos: @use-gesture/react para deteccion de swipe en calendario.
- Testing: Vitest + React Testing Library. No usar Jest.
- NO agregar dependencias sin justificacion explicita en este documento.
- El parametro `?cfg=` de la URL se maneja mediante React Router (useSearchParams).

---

## 2. Arquitectura del Sistema

### 2.1 Patron Arquitectonico

**SPA Monolitica con Arquitectura Modular por Features (Feature-Sliced).**

El MVP es una Single Page Application sin backend. Toda la logica vive en el cliente. La arquitectura interna sigue un patron de slices por feature donde cada feature encapsula sus componentes, hooks, stores y utilidades.

No se aplican microservicios ni micro-frontends. La simplicidad de un monolito frontend es suficiente y adecuada para el MVP.

### 2.2 Diagrama de Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR DEL USUARIO                │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              REACT SPA (Vite Build)               │  │
│  │                                                   │  │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────────────┐  │  │
│  │  │  UI     │  │  State   │  │  Core Engine    │  │  │
│  │  │  Layer  │──│  Layer   │──│  (Pure Logic)   │  │  │
│  │  │         │  │ (Zustand)│  │                 │  │  │
│  │  └─────────┘  └────┬─────┘  └─────────────────┘  │  │
│  │                     │                             │  │
│  │               ┌─────┴─────┐                       │  │
│  │               │localStorage│                      │  │
│  │               └───────────┘                       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────┐                                    │
│  │  URL Params     │  ← ?cfg=[Base64] para compartir    │
│  └─────────────────┘                                    │
└─────────────────────────────────────────────────────────┘
           │ (solo feedback)
           ▼
   ┌───────────────┐
   │   Formspree   │  ← Servicio externo para formulario
   └───────────────┘

   ┌───────────────────────┐
   │   Cloudflare Pages    │  ← Hosting estatico
   │   + Cloudflare DNS    │
   └───────────────────────┘
```

### 2.3 Capas de la Aplicacion

```
┌──────────────────────────────────────────────┐
│                 UI LAYER                      │
│  Componentes React, paginas, layouts         │
│  Responsable de: renderizado, eventos UI,    │
│  gestos, animaciones                         │
├──────────────────────────────────────────────┤
│              STATE LAYER                      │
│  Zustand stores con persistencia             │
│  Responsable de: estado global,              │
│  sincronizacion con localStorage,            │
│  deteccion de cambios entre pestanas         │
├──────────────────────────────────────────────┤
│             CORE ENGINE                       │
│  Funciones puras sin dependencia de React    │
│  Responsable de: calculo de turnos,          │
│  encoding/decoding de URL, validaciones,     │
│  evaluacion de contraste WCAG                │
├──────────────────────────────────────────────┤
│            INFRASTRUCTURE                     │
│  localStorage, URL params, Formspree API     │
│  Responsable de: persistencia, I/O externo   │
└──────────────────────────────────────────────┘
```

**Regla de dependencia:** Las capas superiores dependen de las inferiores, nunca al reves. El Core Engine no importa React, Zustand, ni accede a localStorage directamente.

### 2.4 Flujo de Datos

```
Usuario interactua con UI
        │
        ▼
Componente React despacha accion a Zustand store
        │
        ▼
Zustand store invoca funcion del Core Engine (calculo puro)
        │
        ▼
Core Engine retorna resultado (sin side effects)
        │
        ▼
Zustand store actualiza estado + middleware persiste en localStorage
        │
        ▼
React re-renderiza componentes suscritos al estado actualizado
```

---

🤖 **AGENT RULES — Arquitectura**
- La aplicacion es una SPA. Una sola pagina HTML, un solo bundle JS. No hay SSR, SSG, ni API routes.
- Tres capas: UI (React), State (Zustand), Core (funciones puras).
- El Core Engine NO importa React, Zustand, ni accede al DOM o localStorage. Solo recibe datos y retorna datos.
- Los componentes React NO realizan calculos de turnos directamente. Siempre pasan por el store que invoca al Core.
- La persistencia en localStorage se maneja exclusivamente via el middleware `persist` de Zustand. Ningun componente lee ni escribe localStorage directamente excepto para flags especificos (onboarding visto, timer de feedback).
- El unico I/O externo en MVP es Formspree (POST HTTP para feedback).

---

## 3. Estructura de Proyecto

```
src/
├── app/                          # Configuracion raiz de la aplicacion
│   ├── App.tsx                   # Componente raiz con providers
│   ├── router.tsx                # Configuracion de React Router
│   └── providers.tsx             # Providers globales (i18n, theme)
│
├── core/                         # Core Engine — funciones puras, sin React
│   ├── shift-calculator/
│   │   ├── shift-calculator.ts         # Calculo de turno para una fecha
│   │   ├── shift-calculator.test.ts    # Tests unitarios
│   │   └── types.ts                    # Tipos del dominio de turnos
│   ├── url-sharing/
│   │   ├── encoder.ts            # Serializar config → Base64
│   │   ├── decoder.ts            # Base64 → config (con validacion)
│   │   ├── url-sharing.test.ts
│   │   └── types.ts
│   ├── contrast/
│   │   ├── wcag-contrast.ts      # Evaluacion de contraste WCAG
│   │   └── wcag-contrast.test.ts
│   └── validation/
│       ├── config-validator.ts   # Validacion de configuraciones
│       └── config-validator.test.ts
│
├── stores/                       # Zustand stores
│   ├── config-store.ts           # Configuraciones de turno (default + adicionales)
│   ├── ui-store.ts               # Estado de UI (mes actual, vista expandida, etc.)
│   └── theme-store.ts            # Tema (dark/light) y preferencias visuales
│
├── features/                     # Modulos de UI por feature
│   ├── calendar/
│   │   ├── components/
│   │   │   ├── CalendarGrid.tsx
│   │   │   ├── DayCell.tsx
│   │   │   ├── DayExpanded.tsx
│   │   │   ├── MonthHeader.tsx
│   │   │   └── NavigationHints.tsx
│   │   ├── hooks/
│   │   │   ├── useCalendarNavigation.ts
│   │   │   └── useSwipeGestures.ts
│   │   └── index.ts              # Barrel export
│   │
│   ├── config/
│   │   ├── components/
│   │   │   ├── ShiftConfigForm.tsx
│   │   │   ├── SchemeSelector.tsx
│   │   │   ├── TimeEntryInput.tsx
│   │   │   ├── ConfigList.tsx
│   │   │   └── ConfigCard.tsx
│   │   ├── hooks/
│   │   │   └── useConfigActions.ts
│   │   └── index.ts
│   │
│   ├── search/
│   │   ├── components/
│   │   │   ├── DateSearch.tsx
│   │   │   └── SearchResult.tsx
│   │   └── index.ts
│   │
│   ├── sharing/
│   │   ├── components/
│   │   │   ├── ShareButton.tsx
│   │   │   └── ImportConfig.tsx
│   │   ├── hooks/
│   │   │   └── useImportFromUrl.ts
│   │   └── index.ts
│   │
│   ├── onboarding/
│   │   ├── components/
│   │   │   ├── SwipeAnimation.tsx
│   │   │   ├── ConfigBanner.tsx
│   │   │   └── HelpOverlay.tsx
│   │   ├── hooks/
│   │   │   └── useOnboardingState.ts
│   │   └── index.ts
│   │
│   ├── feedback/
│   │   ├── components/
│   │   │   └── FeedbackForm.tsx
│   │   ├── hooks/
│   │   │   └── useFeedbackCooldown.ts
│   │   └── index.ts
│   │
│   ├── theme/
│   │   ├── components/
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ColorPicker.tsx
│   │   └── index.ts
│   │
│   └── legal/
│       ├── pages/
│       │   ├── TermsPage.tsx
│       │   └── PrivacyPage.tsx
│       └── index.ts
│
├── shared/                       # Componentes y utilidades compartidas
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── LoadingDots.tsx       # Puntos suspensivos animados (RG-002)
│   │   ├── ErrorMessage.tsx      # Mensajes de error globales (RG-005)
│   │   ├── TabChangeNotice.tsx   # Notificacion de cambios entre pestanas
│   │   └── Layout.tsx
│   ├── hooks/
│   │   ├── useStorageEvent.ts    # Deteccion de cambios en otra pestana
│   │   └── useDebounce.ts
│   └── utils/
│       └── scroll-to-error.ts    # Scroll al primer error (RG-004)
│
├── i18n/
│   ├── config.ts                 # Configuracion de react-i18next
│   └── locales/
│       └── es/
│           ├── common.json       # Textos comunes
│           ├── calendar.json     # Textos del calendario
│           ├── config.json       # Textos de configuracion
│           ├── search.json       # Textos de busqueda
│           ├── feedback.json     # Textos de feedback
│           └── onboarding.json   # Textos de onboarding
│
└── main.tsx                      # Entry point
```

---

🤖 **AGENT RULES — Estructura de Proyecto**
- Respetar la estructura de directorios definida. No crear carpetas fuera de esta estructura sin autorizacion.
- `core/` contiene SOLO funciones puras de TypeScript. Sin imports de React, Zustand, ni acceso a APIs del navegador.
- `stores/` contiene SOLO Zustand stores. No colocar logica de negocio en los stores; los stores invocan funciones de `core/`.
- `features/` se organiza por feature. Cada feature tiene `components/`, opcionalmente `hooks/`, y un `index.ts` barrel export.
- `shared/` contiene componentes y hooks reutilizados por multiples features. No colocar logica de negocio aqui.
- Todos los textos visibles al usuario van en archivos JSON dentro de `i18n/locales/es/`. Usar `useTranslation()` en componentes.
- Cada archivo en `core/` debe tener su archivo `.test.ts` al lado.
- Barrel exports (`index.ts`) en cada feature para simplificar imports.

---

## 4. Diseno de Datos (localStorage Schema)

### 4.1 Modelo Conceptual

```
┌──────────────────────────┐
│    ShiftConfiguration    │
│──────────────────────────│
│  id: string (UUID)       │
│  isDefault: boolean      │
│  name: string | null     │  ← null para default ("Mi turno")
│  scheme: ShiftScheme     │
│  entryTime: string       │  ← "HH:mm" formato 24h interno
│  timeFormat: TimeFormat  │
│  cycleStartDate: string  │  ← "YYYY-MM-DD" ISO date
│  color: string           │  ← hex "#RRGGBB"
│  isActive: boolean       │
│──────────────────────────│
│  1 default (siempre)     │
│  0..10 adicionales       │
└──────────────────────────┘

┌──────────────────────────┐
│     AppPreferences       │
│──────────────────────────│
│  theme: "light" | "dark" │
│  firstDayOfWeek: 0 | 1   │  ← 0=domingo, 1=lunes
│  gridLineColor: string   │  ← hex "#RRGGBB"
│──────────────────────────│
│  Parte de config default │
└──────────────────────────┘

┌──────────────────────────┐
│     OnboardingFlags      │
│──────────────────────────│
│  animationSeen: boolean  │
│  bannerSeen: boolean     │
└──────────────────────────┘

┌──────────────────────────┐
│    FeedbackCooldown      │
│──────────────────────────│
│  lastSentAt: number|null │  ← timestamp
└──────────────────────────┘
```

### 4.2 Tipos TypeScript del Dominio

```typescript
// core/shift-calculator/types.ts

type PresetScheme = "24x48" | "12x36" | "12x24" | "48x48";

interface CustomScheme {
  type: "custom";
  workHours: number;   // 12-72, entero
  restHours: number;   // 12-72, entero
}

type ShiftScheme = PresetScheme | CustomScheme;

type TimeFormat = "12h" | "24h" | "military";

interface ShiftConfiguration {
  id: string;                    // UUID v4
  isDefault: boolean;
  name: string | null;           // null para default
  scheme: ShiftScheme;
  entryTime: string;             // "HH:mm" — almacenamiento interno siempre en 24h
  timeFormat: TimeFormat;        // formato de visualizacion preferido
  cycleStartDate: string;        // "YYYY-MM-DD" ISO
  color: string;                 // "#RRGGBB"
  isActive: boolean;             // default siempre true
}

// Resultado del calculo de turno para una fecha
type ShiftStatus =
  | { type: "entry"; time: string }       // Dia de entrada con hora
  | { type: "exit"; time: string }        // Dia de salida con hora
  | { type: "on_duty" }                   // En turno (dia intermedio)
  | { type: "off_duty" };                 // Franco

interface DayShiftResult {
  configId: string;
  configName: string | null;
  color: string;
  status: ShiftStatus;
}
```

### 4.3 Esquema de localStorage

La aplicacion usa **cuatro keys** en localStorage, manejadas por stores de Zustand independientes:

| Key | Store | Contenido | Descripcion |
|---|---|---|---|
| `dod-configs` | `config-store` | `ShiftConfiguration[]` | Array de todas las configuraciones (default + adicionales) |
| `dod-preferences` | `theme-store` | `AppPreferences` | Tema, primer dia de semana, color de lineas |
| `dod-onboarding` | (lectura directa) | `OnboardingFlags` | Flags de onboarding visto |
| `dod-feedback-cooldown` | (lectura directa) | `FeedbackCooldown` | Timestamp del ultimo envio de feedback |

**Prefijo `dod-`** para evitar colisiones con otros sitios en el mismo dominio.

### 4.4 Estado Inicial (Sin Configuracion Previa)

Cuando el usuario abre la app por primera vez, localStorage esta vacio. El sistema inicializa:

```typescript
// Estado default inicial
const defaultConfig: ShiftConfiguration = {
  id: generateUUID(),
  isDefault: true,
  name: null,
  scheme: "24x48",
  entryTime: "08:00",
  timeFormat: "24h",
  cycleStartDate: getTodayISO(),  // "YYYY-MM-DD" del dia actual
  color: "#2563EB",               // Azul por defecto (visible en ambos temas)
  isActive: true,
};

const defaultPreferences: AppPreferences = {
  theme: "light",
  firstDayOfWeek: 0,             // Domingo
  gridLineColor: "#E5E7EB",     // Gris claro
};
```

### 4.5 Esquema de URL para Compartir

```
https://app.dateonduty.com/?cfg=eyJzIjoiMjR4NDgiLCJlIjoiMDg6MDAiLCJkIjoiMjAyNi0wMi0yMCIsImMiOiIjMjU2M0VCIn0=
```

Objeto serializado antes de Base64:

```typescript
// core/url-sharing/types.ts

interface SharedConfigPayload {
  s: string;          // scheme: "24x48" | "12x36" | "12x24" | "48x48" | "CwHrH:wHrH" (custom: "C12:24")
  e: string;          // entryTime: "08:00"
  d: string;          // cycleStartDate: "2026-02-20"
  c: string;          // color: "#2563EB"
}
```

**Encoding:** `btoa(JSON.stringify(payload))`
**Decoding:** `JSON.parse(atob(cfgParam))` con validacion completa de cada campo.

Para esquemas personalizados, el campo `s` usa el formato `C{workHours}:{restHours}` (ej: `"C12:24"`). Los esquemas predeterminados usan su nombre directo.

---

🤖 **AGENT RULES — Datos y localStorage**
- Prefijo `dod-` en todas las keys de localStorage.
- Las cuatro keys son: `dod-configs`, `dod-preferences`, `dod-onboarding`, `dod-feedback-cooldown`.
- `dod-configs` almacena un array de `ShiftConfiguration`. El primer elemento es siempre la config default (`isDefault: true`).
- `entryTime` se almacena SIEMPRE en formato "HH:mm" de 24 horas internamente. La propiedad `timeFormat` solo afecta la visualizacion.
- `cycleStartDate` se almacena SIEMPRE en formato ISO "YYYY-MM-DD".
- Para esquemas preset, `scheme` es un string literal: `"24x48"`, `"12x36"`, `"12x24"`, `"48x48"`.
- Para esquemas custom, `scheme` es un objeto `{ type: "custom", workHours: number, restHours: number }`.
- La config default NUNCA tiene `isActive: false`. Si se intenta, ignorar silenciosamente.
- El limite de configs adicionales es 10. Validar en el store antes de agregar.
- Nombres de configs adicionales deben ser unicos (case-insensitive).
- La URL de compartir usa `?cfg=` con Base64 de un objeto JSON minificado. Campos: `s`, `e`, `d`, `c`.
- Al decodificar URL, validar TODOS los campos. Si alguno falla, mostrar mensaje de link invalido.
- Al generar UUID, usar `crypto.randomUUID()` (soportado en todos los navegadores modernos).

---

## 5. Core Engine — Modulo de Calculo de Turnos

### 5.1 Algoritmo de Calculo

El calculo de turnos es el corazon de la aplicacion. Es una funcion pura que dado un `ShiftConfiguration` y una fecha objetivo, determina el `ShiftStatus`.

**Concepto:** Un turno rotativo es un ciclo infinito de `workHours` + `restHours` que se repite desde una fecha de inicio. Para cualquier fecha, se calcula cuantas horas han transcurrido desde el inicio del ciclo y se determina la posicion dentro del ciclo actual.

```
Ciclo total = workHours + restHours
Horas desde inicio = diferencia entre cycleStartDate+entryTime y fecha objetivo
Posicion en ciclo = horasDesdeInicio % cicloTotal

Si posicion < workHours → en turno
Si posicion >= workHours → en franco
```

### 5.2 Pseudocodigo

```
funcion calcularTurno(config, fechaObjetivo):
    // 1. Obtener parametros del esquema
    { workHours, restHours } = resolverEsquema(config.scheme)
    cicloTotal = workHours + restHours

    // 2. Calcular punto de origen en horas absolutas
    origen = parsearFechaHora(config.cycleStartDate, config.entryTime)

    // 3. Calcular inicio y fin del dia objetivo (00:00 a 23:59)
    inicioDia = fechaObjetivo a las 00:00
    finDia = fechaObjetivo a las 23:59

    // 4. Determinar el estado del turno en cada punto relevante del dia
    // Un dia puede tener entrada, salida, estar completamente en turno,
    // o estar completamente en franco.

    // 5. Calcular horas desde el origen hasta el inicio del dia
    horasDesdeOrigen = diferenciaEnHoras(origen, inicioDia)

    // 6. Normalizar a posicion dentro del ciclo (soporta valores negativos para fechas antes del origen)
    posicionInicioDia = moduloPositivo(horasDesdeOrigen, cicloTotal)

    // 7. Determinar eventos en el dia
    // Buscar si hay una transicion trabajo→descanso o descanso→trabajo dentro de las 24h del dia
    // Esto determina si es dia de entrada, salida, en turno, o franco

    retornar ShiftStatus con hora de entrada/salida si aplica
```

### 5.3 Resolucion de Esquemas Predeterminados

| Esquema | workHours | restHours | cicloTotal |
|---|---|---|---|
| 24x48 | 24 | 48 | 72 |
| 12x36 | 12 | 36 | 48 |
| 12x24 | 12 | 24 | 36 |
| 48x48 | 48 | 48 | 96 |

### 5.4 Consideraciones de Performance

- El calculo para una fecha individual es O(1) — operaciones aritmeticas simples.
- Para renderizar un mes completo se realizan 28-31 calculos, todos O(1). Rendimiento no es un problema.
- Para fechas muy lejanas en el pasado/futuro: el modulo usa aritmetica de modulo, no iteracion. No hay degradacion de rendimiento independientemente de la distancia temporal.
- Los calculos usan **horas absolutas**. No se aplica ajuste por horario de verano. Todos los dias tienen exactamente 24 horas para efectos de calculo.

### 5.5 Zona Horaria en MVP

El calculo trabaja en horas absolutas:
- `cycleStartDate` + `entryTime` define un punto de origen abstracto.
- Las diferencias se calculan en horas nominales (1 dia = 24 horas siempre).
- No se consulta `Intl.DateTimeFormat` ni `Date.getTimezoneOffset()` para calculos de turno.

**Preparacion para v3.0:** La firma de la funcion de calculo puede extenderse con un parametro `timezone?: string` sin romper la interfaz existente. En MVP este parametro no existe.

---

🤖 **AGENT RULES — Calculo de Turnos**
- La funcion de calculo de turno es PURA: recibe `(config: ShiftConfiguration, targetDate: string)` y retorna `ShiftStatus`. Sin side effects.
- Usar aritmetica de modulo para posicionar la fecha dentro del ciclo. NUNCA iterar dia por dia desde el origen.
- `moduloPositivo(a, b)` = `((a % b) + b) % b` — necesario para soportar fechas antes del origen.
- Un dia puede contener multiples transiciones (entrada y salida el mismo dia si workHours < 24). Manejar todos los casos.
- Los esquemas preset se resuelven a `{ workHours, restHours }` al inicio del calculo.
- Todos los calculos asumen 1 dia = 24 horas exactas. NO consultar timezone del sistema.
- `date-fns/differenceInHours` o calculo manual de diferencia en milisegundos. Ambos son aceptables.
- Los tests del calculo de turnos deben cubrir: fecha exacta de inicio, dia de franco, dia intermedio de turno largo, turno que cruza medianoche, ano bisiesto (29 feb), fecha muy lejana en pasado/futuro, fecha antes del origen configurado.

---

## 6. Gestion de Estado (Zustand Stores)

### 6.1 config-store

Responsable de: todas las configuraciones de turno.

```typescript
interface ConfigStore {
  // Estado
  configs: ShiftConfiguration[];

  // Acciones
  getDefaultConfig: () => ShiftConfiguration;
  getActiveConfigs: () => ShiftConfiguration[];
  updateConfig: (id: string, updates: Partial<ShiftConfiguration>) => void;
  addConfig: (config: Omit<ShiftConfiguration, "id">) => void;
  removeConfig: (id: string) => void;
  promoteToDefault: (id: string, oldDefaultName: string) => void;
  toggleActive: (id: string) => void;
  importFromUrl: (payload: SharedConfigPayload, asDefault: boolean, name?: string) => void;
}
```

**Persistencia:** Middleware `persist` de Zustand con key `dod-configs`.

### 6.2 theme-store

Responsable de: preferencias visuales globales.

```typescript
interface ThemeStore {
  // Estado
  theme: "light" | "dark";
  firstDayOfWeek: 0 | 1;
  gridLineColor: string;

  // Acciones
  setTheme: (theme: "light" | "dark") => void;
  setFirstDayOfWeek: (day: 0 | 1) => void;
  setGridLineColor: (color: string) => void;
}
```

**Persistencia:** Middleware `persist` con key `dod-preferences`.

### 6.3 ui-store

Responsable de: estado transitorio de la interfaz. **No se persiste.**

```typescript
interface UIStore {
  // Estado
  currentMonth: number;          // 0-11
  currentYear: number;
  expandedDay: string | null;    // "YYYY-MM-DD" o null
  helpActive: boolean;

  // Acciones
  navigateMonth: (delta: number) => void;
  navigateYear: (delta: number) => void;
  goToToday: () => void;
  setExpandedDay: (date: string | null) => void;
  toggleHelp: () => void;
}
```

---

🤖 **AGENT RULES — Zustand Stores**
- Cada store es independiente. No crear un mega-store con todo el estado.
- `config-store` y `theme-store` usan middleware `persist`. `ui-store` NO persiste.
- Los stores no contienen logica de calculo de turnos. Invocan funciones de `core/shift-calculator/`.
- Al agregar una config, validar el limite de 10 adicionales DENTRO del store (no en el componente).
- Al promover a default, la operacion es atomica: la nueva default se marca `isDefault: true, name: null, isActive: true` y la anterior default se marca `isDefault: false` con el nombre proporcionado.
- `ui-store.currentMonth` y `currentYear` se inicializan con la fecha actual del sistema al cargar.
- `expandedDay` es la unica fuente de verdad para saber si la vista expandida esta abierta.

---

## 7. Rutas de la Aplicacion

### 7.1 Definicion de Rutas

| Ruta | Componente | Descripcion |
|---|---|---|
| `/` | CalendarPage | Pagina principal con calendario. Maneja `?cfg=` si esta presente. |
| `/config` | ConfigPage | Gestion de configuraciones de turno. |
| `/config/:id` | ConfigDetailPage | Edicion de una configuracion especifica. |
| `/search` | SearchPage | Busqueda por fecha. |
| `/feedback` | FeedbackPage | Formulario de feedback. |
| `/terms` | TermsPage | Terminos y Condiciones. |
| `/privacy` | PrivacyPage | Politica de Privacidad. |

### 7.2 Manejo de `?cfg=` en URL

Cuando el usuario abre una URL con parametro `?cfg=`:

1. El componente raiz de la ruta `/` detecta el parametro via `useSearchParams`.
2. Se invoca `decoder.decode(cfgParam)` del Core Engine.
3. Si la decodificacion falla → se muestra mensaje de link invalido.
4. Si es valida → se muestra un modal/drawer preguntando al usuario que desea hacer con la configuracion recibida.
5. Despues de la accion del usuario, se limpia el parametro `?cfg=` de la URL sin recargar la pagina.

---

🤖 **AGENT RULES — Rutas**
- Usar `createBrowserRouter` de React Router 7.
- La ruta `/` es el calendario. Es la pagina principal.
- El parametro `?cfg=` SOLO se procesa en la ruta `/`.
- Despues de procesar `?cfg=`, limpiar el parametro de la URL con `navigate("/", { replace: true })`.
- Las paginas legales (`/terms`, `/privacy`) son paginas estaticas con contenido en espanol.
- Toda navegacion interna usa `<Link>` de React Router o `useNavigate`. No usar `<a href>` para rutas internas.

---

## 8. Sistema de Temas (Dark/Light Mode)

### 8.1 Estrategia

Tailwind CSS con clase `dark` en el elemento `<html>`:

```html
<!-- Modo claro -->
<html lang="es">

<!-- Modo oscuro -->
<html lang="es" class="dark">
```

### 8.2 Implementacion

1. El `theme-store` guarda la preferencia del usuario.
2. Al cargar la app, se lee el store (que se hidrató desde localStorage via middleware `persist`).
3. Se aplica/remueve la clase `dark` en `document.documentElement`.
4. Los componentes usan clases de Tailwind con prefijo `dark:` para variantes oscuras.

```tsx
// Ejemplo de uso en componente
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

### 8.3 Colores del Sistema

No se define la paleta exacta (responsabilidad del UX/UI Designer), pero la arquitectura establece:

- Los colores base de la interfaz (fondos, textos, bordes) se definen como CSS custom properties extendidas en Tailwind config.
- Los colores de configuracion de turno son dinamicos (elegidos por el usuario) y se aplican via `style` inline, no via clases de Tailwind.
- La evaluacion de contraste WCAG se realiza en `core/contrast/wcag-contrast.ts` comparando el color del turno contra el color de fondo del tema activo.

---

🤖 **AGENT RULES — Temas**
- Dark mode se controla UNICAMENTE via clase `dark` en `<html>`. No usar `prefers-color-scheme` media query.
- El tema NO se detecta automaticamente del sistema operativo. El usuario lo elige manualmente. Default: `"light"`.
- Para colores de turno dinamicos (user-selected), usar `style={{ backgroundColor: color }}` directamente. No generar clases de Tailwind dinamicas.
- Al cambiar el tema, actualizar la clase en `document.documentElement` de forma sincrona. No recargar la pagina.
- La evaluacion WCAG compara el color de turno contra `#FFFFFF` (fondo claro) o `#111827` (fondo oscuro, `gray-900`). Los valores exactos del fondo se definen en la config de Tailwind y se comparten con la funcion de contraste.

---

## 9. Sistema de i18n

### 9.1 Estrategia

Todos los textos visibles al usuario se externalizan en archivos JSON organizados por feature. En MVP solo se implementa el locale `es` (espanol). La arquitectura permite agregar locales adicionales en v3.0 sin cambios estructurales.

### 9.2 Configuracion

```typescript
// i18n/config.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEs from "./locales/es/common.json";
import calendarEs from "./locales/es/calendar.json";
// ... otros namespaces

i18n.use(initReactI18next).init({
  lng: "es",
  fallbackLng: "es",
  ns: ["common", "calendar", "config", "search", "feedback", "onboarding"],
  defaultNS: "common",
  resources: {
    es: {
      common: commonEs,
      calendar: calendarEs,
      // ...
    },
  },
  interpolation: {
    escapeValue: false, // React ya escapa
  },
});
```

### 9.3 Uso en Componentes

```tsx
const { t } = useTranslation("calendar");
return <h1>{t("monthHeader", { month: monthName, year })}</h1>;
```

---

🤖 **AGENT RULES — i18n**
- TODOS los textos visibles al usuario usan `t()` de react-i18next. Cero strings hardcodeados en JSX.
- Los archivos de traduccion estan en `src/i18n/locales/es/`. Un JSON por namespace.
- Namespaces: `common`, `calendar`, `config`, `search`, `feedback`, `onboarding`.
- Las keys de traduccion usan camelCase: `t("configSaved")`, `t("invalidLink")`.
- Para textos con variables usar interpolacion: `t("waitSeconds", { seconds: 30 })` → `"Por favor espera 30 segundos..."`.
- NO crear archivos de traduccion para otros idiomas en MVP.
- Los mensajes de error de validacion tambien van en archivos de traduccion.

---

## 10. Deteccion de Cambios entre Pestanas

### 10.1 Mecanismo

Se usa el evento nativo `storage` de `window`. Este evento se dispara en OTRAS pestanas del mismo origen cuando una pestana escribe en localStorage.

```typescript
// shared/hooks/useStorageEvent.ts
window.addEventListener("storage", (event) => {
  if (event.key?.startsWith("dod-")) {
    // Notificar al usuario que hay cambios pendientes
  }
});
```

### 10.2 Flujo

1. Pestana A modifica una configuracion → Zustand persiste en localStorage.
2. Pestana B recibe evento `storage` con la key modificada.
3. Pestana B muestra notificacion: "Hay cambios pendientes. [Actualizar]".
4. Si el usuario hace click en "Actualizar", se recargan los stores desde localStorage.
5. Si ignora la notificacion, la pestana sigue con datos stale.

### 10.3 Descartado

- **BroadcastChannel API:** Mas potente pero innecesario. El evento `storage` cubre el caso de uso con menos complejidad.

---

🤖 **AGENT RULES — Pestanas**
- Usar UNICAMENTE el evento `storage` de `window` para detectar cambios en otras pestanas. NO usar BroadcastChannel.
- El listener de `storage` se registra UNA vez en un hook global (`useStorageEvent`), no en cada componente.
- Solo reaccionar a keys con prefijo `dod-`.
- La recarga de datos se hace invocando los metodos de rehidratacion de cada store de Zustand, no haciendo `window.location.reload()`.
- La notificacion es no intrusiva y no bloquea la interaccion del usuario.

---

## 11. Integracion con Formspree (Feedback)

### 11.1 Flujo

1. Usuario llena el formulario: email (obligatorio) + mensaje (obligatorio).
2. Validacion de formato de email en frontend (regex basico).
3. Verificar cooldown de 1 minuto en localStorage (`dod-feedback-cooldown`).
4. Si pasa validacion y cooldown, enviar POST a endpoint de Formspree.
5. Mostrar estado de carga (puntos suspensivos animados, RG-002).
6. Si exito → mostrar confirmacion, guardar timestamp de cooldown.
7. Si error → mostrar mensaje de error de conexion (RG-005).
8. Timeout de 30 segundos con mensaje intermedio a los 10 segundos (RG-003).

### 11.2 Request

```
POST https://formspree.io/f/{FORM_ID}
Content-Type: application/json

{
  "email": "usuario@example.com",
  "_subject": "DateOnDuty Feedback",
  "message": "Texto del usuario..."
}
```

### 11.3 Seguridad

- El `FORM_ID` de Formspree se almacena como variable de entorno de Vite (`VITE_FORMSPREE_ID`).
- Formspree tiene proteccion anti-spam integrada (honeypot, reCAPTCHA opcional).
- El cooldown de 1 minuto es client-side y se resetea si el usuario borra localStorage o recarga. Es una medida de UX, no de seguridad.

---

🤖 **AGENT RULES — Feedback**
- El endpoint de Formspree se construye con `import.meta.env.VITE_FORMSPREE_ID`. No hardcodear el ID.
- El cooldown se lee/escribe en `dod-feedback-cooldown` como un timestamp (`Date.now()`).
- El cooldown es de 60 segundos. Se reinicia al recargar la pagina. Limitacion conocida aceptada.
- Usar `fetch` nativo para el POST. No agregar Axios ni otra libreria HTTP.
- El timeout de 30 segundos se implementa con `AbortController` y `signal` en `fetch`.
- Respetar RG-002 (puntos animados), RG-003 (timeout), RG-005 (error de conexion) en la UI del formulario.

---

## 12. Requisitos No Funcionales

### 12.1 Seguridad

| Aspecto | Estrategia |
|---|---|
| **XSS** | React escapa contenido por defecto. No usar `dangerouslySetInnerHTML`. Los colores hex se validan con regex antes de aplicarse al DOM. |
| **URL Injection** | El parametro `?cfg=` se valida exhaustivamente antes de procesar. Valores invalidos se rechazan sin ejecutar logica. |
| **Datos sensibles** | No se almacenan credenciales ni datos sensibles en MVP. localStorage contiene solo configuraciones de turno. |
| **Dependencias** | Mantener dependencias actualizadas. Usar `npm audit` en CI. |
| **CSP** | Configurar Content Security Policy en Cloudflare Pages para restringir fuentes de scripts y conexiones. |
| **HTTPS** | Cloudflare Pages sirve HTTPS por defecto. No se permite HTTP. |

### 12.2 Performance

| Metrica | Objetivo |
|---|---|
| **First Contentful Paint (FCP)** | < 1.5s en 4G |
| **Largest Contentful Paint (LCP)** | < 2.5s en 4G |
| **Time to Interactive (TTI)** | < 3s en 4G |
| **Bundle size (gzipped)** | < 150KB total |

**Estrategias:**
- Vite tree-shaking elimina codigo no usado.
- Lazy loading de rutas secundarias (`React.lazy` para `/config`, `/search`, `/feedback`, `/terms`, `/privacy`).
- La ruta principal (`/`) carga inline sin lazy para minimizar TTI.
- Sin imagenes pesadas. Iconos via SVG inline o libreria de iconos tree-shakeable (lucide-react).
- date-fns se importa por funcion individual, no como bundle completo.

### 12.3 Escalabilidad

El MVP es un sitio estatico. La escalabilidad la provee Cloudflare Pages de forma transparente (CDN global, cache automatico).

Para v2.0, cuando se agregue backend:
- El frontend sigue siendo estatico en Cloudflare Pages.
- El backend se despliega en AWS (arquitectura a definir en v2.0).
- La separacion frontend/backend permite escalar cada capa independientemente.

### 12.4 Accesibilidad (A11y)

- Navegacion por teclado funcional en todos los elementos interactivos.
- Roles ARIA en componentes de calendario y modales.
- Contraste WCAG AA como minimo para elementos de la interfaz base (no para colores de turno del usuario, que son advertidos pero no forzados).
- `lang="es"` en el `<html>`.
- Labels en todos los inputs de formularios.

### 12.5 Compatibilidad de Navegadores

| Navegador | Version minima |
|---|---|
| Chrome | 90+ |
| Safari | 15+ |
| Firefox | 90+ |
| Edge | 90+ |
| Samsung Internet | 15+ |

Justificacion: Estas versiones soportan `crypto.randomUUID()`, CSS `gap`, `aspect-ratio`, y otras APIs modernas necesarias. Cubren >95% del mercado mexicano/LATAM.

---

🤖 **AGENT RULES — Requisitos No Funcionales**
- NUNCA usar `dangerouslySetInnerHTML`.
- Todos los colores hex del usuario se validan con `/^#[0-9A-Fa-f]{6}$/` antes de usarse en el DOM.
- El parametro `?cfg=` se valida con try/catch en el decode Y validacion de cada campo del objeto resultante.
- Lazy loading con `React.lazy()` para todas las rutas excepto `/` (calendario).
- Importar funciones de date-fns individualmente: `import { addMonths } from "date-fns"`, no `import * as dateFns from "date-fns"`.
- Usar `lucide-react` para iconos. No agregar Font Awesome ni similares.
- Todos los `<button>`, `<input>`, `<select>` deben ser accesibles por teclado con focus visible.
- Dialogos/modales usan `<dialog>` nativo o implementan trap de focus manual.

---

## 13. Gestos y Navegacion del Calendario

### 13.1 Mapeo de Gestos

| Gesto | Accion | Contexto |
|---|---|---|
| Swipe vertical hacia abajo | Mes siguiente | Calendario principal |
| Swipe vertical hacia arriba | Mes anterior | Calendario principal |
| Swipe horizontal hacia derecha | Ano siguiente | Calendario principal |
| Swipe horizontal hacia izquierda | Ano anterior | Calendario principal |
| Swipe horizontal derecha | Dia siguiente | Vista expandida |
| Swipe horizontal izquierda | Dia anterior | Vista expandida |
| Swipe vertical abajo | Mes siguiente | Vista expandida |
| Swipe vertical arriba | Mes anterior | Vista expandida |
| Tap/Click en dia | Abrir vista expandida | Calendario principal |

### 13.2 Implementacion

Se usa `@use-gesture/react` para detectar gestos de swipe. El umbral minimo de distancia para registrar un swipe se configura en 50px para evitar falsos positivos.

Los gestos se combinan con controles de boton (flechas) para usuarios que prefieren clicks o navegan desde desktop.

---

🤖 **AGENT RULES — Gestos**
- Usar `@use-gesture/react` hook `useDrag` para deteccion de swipe.
- Umbral de swipe: 50px minimo de distancia Y velocidad minima de 0.3.
- Cada gesto de swipe ejecuta una sola accion (no acumular multiples navegaciones).
- Proveer botones de navegacion como alternativa a gestos para accesibilidad y desktop.
- Deshabilitar scroll nativo del navegador en el area del calendario durante un gesto activo para evitar conflictos.
- La animacion de transicion entre meses/anos es responsabilidad del UX/UI. Desde arquitectura, proveer un callback `onNavigate` que el componente de animacion pueda consumir.

---

## 14. Reglas Globales de UI — Implementacion Tecnica

### 14.1 RG-001: Botones Siempre Clicables

Implementacion: Los botones de guardado NO usan el atributo `disabled`. La validacion se ejecuta al hacer click. Los errores se muestran despues del intento.

### 14.2 RG-002: Puntos Suspensivos Animados

Componente compartido `<LoadingDots />` que se renderiza dentro del boton durante el estado de carga. El boton internamente bloquea re-ejecuciones con un flag booleano (debounce logico), sin cambiar su apariencia visual.

### 14.3 RG-003: Timeout con Mensajes

Toda operacion asincrona (solo Formspree en MVP) implementa:
- Timer de 10 segundos → mostrar mensaje "Esto esta tomando mas tiempo de lo usual..."
- Timer de 30 segundos → abortar request, mostrar error, restaurar boton.

### 14.4 RG-004: Scroll al Primer Error

Funcion utilitaria en `shared/utils/scroll-to-error.ts`:
```typescript
function scrollToFirstError(): void {
  const firstError = document.querySelector("[data-error='true']");
  if (firstError) {
    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
```

Los campos con error se marcan con `data-error="true"`.

### 14.5 RG-006: Textos Truncados

Uso de clases de Tailwind: `truncate` (para una linea) con `title` attribute para tooltip nativo.

### 14.6 RG-007: Advertencia de Contraste

Se invoca `core/contrast/wcag-contrast.ts` al seleccionar un color. Si el ratio de contraste es inferior a 4.5:1 (WCAG AA), se muestra una advertencia no bloqueante debajo del color picker.

---

🤖 **AGENT RULES — Reglas Globales de UI**
- Los botones de accion principal NUNCA tienen `disabled={true}`. NUNCA.
- El debounce de botones es un flag en estado local (`isSubmitting`). El boton se ve identico pero ignora clicks adicionales.
- `<LoadingDots />` es un componente en `shared/components/`. Se reutiliza en todo formulario con accion asincrona.
- Los campos con error de validacion usan `data-error="true"` en su wrapper para que `scrollToFirstError()` los encuentre.
- El timeout de 30 segundos usa `AbortController`. El timer de 10 segundos usa `setTimeout`.
- Para truncado de texto: usar clase `truncate` de Tailwind + atributo `title` con el texto completo.
- La advertencia de contraste se calcula con la formula de relative luminance de WCAG 2.1. Ratio minimo: 4.5:1 para AA.

---

## 15. Onboarding — Logica de Flags

### 15.1 Flujo

```
Usuario abre la app por primera vez
        │
        ▼
¿dod-onboarding.animationSeen === true?
        │
    NO ──┤── SI → no mostrar onboarding
        │
        ▼
Mostrar animacion + banner simultaneamente
Timer de 50 segundos inicia
        │
        ▼
¿Timer llego a 50s sin que el usuario cierre el navegador?
        │
    SI ──┤── NO → no guardar flag, mostrar de nuevo la proxima vez
        │
        ▼
Guardar dod-onboarding = { animationSeen: true, bannerSeen: true }
Banner desaparece. Animacion desaparece segun criterio UX.
```

### 15.2 Regla del Flag

El flag se guarda CUANDO el contenido desaparece naturalmente (50 segundos cumplidos), NO cuando aparece. Si el usuario cierra el navegador/pestana antes de los 50 segundos, el flag no se guarda y el onboarding se muestra de nuevo.

---

🤖 **AGENT RULES — Onboarding**
- Los flags de onboarding se leen/escriben directamente en localStorage (`dod-onboarding`), no a traves de Zustand persist.
- El flag se guarda SOLO cuando el timer de 50 segundos se completa. Usar `setTimeout(50000)` y guardar en el callback.
- Si el componente se desmonta antes de los 50 segundos (navegacion, cierre), el flag NO se guarda. Limpiar el timeout en el cleanup de `useEffect`.
- El banner es clickeable y navega a `/config`. El click NO guarda el flag (el flag se guarda solo por timeout).
- El boton de ayuda (siempre visible) es independiente del onboarding. Tiene su propia logica sin flags.

---

## 16. Decisiones Tecnicas Clave y Trade-offs

### 16.1 Resumen de Decisiones

| Decision | Alternativa descartada | Razon |
|---|---|---|
| React sobre Angular | Angular (experiencia del equipo) | LLM-friendliness como criterio dominante. Claude genera React con mayor precision. |
| Vite sobre Next.js | Next.js (SSR/SSG) | No se necesita servidor. Next.js agrega complejidad innecesaria (Server Components, hydration). |
| Zustand sobre Redux | Redux Toolkit | Menos boilerplate. API mas simple. Middleware persist integrado. Suficiente para la complejidad del MVP. |
| localStorage sobre IndexedDB | IndexedDB | Los datos son pequenos (< 50KB). localStorage es sincrono, simple, y suficiente. IndexedDB agrega complejidad asincrona innecesaria. |
| Evento `storage` sobre BroadcastChannel | BroadcastChannel API | `storage` cubre el caso de uso exacto (sincronizar datos de localStorage entre pestanas) sin API adicional. |
| Horas absolutas | Calculo con zonas horarias | Simplicidad del MVP. Los calculos son correctos para el 99% de los casos. DST es un edge case documentado para v3.0. |
| Base64 para URL sharing | URL-safe encoding personalizado | Base64 es estandar, bien soportado, y `btoa`/`atob` son nativos del navegador. |
| Tailwind sobre CSS Modules | CSS Modules, styled-components | Productividad con IA. Los LLMs generan Tailwind utilities de forma mas consistente que CSS arbitrario. |

### 16.2 Riesgos Tecnicos

| Riesgo | Probabilidad | Impacto | Mitigacion |
|---|---|---|---|
| localStorage borrado por el usuario | Alta | Medio | Documentar como limitacion. v2.0 agrega persistencia en nube. |
| Longitud de URL compartida excesiva | Baja | Bajo | Los datos compartidos son minimos (~100 caracteres en Base64). No hay riesgo real de exceder limites de URL. |
| Incompatibilidad de gestos en navegadores antiguos | Baja | Medio | @use-gesture tiene fallbacks. Controles de boton como alternativa. Navegadores target son modernos (90+). |
| Bundle size supera 150KB | Baja | Bajo | Tree shaking de Vite + imports individuales de date-fns. Monitorear con `vite-plugin-visualizer`. |

### 16.3 Deuda Tecnica Aceptada en MVP

1. **Sin tests E2E:** Se cubren unitarios e integracion. E2E se agrega cuando haya backend (v2.0).
2. **Sin error boundary global:** Se implementa un error boundary basico de React, pero no hay servicio de monitoreo (Sentry) en MVP.
3. **Sin analytics:** No se integra Google Analytics ni similar. Se considera para post-MVP.
4. **Sin service worker:** No es PWA. Sin cache offline. El sitio requiere conexion para cargar (pero no para funcionar una vez cargado, excepto feedback).
5. **Cooldown de feedback bypassable:** El cooldown es client-side y se puede saltear borrando localStorage. Formspree tiene sus propias protecciones.

---

🤖 **AGENT RULES — Decisiones Generales**
- NO agregar SSR, SSG, ni Server Components en MVP.
- NO agregar Redux, MobX, Recoil, ni Jotai. Zustand es el unico state manager.
- NO agregar IndexedDB, Web SQL, ni cookies para almacenamiento. Solo localStorage.
- NO agregar Sentry, DataDog, ni servicios de monitoreo en MVP.
- NO agregar Google Analytics, Mixpanel, ni servicios de analytics en MVP.
- NO agregar service worker ni funcionalidad offline en MVP.
- NO agregar tests E2E (Cypress, Playwright) en MVP. Solo unitarios y de integracion con Vitest.
- SIEMPRE documentar trade-offs y limitaciones conocidas como comentarios en el codigo cuando sean relevantes.
- El codigo debe compilar y pasar linting sin warnings antes de cada commit.

---

## 17. Pipeline de CI/CD

### 17.1 Flujo

```
Push a branch → GitHub Actions
        │
        ├── Lint (ESLint)
        ├── Format check (Prettier)
        ├── Type check (tsc --noEmit)
        └── Tests (Vitest)
              │
              ▼
        Merge a main
              │
              ▼
        Cloudflare Pages auto-deploy
              │
              ▼
        Sitio disponible en produccion
```

### 17.2 Configuracion

- **GitHub Actions** ejecuta el pipeline en cada push y PR.
- **Cloudflare Pages** tiene integracion nativa con GitHub. Al hacer merge a `main`, se dispara un deploy automatico.
- **Preview deploys:** Cloudflare Pages genera URLs de preview para cada PR, permitiendo revisar cambios antes de merge.

---

🤖 **AGENT RULES — CI/CD**
- El pipeline de CI corre: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test`.
- Todos los checks deben pasar antes de poder hacer merge.
- El deploy a produccion se dispara automaticamente al hacer merge a `main`.
- NO hacer deploy manual. Siempre via pipeline.
- Las variables de entorno (`VITE_FORMSPREE_ID`) se configuran en Cloudflare Pages, no en el repositorio.

---

## 18. Preparacion para v2.0

### 18.1 Puntos de Extension Arquitectonicos

El MVP se disena con los siguientes puntos de extension que no agregan complejidad ahora pero facilitan v2.0:

| Punto de extension | Como se prepara en MVP | Que habilita en v2.0 |
|---|---|---|
| **Capa de persistencia abstracta** | Los stores de Zustand encapsulan toda interaccion con localStorage. Ningun componente lee/escribe localStorage directamente. | Reemplazar la capa de persistencia por API calls sin cambiar componentes. |
| **Estructura de i18n** | Todos los textos en archivos de traduccion. | Agregar locales sin tocar componentes. |
| **Firma del Core Engine** | Funciones puras que reciben datos y retornan datos. | Agregar parametro `timezone` sin romper la interfaz. |
| **Autenticacion** | No existe en MVP, pero las rutas estan en React Router. | Agregar route guards y contexto de auth sin reestructurar. |

### 18.2 Lo que NO se prepara

- No se crea una capa de abstraccion de API ni service layer vacios. Se crean cuando se necesitan en v2.0.
- No se crea esquema de base de datos relacional ni modelos ORM. Eso se disena en v2.0.
- No se agrega ningun SDK de autenticacion (Firebase Auth, Auth0, etc.). La estrategia de auth se define en v2.0.

---

🤖 **AGENT RULES — Preparacion v2.0**
- NO crear archivos, carpetas, ni interfaces "placeholder" para funcionalidad futura.
- NO crear un `api/` layer, `services/` layer, ni `auth/` module en MVP.
- NO importar ni configurar librerias de autenticacion.
- La unica preparacion para v2.0 es mantener la arquitectura limpia: stores encapsulan persistencia, Core Engine es puro, i18n centralizado.
- Si una decision de diseno en MVP complicaria significativamente v2.0, documentarla como comentario TODO.

---

*Documento generado como parte del proceso de diseno arquitectonico de DateOnDuty. v1.0 — Febrero 2026*
*Proxima revision: al inicio de la fase de desarrollo con el equipo de implementacion.*
