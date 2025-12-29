import { prepareRandomProduct } from '../factories/product.factory';
import { ProductsModel } from '@_api/models/products.model';
import { ProductsRequest } from '@_api/requests/products.request';
import { ProductResponseModel } from '@_src/api/models/products-response.model';
import { expect } from '@playwright/test';

export const products = async (
  adminProductsRequest: ProductsRequest,
  productDetails: ProductsModel[],
  use: (r: ProductResponseModel[]) => Promise<void>,
): Promise<void> => {
  const result: ProductResponseModel[] = [];

  const productsToCreate =
    productDetails.length > 0 ? productDetails : [prepareRandomProduct()];

  for (const productDetail of productsToCreate) {
    const createProductResponse =
      await adminProductsRequest.post(productDetail);

    const productJson = await createProductResponse.json();
    const productId = productJson.id;

    result.push(new ProductResponseModel(productDetail, productId));
  }

  await use(result);

  for (const obj of result) {
    const response = await adminProductsRequest.delete(obj.id);
    expect([200, 404]).toContain(response.status());
  }
};
