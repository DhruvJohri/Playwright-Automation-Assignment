// tests/ui/order.spec.ts
// TC14: Place Order: Register while Checkout
// TC15: Place Order: Register before Checkout
// TC16: Place Order: Login before Checkout
// TC23: Verify address details in checkout page
// TC24: Download Invoice after purchase order

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { ApiHelper } from '../../utils/apiHelper';
import { generateEmail, newUser, paymentDetails } from '../../fixtures/testData';

// Helper: add a product to cart
async function addProductToCart(page: any) {
  const home = new HomePage(page);
  const products = new ProductsPage(page);
  await home.clickProducts();
  // await products.hoverAndAddToCart(0);
  // await products.continueShopping();
  await products.addFirstProductToCart();
}

// Helper: complete full registration via UI
async function registerViaUI(page: any, user: typeof newUser) {
  const login = new LoginPage(page);
  const signup = new SignupPage(page);
  const home = new HomePage(page);

  await home.clickSignupLogin();
  await login.verifySignupSectionVisible();
  await login.enterSignupNameAndEmail(user.name, user.email!);
  await signup.verifyAccountInfoFormVisible();
  await signup.fillAccountDetails(user);
  await signup.clickCreateAccount();
  await signup.verifyAccountCreated();
  await signup.clickContinue();
}

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Order & Checkout Flows', () => {
  test('TC14: Place Order - Register while Checkout', async ({ page }) => {
    const user = { ...newUser, email: generateEmail() };
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const signup = new SignupPage(page);

    await home.goto();
    await home.verifyHomePageVisible();
    await addProductToCart(page);

    await home.clickCart();
    await cart.verifyCartPageVisible();
    await cart.proceedToCheckout();

    // Not logged in — click Register/Login
    await cart.clickRegisterLoginInCheckout();
    await registerViaUI(page, user);
    await home.verifyLoggedIn(user.name);

    await home.clickCart();
    await cart.proceedToCheckout();
    await checkout.verifyAddressDetails();
    await checkout.verifyOrderItems();

    await checkout.enterOrderComment('Test order via automation TC14');
    await checkout.clickPlaceOrder();
    await checkout.fillPaymentDetails(paymentDetails);
    await checkout.confirmOrder();
    await checkout.verifyOrderSuccess();

    await signup.deleteAccount();
    await signup.verifyAccountDeleted();
    await signup.clickContinue();
  });

  test('TC15: Place Order - Register before Checkout', async ({ page }) => {
    const user = { ...newUser, email: generateEmail() };
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const signup = new SignupPage(page);

    await home.goto();
    await home.verifyHomePageVisible();
    await registerViaUI(page, user);
    await home.verifyLoggedIn(user.name);

    await addProductToCart(page);
    await home.clickCart();
    await cart.verifyCartPageVisible();
    await cart.proceedToCheckout();

    await checkout.verifyAddressDetails();
    await checkout.verifyOrderItems();
    await checkout.enterOrderComment('Test order via automation TC15');
    await checkout.clickPlaceOrder();
    await checkout.fillPaymentDetails(paymentDetails);
    await checkout.confirmOrder();
    await checkout.verifyOrderSuccess();

    await signup.deleteAccount();
    await signup.verifyAccountDeleted();
    await signup.clickContinue();
  });

  test('TC16: Place Order - Login before Checkout', async ({ page, request }) => {
    const email = generateEmail();
    const password = 'Test@1234';
    const name = 'OrderLogin';

    const api = new ApiHelper(request);
    await api.createUser({
      name, email, password,
      title: 'Mr', birth_date: '1', birth_month: '1', birth_year: '1990',
      firstname: 'Order', lastname: 'Test', company: '', address1: '10 Order St',
      address2: '', country: 'India', zipcode: '110001', state: 'Delhi',
      city: 'Delhi', mobile_number: '9000000005',
    });

    const home = new HomePage(page);
    const login = new LoginPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const signup = new SignupPage(page);

    await home.goto();
    await home.clickSignupLogin();
    await login.login(email, password);
    await home.verifyLoggedIn(name);

    await addProductToCart(page);
    await home.clickCart();
    await cart.proceedToCheckout();

    await checkout.verifyAddressDetails();
    await checkout.verifyOrderItems();
    await checkout.enterOrderComment('Test order via automation TC16');
    await checkout.clickPlaceOrder();
    await checkout.fillPaymentDetails(paymentDetails);
    await checkout.confirmOrder();
    await checkout.verifyOrderSuccess();

    await signup.deleteAccount();
    await signup.verifyAccountDeleted();
    await signup.clickContinue();
  });

  test('TC23: Verify address details in checkout page', async ({ page }) => {
    const user = { ...newUser, email: generateEmail() };
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const signup = new SignupPage(page);

    await home.goto();
    await registerViaUI(page, user);
    await home.verifyLoggedIn(user.name);

    await addProductToCart(page);
    await home.clickCart();
    await cart.proceedToCheckout();

    // Verify address matches what was filled in registration
    await checkout.verifyAddressMatchesRegistration(
      user.firstName,
      user.lastName,
      user.address1,
      user.city,
      user.state,
      user.zipcode,
      user.country,
      user.mobileNumber
    );

    await signup.deleteAccount();
    await signup.verifyAccountDeleted();
    await signup.clickContinue();
  });

  test('TC24: Download Invoice after purchase order', async ({ page }) => {
    const user = { ...newUser, email: generateEmail() };
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const signup = new SignupPage(page);

    await home.goto();
    await addProductToCart(page);
    await home.clickCart();
    await cart.verifyCartPageVisible();
    await cart.proceedToCheckout();

    await cart.clickRegisterLoginInCheckout();
    await registerViaUI(page, user);
    await home.verifyLoggedIn(user.name);

    await home.clickCart();
    await cart.proceedToCheckout();
    await checkout.verifyAddressDetails();
    await checkout.enterOrderComment('TC24 invoice download test');
    await checkout.clickPlaceOrder();
    await checkout.fillPaymentDetails(paymentDetails);
    await checkout.confirmOrder();
    await checkout.verifyOrderSuccess();

    // Download invoice
    const filePath = await checkout.downloadInvoice();
    expect(filePath.length).toBeGreaterThan(0);

    await checkout.clickContinueAfterOrder();
    await signup.deleteAccount();
    await signup.verifyAccountDeleted();
    await signup.clickContinue();
  });
});
