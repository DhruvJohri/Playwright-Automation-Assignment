# Playwright Automation Suite — automationexercise.com

End-to-end UI and API test automation for [automationexercise.com](https://automationexercise.com), covering all 26 UI test cases and 14 API test cases with parallel execution, HTML reporting, and CI/CD integration.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Test Coverage](#test-coverage)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Reports](#reports)
- [CI/CD](#cicd)
- [Design Decisions](#design-decisions)
- [Author](#author)

---

## Overview

A production-grade Playwright automation suite built with TypeScript, covering the complete functional scope of automationexercise.com — from user registration and e-commerce checkout flows to REST API contract validation and UI/API cross-verification.

| Metric | Value |
|---|---|
| Total Tests | 40 |
| UI Tests | 26 (TC1–TC26) |
| API Tests | 14 (API1–API14) |
| Pattern | Page Object Model (POM) |
| Execution | Fully parallel (4 workers) |
| Reporting | HTML, screenshots on failure, video on retry |
| CI | GitHub Actions |

---

## Architecture

```
Test Layer (specs)
  auth · cart · misc · order · products · api
          |
Page Object Model (pages/)
  HomePage · LoginPage · SignupPage
  ProductsPage · CartPage · CheckoutPage
          |
Utilities & Fixtures
  ApiHelper (14 endpoints) · testData · auth.setup
```

Key principles:

- All locators live exclusively inside page objects, never in test files
- Every test is fully independent with no shared state or execution order dependency
- API is used for fast setup and teardown; UI validates only the user-facing flow under test
- Unique emails generated per test via `Date.now()` to support safe parallel execution

---

## Project Structure

```
playwright-automationexercise/
│
├── tests/
│   ├── auth.setup.ts           # Session bootstrap — runs once before auth-dependent tests
│   ├── ui/
│   │   ├── auth.spec.ts        # TC1–TC5   · Register, Login, Logout
│   │   ├── misc.spec.ts        # TC6–TC7, TC10–TC11, TC25–TC26 · Contact, Subscribe, Scroll
│   │   ├── products.spec.ts    # TC8–TC9, TC18–TC19, TC21–TC22 · Products, Search, Brands
│   │   ├── cart.spec.ts        # TC12–TC13, TC17, TC20 · Cart operations
│   │   └── order.spec.ts       # TC14–TC16, TC23–TC24 · Checkout and Payment
│   └── api/
│       └── api.spec.ts         # API1–API14 · Full REST API validation
│
├── pages/
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── SignupPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
│
├── fixtures/
│   └── testData.ts             # Centralized test data — no hardcoding in specs
│
├── utils/
│   └── apiHelper.ts            # Typed wrapper for all 14 API endpoints
│
├── .github/
│   └── workflows/
│       └── playwright.yml      # GitHub Actions CI pipeline
│
├── playwright.config.ts        # Parallel config, projects, reporting
├── .env.example                # Environment variable template
├── .gitignore
└── README.md
```

---

## Test Coverage

### UI Tests — 26 Total

| Spec File | Test Cases | What Is Tested |
|---|---|---|
| `auth.spec.ts` | TC1, TC2, TC3, TC4, TC5 | Register new user, Login with valid credentials, Login with invalid credentials, Logout, Register with existing email |
| `misc.spec.ts` | TC6, TC7, TC10, TC11, TC25, TC26 | Contact Us form with file upload, Test Cases page navigation, Newsletter subscription from home page, Newsletter subscription from cart page, Scroll Up via arrow button, Scroll Up without arrow button |
| `products.spec.ts` | TC8, TC9, TC18, TC19, TC21, TC22 | All Products page and product detail verification, Product search, Category navigation, Brand filtering, Product review submission, Add to cart from Recommended Items |
| `cart.spec.ts` | TC12, TC13, TC17, TC20 | Add multiple products to cart, Quantity validation, Remove product from cart, Cart persistence after login |
| `order.spec.ts` | TC14, TC15, TC16, TC23, TC24 | Place order registering during checkout, Place order registering before checkout, Place order logging in before checkout, Delivery and billing address verification, Invoice download after order |

### API Tests — 14 Total

| # | Endpoint | Method | What Is Asserted |
|---|---|---|---|
| API1 | `/api/productsList` | GET | Status 200, products array non-empty, each product has `id`, `name`, `price`, `brand`, `category` |
| API2 | `/api/productsList` | POST | responseCode 405, method not supported message |
| API3 | `/api/brandsList` | GET | Status 200, brands array non-empty, each brand has `id`, `brand` |
| API4 | `/api/brandsList` | PUT | responseCode 405, method not supported message |
| API5 | `/api/searchProduct` | POST | responseCode 200, matching products returned |
| API6 | `/api/searchProduct` | POST (no param) | responseCode 400, missing parameter error |
| API7 | `/api/verifyLogin` | POST (valid) | responseCode 200, "User exists" |
| API8 | `/api/verifyLogin` | POST (no email) | responseCode 400, missing parameter error |
| API9 | `/api/verifyLogin` | DELETE | responseCode 405, method not supported |
| API10 | `/api/verifyLogin` | POST (invalid) | responseCode 404, "User not found" |
| API11 | `/api/createAccount` | POST | responseCode 201, "User created" |
| API12 | `/api/deleteAccount` | DELETE | responseCode 200, "Account deleted" |
| API13 | `/api/updateAccount` | PUT | responseCode 200, "User updated" |
| API14 | `/api/getUserDetailByEmail` | GET | Status 200, correct `email` and `name` in response body |

### UI + API Cross-Verification

| Test | UI Action | API Verification |
|---|---|---|
| TC1 | Register user via full UI flow | API14 called post-registration to confirm user exists in backend |
| TC8 | Load All Products page in browser | API1 called to validate product count and field structure match |
| TC9 | Search for product via UI search bar | API5 called to verify same results returned from backend |
| TC19 | Browse brand products via UI | API3 called to verify brand data consistency between frontend and backend |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Install

```bash
git clone https://github.com/DhruvJohri/playwright-automationexercise.git
cd playwright-automationexercise
npm install
npx playwright install chromium
```

### Configure Environment

```bash
cp .env.example .env
```

Open `.env` and fill in your test credentials:

```
TEST_EMAIL=your_test_email@gmail.com
TEST_PASSWORD=YourPassword@123
TEST_USERNAME=YourUsername
```

Use a throwaway email address. Tests automatically create and delete accounts during execution. Do not use a real personal account.

---

## Running Tests

```bash
# Run the full suite (UI + API)
npx playwright test

# Run only UI tests
npx playwright test tests/ui/

# Run only API tests
npx playwright test tests/api/

# Run a specific spec file
npx playwright test tests/ui/auth.spec.ts

# Run in headed mode to watch the browser
npx playwright test --headed

# Control number of parallel workers
npx playwright test --workers=2

# Debug a single test interactively
npx playwright test --debug tests/ui/auth.spec.ts

# Open Playwright's visual UI mode
npx playwright test --ui
```

---

## Reports

An HTML report is generated automatically after every run.

```bash
npx playwright show-report
```

The report is saved to `playwright-report/index.html`.

| Feature | Behavior |
|---|---|
| Screenshots | Captured automatically on test failure |
| Video | Retained on first retry |
| Trace | Recorded on first retry, viewable with `npx playwright show-trace` |
| HTML Report | Always generated, never auto-opens in CI |

---

## CI/CD

This suite runs on GitHub Actions on every push and pull request to `main` or `master`.

Pipeline steps:

1. Check out the repository
2. Set up Node.js 20
3. Install dependencies with `npm ci`
4. Install Chromium browser
5. Run all tests with CI settings (2 workers, 2 retries)
6. Upload HTML report as a build artifact, retained for 7 days

### Required GitHub Secrets

Go to `Settings → Secrets and variables → Actions` and add the following:

| Secret Name | Value |
|---|---|
| `TEST_EMAIL` | Test account email address |
| `TEST_PASSWORD` | Test account password |
| `TEST_USERNAME` | Test account display name |

---

## Design Decisions

### No Hard Waits

Zero `waitForTimeout` calls anywhere in the suite. All synchronization relies on Playwright's built-in auto-waiting. Actions wait for elements to be actionable and assertions retry automatically until the configured timeout.

### Locator Strategy — Priority Order

1. `data-qa` attributes, which the site provides specifically for automation
2. `getByRole` with accessible name — semantic and resilient to CSS changes
3. `getByText` and `getByPlaceholder` — readable and intent-revealing
4. Scoped CSS selectors using stable IDs such as `#cart_info_table tbody tr`
5. XPath, positional CSS, and visual-only selectors are never used

### Test Independence

Every test that requires a user account creates one via API at the start and deletes it via API at the end. No test depends on another test's side effects. All tests can run in any order or fully in parallel without conflict.

### Unique Emails Per Test

`generateEmail()` appends `Date.now()` to produce a unique address per invocation. Tests running simultaneously in parallel never collide on the same account.

### API-Assisted Setup and Teardown

Account creation and deletion happen through API calls rather than UI flows, keeping each test focused on the specific behavior it is validating and reducing overall execution time.

### Auth State Separation

Tests that manage their own authentication — such as registration and order flows — run in fresh browser contexts with no pre-injected session. Shared auth state is only applied to tests that need a pre-authenticated starting point and do not modify it during the test.

---

## Author

**Dhruv Johri**

- GitHub: github.com/DhruvJohri
- LinkedIn: linkedin.com/in/dhruv-johri
- Twitter: @DhruvJohri_

TCS CodeVita Season 12 — Global Rank 430, Top 0.1% of 500,000+ participants
