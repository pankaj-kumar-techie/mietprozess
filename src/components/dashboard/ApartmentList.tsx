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

    const [currentPage, setCurrentPage] = React.useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(filtered.length / pageSize);

    // Sort state could be local here
    const [sortConfig, setSortConfig] = React.useState<{ key: keyof Apartment | 'lastActivity', direction: 'asc' | 'desc' }>({ key: 'terminationDate', direction: 'asc' });

    const sorted = [...filtered].sort((a, b) => {
        let valA = a[sortConfig.key] || '';
        let valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <th onClick={() => requestSort('address')} className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors group w-1/4">Adresse / Objekt <SortIcon column="address" /></th>
                            <th onClick={() => requestSort('oldTenant')} className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors group">Alter Mieter <SortIcon column="oldTenant" /></th>
                            <th onClick={() => requestSort('terminationDate')} className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors group">Kündigung per <SortIcon column="terminationDate" /></th>
                            <th onClick={() => requestSort('newTenant')} className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors group">Neuer Mieter <SortIcon column="newTenant" /></th>
                            <th onClick={() => requestSort('rentalStart')} className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors group">Mietbeginn <SortIcon column="rentalStart" /></th>
                            <th onClick={() => requestSort('status')} className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors group text-center">Status <SortIcon column="status" /></th>
                            <th onClick={() => requestSort('responsible')} className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors group">Zuständig <SortIcon column="responsible" /></th>
                            <th onClick={() => requestSort('lastActivity')} className="px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors group text-center w-20">Akt. <SortIcon column="lastActivity" /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs">
                        {paginated.map(ap => {
                            const d = getDaysSince(ap.lastActivity);
                            return (
                                <tr key={ap.id} onClick={() => onCardClick(ap.id)} className="hover:bg-blue-50/40 cursor-pointer transition-colors group">
                                    <td className="px-4 py-2.5">
                                        <p className="font-black text-slate-800 tracking-tight truncate text-[13px]">{ap.address}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{ap.objectName}</p>
                                    </td>
                                    <td className="px-4 py-2.5 truncate font-bold text-slate-600 text-[11px]">{ap.oldTenant}</td>
                                    <td className="px-4 py-2.5">
                                        <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded-md font-black border border-red-100 text-[11px]">{formatDate(ap.terminationDate)}</span>
                                    </td>
                                    <td className="px-4 py-2.5 truncate font-bold text-blue-600 text-[11px]">
                                        {ap.newTenant || <span className="text-slate-300 italic font-bold">Offen</span>}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        {ap.rentalStart ? <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded-md font-black border border-green-100 text-[11px]">{formatDate(ap.rentalStart)}</span> : <span className="text-slate-300 italic font-bold text-[11px]">-</span>}
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className={cn("px-1.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest", STATUS_COLORS[ap.status])}>
                                            {ap.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 truncate font-bold text-slate-500 text-[11px]">{ap.responsible}</td>
                                    <td className="px-4 py-2.5 text-center">
                                        <div className={cn("inline-flex items-center gap-1 font-black text-[9px]", getActivityColor(d))}>
                                            {d}d
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="p-3 rounded-xl bg-white border-2 border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100 transition-all font-bold"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <div className="flex items-center gap-1 bg-white border-2 border-slate-100 rounded-xl px-2 py-2 shadow-sm">
                        {(() => {
                            const pages = [];
                            const maxVisible = 5;
                            let start = Math.max(1, currentPage - 2);
                            let end = Math.min(totalPages, start + maxVisible - 1);

                            if (end - start < maxVisible - 1) {
                                start = Math.max(1, end - maxVisible + 1);
                            }

                            for (let i = start; i <= end; i++) {
                                pages.push(
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={cn(
                                            "w-9 h-9 rounded-lg font-black text-[11px] transition-all",
                                            currentPage === i
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110 z-10"
                                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                                        )}
                                    >
                                        {i}
                                    </button>
                                );
                            }
                            return pages;
                        })()}
                    </div>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-3 rounded-xl bg-white border-2 border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100 transition-all font-bold"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            )}
        </div>
    );
};
