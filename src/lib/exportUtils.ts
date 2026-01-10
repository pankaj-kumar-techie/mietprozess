import * as XLSX from 'xlsx';
import type { Apartment } from '@/types';

/**
 * Utility to export apartment data to an Excel file.
 * Flattens nested checklist and comments for readability.
 */
export const exportApartmentsToExcel = (apartments: Apartment[]) => {
    const data = apartments.map(ap => ({
        'ID': ap.id,
        'Adresse': ap.address,
        'Objekt': ap.objectName,
        'Alter Mieter': ap.oldTenant,
        'Kündigungsdatum': ap.terminationDate,
        'Status': ap.status,
        'Zuständig': ap.responsible,
        'Wiedervermietung': ap.relettingOption,
        'Neuer Mieter': ap.newTenant || '-',
        'Mietbeginn': ap.rentalStart || '-',
        'Letzte Aktivität': ap.lastActivity,
        'Checklist (Erfüllt)': ap.checklist.filter(c => c.completed).map(c => c.text).join(', '),
        'Checklist (Offen)': ap.checklist.filter(c => !c.completed).map(c => c.text).join(', '),
        'Kommentare': ap.comments.map(c => `${c.user}: ${c.text}`).join(' | ')
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Wohnungen");

    // Generate filename with timestamp
    const date = new Date().toISOString().split('T')[0];
    const filename = `HIT_Flow_Export_${date}.xlsx`;

    XLSX.writeFile(workbook, filename);
};
