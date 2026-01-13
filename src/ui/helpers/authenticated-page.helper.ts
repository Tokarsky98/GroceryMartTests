import { BASE_URL } from '@_config/env.config';
import { HomePage } from '@_ui/pages/home.page';
import { Page } from '@playwright/test';

export const authenticatedPage = async (
  page: Page,
  token: string,
): Promise<HomePage> => {
  await page.addInitScript((token) => {
    localStorage.setItem('token', token);
  }, token);

  await page.goto(BASE_URL);

  return new HomePage(page);
};
