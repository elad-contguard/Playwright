import { test } from '../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { ActionsBar, ActionsBarButton } from '../components/actions-bar.page';

test.describe('ActionsBar', () => {
  let actionsBar: ActionsBar;

  test.beforeEach(async ({ authenticatedPage }) => {
    actionsBar = new ActionsBar(authenticatedPage);
  });

  test('should display all actions bar buttons', async () => {
    await expect(actionsBar.clearFiltersButton).toBeVisible();
    await expect(actionsBar.exportToExcelButton).toBeVisible();
    await expect(actionsBar.createNewButton).toBeVisible();
  });

  test('should click Clear Filters', async () => {
    await actionsBar.clickButton(ActionsBarButton.ClearFilters);
    // Optionally, add an assertion to verify filter clearing
  });

  test('should click Export to Excel', async () => {
    await actionsBar.clickButton(ActionsBarButton.ExportToExcel);
    // Optionally, add an assertion to verify export
  });

  test('should click Create New', async () => {
    await actionsBar.clickButton(ActionsBarButton.CreateNew);
    // Optionally, add an assertion to verify new item creation
  });
});
