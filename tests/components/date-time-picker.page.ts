import { Page, Locator } from '@playwright/test';

export class DateTimePicker {
  readonly input: Locator;
  readonly calendarButton: Locator;
  readonly decreaseDayButton: Locator;
  readonly increaseDayButton: Locator;

  constructor(page: Page, label: string) {
    this.input = page.getByRole('textbox', { name: label });
    this.calendarButton = page.locator('button').filter({ has: page.locator('img[event]') });
    this.decreaseDayButton = page.getByRole('button', { name: 'Decrease date by 1 day' });
    this.increaseDayButton = page.getByRole('button', { name: 'Increase date by 1 day' });
  }

  async setDate(date: string) {
    await this.input.fill(date);
  }

  async openCalendar() {
    await this.calendarButton.click();
  }

  async decreaseDay() {
    await this.decreaseDayButton.click();
  }

  async increaseDay() {
    await this.increaseDayButton.click();
  }
}
