/**
 * Corporate facts. Every value here was verified on trainingcorporation.com.co,
 * its WordPress API, or the PDFs published there (checked 2026-10-14).
 * Do not add figures, clients or claims that are not on record.
 */

// Documents are served from this site at the paths they had on the old WordPress
// site (public/docs, public/wp-content), so existing links to them keep working.
const site = ''

export const company = {
  legalName: 'Training Corporation S.A.S.',
  shortName: 'Training Corporation',
  tagline: 'Asesoría, diseño de eventos de formación y evaluación organizacional',
  // Source: home page, "Somos Training".
  summary:
    'Contribuimos al desarrollo de habilidades humanas con profesionales de alto desempeño. Diseñamos servicios de formación, consultoría y evaluación organizacional para organizaciones que buscan mejorar su competitividad.',
  // Source: /portafolio-de-servicios/ intro.
  method:
    'Investigamos y diseñamos métodos para la prestación de servicios de formación, consultoría y evaluación organizacional que faciliten la competitividad de las organizaciones mediante el desarrollo de las habilidades de su personal.',
  address: {
    street: 'Carrera 43A n.º 1A Sur-29',
    building: 'Edificio Colmena',
    office: 'Oficina 315',
    area: 'Avenida El Poblado',
    city: 'Medellín',
    region: 'Antioquia',
    country: 'Colombia',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Edificio+Colmena+Carrera+43A+1A+Sur+29+Medell%C3%ADn',
  },
  phones: [
    { label: 'Fijo', display: '(604) 574 25 90', href: 'tel:+576045742590' },
    { label: 'Móvil', display: '321 707 9467', href: 'tel:+573217079467' },
  ],
  whatsapp: { display: '321 707 9467', href: 'https://wa.me/573217079467' },
  email: 'gerencia@trainingcorporation.com.co',
  social: {
    facebook: 'https://www.facebook.com/Trainingcorporationsas/',
    linkedin: 'https://www.linkedin.com/in/training-corporation-s-a-s-04731626a',
  },
  intranet: 'https://trainingcorpltda.sharepoint.com/sites/InnTraining2',
} as const

/** Source: /empresa/sistema-de-gestion-integrado/ and news posts of 2022-06-18. */
export const certifications = [
  // Issuer, numbers and dates as printed on each certificate (PDFs/JPG linked below).
  { code: 'ISO 9001:2015', name: 'Sistema de gestión de la calidad', issuer: 'Bureau Veritas Certification', number: 'Certificado CO24.05728', since: 'Certificados desde marzo de 2021', until: 'Vigente hasta el 10 de marzo de 2027', document: `${site}/docs/TC-9001-NUEVO.pdf` },
  { code: 'ISO 45001:2018', name: 'Sistema de gestión de la seguridad y salud en el trabajo', issuer: 'Bureau Veritas Certification', number: 'Certificado CO24.05730', since: 'Certificados desde marzo de 2021', until: 'Vigente hasta el 10 de marzo de 2027', document: `${site}/docs/TC-45001-NUEVO.pdf` },
  { code: 'IAM', name: 'Miembro corporativo de The Institute of Asset Management', issuer: 'The Institute of Asset Management', number: 'Miembro n.º 4000083', since: 'Miembros desde agosto de 2024', until: null, document: `${site}/wp-content/uploads/2024/12/Certificado-IAM-2024_page-0001.jpg` },
] as const

/** Source: /empresa/ "Presencia nacional e internacional". */
export const presence = {
  departments: [
    'Arauca', 'Antioquia', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
    'Casanare', 'Cesar', 'Cundinamarca', 'Córdoba', 'Huila', 'Meta', 'Nariño',
    'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'Santander',
    'Tolima', 'Valle del Cauca',
  ],
  countries: ['Costa Rica', 'El Salvador'],
  map: `${site}/wp-content/uploads/2023/12/4.-mapa_tc.pdf`,
} as const

/** The 32 departments of Colombia plus Bogotá D.C. (public fact), for the presence map. */
export const allDepartments = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
  'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño',
  'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia',
  'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
] as const

/** Source: /empresa/ "Propósito empresarial". */
export const purpose = {
  text: 'Como empresa que fortalece el crecimiento de las organizaciones mediante la transferencia de conocimientos en servicios de evaluación, formación, consultoría y asesoría, proyectamos para 2030 alcanzar la Mega en ventas y consolidar nuestra presencia nacional e internacional a partir de la mejora de la calidad de vida de los grupos de interés.',
  guidelines: [
    'Generar confianza y fortalecer las relaciones en el tiempo.',
    'Cumplir la normatividad requerida para los modelos de gestión certificados.',
    'Aportar a la sostenibilidad a partir de nuestra neutralidad en carbono.',
    'Gestionar los riesgos para generar controles que aseguren el mejoramiento continuo.',
    'Promover los mecanismos de participación y consulta.',
    'Promover la seguridad y la salud mediante la identificación y eliminación de peligros.',
    'Respetar los derechos de los titulares de los datos personales.',
    'Respetar el derecho a la desconexión laboral.',
  ],
} as const

/** Source: /empresa/ "Valores". */
export const values = [
  { name: 'Respeto', text: 'Reconocemos las diferencias entre los seres para actuar en la conservación de su armonía.' },
  { name: 'Responsabilidad', text: 'Somos fieles a los propósitos y compromisos adquiridos con los grupos de interés mediante el autocontrol, la autorregulación y la autogestión.' },
  { name: 'Unidad', text: 'Unimos nuestros esfuerzos para lograr una visión compartida.' },
  { name: 'Honestidad', text: 'Somos coherentes en los pensamientos, las palabras y las acciones que emprendemos.' },
] as const

/** Source: /empresa/ "Principios". */
export const principles = [
  { name: 'Inclusividad', text: 'Reconocemos a nuestros grupos de interés como la principal fuente de factores clave de éxito, y desarrollamos espacios para su participación en soluciones de mutuo beneficio.' },
  { name: 'Relevancia', text: 'Valoramos a los grupos de interés por medio del aprendizaje permanente de nuestros profesionales, para innovar y gestionar conocimiento que mejore su calidad de vida.' },
  { name: 'Capacidad de respuesta', text: 'Establecemos acuerdos de niveles de servicio (ANS) con los grupos de interés para mantener relaciones de confianza y crecimiento.' },
  { name: 'Sostenibilidad', text: 'Equilibrio empresarial en la gestión de seguridad y salud en el trabajo, grupos de interés y rentabilidad.' },
] as const

/** Source: footer "Convenios" image on every page. */
export const agreements = ['Universidad de Medellín', 'Cámara de Comercio de Bogotá'] as const

export interface Person {
  slug: string
  name: string
  role: string
  photo: string
  /** First-person statement from /empresa/equipo/, shortened to its first paragraph. */
  statement: string
  credentials?: string[]
}

/** Source: /empresa/equipo/ (portraits from the same page). */
export const team: Person[] = [
  {
    slug: 'nancy-rodriguez',
    name: 'Nancy Liliana Rodríguez Vásquez',
    role: 'Gerente',
    photo: '/images/equipo/nancy-rodriguez.jpg',
    statement: 'Los métodos de auditoría que implementamos son reconocidos a nivel nacional por incluir mejores prácticas que se derivan de la calificación de nuestros auditores como auditores líderes con certificación internacional, su experticia alcanzada en centenares de auditorías y el conocimiento de diversos sectores económicos.',
  },
  {
    slug: 'john-fredy-moreno',
    name: 'John Fredy Moreno',
    role: 'Asesor experto',
    photo: '/images/equipo/john-fredy-moreno.jpg',
    statement: 'Somos conscientes de la gran responsabilidad que asumimos cuando las organizaciones nos confían sus retos y compromisos de formación, consultoría, asesoría y evaluación organizacional, algunos de carácter legal ante entidades gubernamentales de vigilancia y control.',
    credentials: ['Ingeniero industrial', 'Especialista en alta gerencia', 'Auditor líder ISO 9001, 14001, 45001 y 55001', 'Auditor del Consejo Nacional de Operación'],
  },
  {
    slug: 'elsy-quintero',
    name: 'Elsy Amparo Quintero López',
    role: 'Directora administrativa y financiera',
    photo: '/images/equipo/elsy-quintero.jpg',
    statement: 'Desde la Dirección Administrativa y Financiera facilitamos la adquisición, administración y entrega oportuna de los recursos, espacios, productos y servicios requeridos para que la gestión del conocimiento ofrecida en nuestros servicios asegure el logro del propósito empresarial.',
  },
  {
    slug: 'jesica-garcia',
    name: 'Jesica María García Vélez',
    role: 'Profesional de aseguramiento del modelo de gestión',
    photo: '/images/equipo/jesica-garcia.jpg',
    statement: 'Aseguro la oportunidad y eficacia del logro y el mejoramiento de los objetivos estratégicos y del sistema de gestión integrado en calidad y en seguridad y salud en el trabajo.',
  },
  {
    slug: 'angela-manrique',
    name: 'Ángela María Manrique Patiño',
    role: 'Profesional de gestión del conocimiento',
    photo: '/images/equipo/angela-manrique.jpg',
    statement: 'Pone a disposición de la organización y de los clientes su capacidad para la ejecución de los servicios de auditoría, formación y consultoría, con una visión constante de mejoramiento y generación de valor agregado.',
    credentials: ['Administradora de empresas', 'Especialista en gerencia de la salud ocupacional, con licencia de SST', 'Auditora líder NTC-ISO 9001, 14001, 45001 y 55001'],
  },
  {
    slug: 'christian-correa',
    name: 'Christian Felipe Correa Arroyave',
    role: 'Profesional de innovación',
    photo: '/images/equipo/christian-correa.jpg',
    statement: 'Buscamos desde la innovación generar nuevas oportunidades de negocio y tecnologías que aporten al cumplimiento de los objetivos estratégicos, aplicando NTC 5800, NTC 5801, la guía PMBOK y la metodología Design Thinking.',
  },
  {
    slug: 'daniela-palacio',
    name: 'Daniela Palacio Moreno',
    role: 'Asistente administrativa',
    photo: '/images/equipo/daniela-palacio.jpg',
    statement: 'Presto apoyo administrativo a todas nuestras unidades estratégicas: logística de los servicios, trámites legales y documentales, bases de datos, PQRS y gestión comercial.',
  },
]

export interface Case {
  client: string
  year: number
  /** What was done, in one sentence. */
  title: string
  detail: string
  line: string
  newsSlug: string
  image?: string
  imageAlt?: string
}

/** Documented projects. Source: news posts on trainingcorporation.com.co. */
export const cases: Case[] = [
  {
    client: 'Empresa de Energía de Boyacá EBSA',
    year: 2022,
    title: 'Primera auditoría interna a su sistema de gestión de activos bajo ISO 55001',
    detail: 'Dos semanas continuas, cuatro profesionales y modalidad híbrida. Con participación de los procesos financieros se constató la rentabilización alcanzada con la gestión de activos.',
    line: 'gestion-de-activos',
    newsSlug: 'la-empresa-de-energia-de-boyaca-ebsa-s-a-e-s-p',
    image: '/images/fotos/ebsa.jpg',
    imageAlt: 'Sede de la Empresa de Energía de Boyacá',
  },
  {
    client: 'ISA Intercolombia',
    year: 2022,
    title: 'Un programa de auditorías que cubre el ciclo de certificación de cinco modelos de gestión',
    detail: 'Calidad, ambiental, seguridad y salud en el trabajo, seguridad de la información y gestión de activos, con enfoque de ciclo de vida en lugar del esquema habitual a un año.',
    line: 'hseq',
    newsSlug: 'isa-intercolombia',
    image: '/images/fotos/isa-torre-transmision.jpg',
    imageAlt: 'Torre de transmisión eléctrica en zona rural',
  },
  {
    client: 'CORNARE',
    year: 2024,
    title: 'Evaluación de las empresas nominadas al programa Progresa de liderazgo ambiental',
    detail: 'Cuatro dimensiones: ambiental, direccionamiento estratégico, social y articulación con los planes integrales de gestión del cambio climático.',
    line: 'hseq',
    newsSlug: 'participacion-en-el-programa-progresa-cornare',
    image: '/images/fotos/cornare-progresa.png',
    imageAlt: 'Evento del programa Progresa de CORNARE',
  },
  {
    client: 'Alcaldía de Girardota',
    year: 2020,
    title: 'Integración de ISO 9001, MIPG y el sistema de control interno',
    detail: 'Consultoría y asesoría de febrero a agosto, con un equipo de ocho profesionales, para el Programa de Gobierno 2020-2023 del municipio.',
    line: 'hseq',
    newsSlug: 'integracion-sistemas-de-gestion-alcaldia-de-girardota',
  },
]

export interface CompanyDocument {
  title: string
  href: string
  kind: 'pdf' | 'xls' | 'jpg'
}

/** Source: /empresa/sistema-de-gestion-integrado/ and /empresa/. */
export const sgiDocuments: CompanyDocument[] = [
  { title: 'Certificado ISO 9001:2015', href: `${site}/docs/TC-9001-NUEVO.pdf`, kind: 'pdf' },
  { title: 'Certificado ISO 45001:2018', href: `${site}/docs/TC-45001-NUEVO.pdf`, kind: 'pdf' },
  { title: 'Licencia de seguridad y salud en el trabajo', href: `${site}/docs/licenciaSST.pdf`, kind: 'pdf' },
  { title: 'Política de protección de datos', href: `${site}/docs/Proteccion-datos.pdf`, kind: 'pdf' },
  { title: 'Reglamento de higiene y seguridad industrial 2024', href: `${site}/docs/REGLAMENTO%20DE%20HIGIENE%20Y%20SEGURIDAD%20-%202024.pdf`, kind: 'pdf' },
]

const bulletin = (file: string) => `${site}/wp-content/uploads/2024/12/${file}`

/** Source: /empresa/sistema-de-gestion-integrado/ "Boletín informativo". */
export const bulletins: CompanyDocument[] = [
  { title: 'Propósito empresarial y objetivos del SGI', href: bulletin('BI%20-%2001%20-%202024%20-%20Prop%C3%B3sito%20empresarial%20y%20Objetivos%20SGI.%20(1).pdf'), kind: 'pdf' },
  { title: 'Importancia del orden y aseo', href: bulletin('BI%20-%2002%20-%202024%20-%20Importancia%20Orden%20y%20Aseo_.pdf'), kind: 'pdf' },
  { title: 'Protocolo de emergencias', href: bulletin('BI%20-%2003%20-%202024%20-%20Protocolo%20de%20emergencias.pdf'), kind: 'pdf' },
  { title: 'Manejo de sustancias químicas', href: bulletin('BI%20-%2004%20-%202024%20-%20Manejo%20de%20sustancias%20qu%C3%ADmicas.%20.pdf'), kind: 'pdf' },
  { title: 'Pausas activas', href: bulletin('BI%20-%2005%20-%202024%20-%20Pausas%20activas.pdf'), kind: 'pdf' },
  { title: '¿Cómo gestionar el estrés?', href: bulletin('BI%20-%2006%20-%202024%20-%20%C2%BFC%C3%B3mo%20gestionar%20el%20estr%C3%A9s.pdf'), kind: 'pdf' },
  { title: 'Riesgos asociados a ruido e iluminación', href: bulletin('BI%20-%2007%20-%202024%20-%20Riesgos%20y%20peligros%20asociados%20a%20Ruido%20e%20Iluminaci%C3%B3n.pdf'), kind: 'pdf' },
]

/** Source: /contratistas/. */
export const contractorDocuments: CompanyDocument[] = [
  { title: 'Formato de cuenta de cobro', href: `${site}/wp-content/uploads/2024/07/Formato-Cuenta-de-Cobro-Ext-TC.xls`, kind: 'xls' },
  { title: 'Manual de roles y responsabilidades', href: `${site}/wp-content/uploads/2020/11/Manual-de-Roles-y-Responsabilidades-Contratistas-Proveedores-servicios.pdf`, kind: 'pdf' },
  { title: 'Manual de proveedores y contratistas', href: `${site}/wp-content/uploads/2024/12/Manual%20de%20contratistas%20y%20proveedores%20V1%20(2).pdf`, kind: 'pdf' },
]
