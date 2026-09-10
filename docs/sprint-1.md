# Sprint 1: alcance, catálogo y validación

Actualización: 2026-09-10. Rama de implementación: `sprint-1-mvp`.

## Alcance y estado de las HU

El alcance documentado del instructivo es el MVP web de HU1, HU2, HU3, HU4 y HU10: **18 puntos**. Las cinco historias están **En validación**: hay implementación y evidencias parciales, pero aún debe acreditarse la aceptación completa por el PO. Se mantienen los criterios originales, incluidos datos oficiales y respuesta de HU1 en ≤5 segundos.

| HU | Puntos | Estado | Validación pendiente para cerrar |
| --- | --- | --- | --- |
| HU1: precios | 5 | En validación | Validar precio y moneda con el PO, probar curso inexistente y oferta de asesor, medir respuestas reales en ≤5 segundos |
| HU2: fechas | 3 | En validación | Confirmar próximas cohortes, excluir fechas pasadas y, si hay varias disponibles, listarlas y preguntar cuál interesa |
| HU3: requisitos | 3 | En validación | Validar requisitos oficiales, respetar «Ninguno» y ofrecer asesor ante información ausente o evaluación individual de ingreso |
| HU4: modalidades | 2 | En validación | Confirmar modalidades por curso, incluida híbrida cuando figure en el catálogo; no deducir relaciones entre fecha y modalidad |
| HU10: chat web | 5 | En validación | Integrar en el ambiente de pruebas del sitio de TRAINING y registrar envío/recepción con Gemini real sin recargar, apertura, cierre y errores |
| **Total Sprint 1** | **18** | **En validación** | Aceptación final del PO pendiente |

HU5 (8), HU6 (2), HU7 (5), HU8 (3), HU9 (8) y HU11 (8) quedan en el backlog para próximos sprints: **34 puntos**. Se conservan sus requisitos y estimaciones; el total de las once HU es 52 puntos, no la capacidad comprometida de este sprint. WhatsApp, horarios y certificados de estudiantes, cola de atención fuera de horario y continuidad entre canales no forman parte de esta entrega. SharePoint automático y OCR también quedan para después.

El asistente puede ofrecer consultar con un asesor; no transfiere conversaciones ni registra solicitudes. Las pruebas simuladas y la demo local no sustituyen los criterios de aceptación.

## Implementación y convenciones

- Node.js 22.13 o posterior y Express; Gemini se consulta por su API REST únicamente desde el backend.
- El backend carga `backend/data/catalogo_cursos.json` al iniciar; el widget envía consultas y muestra respuestas. La clave permanece en el servidor y `.env` está ignorado por Git.
- JavaScript usa `camelCase` para variables y funciones. Los campos JSON conservan `snake_case` del instructivo para facilitar la transcripción; los archivos nuevos usan `kebab-case`, salvo nombres convencionales y `catalogo_cursos.json` definido por el instructivo.
- `npm.cmd test` ejecuta pruebas con Gemini simulado. `npm.cmd run lint` ejecuta ESLint. El README contiene instalación y arranque.
- La espera máxima del proveedor es 15 segundos; no modifica la exigencia de respuesta en ≤5 segundos de HU1.

## Catálogo de prueba: 14 cursos

El catálogo vigente contiene **14 cursos simulados**. Los dos primeros proceden del ejemplo del instructivo y los doce adicionales se incorporaron en el commit `e97fb4a` de la rama. No consta una fuente oficial o una extracción de SharePoint que valide estos datos. Deben contrastarse con el PO antes de presentarse como oferta comercial; precios y fechas requieren doble revisión.

La tabla siguiente reproduce el JSON de esa versión; no es una segunda fuente de datos para la aplicación. Si cambia el JSON, actualizar esta tabla y los casos de prueba asociados.

| Campo | Tipo | Uso |
| --- | --- | --- |
| `id` | texto único | Identificador del curso |
| `nombre` | texto | Nombre del curso |
| `precio` | número | Valor en la moneda indicada |
| `moneda` | texto | Código de moneda, por ejemplo COP |
| `fechas_inicio` | lista de textos AAAA-MM-DD | Cohortes registradas; filtrar por fecha de consulta |
| `modalidades` | lista de textos | Modalidades disponibles según el catálogo |
| `requisitos` | lista de textos | Requisitos de ingreso expresamente registrados |
| `duracion_semanas` | número | Duración informativa |

| ID | Curso | Precio | Inicios | Modalidades | Requisitos | Semanas |
| --- | --- | --- | --- | --- | --- | --- |
| curso-001 | Excel Avanzado | 450000 COP | 2026-10-05; 2026-11-10 | virtual; presencial | Bachiller; Manejo básico de PC | 6 |
| curso-002 | Python para Análisis de Datos | 620000 COP | 2026-10-20 | virtual | Ninguno | 8 |
| curso-003 | Power BI para Inteligencia de Negocios | 580000 COP | 2026-10-13; 2026-11-24 | virtual; presencial | Manejo básico de Excel | 6 |
| curso-004 | SQL y Bases de Datos | 540000 COP | 2026-10-27; 2026-12-01 | virtual | Nociones básicas de informática | 7 |
| curso-005 | Inteligencia Artificial Generativa para Empresas | 680000 COP | 2026-10-15; 2026-11-19 | virtual; híbrida | Ninguno | 5 |
| curso-006 | Desarrollo Web Frontend | 750000 COP | 2026-10-06; 2026-12-03 | presencial; virtual | Manejo básico de computador; Disponibilidad para practicar | 10 |
| curso-007 | Ciberseguridad para Usuarios y Empresas | 630000 COP | 2026-10-22; 2026-12-10 | virtual | Ninguno | 6 |
| curso-008 | Gestión de Proyectos con Metodologías Ágiles | 520000 COP | 2026-10-08; 2026-11-26 | virtual; híbrida | Ninguno | 5 |
| curso-009 | Marketing Digital y Redes Sociales | 490000 COP | 2026-10-29; 2026-12-08 | virtual | Ninguno | 6 |
| curso-010 | Diseño UX/UI para Productos Digitales | 720000 COP | 2026-11-03; 2026-12-15 | presencial; virtual | Manejo básico de computador | 8 |
| curso-011 | Computación en la Nube | 700000 COP | 2026-11-05 | virtual | Nociones básicas de redes; Manejo básico de computador | 8 |
| curso-012 | Liderazgo y Comunicación Efectiva | 420000 COP | 2026-10-17; 2026-11-28 | presencial; virtual | Ninguno | 4 |
| curso-013 | Finanzas Básicas para Emprendedores | 460000 COP | 2026-10-24; 2026-12-12 | virtual; presencial | Ninguno | 5 |
| curso-014 | Automatización de Procesos con Herramientas No Code | 570000 COP | 2026-11-12 | virtual | Manejo básico de herramientas digitales | 6 |

Una lista de fechas no establece correspondencia entre cohorte y modalidad. El catálogo no contiene notas mínimas de aprobación ni reglas de evaluación individual; el asistente no debe deducirlas.

## Casos funcionales y evidencias

La [matriz de validación del catálogo](casos-prueba-catalogo.md) define **56 casos básicos: 14 cursos × 4 HU**, más escenarios de información ausente, evaluación individual, errores, seguridad y chat. Cada prueba parte del JSON vigente y registra su resultado real, sin dar por aprobado un caso solo porque esté diseñado.

La wiki ya incluye capturas del equipo para casos de HU1 y HU2 en [Casos de uso del Sprint 1](https://github.com/rodri0325/Asistente-IA_Training_corporation-/wiki/Casos-de-uso-Sprint-1). Se conservan como evidencia parcial: faltan completar la revisión de criterios, procedencia de datos y medición de latencia. Esta actualización no acredita que una clave esté ausente o presente en otro entorno, ni certifica resultados de capturas no reevaluadas.

Por ejecución registrar: ID del caso, fecha y zona horaria, responsable, commit y versión del catálogo, modelo, entorno/URL, pregunta, respuesta, duración en milisegundos, captura o registro y resultado aprobado/fallido. La aceptación del PO se registra por separado.

Las pruebas de fechas usan el día de ejecución en America/Bogota. Solo se esperan fechas iguales o posteriores a ese día; si hay varias, listar todas y preguntar cuál interesa; si no queda ninguna, informar que no hay próximas fechas confirmadas. No enviar datos personales de estudiantes.

## Pendientes para el cierre por el equipo

- [ ] Validar los 14 cursos o reemplazarlos con fuentes oficiales y registrar la aprobación del PO.
- [ ] Completar pruebas con Gemini real de HU1–HU4 y HU10, enlazar evidencias y medir el criterio de ≤5 segundos.
- [ ] Integrar y probar el widget en el ambiente de pruebas de TRAINING.
- [ ] Registrar responsables y aceptación final de las cinco HU en el backlog del equipo.
- [ ] Completar evidencias auténticas de ceremonias y decisiones.
- [ ] Revisar y completar el Caso de Negocio ya iniciado en la wiki y preparar la sustentación.

La [planificación detallada de la wiki](https://github.com/rodri0325/Asistente-IA_Training_corporation-/wiki/Sprint-1-Planning-Detallado) mantiene el alcance de 18 puntos. La documentación no acredita cierre del sprint ni aprobación del PO.

## Verificación técnica histórica — 2026-09-07

Sobre el commit `a48353e`, Node.js 24.11.1 completó 23 pruebas simuladas con 23 aprobadas y 0 fallidas; ESLint terminó sin errores. La consulta de auditoría de dependencias de ejecución de ese día no reportó vulnerabilidades.

En navegador local se comprobaron apertura desde un ejemplo, cierre con Escape y retorno de foco, envío por Enter y botón, respuesta simulada, aviso de falta de clave y restauración de la consulta tras error. Se inspeccionó el widget a 390 × 844 píxeles y el chat independiente. El HTML de usuario y proveedor simulado se mostró como texto, sin crear elementos dentro de los mensajes.

Esos resultados corresponden a esa versión; no acreditan exactitud o latencia de Gemini real ni despliegue en TRAINING.

## Verificación de la versión actual — 2026-09-10

Sobre el código de `e97fb4a` se ejecutaron `npm.cmd test` y `npm.cmd run lint`: **25 pruebas aprobadas, 0 fallidas y ESLint sin errores**. Gemini estuvo simulado en estas pruebas. Los 56 casos manuales del catálogo están diseñados; su matriz no acredita ejecución ni aprobación del PO.
