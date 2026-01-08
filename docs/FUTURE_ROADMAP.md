# Future Roadmap: The No-Code Vision

MietProzess is currently "Configuration-Driven." To make it a truly "No-Code" platform where an admin can change the *entire business logic* without a developer, we recommend the following future features:

## 🛣️ Development Phases

### Phase 1: Dynamic Checklist Engine
- **Current**: Checklists are defined in a TypeScript file.
- **Future**: Move checklists to a Firestore collection called `settings`.
- **Admin Benefit**: You can add/remove "Tasks" (like 'Check keys') from a simple dashboard, and it updates for all apartments instantly.

### Phase 2: Dynamic Status Pipeline
- **Current**: Statuses (In Kündigung, In Vermietung) are fixed.
- **Future**: Allow the admin to define the "Stages" of the Kanban board.
- **Admin Benefit**: If your process changes from 4 steps to 6 steps, you just rename the columns in the dashboard.

### Phase 3: Automated "If-This-Then-That" (IFTTT)
- **Desired Feature**: Send an email automatically when a specific box is checked.
- **Implementation**: Integration with **Zapier** or **Make.com** via Firebase Webhooks.
- **Admin Benefit**: You can connect MietProzess to 5,000+ other apps without writing code.

## 📊 Summary of Control

| Feature | Today (Easy) | Tomorrow (No-Code) |
| :--- | :--- | :--- |
| **Change Text** | Edit `content.ts` | Settings Dashboard |
| **Manage Users** | Firestore Whitelist | Admin User Screen |
| **Change Process** | Edit `types/index.ts` | Drag-and-Drop Pipeline |
| **Add Fields** | Small Frontend Update | Custom Field Builder |

## 🌟 Conclusion
MietProzess is built on a "Service Layer" architecture, meaning we can move from "Code-Config" to "Database-Config" very easily as your team grows.
