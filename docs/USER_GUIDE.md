# User & Admin Guide

Welcome to MietProzess! This guide explains how to manage your real estate terminations efficiently.

## 📋 Daily Workflow

### 1. Board Navigation
- Use the **Kanban View** to see at a glance where each termination stands.
- Use the **Search Bar** to find specific addresses or tenants.
- **Status Gating**: You cannot move a card to "Mietvertrag erstellt" until all basic checklist items in the previous stages are checked.

### 2. Modifying Apartments
- Click on any card to open the **Detail View**.
- **Checklists**: Mark tasks as complete to progress the workflow.
- **Comments**: Add notes for your team. Each comment is timestamped.

### 3. Creating a New Termination
- Click the **"Neue Kündigung erfassen"** button in the header.
- Fill in the address, old tenant, and object name to start the process.

## 💾 Data Backups
In the header, click the **"Daten Export"** icon. 
This will download an Excel (`.xlsx`) file containing:
- All apartment details.
- Full checklist completion status.
- All team comments.
- Accurate timestamps.

## 🔐 User Management
Access is restricted via an **Email Whitelist**.
- To add a team member, their email must be added to the `authorized_users` collection in the Firebase Console.
- They can then login using their email address.
