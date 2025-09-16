import { Page, Locator } from '@playwright/test';
import { TagsSelector } from '../../../components/tags-selector.page';

export class DevicesForm {
  readonly page: Page;
  readonly heading: Locator;
  readonly addDeviceLabel: Locator;
  readonly addDeviceTags: TagsSelector;

  constructor(page: Page) {
    this.page = page;
    // Use data-testid attributes for robust locators
    this.heading = page.locator('[data-testid="selected-devices"]');
    this.addDeviceLabel = page.locator('[data-testid="add-device-label"]'); // If label exists, otherwise keep as is
    this.addDeviceTags = new TagsSelector(page.locator('[data-testid="selected-devices"]'));
  }


  // Select one or more devices using the tags selector
  async selectDevices(deviceNames: string[]) {
    await this.addDeviceTags.selectTags(deviceNames);
  }
}
