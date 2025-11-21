import { expect, test } from '../../../src/api/fixtures/merge.fixture';
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

// Create factory for such users and implement cleanup after test run (maybe)

// test.describe('User Registration and Login Flow', () => {
//   test('should create new user and login with credentials', async ({
//     page,
//   }) => {
//     const loginPage = new LoginPage(page);
//     await loginPage.goto();

//     const signUpPage = await loginPage.clickSignUpLink();

//     await signUpPage.name.field.fill(signUpData.name);
//     await signUpPage.email.field.fill(signUpData.email);
//     await signUpPage.password.field.fill(signUpData.password);
//     await signUpPage.confirmPassword.field.fill(signUpData.confirmPassword);
//     await signUpPage.termsCheckbox.field.check();

//     const homePage = await signUpPage.clickSignUpButton();

//     await expect(signUpPage.toastMessage).toHaveText(
//       toastMessages.signUpSuccess,
//     );
//     await expect(homePage.userGreeting).toHaveText(`Hi, ${signUpData.name}`);
//     await expect(homePage.logoutButton).toBeVisible();

//     await homePage.logoutButton.click();

//     await expect(homePage.userGreeting).toBeHidden();
//     await expect(homePage.loginLink).toBeVisible();
//   });
// });
