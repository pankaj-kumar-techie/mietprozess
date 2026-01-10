import React, { useEffect, useState } from 'react';
import { FileDown, Search, Archive, Kanban, List } from "lucide-react";
import { useApartmentStore } from "@/store/useApartmentStore";
import { getTeamMembers, type TeamMember } from '@/services/teamService';
import { cn } from "@/lib/utils";
import { exportApartmentsToExcel } from '@/lib/exportUtils';

interface FilterBarProps {
    currentView: 'kanban' | 'list';
    onViewChange: (view: 'kanban' | 'list') => void;
    showArchived?: boolean;
    onToggleArchived?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ currentView, onViewChange, showArchived, onToggleArchived }) => {
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
        <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-6 sticky top-0 md:top-[88px] z-30 shadow-sm transition-all">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">

                {/* Search Box */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Suche..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold transition-all outline-none focus:bg-white focus:border-blue-100 placeholder:text-slate-300"
                    />
                    <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-300" />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Responsible Filter */}
                    <select
                        value={filterResponsible}
                        onChange={(e) => setFilterResponsible(e.target.value)}
                        className="flex-1 sm:flex-none bg-orange-50 text-orange-700 border-2 border-orange-100 rounded-2xl py-3 px-6 font-black text-xs sm:text-sm outline-none cursor-pointer hover:bg-orange-100 transition-all appearance-none text-center"
                    >
                        <option value="Alle">Alle Teammitglieder</option>
                        {teamMembers.map(member => (
                            <option key={member.id} value={member.displayName}>
                                {member.displayName}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2">
                        {/* Archive Toggle */}
                        {onToggleArchived && (
                            <button
                                onClick={onToggleArchived}
                                title={showArchived ? 'Archiv ausblenden' : 'Archiv anzeigen'}
                                className={cn(
                                    "p-3 rounded-2xl font-bold transition-all border-2 flex items-center justify-center",
                                    showArchived
                                        ? "bg-slate-800 text-white border-slate-800 shadow-lg"
                                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                                )}
                            >
                                <Archive className="w-5 h-5" />
                                <span className="hidden sm:inline ml-2 text-xs uppercase tracking-tighter">Archiv</span>
                            </button>
                        )}

                        {/* Export Button */}
                        <button
                            onClick={handleExport}
                            title="Excel Export"
                            className="p-3 bg-white text-slate-400 border-2 border-slate-100 rounded-2xl hover:border-slate-200 transition-all flex items-center justify-center"
                        >
                            <FileDown className="w-5 h-5" />
                        </button>
                    </div>

                    {/* View Switcher */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
                        <button
                            onClick={() => onViewChange('kanban')}
                            className={cn(
                                "p-2 sm:px-4 rounded-xl transition-all flex items-center gap-2",
                                currentView === 'kanban'
                                    ? "bg-white shadow-md text-blue-600 font-black"
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <Kanban className="w-4 h-4" />
                            <span className="hidden sm:inline text-[10px] uppercase tracking-widest font-black">Kanban</span>
                        </button>
                        <button
                            onClick={() => onViewChange('list')}
                            className={cn(
                                "p-2 sm:px-4 rounded-xl transition-all flex items-center gap-2",
                                currentView === 'list'
                                    ? "bg-white shadow-md text-blue-600 font-black"
                                    : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <List className="w-4 h-4" />
                            <span className="hidden sm:inline text-[10px] uppercase tracking-widest font-black">Liste</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
