import { Page, Locator } from '@playwright/test';
import { DateTimePicker } from '../../../components/date-time-picker.page';
import { TagsSelector } from '../../../components/tags-selector.page';
import { TextareaField } from '../../../components/textarea-field.page';

/**
 * Represents the Bulk Operations component in the subscription management form
 * This is the second tab in the subscription creation/edit flow
 */
export class BulkOperations {
  readonly page: Page;
  
  // Start Subscription for Devices section
  readonly startSubscriptionDevicesSelector: TagsSelector;
  readonly startDatePicker: DateTimePicker;
  readonly selectedDevicesCounter: Locator;

  // End Subscription for Devices section
  readonly endDatePicker: DateTimePicker;
  readonly endSubscriptionDevicesSelector: TagsSelector;

  // Location Subscription Type
  readonly locationsField: TextareaField;
  
  constructor(page: Page) {
    this.page = page;

  // Start Subscription for Devices section
  this.startSubscriptionDevicesSelector = new TagsSelector(page.locator('[data-testid="start-subscription-devices"]'));
  this.startDatePicker = new DateTimePicker(page.locator('[data-testid="start-subscription-date"]'));
  this.selectedDevicesCounter = page.locator('text=/selected devices:/i');

    // End Subscription for Devices section
  this.endSubscriptionDevicesSelector = new TagsSelector(page.locator('[data-testid="end-subscription-devices"]'));
    this.endDatePicker = new DateTimePicker(page.locator('[data-testid="end-subscription-date"]'));

  // Location Subscription Type
  this.locationsField = new TextareaField(page, 'Locations');
  }

  /**
   * Opens the device selection dropdown and selects a device
   * @param deviceId The ID of the device to select
   */
  async selectDevice(deviceId: string): Promise<void> {
  await this.startSubscriptionDevicesSelector.selectTags([deviceId]);
  }

  /**
   * Selects multiple devices by their IDs
   * @param deviceIds Array of device IDs to select
   */
  async selectMultipleDevices(deviceIds: string[]): Promise<void> {
  await this.startSubscriptionDevicesSelector.selectTags(deviceIds);
  }

  /**
   * Removes a device from selection by clicking on its remove button
   * @param deviceId The ID of the device to remove
   */
  async removeSelectedDevice(deviceId: string): Promise<void> {
    const deviceTag = this.page.locator(`[role="gridcell"]:has-text("${deviceId}")`);
    const removeButton = deviceTag.locator('button').filter({ hasText: 'cancel' });
    await removeButton.click();
  }

  /**
   * Fills the Locations textarea for Location Subscription Type
   * @param locations - String of locations (comma or newline separated)
   */
  async fillLocations(locations: string): Promise<void> {
    await this.locationsField.fill(locations);
  }

  /**
   * Sets the start date for selected devices
   * @param date Date in MM/DD/YYYY format
   */
  async setStartDate(date: string): Promise<void> {
    await this.startDatePicker.setDate(date);
  }

  /**
   * Opens the calendar to select a start date
   */
  async openStartDateCalendar(): Promise<void> {
    await this.startDatePicker.openCalendar();
  }

  /**
   * Selects a date from the start date calendar
   * @param day Day number to select
   * @param month Month name (e.g., 'September')
   * @param year Year (e.g., '2025')
   */
  async selectStartDateFromCalendar(day: number, month: string, year: string): Promise<void> {
    await this.startDatePicker.selectDateFromCalendar(day, month, year);
  }
  
  /**
   * Selects a date from the end date calendar
   * @param day Day number to select
   * @param month Month name (e.g., 'September')
   * @param year Year (e.g., '2025')
   */
  async selectEndDateFromCalendar(day: number, month: string, year: string): Promise<void> {
    await this.endDatePicker.selectDateFromCalendar(day, month, year);
  }

  /**
   * Gets the count of selected devices
   * @returns The number of selected devices
   */
  async getSelectedDeviceCount(): Promise<number> {
    const selectedText = await this.selectedDevicesCounter.innerText();
    const match = selectedText.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Selects devices for ending their subscription
   * @param deviceId The ID of the device to select
   */
  async selectDeviceForEndSubscription(deviceId: string): Promise<void> {
    await this.endSubscriptionDevicesSelector.selectTags([deviceId]);
  }
  
  /**
   * Selects multiple devices for ending their subscription
   * @param deviceIds Array of device IDs to select
   */
  async selectMultipleDevicesForEndSubscription(deviceIds: string[]): Promise<void> {
    await this.endSubscriptionDevicesSelector.selectTags(deviceIds);
  }

  /**
   * Sets the end date for selected devices
   * @param date Date in MM/DD/YYYY format
   */
  async setEndDate(date: string): Promise<void> {
    await this.endDatePicker.setDate(date);
  }

  /**
   * Opens the calendar to select an end date
   */
  async openEndDateCalendar(): Promise<void> {
    await this.endDatePicker.openCalendar();
  }

  /**
   * Confirms the success dialog by clicking OK
   */
  async confirmSuccess(): Promise<void> {
    await this.page.getByRole('button', { name: 'OK' }).click();
  }
}
