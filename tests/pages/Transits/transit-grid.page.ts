import { Page, Locator, expect } from '@playwright/test';
import { AgGridPage } from '../../components/ag-grid.page';
import { NavBar } from '../../components/nav-bar.page';
import { ActionsBar, ActionsBarButton } from '../../components/actions-bar.page';

export class TransitGridPage {
  /**
   * Finds a cell by column header and transit ID value.
   * Returns the cell Locator or throws if not found.
   */
  readonly page: Page;
  readonly heading: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly pageSizeCombo: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;
  readonly navBar: NavBar;
  readonly actionsBar: ActionsBar;
  readonly grid: AgGridPage;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Transits/i });
    this.table = page.getByRole('treegrid');
    this.rows = this.table.getByRole('row');
    this.pageSizeCombo = page.getByRole('combobox', { name: /Page Size/i });
    this.nextPageButton = page.getByRole('button', { name: /Next Page/i });
    this.lastPageButton = page.getByRole('button', { name: /Last Page/i });
    this.navBar = new NavBar(page);
    this.actionsBar = new ActionsBar(page);
    this.grid = new AgGridPage(page);
  }

  async startCreateTransit() {
    await this.actionsBar.clickButton(ActionsBarButton.CreateNew);
    // Add logic to handle the transit creation dialog/form
  }

  async clearFilters() {
    await this.actionsBar.clickButton(ActionsBarButton.ClearFilters);
  }

  async exportToExcel() {
    await this.actionsBar.clickButton(ActionsBarButton.ExportToExcel);
  }

  async goToNextPage() {
    await this.nextPageButton.click();
  }

  async goToLastPage() {
    await this.lastPageButton.click();
  }

  getTransitEditor() {
    // Assumes the transit creation dialog is open and visible
    const { TransitEditor } = require('./transit-editor.page');
    return new TransitEditor(this.page);
  }

  async saveTransit() {
    // Assumes the Save button is visible in the transit creation dialog
    // Click the first enabled Save button
    const saveButtons = await this.page.locator('button', { hasText: 'Save' }).filter({ has: this.page.locator(':not([disabled])') });
    const count = await saveButtons.count();
    if (count > 0) {
      await saveButtons.nth(0).click();
    } else {
      // Fallback: click the first Save button (even if disabled)
      await this.page.getByRole('button', { name: /Save/i }).first().click();
    }
  }

  async getCellByHeaderAndTransitId(header: string, transitId: string): Promise<Locator> {
    // Find the row index for the given transitId
    const colIndex = await this.grid.getColumnIndex('Transit ID');
    const rows = this.table.getByRole('row');
    const rowCount = await rows.count();
    let targetRowIndex = -1;
    for (let i = 1; i < rowCount; i++) { // skip header row
      const cell = rows.nth(i).getByRole('gridcell').nth(colIndex);
      const text = await cell.innerText();
      if (text.trim() === transitId) {
        targetRowIndex = i;
        break;
      }
    }
    if (targetRowIndex === -1) throw new Error(`Transit ID ${transitId} not found.`);
    // Find the column index for the target header
    const targetColIndex = await this.grid.getColumnIndex(header);
    const targetRow = rows.nth(targetRowIndex);
    return targetRow.getByRole('gridcell').nth(targetColIndex);
  }
  // Add more methods for filtering, row actions, etc. as needed
}
