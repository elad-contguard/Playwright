import { Page, Locator } from '@playwright/test';
import { AutoComplete } from '../../components/auto-complete.page';
import { DateTimePicker } from '../../components/date-time-picker.page';
import { DialogModal } from '../../components/dialog-modal.page';
import { SubscriptionLocationInfo } from './components/subscription-location-info.page';
import { DeviceSubscriptionOperations } from './components/device-subscription-operations.page';

/**
 * Enum representing the possible status values for a location
 */
export enum LocationStatus {
  IN_SUBSCRIPTION = 'In Subscription',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

/**
 * Represents the Location Editor page/dialog
 * Provides methods to interact with location creation/editing functionality
 */
export class LocationEditor {
  readonly page: Page;
  readonly heading: Locator;
  readonly locationNameInput: Locator;
  readonly locationRefInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly nextButton: Locator;
  readonly subscriptionLocationInfo: SubscriptionLocationInfo;
  readonly bulkOperationsTab: Locator;
  readonly deviceSubscriptionOperations: DeviceSubscriptionOperations;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /New Subscription Location|Edit Location/i });
    this.locationNameInput = page.getByRole('textbox', { name: /Location Name/i });
    this.locationRefInput = page.getByRole('textbox', { name: /Location Ref/i });
    this.saveButton = page.getByRole('button', { name: /Save/i }).first();
    this.cancelButton = page.getByRole('button', { name: /Cancel/i }).first();
    this.nextButton = page.getByRole('button', { name: /Next/i }).first();
    this.bulkOperationsTab = page.getByRole('tab', { name: /Bulk Operations/i });
    
    // Initialize page components
    this.subscriptionLocationInfo = new SubscriptionLocationInfo(page);
    this.deviceSubscriptionOperations = new DeviceSubscriptionOperations(page);
  }

  /**
   * Fills in the required fields to create a new location
   */
  async fillLocationDetails({
    name,
    ref,
    subscriptionId,
    status = LocationStatus.IN_SUBSCRIPTION,
    startDate,
    endDate,
    reference,
    notes
  }: {
    name: string;
    ref?: string;
    subscriptionId?: string;
    status?: LocationStatus;
    startDate?: string;
    endDate?: string;
    reference?: string;
    notes?: string;
  }) {
    // Fill the location name and ref fields
    await this.locationNameInput.fill(name);
    
    if (ref) {
      await this.locationRefInput.fill(ref);
    }
    
    // Use the SubscriptionLocationInfo component to fill subscription-related fields
    await this.subscriptionLocationInfo.fillSubscriptionInfo({
      subscriptionId,
      status,
      startDate,
      endDate,
      reference,
      notes
    });
  }

  /**
   * Saves the current location (clicks the Save button)
   * @param expectSuccessDialog If true, waits for and handles the success dialog
   * @returns The dialog modal if expectSuccessDialog is true, otherwise undefined
   */
  async save(expectSuccessDialog: boolean = true): Promise<DialogModal | undefined> {
    await this.saveButton.click();
    
    if (expectSuccessDialog) {
      // Create a dialog modal instance to handle the success popup
      const dialogModal = new DialogModal(this.page);
      
      // Wait for the success dialog to appear
      await dialogModal.waitForVisible();
      
      // Verify it's a success dialog (optional)
      const title = await dialogModal.getTitle();
      if (!title.includes('Success')) {
        throw new Error(`Expected success dialog but found dialog with title: ${title}`);
      }
      
      return dialogModal;
    }
    
    return undefined;
  }

  /**
   * Moves to the next tab (clicks the Next button)
   */
  async next() {
    await this.nextButton.click();
  }

  /**
   * Cancels the location editing (clicks the Cancel button)
   */
  async cancel() {
    await this.cancelButton.click();
  }
  
  /**
   * Navigates to the Bulk Operations tab
   */
  async navigateToBulkOperationsTab() {
    await this.bulkOperationsTab.click();
    // Wait for the bulk operations panel to be visible
    await this.page.waitForTimeout(500); // Short wait for animation/rendering
  }
  
  /**
   * Performs device subscription operations in the bulk operations tab
   * @param options Configuration for device subscription operations
   */
  async performDeviceSubscriptionOperations(options: {
    devicesToStart?: string[];
    startDate?: string;
    devicesToEnd?: string[];
    endDate?: string;
  }) {
    // Navigate to the bulk operations tab
    await this.navigateToBulkOperationsTab();
    
    // Perform the requested device subscription operations
    if (options.devicesToStart && options.devicesToStart.length > 0) {
      await this.deviceSubscriptionOperations.selectDevicesToStart(options.devicesToStart);
      
      if (options.startDate) {
        await this.deviceSubscriptionOperations.setNewStartDate(options.startDate);
      }
    }
    
    if (options.devicesToEnd && options.devicesToEnd.length > 0) {
      await this.deviceSubscriptionOperations.selectDevicesToEnd(options.devicesToEnd);
      
      if (options.endDate) {
        await this.deviceSubscriptionOperations.setNewEndDate(options.endDate);
      }
    }
  }
}
