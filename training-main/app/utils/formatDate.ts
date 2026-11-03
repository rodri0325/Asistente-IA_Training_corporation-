const formatter = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** "2024-04-18" → "18 de abril de 2024" (auto-imported as a Nuxt util). */
export const formatDate = (iso: string) => formatter.format(new Date(`${iso}T00:00:00Z`))
