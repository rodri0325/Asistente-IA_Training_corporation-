<script setup lang="ts">
import { Play } from '@lucide/vue'

/**
 * The company's corporate video (Vimeo, published January 2025 on the old
 * /empresa page). Shows a local poster first and loads the Vimeo player only
 * when the visitor presses play: no third-party requests, no autoplay with sound.
 */
const props = withDefaults(defineProps<{
  id?: string
  title?: string
  duration?: string
  poster?: string
}>(), {
  id: '1045805123',
  title: 'Video corporativo de Training Corporation',
  duration: '3:16',
  poster: '/images/empresa/video-corporativo.jpg',
})

const playing = ref(false)
const src = computed(() => `https://player.vimeo.com/video/${props.id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0&color=0072af`)
</script>

<template>
  <div class="video">
    <iframe
      v-if="playing"
      class="video__frame"
      :src="src"
      :title="title"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    />
    <button v-else type="button" class="video__poster" @click="playing = true">
      <NuxtImg :src="poster" alt="" width="1280" height="720" sizes="xs:100vw lg:880px" class="video__img" loading="lazy" />
      <span class="video__play" aria-hidden="true"><Play /></span>
      <span class="video__label">Ver el video <span class="video__time">{{ duration }}</span></span>
      <span class="visually-hidden">: {{ title }}, {{ duration }} minutos. Se reproduce desde Vimeo.</span>
    </button>
  </div>
</template>

<style scoped>
.video {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-azul-hondo);
}

.video__frame,
.video__poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.video__poster {
  display: grid;
  place-items: center;
  padding: 0;
  cursor: pointer;
}

.video__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--ease-out);
}

.video__poster:hover .video__img {
  transform: scale(1.02);
}

.video__play {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(4rem, 3rem + 4vw, 6rem);
  aspect-ratio: 1;
  border-radius: var(--radius-full);
  background: var(--color-azul);
  color: var(--color-blanco);
  box-shadow: 0 0 0 0.5rem rgb(255 255 255 / 0.6);
  transition: background-color var(--duration-fast) var(--ease-out), transform var(--duration-base) var(--ease-out);
}

.video__play svg {
  width: 40%;
  height: 40%;
  margin-left: 8%;
  fill: currentColor;
}

.video__poster:hover .video__play {
  background: var(--color-azul-hondo);
  transform: scale(1.06);
}

.video__poster:focus-visible {
  outline: var(--focus-ring);
  outline-offset: -3px;
}

.video__label {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-control);
  background: var(--color-blanco);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-azul-hondo);
}

.video__time {
  font-weight: 600;
  color: var(--color-pizarra);
}

@media (prefers-reduced-motion: reduce) {
  .video__img,
  .video__play {
    transition: none;
  }
}
</style>
