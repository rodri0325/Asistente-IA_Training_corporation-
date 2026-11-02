/**
 * Client organisations, as listed by sector on trainingcorporation.com.co/clientes/
 * (logos downloaded from the same page on 2026-10-14). Names were read from each logo.
 * Order within a sector is the order on the current site.
 */

export type SectorId =
  | 'energia' | 'internacional' | 'educacion' | 'salud' | 'investigacion' | 'gobierno'
  | 'industrial' | 'confeccion' | 'telecomunicaciones' | 'ambiental' | 'mineria'
  | 'servicios' | 'cultura' | 'eficiencia' | 'laboratorios'

export interface Client {
  name: string
  sector: SectorId
  logo: string
}

/** Sector headings, in the order the current site uses. */
export const sectors: { id: SectorId, name: string }[] = [
  { id: 'energia', name: 'Servicios públicos y sector eléctrico' },
  { id: 'internacional', name: 'Presencia internacional' },
  { id: 'educacion', name: 'Educación' },
  { id: 'salud', name: 'Salud' },
  { id: 'investigacion', name: 'Centros de investigación' },
  { id: 'gobierno', name: 'Gobierno y entes que ejercen funciones públicas' },
  { id: 'industrial', name: 'Industria' },
  { id: 'confeccion', name: 'Confección' },
  { id: 'telecomunicaciones', name: 'Telecomunicaciones' },
  { id: 'ambiental', name: 'Corporaciones ambientales' },
  { id: 'mineria', name: 'Minería' },
  { id: 'servicios', name: 'Servicios' },
  { id: 'cultura', name: 'Cultura y deporte' },
  { id: 'eficiencia', name: 'Eficiencia energética' },
  { id: 'laboratorios', name: 'Laboratorios de inspección y ensayo' },
]

export const clients: Client[] = [
  { name: 'EPM', sector: 'energia', logo: '/images/clientes/epm.png' },
  { name: 'CHEC', sector: 'energia', logo: '/images/clientes/chec.png' },
  { name: 'CENS', sector: 'energia', logo: '/images/clientes/cens.png' },
  { name: 'ESSA', sector: 'energia', logo: '/images/clientes/essa.png' },
  { name: 'EDEQ', sector: 'energia', logo: '/images/clientes/edeq.png' },
  { name: 'Emvarias', sector: 'energia', logo: '/images/clientes/emvarias.png' },
  { name: 'ISA Intercolombia', sector: 'energia', logo: '/images/clientes/isa-intercolombia.png' },
  { name: 'XM', sector: 'energia', logo: '/images/clientes/xm.png' },
  { name: 'Codensa', sector: 'energia', logo: '/images/clientes/codensa.png' },
  { name: 'Electricaribe', sector: 'energia', logo: '/images/clientes/electricaribe.png' },
  { name: 'Electrohuila', sector: 'energia', logo: '/images/clientes/electrohuila.png' },
  { name: 'Urrá', sector: 'energia', logo: '/images/clientes/urra.png' },
  { name: 'Gensa', sector: 'energia', logo: '/images/clientes/gensa.png' },
  { name: 'EBSA', sector: 'energia', logo: '/images/clientes/ebsa.png' },
  { name: 'Empresa de Energía del Bajo Putumayo', sector: 'energia', logo: '/images/clientes/empresa-de-energia-del-bajo-putumayo.png' },
  { name: 'Enertolima', sector: 'energia', logo: '/images/clientes/enertolima.png' },
  { name: 'Cedenar', sector: 'energia', logo: '/images/clientes/cedenar.png' },
  { name: 'Enelar', sector: 'energia', logo: '/images/clientes/enelar.png' },
  { name: 'Emcali', sector: 'energia', logo: '/images/clientes/emcali.png' },
  { name: 'Enerca', sector: 'energia', logo: '/images/clientes/enerca.png' },
  { name: 'Energía de Pereira', sector: 'energia', logo: '/images/clientes/energia-de-pereira.png' },
  { name: 'Empresa de Energía del Putumayo', sector: 'energia', logo: '/images/clientes/empresa-de-energia-del-putumayo.png' },
  { name: 'EMSA', sector: 'energia', logo: '/images/clientes/emsa.png' },
  { name: 'EMEC', sector: 'energia', logo: '/images/clientes/emec.png' },
  { name: 'Electrocaquetá', sector: 'energia', logo: '/images/clientes/electrocaqueta.png' },
  { name: 'Interservicios', sector: 'energia', logo: '/images/clientes/interservicios.png' },
  { name: 'Delsur', sector: 'internacional', logo: '/images/clientes/delsur.png' },
  { name: 'AGIO Gestoría de Negocios', sector: 'internacional', logo: '/images/clientes/agio-gestoria-de-negocios.jpg' },
  { name: 'Universidad de Medellín', sector: 'educacion', logo: '/images/clientes/universidad-de-medellin.jpg' },
  { name: 'Universidad de San Buenaventura', sector: 'educacion', logo: '/images/clientes/universidad-de-san-buenaventura.jpg' },
  { name: 'Universidad de Antioquia', sector: 'educacion', logo: '/images/clientes/universidad-de-antioquia.jpg' },
  { name: 'Uniremington', sector: 'educacion', logo: '/images/clientes/uniremington.jpg' },
  { name: 'Colegio Mayor de Antioquia', sector: 'educacion', logo: '/images/clientes/colegio-mayor-de-antioquia.png' },
  { name: 'Universidad del Atlántico', sector: 'educacion', logo: '/images/clientes/universidad-del-atlantico.jpg' },
  { name: 'Clínica Zayma', sector: 'salud', logo: '/images/clientes/clinica-zayma.jpg' },
  { name: 'CIDET', sector: 'investigacion', logo: '/images/clientes/cidet.jpg' },
  { name: 'Consejo Nacional de Operación', sector: 'gobierno', logo: '/images/clientes/consejo-nacional-de-operacion.jpg' },
  { name: 'Cámara de Comercio de Bogotá', sector: 'gobierno', logo: '/images/clientes/camara-de-comercio-de-bogota.png' },
  { name: 'Cámara de Comercio de Medellín para Antioquia', sector: 'gobierno', logo: '/images/clientes/camara-de-comercio-de-medellin-para-antioquia.jpg' },
  { name: 'Alcaldía de Girardota', sector: 'gobierno', logo: '/images/clientes/alcaldia-de-girardota.jpg' },
  { name: 'Gobernación de Boyacá', sector: 'gobierno', logo: '/images/clientes/gobernacion-de-boyaca.jpg' },
  { name: 'Fábrica de Licores de Antioquia', sector: 'industrial', logo: '/images/clientes/fabrica-de-licores-de-antioquia.jpg' },
  { name: 'Colresin', sector: 'industrial', logo: '/images/clientes/colresin.jpg' },
  { name: 'Leonisa', sector: 'confeccion', logo: '/images/clientes/leonisa.jpg' },
  { name: 'Ecooelsa', sector: 'confeccion', logo: '/images/clientes/ecooelsa.jpg' },
  { name: 'Decom', sector: 'telecomunicaciones', logo: '/images/clientes/decom.jpg' },
  { name: 'Internexa', sector: 'telecomunicaciones', logo: '/images/clientes/internexa.jpg' },
  { name: 'Avantel', sector: 'telecomunicaciones', logo: '/images/clientes/avantel.jpg' },
  { name: 'Corantioquia', sector: 'ambiental', logo: '/images/clientes/corantioquia.jpg' },
  { name: 'Cornare', sector: 'ambiental', logo: '/images/clientes/cornare.jpg' },
  { name: 'SAG', sector: 'ambiental', logo: '/images/clientes/sag.jpg' },
  { name: 'Mineros', sector: 'mineria', logo: '/images/clientes/mineros.jpg' },
  { name: 'Inmunizar del Llano', sector: 'servicios', logo: '/images/clientes/inmunizar-del-llano.jpg' },
  { name: 'Disvinilos', sector: 'servicios', logo: '/images/clientes/disvinilos.jpg' },
  { name: 'Consultel', sector: 'servicios', logo: '/images/clientes/consultel.jpg' },
  { name: 'Automatización', sector: 'servicios', logo: '/images/clientes/automatizacion.jpg' },
  { name: 'Document Express', sector: 'servicios', logo: '/images/clientes/document-express.jpg' },
  { name: 'Petpack', sector: 'servicios', logo: '/images/clientes/petpack.jpg' },
  { name: 'Avinal', sector: 'servicios', logo: '/images/clientes/avinal.jpg' },
  { name: 'IDEA', sector: 'servicios', logo: '/images/clientes/idea.jpg' },
  { name: 'Mayor Seguridad', sector: 'servicios', logo: '/images/clientes/mayor-seguridad.jpg' },
  { name: 'Smart Instruments', sector: 'servicios', logo: '/images/clientes/smart-instruments.jpg' },
  { name: 'Plasmar', sector: 'servicios', logo: '/images/clientes/plasmar.jpg' },
  { name: 'Emtelco', sector: 'servicios', logo: '/images/clientes/emtelco.jpg' },
  { name: 'Celsa', sector: 'servicios', logo: '/images/clientes/celsa.jpg' },
  { name: 'Cosmotrans', sector: 'servicios', logo: '/images/clientes/cosmotrans.jpg' },
  { name: 'Concreacero', sector: 'servicios', logo: '/images/clientes/concreacero.jpg' },
  { name: 'Hidrycas', sector: 'servicios', logo: '/images/clientes/hidrycas.jpg' },
  { name: 'Ingema', sector: 'servicios', logo: '/images/clientes/ingema.jpg' },
  { name: 'Núcleos', sector: 'servicios', logo: '/images/clientes/nucleos.jpg' },
  { name: 'Postelectra', sector: 'servicios', logo: '/images/clientes/postelectra.jpg' },
  { name: 'Ingeomega', sector: 'servicios', logo: '/images/clientes/ingeomega.jpg' },
  { name: 'Curtimbres de Itagüí', sector: 'servicios', logo: '/images/clientes/curtimbres-de-itagui.jpg' },
  { name: 'Asocoflores', sector: 'servicios', logo: '/images/clientes/asocoflores.jpg' },
  { name: 'JLT', sector: 'servicios', logo: '/images/clientes/jlt.jpg' },
  { name: 'Base Sólida', sector: 'servicios', logo: '/images/clientes/base-solida.jpg' },
  { name: 'KXW', sector: 'servicios', logo: '/images/clientes/kxw.jpg' },
  { name: 'Termaltec', sector: 'servicios', logo: '/images/clientes/termaltec.jpg' },
  { name: 'Suzuki', sector: 'servicios', logo: '/images/clientes/suzuki.jpg' },
  { name: 'DIM', sector: 'cultura', logo: '/images/clientes/dim.jpg' },
  { name: 'Tronex', sector: 'eficiencia', logo: '/images/clientes/tronex.jpg' },
  { name: 'Ultraline', sector: 'eficiencia', logo: '/images/clientes/ultraline.jpg' },
  { name: 'Ferragro', sector: 'eficiencia', logo: '/images/clientes/ferragro.jpg' },
  { name: 'Solar Center', sector: 'eficiencia', logo: '/images/clientes/solar-center.jpg' },
  { name: 'Tecnimicro', sector: 'laboratorios', logo: '/images/clientes/tecnimicro.png' },
  { name: 'Accequip', sector: 'laboratorios', logo: '/images/clientes/accequip.jpg' },
  { name: 'EPM', sector: 'laboratorios', logo: '/images/clientes/epm.jpg' },
]

export const clientsIn = (sector: SectorId) => clients.filter((c) => c.sector === sector)
