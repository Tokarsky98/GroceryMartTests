import { ProductComponent } from '../components/product.component';
import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly navbar: Locator;
  readonly userGreeting: Locator;
  readonly loginLink: Locator;
  readonly logoutButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly categoryFilter: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.getByRole('navigation');
    this.userGreeting = page.locator('span[class="nav-link"]');
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.searchInput = page.locator('input.search-input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.categoryFilter = page.locator('select.category-filter');
    this.productCards = page.locator('div.product-card');
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilter.selectOption(category);
  }

  getProductsCount(): Promise<number> {
    return this.productCards.count();
  }

  getProductByName(name: string): ProductComponent {
    const product = this.productCards.filter({ hasText: name });
    return new ProductComponent(product);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
