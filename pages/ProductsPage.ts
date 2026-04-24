// pages/ProductsPage.ts
import { Page, expect } from '@playwright/test';

export class ProductsPage {
  constructor(private page: Page) {}

  async verifyAllProductsPageVisible() {
    await expect(this.page.locator('h2:has-text("All Products")')).toBeVisible();
    await expect(this.page.locator('.features_items')).toBeVisible();
  }

  async searchProduct(term: string) {
    await this.page.locator('#search_product').fill(term);
    await this.page.locator('#submit_search').click();
  }

  async verifySearchResultsVisible(term: string) {
    await expect(this.page.locator('h2:has-text("Searched Products")')).toBeVisible();
    const products = this.page.locator('.features_items .productinfo p');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
    // Verify at least one result contains the search term (case-insensitive)
    const firstText = await products.first().innerText();
    expect(firstText.toLowerCase()).toContain(term.toLowerCase());
  }

  async clickViewFirstProduct() {
    await this.page.locator('a[href^="/product_details/"]').first().click();
  }

  async verifyProductDetailVisible() {
    await expect(this.page.locator('.product-information h2')).toBeVisible();
    await expect(this.page.locator('.product-information p:has-text("Category")')).toBeVisible();
    await expect(this.page.locator('.product-information span span')).toBeVisible(); // price
    await expect(this.page.locator('.product-information p:has-text("Availability")')).toBeVisible();
    await expect(this.page.locator('.product-information p:has-text("Condition")')).toBeVisible();
    await expect(this.page.locator('.product-information p:has-text("Brand")')).toBeVisible();
  }

  async hoverAndAddToCart(index: number) {
    const product = this.page.locator('.features_items .product-image-wrapper').nth(index);
    await product.hover();
    await product.locator('.add-to-cart').first().click();
  }

  async continueShopping() {
    await this.page.locator('button:has-text("Continue Shopping")').click();
  }

  async viewCart() {
    await this.page.locator('a:has-text("View Cart")').click();
  }

  async verifyBrandsVisible() {
    await expect(this.page.locator('.brands-name')).toBeVisible();
  }

  async verifyCategoriesVisible() {
    await expect(this.page.locator('.left-sidebar #accordian')).toBeVisible();
  }

  async clickCategory(name: string) {
    await this.page.locator('#accordian').getByRole('link', { name: new RegExp(`\\b${name}\\b`, 'i') }).click();
  }

  async clickFirstSubCategory(categoryId: string) {
    await this.page.locator(`#${categoryId} a`).first().click();
  }

  async verifyCategoryPageVisible() {
    await expect(this.page.locator('h2.title')).toBeVisible();
    await expect(this.page.locator('.features_items')).toBeVisible();
  }

  async clickBrand(index: number) {
    await this.page.locator('.brands-name li a').nth(index).click();
  }

  async verifyBrandPageVisible() {
    await expect(this.page.locator('.features_items')).toBeVisible();
    await expect(this.page.locator('h2.title')).toBeVisible();
  }

  async addAllSearchResultsToCart() {
    const addBtns = this.page.locator('.productinfo a.btn');
    const count = await addBtns.count();
    for (let i = 0; i < count; i++) {
      const product = this.page.locator('.features_items .product-image-wrapper').nth(i);
      await product.hover();
      await product.locator('.add-to-cart').first().click();
      // If modal appears, continue shopping
      const modal = this.page.locator('#cartModal');
      if (await modal.isVisible()) {
        await this.page.locator('button:has-text("Continue Shopping")').click();
      }
    }
  }

  async verifyWriteReviewVisible() {
    await expect(this.page.locator('a:has-text("Write Your Review")')).toBeVisible();
  }

  async submitReview(name: string, email: string, review: string) {
    await this.page.locator('#name').fill(name);
    await this.page.locator('#email').fill(email);
    await this.page.locator('#review').fill(review);
    await this.page.locator('#button-review').click();
  }

  async verifyReviewSuccess() {
    await expect(
      this.page.locator('div.alert-success:has-text("Thank you for your review.")')
    ).toBeVisible();
  }
}
