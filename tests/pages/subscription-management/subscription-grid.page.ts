import { Locator, Page } from '@playwright/test';
import { AgGridPage } from '../../components/ag-grid.page';

/**
 * Page object representing the Subscription Management grid view
 */
export class SubscriptionGridPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly createButton: Locator;
  readonly grid: AgGridPage;
  
  // Filters
  readonly filterButton: Locator;
  
  /**
   * Creates a new instance of the SubscriptionGridPage
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Subscriptions', level: 2 });
    this.createButton = page.getByRole('button', { name: 'add' }).first();
    
    // Initialize the grid using the AgGridPage component
    this.grid = new AgGridPage(page);
    
    // Filter elements
    this.filterButton = page.getByRole('button', { name: 'filter_list' });
  }

  /**
   * Navigates to the subscription management page
   */
  async navigateToSubscriptions() {
    await this.page.goto('/subscription-management');
  }

  /**
   * Clicks the create button to create a new subscription
   */
  async clickCreateButton() {
    await this.createButton.click();
  }

  /**
   * Opens the filters panel
   */
  async openFilters() {
    await this.filterButton.click();
  }

  /**
   * Filters the grid by reference ID
   * @param reference - The reference ID to filter for
   */
  async filterByReference(reference: string) {
    await this.grid.filterByColumn('Reference', reference);
  }

  /**
   * Filters the grid by customer name
   * @param customerName - The customer name to filter for
   */
  async filterByCustomer(customerName: string) {
    await this.grid.filterByColumn('Customer', customerName);
  }

  /**
   * Filters the grid by status
   * @param status - The status to filter for
   */
  async filterByStatus(status: string) {
    await this.grid.filterByColumn('Status', status);
  }

  /**
   * Opens a subscription by clicking on a specific row
   * @param reference - The reference ID of the subscription to open
   */
  async openSubscription(reference: string) {
    await this.filterByReference(reference);
    
    // Find the row with this reference and click on it
    const rowIndex = await this.grid.findRowIndexByCellValue('Reference', reference);
    if (rowIndex !== -1) {
      await this.grid.clickCell('Reference', rowIndex - 1); // Adjust for header row
    } else {
      throw new Error(`Subscription with reference "${reference}" not found.`);
    }
  }

  /**
   * Gets the total number of subscriptions displayed in the grid
   * @returns The number of subscriptions
   */
  async getSubscriptionCount(): Promise<number> {
    return await this.grid.getRowCount();
  }
}
