import { AgGridPage } from '../../components/ag-grid.page';
import { test } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { TransitGridPage } from '../../pages/Transits/transit-grid.page';
import { NavBarButton } from '../../components/nav-bar.page';
import { ActionsBarButton } from '../../components/actions-bar.page';
import { TransitType, Courier } from '../../pages/Transits/components/transit-fee-form.page';
// Import enums and types for the transit form if available
import { TransitStatus} from '../../pages/Transits/components/transit-info.page';

test.describe('Transits Page', () => {
  let transitGridPage: TransitGridPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    transitGridPage = new TransitGridPage(authenticatedPage);
    await transitGridPage.navBar.navigateTo(NavBarButton.Transits);
  });

  test('should display transits page correctly', async () => {
    await expect(transitGridPage.heading).toBeVisible();
    await expect(transitGridPage.actionsBar.clearFiltersButton).toBeEnabled();
    await expect(transitGridPage.actionsBar.exportToExcelButton).toBeEnabled();
    await expect(transitGridPage.actionsBar.createNewButton).toBeEnabled();
    await expect(transitGridPage.table).toBeVisible();
    await expect(transitGridPage.rows).not.toHaveCount(0);
  });

  test('should open create transit dialog', async () => {
    await transitGridPage.startCreateTransit();
    const transitInfoTabPanel = transitGridPage.page.getByRole('tabpanel', { name: /Transit Info/i });
    await expect(transitInfoTabPanel).toBeVisible();
  });

  test('should clear filters', async () => {
    await transitGridPage.clearFilters();
    // Add assertion for table refresh if needed
  });

  test('should export to excel', async () => {
    await transitGridPage.exportToExcel();
    // Add assertion for download or feedback if needed
  });

  test('should paginate table', async () => {
    await transitGridPage.goToNextPage();
    await transitGridPage.goToLastPage();
    // Add assertion for page change if needed
  });

  test('should create a new transit (full flow)', async () => {
    await transitGridPage.startCreateTransit();
    const transitEditor = transitGridPage.getTransitEditor();
    // Example test data for transit creation (all required fields filled)
    const today = new Date();
    const transitInfo = {
      senderAccount: 'Amazon ZAZ1',
      receiverAccount: 'AGFA',
      status: TransitStatus.InTransit,
      actualPickup: today.toISOString().slice(0, 10), // 'YYYY-MM-DD'
    };
    const devices = ['1018698', '1018300']; // Example device names, update as needed
    const transitFee = {
      transitType: TransitType.Domestic,
      courier: Courier.DHLExpress,
      eta: today.toISOString().slice(0, 10),
      trackingNumber: 'AWB123456',
      gonInvoiceNumber: 'INV987654',
      chargebackFee: '100',
      gonCost: '200',
      additionalCharges: '50',
      estimatedCost: '350',
      deviceFee: '0',
      additionalChargesDescription: 'Insurance',
    };
    // Fill the transit form including Devices and Transit Fee sections
  await transitEditor.fillTransit({ transitInfo, devices, transitFee });
  // Optionally, check if Save button is enabled before saving (use headerSaveButton for uniqueness)
  // await expect(transitEditor.headerSaveButton).toBeEnabled();
  // // Save the transit
  await transitEditor.headerSaveButton.click();
    // Assert the new transit appears in the grid
    await expect(transitGridPage.table).toContainText(transitInfo.senderAccount);
    await expect(transitGridPage.table).toContainText(transitInfo.receiverAccount);
  });

  test('should get row and column count', async () => {
    const rowCount = await transitGridPage.grid.getRowCount();
    const colCount = await transitGridPage.grid.getColumnCount();
    expect(rowCount).toBeGreaterThan(0);
    expect(colCount).toBeGreaterThan(0);
  });

  test('should get cell value by header and row index', async () => {
    const value = await transitGridPage.grid.getCellByHeaderAndIndex('Sender', 0);
    await expect(value).toHaveText(/./);
  });
});
