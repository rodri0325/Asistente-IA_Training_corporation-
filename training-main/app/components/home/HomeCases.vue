<script setup lang="ts">
import { cases } from '~/data/company'

/** Documented projects instead of testimonials, newest first: the year is real information. */
const timeline = [...cases].sort((a, b) => b.year - a.year)
</script>

<template>
  <section class="cases section field-nube" aria-labelledby="cases-title">
    <div class="frame">
      <div class="cases__head">
        <h2 id="cases-title" class="heading">Proyectos que podemos contar</h2>
        <p class="lede muted cases__lede">Trabajos documentados en nuestras publicaciones, con su alcance y su equipo.</p>
      </div>

      <ol class="cases__list">
        <li v-for="c in timeline" :key="c.client" class="case">
          <p class="case__year">{{ c.year }}</p>
          <div v-if="c.image" class="case__thumb">
            <BrandRing :src="c.image" :alt="c.imageAlt ?? ''" sizes="160px" :gap="20" :dot="false" />
          </div>
          <div class="case__body">
            <p class="case__client">{{ c.client }}</p>
            <h3 class="case__title">{{ c.title }}</h3>
          </div>
          <div class="case__more">
            <p class="case__detail">{{ c.detail }}</p>
            <NuxtLink :to="`/actualidad/${c.newsSlug}`" class="link">
              Leer la publicación<span class="visually-hidden"> sobre {{ c.client }}</span>
            </NuxtLink>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.cases__head {
  max-width: 44rem;
}

.cases__lede {
  margin-top: 1.25rem;
}

.cases__list {
  margin-top: 3rem;
}

.case {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: 1rem 1.25rem;
  padding-block: 2rem;
  border-top: 2px solid var(--color-azul);
}

.case__year {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 800;
  letter-spacing: var(--tracking-tight);
  color: var(--color-azul);
}

.case__thumb {
  grid-row: span 2;
  width: 5.5rem;
}

.case__body,
.case__more {
  grid-column: 1 / -1;
}

.case__client {
  font-weight: 700;
  color: var(--color-azul-hondo);
}

.case__title {
  margin-top: 0.375rem;
  font-size: var(--text-xl);
  line-height: var(--text-xl--line-height);
  max-width: 28ch;
}

.case__detail {
  max-width: var(--container-measure);
  color: var(--color-pizarra);
  margin-bottom: 0.75rem;
}

@media (width >= 64rem) {
  .case {
    grid-template-columns: 7rem 9rem minmax(0, 5fr) minmax(0, 5fr);
    column-gap: var(--spacing-gutter);
    align-items: start;
    padding-block: 2.5rem;
  }

  .case__year {
    font-size: var(--text-2xl);
    line-height: 1;
  }

  .case__thumb {
    grid-row: auto;
    width: 8rem;
    display: block;
  }

  .case__body {
    grid-column: 3;
  }

  .case__more {
    grid-column: 4;
  }
}
</style>
