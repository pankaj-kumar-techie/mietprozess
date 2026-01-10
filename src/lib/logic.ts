
import type { Apartment } from '@/types';
import { differenceInDays } from 'date-fns';

/**
 * Rule 1 Check: Is a status section 100% complete?
 */
export const isStatusComplete = (apartment: Apartment, statusName: string): boolean => {
    let inSection = false;
    let itemsInSection = 0;
    let itemsCompleted = 0;

    for (const item of apartment.checklist) {
        if (item.type === 'header') {
            if (item.text === statusName) {
                inSection = true;
                continue;
            }
            else if (inSection) break; // End of section
        }
        if (inSection) {
            if (item.type === 'spacer') continue;
            itemsInSection++;

            if (item.type === 'checkbox' && item.completed) itemsCompleted++;
            if (['text-input', 'date-input'].includes(item.type) && item.value?.trim()) itemsCompleted++;
            if (item.type === 'group') {
                const groupComplete = item.items?.every(si => si.value?.trim());
                if (groupComplete) itemsCompleted++;
            }
        }
    }

    // If no items in section, we don't block the move (Section is considered "complete" or "empty")
    // This prevents deadlocks if a status name doesn't have a matching header in the checklist.
    return itemsInSection === 0 || itemsInSection === itemsCompleted;
};

/**
 * Rule 3: Archive Logic
 * Returns true if the apartment is "Abgeschlossen" AND completed > 30 days ago.
 */
export const shouldArchive = (apartment: Apartment): boolean => {
    if (apartment.status !== 'Abgeschlossen' && apartment.status !== 'Archiviert') return false;

    // Handle legacy data (missing completedAt)
    const dateToCheck = apartment.completedAt || apartment.lastActivity || apartment.createdAt;
    if (!dateToCheck) return false;

    const daysSince = differenceInDays(new Date(), new Date(dateToCheck));
    return daysSince >= 30;
};

/**
 * Global Filter Logic: Should this apartment be visible?
 */
export const isApartmentVisible = (apartment: Apartment, showArchived: boolean): boolean => {
    if (showArchived) return true;
    return !shouldArchive(apartment);
};

/**
 * Rule 5: Global Sorting
 * Sort by Termination Date (Ascending) -> Nearest Deadline First
 */
export const sortApartmentsByDate = (apartments: Apartment[]): Apartment[] => {
    return [...apartments].sort((a, b) => {
        if (!a.terminationDate) return 1;
        if (!b.terminationDate) return -1;
        return new Date(a.terminationDate).getTime() - new Date(b.terminationDate).getTime();
    });
};

/**
 * Automated Progression: What is the next status if the current one is complete?
 */
export const getAutoNextStatus = (apartment: Apartment): string | null => {
    const statusOrder: string[] = ['In Kündigung', 'In Vermietung', 'Mietvertrag erstellt', 'Wohnung übergeben', 'Abgeschlossen'];
    const currentIndex = statusOrder.indexOf(apartment.status);

    if (currentIndex === -1 || currentIndex === statusOrder.length - 1) return null;

    if (isStatusComplete(apartment, apartment.status)) {
        return statusOrder[currentIndex + 1];
    }

    return null;
};
