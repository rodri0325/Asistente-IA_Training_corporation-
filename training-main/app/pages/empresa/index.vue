<script setup lang="ts">
import { purpose, values, principles, agreements, sgiDocuments } from '~/data/company'

usePageSeo({
  title: 'Quiénes somos',
  description: 'Propósito empresarial, presencia en 21 departamentos y en Centroamérica, valores y principios de Training Corporation S.A.S.',
  image: '/images/fotos/edificio-colmena.jpg',
})

const reglamento = sgiDocuments.find((d) => d.title.startsWith('Reglamento'))!
</script>

<template>
  <div>
    <PageHeader
      title="Una empresa que transfiere conocimiento"
      lede="Fortalecemos el crecimiento de las organizaciones mediante la evaluación, la formación, la consultoría y la asesoría, con profesionales de alto desempeño."
    >
      <div class="sub-nav">
        <UiButton to="/empresa/equipo" variant="outline">Nuestro equipo</UiButton>
        <UiButton to="/empresa/sistema-de-gestion-integrado" variant="outline">Sistema de Gestión Integrado</UiButton>
      </div>
      <template #aside>
        <BrandRing
          src="/images/fotos/edificio-colmena.jpg"
          alt="Fachada del Edificio Colmena, sede administrativa en Medellín"
          focus="50% 40%"
          sizes="xs:80vw sm:420px"
          loading="eager"
        >
          <template #caption>Sede administrativa: Edificio Colmena, El Poblado, Medellín.</template>
        </BrandRing>
      </template>
    </PageHeader>

    <section class="section-sm" aria-labelledby="video">
      <div class="frame grid-page film">
        <div class="film__text">
          <h2 id="video" class="subheading">Video corporativo</h2>
          <p class="film__lede">Training Corporation en algo más de tres minutos.</p>
        </div>
        <CorporateVideo class="film__video" />
      </div>
    </section>

    <section class="section field-azul" aria-labelledby="proposito">
      <div class="frame grid-page purpose">
        <div class="purpose__text">
          <h2 id="proposito" class="heading">Propósito empresarial hacia 2030</h2>
          <p class="lede purpose__lede">{{ purpose.text }}</p>
        </div>
        <ol class="purpose__list">
          <li v-for="g in purpose.guidelines" :key="g">{{ g }}</li>
        </ol>
      </div>
    </section>

    <HomePresence />

    <section class="section" aria-labelledby="valores">
      <div class="frame grid-page tenets">
        <div class="tenets__col">
          <h2 id="valores" class="heading">Valores</h2>
          <dl class="tenets__list">
            <div v-for="v in values" :key="v.name">
              <dt>{{ v.name }}</dt>
              <dd>{{ v.text }}</dd>
            </div>
          </dl>
        </div>
        <div class="tenets__col">
          <h2 class="heading">Principios</h2>
          <dl class="tenets__list">
            <div v-for="p in principles" :key="p.name">
              <dt>{{ p.name }}</dt>
              <dd>{{ p.text }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <section class="section-sm field-nube" aria-labelledby="convenios">
      <div class="frame grid-page agreements">
        <div class="agreements__col">
          <h2 id="convenios" class="subheading">Convenios</h2>
          <p class="lede">{{ agreements.join(' y ') }}.</p>
        </div>
        <div class="agreements__col">
          <h2 class="subheading">Reglamento</h2>
          <UiDocLink :doc="reglamento" />
        </div>
      </div>
    </section>

    <ContactBand />
  </div>
</template>

<style scoped>
.film {
  row-gap: 1.25rem;
  align-items: end;
}

.film__text,
.film__video {
  grid-column: 1 / -1;
}

.film__lede {
  margin-top: 0.5rem;
  color: var(--color-pizarra);
}

@media (width >= 64rem) {
  .film__text {
    grid-column: 1 / span 3;
    align-self: start;
  }

  .film__video {
    grid-column: 4 / -1;
  }
}

.sub-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.purpose {
  row-gap: 3rem;
}

.purpose__text,
.purpose__list {
  grid-column: 1 / -1;
}

.purpose__lede {
  margin-top: 1.5rem;
}

.purpose__list {
  display: grid;
  gap: 0;
  counter-reset: g;
  border-top: 2px solid var(--color-blanco);
}

.purpose__list li {
  padding-block: 0.875rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.4);
  font-weight: 600;
}

.tenets {
  row-gap: 4rem;
}

.tenets__col {
  grid-column: 1 / -1;
}

.tenets__col .heading {
  color: var(--color-azul);
}

.tenets__list {
  display: grid;
  margin-top: 2rem;
}

.tenets__list > div {
  padding-block: 1.25rem;
  border-top: 1px solid var(--color-linea);
}

.tenets__list dt {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: var(--tracking-snug);
}

.tenets__list dd {
  margin-top: 0.375rem;
  color: var(--color-pizarra);
}

.section-sm {
  padding-block: var(--spacing-section-sm);
}

.agreements {
  row-gap: 2.5rem;
}

.agreements__col {
  grid-column: 1 / -1;
}

.agreements__col .lede,
.agreements__col :deep(.doc) {
  margin-top: 1rem;
}

@media (width >= 64rem) {
  .purpose__text { grid-column: 1 / span 6; }
  .purpose__list { grid-column: 8 / -1; }
  .tenets__col:first-child { grid-column: 1 / span 5; }
  .tenets__col:last-child { grid-column: 7 / -1; }

  /* Values and principles share rows (heading + four items each), so the
     rules between items line up across both columns. */
  .tenets { row-gap: 0; }

  .tenets__col {
    display: grid;
    grid-row: span 5;
    grid-template-rows: subgrid;
  }

  .tenets__list {
    grid-row: span 4;
    grid-template-rows: subgrid;
  }
  .agreements__col:first-child { grid-column: 1 / span 5; }
  .agreements__col:last-child { grid-column: 7 / -1; }
}
</style>
