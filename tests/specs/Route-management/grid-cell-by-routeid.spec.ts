import { test } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { RouteManagementGridPage } from '../../pages/route-management/route-management-grid.page';
import { NavBarButton } from '../../components/nav-bar.page';

test.describe('Route Management Grid - Cell by Route ID', () => {
  let routeManagementGridPage: RouteManagementGridPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    routeManagementGridPage = new RouteManagementGridPage(authenticatedPage);
    await routeManagementGridPage.navBar.navigateTo(NavBarButton.RouteTemplates);
  });

  test('should find cell by header and route id', async () => {
    // Example: Find the Customer cell for route ID '2558'
    const cell = await routeManagementGridPage.getCellByHeaderAndRouteId('Customer', '2558');
    const text = await cell.innerText();
    expect(text).toMatch(/Rafael Corp|DSV|Elbit|FDS/); // Adjust regex to match expected customer names
  });
});
