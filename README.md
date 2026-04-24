# Playwright Automation Suite — automationexercise.com

Full UI + API automation covering all 26 UI test cases and 14 API test cases from [automationexercise.com](https://automationexercise.com/test_cases).

---

## Tech Stack

- **Framework:** Playwright (TypeScript)
- **Pattern:** Page Object Model (POM)
- **Reporting:** HTML Report + Screenshots on failure
- **Parallelism:** 4 workers (configurable)
- **CI Ready:** Yes

---

## Project Structure

```
playwright-automationexercise/
├── tests/
│   ├── auth.setup.ts          # One-time login session setup
│   ├── ui/
│   │   ├── auth.spec.ts       # TC1–TC5  (Register, Login, Logout)
│   │   ├── misc.spec.ts       # TC6–TC7, TC10–TC11, TC25–TC26
│   │   ├── products.spec.ts   # TC8–TC9, TC18–TC19, TC21–TC22
│   │   ├── cart.spec.ts       # TC12–TC13, TC17, TC20
│   │   └── order.spec.ts      # TC14–TC16, TC23–TC24
│   └── api/
│       └── api.spec.ts        # API 1–14
├── pages/
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── SignupPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   └── testData.ts            # Centralized test data
├── utils/
│   └── apiHelper.ts           # Reusable API wrapper (all 14 APIs)
├── playwright.config.ts
├── .env                       # Credentials (never commit to git)
├── .gitignore
└── README.md
```

---

## Setup

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install

```bash
git clone https://github.com/DhruvJohri/playwright-automationexercise.git
cd playwright-automationexercise
npm install
npx playwright install chromium
```

### Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
TEST_EMAIL=your_test_email@gmail.com
TEST_PASSWORD=YourPassword@123
TEST_USERNAME=YourUsername
```

> ⚠️ Use a throwaway email. Tests create and delete accounts automatically.

---

## Running Tests

```bash
# Run all tests (UI + API)
npx playwright test

# Run only UI tests
npx playwright test tests/ui/

# Run only API tests
npx playwright test tests/api/

# Run a specific spec file
npx playwright test tests/ui/auth.spec.ts

# Run in headed mode (see the browser)
npx playwright test --headed

# Run with specific number of workers
npx playwright test --workers=2

# Debug a single test
npx playwright test --debug tests/ui/auth.spec.ts
```

---

## View Report

```bash
npx playwright show-report
```

HTML report is generated at `playwright-report/index.html` after every run.  
Screenshots are captured automatically on test failure.

---

## Test Coverage

### UI Tests (26 Total)

| File | Test Cases | Description |
|------|-----------|-------------|
| `auth.spec.ts` | TC1–TC5 | Register, Login (valid/invalid), Logout, Existing email |
| `misc.spec.ts` | TC6, TC7, TC10, TC11, TC25, TC26 | Contact form, Test cases page, Subscriptions, Scroll |
| `products.spec.ts` | TC8, TC9, TC18, TC19, TC21, TC22 | Products, Search, Categories, Brands, Review, Recommended |
| `cart.spec.ts` | TC12, TC13, TC17, TC20 | Add to cart, Quantity, Remove, Cart after login |
| `order.spec.ts` | TC14, TC15, TC16, TC23, TC24 | Place order (3 flows), Address verify, Invoice download |

### API Tests (14 Total)

| API | Endpoint | Method | Validated |
|-----|----------|--------|-----------|
| 1 | `/api/productsList` | GET | 200, products array, fields |
| 2 | `/api/productsList` | POST | 405 not supported |
| 3 | `/api/brandsList` | GET | 200, brands array, fields |
| 4 | `/api/brandsList` | PUT | 405 not supported |
| 5 | `/api/searchProduct` | POST | 200, matching results |
| 6 | `/api/searchProduct` | POST (no param) | 400 bad request |
| 7 | `/api/verifyLogin` | POST (valid) | 200 User exists |
| 8 | `/api/verifyLogin` | POST (no email) | 400 bad request |
| 9 | `/api/verifyLogin` | DELETE | 405 not supported |
| 10 | `/api/verifyLogin` | POST (invalid) | 404 User not found |
| 11 | `/api/createAccount` | POST | 201 User created |
| 12 | `/api/deleteAccount` | DELETE | 200 Account deleted |
| 13 | `/api/updateAccount` | PUT | 200 User updated |
| 14 | `/api/getUserDetailByEmail` | GET | 200, correct user JSON |

---

## UI + API Cross-Verification

Key tests cross-verify frontend and backend consistency:

- **TC1** → After UI registration, calls API14 to confirm user exists in DB
- **TC8** → After loading products page in UI, calls API1 to verify product count/structure matches
- **TC9** → After UI search, calls API5 to verify same results from backend
- **TC19** → After UI brand page, calls API3 to verify brands data

---

## Design Decisions

### No Hard Waits
All tests use Playwright's built-in auto-waiting. Zero `waitForTimeout` calls (except one brief DOM settle in cart removal).

### Unique Emails Per Test
Every test that creates a user generates a unique email via `Date.now()` to prevent inter-test conflicts when running in parallel.

### API-Assisted Cleanup
Tests that need a pre-existing user create it via API (fast) rather than UI, and delete via API after the test.

### Stable Locators
All locators use `data-qa` attributes where available, falling back to semantic selectors (`role`, `text`, `id`). No fragile XPath.

### Shared Auth State
Order tests (`order.spec.ts`) can optionally use saved `auth.json` from `auth.setup.ts` to skip repeated logins.

---

## CI/CD (GitHub Actions)

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
        env:
          TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
          TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Author

**Dhruv Johri**  
GitHub: [@DhruvJohri](https://github.com/DhruvJohri)  
TCS CodeVita Global Rank 430 (Top 0.1% of 500,000+ participants)
