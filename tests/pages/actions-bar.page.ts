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
    this.clearFiltersButton = page.getByRole('button', { name: /Clear Filters/i });
    this.exportToExcelButton = page.getByRole('button', { name: /Export to Excel/i });
    this.createNewButton = page.getByRole('button', { name: /Create New/i });
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
}
