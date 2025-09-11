import { Locator, Page } from '@playwright/test';

/**
 * Page Object for a textarea field (multiline input)
 * Supports parent locator or label-based selection
 */
export class TextareaField {
  readonly textarea: Locator;

  /**
   * @param parentOrPage - Parent Locator or Playwright Page
   * @param label - Optional label for the textarea (required if using Page)
   */
  constructor(parentOrPage: Locator | Page, label?: string) {
    if (typeof (parentOrPage as Locator).locator === 'function') {
      // Parent locator: select first textarea inside
      this.textarea = (parentOrPage as Locator).locator('textarea').first();
    } else if (typeof (parentOrPage as Page).getByRole === 'function') {
      // Page object: select textarea by label
      if (!label) throw new Error('Label is required when using Page');
      this.textarea = (parentOrPage as Page).getByRole('textbox', { name: label });
    } else {
      throw new Error('Invalid argument for TextareaField: must be Locator or Page');
    }
  }

  /**
   * Fill the textarea with the given value
   */
  async fill(value: string) {
    await this.textarea.fill(value);
  }

  /**
   * Get the current value of the textarea
   */
  async getValue(): Promise<string> {
    return await this.textarea.inputValue();
  }

  /**
   * Clear the textarea
   */
  async clear() {
    await this.textarea.fill('');
  }
}
