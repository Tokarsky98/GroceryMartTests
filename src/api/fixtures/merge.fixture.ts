import { adminTest, userTest } from './context.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(adminTest, userTest);

export { expect } from '@playwright/test';
