---
name: skill-wireframe
description: Genera wireframes ASCII con anotaciones para cualquier pantalla, overlay o modal de DateOnDuty. Cubre estados requeridos (default, vacío, error, multiple-configs, loading). Produce wireframe mobile 360px siempre, desktop 1280px si el layout cambia significativamente.
---

# SKILL: Wireframe de Pantalla
**Fase:** Diseño
**Cuándo usarlo:** Al diseñar cualquier pantalla, overlay o modal del proyecto.
**Produce:** Wireframe ASCII con anotaciones + cobertura de estados requeridos.

---

## CÓMO INVOCAR

Indicar la pantalla y los estados a cubrir:

```
/skill-wireframe [PANTALLA] [ESTADOS]
```

Ejemplos:
- `/skill-wireframe calendario default,multiple-configs,empty`
- `/skill-wireframe config-form error,loading`
- `/skill-wireframe day-expanded default`

**Pantallas disponibles:**
`calendario` | `config-list` | `config-form` | `search` | `feedback` | `terms` | `privacy` | `day-expanded` | `onboarding` | `import-url-modal` | `help-overlay`

**Estados disponibles:**
`default` | `empty` | `loading` | `error` | `multiple-configs` | `single-config`

---

## INSTRUCCIONES

### 1. Antes de dibujar
Lee los criterios de aceptación del PRD para la pantalla solicitada y lista los elementos obligatorios que debe contener.

### 2. Convenciones ASCII

Usa estas convenciones consistentemente:

```
┌─────────────────────────┐  → contenedor / card / modal
│                         │
└─────────────────────────┘

[  Botón Primario      ]     → botón de acción principal
[  Botón Secundario    ]     → botón secundario / ghost

[ Input placeholder    ]     → campo de texto

◉ Opción seleccionada        → radio button seleccionado
○ Opción disponible          → radio button sin seleccionar

☑ Checkbox activo
☐ Checkbox inactivo

●──────────────●             → slider o progreso

≡                            → menú hamburguesa o ícono de lista
⟨ ⟩                          → flechas de navegación
✕                            → botón de cierre

████████ 100%                → barra de progreso o fondo coloreado
▓▓▓▓░░░░ 50%                 → barra parcial

[●]                          → color swatch o indicador de color

~ ~ ~ ~                      → contenido dinámico / animado

{VARIABLE}                   → texto dinámico que se calcula en runtime

/* ancho: 360px */           → comentario de dimensión (fuera del wireframe)
[1]                          → referencia a anotación numerada
```

### 3. Estructura del output

Para cada wireframe producir exactamente en este orden:

#### A. Encabezado
```
## Wireframe: [Nombre de Pantalla]
**Ruta:** /ruta
**US de referencia:** US-XXX, US-XXX
**Estado:** [nombre del estado]
```

#### B. Wireframe Mobile (360px)
```
/* mobile — 360px */
┌──────────────────────────┐
│                          │
│  [contenido del diseño]  │
│                          │
└──────────────────────────┘
```

#### C. Wireframe Desktop (1280px)
Solo si el layout cambia significativamente respecto al móvil. Si el diseño escala sin cambios estructurales, indicar: `> Desktop: layout idéntico al mobile, expande el ancho del contenedor principal a max-w-[1280px] centrado.`

#### D. Anotaciones
Lista numerada que corresponde a los `[N]` en el wireframe:

```
[1] — Descripción del comportamiento o restricción
[2] — Descripción del comportamiento o restricción
```

Cada anotación debe cubrir:
- Comportamiento de interacción (qué pasa al tap/click)
- Condiciones de visibilidad (cuándo aparece o desaparece)
- Referencia a regla UI si aplica (ej: "RG-001: este botón nunca se deshabilita")

#### E. Estados cubiertos
Lista los estados del wireframe que acabas de producir y cuáles quedan pendientes.

#### F. Notas de accesibilidad
```
A11Y:
- [elemento]: role="X", aria-label="Y"
- Navegación por teclado: Tab order esperado
- Focus visible: indicar cuál es el primer elemento con foco al abrir
```

---

## REGLAS ESPECÍFICAS POR PANTALLA

### Calendario (`/`)
- La celda del día es el elemento más importante. Muestra: número de día, franjas de color por configuración activa (con hora si aplica), indicador de "hoy".
- Si hay más configuraciones que espacio en la celda, mostrar las que quepan + indicador de overflow. El wireframe debe mostrar ambos casos.
- Los controles de navegación (flechas) deben ser visibles siempre, no solo en hover.
- El botón "Volver al día actual" solo aparece cuando no se está en el mes actual.
- El banner de onboarding y la animación de gestos se diseñan en el wireframe de estado `empty` (primera vez).

### Config Form (`/config/:id`)
- La hora de entrada solo acepta horas completas o medias horas. El diseño del input debe dejarlo claro.
- El campo "¿Estás en turno o franco?" condiciona el siguiente campo. Mostrar ambos estados.
- RG-001: El botón guardar nunca se deshabilita.
- RG-004: Mostrar estado de error con scroll al primer campo.

### Search (`/search`)
- El date picker debe ser un calendario interactivo, no un input de texto libre.
- El resultado muestra: config default primero, luego adicionales activas. Separación visual clara.
- Los 4 estados de un día: Entrada (con hora), Salida (con hora), Franco, En Turno.

### Day Expanded (overlay)
- Es un overlay sobre el calendario, no una página separada.
- Debe mostrar navegación lateral (día siguiente/anterior) y vertical (mes siguiente/anterior).
- Al cerrar, el calendario principal refleja el mes donde se encontraba la vista expandida.

### Import URL Modal (overlay)
- Aparece cuando la URL contiene `?cfg=`.
- Dos opciones: reemplazar default (con confirmación del nombre actual para la config desplazada) o guardar como adicional (requiere nombre).
- Estado de error: link inválido o dañado.
- Estado de límite alcanzado: 10 adicionales llenas.

### Onboarding
- La animación de gestos y el banner son **simultáneos**.
- El banner desaparece a los 50 segundos. La animación tiene su propio ciclo.
- El banner lleva a `/config` al hacer tap.
- No bloquean el uso del calendario.

---

## CHECKLIST ANTES DE ENTREGAR

- [ ] El wireframe mobile está completo para el estado solicitado
- [ ] Todos los elementos requeridos por el PRD están presentes
- [ ] Las anotaciones cubren comportamientos no obvios
- [ ] Los estados alternativos relevantes están identificados (aunque no todos dibujados)
- [ ] Las notas de accesibilidad están incluidas
- [ ] No hay funcionalidades fuera del MVP en el diseño
