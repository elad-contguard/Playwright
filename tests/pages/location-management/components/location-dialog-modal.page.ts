import { Page, Locator } from '@playwright/test';

export class LocationDialogModal {
  readonly page: Page;
  readonly dialog: Locator;
  readonly title: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog');
    this.title = this.dialog.getByRole('heading').first();
    this.confirmButton = this.dialog.getByRole('button', { name: /Confirm|OK|Yes|Save/i }).first();
    this.cancelButton = this.dialog.getByRole('button', { name: /Cancel|No|Close/i }).first();
  }
  
  /**
   * Waits for the dialog to be visible
   */
  async waitForVisible() {
    await this.dialog.waitFor({ state: 'visible' });
  }
  
  /**
   * Clicks the confirm button (OK, Yes, Save, Confirm, etc.)
   */
  async clickConfirm() {
    await this.confirmButton.click();
  }
  
  /**
   * Clicks the cancel button (Cancel, No, Close, etc.)
   */
  async clickCancel() {
    await this.cancelButton.click();
  }
  
  /**
   * Gets the title text of the dialog
   */
  async getTitle(): Promise<string> {
    return await this.title.innerText();
  }
}
