import { Page, Locator } from '@playwright/test';
import { AutoComplete } from '../../../components/auto-complete.page';
import { DateTimePicker } from '../../../components/date-time-picker.page';

/**
 * Enum representing the possible status values for a subscription
 */
export enum SubscriptionStatus {
  IN_SUBSCRIPTION = 'In Subscription',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

/**
 * Enum representing the possible subscription types
 */
export enum SubscriptionType {
  DEVICE = 'Device',
  LOCATION = 'Location',
}

/**
 * Represents the Subscription Info component
 * Handles interactions with subscription-related fields
 */
export class SubscriptionInfo {
  readonly page: Page;
  readonly deviceOwnerDropdown: AutoComplete;
  readonly subscriptionTypeDropdown: AutoComplete;
  readonly referenceInput: Locator;
  readonly customerDropdown: AutoComplete;
  readonly relatedGonDropdown: AutoComplete;
  readonly statusDropdown: AutoComplete;
  readonly startDatePicker: DateTimePicker;
  readonly endDatePicker: DateTimePicker;
  
  constructor(page: Page) {
    this.page = page;
    
    // Dropdowns using AutoComplete component
  this.deviceOwnerDropdown = new AutoComplete(page.locator('[data-testid="device-owner"]'));
  this.subscriptionTypeDropdown = new AutoComplete(page.locator('[data-testid="subscription-type"]'));
  this.customerDropdown = new AutoComplete(page.locator('[data-testid="customer"]'));
  this.relatedGonDropdown = new AutoComplete(page.locator('[data-testid="related-gon"]'));
  this.statusDropdown = new AutoComplete(page.locator('[data-testid="status"]'));

    // Date pickers for subscription start and end dates
  this.startDatePicker = new DateTimePicker(page.locator('[data-testid="start-date"]'));
  this.endDatePicker = new DateTimePicker(page.locator('[data-testid="end-date"]'));
    
    // Text inputs for subscription details
    this.referenceInput = page.getByRole('textbox', { name: /Reference/i });
  }

  /**
   * Sets the device owner
   * @param deviceOwner Name of the device owner
   */
  async setDeviceOwner(deviceOwner: string): Promise<void> {
    await this.deviceOwnerDropdown.selectText(deviceOwner);
  }

  /**
   * Sets the subscription type
   * @param subscriptionType Type of subscription from SubscriptionType enum
   */
  async setSubscriptionType(subscriptionType: SubscriptionType): Promise<void> {
    await this.subscriptionTypeDropdown.selectText(subscriptionType);
  }

  /**
   * Sets the reference text
   * @param reference Reference text
   */
  async setReference(reference: string): Promise<void> {
    await this.referenceInput.fill(reference);
  }

  /**
   * Sets the customer
   * @param customer Customer name
   */
  async setCustomer(customer: string): Promise<void> {
    await this.customerDropdown.selectText(customer);
  }

  /**
   * Sets the related GON
   * @param relatedGon Related GON value
   */
  async setRelatedGon(relatedGon: string): Promise<void> {
    await this.relatedGonDropdown.selectText(relatedGon);
  }

  /**
   * Sets the subscription status
   * @param status Status from SubscriptionStatus enum
   */
  async setStatus(status: SubscriptionStatus): Promise<void> {
    await this.statusDropdown.selectText(status);
  }

  /**
   * Sets the subscription start date
   * @param date Date string in the format expected by the date picker
   */
  async setStartDate(date: string): Promise<void> {
    await this.startDatePicker.setDate(date);
  }

  /**
   * Sets the subscription end date
   * @param date Date string in the format expected by the date picker
   */
  async setEndDate(date: string): Promise<void> {
    await this.endDatePicker.setDate(date);
  }

  // Removed clickNext; use SubscriptionEditorPage.clickNextInfo instead

  /**
   * Fills all subscription information at once
   */
  async fillSubscriptionInfo({
    deviceOwner,
    subscriptionType,
    reference,
    customer,
    relatedGon,
    status,
    startDate,
    endDate
  }: {
    deviceOwner: string;
    subscriptionType: SubscriptionType;
    reference?: string;
    customer: string;
    relatedGon?: string;
    status: SubscriptionStatus;
    startDate: string;
    endDate?: string;
  }): Promise<void> {
    // Mandatory fields validation
    if (!deviceOwner) throw new Error('Device Owner is required');
    if (!subscriptionType) throw new Error('Subscription Type is required');
    if (!customer) throw new Error('Customer is required');
    if (!status) throw new Error('Status is required');
    if (!startDate) throw new Error('Start Date is required');

    await this.setDeviceOwner(deviceOwner);
    await this.setSubscriptionType(subscriptionType);
    if (reference) await this.setReference(reference);
    await this.setCustomer(customer);
    if (relatedGon && relatedGon.trim() !== '') await this.setRelatedGon(relatedGon);
    await this.setStatus(status);
    await this.setStartDate(startDate);
    if (endDate) await this.setEndDate(endDate);
  }

  /**
   * Checks if the form is valid (Next button is enabled)
   * @returns true if the form is valid (Next button is enabled), false otherwise
   */
  async isFormValid(nextButtonInfo: Locator): Promise<boolean> {
    return await nextButtonInfo.isEnabled();
  }
}
