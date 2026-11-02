<script setup lang="ts">
import { MessageCircle } from '@lucide/vue'
import { company } from '~/data/company'

/**
 * Closing call to action. Phones, e-mail and address live in the footer right
 * below, so this block only asks the question and offers the two fastest routes.
 */
withDefaults(defineProps<{ title?: string, text?: string }>(), {
  title: 'Cuéntenos qué norma o requisito necesita resolver',
  text: 'Respondemos con una propuesta de asesoría, auditoría o formación ajustada a su organización.',
})
</script>

<template>
  <section class="band field-azul" aria-labelledby="band-title">
    <div class="frame grid-page band__grid">
      <h2 id="band-title" class="heading band__title">{{ title }}</h2>
      <div class="band__side">
        <p class="lede">{{ text }}</p>
        <div class="band__actions">
          <UiButton to="/contacto" variant="light">Escribir un mensaje</UiButton>
          <UiButton :href="company.whatsapp.href" variant="ghost" external>
            <template #icon><MessageCircle aria-hidden="true" /></template>
            WhatsApp
          </UiButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.band {
  padding-block: var(--spacing-section-sm);
}

.band__grid {
  row-gap: 2rem;
  align-items: end;
}

.band__title,
.band__side {
  grid-column: 1 / -1;
}

.band__title {
  max-width: 18ch;
}

.band__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

@media (width >= 64rem) {
  .band__title { grid-column: 1 / span 7; }
  .band__side { grid-column: 8 / -1; }
}
</style>
