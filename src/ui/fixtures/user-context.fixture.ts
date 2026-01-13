import { getAuthToken } from '@_src/api/factories/auth-token.factory';
import { authenticatedPage } from '@_ui/helpers/authenticated-page.helper';
import { HomePage } from '@_ui/pages/home.page';
import { type Role, defaultUsers } from '@_ui/test-data/users.data';
import { test as base } from '@playwright/test';

type UserContextFixture = {
  role: Role;
  homePage: HomePage;
};

export const userContextTest = base.extend<UserContextFixture>({
  // Default role for tests is guest
  // Can be overridden per test using: test.use({ role: 'admin' })
  role: ['guest', { option: true }],

  // Provides a HomePage instance based on the current role
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

    // Create a new page with authenticated session
    const homePage = await authenticatedPage(page, token);

    await use(homePage);
    await homePage.page.close();
  },
});
