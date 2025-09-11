import { test } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { RouteManagementGridPage } from '../../pages/route-management/route-management-grid.page';
import { NavBarButton } from '../../components/nav-bar.page';
import { AgGridPage } from '../../components/ag-grid.page';

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
  let grid: AgGridPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    routeManagementGridPage = new RouteManagementGridPage(authenticatedPage);
    grid = new AgGridPage(authenticatedPage);
    await routeManagementGridPage.navBar.navigateTo(NavBarButton.RouteTemplates);
    await grid.waitForGridToLoad();
  });

  test('should display grid and rows', async () => {
    await expect(routeManagementGridPage.table).toBeVisible();
    await expect(routeManagementGridPage.rows).not.toHaveCount(0);
  });

  test('should get row and column count', async () => {
    const rowCount = await grid.getRowCount();
    const colCount = await grid.getColumnCount();
    console.log(rowCount)
    console.log(colCount)
    expect(rowCount).toBeGreaterThan(0);
    expect(colCount).toBe(numberOfColumns);
  });

  // test('should get cell value by header and row index', async () => {
  //   const value = await grid.getCellByHeaderAndIndex('Customer', 0);
  //   await expect(value).toHaveText(/./); // Should not be empty
  // });

  // test('should find cell by header and route id', async () => {
  //   // Helper function to find cell by header and route id
  //   async function getCellByHeaderAndRouteId(grid: AgGridPage, header: string, routeId: string) {
  //     const colIndex = await grid.getColumnIndex(header);
  //     const rows = grid.grid.getByRole('row');
  //     const rowCount = await rows.count();
  //     for (let i = 0; i < rowCount; i++) {
  //       const idCell = rows.nth(i).getByRole('gridcell').nth(0); // Assuming Route ID is the first column
  //       if ((await idCell.innerText()).trim() === routeId) {
  //         return rows.nth(i).getByRole('gridcell').nth(colIndex);
  //       }
  //     }
  //     throw new Error('Route ID not found');
  //   }
  //   // Example: Find the Customer cell for route ID '2560'
  //   const cell = await getCellByHeaderAndRouteId(grid, 'Customer', '2560');
  //   const text = await cell.innerText();
  //   expect(text).toMatch(/Rafael Corp|DSV|Elbit|FDS/); // Adjust regex to match expected customer names
  // });

});
