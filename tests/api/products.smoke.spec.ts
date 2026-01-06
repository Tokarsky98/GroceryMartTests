import { expect, test } from '@_src/merge.fixture';

test.describe('Products API endpoint', () => {
  test('get products should return status code 200 @api @anonymous @smoke', async ({
    productsRequest,
  }) => {
    const response = await productsRequest.get();

    expect(response.status()).toBe(200);
  });

  test('get products should return at least one product @api @anonymous @smoke', async ({
    productsRequest,
  }) => {
    const expectedMinProductCount = 1;
    const response = await productsRequest.get();
    const responseJson = await response.json();

    expect(responseJson.products.length).toBeGreaterThanOrEqual(
      expectedMinProductCount,
    );
  });

  test('get products should return product object @api @anonymous @smoke', async ({
    productsRequest,
  }) => {
    const expectedRequiredFields = [
      'id',
      'name',
      'description',
      'price',
      'category',
      'image',
      'stock',
    ];

    const response = await productsRequest.get();
    const responseJson = await response.json();
    const product = responseJson.products[0];

    expect.soft(product.id).toBeDefined();

    expectedRequiredFields.forEach((key) => {
      expect.soft(product).toHaveProperty(key);
    });
  });
});
