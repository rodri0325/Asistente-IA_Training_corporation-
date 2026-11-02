<script setup lang="ts">
import { sectors, clientsIn } from '~/data/clients'

usePageSeo({
  title: 'Clientes',
  description: 'Organizaciones que han confiado en nuestro trabajo: empresas de energía y servicios públicos, gobierno, educación, industria, laboratorios y más, en quince sectores.',
})

// Duplicates across sectors (EPM, CENS appear under laboratories too) are kept, as on the source page.
const groups = sectors.map((s) => ({ ...s, clients: clientsIn(s.id) })).filter((g) => g.clients.length)
const total = new Set(groups.flatMap((g) => g.clients.map((c) => c.name))).size
</script>

<template>
  <div>
    <PageHeader
      title="Clientes que han confiado en nuestro trabajo"
      :lede="`${total} organizaciones en ${groups.length} sectores. La mayor parte de nuestra experiencia está en el sector eléctrico colombiano.`"
    />

    <nav class="jump" aria-label="Sectores">
      <div class="frame">
        <ul class="jump__list">
          <li v-for="g in groups" :key="g.id">
            <a :href="`#${g.id}`">{{ g.name }} <span>{{ g.clients.length }}</span></a>
          </li>
        </ul>
      </div>
    </nav>

    <div class="frame sectors">
      <section v-for="g in groups" :id="g.id" :key="g.id" class="sector" :class="{ 'sector--lead': g.id === 'energia' }" :aria-labelledby="`${g.id}-t`">
        <h2 :id="`${g.id}-t`" class="sector__title">{{ g.name }}</h2>
        <ul class="logos">
          <li v-for="c in g.clients" :key="c.name" class="logo">
            <NuxtImg format="webp" :src="c.logo" :alt="c.name" sizes="160px" loading="lazy" class="logo__img" />
          </li>
        </ul>
      </section>
    </div>

    <ContactBand />
  </div>
</template>

<style scoped>
.jump {
  position: sticky;
  top: var(--header-offset);
  z-index: 10;
  background: var(--color-blanco);
  border-block: 1px solid var(--color-linea);
}

.jump__list {
  display: flex;
  gap: 0.25rem 1.5rem;
  padding-block: 0.75rem;
}

/* Phones: one row to swipe, no scrollbar; the faded right edge shows there is more. */
@media (width < 64rem) {
  .jump__list {
    overflow-x: auto;
    scrollbar-width: none;
    mask-image: linear-gradient(to right, #000 calc(100% - 2.5rem), transparent);
    padding-right: 2.5rem;
  }

  .jump__list::-webkit-scrollbar {
    display: none;
  }
}

/* Desktop: every sector visible, in as many rows as needed. */
@media (width >= 64rem) {
  .jump__list {
    flex-wrap: wrap;
  }
}

.jump__list a {
  display: inline-block;
  padding-block: 0.375rem;
  white-space: nowrap;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-tinta);
  text-decoration: none;
}

.jump__list a:hover {
  color: var(--color-azul);
}

.jump__list span {
  margin-left: 0.25rem;
  color: var(--color-pizarra);
  font-weight: 600;
}

.sectors {
  padding-block: var(--spacing-section-sm) var(--spacing-section);
}

.sector {
  padding-block: 2.5rem;
  border-top: 1px solid var(--color-linea);
  scroll-margin-top: calc(var(--header-offset) + 4rem);
}

.sector--lead {
  border-top: 2px solid var(--color-azul);
}

.sector__title {
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
  color: var(--color-azul);
}

.sector--lead .sector__title {
  font-size: var(--text-2xl);
}

.logos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.25rem, 1fr));
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.logo {
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 3;
  padding: 0.75rem;
  background: var(--color-blanco);
  border: 1px solid var(--color-linea);
  border-radius: var(--radius-control);
}

.logo__img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  mix-blend-mode: multiply;
}

/* Desktop: sector name on the left, logos on the right, so sectors with one
   or two clients don't leave a whole empty row. */
@media (width >= 64rem) {
  .sector {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 9fr);
    column-gap: var(--spacing-gutter);
    align-items: start;
  }

  .sector--lead .sector__title {
    font-size: var(--text-xl);
  }

  .logos {
    grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
    margin-top: 0;
  }
}
</style>
