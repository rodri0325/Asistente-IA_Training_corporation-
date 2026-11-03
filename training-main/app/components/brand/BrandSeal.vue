<script setup lang="ts">
/**
 * The logo's open ring turned into a certification seal: the standards the
 * company audits run along the ring as text. Top arc reads outward, bottom
 * arc inward, both upright. The ring opens to the right, like the logo's "C".
 * Everything is in a 1000×1000 viewBox; the parent sizes it.
 */
const props = withDefaults(defineProps<{ top: string[], bottom: string[], gap?: number }>(), { gap: 25 })

const C = 500
const R = 430
const rad = (a: number) => (a * Math.PI) / 180
const pt = (a: number, r: number) => `${(C + r * Math.cos(rad(a))).toFixed(1)} ${(C + r * Math.sin(rad(a))).toFixed(1)}`

// Angles: 0° = 3 o'clock, increasing clockwise (SVG y points down).
const ring = computed(() => `M ${pt(props.gap, R)} A ${R} ${R} 0 1 1 ${pt(360 - props.gap, R)}`)
const topPath = `M ${pt(192, R + 22)} A ${R + 22} ${R + 22} 0 0 1 ${pt(334, R + 22)}`
const bottomPath = `M ${pt(168, R - 22)} A ${R - 22} ${R - 22} 0 0 0 ${pt(26, R - 22)}`
const topLen = Math.round((R + 22) * rad(334 - 192))
const bottomLen = Math.round((R - 22) * rad(168 - 26))
const dot = pt(270, R).split(' ')
</script>

<template>
  <svg class="seal" viewBox="0 0 1000 1000" aria-hidden="true">
    <defs>
      <path id="seal-top" :d="topPath" />
      <path id="seal-bottom" :d="bottomPath" />
    </defs>
    <path class="seal__ring" :d="ring" pathLength="100" />
    <circle class="seal__dot" :cx="dot[0]" :cy="dot[1]" r="13" />
    <text class="seal__text">
      <textPath href="#seal-top" :textLength="topLen" lengthAdjust="spacing">
        <tspan v-for="(t, i) in top" :key="t" class="seal__norm">{{ t }}{{ i < top.length - 1 ? ' ' : '' }}</tspan>
      </textPath>
    </text>
    <text class="seal__text seal__text--inner">
      <textPath href="#seal-bottom" :textLength="bottomLen" lengthAdjust="spacing">
        <tspan v-for="(t, i) in bottom" :key="t" class="seal__norm">{{ t }}{{ i < bottom.length - 1 ? ' ' : '' }}</tspan>
      </textPath>
    </text>
  </svg>
</template>

<style scoped>
.seal {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.seal__ring {
  fill: none;
  stroke: var(--color-azul);
  stroke-width: 7;
  stroke-linecap: round;
}

.seal__dot {
  fill: var(--color-azul-vivo);
}

.seal__text {
  font-family: var(--font-display);
  font-size: 27px;
  font-weight: 700;
  letter-spacing: 0.02em;
  fill: var(--color-azul);
}

.seal__text--inner {
  font-weight: 600;
  fill: var(--color-pizarra);
}
</style>
