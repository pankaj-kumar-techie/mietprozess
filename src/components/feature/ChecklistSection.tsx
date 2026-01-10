
import React, { useState } from 'react';
import { STATUS_COLORS } from '@/types';
import type { ChecklistItem, ChecklistItemType, Apartment, Status } from '@/types';
import { isStatusComplete, getAutoNextStatus } from '@/lib/logic';
import { cn } from '@/lib/utils';
import { ClipboardList, Trash, ChevronDown } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ChecklistSectionProps {
    apartment: Apartment;
    onUpdateChecklist: (updatedList: ChecklistItem[]) => void;
    onTriggerTenantPopup: () => void;
    onAutoStatusChange?: (newStatus: string) => void;
}

const getInitials = (name?: string | null): string => {
    if (!name) return '??';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({ apartment, onUpdateChecklist, onTriggerTenantPopup, onAutoStatusChange }) => {
    const [manualCollapse, setManualCollapse] = useState<Record<string, boolean>>({});
    const [newChecklistItemText, setNewChecklistItemText] = useState('');
    const addNotification = useNotificationStore(state => state.addNotification);
    const user = useAuthStore(state => state.user);

    const isSectionCollapsed = (title: string) => {
        if (manualCollapse[title] !== undefined) return manualCollapse[title];
        return isStatusComplete(apartment, title);
    };

    const toggleSection = (title: string) => {
        setManualCollapse((prev: Record<string, boolean>) => ({ ...prev, [title]: !isSectionCollapsed(title) }));
    };

    const expandAll = () => {
        const headers = apartment.checklist.filter(i => i.type === 'header').map(i => i.text || '');
        const newCollapseState: Record<string, boolean> = {};
        headers.forEach(h => { newCollapseState[h] = false; });
        setManualCollapse(newCollapseState);
        addNotification('Alle Abschnitte ausgeklappt', 'info');
    };

    const collapseAll = () => {
        const headers = apartment.checklist.filter(i => i.type === 'header').map(i => i.text || '');
        const newCollapseState: Record<string, boolean> = {};
        headers.forEach(h => { newCollapseState[h] = true; });
        setManualCollapse(newCollapseState);
        addNotification('Alle Abschnitte eingeklappt', 'info');
    };

    const handleItemUpdate = (idx: number, updates: Partial<ChecklistItem>) => {
        const newList = [...apartment.checklist];
        const item = newList[idx];

        if (updates.completed !== undefined && item.type === 'checkbox') {
            if (updates.completed) {
                updates.completedBy = user?.email || user?.displayName || 'Unknown';
                updates.completedByInitials = getInitials(user?.displayName || user?.email);
                updates.completedAt = new Date().toISOString();
            } else {
                updates.completedBy = undefined;
                updates.completedByInitials = undefined;
                updates.completedAt = undefined;
            }
        }

        newList[idx] = { ...newList[idx], ...updates };
        onUpdateChecklist(newList);

        // Triggers for specific milestones
        const isContractMilestone = newList[idx].id === 'contract_signed' || newList[idx].text === 'Mietvertrag unterzeichnet retour';

        if (isContractMilestone && updates.completed === true && (!apartment.newTenant || !apartment.rentalStart)) {
            onTriggerTenantPopup();
        }

        if (onAutoStatusChange && updates.completed === true) {
            const tempApartment = { ...apartment, checklist: newList };
            const nextStatus = getAutoNextStatus(tempApartment);
            if (nextStatus) {
                onAutoStatusChange(nextStatus);
            }
        }
    };

    const handleGroupItemUpdate = (idx: number, subIdx: number, val: string) => {
        const newList = [...apartment.checklist];
        const groupItems = [...(newList[idx].items || [])];
        groupItems[subIdx] = { ...groupItems[subIdx], value: val };
        newList[idx] = { ...newList[idx], items: groupItems };
        onUpdateChecklist(newList);
    };

    const deleteItem = (idx: number) => {
        const list = apartment.checklist.filter((_, i) => i !== idx);
        onUpdateChecklist(list);
        addNotification('Aufgabe entfernt', 'info');
    };

    const addItem = () => {
        if (!newChecklistItemText.trim()) return;
        const list = [...apartment.checklist, { type: 'checkbox' as ChecklistItemType, text: newChecklistItemText, completed: false }];
        onUpdateChecklist(list);
        setNewChecklistItemText('');
        addNotification('Neue Aufgabe hinzugefügt', 'success');
    };

    let currentHeader = '';

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h4 className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                    <ClipboardList className="w-5 h-5 text-blue-500" />
                    Aufgaben
                </h4>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 shadow-inner">
                    <button
                        onClick={expandAll}
                        className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-all border border-blue-100/50 active:scale-95"
                    >
                        Ausklappen
                    </button>
                    <button
                        onClick={collapseAll}
                        className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 text-slate-400 hover:text-slate-600 transition-all rounded-lg active:scale-95 ml-1"
                    >
                        Einklappen
                    </button>
                </div>
            </div>
            <div className="bg-white border-2 border-slate-100 rounded-[1.5rem] overflow-hidden shadow-lg">
                {apartment.checklist.map((item, idx) => {
                    if (item.type === 'header') {
                        currentHeader = item.text || '';
                        const collapsed = isSectionCollapsed(currentHeader);
                        const color = STATUS_COLORS[currentHeader as Status]?.split(' ')[0] || 'bg-gray-100';
                        const complete = isStatusComplete(apartment, currentHeader);

                        return (
                            <div
                                key={idx}
                                onClick={() => item.text && toggleSection(item.text)}
                                className={cn(
                                    color,
                                    "p-2 sm:p-2.5 border-b-2 border-white/40 mt-6 first:mt-0 font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-slate-700 shadow-sm px-4 sm:px-6 flex items-center justify-between cursor-pointer group transition-all hover:brightness-95 active:scale-[0.99] select-none"
                                )}
                            >
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className={cn(
                                        "w-6 h-6 rounded-lg bg-white/40 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:bg-white/60",
                                        collapsed ? "-rotate-90 opacity-60" : "rotate-0 shadow-md"
                                    )}>
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="drop-shadow-sm">{item.text}</span>
                                </div>
                                {complete && (
                                    <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm text-green-700 text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm border border-white/50 uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        Erledigt
                                    </div>
                                )}
                            </div>
                        );
                    }
                    if (item.type === 'spacer') return <div key={idx} className="h-4" />;
                    if (currentHeader && isSectionCollapsed(currentHeader)) return null;

                    return (
                        <div key={idx} className="p-3 border-b last:border-b-0 hover:bg-slate-50/20 flex flex-col gap-2 transition duration-200 px-6">
                            {item.type === 'checkbox' ? (
                                <div className="flex items-start gap-3 group">
                                    <input
                                        type="checkbox"
                                        checked={item.completed || false}
                                        onChange={() => handleItemUpdate(idx, { completed: !item.completed })}
                                        className="mt-0.5 w-4 h-4 rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                                    />
                                    <div className="flex-1">
                                        <label className={cn(
                                            "text-[13px] font-bold cursor-pointer transition-all",
                                            item.completed ? "text-slate-400 line-through" : "text-slate-700 hover:text-blue-600"
                                        )}>
                                            {item.text}
                                        </label>
                                        {item.completed && item.completedBy && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1.5 bg-blue-50/50 px-2 py-0.5 rounded-lg border border-blue-100/50">
                                                    <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                                                    <span className="text-[9px] text-blue-600 font-black uppercase tracking-widest leading-none">
                                                        {item.completedByInitials} • {item.completedAt && format(new Date(item.completedAt), 'HH:mm dd.MM', { locale: de })}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteItem(idx)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50"
                                    >
                                        <Trash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : item.type === 'group' ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {item.items?.map((si, sidx) => (
                                        <div key={sidx}>
                                            <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">{si.text}</label>
                                            <input
                                                type="text"
                                                value={si.value}
                                                onChange={e => handleGroupItemUpdate(idx, sidx, e.target.value)}
                                                className="w-full p-2 bg-slate-50 border-2 border-slate-100 rounded-lg text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                                                placeholder="Wert eingeben..."
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (item.type === 'text-input') ? (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">{item.text}</label>
                                    <input
                                        type="text"
                                        value={item.value}
                                        onChange={e => handleItemUpdate(idx, { value: e.target.value })}
                                        className="w-full p-2 bg-slate-50 border-2 border-slate-100 rounded-lg text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                                        placeholder="Text eingeben..."
                                    />
                                </div>
                            ) : null}
                        </div>
                    );
                })}
                <div className="p-4 bg-slate-50/50 flex gap-3 border-t-2 border-slate-100 px-6">
                    <input
                        type="text"
                        value={newChecklistItemText}
                        onChange={(e) => setNewChecklistItemText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addItem()}
                        placeholder="Zusätzliche Aufgabe erfassen..."
                        className="flex-1 p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold outline-none shadow-sm bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                    <button onClick={addItem} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95 uppercase tracking-widest">
                        Hinzufügen
                    </button>
                </div>
            </div>
        </section>
    );
};
