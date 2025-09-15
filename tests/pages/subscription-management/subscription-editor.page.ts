import { Locator, Page, Response } from '@playwright/test';
import { DateTimePicker } from '../../components/date-time-picker.page';
import { AutoComplete } from '../../components/auto-complete.page';
import { DialogModal } from '../../components/dialog-modal.page';
import { SubscriptionInfo } from './components/subscription-info.page';
import { BulkOperations } from './components/bulk-operations.page';

/**
 * Page object representing the Subscription Editor
 * This page is used for creating and editing subscriptions
 */
export class SubscriptionEditorPage {
  readonly page: Page;
  readonly pageTitle: Locator;

  // Component tabs
  readonly subscriptionInfoTab: Locator;
  readonly bulkOperationsTab: Locator;

  // Component instances
  readonly subscriptionInfo: SubscriptionInfo;
  readonly bulkOperations: BulkOperations;
  readonly dialogModal: DialogModal;

  // Common buttons
  readonly cancelButtonHeader: Locator;
  readonly saveButtonHeader: Locator;
  readonly updateButtonHeader: Locator;
  readonly cancelButtonInfo: Locator;
  readonly nextButtonInfo: Locator;
  readonly cancelButtonBulk: Locator;
  readonly backButtonBulk: Locator;
  readonly updateButtonBulk: Locator;
  readonly saveButtonBulk: Locator;

  /**
   * Creates a new instance of the SubscriptionEditorPage
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'New Subscription', level: 2 });

    // Component tabs
    this.subscriptionInfoTab = page.getByRole('tab', { name: 'Subscription Info' });
    this.bulkOperationsTab = page.getByRole('tab', { name: 'Bulk Operations' });

    // Initialize component instances
    this.subscriptionInfo = new SubscriptionInfo(page);
    this.bulkOperations = new BulkOperations(page);
    this.dialogModal = new DialogModal(page);

    // Common buttons
    // this.cancelButton = page.getByRole('button', { name: 'Cancel' }).first();
    this.cancelButtonHeader = page.locator('[data-testid="cancel-action-header"]');
    this.saveButtonHeader = page.locator('[data-testid="save-action-header"]');
    this.updateButtonHeader = page.locator('[data-testid="update-action-header"]');
    this.cancelButtonInfo = page.locator('[data-testid="cancel-info"]');
    this.nextButtonInfo = page.locator('[data-testid="next-info"]');
    this.cancelButtonBulk = page.locator('[data-testid="cancel-bulk"]');
    this.backButtonBulk = page.locator('[data-testid="back-bulk"]');
    this.updateButtonBulk = page.locator('[data-testid="update-bulk"]');
    this.saveButtonBulk = page.locator('[data-testid="save-bulk"]');
  }

  // ------------------- METHODS -------------------

  /**
   * Clicks the save button and intercepts the subscription creation network request
   * @param apiEndpoint - The API endpoint to intercept (default: '/api/subscriptions')
   * @param waitForSuccess - Whether to wait for success dialog (default: true)
   * @returns The intercepted response
   */
  async saveAndIntercept(apiEndpoint: string = '/api/subscriptions', waitForSuccess: boolean = true): Promise<Response> {
    const responsePromise = this.page.waitForResponse(response =>
      response.url().includes(apiEndpoint) &&
      response.request().method() === 'POST'
    );
    await this.save(waitForSuccess);
    return await responsePromise;
  }

  async clickSaveHeader(): Promise<void> {
    await this.saveButtonHeader.click();
  }

  async clickCancelHeader(): Promise<void> {
    await this.cancelButtonHeader.click();
  }

  async clickUpdateHeader(): Promise<void> {
    await this.updateButtonHeader.click();
  }

  async clickSaveBulk(): Promise<void> {
    await this.saveButtonBulk.click();
  }

  async clickCancelBulk(): Promise<void> {
    await this.cancelButtonBulk.click();
  }

  async clickUpdateBulk(): Promise<void> {
    await this.updateButtonBulk.click();
  }

  async clickNextInfo(): Promise<void> {
    await this.nextButtonInfo.click();
  }

  async clickCancelInfo(): Promise<void> {
    await this.cancelButtonInfo.click();
  }

  /**
   * Navigates to the subscription creation page
   * @param baseUrl - The base URL of the application (optional)
   */
  async navigateToCreateSubscription(baseUrl?: string) {
    const url = baseUrl ? `${baseUrl}/subscription-management/create` : '/subscription-management/create';
    await this.page.goto(url);
  }

  /**
   * Navigates to the subscription edit page
   * @param subscriptionId - The ID of the subscription to edit
   * @param baseUrl - The base URL of the application (optional)
   */
  async navigateToEditSubscription(subscriptionId: string, baseUrl?: string) {
    const url = baseUrl 
      ? `${baseUrl}/subscription-management/edit/${subscriptionId}` 
      : `/subscription-management/edit/${subscriptionId}`;
    await this.page.goto(url);
  }

  async save(waitForSuccess: boolean = true): Promise<void> {
    await this.saveButtonHeader.click();
    if (waitForSuccess) {
      // Wait for the dialog modal to appear
      await this.dialogModal.waitForVisible().catch(() => {
        console.log('Success dialog not found, subscription might still be saved');
      });
      // Verify it's a success dialog
      const dialogTitle = await this.dialogModal.getTitle().catch(() => '');
      if (dialogTitle.includes('Success')) {
        console.log('Success dialog confirmed');
      } else if (dialogTitle) {
        console.log(`Dialog appeared with title: ${dialogTitle}`);
      }
    }
  }

  async cancel(): Promise<void> {
    await this.cancelButtonHeader.click();
  }

  async confirmSuccess(): Promise<void> {
    await this.dialogModal.clickConfirm();
    // Wait for dialog to disappear
    await this.page.waitForSelector('[role="dialog"]', { state: 'hidden' })
      .catch(() => {
        console.log('Dialog might still be visible');
      });
  }

  async verifySuccessDialog(): Promise<boolean> {
    await this.dialogModal.waitForVisible();
    const title = await this.dialogModal.getTitle();
    return title.includes('Success');
  }

  async switchToSubscriptionInfoTab() {
    await this.subscriptionInfoTab.click();
  }

  async switchToBulkOperationsTab() {
    await this.bulkOperationsTab.click();
  }

  async createSubscription(subscriptionInfo: {
    deviceOwner: string;
    subscriptionType: string;
    customer: string;
    status: string;
    startDate: string;
    reference?: string;
    relatedGon?: string;
    endDate?: string;
  }, bulkOperations?: {
    devicesToStart?: string[];
    startDate?: string;
    devicesToEnd?: string[];
    endDate?: string;
  }, waitForSuccess: boolean = true) {
    // Navigate to the subscription creation page
    await this.navigateToCreateSubscription();
    // Step 1: Fill in the subscription info tab
    await this.subscriptionInfo.fillSubscriptionInfo({
      deviceOwner: subscriptionInfo.deviceOwner,
      subscriptionType: subscriptionInfo.subscriptionType as any,
      reference: subscriptionInfo.reference,
      customer: subscriptionInfo.customer,
      relatedGon: subscriptionInfo.relatedGon,
      status: subscriptionInfo.status as any,
      startDate: subscriptionInfo.startDate,
      endDate: subscriptionInfo.endDate
    });
    // Click next to proceed to bulk operations tab
    await this.clickNextInfo();
    // Step 2: Handle bulk operations if provided
    if (bulkOperations) {
      // Handle devices to start subscription for
      if (bulkOperations.devicesToStart?.length) {
        await this.bulkOperations.selectMultipleDevices(bulkOperations.devicesToStart);
        // Set start date if provided
        if (bulkOperations.startDate) {
          await this.bulkOperations.setStartDate(bulkOperations.startDate);
        }
      }
      // Handle devices to end subscription for
      if (bulkOperations.devicesToEnd?.length) {
        await this.bulkOperations.selectMultipleDevicesForEndSubscription(bulkOperations.devicesToEnd);
        // Set end date if provided
        if (bulkOperations.endDate) {
          await this.bulkOperations.setEndDate(bulkOperations.endDate);
        }
      }
    }
    // Step 3: Save the subscription
    await this.save(waitForSuccess);
    // Note: We don't automatically confirm the dialog here
    // This allows tests to verify the dialog content before confirming
  }

  async createSubscriptionWithDevices({
    subscription,
    devices,
    startDate,
    endDate,
    waitForSuccess = true
  }: {
    subscription: {
      deviceOwner: string;
      subscriptionType: string;
      customer: string;
      status: string;
      startDate: string;
      reference?: string;
      relatedGon?: string;
      endDate?: string;
    },
    devices: string[],
    startDate?: string,
    endDate?: string,
    waitForSuccess?: boolean
  }) {
    return this.createSubscription(
      subscription, 
      {
        devicesToStart: devices,
        startDate: startDate || subscription.startDate,
        devicesToEnd: endDate ? devices : undefined,
        endDate: endDate
      },
      waitForSuccess
    );
  }

}
