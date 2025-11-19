import { LabelWithField } from '../helpers/label-with-input.helper';
import { Locator, Page } from '@playwright/test';

class LoginPage {
  readonly page: Page;
  readonly modal: Locator;
  readonly email: LabelWithField;
  readonly password: LabelWithField;
  readonly loginButton: Locator;
  readonly signUpLink: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('div[class="modal"]');
    this.email = new LabelWithField(
      page.getByLabel('Email'),
      page.getByPlaceholder('Enter your email'),
      page.getByLabel('Email').locator('..').locator('.error-message'),
    );
    this.password = new LabelWithField(
      page.getByLabel('Password'),
      page.getByPlaceholder('Enter your password'),
      page.getByLabel('Password').locator('..').locator('.error-message'),
    );
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.signUpLink = page.getByRole('link', { name: 'Sign Up' });
    this.forgotPasswordLink = page.getByRole('link', {
      name: 'Forgot Password?',
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('/#login');
  }
}
