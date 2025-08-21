import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  // Page elements
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginForm: Locator;
  readonly errorMessage: Locator;
  readonly emailValidation: Locator;
  readonly passwordValidation: Locator;
  readonly authErrorDialog: Locator;
  readonly authErrorOkButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Form and container elements
    this.loginForm = page.locator('form');
    
    // Input fields with more specific selectors
    this.emailInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button', { hasText: 'Login' });
    
    // Validation and error messages
    this.errorMessage = page.getByText('Login failed. Please try again.');
    this.emailValidation = page.getByText('Email is required');
    this.passwordValidation = page.getByText('Password is required');
    
    // Error dialog
    this.authErrorDialog = page.getByRole('dialog').filter({ hasText: 'User not authenticated!' });
    this.authErrorOkButton = this.authErrorDialog.getByRole('button', { name: 'OK' });
  }

  async goto() {
    await this.page.goto('/login');
    await this.waitForPageReady();
  }

  /**
   * Wait for the login page to be fully loaded and interactive
   */
  async waitForPageReady() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    
    // Handle any authentication error dialogs (should be removed after bug fix)
    if (await this.authErrorDialog.isVisible()) {
      await this.authErrorOkButton.click();
      await this.authErrorDialog.waitFor({ state: 'hidden' });
    }
    
    // Wait for essential form elements
    await this.loginForm.waitFor({ state: 'visible' });
    await this.emailInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.loginButton.waitFor({ state: 'visible' });
  }

  /**
   * Dismiss any error dialogs that are visible
   */
  async dismissErrors() {
    if (await this.authErrorDialog.isVisible()) {
      await this.authErrorOkButton.click();
      await this.authErrorDialog.waitFor({ state: 'hidden' });
    }
  }

  /**
   * Attempt to log in with the given credentials
   */
  async login(email: string, password: string) {
    await this.waitForPageReady();
    
    // Fill in credentials
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    // Ensure button is ready
    await expect(this.loginButton).toBeEnabled();
    
    // Submit form
    await this.loginButton.click({ force: true });
    
    // Wait for response
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if login attempt failed
   */
  async hasLoginError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get the current validation state of the form
   */
  async getValidationState() {
    return {
      emailRequired: await this.emailValidation.isVisible(),
      passwordRequired: await this.passwordValidation.isVisible(),
      loginEnabled: await this.loginButton.isEnabled()
    };
  }

  /**
   * Check if we're still on the login page
   */
  async isLoginPage(): Promise<boolean> {
    return await this.page.url().includes('/login');
  }
}
