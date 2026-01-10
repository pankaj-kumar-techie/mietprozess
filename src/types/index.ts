
export type Status =
    | 'In Kündigung'
    | 'In Vermietung'
    | 'Mietvertrag erstellt'
    | 'Wohnung übergeben'
    | 'Abgeschlossen'
    | 'Archiviert'; // New status added

export type Responsible = string; // Could be union if fixed list

export type RelettingOption =
    | 'Ja Weitervermietung'
    | 'Nein Nachmieter vorhanden'
    | 'Nein Umbau';

export type ChecklistItemType =
    | 'header'
    | 'checkbox'
    | 'text-input'
    | 'date-input'
    | 'number-input'
    | 'spacer'
    | 'group';

export interface SubItem {
    text: string;
    value: string;
}

export interface ChecklistItem {
    id?: string; // Optional ID for programmatic triggers (e.g., 'contract_signed')
    type: ChecklistItemType;
    text?: string;
    completed?: boolean;
    value?: string;
    items?: SubItem[]; // For 'group' type
    name?: string; // For 'group' type header
    // Completion tracking
    completedBy?: string; // User email or name
    completedByInitials?: string; // e.g., "PK"
    completedAt?: string; // ISO timestamp
}

export interface Comment {
    text: string;
    timestamp: string;
    user: string; // Legacy field, kept for backward compatibility
    author?: string; // Display name of the user who commented
    authorEmail?: string | null; // Email of the user who commented
}

export interface Apartment {
    id: string;
    address: string;
    objectName: string;
    oldTenant: string;
    newTenant?: string;
    terminationDate: string;
    rentalStart?: string;
    status: Status;
    responsible: Responsible;
    relettingOption: RelettingOption;
    comments: Comment[];
    checklist: ChecklistItem[];
    lastActivity: string;
    createdBy?: string;
    createdAt?: string;
    // Archive tracking
    completedAt?: string; // When status changed to "Abgeschlossen"
    archivedAt?: string; // Auto-set 30 days after completedAt
    isArchived?: boolean; // Computed field
}

export const STATUS_OPTIONS: Status[] = [
    'In Kündigung',
    'In Vermietung',
    'Mietvertrag erstellt',
    'Wohnung übergeben',
    'Abgeschlossen',
    'Archiviert' // Option added
];

export const STATUS_COLORS: Record<Status, string> = {
    'In Kündigung': 'bg-red-50 border-red-200 text-red-700',
    'In Vermietung': 'bg-yellow-50 border-yellow-200 text-yellow-700',
    'Mietvertrag erstellt': 'bg-green-50 border-green-200 text-green-700',
    'Wohnung übergeben': 'bg-blue-50 border-blue-200 text-blue-700',
    'Abgeschlossen': 'bg-gray-100 border-gray-300 text-gray-700',
    'Archiviert': 'bg-slate-800 border-slate-900 text-slate-300' // Dark style
};

// Team members are now loaded dynamically from Firestore - see teamService.ts
export const RELETTING_OPTIONS = ['Ja Weitervermietung', 'Nein Nachmieter vorhanden', 'Nein Umbau'];
