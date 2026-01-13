import { HeadersModel } from '@_api/models/headers.model';
import { BASE_URL } from '@_config/env.config';
import { HomePage } from '@_ui/pages/home.page';
import { Page } from '@playwright/test';

export const authenticatedPage = async (
  page: Page,
  headers: HeadersModel,
): Promise<HomePage> => {
  // Extract the token from the Authorization header
  const token = headers.Authorization;

  await page.addInitScript((token) => {
    localStorage.setItem('token', token);
  }, token);

  await page.goto(BASE_URL);

  return new HomePage(page);
};
