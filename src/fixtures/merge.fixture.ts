import { adminTest, userTest } from '@_fixtures/context.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(adminTest, userTest);

export { expect } from '@playwright/test';
