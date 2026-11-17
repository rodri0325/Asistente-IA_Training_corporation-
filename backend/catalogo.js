import { readFileSync } from 'node:fs';

const CAMPOS_ORIGINALES = [
  'id',
  'nombre',
  'categoria',
  'precio',
  'moneda',
  'fechas_inicio',
  'modalidades',
  'requisitos',
  'duracion_semanas',
  'duracion_horas',
  'notas',
];
const CAMPOS_PERMITIDOS = new Set(CAMPOS_ORIGINALES.filter((campo) => campo !== 'precio'));
const CAMPOS_REQUERIDOS = ['id', 'nombre', 'categoria', 'notas'];

const ARCHIVOS_CATALOGO = [
  ['curso', new URL('./data/catalogo_cursos.json', import.meta.url)],
  ['servicio', new URL('./data/catalogo_servicios.json', import.meta.url)],
];

export function cargarCatalogo() {
  const ids = new Set();
  return ARCHIVOS_CATALOGO.flatMap(([tipo, archivo]) => {
    const entradas = JSON.parse(readFileSync(archivo, 'utf8'));
    if (!Array.isArray(entradas)) {
      throw new Error(`El catálogo de ${tipo} debe contener una lista JSON.`);
    }

    return entradas.map((entrada, indice) => {
      const claves = entrada && typeof entrada === 'object' && !Array.isArray(entrada)
        ? Object.keys(entrada)
        : [];
      if (
        claves.some((clave) => !CAMPOS_PERMITIDOS.has(clave))
        || CAMPOS_REQUERIDOS.some((clave) => !Object.hasOwn(entrada, clave))
        || (tipo === 'servicio' && claves.some((clave) => entrada[clave] === null))
      ) {
        throw new Error(`La entrada ${indice + 1} del catálogo de ${tipo} tiene campos inesperados, requeridos ausentes o valores null.`);
      }
      if (typeof entrada.id !== 'string' || !entrada.id.trim()) {
        throw new Error(`La entrada ${indice + 1} del catálogo de ${tipo} no tiene un id válido.`);
      }
      if (ids.has(entrada.id)) {
        throw new Error(`Id duplicado en los catálogos: ${entrada.id}.`);
      }
      ids.add(entrada.id);
      return { ...entrada, tipo };
    });
  });
}

// TODO: Gemini se consulta por REST, sin SDK; implementar context caching si se incorpora un SDK compatible.
export const catalogo = cargarCatalogo();
