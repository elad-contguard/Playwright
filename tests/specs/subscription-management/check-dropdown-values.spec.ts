import { test } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';

test.describe('Check dropdown values', () => {
  test('should check subscription type dropdown values', async ({ authenticatedPage }) => {
    // Navigate to Subscriptions page
    await authenticatedPage.getByRole('button', { name: /Subscriptions/i }).click();
    await expect(authenticatedPage).toHaveURL(/subscription-management/i);
    
    // Click the create new button (assuming there's a button to create new subscription)
    await authenticatedPage.getByRole('button', { name: /New|Create|Add/i }).click();
    
    // Wait for the subscription type dropdown to be available
    const subscriptionTypeDropdown = authenticatedPage.getByRole('combobox', { name: 'Subscription Type' });
    await expect(subscriptionTypeDropdown).toBeVisible();
    
    // Click on the dropdown to open it
    await subscriptionTypeDropdown.click();
    
    // Wait for options to be visible and capture them
    const options = authenticatedPage.locator('[role="listbox"] [role="option"]');
    await expect(options.first()).toBeVisible();
    
    // Get the text of all options
    const optionCount = await options.count();
    console.log(`Found ${optionCount} subscription type options`);
    
    for (let i = 0; i < optionCount; i++) {
      const optionText = await options.nth(i).textContent();
      console.log(`Option ${i + 1}: ${optionText?.trim()}`);
    }
    
    // Take a screenshot for reference
    await authenticatedPage.screenshot({ path: 'subscription-type-dropdown.png' });
  });
});
