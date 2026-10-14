import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { crearApp } from '../backend/app.js';

const configuracion = {
  verifyToken: 'verificacion-ficticia', accessToken: 'acceso-ficticio',
  phoneNumberId: '123456789', appSecret: 'secreto-ficticio', apiVersion: 'v23.0',
};
const destinatario = '573001234567';
const metaUrl = `https://graph.facebook.com/v23.0/${configuracion.phoneNumberId}/messages`;

async function iniciar(t, options = {}) {
  const server = crearApp({
    apiKey: 'simulada', model: 'gemini-3.6-flash', whatsapp: configuracion, ...options,
  }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

function texto(id = 'wamid.prueba', body = '¿Cuánto cuesta Excel Avanzado?', from = destinatario) {
  return { id, from, timestamp: '1791824400', type: 'text', text: { body } };
}

function evento(messages = [texto()], phoneNumberId = configuracion.phoneNumberId) {
  return {
    object: 'whatsapp_business_account',
    entry: [{ id: 'cuenta-ficticia', changes: [{ field: 'messages', value: {
      messaging_product: 'whatsapp', metadata: { phone_number_id: phoneNumberId }, messages,
    } }] }],
  };
}

function firmar(raw, secret = configuracion.appSecret) {
  return `sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`;
}

function enviar(baseUrl, payload, options = {}) {
  const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return fetch(`${baseUrl}/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 'X-Hub-Signature-256': firmar(raw),
      ...options.headers,
    },
    body: raw,
    signal: AbortSignal.timeout(3000),
  });
}

function respuestaGemini(text) {
  return Response.json({ candidates: [{
    finishReason: 'STOP', content: { parts: [{ text }] },
  }] });
}

function diferido() {
  let resolve;
  const promise = new Promise((resolver) => { resolve = resolver; });
  return { promise, resolve };
}

async function esperar(predicate, description = 'procesamiento del webhook') {
  const end = Date.now() + 2000;
  while (!predicate()) {
    assert.ok(Date.now() < end, `Se agotó la espera: ${description}`);
    await delay(5);
  }
}

function simulador(respuesta = 'Excel Avanzado cuesta 450000 COP.') {
  const gemini = [];
  const meta = [];
  return {
    gemini, meta,
    fetchImpl: async (url, options) => {
      const llamada = { url, options, body: JSON.parse(options.body) };
      if (url === metaUrl) {
        meta.push(llamada);
        return Response.json({ messages: [{ id: `wamid.respuesta.${meta.length}` }] });
      }
      gemini.push(llamada);
      return respuestaGemini(respuesta);
    },
  };
}

test('Meta verifica el webhook mediante token y devuelve el challenge como texto', async (t) => {
  const baseUrl = await iniciar(t, { fetchImpl: () => assert.fail('No debe llamar a proveedores') });
  const params = new URLSearchParams({
    'hub.mode': 'subscribe', 'hub.verify_token': configuracion.verifyToken, 'hub.challenge': '123456',
  });
  const response = await fetch(`${baseUrl}/webhook?${params}`);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '123456');
  for (const changes of [
    { 'hub.verify_token': 'incorrecto' }, { 'hub.mode': 'otro' }, { 'hub.challenge': '' },
  ]) {
    const invalid = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) invalid.set(key, value);
    assert.equal((await fetch(`${baseUrl}/webhook?${invalid}`)).status, 403);
  }
});

test('Configuración ausente impide verificar o recibir eventos sin autenticar', async (t) => {
  const baseUrl = await iniciar(t, {
    whatsapp: { ...configuracion, verifyToken: '', appSecret: '' },
    fetchImpl: () => assert.fail('No debe llamar a proveedores'),
  });
  assert.equal((await fetch(`${baseUrl}/webhook?hub.mode=subscribe&hub.challenge=1&hub.verify_token=`)).status, 503);
  assert.equal((await enviar(baseUrl, evento())).status, 503);
});

test('Rechaza firma ausente, inválida, de longitud incorrecta o de otro cuerpo', async (t) => {
  const llamadas = [];
  const baseUrl = await iniciar(t, { fetchImpl: (...args) => { llamadas.push(args); return respuestaGemini('No'); } });
  for (const signature of ['', 'sha256=incorrecta', 'sha256=00', firmar('{}'), 'sha1=abc']) {
    const response = await enviar(baseUrl, evento(), { headers: { 'X-Hub-Signature-256': signature } });
    assert.equal(response.status, 403);
    assert.ok(!(await response.text()).includes(configuracion.appSecret));
  }
  assert.equal(llamadas.length, 0);
});

test('Valida tipo, JSON y límite del cuerpo antes de procesar mensajes', async (t) => {
  const sim = simulador();
  const baseUrl = await iniciar(t, sim);
  for (const [raw, headers, expected] of [
    ['{invalido', {}, 400],
    [JSON.stringify(evento()), { 'Content-Type': 'text/plain' }, 415],
    [JSON.stringify({ relleno: 'x'.repeat(256 * 1024) }), {}, 413],
  ]) {
    const response = await enviar(baseUrl, raw, { headers });
    assert.equal(response.status, expected);
  }
  assert.equal(sim.gemini.length, 0);
  assert.equal(sim.meta.length, 0);
});

test('La firma cubre los bytes originales y el texto recorre Gemini y WhatsApp', async (t) => {
  const sim = simulador();
  const baseUrl = await iniciar(t, sim);
  const response = await enviar(baseUrl, `\n${JSON.stringify(evento([texto('wamid.bytes', '  ¿Precio de Excel?  ')]), null, 2)}\n`);
  assert.equal(response.status, 200);
  await esperar(() => sim.meta.length === 1);
  assert.equal(sim.gemini.length, 1);
  assert.equal(sim.gemini[0].url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent');
  assert.equal(sim.gemini[0].options.headers['x-goog-api-key'], 'simulada');
  assert.equal(sim.gemini[0].body.contents[0].parts[0].text, '¿Precio de Excel?');
  assert.equal(sim.meta[0].options.method, 'POST');
  assert.equal(new Headers(sim.meta[0].options.headers).get('authorization'), 'Bearer acceso-ficticio');
  assert.equal(sim.meta[0].body.messaging_product, 'whatsapp');
  assert.equal(sim.meta[0].body.to, destinatario);
  assert.equal(sim.meta[0].body.type, 'text');
  assert.equal(sim.meta[0].body.text.body, 'Excel Avanzado cuesta 450000 COP.');
});

test('Acusa recibo antes de que Gemini termine y deduplica mientras está pendiente', async (t) => {
  const pendiente = diferido();
  t.after(() => pendiente.resolve(respuestaGemini('Respuesta final')));
  const sim = simulador();
  let geminiCalls = 0;
  const baseUrl = await iniciar(t, {
    fetchImpl: (url, options) => {
      if (url === metaUrl) return sim.fetchImpl(url, options);
      geminiCalls++;
      return pendiente.promise;
    },
  });
  const body = evento([texto('wamid.pendiente')]);
  const response = await enviar(baseUrl, body);
  assert.equal(response.status, 200);
  await esperar(() => geminiCalls === 1);
  assert.equal(sim.meta.length, 0);
  assert.equal((await enviar(baseUrl, body)).status, 200);
  assert.equal(geminiCalls, 1);
  pendiente.resolve(respuestaGemini('Respuesta final'));
  await esperar(() => sim.meta.length === 1);
  assert.equal((await enviar(baseUrl, body)).status, 200);
  // Un mensaje posterior del mismo remitente sirve de barrera para la cola.
  assert.equal((await enviar(baseUrl, evento([texto('wamid.posterior')]))).status, 200);
  await esperar(() => sim.meta.length >= 2);
  assert.equal(geminiCalls, 2);
  assert.equal(sim.meta.length, 2);
});

test('Procesa todos los entries, changes y mensajes manteniendo orden por remitente', async (t) => {
  const primero = diferido();
  t.after(() => primero.resolve(respuestaGemini('respuesta primera')));
  const preguntas = [];
  const enviados = [];
  const baseUrl = await iniciar(t, { fetchImpl: async (url, options) => {
    const body = JSON.parse(options.body);
    if (url === metaUrl) {
      enviados.push(body.text.body);
      return Response.json({ messages: [{ id: `wamid.envio.${enviados.length}` }] });
    }
    const pregunta = body.contents[0].parts[0].text;
    preguntas.push(pregunta);
    return pregunta === 'primera' ? primero.promise : respuestaGemini(`respuesta ${pregunta}`);
  } });
  const payload = evento([texto('wamid.1', 'primera'), texto('wamid.2', 'segunda')]);
  payload.entry[0].changes.push(evento([texto('wamid.3', 'tercera')]).entry[0].changes[0]);
  payload.entry.push(evento([texto('wamid.4', 'cuarta')]).entry[0]);
  assert.equal((await enviar(baseUrl, payload)).status, 200);
  await esperar(() => preguntas.length >= 1);
  assert.deepEqual(preguntas, ['primera']);
  assert.deepEqual(enviados, []);
  primero.resolve(respuestaGemini('respuesta primera'));
  await esperar(() => enviados.length >= 4);
  assert.deepEqual(preguntas, ['primera', 'segunda', 'tercera', 'cuarta']);
  assert.deepEqual(enviados, ['respuesta primera', 'respuesta segunda', 'respuesta tercera', 'respuesta cuarta']);
});

test('Un remitente pendiente no bloquea las respuestas a otro usuario', async (t) => {
  const primero = diferido();
  t.after(() => primero.resolve(respuestaGemini('primero')));
  const enviados = [];
  const baseUrl = await iniciar(t, { fetchImpl: async (url, options) => {
    const body = JSON.parse(options.body);
    if (url === metaUrl) {
      enviados.push(body.to);
      return Response.json({ messages: [{ id: 'wamid.enviado' }] });
    }
    return body.contents[0].parts[0].text === 'primero' ? primero.promise : respuestaGemini('segundo');
  } });
  assert.equal((await enviar(baseUrl, evento([
    texto('wamid.usuario1', 'primero'), texto('wamid.usuario2', 'segundo', '573009876543'),
  ]))).status, 200);
  await esperar(() => enviados.length === 1);
  assert.deepEqual(enviados, ['573009876543']);
  primero.resolve(respuestaGemini('primero'));
  await esperar(() => enviados.length === 2);
});

test('Ignora estados, otros números y lotes sin mensajes válidos', async (t) => {
  const sim = simulador();
  const baseUrl = await iniciar(t, sim);
  const statuses = evento([]);
  delete statuses.entry[0].changes[0].value.messages;
  statuses.entry[0].changes[0].value.statuses = [{ id: 'wamid.estado', status: 'delivered' }];
  const sinMetadata = evento();
  delete sinMetadata.entry[0].changes[0].value.metadata;
  for (const payload of [
    statuses, evento([texto()], 'otro-numero'), sinMetadata,
    null, {}, [], { object: 'otro', entry: evento().entry },
    { object: 'whatsapp_business_account', entry: {} },
    { object: 'whatsapp_business_account', entry: [null, {}, { changes: {} }, { changes: [null, {}] }] },
    evento([null, {}, { id: 'sin-remitente', type: 'text', text: { body: 'hola' } }]),
  ]) {
    assert.equal((await enviar(baseUrl, payload)).status, 200);
  }
  assert.equal(sim.gemini.length, 0);
  assert.equal(sim.meta.length, 0);
});

test('Registra únicamente códigos enteros de entrega fallida sin responder ni revelar datos sensibles', async (t) => {
  const logs = [];
  t.mock.method(console, 'error', (...args) => logs.push(args.join(' ')));
  const sim = simulador();
  const baseUrl = await iniciar(t, sim);
  const failed = {
    id: 'wamid.ID_SENSIBLE', status: 'failed', recipient_id: destinatario,
    errors: [
      { code: 131047, title: 'TITULO_SENSIBLE', message: configuracion.accessToken,
        error_data: { details: `DETALLE_SENSIBLE ${configuracion.appSecret}` } },
      { code: '131999' }, { code: 987.5 }, { code: 'TOKEN_SENSIBLE' }, null,
    ],
  };
  const payload = evento([]);
  const value = payload.entry[0].changes[0].value;
  delete value.messages;
  value.statuses = [failed];
  assert.equal((await enviar(baseUrl, payload)).status, 200);
  assert.equal(logs.length, 1);
  assert.match(logs[0], /131047/);
  for (const sensible of [
    destinatario, configuracion.accessToken, configuracion.appSecret,
    'ID_SENSIBLE', 'TITULO_SENSIBLE', 'DETALLE_SENSIBLE', 'TOKEN_SENSIBLE', '131999', '987.5',
  ]) {
    assert.ok(!logs[0].includes(sensible), `No debe registrar ${sensible}`);
  }
  value.statuses = ['delivered', 'read'].map((status) => ({ ...failed, status }));
  assert.equal((await enviar(baseUrl, payload)).status, 200);
  assert.equal(logs.length, 1);
  value.statuses = [failed];
  value.metadata.phone_number_id = '999999999';
  assert.equal((await enviar(baseUrl, payload)).status, 200);
  assert.equal(logs.length, 1);
  assert.equal(sim.gemini.length, 0);
  assert.equal(sim.meta.length, 0);
});

test('Un lote con elementos malformados conserva sus mensajes válidos', async (t) => {
  const sim = simulador();
  const baseUrl = await iniciar(t, sim);
  const payload = evento([null, {}, texto('wamid.valido'), { from: destinatario, type: 'text' }]);
  payload.entry.unshift(null, { changes: [null, {}] });
  payload.entry[2].changes.unshift(null, { field: 'otra-cosa', value: evento().entry[0].changes[0].value });
  assert.equal((await enviar(baseUrl, payload)).status, 200);
  await esperar(() => sim.meta.length >= 1);
  assert.equal(sim.gemini.length, 1);
  assert.equal(sim.meta.length, 1);
});

test('Audio, texto vacío y texto demasiado largo reciben orientación sin consultar Gemini', async (t) => {
  const sim = simulador();
  const baseUrl = await iniciar(t, sim);
  const messages = [
    { id: 'wamid.audio', from: destinatario, type: 'audio', audio: { id: 'archivo' } },
    texto('wamid.vacio', '   '), texto('wamid.largo', 'x'.repeat(1001)),
  ];
  assert.equal((await enviar(baseUrl, evento(messages))).status, 200);
  await esperar(() => sim.meta.length >= 3);
  assert.equal(sim.gemini.length, 0);
  assert.equal(sim.meta.length, 3);
  for (const llamada of sim.meta) {
    assert.equal(llamada.body.to, destinatario);
    assert.equal(typeof llamada.body.text.body, 'string');
    assert.ok(llamada.body.text.body.trim().length > 0);
  }
});

test('Fallos de Gemini envían una respuesta segura sin detalles del proveedor', async (t) => {
  for (const [nombre, fallo] of [
    ['cuota', () => new Response('ERROR_INTERNO_SECRETO', { status: 429 })],
    ['red', () => { throw new Error('ERROR_INTERNO_SECRETO'); }],
    ['respuesta inválida', () => Response.json({ candidates: [] })],
  ]) {
    await t.test(nombre, async (t) => {
      const sim = simulador();
      const baseUrl = await iniciar(t, { fetchImpl: (url, options) => (
        url === metaUrl ? sim.fetchImpl(url, options) : fallo()
      ) });
      const response = await enviar(baseUrl, evento());
      assert.equal(response.status, 200);
      assert.ok(!(await response.text()).includes('ERROR_INTERNO_SECRETO'));
      await esperar(() => sim.meta.length === 1);
      assert.ok(sim.meta[0].body.text.body.length > 0);
      assert.ok(!JSON.stringify(sim.meta[0].body).includes('ERROR_INTERNO_SECRETO'));
    });
  }
});

test('Un fallo de envío de Meta se contiene y permite procesar el siguiente mensaje', async (t) => {
  for (const [nombre, fallo] of [
    ['rechazo HTTP', () => new Response('ERROR_INTERNO_SECRETO', { status: 401 })],
    ['fallo de red', () => { throw new Error('ERROR_INTERNO_SECRETO'); }],
  ]) {
    await t.test(nombre, async (t) => {
      let intentos = 0;
      const baseUrl = await iniciar(t, { fetchImpl: async (url) => {
        if (url !== metaUrl) return respuestaGemini('Respuesta de prueba');
        intentos++;
        if (intentos === 1) return fallo();
        return Response.json({ messages: [{ id: 'wamid.recuperado' }] });
      } });
      const response = await enviar(baseUrl, evento([
        texto('wamid.error-meta'), texto('wamid.despues-error'),
      ]));
      assert.equal(response.status, 200);
      assert.ok(!(await response.text()).includes('ERROR_INTERNO_SECRETO'));
      await esperar(() => intentos === 2);
    });
  }
});

test('Abrevia respuestas extensas dentro de 4096 caracteres sin romper los emojis', async (t) => {
  // Ambas paridades hacen que un corte ingenuo pueda separar un par sustituto.
  for (const prefix of ['', 'A']) {
    const respuesta = `${prefix}${'🚀'.repeat(2500)}`;
    const sim = simulador(respuesta);
    const baseUrl = await iniciar(t, sim);
    assert.equal((await enviar(baseUrl, evento())).status, 200);
    await esperar(() => sim.meta.length === 1);
    const enviada = sim.meta[0].body.text.body;
    assert.ok(enviada.length > 0 && enviada.length <= 4096);
    assert.ok(enviada.startsWith(`${prefix}🚀`));
    assert.equal(enviada.isWellFormed(), true);
  }
});

test('Rechaza un lote de 101 mensajes completo y permite reintentar un lote menor', async (t) => {
  const sim = simulador();
  const baseUrl = await iniciar(t, sim);
  const messages = Array.from({ length: 101 }, (_, index) => texto(`wamid.limite.${index}`));
  assert.equal((await enviar(baseUrl, evento(messages))).status, 503);
  assert.equal(sim.gemini.length, 0);
  assert.equal(sim.meta.length, 0);
  // Los IDs del lote rechazado siguen disponibles; no hubo aceptación parcial.
  assert.equal((await enviar(baseUrl, evento(messages.slice(0, 2)))).status, 200);
  await esperar(() => sim.meta.length >= 2);
  assert.equal(sim.gemini.length, 2);
  assert.equal(sim.meta.length, 2);
});

test('Un timeout de Meta no reenvía un ID duplicado y permite continuar con IDs nuevos', async (t) => {
  let consultas = 0;
  const intentos = [];
  const baseUrl = await iniciar(t, { fetchImpl: async (url, options) => {
    if (url !== metaUrl) {
      consultas++;
      return respuestaGemini(JSON.parse(options.body).contents[0].parts[0].text);
    }
    intentos.push(JSON.parse(options.body).text.body);
    if (intentos.length === 1) throw new DOMException('ERROR_INTERNO_SECRETO', 'AbortError');
    return Response.json({ messages: [{ id: `wamid.confirmado.${intentos.length}` }] });
  } });
  const fallido = texto('wamid.timeout', 'Mensaje con timeout');
  assert.equal((await enviar(baseUrl, evento([
    fallido, texto('wamid.barrera', 'Mensaje después del timeout'),
  ]))).status, 200);
  // La segunda entrega del mismo remitente demuestra que finalizó el primer trabajo.
  await esperar(() => intentos.length >= 2);
  assert.equal((await enviar(baseUrl, evento([fallido]))).status, 200);
  assert.equal((await enviar(baseUrl, evento([
    texto('wamid.nuevo', 'Mensaje después del duplicado'),
  ]))).status, 200);
  await esperar(() => intentos.length >= 3);
  assert.equal(consultas, 3);
  assert.deepEqual(intentos, [
    'Mensaje con timeout', 'Mensaje después del timeout', 'Mensaje después del duplicado',
  ]);
});
