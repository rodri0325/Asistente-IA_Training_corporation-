import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/**'] },
  js.configs.recommended,
  { files: ['backend/**/*.js', 'tests/**/*.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node } },
  { files: ['public/**/*.js'], languageOptions: { globals: globals.browser } },
  { rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], eqeqeq: 'error' } },
];
