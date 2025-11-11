# Cart Application - Source Code Analysis for Testing

## Project Structure Overview
- **Framework:** React 18 with TypeScript
- **Routing:** React Router v6
- **State Management:** React Context API
- **Authentication:** Firebase Authentication with Google OAuth
- **Database:** Firebase Realtime Database
- **UI Library:** Material-UI (MUI)
- **Build Tool:** Vite

---

## COMPONENTS REQUIRING TESTS

### 1. AUTH COMPONENTS

#### 1.1 Login Component
**File:** `/home/user/Cart/src/components/auth/Login.tsx`

**Purpose:** Renders the login page with Google OAuth integration. Serves as the entry point for users.

**Key Functionality:**
- Displays a welcome message and login button
- Handles Google OAuth sign-in via `signInWithPopup`
- Sets user in context upon successful login
- Navigates to dashboard on successful login
- Redirects to dashboard if user is already logged in
- Error handling for login failures

**Props:** None

**State Management:**
- Uses `useUserContext` hook to access/set user state
- Uses `useNavigate` from React Router

**Test Cases Needed:**
- ✓ Renders welcome message and login button
- ✓ Successfully logs in user with Google OAuth
- ✓ Sets user in context after login
- ✓ Navigates to dashboard on successful login
- ✓ Redirects to dashboard if already logged in
- ✓ Displays error message on login failure
- ✓ Handles Firebase auth errors gracefully

---

#### 1.2 Logout Component
**File:** `/home/user/Cart/src/components/auth/Logout.tsx`

**Purpose:** Simple button component that logs out the current user.

**Key Functionality:**
- Renders a logout button
- Handles Firebase sign-out
- Clears user from context after logout
- Displays confirmation on logout

**Props:** None

**Dependencies:**
- Firebase auth
- UserContext hook

**Test Cases Needed:**
- ✓ Renders logout button with correct label and styling
- ✓ Signs out user from Firebase
- ✓ Clears user from context
- ✓ Handles logout errors gracefully

---

### 2. DASHBOARD COMPONENTS

#### 2.1 Dashboard Component
**File:** `/home/user/Cart/src/components/Dashboard/Dashboard.tsx`

**Purpose:** Main dashboard component that orchestrates the entire cart management interface. It's the protected route that users see after login.

**Key Functionality:**
- Displays user greeting with display name
- Manages drawer state for sidebar navigation
- Hosts cart creation, join, and user carts components
- Displays cart details when a cart is selected
- Handles cart selection and deselection
- Provides logout button in the drawer
- Protected route - redirects to login if user is not authenticated
- Includes toggle button for opening/closing the sidebar drawer

**Props:** None

**State Management:**
- `cartId`: Currently selected cart ID
- `open`: Drawer open/close state
- Uses `useUserContext` to access user

**Child Components:**
- CartCreation
- CartJoin
- UserCarts
- CartDetails
- Logout

**Test Cases Needed:**
- ✓ Renders user greeting with displayName
- ✓ Drawer opens/closes on button click
- ✓ Displays cart creation and join forms in drawer
- ✓ Displays user carts list
- ✓ Displays cart details when cartId is set
- ✓ Shows "Select a cart" message when no cart is selected
- ✓ Resets cartId when user leaves a cart
- ✓ Redirects to login if user is not authenticated
- ✓ Drawer closes when user clicks outside
- ✓ Drawer closes when user selects a cart

---

#### 2.2 CartCreation Component
**File:** `/home/user/Cart/src/components/Dashboard/CartCreation.tsx`

**Purpose:** Component for creating new shopping carts.

**Key Functionality:**
- Input field for cart name
- Validates cart name is not empty
- Checks if user already has 3 carts (max limit)
- Creates new cart in Firebase with owner (uid), name, and initial user
- Updates cartsByUser reference for quick user-to-cart lookup
- Shows success message after creation
- Clears input field after successful creation
- Callback to parent with new cart ID

**Props:**
- `onCartCreated: (cartId: string) => void` - Callback when cart is created

**State Management:**
- `cartName`: Input field value
- Uses `useUserContext` to access user

**Database Operations:**
- Read: Checks `cartsByUser/{uid}` to count existing carts
- Write: Creates new cart in `carts/` and adds reference in `cartsByUser/{uid}`

**Test Cases Needed:**
- ✓ Renders input field and add button
- ✓ Disables button when cart name is empty
- ✓ Calls onCartCreated with cartId on successful creation
- ✓ Shows alert when user already has 3 carts
- ✓ Creates cart with correct structure (name, owner, users)
- ✓ Updates cartsByUser reference
- ✓ Clears input field after successful creation
- ✓ Shows success alert
- ✓ Handles database errors gracefully
- ✓ Validates empty cart name

---

#### 2.3 CartJoin Component
**File:** `/home/user/Cart/src/components/Dashboard/CartJoin.tsx`

**Purpose:** Component for joining existing shopping carts using a cart ID.

**Key Functionality:**
- Input field for cart ID
- Validates cart ID is not empty
- Checks if user already has 3 carts (max limit)
- Verifies cart exists in database
- Checks if cart has room (max 5 users per cart)
- Adds user to the cart and creates cartsByUser reference
- Shows appropriate error messages for different failure scenarios
- Clears input field after successful join

**Props:**
- `onCartJoined: (cartId: string) => void` - Callback when successfully joined

**State Management:**
- `cartId`: Input field value
- Uses `useUserContext` to access user

**Database Operations:**
- Read: Checks `cartsByUser/{uid}`, `carts/{cartId}`, and user count in cart
- Write: Adds user to `carts/{cartId}/users/` and updates `cartsByUser/{uid}`

**Test Cases Needed:**
- ✓ Renders input field and join button
- ✓ Disables button when cart ID is empty
- ✓ Shows alert when cart ID is empty
- ✓ Shows alert when user already has 3 carts
- ✓ Shows alert when cart doesn't exist
- ✓ Shows alert when cart is full (5+ users)
- ✓ Successfully joins cart with valid ID and capacity
- ✓ Calls onCartJoined with correct cartId
- ✓ Clears input field after successful join
- ✓ Handles database errors gracefully

---

#### 2.4 CartDetails Component
**File:** `/home/user/Cart/src/components/Dashboard/CartDetails.tsx`

**Purpose:** Displays detailed information about a selected cart including items, users, and cart management options.

**Key Functionality:**
- Displays cart name
- Shows cart items via CartItems component
- Shows cart users via CartUsers component
- Expandable section for additional details
- Copy cart ID to clipboard (owner only)
- Delete cart functionality (owner only)
- Leave cart functionality (non-owner)
- Real-time cart data updates via Firebase listener
- Snackbar notification for copy action
- Callback to parent when user leaves or deletes cart

**Props:**
- `cartId: string` - ID of the cart to display
- `onCartLeft: () => void` - Callback when user leaves or deletes cart

**State Management:**
- `cartData`: Current cart data from Firebase
- `snackbarOpen`: Snackbar visibility state
- `isExpanded`: Expandable section state
- Uses `useUserContext` to access current user

**Database Operations:**
- Read: Real-time listener on `carts/{cartId}` for cart data
- Write: Remove user from `carts/{cartId}/users/` and `cartsByUser/{uid}/{cartId}`
- Write: Delete cart at `carts/{cartId}` and `cartsByUser/{uid}/{cartId}` (owner only)

**Test Cases Needed:**
- ✓ Displays loading state when cart data is null
- ✓ Displays cart name
- ✓ Renders CartItems component
- ✓ Renders CartUsers component
- ✓ Expands/collapses details section
- ✓ Shows copy button for owner only
- ✓ Shows delete button for owner only
- ✓ Shows leave button for non-owner only
- ✓ Copies cart ID to clipboard
- ✓ Shows success snackbar after copy
- ✓ Leaves cart successfully
- ✓ Deletes cart successfully (owner only)
- ✓ Calls onCartLeft callback when leaving/deleting
- ✓ Shows error alert on leave/delete failure
- ✓ Updates in real-time when cart data changes
- ✓ Unsubscribes from Firebase listener on unmount

---

#### 2.5 UserCarts Component
**File:** `/home/user/Cart/src/components/Dashboard/UserCarts.tsx`

**Purpose:** Displays a list of all carts the user is a member of with item counts.

**Key Functionality:**
- Fetches user's cart list from `cartsByUser/{uid}`
- Sets up real-time listeners for each cart
- Displays cart name and item count
- Shows loading state while fetching
- Shows message when no carts exist
- Handles cart updates dynamically (additions/removals)
- Triggers callback when user selects a cart
- Manages multiple listeners and cleanup

**Props:**
- `onSelectCart: (cartId: string) => void` - Callback when user clicks a cart

**State Management:**
- `userCarts`: Array of user's carts with metadata
- `loading`: Loading state
- Uses `useUserContext` to access user

**Database Operations:**
- Read: Listener on `cartsByUser/{uid}` for user's cart list
- Read: Listener on each `carts/{cartId}` for real-time updates
- Complex listener management with cleanup

**Test Cases Needed:**
- ✓ Shows loading spinner initially
- ✓ Fetches user's carts from database
- ✓ Displays each cart name and item count
- ✓ Calls onSelectCart when cart is clicked
- ✓ Shows message when no carts exist
- ✓ Updates cart list when new cart is added
- ✓ Removes cart from list when deleted
- ✓ Updates item count in real-time
- ✓ Properly unsubscribes from all listeners on unmount
- ✓ Handles database errors gracefully
- ✓ Returns null when user is not authenticated

---

#### 2.6 CartItems Component
**File:** `/home/user/Cart/src/components/Dashboard/CartItems.tsx`

**Purpose:** Manages shopping list items within a cart - adding and removing items.

**Key Functionality:**
- Input fields for item name and quantity
- Add item button (disabled when name is empty)
- Creates items in Firebase with item name, quantity, and addedBy
- Displays all items in the cart with styling
- Double-click on item to remove it
- Clears input fields after adding item
- Shows error messages appropriately

**Props:**
- `cartId: string` - The cart ID to add/remove items from
- `items: Record<string, any>` - Current items in the cart

**State Management:**
- `itemName`: Item name input
- `itemQuantity`: Item quantity input
- Uses `useUserContext` to access user display name

**Database Operations:**
- Write: Pushes new item to `carts/{cartId}/items`
- Write: Removes item from `carts/{cartId}/items/{itemId}`

**Test Cases Needed:**
- ✓ Renders input fields for name and quantity
- ✓ Add button disabled when item name is empty
- ✓ Adds item with correct data structure
- ✓ Clears input fields after adding item
- ✓ Displays all items in cart
- ✓ Removes item on double-click
- ✓ Shows error message on add failure
- ✓ Shows error message on remove failure
- ✓ Handles empty items object
- ✓ Displays quantity (or empty string if not provided)
- ✓ Shows "addedBy" information for items

---

#### 2.7 CartUsers Component
**File:** `/home/user/Cart/src/components/Dashboard/CartUsers.tsx`

**Purpose:** Simple presentational component that displays all users in a cart.

**Key Functionality:**
- Displays list of users in a cart as chips/badges
- Shows message when no users exist (shouldn't happen in practice)
- Formats user names nicely

**Props:**
- `users: Record<string, { name: string }>` - Object of users in the cart

**State Management:** None (pure presentational component)

**Test Cases Needed:**
- ✓ Renders user chips/badges
- ✓ Displays correct user names
- ✓ Shows message when users object is empty
- ✓ Renders multiple users correctly
- ✓ Handles special characters in names

---

### 3. ROUTING & GUARDS

#### 3.1 AppRoutes Component & AuthGuard
**File:** `/home/user/Cart/src/routes/AppRoutes.tsx`

**Purpose:** Defines application routes and handles authentication state management.

**Key Functionality:**
- Sets up React Router with three routes: /, /dashboard, and wildcard
- Implements AuthGuard HOC to protect dashboard route
- Listens to Firebase auth state changes on mount
- Updates user context when auth state changes
- Redirects unauthenticated users to login
- Redirects to login on all invalid routes
- Properly cleans up auth listener on unmount

**Components:**
1. **AuthGuard:** HOC that protects routes requiring authentication
2. **AppRoutes:** Main routing component

**Props:** None

**State Management:**
- Uses `useUserContext` to set/get user
- Uses Firebase `onAuthStateChanged` listener

**Routes:**
- `/` → Login component
- `/dashboard` → Dashboard (protected by AuthGuard)
- `*` → Redirects to /

**Test Cases Needed:**
- ✓ Renders Login page at /
- ✓ Renders Dashboard at /dashboard when authenticated
- ✓ AuthGuard redirects to / when not authenticated
- ✓ AuthGuard renders protected component when authenticated
- ✓ Updates user context on auth state change
- ✓ Handles user login
- ✓ Handles user logout
- ✓ Unsubscribes from auth listener on unmount
- ✓ Redirects invalid routes to /
- ✓ Logs "No user signed in" when user logs out

---

### 4. CONTEXT & HOOKS

#### 4.1 UserContext and useUserContext Hook
**File:** `/home/user/Cart/src/context/UserContext.tsx`

**Purpose:** Provides global user state management across the application.

**Key Functionality:**
- Creates UserContext for global user state
- UserProvider component wraps application
- useUserContext hook provides access to user state and setter
- Throws error if hook is used outside of provider
- Manages current logged-in user object

**Types:**
```typescript
interface UserContextProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}
```

**Components:**
1. **UserProvider:** Context provider component
2. **useUserContext:** Custom hook to access context

**Test Cases Needed:**
- ✓ UserProvider wraps children correctly
- ✓ useUserContext returns user and setUser
- ✓ useUserContext can update user state
- ✓ useUserContext throws error when used outside provider
- ✓ Multiple components can access same context state
- ✓ State persists across re-renders
- ✓ setUser updates the context correctly

---

### 5. AUTH & CONFIG

#### 5.1 Firebase Configuration
**File:** `/home/user/Cart/src/auth/firebaseConfig.ts`

**Purpose:** Initializes and exports Firebase services (Auth, Database).

**Key Functionality:**
- Loads Firebase config from Vite environment variables
- Initializes Firebase app
- Exports Firebase Auth instance
- Exports Google Auth Provider
- Exports Realtime Database instance
- Logs warning in dev mode if API key is missing

**Exports:**
- `app`: Initialized Firebase app
- `auth`: Firebase Auth instance
- `provider`: Google Auth Provider
- `database`: Firebase Realtime Database instance

**Environment Variables Required:**
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_DATABASE_URL
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID

**Test Cases Needed:**
- ✓ Initializes Firebase app with correct config
- ✓ Exports auth instance
- ✓ Exports Google provider
- ✓ Exports database instance
- ✓ Logs warning when API key is missing
- ✓ Handles all required environment variables

---

### 6. OTHER COMPONENTS

#### 6.1 App Component
**File:** `/home/user/Cart/src/App.tsx`

**Purpose:** Root component that wraps the entire application with theme and context providers.

**Key Functionality:**
- Provides Material-UI theme
- Provides CssBaseline for consistent styling
- Wraps with UserProvider context
- Renders AppRoutes for routing

**Props:** None

**Test Cases Needed:**
- ✓ Renders ThemeProvider with correct theme
- ✓ Renders CssBaseline
- ✓ Renders UserProvider
- ✓ Renders AppRoutes
- ✓ Theme is applied correctly

---

#### 6.2 Theme Configuration
**File:** `/home/user/Cart/src/theme/theme.ts`

**Purpose:** Defines Material-UI theme for the application.

**Key Functionality:**
- Creates Material-UI theme with custom colors
- Sets primary color to dark khaki (#7f7711)
- Sets light mode as default
- Defines contrast text color

**Theme Object:**
```typescript
{
  palette: {
    mode: 'light',
    primary: {
      main: '#7f7711',
      contrastText: '#fff'
    }
  }
}
```

**Test Cases Needed:**
- ✓ Creates theme object correctly
- ✓ Theme has correct primary color
- ✓ Theme is in light mode
- ✓ Contrast text is white
- ✓ Theme can be applied to Material-UI components

---

## SUMMARY OF TESTING REQUIREMENTS

### Components to Test: 13
1. **Auth Components:** Login, Logout (2)
2. **Dashboard Components:** Dashboard, CartCreation, CartJoin, CartDetails, UserCarts, CartItems, CartUsers (7)
3. **Layout Components:** App (1)
4. **Routing:** AppRoutes with AuthGuard (1)
5. **Context:** UserContext + Hook (1)
6. **Config:** Firebase Configuration (1)

### Key Testing Areas:

**Authentication & Authorization:**
- Firebase sign-in/sign-out
- Auth state management
- Protected routes
- Redirect behavior

**Cart Operations:**
- Create cart with validation
- Join cart with capacity checks
- Leave cart
- Delete cart (owner only)
- Real-time cart updates

**Item Management:**
- Add items
- Remove items
- Quantity handling

**User Experience:**
- Drawer navigation
- Error messages/alerts
- Loading states
- Real-time updates

**Database Integration:**
- Firebase reads/writes
- Real-time listeners
- Listener cleanup
- Data structure validation

**Context & State:**
- User context access
- State updates
- Provider wrapping

---

## RECOMMENDED TESTING TOOLS & APPROACH

### Testing Framework: Vitest or Jest
### Component Testing: React Testing Library
### Firebase Mocking: firebase-mock or @react-native-firebase/mock
### E2E Testing: Cypress or Playwright (for full integration flows)

