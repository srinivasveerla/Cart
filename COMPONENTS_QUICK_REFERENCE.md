# Cart Application - Components Quick Reference

## All Components Requiring Tests

| # | Component | File Path | Type | Dependencies | Complexity | Priority |
|---|-----------|-----------|------|--------------|-----------|----------|
| 1 | **Login** | `src/components/auth/Login.tsx` | Auth | Firebase, Router, Context | High | Critical |
| 2 | **Logout** | `src/components/auth/Logout.tsx` | Auth | Firebase, Context | Low | High |
| 3 | **Dashboard** | `src/components/Dashboard/Dashboard.tsx` | Layout | Context, Router, 5 child components | High | Critical |
| 4 | **CartCreation** | `src/components/Dashboard/CartCreation.tsx` | Feature | Firebase, Context | Medium | Critical |
| 5 | **CartJoin** | `src/components/Dashboard/CartJoin.tsx` | Feature | Firebase, Context | Medium | Critical |
| 6 | **CartDetails** | `src/components/Dashboard/CartDetails.tsx` | Feature | Firebase, Context, 2 child components | High | High |
| 7 | **UserCarts** | `src/components/Dashboard/UserCarts.tsx` | Feature | Firebase, Context | High | High |
| 8 | **CartItems** | `src/components/Dashboard/CartItems.tsx` | Feature | Firebase, Context | Medium | High |
| 9 | **CartUsers** | `src/components/Dashboard/CartUsers.tsx` | Presentational | None | Low | Medium |
| 10 | **AppRoutes** | `src/routes/AppRoutes.tsx` | Routing | Firebase, Context, Router | High | Critical |
| 11 | **AuthGuard** | `src/routes/AppRoutes.tsx` | Routing | Context, Router | Medium | Critical |
| 12 | **UserContext** | `src/context/UserContext.tsx` | Context | None | Low | High |
| 13 | **useUserContext** | `src/context/UserContext.tsx` | Hook | Context | Low | High |

---

## Component Dependency Graph

```
App (ThemeProvider + UserProvider)
└── AppRoutes (Router + onAuthStateChanged)
    ├── Login (/ route)
    │   └── useUserContext
    │
    └── Dashboard (/dashboard - AuthGuard protected)
        ├── useUserContext
        ├── CartCreation
        │   └── useUserContext (Firebase: create cart, check limit)
        │
        ├── CartJoin
        │   └── useUserContext (Firebase: join cart, validate)
        │
        ├── UserCarts
        │   └── useUserContext (Firebase: list user's carts - real-time)
        │       ├── CartUsers
        │       └── CartDetails
        │           ├── CartItems (Firebase: add/remove items)
        │           ├── CartUsers
        │           └── useUserContext (Firebase: real-time updates)
        │
        └── Logout
            └── useUserContext
```

---

## Testing Priority Matrix

### Critical (Test First)
- [ ] Login Component
- [ ] Logout Component
- [ ] AppRoutes & AuthGuard
- [ ] CartCreation (create cart validation)
- [ ] CartJoin (join cart validation)

### High (Test Second)
- [ ] Dashboard (main layout orchestration)
- [ ] CartDetails (complex state management)
- [ ] UserCarts (real-time listeners)
- [ ] CartItems (add/remove items)
- [ ] UserContext & Hook

### Medium (Test Third)
- [ ] CartUsers (simple presentational)
- [ ] App Component (provider wrapping)
- [ ] Theme Configuration

---

## Firebase Database Structure (for testing mock data)

```
carts/
├── {cartId}/
│   ├── name: string
│   ├── owner: string (uid)
│   ├── users/
│   │   └── {userId}/
│   │       └── name: string
│   └── items/
│       └── {itemId}/
│           ├── name: string
│           ├── quantity: string
│           └── addedBy: string
│
cartsByUser/
├── {userId}/
│   └── {cartId}: true
```

---

## Test Coverage Goals

### Components: 13 components
- **Render Tests:** ✓ All components render correctly
- **Props & State Tests:** ✓ All state changes handled properly
- **User Interaction Tests:** ✓ Button clicks, form inputs
- **Async Tests:** ✓ Firebase operations
- **Error Handling:** ✓ Error states and messages
- **Integration Tests:** ✓ Multi-component flows

### Test Count Estimate: 80-100+ test cases

### Key Testing Patterns Needed

1. **Mock Firebase Auth:**
   - Mock `signInWithPopup`
   - Mock `signOut`
   - Mock `onAuthStateChanged`

2. **Mock Firebase Database:**
   - Mock `ref`, `get`, `set`, `push`, `remove`
   - Mock `onValue` for real-time listeners

3. **Mock Context:**
   - Wrap components with UserProvider in tests
   - Mock user state in tests

4. **Mock Router:**
   - Mock navigation with `useNavigate`
   - Mock route parameters with `useParams`
   - Use `MemoryRouter` for testing routes

5. **Material-UI Testing:**
   - Test component rendering with MUI components
   - Test theme application
   - Test responsive behavior

6. **Async Testing:**
   - Use `waitFor` for async operations
   - Test loading states
   - Test error states

---

## Environment Variables for Testing

```env
# .env.test
VITE_FIREBASE_API_KEY=test-api-key
VITE_FIREBASE_AUTH_DOMAIN=test-auth-domain
VITE_FIREBASE_DATABASE_URL=test-db-url
VITE_FIREBASE_PROJECT_ID=test-project-id
VITE_FIREBASE_STORAGE_BUCKET=test-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=test-sender-id
VITE_FIREBASE_APP_ID=test-app-id
VITE_FIREBASE_MEASUREMENT_ID=test-measurement-id
```

---

## Test File Organization Recommendation

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Login.test.tsx
│   │   ├── Logout.tsx
│   │   └── Logout.test.tsx
│   └── Dashboard/
│       ├── Dashboard.tsx
│       ├── Dashboard.test.tsx
│       ├── CartCreation.tsx
│       ├── CartCreation.test.tsx
│       ├── CartJoin.tsx
│       ├── CartJoin.test.tsx
│       ├── CartDetails.tsx
│       ├── CartDetails.test.tsx
│       ├── UserCarts.tsx
│       ├── UserCarts.test.tsx
│       ├── CartItems.tsx
│       ├── CartItems.test.tsx
│       ├── CartUsers.tsx
│       └── CartUsers.test.tsx
├── context/
│   ├── UserContext.tsx
│   └── UserContext.test.tsx
├── routes/
│   ├── AppRoutes.tsx
│   └── AppRoutes.test.tsx
├── auth/
│   ├── firebaseConfig.ts
│   └── firebaseConfig.test.ts
├── App.tsx
├── App.test.tsx
└── __mocks__/
    └── firebase/
        └── (mock implementations)
```

---

## Key Testing Utilities & Helpers to Create

1. **Firebase Mocks:**
   - `createMockFirebaseAuth()`
   - `createMockDatabase()`
   - `mockSignInWithPopup()`
   - `mockOnAuthStateChanged()`

2. **Test Helpers:**
   - `renderWithRouter()` - Render with Router context
   - `renderWithContext()` - Render with UserProvider
   - `renderWithProviders()` - Render with all providers

3. **Mock Data:**
   - `mockUser` - Sample Firebase user object
   - `mockCart` - Sample cart object
   - `mockItems` - Sample cart items
   - `mockCartsByUser` - Sample user's carts list

4. **Custom Test Setup:**
   - `setupFirebaseMocks()` - Initialize all Firebase mocks
   - `clearFirebaseMocks()` - Clean up after tests
   - `waitForLoadingToFinish()` - Wait for loading states

