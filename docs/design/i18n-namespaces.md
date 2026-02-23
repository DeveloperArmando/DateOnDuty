# DateOnDuty — Mapa de Namespaces i18n

**Rol:** UX/UI Designer Senior
**Fecha:** Feb 2026
**Referencia arquitectura:** CLAUDE.md (sección i18n), 6 namespaces definidos
**Archivos destino:** `src/i18n/locales/es/{namespace}.json`

---

## Reglas generales

1. **Cero strings hardcodeados en JSX.** Todo texto visible al usuario pasa por `t('namespace:key')`.
2. **Formato de key:** `camelCase` para palabras simples, `punto.notación` para agrupaciones dentro del mismo namespace.
3. **Interpolación:** Usar `{{variable}}` para valores dinámicos (nombres, horas, fechas).
4. **Plurales:** Usar el sistema de pluralización de i18next cuando aplique.
5. **No duplicar keys entre namespaces.** Si un string se usa en más de un lugar, va en `common`.

---

## Namespace: `common`

**Archivo:** `src/i18n/locales/es/common.json`
**Propósito:** Strings reutilizables en toda la app — acciones genéricas, estados, labels comunes.

```json
{
  "actions": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "confirm": "Confirmar",
    "delete": "Eliminar",
    "edit": "Editar",
    "back": "Volver",
    "close": "Cerrar",
    "accept": "Entendido",
    "search": "Buscar"
  },
  "states": {
    "loading": "Cargando...",
    "saving": "Guardando...",
    "sending": "Enviando...",
    "error": "Error",
    "success": "Listo"
  },
  "theme": {
    "toggleDark": "Cambiar a modo oscuro",
    "toggleLight": "Cambiar a modo claro"
  },
  "nav": {
    "config": "Configuración",
    "search": "Buscar fecha",
    "feedback": "Enviar feedback",
    "terms": "Términos y condiciones",
    "privacy": "Política de privacidad",
    "backToCalendar": "Volver al calendario"
  },
  "errors": {
    "connectionError": "No se pudo conectar. Revisa tu conexión a internet e intenta de nuevo.",
    "unknownError": "Ocurrió un error inesperado. Intenta de nuevo."
  },
  "footer": {
    "terms": "Términos",
    "privacy": "Privacidad",
    "feedback": "Enviar feedback"
  },
  "weekDays": {
    "short": {
      "sun": "Dom",
      "mon": "Lun",
      "tue": "Mar",
      "wed": "Mié",
      "thu": "Jue",
      "fri": "Vie",
      "sat": "Sáb"
    },
    "long": {
      "sun": "Domingo",
      "mon": "Lunes",
      "tue": "Martes",
      "wed": "Miércoles",
      "thu": "Jueves",
      "fri": "Viernes",
      "sat": "Sábado"
    }
  },
  "months": {
    "jan": "Enero",
    "feb": "Febrero",
    "mar": "Marzo",
    "apr": "Abril",
    "may": "Mayo",
    "jun": "Junio",
    "jul": "Julio",
    "aug": "Agosto",
    "sep": "Septiembre",
    "oct": "Octubre",
    "nov": "Noviembre",
    "dec": "Diciembre"
  }
}
```

---

## Namespace: `calendar`

**Archivo:** `src/i18n/locales/es/calendar.json`
**Propósito:** Todo lo visible en la pantalla `/` — navegación, celdas, states de turno, help overlay, day-expanded.

```json
{
  "navigation": {
    "prevYear": "Año anterior",
    "nextYear": "Año siguiente",
    "prevMonth": "Mes anterior",
    "nextMonth": "Mes siguiente",
    "backToToday": "Volver a hoy",
    "openHelp": "Abrir ayuda",
    "closeHelp": "Cerrar ayuda"
  },
  "shift": {
    "entry": "Entrada a las {{time}}",
    "exit": "Salida a las {{time}}",
    "onDuty": "En turno",
    "offDuty": "Día libre",
    "entryShort": "{{time}}",
    "exitShort": "{{time}}↑",
    "overflow": "+{{count}} más"
  },
  "dayExpanded": {
    "title": "{{dayName}}, {{date}}",
    "prevDay": "Día anterior",
    "nextDay": "Día siguiente",
    "prevMonthNav": "Mes anterior",
    "nextMonthNav": "Mes siguiente",
    "noShifts": "Día libre",
    "noShiftsDesc": "Ningún turno activo este día",
    "searchLink": "Ver en buscador de fechas",
    "ariaLabel": "Detalle del {{dayName}} {{date}}"
  },
  "help": {
    "title": "¿Qué ves en el calendario?",
    "close": "Cerrar ayuda",
    "items": {
      "appName": "Toca para volver al mes actual",
      "monthYear": "Mes y año visible",
      "helpButton": "Cerrar esta ayuda",
      "weekHeader": "Días de la semana (configurable: Dom o Lun primero)",
      "dayCell": "Toca cualquier día para ver el detalle de tus turnos",
      "shiftStripe": "Franja de color = turno activo ese día",
      "overflowBadge": "+N = hay más turnos activos ese día (toca el día para verlos)",
      "gestureHint": "Desliza ↕ para cambiar de mes, ↔ para cambiar de año",
      "backToday": "Toca para volver al mes actual"
    }
  }
}
```

---

## Namespace: `config`

**Archivo:** `src/i18n/locales/es/config.json`
**Propósito:** Pantallas `/config` y `/config/:id` — lista, formulario, modales de confirmación.

```json
{
  "list": {
    "title": "Configuración",
    "addButton": "Añadir turno",
    "defaultBadge": "Principal",
    "limitReached": "Has alcanzado el límite de 10 turnos adicionales. Elimina uno para poder añadir otro.",
    "emptyAdditionals": "Solo tienes un turno configurado.",
    "kebabLabel": "Opciones de {{name}}",
    "actions": {
      "edit": "Editar",
      "makeDefault": "Hacer turno principal",
      "delete": "Eliminar"
    }
  },
  "form": {
    "titleNew": "Nuevo turno",
    "titleEdit": "Editar turno",
    "saveButton": "Guardar turno",
    "savedToast": "Turno guardado",
    "fields": {
      "name": "Nombre del turno",
      "namePlaceholder": "Ej: Turno noche, Guardia A...",
      "scheme": "Esquema de turno",
      "customWork": "Horas de trabajo",
      "customRest": "Horas de descanso",
      "customHint": "Entre 12 y 72 horas. Solo números enteros.",
      "entryTime": "Hora de entrada",
      "cycleStart": "Inicio del ciclo",
      "onRest": "¿Estás actualmente en franco?",
      "nextShiftStart": "Tu próximo inicio de turno",
      "color": "Color del turno",
      "changeColor": "Cambiar color",
      "colorUnsupported": "Tu navegador no soporta el selector de color. Elige de la paleta o ingresa un código hex.",
      "timeFormat": "Formato de hora",
      "timeFormat12": "12 horas (8:00 AM)",
      "timeFormat24": "24 horas (20:00)"
    },
    "schemes": {
      "24x48": "24x48",
      "12x36": "12x36",
      "48x48": "48x48",
      "custom": "Personalizado"
    },
    "onRest": {
      "no": "No (por defecto)",
      "yes": "Sí, estoy en franco"
    },
    "globalPrefs": {
      "sectionTitle": "Preferencias globales",
      "firstDay": "Primer día de la semana",
      "firstDaySun": "Domingo (por defecto)",
      "firstDayMon": "Lunes",
      "gridColor": "Color de líneas del calendario",
      "gridColorDefault": "Gris (por defecto)",
      "appTheme": "Tema de la aplicación",
      "themLight": "Claro",
      "themeDark": "Oscuro"
    },
    "errors": {
      "nameRequired": "El nombre del turno es obligatorio.",
      "nameDuplicate": "Ya existe un turno con ese nombre. Elige otro.",
      "customWorkRequired": "Ingresa las horas de trabajo.",
      "customWorkRange": "Las horas de trabajo deben estar entre 12 y 72.",
      "customRestRequired": "Ingresa las horas de descanso.",
      "customRestRange": "Las horas de descanso deben estar entre 12 y 72.",
      "entryTimeRequired": "La hora de entrada es obligatoria.",
      "cycleStartRequired": "La fecha de inicio del ciclo es obligatoria.",
      "colorInvalid": "El código de color no es válido. Usa el formato #RRGGBB.",
      "colorContrast": "El color elegido puede dificultar la lectura del texto sobre la franja del turno. (Contraste: {{ratio}}:1. Mínimo recomendado: 4.5:1)"
    }
  },
  "deleteModal": {
    "title": "¿Eliminar \"{{name}}\"?",
    "description": "Esta acción no se puede deshacer.",
    "confirmButton": "Sí, eliminar"
  },
  "makeDefaultModal": {
    "title": "Cambiar turno principal",
    "description": "\"{{newDefault}}\" se convertirá en tu turno principal. \"{{oldDefault}}\" pasará a ser un turno adicional.",
    "nameLabel": "Nombre para \"{{oldDefault}}\" como adicional",
    "namePlaceholder": "Ej: Mi turno anterior",
    "confirmButton": "Confirmar cambio",
    "errors": {
      "nameRequired": "Escribe un nombre para el turno que pasa a adicional.",
      "nameDuplicate": "Ese nombre ya existe. Elige otro."
    }
  }
}
```

---

## Namespace: `search`

**Archivo:** `src/i18n/locales/es/search.json`
**Propósito:** Pantalla `/search` — picker, resultados, navegación.

```json
{
  "title": "Buscar fecha",
  "pickerLabel": "Seleccionar fecha",
  "prevMonth": "Mes anterior",
  "nextMonth": "Mes siguiente",
  "results": {
    "defaultSection": "Mi turno",
    "additionalsSection": "Adicionales activas ({{count}})",
    "viewInCalendar": "Ver {{date}} en el calendario",
    "noResults": "No hay turnos activos para esta fecha."
  },
  "shift": {
    "entry": "Entrada a las {{time}}",
    "exit": "Salida a las {{time}}",
    "onDuty": "En turno",
    "offDuty": "Día libre"
  }
}
```

---

## Namespace: `feedback`

**Archivo:** `src/i18n/locales/es/feedback.json`
**Propósito:** Pantalla `/feedback` — formulario, estados de carga, cooldown, éxito, errores.

```json
{
  "title": "Enviar feedback",
  "fields": {
    "type": "Tipo de comentario",
    "typeOptions": {
      "bug": "Error o problema",
      "idea": "Sugerencia de mejora",
      "other": "Otro"
    },
    "message": "Tu mensaje",
    "messagePlaceholder": "Describe el error o tu sugerencia con el mayor detalle posible...",
    "email": "Tu correo (opcional)",
    "emailPlaceholder": "Para responderte si es necesario"
  },
  "submit": "Enviar feedback",
  "cooldown": {
    "wait": "Espera {{seconds}} segundos antes de enviar otro mensaje.",
    "waitShort": "{{seconds}}s"
  },
  "sending": {
    "slowWarning": "Esto está tardando más de lo esperado. Espera un momento..."
  },
  "success": {
    "title": "Mensaje enviado",
    "description": "Gracias por tu feedback. Lo revisaremos pronto."
  },
  "errors": {
    "typeRequired": "Selecciona el tipo de comentario.",
    "messageRequired": "Escribe tu mensaje.",
    "messageTooShort": "El mensaje debe tener al menos 10 caracteres.",
    "emailInvalid": "El correo no tiene un formato válido.",
    "connectionError": "No se pudo enviar el feedback. Revisa tu conexión e intenta de nuevo."
  }
}
```

---

## Namespace: `onboarding`

**Archivo:** `src/i18n/locales/es/onboarding.json`
**Propósito:** Banner de configuración inicial, animación de gestos, mensajes de importación de URL.

```json
{
  "banner": {
    "message": "Configura tu turno para ver tu horario real",
    "ariaLabel": "Ir a configurar mi turno",
    "progressLabel": "Tiempo restante del aviso"
  },
  "swipeHint": {
    "months": "meses",
    "years": "años",
    "ariaHidden": true
  },
  "importUrl": {
    "title": "Turno compartido recibido",
    "preview": {
      "scheme": "Esquema:",
      "entryTime": "Entrada:",
      "color": "Color:"
    },
    "question": "¿Qué quieres hacer con este turno?",
    "actions": {
      "replace": "Reemplazar Mi turno actual",
      "saveAdditional": "Guardar como turno adicional",
      "cancel": "Cancelar"
    },
    "replaceConfirm": {
      "title": "¿Reemplazar Mi turno?",
      "description": "Esta acción reemplazará tu turno predeterminado. No se puede deshacer.",
      "confirm": "Sí, reemplazar Mi turno"
    },
    "saveAdditional": {
      "title": "Guardar como turno adicional",
      "nameLabel": "Nombre del turno",
      "namePlaceholder": "Ej: Turno compartido",
      "saveButton": "Guardar turno",
      "errors": {
        "nameRequired": "Escribe un nombre para el turno.",
        "nameDuplicate": "Ya existe un turno con ese nombre. Elige otro."
      },
      "suggestion": "¿Usar \"{{name}}\"?"
    },
    "invalid": {
      "title": "Link no válido",
      "description": "El link compartido no se pudo leer. Puede estar incompleto o dañado.",
      "accept": "Entendido"
    },
    "limitReached": {
      "title": "Límite alcanzado",
      "description": "Ya tienes 10 turnos adicionales. Elimina uno antes de importar otro.",
      "goToConfig": "Ir a Configuración"
    }
  }
}
```

---

## Resumen de cobertura

| Namespace | Archivo | Strings aprox. | Pantallas que lo consumen |
|---|---|---|---|
| `common` | common.json | ~45 | Todas |
| `calendar` | calendar.json | ~30 | `/` |
| `config` | config.json | ~55 | `/config`, `/config/:id` |
| `search` | search.json | ~15 | `/search` |
| `feedback` | feedback.json | ~20 | `/feedback` |
| `onboarding` | onboarding.json | ~30 | `/` (banner + modal importación) |

**Total estimado:** ~195 strings en MVP v1.0

> **Nota:** Las páginas `/terms` y `/privacy` no tienen namespace de i18n — su contenido es texto legal estático que no requiere translación en MVP (solo existe locale `es`). Se renderiza como JSX o como string cargado desde un archivo de contenido separado.

---

## Convención de uso en código

```tsx
// Importar en componente:
import { useTranslation } from 'react-i18next'

// En el componente:
const { t } = useTranslation('config')
// o múltiples namespaces:
const { t } = useTranslation(['config', 'common'])

// Uso:
t('form.fields.name')                    // → "Nombre del turno"
t('form.errors.nameDuplicate')           // → "Ya existe un turno con ese nombre..."
t('deleteModal.title', { name: 'Turno noche' })  // → "¿Eliminar "Turno noche"?"
t('common:actions.save')                 // → "Guardar" (namespace explícito)
```
