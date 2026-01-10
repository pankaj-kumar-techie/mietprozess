
import type { KanbanColumn } from './kanban.config';

// Kanban Definitions (Moved/Imported logic can stay in kanban.config.ts or be centralized here. 
// For now, we will reference the types but keep the dynamic logic separately or merge if requested. 
// The user asked for "propr config file over whole the website".

export const APP_CONFIG = {
    app: {
        name: "HIT Flow",
        description: "Property Termination Management",
        version: "1.0.0",
        copyright: "© 2026 HIT Flow. All rights reserved."
    },
    ui: {
        theme: {
            primaryColor: "green-600",
            secondaryColor: "blue-600",
            dangerColor: "red-600",
            warningColor: "yellow-500"
        },
        text: {
            header: {
                logout: "Logout",
                help: "Hilfe",
                export: "Daten Export (.xlsx)",
                newTermination: "Neue Kündigung erfassen",
                admin: "Admin"
            },
            login: {
                emailPlaceholder: "E-Mail-Adresse",
                passwordPlaceholder: "Passwort",
                loginButton: "Anmelden",
                forgotPassword: "Passwort vergessen?"
            },
            errors: {
                network: {
                    title: "Keine Internetverbindung",
                    message: "Es scheint, dass Sie offline sind. Bitte überprüfen Sie Ihre Internetverbindung.",
                    firebase: "Verbindung zum Server fehlgeschlagen. Bitte versuchen Sie es später erneut."
                },
                validation: {
                    required: "Dieses Feld ist erforderlich",
                    email: "Bitte geben Sie eine gültige E-Mail-Adresse ein"
                }
            }
        }
    },
    features: {
        enableUserRegistration: false, // If false, only Admin adds users
        enableGoogleLogin: false, // Disabled Google Login as requested (internal tool only)
        maintenanceMode: false,
        firstAdminEmail: 'pahariyatri@gmail.com' // Auto-creates first admin
    },
    // Default Kanban Columns (Fallback)
    kanban: {
        defaultColumns: [
            { id: 'in_kuendigung', name: 'In Kündigung', color: 'bg-red-100', order: 1 },
            { id: 'in_vermietung', name: 'In Vermietung', color: 'bg-yellow-100', order: 2 },
            { id: 'vertrag_erstellt', name: 'Mietvertrag erstellt', color: 'bg-blue-100', order: 3 },
            { id: 'wohnung_uebergeben', name: 'Wohnung übergeben', color: 'bg-green-100', order: 4 },
            { id: 'abgeschlossen', name: 'Abgeschlossen', color: 'bg-gray-100', order: 5 },
            { id: 'archiviert', name: 'Archiv anzeigen', color: 'bg-slate-200', order: 6 }
        ] as KanbanColumn[]
    }
} as const;

export default APP_CONFIG;
