# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DateOnDuty** is a frontend-only web app for rotating shift workers (24x48, 12x36, 48x48, etc.) to visualize their work calendar, query any date, and share their schedule. No backend in MVP (v1.0) — all logic runs in the browser with localStorage as the only persistence.

The project is in **implementation phase**. Design system is complete. Core Engine and Zustand stores are implemented. Feature components are not yet started.

The authoritative references are:
- `docs/DateOnDuty_PRD_v2.md` — product requirements and user stories
- `docs/DateOnDuty_Architecture_v1.md` — stack decisions, architecture rules, data schemas, and algorithm details
- `docs/DOD_DECISIONS_LOG.md` — all product and architecture decisions already taken (read before proposing changes; **add every new decision here immediately**, using the format defined at the top of that file)
- `docs/DOD_EDGE_CASES.md` — resolved edge cases and behavioral rules per epic (validation limits, color rules, onboarding timing, etc.)
- `docs/design/design-tokens.md` — CSS custom properties, Tailwind theme extension, color semantics
- `docs/design/animation-specs.md` — all animation/transition specs (durations, easings, keyframes). Source of truth over any component spec.
- `docs/design/i18n-namespaces.md` — complete i18n key map for all 6 namespaces

**Agent definitions:** role docs in `agents/`. Claude Code native agents in `.claude/agents/` (used automatically by Claude Code subagent invocations).

---

## Stack

| Technology | Version | Role |
|---|---|---|
| React | 19.x | UI framework |
| TypeScript | 5.x | Language (`strict: true`) |
| Vite | 6.x | Build tool (SPA only, no SSR) |
| Tailwind CSS | 4.x | Styling (dark mode via `dark` class on `<html>`) |
| Zustand | 5.x | State management with `persist` middleware |
| date-fns | 4.x | Date utilities (import individually, never as `* as`) |
| React Router | 7.x | Client-side routing (`createBrowserRouter`) |
| react-i18next | 15.x | i18n (all user-visible strings go through `t()`) |
| @use-gesture/react | 10.x | Swipe gesture detection |
| Vitest + React Testing Library | — | Testing |
| ESLint + Prettier | — | Lint/format |
| Husky + lint-staged | — | Pre-commit hooks |

**Hosting:** Cloudflare Pages (static), auto-deploy from `main` branch.

**Strictly prohibited additions:** Next.js, Redux, Axios, Moment.js, IndexedDB, BroadcastChannel, Sentry, analytics, service workers, or any SSR/SSG in MVP.

---

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run format:check # Prettier check
npm run typecheck    # tsc --noEmit
npm run test         # Vitest (all tests)
npm run test path/to/file.test.ts  # Run single test file
```

CI pipeline runs: `lint` → `format:check` → `typecheck` → `test` on every push. All must pass before merge to `main`.

---

## Architecture

### Three-Layer Pattern

```
UI Layer      → React components, pages, layouts, gestures, animations
State Layer   → Zustand stores (invoke Core Engine, persist to localStorage)
Core Engine   → Pure TypeScript functions (no React, no DOM, no localStorage)
```

**Dependency rule:** UI depends on State; State depends on Core. Core has zero dependencies on the layers above it.

### Project Structure

```
src/
├── app/           # Root component, router config, global providers
├── core/          # Pure TS functions only — shift calculator, URL encoder/decoder, WCAG contrast, validation
├── stores/        # Zustand stores: config-store, ui-store, theme-store
├── features/      # Feature slices: calendar, config, search, sharing, onboarding, feedback, theme, legal
│   └── <feature>/
│       ├── components/
│       ├── hooks/       (optional)
│       └── index.ts     (barrel export)
├── shared/        # Reusable components and hooks (Button, LoadingDots, ErrorMessage, useStorageEvent)
├── i18n/          # react-i18next config + locales/es/*.json (one JSON per namespace)
└── main.tsx
```

Every file under `core/` must have a sibling `.test.ts` file.

---

## Key Architectural Rules

### Core Engine (`src/core/`)
- Functions are **pure**: `(config, date) → result`. No side effects, no imports from React/Zustand/browser APIs.
- Shift calculation uses **modular arithmetic** (never iterate day-by-day from origin). `moduloPositivo(a, b) = ((a % b) + b) % b` to handle dates before origin.
- All calculations treat 1 day = 24 absolute hours. No timezone adjustments, no DST.
- UUID generation: `crypto.randomUUID()`.

### Stores (`src/stores/`)
- `config-store` and `theme-store` use Zustand `persist` middleware. `ui-store` is not persisted.
- Business logic (shift calculations) stays in `core/`, not in stores.
- No component reads/writes localStorage directly — always through stores or the two exceptions below.
- Two direct localStorage keys (not Zustand-managed): `dod-onboarding` (onboarding flags), `dod-feedback-cooldown` (timestamp).
- All localStorage keys use prefix `dod-`.

### Data Schema (localStorage)
| Key | Store | Content |
|---|---|---|
| `dod-configs` | `config-store` | `ShiftConfiguration[]` — first element is always the default config |
| `dod-preferences` | `theme-store` | `AppPreferences` (theme, firstDayOfWeek, gridLineColor) |
| `dod-onboarding` | direct | `{ animationSeen: boolean, bannerSeen: boolean }` |
| `dod-feedback-cooldown` | direct | `{ lastSentAt: number \| null }` |

`entryTime` is always stored as `"HH:mm"` (24h). `cycleStartDate` is always ISO `"YYYY-MM-DD"`. `timeFormat` only affects display.

### URL Sharing (`?cfg=`)
Payload: `{ s: scheme, e: entryTime, d: cycleStartDate, c: color }` → `btoa(JSON.stringify(payload))`.
Custom scheme format: `"C{workHours}:{restHours}"` (e.g., `"C12:24"`).
On decode: validate ALL fields with try/catch. Invalid → show error message, do not process.
After processing, clean URL with `navigate("/", { replace: true })`.

### i18n
Every user-visible string must use `t()` from `react-i18next`. Zero hardcoded strings in JSX.
Namespaces: `common`, `calendar`, `config`, `search`, `feedback`, `onboarding`.
Only locale `es` exists in MVP.

### UI Global Rules (from PRD)
- **RG-001:** Save/action buttons are NEVER `disabled`. Validate on submit.
- **RG-002:** Loading state shows `<LoadingDots />` inside the button. Internal `isSubmitting` flag prevents double-submit.
- **RG-003:** Async ops use `AbortController` for 30s timeout; show warning at 10s.
- **RG-004:** On validation error, `scrollToFirstError()` scrolls to `[data-error="true"]` element.
- **RG-005:** Connection errors show a global non-field message.
- **RG-006:** Overflow text uses `truncate` Tailwind class + `title` attribute.
- **RG-007:** Color contrast evaluated via WCAG 2.1 relative luminance (4.5:1 minimum). Warning is non-blocking.

### Theme
Dark mode is applied by adding/removing the `dark` class on `document.documentElement`. Never read `prefers-color-scheme`. Default theme is `"light"`. Dynamic colors (user-selected shift colors) use inline `style={{ backgroundColor: color }}` — never dynamic Tailwind class strings.

### Gestures
`@use-gesture/react` `useDrag` hook. Swipe threshold: 50px distance + 0.3 minimum velocity. Each swipe executes exactly one action. Always provide button controls as keyboard/desktop fallback.

### Onboarding Flags
The `dod-onboarding` flag is saved ONLY after the 50-second timer completes. If the user closes the browser before 50 seconds, cleanup the `setTimeout` in the `useEffect` cleanup so the flag is not saved.

### Feedback (Formspree)
Endpoint: `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`. Use native `fetch` — no Axios. Cooldown is 60 seconds, stored in `dod-feedback-cooldown`.

### Security
- Never use `dangerouslySetInnerHTML`.
- Validate all hex colors with `/^#[0-9A-Fa-f]{6}$/` before applying to DOM.
- `VITE_FORMSPREE_ID` is set as an environment variable in Cloudflare Pages, not in the repo.

### Routes
| Route | Description |
|---|---|
| `/` | Calendar (eager load, processes `?cfg=`) |
| `/config` | Config management (lazy) |
| `/config/:id` | Edit specific config (lazy) |
| `/search` | Date search (lazy) |
| `/feedback` | Feedback form (lazy) |
| `/terms` | Terms & Conditions (lazy) |
| `/privacy` | Privacy Policy (lazy) |

Use `<Link>` or `useNavigate` for internal navigation — never `<a href>`.

---

## Shift Calculation Algorithm

Preset schemes resolve as: `24x48 → (24, 48)`, `12x36 → (12, 36)`, `48x48 → (48, 48)`.

```
cycleTotal = workHours + restHours
origin = cycleStartDate + entryTime (absolute hours point)
hoursFromOrigin = differenceInHours(origin, targetDayStart)
positionInCycle = moduloPositivo(hoursFromOrigin, cycleTotal)

if positionInCycle < workHours → in shift (check for entry/exit within the day)
if positionInCycle >= workHours → off duty
```

Result types: `{ type: "entry", time }`, `{ type: "exit", time }`, `{ type: "on_duty" }`, `{ type: "off_duty" }`.

Test cases must cover: exact start date, rest day, multi-day shift middle day, midnight-crossing shift, Feb 29 leap year, distant past/future dates, dates before `cycleStartDate`.
