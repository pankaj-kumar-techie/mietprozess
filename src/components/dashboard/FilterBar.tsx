import React from 'react';
import { Search } from "lucide-react";
import { TEAM_MEMBERS } from "@/types";
import { useApartmentStore } from "@/store/useApartmentStore";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    currentView: 'kanban' | 'list';
    onViewChange: (view: 'kanban' | 'list') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ currentView, onViewChange }) => {
    const { searchTerm, setSearchTerm, filterResponsible, setFilterResponsible } = useApartmentStore();

    return (
        <div className="p-8 pb-4">
            <div className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-wrap items-center gap-6">
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
                    className="w-full sm:w-auto bg-slate-50 border-none rounded-2xl py-3 px-6 font-black text-sm outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                >
                    <option value="Alle">Alle Zuständigkeiten</option>
                    {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>

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
