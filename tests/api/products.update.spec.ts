import { prepareRandomProduct } from '@_api/factories/product.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify products PUT operations', () => {
  test('should update product with admin authentication', async ({
    product,
    adminProductsRequest,
  }) => {
    const updatedProductData = prepareRandomProduct();

    const response = await adminProductsRequest.put(
      updatedProductData,
      product.id,
    );
    const responseBody = await response.json();

    expect(response.status()).toBe(200);
    expect(responseBody.id).toBe(product.id);
    expect(responseBody.name).toBe(updatedProductData.name);
    expect(responseBody.description).toBe(updatedProductData.description);
    expect(responseBody.price).toBe(updatedProductData.price);
    expect(responseBody.category).toBe(updatedProductData.category);
    expect(responseBody.stock).toBe(updatedProductData.stock);
    expect(responseBody.image).toBe(updatedProductData.image);

    const getUpdatedResponse = await adminProductsRequest.getOne(product.id);
    const getUpdatedBody = await getUpdatedResponse.json();

    expect(getUpdatedResponse.status()).toBe(200);
    expect(getUpdatedBody.name).toBe(updatedProductData.name);
    expect(getUpdatedBody.description).toBe(updatedProductData.description);
  });

  test('should not update product with user authentication', async ({
    product,
    userProductsRequest,
  }) => {
    const updatedProductData = prepareRandomProduct();

    const response = await userProductsRequest.put(
      updatedProductData,
      product.id,
    );

    expect(response.status()).toBe(403);

    const getNotUpdatedResponse = await userProductsRequest.getOne(product.id);
    const getNotUpdatedBody = await getNotUpdatedResponse.json();

    expect(getNotUpdatedResponse.status()).toBe(200);
    expect(getNotUpdatedBody.name).toBe(product.name);
  });

  test('should not update product without authentication', async ({
    product,
    productsRequest,
  }) => {
    const updatedProductData = prepareRandomProduct();

    const response = await productsRequest.put(updatedProductData, product.id);
    expect(response.status()).toBe(401);

    const getNotUpdatedResponse = await productsRequest.getOne(product.id);
    expect(getNotUpdatedResponse.status()).toBe(200);

    const getNotUpdatedBody = await getNotUpdatedResponse.json();
    expect(getNotUpdatedBody.name).toBe(product.name);
  });

  test('should not update non-existent product', async ({
    adminProductsRequest,
  }) => {
    const nonExistentProductId = 'non-existent-id-12345';
    const updatedProductData = prepareRandomProduct();

    const response = await adminProductsRequest.put(
      updatedProductData,
      nonExistentProductId,
    );

    expect(response.status()).toBe(404);
  });
});
