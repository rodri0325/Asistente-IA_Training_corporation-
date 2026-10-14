function normalizarOrigen(value) {
  if (typeof value !== 'string' || !/^https?:\/\/[^/?#\\\s]+\/?$/i.test(value)) return null;
  try {
    const url = new URL(value);
    if (url.username || url.password || url.hostname.includes('*')) return null;
    return url.origin;
  } catch { return null; }
}

export function crearAccesoChat({ allowedOrigins = '', rateLimit = {}, now = Date.now } = {}) {
  const permitidos = new Set();
  for (const value of allowedOrigins.split(',').map((value) => value.trim()).filter(Boolean)) {
    const origin = normalizarOrigen(value);
    if (!origin) throw new Error('ALLOWED_ORIGINS debe contener orígenes http(s) separados por comas, sin rutas ni comodines.');
    permitidos.add(origin);
  }
  const { max = 30, windowMs = 60000, maxEntries = 10000 } = rateLimit;
  if (![max, windowMs, maxEntries].every((value) => Number.isSafeInteger(value) && value > 0)) {
    throw new Error('Los límites de /chat deben ser enteros positivos.');
  }
  const registros = new Map();
  let proximaLimpieza = 0;
  function limpiar(time) {
    for (const [ip, registro] of registros) {
      if (registro.expires <= time) registros.delete(ip);
    }
    proximaLimpieza = time + Math.min(windowMs, 60000);
  }
  function rechazarLimite(res, waitMs) {
    res.set('Retry-After', String(Math.max(1, Math.ceil(waitMs / 1000))));
    return res.status(429).json({ error: 'Has enviado muchas preguntas. Espera un momento e intenta de nuevo.' });
  }

  return (req, res, next) => {
    res.vary('Origin');
    const enviado = req.get('Origin');
    if (enviado !== undefined) {
      const origin = normalizarOrigen(enviado);
      const propio = normalizarOrigen(`${req.protocol}://${req.get('host')}`);
      if (!origin || (origin !== propio && !permitidos.has(origin))) {
        return res.status(403).json({ error: 'Este sitio no tiene permiso para usar el asistente.' });
      }
      res.set('Access-Control-Allow-Origin', enviado);
      res.set('Access-Control-Expose-Headers', 'Retry-After');
    }
    if (req.method === 'OPTIONS') {
      res.vary('Access-Control-Request-Method');
      res.vary('Access-Control-Request-Headers');
      const headers = (req.get('Access-Control-Request-Headers') || '')
        .split(',').map((header) => header.trim().toLowerCase()).filter(Boolean);
      if (req.get('Access-Control-Request-Method') !== 'POST'
        || headers.some((header) => header !== 'content-type')) {
        return res.status(403).json({ error: 'La solicitud previa no está permitida.' });
      }
      if (enviado !== undefined) {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '600');
      }
      return res.sendStatus(204);
    }
    if (req.method !== 'POST') {
      res.set('Allow', 'POST, OPTIONS');
      return res.status(405).json({ error: 'Usa POST para enviar una pregunta.' });
    }
    const time = now();
    if (time >= proximaLimpieza) limpiar(time);
    // Express no confía en X-Forwarded-For por defecto; la cuota usa la IP de la conexión.
    const ip = req.ip || req.socket.remoteAddress;
    let registro = registros.get(ip);
    if (!registro || registro.expires <= time) {
      if (registros.size >= maxEntries) limpiar(time);
      if (!registro && registros.size >= maxEntries) return rechazarLimite(res, windowMs);
      registro = { count: 0, expires: time + windowMs };
      registros.set(ip, registro);
    }
    if (registro.count >= max) return rechazarLimite(res, registro.expires - time);
    registro.count++;
    next();
  };
}
