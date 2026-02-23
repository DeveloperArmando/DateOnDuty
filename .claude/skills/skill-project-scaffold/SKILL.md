---
name: skill-project-scaffold
description: Genera el scaffolding completo del proyecto DateOnDuty — crea la estructura de directorios, instala todas las dependencias del stack, configura TypeScript estricto, Tailwind CSS 4 con @theme, React Router, Zustand, react-i18next, Husky + lint-staged, y el archivo de constantes de diseño. Usar una sola vez al inicio del proyecto cuando no existe código fuente.
---

# SKILL: Project Scaffold
**Fase:** Implementación — paso 0
**Cuándo usarlo:** Una sola vez, cuando el proyecto no tiene código fuente todavía.
**Produce:** Secuencia exacta de comandos + contenido de archivos de configuración listos para ejecutar.

---

## CONTEXTO

El proyecto DateOnDuty parte de cero: no hay `src/`, no hay `package.json`, no hay git. El scaffolding debe producir una base que pase `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test` desde el primer commit.

Stack: React 19 + TypeScript 5 (strict) + Vite 6 + Tailwind CSS 4 + Zustand 5 + date-fns 4 + React Router 7 + react-i18next 15 + @use-gesture/react 10 + Vitest + RTL + ESLint + Prettier + Husky + lint-staged.

---

## PASO 1 — Crear el proyecto Vite

```bash
npm create vite@latest . -- --template react-ts
```

> Ejecutar en el directorio raíz del proyecto. El `.` evita crear un subdirectorio.

---

## PASO 2 — Instalar dependencias

```bash
# Dependencias de producción
npm install \
  react-router-dom@^7 \
  zustand@^5 \
  date-fns@^4 \
  react-i18next@^15 \
  i18next@^24 \
  @use-gesture/react@^10 \
  lucide-react

# Dependencias de desarrollo
npm install -D \
  tailwindcss@^4 \
  @tailwindcss/vite@^4 \
  @vitest/coverage-v8 \
  @testing-library/react \
  @testing-library/user-event \
  @testing-library/jest-dom \
  jsdom \
  eslint \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  prettier \
  husky \
  lint-staged \
  typescript-eslint
```

---

## PASO 3 — Estructura de directorios

Crear la estructura completa antes de escribir ningún archivo de código:

```bash
mkdir -p src/app/components
mkdir -p src/core/shift-calculator
mkdir -p src/core/url-encoder
mkdir -p src/core/wcag-contrast
mkdir -p src/stores
mkdir -p src/features/calendar/components
mkdir -p src/features/calendar/hooks
mkdir -p src/features/config/components
mkdir -p src/features/config/hooks
mkdir -p src/features/search/components
mkdir -p src/features/onboarding/components
mkdir -p src/features/sharing/components
mkdir -p src/features/feedback/components
mkdir -p src/features/legal/components
mkdir -p src/shared/components
mkdir -p src/shared/constants
mkdir -p src/shared/hooks
mkdir -p src/i18n/locales/es
mkdir -p docs/design
mkdir -p .husky
```

---

## PASO 4 — TypeScript config (`tsconfig.app.json`)

Asegurar que el tsconfig tenga `strict: true` y el path alias `@/`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

---

## PASO 5 — Vite config (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
```

---

## PASO 6 — CSS global (`src/index.css`)

El archivo `src/index.css` implementa los design tokens de `docs/design/design-tokens.md`.
La estructura base que debe tener antes de añadir los tokens:

```css
@import "tailwindcss";

@theme {
  /* === AQUÍ van los tokens de docs/design/design-tokens.md === */
  /* Copiar el bloque @theme completo del documento de tokens   */
}

/* Dark mode tokens */
.dark {
  /* Copiar los overrides de modo oscuro del documento de tokens */
}

/* Keyframes de animaciones — docs/design/animation-specs.md */
/* Definir todos los @keyframes con prefijo dod- antes de usarlos */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

> **Importante:** Implementar los tokens de `docs/design/design-tokens.md` COMPLETOS antes de tocar ningún componente.

---

## PASO 7 — Constantes de diseño (`src/shared/constants/design.ts`)

```typescript
export const DESIGN = {
  appBarHeight: 56,
  calendar: {
    maxConfigsMobile: 2,   // < 640px
    maxConfigsDesktop: 3,  // >= 640px
    cellHeightMobile: 56,  // px
  },
  shiftColorPalette: [
    '#2563EB', '#7C3AED', '#DB2777', '#DC2626',
    '#D97706', '#65A30D', '#0D9488', '#0284C7',
    '#9333EA', '#EA580C',
  ] as const,
  onboarding: {
    animationDuration: 8_000,   // ms — SwipeAnimation
    bannerDuration: 50_000,     // ms — ConfigBanner
  },
  feedback: {
    cooldownMs: 60_000,   // 60s entre envíos
    timeoutMs: 30_000,    // AbortController timeout
    warningMs: 10_000,    // warning antes del timeout
  },
} as const;
```

---

## PASO 8 — Setup de tests (`src/test-setup.ts`)

```typescript
import '@testing-library/jest-dom'
```

---

## PASO 9 — Scripts en `package.json`

Asegurar que estos scripts existan:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\"",
    "format:write": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "src/**/*.css": ["prettier --write"]
  }
}
```

---

## PASO 10 — Husky

```bash
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

---

## PASO 11 — `.gitignore` (añadir si no existe)

Asegurar que estas líneas estén presentes:
```
node_modules/
dist/
.env
.env.local
.env.*.local
coverage/
```

---

## PASO 12 — `.env.local` (NO versionado)

Para desarrollo local, crear manualmente (no via código):
```
VITE_FORMSPREE_ID=tu_id_de_desarrollo_aqui
```

---

## VERIFICACIÓN FINAL

Al terminar el scaffolding, estos comandos deben pasar sin errores:

```bash
npm run typecheck    # TypeScript sin errores
npm run lint         # ESLint sin warnings
npm run format:check # Prettier consistente
npm run test         # Vitest — 0 tests (todavía sin core/), debe pasar
npm run build        # Build de producción exitoso
```

> Si alguno falla, resolver antes de escribir código de la aplicación. El scaffolding debe ser la base estable.

---

## NOTAS

- **NO crear `tailwind.config.ts`** — Tailwind CSS 4 usa `@theme` en el CSS. No hay config file separado.
- **NO instalar `@types/react` ni `@types/react-dom`** — React 19 incluye sus propios tipos.
- El path alias `@/` permite imports como `import { DESIGN } from '@/shared/constants/design'` en lugar de rutas relativas largas.
- La primera config default ("Mi turno") se crea en el `config-store` como valor inicial, no en el scaffolding.
