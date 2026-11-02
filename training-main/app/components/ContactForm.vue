<script setup lang="ts">
import { CircleCheck, CircleAlert, X } from '@lucide/vue'
import { services, findMode, findService, servicePath } from '~/data/services'
import { courses } from '~/data/courses'
import { company } from '~/data/company'

const route = useRoute()
const quote = useQuote()
const quoteLabel = (mode: string, line: string) => `${findMode(mode)?.name ?? ''}, ${findService(line)?.short ?? ''}`

const form = reactive<ContactRequest>({
  nombre: '',
  empresa: '',
  correo: '',
  telefono: '',
  tipo: '',
  linea: '',
  mensaje: '',
  servicios: [],
  datos: false,
  web: '',
})

// The page is prerendered without a query string, so links such as
// /contacto?linea=hseq or ?asunto=formacion&programa=… prefill after hydration.
onMounted(() => {
  const q = route.query
  const kind = String(q.asunto ?? q.tipo ?? '')
  const programa = courses.find((c) => c.slug === q.programa)
  if (requestKinds.some((k) => k.value === kind)) form.tipo = kind as RequestKind
  else if (q.linea) form.tipo = 'cotizacion'
  if (services.some((s) => s.slug === q.linea)) form.linea = String(q.linea)
  else if (programa?.line) form.linea = programa.line
  if (programa) form.mensaje = `Quisiera información sobre la próxima cohorte del ${programa.name.toLowerCase()}.`
})

// Services marked while browsing make this a quote request.
watch(quote.count, (n) => { if (n && !form.tipo) form.tipo = 'cotizacion' }, { immediate: true })

const errors = ref<ContactErrors>({})
const status = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle')
const summary = useTemplateRef<HTMLElement>('summary')

// Each error in the summary takes the visitor to the field it is about.
function focusField(name: string) {
  const field = summary.value?.closest('form')?.querySelector<HTMLElement>(`[name="${name}"]`)
  field?.focus({ preventScroll: true })
  field?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}
const done = useTemplateRef<HTMLElement>('done')

const lineOptions = services.map((s) => ({ value: s.slug, label: s.name }))

async function submit() {
  form.servicios = quote.items.value.map((i) => `${quoteLabel(i.mode, i.line)}: ${i.text}`)
  errors.value = validateContact(form)
  if (Object.keys(errors.value).length) {
    await nextTick()
    summary.value?.focus()
    return
  }
  status.value = 'sending'
  try {
    await $fetch('/api/contacto', { method: 'POST', body: form })
    status.value = 'sent'
    quote.clear()
    await nextTick()
    done.value?.focus()
  }
  catch {
    status.value = 'failed'
    await nextTick()
    summary.value?.focus()
  }
}
</script>

<template>
  <div class="contact-form">
    <div v-if="status === 'sent'" ref="done" class="notice notice--ok" tabindex="-1" role="status">
      <CircleCheck aria-hidden="true" />
      <div>
        <p class="notice__title">{{ form.servicios.length ? 'Solicitud enviada' : 'Mensaje enviado' }}</p>
        <p>Le responderemos a {{ form.correo }}. Si es urgente, llámenos al {{ company.phones[0].display }}.</p>
      </div>
    </div>

    <form v-else novalidate @submit.prevent="submit">
      <div ref="summary" tabindex="-1" class="summary-anchor">
        <div v-if="Object.keys(errors).length" class="notice notice--error" role="alert">
          <CircleAlert aria-hidden="true" />
          <div>
            <p class="notice__title">Revise {{ Object.keys(errors).length === 1 ? 'un campo' : `${Object.keys(errors).length} campos` }} antes de enviar</p>
            <ul><li v-for="(msg, key) in errors" :key="key"><a :href="`#${key}`" class="link" @click.prevent="focusField(key)">{{ msg }}</a></li></ul>
          </div>
        </div>
        <div v-else-if="status === 'failed'" class="notice notice--error" role="alert">
          <CircleAlert aria-hidden="true" />
          <div>
            <p class="notice__title">El mensaje no se pudo enviar desde el sitio</p>
            <p>
              Escríbanos a <a :href="`mailto:${company.email}`" class="link">{{ company.email }}</a>
              o llame al <a :href="company.phones[0].href" class="link">{{ company.phones[0].display }}</a>. Sus datos siguen en el formulario.
            </p>
          </div>
        </div>
      </div>

      <fieldset class="kinds">
        <legend class="kinds__legend">¿Qué necesita?</legend>
        <div class="kinds__options" :aria-describedby="errors.tipo ? 'tipo-error' : undefined">
          <label v-for="k in requestKinds" :key="k.value" class="kind">
            <input v-model="form.tipo" type="radio" name="tipo" :value="k.value" class="kind__input">
            <span class="kind__label">{{ k.label }}</span>
          </label>
        </div>
        <p v-if="errors.tipo" id="tipo-error" class="kinds__error">{{ errors.tipo }}</p>
      </fieldset>

      <section v-if="quote.count.value" class="picked" aria-labelledby="picked-title">
        <h2 id="picked-title" class="picked__title">Servicios de su solicitud ({{ quote.count.value }})</h2>
        <ul class="picked__list">
          <li v-for="i in quote.items.value" :key="`${i.mode}${i.line}${i.text}`" class="picked__item">
            <span>
              <NuxtLink :to="servicePath(i.mode, i.line)" class="picked__meta">{{ quoteLabel(i.mode, i.line) }}</NuxtLink>
              {{ i.text }}
            </span>
            <button type="button" class="picked__remove" @click="quote.remove(i)">
              <X aria-hidden="true" /><span class="visually-hidden">Quitar {{ i.text }}</span>
            </button>
          </li>
        </ul>
        <NuxtLink to="/portafolio-de-servicios" class="link picked__more">Agregar más servicios</NuxtLink>
      </section>

      <div class="grid2">
        <UiField v-model="form.nombre" label="Nombre" name="nombre" required autocomplete="name" :error="errors.nombre" />
        <UiField v-model="form.empresa" label="Organización" name="empresa" autocomplete="organization" />
        <UiField v-model="form.correo" label="Correo electrónico" name="correo" type="email" required autocomplete="email" :error="errors.correo" />
        <UiField v-model="form.telefono" label="Teléfono" name="telefono" type="tel" autocomplete="tel" :error="errors.telefono" />
      </div>

      <UiField v-if="form.tipo !== 'pqr' && !quote.count.value" v-model="form.linea" label="Línea de servicio" name="linea" type="select" :options="lineOptions" />
      <UiField
        v-model="form.mensaje"
        label="Mensaje"
        name="mensaje"
        type="textarea"
        :required="!quote.count.value"
        :hint="form.tipo === 'pqr' ? 'Incluya la fecha y el servicio al que se refiere.' : 'La norma, el alcance o la fecha que tiene en mente nos ayudan a responder mejor.'"
        :error="errors.mensaje"
      />

      <div class="hp" aria-hidden="true">
        <label>No llenar <input v-model="form.web" type="text" name="web" tabindex="-1" autocomplete="off"></label>
      </div>

      <div class="consent" :class="{ 'consent--error': errors.datos }">
        <label class="consent__label">
          <input v-model="form.datos" type="checkbox" name="datos" :aria-invalid="errors.datos ? true : undefined" :aria-describedby="errors.datos ? 'datos-error' : undefined">
          <span>
            Autorizo el tratamiento de mis datos para responder esta solicitud, según la
            <a href="/docs/Proteccion-datos.pdf" class="link" target="_blank" rel="noopener">política de protección de datos</a>.
          </span>
        </label>
        <p v-if="errors.datos" id="datos-error" class="kinds__error">{{ errors.datos }}</p>
      </div>

      <UiButton type="submit" :disabled="status === 'sending'">
        {{ status === 'sending' ? 'Enviando…' : quote.count.value ? 'Enviar solicitud' : 'Enviar mensaje' }}
      </UiButton>
    </form>
  </div>
</template>

<style scoped>
form {
  display: grid;
  gap: 1.75rem;
}

.picked {
  padding: 1.25rem 1.5rem;
  border: 2px solid var(--color-azul);
  border-radius: 10px;
}

.picked__title {
  font-size: var(--text-lg);
  letter-spacing: 0;
  color: var(--color-azul);
}

.picked__list {
  margin-top: 0.75rem;
}

.picked__item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  padding-block: 0.625rem;
  border-bottom: 1px solid var(--color-linea);
}

.picked__meta {
  display: block;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-azul-hondo);
}

.picked__remove {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  color: var(--color-pizarra);
  cursor: pointer;
}

.picked__remove:hover {
  background: var(--color-nube);
  color: var(--color-error);
}

.picked__remove svg {
  width: 1.125rem;
  height: 1.125rem;
}

.picked__more {
  display: inline-block;
  margin-top: 1rem;
  font-size: var(--text-sm);
}

.summary-anchor:focus {
  outline: none;
}

.notice {
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-left: 4px solid;
  border-radius: var(--radius-control);
}

.notice svg {
  width: 1.5rem;
  height: 1.5rem;
}

.notice:focus {
  outline: var(--focus-ring);
  outline-offset: 3px;
}

.notice--ok {
  background: var(--color-nube);
  border-color: var(--color-azul);
  color: var(--color-tinta);
}

.notice--ok svg {
  color: var(--color-azul);
}

.notice--error {
  background: #fbeeed;
  border-color: var(--color-error);
}

.notice--error svg {
  color: var(--color-error);
}

.notice__title {
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.notice ul {
  list-style: disc;
  padding-left: 1.25rem;
}

.notice--error .link {
  color: var(--color-error);
}

.kinds {
  border: 0;
  padding: 0;
  margin: 0;
}

.kinds__legend {
  margin-bottom: 0.75rem;
  font-weight: 700;
}

.kinds__options {
  display: grid;
  gap: 0.5rem;
}

.kind {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 3.25rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-linea);
  border-radius: var(--radius-control);
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out);
}

.kind:hover {
  border-color: var(--color-pizarra);
}

.kind:has(:checked) {
  border-color: var(--color-azul);
  background: var(--color-nube);
}

.kind:has(:focus-visible) {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.kind__input {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--color-azul);
}

.kind__label {
  font-weight: 600;
}

.kinds__error {
  margin-top: 0.5rem;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-error);
}

.grid2 {
  display: grid;
  gap: 1.75rem var(--spacing-gutter);
}

.hp {
  position: absolute;
  left: -9999px;
}

.consent__label {
  display: grid;
  grid-template-columns: 1.25rem 1fr;
  gap: 0.75rem;
  align-items: start;
  font-size: var(--text-sm);
  cursor: pointer;
}

.consent__label input {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.15rem;
  accent-color: var(--color-azul);
}

form > :deep(.btn) {
  justify-self: start;
}

@media (width >= 40rem) {
  .kinds__options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
