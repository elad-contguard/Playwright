import { Page, Locator } from '@playwright/test';

export class Stepper {
  readonly page: Page;
  readonly stepHeaders: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stepHeaders = this.page.locator('.mat-step-header');
  }

  async goToStepByIndex(index: number) {
    await this.stepHeaders.nth(index).click();
  }

  async goToStepByLabel(label: string) {
    await this.stepHeaders.filter({ hasText: label }).first().click();
  }
}
