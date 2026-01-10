// Kanban Board Configuration
// Admin can override these in the UI, stored in localStorage

export interface KanbanColumn {
    id: string;
    name: string;
    color: string;
    order: number;
}

export const DEFAULT_KANBAN_COLUMNS: KanbanColumn[] = [
    {
        id: 'in_kuendigung',
        name: 'In Kündigung',
        color: 'bg-red-100',
        order: 1
    },
    {
        id: 'in_vermietung',
        name: 'In Vermietung',
        color: 'bg-yellow-100',
        order: 2
    },
    {
        id: 'vertrag_erstellt',
        name: 'Mietvertrag erstellt',
        color: 'bg-blue-100',
        order: 3
    },
    {
        id: 'wohnung_uebergeben',
        name: 'Wohnung übergeben',
        color: 'bg-green-100',
        order: 4
    },

];

// Get columns from localStorage or use defaults
export const getKanbanColumns = (): KanbanColumn[] => {
    try {
        const stored = localStorage.getItem('kanban_columns');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.warn('Failed to load custom Kanban columns, using defaults');
    }
    return DEFAULT_KANBAN_COLUMNS;
};

// Save custom columns to localStorage
export const saveKanbanColumns = (columns: KanbanColumn[]): void => {
    try {
        localStorage.setItem('kanban_columns', JSON.stringify(columns));
    } catch (error) {
        console.error('Failed to save Kanban columns:', error);
    }
};

// Reset to default columns
export const resetKanbanColumns = (): void => {
    localStorage.removeItem('kanban_columns');
};
