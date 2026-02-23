# Wireframe: Legal — Términos y Privacidad
**Rol:** UX/UI Designer Senior
**Fecha:** Feb 2026
**Skill invocado:** /skill-wireframe terms, privacy
**US de referencia:** US-014
**Artefacto:** docs/design/wireframes/legal.md

---

## Descripción

Dos páginas de contenido estático accesibles desde el footer de cualquier pantalla.

| Ruta | Título | Carga |
|---|---|---|
| `/terms` | Términos y Condiciones | lazy |
| `/privacy` | Política de Privacidad | lazy |

**Naturaleza del artefacto:** El UX/UI Designer define el **layout, tipografía y estructura de secciones**. El **contenido legal específico** es responsabilidad de un profesional legal o herramienta especializada (Termly, iubenda, PrivacyPolicies.com o similar), fuera del alcance de este wireframe.

> ⚠️ **Bloqueante de lanzamiento (US-014):** Ambas páginas deben estar completas y con contenido legal real antes del go-live.

---

## Template compartido

Ambas páginas (`/terms` y `/privacy`) usan el mismo layout. Solo cambian el título y el contenido.

```
/* mobile — 360px */

┌──────────────────────────────────────┐
│ ⟨  {Título de la página}             │  [1]
│──────────────────────────────────────│
│                                      │
│  {Título de la página}               │  [2]
│  Última actualización: {fecha}       │  [3]
│                                      │
│ ─────────────────────────────────    │
│                                      │
│  {Sección 1}                         │  [4]
│  ─────────────────────               │
│  {Párrafo de contenido legal...      │
│   continuación del párrafo...}       │
│                                      │
│  {Sección 2}                         │
│  ─────────────────────               │
│  {Párrafo de contenido legal...}     │
│                                      │
│  {Sección 2.1}                       │  [5]
│  {Párrafo de subsección...}          │
│                                      │
│  {Sección 2.2}                       │
│  {Párrafo de subsección...}          │
│                                      │
│  [...]                               │
│                                      │
│  {Sección N — Contacto}              │  [6]
│  ─────────────────────               │
│  {email o canal de contacto}         │
│                                      │
│──────────────────────────────────────│
│   Términos  ·  Privacidad  ·  Feedback│  [7]
└──────────────────────────────────────┘
```

---

## Estructura de secciones: `/terms` (Términos y Condiciones)

*Secciones mínimas requeridas. El texto de cada sección lo redacta el equipo legal.*

```
┌──────────────────────────────────────┐
│ ⟨  Términos y Condiciones            │
│──────────────────────────────────────│
│                                      │
│  Términos y Condiciones              │
│  Última actualización: [fecha]       │
│                                      │
│ ─────────────────────────────────    │
│                                      │
│  1. Acerca de DateOnDuty             │
│  ─────────────────────               │
│  {Descripción general del servicio.  │
│   Naturaleza de la app: herramienta  │
│   de consulta de turnos, sin cuenta  │
│   requerida, sin backend en MVP.}    │
│                                      │
│  2. Uso aceptable                    │
│  ─────────────────────               │
│  {Condiciones de uso. Sin usos       │
│   maliciosos, automatizados, etc.}   │
│                                      │
│  3. Datos y almacenamiento           │
│  ─────────────────────               │
│  3.1 Almacenamiento local            │
│  {localStorage en el dispositivo     │
│   del usuario. No se transmiten      │
│   datos a servidores propios.}       │
│                                      │
│  3.2 Servicio de feedback            │
│  {Uso de Formspree como servicio     │
│   externo para el formulario de      │
│   feedback. Ver política de          │
│   privacidad de Formspree.}          │
│                                      │
│  4. Propiedad intelectual            │
│  ─────────────────────               │
│  {Titularidad del código, diseño     │
│   y marca DateOnDuty.}               │
│                                      │
│  5. Limitación de responsabilidad    │
│  ─────────────────────               │
│  {Exención de responsabilidad por    │
│   cálculos erróneos, pérdida de      │
│   datos por borrado de caché, etc.}  │
│                                      │
│  6. Cambios a estos Términos         │
│  ─────────────────────               │
│  {Política de notificación de        │
│   cambios materiales vs. menores.    │
│   Nota: asesor legal debe definir    │
│   qué constituye cambio material.}   │
│                                      │
│  7. Contacto                         │
│  ─────────────────────               │
│  {Email / canal de contacto}         │
│                                      │
│──────────────────────────────────────│
│   Términos  ·  Privacidad  ·  Feedback│
└──────────────────────────────────────┘
```

---

## Estructura de secciones: `/privacy` (Política de Privacidad)

*Secciones mínimas requeridas por LFPDPPP (México) y PRD. El texto lo redacta el equipo legal.*

```
┌──────────────────────────────────────┐
│ ⟨  Política de Privacidad            │
│──────────────────────────────────────│
│                                      │
│  Política de Privacidad              │
│  Última actualización: [fecha]       │
│                                      │
│ ─────────────────────────────────    │
│                                      │
│  1. Responsable del tratamiento      │
│  ─────────────────────               │
│  {Nombre/entidad responsable,        │
│   domicilio, email de contacto.}     │
│                                      │
│  2. Datos que recopilamos            │
│  ─────────────────────               │
│  2.1 Datos en tu dispositivo         │
│  {Configuraciones de turno,          │
│   preferencias, flags de             │
│   onboarding — guardados en          │
│   localStorage. Solo accesibles      │
│   desde el mismo navegador.}         │
│                                      │
│  2.2 Datos de feedback               │
│  {Correo electrónico y mensaje       │
│   cuando usas el formulario de       │
│   feedback. Enviados a Formspree     │
│   (servicio externo). Ver política   │
│   de privacidad de Formspree.}       │
│                                      │
│  3. Finalidad del tratamiento        │
│  ─────────────────────               │
│  {Para qué se usan los datos:        │
│   funcionamiento de la app,          │
│   recibir y responder feedback.}     │
│                                      │
│  4. Seguridad y almacenamiento       │
│  ─────────────────────               │
│  {Los datos locales permanecen en    │
│   tu dispositivo. DateOnDuty no      │
│   transmite ni almacena datos en     │
│   servidores propios. Formspree      │
│   tiene sus propias medidas de       │
│   seguridad.}                        │
│                                      │
│  5. Derechos del usuario (ARCO)      │
│  ─────────────────────               │
│  {Derechos de Acceso, Rectificación, │
│   Cancelación y Oposición conforme   │
│   a la LFPDPPP. Cómo ejercerlos.}   │
│                                      │
│  6. Derecho a la eliminación         │
│  ─────────────────────               │
│  {El mecanismo automatizado estará   │
│   disponible en v2.0. Mientras       │
│   tanto, el canal para solicitar     │
│   eliminación es: [email/canal].     │
│   Nota: asesor legal debe definir    │
│   el proceso aplicable.}             │
│                                      │
│  7. Cookies y almacenamiento web     │
│  ─────────────────────               │
│  {DateOnDuty usa localStorage (no    │
│   cookies). Alcance, finalidad y     │
│   cómo eliminarlos.}                 │
│                                      │
│  8. Cambios a esta Política          │
│  ─────────────────────               │
│  {Cómo se notificarán cambios        │
│   materiales a los usuarios.}        │
│                                      │
│  9. Contacto                         │
│  ─────────────────────               │
│  {Email / canal de contacto}         │
│                                      │
│──────────────────────────────────────│
│   Términos  ·  Privacidad  ·  Feedback│
└──────────────────────────────────────┘
```

---

## Variante Desktop (1280px)

```
/* desktop — 1280px, contenedor max-w-2xl centrado */

┌──────────────────────────────────────────────────────────────────┐
│ ⟨  {Título de la página}                                          │
│──────────────────────────────────────────────────────────────────│
│                                                                  │
│          {Título de la página}                                   │
│          Última actualización: {fecha}                           │
│                                                                  │
│         ──────────────────────────────────                       │
│                                                                  │
│          {Sección 1}                                             │
│          ──────────────────────────────────                      │
│          {Párrafo con line-height amplio para lectura cómoda}    │
│          {en desktop. max-w-prose (65ch) aplicado al texto.}     │
│                                                                  │
│          [...continúan las secciones...]                         │
│                                                                  │
│──────────────────────────────────────────────────────────────────│
│              Términos de uso  ·  Privacidad  ·  Feedback         │
└──────────────────────────────────────────────────────────────────┘
```

> En desktop el contenedor principal es `max-w-2xl mx-auto` con padding horizontal generoso. El cuerpo del texto tiene `max-w-prose` (≈65 caracteres por línea) para legibilidad óptima. Las secciones se muestran en layout de una columna — sin sidebar ni TOC (las páginas son cortas y el scroll es suficiente para MVP).

---

## Anotaciones

**[1] — Top bar**
- `⟨` = `ChevronLeft` de lucide-react. `useNavigate(-1)` — regresa a la pantalla anterior.
- Título de la página en `text-lg font-semibold text-text-primary`.
- Sin botón de tema (☾) ni otros controles — el tema global ya aplica via clase `dark` en `<html>`.
- Sin icono de ayuda [?] — estas páginas son el destino final, no necesitan ayuda contextual.

**[2] — Título principal (h1)**
- `text-2xl font-bold text-text-primary`.
- Texto idéntico al del top bar — el h1 es el landmark principal de la página para screen readers.

**[3] — Fecha de última actualización**
- `text-sm text-text-disabled`.
- Formato: "Última actualización: {día} de {mes} de {año}".
- El equipo de desarrollo actualiza esta fecha en el código cada vez que el contenido cambia.
- No es un campo dinámico — es texto estático en el componente.

**[4] — Secciones de primer nivel (h2)**
- `text-lg font-semibold text-text-primary` con `mt-8 mb-2` para separación visual.
- Separador visual bajo el título de sección: `border-b border-border-default pb-1`.
- Numeración visible ("1.", "2.", etc.) ayuda a la referencia legal y a la navegación.

**[5] — Subsecciones (h3)**
- `text-base font-semibold text-text-primary` con `mt-4 mb-1`.
- Numeración decimal ("2.1", "2.2") para consistencia con el nivel padre.

**[6] — Sección Contacto**
- Siempre la última sección de ambos documentos.
- El email de contacto debe ser un `<a href="mailto:...">` funcional.
- En v1.0, puede ser un email provisional; se actualizará según lo que defina el asesor legal.

**[7] — Footer**
- Idéntico al footer del resto de la app: `Términos · Privacidad · Feedback`.
- Permite navegar entre `/terms` y `/privacy` sin volver al calendario.
- Los links del footer usan `<Link>` de React Router (no `<a href>`).

---

## Especificación de tipografía para contenido legal

| Elemento | Clase Tailwind | Notas |
|---|---|---|
| Título página (h1) | `text-2xl font-bold text-text-primary` | Único por página |
| Fecha actualización | `text-sm text-text-disabled` | Debajo del h1 |
| Título sección (h2) | `text-lg font-semibold text-text-primary mt-8 mb-2` | Con separador inferior |
| Título subsección (h3) | `text-base font-semibold text-text-primary mt-4 mb-1` | Sin separador |
| Párrafo cuerpo | `text-base text-text-secondary leading-relaxed` | `leading-relaxed` = 1.625 |
| Lista (ul/ol) | `text-base text-text-secondary leading-relaxed list-disc pl-5` | Para listas de derechos, etc. |
| Link en texto | `text-interactive-primary underline hover:text-interactive-primary-hover` | Para emails, URLs externas |
| Separador sección | `border-b border-border-default` | Solo en h2 |

> **Nota sobre `@tailwindcss/typography`:** El plugin de tipografía de Tailwind simplificaría el estilo del contenido legal con la clase `prose`. No está en el stack actual. Alternativa sin plugin: las clases de la tabla anterior aplicadas directamente al componente. Si el equipo considera añadir `@tailwindcss/typography`, documentar la decisión en el log de arquitectura.

---

## Contenido legal: responsabilidades

| Responsabilidad | Quién |
|---|---|
| Redactar texto de Términos y Condiciones | Asesor legal o herramienta especializada |
| Redactar texto de Política de Privacidad (LFPDPPP) | Asesor legal o herramienta especializada |
| Definir canal de ejercicio de derechos ARCO (sección 6 de Privacy) | Asesor legal |
| Definir qué constituye "cambio material" en los T&C | Asesor legal |
| Implementar las páginas con el contenido final | Developer |
| Mantener actualizada la fecha "Última actualización" | Developer/DevOps |

**Herramientas sugeridas para generación del texto legal:**
- Termly (termly.io) — políticas para México/LATAM
- iubenda (iubenda.com) — LFPDPPP compatible
- PrivacyPolicies.com — plantillas editables

---

## Estados cubiertos

| Estado | Wireframe |
|---|---|
| ✅ Layout base compartido (`/terms` y `/privacy`) | Template compartido |
| ✅ Estructura de secciones `/terms` (7 secciones) | Wireframe /terms |
| ✅ Estructura de secciones `/privacy` (9 secciones, LFPDPPP) | Wireframe /privacy |
| ✅ Desktop (max-w-2xl, max-w-prose) | Variante desktop |
| — Estado de carga | No aplica — contenido estático renderizado inmediatamente |
| — Modo oscuro | No dibujado — aplica automáticamente vía tokens del design system |

---

## Notas de Accesibilidad

```
A11Y:

ESTRUCTURA SEMÁNTICA:
- <main> con el contenido de la página.
- <h1> único por página (título del documento).
- <h2> para secciones, <h3> para subsecciones — jerarquía semántica correcta.
- Landmark <nav> si se añade TOC en versiones futuras.

LECTORES DE PANTALLA:
- El texto legal es texto plano — sin interactividad especial.
- Los links dentro del texto (email de contacto, Formspree) son <a> con texto descriptivo.
  Evitar "haz clic aquí" — usar texto como "contacta a [email]".
- La fecha "Última actualización" tiene suficiente contraste (text-text-disabled ~2.5:1).
  Como texto de apoyo (no crítico), el contraste bajo es intencional y no viola WCAG 1.4.3
  para texto de apoyo de bajo énfasis.

NAVEGACIÓN POR TECLADO:
- Tab order: top bar (⟨) → contenido (solo links dentro del texto) → footer links.
- No hay elementos interactivos dentro del contenido aparte de links.
- El scroll de la página es el único mecanismo de lectura — no requiere componentes custom.

IDIOMA:
- <html lang="es"> está definido en la Arquitectura como requisito global.
  Las páginas legales heredan este atributo.
```

---

## Verificación PRD

| Criterio | US | Estado |
|---|---|---|
| Página Términos y Condiciones existe en `/terms` | US-014 | ✅ Wireframe y ruta definidos |
| Página Política de Privacidad existe en `/privacy` | US-014 | ✅ Wireframe y ruta definidos |
| Accesibles desde el footer de cualquier pantalla | US-014 | ✅ Footer en todas las pantallas wireframeadas |
| Cubre: datos recopilados (localStorage, Formspree) | US-014 | ✅ Secciones 3 (/terms) y 2 (/privacy) |
| Cubre: derechos del usuario LFPDPPP | US-014 | ✅ Secciones 5 y 6 (/privacy) |
| Cubre: derecho a eliminación + canal provisional | US-014 | ✅ Sección 6 (/privacy) con nota para asesor |
| Cubre: política de cambios materiales | US-014 | ✅ Sección 6 (/terms) + 8 (/privacy) con nota |
| Cubre: cookies / almacenamiento web | US-014 | ✅ Sección 7 (/privacy) |
| Contenido redactado por profesional o herramienta | US-014 | ⏳ Pendiente — responsabilidad del equipo legal |

---

## Design Review: Legal

**Fecha de revisión:** Feb 2026
**Revisado por:** UX/UI Designer Agent
**Resultado:** ✅ Aprobado

---

### Issues encontrados

#### 🔴 Bloqueantes
Sin issues bloqueantes en el diseño. **El contenido legal real sigue pendiente (responsabilidad del asesor legal/herramienta especializada).**

#### 🟡 Importantes

- **[LG-001]** Las páginas legales no tienen una Tabla de Contenidos (TOC) para navegación rápida a secciones. Para documentos de 7–9 secciones, la ausencia de TOC es aceptable en MVP (las páginas son cortas y el scroll es suficiente).
  - **Decisión:** Sin TOC en MVP. Si el contenido legal resulta ser muy extenso (>2000 palabras), añadir un TOC sticky en v1.1.

#### 🟢 Sugerencias

- **[LG-002]** Añadir `@tailwindcss/typography` al stack para estilar el contenido legal con la clase `prose`.
  - **Beneficio:** Reduce la cantidad de clases Tailwind manuales en el componente. El resultado visual es consistente y profesional para texto largo.
  - **Decisión:** Pendiente de decisión del Arquitecto. Requiere actualizar el stack. Si se añade, documentar en `DOD_DECISIONS_LOG.md`.

- **[LG-003]** Considerar que el email de contacto en las páginas legales sea el mismo en ambas páginas y esté centralizado en una variable de entorno (`VITE_LEGAL_CONTACT_EMAIL`) para facilitar cambios futuros.
  - **Beneficio:** Actualizar el email en un solo lugar en lugar de en múltiples componentes.
  - **Decisión:** Buena práctica de implementación. Developer puede decidir si usar variable de entorno o constante en `src/shared/constants/`.

---

### Resumen
- Bloqueantes: 0 (en diseño — contenido legal pendiente es responsabilidad externa)
- Importantes: 1 (TOC descartado para MVP)
- Sugerencias: 2 (pendientes de decisión del equipo)
- **Próximo paso:** Puede avanzar a desarrollo. El contenido real debe estar listo antes del go-live.

---

*Siguiente artefacto: Help Overlay — Tooltips contextuales ([?] button).*
