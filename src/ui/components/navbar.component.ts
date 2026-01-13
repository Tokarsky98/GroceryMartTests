import { CartComponent } from './cart.component';
import { Locator } from '@playwright/test';

export class NavbarComponent {
  readonly root: Locator;
  readonly homeLink: Locator;
  readonly adminLink: Locator;
  readonly cartBadge: Locator;
  readonly userGreeting: Locator;
  readonly loginLink: Locator;
  readonly logoutButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.homeLink = root.getByRole('link', { name: 'Home' });
    this.adminLink = root.getByRole('link', { name: 'Admin' });
    this.cartBadge = root.locator('.cart-badge');
    this.userGreeting = root.locator('span[class="nav-link"]');
    this.loginLink = root.getByRole('link', { name: 'Login' });
    this.logoutButton = root.getByRole('button', { name: 'Logout' });
  }

  async openCart(): Promise<CartComponent> {
    await this.cartBadge.click();
    return new CartComponent(this.root.locator('div[class="cart-dropdown"]'));
  }

  async getCartBadgeCount(): Promise<string> {
    const badgeText = await this.cartBadge.locator('.badge').innerText();
    return badgeText;
  }
}
