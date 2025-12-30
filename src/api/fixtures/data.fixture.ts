import { products } from './manage-objects.fixture';
import { requestObjectTest } from './request-object.fixture';
import { ProductResponseModel } from '@_api/models/products-response.model';

interface DataFixtures {
  products: ProductResponseModel[];
}

export const dataFixtureTest = requestObjectTest.extend<DataFixtures>({
  // Product fixture (random by default, overridable)
  products: async ({ adminProductsRequest }, use) => {
    await products(adminProductsRequest, use);
  },
});
