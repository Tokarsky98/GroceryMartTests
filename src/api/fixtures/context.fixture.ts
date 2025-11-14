import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  USER_EMAIL,
  USER_PASSWORD,
} from '../../../config/env.config';
import { authenticatedPage } from '../helpers/auth-page.helper';
import { authToken } from '../helpers/auth-token.helper';
import { Page, test as base } from '@playwright/test';

type AdminFixtures = {
  adminToken: string;
  loggedAdminPage: Page;
};

type UserFixtures = {
  userToken: string;
  loggedUserPage: Page;
};

export const adminTest = base.extend<AdminFixtures>({
  adminToken: async ({ request }, use) => {
    const token = await authToken(request, ADMIN_EMAIL, ADMIN_PASSWORD);
    await use(token);
  },

  loggedAdminPage: async ({ adminToken, browser }, use) => {
    const page = await authenticatedPage(browser, adminToken);
    await use(page);
    await page.close();
  },
});

export const userTest = base.extend<UserFixtures>({
  userToken: async ({ request }, use) => {
    const token = await authToken(request, USER_EMAIL, USER_PASSWORD);
    await use(token);
  },

  loggedUserPage: async ({ userToken, browser }, use) => {
    const page = await authenticatedPage(browser, userToken);
    await use(page);
    await page.close();
  },
});
