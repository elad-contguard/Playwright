import { Page, Locator, expect } from '@playwright/test';
import { AgGridPage } from '../../components/ag-grid.page';
import { NavBar } from '../../components/nav-bar.page';
import { ActionsBar, ActionsBarButton } from '../../components/actions-bar.page';

export class TransitGridPage {
  // Year selector combobox (Locator)
  readonly yearSelector: Locator;
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
  readonly paginationText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Transits/i });
    this.table = page.getByRole('treegrid');
    this.rows = this.table.getByRole('row');
    this.pageSizeCombo = page.getByRole('combobox', { name: /Page Size/i });
    this.yearSelector = page.locator('[data-testid="select-year"]');
    this.nextPageButton = page.getByRole('button', { name: /Next Page/i });
    this.lastPageButton = page.getByRole('button', { name: /Last Page/i });
    this.navBar = new NavBar(page);
    this.actionsBar = new ActionsBar(page);
    this.grid = new AgGridPage(page);
    // Using more specific locator for pagination text
    this.paginationText = page.locator('text=/\\d+ to \\d+ of \\d+/');
  }

  /** Select a year in the year selector combobox */
  async selectYear(year: string) {
    // Click the year selector combobox
    await this.yearSelector.click();
    // Select the year option by visible text
    const option = this.page.getByRole('option', { name: year });
    await option.click();
    // Wait for grid to reload after selection
    await this.grid.waitForGridToLoad();
  }

  async startCreateTransit() {
    await this.actionsBar.clickButton(ActionsBarButton.CreateNew);
  }

  async clearFilters() {
    await this.actionsBar.clickButton(ActionsBarButton.ClearFilters);
  }

  /**
   * Gets the total number of transits from the heading text
   * Example: "Transits (512)" returns 512
   */
  async getTotalCountFromHeading(): Promise<number> {
    const headingText = await this.heading.innerText();
    const match = headingText.match(/\((\d+)\)/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    throw new Error('Could not extract total count from heading text');
  }

  /**
   * Gets the total number of transits from the pagination text
   * Example: "1 to 100 of 512" returns 512
   */
  async getTotalCountFromPagination(): Promise<number> {
    // Wait for the pagination text to be visible
    await this.paginationText.waitFor({ state: 'visible', timeout: 10000 });
    const paginationText = await this.paginationText.innerText();
    console.log(`Raw pagination text: "${paginationText}"`);
    
    // Try multiple regex patterns to handle different formats
    let match = paginationText.match(/of (\d+)/);
    if (!match) {
      match = paginationText.match(/(\d+)\s*\.\s*Page/);
    }
    if (!match) {
      match = paginationText.match(/\d+\s+to\s+\d+\s+of\s+(\d+)/);
    }
    
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    
    // If we couldn't extract with regex, try a different approach with a more specific locator
    const specificPagination = this.page.locator('text=/1 to \\d+ of (\\d+)/');
    if (await specificPagination.count() > 0) {
      const text = await specificPagination.innerText();
      console.log(`Specific pagination text: "${text}"`);
      const specificMatch = text.match(/of (\d+)/);
      if (specificMatch && specificMatch[1]) {
        return parseInt(specificMatch[1], 10);
      }
    }
    
    throw new Error(`Could not extract total count from pagination text: "${paginationText}"`);
  }

  /**
   * Gets the total count of all transits from the heading (unfiltered)
   * This shows the total count in the database regardless of filtering
   */
  async getTotalCount(): Promise<number> {
    try {
      return await this.getTotalCountFromHeading();
    } catch (headingError) {
      try {
        // This is a fallback but may not be accurate if filters are applied
        return await this.getTotalCountFromPagination();
      } catch (paginationError) {
        // Fall back to grid row count if UI counters aren't available
        console.warn('Could not get total count from UI, falling back to grid row count');
        return await this.grid.getRowCount();
      }
    }
  }
  
  /**
   * Gets the filtered count of transits from the pagination text
   * This reflects the current filtered state of the grid
   */
  async getFilteredCount(): Promise<number> {
    try {
      return await this.getTotalCountFromPagination();
    } catch (paginationError) {
      // Fall back to grid row count
      console.warn('Could not get filtered count from pagination, falling back to grid row count');
      return await this.grid.getRowCount();
    }
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
}
