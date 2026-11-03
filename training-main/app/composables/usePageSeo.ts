import { company } from '~/data/company'

interface PageSeo {
  title: string
  /** Exact title, brand placement included (the home page leads with the brand). */
  fullTitle?: string
  description: string
  image?: string
  noindex?: boolean
}

/** Cuts at a word boundary so search results never show a word broken in half. */
function clip(text: string, max: number) {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).replace(/[\s,;:.(]+\S*$/, '')}…`
}

/**
 * Unique title, description, canonical URL and Open Graph tags for a page.
 * Google shows about 60 characters of a title and 155–160 of a description:
 * the brand suffix is dropped when it would push the title past that, and
 * descriptions are clipped on a word.
 */
export function usePageSeo({ title, fullTitle: exactTitle, description: rawDescription, image, noindex = false }: PageSeo) {
  const route = useRoute()
  const { siteUrl } = useRuntimeConfig().public
  const canonical = `${siteUrl}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`
  const branded = `${title} | ${company.shortName}`
  const fullTitle = exactTitle ?? (branded.length <= 60 ? branded : title)
  const description = clip(rawDescription, 158)
  // Social networks need an absolute URL; pages without a photo share the brand card.
  const ogImage = `${siteUrl}${image ?? '/og-image.png'}`

  useSeoMeta({
    title: fullTitle,
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    ogType: 'website',
    ogUrl: canonical,
    ogSiteName: company.shortName,
    ogLocale: 'es_CO',
    ogImage,
    ogImageAlt: image ? title : 'Training Corporation: auditoría, formación y consultoría bajo norma',
    twitterImage: ogImage,
    twitterCard: 'summary_large_image',
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
  })

  useHead({ link: [{ rel: 'canonical', href: canonical }] })
}
