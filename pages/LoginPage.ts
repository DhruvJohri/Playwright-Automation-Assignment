// pages/LoginPage.ts
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async verifyLoginPageVisible() {
    await expect(this.page.locator('h2:has-text("Login to your account")')).toBeVisible();
  }

  async verifySignupSectionVisible() {
    await expect(this.page.locator('h2:has-text("New User Signup!")')).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);
    await this.page.locator('[data-qa="login-button"]').click();
  }

  async verifyLoginError() {
    await expect(
      this.page.locator('p:has-text("Your email or password is incorrect!")')
    ).toBeVisible();
  }

  async enterSignupNameAndEmail(name: string, email: string) {
    await this.page.locator('[data-qa="signup-name"]').fill(name);
    await this.page.locator('[data-qa="signup-email"]').fill(email);
    await this.page.locator('[data-qa="signup-button"]').click();
  }

  async verifyEmailExistsError() {
    await expect(
      this.page.locator('p:has-text("Email Address already exist!")')
    ).toBeVisible();
  }
}
