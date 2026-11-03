<script setup lang="ts">
// Living specimen of the design system (docs/BRAND.md). Not indexed.
import { Phone } from '@lucide/vue'
import { sgiDocuments } from '~/data/company'

usePageSeo({ title: 'Sistema visual', description: 'Espécimen interno del sistema visual de Training Corporation.', noindex: true })

const colors = [
  { token: 'azul', hex: '#0072AF', use: 'Azul del logo. Campos de color, botones, enlaces, titulares.' },
  { token: 'azul-hondo', hex: '#005A8C', use: 'Hover y texto azul pequeño sobre nube.' },
  { token: 'azul-vivo', hex: '#1391DA', use: 'Azul vivo del sitio actual. Trazos del anillo; texto solo grande.' },
  { token: 'cielo', hex: '#7FD0F5', use: 'Acentos sobre noche.' },
  { token: 'noche', hex: '#0B2C47', use: 'Pie de página y secciones oscuras.' },
  { token: 'tinta', hex: '#102A3F', use: 'Texto principal.' },
  { token: 'pizarra', hex: '#4A5A67', use: 'Texto secundario.' },
  { token: 'gris-marca', hex: '#8F9392', use: 'Gris del logo. Solo gráficos.' },
  { token: 'nube', hex: '#EEF4F8', use: 'Fondo alterno.' },
  { token: 'linea', hex: '#D5E2EB', use: 'Filetes y bordes de campo.' },
]

const scale = ['display', '3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs']
const sample = ref('')
</script>

<template>
  <div>
    <PageHeader title="Sistema visual" lede="Tokens, tipografía y componentes. Revise esta página después de cualquier cambio en el sistema." />

    <section class="frame block">
      <h2 class="subheading">Color</h2>
      <ul class="swatches">
        <li v-for="c in colors" :key="c.token" class="swatch">
          <span class="swatch__chip" :style="{ background: `var(--color-${c.token})` }" />
          <strong>{{ c.token }}</strong> <span class="muted">{{ c.hex }}</span>
          <span class="swatch__use muted">{{ c.use }}</span>
        </li>
      </ul>
    </section>

    <section class="frame block">
      <h2 class="subheading">Tipografía: Montserrat y Source Sans 3</h2>
      <ul>
        <li v-for="t in scale" :key="t" class="type-row">
          <span class="muted">text-{{ t }}</span>
          <span :class="['base', 'sm', 'xs', 'lg'].includes(t) ? '' : 'font-display font-extrabold'" :style="{ fontSize: `var(--text-${t})`, lineHeight: `var(--text-${t}--line-height)` }">
            Gestión de activos ISO 55001
          </span>
        </li>
      </ul>
    </section>

    <section class="frame block">
      <h2 class="subheading">El anillo</h2>
      <div class="rings">
        <BrandRing src="/images/equipo/john-fredy-moreno.jpg" alt="Retrato de John Fredy Moreno" focus="50% 20%" sizes="240px" />
        <BrandRing src="/images/fotos/ebsa.jpg" alt="Sede de EBSA" sizes="240px" :gap="24" :dot="false" />
      </div>
    </section>

    <section class="block field-azul">
      <div class="frame">
        <h2 class="subheading">Acciones sobre azul</h2>
        <div class="row"><UiButton variant="light">Escribir un mensaje</UiButton></div>
      </div>
    </section>

    <section class="frame block">
      <h2 class="subheading">Acciones y enlaces</h2>
      <div class="row">
        <UiButton to="/contacto">Solicitar una cotización</UiButton>
        <UiButton to="/portafolio-de-servicios" variant="outline">Ver los servicios</UiButton>
        <UiButton href="tel:+576045742590"><template #icon><Phone aria-hidden="true" /></template>Llamar</UiButton>
      </div>
      <p class="prose spaced">Un enlace en texto corrido: consulte el <NuxtLink to="/empresa/sistema-de-gestion-integrado" class="link">Sistema de Gestión Integrado</NuxtLink>.</p>
      <div class="spaced"><UiDocLink :doc="sgiDocuments[0]!" /></div>
    </section>

    <section class="frame block">
      <h2 class="subheading">Campos</h2>
      <form class="fields" novalidate @submit.prevent>
        <UiField v-model="sample" label="Correo electrónico" name="correo" type="email" required error="Escriba un correo con el formato nombre@empresa.com." />
        <UiField label="Organización" name="org" hint="Razón social o nombre comercial." />
        <UiField label="Línea de servicio" name="linea" type="select" :options="[{ value: 'hseq', label: 'HSEQ' }]" />
      </form>
    </section>
  </div>
</template>

<style scoped>
.block {
  padding-block: var(--spacing-section-sm);
}

.block .subheading {
  margin-bottom: 1.5rem;
  color: var(--color-azul);
}

.field-azul .subheading {
  color: inherit;
}

.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(12rem, 100%), 1fr));
  gap: 2rem var(--spacing-gutter);
}

.swatch {
  display: grid;
  gap: 0.25rem;
  align-content: start;
}

.swatch__chip {
  height: 6rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--color-linea);
  border-radius: var(--radius-control);
}

.swatch__use {
  font-size: var(--text-xs);
}

.type-row {
  display: grid;
  gap: 0.25rem;
  padding-block: 1rem;
  border-bottom: 1px solid var(--color-linea);
}

.rings {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

.rings > * {
  width: 15rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.spaced {
  margin-top: 2rem;
}

.fields {
  display: grid;
  gap: 1.5rem;
  max-width: var(--container-narrow);
}

@media (width >= 48rem) {
  .type-row {
    grid-template-columns: 8rem 1fr;
    align-items: baseline;
  }
}
</style>
