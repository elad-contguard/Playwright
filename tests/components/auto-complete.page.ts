import { Page, Locator } from '@playwright/test';

export class AutoComplete {
  readonly input: Locator;
  readonly index: number;

  constructor(pageOrLocator: Page | Locator, comboLabel: string, index: number = 0) {
    this.index = index;
    this.input = pageOrLocator.getByRole('combobox', { name: comboLabel }).nth(index);
  }

  async selectText(searchText: string) {
    // Scroll into view and wait for overlays to disappear
    await this.input.scrollIntoViewIfNeeded();
    // Wait for overlays or required markers to disappear (common for Angular Material)
    const page = this.input.page();
    await page.waitForSelector('.cdk-overlay-backdrop', { state: 'detached', timeout: 2000 }).catch(() => {});
    // Focus and open the dropdown with forced click
    await this.input.click({ force: true });
    await this.input.fill(searchText);
    // Wait for dropdown to open and options to appear
    const options = page.locator('[role="listbox"] [role="option"], [role="listbox"] tbody tr');
    let found = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await options.first().waitFor({ state: 'visible', timeout: 2000 });
        const filteredOption = options.filter({ hasText: searchText });
        await filteredOption.first().waitFor({ state: 'visible', timeout: 2000 });
        await filteredOption.first().click({ force: true });
        found = true;
        break;
      } catch (e) {
        await page.waitForTimeout(500);
      }
    }
    if (!found) {
      throw new Error(`AutoComplete: Option with text '${searchText}' not found after retries.`);
    }
    // Move focus to the next field
    await this.input.press('Tab');
  }
}
