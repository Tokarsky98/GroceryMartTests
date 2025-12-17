import { HomePage } from '@_ui/pages/home.page';
import { products } from '@_ui/test-data/products.data';
import { expect, test } from '@playwright/test';

test.describe('Home Page - Products', () => {
  test('should get product by name and validate its details', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const pastaProduct = homePage.getProductByName(products.pasta);

    // Validate product name
    expect(await pastaProduct.getName()).toBe(products.pasta);

    // Validate other elements are visible
    await expect(pastaProduct.image).toBeVisible();
    await expect(pastaProduct.description).toBeVisible();
    await expect(pastaProduct.price).toBeVisible();
    await expect(pastaProduct.addToCartButton).toBeVisible();
  });

  test('should count all products on the page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.productCards).toHaveCount(12);
  });

  test('should get multiple products by name', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const productNames = [
      products.pasta,
      products.salmonFillet,
      products.chickenBreast,
    ];

    for (const productName of productNames) {
      const product = homePage.getProductByName(productName);

      await expect(product.name).toBeVisible();
      const name = await product.getName();
      expect(name).toBe(productName);
    }
  });
});
