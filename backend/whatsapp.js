import express from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { mensajeValido } from './asistente.js';

const DEDUP_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_RECORDS = 10000;
const MAX_PENDING = 100;
const FALLBACK = 'No pude responder en este momento. Intenta de nuevo más tarde o consulta con un asesor.';

export function configuracionWhatsApp(env = process.env) {
  return {
    verifyToken: env.WHATSAPP_VERIFY_TOKEN,
    accessToken: env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
    appSecret: env.META_APP_SECRET,
    apiVersion: env.WHATSAPP_API_VERSION || 'v23.0',
  };
}

function firmaValida(body, signature, secret) {
  if (!Buffer.isBuffer(body) || typeof signature !== 'string'
    || !/^sha256=[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(body).digest();
  return timingSafeEqual(expected, Buffer.from(signature.slice(7), 'hex'));
}

function* valoresMensajes(payload, phoneNumberId) {
  if (payload?.object !== 'whatsapp_business_account' || !Array.isArray(payload.entry)) return;
  for (const entry of payload.entry) {
    if (!Array.isArray(entry?.changes)) continue;
    for (const change of entry.changes) {
      const value = change?.value;
      if (change?.field === 'messages' && value?.metadata?.phone_number_id === phoneNumberId) yield value;
    }
  }
}

function mensajesEntrantes(payload, phoneNumberId) {
  const result = [];
  for (const value of valoresMensajes(payload, phoneNumberId)) {
    // Los estados nunca generan respuestas; los fallos sí ayudan a diagnosticar.
    for (const status of Array.isArray(value.statuses) ? value.statuses : []) {
      if (status?.status !== 'failed') continue;
      const codes = (Array.isArray(status.errors) ? status.errors : [])
        .map((error) => error?.code).filter(Number.isInteger);
      console.error(`WhatsApp: Meta notificó una entrega fallida${codes.length ? ` (códigos ${codes.join(', ')})` : ''}.`);
    }
    for (const message of Array.isArray(value.messages) ? value.messages : []) {
      if (typeof message?.id !== 'string' || !message.id || message.id.length > 512
        || typeof message.from !== 'string' || !/^\d{5,20}$/.test(message.from)
        || typeof message.type !== 'string' || !message.type) continue;
      result.push(message);
    }
  }
  return result;
}

// Se cuenta UTF-16 de forma conservadora y se conservan los pares sustitutos.
function limitarRespuesta(text) {
  if (text.length <= 4096) return text;
  const suffix = '\n[Respuesta abreviada. Haz una pregunta más específica.]';
  let result = '';
  for (const character of text) {
    if (result.length + character.length > 4096 - suffix.length) break;
    result += character;
  }
  return result + suffix;
}

export function crearWebhookWhatsApp({ config, consultar, fetchImpl = globalThis.fetch }) {
  const router = express.Router();
  const settings = Object.fromEntries(Object.entries(config || {})
    .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : '']));
  const { verifyToken, accessToken, phoneNumberId, appSecret, apiVersion } = settings;
  const configured = Boolean(verifyToken && accessToken && appSecret
    && /^\d+$/.test(phoneNumberId || '') && /^v\d+\.\d+$/.test(apiVersion || ''));
  const records = new Map();
  const queues = new Map();
  let pending = 0;

  router.get('/', (req, res) => {
    if (!verifyToken) return res.status(503).json({ error: 'Falta configurar WhatsApp en el servidor.' });
    const challenge = req.query['hub.challenge'];
    if (req.query['hub.mode'] !== 'subscribe' || req.query['hub.verify_token'] !== verifyToken
      || typeof challenge !== 'string' || !challenge) {
      return res.status(403).json({ error: 'Verificación rechazada.' });
    }
    return res.status(200).type('text/plain').send(challenge);
  });

  async function enviarTexto(to, text) {
    const response = await fetchImpl(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          messaging_product: 'whatsapp', recipient_type: 'individual', to,
          type: 'text', text: { preview_url: false, body: limitarRespuesta(text) },
        }),
      },
    );
    if (!response.ok) {
      // El cuerpo de error de Meta puede contener datos personales: solo código y HTTP.
      let code;
      try { code = (await response.json())?.error?.code; } catch { /* No es JSON. */ }
      const safeCode = Number.isInteger(code) ? `, código ${code}` : '';
      console.error(`WhatsApp: envío rechazado (HTTP ${response.status}${safeCode}).`);
      return;
    }
    const data = await response.json();
    if (!Array.isArray(data?.messages) || typeof data.messages[0]?.id !== 'string') {
      console.error('WhatsApp: Meta devolvió una confirmación de envío inesperada.');
    }
  }

  async function procesar(message) {
    let text;
    if (message.type !== 'text') {
      text = 'Por ahora solo puedo responder mensajes de texto. Escribe tu pregunta e incluye el nombre del curso.';
    } else if (!mensajeValido(message.text?.body)) {
      text = 'Escribe una pregunta de 1 a 1000 caracteres e incluye el nombre del curso.';
    } else {
      try {
        const result = await consultar(message.text.body);
        text = result.status === 200 && typeof result.respuesta === 'string' && result.respuesta.trim()
          ? result.respuesta.trim() : FALLBACK;
      } catch {
        text = FALLBACK;
      }
    }
    await enviarTexto(message.from, text);
  }

  function encolar(message) {
    const previous = queues.get(message.from) || Promise.resolve();
    const job = previous.then(() => procesar(message)).catch(() => {
      // No se imprime el error original: podría incluir tokens, teléfonos o texto.
      console.error('WhatsApp: no se pudo completar el envío; revisa la conexión y la configuración.');
    }).finally(() => {
      pending--;
      records.set(message.id, { pending: false, expires: Date.now() + DEDUP_TTL_MS });
      if (queues.get(message.from) === job) queues.delete(message.from);
    });
    queues.set(message.from, job);
  }

  // Debe montarse ANTES de express.json(): la firma usa los bytes originales.
  router.post('/', express.raw({ type: 'application/json', limit: '256kb', inflate: false }), (req, res) => {
    if (!configured) return res.status(503).json({ error: 'Falta configurar WhatsApp en el servidor.' });
    if (!req.is('application/json')) return res.status(415).json({ error: 'Envía el evento como JSON.' });
    if (!firmaValida(req.body, req.get('x-hub-signature-256'), appSecret)) {
      return res.status(403).json({ error: 'Firma del evento inválida.' });
    }
    let payload;
    try { payload = JSON.parse(req.body.toString('utf8')); } catch {
      return res.status(400).json({ error: 'El evento debe ser JSON válido.' });
    }
    const now = Date.now();
    for (const [id, record] of records) {
      if (!record.pending && record.expires <= now) records.delete(id);
    }
    const incoming = new Map();
    for (const message of mensajesEntrantes(payload, phoneNumberId)) {
      if (!records.has(message.id)) incoming.set(message.id, message);
    }
    // Rechazar todo el lote permite que Meta reintente sin perder parte del evento.
    if (incoming.size && (pending + incoming.size > MAX_PENDING || records.size + incoming.size > MAX_RECORDS)) {
      return res.status(503).json({ error: 'El webhook está ocupado. Reintenta más tarde.' });
    }
    for (const message of incoming.values()) {
      records.set(message.id, { pending: true });
      pending++;
    }
    res.status(200).json({ status: 'ok' });
    setImmediate(() => {
      for (const message of incoming.values()) encolar(message);
    });
  });

  router.use((error, _req, res, _next) => {
    if (error.type === 'entity.too.large') return res.status(413).json({ error: 'El evento es demasiado grande.' });
    if (error.type === 'encoding.unsupported') return res.status(415).json({ error: 'Envía el evento sin comprimir.' });
    return res.status(400).json({ error: 'No se pudo leer el evento.' });
  });
  return router;
}
