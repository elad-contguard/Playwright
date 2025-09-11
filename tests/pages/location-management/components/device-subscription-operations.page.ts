import { Page, Locator } from '@playwright/test';
import { DateTimePicker } from '../../../components/date-time-picker.page';
import { AutoComplete } from '../../../components/auto-complete.page';

/**
 * Represents the Device Subscription Operations component in the Bulk Operations tab
 * of the Location Editor
 */
export class DeviceSubscriptionOperations {
  readonly page: Page;
  readonly heading: Locator;
  readonly endSubscriptionHeading: Locator;
  readonly selectDevicesDropdown: AutoComplete;
  readonly endSelectDevicesDropdown: AutoComplete;
  readonly newStartDatePicker: DateTimePicker;
  readonly newEndDatePicker: DateTimePicker;
  readonly backButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly selectedDevicesCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Start Subscription for Devices/i });
    this.endSubscriptionHeading = page.getByRole('heading', { name: /End Subscription for Devices/i });
    this.selectDevicesDropdown = new AutoComplete(page, 'Select Devices');
    this.endSelectDevicesDropdown = new AutoComplete(page, 'Select Devices', 1); // Second instance of "Select Devices"
    this.newStartDatePicker = new DateTimePicker(page, 'New Start Date');
    this.newEndDatePicker = new DateTimePicker(page, 'New End Date');
    this.backButton = page.getByRole('button', { name: /Back/i }).first();
    this.saveButton = page.getByRole('button', { name: /Save/i }).first();
    this.cancelButton = page.getByRole('button', { name: /Cancel/i }).first();
    this.selectedDevicesCount = page.locator('text=/selected devices: \\d+/');
  }

  /**
   * Selects devices to start subscription
   * @param deviceNames Array of device names or IDs to select
   */
  async selectDevicesToStart(deviceNames: string[]) {
    for (const deviceName of deviceNames) {
      await this.selectDevicesDropdown.selectText(deviceName);
      // Add a small delay between selections
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Sets the new start date for selected devices
   * @param startDate Date string to set
   */
  async setNewStartDate(startDate: string) {
    await this.newStartDatePicker.setDate(startDate);
  }

  /**
   * Selects devices to end subscription
   * @param deviceNames Array of device names or IDs to select
   */
  async selectDevicesToEnd(deviceNames: string[]) {
    for (const deviceName of deviceNames) {
      await this.endSelectDevicesDropdown.selectText(deviceName);
      // Add a small delay between selections
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Sets the new end date for selected devices
   * @param endDate Date string to set
   */
  async setNewEndDate(endDate: string) {
    await this.newEndDatePicker.setDate(endDate);
  }

  /**
   * Gets the current count of selected devices
   */
  async getSelectedDevicesCount(): Promise<number> {
    const countText = await this.selectedDevicesCount.innerText();
    const match = countText.match(/selected devices: (\d+)/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 0;
  }

  /**
   * Saves the bulk device subscription changes
   */
  async save() {
    await this.saveButton.click();
  }

  /**
   * Goes back to the previous tab
   */
  async back() {
    await this.backButton.click();
  }

  /**
   * Cancels the location editor
   */
  async cancel() {
    await this.cancelButton.click();
  }
}
