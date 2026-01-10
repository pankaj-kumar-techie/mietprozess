# 🧪 Manual Testing & Business Rules Verification Guide

This guide provides step-by-step instructions to verify that all premium features and business rules are working correctly in **PropTerm Flow**.

---

## 1. Gated Workflow Rules (The "Business Guard")
**Rule:** A user cannot move a card forward if the current checklist section is not 100% complete.

### Test Case: Restricted Move
1.  **Select** a card in the "In Kündigung" column.
2.  **Ensure** at least one checkbox in the "In Kündigung" section is **unchecked**.
3.  **Action:** Try to drag the card to "In Vermietung".
4.  **Expected Result:** 
    *   The card snaps back to its original position.
    *   A **Red Error Toast** appears saying: *"Aufgaben noch nicht vollständig!"*.
    *   The status remains unchanged.

### Test Case: Admin Override
1.  **Login** as an Admin user.
2.  **Repeat** the steps above with an incomplete checklist.
3.  **Action:** Drag the card forward.
4.  **Expected Result:** 
    *   The card successfully moves to the next column.
    *   A **Green Success Toast** appears.
    *   Reason: Admins have permission to bypass gating for emergency corrections.

---

## 2. Automated Milestone Triggers
**Rule:** Specific checklist items trigger a popup for essential data gathering.

### Test Case: New Tenant Onboarding
1.  Open an Apartment Detail Modal.
2.  Scroll to the checklist item: **"Mietvertrag unterzeichnet retour"**.
3.  **Action:** Click the checkbox.
4.  **Expected Result:** 
    *   A **Popup Modal** automatically appears asking for "New Tenant Name" and "Rental Start Date".
    *   **Success Toast** confirms the checklist update.
    *   After saving the popup, the data is instantly visible in the card header.

---

## 3. Scalability & Pagination
**Rule:** UI remains clean and performant even with hundreds of records.

### Test Case: Board Performance
1.  Ensure you have more than 50 archived apartments (or check the code logic).
2.  **Action:** View the "Archiviert" column.
3.  **Expected Result:** 
    *   Only the **50 most recent** completed apartments are shown.
    *   The board scrolls horizontally with zero lag.

### Test Case: Table View Pagination
1.  Switch to the **List View (Table)**.
2.  **Action:** Scroll to the bottom if you have >50 records.
3.  **Expected Result:** 
    *   A pagination controller (Page 1, 2, 3...) appears.
    *   Clicking "Next" loads the next batch of 50 items instantly.

---

## 4. Notifications & Activity Search
**Rule:** Activities can be searched by property or person.

### Test Case: Search Functionality
1.  Go to the **Notifications Page**.
2.  **Action:** Type a property address (e.g., "Bahnhofstrasse") in the search bar.
3.  **Expected Result:** Only activities related to that address remain visible.
4.  **Action:** Clear and type a colleague's name.
5.  **Expected Result:** Only activities performed by that user are shown.
6.  **Action:** Type "xyz123" (nonsense).
7.  **Expected Result:** An empty state appears with "Keine passenden Aktivitäten gefunden".

---

## 5. UI/UX "Premium Feel" Checklist
Verify these small details to ensure the "MNC Grade" quality:

| Action | UI Feedback Expected |
| :--- | :--- |
| **Delete Card** | Red Trash Icon highlights -> Confirmation Modal appears. |
| **Add Apartment** | Button changes to "Erfasse..." with a spinner -> Success Toast. |
| **Add Comment** | Success Toast -> Comment appears at the TOP of the list instantly. |
| **Check Item** | Success Toast -> Item turns grey and strikes through. |
| **Auto-Status** | Success Toast specifying the new status. |

---

## 6. How to Verify Database Integrity
If you want to check if the data is actually saving correctly:
1.  Open Chrome DevTools (F12) -> Network Tab.
2.  Perform an action (like checking a box).
3.  Ensure a Firestore request finishes with a **200 OK** status.
4.  Refresh the page; the state should remain exactly as you left it.
