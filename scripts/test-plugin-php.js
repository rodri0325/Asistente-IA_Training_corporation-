import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path/posix';
import { loadNodeRuntime } from '@php-wasm/node';
import { PHP } from '@php-wasm/universal';

// These tests replace WordPress functions with doubles. The actual WordPress
// integration is exercised separately by the local site and browser tests.
const files = [
  'tests/php/plugin-test.php',
  'wordpress-plugin/training-asistente-ia.php',
  'wordpress-plugin/uninstall.php',
];
const contents = await Promise.all(files.map(async (file) => ({
  path: `/project/${file}`,
  bytes: await readFile(new URL(`../${file}`, import.meta.url)),
})));

for (const version of ['7.4', '8.3']) {
  const php = new PHP(await loadNodeRuntime(version));
  try {
    for (const file of contents) {
      php.mkdirTree(dirname(file.path));
      php.writeFile(file.path, file.bytes);
    }
    const result = await php.run({ scriptPath: '/project/tests/php/plugin-test.php' });
    if (result.exitCode !== 0 || result.errors || !result.text.startsWith('OK: ')) {
      throw new Error(`Pruebas del plugin con PHP ${version}:\n${result.errors}\n${result.text}`);
    }
    console.log(`PHP ${version}: ${result.text.trim()}`);
  } finally {
    php[Symbol.dispose]();
  }
}
