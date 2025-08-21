import { Page, Locator } from '@playwright/test';
import { AutoComplete } from '../../../components/auto-complete.page';
import { TagsSelector } from '../../../components/tags-selector.page';
export enum RouteStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Cancelled = 'Cancelled',
}

export enum ShipmentSource {
  Internal = 'Internal',
  External = 'External',
}

  export enum ServiceType {
    SelfMonitoring = 'Self Monitoring',
    Escalation = 'Escalation',
  }

export class RouteInfoForm {
  readonly page: Page;
  readonly customer: AutoComplete;
  readonly routeDescription: Locator;
  readonly status: AutoComplete;
  readonly serviceType: AutoComplete;
  readonly shipmentSource: AutoComplete;
  readonly devicelessToggle: Locator;
  readonly gonOrigin: AutoComplete;
  readonly gonDestination: AutoComplete;
  readonly routeTags: TagsSelector;

  constructor(page: Page) {
    this.page = page;
    this.customer = new AutoComplete(page, 'Customer');
    this.routeDescription = page.getByRole('textbox', { name: 'Route Description' });
    this.status = new AutoComplete(page, 'Status');
    this.serviceType = new AutoComplete(page, 'Service Type');
    this.shipmentSource = new AutoComplete(page, 'Shipment Source');
    this.devicelessToggle = page.getByRole('switch', { name: 'Deviceless Data Toggle' });
    this.gonOrigin = new AutoComplete(page, 'GON Origin');
    this.gonDestination = new AutoComplete(page, 'GON Destination');
    this.routeTags = new TagsSelector(page, 'Route Tags');
  }

  async fillRouteInfo(params: {
    customer: string;
    routeDescription: string;
    status: RouteStatus;
    serviceType: ServiceType;
    shipmentSource: ShipmentSource;
    deviceless?: boolean;
    gonOrigin: string;
    gonDestination: string;
    routeTags: string[];
  }) {
    const {
      customer,
      routeDescription,
      status,
      serviceType,
      shipmentSource,
      deviceless,
      gonOrigin,
      gonDestination,
      routeTags
    } = params;
    await this.customer.selectText(customer);
    await this.routeDescription.fill(routeDescription);
    await this.status.selectText(status);
    await this.serviceType.selectText(serviceType);
    await this.shipmentSource.selectText(shipmentSource);
    if (typeof deviceless === 'boolean') {
      const isChecked = await this.devicelessToggle.isChecked();
      if (isChecked !== deviceless) await this.devicelessToggle.click();
    }
    await this.gonOrigin.selectText(gonOrigin);
    await this.gonDestination.selectText(gonDestination);
    await this.routeTags.selectTags(routeTags);
  }
}
