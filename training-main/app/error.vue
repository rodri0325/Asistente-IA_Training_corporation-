<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)

useSeoMeta({ title: notFound.value ? 'Página no encontrada · Training Corporation' : 'Error · Training Corporation', robots: 'noindex' })
</script>

<template>
  <NuxtLayout>
    <section class="frame err">
      <h1 class="heading err__title">{{ notFound ? 'Esta página no existe o cambió de dirección' : 'No pudimos cargar esta página' }}</h1>
      <p class="lede muted err__text">
        {{ notFound ? 'Rediseñamos el sitio y algunas direcciones cambiaron. Puede empezar por aquí:' : 'Intente de nuevo en unos minutos o vaya a una de estas secciones:' }}
      </p>
      <ul class="err__links">
        <li><NuxtLink to="/" class="link">Inicio</NuxtLink></li>
        <li><NuxtLink to="/portafolio-de-servicios" class="link">Servicios</NuxtLink></li>
        <li><NuxtLink to="/cursos-y-formaciones" class="link">Diplomados y cursos</NuxtLink></li>
        <li><NuxtLink to="/contacto" class="link">Contacto</NuxtLink></li>
      </ul>
      <!-- Most broken links point to an old service page: let the visitor find it directly. -->
      <div v-if="notFound" class="err__search">
        <ServiceSearch :sync-url="false" />
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.err {
  padding-block: var(--spacing-section);
}

.err__title {
  max-width: 18ch;
  color: var(--color-azul);
}

.err__text {
  margin-top: 1.5rem;
}

.err__search {
  max-width: 52rem;
  margin-top: 3.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid var(--color-linea);
}

.err__links {
  display: grid;
  gap: 0.75rem;
  margin-top: 2rem;
  font-size: var(--text-lg);
}
</style>
