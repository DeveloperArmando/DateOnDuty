# DateOnDuty — Casos Edge Analizados
**Versión:** 1.0  
**Fecha:** Febrero 2026  
**Documento:** `/docs/EDGE_CASES.md`  
**Propósito:** Referencia para todos los agentes del proyecto. Contiene todos los casos edge identificados y resueltos durante el levantamiento de requerimientos del PRD v2.0.

---

## Índice

- [Épica 1 — Visualización del Calendario](#épica-1--visualización-del-calendario)
- [Épica 2 — Configuración de Turnos](#épica-2--configuración-de-turnos)
- [Épica 3 — Búsqueda por Fecha](#épica-3--búsqueda-por-fecha)
- [Épica 4 — Personalización](#épica-4--personalización)
- [Épica 5 — Compartir Configuración](#épica-5--compartir-configuración)
- [Épica 6 — Autenticación y Persistencia](#épica-6--autenticación-y-persistencia)
- [Épica 7 — Onboarding y Ayuda](#épica-7--onboarding-y-ayuda)
- [Épica 8 — Legal y Cumplimiento](#épica-8--legal-y-cumplimiento)
- [Nuevos Puntos — Múltiples Pestañas](#nuevos-puntos--múltiples-pestañas)
- [Nuevos Puntos — Seguridad y JWT](#nuevos-puntos--seguridad-y-jwt)
- [Nuevos Puntos — Feedback](#nuevos-puntos--feedback)
- [Nuevos Puntos — Vista Expandida](#nuevos-puntos--vista-expandida)
- [Nuevos Puntos — Onboarding Extendido](#nuevos-puntos--onboarding-extendido)
- [Nuevos Puntos — Colores y Contraste](#nuevos-puntos--colores-y-contraste)
- [Nuevos Puntos — Sincronización v2.0](#nuevos-puntos--sincronización-v20)

---

## Épica 1 — Visualización del Calendario

### CE-01 — Año bisiesto
**Escenario:** El 29 de febrero existe solo en años bisiestos.  
**Resolución:** El 29 de febrero se trata como un día normal. Si el usuario configuró su primer día de turno el 29 de febrero de un año bisiesto, el sistema debe soportar esa fecha como punto de origen del cálculo. Al navegar de febrero de un año bisiesto a uno no bisiesto, el día 29 desaparece correctamente.

### CE-02 — Turno que cruza cambio de año
**Escenario:** Un turno 24x48 que inicia el 31 de diciembre debe continuar en enero del año siguiente.  
**Resolución:** El cambio de año no interfiere en el cálculo. El turno se pinta correctamente en ambos meses sin cortes visuales ni errores de cálculo.

### CE-03 — Cambio de horario de verano
**Escenario:** México y algunos estados fronterizos tienen cambio de horario estacional. Un turno de 24 horas en ese día técnicamente dura 23 o 25 horas reales.  
**Resolución:** En MVP los cálculos trabajan en **horas absolutas**, sin ajuste por horario de verano ni zona horaria del dispositivo. Se documenta como limitación conocida. La arquitectura debe permitir agregar soporte de zonas horarias en v3.0.

### CE-04 — Primer día de la semana
**Escenario:** En México y Latinoamérica existen convenciones mixtas (lunes o domingo).  
**Resolución:** El calendario inicia en **domingo por defecto**. El usuario puede configurarlo entre domingo y lunes únicamente. No se soportan otros días de inicio.

### CE-05 — Zona horaria del receptor al compartir
**Escenario:** Si el emisor está en México y el receptor en Argentina, las horas de entrada y salida mostradas podrían diferir.  
**Resolución:** En MVP no se soportan zonas horarias. Las horas son absolutas. Se agrega al backlog para v3.0. La arquitectura debe contemplar escalabilidad para este soporte.

### CE-06 — Pantallas muy pequeñas
**Escenario:** En teléfonos con pantallas de 4 pulgadas, el bloque de cada día puede ser extremadamente pequeño.  
**Resolución:** El diseño debe ser responsive. El día de la cuadrícula debe ser legible. Si existen más configuraciones que no caben por el espacio, se muestra un distintivo indicando que hay más configuraciones y se acceden desde la vista expandida. La configuración default debe ser siempre visible.

### CE-07 — Todas las configuraciones desactivadas
**Escenario:** ¿Qué muestra el calendario si el usuario desactiva todas las configuraciones?  
**Resolución:** Este escenario no puede ocurrir. La configuración default no puede desactivarse. Siempre hay al menos una configuración activa.

---

## Épica 2 — Configuración de Turnos

### CE-08 — Turno personalizado con horas de trabajo mayores a 24
**Escenario:** ¿Puede el usuario configurar 48 horas de trabajo seguidas? ¿Existe un límite máximo?  
**Resolución:** Los límites definidos son: **mínimo 12h y máximo 72h** tanto para horas de trabajo como para horas de descanso. Solo se permiten números enteros. No se aceptan decimales.

### CE-09 — Turno personalizado con horas de descanso en cero
**Escenario:** ¿Puede el usuario configurar 0 horas de descanso?  
**Resolución:** El mínimo de horas de descanso es **12 horas**. El sistema no permite valores menores.

### CE-10 — Fecha de inicio de turno en el futuro
**Escenario:** El usuario configura que su primer día de turno es en el futuro.  
**Resolución:** Soportado. El sistema debe permitir consultar fechas anteriores al inicio configurado, calculando el turno hacia atrás con la misma lógica. Los días anteriores a la fecha de inicio se muestran sin turno asignado (sin color ni marcado como franco).

### CE-11 — Configuración inicial: en turno o en franco
**Escenario:** Al configurar por primera vez, el usuario puede estar en turno o en franco en ese momento.  
**Resolución:** El sistema pregunta si el usuario está en turno o en franco al configurar. Si está en franco, pregunta cuándo inicia su próximo turno. El período de franco no excede las 72 horas (máximo definido), por lo que el origen no debe ser mayor a 3 días antes. El sistema calcula hacia atrás para determinar el origen del ciclo.

### CE-11b — Fecha de inicio en el pasado lejano
**Escenario:** El usuario configura que empezó a trabajar hace 10 años.  
**Resolución:** El sistema debe calcular correctamente el turno actual y cualquier fecha pasada sin degradación de rendimiento, independientemente del tiempo transcurrido desde el inicio configurado.

### CE-12 — Cambio de esquema de turno con historial previo
**Escenario:** El usuario usó 24x48 durante 6 meses y cambia a 12x36. ¿El cambio aplica desde el inicio o desde hoy?  
**Resolución:** El cambio aplica **hacia adelante y hacia atrás** desde el momento del cambio. No se mantiene historial de configuraciones anteriores. Todo el calendario se recalcula con la nueva configuración.

### CE-13 — Cambio de hora de entrada sin cambio de esquema
**Escenario:** El usuario mantiene 24x48 pero cambia la hora de entrada de 8:00 AM a 6:00 AM.  
**Resolución:** Misma resolución que CE-12. El cambio aplica a todo el calendario (pasado y futuro) desde el momento del cambio.

### CE-14 — Formato militar con hora inválida
**Escenario:** En formato militar, el usuario podría intentar ingresar 2500 o 9999.  
**Resolución:** El sistema valida que el valor esté entre **0000 y 2359**. Valores fuera de rango son rechazados con mensaje de error en el campo.

### CE-14b — Hora de entrada con minutos no permitidos
**Escenario:** El usuario intenta configurar la hora de entrada como 8:27 AM o 5:13 PM.  
**Resolución:** La hora de entrada solo puede configurarse en **horas completas (8:00) o medias horas (8:30)**. No se permiten otros valores de minutos.

---

## Épica 3 — Búsqueda por Fecha

### CE-15 — Búsqueda de fecha anterior al inicio del turno configurado
**Escenario:** El usuario configuró inicio el 1 de enero de 2024 y busca el 15 de diciembre de 2023.  
**Resolución:** El sistema realiza el cálculo hacia atrás con la configuración actual. No se muestra mensaje de error ni estado especial. Se calcula y muestra el estado correspondiente normalmente.

### CE-16 — Búsqueda con todas las configuraciones desactivadas
**Escenario:** ¿Qué muestra el buscador si no hay configuraciones activas?  
**Resolución:** No puede ocurrir. La configuración default no puede desactivarse. Siempre hay al menos una configuración activa (ver CE-07).

### CE-17 — Nombre de configuración muy largo en resultado de búsqueda
**Escenario:** Una configuración adicional tiene un nombre de 50 caracteres que no cabe en el resultado del buscador.  
**Resolución:** El sistema muestra lo que el layout permita, acorta el texto con **puntos suspensivos (...)** según RG-006. El texto completo es accesible mediante tooltip.

---

## Épica 4 — Personalización

### CE-18 — Color de turno igual al color de fondo del tema
**Escenario:** El usuario elige negro en modo oscuro o blanco en modo claro, haciendo los días de turno invisibles.  
**Resolución:** Se implementa un **sistema de advertencia de contraste** basado en estándar WCAG. La advertencia es visible pero no bloqueante. El usuario puede ignorarla y continuar. No se bloquea ni se cambia automáticamente el color. La advertencia se evalúa contra el **tema activo** en ese momento. Si el usuario cambia de tema y el color genera contraste insuficiente, la advertencia se muestra en ese momento.

### CE-19 — Dos configuraciones con el mismo color
**Escenario:** El usuario asigna el mismo color a su default y a una configuración adicional.  
**Resolución:** El sistema lo **permite** pero muestra un aviso: "Esta configuración tiene el mismo color que [nombre de configuración o 'Mi turno']. Podrían ser difíciles de distinguir en el calendario." El usuario decide si continúa.

### CE-20 — Color picker en navegadores que no lo soportan
**Escenario:** Algunos navegadores móviles tienen soporte limitado para el selector de color nativo.  
**Resolución:** Si el navegador no soporta color picker, se muestra únicamente la paleta predeterminada con un mensaje: "Tu navegador no soporta el selector de color personalizado."

### CE-49 — Contraste en ambos temas simultáneamente
**Escenario:** Un color puede tener buen contraste en modo claro pero insuficiente en modo oscuro.  
**Resolución:** La advertencia de contraste evalúa **contra el tema activo** en ese momento. Si el usuario cambia de tema posteriormente, el sistema evalúa el contraste en el nuevo tema y muestra la advertencia si aplica. No se cambia automáticamente el color.

---

## Épica 5 — Compartir Configuración

### CE-21 — URL generada excesivamente larga
**Escenario:** Múltiples configuraciones con esquemas personalizados y nombres largos podrían generar URLs muy largas.  
**Resolución:** Se decidió limitar a compartir **una sola configuración a la vez**. Los datos compartidos son mínimos: hora de entrada, esquema de turno, día de inicio del ciclo y color. El mecanismo usa **Base64** sobre el objeto serializado con formato `?cfg=[valor Base64]`, produciendo URLs compactas. Riesgo reducido significativamente.

### CE-22 — Link manipulado manualmente
**Escenario:** Un usuario modifica los parámetros de la URL a mano ingresando valores inválidos.  
**Resolución:** Al usar Base64, cualquier modificación manual del parámetro `cfg` produce un valor indecodificable o con datos inválidos. El sistema siempre valida los datos decodificados antes de aplicarlos. Si el link está malformado: "Este link no es válido o está dañado. Solicítalo de nuevo al remitente."

### CE-23 — Link con esquema personalizado
**Escenario:** Si el emisor tiene un esquema personalizado, ¿los datos completos van en la URL?  
**Resolución:** Los datos compartidos son: hora de entrada, horas de trabajo, horas de descanso (que definen el esquema), día de inicio del ciclo y color. El sistema siempre valida los parámetros decodificados antes de aplicarlos.

### CE-24 — Receptor abre el link en un navegador diferente
**Escenario:** El receptor tiene configuración en Chrome pero abre el link en Firefox. El localStorage de Firefox está vacío.  
**Resolución:** El sistema trata al receptor como usuario sin configuración previa. **Comportamiento aceptable y limitación conocida.** Para sincronizar entre dispositivos o navegadores se requiere cuenta (v2.0).

### CE-25 — El emisor modifica su configuración después de compartir el link
**Escenario:** El link generado queda desactualizado si el emisor cambia su turno después.  
**Resolución:** El link es **estático**: representa la configuración en el momento de generarlo. Si se quiere compartir la nueva configuración, se debe generar un nuevo link. Se documenta como limitación conocida del mecanismo de URL.

### CE-51 — Límite de 10 configuraciones alcanzado al recibir link
**Escenario:** El receptor quiere guardar la configuración recibida pero ya tiene 10 adicionales.  
**Resolución:** Se muestra: "Has alcanzado el límite de 10 configuraciones. Elimina al menos una para poder guardar esta." El sistema dirige al usuario a gestionar sus configuraciones y **recuerda el link pendiente** para continuar automáticamente al regresar. **Limitación conocida:** si el usuario recarga la página durante este proceso, el link pendiente se pierde y deberá abrir el link nuevamente.

---

## Épica 6 — Autenticación y Persistencia

> ⚠️ Esta épica corresponde a **v2.0**. Los casos edge están documentados para cuando se inicie el PRD de esa versión.

### CE-26 — Usuario con cuenta Google intenta recuperar contraseña
**Escenario:** El email existe pero fue registrado con Google OAuth. No tiene contraseña en el sistema.  
**Resolución:** Mostrar mensaje genérico: "Si existe una cuenta con ese correo, te enviaremos instrucciones. Si te registraste con Google, usa el botón de Google para iniciar sesión."

### CE-27 — Email ya registrado con contraseña intenta registrarse con Google
**Escenario:** El mismo email existe con contraseña y el usuario intenta hacer Sign In with Google.  
**Resolución:** Se **vinculan las cuentas automáticamente**.

### CE-28 — Google OAuth falla o está caído
**Escenario:** El servicio de Google está temporalmente no disponible.  
**Resolución:** Mostrar mensaje de error indicando que hay un problema externo. **No sugerir** que use email/contraseña como alternativa.

### CE-29 — El usuario revoca acceso de DateOnDuty desde su cuenta de Google
**Escenario:** El usuario elimina los permisos de DateOnDuty desde su cuenta de Google.  
**Resolución:** La próxima vez que intente iniciar sesión con Google, el sistema muestra un mensaje indicando que la cuenta fue desvinculada.

### CE-30 — localStorage lleno
**Escenario:** El dispositivo o navegador tiene el localStorage lleno.  
**Resolución:** El sistema detecta el error y muestra un mensaje en lenguaje comprensible para el usuario (sin mencionar "localStorage"). Algo como: "Tu dispositivo no tiene espacio disponible para guardar la configuración. Libera espacio en tu navegador e intenta de nuevo."

### CE-31 — El usuario usa modo incógnito
**Escenario:** En modo incógnito, el localStorage se borra al cerrar la ventana.  
**Resolución:** No se muestra ningún aviso. Se asume que el usuario entró intencionalmente en modo incógnito y es correcto que los datos se pierdan al cerrar la ventana.

### CE-32 — Sincronización con timestamp idéntico
**Escenario:** La configuración local y la de la nube tienen exactamente el mismo timestamp.  
**Resolución:** Si existe conflicto con timestamps idénticos, se muestra la pantalla de resolución al usuario para que decida. No se asume automáticamente ni la nube ni el local.

---

## Épica 7 — Onboarding y Ayuda

### CE-33 — El usuario completa el onboarding pero no configura nada
**Escenario:** Después de la animación introductoria, el usuario cierra la app sin configurar su turno.  
**Resolución:** En estado default, el calendario se muestra con el esquema 24x48 asumiendo que hoy es el primer día de turno con entrada a las 8:00 AM. Sin mensaje adicional. El prompt suave (banner) fue la única invitación.

### CE-34 — Tooltips de ayuda sobre elementos que no están visibles
**Escenario:** El botón "Volver al día actual" solo aparece fuera del mes actual. Si la ayuda se activa en el mes actual, ese botón no existe en pantalla.  
**Resolución:** Si un elemento no está visible en pantalla en ese momento, **no se muestra su tooltip**. La ayuda es contextual al estado actual de la pantalla.

### CE-35 — Idioma de la app
**Escenario:** ¿La app es solo en español o habrá soporte multiidioma?  
**Resolución:** Inicialmente en **español únicamente**. La arquitectura de textos debe contemplar i18n desde el inicio para permitir múltiples idiomas en v3.0.

### CE-48 — Comportamiento default con onboarding futuro tipo preguntas
**Escenario:** En v3.0 se planea un onboarding tipo preguntas guiadas. ¿El comportamiento default de 24x48 desaparece?  
**Resolución:** El comportamiento default **permanece** porque el usuario puede saltar las preguntas del onboarding. Al saltarlo, el sistema aplica 24x48 por defecto, coherente con el comportamiento actual.

---

## Épica 8 — Legal y Cumplimiento

### CE-36 — Actualización de Términos y Condiciones
**Escenario:** Los Términos y Condiciones se actualizan después del lanzamiento. ¿Los usuarios deben volver a aceptarlos?  
**Resolución:** Para **cambios materiales** se requiere aceptación activa de los usuarios existentes. Para cambios menores aplica aceptación tácita. Nota para el asesor legal: definir qué constituye un cambio material.

### CE-37 — Eliminación de cuenta y datos
**Escenario:** ¿El usuario puede solicitar la eliminación de sus datos (LFPDPPP)?  
**Resolución:** Se contempla para **v2.0**. El derecho debe quedar establecido en los documentos legales desde v1.0, documentando el canal por el cual los usuarios pueden ejercerlo mientras no existe el mecanismo automatizado.

### CE-38 — Exportación de datos personales
**Escenario:** Regulaciones de privacidad requieren que el usuario pueda solicitar una copia de sus datos.  
**Resolución:** Se contempla para **versiones futuras** (v3.0 o posterior).

---

## Nuevos Puntos — Múltiples Pestañas

### CE-40 — Cierre de sesión en una pestaña detectado por otras
**Escenario:** El usuario cierra sesión en la pestaña B. La pestaña A sigue activa con sesión.  
**Resolución:** La pestaña A muestra una notificación invitando a recargar la página: "Hay cambios pendientes. [Actualizar]". No redirige automáticamente.

### CE-41 — Modificación de configuración en pestaña A visible en pestaña B
**Escenario:** El usuario modifica configuración en la pestaña A mientras la pestaña B muestra el calendario.  
**Resolución:** La pestaña B detecta el cambio en localStorage (BroadcastChannel API o evento `storage`) y muestra: "Hay cambios pendientes. [Actualizar]". El usuario decide cuándo recargar.

---

## Nuevos Puntos — Seguridad y JWT

> ⚠️ Esta sección corresponde a **v2.0**. Documentado para referencia del Arquitecto de Software.

### CE-42 — El access token expira durante una operación de guardado
**Escenario:** El access token expira justo mientras el usuario está guardando su configuración.  
**Resolución:** El sistema debe reintentar automáticamente usando el refresh token sin que el usuario pierda los cambios. El proceso debe ser transparente para el usuario.

### CE-43 — El refresh token es robado
**Escenario:** Alguien obtiene el refresh token de un usuario.  
**Resolución:** El secret key por usuario permite invalidar todos los tokens de ese usuario específico sin afectar a otros. Al solicitar cambio de contraseña, se invalidan todas las sesiones activas. El usuario recibe una notificación de que debe iniciar sesión nuevamente en sus dispositivos. No se muestra panel de sesiones activas al usuario.

### CE-44 — Rotación del refresh token y uso doble
**Escenario:** El refresh token se usa dos veces (posible señal de robo o condición de carrera).  
**Resolución:** Cada uso del refresh token genera uno nuevo e invalida el anterior. Si el refresh token se usa dos veces, el sistema invalida **todas las sesiones del usuario** como medida de seguridad.

### CE-45 — Timeout durante guardado con error de red
**Escenario:** El usuario presiona guardar, el sistema procesa, y se cae la conexión.  
**Resolución:** El botón muestra estado de carga con puntos suspensivos animados (debounce activo). Timeout máximo: **30 segundos**. Si supera 10 segundos: mensaje sutil "Esto está tomando más tiempo de lo usual...". Si supera 30 segundos: error de conexión y el botón regresa a su estado normal. Mientras está procesando, clics adicionales no ejecutan nuevas solicitudes.

---

## Nuevos Puntos — Feedback

### CE-46 — Correo prerrellenado en formulario de feedback
**Escenario:** ¿Se prerellena el correo si el usuario tiene sesión iniciada?  
**Resolución:** En v2.0 se prerellena con el correo de la sesión activa. En MVP siempre es manual. Si el usuario envía feedback sin correo real, no hay forma de responderle pero el comportamiento es aceptable. El correo es obligatorio y se valida solo por formato en frontend.

---

## Nuevos Puntos — Vista Expandida

### CE-47 — Navegación lateral en vista expandida cruzando mes
**Escenario:** El usuario está en la vista expandida del último día de enero y navega al día siguiente.  
**Resolución:** La vista expandida **sí puede cruzar al mes siguiente**. Al cerrar la vista expandida después de haber navegado de mes, el calendario principal muestra el mes al que se llegó en la vista expandida (no el mes desde donde se abrió).

### CE-47b — Navegación vertical en vista expandida con días que no existen
**Escenario:** El usuario está en el día 31 de enero en vista expandida y navega al mes siguiente (febrero, que no tiene día 31).  
**Resolución:** El sistema navega al **último día disponible del mes destino** (ej. 28 o 29 de febrero según el año). Al navegar a meses más largos (ej. de abril a mayo), el día siempre existe y no hay problema.

### CE-52 — Estado del calendario al cerrar vista expandida tras navegar de mes
**Escenario:** El usuario abre vista expandida en enero, navega a febrero y la cierra. ¿El calendario principal muestra enero o febrero?  
**Resolución:** El calendario principal muestra **febrero** (el mes en el que se encontraba la vista expandida al cerrarse).

---

## Nuevos Puntos — Onboarding Extendido

### CE-33b — Prompt suave: cuándo se marca como visto
**Escenario:** El usuario cierra el navegador antes de que pasen los 50 segundos del banner.  
**Resolución:** El flag de "visto" se marca en localStorage **cuando el banner desaparece** (al cumplirse los 50 segundos), no cuando aparece. Si el usuario cierra el navegador antes, el flag no se guarda y el banner se muestra de nuevo la próxima visita con el contador reiniciado desde cero.

### CE-33c — Prompt suave vs animación de onboarding: ¿simultáneos o secuenciales?
**Escenario:** ¿La animación y el banner compiten por la atención del usuario?  
**Resolución:** Aparecen **simultáneamente**. El banner tiene 50 segundos de duración considerable precisamente para dar tiempo a que el usuario vea la animación primero y luego tenga oportunidad de interactuar con el banner.

---

## Nuevos Puntos — Colores y Contraste

### CE-49b — Evaluación de contraste al cambiar de tema
**Escenario:** El usuario configura un color con buen contraste en modo claro, luego cambia a modo oscuro donde ese mismo color tiene contraste insuficiente.  
**Resolución:** La advertencia de contraste evalúa contra el **tema activo en ese momento**. Al cambiar de tema, si el color genera contraste insuficiente en el nuevo tema, la advertencia se muestra en ese momento. No se cambia automáticamente el color.

---

## Nuevos Puntos — Sincronización v2.0

### CE-50 — Iniciar sesión sin configuración local previa
**Escenario:** El usuario inicia sesión en un dispositivo donde nunca ha usado la app (sin configuración local).  
**Resolución:** El proceso de carga de configuración desde la nube es **transparente y automático** sin mostrar pantalla de resolución de conflictos. Se cargan y activan todas las configuraciones de la nube automáticamente. Este comportamiento es de **v2.0**.

---

## Resumen de Limitaciones Conocidas

Las siguientes limitaciones fueron analizadas y aceptadas conscientemente. Están documentadas para que todos los agentes las tengan presentes:

| Limitación | Épica | Versión que la resuelve |
|---|---|---|
| Los cálculos de turnos no ajustan por cambio de horario de verano ni zona horaria | Calendario | v3.0 |
| La configuración se pierde si el usuario borra el localStorage (sin cuenta) | Persistencia | v2.0 |
| El link compartido representa la configuración en el momento de generarlo. Si el emisor cambia su turno después, el link queda desactualizado | Compartir | No aplica (diseño intencional) |
| El link es opaco por diseño (Base64). No es legible para el usuario final | Compartir | No aplica (diseño intencional) |
| Si el usuario recarga la página durante el flujo de liberar espacio para recibir un link, el link pendiente se pierde | Compartir | v2.0 (con backend) |
| Sin cuenta, la configuración no se sincroniza entre navegadores o dispositivos diferentes | Persistencia | v2.0 |
| En modo incógnito, la configuración se pierde al cerrar la ventana | Persistencia | No aplica (comportamiento esperado) |
| La app solo está disponible en español en MVP | Idioma | v3.0 |

---

*Documento generado durante el levantamiento de requerimientos de DateOnDuty. v1.0 — Febrero 2026*  
*Referencia complementaria: `DateOnDuty_PRD_v2.md` y `DateOnDuty_US008_update.md`*
