# 📘 GroceryMartTests – Test Automation Architecture

This repository is showcasing enterprise-grade testing patterns for both UI and API layers. It demonstrates professional practices used in scalable automation frameworks, including modular architecture, fixture composition, parametrized testing, session management, and comprehensive CI/CD integration.

---

## Table of Contents

- [Architecture at a Glance](#-architecture-at-a-glance)
- [Project Structure](#️-project-structure)
- [Fixtures – Setup, Override & Merging](#-fixtures--setup-override--merging)
  - [What are Fixtures?](#-what-are-fixtures)
  - [The Merge File – Fixture Composition Pattern](#-the-merge-file--fixture-composition-pattern)
  - [Overriding Fixtures](#-overriding-fixtures)
- [CI/CD – GitHub Actions & Workflow Dispatch](#-cicd--github-actions--workflow-dispatch)
- [TypeScript Configuration & Import Sorting](#-typescript-configuration--import-sorting)
- [API vs UI Authentication Handling](#-api-vs-ui-authentication-handling)
  - [API Tests – Token-Based Authentication](#-api-tests--token-based-authentication)
  - [UI Tests – Browser-Based Authentication](#️-ui-tests--browser-based-authentication)
- [Factories, Models, Requests, Utils & Test Data](#-factories-models-requests-utils--test-data)
  - [Factories – Dynamic Data Generators](#-factories--dynamic-data-generators)
  - [Models – TypeScript Interfaces](#-models--typescript-interfaces)
  - [Requests – API Client Wrappers](#-requests--api-client-wrappers)
  - [Utils – Centralized Helpers](#-utils--centralized-helpers)
  - [Test Data – Static Constants](#-test-data--static-constants)
- [Page Object Model – Pages vs Components](#-page-object-model--pages-vs-components)
  - [The Distinction](#-the-distinction)
  - [Pages](#-pages-srcuipages)
  - [Components](#-components-srcuicomponents)
  - [Helper Class – LabelWithField](#️-helper-class--labelwithfield)
  - [Benefits of This Pattern](#-benefits-of-this-pattern)
- [Test Tags & Filtering System](#️-test-tags--filtering-system)
- [Reporting – Dual Strategy](#-reporting--dual-strategy)
  - [Playwright HTML Reports](#-playwright-html-reports)
  - [GitHub Actions JUnit Reports](#-github-actions-junit-reports)
  - [Artifacts Retention](#-artifacts-retention)
- [Advanced Patterns & Features](#-advanced-patterns--features)
  - [1. Parametrized Test Cases](#1-parametrized-test-cases)
  - [2. Automatic Resource Cleanup](#2-automatic-resource-cleanup)
  - [3. Environment Configuration Validation](#3-environment-configuration-validation)
  - [4. Fluent Test API & Method Chaining](#4-fluent-test-api--method-chaining)
  - [5. Soft Assertions for Comprehensive Validation](#5-soft-assertions-for-comprehensive-validation)
  - [6. Hybrid Authentication (API + UI)](#6-hybrid-authentication-api--ui)
  - [7. Test Data Override at Multiple Levels](#7-test-data-override-at-multiple-levels)
  - [8. Component Composition](#8-component-composition)
- [Design Trade-offs & Decisions](#-design-trade-offs--decisions)
- [Summary](#-summary)

---

## 🧠 Architecture at a Glance

- **`tests/`** – Declarative test specifications only (no framework logic, only assertions)
- **`src/`** – Reusable framework infrastructure (no test assertions)
- **`src/api/`** – API test infrastructure (requests, fixtures, factories, models)
- **`src/ui/`** – UI test infrastructure (pages, components, helpers, test-data)
- **`merge.fixture.ts`** – Composition layer enabling hybrid API + UI fixture usage in tests
- **CI/CD** – Fully automated with manual dispatch, tag-based filtering, and comprehensive reporting

---

## 🗂️ Project Structure

```
GroceryMartTests/
├── .github/workflows/          # CI/CD pipelines
│   ├── playwright.yml            # Main test execution workflow with workflow_dispatch
│   └── linters.yml               # ESLint + TypeScript type checking
├── config/                     # Configuration management
│   └── env.config.ts             # Environment variable validation & export
|
├── src/                        # Shared test automation code
│   ├── api/                      # API testing layer
│   │   ├── factories/              # Data generators
│   │   ├── fixtures/               # Playwright fixtures
│   │   ├── models/                 # TypeScript interfaces
│   │   ├── requests/               # API request handlers
│   │   └── utils/                  # Utility functions (API endpoints)
│   ├── ui/                       # UI testing layer
│   │   ├── components/             # Reusable UI components
│   │   ├── factories/              # Data generators
│   │   ├── fixtures/               # Playwright fixtures
│   │   ├── helpers/                # Utility functions
│   │   ├── models/                 # TypeScript interfaces
│   │   ├── pages/                  # Page objects
│   │   └── test-data/              # Static test data
│   └── merge.fixture.ts          # Root fixture merging UI & API fixtures
|
├── tests/                      # Test specifications
│   ├── api/                      # API test specs (@api tagged)
│   └── ui/                       # UI test specs (@ui tagged)
│       ├── end-to-end/             # End-to-end flows
│       └── integration/            # Component integration tests
|
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript config with path aliases
├── package.json                # Dependencies and scripts
├── .env.example                # Environment variable template
└── README.md                   # Documentation
```

## 🧰 Fixtures – Setup, Override & Merging

### ✅ What are Fixtures?

Fixtures in Playwright are **reusable pieces of setup logic** (e.g., browser contexts, API tokens, authenticated sessions) that can be injected into tests. In this project:

- Fixtures are defined centrally and injected based on test needs (API/UI)
- Common functionality like login sessions is instantiated once and reused across tests
- Improves performance, consistency, and reduces code duplication

### 🔄 The Merge File – Fixture Composition Pattern

**Location**: [src/merge.fixture.ts](src/merge.fixture.ts)

```typescript
export const test = mergeTests(userContextTest, dataFixtureTest);
```

This file demonstrates **fixture composition** by merging two independent fixture chains:

**Chain 1 - UI Fixtures** ([src/ui/fixtures/user-context.fixture.ts](src/ui/fixtures/user-context.fixture.ts)):

- Provides `role` fixture (parametrizable: `'guest'` | `'admin'` | `'user'`)
- Provides `homePage` fixture that:
  - For `guest`: Creates unauthenticated page
  - For authenticated users: Calls API to get auth token, stores in localStorage, returns authenticated `HomePage`

**Chain 2 - API Fixtures** ([src/api/fixtures/request-object.fixture.ts](src/api/fixtures/request-object.fixture.ts) → [data.fixture.ts](src/api/fixtures/data.fixture.ts)):

- Provides three request fixtures:
  - `productsRequest`: Unauthenticated requests
  - `adminProductsRequest`: Authenticated with admin credentials
  - `userProductsRequest`: Authenticated with user credentials
- `data.fixture.ts` extends these to provide:
  - `products`: Array of created test products (auto-cleanup)
  - `product`: First product from products array

**Why merge?** This pattern enables tests to use both UI and API fixtures simultaneously without conflicts, supporting hybrid test scenarios.

### 🛠 Overriding Fixtures

Fixtures can be overridden at multiple levels for maximum flexibility:

**Test Suite Level** (using `test.use`):

```typescript
test.describe('Admin Product Management', () => {
  test.use({ role: 'admin' }); // All tests in this suite use admin role

  test('should create product', async ({ homePage }) => {
    // homePage is automatically authenticated as admin
  });
});
```

**Custom Fixture Implementation**:

```typescript
test.use({
  products: async ({ adminProductsRequest }, use) => {
    const product1 = prepareRandomProduct();
    const product2 = prepareRandomProduct();
    await createProducts(adminProductsRequest, use, [product1, product2]);
  },
});
```

**Per-Test Parametrization** ([tests/ui/end-to-end/login-lifecycle.spec.ts:8-18](tests/ui/end-to-end/login-lifecycle.spec.ts#L8-L18)):

```typescript
const authTestCases = [
  { role: 'admin' as const, greeting: 'Hi, Admin' },
  { role: 'user' as const, greeting: 'Hi, John Doe' },
];

for (const { role, greeting } of authTestCases) {
  test.describe(`${role} authentication via API`, () => {
    test.use({ role }); // Parametrized by role
    // Tests execute with each role's context
  });
}
```

This makes tests **configurable and scalable** across different environments and user roles.

---

## 🚀 CI/CD – GitHub Actions & Workflow Dispatch

**Location**: [.github/workflows/playwright.yml](.github/workflows/playwright.yml)

### Key Features

✅ **Workflow Dispatch** – Manual trigger with grep filter parameter

```yaml
workflow_dispatch:
  inputs:
    grep:
      description: 'Test grep filter'
      required: false
      default: '@ui|@api'
```

✅ **Dual Repository Checkout** – Tests repo + Application repo

- Checks out both `GroceryMartTests` (this repo) and `GroceryMartAI` (application)
- Starts backend (port 5000) and frontend servers
- Enables testing against actual application code in CI

✅ **Smart Caching**

- Playwright browsers cached
- NPM modules cached for tests, backend, and frontend
- Reduces CI build time significantly

✅ **Flexible Test Execution**

```bash
npm run test -- --grep="${{ inputs.grep }}" --retries=1
```

- Default: `@ui|@api` (all tests)
- Can filter by tags: `@smoke`, `@admin`, `@e2e`, etc.

✅ **Comprehensive Reporting**

- JUnit XML for GitHub Actions test report
- HTML report artifact (7-day retention)
- JSON results for custom processing
- Uses `mikepenz/action-junit-report@v5` for test result publishing

✅ **Code Quality Gate** – [.github/workflows/linters.yml](.github/workflows/linters.yml)

- ESLint validation
- TypeScript type checking
- Blocks merge on quality issues

---

## 🧠 TypeScript Configuration & Import Sorting

### Path Aliases ([tsconfig.json:8-13](tsconfig.json#L8-L13))

```json
"paths": {
  "@_src/*": ["src/*"],
  "@_api/*": ["src/api/*"],
  "@_ui/*": ["src/ui/*"],
  "@_fixtures/*": ["src/fixtures/*"],
  "@_config/*": ["config/*"]
}
```

### Benefits

✅ **Clean Imports** – No long relative paths

```typescript
// Instead of: import { test } from '../../../src/merge.fixture'
import { test } from '@_src/merge.fixture';
// Instead of: import { HomePage } from '../../src/ui/pages/home.page'
import { HomePage } from '@_ui/pages/home.page';
```

✅ **Logical Grouping** – Imports organized by layer

```typescript
// Config imports
import { prepareRandomProduct } from '@_api/factories/product.factory';
// API imports
import { ProductsRequest } from '@_api/requests/products.request';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '@_config/env.config';
// UI imports
import { HomePage } from '@_ui/pages/home.page';
import { defaultUsers } from '@_ui/test-data/users.data';
```

✅ **Refactoring Safety** – Move files without updating all import paths

---

## 🔑 API vs UI Authentication Handling

### 🧪 API Tests – Token-Based Authentication

**Flow** ([src/api/factories/auth-token.factory.ts](src/api/factories/auth-token.factory.ts) & [auth-header.factory.ts](src/api/factories/auth-header.factory.ts)):

1. Factory function `getAuthToken(request, credentials)` makes API call to `/api/auth/login`
2. Extracts JWT token from response and returns raw token string
3. Factory function `getAuthHeader(request, credentials)` wraps token with `Bearer` prefix
4. Returns `{ Authorization: "Bearer <token>" }` headers object
5. Headers passed to all subsequent requests

**Request Objects** ([src/api/requests/products.request.ts](src/api/requests/products.request.ts)):

```typescript
class ProductsRequest {
  constructor(
    private request: APIRequestContext,
    private headers?: HeadersModel, // Optional auth headers
  ) {}

  async get(): Promise<APIResponse> {
    return this.request.get(productsUrl, { headers: this.headers });
  }
  // POST, PUT, DELETE also use headers
}
```

**Request Fixtures** ([src/api/fixtures/request-object.fixture.ts:18-49](src/api/fixtures/request-object.fixture.ts#L18-L49)):

```typescript
productsRequest: async ({ request }, use) => {
  await use(new ProductsRequest(request));  // No auth
},

adminProductsRequest: async ({ request }, use) => {
  const adminHeaders = await getAuthHeader(request, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  await use(new ProductsRequest(request, adminHeaders));
},

userProductsRequest: async ({ request }, use) => {
  const userHeaders = await getAuthHeader(request, {
    email: USER_EMAIL,
    password: USER_PASSWORD,
  });
  await use(new ProductsRequest(request, userHeaders));
},
```

**Benefits**:

- ✅ Fast – No UI interaction needed
- ✅ Stable – No browser flakiness
- ✅ Reusable – Token obtained once per test
- ✅ Backend-focused – Pure API testing

### 🖥️ UI Tests – Browser-Based Authentication

**Flow** ([src/ui/helpers/authenticated-page.helper.ts](src/ui/helpers/authenticated-page.helper.ts)):

1. Receive shared Playwright `page` fixture and raw JWT token
2. Use `page.addInitScript()` to inject token into `localStorage` **before** page navigation
3. Navigate to application (`BASE_URL`)
4. Return `HomePage` instance in authenticated state

**Key Improvement**: Using `addInitScript()` ensures the token is available before the page loads, avoiding race conditions and "invalid token" errors.

**User Context Fixture** ([src/ui/fixtures/user-context.fixture.ts:12-36](src/ui/fixtures/user-context.fixture.ts#L12-L36)):

```typescript
homePage: async ({ role, request, page }, use) => {
  if (role === 'guest') {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
    return;
  }

  // Get credentials for the role
  const credentials = defaultUsers[role];
  const token = await getAuthToken(request, credentials);

  // Create authenticated page with token
  const homePage = await authenticatedPage(page, token);

  await use(homePage);
},
```

**Authentication Token Factory** ([src/api/factories/auth-token.factory.ts](src/api/factories/auth-token.factory.ts)):

```typescript
export async function getAuthToken(
  request: APIRequestContext,
  loginData: LoginModel,
): Promise<string> {
  const loginRequest = new LoginRequest(request);
  const loginResponse = await loginRequest.post(loginData);
  await expect(loginResponse).toBeOK();

  const loginResponseJson = await loginResponse.json();
  const token = loginResponseJson.token;

  expect(token, 'Auth token should be present in response').toBeDefined();
  expect(typeof token, 'Auth token should be a string').toBe('string');

  return token; // Returns raw token without "Bearer " prefix
}
```

**Benefits**:

- ✅ Hybrid approach – API login for speed, UI validation for E2E
- ✅ No repetitive UI logins – Session stored in localStorage via `addInitScript()`
- ✅ Separation of concerns – Token extraction (`getAuthToken`) vs. header formatting (`getAuthHeader`)
- ✅ Race-condition free – Token injected before page loads
- ✅ Reusable – Same token factory used for both API and UI tests

---

## 🏭 Factories, Models, Requests, Utils & Test Data

### 🏭 Factories – Dynamic Data Generators

**API Factories** ([src/api/factories/product.factory.ts](src/api/factories/product.factory.ts)):

```typescript
export const prepareRandomProduct = (): ProductsModel => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: Number(faker.commerce.price()),
  category: faker.helpers.arrayElement([
    'seafood',
    'vegetables',
    'fruits',
    'dairy',
  ]),
  stock: faker.number.int({ min: 1, max: 100 }),
  image: faker.image.url(),
});

export const prepareCustomProduct = (
  field: keyof ProductsModel,
  value: string | number,
): ProductsModel => ({
  ...prepareRandomProduct(),
  [field]: value, // Override specific field for negative tests
});
```

**UI Factories** ([src/ui/factories/user.factory.ts](src/ui/factories/user.factory.ts)):

```typescript
export const prepareRandomUser = (): SignUpModel => {
  const password = faker.internet.password();
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: password,
    confirmPassword: password,
  };
};
```

### 📐 Models – TypeScript Interfaces

**API Models**:

- [products.model.ts](src/api/models/products.model.ts) – `ProductsModel` (name, description, price, category, stock, image)
- [products-response.model.ts](src/api/models/products-response.model.ts) – `ProductResponseModel` (extends ProductsModel + id)
- [login.model.ts](src/api/models/login.model.ts) – `LoginModel` (email, password)
- [headers.model.ts](src/api/models/headers.model.ts) – `HeadersModel` (flexible key-value headers)

**UI Models**:

- [login.model.ts](src/ui/models/login.model.ts) – `LoginModel` (email, password)
- [sign-up.model.ts](src/ui/models/sign-up.model.ts) – `SignUpModel` (name, email, password, confirmPassword)

**Benefits**:

- ✅ Type safety – Compile-time validation
- ✅ Autocomplete – Better developer experience
- ✅ Refactoring – Easy to update data structures
- ✅ Documentation – Self-documenting code

### 📡 Requests – API Client Wrappers

**Products Request** ([src/api/requests/products.request.ts](src/api/requests/products.request.ts)):

```typescript
class ProductsRequest {
  async get(): Promise<APIResponse>;
  async getOne(productId: string): Promise<APIResponse>;
  async post(product: ProductsModel): Promise<APIResponse>;
  async put(product: ProductResponseModel): Promise<APIResponse>;
  async delete(productId: string): Promise<APIResponse>;
}
```

**Login Request** ([src/api/requests/login.request.ts](src/api/requests/login.request.ts)):

```typescript
class LoginRequest {
  async post(loginModel: LoginModel): Promise<APIResponse>;
}
```

**Benefits**:

- ✅ Encapsulation – API logic separated from tests
- ✅ Reusability – One request class, many tests
- ✅ Maintainability – API changes handled in one place

### 🔧 Utils – Centralized Helpers

**API Utils** ([src/api/utils/api.util.ts](src/api/utils/api.util.ts)):

```typescript
export const loginUrl = '/api/auth/login';
export const productsUrl = '/api/products';
```

**UI Helpers**:

- [authenticated-page.helper.ts](src/ui/helpers/authenticated-page.helper.ts) – Creates authenticated browser pages
- [label-with-field.helper.ts](src/ui/helpers/label-with-field.helper.ts) – Encapsulates form field patterns (label + input + validation message)

### 📊 Test Data – Static Constants

**Users Data** ([src/ui/test-data/users.data.ts](src/ui/test-data/users.data.ts)):

```typescript
export const defaultUsers = {
  admin: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  user: { email: USER_EMAIL, password: USER_PASSWORD },
};

export const invalidCredentials = {
  wrongEmail: [...],
  wrongPassword: [...],
};

export const invalidInputs = {
  emptyEmail: [...],
  malformedEmail: [...],
};
```

**Products Data** ([src/ui/test-data/products.data.ts](src/ui/test-data/products.data.ts)):

```typescript
export const products = {
  pasta: 'Pasta',
  salmonFillet: 'Salmon Fillet',
  // ...
};

export const categories = {
  seafood: 'seafood',
  vegetables: 'vegetables',
  // ...
};
```

**Validation Messages** ([src/ui/test-data/validation-messages.data.ts](src/ui/test-data/validation-messages.data.ts)):

```typescript
export const loginValidationMessages = {
  requiredEmail: 'Email is required',
  invalidEmail: 'Invalid email format',
  // ...
};

export const toastMessages = {
  loginSuccess: 'Login successful!',
  productCreated: 'Product created successfully!',
  // ...
};
```

**Benefits**:

- ✅ Consistency – Same data across tests
- ✅ No hardcoded values – Easy to update
- ✅ Centralized – Single source of truth

---

## 📐 Page Object Model – Pages vs Components

### 🎯 The Distinction

| Aspect           | Pages                                 | Components                            |
| ---------------- | ------------------------------------- | ------------------------------------- |
| **Represents**   | Full page of the application          | Reusable UI widget/section            |
| **Examples**     | `LoginPage`, `HomePage`, `SignUpPage` | `NavbarComponent`, `ProductComponent` |
| **Root Element** | `page: Page`                          | `root: Locator`                       |
| **Navigation**   | Has `goto()` method                   | No navigation                         |
| **Composition**  | Uses components                       | Standalone                            |
| **Return Types** | Returns other pages (fluent API)      | Returns data or void                  |

### 📄 Pages ([src/ui/pages/](src/ui/pages/))

**HomePage** ([home.page.ts](src/ui/pages/home.page.ts)):

```typescript
class HomePage {
  readonly page: Page;
  readonly navbar: NavbarComponent; // Composition
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = new NavbarComponent(page.getByRole('navigation'));
    this.productCards = page.getByTestId('product-card');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  getProductByName(name: string): ProductComponent {
    const product = this.productCards.filter({ hasText: name });
    return new ProductComponent(product);
  }
}
```

### 🧩 Components ([src/ui/components/](src/ui/components/))

**NavbarComponent** ([navbar.component.ts](src/ui/components/navbar.component.ts)):

```typescript
class NavbarComponent {
  readonly root: Locator; // NOT page: Page
  readonly homeLink: Locator;
  readonly adminLink: Locator;
  readonly loginLink: Locator;
  readonly logoutButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.homeLink = root.getByRole('link', { name: 'Home' });
    this.adminLink = root.getByRole('link', { name: 'Admin' });
    this.loginLink = root.getByRole('link', { name: 'Login' });
    this.logoutButton = root.getByRole('button', { name: 'Logout' });
  }

  async clickLogin(): Promise<void> {
    await this.loginLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
```

### 🛡️ Helper Class – LabelWithField

**Purpose** ([src/ui/helpers/label-with-field.helper.ts](src/ui/helpers/label-with-field.helper.ts)):
Encapsulates a common UI pattern: label + input field + validation message.

```typescript
class LabelWithField {
  readonly label: Locator;
  readonly field: Locator;
  readonly validationMessage?: Locator;

  constructor(label: Locator, field: Locator, validationMessage?: Locator) {
    this.label = label;
    this.field = field;
    this.validationMessage = validationMessage;
  }
}
```

**Usage in Pages**:

```typescript
this.email = new LabelWithField(
  page.getByLabel('Email'),
  page.getByPlaceholder('Enter your email'),
  page.locator('.form-group', { hasText: 'Email' }).locator('.error-message'),
);
```

### ✅ Benefits of This Pattern

- **Readability** – Clear distinction between full pages and reusable components
- **Reusability** – Components used across multiple pages
- **Maintainability** – Update component once, affects all pages using it
- **Scalability** – Easy to add new pages/components without duplication
- **Testability** – Components can be tested independently

This is a **key pattern in scalable UI test automation**.

---

## 🏷️ Test Tags & Filtering System

All tests use a **consistent tagging system** for flexible test execution.

### Tag Categories

**Test Layer**:

- `@api` – API tests
- `@ui` – UI tests

**Authentication Level**:

- `@admin` – Tests with admin role
- `@user` – Tests with user role
- `@guest` – Tests without authentication

**Test Category**:

- `@smoke` – Smoke tests (basic functionality)
- `@e2e` – End-to-end lifecycle tests
- `@integration` – Component integration tests

### Example Test Tags

```typescript
test('should create product with admin authentication @api @admin', async ...)
test('should add product to cart @ui @guest @e2e', async ...)
test('get products should return 200 @api @guest @smoke', async ...)
test('admin should see admin panel link @ui @admin @integration', async ...)
```

### Running Tests with Tags

```bash
# All API tests
npm run test -- --grep "@api"

# All UI tests
npm run test -- --grep "@ui"

# API tests with admin role
npm run test -- --grep "@api.*@admin"

# Smoke tests only
npm run test -- --grep "@smoke"

# E2E tests only
npm run test:e2e  # Shortcut defined in package.json

# Everything except integration tests
npm run test -- --grep-invert "@integration"

# Manual workflow dispatch in CI
# (Via GitHub Actions UI, can pass custom grep filter)
```

---

## 📊 Reporting – Dual Strategy

### 📋 Playwright HTML Reports

**Configuration** ([playwright.config.ts](playwright.config.ts)):

```typescript
reporter: [
  ['html'],  // Interactive HTML report
  ['json', { outputFile: './playwright-report/results.json' }],
  ['junit', { outputFile: './playwright-report/results.xml' }],
],
```

**Features**:

- Interactive web viewer (`npx playwright show-report`)
- Screenshots on failure
- Videos on failure
- Execution traces for debugging
- Filter by status, project, file
- Search functionality

**Trace Viewer** – Most powerful debugging tool:

```bash
npx playwright show-trace test-results/path-to-trace.zip
```

- Inspect DOM snapshots at each step
- View network requests
- See console logs
- Analyze test timeline

### ✅ GitHub Actions JUnit Reports

**Configuration** ([.github/workflows/playwright.yml:80-86](.github/workflows/playwright.yml#L80-L86)):

```yaml
- name: Publish Test Report
  uses: mikepenz/action-junit-report@v5
  if: always()
  with:
    report_paths: '**/playwright-report/results.xml'
    detailed_summary: true
    include_passed: true
```

**Features**:

- Integrated with GitHub pull request checks
- Test summary in PR comments
- Pass/fail status visible in Actions UI
- Historical test metrics

### 📦 Artifacts Retention

**Uploaded Artifacts** ([.github/workflows/playwright.yml:88-94](.github/workflows/playwright.yml#L88-L94)):

- HTML reports (7-day retention)
- JSON results (7-day retention)
- Test results (screenshots, videos, traces)

**Benefits**:

- ✅ **Rich local feedback** – HTML reports for debugging
- ✅ **CI integration** – JUnit for automated pipelines
- ✅ **Historical analysis** – JSON for custom reporting
- ✅ **Debugging power** – Traces for complex failures

---

## 🚀 Advanced Patterns & Features

### 1. Parametrized Test Cases

**Pattern** ([tests/ui/end-to-end/login-lifecycle.spec.ts:8-18](tests/ui/end-to-end/login-lifecycle.spec.ts#L8-L18)):

```typescript
const authTestCases = [
  { role: 'admin' as const, greeting: 'Hi, Admin' },
  { role: 'user' as const, greeting: 'Hi, John Doe' },
];

for (const { role, greeting } of authTestCases) {
  test.describe(`${role} authentication via API`, () => {
    test.use({ role });

    test('should display correct greeting', async ({ homePage }) => {
      await expect(homePage.navbar.userGreeting).toHaveText(greeting);
    });
  });
}
```

**Benefits**:

- Reduces code duplication
- Easy to add new test cases
- Clear test coverage across roles

### 2. Automatic Resource Cleanup

**Pattern** ([src/api/fixtures/manage-objects.fixture.ts](src/api/fixtures/manage-objects.fixture.ts)):

```typescript
export const createProducts = async (
  adminProductsRequest: ProductsRequest,
  use: (r: ProductResponseModel[]) => Promise<void>,
  productDetails: ProductsModel[] = [],
): Promise<void> => {
  const results: ProductResponseModel[] = [];

  // Create products
  for (const productDetail of productDetails) {
    const response = await adminProductsRequest.post(productDetail);
    const product: ProductResponseModel = await response.json();
    results.push(product);
  }

  await use(results); // Test runs here

  // Automatic cleanup after test
  for (const obj of results) {
    const response = await adminProductsRequest.delete(obj.id);
    expect([200, 404]).toContain(response.status());
  }
};
```

**Benefits**:

- Ensures clean test environment
- No leftover test data
- Reliable test execution

### 3. Environment Configuration Validation

**Pattern** ([config/env.config.ts](config/env.config.ts)):

```typescript
function requireEnvVariable(envVariable: string): string {
  const envVariableValue = process.env[envVariable];
  if (!envVariableValue) {
    throw new Error(`Environment variable ${envVariable} is not set.`);
  }
  return envVariableValue;
}

export const BASE_URL = requireEnvVariable('BASE_URL');
export const ADMIN_EMAIL = requireEnvVariable('ADMIN_EMAIL');
export const ADMIN_PASSWORD = requireEnvVariable('ADMIN_PASSWORD');
export const USER_EMAIL = requireEnvVariable('USER_EMAIL');
export const USER_PASSWORD = requireEnvVariable('USER_PASSWORD');
```

**Benefits**:

- Fail fast on missing configuration
- Clear error messages
- Prevents runtime surprises

### 4. Fluent Test API & Method Chaining

**Pattern** ([src/ui/pages/login.page.ts](src/ui/pages/login.page.ts)):

```typescript
async clickSignUpLink(): Promise<SignUpPage> {
  await this.signUpLink.click();
  return new SignUpPage(this.page);  // Return next page
}

// Usage in test
const loginPage = new LoginPage(page);
const signUpPage = await loginPage.clickSignUpLink();
const homePage = await signUpPage.signUp(userData);
```

**Benefits**:

- Readable test code
- Type-safe page transitions
- Self-documenting test flow

### 5. Soft Assertions for Comprehensive Validation

**Pattern** ([tests/api/products.smoke.spec.ts](tests/api/products.smoke.spec.ts)):

```typescript
test('get products should return all required fields @api @guest @smoke', async ({
  productsRequest,
}) => {
  const response = await productsRequest.get();
  const products = await response.json();

  const expectedRequiredFields = [
    'id',
    'name',
    'description',
    'price',
    'category',
    'stock',
    'image',
  ];

  products.forEach((product: ProductResponseModel) => {
    expect.soft(product.id).toBeDefined();
    expectedRequiredFields.forEach((key) => {
      expect.soft(product).toHaveProperty(key);
    });
  });
});
```

**Benefits**:

- See all failures at once (not just first)
- Better test coverage visibility
- Faster debugging

### 6. Hybrid Authentication (API + UI)

**Pattern** ([src/ui/helpers/authenticated-page.helper.ts](src/ui/helpers/authenticated-page.helper.ts)):

```typescript
export const authenticatedPage = async (
  page: Page,
  token: string,
): Promise<HomePage> => {
  // Inject token into localStorage before page loads
  await page.addInitScript((token) => {
    localStorage.setItem('token', token);
  }, token);

  await page.goto(BASE_URL);

  return new HomePage(page);
};
```

**Why `addInitScript()`?**

- Script executes **before** any page code runs
- Prevents "invalid token" race conditions
- Token is available immediately when application loads
- More reliable than `page.evaluate()` after navigation

**Benefits**:

- Fast setup (API) + UI validation
- Best of both worlds
- Realistic user sessions
- Race-condition free authentication

### 7. Test Data Override at Multiple Levels

**Level 1 – Fixture Override**:

```typescript
test.use({ role: 'admin' });
```

**Level 2 – Factory Override**:

```typescript
const invalidProduct = prepareCustomProduct('price', -100); // Negative test
```

**Level 3 – Direct Parameter**:

```typescript
await loginPage.login({ email: 'invalid@test.com', password: '123' });
```

**Benefits**:

- Maximum flexibility
- Supports positive and negative tests
- Clean test code

### 8. Component Composition

**Pattern** ([src/ui/pages/home.page.ts](src/ui/pages/home.page.ts)):

```typescript
class HomePage {
  readonly navbar: NavbarComponent;

  constructor(page: Page) {
    this.navbar = new NavbarComponent(page.getByRole('navigation'));
  }
}

// In test
await homePage.navbar.clickLogin(); // Access component methods
```

**Benefits**:

- Encapsulation of UI sections
- Reusable across pages
- Single source of truth for component behavior

---

## ⚖️ Design Trade-offs & Decisions

This section explains **intentional architectural choices** and their rationale – a hallmark of senior engineering documentation.

### 1. API Login for UI Test Setup

**Decision**: UI tests use API calls to establish authentication state, rather than logging in through the UI for every test.

**Trade-off**:

- ✅ **Gain**: 10x faster test execution, reduced flakiness, cleaner test isolation
- ❌ **Cost**: UI login flow not validated in every test

**Mitigation**: Dedicated E2E tests ([tests/ui/end-to-end/login-lifecycle.spec.ts](tests/ui/end-to-end/login-lifecycle.spec.ts)) explicitly validate the full UI login flow.

### 2. Playwright Fixtures Over `beforeEach` Hooks

**Decision**: Use Playwright's fixture system instead of traditional `beforeEach`/`afterEach` hooks.

**Rationale**:

- **Composability**: Fixtures can extend and merge without conflicts
- **Parallel Safety**: Each test gets isolated fixture instances
- **Dependency Injection**: Test declares what it needs; framework provides it
- **Automatic Cleanup**: Built-in teardown mechanism ensures resource cleanup

**Trade-off**: Steeper learning curve for engineers unfamiliar with fixture-based patterns, but worth it for long-term maintainability.

### 3. Separate `tests/` and `src/` Directories

**Decision**: Tests contain only specifications, all framework logic lives in `src/`.

**Rationale**:

- Test files remain readable and declarative
- Framework code is reusable across multiple test suites
- Clear boundary between "what to test" (tests) and "how to test" (src)

### 4. TypeScript Over JavaScript

**Decision**: Entire framework written in TypeScript with strict mode enabled.

**Rationale**:

- Compile-time error detection reduces runtime failures
- IDE autocomplete improves developer productivity
- Self-documenting code through type annotations
- Easier refactoring with confidence

**Trade-off**: Requires TypeScript knowledge, but essential for enterprise-scale projects.

### 5. Component-Based Page Objects

**Decision**: Split Page Objects into `pages/` (full pages) and `components/` (reusable widgets).

**Rationale**:

- Reduces duplication (e.g., `NavbarComponent` used across multiple pages)
- Improves testability (components can be tested in isolation)
- Better matches modern UI architecture (component-based frameworks)

**Alternative Considered**: Monolithic page objects – rejected due to poor scalability.

---

## 🎓 Summary

This repository demonstrates **enterprise-level test automation expertise** through:

✅ **Architecture**:

- Clear separation of concerns (pages, components, helpers, factories)
- Modular, maintainable, and scalable structure
- Advanced TypeScript usage (path aliases, strict typing)

✅ **Patterns**:

- Fixture composition and merging
- Page Object Model with component distinction
- Factory pattern for test data generation
- Fluent API for readable tests

✅ **Testing Strategy**:

- Comprehensive tagging system for flexible execution
- Hybrid authentication (API + UI)
- Parametrized testing for role-based scenarios
- Both positive and negative test cases

✅ **DevOps Integration**:

- GitHub Actions CI/CD with workflow dispatch
- Dual reporting (Playwright HTML + JUnit)
- Code quality gates (ESLint, TypeScript)
- Smart caching for fast builds

✅ **Code Quality**:

- DRY principle
- Type safety throughout
- Environment configuration validation
- Automatic resource cleanup
