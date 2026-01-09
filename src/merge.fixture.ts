import { dataFixtureTest } from '@_api/fixtures/data.fixture';
import { userContextTest } from '@_src/ui/fixtures/user-context.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(userContextTest, dataFixtureTest);

export { expect } from '@playwright/test';
