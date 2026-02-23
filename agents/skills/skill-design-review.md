# SKILL: Design Review
**Fase:** Diseño
**Cuándo usarlo:** Al terminar cualquier artefacto de diseño (design system, wireframe, component spec, animation spec) antes de darlo por aprobado.
**Produce:** Lista de issues encontrados clasificados por severidad + recomendaciones de corrección.

---

## CÓMO INVOCAR

```
/skill-design-review [ARTEFACTO]
```

Ejemplos:
- `/skill-design-review design-tokens`
- `/skill-design-review wireframe-calendario`
- `/skill-design-review component-DayCell`
- `/skill-design-review animation-onboarding-swipe-hint`

---

## INSTRUCCIONES

Ejecuta la revisión completa del artefacto indicado contra los tres niveles de validación:
1. PRD — criterios de aceptación y reglas de UI
2. Arquitectura — restricciones técnicas de diseño
3. Principios de UX — coherencia, accesibilidad, usabilidad

Para cada issue encontrado, clasificar por severidad:
- 🔴 **Bloqueante** — El artefacto no puede avanzar a desarrollo sin corrección. Viola un requisito del PRD o una restricción de arquitectura.
- 🟡 **Importante** — Debe corregirse antes del cierre de la fase de diseño. Afecta usabilidad o consistencia.
- 🟢 **Sugerencia** — Mejora opcional. No bloquea ni la fase de diseño ni la de desarrollo.

---

## ESTRUCTURA DEL OUTPUT

```
## Design Review: [Nombre del Artefacto]
**Fecha de revisión:** [fecha]
**Revisado por:** UX/UI Designer Agent
**Resultado:** ✅ Aprobado | ⚠️ Aprobado con observaciones | 🔴 Requiere corrección

---

### Issues encontrados

[Si no hay issues: "Sin issues. El artefacto cumple todos los criterios."]

#### 🔴 Bloqueantes
- **[ID-001]** [Descripción del issue]
  - **Qué viola:** US-XXX criterio X / RG-00X / Arquitectura sección X
  - **Corrección sugerida:** [Descripción concreta de qué cambiar]

#### 🟡 Importantes
- **[ID-002]** [Descripción del issue]
  - **Qué viola:** [referencia]
  - **Corrección sugerida:** [Descripción concreta]

#### 🟢 Sugerencias
- **[ID-003]** [Descripción del issue o mejora]
  - **Beneficio:** [Por qué mejoraría la experiencia]

---

### Resumen
- Bloqueantes: N
- Importantes: N
- Sugerencias: N
- Próximo paso: [Corregir bloqueantes y re-revisar | Puede avanzar a desarrollo]
```

---

## CHECKLIST DE REVISIÓN

### NIVEL 1: Validación contra PRD

#### Criterios de aceptación
- [ ] El artefacto cubre todos los criterios de aceptación de las US referenciadas
- [ ] Los casos edge documentados en el PRD están contemplados en el diseño
- [ ] Los estados "imposibles" del PRD (ej: "todas las configs desactivadas no puede ocurrir") no aparecen en el diseño

#### Reglas Globales de UI
- [ ] **RG-001:** Ningún botón de acción principal usa estado `disabled` funcional
- [ ] **RG-002:** Existe un estado de loading con `...` animados para acciones con latencia
- [ ] **RG-003:** Si hay operaciones asíncronas, el diseño contempla mensaje a 10s y error a 30s
- [ ] **RG-004:** El diseño de formularios incluye estado de error con scroll automático al primer campo
- [ ] **RG-005:** Existe un componente de error global para errores de servidor/conexión
- [ ] **RG-006:** Los textos truncados incluyen tooltips con el texto completo
- [ ] **RG-007:** El color picker incluye advertencia de contraste (no bloqueante) cuando corresponde

#### Límites del sistema
- [ ] El diseño contempla el límite de 10 configuraciones adicionales
- [ ] El nombre de configuración con overflow usa truncado con `...`
- [ ] El calendario muestra correctamente el estado vacío (primera visita) y el estado con múltiples configs

### NIVEL 2: Validación contra Arquitectura

#### Stack y restricciones de implementación
- [ ] El diseño no propone librerías de iconos fuera de `lucide-react`
- [ ] Los colores de turno se tratan como dinámicos (no colores fijos en el design system)
- [ ] El dark mode funciona con la estrategia de clase `dark` (no media query)
- [ ] No hay funcionalidades que requieran backend (sin auth, sin sync, sin persistencia en nube)
- [ ] Las rutas del diseño coinciden con las rutas definidas en la Arquitectura

#### Animaciones
- [ ] Las animaciones no requieren librerías externas (Framer Motion, React Spring)
- [ ] Existe variante de `prefers-reduced-motion` para cada animación
- [ ] Las animaciones de calendario usan el callback `onNavigate` definido en la Arquitectura

#### Componentes referenciados
- [ ] Los componentes del diseño corresponden a los definidos en la estructura de proyecto
- [ ] Los componentes compartidos (`<LoadingDots />`, `<ErrorMessage />`, `<Button />`) se usan en lugar de rediseñarlos por pantalla

### NIVEL 3: Principios de UX y Accesibilidad

#### Accesibilidad (WCAG AA)
- [ ] El ratio de contraste texto/fondo es ≥ 4.5:1 en ambos modos (claro y oscuro)
- [ ] Todos los elementos interactivos son navegables por teclado
- [ ] El focus visible es claro y usa el token `focus-ring`
- [ ] Los modales y overlays implementan trampa de foco (focus trap)
- [ ] Las imágenes o iconos decorativos tienen `aria-hidden="true"`
- [ ] Los iconos sin texto visible tienen `aria-label`
- [ ] El elemento `<html>` tiene `lang="es"`

#### Mobile-first
- [ ] El diseño mobile (360px) es funcional y usable sin el diseño desktop
- [ ] Los elementos táctiles tienen un área de toque mínima de 44x44px
- [ ] El texto mínimo es legible en mobile (≥ 14px / text-sm)
- [ ] Los gestos de swipe tienen equivalente en botones visibles

#### Consistencia del design system
- [ ] Todos los tokens de color, tipografía y espaciado usados están definidos en el design system
- [ ] No hay valores "magic" (colores hex sueltos, px arbitrarios) fuera del design system
- [ ] Los componentes reutilizables se usan de forma consistente entre pantallas

#### Usabilidad
- [ ] El estado vacío (sin configuración / sin datos) está diseñado y no deja al usuario desorientado
- [ ] El usuario siempre tiene feedback visual de sus acciones (loading, éxito, error)
- [ ] La jerarquía visual es clara: el elemento más importante de la pantalla destaca visualmente
- [ ] Los textos de error son claros y accionables (no solo "Error")

---

## ISSUES RECURRENTES A VIGILAR

Estos son los errores de diseño más probables en DateOnDuty. Verificarlos específicamente:

1. **Colores de turno hardcodeados.** Si el diseño especifica un color fijo para representar un turno (ej: "azul para entrada, verde para salida"), es incorrecto. Los colores son siempre los que elige el usuario.

2. **Dark mode olvidado.** Si el artefacto solo especifica un tema, está incompleto. Ambos modos son obligatorios.

3. **Botón guardar con disabled.** Muy común en formularios. RG-001 lo prohíbe explícitamente.

4. **Fecha de inicio fuera del rango considerado.** El diseño debe contemplar que el usuario puede configurar una fecha de inicio en el pasado lejano o en el futuro. Los días sin turno asignado (antes de `cycleStartDate`) no deben colorearse.

5. **Onboarding como bloqueo.** El onboarding es una invitación, no un gate. El calendario debe ser usable desde el primer segundo sin completar ningún flujo de configuración.

6. **Vista expandida como página.** La vista expandida del día es un overlay, no una ruta. Si el diseño la trata como `/day/:date`, es incorrecto.

7. **Color picker sin fallback.** Algunos navegadores no soportan el color picker nativo. El diseño debe contemplar la paleta predeterminada como fallback.

8. **Timer de feedback en localStorage ignorado.** El formulario de feedback tiene un cooldown de 1 minuto. El diseño debe incluir el estado "debes esperar X segundos".
