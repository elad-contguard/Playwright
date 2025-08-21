import { test } from '../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { NavBar, NavBarButton } from '../components/nav-bar.page';

test.describe('NavBar', () => {
  let navBar: NavBar;

  test.beforeEach(async ({ authenticatedPage }) => {
    navBar = new NavBar(authenticatedPage);
  });

  test('should display all main menu buttons', async () => {
    await expect(navBar.routeTemplatesButton).toBeVisible();
    await expect(navBar.devicesButton).toBeVisible();
    await expect(navBar.shipmentsButton).toBeVisible();
    await expect(navBar.transitsButton).toBeVisible();
    await expect(navBar.subscriptionsButton).toBeVisible();
    await expect(navBar.locationsButton).toBeVisible();
    await expect(navBar.subDevicesButton).toBeVisible();
    await expect(navBar.accountsButton).toBeVisible();
    await expect(navBar.rolesButton).toBeVisible();
    await expect(navBar.generateUUIDButton).toBeVisible();
    await expect(navBar.userProfileButton).toBeVisible();
  });

  test('should navigate to Route Templates page', async () => {
    await navBar.navigateTo(NavBarButton.RouteTemplates);
    await expect(navBar.routeTemplatesButton).toBeVisible();
  });

  test('should navigate to Devices page', async () => {
    await navBar.navigateTo(NavBarButton.Devices);
    await expect(navBar.devicesButton).toBeVisible();
  });

  test('should navigate to Shipments page', async () => {
    await navBar.navigateTo(NavBarButton.Shipments);
    await expect(navBar.shipmentsButton).toBeVisible();
  });

  test('should navigate to Transits page', async () => {
    await navBar.navigateTo(NavBarButton.Transits);
    await expect(navBar.transitsButton).toBeVisible();
  });

  test('should navigate to Subscriptions page', async () => {
    await navBar.navigateTo(NavBarButton.Subscriptions);
    await expect(navBar.subscriptionsButton).toBeVisible();
  });

  test('should navigate to Locations page', async () => {
    await navBar.navigateTo(NavBarButton.Locations);
    await expect(navBar.locationsButton).toBeVisible();
  });

  test('should navigate to Sub Devices page', async () => {
    await navBar.navigateTo(NavBarButton.SubDevices);
    await expect(navBar.subDevicesButton).toBeVisible();
  });

  // page not exist right now
  test('should navigate to Accounts page', async () => {
    await navBar.navigateTo(NavBarButton.Accounts);
    await expect(navBar.accountsButton).toBeVisible();
  });

  test('should navigate to Roles page', async () => {
    await navBar.navigateTo(NavBarButton.Roles);
    await expect(navBar.rolesButton).toBeVisible();
  });

  // page not exist right now
  test('should navigate to Generate UUID page', async () => {
    await navBar.navigateTo(NavBarButton.GenerateUUID);
    await expect(navBar.generateUUIDButton).toBeVisible();
  });
  test('should log out successfully', async ({ authenticatedPage }) => {
    await navBar.logout();
    // Assert that the URL is the login page after logout
    await expect(authenticatedPage).toHaveURL(/login/i);
  });
});
