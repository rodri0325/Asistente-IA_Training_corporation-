<script setup lang="ts">
/**
 * The brand's one graphic device, taken from the logo: an open ring (a "C"
 * opening to the right) around a circular photograph, with a small satellite
 * sitting on the ring where the figure sits in the logo.
 *
 * The arc is drawn with pathLength=100 so `gap` is a percentage of the circle.
 * `.ring__arc` is animated by the parent (see HomeHero); here it is static.
 */
const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    /** Percentage of the circumference left open. */
    gap?: number
    /** Image focal point, CSS object-position. */
    focus?: string
    sizes?: string
    tone?: 'azul' | 'cielo' | 'blanco'
    /** Dot on the ring at the top, as in the logo. */
    dot?: boolean
    loading?: 'eager' | 'lazy'
  }>(),
  { gap: 14, focus: '50% 50%', sizes: 'xs:100vw sm:100vw md:50vw', tone: 'azul', dot: true, loading: 'lazy' },
)

// The gap is centred on 3 o'clock; the dash starts there after rotating.
const dash = computed(() => `${100 - props.gap} ${props.gap}`)
const rotation = computed(() => (props.gap / 100) * 180)
</script>

<template>
  <figure class="ring-figure">
    <div class="orbit" :class="`orbit--${tone}`">
      <div class="ring__photo">
        <NuxtImg
          format="webp"
          :src="src"
          :alt="alt"
          :sizes="sizes"
          :loading="loading"
          :fetchpriority="loading === 'eager' ? 'high' : undefined"
          :style="{ objectPosition: focus }"
          class="ring__img"
        />
      </div>
      <svg class="ring__svg" viewBox="0 0 100 100" aria-hidden="true">
        <circle
          class="ring__arc"
          cx="50"
          cy="50"
          r="48.5"
          pathLength="100"
          :stroke-dasharray="dash"
          :transform="`rotate(${rotation} 50 50)`"
        />
        <circle v-if="dot" class="ring__dot" cx="50" cy="1.5" r="2.4" />
      </svg>
      <slot />
    </div>
    <figcaption v-if="$slots.caption" class="ring__caption">
      <slot name="caption" />
    </figcaption>
  </figure>
</template>

<style scoped>
.ring-figure {
  margin: 0;
}

.orbit {
  position: relative;
  aspect-ratio: 1;
  width: 100%;
}

.ring__photo {
  position: absolute;
  inset: 5.5%;
  overflow: hidden;
  border-radius: var(--radius-full);
  background: var(--color-nube);
}

.ring__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ring__svg {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
}

/* Stroke in viewBox units, so it scales with the ring like the home seal's.
   No vector-effect: with non-scaling-stroke Chrome ignores pathLength and the
   dash pattern repeats, breaking the arc into several pieces. */
.ring__arc {
  fill: none;
  stroke: var(--ring-color);
  stroke-width: 1.3;
  stroke-linecap: round;
}

.ring__dot {
  fill: var(--ring-color);
}

.orbit--azul { --ring-color: var(--color-azul-vivo); }
.orbit--cielo { --ring-color: var(--color-cielo); }
.orbit--blanco { --ring-color: var(--color-blanco); }

.ring__caption {
  margin-top: 1rem;
  font-size: var(--text-xs);
  line-height: var(--text-xs--line-height);
  color: var(--color-pizarra);
}
</style>
