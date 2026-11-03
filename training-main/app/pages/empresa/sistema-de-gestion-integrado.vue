<script setup lang="ts">
import { sgiDocuments, bulletins } from '~/data/company'

usePageSeo({
  title: 'Sistema de Gestión Integrado',
  description: 'Certificados ISO 9001:2015 e ISO 45001:2018, membresía corporativa del IAM, licencia de SST, política de protección de datos y boletines informativos.',
})

const otherDocs = sgiDocuments.filter((d) => !d.title.startsWith('Certificado'))
</script>

<template>
  <div>
    <PageHeader
      title="Sistema de Gestión Integrado"
      lede="Aplicamos a nuestra propia operación lo que auditamos en otras: calidad y seguridad y salud en el trabajo certificadas, con documentos públicos para clientes, contratistas y proveedores."
      :crumbs="[{ label: 'Empresa', to: '/empresa' }]"
    />

    <section class="section-sm field-azul" aria-labelledby="certs">
      <div class="frame">
        <h2 id="certs" class="visually-hidden">Certificaciones</h2>
        <CertificationList />
      </div>
    </section>

    <section class="section" aria-labelledby="docs">
      <div class="frame grid-page docs">
        <div class="docs__col">
          <h2 id="docs" class="subheading docs__title">Documentos</h2>
          <UiDocLink v-for="d in otherDocs" :key="d.href" :doc="d" />
        </div>
        <div class="docs__col">
          <h2 class="subheading docs__title">Boletines informativos 2024</h2>
          <UiDocLink v-for="d in bulletins" :key="d.href" :doc="d" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.section-sm {
  padding-block: var(--spacing-section-sm);
}

.docs {
  row-gap: 3.5rem;
}

.docs__col {
  grid-column: 1 / -1;
}

.docs__title {
  margin-bottom: 1rem;
  color: var(--color-azul);
}

@media (width >= 64rem) {
  .docs__col:first-child { grid-column: 1 / span 5; }
  .docs__col:last-child { grid-column: 7 / -1; }
}
</style>
