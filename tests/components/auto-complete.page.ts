import { Page, Locator } from '@playwright/test';

export class AutoComplete {
  readonly page: Page;
  readonly input: Locator;
  readonly dropdownOptions: Locator;
  readonly index: number;

  constructor(page: Page, comboLabel: string, index: number = 0) {
    this.page = page;
    this.index = index;
    // Use getByRole for combobox input, target nth if index provided
    this.input = page.getByRole('combobox', { name: comboLabel }).nth(index);
    // Use locator for dropdown table rows, target nth if index provided
    this.dropdownOptions = page.locator('[role="listbox"] tbody tr, [role="listbox"] mat-option').nth(index);
  }

  async selectText(searchText: string) {
    await this.input.fill(searchText);
    // Wait for dropdown to appear and select the first option
    await this.dropdownOptions.first().click();

  }
}
