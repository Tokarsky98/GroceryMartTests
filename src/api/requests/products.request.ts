import { HeadersModel } from '@_api/models/headers.model';
import { ProductsModel } from '@_api/models/products.model';
import { apiUrls } from '@_api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ProductsRequest {
  url: string;

  constructor(
    protected request: APIRequestContext,
    protected headers?: HeadersModel,
  ) {
    this.url = apiUrls.productsUrl;
  }

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url, {
      headers: this.headers,
    });
  }

  async getOne(productId: string): Promise<APIResponse> {
    return await this.request.get(`${this.url}/${productId}`, {
      headers: this.headers,
    });
  }

  async post(data: ProductsModel): Promise<APIResponse> {
    return await this.request.post(this.url, {
      headers: this.headers,
      data,
    });
  }

  async put(data: ProductsModel, productId: string): Promise<APIResponse> {
    return await this.request.put(`${this.url}/${productId}`, {
      headers: this.headers,
      data,
    });
  }

  async delete(productId: string): Promise<APIResponse> {
    return await this.request.delete(`${this.url}/${productId}`, {
      headers: this.headers,
    });
  }
}
