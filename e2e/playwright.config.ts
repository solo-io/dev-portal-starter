import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: './setup.ts',
  globalTeardown: './teardown.ts',
  timeout: 180_000,
  expect: {
    timeout: 30_000,
  },
  retries: 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${process.env.E2E_UI_PORT || '4173'}`,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});
