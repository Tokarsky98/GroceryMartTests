import { expect, test } from '@_src/api/fixtures/merge.fixture';
import { prepareRandomUser } from '@_src/ui/factories/user.factory';
import { LoginPage } from '@_src/ui/pages/login.page';
import {
  invalidCredentials,
  invalidInputs,
} from '@_src/ui/test-data/login.data';
import {
  loginValidationMessages,
  signUpValidationMessages,
  toastMessages,
} from '@_src/ui/test-data/validation-messages.data';

test.describe('Authentication', () => {
  test('should login admin via API', async ({ loggedAdminHomePage }) => {
    const navbar = loggedAdminHomePage.navbar;
    await expect(navbar.userGreeting).toHaveText('Hi, Admin');
    await expect(navbar.logoutButton).toBeVisible();
  });

  test('should login user via API', async ({ loggedUserHomePage }) => {
    const navbar = loggedUserHomePage.navbar;
    await expect(navbar.userGreeting).toHaveText('Hi, John Doe');
    await expect(navbar.logoutButton).toBeVisible();
  });
});

test.describe('Login UI validation', () => {
  test('should display validation messages for empty fields', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginButton.click();

    await expect(loginPage.email.validationMessage!).toHaveText(
      loginValidationMessages.invalidEmail,
    );
    await expect(loginPage.password.validationMessage!).toHaveText(
      loginValidationMessages.shortPassword,
    );
  });

  test('should display validation message for empty email', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.failedLogin(invalidInputs.emptyEmail);

    await expect(loginPage.email.validationMessage!).toHaveText(
      loginValidationMessages.invalidEmail,
    );
  });

  test('should display validation message for empty password', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.failedLogin(invalidInputs.emptyPassword);

    await expect(loginPage.password.validationMessage!).toHaveText(
      loginValidationMessages.shortPassword,
    );
  });

  test('should display validation message for wrong email', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.failedLogin(invalidCredentials.wrongEmail);

    await expect(loginPage.toastMessage).toHaveText(toastMessages.loginFailed);
  });

  test('should display validation message for wrong password', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.failedLogin(invalidCredentials.wrongPassword);

    await expect(loginPage.toastMessage).toHaveText(toastMessages.loginFailed);
  });
});

test.describe('Sign Up UI validation', () => {
  test('should display validation messages for empty fields', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const signUpPage = await loginPage.clickSignUpLink();

    await expect(signUpPage.modal).toBeVisible();
    await expect(signUpPage.header).toBeVisible();

    await signUpPage.signUpButton.click();

    await expect(signUpPage.name.validationMessage!).toHaveText(
      signUpValidationMessages.nameRequired,
    );
    await expect(signUpPage.email.validationMessage!).toHaveText(
      signUpValidationMessages.invalidEmail,
    );
    await expect(signUpPage.password.validationMessage!).toHaveText(
      signUpValidationMessages.shortPassword,
    );
    await expect(signUpPage.termsCheckbox.validationMessage!).toHaveText(
      signUpValidationMessages.termsRequired,
    );
  });

  test('should display validation message when passwords do not match', async ({
    page,
  }) => {
    const signUpUserData = prepareRandomUser();
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const signUpPage = await loginPage.clickSignUpLink();

    await signUpPage.name.field.fill(signUpUserData.name);
    await signUpPage.email.field.fill(signUpUserData.email);
    await signUpPage.password.field.fill(signUpUserData.password);
    await signUpPage.confirmPassword.field.fill(
      signUpUserData.confirmPassword + 'diff',
    );
    await signUpPage.termsCheckbox.field.check();
    await signUpPage.signUpButton.click();

    await expect(signUpPage.confirmPassword.validationMessage!).toHaveText(
      signUpValidationMessages.passwordMismatch,
    );
  });

  test('should display validation message when terms are not accepted', async ({
    page,
  }) => {
    const signUpUserData = prepareRandomUser();
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const signUpPage = await loginPage.clickSignUpLink();

    await signUpPage.name.field.fill(signUpUserData.name);
    await signUpPage.email.field.fill(signUpUserData.email);
    await signUpPage.password.field.fill(signUpUserData.password);
    await signUpPage.confirmPassword.field.fill(signUpUserData.confirmPassword);
    await signUpPage.signUpButton.click();

    await expect(signUpPage.termsCheckbox.validationMessage!).toHaveText(
      signUpValidationMessages.termsRequired,
    );
  });
});
