import { LoginModel } from '@_api/models/login.model';
import { apiUrls } from '@_api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class LoginRequest {
  url: string;

  constructor(protected request: APIRequestContext) {
    this.url = apiUrls.loginUrl;
  }

  async post(data: LoginModel): Promise<APIResponse> {
    return await this.request.post(this.url, {
      data,
    });
  }
}
