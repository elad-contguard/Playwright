import { Page, Locator } from '@playwright/test';
import { AutoComplete } from '../../../components/auto-complete.page';

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
    this.addButton = page.getByRole('button', { name: 'add' });
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
}
