// tests/ui/misc.spec.ts
// TC6: Contact Us Form
// TC7: Verify Test Cases Page
// TC10: Verify Subscription in home page
// TC11: Verify Subscription in Cart page
// TC25: Scroll Up using Arrow button
// TC26: Scroll Up without Arrow button

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { generateEmail, contactForm } from '../../fixtures/testData';
import * as path from 'path';

test.describe('Misc UI Flows', () => {
  test('TC6: Contact Us Form', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.verifyHomePageVisible();
    await home.clickContactUs();

    await expect(page.locator('h2:has-text("Get In Touch")')).toBeVisible();

    const contactEmail = generateEmail();
    await page.locator('[data-qa="name"]').fill(contactForm.name);
    await page.locator('[data-qa="email"]').fill(contactEmail);
    await page.locator('[data-qa="subject"]').fill(contactForm.subject);
    await page.locator('[data-qa="message"]').fill(contactForm.message);

    // Upload a file
    const filePath = path.resolve(__dirname, '../../fixtures/testData.ts');
    await page.locator('input[name="upload_file"]').setInputFiles(filePath);

    const waitForSubmitResponse = () =>
      page.waitForResponse(
        (response) =>
          response.url().includes('/contact_us') &&
          response.request().method() === 'POST',
        { timeout: 5000 }
      );

    page.once('dialog', async (dialog) => await dialog.accept());
    let submitResponsePromise = waitForSubmitResponse();
    await page.locator('[data-qa="submit-button"]').click({ force: true });

    let submitResponse;
    try {
      submitResponse = await submitResponsePromise;
    } catch {
      const contactForm = page.locator('form').filter({
        has: page.locator('[data-qa="submit-button"]'),
      });
      submitResponsePromise = waitForSubmitResponse();
      await contactForm.evaluate(
        (form: HTMLFormElement) => HTMLFormElement.prototype.submit.call(form)
      );
      submitResponse = await submitResponsePromise;
    }
    expect(submitResponse.status()).toBe(200);

    // Click Home and verify we're back
    await page.locator('a:has-text("Home")').first().click();
    await home.verifyHomePageVisible();
  });

  test('TC7: Verify Test Cases Page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.verifyHomePageVisible();
    await home.clickTestCases();
    await expect(page).toHaveURL(/test_cases/);
    await expect(page.locator('h2.title:has-text("Test Cases")')).toBeVisible();
  });

  test('TC10: Verify Subscription in home page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.verifyHomePageVisible();
    await home.scrollToFooter();
    await home.verifySubscriptionText();
    await home.subscribeWithEmail(generateEmail());
    await home.verifySubscriptionSuccess();
  });

  test('TC11: Verify Subscription in Cart page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.verifyHomePageVisible();
    await home.clickCart();

    await page.locator('#footer').scrollIntoViewIfNeeded();
    await expect(page.locator('h2:has-text("SUBSCRIPTION")')).toBeVisible();

    await page.locator('#susbscribe_email').fill(generateEmail());
    await page.locator('#subscribe').click();
    await expect(
      page.locator('div.alert-success:has-text("You have been successfully subscribed!")')
    ).toBeVisible();
  });

  test('TC25: Scroll Up using Arrow button and Scroll Down', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.verifyHomePageVisible();

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('h2:has-text("SUBSCRIPTION")')).toBeVisible();

    // Click arrow button to scroll up
    await home.clickScrollUpArrow();

    // Verify top text visible
    await home.verifyTopTextVisible();
  });

  test('TC26: Scroll Up without Arrow button and Scroll Down', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.verifyHomePageVisible();

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('h2:has-text("SUBSCRIPTION")')).toBeVisible();

    // Scroll back up via JS
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Verify top text visible
    await home.verifyTopTextVisible();
  });
});
