import { test } from '../../fixtures/auth.fixture';
import { RouteManagementGridPage } from '../../pages/route-management/route-management-grid.page';
import { expect } from '@playwright/test';

// Test: Add and delete segment button functionality

test('should add and delete a segment in route creation', async ({ authenticatedPage }) => {
  const routeManagementGridPage = new RouteManagementGridPage(authenticatedPage);
  await routeManagementGridPage.startCreateRoute();

  // Go to Segments section (assume stepper or tab navigation)
  await routeManagementGridPage.page.getByRole('tab', { name: /Segments/i }).click();

  // Add a segment
  const segmentsForm = routeManagementGridPage.getRouteEditor().segmentsForm;
  await segmentsForm.addSegment();

  // Delete the newly added segment (assume it's the last one)
  const count = await segmentsForm.segmentRows.count();
  await segmentsForm.deleteSegment(count - 1);

  // Wait for the segment count to update after deletion
  await expect(segmentsForm.segmentRows).toHaveCount(2, { timeout: 10000 });
});
