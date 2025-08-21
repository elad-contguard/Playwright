import { Page, Locator, expect } from '@playwright/test';

export enum NavBarButton {
  RouteTemplates = 'RouteTemplates',
  Devices = 'Devices',
  Shipments = 'Shipments',
  Transits = 'Transits',
  Subscriptions = 'Subscriptions',
  Locations = 'Locations',
  SubDevices = 'SubDevices',
  Accounts = 'Accounts',
  Roles = 'Roles',
  GenerateUUID = 'GenerateUUID',
  UserProfile = 'UserProfile',
}


export class NavBar {
  readonly page: Page;
  readonly routeTemplatesButton: Locator;
  readonly devicesButton: Locator;
  readonly shipmentsButton: Locator;
  readonly transitsButton: Locator;
  readonly subscriptionsButton: Locator;
  readonly locationsButton: Locator;
  readonly subDevicesButton: Locator;
  readonly accountsButton: Locator;
  readonly rolesButton: Locator;
  readonly generateUUIDButton: Locator;
  readonly userProfileButton: Locator;
  readonly logoutYesButton: Locator;
  readonly logoutNoButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.routeTemplatesButton = page.getByRole('button', { name: /Route Templates/i });
    this.devicesButton = page.getByRole('button', { name: 'Devices', exact: true });
    this.shipmentsButton = page.getByRole('button', { name: /Shipments/i });
    this.transitsButton = page.getByRole('button', { name: /Transits/i });
    this.subscriptionsButton = page.getByRole('button', { name: /Subscriptions/i });
    this.locationsButton = page.getByRole('button', { name: /Locations/i });
    this.subDevicesButton = page.getByRole('button', { name: /Sub Devices/i });
    this.accountsButton = page.getByRole('button', { name: /Accounts/i });
    this.rolesButton = page.getByRole('button', { name: /Roles/i });
    this.generateUUIDButton = page.getByRole('button', { name: /Generate UUID/i });
    this.userProfileButton = page.getByRole('button', { name: /Hello, /i });
    this.logoutYesButton = page.getByRole('button', { name: 'Yes', exact: true });
    this.logoutNoButton = page.getByRole('button', { name: 'No', exact: true });
  }

  async navigateTo(button: NavBarButton) {
    switch (button) {
      case NavBarButton.RouteTemplates:
        await this.routeTemplatesButton.click();
        await expect(this.page).toHaveURL(/route-management/i);
        break;
      case NavBarButton.Devices:
        await this.devicesButton.click();
        await expect(this.page).toHaveURL(/device-management/i);
        break;
      case NavBarButton.Shipments:
        await this.shipmentsButton.click();
        await expect(this.page).toHaveURL(/shipment-management/i);
        break;
      case NavBarButton.Transits:
        await this.transitsButton.click();
        await expect(this.page).toHaveURL(/transit-management/i);
        break;
      case NavBarButton.Subscriptions:
        await this.subscriptionsButton.click();
        await expect(this.page).toHaveURL(/subscription-management/i);
        break;
      case NavBarButton.Locations:
        await this.locationsButton.click();
        await expect(this.page).toHaveURL(/location-management/i);
        break;
      case NavBarButton.SubDevices:
        await this.subDevicesButton.click();
        await expect(this.page).toHaveURL(/sub-device-management/i);
        break;
      case NavBarButton.Accounts:
        await this.accountsButton.click();
        await expect(this.page).toHaveURL(/account-management/i);
        break;
      case NavBarButton.Roles:
        await this.rolesButton.click();
        await expect(this.page).toHaveURL(/role-management/i);
        break;
      case NavBarButton.GenerateUUID:
        await this.generateUUIDButton.click();
        await expect(this.page).toHaveURL(/generate-uuid/i);
        break;
      case NavBarButton.UserProfile:
        await this.userProfileButton.click();
        break; 
      default:
        throw new Error(`Unknown button: ${button}`);
    }
  }

  async logout() {
    await this.userProfileButton.click();
    // Wait for the logout dialog and click 'Yes'
    await this.logoutYesButton.click();
  }
}
