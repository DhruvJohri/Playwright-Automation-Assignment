// tests/ui/products.spec.ts
// TC8: Verify All Products and product detail page
// TC9: Search Product
// TC18: View Category Products
// TC19: View & Cart Brand Products
// TC21: Add review on product
// TC22: Add to cart from Recommended items

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { ApiHelper } from '../../utils/apiHelper';
import { searchTerms, reviewData } from '../../fixtures/testData';

test.describe('Products Flows', () => {
  test('TC8: Verify All Products and product detail page', async ({ page, request }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);

    await home.goto();
    await home.verifyHomePageVisible();
    await home.clickProducts();
    await products.verifyAllProductsPageVisible();

    await products.clickViewFirstProduct();
    await products.verifyProductDetailVisible();

    // API cross-verify: product list is available
    const api = new ApiHelper(request);
    const { status, body } = await api.getAllProducts();
    expect(status).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
    expect(body.products[0]).toHaveProperty('id');
    expect(body.products[0]).toHaveProperty('name');
    expect(body.products[0]).toHaveProperty('price');
  });

  test('TC9: Search Product', async ({ page, request }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);

    await home.goto();
    await home.clickProducts();
    await products.verifyAllProductsPageVisible();

    await products.searchProduct(searchTerms.product);
    await products.verifySearchResultsVisible(searchTerms.product);

    // API cross-verify: search API also returns results
    const api = new ApiHelper(request);
    const { status, body } = await api.searchProduct(searchTerms.product);
    expect(status).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('TC18: View Category Products', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    await home.goto();

    await products.verifyCategoriesVisible();

    await products.clickCategory('Women');

    await products.clickFirstSubCategory('Women');
    await products.verifyCategoryPageVisible();

    await products.clickCategory('Men');
    await products.clickFirstSubCategory('Men');
    await products.verifyCategoryPageVisible();
  });

  test('TC19: View & Cart Brand Products', async ({ page, request }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);

    await home.goto();
    await home.clickProducts();
    await products.verifyBrandsVisible();

    // Click first brand
    await products.clickBrand(0);
    await products.verifyBrandPageVisible();

    // Click another brand
    await products.clickBrand(1);
    await products.verifyBrandPageVisible();

    // API cross-verify: brands available
    const api = new ApiHelper(request);
    const { status, body } = await api.getAllBrands();
    expect(status).toBe(200);
    expect(body.brands.length).toBeGreaterThan(0);
  });

  test('TC21: Add review on product', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);

    await home.goto();
    await home.clickProducts();
    await products.verifyAllProductsPageVisible();
    await products.clickViewFirstProduct();
    await products.verifyWriteReviewVisible();

    await products.submitReview(reviewData.name, reviewData.email, reviewData.review);
    await products.verifyReviewSuccess();
  });

  test('TC22: Add to cart from Recommended items', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.verifyRecommendedItemsVisible();
    await home.addRecommendedItemToCart();

    // View Cart
    await page.locator('a:has-text("View Cart")').click();
    await cart.verifyCartPageVisible();

    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(1, { timeout: 10000 });
  });
});
