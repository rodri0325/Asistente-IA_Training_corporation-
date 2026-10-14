=== TRAINING Asistente IA ===
Requires at least: 6.3
Requires PHP: 7.4
Stable tag: 0.1.0

Widget del asistente comercial y académico de TRAINING. Requiere el backend externo del proyecto.

== Description ==

Muestra una burbuja de chat en las páginas públicas, con estilos aislados del tema.
El widget permanece deshabilitado hasta configurar la URL del backend y marcar
"Mostrar el chat" en Ajustes > Asistente TRAINING.

WordPress sirve el widget; el navegador envía las consultas al backend configurado.
El backend consulta Gemini y el catálogo del proyecto. Las claves de Gemini y Meta
no se almacenan en este plugin ni se incluyen en su JavaScript. No requiere Meta,
una cuenta de WhatsApp ni un portafolio empresarial.

El catálogo actual es una demostración y necesita validación antes del uso comercial.
Las consultas son independientes: incluye el nombre del curso en cada pregunta.

== Installation ==

1. En Plugins > Añadir nuevo plugin > Subir plugin, selecciona el ZIP compilado
   training-asistente-ia.zip y actívalo.
2. Abre Ajustes > Asistente TRAINING.
3. Introduce la URL BASE del backend, sin /chat, parámetros ni credenciales.
   Usa HTTPS en un sitio público. Para una prueba en este mismo computador
   se admite http://127.0.0.1:5000, http://localhost:5000 o http://[::1]:5000.
4. Añade el origen mostrado por el panel a ALLOWED_ORIGINS en el .env del backend
   y reinicia el backend. Los orígenes se separan con comas.
5. Marca Mostrar el chat, guarda y visita la página pública.

Requiere WordPress 6.3 o superior por la estrategia defer del script. El requisito
de PHP del plugin es 7.4; usa una versión de PHP soportada por tu WordPress.
La guía de desarrollo y prueba local se encuentra en docs/wordpress.md del repo.

== Frequently Asked Questions ==

= ¿Por qué no aparece la burbuja? =

Activa el plugin y el ajuste Mostrar el chat, configura una URL válida y verifica
que el ZIP incluya assets/training-chat.js. Después actualiza la página y limpia
la caché del sitio si la tiene.

= ¿Puedo apagar el chat sin borrar la configuración? =

Sí. Desmarca Mostrar el chat o desactiva el plugin. La configuración se elimina
solo al borrar el plugin desde WordPress.

= ¿Es suficiente instalar el ZIP para obtener respuestas? =

No. El backend debe estar activo, con su clave Gemini válida y su configuración
CORS. El navegador conecta directamente al backend. No pegues claves API en la
URL del backend: se verá en el código público de la página.

= ¿Sirve una dirección local en el sitio real? =

No para los visitantes. localhost y 127.0.0.1 apuntan al computador de cada
visitante. Usa un backend accesible por HTTPS para un sitio público.

== Changelog ==

= 0.1.0 =
* Primer plugin local: configuración de URL, activación explícita y widget aislado.
