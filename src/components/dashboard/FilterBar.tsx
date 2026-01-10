import React, { useEffect, useState } from 'react';
import { FileDown, Search, Archive, Kanban, List } from "lucide-react";
import { useApartmentStore } from "@/store/useApartmentStore";
import { getTeamMembers, type TeamMember } from '@/services/teamService';
import { cn } from "@/lib/utils";
import { exportApartmentsToExcel } from '@/lib/exportUtils';
import { useTranslation } from 'react-i18next';

interface FilterBarProps {
    currentView: 'kanban' | 'list';
    onViewChange: (view: 'kanban' | 'list') => void;
    showArchived?: boolean;
    onToggleArchived?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ currentView, onViewChange, showArchived, onToggleArchived }) => {
    const { t } = useTranslation();
    const { searchTerm, setSearchTerm, filterResponsible, setFilterResponsible } = useApartmentStore();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        const loadTeam = async () => {
            const members = await getTeamMembers();
            setTeamMembers(members);
        };
        loadTeam();
    }, []);

    const apartments = useApartmentStore(state => state.apartments);

    const handleExport = () => {
        exportApartmentsToExcel(apartments);
    };

    return (
        <div className="bg-white border-b border-slate-100 px-4 sm:px-8 py-3 sticky top-0 md:top-[76px] z-30 shadow-sm transition-all">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">

                {/* Search Box */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder={t('dashboard.search_placeholder', 'Schnellsuche (Adresse, Mieter...)')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-50 rounded-xl focus:ring-4 focus:ring-blue-500/10 font-bold transition-all outline-none focus:bg-white focus:border-blue-100 placeholder:text-slate-300 text-sm"
                    />
                    <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-300" />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Responsible Filter */}
                    <select
                        value={filterResponsible}
                        onChange={(e) => setFilterResponsible(e.target.value)}
                        className="flex-1 sm:flex-none bg-orange-50 text-orange-700 border-2 border-orange-50 rounded-xl py-2.5 px-4 font-black text-xs sm:text-[11px] uppercase tracking-widest outline-none cursor-pointer hover:bg-orange-100 transition-all appearance-none text-center shadow-sm"
                    >
                        <option value="Alle">{t('dashboard.responsible_all', 'TEAM (ALLE)')}</option>
                        {teamMembers.map(member => (
                            <option key={member.id} value={member.displayName}>
                                {member.displayName.toUpperCase()}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-1.5">
                        {/* Archive Toggle */}
                        {onToggleArchived && (
                            <button
                                onClick={onToggleArchived}
                                title={showArchived ? t('dashboard.hide_archive', 'Archiv ausblenden') : t('dashboard.show_archive', 'Archiv anzeigen')}
                                className={cn(
                                    "p-2.5 rounded-xl font-black transition-all border-2 flex items-center justify-center",
                                    showArchived
                                        ? "bg-slate-800 text-white border-slate-800 shadow-md"
                                        : "bg-white text-slate-300 border-slate-100 hover:border-slate-200"
                                )}
                            >
                                <Archive className="w-4 h-4" />
                                <span className="hidden sm:inline ml-2 text-[10px] uppercase tracking-widest">{t('dashboard.archive', 'Archiv')}</span>
                            </button>
                        )}

                        {/* Export Button */}
                        <button
                            onClick={handleExport}
                            title="Excel Export"
                            className="p-2.5 bg-white text-slate-300 border-2 border-slate-100 rounded-xl hover:border-slate-200 transition-all flex items-center justify-center shadow-sm"
                        >
                            <FileDown className="w-4 h-4" />
                        </button>
                    </div>

                    {/* View Switcher */}
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 shadow-inner">
                        <button
                            onClick={() => onViewChange('kanban')}
                            className={cn(
                                "p-1.5 sm:px-3 rounded-lg transition-all flex items-center gap-1.5",
                                currentView === 'kanban'
                                    ? "bg-white shadow text-blue-600 font-black"
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <Kanban className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[9px] uppercase tracking-[0.15em] font-black">{t('dashboard.kanban', 'Kanban')}</span>
                        </button>
                        <button
                            onClick={() => onViewChange('list')}
                            className={cn(
                                "p-1.5 sm:px-3 rounded-lg transition-all flex items-center gap-1.5",
                                currentView === 'list'
                                    ? "bg-white shadow text-blue-600 font-black"
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <List className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[9px] uppercase tracking-[0.15em] font-black">{t('dashboard.list', 'Liste')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
