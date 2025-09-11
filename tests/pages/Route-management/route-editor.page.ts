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

  async fillRoute({ routeInfo, thresholds, segments, totalExpectedDuration, totalExpectedDurationUnit }: {
    routeInfo: Parameters<RouteInfoForm['fillRouteInfo']>[0];
    thresholds: Parameters<ThresholdsForm['fillThresholds']>[0];
    segments: Parameters<SegmentsForm['fillSegment']>[0][];
    totalExpectedDuration?: number;
    totalExpectedDurationUnit?: string;
  }) {
    await this.stepper.goToStepByLabel('Route Info');
    await this.routeInfoForm.fillRouteInfo(routeInfo);
    await this.nextButton.click();

    await this.thresholdsForm.fillThresholds(thresholds);
    await this.stepper.goToStepByLabel('Segments');

    // Fill total expected duration if needed
    if (typeof totalExpectedDuration !== 'undefined') {
      const totalDurationInput = this.page.getByRole('spinbutton', { name: 'Total Expected Duration' });
      await totalDurationInput.fill(String(totalExpectedDuration));
    }
    if (typeof totalExpectedDurationUnit !== 'undefined') {
      // Find the combobox for 'Unit' that is closest to the 'Total Expected Duration' spinbutton
      const totalDurationInput = this.page.getByRole('spinbutton', { name: 'Total Expected Duration' });
      const totalDurationUnitCombo = totalDurationInput.locator('xpath=following::input[@role="combobox" and @aria-label="Unit"]').first();
      await totalDurationUnitCombo.fill(totalExpectedDurationUnit);
    }

    if (Array.isArray(segments)) {
      for (const segment of segments) {
        await this.segmentsForm.fillSegment(segment);
        // If there is an add button, click it to add more segments
        if (segments.length > 1 && this.segmentsForm.addButton) {
          await this.segmentsForm.addButton.click();
        }
      }
    }
    // Add save/cancel logic if needed
  }
}
