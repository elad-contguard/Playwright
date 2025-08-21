import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import dotenv from 'dotenv';

dotenv.config();

const user = process.env.USER || "";
const password = process.env.PASSWORD || "";

export const test = base.extend<{ authenticatedPage: import('@playwright/test').Page }>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user, password);
    await use(page);
  },
});
