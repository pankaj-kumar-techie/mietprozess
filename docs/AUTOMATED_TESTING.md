# Automated Testing Suite - HIT Flow

We have implemented an **In-App Automated Test Runner** to ensure business logic integrity without requiring complex CI/CD setup. This allows any admin to verify the system's rules are functioning correctly with a single click.

## Accessing the Test Suite
1. Navigate to URL: `/admin/tests` (Must be added to router first).
2. Or use the **"System Health"** link in the Admin Dashboard (if added).

## What is Tested?

The suite runs **Unit Tests** against `src/lib/logic.ts`. It does NOT touch the database. It basically simulates scenarios in memory to prove the *code logic* is correct.

### Test Coverage:

#### 1. Rule #1: Forward Logic Validation
*   **Scenario A:** Creates a fake apartment with an incomplete checklist.
    *   *Check:* Does `isStatusComplete()` return `false`?
    *   *Result:* MUST be False.
*   **Scenario B:** Creates a fake apartment with a fully checked checklist.
    *   *Check:* Does `isStatusComplete()` return `true`?
    *   *Result:* MUST be True.

#### 2. Rule #3: Auto-Archiving Logic
*   **Scenario A:** Fake apartment marked 'Abgeschlossen' 5 days ago.
    *   *Check:* Does `shouldArchive()` return `false`?
    *   *Result:* MUST return False (Keep visible).
*   **Scenario B:** Fake apartment marked 'Abgeschlossen' 35 days ago.
    *   *Check:* Does `shouldArchive()` return `true`?
    *   *Result:* MUST return True (Hidden).

#### 3. Rule #5: Chronological Sorting
*   **Scenario:** List of 3 apartments with mixed dates (Dec, Jan, June).
*   **Action:** Runs `sortApartmentsByDate()`.
*   **Check:** Is Index 0 = Jan? Is Index 2 = Dec?
*   **Result:** MUST be sorted Ascending.

## Extending Tests
To add more rules:
1. Open `src/lib/tests.ts`.
2. Add a new `try/catch` block following the existing pattern.
3. Use `createMockApartment` to set up your edge case.
4. Push the result to the `results` array.
