# Quick Setup: Make pankajkumar.techie@gmail.com an Admin

## Step 1: Go to Firebase Console

1. Visit [Firebase Console](https://console.firebase.google.com)
2. Select your project: `realestate-termination-manager`
3. Click **Firestore Database** in the left menu

## Step 2: Find Your User Document

1. Click on the `authorized_users` collection
2. Find the document with `email: "pankajkumar.techie@gmail.com"`
3. Click on that document

## Step 3: Update Role to Admin

1. Find the `role` field
2. Change the value from `"user"` to `"admin"`
3. Click **Update**

## Step 4: Refresh Your Browser

1. Go back to your app
2. Refresh the page (F5 or Ctrl+R)
3. You should now see the Admin Panel option in your profile dropdown!

---

## Alternative: Add Manually if Not Exists

If the document doesn't exist yet, create it:

1. Click **Add Document** in `authorized_users` collection
2. Use **Auto-ID** for Document ID
3. Add fields:
   - `email`: `"pankajkumar.techie@gmail.com"`
   - `role`: `"admin"`
   - `displayName`: `"Pankaj Kumar"` (optional)
4. Click **Save**

---

**Done!** You're now an admin. 🎉
