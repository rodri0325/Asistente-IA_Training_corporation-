<script setup lang="ts">
import { FileText, FileSpreadsheet, Image as ImageIcon, Download } from '@lucide/vue'
import type { CompanyDocument } from '~/data/company'

/** A downloadable company document: icon says the file type, label says what it is. */
const props = defineProps<{ doc: CompanyDocument }>()

const icon = computed(() => ({ pdf: FileText, xls: FileSpreadsheet, jpg: ImageIcon })[props.doc.kind])
</script>

<template>
  <a :href="doc.href" class="doc" target="_blank" rel="noopener">
    <component :is="icon" class="doc__type" aria-hidden="true" />
    <span class="doc__title">{{ doc.title }}</span>
    <span class="doc__kind">{{ doc.kind.toUpperCase() }}<span class="visually-hidden">, se abre en una pestaña nueva</span></span>
    <Download class="doc__dl" aria-hidden="true" />
  </a>
</template>

<style scoped>
.doc {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 1rem;
  min-height: 3.5rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--color-linea);
  color: var(--color-tinta);
  text-decoration: none;
}

.doc__type {
  width: 1.375rem;
  height: 1.375rem;
  color: var(--color-azul);
}

.doc__title {
  font-weight: 600;
}

.doc__kind {
  font-size: var(--text-xs);
  color: var(--color-pizarra);
}

.doc__dl {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--color-azul);
  transition: transform var(--duration-base) var(--ease-out);
}

.doc:hover .doc__title {
  color: var(--color-azul);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.doc:hover .doc__dl {
  transform: translateY(2px);
}
</style>
