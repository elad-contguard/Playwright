import { Page, Locator } from '@playwright/test';

export enum ActionsBarButton {
  ClearFilters = 'ClearFilters',
  ExportToExcel = 'ExportToExcel',
  CreateNew = 'CreateNew',
}

export class ActionsBar {
  readonly page: Page;
  readonly clearFiltersButton: Locator;
  readonly exportToExcelButton: Locator;
  readonly createNewButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.clearFiltersButton = page.locator('[data-testid="clear-filters"]');
    this.exportToExcelButton = page.locator('[data-testid="export-to-excel"]');
    this.createNewButton = page.locator('[data-testid="create-new"]');
  }

  async clickButton(button: ActionsBarButton) {
    switch (button) {
      case ActionsBarButton.ClearFilters:
        await this.clearFiltersButton.click();
        break;
      case ActionsBarButton.ExportToExcel:
        await this.exportToExcelButton.click();
        break;
      case ActionsBarButton.CreateNew:
        await this.createNewButton.click();
        break;
      default:
        throw new Error(`Unknown button: ${button}`);
    }
  }

  async exportToExcelAndWaitForDownload() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportToExcelButton.click()
    ]);
    return download;
  }
}
