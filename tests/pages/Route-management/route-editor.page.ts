import { Page, Locator } from '@playwright/test';
import { RouteInfoForm } from './components/route-info-form.page';
import { ThresholdsForm } from './components/thresholds-form.page';
import { SegmentsForm } from './components/segments-form.page';
import { Stepper } from '../../components/stepper.page';

export class RouteEditor {
  readonly page: Page;
  readonly routeInfoForm: RouteInfoForm;
  readonly thresholdsForm: ThresholdsForm;
  readonly segmentsForm: SegmentsForm;
  readonly stepper: Stepper;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.routeInfoForm = new RouteInfoForm(page);
    this.thresholdsForm = new ThresholdsForm(page);
    this.segmentsForm = new SegmentsForm(page);
    this.stepper = new Stepper(page);
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async fillRoute({ routeInfo, thresholds, segment }: {
    routeInfo: Parameters<RouteInfoForm['fillRouteInfo']>[0];
    thresholds: Parameters<ThresholdsForm['fillThresholds']>[0];
    segment: Parameters<SegmentsForm['fillSegment']>[0];
  }) {
    await this.stepper.goToStepByLabel('Route Info');
    await this.routeInfoForm.fillRouteInfo(routeInfo);
    await this.nextButton.click();

    // await this.stepper.goToStepByLabel('Thresholds(Temperature, Humidity, Time Exceed)');
    await this.thresholdsForm.fillThresholds(thresholds);
    // await this.nextButton.nth(1).click();

    await this.stepper.goToStepByLabel('Segments');
    await this.segmentsForm.fillSegment(segment);
    // Add save/cancel logic if needed
  }
}
