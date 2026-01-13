import { expect, test } from '@_src/merge.fixture';
import { HomePage } from '@_ui/pages/home.page';
import { categories, products } from '@_ui/test-data/products.data';

test.describe('Home Page - Products', () => {
  test('should add product to cart @ui @guest @e2e', async ({ page }) => {
    const homePage = new HomePage(page);
    const navbar = homePage.navbar;
    await homePage.goto();

    const pastaProduct = homePage.getProductByName(products.pasta);
    await pastaProduct.addToCart();

    await expect(homePage.toastMessage).toContainText(
      `${await pastaProduct.getName()} added to cart!`,
    );
    await expect(navbar.cartIconBadge).toHaveText('1');
  });

  test('should search for products @ui @guest @e2e', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.productCards).toHaveCount(12);

    await homePage.searchProduct(products.pasta);

    const pastaProduct = homePage.getProductByName(products.pasta);
    await expect(pastaProduct.name).toBeVisible();
    await expect(homePage.productCards).toHaveCount(1);
  });

  test('should filter product by category @ui @guest @e2e', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.productCards).toHaveCount(12);

    await homePage.filterByCategory(categories.seafood);

    const salmonProduct = homePage.getProductByName(products.salmonFillet);
    await expect(salmonProduct.name).toBeVisible();
    await expect(homePage.productCards).toHaveCount(1);
  });

  test('should add multiple products to cart @ui @guest @e2e', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const navbar = homePage.navbar;
    await homePage.goto();

    const productsToAdd = [
      products.pasta,
      products.salmonFillet,
      products.chickenBreast,
    ];

    // Add first product
    const firstProduct = homePage.getProductByName(productsToAdd[0]);
    await firstProduct.addToCart();
    await expect(homePage.toastMessage).toContainText(
      `${await firstProduct.getName()} added to cart!`,
    );
    await expect(navbar.cartIconBadge).toHaveText('1');

    // Add second product
    const secondProduct = homePage.getProductByName(productsToAdd[1]);
    await secondProduct.addToCart();
    await expect(homePage.toastMessage).toContainText(
      `${await secondProduct.getName()} added to cart!`,
    );
    await expect(navbar.cartIconBadge).toHaveText('2');

    // Add third product
    const thirdProduct = homePage.getProductByName(productsToAdd[2]);
    await thirdProduct.addToCart();
    await expect(homePage.toastMessage).toContainText(
      `${await thirdProduct.getName()} added to cart!`,
    );
    await expect(navbar.cartIconBadge).toHaveText('3');
  });

  test('should search and then filter products @ui @guest @e2e', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.searchProduct('Fresh');
    await expect(homePage.productCards).toHaveCount(3);

    await homePage.filterByCategory(categories.vegetables);
    await expect(homePage.productCards).toHaveCount(1);

    const tomatoProduct = homePage.getProductByName(products.freshTomatoes);
    await expect(tomatoProduct.name).toBeVisible();
  });
});

test.describe('Home Page - Negative Tests', () => {
  test('should show no results when searching for non-existent product @ui @guest @e2e', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.productCards).toHaveCount(12);

    await homePage.searchProduct('NonExistentProduct');
    await expect(homePage.productCards).toHaveCount(0);
  });

  test('should handle empty search input @ui @guest @e2e', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.productCards).toHaveCount(12);

    await homePage.searchProduct('');
    await expect(homePage.productCards).toHaveCount(12);
  });

  test('should show no results for invalid category filter combination @ui @guest @e2e', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.searchProduct(products.pasta);
    await expect(homePage.productCards).toHaveCount(1);

    // Apply a category filter that doesn't match the search result
    await homePage.filterByCategory(categories.seafood);
    await expect(homePage.productCards).toHaveCount(0);
  });

  test('should show all products when clearing filters @ui @guest @e2e', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.productCards).toHaveCount(12);

    await homePage.filterByCategory(categories.seafood);
    await expect(homePage.productCards).toHaveCount(1);

    await homePage.filterByCategory(categories.all);
    await expect(homePage.productCards).toHaveCount(12);
  });
});
