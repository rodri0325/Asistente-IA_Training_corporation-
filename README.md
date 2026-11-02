# TRAINING Corporation

Sitio web en Nuxt 4, Vue 3 y TypeScript. Incluye un chat aislado como componente Vue y un backend Node.js + Express que consulta el catálogo de cursos y Gemini. Ante una consulta general sobre la oferta, el asistente muestra primero las categorías y luego puede listar los cursos de la categoría elegida y responder preguntas sobre ellos. El backend también recibe el webhook de WhatsApp.

## Requisitos

- Node.js 22.13 o superior.
- npm y Corepack (incluido con Node.js).
- Una clave de Gemini para obtener respuestas reales.

## Instalación y desarrollo

Desde PowerShell, en la raíz del repositorio:

```powershell
npm.cmd ci
corepack pnpm --dir training-main install --frozen-lockfile
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

En `.env`, configura `GEMINI_API_KEY`. El chat del sitio usa por defecto `http://127.0.0.1:5000` durante el desarrollo; el backend debe permitir el origen del navegador. Inicia los servicios en terminales separadas:

```powershell
# Terminal 1: backend y chat
$env:ALLOWED_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000"
npm.cmd start
```

```powershell
# Terminal 2: sitio Nuxt
npm.cmd run dev
```

Abre `http://localhost:3000`. Si editas `.env`, reinicia el backend. El frontend muestra los fallos de conexión dentro del chat y sigue dejando disponible el resto del sitio.

## Producción

Configura `NUXT_PUBLIC_CHAT_API_URL` con la URL base HTTPS del backend (sin `/chat`) antes de compilar:

```powershell
$env:NUXT_PUBLIC_CHAT_API_URL = "https://api.ejemplo.com"
npm.cmd run build
npm.cmd run website:start
```

En el backend, configura `ALLOWED_ORIGINS` con el origen HTTPS exacto del sitio y `GEMINI_API_KEY` en su entorno privado. El sitio Nuxt y el backend se despliegan por separado. Consulta [la guía del sitio](docs/training-main.md) para más detalles.

## Verificación

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run website:typecheck
npm.cmd run build
```

Las pruebas del backend usan un proveedor de IA simulado; no verifican la disponibilidad real de Gemini. El catálogo de [cursos](backend/data/catalogo_cursos.json) es la fuente de consultas del asistente; valida su contenido con el equipo antes de usarlo como oferta comercial.

## WhatsApp

El backend conserva la integración con WhatsApp Cloud API. La configuración de Meta, las credenciales y los pasos de prueba están en [la guía de WhatsApp](docs/whatsapp-meta.md). No se necesitan credenciales de WhatsApp para ejecutar el sitio o su chat web.
