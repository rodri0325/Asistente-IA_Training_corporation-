import { createChatUI } from '../public/chat-ui.js';
import styles from './widget.css';
import markup from './widget.html';

const HOST_ID = 'training-chat-root';
const CONTROLLER_KEY = '__trainingChatController';

function chatEndpoint(config) {
  if (!config || typeof config.apiUrl !== 'string' || !config.apiUrl.trim()) {
    throw new Error('Training Chat: configura apiUrl con la URL del backend.');
  }
  let url;
  try {
    url = new URL(config.apiUrl.trim());
  } catch {
    throw new Error('Training Chat: apiUrl debe ser una URL absoluta válida.');
  }
  const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  const localHttp = localHost && url.protocol === 'http:' && window.location.protocol === 'http:';
  if ((url.protocol !== 'https:' && !localHttp) || url.username || url.password || config.apiUrl.includes('?') || config.apiUrl.includes('#')) {
    throw new Error('Training Chat: usa HTTPS sin credenciales, parámetros ni fragmentos; HTTP solo se permite en localhost desde una página HTTP.');
  }
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/chat`;
  return url.href;
}

/** apiUrl is the backend base URL, without /chat. Repeated calls reuse the widget. */
export function init(config) {
  const existing = document.getElementById(HOST_ID);
  if (existing?.[CONTROLLER_KEY]) return existing[CONTROLLER_KEY];
  if (existing) throw new Error(`Training Chat: el identificador ${HOST_ID} ya está ocupado.`);
  const endpoint = chatEndpoint(config);
  if (!document.body) throw new Error('Training Chat: espera a DOMContentLoaded antes de llamar a init.');

  const host = document.createElement('div');
  host.id = HOST_ID;
  host.lang = 'es';
  host.dir = 'ltr';
  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = styles;
  const template = document.createElement('template');
  // Only bundled, static HTML is parsed; messages and configuration never enter HTML.
  template.innerHTML = markup;
  shadow.append(style, template.content.cloneNode(true));
  const controller = { host, ...createChatUI(shadow, { endpoint }) };
  host[CONTROLLER_KEY] = controller;
  document.body.append(host);
  return controller;
}

function autoInit() {
  if (!window.TrainingChatConfig) return;
  try {
    init(window.TrainingChatConfig);
  } catch (error) {
    console.error(error.message);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit, { once: true });
} else {
  autoInit();
}
