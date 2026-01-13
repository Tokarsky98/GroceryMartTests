import { expect, test } from '@_src/merge.fixture';
import { products } from '@_ui/test-data/products.data';

test.describe('Cart - Checkout Access by Role', () => {
  const checkoutTestCases = [
    {
      role: 'guest' as const,
      expectedUrl: /#login/,
      description: 'should redirect to login',
    },
    {
      role: 'user' as const,
      expectedUrl: /#checkout/,
      description: 'should proceed to checkout',
    },
    {
      role: 'admin' as const,
      expectedUrl: /#checkout/,
      description: 'should proceed to checkout',
    },
  ];

  for (const { role, expectedUrl, description } of checkoutTestCases) {
    test.describe(`${role} checkout access`, () => {
      test.use({ role });

      test(`${description} when ${role} clicks checkout button @ui @${role} @integration`, async ({
        homePage,
      }) => {
        // Add product to cart
        const pastaProduct = homePage.getProductByName(products.pasta);
        await pastaProduct.addToCart();

        // Open cart and click checkout
        const cart = await homePage.navbar.openCart();
        await cart.clickCheckout();

        // Verify expected navigation
        await expect(homePage.page).toHaveURL(expectedUrl);
      });
    });
  }
});

test.describe('Cart - Guest', () => {
  test('should display cart dropdown when clicking cart badge @ui @guest @integration', async ({
    homePage,
  }) => {
    const pastaProduct = homePage.getProductByName(products.pasta);
    await pastaProduct.addToCart();

    const cart = await homePage.navbar.openCart();
    await expect(cart.root).toBeVisible();
  });

  test('should display empty cart message when cart is empty @ui @guest @integration', async ({
    homePage,
  }) => {
    const cart = await homePage.navbar.openCart();
    await expect(cart.emptyCartMessage).toBeVisible();
  });

  test('should add single product to cart @ui @guest @integration', async ({
    homePage,
  }) => {
    const pastaProduct = homePage.getProductByName(products.pasta);
    await pastaProduct.addToCart();

    await expect(homePage.navbar.cartIconBadge).toHaveText('1');

    const cart = await homePage.navbar.openCart();
    const cartItem = cart.getCartItemByProductName(products.pasta);

    await expect(cartItem.root).toBeVisible();
    await expect(cartItem.name).toHaveText(products.pasta);
  });

  test('should add multiple different products to cart and verify badge count @ui @guest @integration', async ({
    homePage,
  }) => {
    const pastaProduct = homePage.getProductByName(products.pasta);
    await pastaProduct.addToCart();

    const salmonProduct = homePage.getProductByName(products.salmonFillet);
    await salmonProduct.addToCart();

    const chickenProduct = homePage.getProductByName(products.chickenBreast);
    await chickenProduct.addToCart();

    await expect(homePage.navbar.cartIconBadge).toHaveText('3');
  });

  test('should remove product from cart using X button @ui @guest @integration', async ({
    homePage,
  }) => {
    const pastaProduct = homePage.getProductByName(products.pasta);
    await pastaProduct.addToCart();

    const cart = await homePage.navbar.openCart();
    const cartItem = cart.getCartItemByProductName(products.pasta);
    await cartItem.remove();

    await expect(cartItem.root).toBeHidden();
    await expect(cart.emptyCartMessage).toBeVisible();
  });

  test('should not persist cart items after page reload for guest @ui @guest @integration', async ({
    homePage,
  }) => {
    const pastaProduct = homePage.getProductByName(products.pasta);
    await pastaProduct.addToCart();

    const salmonProduct = homePage.getProductByName(products.salmonFillet);
    await salmonProduct.addToCart();

    await expect(homePage.navbar.cartIconBadge).toHaveText('2');

    await homePage.page.reload();

    const cart = await homePage.navbar.openCart();
    await expect(cart.emptyCartMessage).toBeVisible();
  });
});
