# HIT Flow – Business Logic & System Guide

**Current Version:** 1.2
**Last Updated:** 2026-01-10

This document serves as the **Single Source of Truth** for the "HIT Flow" application. It defines exactly how the system behaves, the rules for moving properties between stages, and the automation logic (e.g., Archiving).

---

## 1. Core Workflow (Pipeline)

The application tracks a rental property through **5 distinct statuses**. Each status represents a specific phase of the workflow.

| Status | Phase Name (DE) | Phase Name (EN) | Goal of this Phase |
| :--- | :--- | :--- | :--- |
| **Stage 1** | **In Kündigung** | Termination | Process the termination notice. Confirm dates and inform the owner. |
| **Stage 2** | **In Vermietung** | Renting | Marketing the property, finding a new tenant, and viewing appointments. |
| **Stage 3** | **In Prüfung** | Review | Screening potential candidates and preparing the contract. |
| **Stage 4** | **In Vorbereitung** | Preparation | Contract signed. Arranging handover dates and cleanup. |
| **Stage 5** | **Abgeschlossen** | Completed | Keys handed over. Process finished. **(Visible for 30 days)** |

---

## 2. Automation Rules

The system is designed to automate manual tasks and keep the board clean.

### Rule A: Auto-Archiving (The 30-Day Rule)
*   **Concept:** "Completed" properties should not clutter the board forever.
*   **Logic:**
    1.  If Status is **"Abgeschlossen"** (Completed)...
    2.  ...AND the completion date was **> 30 days ago**...
    3.  ...The property is **Hidden** (Archived).
*   **Access:** You can verify these anytime by clicking **"Archiv anzeigen"**. They will appear in a gray "Archiviert" column.
*   **Legacy Data:** If a property has no "Completion Date" (old data), the system uses the "Last Activity Date" instead.

### Rule B: Automated Status Progression
*   **Concept:** If you finish a checklist, you are likely ready for the next step.
*   **Logic:**
    *   When you check the **last item** in a checklist (100% complete)...
    *   ...The system **automatically prompts** to move to the next status.
    *   *Example:* Completing the "In Kündigung" checklist automatically suggests moving to "In Vermietung".

### Rule C: Forward Validations
*   **Concept:** You cannot move forward if you haven't done your homework.
*   **Logic:**
    *   You are prevented from dragging a card to the next column **IF** mandatory checklist items in the current column are unchecked.
    *   *Note:* Admins can override this, but standard users cannot.

---

## 3. Data Integrity & Safety

### Deletion Safety
*   **Feature:** Double-Confirmation.
*   **Behavior:** Clicking "Delete" (Trash Icon) does **NOT** delete immediately.
*   **Safety Net:** A modal appears asking "Sind Sie sicher?". You must click "Ja, löschen" to confirm. This prevents accidental data loss.

### New Tenant "Lock"
*   **Feature:** Mandatory Tenant Info.
*   **Behavior:** When moving to Stage 3 ("In Prüfung"), the system **requires** you to enter the New Tenant's name.
*   **Why?** We cannot prepare a contract without a name. The system ensures this data is captured at the exact right moment.

---

## 4. Sorting & Views

*   **Global Sorting:** Properties are ALWAYS sorted by **Termination Date** (Kündigungsdatum).
    *   *Urgency:* Dates closer to today (or in the past) appear at the **TOP**. Default: Ascending.
*   **Filtering:** You can filter by "Responsible Person" (Zuständig) or Search (Text).

---

## 5. UI/UX Standards

*   **Language:** All interface text is in **German** (Formal).
*   **Colors:**
    *   **Green:** Success / New Tenant / Done.
    *   **Red:** Warning / Termination / Delayed.
    *   **Blue:** Information / Active User.
    *   **Gray:** Inactive / Archived.
*   **Traffic Lights (Activity Monitor):**
    *   Properties show a small "Days inactive" counter.
    *   **< 7 Days:** Black (Normal).
    *   **7-14 Days:** Yellow (Warning).
    *   **> 15 Days:** Red (Critical - Needs Action).

---

This document represents the programmed logic of the live application.
