import { NavbarComponent } from '@_ui/components/navbar.component';
import { ProductComponent } from '@_ui/components/product.component';
import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly navbar: NavbarComponent;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly categoryFilter: Locator;
  readonly productCards: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = new NavbarComponent(page.getByRole('navigation'));
    this.searchInput = page.locator('input.search-input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.categoryFilter = page.locator('select.filter-dropdown');
    this.productCards = page.locator('div.product-card');
    this.toastMessage = page.locator('div.toast.success');
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilter.selectOption(category);
  }

  getProductByName(name: string): ProductComponent {
    const product = this.productCards.filter({ hasText: name });
    return new ProductComponent(product);
  }

  async searchProduct(name: string): Promise<void> {
    await this.searchInput.fill(name);
    await this.searchButton.click();
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
