import { Page, Locator } from '@playwright/test';
import { TagsSelector } from '../../../components/tags-selector.page';

export class DevicesForm {
  readonly page: Page;
  readonly heading: Locator;
  readonly addDeviceLabel: Locator;
  readonly addDeviceTags: TagsSelector;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByText(/Limited to 500 devices/);
  this.addDeviceLabel = page.getByText('Add Device');
  this.addDeviceTags = new TagsSelector(page, 'Add Device');
  }


  // Select one or more devices using the tags selector
  async selectDevices(deviceNames: string[]) {
    await this.addDeviceTags.selectTags(deviceNames);
  }
}
