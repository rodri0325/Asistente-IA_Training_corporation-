<script setup lang="ts">
import { company } from '~/data/company'

interface Message {
  id: number
  author: 'Tú' | 'Asistente' | 'Error'
  text: string
  kind: 'user' | 'assistant' | 'error'
  whatsapp?: boolean
}

const { public: { chatApiUrl } } = useRuntimeConfig()
const launcher = useTemplateRef<HTMLButtonElement>('launcher')
const input = useTemplateRef<HTMLInputElement>('input')
const messageList = useTemplateRef<HTMLDivElement>('messageList')
const isOpen = ref(false)
const isWaiting = ref(false)
const question = ref('')
const status = ref('')
const messages = ref<Message[]>([
  {
    id: 0,
    author: 'Asistente',
    text: '¡Hola! Con gusto te ayudo a encontrar el curso ideal. Puedo mostrarte las categorías o resolver tus dudas sobre precios, fechas, modalidades y requisitos. ¿Qué estás buscando?',
    kind: 'assistant',
  },
])
let nextMessageId = 1
let activeRequest: AbortController | undefined
let isDisposed = false

function addMessage(author: Message['author'], text: string, kind: Message['kind'], whatsapp = false) {
  messages.value.push({ id: nextMessageId++, author, text, kind, whatsapp })
  nextTick(() => {
    if (messageList.value) messageList.value.scrollTop = messageList.value.scrollHeight
  })
}

function chatEndpoint() {
  if (typeof chatApiUrl !== 'string' || !chatApiUrl.trim()) {
    throw new Error('El asistente no está configurado. Inténtalo más tarde.')
  }

  let url: URL
  try {
    url = new URL(chatApiUrl.trim())
  } catch {
    throw new Error('La dirección del asistente no es válida. Inténtalo más tarde.')
  }

  const isLocalHost = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  const isLocalHttp = isLocalHost && url.protocol === 'http:' && window.location.protocol === 'http:'
  if (
    (url.protocol !== 'https:' && !isLocalHttp)
    || url.username
    || url.password
    || url.search
    || url.hash
  ) {
    throw new Error('La conexión segura con el asistente no está disponible.')
  }

  url.pathname = `${url.pathname.replace(/\/+$/, '')}/chat`
  return url.href
}

async function submitQuestion() {
  if (isWaiting.value) return

  const text = question.value.trim()
  if (!text || text.length > 1000) {
    status.value = 'Escribe una consulta de 1 a 1000 caracteres.'
    input.value?.focus()
    return
  }

  isWaiting.value = true
  question.value = ''
  status.value = 'Consultando…'
  const history = messages.value
    .filter((message) => message.kind === 'user' || message.kind === 'assistant')
    .slice(-8)
    .map((message) => ({
      role: message.kind === 'user' ? 'user' as const : 'assistant' as const,
      text: message.text,
    }))
  addMessage('Tú', text, 'user')

  const request = new AbortController()
  activeRequest = request
  const timeout = window.setTimeout(() => request.abort(), 70000)

  try {
    const response = await fetch(chatEndpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({ mensaje: text, historial: history }),
      signal: request.signal,
    })
    const data: unknown = await response.json()

    if (!data || typeof data !== 'object') {
      throw new Error('El asistente devolvió una respuesta inválida.')
    }

    const reply = 'respuesta' in data ? data.respuesta : undefined
    const errorMessage = 'error' in data ? data.error : undefined
    const whatsapp = 'accion' in data && data.accion === 'whatsapp'
    if (!response.ok) {
      throw new Error(
        typeof errorMessage === 'string'
          ? errorMessage
          : 'No se pudo completar la consulta. Inténtalo de nuevo.',
      )
    }
    if (typeof reply !== 'string' || !reply.trim()) {
      throw new Error('El asistente devolvió una respuesta vacía. Inténtalo de nuevo.')
    }

    if (!isDisposed) addMessage('Asistente', reply, 'assistant', whatsapp)
  } catch (error) {
    if (isDisposed) return
    const detail = error instanceof Error && error.name === 'AbortError'
      ? 'La consulta tardó demasiado. Inténtalo de nuevo.'
      : error instanceof TypeError || error instanceof SyntaxError
        ? 'No se pudo conectar con el asistente. Revisa la conexión e inténtalo de nuevo.'
        : error instanceof Error
          ? error.message
          : 'Ocurrió un error al consultar el asistente. Inténtalo de nuevo.'
    addMessage('Error', detail, 'error')
    question.value = text
    input.value?.focus()
  } finally {
    window.clearTimeout(timeout)
    if (activeRequest === request) activeRequest = undefined
    if (!isDisposed) {
      isWaiting.value = false
      status.value = ''
    }
  }
}

async function openChat() {
  isOpen.value = true
  await nextTick()
  input.value?.focus()
}

function closeChat() {
  isOpen.value = false
  launcher.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) closeChat()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  isDisposed = true
  window.removeEventListener('keydown', onKeydown)
  activeRequest?.abort()
})
</script>

<template>
  <div class="chat-widget">
    <Transition name="chat-panel">
      <section
        v-if="isOpen"
        id="chat-widget-panel"
        class="chat-widget__panel"
        role="dialog"
        aria-labelledby="chat-widget-title"
        aria-modal="false"
      >
        <header class="chat-widget__header">
          <div class="chat-widget__heading">
            <span class="chat-widget__emblem" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" focusable="false">
                <path d="M5 5h14v11H9l-4 3V5Z" />
                <path d="M9 9h6M9 12h4" />
              </svg>
            </span>
            <div>
              <h2 id="chat-widget-title">Asistente de cursos</h2>
              <p>TRAINING CORPORATION</p>
            </div>
          </div>
          <button
            type="button"
            class="chat-widget__close"
            aria-label="Cerrar asistente"
            @click="closeChat"
          >
            ×
          </button>
        </header>

        <div ref="messageList" class="chat-widget__messages" role="log" aria-label="Conversación" aria-live="polite" aria-relevant="additions">
          <p
            v-for="message in messages"
            :key="message.id"
            class="chat-widget__message"
            :class="`chat-widget__message--${message.kind}`"
          >
            <strong>{{ message.author }}</strong>
            <span>{{ message.text }}</span>
            <a
              v-if="message.whatsapp"
              :href="company.whatsapp.href"
              class="chat-widget__whatsapp"
              target="_blank"
              rel="noopener"
            >
              Escribir por WhatsApp · {{ company.whatsapp.display }}
            </a>
          </p>
        </div>

        <p class="chat-widget__status" role="status" aria-live="polite">{{ status }}</p>
        <form class="chat-widget__form" @submit.prevent="submitQuestion">
          <label for="chat-widget-input">Tu consulta</label>
          <div class="chat-widget__input-row">
            <input
              id="chat-widget-input"
              ref="input"
              v-model="question"
              name="mensaje"
              type="text"
              placeholder="Escribe tu pregunta…"
              maxlength="1000"
              required
              autocomplete="off"
              aria-describedby="chat-widget-hint"
              :readonly="isWaiting"
            >
            <button type="submit" :disabled="isWaiting">Enviar</button>
          </div>
          <small id="chat-widget-hint">Incluye el nombre del curso.</small>
        </form>
      </section>
    </Transition>

    <button
      ref="launcher"
      type="button"
      class="chat-widget__launcher"
      :aria-expanded="isOpen"
      aria-controls="chat-widget-panel"
      :aria-label="isOpen ? 'Cerrar asistente de cursos' : 'Abrir asistente de cursos'"
      @click="isOpen ? closeChat() : openChat()"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M5 5h14v11H9l-4 3V5Z" />
        <path d="M9 9h6M9 12h4" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.chat-widget {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: calc(max(1rem, env(safe-area-inset-bottom)) + 5rem + 0.75rem);
  z-index: 31;
  width: min(390px, calc(100vw - 2rem));
  color: var(--color-tinta);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: 1.5;
  pointer-events: none;
}

.chat-widget button,
.chat-widget input {
  box-sizing: border-box;
  font: inherit;
}

.chat-widget button {
  cursor: pointer;
  touch-action: manipulation;
}

.chat-widget button:focus-visible,
.chat-widget input:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 3px;
}

.chat-widget__launcher {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  margin-left: auto;
  padding: 0;
  border: 1px solid var(--color-noche);
  border-radius: 50%;
  background: var(--color-noche);
  color: var(--color-blanco);
  box-shadow: 0 4px 8px #111b2914, 0 12px 30px #111b2929;
  pointer-events: auto;
  transition: background-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
}

.chat-widget__launcher:hover {
  transform: translateY(-2px);
  background: var(--color-azul-hondo);
}

.chat-widget__launcher svg {
  width: 1.625rem;
  height: 1.625rem;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chat-widget__panel {
  position: absolute;
  right: 0;
  bottom: calc(3.5rem + 0.75rem);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: min(540px, calc(100dvh - 12rem));
  overflow: hidden;
  border: 1px solid var(--color-linea);
  border-radius: var(--radius-control);
  background: var(--color-blanco);
  box-shadow: 0 4px 16px #111b290f, 0 20px 60px #111b292e;
  pointer-events: auto;
}

.chat-widget__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-shrink: 0;
  padding: 18px 16px;
  background: var(--color-noche);
  color: var(--color-blanco);
}

.chat-widget__heading {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.chat-widget__emblem {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 1px solid rgb(127 208 245 / 30%);
  border-radius: var(--radius-control);
  background: rgb(127 208 245 / 7%);
  color: var(--color-cielo);
}

.chat-widget__emblem svg {
  width: 22px;
  height: 22px;
}

.chat-widget__emblem path,
.chat-widget__launcher path {
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chat-widget__header h2,
.chat-widget__header p {
  margin: 0;
}

.chat-widget__header h2 {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
}

.chat-widget__header p {
  margin-top: 4px;
  color: var(--color-niebla);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.06em;
}

.chat-widget__close {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--color-niebla);
  font-size: 24px;
  line-height: 1;
}

.chat-widget__close:hover {
  background: rgb(255 255 255 / 8%);
}

.chat-widget__messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  gap: 16px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 20px 16px;
  background: var(--color-nube);
}

.chat-widget__message {
  max-width: 92%;
  margin: 0;
  padding: 13px 15px;
  border: 1px solid var(--color-linea);
  border-radius: var(--radius-control);
  font-size: var(--text-xs);
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.chat-widget__message strong {
  display: block;
  margin-bottom: 4px;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 700;
}

.chat-widget__message span {
  white-space: pre-wrap;
}

.chat-widget__whatsapp {
  display: inline-flex;
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-control);
  background: #e8f5ed;
  color: #176b3a;
  font-weight: 700;
  text-decoration: none;
}

.chat-widget__whatsapp:hover {
  background: #d7eddf;
  text-decoration: underline;
}

.chat-widget__message--assistant {
  align-self: flex-start;
  background: var(--color-blanco);
}

.chat-widget__message--user {
  align-self: flex-end;
  border-color: var(--color-azul);
  background: var(--color-azul);
  color: var(--color-blanco);
}

.chat-widget__message--error {
  align-self: flex-start;
  border-color: var(--color-error);
  background: var(--color-blanco);
  color: var(--color-error);
}

.chat-widget__status {
  min-height: 27px;
  flex-shrink: 0;
  margin: 0;
  padding: 3px 16px;
  color: var(--color-pizarra);
  font-size: 12px;
}

.chat-widget__form {
  flex-shrink: 0;
  margin: 0;
  padding: 14px 16px 16px;
  border-top: 1px solid var(--color-linea);
}

.chat-widget__form label {
  display: block;
  margin-bottom: 6px;
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
}

.chat-widget__input-row {
  display: flex;
  gap: 8px;
}

.chat-widget__input-row input {
  width: 100%;
  min-width: 0;
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid var(--color-linea);
  border-radius: var(--radius-control);
  background: var(--color-blanco);
  color: var(--color-tinta);
  font-size: 16px;
}

.chat-widget__input-row input::placeholder {
  color: var(--color-pizarra);
  opacity: 1;
}

.chat-widget__input-row button {
  min-height: 46px;
  padding: 10px 14px;
  border: 0;
  border-radius: var(--radius-control);
  background: var(--color-azul);
  color: var(--color-blanco);
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
}

.chat-widget__input-row button:hover:not(:disabled) {
  background: var(--color-azul-hondo);
}

.chat-widget__input-row button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.chat-widget__form small {
  display: block;
  margin-top: 6px;
  color: var(--color-pizarra);
  font-size: 12px;
}

.chat-panel-enter-active,
.chat-panel-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.chat-panel-enter-from,
.chat-panel-leave-to {
  transform: translateY(0.5rem);
  opacity: 0;
}

@media (max-height: 420px) {
  .chat-widget__header {
    padding: 8px 12px;
  }

  .chat-widget__header p,
  .chat-widget__form small {
    display: none;
  }

  .chat-widget__status {
    min-height: 20px;
    padding-block: 0;
  }

  .chat-widget__form {
    padding: 8px 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chat-widget__launcher,
  .chat-panel-enter-active,
  .chat-panel-leave-active {
    transition: none;
  }
}
</style>
