/**
 * MIETPROZESS - CONTENT CONFIGURATION
 * -----------------------------------
 * This file contains all the text seen in the application.
 * You can change any of the strings below to update labels, headings, or descriptions.
 * 
 * Rules:
 * 1. Keep the quotes "..." around the text.
 * 2. Don't change the keys (e.g., 'title', 'subtitle').
 */
export const CONTENT = {
    header: {
        title: "MietProzess",
        logout: "Logout",
        help: "Hilfe",
        export: "Daten Export (.xlsx)",
        newTermination: "Neue Kündigung erfassen"
    },
    login: {
        title: "MietProzess",
        subtitle: "Effizientes Kündigungsmanagement",
        description: "Verwalten Sie Wohnungskündigungen, Checklisten und Wiedervermietungsprozesse in einem Dashboard.",
        inputPlaceholder: "Namen eingeben...",
        button: "Anmelden",
        footer: "© 2026 MietProzess Manager"
    },
    help: {
        title: "Wie MietProzess funktioniert",
        subtitle: "A quick guide to the component-based architecture and user flow.",
        sections: [
            {
                title: "Dashboard & Kanban",
                text: "The main view is a Kanban board where you can drag and drop apartments between statuses (In Termination, In Renting, Contract Created, Handover). Status changes are gated by checklist completion."
            },
            {
                title: "Apartment Details",
                text: "Clicking on a card opens the Details Modal. Here you can edit 'Stammdaten' (Core Data), manage the dynamic checklist, and add comments."
            },
            {
                title: "Checklist Logic",
                text: "The checklist is dynamic. Completing specific items (like 'Contract Signed') triggers automated popups (e.g., asking for the new tenant's name)."
            },
            {
                title: "Architecture (For Devs)",
                text: "Built with React + Vite + Zustand. Components are atomic and reusable. Text content is centralized in `content.ts` for easy updates."
            }
        ],
        backButton: "Back to Dashboard"
    }
};
