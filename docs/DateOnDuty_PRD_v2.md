# DateOnDuty — Product Requirements Document (PRD)
**Versión:** 2.0  
**Fecha:** Febrero 2026  
**Product Owner:** Armando Santiago  
**Estado:** Aprobado — Listo para fase de diseño

---

## Historial de Cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | Feb 2026 | Versión inicial |
| 1.1 | Feb 2026 | Plataforma simplificada a web responsive. PWA/Android/iOS movidos a v3.0. Modo oscuro/claro agregado. Páginas legales agregadas como requisito de lanzamiento. |
| 2.0 | Feb 2026 | Autenticación movida a v2.0. Alcance MVP redefinido como app de consulta local pura. Incorporación de análisis exhaustivo de casos edge. Nuevas épicas: Compartir por URL, Feedback, Seguridad. Reglas globales de UI. Casos edge documentados en cada US. |

---

## 1. Visión del Producto

### Problema que resuelve
Los trabajadores con turnos rotativos (24x48, 12x36, 48x48, etc.) pueden calcular intuitivamente su semana laboral, pero pierden contexto cuando necesitan saber qué turno tendrán en una fecha específica futura o pasada: un cumpleaños, un evento familiar, una cita médica. Hoy resuelven esto manualmente con cálculos mentales o en papel.

### Solución
**DateOnDuty** es una aplicación web de consulta de turnos rotativos que permite a cualquier trabajador visualizar su calendario laboral de forma clara y visual, consultar cualquier fecha y conocer su turno en segundos, compartir su configuración con familia y compañeros, y personalizar la experiencia según su horario y preferencias.

### Plataforma
Aplicación web accesible desde cualquier navegador, con diseño responsive optimizado para móvil y desktop. No requiere instalación.

### Usuarios objetivo
- **Usuario primario:** Trabajadores con turnos rotativos en México y Latinoamérica (guardias, enfermeros, operadores, personal de seguridad, trabajadores industriales, etc.)
- **Usuario secundario:** Familiares y compañeros que quieren consultar el turno de alguien más.

### Mercado objetivo
Lanzamiento piloto en México con enfoque de expansión a Latinoamérica.

### Contexto del proyecto
Este proyecto tiene como objetivo secundario documentar el ciclo completo de desarrollo de un producto digital, desde conceptualización hasta producción, pasando por las fases de Planificación y Definición, Diseño, Desarrollo, Calidad, Deploy e Infraestructura.

---

## 2. Principios de Producto

- **Local-first:** Todos los datos y cálculos viven en el dispositivo del usuario. No se requiere conexión para ninguna función principal.
- **Backend ausente en MVP:** No existe backend en v1.0. Toda la lógica es frontend puro.
- **Privacidad por defecto:** El usuario no necesita cuenta para usar la app. Sus datos se guardan en localStorage.
- **Simple e intuitiva:** Diseñada para el público más amplio posible, con onboarding visual que no interrumpe el uso inmediato.
- **Web-first:** Accesible desde cualquier navegador sin instalación. Responsive para móvil y desktop.
- **Escalable desde el diseño:** La arquitectura de textos debe contemplar i18n desde el inicio aunque solo se implemente español en MVP. Los cálculos de turnos deben contemplar zonas horarias aunque no se implementen en MVP.

---

## 3. Restricciones Técnicas de Negocio

> *Estas restricciones son decisiones de producto que debe respetar el Arquitecto de Software al definir el stack y la arquitectura.*

1. **Frontend-first:** Todos los cálculos de turnos, fechas y configuraciones se ejecutan en el cliente.
2. **Sin backend en MVP:** No existe servidor en v1.0. Se incorpora en v2.0 únicamente para autenticación y persistencia.
3. **URL-encoded sharing:** El mecanismo de compartir configuración codifica los datos en la URL. No requiere backend.
4. **Web responsive:** Funciona en navegadores de móvil y desktop. No es PWA ni app nativa en esta versión.
5. **localStorage como almacenamiento:** Toda la persistencia local usa localStorage del navegador.
6. **Sin sesión requerida:** Ninguna función está bloqueada por autenticación en MVP.
7. **i18n preparado:** La arquitectura de textos debe permitir internacionalización futura aunque solo se implemente español.
8. **Zonas horarias escalables:** Los cálculos trabajan en horas absolutas en MVP, pero la arquitectura debe permitir soporte de zonas horarias en versiones futuras.
9. **Formspree para feedback:** El mecanismo de feedback usa Formspree como servicio externo en MVP. Se migra a backend propio en v2.0.

---

## 4. Reglas Globales de UI

> *Estas reglas aplican a toda la interfaz sin excepción. El UX/UI Designer debe respetarlas en todos los flujos.*

### RG-001 — Botones de guardado nunca deshabilitados
Ningún botón de guardado o acción principal se deshabilita por errores de validación. Los errores se muestran al intentar ejecutar la acción o en tiempo real sobre el campo correspondiente. El botón siempre es clicable.

### RG-002 — Estado de carga visual
Al ejecutar una acción de guardado, el botón muestra tres puntos suspensivos animados para indicar que está procesando. Durante este estado, clics adicionales no ejecutan nuevas solicitudes (debounce activo). El botón no se deshabilita visualmente pero la acción está bloqueada internamente.

### RG-003 — Timeout y mensajes de espera
El timeout máximo para cualquier operación es de 30 segundos. Si la operación supera los 10 segundos, se muestra un mensaje sutil: "Esto está tomando más tiempo de lo usual..." Si supera los 30 segundos, se muestra un error de conexión y el botón regresa a su estado normal.

### RG-004 — Scroll al primer error
Si al intentar guardar existen errores de validación, el sistema hace scroll automático al primer campo con error y lo resalta visualmente. El botón muestra debajo un texto en color de error: "Hay errores en el formulario, por favor revísalos."

### RG-005 — Errores de servidor
Si el error es de servidor o conexión, se muestra un mensaje global no asociado a ningún campo: "Hay problemas de conexión, por favor vuelve a intentarlo."

### RG-006 — Textos truncados
Cualquier texto que supere el espacio disponible en el layout se trunca con puntos suspensivos (...). El texto completo debe ser accesible mediante tooltip o vista expandida según el contexto.

### RG-007 — Advertencia de contraste
Al seleccionar un color para cualquier configuración, si el color genera contraste insuficiente contra el fondo del tema activo (evaluado según estándar WCAG), se muestra una advertencia visible pero no bloqueante. El usuario puede ignorarla y continuar. Si el usuario cambia de tema posteriormente y el color genera contraste insuficiente en el nuevo tema, la advertencia se muestra en ese momento.

---

## 5. Definición del MVP

El MVP es una aplicación web de consulta local pura. No requiere registro ni conexión a internet para ninguna función.

El MVP permite que un usuario pueda:
1. Abrir la app y ver su calendario del mes actual con su turno visualizado de inmediato.
2. Configurar su horario de turno con esquemas predeterminados o personalizado.
3. Navegar entre meses y años.
4. Buscar una fecha específica y conocer su turno.
5. Personalizar colores y tema (oscuro/claro).
6. Gestionar múltiples configuraciones (propia + configuraciones de terceros recibidas).
7. Compartir su configuración con otra persona mediante URL sin necesidad de cuenta.

---

## 6. User Stories con Criterios de Aceptación

---

### ÉPICA 1: Visualización del Calendario

---

**US-001 — Ver calendario del mes actual**
*Como trabajador con turno rotativo, quiero ver el mes actual con mis días de turno visualmente diferenciados, para saber de un vistazo qué días trabajo.*

**Criterios de aceptación:**
- Al abrir la app, se muestra el mes actual por defecto sin requerir ninguna acción del usuario.
- Los días de turno se muestran con un gradiente del color configurado: más intenso al inicio del bloque del día, más tenue al final.
- Se muestra un indicador de hora de entrada en el día que inicia el turno.
- Se muestra un indicador de hora de salida en el día que finaliza el turno.
- Los días intermedios de un turno que cruza medianoche se muestran coloreados sin indicador de hora.
- Los días de descanso (franco) no tienen color de turno.
- El día actual tiene un distintivo visual notorio (borde resaltado o equivalente).
- Si no existe configuración previa, el calendario se muestra con el esquema 24x48 asumiendo que hoy es el primer día de turno con entrada a las 8:00 AM. Ver US-011 para el prompt de configuración inicial.

**Casos edge:**
- **Año bisiesto:** El 29 de febrero se trata como un día normal. Si el cálculo del turno incluye ese día, debe procesarse correctamente. Si el usuario configuró su primer día de turno el 29 de febrero de un año bisiesto, el sistema debe soportar esa fecha como punto de origen del cálculo.
- **Turno que cruza cambio de año:** Un turno que inicia en diciembre y termina en enero se pinta correctamente en ambos meses sin cortes visuales ni errores de cálculo.
- **Horas absolutas:** Los cálculos trabajan en horas absolutas, no en horas del reloj local. No se contempla ajuste por horario de verano en MVP. La arquitectura debe permitir agregar soporte de zonas horarias en versiones futuras.
- **Todas las configuraciones desactivadas:** La configuración default no puede desactivarse. Este escenario no puede ocurrir.

---

**US-002 — Navegar entre meses y años**
*Como usuario, quiero desplazarme entre meses y años en el calendario, para consultar mis turnos en fechas pasadas o futuras.*

**Criterios de aceptación:**
- Deslizar verticalmente cambia de mes: hacia abajo = mes siguiente, hacia arriba = mes anterior.
- Deslizar horizontalmente cambia de año: hacia la derecha = año siguiente, hacia la izquierda = año anterior.
- Iconos sutiles permanentes indican la dirección de navegación disponible.
- Al estar en un mes diferente al actual, aparece un botón visible de "Volver al día actual".
- Al estar en el mes actual, el botón de regreso no se muestra.
- No existe límite de navegación hacia el pasado ni hacia el futuro.
- El primer día de la semana es domingo por defecto. El usuario puede configurarlo entre domingo y lunes únicamente.

**Casos edge:**
- **Cambio de año desde febrero de año bisiesto:** Al navegar de febrero 2024 (bisiesto) a febrero 2025 (no bisiesto) deslizando hacia abajo dos veces, el día 29 desaparece correctamente en el mes sin bisiesto.

---

**US-003 — Ver turno de múltiples configuraciones en el calendario**
*Como usuario con varias configuraciones activas, quiero ver todas en el mismo calendario diferenciadas por color, para comparar turnos de diferentes personas o configuraciones.*

**Criterios de aceptación:**
- Si hay múltiples configuraciones activas, cada día muestra franjas de color por configuración en el mismo bloque del día.
- Cada franja muestra el indicador de hora de entrada o salida en texto legible según corresponda.
- Si el número de configuraciones activas supera el espacio visual disponible en el bloque del día, se muestran las que quepan y se muestra un distintivo visual que indica que hay más configuraciones no visibles.
- Al hacer tap o click en un día con configuraciones desbordadas, se abre la vista expandida del día. Ver US-013.
- Los días intermedios (en turno pero sin entrada ni salida ese día) se muestran coloreados sin indicador de hora.

**Casos edge:**
- **Dos configuraciones con el mismo color:** El sistema lo permite pero muestra un aviso al momento de seleccionar el color: "Esta configuración tiene el mismo color que [nombre de configuración o 'Mi turno']. Podrían ser difíciles de distinguir en el calendario." El usuario decide si continúa.
- **Pantallas pequeñas:** El diseño debe garantizar que al menos la configuración default sea siempre visible en el bloque del día sin importar el tamaño de pantalla. Las configuraciones adicionales que no quepan se acceden desde la vista expandida.

---

**US-013 — Vista expandida del día**
*Como usuario, quiero ver el detalle completo de un día específico, para consultar todas las configuraciones activas aunque no quepan en el bloque del calendario.*

**Criterios de aceptación:**
- La vista expandida muestra todas las configuraciones activas con su color, nombre (o "Mi turno" para la default), y estado: Entrada (con hora), Salida (con hora), Franco, o En Turno.
- La vista expandida tiene scroll si el número de configuraciones supera el espacio visible.
- La vista expandida permite navegación lateral hacia el día siguiente y anterior.
- La vista expandida permite navegación vertical hacia el mes siguiente y anterior.
- Al navegar lateralmente al día siguiente o anterior, si se cruza un mes la vista expandida muestra el nuevo mes.
- Al navegar verticalmente entre meses, el sistema intenta mantener el mismo número de día. Si el día no existe en el mes destino (ej. día 31 en un mes de 30 días), se navega al último día disponible del mes destino.
- Al cerrar la vista expandida, el calendario principal muestra el mes en el que se encuentra la vista expandida en ese momento, no necesariamente el mes desde el que se abrió.
- El botón "Volver al día actual" en el calendario principal, al estar en un mes diferente al actual, siempre regresa al mes actual del sistema independientemente de cómo se llegó a ese mes.

---

### ÉPICA 2: Configuración de Turnos

---

**US-004 — Configurar mi horario de turno**
*Como trabajador, quiero configurar mi esquema de turno, para que el calendario refleje mis días reales de trabajo.*

**Criterios de aceptación:**
- El sistema ofrece los esquemas predeterminados: 24x48, 12x36, 48x48.
- Existe la opción "Personalizado" donde el usuario configura horas de trabajo y horas de descanso.
- Restricciones del esquema personalizado:
  - Mínimo de horas de trabajo: 12. Máximo: 72.
  - Mínimo de horas de descanso: 12. Máximo: 72.
  - Solo se permiten números enteros. No se aceptan decimales.
- La hora de entrada solo puede configurarse en horas completas (8:00) o medias horas (8:30). No se permiten otros valores (8:27, 5:13, etc.).
- Los formatos de hora disponibles son: 12 horas (AM/PM), 24 horas, o militar (ej. 1800). Validación en formato militar: solo valores entre 0000 y 2359.
- El usuario puede definir si al momento de configurar está en turno o en franco:
  - Si está en turno: se establece la fecha actual como día de inicio del turno en curso.
  - Si está en franco: se pregunta cuándo inicia su próximo turno. El sistema calcula hacia atrás para determinar el origen del ciclo. El período de franco no excede las 72 horas (máximo definido), por lo que el origen no debe ser mayor a 3 días antes.
- Todos los cambios de configuración (esquema, hora de entrada, día de inicio) aplican hacia adelante y hacia atrás desde el momento del cambio. No se mantiene historial de configuraciones anteriores.
- La configuración se guarda en localStorage sin necesidad de cuenta.

**Casos edge:**
- **Fecha de inicio en el pasado lejano:** El sistema debe calcular correctamente el turno actual y cualquier fecha pasada sin degradación de rendimiento independientemente de cuánto tiempo haya transcurrido desde el inicio configurado.
- **Fecha de inicio en el futuro:** El calendario muestra los días anteriores a la fecha de inicio como días sin turno asignado (ni coloreados ni marcados como franco).
- **Cambio de configuración con historial:** Al cambiar cualquier parámetro del turno, el recálculo aplica a todo el calendario (pasado y futuro) usando la nueva configuración. El usuario debe ser consciente de esto.

---

**US-005 — Gestionar múltiples configuraciones**
*Como usuario, quiero tener varias configuraciones de turno guardadas, para comparar mi turno con el de compañeros o familiares.*

**Criterios de aceptación:**
- Existe una configuración **default** que no puede eliminarse ni desactivarse.
- La configuración default no tiene nombre visible. Se identifica como "Mi turno" en las vistas donde se requiere un identificador.
- La configuración default contiene los ajustes globales de apariencia: color de líneas divisoras del calendario, tema claro/oscuro, primer día de la semana.
- El límite de configuraciones adicionales es de **10**.
- Cada configuración adicional tiene un nombre definido por el usuario.
- Cada configuración adicional puede: activarse o desactivarse, modificarse, eliminarse, o convertirse en la nueva default.
- Al convertir una configuración adicional en default, la anterior default pasa a ser configuración adicional y el usuario debe asignarle un nombre antes de confirmar.
- Al eliminar una configuración adicional, la acción requiere confirmación explícita del usuario.
- El esquema personalizado de cualquier configuración no tiene nombre visible. Solo se puede consultar y editar desde la sección de configuración, donde se prerrellena con los valores actuales.

**Casos edge:**
- **Límite de 10 alcanzado:** Si el usuario intenta agregar una configuración adicional cuando ya tiene 10, el sistema muestra un mensaje: "Límite de 10 configuraciones alcanzado. Elimina al menos una para agregar una nueva."
- **Nombre duplicado:** Al crear o renombrar una configuración adicional, si el nombre ya existe en otra configuración, el sistema valida en tiempo real y muestra un error en el campo: "Ya tienes una configuración con ese nombre."

---

### ÉPICA 3: Búsqueda por Fecha

---

**US-006 — Buscar una fecha específica**
*Como usuario, quiero buscar una fecha concreta, para saber qué turno tengo o tiene alguien en ese día sin navegar manualmente.*

**Criterios de aceptación:**
- Existe un buscador tipo date picker (calendario interactivo).
- Al seleccionar una fecha, se muestra el resultado con:
  - Turno de la configuración default: estado con hora si aplica.
  - Sección visualmente separada con los resultados de cada configuración adicional activa: nombre + estado + hora si aplica.
- Los posibles estados son: **Entrada** (con hora), **Salida** (con hora), **Franco**, **En Turno** (inició turno un día antes y sale un día después).
- Se muestra un botón para navegar directamente al mes de esa fecha en el calendario principal.
- El buscador soporta fechas pasadas y futuras sin límite.
- Los nombres de configuración que superen el espacio disponible se truncan con puntos suspensivos (...).

**Casos edge:**
- **Fecha anterior al inicio del turno configurado:** El sistema realiza el cálculo hacia atrás con la configuración actual. No se muestra mensaje de error ni estado especial; se calcula y muestra el estado correspondiente.
- **Todas las configuraciones desactivadas:** No puede ocurrir. La configuración default siempre está activa.

---

### ÉPICA 4: Personalización

---

**US-007 — Personalizar colores y tema de la app**
*Como usuario, quiero personalizar los colores y el tema de la aplicación, para hacer la experiencia más mía.*

**Criterios de aceptación:**
- El usuario puede cambiar el color de cada configuración (default y adicionales) de forma independiente.
- El usuario puede cambiar el color de los elementos globales del calendario (líneas divisoras, etc.) desde la configuración default únicamente.
- El sistema ofrece una paleta de colores predeterminados (colores primarios y variantes).
- El sistema ofrece un color picker para selección libre de color cuando el navegador lo soporta.
- Si el navegador no soporta color picker, se muestra únicamente la paleta predeterminada con un mensaje: "Tu navegador no soporta el selector de color personalizado."
- El usuario puede elegir manualmente entre **modo claro** y **modo oscuro** desde la configuración.
- La preferencia de tema se guarda en localStorage de forma inmediata al cambiar.
- El cambio de tema se aplica de inmediato sin recargar la página.
- Al seleccionar un color, si genera contraste insuficiente contra el fondo del tema activo (evaluado según estándar WCAG), se muestra una advertencia visible pero no bloqueante. El usuario puede continuar.
- Si el usuario cambia de tema y el color configurado genera contraste insuficiente en el nuevo tema, la advertencia se muestra en ese momento.

**Casos edge:**
- **Dos configuraciones con el mismo color:** Permitido con aviso. Ver US-003.
- **Color con contraste insuficiente:** No se bloquea ni se cambia automáticamente el color. Solo se advierte.

---

### ÉPICA 5: Compartir Configuración

---

**US-008 — Compartir una configuración mediante URL**
*Como usuario, quiero generar un link con mi configuración, para que mi familia o compañeros puedan ver mi calendario de turnos.*

**Criterios de aceptación:**
- Cualquier usuario puede generar un link de compartir sin necesidad de cuenta.
- Cada configuración (default y cada adicional) tiene su propio botón o acción de compartir de forma individual. Solo se comparte una configuración a la vez.
- Los datos codificados en la URL son: hora de entrada, esquema de turno (horas de trabajo y descanso), día de inicio del ciclo actual, y color. No se comparte el nombre de la configuración.
- El link es estático: representa la configuración en el momento de generarlo. Si el emisor cambia su configuración después, el link mantiene los datos anteriores. Esto es una limitación conocida del mecanismo de URL.
- Al abrir un link de compartir:
  - El sistema valida todos los parámetros de la URL. Si el link está malformado o contiene valores inválidos, muestra: "Este link no es válido o está dañado. Solicita uno nuevo al remitente."
  - Si el receptor no tiene configuraciones adicionales previas o no ha llegado al límite de 10, se pregunta si desea reemplazar su configuración default o guardar como configuración adicional.
  - Si elige reemplazar, la configuración default se actualiza con los datos del link.
  - Si elige guardar como adicional, debe ingresar un nombre. Si el nombre ya existe, se valida en tiempo real y se sugiere una variante automática (ej. "Turno de Armando (2)"). El usuario puede aceptar la sugerencia o escribir otro nombre.
  - Si el receptor ya tiene 10 configuraciones adicionales, se muestra: "Has alcanzado el límite de 10 configuraciones. Elimina al menos una para poder guardar esta." El sistema lleva al usuario a gestionar sus configuraciones y recuerda el link pendiente. Al regresar después de eliminar una configuración, el flujo continúa automáticamente sin que el usuario tenga que abrir el link de nuevo.
- En MVP, toda la operación se realiza en localStorage únicamente. No hay sincronización con la nube.

**Casos edge:**
- **Link abierto en navegador diferente al que tiene configuración:** El localStorage del nuevo navegador está vacío, por lo que el sistema trata al receptor como usuario sin configuración previa. Es un comportamiento aceptable y se documenta como limitación conocida. Para sincronizar entre dispositivos o navegadores se requiere cuenta (v2.0).
- **Receptor abre el link y ya tiene configuración en otro navegador:** Mismo caso anterior. Sin cuenta no hay forma de detectar configuraciones en otros navegadores.

---

### ÉPICA 6: Onboarding y Ayuda

---

**US-009 — Entender cómo funciona la app al abrirla por primera vez**
*Como usuario nuevo, quiero entender la navegación de la app intuitivamente, para no sentirme perdido en mi primera visita.*

**Criterios de aceptación:**
- En la primera apertura de la app, se muestra simultáneamente:
  - Una animación introductoria que ejemplifica los gestos de navegación (vertical para meses, horizontal para años).
  - Un banner superior con prompt suave invitando al usuario a configurar su turno.
- La animación y el banner se muestran solo una vez. Se marcan como vistos en localStorage cuando desaparecen, no cuando aparecen. Si el usuario cierra el navegador antes de que desaparezcan, el contador se reinicia y se muestran de nuevo la próxima vez.
- El banner superior desaparece automáticamente después de 50 segundos. No desaparece por interacción del usuario.
- La animación tiene su propio comportamiento de desaparición definido por el UX/UI Designer.
- Existen iconos sutiles permanentes que indican la dirección de navegación disponible en el calendario.
- Existe un botón de ayuda accesible desde cualquier pantalla.
- Al activar el botón de ayuda, se muestran tooltips o mensajes contextuales explicando la función de cada elemento visible en pantalla.
- Si un elemento no está visible en pantalla en ese momento (ej. botón de "Volver al día actual" que solo aparece fuera del mes actual), no se muestra su tooltip.

**Casos edge:**
- **Usuario cierra antes de los 50 segundos:** El flag no se guarda. La próxima apertura muestra el onboarding de nuevo con el contador reiniciado desde cero.

---

**US-011 — Prompt de configuración inicial**
*Como usuario nuevo, quiero recibir una invitación suave a configurar mi turno, para saber que puedo personalizar la app sin sentir que es obligatorio.*

**Criterios de aceptación:**
- El prompt es un banner superior que aparece simultáneamente con la animación de onboarding en la primera apertura.
- El banner se muestra solo una vez (misma lógica de flag que US-009).
- El banner desaparece automáticamente después de 50 segundos.
- Al hacer tap o click en el banner, lleva al usuario directamente a la pantalla de configuración de turno.
- El estado default del calendario (24x48, hoy como primer día de turno, 8:00 AM de entrada) se muestra inmediatamente sin esperar a que el usuario configure. El banner es una invitación, no un bloqueo.

---

### ÉPICA 7: Múltiples Pestañas

---

**US-010 — Manejo de cambios entre pestañas**
*Como usuario, quiero que la app me notifique si hubo cambios en otra pestaña, para no trabajar con información desactualizada.*

**Criterios de aceptación:**
- Cuando una pestaña detecta que otra pestaña del mismo navegador realizó cambios en localStorage (usando el evento `storage` o BroadcastChannel API), muestra una notificación: "Hay cambios pendientes. [Actualizar]" con un botón de acción.
- El botón "Actualizar" recarga los datos desde localStorage y refresca la vista.
- Si el usuario cierra sesión en una pestaña (v2.0), las demás pestañas detectan el evento y muestran la misma notificación invitando a recargar.
- Si el usuario ignora la notificación, la pestaña sigue funcionando con los datos que tiene cargados.

---

### ÉPICA 8: Feedback

---

**US-012 — Enviar sugerencia o reporte de problema**
*Como usuario, quiero poder reportar un problema o enviar una sugerencia, para contribuir a mejorar la app.*

**Criterios de aceptación:**
- Existe un formulario de feedback accesible desde cualquier pantalla (botón o enlace en footer o menú).
- El formulario solicita únicamente: correo electrónico (validación de formato en frontend únicamente, sin verificación real) y mensaje.
- El correo es obligatorio. El mensaje es obligatorio.
- El envío se realiza a través de Formspree como servicio externo en MVP.
- Entre envíos, el sistema aplica un tiempo de espera de 1 minuto. El timer se almacena en localStorage. Si el usuario recarga la página o cierra el navegador antes de que pase el minuto, el timer se reinicia.
- Si el usuario intenta enviar antes de que pase el minuto, se muestra: "Por favor espera [X] segundos antes de enviar otro mensaje."
- El formulario no solicita nombre ni ningún dato adicional.

**Casos edge:**
- **Correo inválido:** Validación de formato en frontend. Si el formato no es válido, se muestra error en el campo al intentar enviar.
- **Formspree no disponible:** Si el servicio externo falla, se muestra el mensaje global de error de conexión definido en RG-005.

---

### ÉPICA 9: Legal y Cumplimiento

---

**US-014 — Páginas legales requeridas para lanzamiento**
*Como producto que eventualmente manejará datos de usuarios, necesitamos cumplir con los requisitos legales mínimos antes de lanzar públicamente.*

> ⚠️ **Requisito de lanzamiento:** Este requisito debe estar completado antes del go-live. Es un bloqueante para publicar el producto. El UX/UI Designer debe contemplar estas páginas desde el inicio del diseño.

**Criterios de aceptación:**
- Existe una página de **Términos y Condiciones** accesible desde el footer.
- Existe una página de **Política de Privacidad** accesible desde el footer.
- Los documentos deben estar redactados o validados por un profesional legal, o generados mediante una herramienta especializada (Termly, iubenda, PrivacyPolicies.com o similar).
- Los documentos deben cubrir como mínimo: datos que se recopilan (localStorage, Formspree), cómo se usan, cómo se almacenan, derechos del usuario y política de cookies si aplica.
- Los documentos deben contemplar el derecho del usuario a solicitar la eliminación de sus datos (LFPDPPP en México). El mecanismo de eliminación de cuenta se implementa en v2.0, pero el derecho debe quedar establecido en los documentos legales desde v1.0. **Nota para el asesor legal:** documentar el canal por el cual los usuarios pueden ejercer este derecho mientras no existe el mecanismo automatizado.
- Si los Términos y Condiciones se actualizan en versiones futuras con cambios materiales, se debe notificar a los usuarios con aceptación activa. Para cambios menores se aplica aceptación tácita. **Nota para el asesor legal:** definir qué constituye un cambio material.

---

## 7. Backlog Priorizado

| ID | Feature | MoSCoW | Prioridad |
|---|---|---|---|
| US-001 | Ver calendario con turnos visualizados | Must Have | P0 |
| US-004 | Configurar horario de turno | Must Have | P0 |
| US-002 | Navegar entre meses y años | Must Have | P0 |
| US-006 | Buscar fecha específica | Must Have | P0 |
| US-009 | Onboarding y ayuda | Must Have | P0 |
| US-011 | Prompt de configuración inicial | Must Have | P0 |
| US-014 | Páginas legales (bloqueante de lanzamiento) | Must Have | P0 |
| US-007 | Personalizar colores y tema (oscuro/claro) | Should Have | P1 |
| US-005 | Múltiples configuraciones | Should Have | P1 |
| US-003 | Ver múltiples configuraciones en calendario | Should Have | P1 |
| US-013 | Vista expandida del día | Should Have | P1 |
| US-008 | Compartir configuración por URL | Should Have | P1 |
| US-010 | Manejo de cambios entre pestañas | Should Have | P1 |
| US-012 | Formulario de feedback (Formspree) | Could Have | P2 |
| — | Autenticación (email/contraseña + Google OAuth) | Won't Have (MVP) | P3 |
| — | Persistencia en nube | Won't Have (MVP) | P3 |
| — | Sincronización entre dispositivos | Won't Have (MVP) | P3 |
| — | Recuperación de contraseña | Won't Have (MVP) | P3 |
| — | Confirmación de email | Won't Have (MVP) | P3 |
| — | Eliminación de cuenta (mecanismo) | Won't Have (MVP) | P3 |
| — | Auditoría de acciones | Won't Have (MVP) | P3 |
| — | Apple Sign In | Won't Have (MVP) | P3 |
| — | Integración Google Calendar | Won't Have (MVP) | P3 |
| — | Notificaciones de turno | Won't Have (MVP) | P3 |
| — | PWA (instalable en web) | Won't Have (MVP) | P3 |
| — | App Android nativa | Won't Have (MVP) | P3 |
| — | App iOS nativa | Won't Have (MVP) | P3 |

---

## 8. Roadmap

### MVP — v1.0
**Plataforma:** Web responsive (móvil y desktop), accesible desde cualquier navegador. Sin backend.

- Calendario visual con turnos, gradiente de color, indicadores de hora y navegación completa
- Vista expandida del día con navegación lateral y vertical
- Configuración de turno: predeterminados (24x48, 12x36, 48x48) y personalizado (mínimo 12h, máximo 72h)
- Hora de entrada en horas completas o medias horas. Formatos: 12h, 24h, militar
- Primer día de semana configurable (domingo por defecto, opción lunes)
- Búsqueda por fecha con resultado detallado por configuración
- Onboarding: animación + banner simultáneos (50 segundos, flag en localStorage)
- Personalización de colores + modo oscuro/claro manual
- Múltiples configuraciones activas (máximo 10 adicionales)
- Compartir configuración individual por URL (sin sesión)
- Detección de cambios entre pestañas con notificación
- Formulario de feedback vía Formspree
- Reglas globales de UI (botones, estados de carga, timeouts, errores)
- Términos y Condiciones + Política de Privacidad
- Arquitectura preparada para i18n y zonas horarias

### v2.0 — Siguiente Release
- Autenticación completa: email/contraseña + Google OAuth
- Confirmación de email (48 horas de expiración, acceso completo con banner mientras no confirma)
- Recuperación de contraseña (expiración 30 minutos, un solo link válido a la vez, timer de 1 minuto entre solicitudes)
- Cambio de contraseña desde perfil (requiere contraseña actual, solo disponible para cuentas con email/contraseña)
- Persistencia en nube: guardado automático al presionar guardar. Si falla la nube pero el local fue exitoso: "No se pudo guardar en nube, favor de reintentar más tarde."
- Sincronización entre dispositivos con botón de refrescar (sobreescribe local con nube sin resolver conflictos, ya que la nube es siempre lo más reciente)
- Resolución de conflictos al iniciar sesión (4 escenarios: sin conflicto real, conflicto solo en default, conflicto completo, solo adicionales nuevas en un lado)
- Vinculación automática de cuenta si el mismo email existe con contraseña y con Google
- JWT con refresh token (HttpOnly cookies), secret key por usuario, rotación de tokens, invalidación por cambio de contraseña
- Cierre de sesión: no borra datos del dispositivo, solo desincroniza de la nube
- Auditoría de acciones importantes (inicios de sesión, cambios de contraseña, solicitudes de eliminación)
- Eliminación de cuenta y datos (LFPDPPP)
- Apple Sign In
- Integración Google Calendar (lectura, solo visual)
- Feedback migrado a backend propio
- Detección de dominios de email desechables
- Flag de onboarding sincronizado a nube
- 2FA con TOTP y códigos de respaldo

### v3.0 — Futuro
- PWA (instalable desde navegador)
- App Android nativa
- App iOS nativa
- Soporte de zonas horarias
- i18n: múltiples idiomas (español base ya implementado)
- Onboarding tipo preguntas guiadas (saltable, aplica 24x48 default si se salta)
- Exportación de datos personales
- Modo colaborativo (grupos de trabajo)
- Widget para pantalla de inicio
- Bloqueo de dominios de email desechables (si no se implementó en v2.0)

---

## 9. Métricas de Éxito (KPIs)

### Adopción
- Número de usuarios únicos en los primeros 30/60/90 días.
- Tasa de retención a 7 días y 30 días.
- Porcentaje de usuarios que modifican la configuración default (indicio de configuración real).

### Engagement
- Promedio de sesiones por usuario por semana.
- Porcentaje de usuarios que usan el buscador de fechas al menos una vez.
- Porcentaje de usuarios que generan al menos un link de compartir.
- Porcentaje de usuarios que tienen más de una configuración activa.

### Calidad
- Tasa de errores en cálculos de turno (bugs reportados vía Formspree o canal externo).
- Tiempo de carga inicial de la app.
- Tasa de rebote en primera visita.

---

## 10. Riesgos Identificados

| Riesgo | Impacto | Probabilidad | Mitigación |
|---|---|---|---|
| Cálculo incorrecto en fechas con cambio de horario (verano/invierno) | Alto | Media | Trabajar con horas absolutas en MVP. Documentar como limitación conocida. Agregar soporte de zonas horarias en v3.0. |
| URL muy larga al codificar configuración completa | Medio | Baja | Se comparte una sola configuración a la vez. Los datos son mínimos: hora de entrada, esquema, día de inicio, color. Riesgo reducido. |
| Pérdida de configuración local por borrado de caché del navegador | Bajo | Alta | Documentar como limitación conocida del almacenamiento local. La sincronización en nube resuelve esto en v2.0. |
| Documentos legales insuficientes para expansión regional | Medio | Media | Revisión legal antes de expandir a nuevos mercados de Latinoamérica. |
| Baja adopción iOS sin Apple Sign In en MVP | Bajo | Media | MVP no requiere autenticación. Apple Sign In entra en v2.0. Riesgo bajo para v1.0. |
| Formspree como punto de fallo externo para feedback | Bajo | Baja | El feedback no es función crítica. Si Formspree falla, se muestra error de conexión. Se migra a backend propio en v2.0. |

---

## 11. Glosario

| Término | Definición |
|---|---|
| **Turno** | Período de trabajo definido por horas de entrada y salida |
| **Franco** | Día de descanso dentro del esquema de turno rotativo |
| **En Turno** | Estado de un día donde el usuario está trabajando pero no es su día de entrada ni de salida (turno que cruza días completos) |
| **Configuración default** | Configuración principal del usuario. Sin nombre visible. No puede eliminarse ni desactivarse. Contiene los ajustes globales de apariencia. |
| **Configuración adicional** | Configuración secundaria con nombre definido por el usuario. Generalmente recibida por link o creada para comparar turnos. Máximo 10. |
| **24x48** | Esquema de turno de 24 horas de trabajo seguidas por 48 horas de descanso |
| **12x36** | Esquema de turno de 12 horas de trabajo seguidas por 36 horas de descanso |
| **Esquema personalizado** | Configuración de turno con horas de trabajo y descanso definidas por el usuario. Mínimo 12h, máximo 72h para cada período. Solo enteros. |
| **Horas absolutas** | Sistema de cálculo que no ajusta por cambio de horario de verano ni zona horaria del dispositivo |
| **localStorage** | Almacenamiento local del navegador donde se guarda toda la configuración del usuario en MVP |
| **Responsive** | Diseño que se adapta automáticamente al tamaño de pantalla del dispositivo |
| **i18n** | Internacionalización: arquitectura que permite agregar soporte de múltiples idiomas |
| **WCAG** | Web Content Accessibility Guidelines: estándar de accesibilidad web usado para evaluar contraste de colores |
| **LFPDPPP** | Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México) |
| **Formspree** | Servicio externo de terceros usado en MVP para recibir mensajes del formulario de feedback sin backend propio |

---

*Documento generado como parte del proceso de levantamiento de requerimientos de DateOnDuty. v2.0 — Febrero 2026*
*Próxima revisión: al inicio de la fase de diseño con UX/UI Designer y Arquitecto de Software.*
