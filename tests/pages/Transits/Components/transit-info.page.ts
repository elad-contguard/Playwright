import { Page, Locator } from '@playwright/test';
import { AutoComplete } from '../../../components/auto-complete.page';
import { DateTimePicker } from '../../../components/date-time-picker.page';

export enum TransitStatus {
  Open = 'Open',
  InTransit = 'In Transit',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  CompletedLost = 'Completed Lost',
  CompletedSold = 'Completed Sold'
}

export class TransitInfoForm {

  readonly page: Page;
  readonly senderAccount: AutoComplete;
  readonly receiverAccount: AutoComplete;
  readonly status: AutoComplete;
  readonly actualPickup: DateTimePicker;
  readonly actualArrival: DateTimePicker;

  constructor(page: Page) {
  this.page = page;
  this.senderAccount = new AutoComplete(page, 'Sender Account');
  this.receiverAccount = new AutoComplete(page, 'Receiver Account');
  this.status = new AutoComplete(page, 'Status');
  this.actualPickup = new DateTimePicker(page, 'Actual Pickup');
  this.actualArrival = new DateTimePicker(page, 'Actual Arrival');
  }

  async fillTransitInfo(params: {
    senderAccount: string;
    receiverAccount: string;
    status: TransitStatus;
    actualPickup?: string;
    actualArrival?: string;
    [key: string]: any;
  }) {
    const {
      senderAccount,
      receiverAccount,
      status,
      actualPickup,
      actualArrival,
      ...rest
    } = params;
    await this.senderAccount.selectText(senderAccount);
    await this.receiverAccount.selectText(receiverAccount);
    await this.status.selectText(status);
    if (actualPickup) {
      await this.actualPickup.setDate(actualPickup);
    }
    if (actualArrival) {
      await this.actualArrival.setDate(actualArrival);
    }
    // Fill any additional fields if needed
    for (const [key, value] of Object.entries(rest)) {
      if (this[key] && typeof this[key].fill === 'function') {
        await this[key].fill(value);
      }
    }
  }
}
