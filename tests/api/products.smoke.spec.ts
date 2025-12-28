import { expect, test } from 'src/merge.fixture';

test.describe('Products API endpoint', () => {
  test('get products returns status code 200', async ({ productsRequest }) => {
    const expectedResponseCode = 200;
    const response = await productsRequest.get();

    expect(response.status()).toBe(expectedResponseCode);
  });

  test('get products should return at least one product', async ({
    productsRequest,
  }) => {
    const expectedMinProductCount = 1;
    const response = await productsRequest.get();
    const responseJson = await response.json();

    expect(responseJson.products.length).toBeGreaterThanOrEqual(
      expectedMinProductCount,
    );
  });

  // It worked, to be continued ...

  //   test('post product with admin authentication should return 201', async ({
  //     adminProductsRequest,
  //   }) => {
  //     const expectedStatusCode = 201;

  //     const response = await adminProductsRequest.post({
  //       name: 'Test Product',
  //       description: 'This is a test product',
  //       price: 9.99,
  //       category: 'test-category',
  //       image: 'http://example.com/image.jpg',
  //       stock: 100,
  //     });

  //     expect(response.status()).toBe(expectedStatusCode);
  //   });
});
