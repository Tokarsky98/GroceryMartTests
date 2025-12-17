import { BASE_URL } from '@_config/env.config';
import { HomePage } from '@_ui/pages/home.page';
import { Browser } from '@playwright/test';

export const authenticatedPage = async (
  browser: Browser,
  token: string,
): Promise<HomePage> => {
  const page = await browser.newPage();
  await page.goto(BASE_URL);

  await page.evaluate((token) => {
    localStorage.setItem('token', token);
  }, token);

  await page.reload();

  return new HomePage(page);
};
