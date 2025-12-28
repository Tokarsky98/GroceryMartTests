import { getAuthHeader } from '@_api/factories/auth-header.factory';
import { ProductsRequest } from '@_api/requests/products.request';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  USER_EMAIL,
  USER_PASSWORD,
} from '@_config/env.config';
import { test as baseTest } from '@playwright/test';

interface Requests {
  productsRequest: ProductsRequest;
  adminProductsRequest: ProductsRequest;
  userProductsRequest: ProductsRequest;
}

export const requestObjectTest = baseTest.extend<Requests>({
  productsRequest: async ({ request }, use) => {
    const productsRequest = new ProductsRequest(request);
    await use(productsRequest);
  },

  adminProductsRequest: async ({ request }, use) => {
    const headers = await getAuthHeader(request, ADMIN_EMAIL, ADMIN_PASSWORD);
    const productsRequest = new ProductsRequest(request, headers);
    await use(productsRequest);
  },

  userProductsRequest: async ({ request }, use) => {
    const headers = await getAuthHeader(request, USER_EMAIL, USER_PASSWORD);
    const productsRequest = new ProductsRequest(request, headers);
    await use(productsRequest);
  },
});
