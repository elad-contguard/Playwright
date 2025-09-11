import { Page, Locator } from '@playwright/test';
import { DialogModal } from '../../../components/dialog-modal.page';
import { AutoComplete } from '../../../components/auto-complete.page';

/**
 * Represents the Bulk Operations component for locations
 * Handles interactions with bulk operations like status changes, assignment, etc.
 */
export class BulkOperations {
  readonly page: Page;
  readonly bulkActionsButton: Locator;
  readonly assignCustomerButton: Locator;
  readonly assignDeviceOwnerButton: Locator;
  readonly changeStatusButton: Locator;
  readonly deleteLocationsButton: Locator;
  readonly modal: DialogModal;
  
  constructor(page: Page) {
    this.page = page;
    this.bulkActionsButton = page.getByRole('button', { name: /Bulk Actions/i });
    this.assignCustomerButton = page.getByRole('menuitem', { name: /Assign Customer/i });
    this.assignDeviceOwnerButton = page.getByRole('menuitem', { name: /Assign Device Owner/i });
    this.changeStatusButton = page.getByRole('menuitem', { name: /Change Status/i });
    this.deleteLocationsButton = page.getByRole('menuitem', { name: /Delete Locations/i });
    this.modal = new DialogModal(page);
  }

  /**
   * Opens the Bulk Actions menu
   */
  async openBulkActionsMenu() {
    await this.bulkActionsButton.click();
  }

  /**
   * Selects multiple locations in the grid by their indices
   * @param indices Array of row indices to select (0-based, excluding header row)
   */
  async selectLocations(indices: number[]) {
    // Find all rows in the grid (excluding header)
    const rows = this.page.locator('tbody tr');
    
    // Click on each checkbox in the specified rows
    for (const index of indices) {
      // Add 1 to skip header row if needed
      const actualIndex = index + 1;
      const checkbox = rows.nth(actualIndex).locator('input[type="checkbox"]').first();
      await checkbox.click();
    }
  }

  /**
   * Assigns a customer to selected locations
   * @param customerName Name of customer to assign
   */
  async assignCustomer(customerName: string) {
    await this.openBulkActionsMenu();
    await this.assignCustomerButton.click();
    
    // Wait for the modal dialog
    await this.modal.waitForVisible();
    
    // Fill customer dropdown
    const customerDropdown = new AutoComplete(this.page, 'Customer');
    await customerDropdown.selectText(customerName);
    
    // Confirm the operation
    await this.modal.clickConfirm();
  }

  /**
   * Assigns a device owner to selected locations
   * @param deviceOwnerName Name of device owner to assign
   */
  async assignDeviceOwner(deviceOwnerName: string) {
    await this.openBulkActionsMenu();
    await this.assignDeviceOwnerButton.click();
    
    // Wait for the modal dialog
    await this.modal.waitForVisible();
    
    // Fill device owner dropdown
    const deviceOwnerDropdown = new AutoComplete(this.page, 'Device Owner');
    await deviceOwnerDropdown.selectText(deviceOwnerName);
    
    // Confirm the operation
    await this.modal.clickConfirm();
  }

  /**
   * Changes the status of selected locations
   * @param status New status to set (e.g., 'In Subscription', 'Completed', 'Cancelled')
   */
  async changeStatus(status: string) {
    await this.openBulkActionsMenu();
    await this.changeStatusButton.click();
    
    // Wait for the modal dialog
    await this.modal.waitForVisible();
    
    // Fill status dropdown
    const statusDropdown = new AutoComplete(this.page, 'Status');
    await statusDropdown.selectText(status);
    
    // Confirm the operation
    await this.modal.clickConfirm();
  }

  /**
   * Deletes the selected locations
   * @param confirmText Optional text to enter in confirmation field
   */
  async deleteLocations(confirmText?: string) {
    await this.openBulkActionsMenu();
    await this.deleteLocationsButton.click();
    
    // Wait for the modal dialog
    await this.modal.waitForVisible();
    
    // Enter confirmation text if required
    if (confirmText) {
      const confirmInput = this.page.getByRole('textbox', { name: /confirmation/i });
      if (await confirmInput.isVisible()) {
        await confirmInput.fill(confirmText);
      }
    }
    
    // Confirm the deletion
    await this.modal.clickConfirm();
  }
}
