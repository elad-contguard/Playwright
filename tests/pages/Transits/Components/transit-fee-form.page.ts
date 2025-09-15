
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

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByText(/Transit Fee/i);
    // Use data-testid attributes for robust locators
    this.transitType = new AutoComplete(page.locator('[data-testid="transit-type"]'));
    this.courier = new AutoComplete(page.locator('[data-testid="courier"]'));
    this.eta = new DateTimePicker(page.locator('[data-testid="eta"]'));
    this.trackingNumber = page.locator('[data-testid="tracking-number"]');
    this.gonInvoiceNumber = page.locator('[data-testid="gon-invoice-number"]');
    this.chargebackFee = page.locator('[data-testid="chargeback-fee"]');
    this.gonCost = page.locator('[data-testid="gon-cost"]');
    this.additionalCharges = page.locator('[data-testid="additional-charges"]');
    this.estimatedCost = page.locator('[data-testid="estimated-cost"]');
    this.deviceFee = page.locator('[data-testid="device-fee"]');
    this.total = page.locator('[data-testid="total"]');
    this.additionalChargesDescription = page.locator('[data-testid="additional-charges-description"]');
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
      if ((this as any)[key] && typeof (this as any)[key].fill === 'function') {
        await (this as any)[key].fill(value);
      }
    }
  }
}
