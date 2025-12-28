import { getAuthHeader } from '@_api/factories/auth-header.factory';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  USER_EMAIL,
  USER_PASSWORD,
} from '@_config/env.config';
import { authenticatedPage } from '@_ui/helpers/authenticated-page.helper';
import { HomePage } from '@_ui/pages/home.page';
import { test as base } from '@playwright/test';

type AuthenticatedPageFixture = {
  adminHomePage: HomePage;
  userHomePage: HomePage;
};

export const authenticatedPageTest = base.extend<AuthenticatedPageFixture>({
  adminHomePage: async ({ request, browser }, use) => {
    const headers = await getAuthHeader(request, ADMIN_EMAIL, ADMIN_PASSWORD);
    const homePage = await authenticatedPage(browser, headers);
    await use(homePage);
    await homePage.page.close();
  },

  userHomePage: async ({ request, browser }, use) => {
    const headers = await getAuthHeader(request, USER_EMAIL, USER_PASSWORD);
    const homePage = await authenticatedPage(browser, headers);
    await use(homePage);
    await homePage.page.close();
  },
});
