import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createHmac } from 'node:crypto';
import { crearApp } from '../backend/app.js';
import { crearAccesoChat } from '../backend/chat-access.js';

async function iniciar(t, options = {}) {
  let llamadas = 0;
  const app = crearApp({
    apiKey: 'simulada', allowedOrigins: '',
    fetchImpl: async () => {
      llamadas++;
      return Response.json({ candidates: [{
        finishReason: 'STOP', content: { parts: [{ text: 'Respuesta simulada.' }] },
      }] });
    },
    ...options,
  });
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return { base: `http://127.0.0.1:${server.address().port}`, llamadas: () => llamadas, app };
}

function preguntar(base, headers = {}) {
  return fetch(`${base}/chat`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ mensaje: '¿Tienen cursos de Excel?' }),
  });
}

function previa(base, headers = {}) {
  return fetch(`${base}/chat`, {
    method: 'OPTIONS', headers: {
      Origin: 'https://wordpress.example',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type', ...headers,
    },
  });
}

test('WordPress autorizado recibe respuesta y CORS exacto con origen normalizado', async (t) => {
  const { base, llamadas } = await iniciar(t, {
    allowedOrigins: ' HTTPS://WORDPRESS.EXAMPLE:443/, http://localhost:8080 ',
  });
  for (const origin of ['https://wordpress.example', 'http://localhost:8080']) {
    const response = await preguntar(base, { Origin: origin });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('access-control-allow-origin'), origin);
    assert.equal(response.headers.get('access-control-allow-credentials'), null);
    assert.match(response.headers.get('vary'), /Origin/);
    assert.deepEqual(await response.json(), { respuesta: 'Respuesta simulada.' });
  }
  assert.equal(llamadas(), 2);
});

test('La web del backend y las herramientas sin Origin siguen funcionando', async (t) => {
  const { base, llamadas } = await iniciar(t);
  assert.equal((await preguntar(base, { Origin: base })).status, 200);
  const sinOrigen = await preguntar(base);
  assert.equal(sinOrigen.status, 200);
  assert.equal(sinOrigen.headers.get('access-control-allow-origin'), null);
  assert.match(sinOrigen.headers.get('vary'), /Origin/);
  assert.equal(llamadas(), 2);
});

test('Orígenes ajenos, null o inválidos se rechazan antes de leer JSON o llamar a Gemini', async (t) => {
  const { base, llamadas } = await iniciar(t, { allowedOrigins: 'https://wordpress.example' });
  for (const origin of [
    'https://ajeno.example', 'null', 'https://wordpress.example.evil',
    'http://wordpress.example', 'https://wordpress.example:444',
    'https://wordpress.example/path', 'https://user@wordpress.example',
    'https://wordpress.example\\path',
    'https://wordpress.example https://ajeno.example',
  ]) {
    const response = await fetch(`${base}/chat`, {
      method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{inválido',
    });
    assert.equal(response.status, 403, origin);
    assert.equal(response.headers.get('access-control-allow-origin'), null);
    assert.match(response.headers.get('vary'), /Origin/);
  }
  assert.equal(llamadas(), 0);
});

test('OPTIONS permite POST con Content-Type y no consume cuota', async (t) => {
  const { base, llamadas } = await iniciar(t, {
    allowedOrigins: 'https://wordpress.example', rateLimit: { max: 1 },
  });
  for (let index = 0; index < 3; index++) {
    const response = await previa(base, { 'Access-Control-Request-Headers': 'Content-Type' });
    assert.equal(response.status, 204);
    assert.equal(await response.text(), '');
    assert.equal(response.headers.get('access-control-allow-origin'), 'https://wordpress.example');
    assert.equal(response.headers.get('access-control-allow-methods'), 'POST');
    assert.equal(response.headers.get('access-control-allow-headers'), 'Content-Type');
    assert.match(response.headers.get('vary'), /Access-Control-Request-Headers/);
  }
  assert.equal(llamadas(), 0);
  assert.equal((await preguntar(base, { Origin: 'https://wordpress.example' })).status, 200);
  assert.equal(llamadas(), 1);
});

test('Rechaza preflight de otros orígenes, métodos o cabeceras y métodos de chat ajenos', async (t) => {
  const { base, llamadas } = await iniciar(t, { allowedOrigins: 'https://wordpress.example' });
  for (const headers of [
    { Origin: 'https://ajeno.example' },
    { 'Access-Control-Request-Method': 'DELETE' },
    { 'Access-Control-Request-Headers': 'content-type, authorization' },
  ]) assert.equal((await previa(base, headers)).status, 403);
  const response = await fetch(`${base}/chat`, { method: 'GET' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'POST, OPTIONS');
  assert.equal(llamadas(), 0);
});

test('La cuota usa la IP real y se reinicia al terminar la ventana', async (t) => {
  let time = 1000;
  const { base, llamadas, app } = await iniciar(t, {
    allowedOrigins: 'https://wordpress.example',
    rateLimit: { max: 2, windowMs: 3000 }, now: () => time,
  });
  assert.equal(app.get('trust proxy'), false);
  assert.equal((await preguntar(base)).status, 200);
  assert.equal((await preguntar(base, { Origin: base })).status, 200);
  const limitada = await preguntar(base, {
    Origin: 'https://wordpress.example', 'X-Forwarded-For': '198.51.100.2',
  });
  assert.equal(limitada.status, 429);
  assert.equal(limitada.headers.get('retry-after'), '3');
  assert.equal(limitada.headers.get('access-control-allow-origin'), 'https://wordpress.example');
  assert.equal(limitada.headers.get('access-control-expose-headers'), 'Retry-After');
  assert.equal(llamadas(), 2);
  time = 3500;
  assert.equal((await preguntar(base)).headers.get('retry-after'), '1');
  time = 4000;
  assert.equal((await preguntar(base)).status, 200);
  assert.equal(llamadas(), 3);
});

test('Los orígenes rechazados no consumen cuota de preguntas', async (t) => {
  const { base } = await iniciar(t, { rateLimit: { max: 1 } });
  assert.equal((await preguntar(base, { Origin: 'https://ajeno.example' })).status, 403);
  assert.equal((await preguntar(base)).status, 200);
});

test('El webhook conserva su cuerpo firmado y no recibe CORS ni cuota de chat', async (t) => {
  const config = {
    verifyToken: 'verificacion-simulada', accessToken: 'simulado',
    phoneNumberId: '12345', appSecret: 'secreto-simulado', apiVersion: 'v23.0',
  };
  const { base, llamadas } = await iniciar(t, { whatsapp: config, rateLimit: { max: 1 } });
  await preguntar(base);
  assert.equal((await preguntar(base)).status, 429);
  const params = new URLSearchParams({
    'hub.mode': 'subscribe', 'hub.verify_token': config.verifyToken, 'hub.challenge': '1234',
  });
  const verify = await fetch(`${base}/webhook?${params}`, { headers: { Origin: 'null' } });
  assert.equal(verify.status, 200);
  assert.equal(await verify.text(), '1234');
  assert.equal(verify.headers.get('access-control-allow-origin'), null);
  const raw = JSON.stringify({ object: 'whatsapp_business_account', entry: [] });
  const signed = await fetch(`${base}/webhook`, {
    method: 'POST', headers: {
      Origin: 'https://ajeno.example', 'Content-Type': 'application/json',
      'X-Hub-Signature-256': `sha256=${createHmac('sha256', config.appSecret).update(raw).digest('hex')}`,
    }, body: raw,
  });
  assert.equal(signed.status, 200);
  assert.equal(signed.headers.get('access-control-allow-origin'), null);
  assert.equal(llamadas(), 1);
});

test('Rechaza una configuración de orígenes o límites ambigua al iniciar', () => {
  for (const origin of ['*', 'null', 'ftp://example.com', 'https://*.example.com',
    'https://user:password@example.com', 'https://example.com/path', 'https://example.com/?x=1',
    'https://example.com\\path']) {
    assert.throws(() => crearAccesoChat({ allowedOrigins: origin }), /ALLOWED_ORIGINS/);
  }
  for (const rateLimit of [{ max: 0 }, { windowMs: -1 }, { maxEntries: 1.5 }]) {
    assert.throws(() => crearAccesoChat({ rateLimit }), /enteros positivos/);
  }
});

test('El registro de IP tiene capacidad acotada y recupera espacio tras expirar', () => {
  let time = 0;
  const access = crearAccesoChat({ rateLimit: { max: 2, windowMs: 1000, maxEntries: 2 }, now: () => time });
  function solicitar(ip) {
    const response = {
      code: null, vary() {}, set() {},
      status(code) { this.code = code; return this; }, json() {},
    };
    access({ method: 'POST', ip, get: () => undefined }, response, () => { response.code = 200; });
    return response.code;
  }
  assert.equal(solicitar('192.0.2.1'), 200);
  assert.equal(solicitar('192.0.2.2'), 200);
  assert.equal(solicitar('192.0.2.3'), 429);
  assert.equal(solicitar('192.0.2.1'), 200);
  assert.equal(solicitar('192.0.2.1'), 429);
  time = 1000;
  assert.equal(solicitar('192.0.2.3'), 200);
});
