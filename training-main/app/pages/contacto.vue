<script setup lang="ts">
import { Phone, Mail, MapPin, MessageCircle } from '@lucide/vue'
import { company } from '~/data/company'

usePageSeo({
  title: 'Contacto y cotizaciones',
  description: 'Solicite una cotización, información sobre formación o radique una petición, queja o reclamo. Teléfonos, WhatsApp, correo y sede en Medellín.',
})
</script>

<template>
  <div>
    <PageHeader
      title="Contacto"
      lede="Solicite una cotización, pregunte por la próxima cohorte de un programa o radique una petición, queja o reclamo."
    >
      <!-- Phones only: the channels panel sits below the long form there, so call and chat come first. -->
      <div class="quick">
        <a :href="company.phones[0].href" class="quick__link"><Phone aria-hidden="true" />Llamar</a>
        <a :href="company.whatsapp.href" target="_blank" rel="noopener" class="quick__link"><MessageCircle aria-hidden="true" />WhatsApp</a>
      </div>
    </PageHeader>

    <section class="contact" aria-label="Formulario y canales de contacto">
      <div class="frame grid-page contact__grid">
        <div class="contact__form">
          <ContactForm />
        </div>

        <div class="contact__channels field-azul">
          <h2 id="canales" class="subheading">Prefiere hablar directamente</h2>
          <ul class="channels">
            <li>
              <Phone aria-hidden="true" />
              <div>
                <p class="channels__label">Teléfonos</p>
                <a v-for="p in company.phones" :key="p.href" :href="p.href" class="channels__value">{{ p.display }}</a>
              </div>
            </li>
            <li>
              <MessageCircle aria-hidden="true" />
              <div>
                <p class="channels__label">WhatsApp</p>
                <a :href="company.whatsapp.href" target="_blank" rel="noopener" class="channels__value">{{ company.whatsapp.display }}</a>
              </div>
            </li>
            <li>
              <Mail aria-hidden="true" />
              <div>
                <p class="channels__label">Correo</p>
                <a :href="`mailto:${company.email}`" class="channels__value channels__email">{{ company.email.split('@')[0] }}@<wbr>{{ company.email.split('@')[1] }}</a>
              </div>
            </li>
            <li>
              <MapPin aria-hidden="true" />
              <div>
                <p class="channels__label">Sede administrativa</p>
                <a :href="company.address.mapUrl" target="_blank" rel="noopener" class="channels__value">
                  {{ company.address.building }}, {{ company.address.office.toLowerCase() }}<br>{{ company.address.street }}<br>{{ company.address.area }}, {{ company.address.city }}
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.quick {
  display: flex;
  gap: 0.75rem;
}

.quick__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.5rem 1.125rem;
  border: 2px solid var(--color-azul);
  border-radius: var(--radius-control);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-azul);
  text-decoration: none;
}

.quick__link svg {
  width: 1.125rem;
  height: 1.125rem;
}

@media (width >= 64rem) {
  .quick {
    display: none;
  }
}

.contact {
  padding-bottom: var(--spacing-section);
}

.contact__grid {
  row-gap: 3rem;
  align-items: start;
}

.contact__form,
.contact__channels {
  grid-column: 1 / -1;
}

.contact__channels {
  padding: clamp(1.5rem, 1rem + 2vw, 2.5rem);
}

.channels {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.75rem;
}

.channels li {
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr);
  gap: 1rem;
}

.channels svg {
  width: 1.5rem;
  height: 1.5rem;
}

.channels__label {
  font-size: var(--text-xs);
  font-weight: 700;
}

.channels__value {
  display: block;
  font-size: var(--text-lg);
  font-weight: 600;
  color: inherit;
  text-decoration: none;
}

.channels__value:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.channels__email {
  font-size: var(--text-base);
  overflow-wrap: anywhere;
}

@media (width >= 64rem) {
  .contact__form { grid-column: 1 / span 7; }
  .contact__channels { grid-column: 8 / -1; position: sticky; top: calc(var(--header-offset) + 1.5rem); }
}
</style>
