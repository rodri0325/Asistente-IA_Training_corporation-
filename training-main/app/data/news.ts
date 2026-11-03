/**
 * News posts. Imported from the WordPress REST API of trainingcorporation.com.co
 * (wp-json/wp/v2/posts) on 2026-10-14. Text is the company's own; only titles were
 * re-cased and widget residue removed. `legacySlug` is the old root-level URL,
 * redirected with a 301 in nuxt.config.
 */

export interface NewsBlock {
  type: 'p' | 'li' | 'h'
  text: string
}

export interface NewsPost {
  slug: string
  legacySlug: string
  /** ISO date, as published. */
  date: string
  title: string
  image?: string
  imageAlt?: string
  blocks: NewsBlock[]
}

export const news: NewsPost[] = [
  {
    slug: "participacion-en-el-programa-progresa-cornare",
    legacySlug: "participacion-en-el-programa-progresa-cornare",
    date: "2025-01-09",
    title: "Participación en el programa Progresa de CORNARE",
    image: "/images/fotos/cornare-progresa.png",
    imageAlt: "Evento del programa Progresa de CORNARE",
    blocks: [
      {
        type: "p",
        text: "TRAINING CORPORATION S.A.S., realizó la evaluación de las empresas a ser nominadas en el programa de liderazgo ambiental regional para las empresas sostenibilidad del oriente antioqueño – Programa PROGRESA versión 2024. Este programa busca fomentar la autogestión y el autocontrol en los sectores productivos, con el propósito de impulsar un crecimiento verde favoreciendo el desarrollo compatible con el clima de la región comprendida en la jurisdicción de CORNARE."
      },
      {
        type: "p",
        text: "Esta evaluación se realizó a través de 4 dimensiones:"
      },
      {
        type: "li",
        text: "DIMENSIÓN AMBIENTAL: Evaluar el cumplimiento de los acuerdos de crecimiento verde que se implementan con CORNARE a través de las siguientes líneas: Desarrollo tecnológico e investigación aplicada."
      },
      {
        type: "li",
        text: "Crecimiento Verde."
      },
      {
        type: "li",
        text: "Capacitación, difusión y comunicación."
      },
      {
        type: "li",
        text: "Incentivos."
      },
      {
        type: "p",
        text: "Permitiendo evidenciar la reducción en los consumos de recursos naturales y de Gases Efecto Invernadero GEI, por medio de los indicadores de Agua, Energía, Manejo de residuos y GEI."
      },
      {
        type: "li",
        text: "DIRECCIONAMIENTO ESTRATÉGICO: Evalúa que las organizaciones en sus procesos y actividades desarrollen estrategias que fortalezcan el componente ambiental desde el desarrollo sostenible."
      },
      {
        type: "li",
        text: "DIMENSIÓN SOCIAL: Evalúa que las empresas promuevan y mantengan cohesión social y habilidad para trabajar en el cumplimiento de objetivos comunes que buscan mitigar los impactos sociales negativos y potencializar los positivos."
      },
      {
        type: "li",
        text: "DIMENSIÓN ARTICULACIÓN CON LOS PIGCCS: Evalúa la integración de las organizaciones con los planes de acción sectorial y territorial de cambio climático, incluyendo plan de crecimiento verde y desarrollo compatible con el clima para el oriente Antioqueño, cuyo propósito es lograr soluciones duraderas de una manera más sostenible desde las medidas de mitigación y adaptación al cambio climático."
      },
      {
        type: "p",
        text: "Para esta VERSIÓN DEL PROGRAMA PROGRESA 2024, TRAINING CORPORATION S.A.S., evaluó 43 empresas de la jurisdicción de CORNARE."
      },
      {
        type: "p",
        text: "Como resultado de la evaluación realizada, TRAINING CORPORATION S.A.S., emitió un resultado de cumplimiento por categorías: Hacía el liderazgo, Líder progresa, Gran líder progresa Bronce, Gran líder progresa Plata y Gran líder progresa Oro."
      },
      {
        type: "p",
        text: "CORNARE realiza el reconocimiento a las empresas mediante un evento de premiación el viernes 29 de noviembre 2024, con la participación de las empresas evaluadas."
      }
    ]
  },
  {
    slug: "camino-hacia-la-sostenibilidad",
    legacySlug: "camino-hacia-la-sostenibilidad",
    date: "2025-01-08",
    title: "Camino hacia la sostenibilidad",
    blocks: [
      {
        type: "p",
        text: "Cómo parte de nuestra nueva plataforma 2024 – 2030 TRAINING CORPORATION S.A.S., apunta a fortalecer su posicionamiento de la marca por medio de la línea de Sostenibilidad que estará enfocada en alcanzar la carbono neutralidad, donde destacamos algunas de nuestras estrategias:"
      },
      {
        type: "li",
        text: "Cálculo de la Huella de Carbono Corporativa para definir estrategias de reducción y compensación de emisiones de nuestras actividades, con el objetivo de alcanzar y certificar la Carbono Neutralidad."
      },
      {
        type: "li",
        text: "Fortalecimiento competencia del personal interno y contratistas en la línea de sostenibilidad."
      },
      {
        type: "p",
        text: "En el 2024 comenzamos a dar nuestros primeros pasos con la certificación de auditores internos en el sistema de gestión de basura cero y para el 2025 se retomará el proyecto Huella de Carbono."
      },
      {
        type: "p",
        text: "Invitamos a nuestros socios, clientes, contratistas, personal de planta y proveedores a fortalecer sus conocimientos en sostenibilidad participando en nuestros cursos de formación y desarrollo de estrategias encaminadas a la protección y gestión del medio ambiente."
      }
    ]
  },
  {
    slug: "nueva-sede-administrativa",
    legacySlug: "nueva-sede-administrativa",
    date: "2024-04-18",
    title: "Nueva sede administrativa",
    image: "/images/fotos/edificio-colmena.jpg",
    imageAlt: "Edificio Colmena, sede administrativa en Medellín",
    blocks: [
      {
        type: "p",
        text: "Nuestro crecimiento es imparable, continúa con la nueva ubicación de la sede administrativa en el edificio Colmena carrera 43 A # 1 A Sur – 29. Oficina 315 Av. Poblado, Medellín. permitiendo mejorar el confort de nuestros grupos de interés."
      },
      {
        type: "p",
        text: "Visítenos en nuestra nueva sede para seguir construyendo relaciones memorablemente exitosas."
      }
    ]
  },
  {
    slug: "asi-vamos-en-nuestro-proposito-de-internacionalizacion",
    legacySlug: "asi-vamos-en-nuestro-proposito-de-internacionalizacion",
    date: "2022-11-24",
    title: "Así vamos en nuestro propósito de internacionalización",
    blocks: [
      {
        type: "p",
        text: "Esto es lo que nos respondió el ingeniero John Fredy Moreno, gerente de TRAINING CORPORATION S.A.S a la pregunta de ¿Qué significa el propósito de internacionalización de servicios y cuáles son los avances alcanzados?"
      },
      {
        type: "p",
        text: "Al identificar en los análisis estratégicos la capacidad en conocimiento y experiencia que hemos desarrollado y alcanzado a través de los 18 años de existencia, fruto de servicios realizados con profesionalismo y altos estándares de calidad, nos hemos comprometido en consolidar nuestra presencia nacional e internacional hacia el 2025."
      },
      {
        type: "p",
        text: "Cuando promediamos el 2022, avanzamos de forma positiva en este gran reto a través de dos grandes logros en servicios de formación, el primero al grupo empresarial ISA, con la realización de eventos de formación para sus empresas en Colombia, Brasil y Perú, el segundo evento de formación se realizó en Costa Rica a través de nuestro aliado AGIO Gestoría de Negocios S.A., donde asistieron empresas del sector energía, como el ICE."
      },
      {
        type: "p",
        text: "Estamos entusiasmados con la gran acogida a nuestra disciplina alcanzada en eventos de formación virtual a nivel internacional, logros que hemos alcanzado a través de:"
      },
      {
        type: "li",
        text: "La participación del equipo de INNTRAINING, encargados de la aplicación de estándares de innovación en el diseño del currículo y la pedagogía."
      },
      {
        type: "li",
        text: "NTC 5802 Gestión de la investigación, desarrollo e innovación (I+D+I). Requisitos de un proyecto de I+D+I."
      },
      {
        type: "li",
        text: "NTC-ISO 5801-2018 Sistema de gestión de la innovación. Requisitos."
      },
      {
        type: "li",
        text: "La planificación de recursos logísticos en donde el uso de plataformas virtuales apoya la pedagogía y permiten mayor dinámica en la participación de los asistentes."
      },
      {
        type: "li",
        text: "El uso de controles de planificación de tiempos, contenidos y realización de talleres, que permiten alcanzar alta precisión en el cumplimiento de las agendas."
      },
      {
        type: "li",
        text: "La participación de instructores expertos con vocación y conocimiento que hacen memorables los eventos de formación."
      }
    ]
  },
  {
    slug: "la-empresa-de-energia-de-boyaca-ebsa-s-a-e-s-p",
    legacySlug: "la-empresa-de-energia-de-boyaca-ebsa-s-a-e-s-p",
    date: "2022-10-23",
    title: "Primera auditoría interna ISO 55001 de la Empresa de Energía de Boyacá",
    image: "/images/fotos/ebsa.jpg",
    imageAlt: "Sede de la Empresa de Energía de Boyacá EBSA",
    blocks: [
      {
        type: "p",
        text: "Una empresa en permanente evolución Los sistemas de gestión de activos requeridos en Colombia para las empresas operadoras de energía, son un requisito regulatorio que ha exigido que, como prestadores de servicios de auditoría, dispongamos en TRAINING CORPORATION de toda la capacidad humana y técnica para ofrecerle a nuestros clientes, un servicio de calidad. Es así como hemos podido acompañar en su primera auditoría interna al sistema de gestión de activos bajo la Norma ISO 55001:2015 a la Empresa de Energía de Boyacá- EBSA S.A. E.S.P. El ejercicio fue desarrollado durante 2 semanas continuas, con la participación de cuatro profesionales, en modalidad hibrida (virtual y presencial). En la auditoría, se pudo realizar una importante revisión de la rentabilización alcanzada con la gestión de activos, tanto por los procesos habilitadores como de los que participan en el ciclo de vida de los activos."
      },
      {
        type: "p",
        text: "Con la participación de los procesos financieros en la auditoria del sistema de gestión de activos, se pudo constatar la rentabilización alcanzada con la gestión de activos y la adecuación, conveniencia y eficacia del sistema de gestión de activos."
      },
      {
        type: "p",
        text: "Con los resultados alcanzados por la auditoría, la EBSA S.A. E.S.P., dispone de nueva información que permitirá revisar el rol del sistema de gestión de activos y la hoja de ruta para la mejora sistemática y el fortalecimiento de la cultura empresarial relacionada con la rentabilización de los activos."
      }
    ]
  },
  {
    slug: "isa-intercolombia",
    legacySlug: "isa_noticia",
    date: "2022-10-23",
    title: "Un nuevo modelo de programación de auditorías para ISA Intercolombia",
    image: "/images/fotos/isa-torre-transmision.jpg",
    imageAlt: "Torre de transmisión eléctrica",
    blocks: [
      {
        type: "p",
        text: "Las dinámicas empresariales propias de nuestros clientes, que cambian o avanzan aceleradamente, nos han exigido que seamos propositivos y de mayor generación de valor en lo referente a las auditorías internas integrales. Es así como hemos estudiado e incorporado nuevos criterios para el diseño de programas y planes de auditoría que favorecen la eficiencia en el uso de los recursos. De forma simultánea a los nuevos modelos de programación y planificación, hemos diseñado nuevas metodologías, que propician resultados de mayor valor y relevancia para el cliente, superando sus necesidades y expectativas."
      },
      {
        type: "p",
        text: "Con la Organización Isa Intercolombia, se estructuró una programación de auditorías que cubre el ciclo de certificación de los cinco (5) modelos de gestión, tanto en calidad, ambiental, seguridad y salud en el trabajo, seguridad de la información y gestión de activos."
      },
      {
        type: "p",
        text: "El nuevo modelo de programación de auditorías en Isa Intercolombia, ha permitido abordar de forma más eficiente, adecuada y profunda los requisitos de los modelos de gestión, del cliente y los regulatorios, así como los procesos, lugares, proyectos y activos, con enfoque de ciclo de vida. Este nuevo modelo permitió evolucionar el esquema habitual de realizar ciclos de auditoría con programación a 1 año, Los principales beneficios alcanzado son:"
      },
      {
        type: "p",
        text: "• Optimizar el direccionamiento de los recursos; • Flexibilizar las agendas de las auditorías, permitiendo a los procesos recibir las auditorías de forma natural y sincronizada a sus tiempos de gestión; • Realizar evaluaciones en el tiempo que favorecen el análisis de la integralidad y alineación entre los modelos de gestión; • Consolidar evidencias de manera rigurosa y estricta, para estructurar hallazgos sólidos, de relevancia transversal y que, al momento de la formulación de acciones de mejora, redunde en la globalidad del sistema de gestión y optimicen los esfuerzos hacia la mejora."
      },
      {
        type: "p",
        text: "En estos ya cuatro años de acompañamiento, hemos desarrollado las auditorias internas integrales bajo las Normas NTC ISO 9001, 14001,45001, 55001 Y 27001, dando alcance a todos los Centros de Transmisión de Energía CTE ( Noroccidente, Suroccidente, Centro y Oriente ), así como los proyectos en sus diferentes fases, desde una metodología tanto presencial como virtual"
      },
      {
        type: "p",
        text: "Durante el 2022, se diseñó por TRAINING CORPORATION un nuevo esquema para realizar las auditorías al sistema de gestión de activos, rompiendo el paradigma de realizar auditarías soportados en procesos, al considerar otros ejes de investigación soportados de forma adicional a la de los procesos, la evaluación de los activos críticos, su rentabilización y la alineación estratégica, táctica y operativa de la gestión de activos."
      }
    ]
  },
  {
    slug: "certificado-de-nuestro-sistema-de-gestion-seguridad-y-salud-en-el-trabajo",
    legacySlug: "certificado-de-nuestro-sistema-de-gestion-seguridad-y-salud-en-el-trabajo",
    date: "2022-06-18",
    title: "Certificamos nuestro sistema de gestión de seguridad y salud en el trabajo",
    blocks: [
      {
        type: "p",
        text: "Es un orgullo para Training Corporation S.A.S., compartir el logro de la certificación en el Sistema de Gestión de Seguridad y Salud en el Trabajo, otorgado por Bureau Veritas bajo la norma NTC-ISO 45001:2018. Esta meta alcanzada hace parte del compromiso de mejora frente la calidad de vida de nuestros grupos de interés."
      },
      {
        type: "p",
        text: "Invitamos a todos nuestros grupos de interés a participar y mejorar continuamente nuestra gestión frente la Seguridad y Salud en el Trabajo, desarrollando las mejores estrategias para la prevención y mitigación de accidentes de trabajo y enfermedades laborales, proporcionando espacios de trabajo sanos y seguros"
      }
    ]
  },
  {
    slug: "ampliacion-del-alcance-del-sistema-de-gestion-de-calidad",
    legacySlug: "ampliacion-del-alcance-del-sistema-de-gestion-de-calidad",
    date: "2022-06-18",
    title: "Ampliación del alcance del sistema de gestión de calidad",
    blocks: [
      {
        type: "p",
        text: "El equipo de trabajo logró la ampliación del alcance del certificado del SGC de la empresa., con los servicios:"
      },
      {
        type: "p",
        text: "1. Modelo integrado de planeación y gestión MIPG para las Unidades Estratégicas de Negocio Consultoría y Nuevos Negocios y Gestión del Conocimiento."
      },
      {
        type: "p",
        text: "2. Modelo integrado de planeación y gestión MIPG; regulación en el sector eléctrico y proyectos constructivos en el sector eléctrico, en la Unidad Estratégica de Negocio Evaluación Organizacional."
      }
    ]
  },
  {
    slug: "reconocimiento-camara-de-comercio-de-bogota",
    legacySlug: "reconocimeinto-camara-de-comercio-de-bogota",
    date: "2020-11-23",
    title: "Reconocimiento de la Cámara de Comercio de Bogotá",
    image: "/images/fotos/reconocimiento-ccb.png",
    imageAlt: "Reconocimiento de la Cámara de Comercio de Bogotá a Training Corporation",
    blocks: [
      {
        type: "p",
        text: "En la XI Jornada de Gestión Integral de Proveedores, la Cámara de Comercio de Bogotá reconoció a Training Corporation por haber obtenido una calificación de 100/100 en la evaluación de los bienes y servicios suministrados a la entidad entre julio de 2019 y julio de 2020."
      }
    ]
  },
  {
    slug: "integracion-sistemas-de-gestion-alcaldia-de-girardota",
    legacySlug: "nicia-integracion-de-los-sistemas-de-gestion-de-la-alcaldia-de-girardota",
    date: "2020-11-13",
    title: "Integración de los sistemas de gestión de la Alcaldía de Girardota",
    blocks: [
      {
        type: "p",
        text: "TRAINING CORPORATION LTDA., en busca de contribuir con las habilidades humanas para satisfacer las necesidades y expectativas de nuestros clientes, desde el pasado mes de febrero hasta el mes de agosto, presta el servicio de consultoría y asesoría a la alcaldía de Girardota, con el fin de actualizar y unificar el Sistema de Gestión de Calidad NTC-ISO 9001:2015, el Modelo Integrado de Planeación y Gestión (MIPG) e implementación del Sistema de Control Interno (SCI) basados en el Decreto Único Reglamentario del Sector Función Pública 1499 de 2017, con el fin de generar los resultados esperados en el Programa de Gobierno 2020-2023 del municipio de Girardota y resolver las distintas necesidades y problemas de los ciudadanos de dicho municipio, con integridad y calidad en el servicio."
      },
      {
        type: "p",
        text: "A continuación, se presenta el equipo de trabajo compuesto por 8 profesionales comprometidos al desarrollo de las habilidades del Municipio y al cumplimiento de los objetivos del proyecto."
      }
    ]
  },
  {
    slug: "con-exito-lanzamos-nuestro-cursos-de-gestion-de-activos",
    legacySlug: "con-exito-lanzamos-nuestro-cursos-de-gestion-de-activos",
    date: "2020-11-13",
    title: "Lanzamos nuestros cursos de gestión de activos",
    image: "/images/fotos/curso-auditores-iso-55001-2020.jpg",
    imageAlt: "Participantes del curso de fundamentos y calificación de auditores en ISO 55001, Medellín, 2020",
    blocks: [
      {
        type: "p",
        text: "Foto: Fundamentos y calificación de auditores internos en la norma NTC-ISO 55001:2015 Gestión de activos. Sistemas de gestión. Requisitos y la guía GTC-ISO 19011:2018 Directrices para la auditoría de los sistemas de gestión"
      },
      {
        type: "p",
        text: "En febrero del 2020 con la realización de los dos primeros cursos de Gestión de Activos dictados en Medellín, sobre fundamentos y calificación de auditores, hicieron presencia diferentes profesionales en las disciplinas de seguridad de la información, gestión ambiental, seguridad y salud en el trabajo, electricistas, industriales y administradores, todos interesados en incorporar la gestión de activos en su saber, para transferirlos a sus organizaciones en las ciudades de origen como Medellín, Armenia y Bucaramanga."
      },
      {
        type: "p",
        text: "Las metodologías pedagógicas aplicadas de aprender desde la práctica, permitieron profundizar en temas trascendentales en la comprensión de las normas:"
      },
      {
        type: "li",
        text: "NTC-ISO 55000:2014 GESTION DE ACTIVOS. ASPECTOS GENERALES, PRINCIPIOS Y TERMINOLOGÍA."
      },
      {
        type: "li",
        text: "NTC-ISO 55001:2015 GESTIÓN DE ACTIVOS. SISTEMAS DE GESTIÓN. REQUSITOS"
      },
      {
        type: "li",
        text: "NTC-ISO 55002:2015 GESTIÓN DE ACTIVOS. SISTEMAS DE GESTIÓN. DIRECTRICES PARA LA APLICACIÓN DE LA ISO 55001."
      },
      {
        type: "li",
        text: "GTC-ISO 19011:2018 DIRECTRICES PARA LA AUDITORÍA DE LOS SISTEMAS DE GESTIÓN"
      }
    ]
  },
  {
    slug: "training-corporation-ltda-cada-vez-mas-cerca-de-sus-empresas-clientes",
    legacySlug: "training-corporation-ltda-cada-vez-mas-cerca-de-sus-empresas-clientes",
    date: "2020-11-13",
    title: "Consultoría virtual: más cerca de nuestras organizaciones clientes",
    blocks: [
      {
        type: "p",
        text: "TRAINING CORPORATION LTDA., pensando siempre en satisfacer las necesidades y expectativas de sus organizaciones clientes, ha desarrollado el servicio de consultoría virtual, a través del cual, se optimizan los tiempos de atención, flexibilizan las agendas de trabajo y se reducen los costos del servicio, al eliminar los tiempos y costos de desplazamiento de sus consultores."
      },
      {
        type: "p",
        text: "La empresa de energía de Boyacá EBSA S.A. E.S.P., ha recibido mediante la modalidad de consultoría virtual, servicios a distancia de acompañamiento en la gestión de acuerdos de niveles de servicio ANS y el fortalecimiento a la gestión de interventoría y a la evaluación y re evaluación de contratistas, servicios en los que incluye el referenciamiento de buenas prácticas identificadas en el sector eléctrico colombiano."
      },
      {
        type: "p",
        text: "Ahora, la EBSA S.A. E.S.P., tiene acceso a consultores que se pueden encontrar en diferentes ciudades del territorio nacional sin preocuparse por las distancias, ni los costos de desplazamiento de los consultores."
      }
    ]
  }
]

export const findPost = (slug: string) => news.find((n) => n.slug === slug)

/** Pixel size of each news photo, so the page reserves its space before it loads. */
export const newsImageSizes: Record<string, [number, number]> = {
  '/images/fotos/cornare-progresa.png': [1107, 690],
  '/images/fotos/edificio-colmena.jpg': [621, 828],
  '/images/fotos/ebsa.jpg': [1152, 768],
  '/images/fotos/isa-torre-transmision.jpg': [390, 693],
  '/images/fotos/reconocimiento-ccb.png': [1391, 1065],
  '/images/fotos/curso-auditores-iso-55001-2020.jpg': [1333, 819],
}
