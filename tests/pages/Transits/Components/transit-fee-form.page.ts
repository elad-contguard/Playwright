
import { Page, Locator } from '@playwright/test';
import { AutoComplete } from '../../../components/auto-complete.page';
import { DateTimePicker } from '../../../components/date-time-picker.page';

export enum TransitType {
  Domestic = 'Domestic',
  International = 'International',
}

export enum Courier {
  FedEx = 'FedEx',
  DHLExpress = 'DHL Express',
  TNT = 'TNT',
  EMS = 'EMS',
  DHLParcel = 'DHL Parcel',
  SFExpress = 'SF Express',
  UPS = 'UPS',
  WarehouseToWarehouse = 'Warehouse to warehouse',
  PersonalDelivery = 'Personal Delivery',
}

export class TransitFeeForm {
  readonly page: Page;
  readonly heading: Locator;
  readonly transitType: AutoComplete;
  readonly courier: AutoComplete;
  readonly eta: DateTimePicker;
  readonly trackingNumber: Locator;
  readonly gonInvoiceNumber: Locator;
  readonly chargebackFee: Locator;
  readonly gonCost: Locator;
  readonly additionalCharges: Locator;
  readonly estimatedCost: Locator;
  readonly deviceFee: Locator;
  readonly total: Locator;
  readonly additionalChargesDescription: Locator;
  readonly cancelButton: Locator;
  readonly backButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByText(/Transit Fee/i);
    this.transitType = new AutoComplete(page, 'Transit Type');
    this.courier = new AutoComplete(page, 'Courier');
    this.eta = new DateTimePicker(page, 'ETA');
    this.trackingNumber = page.getByRole('textbox', { name: 'Tracking Number (AWB)' });
    this.gonInvoiceNumber = page.getByRole('textbox', { name: 'GON Invoice Number' });
    this.chargebackFee = page.getByRole('spinbutton', { name: 'Chargeback Fee' });
    this.gonCost = page.getByRole('spinbutton', { name: 'GON Cost' });
    this.additionalCharges = page.getByRole('spinbutton', { name: 'Additional Charges' });
    this.estimatedCost = page.getByRole('spinbutton', { name: 'Estimated Cost' });
    this.deviceFee = page.getByRole('spinbutton', { name: 'Device Fee' });
    this.total = page.getByRole('spinbutton', { name: 'Total' });
    this.additionalChargesDescription = page.getByRole('textbox', { name: 'Additional Charges Description' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async fillTransitFee(params: {
    transitType?: TransitType;
    courier?: Courier;
    eta?: string;
    trackingNumber?: string;
    gonInvoiceNumber?: string;
    chargebackFee?: string;
    gonCost?: string;
    additionalCharges?: string;
    estimatedCost?: string;
    deviceFee?: string;
    additionalChargesDescription?: string;
    [key: string]: any;
  }) {
    const {
      transitType,
      courier,
      eta,
      trackingNumber,
      gonInvoiceNumber,
      chargebackFee,
      gonCost,
      additionalCharges,
      estimatedCost,
      deviceFee,
      additionalChargesDescription,
      ...rest
    } = params;
    if (transitType) await this.transitType.selectText(transitType);
    if (courier) await this.courier.selectText(courier);
    if (eta) await this.eta.setDate(eta);
    if (trackingNumber) await this.trackingNumber.fill(trackingNumber);
    if (gonInvoiceNumber) await this.gonInvoiceNumber.fill(gonInvoiceNumber);
    if (chargebackFee) await this.chargebackFee.fill(chargebackFee);
    if (gonCost) await this.gonCost.fill(gonCost);
    if (additionalCharges) await this.additionalCharges.fill(additionalCharges);
    if (estimatedCost) await this.estimatedCost.fill(estimatedCost);
    if (deviceFee) await this.deviceFee.fill(deviceFee);
    if (additionalChargesDescription) await this.additionalChargesDescription.fill(additionalChargesDescription);
    // Fill any additional fields if needed
    for (const [key, value] of Object.entries(rest)) {
      if (this[key] && typeof this[key].fill === 'function') {
        await this[key].fill(value);
      }
    }
  }
}
