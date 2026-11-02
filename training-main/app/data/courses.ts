/**
 * Training programmes. Source: brochures linked from the home page and
 * /cursos-y-formaciones/ (2025 editions). Dates and prices belong to that
 * edition; the site shows them as the last published cohort, never as upcoming.
 */

export interface Course {
  slug: string
  name: string
  summary: string
  /** Credentials awarded. */
  awards: string[]
  hours: number
  sessions: number
  mode: string
  schedule: string
  lastCohort: string
  audience: string[]
  modules: { title: string, goal: string }[]
  /** Standard supplied to participants. */
  material: string
  brochure: string
  line?: string
}

const uploads = '/wp-content/uploads'

export const courses: Course[] = [
  {
    slug: 'diplomado-gestion-de-activos',
    name: 'Diplomado en gestión de activos',
    summary: 'Conocimientos, prácticas y herramientas metodológicas para implementar un sistema de gestión de activos en empresas intensivas en activos, con una segunda titulación opcional para auditar según ISO 55001.',
    awards: ['Diplomado en gestión de activos', 'Auditor líder ISO 55001:2024 (opcional)'],
    hours: 120,
    sessions: 30,
    mode: 'Virtual, en directo',
    schedule: 'Martes, miércoles y jueves de 6:00 p. m. a 10:00 p. m. y sábados de 8:00 a. m. a 12:00 m.',
    lastCohort: 'Cohorte 3, abril a mayo de 2025',
    audience: [
      'Gerentes, directores y coordinadores de gestión de activos',
      'Profesionales, tecnólogos y técnicos de áreas con uso intensivo de activos',
      'Coordinadores de sistemas de gestión, líderes de proceso y auditores',
    ],
    modules: [
      { title: 'Formulación del proyecto de implantación', goal: 'Planificar la implantación de un sistema de gestión de activos.' },
      { title: 'Fundamentos de ISO 55001', goal: 'Comprender los conceptos y requisitos generales de la norma.' },
      { title: 'Planeación estratégica', goal: 'Construir el plan estratégico de gestión de activos (PEGA–SAMP).' },
      { title: 'Planeación táctica y operativa', goal: 'Derivar los objetivos estratégicos en los niveles táctico y operativo.' },
      { title: 'Requisitos de la información', goal: 'Asegurar la disponibilidad y calidad de la información de activos.' },
      { title: 'Auditoría a sistemas de gestión de activos', goal: 'Auditar según ISO 19011 e ISO/IEC 17021 y entender la certificación de tercera parte.' },
    ],
    material: 'Norma ISO 55001:2024 original',
    brochure: `${uploads}/2025/03/Brochure_Diplomado_Gesti%C3%B3n_de_Activos_2025.pdf`,
    line: 'gestion-de-activos',
  },
  {
    slug: 'diplomado-sostenibilidad',
    name: 'Diplomado en sostenibilidad',
    summary: 'Herramientas para implementar estrategias de sostenibilidad en las organizaciones: gestión ambiental, responsabilidad social, gobernanza y medición de la huella de carbono, con competencia como auditor interno.',
    awards: ['Diplomado en sostenibilidad', 'Auditor interno en huella de carbono'],
    hours: 94,
    sessions: 24,
    mode: 'Virtual, en directo',
    schedule: 'Martes, miércoles y jueves de 6:00 p. m. a 10:00 p. m.',
    lastCohort: 'Cohorte 1, junio a julio de 2025',
    audience: [
      'Gerentes, directores y coordinadores de sostenibilidad',
      'Consultores, emprendedores y líderes de proyectos sostenibles',
      'Coordinadores de sistemas de gestión, líderes de proceso y auditores',
    ],
    modules: [
      { title: 'Fundamentos de sostenibilidad', goal: 'Entender sus principios, su historia y su impacto actual.' },
      { title: 'Gestión ambiental y riesgos', goal: 'Identificar y gestionar los riesgos ambientales.' },
      { title: 'Responsabilidad social y gobernanza', goal: 'Implementar prácticas éticas dentro de la organización.' },
      { title: 'Integración de la sostenibilidad', goal: 'Llevarla a la cultura organizacional y al modelo de negocio.' },
      { title: 'Huella de carbono: cuantificación de GEI', goal: 'Aplicar metodologías de cuantificación de emisiones.' },
      { title: 'Auditoría interna de huella de carbono', goal: 'Planificar y ejecutar auditorías según ISO 14064 y GTC 19011.' },
    ],
    material: 'Norma ISO 14064-1 original',
    brochure: `${uploads}/2025/05/Brochure-Diplomado-de-sostenibilidad-2025.pdf`,
    line: 'hseq',
  },
]
