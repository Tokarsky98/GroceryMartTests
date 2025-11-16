import { BASE_URL } from '../../../config/env.config';
import { Browser, Page } from '@playwright/test';

export const authenticatedPage = async (
  browser: Browser,
  token: string,
): Promise<Page> => {
  const page = await browser.newPage();
  await page.goto(BASE_URL);

  await page.evaluate((token) => {
    localStorage.setItem('token', token);
  }, token);

  await page.reload();

  return page;
};
