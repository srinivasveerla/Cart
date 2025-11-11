# Cart Application - Architecture & Data Flow Diagrams

## Component Hierarchy

```
App.tsx
├─ ThemeProvider (MUI)
├─ CssBaseline (MUI)
└─ UserProvider (Context)
   └─ AppRoutes
      ├─ Router
      ├─ Routes
      │  ├─ / → Login
      │  │        └─ handleLogin()
      │  │           └─ signInWithPopup()
      │  │
      │  ├─ /dashboard → AuthGuard
      │  │   └─ Dashboard
      │  │      ├─ state: cartId, open
      │  │      ├─ Drawer (open state)
      │  │      │  ├─ CartCreation (onCartCreated)
      │  │      │  ├─ CartJoin (onCartJoined)
      │  │      │  ├─ UserCarts (onSelectCart)
      │  │      │  └─ Logout (handleLogout)
      │  │      │
      │  │      └─ CartDetails (when cartId set)
      │  │         ├─ CartItems (cartId, items)
      │  │         └─ CartUsers (users)
      │  │
      │  └─ * → Navigate to /
      │
      └─ onAuthStateChanged listener
         └─ setUser(currentUser)
```

## Data Flow Diagram

### Authentication Flow
```
┌──────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                   │
└──────────────────────────────────────────────────────────┘

User visits app
    ↓
AppRoutes.useEffect() → onAuthStateChanged()
    ↓
Firebase Auth Service
    ├─ User logged in?
    │  ├─ YES: setUser(currentUser) → UserContext
    │  │   ↓
    │  │   Can access /dashboard
    │  │
    │  └─ NO: setUser(null)
    │      ↓
    │      Redirect to /
    │      ↓
    │      Show Login page
    │
User clicks "Login with Google"
    ↓
signInWithPopup(auth, GoogleAuthProvider)
    ↓
Firebase OAuth popup
    ↓
User authenticates
    ↓
setUser(result.user) → UserContext
    ↓
navigate('/dashboard')
    ↓
Dashboard loaded
    ↓
User clicks "Logout"
    ↓
signOut(auth)
    ↓
setUser(null) → UserContext
    ↓
Redirect to /
```

### Cart Creation Flow
```
┌──────────────────────────────────────────────────────────┐
│                   CART CREATION FLOW                     │
└──────────────────────────────────────────────────────────┘

User enters cart name
    ↓
Click "Add" button
    ↓
createCart()
    ├─ Validate cartName not empty
    │  └─ Return if empty
    │
    ├─ Check cartsByUser/{uid}
    │  └─ Count existing carts
    │      └─ If >= 3: show alert, return
    │
    ├─ Create new cart:
    │  └─ push(ref(database, 'carts'))
    │      ↓
    │      set(newCartRef, {
    │        name: cartName,
    │        owner: user.uid,
    │        users: {
    │          [user.uid]: { name: user.displayName }
    │        }
    │      })
    │
    ├─ Link to user's carts:
    │  └─ set(ref(database, 'cartsByUser/{uid}/{cartId}'), true)
    │
    ├─ Success:
    │  ├─ Show "Cart created successfully!" alert
    │  ├─ Clear input field
    │  └─ Call onCartCreated(cartId)
    │      └─ Parent updates state
    │
    └─ Error:
       └─ console.error()
```

### Cart Join Flow
```
┌──────────────────────────────────────────────────────────┐
│                    CART JOIN FLOW                        │
└──────────────────────────────────────────────────────────┘

User enters cart ID
    ↓
Click "Join" button
    ↓
joinCart()
    ├─ Validate cartId not empty
    │  └─ If empty: show alert, return
    │
    ├─ Check cartsByUser/{uid}
    │  └─ Count user's existing carts
    │      └─ If >= 3: show alert, return
    │
    ├─ Check carts/{cartId}
    │  └─ Verify cart exists
    │      ├─ If NOT: show alert, return
    │      └─ Get user count in cart
    │          └─ If >= 5: show alert, return
    │
    ├─ Add user to cart:
    │  ├─ set(ref(database, 'carts/{cartId}/users/{uid}'), {
    │  │    name: user.displayName
    │  │  })
    │  │
    │  └─ set(ref(database, 'cartsByUser/{uid}/{cartId}'), true)
    │
    ├─ Success:
    │  ├─ Clear input field
    │  └─ Call onCartJoined(cartId)
    │      └─ Parent updates cartId state
    │
    └─ Error:
       └─ Show error alert
```

### Real-time Cart Updates Flow
```
┌──────────────────────────────────────────────────────────┐
│                 REAL-TIME UPDATES FLOW                   │
└──────────────────────────────────────────────────────────┘

CartDetails mounts with cartId
    ↓
useEffect(() => {
    ├─ Set up listener: onValue(ref(database, 'carts/{cartId}'))
    │  ├─ Initial callback: setCartData(snapshot.val())
    │  └─ Update callback: setCartData(snapshot.val()) [whenever data changes]
    │
    │  This triggers re-render with:
    │  ├─ Updated cart name
    │  ├─ Updated items (from CartItems)
    │  ├─ Updated users (from CartUsers)
    │  └─ Updated cart metadata
    │
    └─ Return unsubscribe cleanup function
}, [cartId])

When user adds item in CartItems:
    ├─ User enters item name
    └─ Click "Add Item"
       └─ set(ref(database, 'carts/{cartId}/items/{newId}'), {
            name: itemName,
            quantity: itemQuantity,
            addedBy: user.displayName
          })
          ↓
          Firebase updates 'carts/{cartId}'
          ↓
          CartDetails listener fires
          ↓
          setCartData with new items
          ↓
          Component re-renders with new item

When user leaves/deletes cart:
    ├─ Click "Leave" or "Delete"
    └─ remove(ref(database, 'carts/{cartId}/users/{uid}'))
       remove(ref(database, 'cartsByUser/{uid}/{cartId}'))
       ↓
       Firebase updates
       ↓
       CartDetails listener may fire
       ↓
       Call onCartLeft()
       ↓
       Parent (Dashboard) resets cartId
```

### User's Carts List Flow
```
┌──────────────────────────────────────────────────────────┐
│             USER'S CARTS LIST REAL-TIME FLOW             │
└──────────────────────────────────────────────────────────┘

UserCarts component mounts
    ↓
setLoading(true)
    ↓
Set up listener: onValue(ref(database, 'cartsByUser/{uid}'))
    ├─ Get list of cartIds user is in
    └─ For EACH cartId:
       ├─ Set up separate listener: onValue(ref(database, 'carts/{cartId}'))
       │  ├─ Get cart name
       │  ├─ Calculate itemCount
       │  └─ Update state: setUserCarts([...updated])
       │
       └─ Store unsubscribe function for cleanup

setLoading(false)

Real-time updates:
    ├─ New item added in cart
    │  └─ Listener fires → item count updates → state updates → re-render
    │
    ├─ Item removed from cart
    │  └─ Listener fires → item count updates → state updates → re-render
    │
    ├─ Cart deleted
    │  └─ Listener fires → cartId disappears → filter from state → re-render
    │
    └─ New cart joined
       └─ Main listener fires → new cartId added → new listener created
          → item count calculated → state updates → re-render

On unmount:
    └─ Clean up ALL listeners (main + individual carts)
```

## State Management Flow

```
┌──────────────────────────────────────────────────────────┐
│              USERCONTEXT STATE FLOW                      │
└──────────────────────────────────────────────────────────┘

UserProvider wraps app
    ├─ state.user = null (initial)
    └─ Provides: { user, setUser }

AuthGuard checks:
    ├─ user exists?
    │  ├─ YES: render children (protected route)
    │  └─ NO: <Navigate to="/" /> (redirect to login)
    │
    └─ Any component can:
       └─ const { user, setUser } = useUserContext()
          ├─ Access user data
          └─ Call setUser(newUser) to update context

On login:
    └─ setUser(firebaseUser) → All components re-render with new user

On logout:
    └─ setUser(null) → All components re-render with user = null
```

## Firebase Database Structure

```
Database Root
├─ carts/
│  ├─ cart-id-1/
│  │  ├─ name: "Grocery Shopping"
│  │  ├─ owner: "uid-123"
│  │  ├─ users/
│  │  │  ├─ uid-123/
│  │  │  │  └─ name: "John Doe"
│  │  │  ├─ uid-456/
│  │  │  │  └─ name: "Jane Smith"
│  │  │  └─ uid-789/
│  │  │     └─ name: "Bob Wilson"
│  │  │
│  │  └─ items/
│  │     ├─ item-id-1/
│  │     │  ├─ name: "Milk"
│  │     │  ├─ quantity: "2L"
│  │     │  └─ addedBy: "John Doe"
│  │     ├─ item-id-2/
│  │     │  ├─ name: "Bread"
│  │     │  ├─ quantity: ""
│  │     │  └─ addedBy: "Jane Smith"
│  │     └─ item-id-3/
│  │        ├─ name: "Butter"
│  │        ├─ quantity: "1 pack"
│  │        └─ addedBy: "Bob Wilson"
│  │
│  ├─ cart-id-2/
│  │  ├─ name: "Home Renovation"
│  │  ├─ owner: "uid-456"
│  │  ├─ users/
│  │  │  ├─ uid-456/
│  │  │  │  └─ name: "Jane Smith"
│  │  │  └─ uid-789/
│  │  │     └─ name: "Bob Wilson"
│  │  │
│  │  └─ items/
│  │     └─ item-id-4/
│  │        ├─ name: "Paint"
│  │        ├─ quantity: "5 gallons"
│  │        └─ addedBy: "Jane Smith"
│  │
│  └─ cart-id-3/
│     └─ ...
│
└─ cartsByUser/
   ├─ uid-123/
   │  ├─ cart-id-1: true
   │  └─ cart-id-3: true
   │
   ├─ uid-456/
   │  ├─ cart-id-1: true
   │  ├─ cart-id-2: true
   │  └─ cart-id-4: true
   │
   └─ uid-789/
      ├─ cart-id-1: true
      └─ cart-id-2: true
```

## Component Dependencies

```
             External Dependencies
                     │
         ┌───────────┼───────────┐
         │           │           │
    Firebase Auth   React Router   MUI
         │           │           │
         └───────────┼───────────┘
                     │
            firebaseConfig.ts
                     │
    ┌────────────────┼────────────────┐
    │                │                │
  Login           Dashboard         CartDetails
    │                │                │
    └────────────────┼────────────────┘
                     │
            UserContext (global state)
                     │
    ┌────────────────┼────────────────┐
    │                │                │
Logout         CartCreation      CartItems
               CartJoin          CartUsers
               UserCarts         CartDetails
```

## Testing Layers

```
┌──────────────────────────────────────────────────────────┐
│                   TESTING PYRAMID                        │
└──────────────────────────────────────────────────────────┘

                    Integration Tests (10-15)
                   /                          \
                  /  E2E / User Flow Tests     \
                 /________________________________\
                
                    Component Tests (80-90)
                   /                          \
                  /  Unit + React Testing      \
                 /________________________________\
                
                    Unit Tests (20-30)
                   /                          \
                  / Hooks + Utils + Helpers    \
                 /________________________________\

       Firebase Mocks ← Foundation Layer
    React Testing Library ← Test Tools
```

## Test Environment Setup

```
┌──────────────────────────────────────────────────────────┐
│              TEST INFRASTRUCTURE                         │
└──────────────────────────────────────────────────────────┘

.env.test
├─ VITE_FIREBASE_API_KEY=mock-key
├─ VITE_FIREBASE_AUTH_DOMAIN=mock-domain
├─ VITE_FIREBASE_DATABASE_URL=mock-url
└─ ... (all Firebase config)

vitest.config.ts / jest.config.ts
├─ Test runner config
├─ Module path aliases
├─ Setup files
└─ Coverage config

setup.test.ts (Global Setup)
├─ Mock Firebase
├─ Mock window APIs
├─ Setup testing library defaults
└─ Global test utilities

Mock Files:
├─ __mocks__/firebase/auth.ts
├─ __mocks__/firebase/database.ts
└─ test-utils/
   ├─ mock-data.ts
   ├─ render-with-providers.tsx
   ├─ firebase-mocks.ts
   └─ test-helpers.ts
```

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────┐
│                 COMPONENT INTERACTIONS                   │
└──────────────────────────────────────────────────────────┘

App
 └─ AppRoutes
     ├─ Login
     │  └─ Calls: signInWithPopup → setUser → navigate to /dashboard
     │
     └─ Dashboard (when user exists)
         ├─ Drawer (collapsible)
         │  ├─ CartCreation
         │  │  ├─ Input: cart name
         │  │  ├─ Firebase: Create cart + Link to user
         │  │  └─ Callback: onCartCreated(cartId) → Dashboard updates cartId
         │  │
         │  ├─ CartJoin
         │  │  ├─ Input: cart ID
         │  │  ├─ Firebase: Join cart + Link to user
         │  │  └─ Callback: onCartJoined(cartId) → Dashboard updates cartId
         │  │
         │  ├─ UserCarts
         │  │  ├─ Firebase: Listen to user's carts
         │  │  ├─ Display: List of carts with item count
         │  │  └─ Callback: onSelectCart(cartId) → Dashboard updates cartId
         │  │
         │  └─ Logout
         │     ├─ Calls: signOut
         │     └─ Calls: setUser(null) → Redirect to /
         │
         └─ Main Content
            └─ CartDetails (when cartId is set)
               ├─ Firebase: Listen to cart/{cartId}
               ├─ Display: Cart name
               ├─ CartItems
               │  ├─ Input: item name, quantity
               │  ├─ Firebase: Add/Remove items
               │  └─ Display: List of items
               └─ CartUsers
                  ├─ Display: List of users in cart
                  └─ Owner actions: Copy ID, Delete Cart
                     Non-owner actions: Leave Cart
```

---

**Visual Reference Diagram Generated:** November 11, 2025

