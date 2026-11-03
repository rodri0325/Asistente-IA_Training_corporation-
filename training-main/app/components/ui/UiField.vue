<script setup lang="ts">
/**
 * Labelled input, textarea or select. The label is always visible (never a
 * placeholder-as-label) and hint/error text is wired via aria-describedby.
 */
const props = withDefaults(
  defineProps<{
    label: string
    name: string
    type?: 'text' | 'email' | 'tel' | 'textarea' | 'select'
    required?: boolean
    hint?: string
    error?: string
    autocomplete?: string
    options?: { value: string, label: string }[]
  }>(),
  { type: 'text', required: false, options: () => [] },
)

const model = defineModel<string>({ default: '' })
const id = useId()
const describedBy = computed(() =>
  [props.hint && `${id}-hint`, props.error && `${id}-error`].filter(Boolean).join(' ') || undefined,
)
const shared = computed(() => ({
  id,
  name: props.name,
  required: props.required,
  'aria-invalid': props.error ? true : undefined,
  'aria-describedby': describedBy.value,
}))
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <label :for="id" class="field__label">
      {{ label }}
      <span v-if="!required" class="field__optional">(opcional)</span>
    </label>
    <textarea v-if="type === 'textarea'" v-model="model" v-bind="shared" rows="6" class="field__control" />
    <select v-else-if="type === 'select'" v-model="model" v-bind="shared" class="field__control field__select">
      <option value="">Seleccione una opción</option>
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <input v-else v-model="model" v-bind="shared" :type="type" :autocomplete="autocomplete" class="field__control">
    <p v-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="field__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.field {
  display: grid;
  gap: 0.5rem;
}

.field__label {
  font-weight: 700;
}

.field__optional {
  font-weight: 400;
  color: var(--color-pizarra);
}

.field__control {
  width: 100%;
  min-height: 3.25rem;
  padding: 0.75rem 1rem;
  background: var(--color-blanco);
  border: 2px solid var(--color-linea);
  border-radius: var(--radius-control);
  font: inherit;
  color: var(--color-tinta);
  transition: border-color var(--duration-fast) var(--ease-out);
}

.field__select {
  appearance: none;
  padding-right: 2.75rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230072af' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.125rem;
}

.field__control:hover {
  border-color: var(--color-pizarra);
}

.field__control:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 0;
  border-color: var(--color-azul);
}

.field__hint {
  font-size: var(--text-xs);
  color: var(--color-pizarra);
}

.field--error .field__control {
  border-color: var(--color-error);
}

.field__error {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-error);
}
</style>
