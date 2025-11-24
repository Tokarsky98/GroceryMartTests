import { LabelWithField } from '../helpers/label-with-field.helper';
import { LoginModel } from '../models/login.model';
import { SignUpModel } from '../models/sign-up.model';
import { HomePage } from './home.page';
import { Locator, Page } from '@playwright/test';

class SignUpPage {
  readonly page: Page;
  readonly modal: Locator;
  readonly header: Locator;
  readonly name: LabelWithField;
  readonly email: LabelWithField;
  readonly password: LabelWithField;
  readonly confirmPassword: LabelWithField;
  readonly termsCheckbox: LabelWithField;
  readonly signUpButton: Locator;
  readonly loginLink: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('div[class="modal"]');
    this.header = page.getByRole('heading', { level: 2, name: 'Sign Up' });
    this.name = new LabelWithField(
      page.getByLabel('Name'),
      page.getByPlaceholder('Enter your name'),
      page
        .locator('.form-group', { hasText: 'Name' })
        .locator('.error-message'),
    );
    this.email = new LabelWithField(
      page.getByLabel('Email'),
      page.getByPlaceholder('Enter your email'),
      page
        .locator('.form-group', { hasText: 'Email' })
        .locator('.error-message'),
    );
    this.password = new LabelWithField(
      page.getByLabel('Password'),
      page.getByPlaceholder('Enter your password'),
      page
        .locator('.form-group', { hasText: 'Password' })
        .locator('.error-message'),
    );
    this.confirmPassword = new LabelWithField(
      page.getByLabel('Confirm Password'),
      page.getByPlaceholder('Confirm your password'),
      page
        .locator('.form-group', { hasText: 'Confirm Password' })
        .locator('.error-message'),
    );
    this.termsCheckbox = new LabelWithField(
      page.getByLabel('I accept the terms and conditions'),
      page.getByRole('checkbox'),
      page
        .locator('.form-group', {
          hasText: 'I accept the terms and conditions',
        })
        .locator('.error-message'),
    );
    this.signUpButton = page.getByRole('button', { name: 'Sign Up' });
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.toastMessage = page.locator('.toast');
  }

  async signUp(signUpUserData: SignUpModel): Promise<HomePage> {
    await this.name.field.fill(signUpUserData.name);
    await this.email.field.fill(signUpUserData.email);
    await this.password.field.fill(signUpUserData.password);
    await this.confirmPassword.field.fill(signUpUserData.confirmPassword);
    await this.termsCheckbox.field.check();
    await this.signUpButton.click();
    return new HomePage(this.page);
  }
}

export class LoginPage {
  readonly page: Page;
  readonly modal: Locator;
  readonly header: Locator;
  readonly email: LabelWithField;
  readonly password: LabelWithField;
  readonly loginButton: Locator;
  readonly signUpLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('div[class="modal"]');
    this.header = page.getByRole('heading', { level: 2, name: 'Login' });
    this.email = new LabelWithField(
      page.getByLabel('Email'),
      page.getByPlaceholder('Enter your email'),
      page
        .locator('.form-group', { hasText: 'Email' })
        .locator('.error-message'),
    );
    this.password = new LabelWithField(
      page.getByLabel('Password'),
      page.getByPlaceholder('Enter your password'),
      page
        .locator('.form-group', { hasText: 'Password' })
        .locator('.error-message'),
    );
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.signUpLink = page.getByRole('link', { name: 'Sign Up' });
    this.forgotPasswordLink = page.getByRole('link', {
      name: 'Forgot Password?',
    });
    this.toastMessage = page.locator('.toast').first();
  }

  async login(loginData: LoginModel): Promise<HomePage> {
    await this.email.field.fill(loginData.email);
    await this.password.field.fill(loginData.password);
    await this.loginButton.click();
    return new HomePage(this.page);
  }

  async failedLogin(loginData: LoginModel): Promise<void> {
    await this.email.field.fill(loginData.email);
    await this.password.field.fill(loginData.password);
    await this.loginButton.click();
  }

  async clickSignUpLink(): Promise<SignUpPage> {
    await this.signUpLink.click();
    return new SignUpPage(this.page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/#login');
  }
}
