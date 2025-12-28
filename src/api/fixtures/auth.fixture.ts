import { getAuthHeader } from '@_api/factories/auth-header.factory';
import { HeadersModel } from '@_api/models/headers.model';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  USER_EMAIL,
  USER_PASSWORD,
} from '@_config/env.config';
import { test as base } from '@playwright/test';

type AuthFixtures = {
  adminAuthHeaders: HeadersModel;
  userAuthHeaders: HeadersModel;
};

export const authTest = base.extend<AuthFixtures>({
  adminAuthHeaders: async ({ request }, use) => {
    const headers = await getAuthHeader(request, ADMIN_EMAIL, ADMIN_PASSWORD);
    await use(headers);
  },

  userAuthHeaders: async ({ request }, use) => {
    const headers = await getAuthHeader(request, USER_EMAIL, USER_PASSWORD);
    await use(headers);
  },
});
