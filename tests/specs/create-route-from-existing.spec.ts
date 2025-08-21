// import { test, expect } from '@playwright/test';
// import { CreateRouteDialog } from '../components/create-route-dialog.page';

// // Utility to extract route data from the first row
// async function getFirstRouteData(page) {
//   await page.goto('https://cg-nesspresso-test.contguard.dev/route-management');
//   // Wait for table to load
//   await expect(page.getByRole('heading', { name: /Route Templates/i })).toBeVisible();
//   // Get first row cells
//   const cells = await page.locator('div[role="rowgroup"] div[role="row"]').first().locator('div[role="gridcell"]');
//   // Extract text from relevant cells
//   return {
//     customer: await cells.nth(1).textContent(),
//     exporter: await cells.nth(2).textContent(),
//     exporterCode: await cells.nth(3).textContent(),
//     exporterCountry: await cells.nth(4).textContent(),
//     pol: await cells.nth(5).textContent(),
//     pod: await cells.nth(6).textContent(),
//     importer: await cells.nth(7).textContent(),
//     importerCode: await cells.nth(8).textContent(),
//     importerCountry: await cells.nth(9).textContent(),
//     status: await cells.nth(10).textContent(),
//     deviceless: (await cells.nth(12).textContent()) === 'Yes',
//     // Add more fields as needed
//   };
// }

// // Method to create a route with parameterized data
// async function createRoute(page, routeData) {
//   await page.goto('https://cg-nesspresso-test.contguard.dev/route-management');
//   await page.getByRole('button', { name: /Create New Route/i }).click();
//   const dialog = new CreateRouteDialog(page);
//   // Fill Route Info tab
//   await dialog.fillRouteInfo({
//     customer: routeData.customer,
//     description: routeData.description,
//     status: routeData.status,
//     serviceType: routeData.serviceType,
//     shipmentSource: routeData.shipmentSource,
//     deviceless: routeData.deviceless,
//     gonOrigin: routeData.gonOrigin,
//     gonDestination: routeData.gonDestination,
//     routeTags: routeData.routeTags,
//   });
//   await dialog.nextButton.click();

//   // Fill Thresholds tab
//   await dialog.thresholdsTab.click();
//   if (routeData.emailsTo) await dialog.emailsToInput.fill(routeData.emailsTo);
//   if (routeData.emailsCc) await dialog.emailsCcInput.fill(routeData.emailsCc);
//   if (routeData.temperatureMin) await dialog.temperatureMinSpin.fill(routeData.temperatureMin);
//   if (routeData.temperatureLowerThan) await dialog.temperatureLowerThanSpin.fill(routeData.temperatureLowerThan);
//   if (routeData.temperatureLowerThanFor) await dialog.temperatureLowerThanForSpin.fill(routeData.temperatureLowerThanFor);
//   if (routeData.temperatureLowerThanUnit) await dialog.temperatureLowerThanUnitCombo.selectOption({ label: routeData.temperatureLowerThanUnit });
//   if (routeData.temperatureMax) await dialog.temperatureMaxSpin.fill(routeData.temperatureMax);
//   if (routeData.temperatureHigherThan) await dialog.temperatureHigherThanSpin.fill(routeData.temperatureHigherThan);
//   if (routeData.temperatureHigherThanFor) await dialog.temperatureHigherThanForSpin.fill(routeData.temperatureHigherThanFor);
//   if (routeData.temperatureHigherThanUnit) await dialog.temperatureHigherThanUnitCombo.selectOption({ label: routeData.temperatureHigherThanUnit });
//   // ...add more Thresholds fields as needed...

//   // Fill Segments tab
//   await dialog.segmentsTab.click();
//   if (routeData.type) await dialog.typeCombo.selectOption({ label: routeData.type });
//   if (routeData.perimeterName) await dialog.perimeterNameCombo.selectOption({ label: routeData.perimeterName });
//   if (routeData.relatedWarehouseAccount) await dialog.relatedWarehouseAccountCombo.selectOption({ label: routeData.relatedWarehouseAccount });
//   if (routeData.segmentDuration) await dialog.segmentDurationSpin.fill(routeData.segmentDuration);
//   if (routeData.segmentUnit) await dialog.segmentUnitCombo.selectOption({ label: routeData.segmentUnit });
//   if (routeData.segmentNotes) await dialog.segmentNotesInput.fill(routeData.segmentNotes);
//   if (routeData.wayDuration) await dialog.wayDurationSpin.fill(routeData.wayDuration);
//   if (routeData.wayUnit) await dialog.wayUnitCombo.selectOption({ label: routeData.wayUnit });
//   if (routeData.wayNotes) await dialog.wayNotesInput.fill(routeData.wayNotes);
//   // ...add more Segments fields as needed...

//   // Optionally fill Editable Thresholds tab
//   // await dialog.editableThresholdsTab.click();
//   // ...fill fields if needed...

//   // Submit or save the route (add the appropriate action/button click)
//   // await dialog.saveButton.click();
// }

// test('create a new route based on first existing route', async ({ page }) => {
//   const routeData = await getFirstRouteData(page);
//   await createRoute(page, routeData);
//   // Add assertions to verify route creation
// });
