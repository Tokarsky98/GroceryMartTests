import { prepareRandomUser } from '@_ui/factories/user.factory';
import { HomePage } from '@_ui/pages/home.page';
import { LoginPage } from '@_ui/pages/login.page';
import { defaultUsers } from '@_ui/test-data/login.data';
import { toastMessages } from '@_ui/test-data/validation-messages.data';
import { expect, test } from 'src/merge.fixture';

test.describe('Authentication', () => {
  test('should login admin via form with credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.modal).toBeVisible();
    await expect(loginPage.header).toBeVisible();

    const homePage = await loginPage.login(defaultUsers.admin);
    const navbar = homePage.navbar;

    await expect(loginPage.toastMessage).toHaveText(toastMessages.loginSuccess);
    await expect(navbar.userGreeting).toHaveText('Hi, Admin');
    await expect(navbar.logoutButton).toBeVisible();
  });

  test('should login user via form with credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.modal).toBeVisible();
    await expect(loginPage.header).toBeVisible();

    const homePage = await loginPage.login(defaultUsers.user);
    const navbar = homePage.navbar;

    await expect(loginPage.toastMessage).toHaveText(toastMessages.loginSuccess);
    await expect(navbar.userGreeting).toHaveText('Hi, John Doe');
    await expect(navbar.logoutButton).toBeVisible();
  });

  test('should not display user greeting when not authenticated', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const navbar = homePage.navbar;
    await homePage.goto();

    await expect(navbar.userGreeting).toBeHidden();
    await expect(navbar.logoutButton).toBeHidden();
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
    const navbar = homePage.navbar;

    await expect(signUpPage.toastMessage).toHaveText(
      toastMessages.signUpSuccess,
    );

    await navbar.loginLink.click();
    await loginPage.login({
      email: signUpUserData.email,
      password: signUpUserData.password,
    });

    await expect(loginPage.toastMessage).toHaveText(toastMessages.loginSuccess);
    await expect(navbar.userGreeting).toHaveText(`Hi, ${signUpUserData.name}`);
  });
});
