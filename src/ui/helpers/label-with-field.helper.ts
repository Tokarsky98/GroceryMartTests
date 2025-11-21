import { Locator } from '@playwright/test';

export class LabelWithField {
  readonly label: Locator;
  readonly field: Locator;
  readonly validationMessage?: Locator;

  constructor(label: Locator, field: Locator, validationMessage?: Locator) {
    this.label = label;
    this.field = field;
    this.validationMessage = validationMessage;
  }
}
