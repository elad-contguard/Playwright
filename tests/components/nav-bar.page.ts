import { Page, Locator, expect } from '@playwright/test';
import { DialogModal } from './dialog-modal.page';

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

  constructor(page: Page) {
  this.page = page;
  this.routeTemplatesButton = page.locator('[data-testid="nav-route-templates"]');
  this.devicesButton = page.locator('[data-testid="nav-devices"]');
  this.shipmentsButton = page.locator('[data-testid="nav-shipments"]');
  this.transitsButton = page.locator('[data-testid="nav-transits"]');
  this.subscriptionsButton = page.locator('[data-testid="nav-subscriptions"]');
  this.locationsButton = page.locator('[data-testid="nav-locations"]');
  this.subDevicesButton = page.locator('[data-testid="nav-sub-devices"]');
  this.accountsButton = page.locator('[data-testid="nav-accounts"]');
  this.rolesButton = page.locator('[data-testid="nav-roles"]');
  this.generateUUIDButton = page.locator('[data-testid="nav-generate-uuid"]');
  this.userProfileButton = page.locator('[data-testid="nav-logout"]');
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
  // Wait for the logout dialog and confirm logout using DialogModal
  const dialog = new DialogModal(this.page);
  await dialog.waitForVisible();
  await dialog.clickConfirm();
  }
}
