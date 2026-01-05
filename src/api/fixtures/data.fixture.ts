import { createProducts } from './manage-objects.fixture';
import { requestObjectTest } from './request-object.fixture';
import { ProductResponseModel } from '@_api/models/products-response.model';

interface DataFixtures {
  product: ProductResponseModel;
  products: ProductResponseModel[];
  autoCleanup: boolean;
}

export const dataFixtureTest = requestObjectTest.extend<DataFixtures>({
  autoCleanup: [true, { option: true }],

  // Product fixtures (random by default, overridable)
  products: async ({ adminProductsRequest, autoCleanup }, use) => {
    await createProducts(adminProductsRequest, use, [], autoCleanup);
  },
  product: async ({ products }, use) => {
    await use(products[0]);
  },
});
