<script setup lang="ts">
import { Download } from '@lucide/vue'
import { findService, services, modes, countOffers, servicePath } from '~/data/services'
import { cases } from '~/data/company'
import { courses } from '~/data/courses'

const route = useRoute()
const service = findService(String(route.params.slug))

if (!service) {
  throw createError({ statusCode: 404, statusMessage: 'Servicio no encontrado', fatal: true })
}

const related = cases.filter((c) => c.line === service.slug)
const course = courses.find((c) => c.line === service.slug)
const others = services.filter((s) => s.slug !== service.slug)

usePageSeo({ title: service.seo.title, description: service.seo.description })
useServiceJsonLd(service, `/portafolio-de-servicios/${service.slug}`)
</script>

<template>
  <div v-if="service">
    <PageHeader
      :title="service.name"
      :lede="service.lede"
      tone="azul"
      :crumbs="[{ label: 'Servicios', to: '/portafolio-de-servicios' }]"
    >
      <UiButton :to="{ path: '/contacto', query: { linea: service.slug } }" variant="light">Solicitar una propuesta</UiButton>
      <template #aside>
        <aside class="norms" aria-labelledby="normas">
          <h2 id="normas" class="norms__title">Marco normativo</h2>
          <ul>
            <li v-for="f in service.frameworks" :key="f">{{ f }}</li>
          </ul>
          <a :href="service.sourcePdf" class="link norms__pdf" target="_blank" rel="noopener">
            <Download aria-hidden="true" />Portafolio completo (PDF)
          </a>
        </aside>
      </template>
    </PageHeader>

    <section class="section" aria-labelledby="alcance">
      <div class="frame grid-page detail">
        <div class="detail__context">
          <h2 id="alcance" class="subheading">Alcance</h2>
          <p class="lede">{{ service.context }}</p>
        </div>

        <nav class="jump" aria-label="Ir a un tipo de servicio">
          <a v-for="m in modes" :key="m.id" :href="`#${m.id}`" class="jump__link">
            {{ m.name }} <span class="jump__n">{{ countOffers(service, m.id) }}</span>
          </a>
        </nav>

        <div class="by-mode">
          <section v-for="m in modes" :id="m.id" :key="m.id" class="mode-block" :aria-labelledby="`${m.id}-t`">
            <header class="mode-block__head">
              <h3 :id="`${m.id}-t`" class="mode-block__title">{{ m.name }}</h3>
              <p class="muted">{{ m.summary }}</p>
              <NuxtLink :to="servicePath(m.id, service.slug)" class="link mode-block__link">
                Ver {{ m.name.toLowerCase() }} en otras líneas
              </NuxtLink>
            </header>
            <OfferList :mode="m.id" :line="service.slug" :line-name="service.name" :groups="service.offers[m.id]" />
          </section>
        </div>
      </div>
    </section>

    <section class="section field-nube" aria-labelledby="beneficios">
      <div class="frame grid-page benefits">
        <h2 id="beneficios" class="heading benefits__title">Lo que gana su organización</h2>
        <ul class="benefits__list">
          <li v-for="b in service.benefits" :key="b">{{ b }}</li>
        </ul>
      </div>
    </section>

    <section v-if="related.length || course" class="section" aria-labelledby="evidencia">
      <div class="frame">
        <h2 id="evidencia" class="heading evidence__title">En la práctica</h2>
        <div class="evidence">
          <article v-for="c in related" :key="c.client" class="ev">
            <div v-if="c.image" class="ev__ring">
              <BrandRing :src="c.image" :alt="c.imageAlt ?? ''" sizes="200px" :gap="20" :dot="false" />
            </div>
            <p class="ev__meta">{{ c.year }}, {{ c.client }}</p>
            <h3 class="ev__title">{{ c.title }}</h3>
            <p class="muted">{{ c.detail }}</p>
            <NuxtLink :to="`/actualidad/${c.newsSlug}`" class="link">Leer la publicación</NuxtLink>
          </article>
          <article v-if="course" class="ev ev--course">
            <p class="ev__meta">Formación</p>
            <h3 class="ev__title">{{ course.name }}</h3>
            <p class="muted">{{ course.hours }} horas, {{ course.mode.toLowerCase() }}. Certifica: {{ course.awards.join('; ') }}.</p>
            <NuxtLink to="/cursos-y-formaciones" class="link">Ver el programa</NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <nav class="others field-nube" aria-labelledby="otras">
      <div class="frame">
        <h2 id="otras" class="others__title">Otras líneas de servicio</h2>
        <ul class="others__list">
          <li v-for="o in others" :key="o.slug">
            <NuxtLink :to="`/portafolio-de-servicios/${o.slug}`">{{ o.name }}</NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <ContactBand :title="`Solicite una propuesta en ${service.short === 'HSEQ' ? 'HSEQ' : service.short.toLowerCase()}`" />
  </div>
</template>

<style scoped>
.detail {
  row-gap: 3rem;
}

.detail__context {
  grid-column: 1 / -1;
}

.detail__context .lede {
  margin-top: 1rem;
}

.norms {
  padding: 1.5rem 1.75rem;
  border: 2px solid rgb(255 255 255 / 0.55);
  border-radius: var(--radius-control);
}

.norms__title {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  letter-spacing: 0;
}

.norms ul {
  display: grid;
  font-weight: 600;
}

.norms li {
  padding-block: 0.5rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.3);
}

.norms__pdf {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.norms__pdf svg {
  width: 1.125rem;
  height: 1.125rem;
}

.jump {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.jump__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.375rem 0.5rem 0.375rem 1rem;
  border: 2px solid var(--color-azul);
  border-radius: var(--radius-control);
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-azul);
  text-decoration: none;
}

.jump__link:hover {
  background: var(--color-azul);
  color: var(--color-blanco);
}

.jump__n {
  display: grid;
  place-items: center;
  min-width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-full);
  background: var(--color-nube);
  font-size: 0.8125rem;
  color: var(--color-azul-hondo);
}

.by-mode {
  grid-column: 1 / -1;
  display: grid;
  gap: 3.5rem;
}

.mode-block {
  display: grid;
  gap: 1.5rem;
  padding-top: 1.75rem;
  border-top: 2px solid var(--color-azul);
  scroll-margin-top: calc(var(--header-offset) + 1.5rem);
}

.mode-block__title {
  font-size: var(--text-2xl);
  line-height: var(--text-2xl--line-height);
  color: var(--color-azul);
}

.mode-block__head .muted {
  margin-block: 0.5rem 0.75rem;
  max-width: 26rem;
}

.mode-block__link {
  font-size: var(--text-sm);
}

.benefits {
  row-gap: 2rem;
}

.benefits__title,
.benefits__list {
  grid-column: 1 / -1;
}

.benefits__list {
  display: grid;
  gap: 1.5rem;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
  font-weight: 600;
  letter-spacing: var(--tracking-snug);
}

.benefits__list li {
  padding-left: 1.25rem;
  border-left: 3px solid var(--color-azul-vivo);
}

/* One item per row, text always in the same column, so a case with a photo
   and the course without one line up. */
.evidence {
  display: grid;
  max-width: 56rem;
  margin-top: 2.5rem;
}

.ev {
  display: grid;
  align-content: start;
  gap: 0.75rem;
  padding-block: 2rem;
  border-top: 1px solid var(--color-linea);
}

.ev__ring {
  width: 8rem;
}

.ev__meta {
  font-weight: 700;
  color: var(--color-azul-hondo);
}

.ev__title {
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
}

.ev .link {
  justify-self: start;
}

.others {
  padding-block: var(--spacing-section-sm);
}

.others__title {
  font-size: 1rem;
  letter-spacing: 0;
  color: var(--color-azul-hondo);
}

.others__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 2rem;
  margin-top: 1rem;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
}

.others__list a {
  color: var(--color-azul);
  text-decoration: none;
}

.others__list a:hover {
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

@media (width >= 48rem) {
  .ev {
    grid-template-columns: 8rem minmax(0, 1fr);
    column-gap: var(--spacing-gutter);
  }

  .ev > * {
    grid-column: 2;
  }

  .ev > .ev__ring {
    grid-column: 1;
    grid-row: 1 / span 4;
  }
}

@media (width >= 64rem) {
  .detail__context {
    grid-column: 1 / span 8;
  }

  .mode-block {
    grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
    column-gap: var(--spacing-gutter);
  }

  .mode-block__head {
    position: sticky;
    top: calc(var(--header-offset) + 1.5rem);
    align-self: start;
  }

  .benefits__title {
    grid-column: 1 / span 5;
  }

  .benefits__list {
    grid-column: 7 / -1;
  }
}
</style>
