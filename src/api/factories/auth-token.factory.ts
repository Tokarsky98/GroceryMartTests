import { LoginModel } from '@_api/models/login.model';
import { LoginRequest } from '@_api/requests/login.request';
import { APIRequestContext, expect } from '@playwright/test';

export async function getAuthToken(
  request: APIRequestContext,
  loginData: LoginModel,
): Promise<string> {
  const loginRequest = new LoginRequest(request);
  const loginResponse = await loginRequest.post(loginData);
  await expect(loginResponse).toBeOK();

  const loginResponseJson = await loginResponse.json();
  const token = loginResponseJson.token;

  expect(token, 'Auth token should be present in response').toBeDefined();
  expect(typeof token, 'Auth token should be a string').toBe('string');

  return token;
}
