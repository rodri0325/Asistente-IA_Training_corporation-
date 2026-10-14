import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { zipSync, unzipSync } from 'fflate';

const files = ['training-asistente-ia.php', 'uninstall.php', 'readme.txt', 'assets/training-chat.js'];
const archive = {};
for (const file of files) {
  archive[`training-asistente-ia/${file}`] = new Uint8Array(await readFile(new URL(`../wordpress-plugin/${file}`, import.meta.url)));
}
const zipped = zipSync(archive, { level: 9 });
if (Object.keys(unzipSync(zipped)).length !== files.length) throw new Error('No se pudo verificar el ZIP.');
await mkdir(new URL('../build/', import.meta.url), { recursive: true });
const output = new URL('../build/training-asistente-ia.zip', import.meta.url);
await writeFile(output, zipped);
console.log(`Plugin listo: ${fileURLToPath(output)} (${zipped.length} bytes).`);
