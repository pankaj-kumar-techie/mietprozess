# Archiving Logic Explained

This document explains why and when properties disappear from the main board (Archive).

## The Core Rule
A property is automatically hidden (Archived) ONLY if it meets **BOTH** conditions:

1.  **Status is "Completed"**: The termination process must be 100% finished (Status: *Abgeschlossen*).
2.  **Time Passed**: It has been more than **30 Days** since it was finished.

## Why can I still see old properties?

If you see a property created 2-3 months ago on your board, it is visible for one of these reasons:

### Reason 1: It is NOT "Completed"
Even if a property is very old (e.g., from last year), if the status is still **"Active"** (e.g., *In Kündigung* or *In Vermietung*), it will **NEVER** be archived.
*   **Why?** The system thinks you are still working on it.
*   **Fix:** If you are done, move it to the **Completed** column.

### Reason 2: It is "Completed" but recent
If you moved it to "Completed" just yesterday, it will stay visible for 29 more days.
*   **Why?** This allows you to quickly check recent work without digging into the archive.

### Reason 3: Legacy Data (Fixed)
*   **Issue:** Older data created before this system might not have a "Completion Date" recorded.
*   **Solution:** We have updated the system. If the "Completion Date" is missing, the system now looks at the **"Last Activity Date"**.
    *   *Example:* If a property was marked "Completed" 3 months ago but had no date, the system now sees "Last Activity: 3 months ago" and will correctly archive it immediately.

## How to see Archived properties?
You can find old data at any time:
1.  Go to the Dashboard.
2.  Click the **"Archiv anzeigen"** (Show Archive) toggle button in the top filter bar.
3.  Hidden properties will reappear in the gray "Archive" column.
