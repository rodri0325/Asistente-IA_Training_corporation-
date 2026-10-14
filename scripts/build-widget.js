import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));

await build({
  absWorkingDir: projectRoot,
  entryPoints: [fileURLToPath(new URL('../widget/embed.js', import.meta.url))],
  outfile: 'wordpress-plugin/assets/training-chat.js',
  bundle: true,
  format: 'iife',
  globalName: 'TrainingChat',
  platform: 'browser',
  target: ['es2020'],
  tsconfigRaw: {},
  loader: { '.css': 'text', '.html': 'text' },
  minify: true,
  sourcemap: false,
  legalComments: 'none'
});

console.log('Widget creado: wordpress-plugin/assets/training-chat.js');
