import { Page, Locator } from '@playwright/test';
import { AutoComplete } from '../../../components/auto-complete.page';
import { DateTimePicker } from '../../../components/date-time-picker.page';

/**
 * Represents the Location Filters component
 * Handles interactions with the location grid filters
 */
export class LocationFilters {
  readonly page: Page;
  readonly locationIdFilter: Locator;
  readonly locationKeyFilter: Locator;
  readonly subscriptionIdFilter: Locator;
  readonly locationNameFilter: Locator;
  readonly customerFilter: AutoComplete;
  readonly deviceOwnerFilter: AutoComplete;
  readonly statusFilter: AutoComplete;
  readonly startDateFilter: DateTimePicker;
  readonly endDateFilter: DateTimePicker;
  readonly referenceFilter: Locator;
  readonly modifiedDateFilter: DateTimePicker;
  readonly modifiedByFilter: Locator;
  readonly applyFiltersButton: Locator;
  readonly clearFiltersButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    
    // Text input filters
    this.locationIdFilter = page.getByPlaceholder('Location ID').first();
    this.locationKeyFilter = page.getByPlaceholder('Location Key').first();
    this.subscriptionIdFilter = page.getByPlaceholder('Subscription ID').first();
    this.locationNameFilter = page.getByPlaceholder('Location Name').first();
    this.referenceFilter = page.getByPlaceholder('Reference').first();
    this.modifiedByFilter = page.getByPlaceholder('Modified By').first();
    
    // Dropdown filters
    this.customerFilter = new AutoComplete(page, 'Customer Filter');
    this.deviceOwnerFilter = new AutoComplete(page, 'Device Owner Filter');
    this.statusFilter = new AutoComplete(page, 'Status Filter');
    
    // Date filters
    this.startDateFilter = new DateTimePicker(page, 'Start Date Filter');
    this.endDateFilter = new DateTimePicker(page, 'End Date Filter');
    this.modifiedDateFilter = new DateTimePicker(page, 'Modified Date Filter');
    
    // Action buttons
    this.applyFiltersButton = page.getByRole('button', { name: /Apply Filters/i });
    this.clearFiltersButton = page.getByRole('button', { name: /Clear Filters/i });
  }
  
  /**
   * Clears all filters
   */
  async clearAllFilters() {
    await this.clearFiltersButton.click();
  }
  
  /**
   * Applies current filters
   */
  async applyFilters() {
    await this.applyFiltersButton.click();
  }
  
  /**
   * Filter by location ID
   */
  async filterByLocationId(id: string) {
    await this.locationIdFilter.fill(id);
    await this.applyFilters();
  }
  
  /**
   * Filter by location name
   */
  async filterByLocationName(name: string) {
    await this.locationNameFilter.fill(name);
    await this.applyFilters();
  }
  
  /**
   * Filter by customer
   */
  async filterByCustomer(customer: string) {
    await this.customerFilter.selectText(customer);
    await this.applyFilters();
  }
  
  /**
   * Filter by device owner
   */
  async filterByDeviceOwner(deviceOwner: string) {
    await this.deviceOwnerFilter.selectText(deviceOwner);
    await this.applyFilters();
  }
  
  /**
   * Filter by status
   */
  async filterByStatus(status: string) {
    await this.statusFilter.selectText(status);
    await this.applyFilters();
  }
  
  /**
   * Apply multiple filters at once
   */
  async applyMultipleFilters({
    locationId,
    locationKey,
    subscriptionId,
    locationName,
    customer,
    deviceOwner,
    status,
    reference,
    modifiedBy
  }: {
    locationId?: string;
    locationKey?: string;
    subscriptionId?: string;
    locationName?: string;
    customer?: string;
    deviceOwner?: string;
    status?: string;
    reference?: string;
    modifiedBy?: string;
  }) {
    if (locationId) await this.locationIdFilter.fill(locationId);
    if (locationKey) await this.locationKeyFilter.fill(locationKey);
    if (subscriptionId) await this.subscriptionIdFilter.fill(subscriptionId);
    if (locationName) await this.locationNameFilter.fill(locationName);
    if (customer) await this.customerFilter.selectText(customer);
    if (deviceOwner) await this.deviceOwnerFilter.selectText(deviceOwner);
    if (status) await this.statusFilter.selectText(status);
    if (reference) await this.referenceFilter.fill(reference);
    if (modifiedBy) await this.modifiedByFilter.fill(modifiedBy);
    
    // Apply the filters
    await this.applyFilters();
  }
}
