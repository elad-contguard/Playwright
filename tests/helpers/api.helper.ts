import { Page } from '@playwright/test';

/**
 * API helper functions for making direct API calls
 */
export class ApiHelper {
  constructor(private page: Page) {}

  /**
   * Get authentication token from current session
   */
  async getAuthToken(): Promise<string | null> {
    return await this.page.evaluate(() => {
      return localStorage.getItem('auth_token');
    });
  }

  /**
   * Make authenticated API request
   */
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    const token = await this.getAuthToken();
    if (!token) throw new Error('No authentication token found');

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
