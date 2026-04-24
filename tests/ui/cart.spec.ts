// tests/ui/cart.spec.ts
// TC12: Add Products in Cart
// TC13: Verify Product quantity in Cart
// TC17: Remove Products From Cart
// TC20: Search Products and Verify Cart After Login

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { LoginPage } from '../../pages/LoginPage';
import { ApiHelper } from '../../utils/apiHelper';
import { generateEmail, searchTerms } from '../../fixtures/testData';

test.describe('Cart Flows', () => {
  test('TC12: Add Products in Cart', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.clickProducts();

    // Add first product
    await products.hoverAndAddToCart(0);
    await products.continueShopping();

    // Add second product
    await products.hoverAndAddToCart(1);
    await products.viewCart();

    await cart.verifyCartPageVisible();
    await cart.verifyProductCount(2);
    await cart.verifyCartPrices();
  });

  test('TC13: Verify Product quantity in Cart', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.viewFirstProductDetail();

    // Wait for product detail page
    await expect(page.locator('.product-information')).toBeVisible();

    // Set quantity to 4
    await page.locator('#quantity').fill('');
    await page.locator('#quantity').fill('4');
    await page.locator('button:has-text("Add to cart")').click();
    await page.locator('a:has-text("View Cart")').click();

    await cart.verifyCartPageVisible();
    await cart.verifyProductQuantity('4');
  });

  test('TC17: Remove Products From Cart', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.clickProducts();
    await products.hoverAndAddToCart(0);
    await products.viewCart();

    await cart.verifyCartPageVisible();
    await cart.verifyProductCount(1);

    await cart.removeProduct(0);

    // Wait for the empty cart state
    await expect(page.locator('#empty_cart')).toBeVisible({ timeout: 8000 });
  });

  test('TC20: Search Products and Verify Cart After Login', async ({ page, request }) => {
    const email = generateEmail();
    const password = 'Test@1234';
    const name = 'CartLoginTest';

    const api = new ApiHelper(request);
    await api.createUser({
      name, email, password,
      title: 'Mr', birth_date: '1', birth_month: '1', birth_year: '1990',
      firstname: 'Cart', lastname: 'Test', company: '', address1: '1 St',
      address2: '', country: 'India', zipcode: '100001', state: 'Delhi',
      city: 'Delhi', mobile_number: '9000000004',
    });

    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const login = new LoginPage(page);

    await home.goto();
    await home.clickProducts();
    await products.verifyAllProductsPageVisible();

    await products.searchProduct(searchTerms.product);
    await products.verifySearchResultsVisible(searchTerms.product);

    // Add first search result to cart
    const firstProduct = page.locator('.features_items .product-image-wrapper').first();
    await firstProduct.hover();
    await firstProduct.locator('.add-to-cart').first().click();
    await page.locator('button:has-text("Continue Shopping")').click();

    // Verify cart before login
    await home.clickCart();
    await cart.verifyCartPageVisible();
    await cart.verifyProductCount(1);

    // Login
    await home.clickSignupLogin();
    await login.login(email, password);
    await home.verifyLoggedIn(name);

    // Go back to cart and verify products still there
    await home.clickCart();
    await cart.verifyCartPageVisible();
    await cart.verifyProductCount(1);

    // Cleanup
    await api.deleteUser(email, password);
  });
});
