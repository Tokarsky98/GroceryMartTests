import { dataFixtureTest } from '@_api/fixtures/data.fixture';
import { authenticatedPageTest } from '@_ui/fixtures/authenticated-page.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(authenticatedPageTest, dataFixtureTest);

export { expect } from '@playwright/test';
