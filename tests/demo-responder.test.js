import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoFetch, demoFetch } from '../scripts/demo-responder.js';
import { crearAsistente } from '../backend/asistente.js';

async function preguntar(pregunta, today = '2026-10-13', fetchImpl = demoFetch) {
  const response = await fetchImpl('https://gemini.invalid/simulado', {
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: `Hoy es ${today}.` }] },
      contents: [{ parts: [{ text: pregunta }] }],
    }),
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.candidates[0].finishReason, 'STOP');
  return body.candidates[0].content.parts[0].text;
}

test('La demo responde el precio de Excel y reconoce mayúsculas y tildes', async () => {
  const respuesta = await preguntar('¿CUÁNTO CUESTA ÉXCEL AVANZADO?');
  assert.match(respuesta, /Excel Avanzado/);
  assert.match(respuesta, /450\.000 COP/);
  assert.doesNotMatch(respuesta, /simulad|620\.000/);
});

test('Distingue otros cursos y devuelve solo las modalidades del curso consultado', async () => {
  const python = await preguntar('¿Python es virtual o presencial?');
  assert.match(python, /Python para Análisis de Datos/);
  assert.match(python, /Modalidades: virtual\./);
  assert.doesNotMatch(python, /presencial|Excel Avanzado|450\.000/);
  const ia = await preguntar('Modalidades de inteligencia artificial');
  assert.match(ia, /virtual y híbrida/);
});

test('Filtra fechas pasadas usando la fecha del prompt y conserva fechas exactas', async () => {
  const power = await preguntar('¿Cuándo empieza Power BI?');
  assert.match(power, /2026-10-13 y 2026-11-24/);
  assert.match(power, /Cuál fecha te interesa/);
  const excel = await preguntar('Fechas de Excel');
  assert.match(excel, /2026-11-10/);
  assert.doesNotMatch(excel, /2026-10-05/);
  const vencido = await preguntar('Fechas de Excel', '2027-01-01');
  assert.match(vencido, /No hay próximas fechas confirmadas/);
  assert.match(vencido, /ya pasaron/);
});

test('Requisitos y duración provienen del curso identificado, incluso sin tilde', async () => {
  const nube = await preguntar('Requisitos y duracion de computacion en la nube');
  assert.match(nube, /Nociones básicas de redes; Manejo básico de computador/);
  assert.match(nube, /8 semanas/);
  assert.doesNotMatch(nube, /Bachiller/);
  assert.match(await preguntar('¿Qué necesito para Python?'), /no exige requisitos de ingreso/);
});

test('Lista el catálogo completo sin inventar cursos ni devolver el precio de Excel', async () => {
  const lista = await preguntar('¿Qué cursos tienen?');
  assert.equal(lista.split('\n').filter((line) => line.startsWith('• ')).length, 14);
  assert.match(lista, /Excel Avanzado/);
  assert.match(lista, /Automatización de Procesos con Herramientas No Code/);
  assert.doesNotMatch(lista, /Medicina|450\.000/);
});

test('Pide aclaración ante varios cursos y no convierte cursos ausentes en conocidos', async () => {
  const ambiguo = await preguntar('Precio de Python y Excel');
  assert.match(ambiguo, /Mencionaste varios cursos/);
  assert.match(ambiguo, /Cuál quieres consultar primero/);
  assert.doesNotMatch(ambiguo, /COP/);
  assert.match(await preguntar('Precio del curso de Medicina'), /No puedo identificar un curso/);
  assert.match(await preguntar('Precio de Excel básico'), /No encuentro ese nivel/);
  assert.doesNotMatch(await preguntar('¿Cuánto cuesta?'), /450\.000/);
});

test('No inventa datos fuera del catálogo ni acciones de asesoría', async () => {
  const respuesta = await preguntar('¿Qué certificado recibo con Python?');
  assert.match(respuesta, /No tengo ese dato/);
  assert.doesNotMatch(respuesta, /transfer|registr|asesor disponible|certificado oficial/);
  assert.match(await preguntar('¿Cuál es la duración de SQL?'), /7 semanas/);
});

test('Una petición general de información resume el curso, no solo sus requisitos', async () => {
  const respuesta = await preguntar('Necesito información de Python');
  assert.match(respuesta, /620\.000 COP/);
  assert.match(respuesta, /2026-10-20/);
  assert.match(respuesta, /8 semanas/);
  assert.match(respuesta, /Modalidades: virtual/);
});

test('Funciona mediante el servicio real de consulta sin API ni red', async () => {
  const consultar = crearAsistente({ apiKey: 'demo-local', fetchImpl: createDemoFetch() });
  const result = await consultar('¿Cuánto cuesta Marketing Digital?');
  assert.equal(result.status, 200);
  assert.match(result.respuesta, /Marketing Digital y Redes Sociales/);
  assert.match(result.respuesta, /490\.000 COP/);
});

test('Sin fecha del prompt utiliza el día en Bogotá del reloj inyectado', async () => {
  const fetchImpl = createDemoFetch({ now: () => new Date('2026-10-14T01:00:00Z') });
  const response = await fetchImpl('', {
    body: JSON.stringify({ contents: [{ parts: [{ text: 'Fechas de Power BI' }] }] }),
  });
  assert.match((await response.json()).candidates[0].content.parts[0].text, /2026-10-13 y 2026-11-24/);
});
