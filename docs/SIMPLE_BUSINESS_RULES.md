# Business Rules & Workflow (Simple Guide)

This document outlines the core rules of HIT Flow in simple terms.

## 1. Status Flow (The Pipeline)
Properties move through these 5 stages in order:
1.  **In Kündigung** (Termination is being processed)
    *   *Goal:* Confirm termination dates.
2.  **In Vermietung** (Marketing active)
    *   *Goal:* Find a new tenant.
3.  **In Prüfung** (Reviewing candidates)
    *   *Goal:* Screen "New Tenant".
4.  **In Vorbereitung** (Contract signed)
    *   *Goal:* Prepare handover (keys, cleaning).
5.  **Abgeschlossen** (Completed)
    *   *Goal:* Keys handed over. Done.

---

## 2. Required Fields Logic
To ensure data quality, the system forces you to enter data at specific times:

*   **New Tenant Name & Start Date:**
    *   **Required When:** You check "Mietvertrag unterzeichnet" (Contract signed) OR move to "In Prüfung".
    *   **Behavior:** A popup appears. You CANNOT close it until you enter the name.
*   **Termination Dates:**
    *   **Required When:** Creating a NEW property.

---

## 3. Auto-Archive Rule (Clean Board Policy)
We keep the board clean automatically.

*   **Rule:** If a property is **Completed** AND it has been more than **30 Days**.
*   **Action:** It is hidden from the main view.
*   **How to see it:** Click the **"Archiv anzeigen"** toggle on the dashboard.
*   **Note:** If you forget to complete it, it stays visible forever to remind you.

---

## 4. UI/UX Standards
*   **Language:** All interface text is in **German** (Formal).
*   **Color System:**
    *   **Green:** Success / New Tenant / Process Done.
    *   **Red:** Warning / Termination / Action Required.
    *   **Blue:** Information / Active Elements / Active User.
    *   **Gray:** Inactive / Archived / History.
*   **Traffic Lights (Activity Monitor):**
    *   Cards show a "Days inactive" status based on last update:
    *   **< 7 Days:** Black (Normal / Recent activity).
    *   **7-14 Days:** Yellow (Warning / Needs checking).
    *   **> 15 Days:** Red (Critical / Urgent action required).

---

## 5. Forward Validations (Checklist Gating)
*   **Rule:** You cannot move a card to the next column if mandatory checklist items in the current column are unchecked.
*   **Admin Override:** Admins **can** bypass this rule and move cards forward regardless of checklist status. Standard users are strictly blocked.

---

## 6. Permissions Matrix

| Action | User (Standard) | Admin (Manager) |
| :--- | :---: | :---: |
| **Manage Apartments** (Create, Edit, Move) | ✅ Yes | ✅ Yes |
| **Complete Checklists** | ✅ Yes | ✅ Yes |
| **View Archive** | ✅ Yes | ✅ Yes |
| **Bypass Status Gating** | ❌ No | ✅ Yes |
| **Manage Users** (Add/Remove Staff) | ❌ No | ✅ Yes |
| **System Diagnostics** (Run Tests) | ❌ No | ✅ Yes |
| **Override Safety Checks** | ❌ No | ✅ Yes |
