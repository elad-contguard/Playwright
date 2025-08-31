import { AgGridPage } from '../../components/ag-grid.page';
import { test } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { RouteManagementGridPage } from '../../pages/route-management/route-management-grid.page';
import { NavBarButton } from '../../components/nav-bar.page';
import { ActionsBarButton } from '../../components/actions-bar.page';
import { RouteStatus, ShipmentSource, ServiceType } from '../../pages/route-management/components/route-info-form.page';
import { DurationUnit, SegmentType } from '../../pages/route-management/components/segments-form.page';

test.describe('Route Templates Page', () => {
  let routeManagementGridPage: RouteManagementGridPage;

  test.beforeEach(async ({ authenticatedPage }) => {
  routeManagementGridPage = new RouteManagementGridPage(authenticatedPage);

  await routeManagementGridPage.navBar.navigateTo(NavBarButton.RouteTemplates);
  });

  test('should display route templates page correctly', async () => {
  await expect(routeManagementGridPage.heading).toBeVisible();
  // Actions bar buttons
  await expect(routeManagementGridPage.actionsBar.clearFiltersButton).toBeEnabled();
  await expect(routeManagementGridPage.actionsBar.exportToExcelButton).toBeEnabled();
  await expect(routeManagementGridPage.actionsBar.createNewButton).toBeEnabled();
  // Table
  await expect(routeManagementGridPage.table).toBeVisible();
  await expect(routeManagementGridPage.rows).not.toHaveCount(0);
  });

  test('should open create route dialog', async () => {
  await routeManagementGridPage.startCreateRoute();
  // Assert that the Route Info tabpanel is visible
  const routeInfoTabPanel = routeManagementGridPage.page.getByRole('tabpanel', { name: /Route Info/i });
  await expect(routeInfoTabPanel).toBeVisible();
  });

  test('should clear filters', async () => {
  await routeManagementGridPage.clearFilters();
    // Add assertion for table refresh if needed
  });

  test('should export to excel', async () => {
  await routeManagementGridPage.exportToExcel();
    // Add assertion for download or feedback if needed
  });

  test('should paginate table', async () => {
  await routeManagementGridPage.goToNextPage();
  await routeManagementGridPage.goToLastPage();
    // Add assertion for page change if needed
  });

  
  test('should create a new route (full flow)', async () => {
    await routeManagementGridPage.startCreateRoute();

    // Create RouteEditor instance
    const routeEditor = routeManagementGridPage.getRouteEditor();

    // Example test data
    const routeInfo = {
      customer: 'elbit',
      routeDescription: 'Automated route creation test',
      status: RouteStatus.Active,
      serviceType: ServiceType.SelfMonitoring,
      shipmentSource: ShipmentSource.Internal,
      deviceless: false,
      gonOrigin: 'GON Israel',
      gonDestination: 'Gon China',
      routeTags: ['test', 'try me']
    };
    const thresholds = {
      emailsTo: 'user1@example.com',
      emailsCc: 'user2@example.com',
      temperatureMin: '2',
      temperatureMax: '8',
      humidityMin: '30',
      humidityMax: '60',
      timeExceed: '10',
      temperatureUnit: 'Celsius',
      humidityUnit: '%',
      timeUnit: 'Minutes'
    };
    const segments = [
      {
        type: SegmentType.Origin,
        perimeterName: 'Warehouse',
        relatedWarehouseAccount: 'AAA',
        segmentDuration: 5,
        segmentUnit: 'Days',
        segmentNotes: 'Segment notes',
        wayDuration: 2,
        wayUnit: 'Days',
        wayNotes: 'Way notes'
      },
      {
        type: SegmentType.WayPoint,
        perimeterName: 'Teva',
        relatedWarehouseAccount: 'BBB',
        segmentDuration: 3,
        segmentUnit: 'Days',
        segmentNotes: 'WP notes',
        wayDuration: 1,
        wayUnit: 'Days',
        wayNotes: 'WP way notes'
      },
      {
        type: SegmentType.Destination,
        perimeterName: 'Warehouse',
        relatedWarehouseAccount: 'CCC',
        segmentDuration: 4,
        segmentUnit: 'Days',
        segmentNotes: 'Dest notes',
        wayDuration: 2,
        wayUnit: 'Days',
        wayNotes: 'Dest way notes'
      }
      // {
      //   type: SegmentType.Custom,
      //   perimeterName: 'Warehouse',
      //   relatedWarehouseAccount: 'DDD',
      //   segmentDuration: 2,
      //   segmentUnit: 'Days',
      //   segmentNotes: 'Custom notes',
      //   wayDuration: 1,
      //   wayUnit: 'Days',
      //   wayNotes: 'Custom way notes'
      // }
    ];

    // Set total expected duration constants
    const TOTAL_EXPECTED_DURATION = 15; // Example value, adjust as needed
    const TOTAL_EXPECTED_DURATION_UNIT = DurationUnit.Days; // Example value, adjust as needed

    // Fill the entire route form, including total expected duration
    await routeEditor.fillRoute({
      routeInfo,
      thresholds,
      segments,
      totalExpectedDuration: TOTAL_EXPECTED_DURATION,
      totalExpectedDurationUnit: TOTAL_EXPECTED_DURATION_UNIT
    });

    // Save the route
    // await routeManagementGridPage.saveRoute();

    // Assert the new route appears in the grid
    await expect(routeManagementGridPage.table).toContainText(routeInfo.routeDescription);
  });


// Grid tests

    test('should get row and column count', async () => {
      const rowCount = await routeManagementGridPage.grid.getRowCount();
      const colCount = await routeManagementGridPage.grid.getColumnCount();
      expect(rowCount).toBeGreaterThan(0);
      expect(colCount).toBeGreaterThan(0);
    });

  test('should get cell value by header and row index', async () => {
    const value = await routeManagementGridPage.grid.getCellByHeaderAndIndex('Customer', 0);
    await expect(value).toHaveText(/./); // Should not be empty
  });

  // test('should get all values in a row', async () => {
  //   const values = await routeManagementGridPage.grid.getRowValues(0);
  //   expect(values.length).toBeGreaterThan(0);
  //   expect(values[0]).not.toBe('');
  // });

  // test('should get all values in a column', async ({ authenticatedPage }) => {
  //   const grid = new AgGridPage(authenticatedPage);
  //   const values = await grid.getColumnValues('Customer');
  //   expect(values.length).toBeGreaterThan(0);
  //   expect(values[0]).not.toBe('');
  // });

//   test('should find row index by cell value', async () => {
//     const values = await routeManagementGridPage.grid.getColumnValues('Customer');
//     const searchValue = values[0];
//     const rowIndex = await routeManagementGridPage.grid.findRowIndexByCellValue('Customer', searchValue);
//     expect(rowIndex).toBeGreaterThanOrEqual(0);
//   });

  // test('should validate cell value', async ({ authenticatedPage }) => {
  //   const grid = new AgGridPage(authenticatedPage);
  //   const values = await grid.getColumnValues('Customer');
  //   const expectedValue = values[0];
  //   await grid.expectCellValue('Customer', 0, expectedValue);
  // });

  // test('should validate row values', async ({ authenticatedPage }) => {
  //   const grid = new AgGridPage(authenticatedPage);
  //   const expectedValues = await grid.getRowValues(0);
  //   await grid.expectRowValues(0, expectedValues);
  // });

  // test('should validate column values', async ({ authenticatedPage }) => {
  //   const grid = new AgGridPage(authenticatedPage);
  //   const expectedValues = await grid.getColumnValues('Customer');
  //   await grid.expectColumnValues('Customer', expectedValues);
  // });
});
