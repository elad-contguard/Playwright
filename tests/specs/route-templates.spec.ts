import { test } from '../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { RouteManagementGridPage } from '../pages/route-management/route-management-grid.page';
import { NavBarButton } from '../components/nav-bar.page';
import { ActionsBarButton } from '../components/actions-bar.page';
import { RouteStatus, ShipmentSource, ServiceType } from '../pages/route-management/components/route-info-form.page';

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

  test.skip('should create a new route', async () => {
    await routeManagementGridPage.startCreateRoute();
    const routeEditor = routeManagementGridPage.getRouteEditor();
    const routeInfo = {
      customer: 'Test Customer',
      routeDescription: 'Automated route creation test',
      status: 'Active',
      serviceType: 'Express',
      shipmentSource: 'Warehouse',
      deviceless: false,
      gonOrigin: 'Origin City',
      gonDestination: 'Destination City',
      routeTags: ['Tag1', 'Tag2']
    };
    const thresholds = {
      temperatureMin: '2',
      temperatureMax: '8',
      humidityMin: '30',
      humidityMax: '60',
      timeExceed: '10',
      temperatureUnit: 'Celsius',
      humidityUnit: '%',
      timeUnit: 'Minutes'
    };
    const segment = {
      type: 'Origin',
      perimeterName: 'Warehouse',
      relatedWarehouseAccount: 'Account1',
      segmentDuration: 5,
      segmentUnit: 'Days',
      segmentNotes: 'Segment notes',
      wayDuration: 2,
      wayUnit: 'Days',
      wayNotes: 'Way notes'
    };
    await routeEditor.fillRoute({ routeInfo, thresholds, segment });
    await routeManagementGridPage.saveRoute();
    await expect(routeManagementGridPage.table).toContainText(routeInfo.routeDescription);
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
    const segment = {
      type: 'Origin',
      perimeterName: 'Warehouse',
      relatedWarehouseAccount: 'AAA',
      segmentDuration: 5,
      segmentUnit: 'Days',
      segmentNotes: 'Segment notes',
      wayDuration: 2,
      wayUnit: 'Days',
      wayNotes: 'Way notes'
    };

    // Fill the entire route form
    await routeEditor.fillRoute({ routeInfo, thresholds, segment });

    // Save the route
    await routeManagementGridPage.saveRoute();

    // Assert the new route appears in the grid
    await expect(routeManagementGridPage.table).toContainText(routeInfo.routeDescription);
  });
});
