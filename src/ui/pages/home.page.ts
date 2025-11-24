import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly navbar: Locator;
  readonly userGreeting: Locator;
  readonly loginLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.getByRole('navigation');
    this.userGreeting = page.locator('span[class="nav-link"]');
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
