<script setup lang="ts">
/**
 * Right under the opening: the company holds the certifications it audits
 * others against. Real issuer, numbers and validity (CertificationList).
 */
</script>

<template>
  <section id="certificaciones" class="certs-band field-nube" aria-labelledby="certs-title">
    <div class="frame grid-page certs-band__grid">
      <h2 id="certs-title" class="subheading certs-band__title">Certificados en lo que auditamos</h2>
      <div class="certs-band__intro">
        <p class="muted">
          Nuestro propio sistema de gestión está certificado por Bureau Veritas, y el alcance cubre la formación,
          la consultoría y la auditoría que ofrecemos.
        </p>
        <NuxtLink to="/empresa/sistema-de-gestion-integrado" class="link">Ver el Sistema de Gestión Integrado</NuxtLink>
      </div>
      <CertificationList class="certs-band__list" />
    </div>
  </section>
</template>

<style scoped>
.certs-band {
  padding-block: var(--spacing-section-sm);
}

.certs-band__grid {
  row-gap: 1rem;
}

.certs-band__title,
.certs-band__intro,
.certs-band__list {
  grid-column: 1 / -1;
}

.certs-band__title {
  max-width: 14ch;
  color: var(--color-azul);
}

.certs-band__intro {
  display: grid;
  justify-items: start;
  gap: 1rem;
  max-width: 34rem;
}

.certs-band__list {
  margin-top: 2rem;
}

@media (width >= 64rem) {
  .certs-band__title {
    grid-column: 1 / span 5;
  }

  .certs-band__intro {
    grid-column: 7 / -1;
    align-self: end;
  }
}
</style>
