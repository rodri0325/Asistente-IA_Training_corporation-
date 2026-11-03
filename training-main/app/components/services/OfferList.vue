<script setup lang="ts">
import type { ModeId, OfferGroup } from '~/data/services'

/** The services of one line in one unit; each row can join the quote request. */
const props = defineProps<{ mode: ModeId, line: string, groups: OfferGroup[], lineName: string }>()

const quote = useQuote()
const added = (text: string) => quote.has({ mode: props.mode, line: props.line, text })
</script>

<template>
  <div class="offers">
    <div v-for="g in groups" :key="g.area ?? 'all'" class="offers__group">
      <h3 v-if="g.area" class="offers__area">{{ g.area }}</h3>
      <ul class="offers__list">
        <li v-for="text in g.items" :key="text" class="offer" :class="{ 'is-added': added(text) }">
          <span class="offer__text">{{ text }}</span>
          <QuoteToggle :mode="mode" :line="line" :text="text" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.offers {
  display: grid;
  gap: 2.25rem;
}

.offers__area {
  margin-bottom: 0.5rem;
  font-size: var(--text-lg);
  line-height: 1.3;
  color: var(--color-azul);
}

.offer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.5rem 1.25rem;
  align-items: center;
  padding-block: 0.875rem;
  border-bottom: 1px solid var(--color-linea);
  transition: background-color var(--duration-fast) var(--ease-out);
}

.offer.is-added {
  background: var(--color-nube);
}

.offer__text {
  padding-left: 0.75rem;
  border-left: 3px solid transparent;
  transition: border-color var(--duration-fast) var(--ease-out);
}

.offer.is-added .offer__text {
  border-left-color: var(--color-azul);
}
</style>
