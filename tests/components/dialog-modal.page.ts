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
    // More general locator for the heading/title inside the dialog
    this.title = this.container.locator('.dialog-title, [role="heading"], h1, h2, h3').filter({ hasText: /.+/ });
    // Use the .dialog-message class for the message inside the dialog
    this.message = this.container.locator('.dialog-message');
    this.okButton = this.container.getByRole('button', { name: /OK/i }).first();
    // Add additional common dialog buttons
    this.confirmButton = this.container.getByRole('button', { name: /Confirm|OK|Yes|Save/i }).first();
    this.cancelButton = this.container.getByRole('button', { name: /Cancel|No|Close/i }).first();
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
