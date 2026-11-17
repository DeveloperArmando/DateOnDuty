# Incidencias detectadas — Auditoría 2026-06-09

> **Estado: resueltas.** Las incidencias 1–6 y las tareas D1/D2 se cerraron en el PR #2 (`fix/i18n-hardcoded-strings`) y en D-039/D-040. Los strings que esta auditoría no detectó (aria-label de `DayCell`, abreviaturas de `ShiftConfigForm`, fallbacks de `config-store`) se corrigieron en la auditoría de noviembre de 2026. Se conserva como registro histórico.

Instrucciones para corregir las violaciones de reglas del proyecto detectadas en la auditoría.
Todas las rutas de código son relativas a `app/`. Las verificaciones automáticas
(`typecheck`, `lint`, `format:check`, `test`, `build`) ya pasan — estos cambios NO deben romperlas.

**Regla violada (CLAUDE.md → i18n):** todo string visible para el usuario (texto JSX,
`aria-label`, `title`, `placeholder`) debe pasar por `t()` de `react-i18next`. Cero strings
hardcodeados en JSX.

---

## Paso 0 — Añadir claves i18n nuevas

### `src/i18n/locales/es/common.json`

Añadir estas claves (las demás ya existen, no tocar):

```json
"globalActions": "Acciones globales",
"comingSoon": "Contenido próximamente.",
"backToCalendar": "Volver al calendario"
```

### `src/i18n/locales/es/onboarding.json`

Añadir:

```json
"bannerTimeRemaining": "Tiempo restante del aviso"
```

---

## Incidencia 1 — `src/app/PageLoader.tsx:7`

Texto hardcodeado `Cargando...`. Ya existe la clave `loading` en `common.json`.

```tsx
// Antes
<span className="animate-pulse text-sm text-text-secondary">Cargando...</span>

// Después (añadir import y hook)
import { useTranslation } from 'react-i18next'
// dentro de PageLoader():
const { t } = useTranslation()
<span className="animate-pulse text-sm text-text-secondary">{t('loading')}</span>
```

Nota: `PageLoader` es el fallback de `<Suspense>`; `useTranslation` es seguro aquí porque
i18next se inicializa de forma síncrona con recursos locales.

## Incidencia 2 — `src/app/components/BottomBar.tsx:24`

`aria-label="Acciones globales"` hardcodeado. El componente ya tiene `const { t } = useTranslation()`.

```tsx
// Antes
<nav aria-label="Acciones globales" ...>
// Después
<nav aria-label={t('globalActions')} ...>
```

## Incidencia 3 — `src/features/onboarding/components/ConfigBanner.tsx:140`

`aria-label="Tiempo restante del aviso"` hardcodeado en el `role="progressbar"`.
El componente ya usa `const { t } = useTranslation('onboarding')`.

```tsx
// Antes
aria-label="Tiempo restante del aviso"
// Después
aria-label={t('bannerTimeRemaining')}
```

## Incidencia 4 — `src/features/legal/components/TermsPage.tsx` (líneas 6–9)

Tres strings hardcodeados. Reutilizar `pageTitle.terms` y las claves nuevas de `common`:

```tsx
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function TermsPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-prose px-4 py-8 text-text-primary">
      <h1 className="mb-4 text-2xl font-semibold">{t('pageTitle.terms')}</h1>
      <p className="mb-4 text-text-secondary">{t('comingSoon')}</p>
      <Link to="/" className="text-interactive-primary underline">
        {t('backToCalendar')}
      </Link>
    </div>
  )
}
```

## Incidencia 5 — `src/features/legal/components/PrivacyPage.tsx` (líneas 6–9)

Idéntico a la Incidencia 4 pero con `t('pageTitle.privacy')` como título. Misma estructura.

## Incidencia 6 — `src/features/feedback/components/FeedbackPage.tsx:4`

`"Feedback — próximamente"` hardcodeado:

```tsx
import { useTranslation } from 'react-i18next'

export default function FeedbackPage() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base">
      <p className="text-text-primary">{t('comingSoon')}</p>
    </div>
  )
}
```

## Incidencia 7 (menor, opcional) — `src/features/config/components/ColorPicker.tsx:183`

`bg-[#EA580C]` hardcodea un color fuera del design system para el punto "color en uso".
No viola la regla de colores dinámicos (es estático), pero salta los tokens. Si existe un
token semántico adecuado (p. ej. warning) en `docs/design/design-tokens.md`, usarlo; si no,
dejar como está y NO inventar un token nuevo.

---

## Tareas de documentación (no tocan código)

### D1 — Discrepancia de versión de Vite

CLAUDE.md y `docs/DateOnDuty_Architecture_v1.md` especifican **Vite 6.x**, pero el proyecto
usa **Vite 7.3.1** (ver `app/package.json`). Acción: actualizar la tabla de stack de
`CLAUDE.md` a `Vite 7.x` y registrar la decisión en `docs/DOD_DECISIONS_LOG.md` siguiendo
el formato definido al inicio de ese archivo. NO bajar la versión de Vite.

### D2 — Lectura directa de localStorage en `src/main.tsx:9`

`main.tsx` lee `dod-preferences` directamente antes del primer render para evitar el flash
de tema (FOUC). Las reglas solo documentan dos excepciones de acceso directo
(`dod-onboarding`, `dod-feedback-cooldown`). Acción: registrar esta tercera excepción
(lectura *read-only* pre-render en `main.tsx`) en `docs/DOD_DECISIONS_LOG.md` y añadirla
a la sección de reglas de stores de `CLAUDE.md`. NO cambiar el código — la solución es correcta.

---

## Verificación final (obligatoria)

Ejecutar desde `app/` y confirmar que todo pasa:

```bash
npm run lint && npm run format:check && npm run typecheck && npm run test -- --run
```

Comprobación extra: `grep` en `src/` no debe encontrar ninguno de los literales corregidos
("Cargando...", "Acciones globales", "Tiempo restante del aviso", "próximamente",
"Volver al calendario", "Términos y Condiciones", "Política de Privacidad") fuera de los
archivos JSON de `src/i18n/locales/es/`.

## Falsos positivos ya descartados — NO "corregir"

- `BottomSheet.tsx` umbrales 150px / 0.5: correctos según `docs/design/animation-specs.md` (línea 777), que es fuente de verdad sobre la regla general de swipe.
- `main.tsx` localStorage: ver D2, el código se queda como está.
- Decoder `?cfg=`, RG-001, navegación interna, imports de date-fns, pureza de `core/`: todo en regla.
