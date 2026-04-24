// tests/api/api.spec.ts
// API 1–14: Full coverage of automationexercise.com API endpoints

import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/apiHelper';
import { generateEmail } from '../../fixtures/testData';

test.describe('API Tests', () => {
  // ─── Products ──────────────────────────────────────────────────────────────

  test('API1: GET All Products List - 200 with products array', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.getAllProducts();

    expect(status).toBe(200);
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);

    // Validate structure of first product
    const p = body.products[0];
    expect(p).toHaveProperty('id');
    expect(p).toHaveProperty('name');
    expect(p).toHaveProperty('price');
    expect(p).toHaveProperty('brand');
    expect(p).toHaveProperty('category');
  });

  test('API2: POST To All Products List - 405 method not supported', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.postToProductsList();

    expect(status).toBe(200); // site returns 200 but with error responseCode
    expect(body.responseCode).toBe(405);
    expect(body.message).toContain('not supported');
  });

  // ─── Brands ────────────────────────────────────────────────────────────────

  test('API3: GET All Brands List - 200 with brands array', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.getAllBrands();

    expect(status).toBe(200);
    expect(body).toHaveProperty('brands');
    expect(Array.isArray(body.brands)).toBe(true);
    expect(body.brands.length).toBeGreaterThan(0);

    const b = body.brands[0];
    expect(b).toHaveProperty('id');
    expect(b).toHaveProperty('brand');
  });

  test('API4: PUT To All Brands List - 405 method not supported', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.putToBrandsList();

    expect(body.responseCode).toBe(405);
    expect(body.message).toContain('not supported');
  });

  // ─── Search ────────────────────────────────────────────────────────────────

  test('API5: POST To Search Product - 200 with matching products', async ({ request }) => {
    const api = new ApiHelper(request);
    const { status, body } = await api.searchProduct('top');

    expect(status).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body).toHaveProperty('products');
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('API6: POST To Search Product without parameter - 400 bad request', async ({ request }) => {
    const api = new ApiHelper(request);
    const { body } = await api.searchProductNoParam();

    expect(body.responseCode).toBe(400);
    expect(body.message).toContain('search_product parameter is missing');
  });

  // ─── Login / Auth ──────────────────────────────────────────────────────────

  test('API7: POST Verify Login with valid details - 200 User exists', async ({ request }) => {
    const email = generateEmail();
    const password = 'Test@1234';
    const api = new ApiHelper(request);

    // Create user first
    await api.createUser({
      name: 'API7User', email, password,
      title: 'Mr', birth_date: '1', birth_month: '1', birth_year: '1990',
      firstname: 'API', lastname: 'Seven', company: '', address1: '1 St',
      address2: '', country: 'India', zipcode: '100001', state: 'Delhi',
      city: 'Delhi', mobile_number: '9000000007',
    });

    const { body } = await api.verifyLoginValid(email, password);
    expect(body.responseCode).toBe(200);
    expect(body.message).toContain('User exists');

    // Cleanup
    await api.deleteUser(email, password);
  });

  test('API8: POST Verify Login without email - 400 bad request', async ({ request }) => {
    const api = new ApiHelper(request);
    const { body } = await api.verifyLoginNoEmail('somepassword');

    expect(body.responseCode).toBe(400);
    expect(body.message).toContain('email or password parameter is missing');
  });

  test('API9: DELETE Verify Login - 405 method not supported', async ({ request }) => {
    const api = new ApiHelper(request);
    const { body } = await api.deleteVerifyLogin();

    expect(body.responseCode).toBe(405);
    expect(body.message).toContain('not supported');
  });

  test('API10: POST Verify Login with invalid credentials - 404 User not found', async ({ request }) => {
    const api = new ApiHelper(request);
    const { body } = await api.verifyLoginInvalid();

    expect(body.responseCode).toBe(404);
    expect(body.message).toContain('User not found');
  });

  // ─── Account CRUD ──────────────────────────────────────────────────────────

  test('API11: POST Create User Account - 201 User created', async ({ request }) => {
    const email = generateEmail();
    const api = new ApiHelper(request);

    const { body } = await api.createUser({
      name: 'API11User', email, password: 'Test@1234',
      title: 'Mr', birth_date: '15', birth_month: '6', birth_year: '1995',
      firstname: 'Created', lastname: 'User', company: 'TestCo',
      address1: '99 New St', address2: 'Floor 2', country: 'India',
      zipcode: '560001', state: 'Karnataka', city: 'Bangalore',
      mobile_number: '9876500011',
    });

    expect(body.responseCode).toBe(201);
    expect(body.message).toContain('User created');

    // Cleanup
    await api.deleteUser(email, 'Test@1234');
  });

  test('API12: DELETE User Account - 200 Account deleted', async ({ request }) => {
    const email = generateEmail();
    const password = 'Test@1234';
    const api = new ApiHelper(request);

    await api.createUser({
      name: 'ToDelete', email, password,
      title: 'Mrs', birth_date: '20', birth_month: '8', birth_year: '1993',
      firstname: 'Delete', lastname: 'Me', company: '',
      address1: '1 Delete St', address2: '', country: 'India',
      zipcode: '400001', state: 'Maharashtra', city: 'Mumbai',
      mobile_number: '9000000012',
    });

    const { body } = await api.deleteUser(email, password);
    expect(body.responseCode).toBe(200);
    expect(body.message).toContain('Account deleted');
  });

  test('API13: PUT Update User Account - 200 User updated', async ({ request }) => {
    const email = generateEmail();
    const password = 'Test@1234';
    const api = new ApiHelper(request);

    await api.createUser({
      name: 'BeforeUpdate', email, password,
      title: 'Mr', birth_date: '10', birth_month: '4', birth_year: '1992',
      firstname: 'Before', lastname: 'Update', company: '',
      address1: '5 Before St', address2: '', country: 'India',
      zipcode: '700001', state: 'West Bengal', city: 'Kolkata',
      mobile_number: '9000000013',
    });

    const { body } = await api.updateUser({
      name: 'AfterUpdate', email, password,
      title: 'Mr', birth_date: '10', birth_month: '4', birth_year: '1992',
      firstname: 'After', lastname: 'Update', company: 'Updated Co',
      address1: '10 After St', address2: 'Suite 1', country: 'India',
      zipcode: '700002', state: 'West Bengal', city: 'Kolkata',
      mobile_number: '9000000013',
    });

    expect(body.responseCode).toBe(200);
    expect(body.message).toContain('User updated');

    // Cleanup
    await api.deleteUser(email, password);
  });

  test('API14: GET User Detail by Email - 200 correct user data', async ({ request }) => {
    const email = generateEmail();
    const password = 'Test@1234';
    const name = 'GetDetail';
    const api = new ApiHelper(request);

    await api.createUser({
      name, email, password,
      title: 'Mr', birth_date: '5', birth_month: '5', birth_year: '1991',
      firstname: 'Get', lastname: 'Detail', company: '',
      address1: '3 Detail St', address2: '', country: 'India',
      zipcode: '600001', state: 'Tamil Nadu', city: 'Chennai',
      mobile_number: '9000000014',
    });

    const { status, body } = await api.getUserByEmail(email);
    expect(status).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.data).toHaveProperty('email', email);
    expect(body.data).toHaveProperty('name', name);

    // Cleanup
    await api.deleteUser(email, password);
  });
});
