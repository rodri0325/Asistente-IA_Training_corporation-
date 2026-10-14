# Verificación local de WordPress — 13 de octubre de 2026

La integración se preparó sobre la copia local de `sprint-1-mvp`, base `28a613c9c35f7eed6989c79753f233485a84c662`. Conserva los cambios de WhatsApp y se integra en la rama `sprint-2-mvp`. Las comprobaciones de este informe se realizaron localmente, antes de preparar el commit del Sprint 2.

## Entorno y resultados ejecutados

Windows, Node.js 24.11, WordPress 6.8.3, PHP 8.3 mediante WordPress Playground, SQLite y tema Twenty Twenty-Five. Pruebas de navegador con Microsoft Edge y Playwright; un único trabajador y WordPress nuevo en cada ejecución.

| Verificación | Resultado |
| --- | --- |
| `npm.cmd test` | 57 pruebas aprobadas, sin fallos; incluye chat, CORS, cuota y regresión de WhatsApp |
| `npm.cmd run test:php` | 54 aserciones aprobadas en PHP 7.4 y otras 54 en PHP 8.3 |
| `npm.cmd run test:wordpress` | 9 pruebas aprobadas, sin fallos (ejecución final: 22,9 segundos) |
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

La entrada automática al administrador espera el foco inicial que WordPress programa con un temporizador. La demo bloquea las solicitudes HTTP externas de WordPress para evitar comprobaciones de actualizaciones; esto no bloquea las consultas a Gemini realizadas por el backend de Node en modo real.

## Artefacto instalable

`training-asistente-ia.zip`, 9321 bytes. Incluye únicamente el archivo principal PHP, el desinstalador, `readme.txt` y el JavaScript compilado. No contiene `.env`, credenciales, el repositorio ni dependencias de desarrollo.

SHA-256 de la copia entregada en `outputs/`:

```text
6EC483C56909C2BC368EF4C1653B6302D25C8EDDEB740645EBDDC8606C71C315
```

## Límites de esta validación

- Las respuestas de Gemini están simuladas y se identifican como tales. No se validaron exactitud del modelo, cuotas reales, latencia ni catálogo comercial.
- El plugin se cargó y activó en WordPress local; no se instaló en el sitio de TRAINING ni se probó con sus plugins y tema.
- Los ensayos PHP 7.4 no acreditan una instalación completa de WordPress en esa versión de PHP.
- La prueba local se reinicia al cerrarla y solo escucha en `127.0.0.1`. No acredita despliegue público, concurrencia de producción ni configuración detrás de un proxy.

Para repetir la demo, usa `INICIAR-WORDPRESS.cmd`. La [guía de WordPress](wordpress.md) explica el acceso al administrador, las pruebas y cómo conectar Gemini real.
