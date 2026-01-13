import { Locator } from '@playwright/test';

export class CartItemComponent {
  readonly root: Locator;
  readonly image: Locator;
  readonly name: Locator;
  readonly price: Locator;
  readonly decreaseButton: Locator;
  readonly quantityDisplay: Locator;
  readonly increaseButton: Locator;
  readonly removeButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.image = root.locator('.cart-item-image');
    this.name = root.locator('.cart-item-name');
    this.price = root.locator('.cart-item-price');
    this.decreaseButton = root.getByRole('button', { name: '-' });
    this.quantityDisplay = root.locator('.quantity-controls span');
    this.increaseButton = root.getByRole('button', { name: '+' });
    this.removeButton = root.getByRole('button', { name: '✕' });
  }

  async getName(): Promise<string> {
    return await this.name.innerText();
  }

  async getPrice(): Promise<string> {
    return await this.price.innerText();
  }

  async getQuantity(): Promise<number> {
    const quantityText = await this.quantityDisplay.innerText();
    return parseInt(quantityText, 10);
  }

  async increaseQuantity(): Promise<void> {
    await this.increaseButton.click();
  }

  async decreaseQuantity(): Promise<void> {
    await this.decreaseButton.click();
  }

  async remove(): Promise<void> {
    await this.removeButton.click();
  }
}

export class CartComponent {
  readonly root: Locator;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.cartItems = root.locator('.cart-item');
    this.emptyCartMessage = root.getByText('Your cart is empty');
    this.cartTotal = root.locator('.cart-total');
    this.checkoutButton = root.getByRole('button', {
      name: 'Proceed to Checkout',
    });
  }

  async getCartTotal(): Promise<string> {
    const totalText = await this.cartTotal.innerText();
    return totalText.replace('Total: $', '');
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  getCartItemByProductName(productName: string): CartItemComponent {
    const item = this.cartItems.filter({ hasText: productName });
    return new CartItemComponent(item);
  }
}
