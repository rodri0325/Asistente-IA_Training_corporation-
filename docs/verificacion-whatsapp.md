# Verificación local de la integración de WhatsApp

Fecha: 13 de octubre de 2026 (America/Bogota).

Base: `sprint-1-mvp`, commit `28a613c9c35f7eed6989c79753f233485a84c662`.
Cambios preparados inicialmente en la rama local `codex/whatsapp-meta` e incorporados a `sprint-2-mvp` junto con la integración de WordPress. Este informe registra la validación de WhatsApp previa a esa integración.

## Resultado ejecutado

- Node.js: 24.11.1.
- `npm.cmd ci`: dependencias instaladas desde el lockfile existente, sin modificarlo.
- `node --test --test-reporter=tap` (la misma suite que `npm.cmd test`): **47 pruebas aprobadas, 0 fallidas, 0 omitidas**.
- Regresión del chat existente: **25 pruebas**.
- Integración de WhatsApp: **22 pruebas**, incluidos subcasos.
- `npm.cmd run lint`: sin errores.
- `git diff --check`: sin errores de espacios; Git avisa de normalización LF/CRLF en Windows.

Los proveedores se simulan dentro de las pruebas. Se ejecutan peticiones HTTP reales contra un servidor local efímero; las respuestas de Gemini y Meta son dobles de prueba.

## Cobertura comprobada

- Verificación GET, token inválido y configuración ausente.
- Firma HMAC sobre bytes originales; firma inválida, JSON inválido, tipo y tamaño del cuerpo.
- Entrada de texto → servicio compartido Gemini → petición de respuesta a Meta.
- Acuse temprano del webhook, recorrido de lotes, orden por remitente y progreso entre remitentes independientes.
- Deduplicación durante y después del procesamiento; no reenvío después de un fallo de envío.
- Estados y números ajenos ignorados; los estados fallidos registran solo códigos numéricos sin datos sensibles.
- Audio, texto vacío y texto demasiado largo reciben orientación sin consultar IA.
- Errores y timeout de proveedores contenidos; la cola sigue procesando mensajes nuevos.
- Respuesta larga limitada a 4096 unidades UTF-16 sin cortar pares de emojis.
- Lote por encima de la capacidad rechazado completo sin consumir mensajes; reintento posterior aceptado.

## Pendiente real

No se han creado activos de Meta, conectado credenciales, publicado un túnel ni enviado mensajes a teléfonos desde esta entrega. La demo de extremo a extremo y sus capturas están **PENDIENTES**. Tampoco se certifican precisión o latencia del modelo real, disponibilidad de la versión/modelo en la cuenta, ni aceptación del PO.

Consulta [la guía desde cero](whatsapp-meta.md) y registra la evidencia real en la wiki del equipo. El catálogo continúa siendo ficticio y las consultas no conservan historial.
