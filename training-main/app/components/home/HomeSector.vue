<script setup lang="ts">
import { clientsIn } from '~/data/clients'

// The power-sector client list is the company's clearest differentiator:
// shown as type, not as a logo carousel.
const utilities = clientsIn('energia').map((c) => c.name)
</script>

<template>
  <section class="sector section" aria-labelledby="sector-title">
    <div class="frame grid-page sector__grid">
      <div class="sector__intro">
        <h2 id="sector-title" class="heading">{{ utilities.length }} empresas de energía han trabajado con nosotros</h2>
        <p class="lede muted sector__lede">
          Operadores de red, generadores, transmisores y el operador del mercado. Para ellas hacemos las verificaciones
          que exige la CREG, auditorías bajo ISO 55001 y la formación de sus equipos en calidad del servicio.
        </p>
      </div>

      <ul class="sector__names" aria-label="Empresas del sector eléctrico">
        <li v-for="name in utilities" :key="name">{{ name }}</li>
      </ul>

      <p class="sector__more">
        <NuxtLink to="/clientes" class="link">Ver los clientes de los quince sectores</NuxtLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.sector__grid {
  row-gap: 2.5rem;
}

.sector__intro,
.sector__names,
.sector__more {
  grid-column: 1 / -1;
}

.sector__intro .heading {
  max-width: 18ch;
}

.sector__lede {
  margin-top: 1.5rem;
}

.sector__names {
  --sep: 1.4em;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35em 0;
  /* Each name starts with a dot; the list is pulled left by one dot's width
     and that strip is clipped, so no line begins or ends with a stray dot. */
  margin-left: calc(var(--sep) * -1);
  clip-path: inset(0 0 0 var(--sep));
  font-family: var(--font-display);
  font-size: var(--text-lg);
  line-height: 1.35;
  font-weight: 600;
  letter-spacing: var(--tracking-snug);
  color: var(--color-tinta);
}

.sector__names li {
  display: flex;
  align-items: baseline;
  max-width: 100%;
}

.sector__names li::before {
  content: '';
  flex: none;
  width: 0.3em;
  height: 0.3em;
  margin-inline: 0.55em;
  border-radius: var(--radius-full);
  background: var(--color-azul-vivo);
  transform: translateY(-0.25em);
}

@media (width >= 64rem) {
  .sector__intro {
    grid-column: 1 / span 5;
  }

  .sector__names {
    grid-column: 7 / -1;
    grid-row: 1 / span 2;
    align-self: center;
    font-size: var(--text-xl);
  }

  .sector__more {
    grid-column: 1 / span 5;
  }
}
</style>
