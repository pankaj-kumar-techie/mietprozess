import React from 'react';
import { format } from 'date-fns';
import { STATUS_COLORS } from '@/types';
import type { Apartment } from '@/types';
import { useApartmentStore } from '@/store/useApartmentStore';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

interface ApartmentListProps {
    onCardClick: (id: string) => void;
}

const getActivityColor = (days: number) => {
    if (days >= 15) return 'text-red-600';
    if (days >= 7) return 'text-yellow-600';
    return 'text-black';
};

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return format(new Date(dateStr), 'dd.MM.yyyy');
};

const getDaysSince = (isoString?: string) => {
    if (!isoString) return 0;
    return differenceInDays(new Date(), new Date(isoString));
};

export const ApartmentList: React.FC<ApartmentListProps> = ({ onCardClick }) => {
    const { apartments, searchTerm, filterResponsible } = useApartmentStore();

    // Filter logic replicates the one in store/hook if not already filtered in store.
    // Ideally store should provide filtered selector, but for now filtering here or relying on store to filtered list.
    // The store currently has `apartments` as raw list. I need to filter it here or add a selector.
    // The original implementation did filtering in memo. I will replicate simplified filtering here.

    const filtered = apartments.filter(a => {
        const s = searchTerm.toLowerCase();
        const matchSearch = !searchTerm ||
            a.address.toLowerCase().includes(s) ||
            a.oldTenant.toLowerCase().includes(s) ||
            a.objectName.toLowerCase().includes(s) ||
            a.newTenant?.toLowerCase().includes(s);
        const matchResp = filterResponsible === 'Alle' || a.responsible === filterResponsible;
        return matchSearch && matchResp;
    });

    // Sort state could be local here
    const [sortConfig, setSortConfig] = React.useState<{ key: keyof Apartment | 'lastActivity', direction: 'asc' | 'desc' }>({ key: 'terminationDate', direction: 'asc' });

    const sorted = [...filtered].sort((a, b) => {
        let valA = a[sortConfig.key] || '';
        let valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const requestSort = (key: keyof Apartment | 'lastActivity') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (sortConfig.key !== column) return <svg className="w-3 h-3 text-slate-300 ml-1 inline opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
        return sortConfig.direction === 'asc'
            ? <svg className="w-3 h-3 text-blue-600 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
            : <svg className="w-3 h-3 text-blue-600 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>;
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl overflow-hidden">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-slate-50 border-b-2 border-slate-100">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th onClick={() => requestSort('address')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition-colors group w-1/4">Adresse / Objekt <SortIcon column="address" /></th>
                            <th onClick={() => requestSort('oldTenant')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition-colors group">Alter Mieter <SortIcon column="oldTenant" /></th>
                            <th onClick={() => requestSort('terminationDate')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition-colors group">Kündigung per <SortIcon column="terminationDate" /></th>
                            <th onClick={() => requestSort('newTenant')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition-colors group">Neuer Mieter <SortIcon column="newTenant" /></th>
                            <th onClick={() => requestSort('rentalStart')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition-colors group">Mietbeginn <SortIcon column="rentalStart" /></th>
                            <th onClick={() => requestSort('status')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition-colors group">Status <SortIcon column="status" /></th>
                            <th onClick={() => requestSort('responsible')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition-colors group">Zuständig <SortIcon column="responsible" /></th>
                            <th onClick={() => requestSort('lastActivity')} className="px-6 py-5 cursor-pointer hover:bg-slate-100 transition-colors group text-center w-24">Aktivität <SortIcon column="lastActivity" /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs">
                        {sorted.map(ap => {
                            const d = getDaysSince(ap.lastActivity);
                            return (
                                <tr key={ap.id} onClick={() => onCardClick(ap.id)} className="hover:bg-blue-50/40 cursor-pointer transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-black text-slate-800 tracking-tight truncate">{ap.address}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">{ap.objectName}</p>
                                    </td>
                                    <td className="px-6 py-4 truncate font-bold text-slate-600">{ap.oldTenant}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-50 text-red-700 px-2 py-1 rounded-lg font-black border border-red-100 shadow-sm">{formatDate(ap.terminationDate)}</span>
                                    </td>
                                    <td className="px-6 py-4 truncate font-bold text-blue-600">
                                        {ap.newTenant || <span className="text-slate-300 italic font-bold">Offen</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {ap.rentalStart ? <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg font-black border border-green-100 shadow-sm">{formatDate(ap.rentalStart)}</span> : <span className="text-slate-300 italic font-bold">-</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-2 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest", STATUS_COLORS[ap.status])}>
                                            {ap.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 truncate font-bold text-slate-500">{ap.responsible}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={cn("inline-flex items-center gap-1 font-black text-[10px]", getActivityColor(d))}>
                                            {d}d
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
