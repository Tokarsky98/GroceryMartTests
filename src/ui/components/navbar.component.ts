import { CartComponent } from './cart.component';
import { Locator } from '@playwright/test';

export class NavbarComponent {
  readonly root: Locator;
  readonly homeLink: Locator;
  readonly adminLink: Locator;
  readonly cartIcon: Locator;
  readonly cartIconBadge: Locator;
  readonly userGreeting: Locator;
  readonly loginLink: Locator;
  readonly logoutButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.homeLink = root.getByRole('link', { name: 'Home' });
    this.adminLink = root.getByRole('link', { name: 'Admin' });
    this.cartIcon = root.locator('.cart-badge');
    this.cartIconBadge = this.cartIcon.locator('.badge');
    this.userGreeting = root.locator('span[class="nav-link"]');
    this.loginLink = root.getByRole('link', { name: 'Login' });
    this.logoutButton = root.getByRole('button', { name: 'Logout' });
  }

  async openCart(): Promise<CartComponent> {
    await this.cartIcon.click();
    return new CartComponent(this.root.locator('div[class="cart-dropdown"]'));
  }
}
