import { Page, Locator } from '@playwright/test';
import { AgGridPage } from '../../components/ag-grid.page';
import { NavBar } from '../../components/nav-bar.page';
import { ActionsBar } from '../../components/actions-bar.page';
import { ActionsBarButton } from '../../components/actions-bar.page';

export class LocationGridPage {
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
  readonly clearFiltersButton: Locator;
  readonly exportToExcelButton: Locator;
  readonly createNewLocationButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Locations/i });
    this.table = page.getByRole('treegrid');
    this.rows = this.table.getByRole('row');
    this.pageSizeCombo = page.getByRole('combobox', { name: /Page Size/i });
    this.nextPageButton = page.getByRole('button', { name: /Next Page/i });
    this.lastPageButton = page.getByRole('button', { name: /Last Page/i });
    this.navBar = new NavBar(page);
    this.actionsBar = new ActionsBar(page);
    this.grid = new AgGridPage(page);
    this.paginationText = page.locator('text=/\d+ to \d+ of \d+/');
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear Filters' });
    this.exportToExcelButton = page.getByRole('button', { name: 'Export to Excel' });
    this.createNewLocationButton = page.getByRole('button', { name: 'Create New Location' });
  }

  getColumnHeader(name: string) {
    return this.page.getByRole('columnheader', { name });
  }

  getRow(index: number) {
    return this.rows.nth(index);
  }

  getCell(rowIndex: number, columnName: string) {
    return this.getRow(rowIndex).getByRole('gridcell', { name: columnName });
  }

  async goToNextPage() {
    await this.nextPageButton.click();
  }

  async goToLastPage() {
    await this.lastPageButton.click();
  }

  async startCreateLocation() {
    await this.actionsBar.clickButton(ActionsBarButton.CreateNew);
    // Add logic to handle the location creation dialog/form
  }

  async clearFilters() {
    await this.actionsBar.clickButton(ActionsBarButton.ClearFilters);
  }

  /**
   * Gets the total number of locations from the heading text
   * Example: "Locations (474)" returns 474
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
   * Gets the total number of locations from the pagination text
   * Example: "1 to 100 of 474" returns 474
   */
  async getTotalCountFromPagination(): Promise<number> {
    // Look for the pagination text at the bottom of the grid
    // This text typically appears as "1 to 17 of 474" above pagination controls
    
    // Use a more specific locator based on the known pattern
    const paginationLocator = this.page.locator('text=/\\d+ to \\d+ of \\d+/').last();
    
    // Wait for the pagination text to be visible with a longer timeout
    await paginationLocator.waitFor({ state: 'visible', timeout: 15000 });
    
    // Get the full text that contains pagination info
    const paginationText = await paginationLocator.innerText();
    console.log(`Raw pagination text: "${paginationText}"`);
    
    // Extract the total count using regex
    const match = paginationText.match(/of (\d+)/);
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
   * Gets the total count of all locations from the heading (unfiltered)
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
   * Gets the filtered count of locations from the pagination text
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

  getLocationEditor() {
    // Assumes the location creation dialog is open and visible
    const { LocationEditor } = require('./location-editor.page');
    return new LocationEditor(this.page);
  }

  async saveLocation() {
    // Assumes the Save button is visible in the location creation dialog
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

  async getCellByHeaderAndLocationId(header: string, locationId: string): Promise<Locator> {
    // Find the row index for the given locationId
    const colIndex = await this.grid.getColumnIndex('Location ID');
    const rows = this.table.getByRole('row');
    const rowCount = await rows.count();
    let targetRowIndex = -1;
    for (let i = 1; i < rowCount; i++) { // skip header row
      const cell = rows.nth(i).getByRole('gridcell').nth(colIndex);
      const text = await cell.innerText();
      if (text.trim() === locationId) {
        targetRowIndex = i;
        break;
      }
    }
    if (targetRowIndex === -1) throw new Error(`Location ID ${locationId} not found.`);
    // Find the column index for the target header
    const targetColIndex = await this.grid.getColumnIndex(header);
    const targetRow = rows.nth(targetRowIndex);
    return targetRow.getByRole('gridcell').nth(targetColIndex);
  }
  // Add more methods for filtering, row actions, etc. as needed
}
