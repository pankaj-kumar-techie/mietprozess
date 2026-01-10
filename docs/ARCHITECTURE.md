
# Architecture & Configuration Guide

## Centralized Configuration
The application uses a **Single Source of Truth** for configuration to ensure consistency and ease of maintenance.
File: `src/config/app.config.ts`

### What is Configured?
1.  **App Identity**: Name, Version, Copyright.
2.  **UI Settings**: 
    *   **Theme Colors**: Tailwind utility class names for Primary, Secondary, etc.
    *   **Text Strings**: Labels for Header, Login, Error Messages, and Validation.
3.  **Features**: Flags to toggle functionality like `enableUserRegistration` or `serverMaintenance`.
4.  **Admin Settings**: `firstAdminEmail` which auto-grants admin rights on first login.

### Usage in Code
Import the config object in any component:
```typescript
import APP_CONFIG from '@/config/app.config';

// Example
<h1>{APP_CONFIG.app.name}</h1>
```

## Directory Structure
*   `src/config/`: Contains the central configuration files.
*   `src/components/common/`: Shared UI components (OfflineBanner, NetworkStatus).
*   `src/lib/`: Core logic (Auth, Firebase, Utils).
*   `src/store/`: Zustand state management stores.

## Best Practices
*   **Do not hardcode strings**: Add new labels to `APP_CONFIG.ui.text` instead.
*   **DRY (Don't Repeat Yourself)**: Reusable logic should live in `src/lib` or `src/hooks`.
*   **Type Safety**: Use TypeScript interfaces for all data models.
