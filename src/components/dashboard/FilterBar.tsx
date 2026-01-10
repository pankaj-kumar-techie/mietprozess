import React, { useEffect, useState } from 'react';
import { FileDown, Search } from "lucide-react";
import { useApartmentStore } from "@/store/useApartmentStore";
import { getTeamMembers, type TeamMember } from '@/services/teamService';
import { cn } from "@/lib/utils";
import { exportApartmentsToExcel } from '@/lib/exportUtils';
import { Button } from '../ui/button';

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
        <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-[88px] z-30 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:flex-1 sm:min-w-[300px] relative">
                    <input
                        type="text"
                        placeholder="Suche nach Adresse, Mieter oder Objekt..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold transition-all outline-none"
                    />
                    <Search className="w-6 h-6 absolute left-4 top-3 text-slate-300" />
                </div>

                <select
                    value={filterResponsible}
                    onChange={(e) => setFilterResponsible(e.target.value)}
                    className="w-full sm:w-auto bg-slate-50 border-none rounded-2xl py-3 px-6 font-black text-sm outline-none cursor-pointer hover:bg-slate-100 transition-colors bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200"
                >
                    <option value="Alle">Alle Zuständigkeiten</option>
                    {teamMembers.map(member => <option key={member.id} value={member.displayName}>{member.displayName}</option>)}
                </select>

                {/* Archive Toggle */}
                <Button
                    onClick={handleExport}
                    variant="ghost"
                    className="px-4 py-2 rounded-xl font-bold text-sm transition-all border-2"
                >
                    <FileDown className="w-4 h-4" />
                </Button>
                {onToggleArchived && (
                    <button
                        onClick={onToggleArchived}
                        className={cn(
                            "px-4 py-2 rounded-xl font-bold text-sm transition-all border-2",
                            showArchived
                                ? "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200"
                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        )}
                    >
                        {showArchived ? '📦 Archiv ausblenden' : '📦 Archiv anzeigen'}
                    </button>
                )}

                {/* View Toggle */}
                <div className="w-full sm:w-auto flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200/50">
                    <button
                        onClick={() => onViewChange('kanban')}
                        className={cn(
                            "flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-black tracking-widest transition-all",
                            currentView === 'kanban'
                                ? "bg-white shadow-lg text-blue-600 scale-105"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        KANBAN
                    </button>
                    <button
                        onClick={() => onViewChange('list')}
                        className={cn(
                            "flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-black tracking-widest transition-all",
                            currentView === 'list'
                                ? "bg-white shadow-lg text-blue-600 scale-105"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        LISTE
                    </button>
                </div>
            </div>
        </div>
    );
};
