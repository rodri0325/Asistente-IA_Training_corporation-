<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

/**
 * Opening of an inner page: breadcrumb, title and lede. `tone="azul"` puts it on
 * the brand-blue field (service pages); `aside` holds a ring photo or facts.
 */
const props = withDefaults(
  defineProps<{
    title: string
    lede?: string
    crumbs?: { label: string, to: string }[]
    /** Label for this page in the breadcrumb, when the title is a sentence. */
    crumb?: string
    tone?: 'blanco' | 'azul'
    /** Tight version for tool pages (the service explorer): content first. */
    compact?: boolean
  }>(),
  { tone: 'blanco', crumbs: () => [], compact: false },
)

const { siteUrl } = useRuntimeConfig().public
const route = useRoute()

// Arriving from another page, the header replays the home seal's language in
// short: the title rises line by line, the photo's ring draws and its dot lands.
// Not on the first load (the prerendered page is already painted) and not when
// moving within the same page, e.g. between lines of the service explorer.
const root = useTemplateRef<HTMLElement>('root')
const nuxtApp = useNuxtApp()
const router = useRouter()
const animate = import.meta.client && !nuxtApp.isHydrating && (() => {
  const back = router.options.history.state.back
  return typeof back !== 'string' || router.resolve(back).name !== route.name
})()

useMotion(root, ({ gsap, SplitText }) => {
  if (!animate) return
  const split = SplitText.create('.page-head__title', { type: 'lines', mask: 'lines' })
  // Back to plain text once it has landed (resizing, copying, screen readers).
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => split.revert() })
  tl.from(split.lines, { yPercent: 100, duration: 0.7, stagger: 0.08 })
    .from('.crumbs, .page-head__lede, .page-head__extra', { y: 12, opacity: 0, duration: 0.5, stagger: 0.06 }, 0.15)
  const arc = root.value?.querySelector<SVGElement>('.ring__arc')
  if (arc) {
    // One growing stroke: the gap stays at the full length while the dash grows,
    // so the pattern never repeats; the ring's own dash is restored at the end.
    const final = arc.getAttribute('stroke-dasharray') ?? '86 14'
    const length = Number.parseFloat(final)
    tl.fromTo(arc, { attr: { 'stroke-dasharray': '0 200' } }, { attr: { 'stroke-dasharray': `${length} 200` }, duration: 1, ease: 'power2.inOut', onComplete: () => arc.setAttribute('stroke-dasharray', final) }, 0)
      .from('.ring__dot', { scale: 0, transformOrigin: 'center', duration: 0.4, ease: 'back.out(2)' }, 0.8)
      .from('.ring__photo', { scale: 0.94, opacity: 0, duration: 0.6 }, 0.1)
  }
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ label: 'Inicio', to: '/' }, ...props.crumbs, { label: props.crumb ?? props.title, to: route.path }].map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.label,
        item: `${siteUrl}${c.to}`,
      })),
    }),
  }],
})
</script>

<template>
  <header ref="root" class="page-head" :class="[tone === 'azul' ? 'field-azul' : '', { 'page-head--bare': !$slots.aside, 'page-head--compact': compact }]">
    <div class="frame grid-page page-head__grid">
      <div class="page-head__text">
        <nav aria-label="Ruta de navegación" class="crumbs">
          <ol>
            <li><NuxtLink to="/">Inicio</NuxtLink></li>
            <li v-for="c in crumbs" :key="c.to">
              <ChevronRight aria-hidden="true" />
              <NuxtLink :to="c.to">{{ c.label }}</NuxtLink>
            </li>
            <li aria-current="page">
              <ChevronRight aria-hidden="true" />
              <span>{{ crumb ?? title }}</span>
            </li>
          </ol>
        </nav>
        <h1 class="heading page-head__title">{{ title }}</h1>
        <p v-if="lede" class="lede page-head__lede">{{ lede }}</p>
        <div v-if="$slots.default" class="page-head__extra">
          <slot />
        </div>
      </div>
      <div v-if="$slots.aside" class="page-head__aside">
        <slot name="aside" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.page-head {
  position: relative;
  overflow: hidden;
  padding-block: clamp(1.5rem, 1rem + 2vw, 3rem) var(--spacing-section-sm);
}

.page-head__grid {
  position: relative;
  row-gap: 2.5rem;
  align-items: center;
}

.page-head__text,
.page-head__aside {
  grid-column: 1 / -1;
}

.crumbs ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--text-xs);
  font-weight: 600;
}

.crumbs li {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.crumbs svg {
  width: 0.875rem;
  height: 0.875rem;
  opacity: 0.7;
}

.crumbs a {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, currentColor 40%, transparent);
  text-underline-offset: 0.2em;
}

.crumbs a:hover {
  text-decoration-color: currentColor;
}

.crumbs [aria-current] span {
  color: var(--color-pizarra);
}

/* Phones: the current page is the title right below; repeating a long title
   in the trail only wraps it onto a second line. */
@media (width < 40rem) {
  .crumbs li[aria-current] {
    display: none;
  }
}

.field-azul .crumbs [aria-current] span {
  color: inherit;
}

.page-head__title {
  max-width: 20ch;
  margin-top: 2rem;
}

.page-head:not(.field-azul) .page-head__title {
  color: var(--color-azul);
}

.page-head__lede {
  margin-top: 1.5rem;
}

.page-head:not(.field-azul) .page-head__lede {
  color: var(--color-pizarra);
}

.page-head__extra {
  margin-top: 2rem;
}

.page-head--compact {
  padding-block: 1.25rem 1.75rem;
}

.page-head--compact .page-head__title {
  max-width: none;
  margin-top: 1rem;
  font-size: var(--text-2xl);
  line-height: var(--text-2xl--line-height);
}

.page-head--compact .page-head__lede {
  margin-top: 0.75rem;
  font-size: var(--text-base);
}

.page-head--compact .page-head__extra {
  margin-top: 0.75rem;
}

@media (width < 40rem) {
  .page-head--compact {
    padding-block: 1rem 1.25rem;
  }

  .page-head--compact .page-head__lede {
    display: none;
  }
}

/* Below the two-column layout the photo sits under the text, at a size that
   leaves room for its ring instead of filling (and overflowing) the width. */
@media (width < 64rem) {
  .page-head__aside {
    width: min(100%, 22rem);
  }
}

@media (width >= 64rem) {
  .page-head__text {
    grid-column: 1 / span 8;
  }

  .page-head__aside {
    grid-column: 9 / -1;
  }
}
</style>
