import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/**', 'wordpress-plugin/assets/**', 'build/**', '.wordpress-local/**', 'test-results/**'] },
  js.configs.recommended,
  { files: ['backend/**/*.js', 'tests/**/*.js', 'scripts/**/*.js', 'e2e/**/*.js', '*.config.js'],
    languageOptions: { globals: globals.node } },
  { files: ['public/**/*.js', 'widget/**/*.js'], languageOptions: { globals: globals.browser } },
  { rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], eqeqeq: 'error' } },
];
