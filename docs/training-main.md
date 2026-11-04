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

## Despliegue en una VM de AWS Academy

Para una demo HTTP con IP pública, ejecuta Nuxt y Express en la VM y usa Nginx como proxy. El navegador y el chat comparten el mismo origen, así que no configures `NUXT_PUBLIC_CHAT_API_URL`; el widget enviará sus preguntas a `/chat`. HTTP no cifra el tráfico, por lo que esta configuración es solo para una demo.

En el grupo de seguridad de EC2 permite TCP 80 desde los orígenes que deben ver la demo y TCP 22 solo desde tu IP. No abras 3000 ni 5000. En Ubuntu, instala Nginx y crea `/etc/nginx/sites-available/training`:

```nginx
server {
    listen 80 default_server;
    server_name _;

    location = /chat {
        proxy_pass http://127.0.0.1:5000/chat;
        proxy_set_header Host $host;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}
```

Si el sitio predeterminado está habilitado, desactívalo primero:

```bash
sudo unlink /etc/nginx/sites-enabled/default
```

Si `unlink` indica que no existe ese archivo, continúa. Activa la configuración y comprueba Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/training /etc/nginx/sites-enabled/training
sudo nginx -t
sudo systemctl enable --now nginx
```

Desde la raíz del repositorio, instala dependencias, configura el secreto y compila sin URL de API:

```bash
npm ci
corepack pnpm --dir training-main install --frozen-lockfile
nano .env
npm run build
```

En `.env`, configura `GEMINI_API_KEY` y el modelo deseado en `GEMINI_MODEL`. Define `ALLOWED_ORIGINS` con el origen exacto del navegador, incluido protocolo y puerto si aplica, por ejemplo `http://203.0.113.10`. El middleware también acepta solicitudes del mismo origen; esta variable autoriza además ese origen explícitamente.

Para arrancar los dos procesos automáticamente después de reiniciar la VM, crea los siguientes servicios. Estos ejemplos suponen que el repositorio está en `/home/ubuntu/Asistente-IA_Training_corporation-` y Node está en `/usr/bin/node`; adapta las rutas si tu usuario o instalación son distintos.

`/etc/systemd/system/training-api.service`:

```ini
[Unit]
Description=TRAINING chat API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/Asistente-IA_Training_corporation-
ExecStart=/usr/bin/node --env-file-if-exists=.env backend/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

`/etc/systemd/system/training-web.service`:

```ini
[Unit]
Description=TRAINING Nuxt website
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/Asistente-IA_Training_corporation-/training-main
Environment=PORT=3000
Environment=NITRO_HOST=127.0.0.1
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Activa y revisa los servicios:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now training-api training-web
sudo systemctl status training-api training-web --no-pager
```

Abre `http://IP_PUBLICA_DE_LA_VM`. Si no funciona, revisa `sudo journalctl -u training-api -u training-web -n 50 --no-pager` y `sudo journalctl -u nginx -n 50 --no-pager`. AWS Academy puede cambiar o detener recursos al expirar el laboratorio; si la VM se detiene, al volver a iniciarla systemd arranca los servicios, pero confirma su IP pública y actualiza `ALLOWED_ORIGINS` si cambió.

## Compilar y ejecutar en hosts separados

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
