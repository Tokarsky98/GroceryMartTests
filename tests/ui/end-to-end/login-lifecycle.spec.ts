import { expect, test } from '../../../src/api/fixtures/merge.fixture';
import { prepareRandomUser } from '../../../src/ui/factories/user.factory';
import { HomePage } from '../../../src/ui/pages/home.page';
import { LoginPage } from '../../../src/ui/pages/login.page';
import { defaultUsers } from '../../../src/ui/test-data/login.data';
import { toastMessages } from '../../../src/ui/test-data/validation-messages.data';

test.describe('Authentication', () => {
  test('should login admin via form with credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.modal).toBeVisible();
    await expect(loginPage.header).toBeVisible();

    const homePage = await loginPage.login(defaultUsers.admin);

    await expect(loginPage.toastMessage).toHaveText(toastMessages.loginSuccess);
    await expect(homePage.userGreeting).toHaveText('Hi, Admin');
    await expect(homePage.logoutButton).toBeVisible();
  });

  test('should login user via form with credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.modal).toBeVisible();
    await expect(loginPage.header).toBeVisible();

    const homePage = await loginPage.login(defaultUsers.user);

    await expect(loginPage.toastMessage).toHaveText(toastMessages.loginSuccess);
    await expect(homePage.userGreeting).toHaveText('Hi, John Doe');
    await expect(homePage.logoutButton).toBeVisible();
  });

  test('should not display user greeting when not authenticated', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.userGreeting).toBeHidden();
    await expect(homePage.logoutButton).toBeHidden();
  });
});

test.describe('User Registration and Login Flow', () => {
  test('should register new user and login with credentials', async ({
    page,
  }) => {
    const signUpUserData = prepareRandomUser();
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const signUpPage = await loginPage.clickSignUpLink();
    const homePage = await signUpPage.signUp(signUpUserData);

    await expect(signUpPage.toastMessage).toHaveText(
      toastMessages.signUpSuccess,
    );
    await expect(homePage.navbar).toBeVisible();

    await homePage.loginLink.click();
    await loginPage.login({
      email: signUpUserData.email,
      password: signUpUserData.password,
    });

    await expect(loginPage.toastMessage).toHaveText(toastMessages.loginSuccess);
    await expect(homePage.userGreeting).toHaveText(
      `Hi, ${signUpUserData.name}`,
    );
  });
});
