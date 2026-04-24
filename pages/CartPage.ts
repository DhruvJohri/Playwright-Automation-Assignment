// pages/CartPage.ts
import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async verifyCartPageVisible() {
    await expect(this.page.locator('#cart_info_table')).toBeVisible();
  }

  async verifyProductCount(count: number) {
    await expect(this.page.locator('#cart_info_table tbody tr')).toHaveCount(count);
  }

  async verifyProductInCart(productName: string) {
    await expect(this.page.locator('#cart_info_table').getByRole('link', { name: productName })).toBeVisible();
  }

  async verifyProductQuantity(quantity: string) {
    await expect(
      this.page.locator('.cart_quantity button')
    ).toHaveText(quantity);
  }

  async verifyCartPrices() {
    const prices = this.page.locator('.cart_price p');
    const totals = this.page.locator('.cart_total_price');
    const quantities = this.page.locator('.cart_quantity button');

    const count = await prices.count();
    for (let i = 0; i < count; i++) {
      const priceText = (await prices.nth(i).innerText()).replace('Rs. ', '').trim();
      const qtyText = await quantities.nth(i).innerText();
      const totalText = (await totals.nth(i).innerText()).replace('Rs. ', '').trim();

      const expected = parseFloat(priceText) * parseInt(qtyText);
      const actual = parseFloat(totalText);
      expect(Math.abs(expected - actual)).toBeLessThan(1); // float tolerance
    }
  }

  async removeProduct(index: number) {
    const rows = this.page.locator('#cart_info_table tbody tr');
    const initialCount = await rows.count();

    await this.page.locator('.cart_quantity_delete').nth(index).click();

    if (initialCount > 1) {
      await expect(rows).toHaveCount(initialCount - 1);
      return;
    }

    await expect(this.page.locator('#empty_cart')).toBeVisible();
  }

  async verifyCartEmpty() {
    await expect(this.page.locator('#empty_cart')).toBeVisible();
  }

  async proceedToCheckout() {
    await this.page.getByRole('link', { name: /proceed to checkout/i }).click();
  }

  async clickRegisterLoginInCheckout() {
    await this.page.getByRole('link', { name: /register \/ login/i }).click();
  }

  async verifyProductsVisibleInCart(productNames: string[]) {
    for (const name of productNames) {
      await expect(
        this.page.locator('#cart_info_table').getByRole('link', { name })
      ).toBeVisible();
    }
  }
}
