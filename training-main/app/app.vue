<script setup lang="ts">
// Mark the document before first paint when motion is allowed, so CSS can hold
// animated elements in their start state without hiding them for no-JS or
// reduced-motion visitors.
useHead({
  script: [{
    key: 'motion-flag',
    tagPosition: 'head',
    innerHTML: `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')`,
  }],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
