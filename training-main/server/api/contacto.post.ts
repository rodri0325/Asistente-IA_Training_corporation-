/**
 * Receives the contact form and forwards it to NUXT_CONTACT_WEBHOOK (any
 * service that accepts a JSON POST: Make, Zapier, Formspree, Power Automate…).
 * Without a webhook configured it answers 503 so the form can point people to
 * the phone and e-mail instead of pretending the message was delivered.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<ContactRequest>>(event)

  const request: ContactRequest = {
    nombre: String(body?.nombre ?? '').slice(0, 200),
    empresa: String(body?.empresa ?? '').slice(0, 200),
    correo: String(body?.correo ?? '').slice(0, 200),
    telefono: String(body?.telefono ?? '').slice(0, 40),
    tipo: (body?.tipo ?? '') as ContactRequest['tipo'],
    linea: String(body?.linea ?? '').slice(0, 100),
    mensaje: String(body?.mensaje ?? '').slice(0, 4000),
    servicios: Array.isArray(body?.servicios) ? body.servicios.slice(0, 61).map((x) => String(x).slice(0, 300)) : [],
    datos: body?.datos === true,
    web: String(body?.web ?? ''),
  }

  // Bots fill the hidden field; accept silently and drop.
  if (request.web) return { ok: true }

  const errors = validateContact(request)
  if (Object.keys(errors).length) {
    throw createError({ statusCode: 422, statusMessage: 'Datos incompletos', data: { errors } })
  }

  const { contactWebhook } = useRuntimeConfig(event)
  if (!contactWebhook) {
    throw createError({ statusCode: 503, statusMessage: 'Envío no configurado' })
  }

  const { web: _, ...payload } = request
  await $fetch(contactWebhook, {
    method: 'POST',
    body: { ...payload, recibido: new Date().toISOString(), origen: 'trainingcorporation.com.co/contacto' },
    timeout: 10000,
  }).catch(() => {
    throw createError({ statusCode: 502, statusMessage: 'No se pudo entregar el mensaje' })
  })

  return { ok: true }
})
