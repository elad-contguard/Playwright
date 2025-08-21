// import { test as base } from '@playwright/test';
// import { LoginPage } from '../pages/login.page';
// import { RouteManagementGridPage } from '../pages/route-management/route-management-grid.page';
// import { AuthHelper } from '../helpers/auth.helper';

// // Declare the types of fixtures
// type Pages = {
//   loginPage: LoginPage;
//   routeTemplatesPage: RouteTemplatesPage;
//   authHelper: AuthHelper;
// };

// // Extend base test with our fixtures
// export const test = base.extend<Pages>({
//   loginPage: async ({ page }, use) => {
//     await use(new LoginPage(page));
//   },
//   routeTemplatesPage: async ({ page }, use) => {
//     await use(new RouteTemplatesPage(page));
//   },
//   authHelper: async ({ page }, use) => {
//     await use(new AuthHelper(page));
//   }
// });

// // Create a fixture for authenticated tests
// export const authenticatedTest = test.extend({
//   // Auto-login before each test
//   routeTemplatesPage: async ({ page, authHelper }, use) => {
//     await authHelper.loginAsTestUser();
//     await use(new RouteTemplatesPage(page));
//   }
// });

// export { expect } from '@playwright/test';
