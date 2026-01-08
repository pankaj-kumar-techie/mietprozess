export type Status =
    | 'In Kündigung'
    | 'In Vermietung'
    | 'Mietvertrag erstellt'
    | 'Wohnung übergeben'
    | 'Abgeschlossen';

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
    type: ChecklistItemType;
    text?: string;
    completed?: boolean;
    value?: string;
    items?: SubItem[]; // For 'group' type
    name?: string; // For 'group' type header
}

export interface Comment {
    text: string;
    timestamp: string;
    user: string;
}

export interface Apartment {
    id: string;
    address: string;
    objectName: string;
    oldTenant: string;
    terminationDate: string;
    status: Status;
    responsible: Responsible;
    relettingOption: RelettingOption;
    comments: Comment[];
    checklist: ChecklistItem[];
    newTenant?: string;
    rentalStart?: string;
    lastActivity: string;
    createdBy?: string;
    createdAt?: string;
}

export const STATUS_OPTIONS: Status[] = [
    'In Kündigung',
    'In Vermietung',
    'Mietvertrag erstellt',
    'Wohnung übergeben',
    'Abgeschlossen'
];

export const STATUS_COLORS: Record<Status, string> = {
    'In Kündigung': 'bg-red-50 border-red-200 text-red-700',
    'In Vermietung': 'bg-yellow-50 border-yellow-200 text-yellow-700',
    'Mietvertrag erstellt': 'bg-green-50 border-green-200 text-green-700',
    'Wohnung übergeben': 'bg-blue-50 border-blue-200 text-blue-700',
    'Abgeschlossen': 'bg-gray-100 border-gray-300 text-gray-700'
};

export const TEAM_MEMBERS = ['Kein Zuständiger', 'Max Mustermann', 'Erika Musterfrau', 'Hans Schmidt', 'Anna Meier'];
export const RELETTING_OPTIONS = ['Ja Weitervermietung', 'Nein Nachmieter vorhanden', 'Nein Umbau'];
