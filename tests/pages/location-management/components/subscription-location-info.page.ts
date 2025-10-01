import { Page, Locator } from '@playwright/test';
import { AutoComplete } from '../../../components/auto-complete.page';
import { DateTimePicker } from '../../../components/date-time-picker.page';
import { LocationStatus } from '../location-editor.page';

/**
 * Represents the Subscription Location Info component
 * Handles interactions with subscription-related fields for locations
 */
export class SubscriptionLocationInfo {
 
  readonly page: Page;
  readonly statusDropdown: AutoComplete;
  readonly startDatePicker: DateTimePicker;
  readonly endDatePicker: DateTimePicker;
  readonly subscriptionIdDropdown: AutoComplete;
  readonly referenceInput: Locator;
  readonly locationNameInput: Locator;
  
  constructor(page: Page) {
    this.page = page;
    // Use data-testid on parent for robust selectors
    this.statusDropdown = new AutoComplete(page.locator('[data-testid="status"]'));
    this.startDatePicker = new DateTimePicker(page.locator('[data-testid="start-date"]'));
    this.endDatePicker = new DateTimePicker(page.locator('[data-testid="end-date"]'));
    this.subscriptionIdDropdown = new AutoComplete(page.locator('[data-testid="subscription-id"]'));
    this.referenceInput = page.locator('[data-testid="location-ref"]');
    this.locationNameInput = page.locator('[data-testid="location-name"]');
  }

  /**
   * Sets the subscription status
   * @param status Status to set from LocationStatus enum
   */
  async setStatus(status: LocationStatus) {
    await this.statusDropdown.selectText(status);
  }

  /**
   * Sets the subscription start date
   * @param date Date string in the format expected by the date picker
   */
  async setStartDate(date: string) {
    await this.startDatePicker.setDate(date);
  }

  /**
   * Sets the subscription end date
   * @param date Date string in the format expected by the date picker
   */
  async setEndDate(date: string) {
    await this.endDatePicker.setDate(date);
  }

  /**
   * Sets the subscription ID using the AutoComplete component
   * @param id Subscription ID to select
   */
  async setSubscriptionId(id: string) {
    // Use the AutoComplete component's selectText method
    await this.subscriptionIdDropdown.selectText(id);
  }

 /**
   * Sets the location name
   * @param locationName Location name to set
   */
  async setName(locationName: string) {
    await this.locationNameInput.fill(locationName);
  }

  /**
   * Sets the reference text
   * @param reference Reference text to set
   */
  async setReference(reference: string) {
    await this.referenceInput.fill(reference);
  }

  /**
   * Fills all subscription information at once, including location name
   */
  async fillSubscriptionInfo({
    subscriptionId,
    status,
    startDate,
    endDate,
    name,
    reference
  }: {
    subscriptionId?: string;
    status?: LocationStatus;
    startDate?: string;
    endDate?: string;
    name?: string;
    reference?: string;
  }) {
    if (subscriptionId) await this.setSubscriptionId(subscriptionId);
    if (status) await this.setStatus(status);
    if (startDate) await this.setStartDate(startDate);
    if (endDate) await this.setEndDate(endDate);
    if (name) await this.setName(name);
    if (reference) await this.setReference(reference);
  }
}
