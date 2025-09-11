import { Page, Locator } from '@playwright/test';

export class TagsSelector {
  readonly input: Locator;
  readonly dropdownOptions: Locator;

  constructor(parentOrPage: Locator | Page, label?: string) {
    if (typeof (parentOrPage as Locator).locator === 'function') {
      // Parent locator: select first input or combobox inside
      this.input = (parentOrPage as Locator).locator('[role="combobox"]').first();
      this.dropdownOptions = (parentOrPage as Locator).locator('[role="listbox"] [role="option"]');
    } else if (typeof (parentOrPage as Page).getByRole === 'function') {
      // Page object
      if (!label) throw new Error('Label is required when using Page');
      this.input = (parentOrPage as Page).getByRole('combobox', { name: label });
      this.dropdownOptions = (parentOrPage as Page).locator('[role="listbox"] [role="option"]');
    } else {
      throw new Error('Invalid argument for TagsSelector: must be Locator or Page');
    }
  }

  async selectTags(tags: string[]) {
    for (const tag of tags) {
      let targetInput = this.input;
      if (!(await targetInput.isEnabled())) {
        // Fallback to input inside parent
        const parent = targetInput.locator('..');
        const inputFallback = parent.locator('input').first();
        if (await inputFallback.isEnabled()) {
          targetInput = inputFallback;
        }
      }
      await targetInput.fill(tag);
      // Ensure combobox is expanded
      await targetInput.press('ArrowDown');
      
      // Wait for the listbox to be visible first
      await this.dropdownOptions.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        console.log(`Dropdown options not visible after typing ${tag}, trying Enter key`);
      });
      
      // Check if any options are visible
      const optionsCount = await this.dropdownOptions.count();
      console.log(`Found ${optionsCount} dropdown options for ${tag}`);
      
      if (optionsCount > 0) {
        // Get the first option regardless of its text content
        const option = this.dropdownOptions.first();
        await option.click().catch(async () => {
          console.log(`Failed to click option for ${tag}, trying Enter key`);
          // If clicking fails, try pressing Enter
          await targetInput.press('Enter');
        });
      } else {
        // If no options are found, try pressing Enter
        console.log(`No dropdown options found for ${tag}, trying Enter key`);
        await targetInput.press('Enter');
      }
    }
  }
}
