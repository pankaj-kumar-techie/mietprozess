# UI Configuration (Non-Developer Guide)

MietProzess is designed so that non-developers can update the application's text and voice without touching complex code.

## 📝 Updating Text
All text is located in `src/lib/content.ts`. 

### Common Tasks:
- **Change Button Labels**: Update the `header` section in `content.ts`.
- **Modify Help Content**: Update the `help.sections` array.
- **Translate UI**: Simply replace the German strings with your preferred language inside the quotes.

### Example Update:
To change the app name:
```typescript
// src/lib/content.ts
header: {
    title: "MietProzess", // Change this to "My New Branding"
    ...
}
```

## 🔔 Notification Toggles
You can control which alerts users see in `src/lib/notifications.ts`.

```typescript
export const NOTIFICATION_CONFIG = {
    export: {
        enabled: true, // Set to false to hide this notification
        message: "Daten erfolgreich exportiert!"
    },
    ...
}
```

## ⚠️ Important Rules
1. **Never** delete the commas (`,`) at the end of lines.
2. **Never** remove the quotes (`"` or `'`) around the text.
3. **Always** save the file and restart the dev server (or redeploy) to see changes.
