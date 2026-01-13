import { CartComponent } from '@_ui/components/cart.component';
import { Locator } from '@playwright/test';

export class NavbarComponent {
  readonly root: Locator;
  readonly homeLink: Locator;
  readonly adminLink: Locator;
  readonly cart: CartComponent;
  readonly userGreeting: Locator;
  readonly loginLink: Locator;
  readonly logoutButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.homeLink = root.getByRole('link', { name: 'Home' });
    this.adminLink = root.getByRole('link', { name: 'Admin' });
    this.cart = new CartComponent(root);
    this.userGreeting = root.locator('span[class="nav-link"]');
    this.loginLink = root.getByRole('link', { name: 'Login' });
    this.logoutButton = root.getByRole('button', { name: 'Logout' });
  }
}
