# Training Corporation — Manual de marca digital (v0.2)

Los tokens viven en `app/assets/css/main.css` (`@theme static`): cada uno es una variable
CSS (`var(--color-azul)`) y una utilidad Tailwind (`bg-azul`). La página `/sistema`
(noindex) es el espécimen vivo; revísela después de cualquier cambio.

> La v0.1 («Bajo norma»: papel crema, serif Newsreader, etiquetas monoespaciadas) se
> descartó porque abandonaba los colores y la tipografía de la marca. Esta versión parte
> de la identidad real: logo, azul y familias tipográficas del sitio actual.

## Concepto: el anillo y el sello

La pieza memorable es el **sello de la Home** (`BrandSeal`): el anillo del logo
convertido en sello de certificación, con las normas reales que audita la empresa
escritas sobre el borde (ISO arriba, regulación colombiana abajo) y el titular dentro.
La abertura de la «C» mira hacia los hechos verificables. Es el único elemento audaz;
todo lo demás es más silencioso (títulos de sección en Montserrat 700, listas en tinta).

### El anillo en el resto del sitio

El logo de Training Corporation es un anillo abierto azul con una pequeña figura sobre
su borde. Ese anillo es el **único recurso gráfico protagonista** del sitio:

- `BrandRing`: fotografía real recortada en círculo, rodeada por un arco abierto
  (la «C» del logo, con la abertura a la derecha) y un punto en lo alto, como la figura
  del logo. Admite un satélite (otro anillo pequeño posado sobre el arco).
- El mismo gesto aparece en pequeño: marcadores de lista, separador entre nombres de
  clientes, flecha de «ir» en las líneas de servicio (el anillo se cierra al pasar el
  cursor), números de módulo de los diplomados.

Todo lo demás es sobrio: composición alineada a la izquierda, campos de color plenos,
filetes solo donde separan contenido.

## Color

Medidos en el logo (`#0072AF`, `#8F9392`) y en el CSS y las capturas del sitio actual
(`#1391DA` en los bloques azules; azul noche en el fondo de la portada).

| Token | HEX | Uso | Contraste |
|---|---|---|---|
| `azul` | `#0072AF` | Azul del logo. Campos de color, botones, enlaces, titulares. | 5,2:1 con blanco |
| `azul-hondo` | `#005A8C` | Hover; texto azul pequeño sobre `nube`. | 7,4:1 con blanco |
| `azul-vivo` | `#1391DA` | Azul de los bloques del sitio actual. Trazo del anillo; texto solo grande. | 3,4:1 (no para texto pequeño) |
| `cielo` | `#7FD0F5` | Acentos sobre `noche`. | 8,3:1 sobre noche |
| `noche` | `#0B2C47` | Pie de página, sección de presencia. Sustituye al casi negro. | — |
| `tinta` | `#102A3F` | Texto principal. | 14,7:1 con blanco |
| `pizarra` | `#4A5A67` | Texto secundario. | 7,1:1 con blanco |
| `gris-marca` | `#8F9392` | Gris del logo. Solo gráficos. | 3,1:1 (nunca texto) |
| `niebla` / `bruma` | `#A9C6DC` / `#93ABC0` | Texto secundario / terciario sobre `noche`. | 8:1 / 6:1 |
| `nube` | `#EEF4F8` | Fondo alterno. | — |
| `linea` | `#D5E2EB` | Filetes y bordes de campo. | — |
| `error` | `#B3261E` | Errores de formulario. | — |

Se retiran el cian `#00BCD4` y los grises de TheGem (`#3C3950`, `#99A9B5`…): son del
tema de WordPress, no de la marca. Sin degradados.

**Ritmo de campos**: blanco → azul → blanco → nube → noche → blanco → nube → azul → noche.
Los campos azules plenos son herencia directa del sitio actual (bloques «Somos Training»
y «Nuestros servicios»).

## Tipografía

Las dos familias que ya usa el sitio (confirmado en su CSS publicado):

- **Montserrat** (titulares, botones, navegación): 800 para títulos de sección, 700 para
  subtítulos, 600 para navegación. Siempre en minúsculas con tracking cerrado
  (`-0.03em`). Se abandona el uso actual en mayúsculas espaciadas, que es lo que hacía
  que el sitio pareciera una plantilla.
- **Source Sans 3** (texto): sucesora directa de Source Sans Pro.

Sin monoespaciada y sin etiquetas en mayúsculas sobre los títulos.

Escala fluida (`clamp`): `xs` 14 · `sm` 16 · `base` 18 · `lg` 19→22 · `xl` 22→28 ·
`2xl` 28→44 · `3xl` 36→64 · `display` 40→84 px. Clases: `.display`, `.heading`,
`.subheading`, `.lede`.

## Espaciado, grid y anchos

- Paso base 4 px. Ritmo de sección `--spacing-section` (64→144 px) y `--spacing-section-sm`.
- `.frame`: máximo 1440 px, márgenes 20→72 px.
- `.grid-page`: 4 / 8 / 12 columnas (móvil / ≥768 / ≥1024).
- Medida de lectura `--container-measure` 40 rem.
- Breakpoints de Tailwind. El menú completo aparece desde 1200 px y el teléfono en el
  encabezado desde 1440 px.

## Formas

- Círculos: exclusivos del anillo.
- `--radius-control` 6 px: botones, campos, opciones de formulario, desplegables.
- Campos de color y fotos dentro de ellos: esquinas rectas.
- Una sola sombra: la del menú desplegable.

## Acciones, enlaces y formularios

- `UiButton`: `primary` (azul pleno, la acción principal), `outline` (segunda acción),
  `light` (sobre campos azules o noche). Sin flecha decorativa; los iconos solo cuando
  dicen algo (teléfono, descarga).
- Enlace en texto: `.link`, siempre subrayado.
- `UiDocLink`: documento descargable, con icono según el tipo de archivo.
- `UiField`: etiqueta siempre visible, «(opcional)» explícito, ayuda y error unidos con
  `aria-describedby`. El formulario de contacto muestra un resumen de errores que
  recibe el foco.
- Foco: contorno de 3 px `azul-vivo` (blanco o `cielo` sobre campos oscuros).

## Imagen

Solo fotografía real de la empresa, publicada en su sitio: retratos del equipo, el curso
de auditores ISO 55001 (2020), la torre de transmisión (ISA), la sede de EBSA, el
edificio Colmena y el evento Progresa de CORNARE. Los pies de foto dicen qué es cada una.
Logos de clientes en su color original, sobre fichas blancas iguales.
Imágenes optimizadas con `@nuxt/image` (WebP, `srcset`). Los `sizes` llevan siempre
prefijo de breakpoint (`xs:90vw sm:90vw md:600px`); sin prefijo, `@nuxt/image`
calcula variantes de 1 px.

## Movimiento

GSAP + ScrollTrigger, con desplazamiento suave de Lenis. Duraciones `fast` 150 ms ·
`base` 280 ms · `slow` 700 ms.

- **Un único momento orquestado**: la carga del sello (el anillo se dibuja, las normas
  aparecen una a una como sellos, el titular se asienta).
- Con el scroll, solo uno: los departamentos atendidos se encienden en el mapa tipográfico.
- Interacción: el anillo de las líneas de servicio se cierra; los retratos giran levemente.
- `prefers-reduced-motion: reduce` desactiva Lenis y todas las animaciones. Los estados
  iniciales ocultos solo existen bajo `html.motion`, con una salvaguarda CSS que muestra
  el contenido a los 2,5 s si el JavaScript falla.

## Pendiente de la marca

- **Logo vectorial (SVG)**: solo existe un PNG de 164×93 px (las variantes `_2x`/`_3x`
  del sitio son el mismo archivo). La versión negativa es ese PNG a una sola tinta.
- Más fotografía propia: trabajo de campo, auditorías, formaciones recientes. La foto
  del curso es de 2020.
- **Webhook del formulario** (`NUXT_CONTACT_WEBHOOK`): sin él, el formulario avisa que
  no pudo enviar y ofrece teléfono y correo.
- Fechas de las próximas cohortes de los diplomados (las publicadas son de 2025).
- Validar con la empresa los textos nuevos de la Home y de las cabeceras.
