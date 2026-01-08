# Deployment & Setup Guide

MietProzess is designed to run on a serverless stack (Vercel + Firebase), ensuring zero maintenance and $0 running costs at this scale.

## 1. Firebase Configuration
1. **Create Project**: Go to [Firebase Console](https://console.firebase.google.com/).
2. **Firestore**: Enable Firestore in production mode. Create a collection named `apartments`.
3. **Authentication**: Enable the "Email/Password" or "Google" provider.
4. **Project Settings**: Copy your Config Object (API Key, Project ID, etc.).

## 2. Environment Variables
Create a file named `.env` in the root directory (use `.env.example` as a template):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 3. Deployment to Vercel
1. Push your code to a GitHub repository.
2. Connect the repository to [Vercel](https://vercel.com/).
3. **CRITICAL**: Add all environment variables from your `.env` file into the Vercel Project Settings -> Environment Variables.
4. Deploy.

## 4. Security Rules (Firestore)
Set these rules in the Firebase Console to ensure only authorized users can read/write:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
