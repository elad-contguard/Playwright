# Subscription Management Test Framework

This directory contains the page objects and test specs for the Subscription Management module.

## Page Objects

### SubscriptionEditorPage

The `SubscriptionEditorPage` is the main page object for creating and editing subscriptions. It contains:

- Navigation methods to access the subscription creation and editing pages
- Tab management for switching between subscription info and bulk operations
- Component instances for interacting with different parts of the form
- Dialog handling for success confirmations
- High-level methods for common subscription operations

### Component Page Objects

1. **SubscriptionInfo**: Handles the first tab of the subscription form with fields like:
   - Device Owner
   - Subscription Type
   - Reference
   - Customer
   - Related GON
   - Status
   - Start/End Dates

2. **BulkOperations**: Handles the second tab of the subscription form for:
   - Device selection for starting subscriptions
   - Setting start dates for selected devices
   - Device selection for ending subscriptions
   - Setting end dates for selected devices

## Test Specs

The tests for subscription management are organized as follows:

- `create-subscription.spec.ts`: Tests for creating new subscriptions
- Additional test files will be added as needed

## Usage Examples

### Step-by-Step Approach

```typescript
const subscriptionEditor = new SubscriptionEditorPage(page);
await subscriptionEditor.navigateToCreateSubscription();

// Fill subscription info
await subscriptionEditor.subscriptionInfo.fillSubscriptionInfo({
  deviceOwner: 'Test Owner',
  subscriptionType: SubscriptionType.BASIC,
  reference: 'TEST-REF-123',
  customer: 'Test Customer',
  status: SubscriptionStatus.IN_SUBSCRIPTION,
  startDate: '09/07/2025'
});

// Go to bulk operations tab
await subscriptionEditor.subscriptionInfo.clickNext();

// Select devices and save
await subscriptionEditor.bulkOperations.selectMultipleDevices(['DEVICE-001']);
await subscriptionEditor.save();
```

### One-Step Creation with Dialog Handling

```typescript
const subscriptionEditor = new SubscriptionEditorPage(page);

// Create a subscription with all details in one call
await subscriptionEditor.createSubscription(
  // Subscription info
  {
    deviceOwner: 'Test Owner',
    subscriptionType: SubscriptionType.BASIC,
    reference: 'TEST-REF-123',
    customer: 'Test Customer',
    status: SubscriptionStatus.IN_SUBSCRIPTION,
    startDate: '09/07/2025',
    endDate: '12/31/2025'
  },
  // Bulk operations (optional)
  {
    devicesToStart: ['DEVICE-001', 'DEVICE-002'],
    startDate: '09/07/2025',
    devicesToEnd: ['DEVICE-OLD-001'],
    endDate: '09/06/2025'
  }
);

// Verify success dialog and confirm
await expect(subscriptionEditor.verifySuccessDialog()).resolves.toBe(true);
await subscriptionEditor.confirmSuccess();
```

### Convenience Method

```typescript
const subscriptionEditor = new SubscriptionEditorPage(page);

// Create a subscription with devices using the convenience method
await subscriptionEditor.createSubscriptionWithDevices({
  subscription: {
    deviceOwner: 'Test Owner',
    subscriptionType: SubscriptionType.PREMIUM,
    customer: 'VIP Customer',
    status: SubscriptionStatus.IN_SUBSCRIPTION,
    startDate: '09/10/2025'
  },
  devices: ['DEVICE-003', 'DEVICE-004'],
  startDate: '09/10/2025' // Optional - defaults to subscription start date
});
```
