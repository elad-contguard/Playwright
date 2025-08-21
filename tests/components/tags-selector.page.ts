import { Page, Locator } from '@playwright/test';

export class TagsSelector {
  readonly page: Page;
  readonly input: Locator;
  readonly dropdownOptions: Locator;

  constructor(page: Page, label: string) {
    this.page = page;
    this.input = page.getByRole('combobox', { name: label });
    this.dropdownOptions = page.locator('[role="listbox"] [role="option"]');
  }

  async selectTags(tags: string[]) {
    for (const tag of tags) {
      await this.input.fill(tag);
      // Ensure combobox is expanded
      await this.input.press('ArrowDown');
      await this.dropdownOptions.filter({ hasText: tag }).first().waitFor({ state: 'visible' });
      await this.dropdownOptions.filter({ hasText: tag }).first().click();
    }
  }
}
