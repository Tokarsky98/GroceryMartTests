import {
  prepareCustomProduct,
  prepareRandomProduct,
} from '@_api/factories/product.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify products create operations', () => {
  test.describe('Authentication and Authorization', () => {
    test('should create product with admin authentication', async ({
      adminProductsRequest,
    }) => {
      const productData = prepareRandomProduct();
      const expectedStatusCode = 201;

      const response = await adminProductsRequest.post(productData);
      const responseBody = await response.json();

      expect(response.status()).toBe(expectedStatusCode);
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.name).toBe(productData.name);
      expect(responseBody.description).toBe(productData.description);
      expect(responseBody.price).toBe(productData.price);
      expect(responseBody.category).toBe(productData.category);
      expect(responseBody.stock).toBe(productData.stock);
      expect(responseBody.image).toBe(productData.image);

      // Cleanup
      await adminProductsRequest.delete(responseBody.id);
    });

    test('should not create product with user authentication', async ({
      userProductsRequest,
    }) => {
      const productData = prepareRandomProduct();
      const expectedStatusCode = 403;

      const response = await userProductsRequest.post(productData);
      expect(response.status()).toBe(expectedStatusCode);
    });

    test('should not create product without authentication', async ({
      productsRequest,
    }) => {
      const productData = prepareRandomProduct();
      const expectedStatusCode = 401;

      const response = await productsRequest.post(productData);
      expect(response.status()).toBe(expectedStatusCode);
    });
  });

  test.describe('Validation - Invalid Data Types', () => {
    // Error found - product is created with string type
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip('should not create product with invalid price type', async ({
      adminProductsRequest,
    }) => {
      const productData = prepareCustomProduct('price', 'invalid-price');
      const expectedStatusCode = 400;

      const response = await adminProductsRequest.post(productData);

      expect(response.status()).toBe(expectedStatusCode);
    });

    // Error found - product is created even with negative price
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip('should not create product with negative price', async ({
      adminProductsRequest,
    }) => {
      const productData = prepareCustomProduct('price', -10);
      const expectedStatusCode = 400;

      const response = await adminProductsRequest.post(productData);

      expect(response.status()).toBe(expectedStatusCode);
    });
  });

  test.describe('Edge Cases', () => {
    // Error found - duplicate products are created
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip('should not create duplicate product with same name', async ({
      adminProductsRequest,
    }) => {
      const productData = prepareRandomProduct();
      const expectedStatusCode = 409;

      // Create first product
      const firstResponse = await adminProductsRequest.post(productData);
      const firstResponseBody = await firstResponse.json();
      expect(firstResponse.status()).toBe(201);

      // Try to create duplicate
      const duplicateResponse = await adminProductsRequest.post(productData);
      expect(duplicateResponse.status()).toBe(expectedStatusCode);

      // Cleanup
      await adminProductsRequest.delete(firstResponseBody.id);
    });

    test('should create product with zero stock', async ({
      adminProductsRequest,
    }) => {
      const productData = prepareCustomProduct('stock', 0);
      const expectedStatusCode = 201;

      const response = await adminProductsRequest.post(productData);
      const responseBody = await response.json();

      expect(response.status()).toBe(expectedStatusCode);
      expect(responseBody.stock).toBe(0);

      // Cleanup
      await adminProductsRequest.delete(responseBody.id);
    });

    test('should create product with special characters in name', async ({
      adminProductsRequest,
    }) => {
      const specialName = 'Product @#$% & *()';
      const productData = prepareCustomProduct('name', specialName);
      const expectedStatusCode = 201;

      const response = await adminProductsRequest.post(productData);
      const responseBody = await response.json();

      expect(response.status()).toBe(expectedStatusCode);
      expect(responseBody.name).toBe(specialName);

      // Cleanup
      await adminProductsRequest.delete(responseBody.id);
    });
  });
});
