<script setup lang="ts">
import { allDepartments, presence } from '~/data/company'

/**
 * A typographic map: every department of Colombia, with the 21 where the
 * company has delivered services lit. On scroll the lit names switch on in
 * sequence (the start state is set by GSAP, so without JS they are simply lit).
 */
const served = new Set<string>(presence.departments)
const root = useTemplateRef<HTMLElement>('root')

useMotion(root, ({ gsap }) => {
  gsap.from('.dept.is-served', {
    color: '#93abc0',
    duration: 0.4,
    stagger: { each: 0.06, from: 'random' },
    scrollTrigger: { trigger: '.presence__map', start: 'top 70%', once: true },
  })
  gsap.from('.dept.is-served .dept__mark', {
    scale: 0,
    duration: 0.4,
    stagger: { each: 0.06, from: 'random' },
    scrollTrigger: { trigger: '.presence__map', start: 'top 70%', once: true },
  })
})
</script>

<template>
  <section ref="root" class="presence field-noche section" aria-labelledby="presence-title">
    <div class="frame grid-page presence__grid">
      <div class="presence__head">
        <h2 id="presence-title" class="heading">Servicios en 21 departamentos de Colombia</h2>
        <p class="lede presence__lede">
          Profesionales que nos representan directamente ante cada organización cliente, para mantener relaciones cercanas y duraderas.
          Fuera del país hemos concretado negocios en {{ presence.countries.join(' y ') }}.
        </p>
      </div>

      <ul class="presence__map" aria-label="Departamentos de Colombia; los atendidos están resaltados">
        <li
          v-for="d in allDepartments"
          :key="d"
          class="dept"
          :class="{ 'is-served': served.has(d) }"
        >
          <span v-if="served.has(d)" class="dept__mark" aria-hidden="true" />
          <span class="dept__name">{{ d }}<span v-if="served.has(d)" class="visually-hidden"> (con servicios)</span></span>
        </li>
      </ul>

      <p class="presence__note">
        <a :href="presence.map" class="link" target="_blank" rel="noopener">Ver el mapa de presencia (PDF)</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.presence__grid {
  row-gap: 3rem;
}

.presence__head,
.presence__map,
.presence__note {
  grid-column: 1 / -1;
}

.presence__head .heading {
  max-width: 16ch;
}

.presence__lede {
  margin-top: 1.5rem;
  color: var(--color-niebla);
}

/* Alphabetical columns; every name keeps a slot for the dot, so all names
   start on the same edge whether lit or not. */
.presence__map {
  columns: 2;
  column-gap: var(--spacing-gutter);
  font-family: var(--font-display);
  font-size: var(--text-base);
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: var(--tracking-snug);
}

.dept {
  display: grid;
  grid-template-columns: 0.55em minmax(0, 1fr);
  align-items: center;
  column-gap: 0.55em;
  padding-block: 0.3em;
  break-inside: avoid;
  color: var(--color-bruma);
  font-weight: 500;
}

.dept__name {
  grid-column: 2;
}

.dept.is-served {
  color: var(--color-blanco);
  font-weight: 700;
}

.dept__mark {
  width: 0.55em;
  height: 0.55em;
  border-radius: var(--radius-full);
  background: var(--color-cielo);
}

@media (width >= 64rem) {
  .presence__head {
    grid-column: 1 / span 5;
    position: sticky;
    top: calc(var(--header-offset) + 2rem);
    align-self: start;
  }

  .presence__map {
    grid-column: 7 / -1;
    columns: 3;
    font-size: var(--text-lg);
  }

  .presence__note {
    grid-column: 7 / -1;
  }
}
</style>
