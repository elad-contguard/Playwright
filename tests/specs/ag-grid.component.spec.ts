import { test } from '../fixtures/auth.fixture';
import { expect } from '@playwright/test';
import { AgGridPage } from '../components/ag-grid.page';

// Example test spec for AgGridComponent

test.describe('AgGridComponent', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // await authenticatedPage.goto('/route-management');

    
  });

  test('should get row and column count', async ({ authenticatedPage }) => {
    const grid = new AgGridPage(authenticatedPage);
    const rowCount = await grid.getRowCount();
    const colCount = await grid.getColumnCount();
    expect(rowCount).toBeGreaterThan(0);
    expect(colCount).toBeGreaterThan(0);
  });

  test('should get cell value by header and row index', async ({ authenticatedPage }) => {
    const grid = new AgGridPage(authenticatedPage);
    const value = await grid.getCellByHeaderAndIndex('Customer', 0);
    await expect(value).toHaveText(/./); // Should not be empty
  });

  test('should get all values in a row', async ({ authenticatedPage }) => {
    const grid = new AgGridPage(authenticatedPage);
    const values = await grid.getRowValues(0);
    expect(values.length).toBeGreaterThan(0);
    expect(values[0]).not.toBe('');
  });

  test('should get all values in a column', async ({ authenticatedPage }) => {
    const grid = new AgGridPage(authenticatedPage);
    const values = await grid.getColumnValues('Customer');
    expect(values.length).toBeGreaterThan(0);
    expect(values[0]).not.toBe('');
  });

  test('should find row index by cell value', async ({ authenticatedPage }) => {
    const grid = new AgGridPage(authenticatedPage);
    const values = await grid.getColumnValues('Customer');
    const searchValue = values[0];
    const rowIndex = await grid.findRowIndexByCellValue('Customer', searchValue);
    expect(rowIndex).toBeGreaterThanOrEqual(0);
  });

  test('should validate cell value', async ({ authenticatedPage }) => {
    const grid = new AgGridPage(authenticatedPage);
    const values = await grid.getColumnValues('Customer');
    const expectedValue = values[0];
    await grid.expectCellValue('Customer', 0, expectedValue);
  });

  test('should validate row values', async ({ authenticatedPage }) => {
    const grid = new AgGridPage(authenticatedPage);
    const expectedValues = await grid.getRowValues(0);
    await grid.expectRowValues(0, expectedValues);
  });

  test('should validate column values', async ({ authenticatedPage }) => {
    const grid = new AgGridPage(authenticatedPage);
    const expectedValues = await grid.getColumnValues('Customer');
    await grid.expectColumnValues('Customer', expectedValues);
  });
});
