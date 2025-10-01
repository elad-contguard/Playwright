import { test } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { LocationGridPage } from '../../pages/location-management/location-grid.page';
import { LocationEditor, LocationStatus } from '../../pages/location-management/location-editor.page';
import { BulkOperations } from '../../pages/subscription-management/components/bulk-operations.page';
import { NavBarButton } from '../../components/nav-bar.page';
import { ActionsBarButton } from '../../components/actions-bar.page';
import { DialogModal } from '../../components/dialog-modal.page';

// const POPUP_TITLE = /Error/i;
// const POPUP_MESSAGE = /Object reference not set to an instance of an object/i;
const SUCCESS_POPUP_TITLE = 'Success';
const CREATE_SUCCESS_POPUP_MESSAGE = 'The location was created successfully';
const UPDATE_SUCCESS_POPUP_MESSAGE = 'The location was updated successfully';


test.describe('Location Management - Create Location', () => {
 
  let locationGridPage: LocationGridPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    locationGridPage = new LocationGridPage(authenticatedPage);
    await locationGridPage.navBar.navigateTo(NavBarButton.Locations);
  });

  test('should display location page correctly', async () => {
    await expect(locationGridPage.heading).toBeVisible();
    await expect(locationGridPage.actionsBar.clearFiltersButton).toBeEnabled();
    await expect(locationGridPage.actionsBar.exportToExcelButton).toBeEnabled();
    await expect(locationGridPage.actionsBar.createNewButton).toBeEnabled();
    await expect(locationGridPage.table).toBeVisible();
    await expect(locationGridPage.rows).not.toHaveCount(0);
  });

  test('should open create location dialog', async () => {
  await locationGridPage.startCreateLocation();
  const locationEditor = locationGridPage.getLocationEditor();
  await expect(locationEditor.heading).toBeVisible();
  // Use SubscriptionLocationInfo page object for field locators
  const subscriptionInfo = locationEditor.subscriptionLocationInfo;
  await expect(subscriptionInfo.locationNameInput).toBeVisible();
  await expect(subscriptionInfo.referenceInput).toBeVisible();
  await expect(subscriptionInfo.statusDropdown.input).toBeVisible();
  await expect(subscriptionInfo.startDatePicker.input).toBeVisible();
  await expect(subscriptionInfo.endDatePicker.input).toBeVisible();
  await expect(subscriptionInfo.subscriptionIdDropdown.input).toBeVisible();
  await expect(locationEditor.backActionHeaderButton).toBeVisible();
  await expect(locationEditor.saveActionHeaderButton).toBeVisible();
  await expect(locationEditor.backInfoButton).toBeVisible();
  await expect(locationEditor.nextInfoButton).toBeVisible();
  });

   test('should create a new location without devices', async () => {
    await locationGridPage.grid.waitForGridToLoad();
    const initialCount = await locationGridPage.getTotalCountFromHeading();
    console.log(`Initial location count: ${initialCount}`);

    // Start creating a new location
    await locationGridPage.startCreateLocation();
    const locationEditor = locationGridPage.getLocationEditor();

    // Generate unique values for the new location
    const timestamp = Date.now();
    const locationName = `Test Location No Devices ${timestamp}`;
    const locationRef = `Test Reference-NoDevices-${timestamp}`;

    // Get current date for start date
    const today = new Date();
    const startDate = today.toISOString().slice(0, 10); // Format as YYYY-MM-DD

    // Set end date to 30 days in the future
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);
    const endDateStr = endDate.toISOString().slice(0, 10);

    // Example test data for location creation (all required fields filled)
    const locationDetails = {
      ref: locationRef,
      subscriptionId: 'Amazon ZAZ1', // Use an existing subscription ID from your system
      status: LocationStatus.IN_SUBSCRIPTION,
      startDate,
      endDate: endDateStr,
      name: locationName,
      reference: locationRef
    };

    // Fill the location form with the test data
    await locationEditor.fillLocationDetails(locationDetails);

    // Save directly from info section (no devices, do not go to bulk operations tab)
    await expect(locationEditor.saveActionHeaderButton).toBeEnabled();

    // Intercept the save location network request
    const responsePromise = locationEditor.page.waitForResponse((response: import('@playwright/test').Response) =>
      (response.url().includes('/api/locations') || response.url().includes('/api/subscription-locations')) &&
      (response.request().method() === 'POST' || response.request().method() === 'PUT')
    );

    // Save the location
    await locationEditor.saveActionHeaderButton.click();

    // Wait for the response
    const response = await responsePromise;
    expect(response.status()).toBe(200);

    // Validate the success dialog using DialogModal
    const dialogModal = new DialogModal(locationEditor.page);
    await dialogModal.waitForVisible();
    await expect(await dialogModal.getTitle()).toContain(SUCCESS_POPUP_TITLE);
    await expect(await dialogModal.message.textContent()).toContain(CREATE_SUCCESS_POPUP_MESSAGE);
    await dialogModal.clickConfirm();

    // Intercept the GET request to api/location-devices/{id} after confirming the dialog
    const getLocationDevicesPromise = locationEditor.page.waitForResponse((response: import('@playwright/test').Response) =>
      response.url().includes('/api/location-devices/') && response.request().method() === 'GET'
    );
    const getLocationDevicesResponse = await getLocationDevicesPromise;
    const locationIdMatch = getLocationDevicesResponse.url().match(/\/api\/location-devices\/(\d+)/);
    let locationId: string | undefined = undefined;
    if (locationIdMatch) {
      locationId = locationIdMatch[1];
      console.log('Extracted location ID from GET:', locationId);
    } else {
      throw new Error('Could not extract location ID from GET request URL: ' + getLocationDevicesResponse.url());
    }

    // Verify the correct edit URL is shown after saving
    const expectedEditUrl = `/location-management/edit/${locationId}`;
    const currentUrl = locationEditor.page.url();
    expect(currentUrl).toContain(expectedEditUrl);
  });

  test('should create a new location with devices and update it successfully', async () => {
    // Get the initial count of locations to verify addition later
    await locationGridPage.grid.waitForGridToLoad();
    const initialCount = await locationGridPage.getTotalCountFromHeading();
    console.log(`Initial location count: ${initialCount}`);

    // Start creating a new location
    await locationGridPage.startCreateLocation();
    const locationEditor = locationGridPage.getLocationEditor();
    
    // Generate unique values for the new location
    const timestamp = Date.now();
    const locationName = `Test Location ${timestamp}`;
    const locationRef = `Test Reference-${timestamp}`;
    
    // Get current date for start date
    const today = new Date();
    const startDate = today.toISOString().slice(0, 10); // Format as YYYY-MM-DD
    
    // Set end date to 30 days in the future
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);
    const endDateStr = endDate.toISOString().slice(0, 10);

    // Example test data for location creation (all required fields filled)
    const locationDetails = {
      ref: locationRef,
      subscriptionId: 'Amazon ZAZ1', // Use an existing subscription ID from your system
      status: LocationStatus.IN_SUBSCRIPTION,
      startDate,
      endDate: endDateStr,
      name: locationName,
      reference: locationRef
    };

    // Example bulk operations data (mirroring subscription-management)
    const bulkOperations = {
      devicesToStart: ['1090063', '1018698'], // Use real device names from your system
      startDate,
      devicesToEnd: [], // Use real device names from your system
      endDate: endDateStr
    };

    // Fill the location form with the test data
    await locationEditor.fillLocationDetails(locationDetails);

    // Verify next button is enabled and click it to go to Bulk Operations tab
    await expect(locationEditor.nextInfoButton).toBeEnabled();
    await locationEditor.next();

    // Use the shared BulkOperations page object from subscription-management
    const bulkOps = new BulkOperations(locationEditor.page);
    if (bulkOperations.devicesToStart?.length) {
      await bulkOps.selectMultipleDevices(bulkOperations.devicesToStart);
      if (bulkOperations.startDate) {
        await bulkOps.setStartDate(bulkOperations.startDate);
      }
    }
    if (bulkOperations.devicesToEnd?.length) {
      await bulkOps.selectMultipleDevicesForEndSubscription(bulkOperations.devicesToEnd);
      if (bulkOperations.endDate) {
        await bulkOps.setEndDate(bulkOperations.endDate);
      }
    }

    // Verify save button is enabled
    await expect(locationEditor.saveBulkButton).toBeEnabled();

    // Intercept the save location network request
    const responsePromise = locationEditor.page.waitForResponse((response: import('@playwright/test').Response) =>
      (response.url().includes('/api/locations') || response.url().includes('/api/subscription-locations')) &&
      (response.request().method() === 'POST' || response.request().method() === 'PUT')
    );

    // Save the location
    await locationEditor.save(false); // Don't wait for dialog in save()

    // Wait for the response
    const response = await responsePromise;
    expect(response.status()).toBe(200);

    // Validate the success dialog using DialogModal
    const dialogModal = new DialogModal(locationEditor.page);
    await dialogModal.waitForVisible();
    await expect(await dialogModal.getTitle()).toContain(SUCCESS_POPUP_TITLE);
    await expect(await dialogModal.message.textContent()).toContain(CREATE_SUCCESS_POPUP_MESSAGE);
    await dialogModal.clickConfirm();

    // Intercept the GET request to api/location-devices/{id} after confirming the dialog
    const getLocationDevicesPromise = locationEditor.page.waitForResponse((response: import('@playwright/test').Response) =>
      response.url().includes('/api/location-devices/') && response.request().method() === 'GET'
    );
    const getLocationDevicesResponse = await getLocationDevicesPromise;
    const locationIdMatch = getLocationDevicesResponse.url().match(/\/api\/location-devices\/(\d+)/);
    let locationId: string | undefined = undefined;
    if (locationIdMatch) {
      locationId = locationIdMatch[1];
      console.log('Extracted location ID from GET:', locationId);
    } else {
      throw new Error('Could not extract location ID from GET request URL: ' + getLocationDevicesResponse.url());
    }

    // Verify the correct edit URL is shown after saving
    const expectedEditUrl = `/location-management/edit/${locationId}`;
    const currentUrl = locationEditor.page.url();
    expect(currentUrl).toContain(expectedEditUrl);

    // Step 1: End subscription for the same devices
    await locationEditor.navigateToBulkOperationsTab();
    await bulkOps.selectMultipleDevicesForEndSubscription(bulkOperations.devicesToStart);

    // Step 2: Insert an earlier end date
    const earlierEndDate = (() => {
      const start = new Date(startDate);
      start.setDate(start.getDate() - 1); // 1 day before start
      return start.toISOString().slice(0, 10);
    })();
    await bulkOps.setEndDate(earlierEndDate);

  // Step 3: Click "Update" button
  await expect(locationEditor.updateBulkButton).toBeEnabled();
  await locationEditor.updateBulkButton.click();

    // Step 4: Verify and close the success dialog
    const updateDialog = new DialogModal(locationEditor.page);
    await updateDialog.waitForVisible();
    await expect(await updateDialog.getTitle()).toContain(SUCCESS_POPUP_TITLE);
    await expect(await updateDialog.message.textContent()).toContain(UPDATE_SUCCESS_POPUP_MESSAGE);
    await updateDialog.clickConfirm();




    // // After closing the success dialog, we should be back on the locations grid
    // // But sometimes we need to explicitly navigate back
    // if (!(await locationGridPage.grid.isVisible())) {
    //   // Navigate back to the Locations page if we're not already there
    //   await locationGridPage.navBar.navigateTo(NavBarButton.Locations);
    // }

    // // Wait for the grid to reload after adding a location
    // await locationGridPage.grid.waitForGridToLoad();

    // // Check if there are data rows before asserting
    // const rowCount = await locationGridPage.grid.getRowCount();
    // if (rowCount > 1) { // First row is header
    //   // Find the newly created location in the grid (it should be at the top)
    //   const firstRowName = await locationGridPage.grid.getCellByHeaderAndIndex('Location Name', 0);
      
    //   // Verify the new location appears in the grid
    //   await expect(firstRowName).toContainText(locationName);
      
    //   // Verify the count has increased
    //   const newCount = await locationGridPage.getTotalCountFromHeading();
    //   expect(newCount).toBeGreaterThanOrEqual(initialCount);
    // } else {
    //   console.warn('No data rows found in the grid after location creation.');
    // }
  });

  test('should validate required fields in location form', async () => {
    // Start creating a new location
    await locationGridPage.startCreateLocation();
    const locationEditor = locationGridPage.getLocationEditor();
    
    // Initially the next button should be disabled since form is empty
    await expect(locationEditor.nextInfoButton).toBeDisabled();
    
    // Fill location name field and verify next button remains disabled
    await locationEditor.locationNameInput.fill('Test Location');
    await expect(locationEditor.nextInfoButton).toBeDisabled();

    // Fill the reference field
    await locationEditor.locationRefInput.fill('TEST-REF-123');
    
    // Use the SubscriptionLocationInfo component to fill the subscription details
    try {
      // Set the subscription ID
      await locationEditor.subscriptionLocationInfo.setSubscriptionId('SID-157');
      
      // Set the start date
      await locationEditor.subscriptionLocationInfo.setStartDate('09/10/2025');
      
      // Optionally set the status if needed (In Subscription is default)
      // await locationEditor.subscriptionLocationInfo.setStatus(LocationStatus.IN_SUBSCRIPTION);
    } catch (error) {
      console.log('Error filling subscription info:', error);
    }
    
    // Wait for UI to update
    await locationEditor.page.waitForTimeout(1000);
    
    // Log the Next button state
    const isNextEnabled = await locationEditor.nextInfoButton.isEnabled();
    console.log(`Next button is ${isNextEnabled ? 'enabled' : 'disabled'}`);
    
    // Cancel without saving
    await locationEditor.back();
  });
  
  test('should navigate to device subscription operations tab in location editor', async () => {
    // Start creating a new location
    await locationGridPage.startCreateLocation();
    const locationEditor = locationGridPage.getLocationEditor();
    
    // First fill the required fields in the subscription location info tab
    await locationEditor.locationNameInput.fill('Test Location for Bulk Tab');
    await locationEditor.locationRefInput.fill('TEST-REF-BULK');
    
    try {
      // Set required subscription fields
      await locationEditor.subscriptionLocationInfo.setSubscriptionId('SID-157');
      await locationEditor.subscriptionLocationInfo.setStartDate('09/10/2025');
    } catch (error) {
      console.log('Error setting required fields:', error);
    }
    
    // Navigate to the Bulk Operations tab
    await locationEditor.navigateToBulkOperationsTab();
    
    // Verify Device Subscription Operations UI elements are visible
    await expect(locationEditor.deviceSubscriptionOperations.heading).toBeVisible();
    await expect(locationEditor.deviceSubscriptionOperations.endSubscriptionHeading).toBeVisible();
    
    // Check if the Back button is visible (should be since we're on the bulk operations tab)
    await expect(locationEditor.deviceSubscriptionOperations.backButton).toBeVisible();
    
    // Go back to the previous tab
    await locationEditor.prevBulkButton.click();
    
    // Cancel without saving
    await locationEditor.back();
    
    // Verify we're back on the locations grid
    await expect(locationGridPage.table).toBeVisible();
  });
});
