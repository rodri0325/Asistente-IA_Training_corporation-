<script setup lang="ts">
usePageSeo({
  title: 'Auditoría, consultoría y formación ISO',
  fullTitle: 'Training Corporation | Auditoría, consultoría y formación ISO',
  description:
    'Auditoría, consultoría y formación en ISO 9001, 45001, 55001 y 27001 y regulación CREG del sector eléctrico. Desde Medellín para toda Colombia.',
})
</script>

<template>
  <div>
    <HomeHero />
    <LazyHomeCertifications hydrate-on-visible />
    <LazyHomeServices hydrate-on-visible />
    <LazyHomeSector hydrate-on-visible />
    <LazyHomeCases hydrate-on-visible />
    <LazyHomePresence hydrate-on-visible />
    <LazyHomeTeam hydrate-on-visible />
    <LazyHomeTraining hydrate-on-visible />
    <LazyContactBand hydrate-on-visible />
  </div>
</template>
