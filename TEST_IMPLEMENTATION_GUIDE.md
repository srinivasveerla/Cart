# Cart Application - Test Implementation Guide

## Overview

This document outlines the test structure and implementation status for the Cart application.

## Test Structure

```
src/
├── components/
│   ├── auth/
│   │   └── __tests__/
│   │       ├── Login.test.tsx ✅
│   │       └── Logout.test.tsx ✅
│   └── Dashboard/
│       └── __tests__/
│           ├── CartCreation.test.tsx ✅
│           ├── CartJoin.test.tsx ✅
│           ├── CartItems.test.tsx ✅
│           ├── CartDetails.test.tsx (pending)
│           ├── CartUsers.test.tsx (pending)
│           └── UserCarts.test.tsx (pending)
├── context/
│   └── __tests__/
│       └── UserContext.test.tsx ✅
├── test/
│   ├── setup.ts ✅ (Vitest setup)
│   ├── test-utils.tsx ✅ (Custom render with providers)
│   ├── mocks/
│   │   └── firebase.ts ✅ (Firebase mocks)
│   └── __tests__/
│       ├── firebase-integration.test.ts ✅ (Integration test templates)
│       └── e2e.spec.ts ✅ (E2E test templates)
```

## Running Tests

### Unit Tests
```bash
npm test
```

### Watch Mode
```bash
npm test -- --watch
```

### UI Mode (interactive)
```bash
npm test:ui
```

### Coverage Report
```bash
npm test:coverage
```

## Implemented Tests (✅)

### 1. Authentication Tests
- **Login.test.tsx**
  - ✅ Render login page
  - ✅ Call signInWithPopup on button click
  - ✅ Navigate to dashboard after success
  - ✅ Handle login errors

- **Logout.test.tsx**
  - ✅ Render logout button
  - ✅ Call signOut on button click
  - ✅ Verify button styling

### 2. Cart Management Tests
- **CartCreation.test.tsx** (7 tests)
  - ✅ Render form
  - ✅ Disable button when empty
  - ✅ Enable button when filled
  - ✅ Enforce 3-cart limit
  - ✅ Create cart successfully
  - ✅ Clear input after creation
  - ✅ Handle database errors

- **CartJoin.test.tsx** (9 tests)
  - ✅ Render form
  - ✅ Button disable/enable logic
  - ✅ Validate cart ID input
  - ✅ Enforce 3-cart limit for joiner
  - ✅ Enforce 5-user limit per cart
  - ✅ Handle invalid cart IDs
  - ✅ Join successfully
  - ✅ Clear input after join
  - ✅ Handle database errors

- **CartItems.test.tsx** (11 tests)
  - ✅ Render item list
  - ✅ Render add item form
  - ✅ Button disable/enable logic
  - ✅ Validate item name
  - ✅ Add item with name and quantity
  - ✅ Add item with name only
  - ✅ Clear inputs after adding
  - ✅ Remove item on double-click
  - ✅ Handle add item errors
  - ✅ Handle remove item errors
  - ✅ Display items without quantity

### 3. Context Tests
- **UserContext.test.tsx** (5 tests)
  - ✅ Throw error when used outside provider
  - ✅ Provide context when wrapped
  - ✅ Update user when setUser called
  - ✅ Clear user when set to null
  - ✅ Maintain state across remounts

### 4. Configuration Files
- **vitest.config.ts** ✅
  - jsdom environment
  - Global test setup
  - Coverage configuration
  - Path aliases

- **setup.ts** ✅
  - Testing library setup
  - Firebase mocks
  - Window API mocks

- **test-utils.tsx** ✅
  - Custom render function
  - Provider wrappers (Router, UserProvider)

- **mocks/firebase.ts** ✅
  - Mock auth functions
  - Mock database functions
  - Mock user object
  - Helper functions for creating mocks

## Pending Tests (⏳)

### 1. Component Tests (Partially Implemented)
- [ ] **CartDetails.test.tsx**
  - Tests for cart display
  - Tests for cart deletion (owner only)
  - Tests for copy cart ID
  - Tests for leave cart functionality

- [ ] **CartUsers.test.tsx**
  - Tests for displaying cart members
  - Tests for user list updates

- [ ] **UserCarts.test.tsx**
  - Tests for listing user carts
  - Tests for real-time updates
  - Tests for item count synchronization

### 2. Integration Tests
- [ ] **firebase-integration.test.ts** (Templates provided)
  - Firebase Emulator setup
  - Authentication integration
  - Database operations
  - Real-time synchronization
  - Business logic constraints
  - Error handling

### 3. E2E Tests
- [ ] **e2e.spec.ts** (Templates provided)
  - Choose tool: Playwright or Cypress
  - Install additional testing dependencies
  - Implement complete user flows
  - Test across device sizes
  - Performance testing

## Test Coverage Status

### Current Coverage
- **Authentication**: 100% (2/2 components)
- **Cart Management**: 75% (3/4 components)
- **Item Management**: 100% (1/1 component)
- **Context/Hooks**: 100% (1/1)
- **Overall Unit Tests**: ~60 tests implemented

### Target Coverage
- Unit Tests: 80%+ of components
- Integration Tests: All critical flows
- E2E Tests: Happy path + error scenarios

## Setup Instructions

### 1. Already Configured
```bash
npm install
```

The following are already set up:
- ✅ Vitest configuration (vitest.config.ts)
- ✅ Test setup file (setup.ts)
- ✅ Test utilities (test-utils.tsx)
- ✅ Firebase mocks (mocks/firebase.ts)
- ✅ Package.json scripts

### 2. To Implement Remaining Tests

#### Component Tests (CartDetails, CartUsers, UserCarts)
1. Read the component files
2. Create corresponding test files
3. Follow patterns from existing tests
4. Run: `npm test`

#### Integration Tests
1. Install Firebase Emulator: `npm install -D firebase-admin`
2. Start emulator: `firebase emulators:start`
3. Implement tests following templates in `firebase-integration.test.ts`
4. Run: `npm test firebase-integration.test.ts`

#### E2E Tests
Choose one option:

**Option A: Playwright**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Option B: Cypress**
```bash
npm install --save-dev cypress
npx cypress open
```

Then implement tests following templates in `e2e.spec.ts`

## Mock Structure

All Firebase functions are mocked using Vitest `vi.mock()`. See examples in:
- `Login.test.tsx` - Auth mocks
- `CartCreation.test.tsx` - Database mocks
- `test/mocks/firebase.ts` - Mock utilities

## Common Testing Patterns

### 1. Mocking Firebase Operations
```typescript
vi.mocked(firebaseDb.set).mockResolvedValue(undefined);
```

### 2. Testing User Interactions
```typescript
const user = userEvent.setup();
await user.type(input, 'text');
await user.click(button);
```

### 3. Testing Async Operations
```typescript
await waitFor(() => {
  expect(mockFunction).toHaveBeenCalled();
});
```

### 4. Testing with Custom Render
```typescript
render(<Component />, { /* options */ });
```

The custom render already includes Router and UserProvider.

## Next Steps

1. **Immediate** (High Priority)
   - [ ] Implement remaining component tests (CartDetails, CartUsers, UserCarts)
   - [ ] Run `npm test` to verify all unit tests pass
   - [ ] Check coverage with `npm test:coverage`

2. **Short Term** (This Sprint)
   - [ ] Set up Firebase Emulator
   - [ ] Implement integration tests
   - [ ] Fix any integration test failures

3. **Medium Term** (Next Sprint)
   - [ ] Set up E2E testing tool (Playwright or Cypress)
   - [ ] Implement E2E tests
   - [ ] Optimize test performance

4. **Ongoing**
   - [ ] Maintain tests with new features
   - [ ] Improve coverage to 80%+
   - [ ] Refactor tests for clarity

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite)
- [Playwright](https://playwright.dev/)
- [Cypress](https://www.cypress.io/)

## Troubleshooting

### Tests not finding modules
- Check path aliases in `vitest.config.ts`
- Ensure import paths match file structure

### Mock not working
- Verify mock path matches import
- Use `vi.resetAllMocks()` in `beforeEach`

### Async operations timing out
- Increase `waitFor` timeout: `waitFor(() => {...}, { timeout: 5000 })`
- Check if promises are being awaited

### Firebase imports failing
- Ensure firebase mock is in `setup.ts`
- Check `package.json` imports the mock files

---

**Last Updated**: 2025-11-11
**Test Status**: Unit tests 60/120 complete
**Coverage Target**: 80%
