import { prepareRandomProduct } from '@_api/factories/product.factory';
import { products } from '@_api/fixtures/manage-objects.fixture';
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

  // Error found - product is deleted without authentication
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip('should not delete product without authentication', async ({
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

  test.describe('Verify multiple products deletion with custom details', () => {
    test.use({
      products: async ({ adminProductsRequest }, use) => {
        const product1 = prepareRandomProduct();
        const product2 = prepareRandomProduct();
        await products(adminProductsRequest, use, [product1, product2]);
      },
    });

    test('should delete two products with admin authentication', async ({
      products,
      adminProductsRequest,
    }) => {
      const expectedStatusCode = 200;
      const expectedDeletedStatusCode = 404;

      expect(products).toHaveLength(2);

      for (const product of products) {
        const deleteResponse = await adminProductsRequest.delete(product.id);
        expect(deleteResponse.status()).toBe(expectedStatusCode);
      }

      for (const product of products) {
        const getDeleted = await adminProductsRequest.getOne(product.id);
        expect(getDeleted.status()).toBe(expectedDeletedStatusCode);
      }
    });
  });
});
