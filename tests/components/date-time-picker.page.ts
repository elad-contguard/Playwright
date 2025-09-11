import { Page, Locator } from '@playwright/test';

export class DateTimePicker {
  /**
   * Sets the date by filling the input field
   * @param date Date string to fill
   */
  async setDate(date: string): Promise<void> {
    await this.input.fill(date);
  }
  /**
   * Opens the calendar popup
   */
  async openCalendar() {
    await this.calendarButton?.click();
  }
  readonly label?: string;
  readonly input: Locator;
  readonly calendarButton: Locator;
  readonly decreaseDayButton: Locator;
  readonly increaseDayButton: Locator;

  /**
   * Constructor supports:
   * - Direct input locator
   * - Parent locator (cgrd-date-time-picker), auto-selects first input or input[type="text"]
   */
  constructor(locator: Locator) {
    this.input = locator.locator('input').first();
    this.calendarButton = locator.locator('button').filter({ hasText: 'event' }).first();
    this.decreaseDayButton = locator.locator('button[aria-label="Decrease date by 1 day"]').first();
    this.increaseDayButton = locator.locator('button[aria-label="Increase date by 1 day"]').first();
  }

  /**
   * Decreases the date by one day
   */
  async decreaseDay() {
    await this.decreaseDayButton?.click();
  }

  /**
   * Increases the date by one day
   */
  async increaseDay() {
    await this.increaseDayButton?.click();
  }
  
  /**
   * Selects a date from the calendar
   * @param day Day number (1-31)
   * @param month Month name (e.g., 'January', 'February')
   * @param year Year (e.g., '2025')
   */
  async selectDateFromCalendar(day: number, month: string, year: string): Promise<void> {
    await this.openCalendar();
    // Format to match calendar header (e.g., "SEP 2025")
    const shortMonth = month.substring(0, 3).toUpperCase();
    const monthYearHeader = `${shortMonth} ${year}`;
    const page = this.input.page();
    // Check if we need to navigate to the correct month/year
    const currentMonthYear = await page.locator('[role="heading"]:has-text("2")').first().innerText();
    if (currentMonthYear !== monthYearHeader) {
      // Open month/year selector
      await page.getByRole('button', { name: 'Choose month and year' }).click();
      // Select year first, then month
      await page.getByRole('button', { name: year }).click();
      await page.getByRole('button', { name: month }).click();
    }
    // Select the day
    await page.getByRole('button', { name: new RegExp(`${month} ${day}, ${year}`) }).click();
  }
}
