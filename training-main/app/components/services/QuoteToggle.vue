<script setup lang="ts">
import { Plus, Check } from '@lucide/vue'
import type { ModeId } from '~/data/services'

/** Adds one service to the visitor's quote request, or takes it out. */
const props = defineProps<{ mode: ModeId, line: string, text: string }>()

const quote = useQuote()
const item = computed(() => ({ mode: props.mode, line: props.line, text: props.text }))
const added = computed(() => quote.has(item.value))
</script>

<template>
  <button type="button" class="qt" :aria-pressed="added" @click="quote.toggle(item)">
    <Check v-if="added" aria-hidden="true" />
    <Plus v-else aria-hidden="true" />
    <span class="qt__label">{{ added ? 'Agregado' : 'Agregar' }}</span>
    <span class="visually-hidden"> a la solicitud: {{ text }}</span>
  </button>
</template>

<style scoped>
.qt {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-width: 2.75rem;
  min-height: 2.75rem;
  padding: 0.375rem 0.875rem;
  border: 2px solid var(--color-linea);
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-azul);
  white-space: nowrap;
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
}

.qt:hover {
  border-color: var(--color-azul);
}

.qt[aria-pressed='true'] {
  background: var(--color-azul);
  border-color: var(--color-azul);
  color: var(--color-blanco);
}

.qt svg {
  width: 1rem;
  height: 1rem;
}

/* On phones the label collapses to the icon; the full name stays for screen readers. */
@media (width < 40rem) {
  .qt {
    padding: 0;
  }

  .qt__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
}
</style>
