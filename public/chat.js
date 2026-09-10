'use strict';

const panel = document.getElementById('chat-panel');
const toggle = document.getElementById('chat-toggle');
const closeButton = document.getElementById('chat-close');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const sendButton = document.getElementById('chat-send');
const messages = document.getElementById('chat-messages');
const status = document.getElementById('chat-status');
let waiting = false;

function setOpen(open) {
  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.firstChild.textContent = open ? 'Cerrar asistente ' : 'Abrir asistente ';
  (open ? input : toggle).focus();
}

if (toggle) {
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  closeButton.addEventListener('click', () => setOpen(false));
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      event.preventDefault();
    }
  });
}

document.querySelectorAll('[data-question]').forEach((button) => {
  button.addEventListener('click', () => {
    if (toggle) setOpen(true);
    if (!waiting) input.value = button.dataset.question;
    input.focus();
  });
});

function addMessage(author, text, kind) {
  const message = document.createElement('p');
  message.className = `message ${kind}`;
  const label = document.createElement('strong');
  label.textContent = author;
  const content = document.createElement('span');
  content.textContent = text;
  message.append(label, content);
  messages.append(message);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (waiting) return;
  const mensaje = input.value.trim();
  if (!mensaje || mensaje.length > 1000) {
    status.textContent = 'Escribe una consulta de 1 a 1000 caracteres.';
    input.focus();
    return;
  }

  waiting = true;
  input.readOnly = true;
  sendButton.disabled = true;
  addMessage('Tú', mensaje, 'user');
  input.value = '';
  status.textContent = 'Consultando…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje }),
      signal: controller.signal
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(typeof data.error === 'string'
        ? data.error
        : response.status === 503
          ? 'Gemini no está disponible temporalmente. Intenta de nuevo en unos segundos.'
          : 'No se pudo completar la consulta. Inténtalo de nuevo.');
    }
    if (typeof data.respuesta !== 'string' || !data.respuesta.trim()) {
      throw new Error('El servidor no devolvió una respuesta válida. Inténtalo de nuevo.');
    }
    addMessage('Asistente', data.respuesta, 'assistant');
  } catch (error) {
    const detail = error.name === 'AbortError'
      ? 'La consulta tardó demasiado. Inténtalo de nuevo.'
      : error instanceof TypeError || error instanceof SyntaxError
        ? 'No se pudo conectar con el asistente. Revisa la conexión e inténtalo de nuevo.'
        : error.message;
    addMessage('Error', detail, 'error');
    input.value = mensaje;
  } finally {
    clearTimeout(timeout);
    waiting = false;
    input.readOnly = false;
    sendButton.disabled = false;
    status.textContent = '';
  }
});
