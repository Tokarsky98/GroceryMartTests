import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly navbar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.getByRole('navigation');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
