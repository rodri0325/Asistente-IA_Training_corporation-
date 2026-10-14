# Asistente IA — TRAINING Corporation

Base del Sprint 1 con integraciones de WhatsApp y WordPress para Sprint 2: chat web para consultar precios, fechas de inicio, requisitos y modalidades (HU1–HU4 y HU10), webhook de WhatsApp Cloud API y plugin instalable de WordPress. Node.js + Express, catálogo JSON y Gemini desde el backend. El archivo `prototipo_interactivo (1).html` conserva el prototipo original de Sprint 0; la aplicación funcional está en `public/`.

El catálogo contiene **14 cursos simulados de prueba**: dos del ejemplo del instructivo y doce añadidos en la rama. No consta una fuente oficial validada por el PO; no representan una oferta comercial confirmada. El Sprint 1 incluye HU1–HU4 y HU10 (**18 puntos**), actualmente **En validación**. HU5–HU9 y HU11 quedan para próximos sprints.

## WordPress — prueba local y plugin

Haz doble clic en **`INICIAR-WORDPRESS.cmd`** y, cuando indique que está preparado, abre **http://127.0.0.1:9400**. Requiere Node.js 22.13 o superior; la primera vez descarga WordPress y su base SQLite. No necesitas cuenta de Meta, PHP ni WordPress instalados. Mantén la ventana abierta; Ctrl+C detiene la prueba.

La demo ejecuta WordPress real 6.8.3 y el plugin, con **respuestas simuladas** y un catálogo ficticio. El sitio se reinicia en cada arranque. Para entrar a `/wp-admin/`, usa `admin` y `training-local-demo` (solo para esta prueba local). La [guía de WordPress](docs/wordpress.md) explica cómo conectar Gemini, cambiar los ajustes e instalar el ZIP en otro WordPress.

`npm.cmd run package:wordpress` genera `build/training-asistente-ia.zip`. El plugin permite configurar la URL del backend y mostrar u ocultar la burbuja. Los estilos están aislados del tema y las claves permanecen en el backend. No se ha publicado en el sitio de TRAINING.

## WhatsApp — Sprint 2

La integración con WhatsApp Cloud API está implementada en el mismo backend. `GET /webhook` verifica el callback de Meta; `POST /webhook` valida la firma con el secreto de la aplicación, confirma la recepción y procesa los mensajes en segundo plano. El chat web y WhatsApp comparten el servicio de Gemini y el catálogo. La configuración y la conversación con un teléfono real siguen pendientes hasta conectar una aplicación de Meta.

Sigue la **[guía de WhatsApp desde cero](docs/whatsapp-meta.md)** para crear la app, configurar `.env`, exponer el servidor por HTTPS y registrar las pruebas de extremo a extremo. No se necesita ejecutar la plantilla Python. Las credenciales permanecen en `.env`, excluido de Git.

## Ejecutar en PowerShell

Requiere Node.js 22.13 o superior y una clave propia de [Google AI Studio](https://aistudio.google.com/apikey).

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

```powershell
npm.cmd test
npm.cmd run lint
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

Este ejemplo es local. Para pruebas compartidas se debe alojar el backend en un servidor accesible con HTTPS y sustituir la URL. No se ha desplegado en TRAINING. SharePoint automático, OCR, CRM y panel administrativo quedan fuera de este avance. WhatsApp se incorpora en Sprint 2 según la guía enlazada arriba.
