# GroceryMartTests

Hi! My name is Mateusz and I work as an QA Engineer with over three and a half years of experience, specializing in Playwright and TypeScript test automation from the very beginning of my career.

On a daily basis, I use AI tools such as Claude, DeepL and GitHub Copilot.I also hold an ISTQB certification and continuously develop my skills. I am curious about the world, learn quickly and communicate effectively with people.

I appreciate every feedback and thank you for your time!

## About

This repository was created to showcase how test automation can effectively evolve when the application and the test automation project are maintained in separate repositories.  

It is an evolving collection of advanced Playwright solutions, including:

- Environment configuration
- UI and API test examples
- Project structure
- User session management and authentication handling
- CI/CD integration through GitHub Actions is included
- Scalable patterns and strategies implemented:
  - Page Object Model
  - Fixtures and helpers
  - Organization and error prevention strategies

The repository reflects practical knowledge from real-world projects using Playwright, even though it is still under development.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Running the Tests](#running-the-tests)
- [Reporting](#reporting)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before running the tests, ensure you have:

- [Github](https://github.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en) v20 or higher
- [GroceryMartAI](https://github.com/Tokarsky98/GroceryMartAI) application running locally

The tests require the GroceryMartAI application to be running. All the necessary steps are included in its own README file.

## Installation and Setup

1.  Install recommended Visual Studio Code extensions.

2.  Install project dependencies:

    ```bash
    npm install
    ```

3.  Install Playwright browsers and required dependencies:

    ```bash
    npx playwright install --with-deps chromium
    ```

4.  Create your environment configuration:

    ```bash
    cp .env.example .env
    ```

## Environment Variables

Fill in your `.env` file using the default accounts listed in the
GroceryMartAI repository (section: `Default Test Accounts`)

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
