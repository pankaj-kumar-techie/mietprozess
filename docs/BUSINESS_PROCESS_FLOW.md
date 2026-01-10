# HIT Flow – Business Logic & System Guide

**Current Version:** 1.3
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

---

## 3. UI/UX Standards & Traffic Lights

The system uses a strictly defined color system to communicate urgency and status.

### Color System
*   **Green:** Success / New Tenant / Process Completed.
*   **Red:** Warning / Termination Notice / Urgent Action.
*   **Blue:** Informational / Active Elements / Current User.
*   **Gray:** History / Inactive / Archived.

### Activity Monitor (Traffic Lights)
Every property card shows a "Days Inactive" counter based on the last update.
*   **< 7 Days:** **Black text** (Normal activity).
*   **7 - 14 Days:** **Yellow text** (Warning: Action might be needed).
*   **> 15 Days:** **Red text** (Critical: Urgent follow-up required).

---

## 4. Forward Validations & Security

### Checklist Gating
*   **Rule:** Standard users **cannot** move a card to the next column if the mandatory checklist items in the current column are incomplete.
*   **Admin Override:** Administrators have the privilege to **bypass** these gates. If an Admin moves a card, the system allows it even if the checklist is not 100% done.

### Deletion Safety
*   **Feature:** Double-Confirmation.
*   **Behavior:** Clicking "Delete" (Trash Icon) does **NOT** delete immediately. A confirmation modal appears asking "Sind Sie sicher?".

---

## 5. Required Data Points

*   **New Tenant:** Mandatory when moving to Stage 3 or Stage 4. 
*   **Termination Date:** Mandatory for creating any new entry.
*   **Responsible Person:** Mandatory for every property.

---

This document represents the programmed logic of the live application.
