import { expect, test } from '@_src/merge.fixture';

test.describe('Verify products DELETE operations', () => {
  test('should delete product with admin authentication', async ({
    products,
    adminProductsRequest,
  }) => {
    const expectedStatusCode = 200;
    const expectedDeletedProductStatusCode = 404;
    const productId = products[0].id;

    const responseProductDelete = await adminProductsRequest.delete(productId);

    expect(responseProductDelete.status()).toBe(expectedStatusCode);

    const responseGetDeleted = await adminProductsRequest.getOne(productId);
    expect(responseGetDeleted.status()).toBe(expectedDeletedProductStatusCode);
  });

  test('should not delete product with user authentication', async ({
    products,
    userProductsRequest,
    adminProductsRequest,
  }) => {
    const expectedStatusCode = 403;
    const expectedNotDeletedProductStatusCode = 200;
    const productId = products[0].id;
    const responseProductDelete = await userProductsRequest.delete(productId);

    expect(responseProductDelete.status()).toBe(expectedStatusCode);

    const responseGetNotDeleted = await adminProductsRequest.getOne(productId);
    expect(responseGetNotDeleted.status()).toBe(
      expectedNotDeletedProductStatusCode,
    );
  });

  test('should not delete product without authentication', async ({
    products,
    productsRequest,
    adminProductsRequest,
  }) => {
    const expectedStatusCode = 401;
    const expectedNotDeletedProductStatusCode = 200;
    const productId = products[0].id;
    const responseProductDelete = await productsRequest.delete(productId);

    expect(responseProductDelete.status()).toBe(expectedStatusCode);

    const responseGetNotDeleted = await adminProductsRequest.getOne(productId);
    expect(responseGetNotDeleted.status()).toBe(
      expectedNotDeletedProductStatusCode,
    );
  });
});
