# Archiving vs. Completion: Implementation Details

It is important to understand the difference between a property being **"Completed"** (Abgeschlossen) and being **"Archived"**.

## 1. Status: Completed (Abgeschlossen)
*   **What it is:** This is a **Work Status**. It means "We are finished working on this apartment."
*   **Behavior:**
    *   The apartment moves to the gray "Abgeschlossen" column.
    *   **It remains visible on the board.**
    *   This is intentional. It allows your team to see what was achieved recently (e.g., this month's successes) without searching.

## 2. State: Archived
*   **What it is:** This is a **System State** (Hidden). It means "This record is old and we don't need to see it every day."
*   **Behavior:**
    *   The apartment is **hidden** from the main view.
    *   **Trigger:** This happens automatically exactly **30 days** after the work was completed.
    *   This keeps the board clean and fast, ensuring you only focus on active or recently finished tasks.

| Feature | Completed (Abgeschlossen) | Archived (Hidden) |
| :--- | :--- | :--- |
| **Concept** | "The work is done." | "The record is filed away." |
| **Visible?** | **YES** (On the board) | **NO** (Hidden by default) |
| **Trigger** | Manual (You check the list) | Automatic (30 days later) |
| **Goal** | Track progress & success. | Declutter workspace. |

## 3. The "Archiviert" Column
You might see a column named *Archiviert*.
*   If you toggle **"Show Archive"** (Archiv anzeigen), all the hidden/old items will appear here.
*   You can also manually drag items here if you want to explicitly categorize them as archived, but the system primarily relies on the **30-day timer** to keep things tidy automatically.
