<script setup lang="ts">
import { modes, services, countOffers, servicePath } from '~/data/services'
import { company } from '~/data/company'

usePageSeo({
  title: 'Servicios de auditoría, consultoría y formación ISO',
  description: 'Auditoría, consultoría y formación en HSEQ, gestión de activos ISO 55001, servicios regulatorios del sector eléctrico, seguridad de la información y laboratorios.',
})

const modeCards = modes.map((m) => ({
  ...m,
  total: services.reduce((n, s) => n + countOffers(s, m.id), 0),
}))
</script>

<template>
  <div>
    <PageHeader title="¿Qué necesita su organización?" crumb="Servicios" :lede="company.method" />

    <section id="buscar" class="frame find" aria-label="Buscar un servicio">
      <ServiceSearch />
    </section>

    <section class="frame choose" aria-labelledby="por-unidad">
      <h2 id="por-unidad" class="subheading choose__title">Empiece por el tipo de servicio</h2>
      <ul class="modes">
        <li v-for="m in modeCards" :key="m.id">
          <NuxtLink :to="servicePath(m.id)" class="mode">
            <span class="mode__name">{{ m.name }}</span>
            <span class="mode__summary">{{ m.summary }}</span>
            <span class="mode__count">{{ m.total }} servicios en cinco líneas</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section class="section-list" aria-labelledby="por-linea">
      <div class="frame">
        <h2 id="por-linea" class="subheading choose__title">O por línea</h2>
        <article v-for="s in services" :key="s.slug" class="svc">
          <div class="svc__head">
            <h3 class="svc__name">
              <NuxtLink :to="`/portafolio-de-servicios/${s.slug}`">{{ s.name }}</NuxtLink>
            </h3>
            <p class="svc__lede">{{ s.lede }}</p>
          </div>
          <ul class="svc__modes" :aria-label="`${s.name} por tipo de servicio`">
            <li v-for="m in modes" :key="m.id">
              <NuxtLink :to="servicePath(m.id, s.slug)" class="svc__mode">
                <span>{{ m.name }}</span>
                <span class="svc__n">{{ countOffers(s, m.id) }}</span>
              </NuxtLink>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <ContactBand title="¿No sabe por dónde empezar?" text="Cuéntenos el requisito, la norma o la auditoría que tiene por delante y le orientamos." />
  </div>
</template>

<style scoped>
.find {
  padding-bottom: var(--spacing-section-sm);
}

.find > * {
  max-width: 52rem;
}

.choose {
  padding-bottom: var(--spacing-section-sm);
}

.choose__title {
  margin-bottom: 1.5rem;
  font-size: var(--text-xl);
  color: var(--color-pizarra);
}

.modes {
  display: grid;
  gap: 1rem;
}

.mode {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
  padding: 2rem 1.75rem 1.75rem;
  border-radius: 12px;
  background: var(--color-azul);
  color: var(--color-blanco);
  text-decoration: none;
  overflow: hidden;
  transition: background-color var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out);
}

.mode:hover {
  background: var(--color-azul-hondo);
  transform: translateY(-3px);
}

.mode__name {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  line-height: var(--text-3xl--line-height);
  font-weight: 800;
  letter-spacing: var(--tracking-tight);
}

.mode__summary {
  max-width: 22rem;
}

/* Pinned to the bottom so the three cards' links line up. */
.mode__count {
  margin-top: auto;
  padding-top: 0.75rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.section-list {
  padding-bottom: var(--spacing-section);
}

.svc {
  display: grid;
  gap: 1.25rem;
  padding-block: 1.75rem;
  border-top: 1px solid var(--color-linea);
}

.svc__name {
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
}

.svc__name a {
  color: var(--color-azul);
  text-decoration: none;
}

.svc__name a:hover {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.svc__lede {
  margin-top: 0.5rem;
  max-width: 34rem;
  color: var(--color-pizarra);
}

.svc__modes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.svc__mode {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  min-height: 2.75rem;
  padding: 0.375rem 0.5rem 0.375rem 1rem;
  border: 2px solid var(--color-linea);
  border-radius: var(--radius-control);
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-tinta);
  text-decoration: none;
  transition: border-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
}

.svc__mode:hover {
  border-color: var(--color-azul);
  color: var(--color-azul);
}

@media (width < 40rem) {
  .svc__modes {
    display: grid;
  }

  .svc__mode {
    justify-content: space-between;
  }
}

.svc__n {
  display: grid;
  place-items: center;
  min-width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-full);
  background: var(--color-nube);
  font-size: 0.8125rem;
  color: var(--color-azul-hondo);
}

@media (width >= 48rem) {
  .modes {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (width >= 64rem) {
  .svc {
    grid-template-columns: minmax(0, 6fr) minmax(0, 6fr);
    column-gap: var(--spacing-gutter);
    align-items: center;
  }

  .svc__modes {
    justify-content: flex-end;
  }
}
</style>
