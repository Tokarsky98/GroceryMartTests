import { CartModel } from '../models/cart.model';
import { HeadersModel } from '@_api/models/headers.model';
import { apiUrls } from '@_api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class CartRequest {
  url: string;

  constructor(
    protected request: APIRequestContext,
    protected headers?: HeadersModel,
  ) {
    this.url = apiUrls.cartUrl;
  }

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url, {
      headers: this.headers,
    });
  }

  async post(data: CartModel): Promise<APIResponse> {
    return await this.request.post(this.url, {
      headers: this.headers,
      data,
    });
  }

  async delete(): Promise<APIResponse> {
    return await this.request.delete(`${this.url}/clear`, {
      headers: this.headers,
    });
  }
}
