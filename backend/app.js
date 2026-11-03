import express from 'express';
import {
  crearAsistente, historialValido, mensajeValido, requiereWhatsApp, solicitaInscripcion,
} from './asistente.js';
import { configuracionWhatsApp, crearWebhookWhatsApp } from './whatsapp.js';
import { crearAccesoChat } from './chat-access.js';

export function crearApp({
  apiKey = process.env.GEMINI_API_KEY,
  model = process.env.GEMINI_MODEL || 'gemini-3.6-flash',
  fetchImpl = globalThis.fetch,
  whatsapp = configuracionWhatsApp(),
  allowedOrigins = process.env.ALLOWED_ORIGINS || '',
  rateLimit,
  now,
} = {}) {
  const app = express();
  const consultar = crearAsistente({ apiKey, model, fetchImpl });
  app.disable('x-powered-by');
  app.use('/webhook', crearWebhookWhatsApp({ config: whatsapp, consultar, fetchImpl }));
  app.all('/chat', crearAccesoChat({ allowedOrigins, rateLimit, now }));
  app.use(express.json({ limit: '8kb' }));

  app.post('/chat', async (req, res) => {
    if (!req.is('application/json')) {
      return res.status(415).json({ error: 'Envía la pregunta como JSON.' });
    }
    const mensaje = req.body?.mensaje;
    if (!mensajeValido(mensaje)) {
      return res.status(400).json({ error: 'Escribe una pregunta de 1 a 1000 caracteres.' });
    }
    const historial = req.body?.historial;
    if (!historialValido(historial)) {
      return res.status(400).json({ error: 'El contexto de la conversación no es válido.' });
    }
    const { status, ...body } = await consultar(mensaje, historial);
    if (status === 200 && requiereWhatsApp(mensaje, body.respuesta)) {
      body.accion = 'whatsapp';
      if (solicitaInscripcion(mensaje)) {
        body.respuesta = '¡Claro! Para ayudarte con la inscripción y confirmar disponibilidad, continúa por WhatsApp con nuestro equipo. Haz clic en el botón de WhatsApp que aparece aquí.';
      }
    }
    return res.status(status).json(body);
  });

  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ error: 'La pregunta es demasiado larga.' });
    }
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser JSON válido.' });
    }
    return res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
  });
  return app;
}
