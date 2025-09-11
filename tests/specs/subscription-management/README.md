# Subscription Management Tests

This directory contains end-to-end tests for the Subscription Management functionality using Playwright.

## Page Objects

The Subscription Management module is structured using the Page Object Model (POM) pattern with these components:

- `SubscriptionManagementPage`: Main page class that combines the subscription form tabs
- `SubscriptionGridPage`: Handles the subscription listing grid view
- `SubscriptionInfo`: Component for the subscription info tab (first tab)
- `BulkOperations`: Component for the bulk operations tab (second tab)

## Test Coverage

The tests cover the following scenarios:

1. **Creating a new subscription**
   - Navigates to the subscription grid
   - Clicks create button
   - Fills in required subscription information
   - Saves the subscription
   - Verifies subscription appears in the grid

2. **Editing an existing subscription**
   - Finds a test subscription by reference
   - Opens the subscription
   - Changes the end date
   - Saves changes
   - Verifies changes were applied

3. **Adding devices to an existing subscription**
   - Finds a test subscription by reference
   - Opens the subscription
   - Switches to bulk operations tab
   - Adds devices
   - Saves changes

## Prerequisites

- Test server running at the default URL
- Valid test user credentials configured in `test-users.ts`
- Chrome, Firefox, or WebKit browsers installed

## Running the Tests

To run the subscription management tests:

```bash
npx playwright test tests/specs/subscription-management
```

To run with a specific browser:

```bash
npx playwright test tests/specs/subscription-management --project=chromium
```
