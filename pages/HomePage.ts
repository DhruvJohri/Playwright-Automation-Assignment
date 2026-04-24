// pages/HomePage.ts
import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  private get navbar() {
    return this.page.getByRole('banner');
  }

  async goto() {
    await this.page.goto('/');
  }

  async verifyHomePageVisible() {
    await expect(this.page).toHaveURL(/automationexercise\.com/);
    await expect(
      this.page.getByRole('link', { name: /website for automation practice/i })
    ).toBeVisible();
  }

  async clickSignupLogin() {
    await this.navbar.getByRole('link', { name: /signup \/ login/i }).click();
  }

  async clickProducts() {
    await this.navbar.getByRole('link', { name: /products/i }).click();
  }

  async clickCart() {
    await this.navbar.getByRole('link', { name: /cart/i }).click();
  }

  async clickTestCases() {
    await this.navbar.getByRole('link', { name: /test cases/i }).click();
  }

  async clickContactUs() {
    await this.navbar.getByRole('link', { name: /contact us/i }).click();
  }

  async clickLogout() {
    await this.navbar.getByRole('link', { name: /logout/i }).click();
  }

  async verifyLoggedIn(username: string) {
    await expect(this.page.getByText(`Logged in as ${username}`)).toBeVisible();
  }

  async scrollToFooter() {
    await this.page.locator('#footer').scrollIntoViewIfNeeded();
  }

  async verifySubscriptionText() {
    await expect(this.page.getByRole('heading', { name: /subscription/i })).toBeVisible();
  }

  async subscribeWithEmail(email: string) {
    await this.page.getByPlaceholder('Your email address').fill(email);
    await this.page.locator('#subscribe').click();
  }

  async verifySubscriptionSuccess() {
    await expect(this.page.getByText('You have been successfully subscribed!')).toBeVisible();
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async clickScrollUpArrow() {
    await this.page.locator('#scrollUp').click();
  }

  async verifyTopTextVisible() {
    await expect(
      this.page.getByRole('heading', {
        name: /full-fledged practice website for automation engineers/i,
      })
    ).toBeVisible();
  }

  async addFirstProductToCartFromHome() {
    await this.page.locator('.productinfo a.btn').first().click();
  }

  async viewFirstProductDetail() {
    await this.page.getByRole('link', { name: /view product/i }).first().click();
  }

  async verifyRecommendedItemsVisible() {
    await this.page.locator('.recommended_items').scrollIntoViewIfNeeded();
    await expect(this.page.getByRole('heading', { name: /recommended items/i })).toBeVisible();
  }

  async addRecommendedItemToCart() {
    const addBtn = this.page.locator('.recommended_items .productinfo a.btn').first();
    await addBtn.click();
  }
}
