import { test, expect } from '@playwright/test';

const siteUrl = 'http://127.0.0.1:9400';
const apiUrl = 'http://127.0.0.1:5000';
const chatUrl = `${apiUrl}/chat`;
const settingsPath = '/wp-admin/options-general.php?page=taia-settings';
const widgetAsset = '/wp-content/plugins/training-asistente-ia/assets/training-chat.js';

async function openWidget(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir asistente', exact: true }).click();
  await expect(page.locator('#chat-input')).toBeFocused();
}

async function login(page) {
  await page.goto(`/wp-login.php?redirect_to=${encodeURIComponent(siteUrl + settingsPath)}`, { waitUntil: 'domcontentloaded' });
  const username = page.locator('#user_login');
  const password = page.locator('#user_pass');
  // WordPress schedules wp_attempt_focus after rendering; let it finish first.
  await expect(username).toBeFocused();
  await username.fill('admin');
  await password.fill('training-local-demo');
  await expect(username).toHaveValue('admin');
  await expect(password).toHaveValue('training-local-demo');
  await Promise.all([
    page.waitForURL('**/options-general.php?page=taia-settings', { waitUntil: 'domcontentloaded' }),
    page.locator('#wp-submit').click(),
  ]);
}

async function saveSettings(page, { enabled = true, url = apiUrl } = {}) {
  await page.goto(settingsPath);
  await page.locator('#taia_enabled').setChecked(enabled);
  await page.locator('#taia_api_url').fill(url);
  await Promise.all([
    page.waitForURL('**/options-general.php?page=taia-settings&settings-updated=true'),
    page.getByRole('button', { name: 'Save Changes', exact: true }).click(),
  ]);
  await expect(page.locator('#taia_api_url')).toBeVisible();
}

async function expectNoWidget(page) {
  await page.goto('/');
  await expect(page.locator('#training-chat-root')).toHaveCount(0);
  await expect(page.locator('script[src*="/assets/training-chat.js"]')).toHaveCount(0);
  expect(await page.evaluate(() => typeof globalThis.TrainingChat)).toBe('undefined');
  expect(await page.evaluate(() => typeof globalThis.TrainingChatConfig)).toBe('undefined');
}

test('WordPress envía una consulta al backend de otro origen y muestra la respuesta', async ({ page }) => {
  await openWidget(page);
  const question = '¿Cuál es el precio de Excel Avanzado?';
  await page.locator('#chat-input').fill(question);
  const [response] = await Promise.all([
    page.waitForResponse((item) => item.url() === chatUrl && item.request().method() === 'POST'),
    page.getByRole('button', { name: 'Enviar', exact: true }).click(),
  ]);
  expect(response.status()).toBe(200);
  expect(response.headers()['access-control-allow-origin']).toBe(siteUrl);
  expect((await response.request().allHeaders()).origin).toBe(siteUrl);
  expect(response.request().postDataJSON()).toEqual({ mensaje: question });
  await expect(page.locator('.message.assistant').last()).toHaveText('AsistenteExcel Avanzado\nPrecio: 450.000 COP.');
  await expect(page.locator('.message.user')).toHaveText(`Tú${question}`);
  await expect(page.locator('#chat-send')).toBeEnabled();
});

test('consultar un curso desde la portada prepara la pregunta y responde sobre ese curso', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const dimensions = await page.evaluate(() => ({
    content: globalThis.document.documentElement.scrollWidth,
    viewport: globalThis.document.documentElement.clientWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  await page.getByRole('link', { name: 'Explorar cursos' }).click();
  await expect(page).toHaveURL(/#cursos$/);
  await page.getByRole('button', { name: 'Consultar curso: Python para Análisis de Datos', exact: true }).click();
  await expect(page.locator('#chat-panel')).toBeVisible();
  await expect(page.locator('#chat-input')).toBeFocused();
  await expect(page.locator('#chat-input')).toHaveValue('¿Cuáles son el precio, las modalidades y los requisitos de Python para Análisis de Datos?');
  await expect(page.locator('.message.user')).toHaveCount(0);
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  const answer = page.locator('.message.assistant').last();
  await expect(answer).toContainText('Python para Análisis de Datos');
  await expect(answer).toContainText('620.000 COP');
  await expect(answer).toContainText('Modalidades: virtual.');
  await expect(answer).not.toContainText('Excel');
});

test('una consulta nueva desde el sitio no reemplaza una solicitud en curso', async ({ page }) => {
  let completeRequest;
  const pendingResponse = new Promise((resolve) => { completeRequest = resolve; });
  await page.route(chatUrl, async (route) => {
    await pendingResponse;
    await route.fulfill({ status: 200, contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': siteUrl },
      body: JSON.stringify({ respuesta: 'Excel Avanzado: 450.000 COP.' }) });
  });
  try {
    await openWidget(page);
    await page.locator('#chat-input').fill('Precio de Excel Avanzado');
    await page.getByRole('button', { name: 'Enviar', exact: true }).click();
    await expect(page.locator('#chat-send')).toBeDisabled();
    const accepted = await page.evaluate(() => globalThis.TrainingChat.init(globalThis.TrainingChatConfig).setQuestion('Precio de Python'));
    expect(accepted).toBe(false);
    await expect(page.locator('#chat-input')).toHaveValue('');
    await expect(page.locator('.message.user')).toHaveText('TúPrecio de Excel Avanzado');
    completeRequest();
    await expect(page.locator('.message.assistant').last()).toContainText('450.000 COP');
    await expect(page.locator('#chat-send')).toBeEnabled();
  } finally { completeRequest(); }
});

test('las respuestas se muestran como texto y no ejecutan HTML', async ({ page }) => {
  const unsafeText = '<img src=x onerror="globalThis.widgetXss=true"><script>globalThis.widgetXss=true</script>';
  await page.route(chatUrl, (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: {
      'Access-Control-Allow-Origin': siteUrl,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ respuesta: unsafeText }),
  }));
  await openWidget(page);
  await page.locator('#chat-input').fill(unsafeText);
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(page.locator('.message.assistant').last()).toContainText(unsafeText);
  await expect(page.locator('.message.user')).toContainText(unsafeText);
  await expect(page.locator('#chat-messages img, #chat-messages script')).toHaveCount(0);
  expect(await page.evaluate(() => globalThis.widgetXss)).toBeUndefined();
});

test('una conexión fallida restaura la pregunta y permite reintentar', async ({ page }) => {
  await page.route(chatUrl, (route) => route.abort('failed'));
  await openWidget(page);
  const question = 'Quiero consultar Excel Avanzado';
  await page.locator('#chat-input').fill(question);
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(page.locator('.message.error')).toContainText('No se pudo conectar con el asistente');
  await expect(page.locator('#chat-input')).toHaveValue(question);
  await expect(page.locator('#chat-input')).toBeEditable();
  await expect(page.locator('#chat-send')).toBeEnabled();
  await page.unroute(chatUrl);
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(page.locator('.message.assistant').last()).toContainText('Excel Avanzado');
});

test('el panel cabe en móvil y devuelve el foco al cerrar con Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openWidget(page);
  const panel = page.locator('#chat-panel');
  const bounds = await panel.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(844);
  await expect(page.locator('#chat-toggle')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#chat-input').press('Escape');
  await expect(panel).toBeHidden();
  await expect(page.locator('#chat-toggle')).toBeFocused();
  await expect(page.locator('#chat-toggle')).toHaveAttribute('aria-expanded', 'false');
  await page.locator('#chat-toggle').click();
  await page.locator('#chat-close').click();
  await expect(panel).toBeHidden();
  await expect(page.locator('#chat-toggle')).toBeFocused();
});

test('el tema no altera los estilos internos y varias inicializaciones reutilizan el widget', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#training-chat-root')).toHaveCount(1);
  await page.addStyleTag({ content: `
    html { font-size: 64px !important; }
    div, button, input, section { all: unset !important; display: none !important; font-size: 72px !important; color: red !important; }
    #training-chat-root { position: static !important; transform: translateX(3000px) !important; width: 2000px !important; }
  ` });
  const result = await page.evaluate((url) => {
    const first = globalThis.TrainingChat.init({ apiUrl: url });
    const second = globalThis.TrainingChat.init({ apiUrl: url });
    const host = globalThis.document.getElementById('training-chat-root');
    const hostStyle = globalThis.getComputedStyle(host);
    const inputStyle = globalThis.getComputedStyle(host.shadowRoot.querySelector('#chat-input'));
    return { same: first === second, position: hostStyle.position, transform: hostStyle.transform, font: inputStyle.fontSize };
  }, apiUrl);
  expect(result).toEqual({ same: true, position: 'fixed', transform: 'none', font: '16px' });
  await expect(page.locator('#training-chat-root')).toHaveCount(1);
  await page.getByRole('button', { name: 'Abrir asistente', exact: true }).click();
  await expect(page.locator('#chat-panel')).toBeVisible();
  await expect(page.locator('#chat-input')).toBeFocused();
  await expect(page.locator('#chat-panel')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
});

test('guardar HTTP remoto informa el error y deshabilita el widget', async ({ page }) => {
  await login(page);
  try {
    await saveSettings(page, { enabled: true, url: 'http://api.example.com' });
    await expect(page.locator('#taia_enabled')).not.toBeChecked();
    await expect(page.locator('#taia_api_url')).toHaveValue('');
    await expect(page.getByText(/El widget quedó deshabilitado\./).first()).toBeVisible();
    await expectNoWidget(page);
  } finally {
    await saveSettings(page);
    await expect(page.locator('#taia_enabled')).toBeChecked();
    await expect(page.locator('#taia_api_url')).toHaveValue(apiUrl);
  }
});

test('desactivar evita cargar el archivo y activar vuelve a mostrar la burbuja', async ({ page }) => {
  await login(page);
  try {
    await saveSettings(page, { enabled: false });
    await expect(page.locator('#taia_enabled')).not.toBeChecked();
    await expectNoWidget(page);
    await page.getByRole('button', { name: 'Hacer una pregunta' }).click();
    await expect(page.locator('#training-feedback')).toContainText('El asistente no está disponible');
    await saveSettings(page);
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Abrir asistente', exact: true })).toBeVisible();
    await expect(page.locator('script[src*="/assets/training-chat.js"]')).toHaveCount(1);
  } finally {
    await saveSettings(page);
  }
});

test('el chat original y la página independiente conservan el envío', async ({ page }) => {
  await page.goto(apiUrl);
  await page.getByRole('button', { name: 'Abrir asistente', exact: true }).click();
  await page.locator('#chat-input').fill('Precio de Excel Avanzado');
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(page.locator('.message.assistant').last()).toContainText('450.000 COP');
  await page.goto(`${apiUrl}/chat.html`);
  await expect(page.locator('#chat-panel')).toBeVisible();
  await page.locator('#chat-input').fill('Modalidad de Excel Avanzado');
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await expect(page.locator('.message.assistant').last()).toContainText('virtual y presencial');
});

test('sin configuración no se monta y las URL inválidas se rechazan antes de montar', async ({ page }) => {
  await page.route('**/widget-test-fixture', (route) => route.fulfill({
    contentType: 'text/html',
    body: `<!doctype html><html lang="es"><head><title>Prueba del widget</title><script defer src="${widgetAsset}"></script></head><body><main>Prueba aislada</main></body></html>`,
  }));
  await page.goto('/widget-test-fixture');
  await page.waitForFunction(() => typeof globalThis.TrainingChat?.init === 'function');
  await expect(page.locator('#training-chat-root')).toHaveCount(0);
  const rejected = await page.evaluate(() => {
    const configurations = [
      undefined,
      {},
      { apiUrl: '/relative' },
      { apiUrl: 'http://api.example.com' },
      { apiUrl: 'https://user:password@example.com' },
      { apiUrl: 'https://example.com?token=x' },
      { apiUrl: 'https://example.com#fragment' },
      { apiUrl: 'https://example.com?' },
      { apiUrl: 'https://example.com#' },
      { apiUrl: 'javascript:alert(1)' },
    ];
    return configurations.map((config) => {
      try { globalThis.TrainingChat.init(config); return false; } catch { return true; }
    });
  });
  expect(rejected).toEqual(Array(10).fill(true));
  await expect(page.locator('#training-chat-root')).toHaveCount(0);
  await page.evaluate((url) => { globalThis.TrainingChat.init({ apiUrl: url }); }, apiUrl);
  await expect(page.getByRole('button', { name: 'Abrir asistente', exact: true })).toBeVisible();
});
