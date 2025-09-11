import { Page, Locator } from '@playwright/test';

export class AutoComplete {
  readonly input: Locator;
  readonly index: number;

  constructor(parentOrPage: Locator | Page, inputOrLabel?: Locator | string, index?: number) {
    if (inputOrLabel && typeof inputOrLabel === 'object' && 'elementHandle' in inputOrLabel) {
      // Signature: (parentLocator, inputLocator)
      this.input = inputOrLabel;
      this.index = index ?? 0;
    } else if (typeof inputOrLabel === 'string') {
      // Signature: (Page | Locator, label: string, index?: number)
      this.index = index ?? 0;
      this.input = parentOrPage.getByRole('combobox', { name: inputOrLabel }).nth(this.index);
    } else if (parentOrPage && typeof parentOrPage === 'object' && 'locator' in parentOrPage) {
      // Signature: (Locator, index?) - treat as parent locator, auto-select input or combobox
      this.index = typeof inputOrLabel === 'number' ? inputOrLabel : 0;
      // Prefer [role="combobox"] if present, else first input
      const combobox = parentOrPage.locator('[role="combobox"]').nth(this.index);
      this.input = combobox;
      // Fallback to input if combobox not found
      // Note: Playwright locators always resolve, so we check if combobox exists at runtime in selectText
    } else {
      throw new Error('If using Page, you must provide a label or input locator as the second argument');
    }
  }

  async selectText(searchText: string) {
    // Get the current value of the input
    // const currentValue = await this.input.inputValue();
    
    // // If the value is already set to what we want, no need to change it
    // if (currentValue === searchText) {
    //   console.log(`AutoComplete: Value already set to '${searchText}'`);
    //   return;
    // }
    
    // Scroll into view and wait for overlays to disappear
    await this.input.scrollIntoViewIfNeeded();
    // Wait for overlays or required markers to disappear (common for Angular Material)
    const page = this.input.page();
    await page.waitForSelector('.cdk-overlay-backdrop', { state: 'detached', timeout: 2000 }).catch(() => {});
    // If combobox is not enabled, fallback to first input inside parent
    const isEnabled = await this.input.isEnabled();
    if (!isEnabled) {
      // Try to fallback to input
      const parent = this.input.locator('..');
      const inputFallback = parent.locator('input').first();
      if (await inputFallback.isEnabled()) {
        await inputFallback.click({ force: true });
        await inputFallback.fill(searchText);
        await inputFallback.press('Tab');
        return;
      }
    }
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
