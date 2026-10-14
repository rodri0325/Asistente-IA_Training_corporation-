import { readFileSync } from 'node:fs';

const catalogo = JSON.parse(readFileSync(new URL('../backend/data/catalogo_cursos.json', import.meta.url), 'utf8'));
const aliases = {
  'curso-001': ['excel'],
  'curso-002': ['python', 'analisis de datos'],
  'curso-003': ['power bi'],
  'curso-004': ['sql', 'bases de datos'],
  'curso-005': ['inteligencia artificial', 'ia generativa'],
  'curso-006': ['desarrollo web', 'frontend'],
  'curso-007': ['ciberseguridad'],
  'curso-008': ['gestion de proyectos', 'metodologias agiles'],
  'curso-009': ['marketing digital', 'redes sociales'],
  'curso-010': ['ux ui', 'ux', 'ui'],
  'curso-011': ['computacion en la nube', 'cloud'],
  'curso-012': ['liderazgo', 'comunicacion efectiva'],
  'curso-013': ['finanzas', 'finanzas basicas'],
  'curso-014': ['no code', 'automatizacion de procesos'],
};

function normalizar(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

function contiene(text, phrase) {
  return ` ${text} `.includes(` ${normalizar(phrase)} `);
}

function fechas(curso, today) {
  const futuras = curso.fechas_inicio.filter((date) => date >= today).sort();
  if (!futuras.length) return 'No hay próximas fechas confirmadas. Las fechas registradas ya pasaron.';
  return `Próximos inicios: ${futuras.join(' y ')}.${futuras.length > 1 ? ' ¿Cuál fecha te interesa?' : ''}`;
}

function responder(pregunta, today) {
  const text = normalizar(pregunta);
  const matches = catalogo.filter((curso) => [curso.nombre, ...(aliases[curso.id] || [])]
    .some((name) => contiene(text, name)));
  const listar = /\b(catalogo|lista de cursos|listar cursos|que cursos|cuales cursos|cursos disponibles|oferta de cursos)\b/.test(text);
  if (matches.length > 1) {
    return `Mencionaste varios cursos: ${matches.map((curso) => curso.nombre).join('; ')}. ¿Cuál quieres consultar primero?`;
  }
  // El alias Excel no convierte un nivel inexistente en el curso Avanzado del catálogo.
  if (/\bexcel (basico|intermedio)\b/.test(text)) {
    return 'No encuentro ese nivel de Excel en el catálogo. El curso disponible es Excel Avanzado. ¿Quieres consultar sus datos?';
  }
  if (!matches.length) {
    if (listar) return `Estos son los cursos del catálogo:\n${catalogo.map((curso) => `• ${curso.nombre}`).join('\n')}\n\nEscribe el nombre de un curso para consultar precio, fechas, requisitos, modalidades o duración.`;
    if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hola que tal)$/.test(text)) {
      return 'Hola. ¿Sobre qué curso quieres consultar? Puedo mostrarte los cursos disponibles y sus precios, fechas, requisitos, modalidades y duración.';
    }
    return 'No puedo identificar un curso del catálogo en tu consulta. Escribe su nombre exacto o pregunta «¿Qué cursos tienen?» para ver las opciones.';
  }
  const curso = matches[0];
  if (/\b(descuentos?|becas?|certificados?|certificacion|diplomas?|horarios?|horas?|inscrib|inscripcion|matricula|pagos?|pagar|profesores?|docentes?|direccion|sedes?|telefono|contacto|cupos?|homolog|empleo)\b/.test(text)) {
    return `No tengo ese dato en el catálogo de ${curso.nombre}. Puedo consultar su precio, fechas de inicio, requisitos, modalidades y duración.`;
  }
  const intents = {
    precio: /\b(precio|precios|cuesta|cuestan|costo|costos|valor|vale|cuanto sale)\b/.test(text),
    fecha: /\b(fechas?|cuando|inicio|inicios|empieza|empiezan|comienza|comienzan|inicia|inician|arranca)\b/.test(text),
    requisitos: /\b(requisitos?|prerrequisitos?|que necesito|necesito para|se necesita|se necesitan|conocimientos|ingresar)\b/.test(text),
    modalidad: /\b(modalidad|modalidades|virtual|presencial|hibrida|hibrido|online|remoto|remota)\b/.test(text),
    duracion: /\b(duracion|dura|duran|semanas?|cuanto tiempo)\b/.test(text),
  };
  const summary = !Object.values(intents).some(Boolean);
  if (summary && !/^((quiero|dame|necesito|me das|busco) )?(informacion|info|detalles|saber|conocer)\b/.test(text)
    && !/\b(cuentame|hablame)\b/.test(text)
    && ![curso.nombre, ...(aliases[curso.id] || [])].some((name) => text === normalizar(name))) {
    return `¿Qué quieres saber de ${curso.nombre}? Puedo consultar precio, fechas de inicio, requisitos, modalidades o duración.`;
  }
  const result = [curso.nombre];
  if (summary || intents.precio) result.push(`Precio: ${new Intl.NumberFormat('es-CO').format(curso.precio)} ${curso.moneda}.`);
  if (summary || intents.fecha) result.push(fechas(curso, today));
  if (summary || intents.requisitos) result.push(curso.requisitos.length === 1 && curso.requisitos[0] === 'Ninguno'
    ? 'Requisitos: el catálogo no exige requisitos de ingreso.' : `Requisitos: ${curso.requisitos.join('; ')}.`);
  if (summary || intents.modalidad) result.push(`Modalidades: ${curso.modalidades.join(' y ')}.`);
  if (summary || intents.duracion) result.push(`Duración: ${curso.duracion_semanas} semanas.`);
  return result.join('\n');
}

/** A local, deterministic substitute for Gemini; it never makes network requests. */
export function createDemoFetch({ now = () => new Date() } = {}) {
  return async (_url, options = {}) => {
    const body = JSON.parse(options.body || '{}');
    const pregunta = body.contents?.[0]?.parts?.filter((part) => typeof part.text === 'string')
      .map((part) => part.text).join(' ') || '';
    const instructions = body.systemInstruction?.parts?.map((part) => part.text || '').join('\n') || '';
    const today = instructions.match(/\bHoy es (\d{4}-\d{2}-\d{2})\./)?.[1]
      || new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota' }).format(now());
    return Response.json({ candidates: [{
      finishReason: 'STOP', content: { parts: [{ text: responder(pregunta, today) }] },
    }] });
  };
}

export const demoFetch = createDemoFetch();
