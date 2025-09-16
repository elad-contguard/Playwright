import { Page, Locator } from '@playwright/test';
import { TransitInfoForm } from './components/transit-info.page';
import { DevicesForm } from './components/devices-form.page';
import { Stepper } from '../../components/stepper.page';
import { TransitFeeForm } from './components/transit-fee-form.page';

export enum TransitEditorStep {
  TransitInfo = 'Transit Info',
  Devices = 'Devices',
  TransitFee = 'Transit Fee'
}

export class TransitEditor {
  readonly page: Page;
  readonly transitInfoForm: TransitInfoForm;
  readonly devicesForm: DevicesForm;
  readonly transitFeeForm: TransitFeeForm;
  readonly stepper: Stepper;
  readonly nextButtonInfo: Locator;
  readonly backButtonHeader: Locator;
  readonly saveButtonHeader: Locator;
  readonly nextButtonDevices: Locator;
  readonly backButtonDevices: Locator;
  readonly saveButtonDevices: Locator;
  readonly nextButtonFee: Locator;
  readonly backButtonFee: Locator;
  readonly saveButtonFee: Locator;

  constructor(page: Page) {
    this.page = page;
    this.transitInfoForm = new TransitInfoForm(page);
    this.devicesForm = new DevicesForm(page);
    this.transitFeeForm = new TransitFeeForm(page);
    this.stepper = new Stepper(page);
  // Use data-testid attributes for robust selectors, similar to SubscriptionEditorPage
  this.nextButtonInfo = page.locator('[data-testid="next-info"]');
  this.backButtonHeader = page.locator('[data-testid="back-action-header"]');
  this.saveButtonHeader = page.locator('[data-testid="save-action-header"]');
  this.nextButtonDevices = page.locator('[data-testid="next-devices"]');
  this.backButtonDevices = page.locator('[data-testid="back-devices"]');
  this.saveButtonDevices = page.locator('[data-testid="save-devices"]');
  this.nextButtonFee = page.locator('[data-testid="next-fee"]');
  this.backButtonFee = page.locator('[data-testid="back-fee"]');
  this.saveButtonFee = page.locator('[data-testid="save-fee"]');
  }

  async fillTransit({
    transitInfo,
    devices,
    transitFee
  }: {
    transitInfo: Parameters<TransitInfoForm['fillTransitInfo']>[0];
    devices?: string[];
    transitFee?: Parameters<TransitFeeForm['fillTransitFee']>[0];
  }) {
    await this.stepper.goToStepByLabel(TransitEditorStep.TransitInfo);
    await this.transitInfoForm.fillTransitInfo(transitInfo);
    await this.nextButtonInfo.click();
    if (devices && devices.length > 0) {
      await this.stepper.goToStepByLabel(TransitEditorStep.Devices);
      await this.devicesForm.selectDevices(devices);
      await this.nextButtonDevices.click();
    }
    if (transitFee) {
      await this.stepper.goToStepByLabel(TransitEditorStep.TransitFee);
      await this.transitFeeForm.fillTransitFee(transitFee);
    }
  }
}
