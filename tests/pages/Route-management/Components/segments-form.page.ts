import { Page, Locator } from '@playwright/test';
import { AutoComplete } from '../../../components/auto-complete.page';

export enum DurationUnit {
  Days = 'Days',
  Hours = 'Hours',
  Minutes = 'Minutes'
}

export enum SegmentType {
  Origin = 'Origin',
  WayPoint = 'WayPoint',
  Destination = 'Destination',
  Custom = 'Custom'
}

export class SegmentsForm {
  readonly page: Page;
  readonly type: AutoComplete;
  readonly perimeterName: AutoComplete;
  readonly relatedWarehouseAccount: AutoComplete;
  readonly segmentDuration: Locator;
  readonly segmentUnit: AutoComplete;
  readonly segmentNotes: Locator;
  readonly wayDuration: Locator;
  readonly wayUnit: AutoComplete;
  readonly wayNotes: Locator;
  readonly addButton: Locator;
  readonly segmentRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.type = new AutoComplete(page, 'Type');
    this.perimeterName = new AutoComplete(page, 'Perimeter Name');
    this.relatedWarehouseAccount = new AutoComplete(page, 'Related Warehouse Account');
    this.segmentDuration = page.getByRole('spinbutton', { name: 'Segment Duration' });
    this.segmentUnit = new AutoComplete(page, 'Unit', 0); // first 'Unit' combobox
    this.segmentNotes = page.getByRole('textbox', { name: 'Segment Notes' });
    this.wayDuration = page.getByRole('spinbutton', { name: 'Way Duration' });
    this.wayUnit = new AutoComplete(page, 'Unit', 1); // second 'Unit' combobox
    this.wayNotes = page.getByRole('textbox', { name: 'Way Notes' });
    // Get all segment rows (buttons that represent segments in the segments panel)
    this.segmentRows = page.locator('button').filter({ has: page.locator('generic', { hasText: /Origin|Way Point|Destination/ }) });
    // Add segment button: image with 'add' text within the Origin segment row
    this.addButton = page.locator('img:has-text("add")').first();
  }

  async fillSegment({
    type,
    perimeterName,
    relatedWarehouseAccount,
    segmentDuration,
    segmentUnit,
    segmentNotes,
    wayDuration,
    wayUnit,
    wayNotes
  }: {
    type: string;
    perimeterName: string;
    relatedWarehouseAccount: string;
    segmentDuration: number;
    segmentUnit: string;
    segmentNotes?: string;
    wayDuration: number;
    wayUnit: string;
    wayNotes?: string;
  }) {
    await this.type.selectText(type);
    await this.perimeterName.selectText(perimeterName);
    await this.relatedWarehouseAccount.selectText(relatedWarehouseAccount);
    await this.segmentDuration.fill(segmentDuration.toString());
    await this.segmentUnit.selectText(segmentUnit);
    if (segmentNotes) await this.segmentNotes.fill(segmentNotes);
    await this.wayDuration.fill(wayDuration.toString());
    await this.wayUnit.selectText(wayUnit);
    if (wayNotes) await this.wayNotes.fill(wayNotes);
  }

  async addSegment() {
    // First locate any button containing an add icon in the segments area
    const addIcon = this.page.locator('img:has-text("add")').first();
    
    // Make sure the parent segment is visible
    await addIcon.scrollIntoViewIfNeeded();
    
    // Click the add icon 
    await addIcon.click();
    
    // Wait briefly for the new segment to be added
    await this.page.waitForTimeout(500);
  }

  async deleteSegment(index: number) {
    // Find all delete icons
    const deleteIcons = this.page.locator('img:has-text("delete")');
    
    // Get the count of delete icons
    const count = await deleteIcons.count();
    
    if (count === 0) {
      throw new Error('No delete icons found on the page');
    }
    
    if (index >= count) {
      throw new Error(`Requested delete icon at index ${index} but only ${count} icons available`);
    }
    
    // Get the specific delete icon at the requested index
    const deleteIcon = deleteIcons.nth(index);
    
    // Make sure it's visible
    await deleteIcon.scrollIntoViewIfNeeded();
    
    // Click it
    await deleteIcon.click();
    
    // Wait briefly for the segment to be deleted
    await this.page.waitForTimeout(500);
  }

  // Returns a Locator for segment header buttons within the segments tab
  getSegmentHeadersLocator() {
    // Restrict search to the segments tabpanel to avoid matching other buttons
    const segmentsPanel = this.page.getByRole('tabpanel', { name: /Segments/i }).first();
    return segmentsPanel.locator('button').filter({ hasText: /Origin|Way Point|Destination/ });
  }

  // Returns a Locator for delete icons within the segments panel
  getDeleteIconsLocator() {
    const segmentsPanel = this.page.getByRole('tabpanel', { name: /Segments/i }).first();
    return segmentsPanel.locator('img:has-text("delete")');
  }

  // Convenience: count of segment headers
  async getSegmentHeadersCount() {
    return await this.getSegmentHeadersLocator().count();
  }

  // Convenience: count of delete icons
  async getDeleteIconsCount() {
    return await this.getDeleteIconsLocator().count();
  }

  // Convenience: delete the last delete icon (most recently added segment)
  async deleteLastSegment() {
    const deleteIcons = this.getDeleteIconsLocator();
    const count = await deleteIcons.count();
    if (count === 0) throw new Error('No delete icons available to delete');
    await deleteIcons.nth(count - 1).scrollIntoViewIfNeeded();
    await deleteIcons.nth(count - 1).click();
    await this.page.waitForTimeout(500);
  }
}
