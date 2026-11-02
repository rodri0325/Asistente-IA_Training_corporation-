<script setup lang="ts">
import { contractorDocuments, company } from '~/data/company'

usePageSeo({
  title: 'Contratistas y proveedores',
  description: 'Formato de cuenta de cobro, manual de roles y responsabilidades y manual de proveedores y contratistas de Training Corporation.',
})
</script>

<template>
  <div>
    <PageHeader
      title="Contratistas y proveedores"
      lede="Los documentos que necesita para prestar servicios con nosotros y presentar sus cuentas de cobro."
    />
    <section class="docs" aria-label="Documentos">
      <div class="frame grid-page">
        <div class="docs__list">
          <UiDocLink v-for="d in contractorDocuments" :key="d.href" :doc="d" />
          <p class="muted docs__help">
            ¿Dudas sobre un pago o un documento? Escriba a
            <a :href="`mailto:${company.email}`" class="link">{{ company.email }}</a>
            o llame al <a :href="company.phones[0].href" class="link">{{ company.phones[0].display }}</a>.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.docs {
  padding-bottom: var(--spacing-section);
}

.docs__list {
  grid-column: 1 / -1;
  border-top: 2px solid var(--color-azul);
}

.docs__help {
  margin-top: 2rem;
  max-width: var(--container-measure);
}

@media (width >= 64rem) {
  .docs__list { grid-column: 1 / span 8; }
}
</style>
