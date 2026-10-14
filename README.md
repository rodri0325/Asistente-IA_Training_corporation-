# Asistente IA — TRAINING Corporation

Base del Sprint 1 con integraciones de WhatsApp y WordPress para Sprint 2: chat web para consultar precios, fechas de inicio, requisitos y modalidades (HU1–HU4 y HU10), webhook de WhatsApp Cloud API y plugin instalable de WordPress. Node.js + Express, catálogo JSON y Gemini desde el backend. El archivo `prototipo_interactivo (1).html` conserva el prototipo original de Sprint 0; la aplicación funcional está en `public/`.

El catálogo contiene **14 cursos simulados de prueba**: dos del ejemplo del instructivo y doce añadidos en la rama. No consta una fuente oficial validada por el PO; no representan una oferta comercial confirmada. El Sprint 1 incluye HU1–HU4 y HU10 (**18 puntos**), actualmente **En validación**. HU5–HU9 y HU11 quedan para próximos sprints.

## Guía de instalación y uso — Sprint 2

Las instrucciones siguientes están preparadas para **Windows con PowerShell**. Todos los comandos, salvo la descarga inicial, se ejecutan dentro de la carpeta del repositorio, donde está `package.json`.

### 1. Requisitos y descarga

- Node.js **22.13 o superior**, con npm. El entorno se verificó con Node.js 24.11.
- Git para descargar la rama por consola.
- Conexión a Internet para instalar dependencias y descargar WordPress la primera vez.
- Microsoft Edge para ejecutar las pruebas automáticas de navegador. No es un requisito para abrir la demo en tu navegador habitual.

La prueba local incluye WordPress 6.8.3, PHP 8.3 y SQLite mediante WordPress Playground. **No necesitas instalar PHP, WordPress, XAMPP ni una base de datos por separado. Tampoco necesitas una cuenta de Meta.**

Para obtener una copia nueva:

```powershell
git clone --branch sprint-2-mvp --single-branch https://github.com/rodri0325/Asistente-IA_Training_corporation- training-asistente-sprint2
cd training-asistente-sprint2
npm.cmd ci
```

Si ya tienes el repositorio, revisa `git status` y guarda tus cambios locales antes de actualizar. Después:

```powershell
git fetch origin
git switch sprint-2-mvp
git pull --ff-only
npm.cmd ci
```

### 2. Iniciar WordPress sin configurar claves

Haz doble clic en **[INICIAR-WORDPRESS.cmd](INICIAR-WORDPRESS.cmd)** o ejecuta:

```powershell
npm.cmd run wordpress:demo
```

Espera a que aparezca `WordPress local: http://127.0.0.1:9400` en la terminal y abre esa dirección. El arranque compila el widget, prepara WordPress, activa el plugin, configura la conexión y carga la portada de TRAINING. La primera ejecución puede tardar más porque descarga WordPress y su integración SQLite; esas descargas quedan en `.wordpress-local/cache/`.

| Acceso local | Dirección o dato |
| --- | --- |
| Sitio de demostración | [http://127.0.0.1:9400](http://127.0.0.1:9400) |
| Administrador de WordPress | [http://127.0.0.1:9400/wp-admin/](http://127.0.0.1:9400/wp-admin/) |
| Usuario | `admin` |
| Contraseña de la demo | `training-local-demo` |
| Backend | `http://127.0.0.1:5000` |

Usa **127.0.0.1** en estas direcciones; no lo reemplaces por `localhost`. Ambos servicios son accesibles únicamente desde este computador. Las credenciales de la tabla pertenecen a esta demo local y no deben usarse en un sitio público.

Mantén la terminal abierta mientras pruebas. **Ctrl+C detiene WordPress y el backend.** El sitio, sus ajustes y el historial de la conversación no se conservan entre arranques. La caché de descargas sí se conserva.

Este modo usa **respuestas simuladas a partir del catálogo de ejemplo**, identificadas con un único aviso en la cabecera. No consulta Gemini. El simulador distingue cursos y consultas de precio, fechas, requisitos, modalidades y duración. `INICIAR-WORDPRESS.cmd` inicia siempre esta demostración; para usar tu clave sigue el paso 4.

### 3. Recorrer la demostración y cambiar los ajustes

1. Entra a la portada y pulsa **Explorar cursos**.
2. Pulsa **Consultar curso** en una tarjeta. El asistente se abre con una pregunta preparada; pulsa **Enviar** para realizarla.
3. Prueba también consultas como «¿Cuánto cuesta Excel Avanzado?» y «¿Qué modalidad tiene Python para Análisis de Datos?».
4. Pregunta por un curso inexistente para comprobar que el asistente solicite aclaración.
5. Cierra el chat con su botón o con **Escape**. Puedes volver a abrirlo desde la burbuja o **Hacer una pregunta**.
6. Entra al administrador y abre **Ajustes → Asistente TRAINING** (`Settings` si WordPress aparece en inglés).
7. Comprueba la URL base `http://127.0.0.1:5000`. No añadas `/chat`: el widget agrega esa ruta.
8. Desmarca **Activar la burbuja en las páginas públicas**, guarda y recarga el sitio. Vuelve a marcarla para reactivar el chat.

La portada muestra tres cursos seleccionados; el asistente puede listar y consultar los 14 cursos del archivo. **Cada consulta es independiente:** incluye el nombre del curso en cada pregunta.

### 4. Conectar WordPress con Gemini real

Detén primero la demo con **Ctrl+C**. Crea el archivo local de configuración solo si todavía no existe:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

Completa `GEMINI_API_KEY` con tu clave de [Google AI Studio](https://aistudio.google.com/apikey) y revisa `GEMINI_MODEL`: debe identificar un modelo habilitado en tu cuenta. Conserva los otros valores y credenciales que ya existan. Guarda el archivo y ejecuta:

```powershell
npm.cmd run wordpress:local
```

Abre nuevamente [http://127.0.0.1:9400](http://127.0.0.1:9400). Este comando levanta WordPress y el backend con `.env`; **no ejecutes además `npm.cmd start`**. El origen local de WordPress se autoriza automáticamente para las consultas. Si falta la clave o el proveedor rechaza la solicitud, el chat muestra un error; este modo no cambia silenciosamente a respuestas simuladas.

El archivo `.env` está excluido de Git. No pongas claves en el plugin, el JavaScript del navegador, el README ni capturas. Cambiar a Gemini real no convierte los datos del catálogo en una oferta comercial validada.

### 5. Generar el plugin e instalarlo en otro WordPress

El plugin requiere **WordPress 6.3 o superior** y su código admite **PHP 7.4 o superior**; el servidor debe cumplir también los requisitos de la versión de WordPress que utilice. Necesitas acceso administrativo con permiso para instalar plugins.

Genera el archivo instalable desde este repositorio:

```powershell
npm.cmd run package:wordpress
```

El resultado es **`build/training-asistente-ia.zip`**. El ZIP y el JavaScript compilado no están versionados; se generan con este comando después de instalar las dependencias.

En el otro WordPress:

1. Abre **Plugins → Añadir nuevo plugin → Subir plugin**.
2. Selecciona `build/training-asistente-ia.zip`, instala y activa **TRAINING Asistente IA**.
3. Ve a **Ajustes → Asistente TRAINING**.
4. Introduce la URL base de tu backend, sin `/chat`.
5. Marca **Activar la burbuja en las páginas públicas** y guarda.
6. Visita el sitio público y envía una consulta.

Activar el plugin por sí solo no muestra el chat: debes guardar una URL válida y activar su casilla. El ZIP instala únicamente el asistente; **conserva el tema del sitio**. La portada de TRAINING que ves en la demo pertenece a `wordpress-demo-theme/` y no se incluye en el plugin.

El backend Node.js se ejecuta por separado de WordPress. Para otra instalación local en el mismo computador, configura `.env` así, reemplazando el origen de ejemplo por la dirección exacta de tu WordPress:

```dotenv
PORT=5000
ALLOWED_ORIGINS=http://127.0.0.1:8080
```

Completa también la clave de Gemini y ejecuta `npm.cmd start`. En los ajustes del plugin, la URL del backend será `http://127.0.0.1:5000`. El origen autorizado incluye protocolo, host y puerto, sin ruta; varios orígenes se separan con comas. Reinicia el backend cuando cambies `.env`.

Para un sitio público, usa un backend accesible mediante **HTTPS** y autoriza el origen HTTPS del WordPress real. Una dirección `127.0.0.1` apunta al computador de cada visitante y no sirve como backend público. La [guía de WordPress](docs/wordpress.md) amplía la configuración de orígenes, proxies y casos de aceptación.

### 6. Mantener el catálogo

La única fuente de cursos es **[backend/data/catalogo_cursos.json](backend/data/catalogo_cursos.json)**. Cada curso tiene `id`, `nombre`, `precio`, `moneda`, `fechas_inicio`, `modalidades`, `requisitos` y `duracion_semanas`. Conserva los tipos de los campos y el formato `YYYY-MM-DD` de las fechas.

Después de editar el catálogo, reinicia el servicio que estés utilizando. La portada local selecciona los identificadores `curso-001`, `curso-002` y `curso-003`; si cambias esos identificadores, ajusta la selección en `wordpress-demo-theme/functions.php`. El simulador también tiene alias por identificador en `scripts/demo-responder.js`: revísalos si sustituyes los cursos para no asociar nombres antiguos a datos nuevos. El modo Gemini recibe el catálogo completo desde el backend.

Valida con el equipo la procedencia y vigencia de los datos antes de sustituir los ejemplos por el catálogo comercial.

### 7. Solución de problemas

| Situación | Qué revisar |
| --- | --- |
| `node` o `npm` no se reconocen | Instala la versión requerida de Node.js con npm y abre una terminal nueva. Comprueba `node --version` y `npm.cmd --version`. |
| PowerShell bloquea `npm.ps1` | Usa los comandos `npm.cmd` de esta guía; no necesitas cambiar la política de ejecución. |
| No abre el sitio local | Comprueba que la terminal siga abierta, que haya mostrado la dirección de arranque y que uses `http://127.0.0.1:9400`. |
| Error `EADDRINUSE` | Hay otro servicio usando 9400 o 5000. Detén la demo o backend anterior antes de iniciar uno nuevo. El lanzador WordPress usa esos puertos fijos; cambiar `PORT` en `.env` solo afecta al arranque con `npm.cmd start`. |
| Falla la primera descarga | Revisa la conexión y el mensaje de la terminal. La primera preparación necesita acceso a las descargas oficiales de WordPress. |
| No aparece la burbuja | Revisa activación del plugin, URL válida y casilla habilitada. Si lo instalaste manualmente, genera e instala el ZIP compilado y recarga la página. |
| Abre el chat pero falla la consulta | Comprueba que el backend esté activo. En modo real revisa clave/modelo Gemini; en otro WordPress comprueba `ALLOWED_ORIGINS` y que no mezcles una página HTTPS con una API HTTP. |
| Ves los textos o el diseño anteriores | Detén y vuelve a iniciar la demo; después recarga la página. Los archivos del tema y del plugin se copian al arrancar. |
| Se perdieron ajustes al reiniciar | Es el comportamiento del WordPress de demostración en memoria. Para persistencia utiliza una instalación propia de WordPress. |
| Las pruebas de navegador no arrancan | Comprueba que Microsoft Edge esté instalado y que los puertos 9400 y 5000 estén libres. |

La demo y el plugin no se han desplegado en el sitio de TRAINING. Los resultados comprobados están en el [informe de verificación de WordPress](docs/verificacion-wordpress.md).

## WhatsApp — Sprint 2

La integración con WhatsApp Cloud API está implementada en el mismo backend. `GET /webhook` verifica el callback de Meta; `POST /webhook` valida la firma con el secreto de la aplicación, confirma la recepción y procesa los mensajes en segundo plano. El chat web y WhatsApp comparten el servicio de Gemini y el catálogo. La configuración y la conversación con un teléfono real siguen pendientes hasta conectar una aplicación de Meta.

Sigue la **[guía de WhatsApp desde cero](docs/whatsapp-meta.md)** para crear la app, configurar `.env`, exponer el servidor por HTTPS y registrar las pruebas de extremo a extremo. No se necesita ejecutar la plantilla Python. Las credenciales permanecen en `.env`, excluido de Git.

## Ejecutar solo el backend y el chat web

Este modo sirve la página original del chat y el webhook de WhatsApp; no arranca WordPress. Requiere una clave propia de Gemini. Detén cualquier demo anterior para liberar el puerto 5000.

```powershell
# Abre PowerShell dentro de la carpeta del repositorio.
npm.cmd ci
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
# Completa GEMINI_API_KEY, guarda y cierra el editor.
npm.cmd start
```

Abre http://localhost:5000. Si `.env` ya existe, edítalo sin sobrescribirlo. La clave permanece en el servidor y `.env` está excluido de Git. Sin clave, la página abre y el chat informa que falta configuración; no simula respuestas de IA. Reinicia el servidor después de modificar `.env` o el catálogo.

`GEMINI_MODEL` permite elegir un modelo habilitado en tu cuenta; el valor inicial es `gemini-3.6-flash`. Disponibilidad y cuotas dependen de Google. La integración usa [generateContent REST](https://ai.google.dev/api/generate-content) con `fetch` nativo de Node, sin instalar un SDK adicional.

## Probar

Detén primero la demo. Las pruebas de navegador arrancan y detienen su propio WordPress y necesitan libres los puertos 9400 y 5000.

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run test:php
npm.cmd run test:wordpress
```

| Comando | Qué comprueba |
| --- | --- |
| `npm.cmd test` | Backend, acceso desde WordPress, simulador del catálogo e integración de WhatsApp con proveedores simulados. |
| `npm.cmd run lint` | Revisión estática del código JavaScript. |
| `npm.cmd run test:php` | Contratos del plugin en PHP 7.4 y 8.3 con dobles de las funciones de WordPress; no necesita PHP instalado. |
| `npm.cmd run test:wordpress` | Plugin en WordPress real con Edge: envío, errores, ajustes, catálogo, estilos y vista móvil. |

La revisión 0.2.0 del plugin registró **67 pruebas Node, 11 de navegador y 54 aserciones en cada versión PHP**, todas aprobadas. Los alcances y límites están en [verificación de WordPress](docs/verificacion-wordpress.md) y [verificación de WhatsApp](docs/verificacion-whatsapp.md). Estos resultados no acreditan una conversación real con Gemini o Meta ni pruebas de usabilidad con usuarios finales.

Para una consulta manual al backend:

```powershell
# Con el servidor iniciado y una clave válida:
$body = @{ mensaje = '¿Cuánto cuesta Excel Avanzado?' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/chat -Method Post -ContentType 'application/json; charset=utf-8' -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
```

`POST /chat` acepta `{"mensaje":"pregunta"}` (1–1000 caracteres) y devuelve `{"respuesta":"texto"}`. Los errores devuelven `{"error":"descripción"}`: 400 entrada inválida, 413 cuerpo demasiado grande, 415 formato incorrecto, 429 cuota agotada, 502 fallo de Gemini, 503 falta de clave o indisponibilidad temporal de Gemini y 504 tiempo agotado. La espera máxima del proveedor es 15 segundos; esto no acredita el criterio de respuesta en ≤5 segundos de la wiki.

Los tests usan la API de Gemini **simulada**: verifican contrato HTTP, envío del catálogo, aislamiento de instrucciones, validaciones, errores y archivos privados. No certifican exactitud ni latencia del modelo real. El estado y los criterios de aceptación están en [docs/sprint-1.md](docs/sprint-1.md). La [matriz del catálogo](docs/casos-prueba-catalogo.md) contiene 56 casos manuales para los 14 cursos, sin dar por acreditada su ejecución.

## Estructura

- `backend/app.js`: sirve únicamente `public/` y conecta `/chat` y `/webhook`.
- `backend/asistente.js`: servicio compartido de Gemini e instrucciones del catálogo.
- `backend/whatsapp.js`: verificación, firma, cola en memoria, deduplicación y envío a Meta.
- `backend/server.js`: arranque local en `127.0.0.1:5000`.
- `backend/data/catalogo_cursos.json`: única fuente de datos de cursos.
- `public/`: página de prueba, chat independiente y widget flotante.
- `widget/` y `wordpress-plugin/`: widget empaquetable y plugin con ajustes de WordPress.
- `wordpress-demo-theme/`: tema de la portada local; no se incluye en el ZIP del plugin ni sustituye el tema de otro sitio.
- `scripts/demo-responder.js`: simulación por curso e intención, exclusiva del modo de demostración.
- `scripts/wordpress-local.js`: demo local de WordPress y backend.
- `tests/` y `e2e/`: pruebas de backend, plugin PHP e integración en navegador; `eslint.config.js`: análisis estático.

Cada consulta es independiente: incluye el nombre del curso en cada pregunta. Los mensajes solo permanecen en la página actual. Si falta información, las instrucciones del modelo indican ofrecer un asesor; no hay transferencia ni registro de solicitudes. El control por instrucciones requiere validación real del equipo antes de publicar.

## Integrar en un sitio de pruebas

En el mismo servidor puedes reutilizar el marcado del widget de `public/index.html` junto con `chat.css` y `chat.js`. Para otro origen, el chat independiente se puede incluir en un iframe, que mantiene las consultas y estilos en el origen del backend:

```html
<iframe src="http://localhost:5000/chat.html"
  title="Asistente de TRAINING" width="380" height="540"
  style="max-width:100%;border:0;border-radius:16px"></iframe>
```

Este ejemplo es local. Para pruebas compartidas se debe alojar el backend en un servidor accesible con HTTPS y sustituir la URL. No se ha desplegado en TRAINING. SharePoint automático, OCR, CRM y un panel de gestión comercial quedan fuera de este avance; el plugin sí incluye su propio panel de ajustes en WordPress. WhatsApp se incorpora en Sprint 2 según la guía enlazada arriba.
