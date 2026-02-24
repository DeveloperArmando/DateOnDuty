# Plan de Acción — DateOnDuty MVP

**Última actualización:** 2026-02-23

---

## Estado actual

| Área | Estado |
|---|---|
| Core Engine (shift-calculator, url-encoder, wcag-contrast) | ✅ Completo (90 tests) |
| Stores (config-store, ui-store, theme-store) | ✅ Completo |
| App Shell (AppShell, AppBar, BottomBar, Footer, router, i18n) | ✅ Completo |
| Shared components (Button, LoadingDots, ErrorMessage, Toast, scrollToError) | ✅ Completo |
| Feature: Calendar (MonthGrid, DayCell, DayExpandedPanel, BottomSheet) | ✅ Completo |
| Feature: Config (ConfigPage, ConfigDetailPage, ShiftConfigForm, ConfigRow, ColorPicker, modals) | ✅ Completo |
| Feature: Search | 🔴 Stub |
| Feature: Onboarding | 🔴 Sin empezar |
| Feature: Sharing | 🔴 Sin empezar |
| Feature: Feedback | 🔴 Stub |
| Feature: Legal (Terms, Privacy) | 🔴 Stub |
| Theme toggle | ✅ Completo (en AppBar, via theme-store) |

---

## FASE 1 — Search (US-006)

> Layout móvil 1 columna / desktop ≥1024px 2 columnas. Picker con roving tabindex. Resultados por config. Botón "Ver en calendario" sticky.

| # | Paso | Archivo(s) | Notas |
|---|---|---|---|
| 1.1 | Añadir acción `setViewDate` | `src/stores/ui-store.ts` | 1 acción nueva: recibe `(year, month)`, actualiza `currentYear` y `currentMonth` |
| 1.2 | Completar i18n de búsqueda | `src/i18n/locales/es/search.json` | Añadir: `sectionMyShift`, `sectionAdditionals`, `statusEntry`, `statusExit`, `statusOnDuty`, `statusOffDuty`, `viewInCalendar` |
| 1.3 | Crear `SearchDatePicker.tsx` | `src/features/search/components/SearchDatePicker.tsx` | Grid de días, navegación año/mes, roving tabindex, celdas: default / seleccionada / hoy / fuera-de-mes |
| 1.4 | Implementar `SearchPage.tsx` | `src/features/search/components/SearchPage.tsx` | Reemplazar stub. Layout + resultados (LogIn/LogOut/Clock/Coffee) + botón sticky que llama `setViewDate` + `navigate('/')` |

---

## FASE 2 — Onboarding (US-009, US-011)

> SwipeAnimation: 8s, CSS puro, aria-hidden. ConfigBanner: 50s timer — la flag `bannerSeen` se guarda SOLO si el timer completa (no en cleanup ni en click).

| # | Paso | Archivo(s) | Notas |
|---|---|---|---|
| 2.1 | Añadir keyframes de onboarding | `src/index.css` | 3 keyframes nuevos: `dod-swipe-hint` (8s fade in/out), `dod-swipe-cursor-v` (movimiento vertical), `dod-swipe-cursor-h` (movimiento horizontal) |
| 2.2 | Añadir estado de onboarding a ui-store | `src/stores/ui-store.ts` | 1 estado `onboardingStartTime: number \| null` + 1 setter. Permite que el timer sobreviva navegaciones |
| 2.3 | Crear `SwipeAnimation.tsx` | `src/features/onboarding/components/SwipeAnimation.tsx` | Posición fija centrada, `aria-hidden="true"`, `pointer-events:none`, animación CSS 8s, guarda `animationSeen` al completar |
| 2.4 | Crear `ConfigBanner.tsx` | `src/features/onboarding/components/ConfigBanner.tsx` | Lee `dod-onboarding.bannerSeen`; si true → null. Timer 50s en ui-store. Tap → `navigate('/config')` (timer continúa). Flag escrita SOLO al completar. Cleanup cancela timer |
| 2.5 | Actualizar `CalendarPage.tsx` | `src/features/calendar/components/CalendarPage.tsx` | Añadir `<ConfigBanner />` antes de `<MonthGrid />` y `<SwipeAnimation />` al final |

---

## FASE 3 — URL Sharing (US-007, US-008)

> Sender: botón en menú de ConfigRow → modal con URL copiable + Web Share API. Receiver: procesa `?cfg=` al cargar CalendarPage, valida, muestra config recibida, ofrece añadir.

| # | Paso | Archivo(s) | Notas |
|---|---|---|---|
| 3.1 | Crear `SharedConfigReceiver.tsx` | `src/features/sharing/components/SharedConfigReceiver.tsx` | Decodifica `?cfg=` (base64 → JSON), valida todos los campos, muestra config recibida o error. Limpia URL con `navigate('/', { replace: true })` tras procesar |
| 3.2 | Actualizar `CalendarPage.tsx` | `src/features/calendar/components/CalendarPage.tsx` | Montar `<SharedConfigReceiver />` (solo activo si `?cfg=` está en la URL) |
| 3.3 | Crear `ShareConfigModal.tsx` | `src/features/sharing/components/ShareConfigModal.tsx` | Genera URL con `btoa(JSON.stringify(payload))`, botón copy-to-clipboard, fallback Web Share API si disponible |
| 3.4 | Exponer "Compartir" en ConfigRow | `src/features/config/components/ConfigPage.tsx` + `ConfigRow.tsx` | Añadir opción "Compartir" al menú de cada ConfigRow. Abre ShareConfigModal con la config seleccionada |

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
