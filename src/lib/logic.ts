import type { Apartment } from '@/types';

export const isStatusComplete = (apartment: Apartment, statusName: string): boolean => {
    let inSection = false;
    let itemsInSection = 0;
    let itemsCompleted = 0;

    for (const item of apartment.checklist) {
        if (item.type === 'header') {
            if (item.text === statusName) { inSection = true; continue; }
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
    return itemsInSection > 0 && itemsInSection === itemsCompleted;
};
