import { prepareRandomProduct } from '../factories/product.factory';
import { ProductsModel } from '@_api/models/products.model';
import { ProductsRequest } from '@_api/requests/products.request';
import { ProductResponseModel } from '@_src/api/models/products-response.model';
import { expect } from '@playwright/test';

/**
 * Creates one or more products for test usage and cleanup afterward
 *
 * By default, creates a single random product
 * Can be overridden by providing `productDetails`
 * Created products are passed to the test via `use`
 * All products are deleted after the test completes
 *
 */

export const products = async (
  adminProductsRequest: ProductsRequest,
  use: (r: ProductResponseModel[]) => Promise<void>,
  productDetails: ProductsModel[] = [],
): Promise<void> => {
  const results: ProductResponseModel[] = [];

  const productsToCreate =
    productDetails.length > 0 ? productDetails : [prepareRandomProduct()];

  for (const productDetail of productsToCreate) {
    const createProductResponse =
      await adminProductsRequest.post(productDetail);

    const productJson = await createProductResponse.json();
    const productId = productJson.id;

    results.push(new ProductResponseModel(productDetail, productId));
  }

  await use(results);

  for (const obj of results) {
    const response = await adminProductsRequest.delete(obj.id);
    expect([200, 404]).toContain(response.status());
  }
};
