/**
 * Services, organised the way the company works: three strategic business
 * units (UEN) — auditoría, consultoría, formación — across five lines.
 * Items come from the official portfolio PDFs linked on each
 * /portafolio-de-servicios/* page (March 2024 uploads), from /empresa/equipo/
 * (audit list) and from the news posts; each was assigned to the unit that
 * delivers it. Line slugs keep the current URLs.
 */

export type ModeId = 'auditoria' | 'consultoria' | 'formacion'

export interface Mode {
  id: ModeId
  name: string
  /** The unit's name inside the company (news post of 2022-06-18). */
  unit: string
  /** One plain sentence: what this unit does. */
  summary: string
}

export const modes: Mode[] = [
  {
    id: 'auditoria',
    name: 'Auditoría',
    unit: 'Evaluación organizacional',
    summary: 'Auditorías de primera y segunda parte y verificaciones regulatorias, con auditores líderes certificados.',
  },
  {
    id: 'consultoria',
    name: 'Consultoría',
    unit: 'Consultoría y nuevos negocios',
    summary: 'Diagnóstico, diseño, implementación y mantenimiento de sistemas de gestión con su equipo.',
  },
  {
    id: 'formacion',
    name: 'Formación',
    unit: 'Gestión del conocimiento',
    summary: 'Diplomados, cursos de fundamentos y formación y calificación de auditores internos.',
  },
]

export const findMode = (id: string) => modes.find((m) => m.id === id)

/** A block of services inside one unit and line, optionally by sub-area (Calidad, SST…). */
export interface OfferGroup {
  area?: string
  items: string[]
}

export interface ServiceLine {
  slug: string
  name: string
  /** Short name for tight spaces (navigation, chips). */
  short: string
  /** One sentence, from the PDF cover. */
  lede: string
  /** Who it is for / regulatory context, from the PDF. */
  context: string
  offers: Record<ModeId, OfferGroup[]>
  benefits: string[]
  /** Normative frameworks named in the PDF. */
  frameworks: string[]
  sourcePdf: string
  /** Search result title and description: the standards people search for. */
  seo: { title: string, description: string }
}

const pdf = (file: string) => `/wp-content/uploads/2024/03/${file}`

export const services: ServiceLine[] = [
  {
    slug: 'hseq',
    name: 'Sistemas de gestión HSEQ',
    short: 'HSEQ',
    lede: 'Calidad, ambiente y seguridad y salud en el trabajo, por separado o como sistema integrado.',
    context: 'Acompañamos a empresas públicas y privadas a implementar, integrar, auditar y mantener sus sistemas de gestión, incluido el Modelo Integrado de Planeación y Gestión (MIPG) para entidades públicas.',
    offers: {
      auditoria: [
        {
          area: 'Calidad',
          items: [
            'Auditoría interna a NTC-ISO 9001',
            'Auditoría interna al Modelo Integrado de Planeación y Gestión (MIPG), Decreto 1499 de 2017',
            'Auditoría de segunda parte a proveedores',
          ],
        },
        {
          area: 'Seguridad y salud en el trabajo',
          items: [
            'Auditoría interna a NTC-ISO 45001',
            'Auditoría interna al SG-SST según el Decreto 1072 de 2015 y la Resolución 0312 de 2019',
            'Auditoría de segunda parte al cumplimiento del SG-SST',
            'Auditoría al plan estratégico de seguridad vial (Resolución 40595 de 2022)',
          ],
        },
        {
          area: 'Sistema integrado',
          items: [
            'Auditoría interna integrada a NTC-ISO 9001, 14001 y 45001',
            'Auditoría de segunda parte al sistema integrado',
          ],
        },
      ],
      consultoria: [
        {
          area: 'Calidad',
          items: [
            'Diagnóstico e implementación de NTC-ISO 9001',
            'Plataforma estratégica, indicadores y revisión por la dirección',
            'Gestión de riesgos y oportunidades y estandarización de procesos',
            'Implementación del MIPG según el Decreto 1499 de 2017',
            'Investigación, diseño e innovación (I+D+i)',
            'Cumplimiento de RETIE y RETILAP',
          ],
        },
        {
          area: 'Seguridad y salud en el trabajo',
          items: [
            'Diseño, administración y ejecución del SG-SST (Decreto 1072 de 2015, Resolución 0312 de 2019)',
            'Lineamientos de SST para el sector eléctrico (Resolución 5018 de 2019)',
            'Plan estratégico de seguridad vial (Resolución 40595 de 2022)',
            'Plan de gestión del riesgo de desastres (Ley 1523 de 2012), simulacros y simulaciones',
            'Sistema Globalmente Armonizado (Resolución 773 de 2021)',
            'COPASST, comité de convivencia, brigadas y programas de vigilancia epidemiológica',
            'Investigación de incidentes, inspecciones de seguridad e higiene industrial',
            'Batería psicolaboral y fisioterapia en SST',
          ],
        },
        {
          area: 'Gestión ambiental',
          items: [
            'Implementación de NTC-ISO 14001',
            'Gases de efecto invernadero según NTC-ISO 14064',
            'Aspectos e impactos ambientales y requisitos legales',
            'Gestión integral de residuos y aforo de residuos sólidos',
            'Evaluación ambiental de proyectos constructivos y revisiones socioambientales',
          ],
        },
        {
          area: 'Sistema integrado',
          items: [
            'Elaboración, implementación y mantenimiento del sistema de gestión integrado',
            'Riesgos, peligros, indicadores y revisión por la dirección del sistema integrado',
          ],
        },
      ],
      formacion: [
        {
          area: 'Calidad',
          items: [
            'Fundamentos de NTC-ISO 9001',
            'Formación y calificación de auditores internos ISO 9001 con la guía GTC-ISO 19011',
            'Formación en el Modelo Integrado de Planeación y Gestión (MIPG)',
          ],
        },
        {
          area: 'Seguridad y salud en el trabajo',
          items: [
            'Fundamentos de NTC-ISO 45001',
            'Formación y calificación de auditores internos ISO 45001',
            'Seguridad basada en el comportamiento y planes de emergencia',
            'Liderazgo transformador, trabajo en equipo, comunicación asertiva y resolución de conflictos',
          ],
        },
        {
          area: 'Gestión ambiental',
          items: [
            'Fundamentos de NTC-ISO 14001',
            'Formación y calificación de auditores internos ISO 14001',
            'Diplomado en sostenibilidad con auditor interno en huella de carbono',
          ],
        },
        {
          area: 'Sistema integrado',
          items: ['Formación y calificación de auditores internos integrales HSEQ'],
        },
      ],
    },
    benefits: [
      'Cumplir las normas y regulaciones de calidad, ambiente y seguridad y salud en el trabajo.',
      'Identificar peligros, riesgos y amenazas de forma sistemática.',
      'Tomar decisiones orientadas a la mejora de los procesos.',
      'Demostrar a los grupos de interés el compromiso con la calidad, la seguridad de las personas y el medio ambiente.',
    ],
    frameworks: ['NTC-ISO 9001', 'NTC-ISO 14001', 'NTC-ISO 45001', 'NTC-ISO 14064', 'Decreto 1072 de 2015', 'Resolución 0312 de 2019', 'Decreto 1499 de 2017', 'GTC-ISO 19011'],
    sourcePdf: pdf('PORTAFOLIO-HSEQ-CALIDAD-AMBIENTAL-SEGSST-1.pdf'),
    seo: {
      title: 'Sistemas de gestión HSEQ: ISO 9001, 14001 y 45001',
      description: 'Auditoría interna, consultoría y formación en ISO 9001, 14001 y 45001, Decreto 1072 y MIPG, para empresas y entidades públicas de toda Colombia.',
    },
  },
  {
    slug: 'gestion-de-activos',
    name: 'Gestión de activos',
    short: 'Gestión de activos',
    lede: 'Sistemas de gestión de activos bajo ISO 55001 para el sector eléctrico y el alumbrado público.',
    context: 'Los operadores de red deben cumplir la Resolución CREG 015 de 2018, y los municipios de categoría especial, primera y segunda deben certificar un sistema de gestión de activos de alumbrado público según la Resolución 101 013 de 2022. Acompañamos ambos procesos con la norma ISO 55001.',
    offers: {
      auditoria: [
        {
          items: [
            'Auditoría interna al sistema de gestión de activos bajo NTC-ISO 55001',
          ],
        },
      ],
      consultoria: [
        {
          area: 'Diagnóstico',
          items: [
            'Grado de madurez con la metodología de autoevaluación SAM del IAM',
            'Brecha por numeral de NTC-ISO 55001, con su madurez de 0 a 100 %',
            'Plan de trabajo de implementación con el valor de las inversiones para la certificación',
          ],
        },
        {
          area: 'Implementación',
          items: [
            'Alineación del alcance del sistema con los activos del plan de inversión (CREG 015, art. 6.1)',
            'Plan estratégico de gestión de activos (PEGA) y su derivación en planes tácticos y operativos',
            'Alineación de funciones financieras y no financieras según ISO 55010',
            'Decisiones basadas en costo, riesgo y desempeño y plan de mantenimiento optimizado',
            'Criticidad (NORSOK Z-008), índice de salud (ISO 17359) y análisis de causa raíz (IEC 62740)',
            'Taxonomía de activos (ISO 14224), confiabilidad, manejo del cambio y casos de negocio',
          ],
        },
      ],
      formacion: [
        {
          items: [
            'Diplomado en gestión de activos con certificación opcional de auditor líder ISO 55001',
            'Fundamentos de NTC-ISO 55001',
            'Formación y calificación de auditores internos y líderes en gestión de activos',
            'Taller para la alta dirección',
          ],
        },
      ],
    },
    benefits: [
      'Cumplir los artículos 6.1 y 6.3.3.4 de la Resolución CREG 015 de 2018.',
      'Alinear el alcance del sistema con los activos del plan de inversión.',
      'Contar con un plan de trabajo a cuatro o cinco años para la certificación.',
    ],
    frameworks: ['NTC-ISO 55001', 'ISO 55010', 'Resolución CREG 015 de 2018', 'Resolución 101 013 de 2022', 'Metodología SAM del IAM'],
    sourcePdf: pdf('Portafolio-de-GA-1.pdf'),
    seo: {
      title: 'Gestión de activos ISO 55001',
      description: 'Auditoría, consultoría y formación en gestión de activos ISO 55001 para el sector eléctrico y el alumbrado público: CREG 015 de 2018 y Resolución 101 013.',
    },
  },
  {
    slug: 'servicios-regulatorios',
    name: 'Servicios regulatorios',
    short: 'Regulatorios',
    lede: 'Verificaciones regulatorias del sector eléctrico colombiano y formación en calidad del servicio.',
    context: 'Realizamos las verificaciones que exigen la CREG, el Consejo Nacional de Operación y XM a los agentes del sector eléctrico, y formamos a sus equipos en la regulación de calidad del servicio.',
    offers: {
      auditoria: [
        {
          area: 'Verificaciones regulatorias',
          items: [
            'Calidad del servicio en sistemas de distribución local (Resolución CREG 101 032 de 2022)',
            'Planes de inversión de los operadores de red (Resolución CREG 101 022 de 2022)',
            'Esquema de incentivos y compensaciones (CREG 015 de 2018, numeral 5.2.10)',
            'Auditorías regulatorias según las resoluciones CREG 025 de 2013 y 097 de 2008',
            'Guía de ciberseguridad del C.N.O. (Acuerdo 1502 de 2021)',
            'Proyectos aprobados por la UPME',
          ],
        },
        {
          area: 'Auditorías de segunda parte',
          items: [
            'Proyectos ejecutados por contratistas y cumplimiento contractual',
            'Requisitos ambientales y de seguridad y salud en el trabajo de contratistas',
            'Cumplimiento del manual HSEQ para contratistas',
          ],
        },
      ],
      consultoria: [
        {
          items: [
            'Reglamento técnico de instalaciones eléctricas (RETIE)',
            'Reglamento técnico de alumbrado público (RETILAP)',
            'Remuneración de la distribución de energía según CREG 015 de 2018',
            'Lineamientos de SST en el sector eléctrico (Resolución 5018 de 2019)',
            'Autogeneración a pequeña escala y generación distribuida',
          ],
        },
      ],
      formacion: [
        {
          items: [
            'Calidad del sistema de transmisión regional y de distribución local',
            'Clasificación y exclusión de eventos, calidad media e indicadores individuales',
            'Remuneración de la distribución según CREG 015 de 2018 y Circular 036 de 2023',
            'Autogeneración a pequeña escala, alumbrado público y contratos de calidad extra',
            'Diplomado en interventoría de obras eléctricas',
          ],
        },
      ],
    },
    benefits: [
      'Garantizar el cumplimiento de los requisitos legales aplicables.',
      'Mantener las condiciones técnicas mínimas para la prestación del servicio.',
      'Adaptar el negocio a los cambios regulatorios.',
    ],
    frameworks: ['Resolución CREG 101 032 de 2022', 'Resolución CREG 101 022 de 2022', 'Resolución CREG 015 de 2018', 'Acuerdo C.N.O. 1502 de 2021', 'RETIE', 'RETILAP'],
    sourcePdf: pdf('Portafolio-de-servicios-regulatorios-1.pdf'),
    seo: {
      title: 'Servicios regulatorios del sector eléctrico (CREG)',
      description: 'Verificaciones regulatorias para operadores de red: calidad del servicio (CREG 101 032), planes de inversión (CREG 101 022), CREG 015, RETIE y RETILAP.',
    },
  },
  {
    slug: 'seguridad-de-la-informacion-y-ciberseguridad',
    name: 'Seguridad de la información y ciberseguridad',
    short: 'Seguridad de la información',
    lede: 'Seguridad de la información, privacidad y ciberseguridad bajo ISO/IEC 27001.',
    context: 'Trabajamos con organizaciones que implementan o migran a ISO/IEC 27001:2022, entidades de certificación digital que buscan acreditación y agentes del sector eléctrico obligados por la guía de ciberseguridad del C.N.O.',
    offers: {
      auditoria: [
        {
          items: [
            'Auditoría a NTC-ISO/IEC 27001 con la guía GTC-ISO 19011',
            'Auditoría a la guía de ciberseguridad del C.N.O. (Acuerdo 1502 de 2021)',
            'Auditoría a los criterios CEA-3.0-07 para entidades de certificación digital',
            'Auditoría a NTC-ISO 27701 (privacidad), NTC-ISO/IEC 27005 (riesgos) y NTC-ISO/IEC 27002 (controles)',
          ],
        },
      ],
      consultoria: [
        {
          items: [
            'Diagnóstico e implementación de ISO/IEC 27001:2022',
            'Migración de ISO/IEC 27001:2013 a la versión 2022',
            'Diagnóstico para la acreditación digital bajo CEA-3.0-07',
            'Sistema de gestión de privacidad de la información según la Ley 1581 de 2012',
            'Planes de acción, mantenimiento, mejora y revisión por la dirección',
          ],
        },
      ],
      formacion: [
        {
          items: [
            'Cambios y fundamentos de ISO/IEC 27001:2022',
            'Formación y calificación de auditores internos ISO/IEC 27001',
            'Controles según ISO/IEC 27002 y gestión de riesgos según ISO 27005',
            'Marco de ciberseguridad según GTC-ISO/IEC-TS 27110',
            'Protección de datos personales y responsabilidad demostrada (Ley 1581 de 2012)',
          ],
        },
      ],
    },
    benefits: [
      'Proteger y controlar la información de la organización.',
      'Identificar riesgos y amenazas para definir controles, protocolos y políticas.',
      'Demostrar a los grupos de interés el compromiso con la ciberseguridad.',
    ],
    frameworks: ['NTC-ISO/IEC 27001:2022', 'NTC-ISO/IEC 27002', 'NTC-ISO 27701', 'NTC-ISO/IEC 27005', 'CEA-3.0-07', 'Ley 1581 de 2012'],
    sourcePdf: pdf('Portafolio-del-servicio-de-seguridad-de-la-informacion-1.pdf'),
    seo: {
      title: 'Seguridad de la información ISO/IEC 27001',
      description: 'Auditoría, consultoría y formación en seguridad de la información y ciberseguridad: ISO/IEC 27001:2022, guía del C.N.O. y protección de datos (Ley 1581).',
    },
  },
  {
    slug: 'laboratorios',
    name: 'Laboratorios',
    short: 'Laboratorios',
    lede: 'Laboratorios de ensayo y calibración y organismos de inspección bajo ISO/IEC 17025 y 17020.',
    context: 'Auditamos con alcance técnico en química de aceites, materiales y aguas, fisicoquímica, microbiología, civil, metrología, medidores de agua, gas y energía, eléctrica, mecánica y transformadores de medida.',
    offers: {
      auditoria: [
        {
          items: [
            'Auditoría de primera parte a NTC-ISO/IEC 17025 (laboratorios de ensayo y calibración)',
            'Auditoría de primera parte a NTC-ISO/IEC 17020 (organismos de inspección)',
            'Medición de energía: calibración y ensayo en laboratorio y en sitio',
          ],
        },
      ],
      consultoria: [
        {
          items: [
            'Diagnóstico del sistema de gestión del laboratorio',
            'Diseño e implementación del sistema según NTC-ISO/IEC 17025',
            'Planes de acción para cumplir ISO/IEC 17020 e ISO/IEC 17025',
            'Mantenimiento, mejora y revisión por la alta dirección',
          ],
        },
      ],
      formacion: [
        {
          items: [
            'Formación y calificación de auditores internos ISO/IEC 17025',
            'Incertidumbre, trazabilidad, verificación y validación de métodos',
            'Ensayos de aptitud y aseguramiento de la calidad de los resultados',
            'Metrología y análisis de la LFMN y su reglamento',
            'Redacción de informes técnicos e interpretación de resultados',
          ],
        },
      ],
    },
    benefits: [
      'Resultados más precisos, confiables y sistemáticos.',
      'Acceso a mercados que exigen informes y certificados reconocidos internacionalmente.',
      'Integración entre ISO 9001 e ISO/IEC 17025.',
    ],
    frameworks: ['NTC-ISO/IEC 17025', 'NTC-ISO/IEC 17020', 'GTC-ISO 19011'],
    sourcePdf: pdf('Portafolio-del-servicio-de-laboratorio-1.pdf'),
    seo: {
      title: 'Laboratorios ISO/IEC 17025 y organismos ISO/IEC 17020',
      description: 'Auditoría, consultoría y formación para laboratorios de ensayo y calibración (ISO/IEC 17025) y organismos de inspección (ISO/IEC 17020).',
    },
  },
]

export const findService = (slug: string) => services.find((s) => s.slug === slug)

/** Number of services a line offers in one unit. */
export const countOffers = (line: ServiceLine, mode: ModeId) =>
  line.offers[mode].reduce((n, g) => n + g.items.length, 0)

export const servicePath = (mode: ModeId, line?: string) => (line ? `/servicios/${mode}/${line}` : `/servicios/${mode}`)

/** "1 servicio", "9 servicios". */
export const servicesLabel = (n: number) => `${n} ${n === 1 ? 'servicio' : 'servicios'}`
