import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', fullyParallel: false, workers: 1,
  timeout: 60000, expect: { timeout: 15000 },
  use: { baseURL: 'http://127.0.0.1:9400', browserName: 'chromium', channel: 'msedge',
    headless: true, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  reporter: [['list']],
  webServer: { command: 'node scripts/wordpress-local.js --mock', url: 'http://127.0.0.1:9400',
    reuseExistingServer: false, timeout: 180000 },
});
