# QA Testing Protocol - HIT Flow

This document details the Quality Assurance (QA) steps to verify the HIT Flow application's business logic using the injected dummy data.

**Objective:** Validate that the application correctly handles state transitions, data validation, and automated archiving.

## 1. Setup Data
*(Developer Note: Run the seeding command to load `QA_TEST_DATA` if not already present)*

You should see 4 distinct test cases in your dashboard.

---

## 2. Test Cases

### Test Case A: The "Red Light" Check
* **Target Card:** "Bahnhofstrasse 10" (Status: *In Vermietung*)
* **Expectation:**
    1. The visual indicator "Last Activity" (clock icon) should be **Yellow** or **Red** (simulated delay).
    2. There should be a "Comment" icon visible indicating 1 message.
* **Action:** Click the card to open Details.
* **Verify:** Check the "Verlauf / Kommentare" section at the bottom. You should see "Keine Interessenten bisher...".

### Test Case B: The "Forward Lock" (Rule #1)
* **Target Card:** "Seestrasse 145" (Status: *In Kündigung*)
* **Action:**
    1. Try to drag the card from "In Kündigung" -> "In Vermietung".
* **Expectation:**
    1. **BLOCK:** The system should prevent the move.
    2. **Notification:** An error message "Aufgaben für In Kündigung noch nicht vollständig!" should appear.
* **Resolution:**
    1. Open the card.
    2. Tick ALL checkboxes under the "In Kündigung" section.
    3. Close and try to drag again. **Success expected.**

### Test Case C: The "New Tenant" Popup (Rule #2)
* **Target Card:** Any card in "In Vermietung".
* **Action:**
    1. Open Details.
    2. Find the checklist item: **"Mietvertrag unterzeichnet retour"**.
    3. Click the checkbox.
* **Expectation:**
    1. **POPUP:** A modal "Neuer Mieter erfassen" must appear immediately.
    2. **LOCK:** You cannot close this popup or click "Cancel" (if strictly enforced) or at least must save to continue logically.
    3. **SAVE:** Enter "Max Mustermann" and a date. Save.
    4. **RESULT:** The "Neuer Mieter" field in the header should now update instantly.

### Test Case D: The "Archive" Visibility (Rule #3)
* **Target Card:** "Rigiweg 8" (Status: *Abgeschlossen*)
* **Observation:**
    1. By default, this card should **NOT** be visible on the board (because `completedAt` > 30 days).
* **Action:**
    1. Click the toggle switch **"Archiv anzeigen"** in the top filter bar.
* **Expectation:**
    1. The card "Rigiweg 8" should visibly appear in the "Abgeschlossen" column (likely with a gray background).

---

## 3. General Validation
* **Sorting:** Ensure "Seestrasse 145" (June 2024) appears *after* "Langstrasse 40" (April 2024) if sorted by date? Or correct chronological order (April first).
* **Responsibility:** If you change the "Zuständig" filter to "Sarah", only "Bahnhofstrasse 10" should remain.

---

**End of Protocol**
