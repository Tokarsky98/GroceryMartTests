import { expect, test } from '../src/api/fixtures/merge.fixture';

test.describe('Admin', () => {
  test('should display admin greeting and logout button when authenticated', async ({
    loggedAdminPage,
  }) => {
    await expect(loggedAdminPage.getByText('Hi, Admin')).toBeVisible();
    await expect(
      loggedAdminPage.getByRole('button', { name: 'Logout' }),
    ).toBeVisible();
  });
});

test.describe('User', () => {
  test('should display user greeting and logout button when authenticated', async ({
    loggedUserPage,
  }) => {
    await expect(loggedUserPage.getByText('Hi, John Doe')).toBeVisible();
    await expect(
      loggedUserPage.getByRole('button', { name: 'Logout' }),
    ).toBeVisible();
  });

  test('should not display user greeting and logout button when not authenticated', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByText('Login')).toBeVisible();
    await expect(page.getByText('Hi, John Doe')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeHidden();
  });
});
