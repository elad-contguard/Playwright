import { test } from '../../fixtures/auth.fixture';
import { RouteManagementGridPage } from '../../pages/route-management/route-management-grid.page';
import { expect } from '@playwright/test';

// Test: Add and delete segment button functionality

test('should add and delete a segment in route creation', async ({ authenticatedPage }) => {
  const routeManagementGridPage = new RouteManagementGridPage(authenticatedPage);
  await routeManagementGridPage.startCreateRoute();

  // Go to Segments section
  await authenticatedPage.waitForTimeout(500);
  const segmentsTab = authenticatedPage.getByRole('tab', { name: /Segments/i });
  await segmentsTab.waitFor({ state: 'visible' });
  await segmentsTab.click();

  const segmentsForm = routeManagementGridPage.getRouteEditor().segmentsForm;

  // Initial counts
  const initialHeaders = await segmentsForm.getSegmentHeadersCount();
  const initialDeletes = await segmentsForm.getDeleteIconsCount();
  expect(initialHeaders).toBeGreaterThanOrEqual(2);

  // Add
  await segmentsForm.addSegment();
  await authenticatedPage.waitForTimeout(800);

  // Verify counts after add
  await expect(segmentsForm.getSegmentHeadersLocator()).toHaveCount(initialHeaders + 1, { timeout: 5000 });
  await expect(segmentsForm.getDeleteIconsLocator()).toHaveCount(initialDeletes + 1, { timeout: 5000 });

  // Delete the last (new) segment
  await segmentsForm.deleteLastSegment();

  // Verify counts after delete
  await expect(segmentsForm.getSegmentHeadersLocator()).toHaveCount(initialHeaders, { timeout: 5000 });
  await expect(segmentsForm.getDeleteIconsLocator()).toHaveCount(initialDeletes, { timeout: 5000 });
});
