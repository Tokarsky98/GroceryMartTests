import { ProductsModel } from '@_api/models/products.model';
import { faker } from '@faker-js/faker/locale/en';

export function prepareRandomProduct(): ProductsModel {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 1, max: 1000 })),
    category: faker.commerce.department(),
    stock: faker.number.int({ min: 0, max: 1000 }),
    image: faker.image.url(),
  };
}

export function prepareCustomProduct(
  field: keyof ProductsModel,
  invalidValue: unknown,
): ProductsModel {
  const product = prepareRandomProduct();
  return { ...product, [field]: invalidValue };
}
