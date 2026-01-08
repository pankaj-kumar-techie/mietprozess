# UI Customization Guide (Examples)

This guide shows you exactly how you can change the look and feel of MietProzess without writing a single line of React code.

## 1. Changing the Branding
**File**: `src/lib/content.ts`
**Goal**: Rename the app to "PropTerm" and change the main button.

### Before:
```typescript
header: {
    title: "MietProzess",
    newTermination: "Neue Kündigung erfassen"
}
```

### After:
```typescript
header: {
    title: "PropTerm Admin",
    newTermination: "Termin erstellen"
}
```

## 2. Expanding the Help Guide
**File**: `src/lib/content.ts`
**Goal**: Add a new section about "Data Privacy".

Simply add a new item to the `sections` array:

```typescript
{
    title: "Datenschutz",
    text: "Alle Daten werden gemäß DSGVO in Schweizer Rechenzentren gespeichert."
}
```
*The Help page will automatically create a new card for this.*

## 3. Customizing the Login Screen
**File**: `src/lib/content.ts`
**Goal**: Make the login message more welcoming.

### Change:
```typescript
login: {
    title: "Willkommen zurück",
    subtitle: "Bitte melden Sie sich an, um Ihre Kündigungen zu verwalten."
}
```

## 4. Toast Notifications
**File**: `src/lib/notifications.ts`
**Goal**: Change the "Success" message for Excel downloads.

```typescript
export const NOTIFICATION_CONFIG = {
    export: {
        enabled: true,
        message: "Backup erfolgreich gespeichert! ✅"
    }
}
```

---

### 💡 Pro Tip:
Whenever you change these files, the browser will refresh, and you will see the changes **instantly**. This is the power of the "Master Text File" approach!
