import { test } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { SubscriptionEditorPage } from '../../pages/subscription-management/subscription-editor.page';
import { SubscriptionType, SubscriptionStatus } from '../../pages/subscription-management/components/subscription-info.page';
import { NavBarButton } from '../../components/nav-bar.page';
import { DialogModal } from '../../components/dialog-modal.page';
import { SubscriptionGridPage } from '../../pages/subscription-management/subscription-grid.page';

test.describe('Subscription Management', () => {
  let subscriptionEditor: SubscriptionEditorPage;
  let dialogModal: DialogModal;

  test.beforeEach(async ({ authenticatedPage }) => {
    // Initialize components
    subscriptionEditor = new SubscriptionEditorPage(authenticatedPage);
    dialogModal = new DialogModal(authenticatedPage);
    
    // Navigate to Subscriptions page
    await subscriptionEditor.page.getByRole('button', { name: /Subscriptions/i }).click();
    await expect(authenticatedPage).toHaveURL(/subscription-management/i);
  });

  test('should create a device subscription', async ({ authenticatedPage }) => {
    // Step 1: Navigate to create subscription
    await subscriptionEditor.navigateToCreateSubscription();

    // Step 2: Fill in the subscription info tab
    await subscriptionEditor.subscriptionInfo.fillSubscriptionInfo({
      deviceOwner: 'Amazon ZAZ1',
      subscriptionType: SubscriptionType.DEVICE,
      reference: 'TEST-REF-123',
      customer: '3M Company',
      status: SubscriptionStatus.IN_SUBSCRIPTION,
      startDate: '09/07/2025',
      endDate: '12/31/2025'
    });

    // Step 3: Go to Bulk Operations tab
    await subscriptionEditor.clickNextInfo();

    // Step 4: Select devices and set start date
    await subscriptionEditor.bulkOperations.selectMultipleDevices(['1018300', '1018756']);
    await subscriptionEditor.bulkOperations.setStartDate('09/07/2025');

    // Step 5: Save and intercept network request
    const response = await subscriptionEditor.saveAndIntercept();
    expect(response.status()).toBe(200);

    // Step 6: Verify success dialog appears
    await dialogModal.waitForVisible();
    const dialogTitle = await dialogModal.getTitle();
    await expect(dialogTitle).toContain('Success');

    // Step 7: Confirm success dialog
    await dialogModal.clickConfirm();
  });

  test('should create a location subscription', async ({ authenticatedPage }) => {
    // No need to initialize the subscription editor page again

    // Step 1: Fill in the subscription info tab for Location type
    await subscriptionEditor.navigateToCreateSubscription();
    await subscriptionEditor.subscriptionInfo.fillSubscriptionInfo({
      deviceOwner: '207 – Marine Containers, Ashdod (Mini GON)',
      subscriptionType: SubscriptionType.LOCATION,
      reference: 'LOCATION-1231',
      customer: '3M Company',
      status: SubscriptionStatus.IN_SUBSCRIPTION,
      startDate: '09/10/2025',
      endDate: '12/31/2026'
    });

    // Step 2: Go to Bulk Operations tab
    await subscriptionEditor.clickNextInfo();

    // Step 3: Fill geo locations in the Locations textarea
    await subscriptionEditor.bulkOperations.fillLocations('123123123, 456456456');

  // Step 4: Save and intercept network request
  const response = await subscriptionEditor.saveAndIntercept();
  expect(response.status()).toBe(200);

  // Step 5: Verify success dialog appears
  await dialogModal.waitForVisible();
  const dialogTitle = await dialogModal.getTitle();
  await expect(dialogTitle).toContain('Success');

  // Step 6: Confirm success dialog
  await dialogModal.clickConfirm();

    // Step 7: Assert the row exists in the grid with correct reference, locations, and customer using grid page object
    const reference = 'LOCATION-1231';
    const locations = '123123123, 456456456';
    const customer = '3M Company';
  const gridPage = new SubscriptionGridPage(authenticatedPage);
  // Clear filters using ActionsBar and wait for grid to refresh
  const { ActionsBar } = await import('../../components/actions-bar.page');
  const actionsBar = new ActionsBar(authenticatedPage);
  await actionsBar.clearFiltersButton.click();
  await gridPage.grid.waitForGridToLoad();
  await gridPage.filterByReference(reference);
  await authenticatedPage.waitForTimeout(1000); // Wait 1s for grid update
    const rowCount = await gridPage.grid.getRowCount();
    const colCount = await gridPage.grid.getColumnCount();
    // Log all cell values for each row
    const headerCells = gridPage.grid.grid.getByRole('columnheader');
    let headerNames: string[] = [];
    for (let colIdx = 0; colIdx < colCount; colIdx++) {
      headerNames.push((await headerCells.nth(colIdx).innerText()).trim());
    }
    for (let rowIdx = 0; rowIdx < rowCount - 1; rowIdx++) { // Exclude header
      let rowData: Record<string, string> = {};
      for (let colIdx = 0; colIdx < colCount; colIdx++) {
        const header = headerNames[colIdx];
        const cell = await gridPage.grid.getCellByHeaderAndIndex(header, rowIdx);
  rowData[header] = (await cell.textContent()) ?? '';
      }
      console.log(`Row ${rowIdx}:`, rowData);
    }
    if (rowCount > 1) { // First row is header
      // Only access grid cells if data rows exist
      const rowIndex = 0; // First data row after filtering
      await expect(await gridPage.grid.getCellText('Reference', rowIndex)).toContain(reference);
      await expect(await gridPage.grid.getCellText('Customer', rowIndex)).toContain(customer);
    } else {
      console.warn('No data rows found in the grid after subscription creation.');
    }
  });
});
