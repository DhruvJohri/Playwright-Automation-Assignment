import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  timeout: 60000,
  expect: { timeout: 10000 },

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://automationexercise.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
  // Auth setup — runs once
  {
    name: 'setup',
    testMatch: '**/auth.setup.ts',
  },

  // UI tests (no auth)
  {
    name: 'ui-no-auth',
    testDir: './tests/ui',
    testIgnore: '**/order*.spec.ts',
    use: { ...devices['Desktop Chrome'] },
  },

  // UI tests that use stored login
  {
    name: 'ui-with-auth',
    testDir: './tests/ui',
    testMatch: '**/order*.spec.ts',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'auth.json',
    },
    dependencies: ['setup'],
  },

  // API tests
  {
    name: 'api',
    testDir: './tests/api',
    use: { ...devices['Desktop Chrome'] },
  },
],
});