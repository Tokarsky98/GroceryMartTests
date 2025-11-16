import { BASE_URL } from '../../../config/env.config';
import { APIRequestContext, expect } from '@playwright/test';

export const authToken = async (
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<string> => {
  const response = await request.post(`${BASE_URL}/api/auth/login`, {
    data: {
      email: email,
      password: password,
    },
  });

  await expect(response).toBeOK();

  const body = await response.json();
  const token = body.token;

  expect(token, 'Auth token should be present in response').toBeDefined();
  expect(typeof token, 'Auth token should be a string').toBe('string');

  return token;
};
