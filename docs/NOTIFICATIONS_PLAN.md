
# Notifications & Email Strategy (Cost-Free Plan)

For an internal tool with limited budget (Intent: "Cost Free"), we recommend a hybrid approach relying on **free tiers** and **client-side** integration.

## 1. Plan Overview
| Feature | Recommended Tech | Cost | Limits |
| :--- | :--- | :--- | :--- |
| **In-App Alerts** | React Toast (Zustand) | Free | Unlimited |
| **Browser Push** | HTML5 Notifications API | Free | User must allow |
| **Email (System)** | Firebase Auth Emails | Free | Password Resets only |
| **Email (Custom)** | EmailJS (Client-Side) | Free | 200 emails/month |

## 2. In-App Notifications (Implemented)
We currently use a `useNotificationStore` (Zustand) to manage a stack of "Toasts".
*   **Pros**: Instant feedback, no backend required.
*   **Cons**: Only visible while the user is online and on the page.

**Code:** `src/store/useNotificationStore.ts`

## 3. Email Strategy (EmailJS)
For "Undable" (Critical) notifications (e.g., "New Termination Created"), use EmailJS.
*   **Why?**: It allows sending emails directly from React without a Node.js backend.
*   **Setup**:
    1.  Create free account at [EmailJS.com](https://www.emailjs.com).
    2.  Create an "Email Template" (e.g., `Template ID: new_termination`).
    3.  Connect "Gmail Service" (connects to your `admin@heinzer-immobilien.ch` or similar).

### Implementation Snippet (Planned)
```typescript
import emailjs from '@emailjs/browser';

const sendTerminationEmail = async (terminationData) => {
    try {
        await emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID', 
            {
               to_email: 'admin@heinzer-immobilien.ch',
               termination_id: terminationData.id,
               tenant: terminationData.tenantName
            },
            'YOUR_PUBLIC_KEY'
        );
    } catch (error) {
        console.error("Email failed", error);
        // Fallback to In-App Notification
    }
};
```

## 4. "Undable" (Critical) Error Handling
If user is offline or Firebase fails:
1.  **Offline Banner**: Alerts the user immediately (Implemented).
2.  **Retry Queue**: Store failed requests in `localStorage` and retry when `navigator.onLine` becomes `true`.
