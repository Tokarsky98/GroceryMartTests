import { LoginModel } from '@_api/models/login.model';
import { getAuthToken } from '@_src/api/factories/auth-token.factory';
import { CartRequest } from '@_src/api/requests/cart.request';
import { APIRequestContext } from '@playwright/test';

export async function getAuthenticatedSession(
  request: APIRequestContext,
  credentials: LoginModel,
): Promise<{ token: string }> {
  const token = await getAuthToken(request, credentials);

  // Reset backend state for this user
  const cartRequest = new CartRequest(request, {
    Authorization: `Bearer ${token}`,
  });
  await cartRequest.delete();

  return { token };
}
