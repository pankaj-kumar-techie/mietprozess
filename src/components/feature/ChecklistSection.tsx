import React, { useState } from 'react';
import { STATUS_COLORS } from '@/types';
import type { ChecklistItem, ChecklistItemType, Apartment, Status } from '@/types';
import { isStatusComplete } from '@/lib/logic';
import { cn } from '@/lib/utils';
import { ClipboardList, Trash, ChevronDown } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { NOTIFICATION_CONFIG } from '@/lib/notifications';

interface ChecklistSectionProps {
    apartment: Apartment;
    onUpdateChecklist: (updatedList: ChecklistItem[]) => void;
    onTriggerTenantPopup: () => void;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({ apartment, onUpdateChecklist, onTriggerTenantPopup }) => {
    const [manualCollapse, setManualCollapse] = useState<Record<string, boolean>>({});
    const [newChecklistItemText, setNewChecklistItemText] = useState('');
    const addNotification = useNotificationStore(state => state.addNotification);

    const isSectionCollapsed = (title: string) => {
        if (manualCollapse[title] !== undefined) return manualCollapse[title];
        return isStatusComplete(apartment, title);
    };

    const toggleSection = (title: string) => {
        setManualCollapse((prev: Record<string, boolean>) => ({ ...prev, [title]: !isSectionCollapsed(title) }));
    };

    const handleItemUpdate = (idx: number, updates: Partial<ChecklistItem>) => {
        const newList = [...apartment.checklist];
        newList[idx] = { ...newList[idx], ...updates };
        onUpdateChecklist(newList);

        // Check for popup trigger
        if (newList[idx].text === 'Mietvertrag unterzeichnet retour' && updates.completed === true && (!apartment.newTenant || !apartment.rentalStart)) {
            onTriggerTenantPopup();
        }

        // Trigger general notification
        if (updates.completed === true && NOTIFICATION_CONFIG.checklistComplete.enabled) {
            addNotification(NOTIFICATION_CONFIG.checklistComplete.message, 'success');
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
    };

    const addItem = () => {
        if (!newChecklistItemText.trim()) return;
        const list = [...apartment.checklist, { type: 'checkbox' as ChecklistItemType, text: newChecklistItemText, completed: false }];
        onUpdateChecklist(list);
        setNewChecklistItemText('');
    };

    let currentHeader = '';

    return (
        <section className="space-y-8">
            <h4 className="text-2xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter">
                <ClipboardList className="w-8 h-8 text-blue-500" />
                Aufgaben
            </h4>
            <div className="bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden shadow-xl">
                {apartment.checklist.map((item, idx) => {
                    if (item.type === 'header') {
                        currentHeader = item.text || '';
                        const collapsed = isSectionCollapsed(currentHeader);
                        const color = STATUS_COLORS[currentHeader as Status]?.split(' ')[0] || 'bg-gray-100';
                        const complete = isStatusComplete(apartment, currentHeader);

                        return (
                            <div
                                key={idx}
                                onClick={() => currentHeader && toggleSection(currentHeader)}
                                className={cn(color, "p-4 border-b-2 border-white/50 mt-10 first:mt-0 font-black text-[13px] uppercase tracking-[0.25em] text-gray-700 shadow-inner px-8 flex items-center justify-between cursor-pointer group transition-all")}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-1 rounded-lg bg-white/40 transition-transform duration-300", collapsed && "-rotate-90")}>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                    {item.text}
                                </div>
                                {complete && (
                                    <span className="bg-green-500 text-white text-[9px] px-2 py-1 rounded-full shadow-sm">ERLEDIGT</span>
                                )}
                            </div>
                        );
                    }
                    if (item.type === 'spacer') return <div key={idx} className="h-4" />;
                    if (currentHeader && isSectionCollapsed(currentHeader)) return null;

                    return (
                        <div key={idx} className="p-5 border-b last:border-b-0 hover:bg-slate-50/50 flex flex-col gap-2 transition duration-200 px-8">
                            {item.type === 'checkbox' ? (
                                <label className={cn("flex items-center justify-between cursor-pointer select-none", item.completed ? 'text-slate-300' : 'font-bold text-slate-700')}>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={e => handleItemUpdate(idx, { completed: e.target.checked })}
                                            className="w-6 h-6 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer accent-blue-600"
                                        />
                                        <span className={cn("text-[15px]", item.completed && 'line-through')}>{item.text}</span>
                                    </div>
                                    <button onClick={() => deleteItem(idx)} className="text-slate-200 hover:text-red-500 transition-colors p-1">
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </label>
                            ) : item.type === 'group' ? (
                                <div className="grid grid-cols-3 gap-6">
                                    {item.items?.map((si, sidx) => (
                                        <div key={sidx}>
                                            <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">{si.text}</label>
                                            <input
                                                type="text"
                                                value={si.value}
                                                onChange={e => handleGroupItemUpdate(idx, sidx, e.target.value)}
                                                className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-black shadow-inner outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
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
                                        className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-black shadow-inner outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            ) : null}
                        </div>
                    );
                })}
                <div className="p-6 bg-slate-50/50 flex gap-3 border-t-2 border-slate-100 px-8">
                    <input
                        type="text"
                        value={newChecklistItemText}
                        onChange={(e) => setNewChecklistItemText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addItem()}
                        placeholder="Zusätzliche Aufgabe erfassen..."
                        className="flex-1 p-3 border-2 border-slate-200 rounded-xl text-sm font-bold outline-none shadow-sm bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                    <button onClick={addItem} className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95 uppercase tracking-widest">
                        Hinzufügen
                    </button>
                </div>
            </div>
        </section>
    );
};
