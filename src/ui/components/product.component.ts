import { Locator } from '@playwright/test';

export class ProductComponent {
  readonly root: Locator;
  readonly image: Locator;
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.image = root.locator('.product-image');
    this.name = root.locator('.product-name');
    this.description = root.locator('.product-description');
    this.price = root.locator('.product-price');
    this.addToCartButton = root.getByRole('button', { name: 'Add to Cart' });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async getName(): Promise<string> {
    return await this.name.innerText();
  }

  async getPrice(): Promise<string> {
    return await this.price.innerText();
  }
}
