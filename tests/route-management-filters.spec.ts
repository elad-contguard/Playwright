// import { test, expect } from '@playwright/test';
// import { LoginPage } from './pages/login.page';
// import { RouteTemplatesPage } from './pages/route-templates.page';
// import { users } from './fixtures/test-users';

// test.describe('Route Templates Filters', () => {
//   let routeTemplatesPage: RouteTemplatesPage;

//   test.beforeEach(async ({ page }) => {
//     // Initialize page objects
//     routeTemplatesPage = new RouteTemplatesPage(page);
//     const loginPage = new LoginPage(page);

//     // Login first
//     console.log('Logging in...');
//     await loginPage.goto();
//     await loginPage.login(users.automationUser.email, users.automationUser.password);
    
//     // Then navigate to route templates
//     console.log('Navigating to route templates...');
//     await routeTemplatesPage.goto();
//     await routeTemplatesPage.waitForPageReady();
//   });

//   test('should filter by status', async ({ page }) => {
//     await routeTemplatesPage.filterByStatusButton.click();
    
//     // Status filter dialog should appear
//     const statusFilter = page.getByRole('dialog', { name: 'Filter by Status' });
//     await expect(statusFilter).toBeVisible();

//     // Check filter options
//     const options = statusFilter.locator('ul[role="listbox"] table tr');
//     await expect(options).toHaveCount(4); // Active, Inactive, Draft, All
    
//     // Select Active status
//     await statusFilter.locator('ul[role="listbox"] table tr', { hasText: 'Active' }).first().click();
    
//     // Verify filter was applied
//     await expect(routeTemplatesPage.filterByStatusButton).toHaveAttribute('aria-expanded', 'false');
//     await expect(page).toHaveURL(/.*status=active/i);
//   });

//   test('should filter by origin location', async ({ page }) => {
//     await routeTemplatesPage.filterByOriginButton.click();
    
//     // Origin filter dialog should appear
//     const originFilter = page.getByRole('dialog', { name: 'Filter by Origin' });
//     await expect(originFilter).toBeVisible();

//     // Search for a location
//     const searchInput = originFilter.getByRole('searchbox');
//     await searchInput.fill('New York');
    
//     // Select first matching location
//     const firstMatch = originFilter.locator('ul[role="listbox"] table tr').first();
//     await firstMatch.click();

//     // Verify filter was applied
//     await expect(routeTemplatesPage.filterByOriginButton).toHaveAttribute('aria-expanded', 'false');
//     await expect(page).toHaveURL(/.*origin=.+/);
//   });

//   test('should filter by destination location', async ({ page }) => {
//     await routeTemplatesPage.filterByDestinationButton.click();
    
//     // Destination filter dialog should appear
//     const destFilter = page.getByRole('dialog', { name: 'Filter by Destination' });
//     await expect(destFilter).toBeVisible();

//     // Search for a location
//     const searchInput = destFilter.getByRole('searchbox');
//     await searchInput.fill('Los Angeles');
    
//     // Select first matching location
//     const firstMatch = destFilter.locator('ul[role="listbox"] table tr').first();
//     await firstMatch.click();

//     // Verify filter was applied
//     await expect(routeTemplatesPage.filterByDestinationButton).toHaveAttribute('aria-expanded', 'false');
//     await expect(page).toHaveURL(/.*destination=.+/);
//   });

//   test('should clear all filters', async ({ page }) => {
//     // Apply some filters first
//     await routeTemplatesPage.filterByStatusButton.click();
//     await page.locator('ul[role="listbox"] table tr', { hasText: 'Active' }).first().click();

//     await routeTemplatesPage.filterByOriginButton.click();
//     const originSearch = page.getByRole('searchbox');
//     await originSearch.fill('New York');
//     await page.locator('ul[role="listbox"] table tr').first().click();

//     // Clear filters
//     const clearFiltersButton = page.getByRole('button', { name: 'Clear Filters' });
//     await clearFiltersButton.click();

//     // Verify all filters were cleared
//     await expect(page).not.toHaveURL(/.*status=|.*origin=|.*destination=/);
//     await expect(routeTemplatesPage.routeTemplateRows).toBeVisible();
//   });
// });
