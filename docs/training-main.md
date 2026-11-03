# Sitio web principal de TRAINING

La aplicación Nuxt que reemplaza la página de demostración como web principal está en `training-main/`.

## Instalar e iniciar en local

Requiere Node.js 22.13 o superior. Instala las dependencias del backend en la raíz y las del sitio con pnpm:

```powershell
npm.cmd ci
corepack pnpm --dir training-main install --frozen-lockfile
```

Inicia el backend en una terminal. Autoriza el origen local exacto que usarás en el navegador:

```powershell
$env:ALLOWED_ORIGINS = "http://127.0.0.1:3000"
npm.cmd start
```

En otra terminal, desde la raíz del repositorio, inicia el sitio:

```powershell
npm.cmd run dev
```

Abre `http://127.0.0.1:3000`. El chat es un componente Vue/TypeScript de la aplicación y se conecta por defecto al backend local `http://127.0.0.1:5000`. Si visitas el sitio desde `http://localhost:3000`, autoriza ese origen exacto en `ALLOWED_ORIGINS` en lugar de `127.0.0.1`.

El backend conserva su propio archivo `.env`: configura allí `GEMINI_API_KEY` para respuestas reales. Sin una clave válida, el widget se muestra, pero el backend responde con un error explícito.

## Compilar y ejecutar

Configura `NUXT_PUBLIC_CHAT_API_URL` con la URL base HTTPS del backend (sin `/chat`, ruta adicional, parámetros ni fragmento) en el entorno de compilación. Por ejemplo:

```powershell
$env:NUXT_PUBLIC_CHAT_API_URL = "https://api.ejemplo.com"
npm.cmd run build
```

El comando compila la aplicación Nuxt, incluido el endpoint del formulario de contacto. Ejecuta el servidor de producción con:

```powershell
npm.cmd run website:start
```

El backend de chat se despliega y configura por separado. Su variable `ALLOWED_ORIGINS` debe incluir el origen HTTPS exacto del sitio (protocolo y dominio, sin ruta), por ejemplo `https://www.ejemplo.com`. No publiques el sitio con el valor local de desarrollo: si `NUXT_PUBLIC_CHAT_API_URL` no está configurada en producción, el sitio informa del problema en la consola y no carga el widget.

El componente captura errores de conexión, respuestas inválidas y tiempos de espera y los muestra dentro del chat; no impide cargar ni utilizar el resto del sitio. El frontend y el backend se ejecutan y despliegan por separado.

`npm.cmd run website:typecheck` ejecuta la comprobación de tipos. `npm.cmd run start` inicia únicamente el backend; para desarrollo del sitio utiliza `npm.cmd run dev`.
