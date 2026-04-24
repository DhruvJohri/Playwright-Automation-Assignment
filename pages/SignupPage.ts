// pages/SignupPage.ts
import { Page, expect } from '@playwright/test';

interface UserData {
  name: string;
  email?: string;
  password: string;
  title: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export class SignupPage {
  constructor(private page: Page) {}

  async verifyAccountInfoFormVisible() {
    await expect(
      this.page.locator('h2.title b:has-text("Enter Account Information")')
    ).toBeVisible({ timeout: 15000 });
  }

  async fillAccountDetails(user: UserData) {
    // Title radio
    if (user.title === 'Mr') {
      await this.page.locator('#id_gender1').check();
    } else {
      await this.page.locator('#id_gender2').check();
    }

    // Name & password
    await this.page.locator('[data-qa="name"]').fill(user.name);
    await this.page.locator('[data-qa="password"]').fill(user.password);

    // DOB
    await this.page.locator('[data-qa="days"]').selectOption(user.birthDay);
    await this.page.locator('[data-qa="months"]').selectOption(user.birthMonth);
    await this.page.locator('[data-qa="years"]').selectOption(user.birthYear);

    // Checkboxes
    await this.page.locator('#newsletter').check();
    await this.page.locator('#optin').check();

    // Address details
    await this.page.locator('[data-qa="first_name"]').fill(user.firstName);
    await this.page.locator('[data-qa="last_name"]').fill(user.lastName);
    await this.page.locator('[data-qa="company"]').fill(user.company);
    await this.page.locator('[data-qa="address"]').fill(user.address1);
    await this.page.locator('[data-qa="address2"]').fill(user.address2);
    await this.page.locator('[data-qa="country"]').selectOption(user.country);
    await this.page.locator('[data-qa="state"]').fill(user.state);
    await this.page.locator('[data-qa="city"]').fill(user.city);
    await this.page.locator('[data-qa="zipcode"]').fill(user.zipcode);
    await this.page.locator('[data-qa="mobile_number"]').fill(user.mobileNumber);
  }

  async clickCreateAccount() {
    await this.page.locator('[data-qa="create-account"]').click();
  }

  async verifyAccountCreated() {
    await expect(
      this.page.locator('h2[data-qa="account-created"]')
    ).toBeVisible();
  }

  async clickContinue() {
    await this.page.locator('[data-qa="continue-button"]').click();
  }

  async deleteAccount() {
    await this.page.locator('a[href="/delete_account"]').click();
  }

  async verifyAccountDeleted() {
    await expect(
      this.page.locator('h2[data-qa="account-deleted"]')
    ).toBeVisible();
  }
}
