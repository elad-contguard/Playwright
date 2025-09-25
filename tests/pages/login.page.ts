import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  // ...existing code...
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
  readonly togglePasswordVisibilityButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
  // Form and container elements
  this.loginForm = page.locator('form');

  // Input fields using data-testid selectors
  this.emailInput = page.locator('[data-testid="login-email"]');
  this.passwordInput = page.locator('[data-testid="login-password"]');
  this.loginButton = page.locator('[data-testid="login-submit"]');
  this.togglePasswordVisibilityButton = page.locator('[data-testid="toggle-password-visibility"]');

   
    // // Input fields with more specific selectors
    // this.emailInput = page.locator('input[name="username"]');
    // this.passwordInput = page.locator('input[type="password"]');
    // this.loginButton = page.locator('button', { hasText: 'Login' });
    
  // Validation and error messages (unchanged, fallback to text)
  this.errorMessage = page.getByText('Login failed. Please try again.');
  this.emailValidation = page.getByText('Email is required');
  this.passwordValidation = page.getByText('Password is required');

  // Error dialog (unchanged, fallback to text/role)
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
  /**
   * Toggle the password visibility by clicking the toggle button
   * Ensures the toggle actually changes the password field type
   * @param maxRetries Maximum number of retry attempts (default: 3)
   */
  async togglePasswordVisibility(maxRetries = 3) {
    // Get the current state before clicking
    const wasVisible = await this.isPasswordVisible();
    const expectedState = !wasVisible;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Wait for the button to be visible and stabilize
        await this.togglePasswordVisibilityButton.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(200); // Give time for any animation
        
        // Click with force after a trial click attempt
        await this.togglePasswordVisibilityButton.click({ trial: true }).catch(() => {});
        await this.togglePasswordVisibilityButton.click({ force: true });
        
        // Wait for toggle to take effect
        await this.page.waitForTimeout(300);
        
        // Verify the toggle worked by checking if state changed
        const currentState = await this.isPasswordVisible();
        if (currentState === expectedState) {
          return; // Success
        }
        
        console.log(`Toggle attempt ${attempt + 1} didn't change password visibility state. Retrying...`);
      } catch (error: any) {
        const errorMessage = error.message || 'Unknown error';
        console.log(`Toggle attempt ${attempt + 1} failed with error: ${errorMessage}`);
        if (attempt === maxRetries - 1) throw error;
      }
      
      // Add increasing backoff between retries
      await this.page.waitForTimeout(200 * (attempt + 1));
    }
    
    throw new Error(`Failed to toggle password visibility after ${maxRetries} attempts`);
  }

  /**
   * Check if the password input is currently visible (type="text")
   */
  async isPasswordVisible(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute('type');
    return type === 'text';
  }

  /**
   * Check if the password input is currently hidden (type="password")
   */
  async isPasswordHidden(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute('type');
    return type === 'password';
  }
}
