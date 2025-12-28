import { HeadersModel } from '@_api/models/headers.model';
import { LoginRequest } from '@_api/requests/login.request';
import { APIRequestContext, expect } from '@playwright/test';

export async function getAuthHeader(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<HeadersModel> {
  const loginRequest = new LoginRequest(request);
  const loginResponse = await loginRequest.post({ email, password });
  await expect(loginResponse).toBeOK();

  const loginResponseJson = await loginResponse.json();
  const token = loginResponseJson.token;

  expect(token, 'Auth token should be present in response').toBeDefined();
  expect(typeof token, 'Auth token should be a string').toBe('string');

  return { Authorization: token };
}
