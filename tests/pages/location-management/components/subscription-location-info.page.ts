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
  readonly notesTextarea: Locator;
  
  constructor(page: Page) {
    this.page = page;
    // Status dropdown to select location status (In Subscription, Completed, Cancelled, etc.)
    this.statusDropdown = new AutoComplete(page, 'Status');
    
    // Date pickers for subscription start and end dates
    this.startDatePicker = new DateTimePicker(page, 'Start Date');
    this.endDatePicker = new DateTimePicker(page, 'End Date');
    
    // Use AutoComplete component for subscription ID
    this.subscriptionIdDropdown = new AutoComplete(page, 'Subscription ID');
    
    // Text inputs for subscription details
    this.referenceInput = page.getByRole('textbox', { name: /Location Ref/i });
    // Notes field might not be present in all forms
    this.notesTextarea = page.getByRole('textbox', { name: /Notes/i }).or(page.getByRole('textbox', { name: /Description/i })).or(page.locator('textarea')).first();
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
   * Sets the reference text
   * @param reference Reference text to set
   */
  async setReference(reference: string) {
    await this.referenceInput.fill(reference);
  }

  /**
   * Sets notes for the subscription
   * @param notes Notes text to set
   */
  async setNotes(notes: string) {
    try {
      // Check if the notes field exists and is visible before filling
      await this.notesTextarea.waitFor({ state: 'visible', timeout: 2000 });
      await this.notesTextarea.fill(notes);
    } catch (error) {
      // If the notes field is not available, log a message and continue
      console.log('Notes field not available in the current form - skipping');
    }
  }

  /**
   * Fills all subscription information at once
   */
  async fillSubscriptionInfo({
    status,
    startDate,
    endDate,
    subscriptionId,
    reference,
    notes
  }: {
    status?: LocationStatus;
    startDate?: string;
    endDate?: string;
    subscriptionId?: string;
    reference?: string;
    notes?: string;
  }) {
    if (status) await this.setStatus(status);
    if (startDate) await this.setStartDate(startDate);
    if (endDate) await this.setEndDate(endDate);
    if (subscriptionId) await this.setSubscriptionId(subscriptionId);
    if (reference) await this.setReference(reference);
    if (notes) await this.setNotes(notes);
  }
}
