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
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;
  readonly headerCancelButton: Locator;
  readonly headerSaveButton: Locator;

  constructor(page: Page) {
    this.page = page;
  this.transitInfoForm = new TransitInfoForm(page);
  this.devicesForm = new DevicesForm(page);
  this.transitFeeForm = new TransitFeeForm(page);
  this.stepper = new Stepper(page);
  this.nextButton = page.getByRole('button', { name: 'Next' });
  this.backButton = page.getByRole('button', { name: 'Back' });
  this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  this.saveButton = page.getByRole('button', { name: 'Save' });
  this.headerCancelButton = page.locator('cgrd-action-header').getByRole('button', { name: 'Cancel' });
  this.headerSaveButton = page.locator('cgrd-action-header').getByRole('button', { name: 'Save' });
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
    await this.nextButton.click();
    if (devices && devices.length > 0) {
      await this.stepper.goToStepByLabel(TransitEditorStep.Devices);
      await this.devicesForm.selectDevices(devices);
      await this.nextButton.click();
    }
    if (transitFee) {
      await this.stepper.goToStepByLabel(TransitEditorStep.TransitFee);
      await this.transitFeeForm.fillTransitFee(transitFee);
    }
  }
}
