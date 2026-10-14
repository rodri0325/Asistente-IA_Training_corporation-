/** Shared behavior for the website, standalone chat and WordPress widget. */
export function createChatUI(root, { endpoint }) {
  const panel = root.querySelector('#chat-panel');
  const toggle = root.querySelector('#chat-toggle');
  const closeButton = root.querySelector('#chat-close');
  const form = root.querySelector('#chat-form');
  const input = root.querySelector('#chat-input');
  const sendButton = root.querySelector('#chat-send');
  const messages = root.querySelector('#chat-messages');
  const status = root.querySelector('#chat-status');
  const ownerDocument = panel.ownerDocument;
  let waiting = false;

  function setOpen(open) {
    if (!toggle) return;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    const label = toggle.querySelector('[data-toggle-label]');
    if (label) label.textContent = open ? 'Cerrar asistente' : 'Abrir asistente';
    else toggle.firstChild.textContent = open ? 'Cerrar asistente ' : 'Abrir asistente ';
    (open ? input : toggle).focus();
  }

  function setQuestion(text) {
    if (waiting || typeof text !== 'string') return false;
    const question = text.trim();
    if (!question || question.length > 1000) return false;
    input.value = question;
    status.textContent = '';
    if (toggle) setOpen(true);
    else input.focus();
    return true;
  }

  if (toggle) {
    toggle.addEventListener('click', () => setOpen(panel.hidden));
    closeButton?.addEventListener('click', () => setOpen(false));
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        event.preventDefault();
      }
    });
  }

  root.querySelectorAll('[data-question]').forEach((button) => {
    button.addEventListener('click', () => {
      if (toggle) setOpen(true);
      if (!waiting) input.value = button.dataset.question;
      input.focus();
    });
  });

  function addMessage(author, text, kind) {
    const message = ownerDocument.createElement('p');
    message.className = `message ${kind}`;
    const label = ownerDocument.createElement('strong');
    label.textContent = author;
    const content = ownerDocument.createElement('span');
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
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
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

  return { open: () => setOpen(true), close: () => setOpen(false), setQuestion };
}
