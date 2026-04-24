// tests/ui/auth.spec.ts
// TC1: Register User
// TC2: Login with correct credentials
// TC3: Login with incorrect credentials
// TC4: Logout User
// TC5: Register with existing email

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';
import { ApiHelper } from '../../utils/apiHelper';
import { generateEmail, newUser } from '../../fixtures/testData';

test.describe('Auth Flows', () => {
  test('TC1: Register User', async ({ page, request }) => {
    const user = { ...newUser, email: generateEmail() };
    const home = new HomePage(page);
    const login = new LoginPage(page);
    const signup = new SignupPage(page);

    await home.goto();
    await home.verifyHomePageVisible();
    await home.clickSignupLogin();

    await login.verifySignupSectionVisible();
    await login.enterSignupNameAndEmail(user.name, user.email);

    await signup.verifyAccountInfoFormVisible();
    await signup.fillAccountDetails(user);
    await signup.clickCreateAccount();
    await signup.verifyAccountCreated();
    await signup.clickContinue();

    await home.verifyLoggedIn(user.name);

    // API cross-verify: user exists in backend
    const api = new ApiHelper(request);
    const { status, body } = await api.getUserByEmail(user.email);
    expect(status).toBe(200);
    expect(body.data.email).toBe(user.email);

    await signup.deleteAccount();
    await signup.verifyAccountDeleted();
    await signup.clickContinue();
  });

  test('TC2: Login User with correct email and password', async ({ page, request }) => {
    // Create user via API first, then login via UI
    const email = generateEmail();
    const password = 'Test@1234';
    const name = 'LoginTest';

    const api = new ApiHelper(request);
    await api.createUser({
      name, email, password,
      title: 'Mr', birth_date: '5', birth_month: '3', birth_year: '1995',
      firstname: 'Login', lastname: 'Test', company: '', address1: '1 Test Rd',
      address2: '', country: 'India', zipcode: '100001', state: 'Delhi',
      city: 'Delhi', mobile_number: '9000000001',
    });

    const home = new HomePage(page);
    const login = new LoginPage(page);
    const signup = new SignupPage(page);

    await home.goto();
    await home.verifyHomePageVisible();
    await home.clickSignupLogin();

    await login.verifyLoginPageVisible();
    await login.login(email, password);
    await home.verifyLoggedIn(name);

    await signup.deleteAccount();
    await signup.verifyAccountDeleted();
    await signup.clickContinue();
  });

  test('TC3: Login User with incorrect email and password', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.goto();
    await home.verifyHomePageVisible();
    await home.clickSignupLogin();

    await login.verifyLoginPageVisible();
    await login.login('notexist@fake.com', 'wrongpass123');
    await login.verifyLoginError();
  });

  test('TC4: Logout User', async ({ page, request }) => {
    const email = generateEmail();
    const password = 'Test@1234';
    const name = 'LogoutTest';

    const api = new ApiHelper(request);
    await api.createUser({
      name, email, password,
      title: 'Mr', birth_date: '5', birth_month: '3', birth_year: '1995',
      firstname: 'Logout', lastname: 'Test', company: '', address1: '1 Test Rd',
      address2: '', country: 'India', zipcode: '100001', state: 'Delhi',
      city: 'Delhi', mobile_number: '9000000002',
    });

    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.goto();
    await home.verifyHomePageVisible();
    await home.clickSignupLogin();

    await login.verifyLoginPageVisible();
    await login.login(email, password);
    await home.verifyLoggedIn(name);
    await home.clickLogout();

    // After logout, should land back on login page
    await login.verifyLoginPageVisible();

    // Cleanup
    await api.deleteUser(email, password);
  });

  test('TC5: Register User with existing email', async ({ page, request }) => {
    const email = generateEmail();
    const name = 'ExistingUser';

    // Create via API first
    const api = new ApiHelper(request);
    await api.createUser({
      name, email, password: 'Test@1234',
      title: 'Mr', birth_date: '1', birth_month: '1', birth_year: '1990',
      firstname: 'Existing', lastname: 'User', company: '', address1: '5 St',
      address2: '', country: 'India', zipcode: '110001', state: 'Delhi',
      city: 'Delhi', mobile_number: '9000000003',
    });

    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.goto();
    await home.clickSignupLogin();
    await login.verifySignupSectionVisible();
    await login.enterSignupNameAndEmail(name, email); // same email
    await login.verifyEmailExistsError();

    // Cleanup
    await api.deleteUser(email, 'Test@1234');
  });
});
