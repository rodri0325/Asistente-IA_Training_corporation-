import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { loadNodeRuntime } from '@php-wasm/node';
import { bootWordPressAndRequestHandler } from '@wp-playground/wordpress';
import { crearApp } from '../backend/app.js';
import { demoFetch } from './demo-responder.js';

const mock = process.argv.includes('--mock');
const siteUrl = 'http://127.0.0.1:9400';
const apiUrl = 'http://127.0.0.1:5000';
const cache = new URL('../.wordpress-local/cache/', import.meta.url);
await mkdir(cache, { recursive: true });

async function download(url, name) {
  const file = new URL(name, cache);
  try { return new File([await readFile(file)], name); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  console.log(`Preparando ${name} (solo la primera vez)…`);
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`No se pudo descargar ${name}: HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes[0] !== 80 || bytes[1] !== 75) throw new Error(`La descarga ${name} no es un ZIP.`);
  await writeFile(file, bytes);
  return new File([bytes], name);
}

const [wordPressZip, sqliteIntegrationPluginZip] = await Promise.all([
  download('https://wordpress.org/wordpress-6.8.3.zip', 'wordpress-6.8.3.zip'),
  download('https://downloads.wordpress.org/plugin/sqlite-database-integration.latest-stable.zip', 'sqlite-database-integration.zip'),
]);
console.log('Iniciando WordPress 6.8.3 y PHP 8.3 en memoria…');
const handler = await bootWordPressAndRequestHandler({
  siteUrl, wordPressZip, sqliteIntegrationPluginZip,
  createPhpRuntime: () => loadNodeRuntime('8.3'), maxPhpInstances: 1, cookieStore: false,
  constants: { WP_DEBUG: false, WP_DEBUG_DISPLAY: false, DISABLE_WP_CRON: true,
    AUTOMATIC_UPDATER_DISABLED: true, WP_HTTP_BLOCK_EXTERNAL: true, TRAINING_DEMO_MODE: mock },
});
const php = await handler.getPrimaryPhp();
const pluginRoot = '/wordpress/wp-content/plugins/training-asistente-ia';
php.mkdirTree(`${pluginRoot}/assets`);
for (const file of ['training-asistente-ia.php', 'uninstall.php', 'readme.txt', 'assets/training-chat.js']) {
  php.writeFile(`${pluginRoot}/${file}`, await readFile(new URL(`../wordpress-plugin/${file}`, import.meta.url)));
}
const themeRoot = '/wordpress/wp-content/themes/training-demo';
php.mkdirTree(themeRoot);
for (const file of ['style.css', 'functions.php', 'index.php', 'theme.js']) {
  php.writeFile(`${themeRoot}/${file}`, await readFile(new URL(`../wordpress-demo-theme/${file}`, import.meta.url)));
}
php.writeFile(`${themeRoot}/catalogo_cursos.json`, await readFile(new URL('../backend/data/catalogo_cursos.json', import.meta.url)));
const setup = await php.run({ code: `<?php
require '/wordpress/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';
$result = activate_plugin('training-asistente-ia/training-asistente-ia.php');
if (is_wp_error($result)) { throw new Exception($result->get_error_message()); }
wp_set_password('training-local-demo', 1);
update_option('taia_settings', array('enabled' => 1, 'api_url' => '${apiUrl}'));
switch_theme('training-demo');
update_option('blogname', 'TRAINING Corporation');
update_option('blogdescription', '');
$page = wp_insert_post(array('post_title' => 'Formación profesional', 'post_status' => 'publish', 'post_type' => 'page', 'post_content' => ''));
update_option('show_on_front', 'page'); update_option('page_on_front', $page);
echo 'WordPress ' . get_bloginfo('version') . ' preparado.';
` });
if (setup.exitCode !== 0 || setup.errors) throw new Error(`No se pudo preparar WordPress: ${setup.errors || setup.text}`);
console.log(setup.text);

const app = crearApp({
  allowedOrigins: [siteUrl, process.env.ALLOWED_ORIGINS].filter(Boolean).join(','),
  ...(mock ? { apiKey: 'demo-simulada', fetchImpl: demoFetch } : {}),
});
const backend = app.listen(5000, '127.0.0.1');
await once(backend, 'listening');

let chain = Promise.resolve();
const server = createServer((req, res) => {
  chain = chain.then(async () => {
    if (req.headers.host !== '127.0.0.1:9400') { res.writeHead(400).end('Usa http://127.0.0.1:9400'); return; }
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 20 * 1024 * 1024) { res.writeHead(413).end(); return; }
      chunks.push(chunk);
    }
    const result = await handler.request({
      url: siteUrl + req.url, method: req.method,
      headers: Object.fromEntries(Object.entries(req.headers).filter(([, value]) => typeof value === 'string')),
      ...(size ? { body: Buffer.concat(chunks) } : {}),
    });
    res.writeHead(result.httpStatusCode, result.headers);
    res.end(result.bytes);
  }).catch((error) => {
    console.error('Error de la prueba local:', error.message);
    if (!res.headersSent) res.writeHead(500);
    res.end('No se pudo atender la solicitud local.');
  });
});
server.listen(9400, '127.0.0.1');
await once(server, 'listening');
console.log(`WordPress local: ${siteUrl}`);
console.log(`Administración: ${siteUrl}/wp-admin/ · Usuario: admin · Contraseña: training-local-demo`);
console.log(mock ? 'MODO DEMO: respuestas simuladas, sin claves ni conexión con Gemini.' : 'MODO GEMINI: usa la configuración del archivo .env.');
console.log('Solo accesible en este computador. Ctrl+C detiene ambos servidores; WordPress se reinicia en cada arranque.');

async function close() {
  server.closeAllConnections(); backend.closeAllConnections();
  await Promise.all([new Promise((resolve) => server.close(resolve)), new Promise((resolve) => backend.close(resolve))]);
  await handler[Symbol.asyncDispose]();
}
process.once('SIGINT', () => { void close(); });
process.once('SIGTERM', () => { void close(); });
