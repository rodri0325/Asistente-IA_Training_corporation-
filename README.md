# Asistente IA — TRAINING Corporation

MVP del Sprint 1: chat web para consultar precios, fechas de inicio, requisitos y modalidades (HU1–HU4 y HU10). Node.js + Express, catálogo JSON y Gemini desde el backend. El archivo `prototipo_interactivo (1).html` conserva el prototipo original de Sprint 0; la aplicación funcional está en `public/`.

Los cursos incluidos son **datos ficticios de prueba**, tomados del ejemplo del instructivo. No se extrajeron de SharePoint ni representan una oferta oficial.

## Ejecutar en PowerShell

Requiere Node.js 22.13 o superior y una clave propia de [Google AI Studio](https://aistudio.google.com/apikey).

```powershell
Set-Location 'C:\Users\Asus\Desktop\proyecto 2'
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

`POST /chat` acepta `{"mensaje":"pregunta"}` (1–1000 caracteres) y devuelve `{"respuesta":"texto"}`. Los errores devuelven `{"error":"descripción"}`: 400 entrada inválida, 413 cuerpo demasiado grande, 415 formato incorrecto, 429 cuota agotada, 502 fallo de Gemini, 503 falta de clave y 504 tiempo agotado. La espera máxima del proveedor es 15 segundos; esto no acredita el criterio de respuesta en ≤5 segundos de la wiki.

Los tests usan la API de Gemini **simulada**: verifican contrato HTTP, envío del catálogo, aislamiento de instrucciones, validaciones, errores y archivos privados. No certifican exactitud ni latencia del modelo real. Los escenarios de aceptación y pendientes están en [docs/sprint-1.md](docs/sprint-1.md).

## Estructura

- `backend/app.js`: carga el catálogo al iniciar, sirve únicamente `public/` y procesa `/chat`.
- `backend/server.js`: arranque local en `127.0.0.1:5000`.
- `backend/data/catalogo_cursos.json`: única fuente de datos de cursos.
- `public/`: página de prueba, chat independiente y widget flotante.
- `tests/chat.test.js`: pruebas con `node:test`; `eslint.config.js`: análisis estático.

Cada consulta es independiente: incluye el nombre del curso en cada pregunta. Los mensajes solo permanecen en la página actual. Si falta información, las instrucciones del modelo indican ofrecer un asesor; no hay transferencia ni registro de solicitudes. El control por instrucciones requiere validación real del equipo antes de publicar.

## Integrar en un sitio de pruebas

En el mismo servidor puedes reutilizar el marcado del widget de `public/index.html` junto con `chat.css` y `chat.js`. Para otro origen, el chat independiente se puede incluir en un iframe, que mantiene las consultas y estilos en el origen del backend:

```html
<iframe src="http://localhost:5000/chat.html"
  title="Asistente de TRAINING" width="380" height="540"
  style="max-width:100%;border:0;border-radius:16px"></iframe>
```

Este ejemplo es local. Para pruebas compartidas se debe alojar el backend en un servidor accesible con HTTPS y sustituir la URL. No se ha desplegado en TRAINING. SharePoint automático, OCR, WhatsApp, CRM y panel administrativo quedan fuera de este MVP.
