# Firebase Setup Guide

This guide will help you set up Firebase for your React portfolio application.

## Prerequisites

- Google account
- Firebase project (or create one)
- Node.js and npm installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enter a project name (e.g., "react-portfolio")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Enable Firebase Services

### Authentication

1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

### Storage

1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select a location for your storage
5. Click "Done"

## Step 3: Add Web App

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click "Add app" and select the web icon (</>)
5. Enter a nickname for your app (e.g., "React Portfolio")
6. Click "Register app"
7. Copy the configuration object - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id",
};
```

## Step 4: Configure Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add the following variables using your Firebase config:

```bash
# Currency API Configuration
REACT_APP_CURRENCY_API_KEY=your_currency_api_key_here

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key-from-firebase-config
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Google Cloud Build Configuration
REACT_APP_GOOGLE_CLOUD_PROJECT_ID=your-google-cloud-project-id
REACT_APP_GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
```

## Step 5: Security Rules

### Firestore Security Rules

1. Go to "Firestore Database" → "Rules"
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow authenticated users to read/write examples
    match /examples/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Security Rules

1. Go to "Storage" → "Rules"
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 6: Test Firebase Integration

1. Start your development server:

   ```bash
   npm start
   ```

2. Navigate to your app and test the Firebase functionality
3. Check the browser console for any errors

## Step 7: Google Cloud Build Configuration

For deployment, you'll need to set up environment variables in Google Cloud Build:

1. In Google Cloud Console, go to Cloud Build → Triggers
2. Create a new trigger or edit existing one
3. Add substitution variables:
   - `_CURRENCY_API_KEY`
   - `_FIREBASE_API_KEY`
   - `_FIREBASE_AUTH_DOMAIN`
   - `_FIREBASE_PROJECT_ID`
   - `_FIREBASE_STORAGE_BUCKET`
   - `_FIREBASE_MESSAGING_SENDER_ID`
   - `_FIREBASE_APP_ID`
   - `_FIREBASE_MEASUREMENT_ID`
   - `_BUCKET_NAME`

## Troubleshooting

### Common Issues

1. **"Firebase App named '[DEFAULT]' already exists"**

   - This happens if Firebase is initialized multiple times
   - Check that you're only importing the Firebase config once

2. **"Missing or insufficient permissions"**

   - Check your Firestore and Storage security rules
   - Ensure you're authenticated before accessing data

3. **"Network request failed"**
   - Check your internet connection
   - Verify Firebase project settings
   - Ensure environment variables are correctly set

### Debug Tips

1. Enable Firebase debug mode:

   ```javascript
   // Add this to your Firebase config
   if (process.env.NODE_ENV === "development") {
     console.log("Firebase config:", firebaseConfig);
   }
   ```

2. Check browser console for Firebase-related errors
3. Verify environment variables are loaded correctly
4. Test Firebase services individually

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use environment variables** for all sensitive configuration
3. **Set up proper security rules** for Firestore and Storage
4. **Enable authentication** before allowing data access
5. **Regularly review** your Firebase project settings

## Next Steps

- Set up Firebase Authentication UI components
- Implement user profile management
- Add real-time data synchronization
- Configure Firebase Analytics
- Set up Firebase Hosting for deployment

For more information, visit the [Firebase Documentation](https://firebase.google.com/docs).
