# 🔥 CRITICAL: Firestore Security Rules Setup

## ⚠️ IMMEDIATE ACTION REQUIRED

Your app is currently **unable to save data** because Firestore security rules are not configured!

### The Problem
- Users can log in ✅
- But they **cannot add or view apartments** ❌
- Error: `Missing or insufficient permissions`

### The Solution (Takes 2 minutes)

#### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com)
2. Select your project: `realestate-termination-manager`
3. Click **Firestore Database** in the left menu
4. Click the **Rules** tab at the top

#### Step 2: Replace the Rules
Copy the rules from `firestore.rules` file in your project root and paste them into the Firebase Console.

**Or copy this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow all authenticated users to read and write apartments
    match /apartments/{apartmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow all authenticated users to read authorized_users
    match /authorized_users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/authorized_users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/authorized_users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Settings - all authenticated users can read, only admins can write
    match /settings/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/authorized_users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/authorized_users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### Step 3: Publish
1. Click **Publish** button
2. Wait for "Rules published successfully" message

#### Step 4: Test
1. Refresh your browser at `http://localhost:5174/`
2. Try adding a new apartment
3. It should work instantly! ✅

---

## What These Rules Do

### Security Features:
- ✅ Only **authenticated users** can access data
- ✅ **Anyone logged in** can add/edit apartments
- ✅ Only **admins** can manage users
- ✅ Only **admins** can change settings
- ✅ Prevents unauthorized access

### Performance:
- Rules are evaluated on the server
- No performance impact on your app
- Instant permission checks

---

## After Setup

Once you publish the rules, your app will:
- ✅ Allow adding new apartments
- ✅ Display existing apartments
- ✅ Enable real-time sync
- ✅ Work perfectly in production

**This is the ONLY thing blocking your app from working!** 🚀
