import {
  prepareCustomProduct,
  prepareRandomProduct,
} from '@_api/factories/product.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify products create operations', () => {
  let createdProductIds: string[] = [];

  // Cleanup all created products, even if test failed
  test.afterEach(async ({ adminProductsRequest }) => {
    for (const productId of createdProductIds) {
      await expect(await adminProductsRequest.delete(productId)).toBeOK();
    }
    createdProductIds = [];
  });

  test.describe('Authentication and Authorization', () => {
    test('should create product with admin authentication @api @admin', async ({
      adminProductsRequest,
    }) => {
      const productData = prepareRandomProduct();

      const response = await adminProductsRequest.post(productData);
      const responseBody = await response.json();

      // Track for cleanup
      createdProductIds.push(responseBody.id);

      expect(response.status()).toBe(201);
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.name).toBe(productData.name);
      expect(responseBody.description).toBe(productData.description);
      expect(responseBody.price).toBe(productData.price);
      expect(responseBody.category).toBe(productData.category);
      expect(responseBody.stock).toBe(productData.stock);
      expect(responseBody.image).toBe(productData.image);
    });

    test('should not create product with user authentication @api @user', async ({
      userProductsRequest,
    }) => {
      const productData = prepareRandomProduct();

      const response = await userProductsRequest.post(productData);
      expect(response.status()).toBe(403);
    });

    test('should not create product without authentication @api @anonymous', async ({
      productsRequest,
    }) => {
      const productData = prepareRandomProduct();

      const response = await productsRequest.post(productData);
      expect(response.status()).toBe(401);
    });
  });

  test.describe('Validation - Invalid Data Types', () => {
    // Error found - product is created with string type
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip('should not create product with invalid price type @api @admin', async ({
      adminProductsRequest,
    }) => {
      const productData = prepareCustomProduct('price', 'invalid-price');

      const response = await adminProductsRequest.post(productData);

      expect(response.status()).toBe(400);
    });

    // Error found - product is created even with negative price
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip('should not create product with negative price @api @admin', async ({
      adminProductsRequest,
    }) => {
      const productData = prepareCustomProduct('price', -10);

      const response = await adminProductsRequest.post(productData);

      expect(response.status()).toBe(400);
    });
  });

  test.describe('Edge Cases', () => {
    // Error found - duplicate products are created
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip('should not create duplicate product with same name @api @admin', async ({
      adminProductsRequest,
    }) => {
      const productData = prepareRandomProduct();

      // Create first product
      const firstResponse = await adminProductsRequest.post(productData);
      const firstResponseBody = await firstResponse.json();
      expect(firstResponse.status()).toBe(201);

      // Track for cleanup
      createdProductIds.push(firstResponseBody.id);

      // Try to create duplicate
      const duplicateResponse = await adminProductsRequest.post(productData);
      expect(duplicateResponse.status()).toBe(409);
    });

    test('should create product with zero stock @api @admin', async ({
      adminProductsRequest,
    }) => {
      const productData = prepareCustomProduct('stock', 0);

      const response = await adminProductsRequest.post(productData);
      const responseBody = await response.json();

      // Track for cleanup
      createdProductIds.push(responseBody.id);

      expect(response.status()).toBe(201);
      expect(responseBody.stock).toBe(0);
    });

    test('should create product with special characters in name @api @admin', async ({
      adminProductsRequest,
    }) => {
      const specialName = 'Product @#$% & *()';
      const productData = prepareCustomProduct('name', specialName);

      const response = await adminProductsRequest.post(productData);
      const responseBody = await response.json();

      // Track for cleanup
      createdProductIds.push(responseBody.id);

      expect(response.status()).toBe(201);
      expect(responseBody.name).toBe(specialName);
    });
  });
});
