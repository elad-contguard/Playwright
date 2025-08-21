import { test, expect } from '@playwright/test';
import { NavBar } from './pages/nav-bar.page';
import { LoginPage } from './pages/login.page';

test.describe('Navigation Bar', () => {
  test('should log out successfully', async ({ page }) => {
    const navBar = new NavBar(page);
    // Ensure user is logged in before testing logout
    const loginPage = new LoginPage(page);
    await loginPage.login('testuser', 'testpassword'); // Replace with valid credentials or use a test user utility
    await navBar.userProfileButton.waitFor();
    await navBar.logout();
    // Assert that login page is visible after logout
    await expect(page.getByLabel('Email')).toBeVisible();
  });
});