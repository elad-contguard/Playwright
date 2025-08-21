import { Page, Locator } from '@playwright/test';
import { AutoComplete } from '../../../components/auto-complete.page';

export class ThresholdsForm {
  readonly page: Page;
  readonly emailsTo: Locator;
  readonly emailsCc: Locator;
  readonly temperatureMin: Locator;
  readonly temperatureLowerThan: Locator;
  readonly temperatureLowerThanFor: Locator;
  readonly temperatureLowerThanUnit: AutoComplete;
  readonly temperatureMax: Locator;
  readonly temperatureHigherThan: Locator;
  readonly temperatureHigherThanFor: Locator;
  readonly temperatureHigherThanUnit: AutoComplete;
  readonly nextButton: Locator;

  readonly humidityMin: Locator;
  readonly humidityLowerThan: Locator;
  readonly humidityLowerThanFor: Locator;
  readonly humidityLowerThanUnit: AutoComplete;
  readonly humidityMax: Locator;
  readonly humidityHigherThan: Locator;
  readonly humidityHigherThanFor: Locator;
  readonly humidityHigherThanUnit: AutoComplete;

  readonly strongImpactGForce: Locator;
  readonly strongImpactMiliseconds: Locator;
  readonly weakImpactGForce: Locator;
  readonly weakImpactMiliseconds: Locator;

  readonly portOfLoadingTime: Locator;
  readonly portOfLoadingUnit: AutoComplete;
  readonly transshipmentTime: Locator;
  readonly transshipmentUnit: AutoComplete;
  readonly portOfDestinationTime: Locator;
  readonly portOfDestinationUnit: AutoComplete;
  readonly closeShipmentsTime: Locator;
  readonly closeShipmentsUnit: AutoComplete;
  readonly noActivityTime: Locator;
  readonly noActivityUnit: AutoComplete;

  readonly batteryMinStartingLevel: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailsTo = page.getByRole('textbox', { name: 'Emails To' });
    this.emailsCc = page.getByRole('textbox', { name: 'Emails CC' });
    const temperatureSection = page.getByRole('heading', { name: 'Temperature (°C)' }).locator('..');
    this.temperatureMin = page.getByRole('spinbutton', { name: 'Minimum' }).first();
    this.temperatureLowerThan = page.getByRole('spinbutton', { name: 'Lower Than' }).first();
    this.temperatureLowerThanFor = page.getByRole('spinbutton', { name: 'For' }).first();
    this.temperatureLowerThanUnit = new AutoComplete(page, 'Unit'); // If needed, use page.locator('[ref=e269]')
    this.temperatureMax = page.getByRole('spinbutton', { name: 'Maximum' }).first();
    this.temperatureHigherThan = page.getByRole('spinbutton', { name: 'Higher Than' }).first();
    this.temperatureHigherThanFor = page.getByRole('spinbutton', { name: 'For' }).nth(1);
    this.temperatureHigherThanUnit = new AutoComplete(page, 'Unit'); // If needed, use page.locator('[ref=e304]')
    this.nextButton = page.getByRole('button', { name: 'Next' });

    this.humidityMin = page.getByRole('spinbutton', { name: 'Minimum' }).nth(1);
    this.humidityLowerThan = page.getByRole('spinbutton', { name: 'Lower Than' }).nth(1);
    this.humidityLowerThanFor = page.getByRole('spinbutton', { name: 'For' }).nth(2);
    this.humidityLowerThanUnit = new AutoComplete(page, 'Unit'); // If needed, use page.locator('[ref=e344]')
    this.humidityMax = page.getByRole('spinbutton', { name: 'Maximum' }).nth(1);
    this.humidityHigherThan = page.getByRole('spinbutton', { name: 'Higher Than' }).nth(1);
    this.humidityHigherThanFor = page.getByRole('spinbutton', { name: 'For' }).nth(3);
    this.humidityHigherThanUnit = new AutoComplete(page, 'Unit'); // If needed, use page.locator('[ref=e379]')

    this.strongImpactGForce = page.getByRole('spinbutton', { name: 'G-Force' }).filter({ hasText: 'Strong Impact' });
    this.strongImpactMiliseconds = page.getByRole('spinbutton', { name: 'Miliseconds' }).filter({ hasText: 'Strong Impact' });
    this.weakImpactGForce = page.getByRole('spinbutton', { name: 'G-Force' }).filter({ hasText: 'Weak Impact' });
    this.weakImpactMiliseconds = page.getByRole('spinbutton', { name: 'Miliseconds' }).filter({ hasText: 'Weak Impact' });

    this.portOfLoadingTime = page.getByRole('spinbutton', { name: 'Time' }).filter({ hasText: 'Port of loading' });
    this.portOfLoadingUnit = new AutoComplete(page, 'Unit');
    this.transshipmentTime = page.getByRole('spinbutton', { name: 'Time' }).filter({ hasText: 'Transshipment' });
    this.transshipmentUnit = new AutoComplete(page, 'Unit');
    this.portOfDestinationTime = page.getByRole('spinbutton', { name: 'Time' }).filter({ hasText: 'Port of Destination' });
    this.portOfDestinationUnit = new AutoComplete(page, 'Unit');
    this.closeShipmentsTime = page.getByRole('spinbutton', { name: 'Time' }).filter({ hasText: 'Close Shipments at Destination After' });
    this.closeShipmentsUnit = new AutoComplete(page, 'Unit');
    this.noActivityTime = page.getByRole('spinbutton', { name: 'Time' }).filter({ hasText: 'No activity after' });
    this.noActivityUnit = new AutoComplete(page, 'Unit');

    this.batteryMinStartingLevel = page.locator('[ref=e555]');
    this.backButton = page.getByRole('button', { name: 'Back' });
  }

  async fillThresholds({
    emailsTo,
    emailsCc,
    temperatureMin,
    temperatureLowerThan,
    temperatureLowerThanFor,
    temperatureLowerThanUnit,
    temperatureMax,
    temperatureHigherThan,
    temperatureHigherThanFor,
    temperatureHigherThanUnit,
    humidityMin,
    humidityLowerThan,
    humidityLowerThanFor,
    humidityLowerThanUnit,
    humidityMax,
    humidityHigherThan,
    humidityHigherThanFor,
    humidityHigherThanUnit,
    strongImpactGForce,
    strongImpactMiliseconds,
    weakImpactGForce,
    weakImpactMiliseconds,
    portOfLoadingTime,
    portOfLoadingUnit,
    transshipmentTime,
    transshipmentUnit,
    portOfDestinationTime,
    portOfDestinationUnit,
    closeShipmentsTime,
    closeShipmentsUnit,
    noActivityTime,
    noActivityUnit,
    batteryMinStartingLevel
  }: {
    emailsTo?: string;
    emailsCc?: string;
    temperatureMin?: number;
    temperatureLowerThan?: number;
    temperatureLowerThanFor?: number;
    temperatureLowerThanUnit?: string;
    temperatureMax?: number;
    temperatureHigherThan?: number;
    temperatureHigherThanFor?: number;
    temperatureHigherThanUnit?: string;
    humidityMin?: number;
    humidityLowerThan?: number;
    humidityLowerThanFor?: number;
    humidityLowerThanUnit?: string;
    humidityMax?: number;
    humidityHigherThan?: number;
    humidityHigherThanFor?: number;
    humidityHigherThanUnit?: string;
    strongImpactGForce?: number;
    strongImpactMiliseconds?: number;
    weakImpactGForce?: number;
    weakImpactMiliseconds?: number;
    portOfLoadingTime?: number;
    portOfLoadingUnit?: string;
    transshipmentTime?: number;
    transshipmentUnit?: string;
    portOfDestinationTime?: number;rr
    portOfDestinationUnit?: string;
    closeShipmentsTime?: number;
    closeShipmentsUnit?: string;
    noActivityTime?: number;
    noActivityUnit?: string;
    batteryMinStartingLevel?: number;
  }) {
    if (emailsTo) await this.emailsTo.fill(emailsTo);
    if (emailsCc) await this.emailsCc.fill(emailsCc);
    if (temperatureMin !== undefined) await this.temperatureMin.fill(temperatureMin.toString());
    if (temperatureLowerThan !== undefined) await this.temperatureLowerThan.fill(temperatureLowerThan.toString());
    if (temperatureLowerThanFor !== undefined) await this.temperatureLowerThanFor.fill(temperatureLowerThanFor.toString());
    if (temperatureLowerThanUnit) await this.temperatureLowerThanUnit.selectText(temperatureLowerThanUnit);
    if (temperatureMax !== undefined) await this.temperatureMax.fill(temperatureMax.toString());
    if (temperatureHigherThan !== undefined) await this.temperatureHigherThan.fill(temperatureHigherThan.toString());
    if (temperatureHigherThanFor !== undefined) await this.temperatureHigherThanFor.fill(temperatureHigherThanFor.toString());
    if (temperatureHigherThanUnit) await this.temperatureHigherThanUnit.selectText(temperatureHigherThanUnit);
    if (humidityMin !== undefined) await this.humidityMin.fill(humidityMin.toString());
    if (humidityLowerThan !== undefined) await this.humidityLowerThan.fill(humidityLowerThan.toString());
    if (humidityLowerThanFor !== undefined) await this.humidityLowerThanFor.fill(humidityLowerThanFor.toString());
    if (humidityLowerThanUnit) await this.humidityLowerThanUnit.selectText(humidityLowerThanUnit);
    if (humidityMax !== undefined) await this.humidityMax.fill(humidityMax.toString());
    if (humidityHigherThan !== undefined) await this.humidityHigherThan.fill(humidityHigherThan.toString());
    if (humidityHigherThanFor !== undefined) await this.humidityHigherThanFor.fill(humidityHigherThanFor.toString());
    if (humidityHigherThanUnit) await this.humidityHigherThanUnit.selectText(humidityHigherThanUnit);
    if (strongImpactGForce !== undefined) await this.strongImpactGForce.fill(strongImpactGForce.toString());
    if (strongImpactMiliseconds !== undefined) await this.strongImpactMiliseconds.fill(strongImpactMiliseconds.toString());
    if (weakImpactGForce !== undefined) await this.weakImpactGForce.fill(weakImpactGForce.toString());
    if (weakImpactMiliseconds !== undefined) await this.weakImpactMiliseconds.fill(weakImpactMiliseconds.toString());
    if (portOfLoadingTime !== undefined) await this.portOfLoadingTime.fill(portOfLoadingTime.toString());
    if (portOfLoadingUnit) await this.portOfLoadingUnit.selectText(portOfLoadingUnit);
    if (transshipmentTime !== undefined) await this.transshipmentTime.fill(transshipmentTime.toString());
    if (transshipmentUnit) await this.transshipmentUnit.selectText(transshipmentUnit);
    if (portOfDestinationTime !== undefined) await this.portOfDestinationTime.fill(portOfDestinationTime.toString());
    if (portOfDestinationUnit) await this.portOfDestinationUnit.selectText(portOfDestinationUnit);
    if (closeShipmentsTime !== undefined) await this.closeShipmentsTime.fill(closeShipmentsTime.toString());
    if (closeShipmentsUnit) await this.closeShipmentsUnit.selectText(closeShipmentsUnit);
    if (noActivityTime !== undefined) await this.noActivityTime.fill(noActivityTime.toString());
    if (noActivityUnit) await this.noActivityUnit.selectText(noActivityUnit);
    if (batteryMinStartingLevel !== undefined) await this.batteryMinStartingLevel.fill(batteryMinStartingLevel.toString());
  }
}
