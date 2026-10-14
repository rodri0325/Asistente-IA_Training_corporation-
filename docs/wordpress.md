# Asistente TRAINING en WordPress

El plugin instala la burbuja del chat en las páginas públicas de WordPress y usa el mismo backend que el chat web y WhatsApp. **No requiere Meta ni un portafolio empresarial.** El backend continúa ejecutándose por separado; WordPress no ejecuta Gemini ni almacena sus claves.

## Qué incluye

- Plugin `TRAINING Asistente IA`, con panel en **Ajustes → Asistente TRAINING**.
- URL del backend configurable y casilla para mostrar u ocultar el chat.
- Un archivo `assets/training-chat.js`, con estilos dentro de Shadow DOM para aislar el chat del tema.
- Configuración pública mínima: `window.TrainingChatConfig = { apiUrl: 'URL_BASE' }`.
- El widget se carga solo en el sitio público, después de configurar una URL válida y activar su casilla. Instalar o activar el plugin por sí solo no muestra el chat.

Requiere WordPress **6.3 o superior** por la carga `defer`. El código del plugin requiere PHP 7.4 o superior; el entorno debe cumplir también los requisitos de la versión de WordPress instalada. No se ha confirmado la versión del sitio de TRAINING ni su compatibilidad particular con otros plugins.

## Prueba local sin un WordPress previo

La carpeta incluye un entorno de **WordPress real 6.8.3 con PHP 8.3**, ejecutado en memoria mediante WordPress Playground. No necesitas instalar WordPress, PHP ni una base de datos por separado. Necesitas Node.js 22.13 o superior.

Puedes hacer doble clic en **`INICIAR-WORDPRESS.cmd`** dentro de la carpeta del repositorio. También puedes abrir PowerShell en esa carpeta y ejecutar:

```powershell
npm.cmd ci
npm.cmd run wordpress:demo
```

La primera ejecución descarga WordPress y su integración SQLite desde sus fuentes oficiales y los conserva en `.wordpress-local/cache/`. Luego abre:

- **Sitio de prueba:** [http://127.0.0.1:9400](http://127.0.0.1:9400).
- **Administración:** [http://127.0.0.1:9400/wp-admin/](http://127.0.0.1:9400/wp-admin/).
- **Usuario:** `admin`.
- **Contraseña local:** `training-local-demo`.

El arranque compila el widget, instala y activa el plugin, configura su URL y muestra una página de prueba. El servidor de WordPress escucha en `127.0.0.1:9400` y el backend en `127.0.0.1:5000`: solo son accesibles desde este computador. Usa exactamente esas direcciones; no sustituyas `127.0.0.1` por `localhost`.

**`wordpress:demo` utiliza respuestas simuladas**, identificadas mediante un único aviso en la cabecera de la página. El simulador consulta el catálogo de ejemplo según el curso y el dato solicitado: precio, modalidad, requisitos, duración o fechas. Sirve para comprobar el plugin y su conexión sin ninguna clave. No consulta Gemini ni valida la exactitud del modelo. No depende de Meta ni de WhatsApp.

La portada usa un tema local de TRAINING con cursos y botones que abren consultas en el asistente. El tema es exclusivo de la demostración: instalar el ZIP del plugin en otro WordPress conserva el diseño de ese sitio.

Mantén la terminal abierta. **Ctrl+C detiene ambos servidores.** El sitio y sus ajustes se crean de nuevo en cada arranque; los cambios hechos en WordPress no persisten. Solo se conservan las descargas de la caché. Estas credenciales son exclusivas de esta demostración en loopback y no deben usarse en un sitio público.

### Probar con Gemini real

Configura `GEMINI_API_KEY` en el `.env` del repositorio como indica la sección siguiente. Detén antes cualquier demo o backend que ya use los puertos 9400 o 5000 y ejecuta:

```powershell
npm.cmd run wordpress:local
```

Abre las mismas direcciones anteriores. Este modo carga `.env` y consulta Gemini; conserva un aviso de catálogo de ejemplo mientras no se sustituya por datos comerciales validados. El arranque autoriza automáticamente el origen local de WordPress en CORS. No necesitas ejecutar `npm.cmd start` además de este comando.

La versión 6.8.3 es la versión fija de esta prueba reproducible, no una afirmación sobre la versión actual de WordPress ni la del sitio de TRAINING. No se instala ni modifica ese sitio.

## Preparar el backend para otra instalación de WordPress

Abre PowerShell en la carpeta del repositorio:

```powershell
npm.cmd ci
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

Completa `GEMINI_API_KEY` con una clave válida para respuestas reales. Conserva las credenciales que ya existan. Añade el origen **exacto** de WordPress a `ALLOWED_ORIGINS`; por ejemplo, si la página se abre en `http://127.0.0.1:8080`:

```dotenv
PORT=5000
ALLOWED_ORIGINS=http://127.0.0.1:8080
```

Puedes permitir varios orígenes separados por comas. Un origen incluye protocolo, host y puerto cuando corresponda, **sin ruta ni barra final**. `localhost` y `127.0.0.1` son distintos. Usa siempre la dirección concreta de tu entorno local, que también muestra el panel del plugin.

```powershell
npm.cmd start
```

La URL base del backend local es `http://127.0.0.1:5000`. El widget agrega `/chat`. Por ejemplo, la base `https://api.ejemplo.com/asistente` produciría `https://api.ejemplo.com/asistente/chat`; ese prefijo requiere que el servidor o proxy lo publique así.

Reinicia el backend después de cambiar `.env`. Sin clave Gemini válida puedes comprobar instalación, apertura y validación del chat, pero no una conversación real con IA.

Si publicas el backend detrás de un proxy que termina HTTPS, autoriza explícitamente los orígenes HTTPS en `ALLOWED_ORIGINS`, incluido el del frontend del propio backend si lo utilizas. La cuota actual es por IP de conexión; detrás de un proxy se comparte hasta configurar de forma controlada las IP de confianza. El entorno local no utiliza ese proxy.

## Generar el ZIP instalable

En la carpeta del repositorio:

```powershell
npm.cmd run package:wordpress
```

El comando compila el widget y genera `build/training-asistente-ia.zip`. Ese ZIP es el que se instala en otro WordPress; la prueba local automática ya carga el plugin al arrancar.

## Instalar y configurar el plugin

1. Entra al administrador de tu WordPress de prueba.
2. Abre **Plugins → Añadir nuevo plugin → Subir plugin** y selecciona `training-asistente-ia.zip`.
3. Instala y activa **TRAINING Asistente IA**.
4. Ve a **Ajustes → Asistente TRAINING**.
5. Escribe `http://127.0.0.1:5000` como URL base en la prueba local. No agregues `/chat`.
6. Comprueba que el origen que muestra ese panel está en `ALLOWED_ORIGINS` del backend.
7. Marca **Activar la burbuja en las páginas públicas** y guarda.
8. Visita el sitio público. Abre la burbuja y pregunta «¿Cuánto cuesta Excel Avanzado?».

El ZIP debe contener una carpeta `training-asistente-ia/`, con `training-asistente-ia.php`, `uninstall.php`, `readme.txt` y `assets/training-chat.js`. La carpeta de código fuente sin el archivo compilado no es un plugin listo para mostrar el chat.

## Pruebas de aceptación

Registra el navegador, la versión de WordPress, el resultado y una captura de cada caso que se presente como ejecutado. Esta lista por sí sola no acredita pruebas.

| Caso | Acción | Resultado esperado |
| --- | --- | --- |
| Instalación | Activar el plugin recién instalado | Existe Ajustes → Asistente TRAINING; aún no hay burbuja |
| Configuración | Guardar una URL válida y activar Mostrar el chat | Una sola burbuja en el sitio público |
| Chat | Enviar una pregunta con nombre del curso | El backend recibe `POST /chat` y devuelve respuesta cuando Gemini está configurado |
| Backend caído | Detener el backend y enviar | Mensaje de error visible, sin dejar bloqueado el envío |
| CORS | Quitar el origen de WordPress y reiniciar backend | El navegador rechaza la consulta; al restaurar el origen vuelve a funcionar |
| URL inválida | Guardar HTTP de un dominio público o URL con credenciales/parámetros | Error en ajustes y widget deshabilitado |
| Apagado | Desmarcar Mostrar el chat y guardar | No se carga el script ni aparece la burbuja tras recargar |
| Reactivación | Volver a marcar Mostrar el chat | Conserva la URL y vuelve a mostrar el chat |
| Diseño | Revisar con tema activo y ancho móvil | El chat permanece legible y usable, con estilos aislados |
| Seguridad | Inspeccionar el código público y el ZIP | No contiene `.env`, claves Gemini ni tokens Meta |
| Eliminación | Borrar el plugin en el entorno de prueba | Se elimina únicamente su opción de configuración |

Los tests con respuestas simuladas verifican integración y errores; no acreditan exactitud, disponibilidad ni tiempos de respuesta del modelo real.

Para ejecutar las pruebas automáticas del proyecto:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run test:php
npm.cmd run test:wordpress
```

`test:php` ejecuta las validaciones del plugin en PHP 7.4 y 8.3 dentro de un sistema de archivos en memoria. Usa dobles de las funciones de WordPress para comprobar los contratos del plugin; no sustituye la prueba de integración con WordPress real. No necesita PHP instalado en Windows y no modifica el archivo compilado del widget.

`test:wordpress` utiliza Microsoft Edge instalado en el equipo y arranca su propio WordPress de demostración. Detén cualquier demo abierta para dejar libres los puertos 9400 y 5000 antes de ejecutarlo.

## Problemas comunes

**No aparece el chat:** confirma que tanto el plugin como la casilla estén activos; la URL sea válida y `assets/training-chat.js` esté presente. Recarga y limpia la caché del sitio cuando aplique.

**Aparece pero no responde:** revisa que el backend esté encendido, que `GEMINI_API_KEY` sea válida, que `GEMINI_MODEL` esté disponible para esa cuenta y que CORS permita el origen exacto del sitio. Un WordPress con HTTPS necesita un backend HTTPS para evitar bloqueos por contenido mixto; el HTTP de loopback se reserva para la prueba local.

**La URL incluye `/chat`:** guarda la URL base, por ejemplo `http://127.0.0.1:5000`. El widget añade la ruta del servicio.

**Otra persona abre WordPress y no le funciona:** una URL local apunta al computador de cada visitante. Para una prueba desde otros equipos o un sitio público se necesita un backend accesible mediante HTTPS y los orígenes correspondientes autorizados.

## Alcance y siguiente entrega

El catálogo actual contiene cursos simulados; hay que validar el catálogo real antes de usarlo con clientes. Cada consulta es independiente. No hay transferencia automática a un asesor, registro de leads, integración de SharePoint ni publicación en TRAINING en esta entrega.

Para usarlo en el sitio real, el equipo debe disponer de acceso para instalar plugins, confirmar las versiones del sitio y usar un backend HTTPS permanentemente disponible. La URL del backend es pública; sus credenciales se mantienen en el servidor.

Desactivar el plugin o desmarcar la casilla conserva los ajustes. Borrar el plugin mediante WordPress elimina solo `taia_settings`; no modifica el backend ni su catálogo.

## Referencias oficiales

- [Settings API de WordPress](https://developer.wordpress.org/plugins/settings/using-settings-api/): registro y gestión de ajustes.
- [wp_enqueue_script](https://developer.wordpress.org/reference/functions/wp_enqueue_script/): carga del archivo y estrategia `defer` desde WordPress 6.3.
- [wp_add_inline_script](https://developer.wordpress.org/reference/functions/wp_add_inline_script/): configuración antes del archivo del widget.
- [Desinstalación de plugins](https://developer.wordpress.org/plugins/plugin-basics/uninstall-methods/): limpieza limitada a los datos propios.
