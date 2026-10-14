# Verificación local de WordPress — 13 de octubre de 2026

La integración parte de `sprint-1-mvp`, base `28a613c9c35f7eed6989c79753f233485a84c662`, y conserva los cambios de WhatsApp en la rama `sprint-2-mvp`. Este informe incluye la revisión 0.2.0 del plugin: presentación refinada, portada TRAINING y consultas de demostración por curso y dato solicitado.

## Entorno y resultados ejecutados

Windows, Node.js 24.11, WordPress 6.8.3, PHP 8.3 mediante WordPress Playground, SQLite y tema local TRAINING. Pruebas de navegador con Microsoft Edge y Playwright; un único trabajador y WordPress nuevo en cada ejecución.

| Verificación | Resultado |
| --- | --- |
| `npm.cmd test` | 67 pruebas aprobadas, sin fallos; incluye chat, CORS, cuota, simulador del catálogo y regresión de WhatsApp |
| `npm.cmd run test:php` | 54 aserciones aprobadas en PHP 7.4 y otras 54 en PHP 8.3 |
| `npm.cmd run test:wordpress` | 11 pruebas aprobadas, sin fallos (ejecución final: 22,9 segundos) |
| `npm.cmd run lint` | Sin errores |
| `npm.cmd run package:wordpress` | ZIP creado y estructura comprobada: cuatro archivos bajo `training-asistente-ia/` |

Las pruebas PHP utilizan dobles de las funciones de WordPress; las pruebas de navegador utilizan una instalación real de WordPress con el plugin cargado y activado. La suite de navegador comprueba:

1. Consulta desde WordPress al backend de otro origen, encabezado CORS, contenido enviado y respuesta visible.
2. HTML malicioso en consulta y respuesta representado como texto, sin ejecución.
3. Fallo de conexión, recuperación de la pregunta y reintento exitoso.
4. Panel dentro de una pantalla de 390 × 844, foco del formulario y cierre con Escape.
5. Aislamiento frente a estilos agresivos del tema y ausencia de widgets duplicados.
6. URL HTTP pública rechazada por los ajustes y widget deshabilitado.
7. Apagado sin descargar el widget y reactivación desde los ajustes reales de WordPress.
8. Envío conservado en la página original y el chat independiente.
9. Sin montaje cuando no hay configuración, y rechazo de URL inválidas antes del montaje.
10. Navegación y consulta desde una tarjeta del catálogo en móvil: prepara la pregunta, espera el envío del usuario y responde sobre el curso elegido.
11. Una consulta preparada desde el sitio no reemplaza la solicitud que ya está en curso.

También se comprueba que los botones de la portada informen cuando el plugin está deshabilitado. La revisión visual de la portada y del chat confirmó la eliminación de los avisos repetidos; el modo de demostración conserva una única etiqueta en la cabecera.

La entrada automática al administrador espera el foco inicial que WordPress programa con un temporizador. La demo bloquea las solicitudes HTTP externas de WordPress para evitar comprobaciones de actualizaciones; esto no bloquea las consultas a Gemini realizadas por el backend de Node en modo real.

## Artefacto instalable

`training-asistente-ia.zip`, versión 0.2.0, 9844 bytes. Incluye únicamente el archivo principal PHP, el desinstalador, `readme.txt` y el JavaScript compilado. No contiene `.env`, credenciales, el repositorio, el tema de demostración ni dependencias de desarrollo.

SHA-256 de la copia entregada en `outputs/`:

```text
F1937FA03B95396E3422CDF8CC45D0F5D75A5AB9E35A5D9C2A99BA4124B3F0EF
```

## Límites de esta validación

- Las respuestas están simuladas y el modo se identifica en la cabecera. El simulador consulta el catálogo de ejemplo para cada curso e intención; no se validaron exactitud del modelo de Gemini, cuotas reales, latencia ni catálogo comercial.
- El plugin se cargó y activó en WordPress local; no se instaló en el sitio de TRAINING ni se probó con sus plugins y tema.
- Los ensayos PHP 7.4 no acreditan una instalación completa de WordPress en esa versión de PHP.
- La prueba local se reinicia al cerrarla y solo escucha en `127.0.0.1`. No acredita despliegue público, concurrencia de producción ni configuración detrás de un proxy.

Para repetir la demo, usa `INICIAR-WORDPRESS.cmd`. La [guía de WordPress](wordpress.md) explica el acceso al administrador, las pruebas y cómo conectar Gemini real.
