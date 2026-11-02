<script setup lang="ts">
// The only logo file available is a 164×93 PNG. Replace with the vector
// original (SVG) as soon as the client provides it.
// `inverse` renders the same file as a single-ink negative for ink grounds:
// the published "white" PNG keeps blue parts (3.35:1 on tinta) and a different crop.
withDefaults(defineProps<{ inverse?: boolean }>(), { inverse: false })
</script>

<template>
  <img
    src="/brand/logo-training-corporation.png"
    width="164"
    height="93"
    alt="Training Corporation"
    class="logo"
    :class="{ 'logo--inverse': inverse }"
    decoding="async"
  >
</template>

<style scoped>
.logo {
  display: block;
  width: 7.5rem;
  height: auto;
}

.logo--inverse {
  filter: brightness(0) invert(1);
}

@media (width >= 64rem) {
  .logo {
    width: 8.5rem;
  }
}
</style>
