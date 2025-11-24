import { expect, test } from '../../../src/api/fixtures/merge.fixture';
import { prepareRandomUser } from '../../../src/ui/factories/user.factory';
import { SignUpModel } from '../../../src/ui/models/sign-up.model';
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
  let signUpUserData: SignUpModel;

  test.beforeEach(() => {
    signUpUserData = prepareRandomUser();
  });

  test('should create new user and login with credentials', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const signUpPage = await loginPage.clickSignUpLink();

    const homePage = await signUpPage.signUp(signUpUserData);

    await expect
      .soft(signUpPage.toastMessage)
      .toHaveText(toastMessages.signUpSuccess);
    await expect(homePage.userGreeting).toHaveText(
      `Hi, ${signUpUserData.name}`,
    );
    await expect(homePage.logoutButton).toBeVisible();

    await homePage.logoutButton.click();

    await expect(homePage.userGreeting).toBeHidden();
    await expect(homePage.loginLink).toBeVisible();
  });
});
