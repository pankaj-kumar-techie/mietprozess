# Architecture & System Design

MietProzess follows a modern, decoupled architecture designed for speed and reliability.

## 📐 Overview
The system is built on a "Store-First" principle where the UI reacts to state changes in Zustand, which in turn synchronizes with Firebase Firestore.

```mermaid
graph LR
    subgraph "Frontend (Vercel)"
        UI[React View Layer] <--> Store[Zustand State]
        Store <--> Content[content.ts Config]
    end
    
    subgraph "Backend (Firebase)"
        Store <--> Firestore[(Firestore Real-time DB)]
        Auth[Firebase Auth/Whitelist] --> UI
    end
    
    subgraph "Exports"
        UI --> XLSX[xlsx Utility]
        XLSX --> File[Daily .xlsx Backup]
    end
```

## 🔄 Data Lifecycle & Synchronization
MietProzess ensures data integrity through a unidirectional data flow. When a user checks a box or adds a comment:
1. The **UI** dispatches an action.
2. **Zustand** updates the local state (instant feedback).
3. **Firebase Services** push the change to Firestore.
4. All other connected clients receive the update via **Real-time Listeners**.

## 🔮 Future No-Code Vision
To make this tool 100% manageable by non-tech staff, the following transition is planned:

```mermaid
graph TD
    Current[Current: Hardcoded Types] --> Phase1[Phase 1: Database-Driven Checklists]
    Phase1 --> Phase2[Phase 2: Dynamic Status Pipeline]
    Phase2 --> Phase3[Phase 3: Drag-and-Drop Form Builder]
```

## 🧠 State Management
- **Apartment Store**: Manages the list of apartments, filters, and current status.
- **Auth Store**: Manages login state and user metadata.
- **Notification Store**: Manages global toast notifications.

## 🗄️ Database Schema (Firestore)
- `apartments`: 
    - `id`: String (Auto-generated)
    - `address`: String
    - `status`: Enum (In Kündigung, In Vermietung, etc.)
    - `checklist`: Array of objects
    - `comments`: Array of objects
    - `lastActivity`: ISO Timestamp
- `authorized_users`:
    - `email`: String (Whitelist for login)

## ⚡ Performance
- **Vite**: Ultra-fast HMR and production builds.
- **Tailwind**: Atomic CSS for minimal bundle sizes.
- **Firestore**: Real-time listeners enable instant UI updates across devices.
