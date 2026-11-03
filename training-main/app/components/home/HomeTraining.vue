<script setup lang="ts">
import { Download } from '@lucide/vue'
import { courses } from '~/data/courses'
</script>

<template>
  <section class="training section field-nube" aria-labelledby="training-title">
    <div class="frame">
      <div class="training__head">
        <h2 id="training-title" class="heading">Diplomados con certificación de auditor</h2>
        <p class="lede muted training__lede">
          Programas virtuales en directo, con la norma original incluida. Además, cada línea de servicio
          tiene cursos de fundamentos y de formación de auditores internos.
        </p>
      </div>

      <div class="training__list">
        <article v-for="c in courses" :key="c.slug" class="course">
          <h3 class="subheading course__name">{{ c.name }}</h3>
          <p class="course__summary">{{ c.summary }}</p>
          <dl class="course__facts">
            <div><dt>Duración</dt><dd>{{ c.hours }} horas en {{ c.sessions }} sesiones</dd></div>
            <div><dt>Modalidad</dt><dd>{{ c.mode }}</dd></div>
            <div><dt>Certifica</dt><dd>{{ c.awards.join('; ') }}</dd></div>
            <div><dt>Última edición</dt><dd>{{ c.lastCohort }}</dd></div>
          </dl>
          <div class="course__actions">
            <UiButton :to="{ path: '/contacto', query: { asunto: 'formacion', programa: c.slug } }">Consultar la próxima cohorte</UiButton>
            <a :href="c.brochure" class="link course__pdf" target="_blank" rel="noopener">
              <Download aria-hidden="true" />Folleto de la última edición (PDF)
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.training__lede {
  margin-top: 1.25rem;
}

.training__list {
  display: grid;
  gap: 3rem;
  margin-top: 3.5rem;
}

.course {
  display: grid;
  align-content: start;
  gap: 1.25rem;
  padding-top: 1.75rem;
  border-top: 2px solid var(--color-azul);
}

.course__summary {
  max-width: 36rem;
}

.course__facts {
  display: grid;
  gap: 0.75rem;
}

.course__facts div {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-linea);
}

.course__facts dt {
  font-weight: 700;
  color: var(--color-azul-hondo);
}

.course__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 0.5rem;
}

.course__pdf {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.course__pdf svg {
  width: 1.125rem;
  height: 1.125rem;
}

@media (width >= 64rem) {
  .training__head {
    max-width: 50rem;
  }

  .training__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--spacing-gutter);
    row-gap: 1.25rem;
  }

  /* Both programmes share rows, down to each fact, so everything lines up. */
  .course {
    grid-row: span 7;
    grid-template-rows: subgrid;
  }

  .course__facts {
    grid-row: span 4;
    grid-template-rows: subgrid;
  }
}
</style>
