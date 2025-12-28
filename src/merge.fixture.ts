import { authTest } from '@_api/fixtures/auth.fixture';
import { authenticatedPageTest } from '@_ui/fixtures/authenticated-page.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(authTest, authenticatedPageTest);

export { expect } from '@playwright/test';
