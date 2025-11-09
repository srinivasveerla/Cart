# Cart

A real-time collaborative shopping cart application that enables groups to create and manage shared shopping lists together. Built as a Progressive Web App for seamless access across all devices.

## Features

- **Shared Shopping Carts**: Create carts and invite others to collaborate. Keep track of items everyone needs without multiple lists.
- **Real-time Synchronization**: All changes sync instantly across devices via Firebase Realtime Database. See updates from other users as they happen.
- **Google Authentication**: Secure login with Google OAuth via Firebase Authentication.
- **Offline Support**: Works offline as a PWA. Changes sync automatically when you're back online.
- **Cross-Device Access**: Use the same cart on mobile, tablet, or desktop—always stay in sync.
- **Cart Management**: Create, join, and share carts with copyable IDs. Manage cart members and items collaboratively.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Material-UI (MUI) with custom theming
- **Real-time Backend**: Firebase (Authentication + Realtime Database)
- **PWA**: Service Workers for offline functionality and installability
- **Styling**: Emotion (CSS-in-JS)

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (for authentication and database)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173` with HMR enabled.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## How It Works

1. **Sign In**: Log in with your Google account
2. **Create or Join**: Create a new cart or join an existing one using a cart ID
3. **Collaborate**: Add items, see who added what, and watch changes sync in real-time
4. **Share**: Copy the cart ID and share it with others to invite them

## Deployment

Deploy to Netlify or Firebase Hosting:

```bash
npm run build
```

Then follow your hosting provider's deployment instructions.

## License

MIT
