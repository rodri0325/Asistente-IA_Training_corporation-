<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/**
 * Action element. Renders a NuxtLink when `to`/`href` is given, otherwise a <button>.
 * - primary: brand-blue fill. The main action of a view.
 * - outline: blue outline, for the second action.
 * - light:   white fill, for actions on blue or navy fields.
 * - ghost:   white outline, the second action on blue or navy fields.
 * Icons go in the `icon` slot and only when they say something (phone, download).
 */
const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    href?: string
    variant?: 'primary' | 'outline' | 'light' | 'ghost'
    type?: 'button' | 'submit' | 'reset'
    external?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', external: false, disabled: false },
)

const isLink = computed(() => !!(props.to || props.href))
const tag = computed(() => (isLink.value ? resolveComponent('NuxtLink') : 'button'))
const attrs = computed(() =>
  isLink.value
    ? { to: props.to ?? props.href, external: props.external || undefined, target: props.external ? '_blank' : undefined, rel: props.external ? 'noopener' : undefined }
    : { type: props.type, disabled: props.disabled || undefined },
)
</script>

<template>
  <component :is="tag" v-bind="attrs" class="btn" :class="`btn--${variant}`">
    <slot name="icon" />
    <span><slot /></span>
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  min-height: 3.25rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid transparent;
  border-radius: var(--radius-control);
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);
}

.btn :deep(svg) {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
}

.btn--primary {
  background: var(--color-azul);
  color: var(--color-blanco);
}

.btn--primary:hover {
  background: var(--color-azul-hondo);
}

.btn--outline {
  border-color: var(--color-azul);
  color: var(--color-azul);
}

.btn--outline:hover {
  background: var(--color-azul);
  color: var(--color-blanco);
}

.btn--light {
  background: var(--color-blanco);
  color: var(--color-azul-hondo);
}

.btn--light:hover {
  background: var(--color-nube);
}

.btn--ghost {
  border-color: rgb(255 255 255 / 0.7);
  color: var(--color-blanco);
}

.btn--ghost:hover {
  border-color: var(--color-blanco);
  background: rgb(255 255 255 / 0.1);
}

.btn[disabled] {
  opacity: 0.6;
  cursor: progress;
}
</style>
