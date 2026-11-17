# Plan de Acción — DateOnDuty MVP

**Última actualización:** 2026-11-16

---

## Estado actual

| Área | Estado |
|---|---|
| Core Engine (shift-calculator, shift-format, url-encoder, wcag-contrast) | ✅ Completo (107 tests) |
| Stores (config-store, ui-store, theme-store) | ✅ Completo |
| App Shell (AppShell, AppBar, BottomBar, Footer, router, i18n) | ✅ Completo |
| Shared components (Button, LoadingDots, ErrorMessage, Toast, scrollToError) | ✅ Completo |
| Feature: Calendar (MonthGrid, DayCell, DayExpandedPanel, BottomSheet) | ✅ Completo |
| Feature: Config (ConfigPage, ConfigDetailPage, ShiftConfigForm, ConfigRow, ColorPicker, modals) | ✅ Completo |
| Feature: Search (SearchDatePicker, SearchPage) | ✅ Completo — commit a97faea |
| Feature: Onboarding (SwipeAnimation, ConfigBanner) | ✅ Completo — commit 3e3dabd |
| Feature: Sharing (SharedConfigReceiver, ShareConfigModal) | ✅ Completo — commit e368ed8 |
| Feature: Feedback | 🔴 Stub (pendiente Fase 4) |
| Feature: Legal (Terms, Privacy) | 🔴 Stub (pendiente Fase 5) |
| Theme toggle | ✅ Completo (en AppBar, via theme-store) |
| Ayuda del calendario (HelpOverlay) | 🟡 Versión de leyenda (D-043); badges numerados pendientes |
| CI (GitHub Actions) | ✅ `.github/workflows/ci.yml` (D-046) |
| Deploy (Cloudflare Pages) | ✅ Producción desde `master` en `dateonduty.pages.dev`; vista previa por rama |

---

## ~~FASE 1 — Search (US-006)~~ ✅ COMPLETADO (commit a97faea)

| # | Paso | Archivo(s) | Estado |
|---|---|---|---|
| 1.1 | Añadir acción `setViewDate` | `src/stores/ui-store.ts` | ✅ |
| 1.2 | Completar i18n de búsqueda | `src/i18n/locales/es/search.json` | ✅ |
| 1.3 | Crear `SearchDatePicker.tsx` | `src/features/search/components/SearchDatePicker.tsx` | ✅ |
| 1.4 | Implementar `SearchPage.tsx` | `src/features/search/components/SearchPage.tsx` | ✅ |

---

## ~~FASE 2 — Onboarding (US-009, US-011)~~ ✅ COMPLETADO (commit 3e3dabd)

| # | Paso | Archivo(s) | Estado |
|---|---|---|---|
| 2.1 | Añadir keyframes de onboarding | `src/index.css` | ✅ |
| 2.2 | Añadir estado de onboarding a ui-store | `src/stores/ui-store.ts` | ✅ |
| 2.3 | Crear `SwipeAnimation.tsx` | `src/features/onboarding/components/SwipeAnimation.tsx` | ✅ |
| 2.4 | Crear `ConfigBanner.tsx` | `src/features/onboarding/components/ConfigBanner.tsx` | ✅ |
| 2.5 | Actualizar `CalendarPage.tsx` | `src/features/calendar/components/CalendarPage.tsx` | ✅ |

---

## ~~FASE 3 — URL Sharing (US-007, US-008)~~ ✅ COMPLETADO (commit e368ed8)

| # | Paso | Archivo(s) | Estado |
|---|---|---|---|
| 3.1 | Crear `SharedConfigReceiver.tsx` | `src/features/sharing/components/SharedConfigReceiver.tsx` | ✅ |
| 3.2 | Actualizar `CalendarPage.tsx` | `src/features/calendar/components/CalendarPage.tsx` | ✅ |
| 3.3 | Crear `ShareConfigModal.tsx` | `src/features/sharing/components/ShareConfigModal.tsx` | ✅ |
| 3.4 | Exponer "Compartir" en ConfigRow | `src/features/config/components/ConfigPage.tsx` + `ConfigRow.tsx` | ✅ |

---

## FASE 4 — Feedback Form (US-012)

> Formspree. Cooldown 60s en `dod-feedback-cooldown` (localStorage directo, no Zustand). AbortController con timeout 30s y warning a los 10s (RG-003).

| # | Paso | Archivo(s) | Notas |
|---|---|---|---|
| 4.1 | Revisar/completar i18n de feedback | `src/i18n/locales/es/feedback.json` | Verificar keys existentes y añadir las que falten (campos, errores, cooldown, timeout warning) |
| 4.2 | Implementar `FeedbackPage.tsx` | `src/features/feedback/components/FeedbackPage.tsx` | Reemplazar stub. Form con campo mensaje, submit → Formspree (`VITE_FORMSPREE_ID`), cooldown 60s, AbortController, warning a 10s, error de red (RG-005) |

---

## FASE 5 — Legal Pages

> Páginas estáticas. Contenido real del texto legal en español.

| # | Paso | Archivo(s) | Notas |
|---|---|---|---|
| 5.1 | Implementar `TermsPage.tsx` | `src/features/legal/components/TermsPage.tsx` | Reemplazar stub. Layout con contenido estático de Términos y Condiciones |
| 5.2 | Implementar `PrivacyPage.tsx` | `src/features/legal/components/PrivacyPage.tsx` | Reemplazar stub. Layout con contenido estático de Política de Privacidad |

---

## Orden de ejecución

```
1.1 → 1.2 → 1.3 → 1.4
        ↓
2.1 → 2.2 → 2.3 → 2.4 → 2.5
        ↓
3.1 → 3.2 → 3.3 → 3.4
        ↓
4.1 → 4.2
        ↓
5.1 → 5.2
```

**Total: 18 pasos.** Cada paso = 1 sesión de implementación enfocada.

---

## Reglas críticas de implementación (recordatorio)

- **RG-001:** Los botones de acción nunca tienen `disabled`. Validar siempre en submit.
- **RG-002:** Estado de carga = `<LoadingDots />` dentro del botón. Flag `isSubmitting` previene doble envío.
- **RG-003:** Ops async con `AbortController`; warning a 10s, timeout a 30s.
- **RG-004:** Error de validación → `scrollToFirstError()` al elemento `[data-error="true"]`.
- **Onboarding timer:** La flag `dod-onboarding.bannerSeen` se escribe SOLO cuando el timer de 50s completa. El cleanup del useEffect cancela el timer; si el usuario cierra el browser antes, la flag NO se guarda.
- **Colores dinámicos:** Siempre `style={{ backgroundColor: color }}`, nunca strings de clase Tailwind dinámicos.
- **i18n:** Ningún string visible en JSX sin pasar por `t()`.
