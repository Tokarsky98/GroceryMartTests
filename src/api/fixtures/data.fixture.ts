import { createProducts } from './manage-objects.fixture';
import { requestObjectTest } from './request-object.fixture';
import { ProductResponseModel } from '@_api/models/products-response.model';

interface DataFixtures {
  product: ProductResponseModel;
  products: ProductResponseModel[];
}

export const dataFixtureTest = requestObjectTest.extend<DataFixtures>({
  // Product fixtures (random by default, overridable)
  products: async ({ adminProductsRequest }, use) => {
    await createProducts(adminProductsRequest, use);
  },
  product: async ({ products }, use) => {
    await use(products[0]);
  },
});
