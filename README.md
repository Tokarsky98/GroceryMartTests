# GroceryMartTests

Hi! My name is **Mateusz** and I am a **QA Automation Engineer** with almost 4 years of professional experience, specializing in **Playwright and TypeScript-based test automation frameworks**.

I appreciate all feedback and thank you for your time!

---

## Table of Contents

- [About This Repository](#about-this-repository)
  - [Who This Is For](#who-this-is-for)
  - [Key Highlights](#key-highlights)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Running the Tests](#running-the-tests)
- [Test Tags](#test-tags)
- [Reporting](#reporting)
- [Troubleshooting](#troubleshooting)

---

## About This Repository

This repository showcases **enterprise-grade test automation architecture** for both UI and API layers, demonstrating how scalable test frameworks are built and maintained independently from the application codebase.

**📘 Architecture & Framework Documentation**
➡️ See [ARCHITECTURE.md](ARCHITECTURE.md) for comprehensive technical documentation, design patterns, and architectural decisions.

### Who This Is For

This project is intended for:

- **Senior QA Automation Engineers** evaluating framework design patterns
- **Engineers** designing or maintaining Playwright-based frameworks
- **Recruiters and hiring managers** assessing test architecture skills

It focuses on **architecture, scalability, and maintainability** rather than introductory examples.

### Key Highlights

- ✅ Fixture composition and merging pattern
- ✅ Page Object Model with component distinction
- ✅ Hybrid authentication (API + UI)
- ✅ TypeScript with path aliases
- ✅ CI/CD integration with GitHub Actions
- ✅ Comprehensive tagging and filtering system
- ✅ Dual reporting strategy (Playwright HTML + JUnit)

## Prerequisites

Before running the tests, ensure you have:

- [Github](https://github.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en) v20 or higher
- [GroceryMartAI](https://github.com/Tokarsky98/GroceryMartAI) application running locally

**Important:** The tests require the GroceryMartAI application to be running at `http://localhost:3000`. Follow the [GroceryMartAI setup instructions](https://github.com/Tokarsky98/GroceryMartAI#installation-and-setup) to start the application before running tests.

## Installation and Setup

1. Install recommended Visual Studio Code extensions.

2. Install project dependencies:

    ```bash
    npm install
    ```

3. Install Playwright browsers and required dependencies:

    ```bash
    npx playwright install --with-deps chromium
    ```

4. Create your environment configuration:

    ```bash
    cp .env.example .env
    ```

## Environment Variables

Fill in your `.env` file using the [default accounts listed in the GroceryMartAI repository](https://github.com/Tokarsky98/GroceryMartAI/?tab=readme-ov-file#-default-test-accounts)

```text
BASE_URL='http://localhost:3000'
ADMIN_EMAIL='your-admin-email'
ADMIN_PASSWORD='your-admin-password'
USER_EMAIL='your-user-email'
USER_PASSWORD='your-user-password'
```

## Running the Tests

Run all tests:

```bash
npm run test
```

Run tests in headed mode with debugger stopped at the beginning of each
test:

```bash
npm run test -- --debug
```

Run a single test by its title:

```bash
npm run test -- -g "test-title"
```

For more commands and options, see the `scripts` section in
`package.json`.

## Test Tags

All tests are organized with a unified tagging system for flexible test execution.

### Tag Categories

1. **Test Type:**
   - `@api` - API tests
   - `@ui` - UI tests

2. **Authentication Level:**
   - `@admin` - Tests using admin authentication
   - `@user` - Tests using user authentication
   - `@guest` - Tests without authentication

3. **Test Category:**
   - `@smoke` - Smoke tests
   - `@e2e` - End-to-end tests
   - `@integration` - Integration tests

### Examples of Running Tests with Tags

Run all API tests:

```bash
npm run test -- --grep "@api"
```

Run API admin tests (combining tags):

```bash
npm run test -- --grep "@api.*@admin"
```

Exclude integration tests (inverting tags):

```bash
npm run test -- --grep-invert "@integration"
```

## Reporting

Open the most recent Playwright report:

```bash
npx playwright show-report
```

Reports include:

- Test results
- Screenshots
- Videos
- Execution traces

## Troubleshooting

**Tests fail immediately?** Make sure the GroceryMartAI app is running
at the URL configured in `.env`.

**Login tests fail?** Verify that the credentials in `.env` match the
default test accounts.

**Browser does not launch?** Reinstall browser dependencies:

```bash
npx playwright install --with-deps chromium
```
