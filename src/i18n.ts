
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    de: {
        translation: {
            "dashboard": {
                "title": "Dashboard",
                "kanban": "Kanban",
                "list": "Liste",
                "add_apartment": "Wohnung hinzufügen",
                "show_archive": "Archiv anzeigen",
                "hide_archive": "Archiv ausblenden",
                "archive": "Archiv",
                "search_placeholder": "Schnellsuche (Adresse, Mieter...)",
                "responsible_all": "TEAM (ALLE)",
                "new_short": "Neu"
            },
            "kanban": {
                "empty": "Leer",
                "status_updated": "Status auf \"{{status}}\" aktualisiert",
                "tasks_incomplete": "Aufgaben für \"{{status}}\" noch nicht vollständig!"
            },
            "apartment": {
                "address": "Adresse",
                "object": "Objekt",
                "old_tenant": "Auszug",
                "new_tenant": "Einzug",
                "responsible": "Verantwortlich",
                "status": "Status",
                "termination_date": "Kündigung zum",
                "rental_start": "Mietbeginn",
                "reletting": "Nachvermietung",
                "comments": "Kommentare",
                "checklist": "Checkliste"
            },
            "actions": {
                "save": "Speichern",
                "saving": "Speichere...",
                "edit": "Bearbeiten",
                "delete": "Löschen",
                "cancel": "Abbrechen",
                "close": "Schließen",
                "confirm": "Bestätigen",
                "back": "Zurück",
                "loading": "Laden...",
                "update_now": "Jetzt Aktualisieren",
                "error": "Fehler: ",
                "delete_confirm_title": "Datensatz löschen?",
                "delete_confirm_desc": "Möchten Sie diesen Datensatz wirklich unwiderruflich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
            },
            "profile": {
                "title": "Mein Profil",
                "settings": "Einstellungen",
                "security": "Sicherheit",
                "logout": "Abmelden",
                "change_password": "Passwort ändern",
                "role_admin": "Administrator",
                "role_user": "Standard Benutzer",
                "general_info": "Allgemeine Informationen",
                "display_name": "Anzeigename",
                "name_placeholder": "Ihr Name",
                "email_address": "E-Mail-Adresse",
                "locked": "Gesperrt",
                "email_note": "Die E-Mail-Adresse wird zur Anmeldung verwendet und kann nicht geändert werden.",
                "save_changes": "Profil-Änderungen speichern",
                "security_title": "Login & Sicherheit",
                "security_desc": "Passwort ändern und Account schützen",
                "security_desc_short": "Erhöhen Sie die Sicherheit Ihres Kontos",
                "update_success": "Profil erfolgreich aktualisiert",
                "update_error": "Fehler beim Aktualisieren: ",
                "new_password": "Neues Passwort",
                "confirm_password": "Passwort bestätigen",
                "password_success": "Passwort erfolgreich aktualisiert",
                "back_to_profile": "Zurück zum Profil"
            },
            "help": {
                "title": "HIT Flow Guide",
                "subtitle": "System-Dokumentation v1.4",
                "user_guide": "Benutzer-Guide",
                "admin_privileges": "Admin-Privilegien",
                "error_lexicon": "Fehler-Lexikon",
                "staff_manual": "Handbuch für Mitarbeiter",
                "process_title": "Der HIT Flow Prozess",
                "welcome_desc": "Willkommen bei HIT Flow. Unser System führt Sie strukturiert durch den gesamten Kündigungs- und Vermietungsprozess einer Immobilie.",
                "error_recent_login": "Sicherheits-Timeout: Bitte loggen Sie sich erneut ein, um das Passwort zu ändern.",
                "pro_tip_search": "Nutzen Sie die Schnellsuche (Shortcut: Strg+F) auf dem Dashboard, um Wohnungen sofort nach Adresse oder Mieter zu filtern."
            },
            "admin": {
                "dashboard_title": "Admin Dashboard",
                "dashboard_subtitle": "Zentrale Verwaltung für HIT Flow",
                "users_title": "Benutzerverwaltung",
                "users_desc": "Benutzer hinzufügen, entfernen und Rollen verwalten",
                "tests_title": "System-Diagnose",
                "tests_desc": "Automatisierte Tests der Geschäftslogik ausführen",
                "back_to_app": "Zurück zur App"
            },
            "notifications": {
                "title": "Benachrichtigungen",
                "subtitle": "Aktivitäten des Teams",
                "search_placeholder": "Suche nach Objekt, Person oder Aktivität...",
                "just_now": "Gerade eben"
            },
            "login": {
                "loading": "Anmelden...",
                "error_credentials": "E-Mail oder Passwort falsch. Bitte versuchen Sie es erneut.",
                "error_too_many_requests": "Zu viele Versuche. Bitte warten Sie einen Moment.",
                "error_generic": "Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Eingaben."
            }
        }
    },
    en: {
        translation: {
            "dashboard": {
                "title": "Dashboard",
                "kanban": "Kanban",
                "list": "List",
                "add_apartment": "Add Apartment",
                "show_archive": "Show Archive",
                "hide_archive": "Hide Archive",
                "archive": "Archive",
                "search_placeholder": "Quick search (Address, tenant...)",
                "responsible_all": "TEAM (ALL)",
                "new_short": "New"
            },
            "kanban": {
                "empty": "Empty",
                "status_updated": "Status updated to \"{{status}}\"",
                "tasks_incomplete": "Tasks for \"{{status}}\" not complete yet!"
            },
            "apartment": {
                "address": "Address",
                "object": "Object",
                "old_tenant": "Moving out",
                "new_tenant": "Moving in",
                "responsible": "Responsible",
                "status": "Status",
                "termination_date": "Termination date",
                "rental_start": "Rental start",
                "reletting": "Reletting",
                "comments": "Comments",
                "checklist": "Checklist"
            },
            "actions": {
                "save": "Save",
                "saving": "Saving...",
                "edit": "Edit",
                "delete": "Delete",
                "cancel": "Cancel",
                "close": "Close",
                "confirm": "Confirm",
                "back": "Back",
                "loading": "Loading...",
                "update_now": "Update Now",
                "error": "Error: ",
                "delete_confirm_title": "Delete record?",
                "delete_confirm_desc": "Are you sure you want to permanently delete this record? This action cannot be undone."
            },
            "profile": {
                "title": "My Profile",
                "settings": "Settings",
                "security": "Security",
                "logout": "Logout",
                "change_password": "Change Password",
                "role_admin": "Administrator",
                "role_user": "Standard User",
                "general_info": "General Information",
                "display_name": "Display Name",
                "name_placeholder": "Your Name",
                "email_address": "Email Address",
                "locked": "Locked",
                "email_note": "The email address is used for login and cannot be changed.",
                "save_changes": "Save Profile Changes",
                "security_title": "Login & Security",
                "security_desc": "Change password and protect account",
                "security_desc_short": "Enhance your account security",
                "update_success": "Profile updated successfully",
                "update_error": "Error updating profile: ",
                "new_password": "New Password",
                "confirm_password": "Confirm Password",
                "password_success": "Password updated successfully",
                "back_to_profile": "Back to Profile"
            },
            "help": {
                "title": "HIT Flow Guide",
                "subtitle": "System Documentation v1.4",
                "user_guide": "User Guide",
                "admin_privileges": "Admin Privileges",
                "error_lexicon": "Error Lexicon",
                "staff_manual": "Staff Manual",
                "process_title": "The HIT Flow Process",
                "welcome_desc": "Welcome to HIT Flow. Our system guides you through the entire termination and re-rental process of a property.",
                "error_recent_login": "Security Timeout: Please log in again to change your password.",
                "pro_tip_search": "Use the quick search (Shortcut: Ctrl+F) on the dashboard to instantly filter apartments by address or tenant."
            },
            "admin": {
                "dashboard_title": "Admin Dashboard",
                "dashboard_subtitle": "Central Management for HIT Flow",
                "users_title": "User Management",
                "users_desc": "Add, remove users and manage roles",
                "tests_title": "System Diagnostics",
                "tests_desc": "Run automated business logic tests",
                "back_to_app": "Back to App"
            },
            "notifications": {
                "title": "Notifications",
                "subtitle": "Team activities",
                "search_placeholder": "Search for property, person or activity...",
                "just_now": "Just now"
            },
            "login": {
                "loading": "Logging in...",
                "error_credentials": "Email or password incorrect. Please try again.",
                "error_too_many_requests": "Too many attempts. Please wait a moment.",
                "error_generic": "Login failed. Please check your inputs."
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'de',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
