import { services, modes } from '~~/app/data/services'
import { news } from '~~/app/data/news'

// Built from the same data as the pages, so a new service or post is listed
// automatically. Internal pages (/sistema) are intentionally left out.
const staticPaths = [
  '/', '/portafolio-de-servicios', '/cursos-y-formaciones', '/clientes', '/actualidad',
  '/empresa', '/empresa/equipo', '/empresa/sistema-de-gestion-integrado', '/contratistas', '/contacto',
]

export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const entries = [
    ...staticPaths.map((path) => ({ path })),
    ...services.map((s) => ({ path: `/portafolio-de-servicios/${s.slug}` })),
    ...modes.flatMap((m) => [{ path: `/servicios/${m.id}` }, ...services.map((s) => ({ path: `/servicios/${m.id}/${s.slug}` }))]),
    ...news.map((n) => ({ path: `/actualidad/${n.slug}`, lastmod: n.date })),
  ]
  const urls = entries
    .map((e) => `  <url><loc>${siteUrl}${e.path}</loc>${'lastmod' in e ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
