// pages/CheckoutPage.ts
import { Page, expect } from '@playwright/test';

interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class CheckoutPage {
  constructor(private page: Page) {}

  async verifyAddressDetails() {
    await expect(this.page.locator('#address_delivery')).toBeVisible();
    await expect(this.page.locator('#address_invoice')).toBeVisible();
  }

  async getDeliveryAddress(): Promise<string> {
    return this.page.locator('#address_delivery').innerText();
  }

  async getBillingAddress(): Promise<string> {
    return this.page.locator('#address_invoice').innerText();
  }

  async verifyAddressMatchesRegistration(
    firstName: string,
    lastName: string,
    address1: string,
    city: string,
    state: string,
    zipcode: string,
    country: string,
    mobile: string
  ) {
    const deliveryText = await this.getDeliveryAddress();
    expect(deliveryText).toContain(firstName);
    expect(deliveryText).toContain(lastName);
    expect(deliveryText).toContain(address1);
    expect(deliveryText).toContain(city);

    const billingText = await this.getBillingAddress();
    expect(billingText).toContain(firstName);
    expect(billingText).toContain(lastName);
  }

  async verifyOrderItems() {
    await expect(this.page.locator('#cart_info')).toBeVisible();
  }

  async enterOrderComment(comment: string) {
    await this.page.locator('textarea.form-control').fill(comment);
  }

  async clickPlaceOrder() {
    await this.page.locator('a:has-text("Place Order")').click();
  }

  async fillPaymentDetails(payment: PaymentData) {
    await this.page.locator('[data-qa="name-on-card"]').fill(payment.nameOnCard);
    await this.page.locator('[data-qa="card-number"]').fill(payment.cardNumber);
    await this.page.locator('[data-qa="cvc"]').fill(payment.cvc);
    await this.page.locator('[data-qa="expiry-month"]').fill(payment.expiryMonth);
    await this.page.locator('[data-qa="expiry-year"]').fill(payment.expiryYear);
  }

  async confirmOrder() {
    await this.page.locator('[data-qa="pay-button"]').click();
  }

  async verifyOrderSuccess() {
    await expect(
      this.page.locator('p:has-text("Congratulations! Your order has been confirmed!")')
        .or(this.page.locator('h2[data-qa="order-placed"]'))
        .or(this.page.locator('b:has-text("Your order has been placed successfully!")'))
    ).toBeVisible({ timeout: 15000 });
  }

  async downloadInvoice(): Promise<string> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.locator('a:has-text("Download Invoice")').click(),
    ]);
    const path = await download.path();
    return path ?? '';
  }

  async clickContinueAfterOrder() {
    await this.page.locator('[data-qa="continue-button"]').click();
  }
}
