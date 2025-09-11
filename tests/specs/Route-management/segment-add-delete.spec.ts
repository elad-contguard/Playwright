import { test } from '../../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { RouteManagementGridPage } from '../../pages/route-management/route-management-grid.page';
import { RouteEditor } from '../../pages/route-management/route-editor.page';
import { SegmentType, DurationUnit } from '../../pages/route-management/components/segments-form.page';

test.describe('Route Management - Segment Operations', () => {
  let routeManagementGridPage: RouteManagementGridPage;
  let routeEditor: RouteEditor;

  test.beforeEach(async ({ authenticatedPage }) => {
    routeManagementGridPage = new RouteManagementGridPage(authenticatedPage);
    
    // Navigate to route management and start creating a new route
    await routeManagementGridPage.startCreateRoute();
    
    // Get the route editor
    routeEditor = routeManagementGridPage.getRouteEditor();
    
    // Navigate to the Segments tab
    await routeEditor.stepper.goToStepByLabel('Segments');
  });

  test('should be able to add a new segment', async ({ authenticatedPage }) => {
    // Get the segments form from the route editor
    const segmentsForm = routeEditor.segmentsForm;
    
    // Get the initial count of segments
    const initialSegmentCount = await segmentsForm.segmentRows.count();
    console.log(`Initial segment count: ${initialSegmentCount}`);
    
    try {
      // Add a new segment
      await segmentsForm.addSegment();
      console.log('Add segment method called successfully');
      
      // Small wait to ensure UI updates
      await authenticatedPage.waitForTimeout(1000);
      
      // Check that a new segment was added
      const newCount = await segmentsForm.segmentRows.count();
      console.log(`New segment count: ${newCount}`);
      
      await expect(segmentsForm.segmentRows).toHaveCount(initialSegmentCount + 1, 
        { timeout: 10000 });
      
      console.log('Test passed successfully');
    } catch (error) {
      console.error('Test failed with error:', error);
      throw error;
    }
  });

  test('should be able to delete a segment', async ({ authenticatedPage }) => {
    // Get the segments form from the route editor
    const segmentsForm = routeEditor.segmentsForm;
    
    // Add a new segment to ensure we have one to delete
    await segmentsForm.addSegment();
    
    // Get the count of segments after adding
    const segmentCountAfterAdd = await segmentsForm.segmentRows.count();
    
    // Delete the newly added segment (it will be the second-to-last segment)
    await segmentsForm.deleteSegment(segmentCountAfterAdd - 2);
    
    // Verify that the segment was deleted
    await expect(segmentsForm.segmentRows).toHaveCount(segmentCountAfterAdd - 1);
  });

  test('should add and then delete multiple segments', async ({ authenticatedPage }) => {
    // Get the segments form from the route editor
    const segmentsForm = routeEditor.segmentsForm;
    
    // Get the initial count of segments
    const initialSegmentCount = await segmentsForm.segmentRows.count();
    
    // Add three new segments
    for (let i = 0; i < 3; i++) {
      await segmentsForm.addSegment();
    }
    
    // Verify we have added 3 segments
    const newCount = await segmentsForm.segmentRows.count();
    await expect(newCount).toBe(initialSegmentCount + 3);
    
    // Delete the segments one by one
    for (let i = 0; i < 3; i++) {
      const currentCount = await segmentsForm.segmentRows.count();
      // Delete the second-to-last segment (since last is always destination)
      await segmentsForm.deleteSegment(currentCount - 2);
    }
    
    // Verify we're back to the initial count
    await expect(segmentsForm.segmentRows).toHaveCount(initialSegmentCount);
  });

  test('should add a segment and fill it with data', async ({ authenticatedPage }) => {
    // Get the segments form from the route editor
    const segmentsForm = routeEditor.segmentsForm;
    
    // Add a new segment
    await segmentsForm.addSegment();
    
    // Fill the new segment with data (assuming it's a Way Point)
    await segmentsForm.fillSegment({
      type: SegmentType.WayPoint,
      perimeterName: 'Test Perimeter',
      relatedWarehouseAccount: 'Test Warehouse',
      segmentDuration: 2,
      segmentUnit: DurationUnit.Days,
      segmentNotes: 'Test segment notes',
      wayDuration: 1,
      wayUnit: DurationUnit.Hours,
      wayNotes: 'Test way notes'
    });
    
    // Verify segment was added and filled correctly
    // Here we would add more specific checks for the values entered
    
    // Delete the segment we just added
    const segmentCount = await segmentsForm.segmentRows.count();
    await segmentsForm.deleteSegment(segmentCount - 2); // Delete the second-to-last segment
    
    // Verify the segment was deleted
    await expect(segmentsForm.segmentRows).toHaveCount(segmentCount - 1);
  });
});
