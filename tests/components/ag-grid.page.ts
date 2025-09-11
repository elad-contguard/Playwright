import { Page, Locator, expect } from '@playwright/test';

export class AgGridPage {
  readonly page: Page;
  readonly grid: Locator;

  constructor(page: Page) {
    this.page = page;
    this.grid = page.getByRole('treegrid');
  }

  async scrollToRow(rowIndex: number): Promise<void> {
    // The first row is the header, so data rows start at index 1
    const actualRowIndex = rowIndex + 1;
    const row = this.grid.getByRole('row').nth(actualRowIndex);
    await row.scrollIntoViewIfNeeded();
  }
  
  async getRowCount(): Promise<number> {
    return await this.grid.getByRole('row').count();
  }
  
  /**
   * Checks if the grid is currently visible on the page
   * @returns True if the grid is visible, false otherwise
   */
  async isVisible(): Promise<boolean> {
    return await this.grid.isVisible().catch(() => false);
  }

  async getColumnCount(): Promise<number> {
    return await this.grid.getByRole('columnheader').count();
  }

  async getRowValues(rowIndex: number): Promise<string[]> {
    const row = this.grid.getByRole('row').nth(rowIndex);
    const cells = row.getByRole('gridcell');
    const count = await cells.count();
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await cells.nth(i).innerText();
      values.push(text.trim());
    }
    return values;
  }

  async getColumnValues(header: string): Promise<string[]> {
    const colIndex = await this.getColumnIndex(header);
    const rows = this.grid.getByRole('row');
    const rowCount = await rows.count();
    const values: string[] = [];
    for (let i = 0; i < rowCount; i++) {
      const cell = rows.nth(i).getByRole('gridcell').nth(colIndex);
      const text = await cell.innerText();
      values.push(text.trim());
    }
    return values;
  }

  async getColumnIndex(header: string): Promise<number> {
    const headerCells = this.grid.getByRole('columnheader');
    const count = await headerCells.count();
    for (let i = 0; i < count; i++) {
      if ((await headerCells.nth(i).innerText()).trim() === header) {
        return i;
      }
    }
    throw new Error(`Column header "${header}" not found.`);
  }

  async clickCell(header: string, rowIndex: number) {
    const cell = await this.getCellByHeaderAndIndex(header, rowIndex);
    await cell.click();
  }

  async editCell(header: string, rowIndex: number, value: string) {
    const cell = await this.getCellByHeaderAndIndex(header, rowIndex);
    await cell.click();
    await cell.fill(value);
  }

  async findRowIndexByCellValue(header: string, value: string): Promise<number> {
    const colIndex = await this.getColumnIndex(header);
    const rows = this.grid.getByRole('row');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const cell = rows.nth(i).getByRole('gridcell').nth(colIndex);
      const text = await cell.innerText();
      if (text.trim() === value) {
        return i;
      }
    }
    return -1;
  }

  async expectRowValues(rowIndex: number, expectedValues: string[]) {
    const actualValues = await this.getRowValues(rowIndex);
    expect(actualValues).toEqual(expectedValues);
  }

  async expectColumnValues(header: string, expectedValues: string[]) {
    const actualValues = await this.getColumnValues(header);
    expect(actualValues).toEqual(expectedValues);
  }

  async getCellByHeaderAndIndex(header: string, rowIndex: number): Promise<Locator> {
    // Find the header cell index
    const headerCells = this.grid.getByRole('columnheader');
    const count = await headerCells.count();
    
    if (count === 0) {
      throw new Error('No column headers found in the grid.');
    }
    
    let colIndex = -1;
    for (let i = 0; i < count; i++) {
      const headerText = (await headerCells.nth(i).innerText()).trim();
      // Debug: log header text
      console.log(`Header[${i}]: ${headerText}`);
      if (headerText === header) {
        colIndex = i;
        break;
      }
    }
    
    console.log(`Requested header: ${header}, resolved colIndex: ${colIndex}`);
    if (colIndex === -1) throw new Error(`Column header "${header}" not found.`);

    // Find the row and cell by index
    // The first row is the header, so data rows start at index 1
    const actualRowIndex = rowIndex + 1;
    
    // Check if row exists
    const rowCount = await this.grid.getByRole('row').count();
    if (actualRowIndex >= rowCount) {
      throw new Error(`Row at index ${rowIndex} (actual ${actualRowIndex}) not found. Grid has ${rowCount} rows.`);
    }
    
    const row = this.grid.getByRole('row').nth(actualRowIndex);
    const cellCount = await row.getByRole('gridcell').count();
    
    if (colIndex >= cellCount) {
      console.warn(`Cell at colIndex ${colIndex} not found in row ${actualRowIndex}. Row has ${cellCount} cells.`);
    }
    
    const cell = row.getByRole('gridcell').nth(colIndex);
    
    // Debug: log rowIndex and cell information
    console.log(`Requested logical rowIndex: ${rowIndex}, actualRowIndex: ${actualRowIndex}, cellCount in row: ${cellCount}, colIndex: ${colIndex}`);
    
    try {
      const cellText = await cell.innerText();
      console.log(`Cell value at [${actualRowIndex},${colIndex}]: ${cellText}`);
    } catch (error) {
      console.warn(`Could not get text from cell at [${actualRowIndex},${colIndex}]: ${error.message}`);
    }
    
    return cell;
  }

  async expectCellValue(header: string, rowIndex: number, expectedValue: string) {
    const cell = await this.getCellByHeaderAndIndex(header, rowIndex);
    await expect(cell).toHaveText(expectedValue);
  }

  /**
   * Gets the text of a cell, handling cases where the cell might not exist
   */
  async getCellText(header: string, rowIndex: number): Promise<string> {
    try {
      const cell = await this.getCellByHeaderAndIndex(header, rowIndex);
      return (await cell.innerText()).trim();
    } catch (error) {
      console.log(`Error getting cell text: ${error.message}`);
      return ''; // Return empty string for missing cells
    }
  }

  /**
   * Pagination methods
   */
  async goToNextPage(): Promise<void> {
    const nextPageButton = this.page.getByRole('button', { name: 'Next Page' });
    if (await nextPageButton.isEnabled()) {
      await nextPageButton.click();
    }
  }

  async goToPreviousPage(): Promise<void> {
    const prevPageButton = this.page.getByRole('button', { name: 'Previous Page' });
    if (await prevPageButton.isEnabled()) {
      await prevPageButton.click();
    }
  }

  async goToFirstPage(): Promise<void> {
    const firstPageButton = this.page.getByRole('button', { name: 'First Page' });
    if (await firstPageButton.isEnabled()) {
      await firstPageButton.click();
    }
  }

  async goToLastPage(): Promise<void> {
    const lastPageButton = this.page.getByRole('button', { name: 'Last Page' });
    if (await lastPageButton.isEnabled()) {
      await lastPageButton.click();
    }
  }

  async getCurrentPage(): Promise<number> {
    const pageText = await this.page.locator('text=Page').locator('xpath=following-sibling::*[1]').innerText();
    return parseInt(pageText.trim(), 10);
  }

  async getTotalPages(): Promise<number> {
    const totalText = await this.page.locator('text=of').locator('xpath=following-sibling::*[1]').innerText();
    return parseInt(totalText.trim(), 10);
  }

  async setPageSize(size: string): Promise<void> {
    const pageSizeCombobox = this.page.getByLabel('Page Size');
    await pageSizeCombobox.click();
    await this.page.getByRole('option', { name: size }).click();
  }

  /**
   * Filtering methods
   */
  async clearAllFilters(): Promise<void> {
    await this.page.getByRole('button', { name: 'Clear Filters' }).click();
  }

  async filterByColumn(header: string, filterValue: string): Promise<void> {
    // Find the header cell
    const headerCells = this.grid.getByRole('columnheader');
    const count = await headerCells.count();
    let headerCell: Locator | null = null;
    
    for (let i = 0; i < count; i++) {
      const headerText = (await headerCells.nth(i).innerText()).trim();
      if (headerText === header) {
        headerCell = headerCells.nth(i);
        break;
      }
    }
    
    if (!headerCell) {
      throw new Error(`Column header "${header}" not found.`);
    }
    
  // Click on the filter button in the header
  // Use data-ref="eFilterButton" which is the filter button's attribute
  const filterButton = headerCell.locator('[data-ref="eFilterButton"]');
  await filterButton.click();
    
    // Wait briefly for the filter panel to appear
    await this.page.waitForTimeout(500);
    
    // Enter filter value in the first filter input
    // Use first() to handle cases where multiple filter inputs may be present
    const filterInput = this.page.getByPlaceholder('Filter...').first();
    await filterInput.fill(filterValue);
    
    // Press Enter to apply the filter
    await filterInput.press('Enter');
  }

  /**
   * Sorting methods
   */
  async sortByColumn(header: string, direction: 'asc' | 'desc' = 'asc'): Promise<void> {
    // Find the header cell
    const headerCells = this.grid.getByRole('columnheader');
    const count = await headerCells.count();
    let headerCell: Locator | null = null;
    
    for (let i = 0; i < count; i++) {
      const headerText = (await headerCells.nth(i).innerText()).trim();
      if (headerText === header) {
        headerCell = headerCells.nth(i);
        break;
      }
    }
    
    if (!headerCell) {
      throw new Error(`Column header "${header}" not found.`);
    }
    
    // Click once for ascending, twice for descending
    await headerCell.click();
    if (direction === 'desc') {
      await headerCell.click();
    }
  }

  /**
   * Batch operations for improved performance
   */
  async getAllHeaderTexts(): Promise<string[]> {
    const headerCells = this.grid.getByRole('columnheader');
    const count = await headerCells.count();
    const headers: string[] = [];
    
    for (let i = 0; i < count; i++) {
      headers.push((await headerCells.nth(i).innerText()).trim());
    }
    
    return headers;
  }

  async getAllRowData(): Promise<string[][]> {
    const rows = this.grid.getByRole('row');
    const rowCount = await rows.count();
    const result: string[][] = [];
    
    // Skip the header row (index 0)
    for (let i = 1; i < rowCount; i++) {
      result.push(await this.getRowValues(i));
    }
    
    return result;
  }

  /**
   * Check if a row exists with the given values in the specified columns
   * @param columnValuePairs Map of column names to expected values
   */
  async rowExistsWithValues(columnValuePairs: Map<string, string>): Promise<boolean> {
    const columnIndices = new Map<string, number>();
    
    // First, get all the column indices we need
    for (const columnName of columnValuePairs.keys()) {
      try {
        const index = await this.getColumnIndex(columnName);
        columnIndices.set(columnName, index);
      } catch (error) {
        console.error(`Column not found: ${columnName}`);
        return false;
      }
    }
    
    // Now check each row
    const rows = this.grid.getByRole('row');
    const rowCount = await rows.count();
    
    // Skip the header row (index 0)
    for (let rowIdx = 1; rowIdx < rowCount; rowIdx++) {
      let allMatch = true;
      const row = rows.nth(rowIdx);
      
      for (const [columnName, expectedValue] of columnValuePairs.entries()) {
        const colIdx = columnIndices.get(columnName)!;
        const cell = row.getByRole('gridcell').nth(colIdx);
        const actualValue = (await cell.innerText()).trim();
        
        if (actualValue !== expectedValue) {
          allMatch = false;
          break;
        }
      }
      
      if (allMatch) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Wait for the grid to load or update
   */
  // async waitForGridToLoad(): Promise<void> {
  //   // Wait for loading indicator to disappear if present
  //   const loadingIndicator = this.page.getByRole('progressbar').first();
  //   try {
  //     await loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
  //   } catch (error) {
  //     // If timeout or element not found, continue - it means there was no loading indicator
  //   }
    
  //   // Make sure the grid is present
  //   await this.grid.waitFor({ state: 'visible', timeout: 5000 });
    
  //   // Wait for at least one row or "No Rows To Show" message
  //   try {
  //     await this.page.waitForSelector(
  //       'div[role="treegrid"] div[role="row"], div[role="treegrid"] div:text-is("No Rows To Show")', 
  //       { timeout: 5000 }
  //     );
  //   } catch (error) {
  //     console.warn('Timed out waiting for grid rows or "No Rows To Show" message');
  //   }
  // }

  // grok version
  async waitForGridToLoad(options: { loadingTimeout?: number; gridTimeout?: number; rowsTimeout?: number } = {}): Promise<{ isEmpty: boolean }> {
    const { loadingTimeout = 10000, gridTimeout = 5000, rowsTimeout = 5000 } = options;

    if (!this.page || !this.grid) {
      throw new Error('Page or grid locator not initialized.');
    }

    // Wait for loading indicator to disappear
    const loadingIndicator = this.page.getByRole('progressbar').first();
    try {
      await loadingIndicator.waitFor({ state: 'hidden', timeout: loadingTimeout });
    } catch (error) {
      if (error.name !== 'TimeoutError' && !error.message.includes('Locator expected to be hidden')) {
        console.warn('Unexpected error while waiting for loading indicator:', error.message);
      }
    }

    // Ensure grid is visible
    await this.grid.waitFor({ state: 'visible', timeout: gridTimeout });

    // Wait for rows or "No Rows To Show"
    const GRID_ROW_SELECTOR = 'div[role="treegrid"] div[role="row"]';
    const NO_ROWS_SELECTOR = 'div[role="treegrid"] div:text-is("No Rows To Show")';
    try {
      const element = await this.page.waitForSelector(`${GRID_ROW_SELECTOR}, ${NO_ROWS_SELECTOR}`, { timeout: rowsTimeout });
      const isEmpty = await element.evaluate(el => el.textContent === 'No Rows To Show');
      console.log(`Grid loaded ${isEmpty ? 'with no rows' : 'with rows'}.`);
      return { isEmpty };
    } catch (error) {
      console.warn('Timed out waiting for grid rows or "No Rows To Show" message:', error.message);
      return { isEmpty: false };
    }
  }
}
