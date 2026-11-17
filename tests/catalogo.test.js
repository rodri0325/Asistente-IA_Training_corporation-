import test from 'node:test';
import assert from 'node:assert/strict';
import { cargarCatalogo } from '../backend/catalogo.js';

test('Carga cursos y servicios, y conserva ids únicos', () => {
  const catalogo = cargarCatalogo();
  const ids = catalogo.map(({ id }) => id);

  assert.equal(catalogo.length, 177);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(catalogo.filter(({ tipo }) => tipo === 'curso').length, 84);
  assert.equal(catalogo.filter(({ tipo }) => tipo === 'servicio').length, 93);

  const cursos = catalogo.filter(({ tipo }) => tipo === 'curso');
  const servicios = catalogo.filter(({ tipo }) => tipo === 'servicio');
  assert.ok(cursos.every((curso) => !Object.hasOwn(curso, 'precio')));
  assert.ok(servicios.every((servicio) => (
    !Object.hasOwn(servicio, 'precio')
    && Object.values(servicio).every((valor) => valor !== null)
  )));
});
