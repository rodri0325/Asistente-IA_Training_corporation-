# WhatsApp de prueba: configuración y evidencia del Sprint 2

Esta guía conecta el número de prueba de Meta con el asistente Node.js del proyecto. Parte de cero: todavía debes crear la aplicación en Meta, completar las credenciales locales y comprobar una conversación real. Tener pruebas automáticas aprobadas no demuestra por sí solo que Meta y tu teléfono estén conectados.

El flujo es: **teléfono → Meta → `POST /webhook` → Gemini y catálogo del proyecto → Meta → teléfono**. `GET /webhook` permite a Meta verificar la conexión. El chat web y WhatsApp reutilizan el mismo servicio del asistente; no necesitas ejecutar el archivo Python de referencia.

## 1. Antes de empezar

- Usa esta implementación basada en la rama **`sprint-1-mvp`**. La rama `main` conserva el prototipo y no es la base de este backend.
- Necesitas Windows con **Node.js 22.13 o superior**, acceso a internet, una cuenta de Meta para crear la app, un teléfono con WhatsApp y una clave de Gemini habilitada en tu cuenta.
- La prueba usa el **número de prueba que proporciona Meta** como asistente. Tu celular es el destinatario de prueba; no necesitas migrar su número al backend.
- Usa una sola instancia del servidor y mantén encendidos el computador, el servidor y el túnel durante la demo.

Los nombres del panel de Meta pueden variar por cuenta e idioma. Las rutas siguientes son orientativas: busca la configuración de la **WhatsApp Cloud API**. La guía oficial directa devolvió HTTP 429 durante esta revisión; se contrastaron los contratos de API con la [colección oficial de Meta en Postman](https://www.postman.com/meta/whatsapp-business-platform/collection/wlk6lh4/whatsapp-cloud-api). Confirma en tu panel los límites de destinatarios, el vencimiento del token y la versión disponible.

## 2. Crear la aplicación en Meta

1. Abre [Meta for Developers](https://developers.facebook.com/apps/) e inicia sesión. Si es tu primera vez, completa el registro de desarrollador que solicite el sitio.
2. Selecciona **Crear aplicación**. Elige el caso de uso para conectarte con clientes mediante **WhatsApp** cuando aparezca. Si tu panel presenta productos, crea la aplicación compatible con ese producto y añade **WhatsApp**.
3. Ponle un nombre identificable, por ejemplo `Training Asistente Demo`, y completa los datos que pida Meta. Selecciona o crea el portafolio empresarial para la prueba cuando el asistente lo solicite.
4. Abre WhatsApp y su apartado de configuración de API o inicio rápido: puede figurar como **API Setup**, **API Testing** o **Getting Started**. Sigue la opción de iniciar con los recursos de prueba.
5. Identifica el **número de prueba**, su **Phone Number ID** y la **WhatsApp Business Account (WABA)**. Son datos diferentes: el backend pide el Phone Number ID, no el teléfono visible ni el ID de WABA.

Meta documenta el portafolio empresarial, la cuenta de WhatsApp Business y el número como recursos del flujo de inicio. [Referencia oficial de inicio](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started).

## 3. Autorizar tu teléfono y obtener los valores

En el panel de prueba, busca el destinatario **To / Para** o la administración de destinatarios. Añade tu celular con código de país y completa la verificación solicitada. Usa solamente un teléfono que controles o cuyo dueño participe en la prueba. El chat del equipo menciona cinco destinatarios: toma como límite efectivo el que muestre tu aplicación, no asumas que cualquier teléfono está autorizado.

Recoge estos valores para escribirlos **en tu archivo local `.env`**:

| Variable | De dónde sale | Cómo reconocerla |
| --- | --- | --- |
| `WHATSAPP_ACCESS_TOKEN` | Token de acceso del panel de WhatsApp | Es una credencial de Meta; puede caducar. |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID del número de prueba | Es el identificador del recurso; no es `+57...` ni el WABA ID. |
| `META_APP_SECRET` | Configuración de la app, normalmente **Básica / Basic → App secret** | Es el secreto de esa misma app; se usa para verificar la firma de los eventos. |
| `WHATSAPP_VERIFY_TOKEN` | Lo inventas tú | Cadena larga y aleatoria que después copiarás igual en el formulario del webhook. No es el access token. |
| `WHATSAPP_API_VERSION` | Versión habilitada/documentada para tu app | El ejemplo del proyecto usa `v23.0`; comprueba el panel y cámbiala si corresponde. No significa «última versión». |
| `GEMINI_API_KEY` | Clave de tu proyecto en Google AI Studio | Es la misma configuración del chat web. |
| `GEMINI_MODEL` | Configuración que ya utiliza el proyecto | Conserva inicialmente el modelo existente; verifica su disponibilidad con tu cuenta. |

No pegues los secretos en chats, capturas, la wiki ni GitHub. El token temporal sirve para preparar la demo, pero revisa su vigencia antes de presentar y vuelve a generarlo si caducó. [Tokens y configuración en la colección oficial](https://www.postman.com/meta/whatsapp-business-platform/collection/wlk6lh4/whatsapp-cloud-api).

## 4. Preparar y arrancar el proyecto

Abre PowerShell **en la carpeta que contiene `package.json`** de esta implementación. Comprueba la versión e instala las dependencias:

```powershell
node --version
npm.cmd ci
if (-not (Test-Path -LiteralPath '.env')) {
    Copy-Item -LiteralPath '.env.example' -Destination '.env'
}
notepad .env
```

Si `.env` ya existía, completa lo que falte sin reemplazar la clave del chat que funciona. Los valores siguientes son ejemplos vacíos o descriptivos, no credenciales válidas:

```dotenv
GEMINI_API_KEY=tu_clave_de_gemini
GEMINI_MODEL=gemini-3.6-flash
PORT=5000
WHATSAPP_VERIFY_TOKEN=tu_cadena_larga_aleatoria
WHATSAPP_ACCESS_TOKEN=tu_token_de_meta
WHATSAPP_PHONE_NUMBER_ID=el_id_del_numero_de_prueba
META_APP_SECRET=el_secreto_de_tu_aplicacion
WHATSAPP_API_VERSION=v23.0
```

`gemini-3.6-flash` es el valor que ya estaba en el repositorio: esta guía no acredita que tu cuenta tenga acceso. Si el chat falla por modelo no disponible, confirma un identificador permitido por tu cuenta y ajusta `GEMINI_MODEL` sin cambiar el código. Haz lo mismo con la versión de Meta que corresponda a tu app.

Guarda el archivo, cierra el editor e inicia el servidor:

```powershell
npm.cmd start
```

Deja abierta esta terminal. Abre `http://localhost:5000` y pregunta **«¿Cuánto cuesta Excel Avanzado?»** en el chat web. Resolver primero cualquier error de Gemini permite separar un problema de IA de un problema de WhatsApp. Reinicia el servidor después de editar `.env`.

## 5. Crear una URL pública HTTPS con ngrok

1. Crea o inicia sesión en tu cuenta de [ngrok](https://dashboard.ngrok.com/signup).
2. Instala el agente desde las [instrucciones oficiales para Windows](https://ngrok.com/download/windows?tab=download). Una opción documentada es:

   ```powershell
   winget install ngrok -s msstore
   ```

3. Abre otra terminal si Windows todavía no reconoce `ngrok`. Copia tu authtoken del panel de ngrok y configúralo localmente siguiendo su instrucción:

   ```powershell
   ngrok config add-authtoken "TU_AUTHTOKEN_DE_NGROK"
   ```

4. En esta **segunda terminal**, mientras `npm.cmd start` sigue activo, ejecuta:

   ```powershell
   ngrok http 5000
   ```

5. Copia la dirección **HTTPS** que muestre ngrok. Por ejemplo, si aparece `https://TU-DOMINIO.ngrok-free.app`, tu callback será **`https://TU-DOMINIO.ngrok-free.app/webhook`**. Sustituye el dominio completo por el tuyo.

`localhost` solo funciona en tu equipo. Meta necesita el endpoint público. El túnel también hace accesible el sitio servido por este backend; úsalo durante la prueba y ciérralo al terminar. Si cambia el dominio al reiniciar, actualiza el callback en Meta. [Instalación, authtoken y publicación de un puerto: ngrok](https://ngrok.com/download/windows?tab=download).

## 6. Configurar el webhook en Meta

1. En la misma app de Meta, abre **WhatsApp → Configuración / Configuration → Webhooks**, o la sección equivalente de Webhooks para **WhatsApp Business Account**.
2. En **Callback URL**, pega la URL HTTPS completa terminada en `/webhook`.
3. En **Verify token**, pega exactamente el valor de `WHATSAPP_VERIFY_TOKEN` de `.env`.
4. Pulsa **Verificar y guardar**. El servidor responde al challenge de Meta si el token coincide; una verificación rechazada suele indicar un token distinto o un servidor/túnel inaccesible.
5. En los campos del webhook, activa la suscripción **`messages`**. Guardar la URL no sustituye esta suscripción.
6. Comprueba que la app esté asociada/suscrita a la **WABA del número de prueba**. Si la verificación funciona pero los mensajes no llegan, revisa esa asociación en el panel. La colección oficial incluye la operación `/{WABA-ID}/subscribed_apps` para administrar la suscripción; consulta sus permisos antes de usarla.

El webhook recibe mensajes y notificaciones de estado. El servidor filtra los estados para evitar responder a avisos de «entregado» o «leído». Una petición de prueba del panel acredita recepción del evento; **no demuestra una conversación real con Gemini y tu teléfono**. [Referencia oficial de payloads](https://www.postman.com/meta/whatsapp-business-platform/folder/tduohwq/webhook-payload-reference) y [suscripciones de WABA](https://www.postman.com/meta/whatsapp-business-platform/folder/ozgs3jn/webhook-subscriptions).

## 7. Hacer la primera conversación real

1. Confirma que tu celular figure como destinatario verificado, y que el servidor y ngrok sigan activos.
2. Abre en tu teléfono el chat con el **número de prueba de Meta** que aparece en el panel. Si el flujo del panel necesita primero enviar su mensaje de prueba, usa ese control y después contesta desde tu teléfono.
3. Envía **«¿Cuánto cuesta Excel Avanzado?»**. Espera la respuesta y compárala con `backend/data/catalogo_cursos.json`.
4. Envía **«¿Cuáles son los requisitos de Excel Avanzado?»**. Incluye el nombre del curso de nuevo: esta versión procesa cada pregunta de forma independiente.
5. Prueba una consulta fuera del catálogo, por ejemplo **«¿Ofrecen un curso de submarinismo?»**. La respuesta debería reconocer que no dispone de esa información y no inventar una oferta.
6. Guarda una captura o grabación que muestre pregunta y respuesta, sin secretos y ocultando datos personales que no aporten evidencia.

La respuesta sale por el endpoint `/{Phone-Number-ID}/messages` de Meta y vuelve al remitente del mensaje recibido. [Operación oficial de envío de texto](https://www.postman.com/meta/whatsapp-business-platform/request/8gvd47s/send-text-message). Iniciar la prueba desde el teléfono evita depender de un flujo de mensajes comerciales iniciados por el negocio.

**Costos:** no se promete gratuidad incondicional. Los recursos de prueba tienen restricciones; Meta, Gemini y ngrok pueden tener condiciones o cuotas según la cuenta. Revisa lo que indique cada panel antes de ampliar el uso. No hay una tarifa verificada en esta guía; la [página oficial de precios de WhatsApp](https://developers.facebook.com/docs/whatsapp/pricing/) devolvió HTTP 429 durante la revisión.

## 8. Si algo falla

| Síntoma | Qué revisar |
| --- | --- |
| `node` no se reconoce o no admite el arranque | Instala Node.js 22.13 o superior y vuelve a abrir PowerShell. |
| `npm` está bloqueado por PowerShell | Usa `npm.cmd`, como en los pasos anteriores. |
| `ngrok` no se reconoce | Confirma la instalación y abre otra terminal. |
| ngrok rechaza la cuenta o el authtoken | Completa la configuración solicitada por su panel y verifica el token del agente. No es el token de Meta. |
| Meta no verifica el callback | Verifica HTTPS, dominio actual, `/webhook`, puerto 5000, servidor y túnel activos; compara el verify token y reinicia tras editar `.env`. |
| El webhook devuelve 403 a un POST manual | Un evento real requiere la firma de Meta. No desactives la firma para hacer funcionar una prueba sin autenticar. Revisa `META_APP_SECRET` de la misma app. |
| El webhook devuelve 503 | Revisa que estén completas todas las variables de WhatsApp y sus formatos. Si indica que está ocupado, espera a que termine la cola antes de repetir la prueba. |
| Verifica la URL, pero no llegan mensajes | Revisa `messages`, WABA/app/número de prueba correctos y destinatario autorizado. El botón de prueba del panel no reemplaza un mensaje desde el celular. |
| Llegan eventos, pero Meta rechaza el envío | Revisa access token vigente, permisos, Phone Number ID y versión Graph API habilitada. Compara el error con el panel; no publiques el token. |
| El destinatario no está autorizado | Añade/verifica ese teléfono en la lista de prueba y revisa el límite que permita tu cuenta. |
| Falla también el chat web | Revisa `GEMINI_API_KEY`, disponibilidad de `GEMINI_MODEL` y cuotas de Gemini. |
| La respuesta no llega después de un error de envío | Corrige la causa y envía una pregunta nueva. El backend no reenvía automáticamente una respuesta cuyo resultado de entrega sea incierto. |
| No responde a una referencia como «¿y cuánto dura?» | No hay historial de conversación; repite el nombre del curso. |
| Se detiene al cerrar una terminal | Deben permanecer activos el servidor y ngrok. Reiniciarlos no recupera trabajos pendientes. |

## 9. Alcance y límites de esta demo

- El catálogo es **ficticio y manual**. No se acredita una oferta oficial de TRAINING.
- Se atienden preguntas de texto de **1 a 1000 caracteres**. Audio, imágenes y otros formatos reciben una orientación para escribir la pregunta; no se descargan ni transcriben.
- La consulta de IA y las reglas del catálogo se comparten con el chat web. **No hay memoria entre mensajes ni continuidad entre canales**; tampoco transferencia efectiva a un asesor.
- El webhook valida su firma y evita duplicados mediante el ID del mensaje. La cola y el registro de duplicados están **en RAM y pertenecen a un solo proceso**: reiniciar pierde mensajes pendientes y los IDs recordados. No ejecutar varias réplicas esperando deduplicación compartida.
- El acuse HTTP del webhook confirma recepción local, no entrega al teléfono. Un mensaje aceptado puede perderse si el proceso se detiene antes de enviarlo.
- Se recuerdan hasta 10 000 IDs durante 24 horas después del procesamiento, y se admiten hasta 100 mensajes pendientes. Si un lote excede la capacidad, se rechaza completo con HTTP 503 para permitir un reintento de Meta. No equivale a una cola persistente para producción.
- Los estados `sent`, `delivered` y `read` no generan respuestas. Si llega un estado `failed`, se registran solo códigos numéricos de error; una aceptación de envío por Meta no garantiza entrega al teléfono.
- Ante errores de envío a Meta no se hace reenvío automático: un timeout puede ocurrir después de que Meta aceptó el mensaje y repetirlo podría duplicar la respuesta.
- Los tests simulados no certifican disponibilidad del proveedor, exactitud de respuestas reales, latencia, costos ni entrega a WhatsApp. Una demo local no acredita disponibilidad permanente.

## 10. Pruebas automáticas y evidencia

Desde la raíz del proyecto:

```powershell
npm.cmd test
npm.cmd run lint
```

La suite usa servicios externos simulados; no requiere publicar el túnel ni enviar mensajes reales. Registra la salida real del comando, el commit probado y la fecha. No copies un total de pruebas de otra ejecución.

Esta matriz relaciona la integración con sus caminos de éxito y alternativos. El resultado de ejecución se debe completar con evidencia de la suite; no representa por sí sola un acta de aprobación.

| Funcionalidad | Tipo y justificación | Happy path | Alternativo |
| --- | --- | --- | --- |
| Verificación de callback | Integración HTTP: comprueba el contrato con Meta | Token correcto devuelve challenge | Token o modo inválido se rechaza |
| Firma de eventos | Integración HTTP: protege el ingreso de mensajes | Firma válida procesa el evento | Firma ausente, alterada o inválida se rechaza |
| Recepción de texto | Integración con proveedores simulados: une webhook y asistente | Texto válido consulta el asistente | Estado, payload incompleto o tipo no compatible se maneja sin tratarlo como consulta |
| Respuesta del asistente | Integración: conserva las reglas del catálogo | Gemini responde y se envía texto al remitente | Gemini falla y se maneja el error sin revelar secretos |
| Envío a Meta | Integración con Meta simulado: verifica URL y formato | Envío correcto al ID y destinatario configurados | Error HTTP o de red se controla sin reenvío automático |
| Deduplicación | Escenarios: simula reintentos del mismo evento | Un ID nuevo se procesa | El mismo ID no genera una segunda respuesta en el mismo proceso |
| Compatibilidad del chat web | Regresión HTTP: ambos canales comparten asistente | `/chat` sigue respondiendo | Entradas inválidas y errores del proveedor mantienen su manejo |

El documento maestro del Sprint 2, p. 5, solicita pruebas automáticas de éxito y alternativa por funcionalidad, y una estrategia coherente con las historias de usuario. Sus pp. 1–2 señalan que las evidencias se revisan en la herramienta de gestión/wiki. Las pruebas de usabilidad se **planean ahora y se ejecutan en el Sprint 3** (p. 4).

### Checklist real: PENDIENTE de ejecutar con tu cuenta

- [ ] App de Meta creada y número de prueba identificado.
- [ ] Teléfono de prueba añadido y verificado.
- [ ] `.env` completo; secretos fuera de Git y de las capturas.
- [ ] Chat web responde usando Gemini real y el modelo disponible en la cuenta.
- [ ] Callback HTTPS verificado y suscripción `messages` activa.
- [ ] Pregunta desde el celular recibe respuesta pertinente del asistente.
- [ ] Precio o requisito coincide con el catálogo ficticio del repositorio.
- [ ] Consulta fuera del catálogo no inventa información.
- [ ] Se observan los eventos de estado sin generar otra respuesta al usuario.
- [ ] Evidencia y resultado de pruebas registrados en la wiki y vinculados a la historia del sprint.

### Plantilla para copiar a la wiki

```markdown
### Integración WhatsApp - Sprint 2

- Historia / criterios de aceptación: [enlace e identificadores reales]
- Responsable y fecha: [completar]
- Commit y rama evaluados: [completar]
- Alcance: número de prueba Meta → webhook Node → Gemini → respuesta en WhatsApp.
- Datos: catálogo ficticio; consultas independientes, sin historial entre canales.
- Pruebas automáticas: [comando, resultado real y enlace a evidencia]
- Análisis estático: [comando, resultado real y enlace a evidencia]
- Prueba real Meta/Gemini: PENDIENTE hasta adjuntar evidencia de ejecución.

| Caso | Entrada / pasos | Esperado | Obtenido | Estado | Evidencia |
| --- | --- | --- | --- | --- | --- |
| E2E-01 | Preguntar precio de Excel Avanzado desde teléfono autorizado | Respuesta en WhatsApp coherente con catálogo | [completar] | PENDIENTE | [enlace] |
| E2E-02 | Preguntar requisitos incluyendo nombre del curso | Respuesta coherente con catálogo | [completar] | PENDIENTE | [enlace] |
| E2E-03 | Consultar curso inexistente | Reconoce falta de información, sin inventar | [completar] | PENDIENTE | [enlace] |

- Limitaciones: cola/deduplicación en RAM; reinicio pierde pendientes; sin reenvío automático ante error de Meta; sin continuidad conversacional.
- Incidencias y siguiente acción: [completar sin secretos]
- Evidencia de ceremonia/review: [enlace]

### Protocolo de usabilidad propuesto - ejecución en Sprint 3

- Hipótesis por validar: las personas pueden encontrar precio y requisitos de un curso mediante preguntas escritas en WhatsApp.
- Participantes y sesión: [perfil de usuarios finales, cantidad, moderador, fecha, duración y consentimiento]
- Tarea: averigua el precio y los requisitos del curso que te interesa e indica si tienes información suficiente para decidir tu siguiente paso.
- Preguntas: ¿Qué información buscabas? ¿Qué parte de la respuesta fue confusa? ¿Qué harías después?
- Métricas: éxito, tiempo hasta encontrar la información, errores y satisfacción al terminar.
- Criterios de éxito antes de ejecutar: [definir umbrales medibles con el equipo]
- Estado: PLANIFICADO, no ejecutado.
```

Fecha de revisión documental: **13 de octubre de 2026**. Las instrucciones del panel deben verificarse con la cuenta utilizada; las pantallas exactas, los límites y los precios no pudieron validarse dentro de una sesión autenticada de Meta.
