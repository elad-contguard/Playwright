import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { users } from '../fixtures/test-users';

/**
 * Authentication helper functions
 */
export class AuthHelper {
  constructor(private page: Page) {}

  /**
   * Perform login with default test user
   */
  async loginAsTestUser() {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login(users.automationUser.email, users.automationUser.password);
  }

  /**
   * Login with specific credentials
   */
  async loginAs(email: string, password: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login(email, password);
  }
}
