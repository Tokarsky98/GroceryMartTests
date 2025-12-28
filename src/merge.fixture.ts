import { requestObjectTest } from '@_api/fixtures/request-object.fixture';
import { authenticatedPageTest } from '@_ui/fixtures/authenticated-page.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(authenticatedPageTest, requestObjectTest);

export { expect } from '@playwright/test';
