# DateOnDuty — Recomendación de MCPs para Fase de Desarrollo
**Fecha:** Febrero 2026
**Estado:** Pendiente de aprobación — no configurar hasta que el UX/UI Designer termine

---

## ¿Qué es un MCP? (versión muy corta)

Un MCP es un servidor que le da a Claude acceso a herramientas externas: abrir un navegador, consultar documentación actualizada, interactuar con GitHub, etc. Sin MCPs, Claude solo puede leer y escribir archivos y ejecutar comandos de terminal. Con MCPs, puede hacer mucho más dentro del ciclo de desarrollo.

---

## MCPs Recomendados

### ✅ PRIORIDAD ALTA

---

#### 1. Context7
**Paquete:** `@upstash/context7-mcp` (Upstash — terceros, open source, gratuito)
**Qué hace:** Inyecta documentación oficial y actualizada de cualquier librería directamente en el contexto de Claude, con versión específica.

**Por qué es crítico para DateOnDuty:**
React 19, Tailwind CSS 4, Zustand 5 y Vite 6 son versiones muy recientes. Claude tiene un corte de entrenamiento y puede generar código con APIs de versiones anteriores. Context7 corrige esto: cuando el Developer agent escribe un componente con `@use-gesture/react` o configura el `@theme` de Tailwind 4, consulta la documentación real de esa versión exacta.

**Requiere API key:** No (gratuito hasta 1,000 req/mes con límite de 60/hora. API key gratis en context7.com para más cuota).

---

#### 2. Playwright MCP
**Paquete:** `@playwright/mcp` (Microsoft — oficial)
**Qué hace:** Abre un navegador real controlado por Claude. Puede navegar a URLs, hacer clicks, tomar screenshots y leer el contenido visual de la página.

**Por qué es crítico para DateOnDuty:**
DateOnDuty es una app muy visual: calendario con gradientes de color, dark mode, gestos de swipe, vista expandida del día. Sin este MCP, Claude escribe el código "a ciegas" y tú debes verificar manualmente que se ve bien. Con este MCP, el Developer agent puede abrir `localhost:5173`, ver el resultado, detectar que el gradiente de turno no se renderiza correctamente, y corregirlo en el mismo ciclo.

**Requiere API key:** No. Requiere Node.js instalado.
**Nota:** Hay problemas de compatibilidad reportados con las versiones más recientes. Al configurar, usar `@playwright/mcp@0.0.41` o verificar la versión estable más reciente.

---

### 🔶 PRIORIDAD MEDIA

---

#### 3. GitHub MCP
**Paquete:** `@modelcontextprotocol/server-github` (Anthropic — oficial)
**Qué hace:** Interactúa con la API de GitHub para gestionar repositorios, ramas, pull requests e issues desde Claude.

**Por qué aplica para DateOnDuty:**
La arquitectura define un pipeline CI/CD: push a rama → GitHub Actions (lint, typecheck, tests) → merge a `main` → deploy automático a Cloudflare Pages. El Developer agent puede crear la rama de feature, hacer commit, abrir el PR y verificar que el CI pasó, sin que tú tengas que hacer nada en GitHub.

**Requiere API key:** Sí — GitHub Personal Access Token (gratuito, se crea en github.com/settings/tokens).

---

#### 4. Cloudflare MCP
**Paquete:** `cloudflare/mcp-server-cloudflare` (Cloudflare — oficial)
**Qué hace:** Interactúa con la cuenta de Cloudflare: ver deployments de Pages, revisar logs, gestionar variables de entorno.

**Por qué aplica para DateOnDuty:**
El deploy es en Cloudflare Pages. La variable `VITE_FORMSPREE_ID` vive en Cloudflare (no en el repo). Con este MCP, el Developer agent puede verificar que el último deploy fue exitoso, revisar si hay errores en el build, o confirmar que la variable de entorno está configurada, sin salir de Claude.

**Requiere API key:** Sí — Cloudflare API Token (gratuito, se crea en dash.cloudflare.com/profile/api-tokens).

---

### ⬜ PRIORIDAD BAJA / OPCIONAL

---

#### 5. Brave Search MCP
**Paquete:** `@modelcontextprotocol/server-brave-search` (Anthropic — oficial)
**Qué hace:** Búsqueda web en tiempo real desde Claude.

**Por qué es opcional:**
Context7 cubre el acceso a documentación. Brave Search sería útil para buscar soluciones a errores específicos de compilación, bugs de librerías, o Stack Overflow. Complementa a Context7 pero no es indispensable si ya tienes Context7 configurado.

**Requiere API key:** Sí — Brave Search API (tiene tier gratuito en brave.com/search/api).

---

## Resumen de Decisión

| MCP | Prioridad | API Key | Bloqueante sin él |
|---|---|---|---|
| Context7 | Alta | No (opcional para más cuota) | Sí — riesgo de código con APIs desactualizadas |
| Playwright | Alta | No | No bloqueante, pero sin él la validación visual es manual |
| GitHub | Media | Sí (gratis) | No bloqueante, git via terminal cubre lo básico |
| Cloudflare | Media | Sí (gratis) | No bloqueante, el dashboard web cubre lo básico |
| Brave Search | Baja | Sí (gratis) | No — Context7 + WebFetch de Claude lo suple |

---

## MCPs Descartados y Por Qué

| MCP | Razón de descarte |
|---|---|
| Filesystem (`@modelcontextprotocol/server-filesystem`) | Claude Code ya tiene Read/Write/Edit/Glob/Grep integrados. Redundante. |
| Git MCP | Claude Code ya ejecuta comandos `git` via Bash. Redundante. |
| Fetch MCP | Claude Code ya tiene WebFetch y Bash para curl. El único fetch externo en MVP es Formspree, que no requiere MCP. |
| Puppeteer MCP (`@modelcontextprotocol/server-puppeteer`) | Playwright MCP es superior: más moderno, multiplataforma (Chrome + Firefox + WebKit), mejor mantenido por Microsoft. |
| SQLite MCP | DateOnDuty no tiene base de datos. No aplica en MVP. |

---

## Siguiente Paso

Cuando el UX/UI Designer termine y decidas avanzar con la fase de desarrollo, proceder en este orden:
1. **Context7** — configurar primero, es el más crítico y el más sencillo (sin API key).
2. **Playwright** — configurar segundo, permite validación visual desde el primer componente.
3. **GitHub** — configurar junto con la creación del repositorio.
4. **Cloudflare** — configurar cuando se haga el primer deploy.

---

*Documento generado en Feb 2026. Verificar compatibilidad de versiones al momento de configurar.*
