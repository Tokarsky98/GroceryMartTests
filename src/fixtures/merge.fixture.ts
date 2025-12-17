import { mergeTests } from '@playwright/test';
import { adminTest, userTest } from 'src/fixtures/context.fixture';

export const test = mergeTests(adminTest, userTest);

export { expect } from '@playwright/test';
