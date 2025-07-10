# Firebase Setup Guide for Track My Show

This guide will help you set up Firebase Firestore for the Track My Show application.

## Prerequisites

1. **Firebase Account**: Sign up at [firebase.google.com](https://firebase.google.com)
2. **Firebase CLI**: Install globally with `npm install -g firebase-tools`

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `track-my-show`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set Up Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## Step 3: Get Service Account Key (Production)

For production deployment, you'll need a service account key:

1. In Firebase Console, go to Project Settings (gear icon)
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Rename it to `serviceAccountKey.json`
6. Place it in `backend/src/` directory

**⚠️ Important**: Never commit this file to Git! It's already in `.gitignore`.

## Step 4: Set Up Firebase CLI (Development)

For local development, use Firebase CLI:

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Use existing project
# - Select your track-my-show project
```

## Step 5: Configure Environment Variables

Add these to your `backend/.env` file:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email

# For development (optional)
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

## Step 6: Test the Setup

1. Start your backend server:
   ```bash
   ./find_free_port_and_start_backend.sh
   ```

2. Test the API:
   ```bash
   curl http://localhost:8000/api/articles
   ```

3. Create a test article:
   ```bash
   curl -X POST http://localhost:8000/api/articles \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Test Article",
       "author": "Test Author", 
       "description": "Test description",
       "status": "draft"
     }'
   ```

## Step 7: Set Up Firestore Security Rules

In Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Articles collection
    match /articles/{articleId} {
      allow read: if true;  // Anyone can read articles
      allow write: if request.auth != null;  // Only authenticated users can write
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 8: Production Deployment

For production, make sure to:

1. **Update security rules** to be more restrictive
2. **Set up authentication** properly
3. **Use environment variables** for sensitive data
4. **Enable Firebase App Check** for additional security

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized" error**:
   - Make sure you have the service account key in the right location
   - Check that the file path in `server.ts` is correct

2. **"Permission denied" error**:
   - Check your Firestore security rules
   - Verify your service account has the right permissions

3. **"Project not found" error**:
   - Verify your project ID in Firebase Console
   - Check that your service account key is for the correct project

### Development vs Production:

- **Development**: Uses Firebase CLI credentials
- **Production**: Uses service account key file

## Next Steps

1. **Set up authentication** for user management
2. **Add real-time listeners** for live updates
3. **Implement offline support** for mobile apps
4. **Set up Firebase Functions** for serverless operations
5. **Configure Firebase Hosting** for frontend deployment

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase CLI](https://firebase.google.com/docs/cli) 