import { test } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { ActionsBar, ActionsBarButton } from '../../components/actions-bar.page';

// Dummy page for mounting the ActionsBar component in isolation
// In a real app, you may want to use a dedicated test page or a fixture

test.describe('ActionsBar Component', () => {
  let actionsBar: ActionsBar;

  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to a page where the ActionsBar is visible
    // await authenticatedPage.goto('/');
    // Optionally, wait for the ActionsBar to be ready
    await authenticatedPage.locator('[data-testid="actions-bar-root"]').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    actionsBar = new ActionsBar(authenticatedPage);
  });

  test('should render all main action buttons', async () => {
    await expect(actionsBar.clearFiltersButton).toBeVisible();
    await expect(actionsBar.exportToExcelButton).toBeVisible();
    await expect(actionsBar.createNewButton).toBeVisible();
  });

  test('should trigger Clear Filters action', async () => {
    await expect(actionsBar.clearFiltersButton).toBeEnabled();
    await actionsBar.clickButton(ActionsBarButton.ClearFilters);
  });

  test('should trigger Export to Excel action', async () => {
    await expect(actionsBar.exportToExcelButton).toBeEnabled();
    // Use the exportToExcelAndWaitForDownload helper
    // This will fail if no download is triggered, which is a good test
    const download = await actionsBar.exportToExcelAndWaitForDownload();
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/);
  });

  test('should trigger Create New action', async () => {
    await expect(actionsBar.createNewButton).toBeEnabled();
    await actionsBar.clickButton(ActionsBarButton.CreateNew);
    // Optionally, assert that a creation dialog or form appears
  });
});
