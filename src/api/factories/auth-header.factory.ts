import { getAuthToken } from './auth-token.factory';
import { HeadersModel } from '@_api/models/headers.model';
import { LoginModel } from '@_api/models/login.model';
import { APIRequestContext } from '@playwright/test';

export async function getAuthHeader(
  request: APIRequestContext,
  loginData: LoginModel,
): Promise<HeadersModel> {
  const token = await getAuthToken(request, loginData);
  return { Authorization: `Bearer ${token}` };
}
