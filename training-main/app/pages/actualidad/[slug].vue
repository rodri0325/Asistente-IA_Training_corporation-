<script setup lang="ts">
import { findPost, news, newsImageSizes } from '~/data/news'
import type { NewsBlock } from '~/data/news'

const route = useRoute()
const post = findPost(String(route.params.slug))

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Publicación no encontrada', fatal: true })
}

// Consecutive list items become one <ul>.
type Chunk = { type: 'p' | 'h', text: string } | { type: 'ul', items: string[] }
const chunks = post.blocks.reduce<Chunk[]>((acc, b: NewsBlock) => {
  const last = acc.at(-1)
  if (b.type === 'li') {
    if (last?.type === 'ul') last.items.push(b.text)
    else acc.push({ type: 'ul', items: [b.text] })
  }
  else acc.push({ type: b.type, text: b.text })
  return acc
}, [])

const imageSize = post.image ? newsImageSizes[post.image] : undefined

const index = news.findIndex((n) => n.slug === post.slug)
const newer = news[index - 1]
const older = news[index + 1]

const description = post.blocks[0]?.text ?? post.title
usePageSeo({ title: post.title, description, image: post.image })

// Lets search engines read the item as a dated news article by the company.
const { siteUrl } = useRuntimeConfig().public
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': post.title.slice(0, 110),
      'datePublished': post.date,
      'image': post.image ? [`${siteUrl}${post.image}`] : [`${siteUrl}/og-image.png`],
      'mainEntityOfPage': `${siteUrl}/actualidad/${post.slug}`,
      'author': { '@type': 'Organization', 'name': 'Training Corporation S.A.S.', 'url': siteUrl },
      'publisher': { '@id': `${siteUrl}/#organizacion`, '@type': 'Organization', 'name': 'Training Corporation S.A.S.', 'logo': { '@type': 'ImageObject', 'url': `${siteUrl}/brand/logo-training-corporation.png` } },
    }),
  }],
})
</script>

<template>
  <article v-if="post" class="post">
    <PageHeader :title="post.title" :crumbs="[{ label: 'Actualidad', to: '/actualidad' }]">
      <time :datetime="post.date" class="post__date">{{ formatDate(post.date) }}</time>
    </PageHeader>

    <div class="frame grid-page post__grid">
      <figure v-if="post.image" class="post__figure">
        <NuxtImg format="webp" :src="post.image" :alt="post.imageAlt ?? ''" :width="imageSize?.[0]" :height="imageSize?.[1]" sizes="xs:100vw sm:100vw lg:900px" fetchpriority="high" class="post__img" />
      </figure>

      <div class="prose post__body">
        <template v-for="(c, i) in chunks" :key="i">
          <h2 v-if="c.type === 'h'" class="post__h">{{ c.text }}</h2>
          <ul v-else-if="c.type === 'ul'">
            <li v-for="it in c.items" :key="it">{{ it }}</li>
          </ul>
          <p v-else>{{ c.text }}</p>
        </template>
      </div>

      <nav class="post__nav" aria-label="Otras publicaciones">
        <NuxtLink v-if="older" :to="`/actualidad/${older.slug}`" class="post__navlink">
          <span class="post__navlabel">Anterior</span>{{ older.title }}
        </NuxtLink>
        <NuxtLink v-if="newer" :to="`/actualidad/${newer.slug}`" class="post__navlink post__navlink--next">
          <span class="post__navlabel">Siguiente</span>{{ newer.title }}
        </NuxtLink>
      </nav>
    </div>
  </article>
</template>

<style scoped>
.post__date {
  font-weight: 700;
  color: var(--color-azul-hondo);
}

.post__grid {
  row-gap: 3rem;
  padding-bottom: var(--spacing-section);
}

.post__figure,
.post__body,
.post__nav {
  grid-column: 1 / -1;
}

.post__figure {
  margin: 0;
}

.post__img {
  width: 100%;
  height: auto;
  max-height: 34rem;
  object-fit: cover;
}

.post__h {
  font-size: var(--text-xl);
  margin-top: 1.5em;
}

.post__nav {
  display: grid;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-azul);
}

.post__navlink {
  display: grid;
  gap: 0.25rem;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-azul);
  text-decoration: none;
}

.post__navlink:hover {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.post__navlabel {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  color: var(--color-pizarra);
}

@media (width >= 64rem) {
  .post__figure { grid-column: 1 / span 9; }
  .post__body { grid-column: 3 / span 7; }
  .post__nav { grid-column: 3 / span 8; grid-template-columns: 1fr 1fr; }
  .post__navlink--next { text-align: right; grid-column: 2; }
}
</style>
