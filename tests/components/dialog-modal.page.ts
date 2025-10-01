import { Page, Locator } from '@playwright/test';

export class DialogModal {
  readonly page: Page;
  readonly container: Locator;
  readonly title: Locator;
  readonly message: Locator;
  readonly okButton: Locator;
  readonly cancelButton: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
  this.page = page;
  this.container = page.getByRole('dialog');
  this.title = this.container.locator('[data-testid="dialog-title"]');
  this.message = this.container.locator('[data-testid="dialog-content"]');
  this.okButton = this.container.locator('[data-testid="dialog-ok"]');
  this.confirmButton = this.container.locator('[data-testid="dialog-confirm"]');
  this.cancelButton = this.container.locator('[data-testid="dialog-cancel"]');
  }

  /**
   * Waits for the dialog to be visible
   */
  async waitForVisible() {
    await this.container.waitFor({ state: 'visible' });
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

  /**
   * Legacy method: Clicks the OK button and waits for dialog to close
   */
  async close() {
    await this.okButton.click();
    await this.container.waitFor({ state: 'hidden' });
  }
}
