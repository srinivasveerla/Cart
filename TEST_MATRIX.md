# Cart Application - Test Matrix & Implementation Guide

## Comprehensive Testing Matrix

### 1. LOGIN COMPONENT
**File:** `src/components/auth/Login.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Rendering** | Renders welcome message | ⬜ | MUI Typography with "Welcome to the Cart App" |
| | Renders login button | ⬜ | MUI Button with onClick handler |
| **Props/State** | Uses useUserContext hook | ⬜ | Accesses user and setUser |
| **User Interaction** | Login button click triggers signInWithPopup | ⬜ | Mock Firebase signInWithPopup |
| | Successful login sets user | ⬜ | Context should update with user object |
| | Successful login navigates to /dashboard | ⬜ | Mock useNavigate |
| **Conditional Rendering** | Redirects to dashboard if already logged in | ⬜ | <Navigate to="/dashboard"> when user exists |
| **Error Handling** | Handles login errors gracefully | ⬜ | Logs error to console, shows error message |
| **Integration** | Works with Firebase auth | ⬜ | Uses firebaseConfig imports |
| | Works with Router | ⬜ | Uses useNavigate from react-router-dom |

**Mocks Needed:**
```typescript
- jest.mock('firebase/auth', () => ({
    signInWithPopup: jest.fn(),
    GoogleAuthProvider: jest.fn(),
  }))
- jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
  }))
- UserContext mock with setUser
```

---

### 2. LOGOUT COMPONENT
**File:** `src/components/auth/Logout.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Rendering** | Renders logout button | ⬜ | MUI Button with "Logout" label |
| **Props/State** | Uses useUserContext hook | ⬜ | Accesses setUser |
| **User Interaction** | Button click triggers logout | ⬜ | handleLogout async function |
| | Calls signOut from Firebase | ⬜ | Mock signOut |
| | Clears user from context | ⬜ | setUser(null) after signOut |
| **Error Handling** | Handles logout errors | ⬜ | Error message display |
| **Async Operations** | Waits for async signOut | ⬜ | Use waitFor in tests |
| **Integration** | Works with Firebase auth | ⬜ | Uses firebaseConfig imports |

**Mocks Needed:**
```typescript
- jest.mock('firebase/auth', () => ({
    signOut: jest.fn(),
  }))
- UserContext mock with setUser function
```

---

### 3. DASHBOARD COMPONENT
**File:** `src/components/Dashboard/Dashboard.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Rendering** | Renders user greeting | ⬜ | Shows user.displayName |
| | Renders drawer component | ⬜ | MUI Drawer with open state |
| | Renders toggle button | ⬜ | KeyboardDoubleArrowRightIcon button |
| | Renders child components (CartCreation, CartJoin, UserCarts) | ⬜ | All in drawer |
| | Renders CartDetails when cartId is set | ⬜ | Conditional rendering |
| | Shows "Select a cart" message when no cartId | ⬜ | Typography fallback |
| **State Management** | Manages cartId state | ⬜ | useState for selected cart |
| | Manages drawer open state | ⬜ | useState for drawer |
| **User Interaction** | Toggle button opens/closes drawer | ⬜ | Click handler |
| | Selecting cart updates cartId | ⬜ | onSelectCart callback |
| | Leaving cart clears cartId | ⬜ | handleCartLeft callback |
| | Drawer closes when clicking outside | ⬜ | onClose handler |
| **Child Component Communication** | Passes callbacks to child components | ⬜ | onCartCreated, onCartJoined, onSelectCart, onCartLeft |
| **Authentication** | Redirects to login if not authenticated | ⬜ | <Navigate to="/"> when !user |
| **Integration** | Renders all child components together | ⬜ | Integration test with mocked children |

**Mocks Needed:**
```typescript
- UserContext mock with user data
- Mock child components (CartCreation, CartJoin, UserCarts, CartDetails, Logout)
```

---

### 4. CART CREATION COMPONENT
**File:** `src/components/Dashboard/CartCreation.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Rendering** | Renders input field for cart name | ⬜ | MUI TextField |
| | Renders Add button | ⬜ | MUI Button |
| **Props/State** | Accepts onCartCreated callback | ⬜ | Prop type check |
| | Manages cartName state | ⬜ | useState |
| | Button disabled when cartName empty | ⬜ | disabled={!cartName} |
| **User Interaction** | Input field updates cartName state | ⬜ | onChange handler |
| | Click Add button triggers createCart | ⬜ | onClick handler |
| **Validation** | Returns early if cartName is empty | ⬜ | Early return check |
| | Shows alert if user has 3+ carts | ⬜ | Checks cartsByUser count |
| **Firebase Operations** | Reads cartsByUser/{uid} | ⬜ | Check cart count limit |
| | Creates new cart in carts/ | ⬜ | push and set operations |
| | Updates cartsByUser/{uid}/{cartId} | ⬜ | set operation |
| **Success/Error Handling** | Shows success alert | ⬜ | alert("Cart created successfully!") |
| | Clears input after success | ⬜ | setCartName("") |
| | Calls onCartCreated with cartId | ⬜ | Passes new cartId to parent |
| | Logs error on database failure | ⬜ | console.error |

**Mocks Needed:**
```typescript
- UserContext mock with user.uid and user.displayName
- jest.mock('firebase/database', () => ({
    ref: jest.fn(),
    get: jest.fn(),
    push: jest.fn(),
    set: jest.fn(),
  }))
- Alert mock
```

---

### 5. CART JOIN COMPONENT
**File:** `src/components/Dashboard/CartJoin.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Rendering** | Renders input field for cart ID | ⬜ | MUI TextField |
| | Renders Join button | ⬜ | MUI Button |
| **Props/State** | Accepts onCartJoined callback | ⬜ | Prop type check |
| | Manages cartId state | ⬜ | useState |
| | Button disabled when cartId empty | ⬜ | disabled={!cartId} |
| **User Interaction** | Input field updates cartId state | ⬜ | onChange handler |
| | Click Join button triggers joinCart | ⬜ | onClick handler |
| **Validation** | Shows alert if cartId is empty | ⬜ | Early validation |
| | Shows alert if user has 3+ carts | ⬜ | Checks cartsByUser count |
| | Shows alert if cart doesn't exist | ⬜ | Checks cart reference |
| | Shows alert if cart is full (5+ users) | ⬜ | Checks user count in cart |
| **Firebase Operations** | Checks cartsByUser/{uid} for limit | ⬜ | get operation |
| | Checks carts/{cartId} exists | ⬜ | get operation |
| | Adds user to carts/{cartId}/users/{uid} | ⬜ | set operation |
| | Updates cartsByUser/{uid}/{cartId} | ⬜ | set operation |
| **Success/Error Handling** | Calls onCartJoined with cartId | ⬜ | Passes cartId to parent |
| | Clears input after success | ⬜ | setCartId("") |
| | Logs error on database failure | ⬜ | console.error |
| | Shows error alert on failure | ⬜ | alert for join failure |

**Mocks Needed:**
```typescript
- UserContext mock with user.uid and user.displayName
- jest.mock('firebase/database')
- Alert mock
```

---

### 6. CART DETAILS COMPONENT
**File:** `src/components/Dashboard/CartDetails.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Rendering** | Shows loading state when cartData is null | ⬜ | <p>Select a Cart....</p> |
| | Displays cart name | ⬜ | cartData.name |
| | Renders CartItems component | ⬜ | Pass cartId and items |
| | Renders CartUsers component | ⬜ | Pass users |
| | Displays expand/collapse button | ⬜ | Show/Hide Cart Details |
| **Conditional Rendering** | Shows owner-only buttons (Copy, Delete) | ⬜ | When cartData.owner === user.uid |
| | Shows Leave button for non-owners | ⬜ | When cartData.owner !== user.uid |
| **State Management** | Manages snackbarOpen state | ⬜ | useState |
| | Manages isExpanded state | ⬜ | useState |
| | Fetches cartData from Firebase | ⬜ | useEffect with listener |
| **User Interaction** | Copy button copies cartId to clipboard | ⬜ | navigator.clipboard.writeText |
| | Shows snackbar after copy | ⬜ | setSnackbarOpen(true) |
| | Expand button toggles section | ⬜ | setIsExpanded toggle |
| | Leave button calls leaveCart | ⬜ | onClick handler |
| | Delete button calls deleteCart | ⬜ | onClick handler (owner only) |
| **Firebase Operations** | Sets up listener on carts/{cartId} | ⬜ | useEffect onValue |
| | Unsubscribes from listener on unmount | ⬜ | return unsubscribe |
| | Removes user from cart on leave | ⬜ | remove operations |
| | Deletes entire cart on delete (owner) | ⬜ | remove operations |
| **Success/Error Handling** | Shows alert on successful leave | ⬜ | alert message |
| | Shows alert on leave error | ⬜ | error handling |
| | Shows alert on successful delete | ⬜ | alert message |
| | Shows alert on delete error | ⬜ | error handling |
| | Calls onCartLeft after leave/delete | ⬜ | Callback to parent |

**Mocks Needed:**
```typescript
- UserContext mock with user.uid
- jest.mock('firebase/database')
- navigator.clipboard mock
- Snackbar/Alert UI test
```

---

### 7. USER CARTS COMPONENT
**File:** `src/components/Dashboard/UserCarts.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Rendering** | Shows loading spinner initially | ⬜ | CircularProgress |
| | Displays cart list when loaded | ⬜ | List with ListItems |
| | Shows message when no carts | ⬜ | Typography with "No carts found" |
| | Displays cart name and item count | ⬜ | ListItemText primary/secondary |
| **Props/State** | Accepts onSelectCart callback | ⬜ | Prop type check |
| | Manages userCarts array state | ⬜ | useState with cart objects |
| | Manages loading state | ⬜ | useState boolean |
| **User Interaction** | Click cart item calls onSelectCart | ⬜ | onClick handler |
| | Passes correct cartId on click | ⬜ | Verify callback argument |
| **Firebase Operations** | Listens to cartsByUser/{uid} | ⬜ | useEffect with onValue |
| | Creates listeners for each cart | ⬜ | onValue for each cartId |
| | Updates item count in real-time | ⬜ | Listener updates state |
| | Removes cart when deleted externally | ⬜ | Filter from state |
| | Unsubscribes all listeners on unmount | ⬜ | Cleanup in return |
| **Data Handling** | Handles empty cartsByUser | ⬜ | if (!snapshot.exists()) |
| | Adds new carts to list | ⬜ | [...prev, updatedCart] |
| | Updates existing carts | ⬜ | Replace in array |
| | Calculates correct item count | ⬜ | Object.keys(items).length |
| **Error Handling** | Handles missing user gracefully | ⬜ | if (!user) return |
| | Handles missing carts data | ⬜ | setUserCarts([]) |

**Mocks Needed:**
```typescript
- UserContext mock with user
- jest.mock('firebase/database')
- Mock multiple onValue listeners
```

---

### 8. CART ITEMS COMPONENT
**File:** `src/components/Dashboard/CartItems.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Rendering** | Renders item name input | ⬜ | MUI TextField |
| | Renders quantity input | ⬜ | MUI TextField |
| | Renders Add Item button | ⬜ | MUI Button |
| | Displays all items | ⬜ | Maps items array |
| | Button disabled when name empty | ⬜ | disabled={!itemName} |
| **Props/State** | Accepts cartId prop | ⬜ | string |
| | Accepts items prop | ⬜ | Record<string, any> |
| | Manages itemName state | ⬜ | useState |
| | Manages itemQuantity state | ⬜ | useState |
| **User Interaction** | Input changes update state | ⬜ | onChange handlers |
| | Add button click adds item | ⬜ | onClick handler |
| | Double-click on item removes it | ⬜ | onDoubleClick handler |
| **Validation** | Returns early if name empty | ⬜ | if (!itemName) return |
| | Shows alert for empty name | ⬜ | alert("Item name is required!") |
| **Firebase Operations** | Creates new item in carts/{cartId}/items | ⬜ | push and set operations |
| | Stores item name, quantity, addedBy | ⬜ | Correct data structure |
| | Removes item from database | ⬜ | remove operation |
| **Success/Error Handling** | Clears inputs after add | ⬜ | setItemName(""), setItemQuantity("") |
| | Logs error on add failure | ⬜ | console.error |
| | Logs error on remove failure | ⬜ | console.error |
| **Item Display** | Shows item name | ⬜ | item.name |
| | Shows quantity if present | ⬜ | Conditional display |
| | Correct styling and hover effects | ⬜ | sx props |

**Mocks Needed:**
```typescript
- UserContext mock with user.displayName
- jest.mock('firebase/database')
- Alert mock
```

---

### 9. CART USERS COMPONENT
**File:** `src/components/Dashboard/CartUsers.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Rendering** | Renders user chips/badges | ⬜ | MUI Chip components |
| | Displays correct user names | ⬜ | userData.name |
| | Shows message when empty | ⬜ | Typography "No users found" |
| **Props/State** | Accepts users prop | ⬜ | Record<string, {name: string}> |
| | Pure presentational component | ⬜ | No internal state |
| **Data Handling** | Maps over user entries | ⬜ | Object.entries |
| | Handles empty users object | ⬜ | userEntries.length === 0 |
| **Edge Cases** | Handles special characters in names | ⬜ | No sanitization issues |
| | Handles long user names | ⬜ | Chip display |

**Mocks Needed:**
```typescript
- None - simple presentational component
- Mock data for users prop
```

---

### 10. APP ROUTES COMPONENT
**File:** `src/routes/AppRoutes.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Rendering** | Renders Router component | ⬜ | BrowserRouter |
| | Renders Routes container | ⬜ | React Router Routes |
| | Renders Login at / | ⬜ | Route path="/" |
| | Renders Dashboard at /dashboard | ⬜ | Route path="/dashboard" |
| | Redirects invalid routes to / | ⬜ | Route path="*" |
| **Auth State Management** | Listens to onAuthStateChanged | ⬜ | useEffect setup |
| | Updates user context on auth change | ⬜ | setUser with currentUser |
| | Handles user login | ⬜ | Sets user when signed in |
| | Handles user logout | ⬜ | Sets user to null |
| | Unsubscribes on unmount | ⬜ | Cleanup function |
| **AuthGuard HOC** | Renders children when authenticated | ⬜ | user exists |
| | Redirects to / when not authenticated | ⬜ | <Navigate to="/" /> |
| | Works as route protection | ⬜ | Guards /dashboard |
| **Integration** | Works with Firebase auth | ⬜ | Uses firebaseConfig |
| | Works with Router | ⬜ | useNavigate and Navigate |
| | Works with UserContext | ⬜ | useUserContext |

**Mocks Needed:**
```typescript
- jest.mock('firebase/auth', () => ({
    onAuthStateChanged: jest.fn(),
  }))
- UserContext mock
- React Router mocks
```

---

### 11. USER CONTEXT & HOOK
**File:** `src/context/UserContext.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **UserProvider Component** | Renders children | ⬜ | Provider wraps children |
| | Provides context value | ⬜ | user and setUser |
| **useUserContext Hook** | Returns context | ⬜ | { user, setUser } |
| | Updates user state | ⬜ | setUser works |
| | Throws error if used outside provider | ⬜ | Error boundary test |
| **State Persistence** | Maintains state across re-renders | ⬜ | useContext hook behavior |
| **Multiple Consumers** | Multiple components access same state | ⬜ | Context sharing |
| **Type Safety** | Has proper TypeScript types | ⬜ | UserContextProps interface |

**Mocks Needed:**
```typescript
- None - pure React Context
- Use createMemoryRouter for testing with router
```

---

### 12. FIREBASE CONFIGURATION
**File:** `src/auth/firebaseConfig.ts`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Initialization** | Initializes Firebase app | ⬜ | initializeApp called |
| | Loads config from env vars | ⬜ | import.meta.env variables |
| **Exports** | Exports auth instance | ⬜ | getAuth(app) |
| | Exports Google provider | ⬜ | new GoogleAuthProvider() |
| | Exports database instance | ⬜ | getDatabase(app) |
| **Environment Variables** | Reads VITE_FIREBASE_API_KEY | ⬜ | Environment var |
| | Reads VITE_FIREBASE_AUTH_DOMAIN | ⬜ | Environment var |
| | Reads VITE_FIREBASE_DATABASE_URL | ⬜ | Environment var |
| | Reads VITE_FIREBASE_PROJECT_ID | ⬜ | Environment var |
| | Reads VITE_FIREBASE_STORAGE_BUCKET | ⬜ | Environment var |
| | Reads VITE_FIREBASE_MESSAGING_SENDER_ID | ⬜ | Environment var |
| | Reads VITE_FIREBASE_APP_ID | ⬜ | Environment var |
| | Reads VITE_FIREBASE_MEASUREMENT_ID | ⬜ | Environment var |
| **Error Handling** | Logs warning when API key missing | ⬜ | console.warn in dev |
| | Continues loading even with missing vars | ⬜ | Doesn't throw error |

**Mocks Needed:**
```typescript
- jest.mock('firebase/app')
- jest.mock('firebase/auth')
- jest.mock('firebase/database')
- Mock import.meta.env
```

---

### 13. APP COMPONENT
**File:** `src/App.tsx`

| Aspect | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| **Rendering** | Renders ThemeProvider | ⬜ | MUI ThemeProvider |
| | Renders CssBaseline | ⬜ | MUI CssBaseline |
| | Renders UserProvider | ⬜ | Context Provider |
| | Renders AppRoutes | ⬜ | Routing component |
| **Provider Order** | Correct nesting order | ⬜ | Theme > CssBaseline > UserProvider > AppRoutes |
| **Theme Application** | Theme is applied | ⬜ | theme prop passed |
| **Integration** | All providers work together | ⬜ | Full provider stack test |

**Mocks Needed:**
```typescript
- Mock theme import
- Mock AppRoutes component
```

---

## Test Statistics

### Total Test Cases: ~100

| Component | Tests | Priority |
|-----------|-------|----------|
| Login | 8 | Critical |
| Logout | 4 | High |
| Dashboard | 10 | Critical |
| CartCreation | 10 | Critical |
| CartJoin | 10 | Critical |
| CartDetails | 15 | High |
| UserCarts | 13 | High |
| CartItems | 11 | High |
| CartUsers | 5 | Medium |
| AppRoutes & AuthGuard | 10 | Critical |
| UserContext | 7 | High |
| FirebaseConfig | 12 | Medium |
| App | 5 | Medium |
| **TOTAL** | **~120** | |

---

## Implementation Order Recommendation

1. **Week 1: Foundation**
   - Setup test infrastructure (Vitest/Jest)
   - Create Firebase mocks
   - Create test utilities and helpers
   - Test UserContext
   - Test firebaseConfig

2. **Week 2: Critical Components**
   - Test Login
   - Test Logout
   - Test AppRoutes & AuthGuard

3. **Week 3: Cart Operations**
   - Test CartCreation
   - Test CartJoin
   - Test CartDetails

4. **Week 4: User Features**
   - Test UserCarts
   - Test CartItems
   - Test Dashboard

5. **Week 5: Completion & Refinement**
   - Test CartUsers
   - Test App component
   - Integration tests
   - Coverage optimization

