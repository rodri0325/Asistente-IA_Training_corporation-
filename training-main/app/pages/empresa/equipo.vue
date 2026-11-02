<script setup lang="ts">
import { team } from '~/data/company'

usePageSeo({
  title: 'Nuestro equipo',
  description: 'Las personas de Training Corporation: gerencia, asesoría experta, dirección administrativa, aseguramiento del modelo de gestión, gestión del conocimiento e innovación.',
  image: '/images/equipo/nancy-rodriguez.jpg',
})
</script>

<template>
  <div>
    <PageHeader
      title="Nuestro equipo"
      lede="Auditores líderes con certificación internacional, formadores y profesionales que responden directamente ante cada organización cliente."
      :crumbs="[{ label: 'Empresa', to: '/empresa' }]"
    />

    <div class="frame people">
      <article v-for="(p, i) in team" :id="p.slug" :key="p.slug" class="person" :class="{ 'person--lead': i === 0 }">
        <div class="person__ring">
          <BrandRing
            :src="p.photo"
            :alt="`Retrato de ${p.name}`"
            focus="50% 20%"
            sizes="xs:60vw sm:280px"
            :loading="i < 2 ? 'eager' : 'lazy'"
          />
        </div>
        <div class="person__text">
          <h2 class="person__name">{{ p.name }}</h2>
          <p class="person__role">{{ p.role }}</p>
          <p class="person__statement">{{ p.statement }}</p>
          <ul v-if="p.credentials" class="person__creds" :aria-label="`Formación y certificaciones de ${p.name}`">
            <li v-for="c in p.credentials" :key="c">{{ c }}</li>
          </ul>
        </div>
      </article>
    </div>

    <ContactBand title="Hable directamente con nuestro equipo" />
  </div>
</template>

<style scoped>
.people {
  display: grid;
  padding-bottom: var(--spacing-section);
}

.person {
  display: grid;
  gap: 1.5rem;
  padding-block: 2.5rem;
  border-top: 1px solid var(--color-linea);
  scroll-margin-top: calc(var(--header-offset) + 1rem);
}

.person--lead {
  border-top: 2px solid var(--color-azul);
}

.person__ring {
  width: min(14rem, 60%);
}

.person__name {
  font-size: var(--text-2xl);
  line-height: var(--text-2xl--line-height);
}

.person__role {
  margin-top: 0.5rem;
  font-weight: 700;
  color: var(--color-azul);
}

.person__statement {
  max-width: var(--container-measure);
  margin-top: 1.25rem;
  font-size: var(--text-lg);
  line-height: var(--text-lg--line-height);
}

.person__creds {
  display: grid;
  gap: 0.375rem;
  margin-top: 1.25rem;
  padding-left: 1rem;
  border-left: 3px solid var(--color-azul-vivo);
  color: var(--color-pizarra);
}

/* Every person on the same grid: photo column, then text, always on the same
   edges (staggered photos read as misalignment). */
@media (width >= 48rem) {
  .person {
    grid-template-columns: 14rem minmax(0, 1fr);
    column-gap: clamp(2rem, 4vw, 4rem);
    /* Photo and name start on the same line, however long the statement. */
    align-items: start;
  }

  .person__ring {
    width: 100%;
  }
}

@media (width >= 64rem) {
  .person {
    grid-template-columns: 16rem minmax(0, 1fr);
  }
}
</style>
