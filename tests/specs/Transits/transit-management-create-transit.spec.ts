import { AgGridPage } from '../../components/ag-grid.page';
import { DialogModal } from '../../components/dialog-modal.page';
import { test } from '../../fixtures/auth.fixture';
import { expect, Response } from '@playwright/test';
import { TransitGridPage } from '../../pages/Transits/transit-grid.page';
import { NavBarButton } from '../../components/nav-bar.page';
import { ActionsBarButton } from '../../components/actions-bar.page';
import { TransitType, Courier } from '../../pages/Transits/components/transit-fee-form.page';
// Import enums and types for the transit form if available
import { TransitStatus} from '../../pages/Transits/components/transit-info.page';

const POPUP_TITLE = /Error/i;
const POPUP_MESSAGE = /Object reference not set to an instance of an object/i;

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
      // // Log all outgoing requests for debugging
      // transitEditor.page.on('request', req => {
      //   console.log('Request:', req.method(), req.url());
      // });
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
  // Intercept the save transit network request
  const responsePromise = transitEditor.page.waitForResponse((response: Response) =>
    response.url().includes('/api/transit-devices') &&
    response.request().method() === 'POST'
  );

    await transitEditor.headerSaveButton.click();
    

// Wait for the response
    const response = await responsePromise;

// Assert status code
     expect(response.status()).toBe(200); 
    // expect(response.status()).toBe(400); 

// Use dialogModal component to close the popup if it appears
  const dialog = new DialogModal(transitEditor.page);
    if (await dialog.container.isVisible()) {
  // Verify popup title and message
      await expect(dialog.title).toHaveText(POPUP_TITLE);
      await expect(dialog.message).toContainText(POPUP_MESSAGE);
      await dialog.close();
    }
  // Assert the new transit appears in the grid as the first row
    await transitGridPage.grid.waitForGridToLoad();
    // Check if there are data rows before asserting
    const rowCount = await transitGridPage.grid.getRowCount();
    if (rowCount > 1) { // First row is header
      // Only access grid cells if data rows exist
      const firstRowSender = await transitGridPage.grid.getCellByHeaderAndIndex('Sender', 0);
      const firstRowReceiver = await transitGridPage.grid.getCellByHeaderAndIndex('Receiver', 0);
      await expect(firstRowSender).toContainText(transitInfo.senderAccount);
      await expect(firstRowReceiver).toContainText(transitInfo.receiverAccount);
    } else {
      console.warn('No data rows found in the grid after transit creation.');
    }
  const firstRowSender = await transitGridPage.grid.getCellByHeaderAndIndex('Sender', 0);
  const firstRowReceiver = await transitGridPage.grid.getCellByHeaderAndIndex('Receiver', 0);
  await expect(firstRowSender).toContainText(transitInfo.senderAccount);
  await expect(firstRowReceiver).toContainText(transitInfo.receiverAccount);
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
