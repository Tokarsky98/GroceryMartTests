import { HeadersModel } from '@_api/models/headers.model';
import { BASE_URL } from '@_config/env.config';
import { HomePage } from '@_ui/pages/home.page';
import { Browser } from '@playwright/test';

export const authenticatedPage = async (
  browser: Browser,
  headers: HeadersModel,
): Promise<HomePage> => {
  const page = await browser.newPage();
  await page.goto(BASE_URL);

  // Extract the token from the Authorization header
  const token = headers.Authorization;

  await page.evaluate((token) => {
    localStorage.setItem('token', token);
  }, token);

  await page.reload();

  return new HomePage(page);
};
