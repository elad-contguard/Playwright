import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import dotenv from 'dotenv';

dotenv.config();

const user = process.env.USER || "";
const password = process.env.PASSWORD || "";
// Test constants
const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Login failed. Please try again.',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
} as const;

const SELECTORS = {
  ROUTE_TEMPLATES_HEADING: /Route Templates/i,
  LOGIN_URL_SEGMENT: '/login',
} as const;

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('vaild credentials - should authenticate successfully', async ({ page }) => {
    await loginPage.login(user, password);
    await expect(page.getByRole('heading', { name: SELECTORS.ROUTE_TEMPLATES_HEADING })).toBeVisible();
  });

  test('should reject invalid username with valid password', async ({ page }) => {
    await loginPage.login('invalid.user@contguard.com', password);
    
    const errorMessage = page.getByText(ERROR_MESSAGES.LOGIN_FAILED);
    await expect(errorMessage).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page.url()).toContain(SELECTORS.LOGIN_URL_SEGMENT);
  });

  test('should reject valid username with invalid password', async ({ page }) => {
    await loginPage.login(user, 'WrongPassword123!');
    
    const errorMessage = page.getByText(ERROR_MESSAGES.LOGIN_FAILED);
    await expect(errorMessage).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page.url()).toContain(SELECTORS.LOGIN_URL_SEGMENT);
  });

  test('should validate empty credentials', async ({ page }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    
    await loginPage.emailInput.focus();
    await page.keyboard.press('Tab');
    await expect(page.getByText(ERROR_MESSAGES.EMAIL_REQUIRED)).toBeVisible();
    
    await loginPage.passwordInput.focus();
    await page.keyboard.press('Tab');
    await expect(page.getByText(ERROR_MESSAGES.PASSWORD_REQUIRED)).toBeVisible();
    
    await expect(loginPage.loginButton).toBeDisabled();
  });

  test.skip('should handle very long inputs correctly', async ({ page }) => {
    const longEmail = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';
    const longPassword = 'a'.repeat(256);
    
    // Fill in the fields
    await loginPage.emailInput.fill(longEmail);
    await loginPage.passwordInput.fill(longPassword);
    
    // BUG: Login button is incorrectly disabled for long inputs
    // The button should remain enabled as length validation should be done on submit
    await expect(loginPage.loginButton).toBeEnabled({ timeout: 1000 }).catch(() => {
      test.fail(true, 'BUG: Login button is incorrectly disabled for long inputs. This is a UX issue as validation should happen on submit.');
    });
  });

  test('should handle email case sensitivity', async ({ page }) => {
    const upperEmail = user.toUpperCase();
    await loginPage.login(upperEmail, password);
    await expect(page.getByRole('heading', { name: SELECTORS.ROUTE_TEMPLATES_HEADING })).toBeVisible();
  });

  test('should handle password case sensitivity', async ({ page }) => {
    const upperPassword = password.toUpperCase();
    await loginPage.login(user, upperPassword);
    
    const errorMessage = page.getByText(ERROR_MESSAGES.LOGIN_FAILED);
    await expect(errorMessage).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page.url()).toContain(SELECTORS.LOGIN_URL_SEGMENT);
  });

  test('should handle multiple failed attempts', async ({ page }) => {
    for(let i = 0; i < 3; i++) {
      await loginPage.login('test@contguard.com', 'wrong-password-' + i);
      await expect(page.getByText(ERROR_MESSAGES.LOGIN_FAILED)).toBeVisible();
    }
    
    await expect(page.getByText(ERROR_MESSAGES.LOGIN_FAILED)).toBeVisible();
  });
  test('should toggle password visibility', async ({ page }) => {
    // Password should be hidden by default
    expect(await loginPage.isPasswordHidden()).toBe(true);
    // Toggle visibility
    await loginPage.togglePasswordVisibility();
    expect(await loginPage.isPasswordVisible()).toBe(true);
    // Toggle again to hide
    await loginPage.togglePasswordVisibility();
    expect(await loginPage.isPasswordHidden()).toBe(true);
  });

  test('should allow typing password when visible and hidden', async ({ page }) => {
    // Password hidden by default
    await loginPage.passwordInput.fill('hiddenPassword');
    expect(await loginPage.passwordInput.inputValue()).toBe('hiddenPassword');
    // Toggle to visible
    await loginPage.togglePasswordVisibility();
    await loginPage.passwordInput.fill('visiblePassword');
    expect(await loginPage.passwordInput.inputValue()).toBe('visiblePassword');
    // Toggle back to hidden
    await loginPage.togglePasswordVisibility();
    expect(await loginPage.isPasswordHidden()).toBe(true);
  });
});
