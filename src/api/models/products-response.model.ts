import { ProductsModel } from './products.model';

export class ProductResponseModel {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  id: string;

  constructor(productData: ProductsModel, id: string) {
    this.name = productData.name;
    this.description = productData.description;
    this.price = productData.price;
    this.category = productData.category;
    this.stock = productData.stock;
    this.image = productData.image;
    this.id = id;
  }
}
