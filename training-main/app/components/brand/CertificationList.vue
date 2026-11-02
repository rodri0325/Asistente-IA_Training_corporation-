<script setup lang="ts">
import { BadgeCheck } from '@lucide/vue'
import { certifications } from '~/data/company'

/**
 * The company's own credentials as a record: the standard, what it covers,
 * who certifies it, number and validity, and the certificate itself.
 * Inherits colours from its field (white, nube or azul).
 */
</script>

<template>
  <ul class="certs">
    <li v-for="c in certifications" :key="c.code" class="cert">
      <p class="cert__code">{{ c.code }}</p>
      <p class="cert__name">{{ c.name }}</p>
      <p class="cert__issuer">
        <BadgeCheck aria-hidden="true" />
        <span>{{ c.issuer }}</span>
      </p>
      <p class="cert__record">
        {{ c.number }}<br>
        {{ c.until ?? c.since }}
      </p>
      <a :href="c.document" class="link cert__doc" target="_blank" rel="noopener">
        Ver el certificado<span class="visually-hidden"> {{ c.code }}, se abre en una pestaña nueva</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.certs {
  display: grid;
  gap: 2rem var(--spacing-gutter);
}

.cert {
  display: grid;
  align-content: start;
  gap: 0.625rem;
  padding-top: 1.25rem;
  border-top: 2px solid var(--color-azul);
}

.cert__code {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 1.2rem + 1.2vw, 2.25rem);
  line-height: 1.1;
  white-space: nowrap;
  font-weight: 800;
  letter-spacing: var(--tracking-tight);
}

.cert__name {
  max-width: 22rem;
  font-weight: 600;
}

.cert__issuer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  font-weight: 700;
}

.cert__issuer svg {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--cert-accent, var(--color-azul-vivo));
}

.cert__record {
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--cert-muted, var(--color-pizarra));
}

.cert__doc {
  justify-self: start;
  margin-top: 0.25rem;
}

.field-azul .cert {
  --cert-accent: var(--color-blanco);
  --cert-muted: var(--color-blanco);
  border-top-color: rgb(255 255 255 / 0.5);
}

@media (width >= 60rem) {
  .certs {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* All three share rows, so issuers, records and links line up. */
  .cert {
    grid-row: span 5;
    grid-template-rows: subgrid;
  }
}
</style>
