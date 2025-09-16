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
    // Use data-testid attributes for robust locators
    this.senderAccount = new AutoComplete(page.locator('[data-testid="sender-account"]'));
    this.receiverAccount = new AutoComplete(page.locator('[data-testid="receiver-account"]'));
    this.status = new AutoComplete(page.locator('[data-testid="status"]'));
    this.actualPickup = new DateTimePicker(page.locator('[data-testid="actual-pickup"]'));
    this.actualArrival = new DateTimePicker(page.locator('[data-testid="actual-arrival"]'));
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
      if ((this as any)[key] && typeof (this as any)[key].fill === 'function') {
        await (this as any)[key].fill(value);
      }
    }
  }
}
