/**
 * Contact request: one definition shared by the form (client) and the API
 * route (server), so both validate the same way.
 */

export const requestKinds = [
  { value: 'cotizacion', label: 'Cotización de un servicio' },
  { value: 'formacion', label: 'Información sobre formación' },
  { value: 'pqr', label: 'Petición, queja o reclamo' },
  { value: 'otro', label: 'Otro asunto' },
] as const

export type RequestKind = (typeof requestKinds)[number]['value']

export interface ContactRequest {
  nombre: string
  empresa: string
  correo: string
  telefono: string
  tipo: RequestKind | ''
  linea: string
  mensaje: string
  /** Services marked in the explorer, as "Unidad, línea: servicio". */
  servicios: string[]
  datos: boolean
  /** Honeypot: humans leave it empty. */
  web: string
}

export type ContactErrors = Partial<Record<keyof ContactRequest, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateContact(r: ContactRequest): ContactErrors {
  const e: ContactErrors = {}
  if (r.nombre.trim().length < 2) e.nombre = 'Escriba su nombre.'
  if (!emailPattern.test(r.correo.trim())) e.correo = 'Escriba un correo con el formato nombre@empresa.com.'
  if (r.telefono && !/^[\d\s()+-]{7,20}$/.test(r.telefono)) e.telefono = 'Escriba solo números, espacios o el signo +.'
  if (!requestKinds.some((k) => k.value === r.tipo)) e.tipo = 'Elija el tipo de solicitud.'
  // A message is optional when the request already lists services.
  if (!r.servicios.length && r.mensaje.trim().length < 10) e.mensaje = 'Cuéntenos en al menos una frase qué necesita.'
  if (r.servicios.length > 60) e.servicios = 'La solicitud tiene demasiados servicios; envíe máximo 60.'
  if (r.mensaje.length > 4000) e.mensaje = 'El mensaje supera los 4.000 caracteres.'
  if (!r.datos) e.datos = 'Necesitamos su autorización para responderle.'
  return e
}
