import { authenticatedPage } from '@_api/helpers/auth-page.helper';
import { authToken } from '@_api/helpers/auth-token.helper';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  USER_EMAIL,
  USER_PASSWORD,
} from '@_config/env.config';
import { HomePage } from '@_ui/pages/home.page';
import { test as base } from '@playwright/test';

type AdminFixtures = {
  adminToken: string;
  loggedAdminHomePage: HomePage;
};

type UserFixtures = {
  userToken: string;
  loggedUserHomePage: HomePage;
};

export const adminTest = base.extend<AdminFixtures>({
  adminToken: async ({ request }, use) => {
    const token = await authToken(request, ADMIN_EMAIL, ADMIN_PASSWORD);
    await use(token);
  },

  loggedAdminHomePage: async ({ adminToken, browser }, use) => {
    const homePage = await authenticatedPage(browser, adminToken);
    await use(homePage);
    await homePage.page.close();
  },
});

export const userTest = base.extend<UserFixtures>({
  userToken: async ({ request }, use) => {
    const token = await authToken(request, USER_EMAIL, USER_PASSWORD);
    await use(token);
  },

  loggedUserHomePage: async ({ userToken, browser }, use) => {
    const homePage = await authenticatedPage(browser, userToken);
    await use(homePage);
    await homePage.page.close();
  },
});
