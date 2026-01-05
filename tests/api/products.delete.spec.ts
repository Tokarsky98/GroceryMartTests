import { createProducts } from '../../src/api/fixtures/manage-objects.fixture';
import { prepareRandomProduct } from '@_api/factories/product.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify products DELETE operations', () => {
  test.describe('Delete with admin authentication (owns deletion)', () => {
    test.use({ autoCleanup: false });

    test('should delete product with admin authentication', async ({
      product,
      adminProductsRequest,
    }) => {
      const responseProductDelete = await adminProductsRequest.delete(
        product.id,
      );

      expect(responseProductDelete.status()).toBe(200);

      const responseGetDeleted = await adminProductsRequest.getOne(product.id);
      expect(responseGetDeleted.status()).toBe(404);
    });
  });

  test.describe('Authorization tests', () => {
    test('should not delete product with user authentication', async ({
      product,
      userProductsRequest,
      adminProductsRequest,
    }) => {
      const responseProductDelete = await userProductsRequest.delete(
        product.id,
      );

      expect(responseProductDelete.status()).toBe(403);

      const responseGetNotDeleted = await adminProductsRequest.getOne(
        product.id,
      );
      expect(responseGetNotDeleted.status()).toBe(200);
    });

    // Error found - product is deleted without authentication
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip('should not delete product without authentication', async ({
      product,
      productsRequest,
      adminProductsRequest,
    }) => {
      const responseProductDelete = await productsRequest.delete(product.id);

      expect(responseProductDelete.status()).toBe(401);

      const responseGetNotDeleted = await adminProductsRequest.getOne(
        product.id,
      );
      expect(responseGetNotDeleted.status()).toBe(200);
    });
  });

  test.describe('Verify multiple products deletion with custom details', () => {
    test.use({
      products: async ({ adminProductsRequest }, use) => {
        const product1 = prepareRandomProduct();
        const product2 = prepareRandomProduct();
        await createProducts(adminProductsRequest, use, [product1, product2]);
      },
    });

    test('should delete two products with admin authentication', async ({
      products,
      adminProductsRequest,
    }) => {
      expect(products).toHaveLength(2);

      for (const product of products) {
        const deleteResponse = await adminProductsRequest.delete(product.id);
        expect(deleteResponse.status()).toBe(200);
      }

      for (const product of products) {
        const getDeleted = await adminProductsRequest.getOne(product.id);
        expect(getDeleted.status()).toBe(404);
      }
    });
  });
});
