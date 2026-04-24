// tests/auth.setup.ts
// Runs once before auth-dependent tests. Creates a persistent user & saves session.
import { test as setup, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

setup('authenticate', async ({ page, request }) => {
  const email = process.env.TEST_EMAIL!;
  const password = process.env.TEST_PASSWORD!;
  const username = process.env.TEST_USERNAME ?? 'PlaywrightUser';

  // Ensure the test user exists via API first
  await request.post('https://automationexercise.com/api/createAccount', {
    form: {
      name: username,
      email,
      password,
      title: 'Mr',
      birth_date: '10',
      birth_month: '5',
      birth_year: '1998',
      firstname: 'Playwright',
      lastname: 'Tester',
      company: 'TestCo',
      address1: '123 Test St',
      address2: '',
      country: 'India',
      zipcode: '243001',
      state: 'Uttar Pradesh',
      city: 'Bareilly',
      mobile_number: '9876543210',
    },
  });
  // Ignore 400 (already exists) — that's fine

  await page.goto('https://automationexercise.com/login');
  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.locator('[data-qa="login-button"]').click();

  await expect(page.locator(`text=Logged in as ${username}`)).toBeVisible({ timeout: 15000 });
  await page.context().storageState({ path: 'auth.json' });
});
