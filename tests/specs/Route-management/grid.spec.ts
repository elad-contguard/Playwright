import { test } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { RouteManagementGridPage } from '../../pages/route-management/route-management-grid.page';
import { NavBarButton } from '../../components/nav-bar.page';
// Enum for Route Management Grid header names
export enum RouteManagementGridHeader {
  RouteID = 'Route ID',
  Customer = 'Customer',
  Exporter = 'Exporter',
  ExporterCodeName = 'Exporter Code Name',
  ExporterCountry = 'Exporter Country',
  POL = 'POL',
  POD = 'POD',
  Importer = 'Importer',
  ImporterCodeName = 'Importer Code Name',
  ImporterCountry = 'Importer Country',
  Status = 'Status',
  External = 'External',
  Deviceless = 'Deviceless',
  CreatedDate = 'Created Date',
  Actions = 'Actions'
}

// Grid tests for Route Management
const numberOfColumns = 15; // Update if your grid has a different number of columns

test.describe('Route Management Grid', () => {
  let routeManagementGridPage: RouteManagementGridPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    routeManagementGridPage = new RouteManagementGridPage(authenticatedPage);
    await routeManagementGridPage.navBar.navigateTo(NavBarButton.RouteTemplates);
  });

  test('should display grid and rows', async () => {
  await expect(routeManagementGridPage.table).toBeVisible();
  await expect(routeManagementGridPage.rows).not.toHaveCount(0);
  });

  test('should get row and column count', async () => {
    const rowCount = await routeManagementGridPage.grid.getRowCount();
    const colCount = await routeManagementGridPage.grid.getColumnCount();
    console.log(rowCount)
    console.log(colCount)
    expect(rowCount).toBeGreaterThan(0);
    expect(colCount).toBe(numberOfColumns);
  });

  test('should get cell value by header and row index', async () => {
  const value = await routeManagementGridPage.grid.getCellByHeaderAndIndex('Customer', 0);
  await expect(value).toHaveText(/./); // Should not be empty
  });

  test('should find cell by header and route id', async () => {
    // Example: Find the Customer cell for route ID '2558'
    const cell = await routeManagementGridPage.getCellByHeaderAndRouteId('Customer', '2560');
    const text = await cell.innerText();
    expect(text).toMatch(/Rafael Corp|DSV|Elbit|FDS/); // Adjust regex to match expected customer names
  });

});
