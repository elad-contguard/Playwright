import { Page, Locator, expect } from '@playwright/test';
import { NavBar } from '../../components/nav-bar.page';
import { ActionsBar, ActionsBarButton } from '../../components/actions-bar.page';
import { AgGridPage } from '../../components/ag-grid.page';

export class RouteManagementGridPage {
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
    this.heading = page.getByRole('heading', { name: /Route Templates/i });
    this.table = page.getByRole('treegrid');
    this.rows = this.table.getByRole('row');
    this.pageSizeCombo = page.getByRole('combobox', { name: /Page Size/i });
    this.nextPageButton = page.getByRole('button', { name: /Next Page/i });
    this.lastPageButton = page.getByRole('button', { name: /Last Page/i });
    this.navBar = new NavBar(page);
    this.actionsBar = new ActionsBar(page);
    this.grid = new AgGridPage(page);
    // this.paginationText = page.locator('text=/\\d+ to \\d+ of \\d+/');

  }

  async startCreateRoute() {
    await this.actionsBar.clickButton(ActionsBarButton.CreateNew);
    // Add logic to handle the route creation dialog/form
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

  getRouteEditor() {
    // Assumes the route creation dialog is open and visible
    const { RouteEditor } = require('./route-editor.page');
    return new RouteEditor(this.page);
  }

  async saveRoute() {
    // Assumes the Save button is visible in the route creation dialog
    const saveButton = this.page.getByRole('button', { name: /Save/i });
    await saveButton.click();
  }

  /**
   * Gets the total number of routes from the heading text
   * Example: "Route Templates (512)" returns 512
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
   * Gets the total number of routes from the pagination text
   * Example: "1 to 100 of 512" or "1 to 100 of 1,588" returns 512/1588
   */
  async getTotalCountFromPagination(): Promise<number> {
    // First look for visible text elements that might contain pagination info
    try {
      // Try the pagination text at the bottom of the page
      const bottomPaginationText = await this.page.locator('text=1 to').first().innerText();
      console.log(`Bottom pagination text: "${bottomPaginationText}"`);
      
      // Match numbers with commas
      let match = bottomPaginationText.match(/of ([\d,]+)/);
      if (match && match[1]) {
        return parseInt(match[1].replace(/,/g, ''), 10);
      }
    } catch (e) {
      console.log(`No pagination text found with specific format, trying alternatives`);
    }

    // Try using page.innerText to get all text on the page and extract pagination info
    const pageText = await this.page.innerText('body');
    
    // Look for patterns like "1 to 100 of 1,588" or similar
    let textMatch = pageText.match(/\d+\s+to\s+\d+\s+of\s+([\d,]+)/);
    if (textMatch && textMatch[1]) {
      return parseInt(textMatch[1].replace(/,/g, ''), 10);
    }
    
    // Try another pattern: "of 1,588"
    textMatch = pageText.match(/of\s+([\d,]+)/);
    if (textMatch && textMatch[1]) {
      return parseInt(textMatch[1].replace(/,/g, ''), 10);
    }

    // Try using the locator for the specific area where pagination is displayed
    const paginationArea = this.page.locator('.ag-paging-panel');
    if (await paginationArea.count() > 0) {
      const paginationAreaText = await paginationArea.innerText();
      console.log(`Pagination area text: "${paginationAreaText}"`);
      
      const areaMatch = paginationAreaText.match(/of\s+([\d,]+)/);
      if (areaMatch && areaMatch[1]) {
        return parseInt(areaMatch[1].replace(/,/g, ''), 10);
      }
    }
    
    // If all else fails, try to use grid API to get row count
    console.warn('Could not extract pagination count from UI, falling back to grid row count');
    return await this.grid.getRowCount();
  }
}
