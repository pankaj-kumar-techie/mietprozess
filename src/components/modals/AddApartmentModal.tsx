import React, { useState } from 'react';
import { useApartmentStore } from '@/store/useApartmentStore';
import type { Apartment, ChecklistItem, Responsible, RelettingOption } from '@/types';
import { STATUS_OPTIONS, TEAM_MEMBERS, RELETTING_OPTIONS } from '@/types';

// Basic checklist schema to initialize
const DEFAULT_CHECKLIST_SCHEMA: ChecklistItem[] = [
    { type: 'header', text: 'In Kündigung' },
    { type: 'checkbox', text: 'Eigentümer informiert' },
    { type: 'checkbox', text: 'Kündigungsbestätigung verschickt' },
    { type: 'text-input', text: 'Haftbar bis' },
    { type: 'text-input', text: 'Abnahme am' },
    { type: 'spacer' },
    { type: 'header', text: 'In Vermietung' },
    {
        type: 'group', text: 'Mietzinsfelder', items: [
            { text: 'Neuer Mietzins netto', value: '' },
            { text: 'Neue Nebenkosten', value: '' },
            { text: 'Neuer Mietzins brutto', value: '' },
        ]
    },
    { type: 'spacer' },
    { type: 'checkbox', text: 'Inserat erstellen' },
    { type: 'checkbox', text: 'Besichtigungen durchführen' },
    { type: 'checkbox', text: 'Prüfen Referenzen, OK von Eigentümer' },
    { type: 'checkbox', text: 'Mietvertrag inkl. Beilagen und Kaution verschickt' },
    { type: 'checkbox', text: 'Mietvertrag unterzeichnet retour' },
    { type: 'checkbox', text: 'Inserat archiviert bzw. bei Flatfox "entfernt"' },
    { type: 'spacer' },
    { type: 'header', text: 'Mietvertrag erstellt' },
    { type: 'checkbox', text: 'RIMO: Mietzins definitiv setzen' },
    { type: 'checkbox', text: 'Namensschilder etc. bestellen, ggf. Hauswart, Eigentümer informieren' },
    { type: 'checkbox', text: 'Kaution bezahlt' },
    { type: 'checkbox', text: '1. Monatsmiete bezahlt' },
    { type: 'text-input', text: 'Übergabe am' },
    { type: 'spacer' },
    { type: 'header', text: 'Wohnung übergeben' },
    { type: 'checkbox', text: 'Meldungen an Ämter (Werke, Gemeinde)' },
    { type: 'checkbox', text: 'Evtl. Handwerker für Instandstellungen aufbieten' },
    { type: 'checkbox', text: 'Neues Mietvertragsdossier ablegen' },
    { type: 'checkbox', text: 'Schlussrechnung alter Mieter und Auszahlung Kaution' },
    { type: 'checkbox', text: 'Altes Mietvertragsdossier ablegen' },
];

const initializeChecklist = (): ChecklistItem[] => {
    return DEFAULT_CHECKLIST_SCHEMA.map(item => {
        if (item.type === 'group') return { ...item, items: item.items?.map(si => ({ ...si, value: '' })) };
        if (item.type === 'checkbox') return { ...item, completed: false };
        if (['text-input', 'date-input', 'number-input'].includes(item.type)) return { ...item, value: '' };
        return { ...item };
    });
};

interface AddApartmentModalProps {
    onClose: () => void;
}

export const AddApartmentModal: React.FC<AddApartmentModalProps> = ({ onClose }) => {
    const { addApartment } = useApartmentStore();
    const [formData, setFormData] = useState<Partial<Apartment>>({
        address: '',
        objectName: '',
        oldTenant: '',
        terminationDate: '',
        status: STATUS_OPTIONS[0],
        responsible: TEAM_MEMBERS[0] as Responsible,
        relettingOption: RELETTING_OPTIONS[0] as RelettingOption,
    });

    const handleSubmit = async () => {
        if (!formData.address || !formData.objectName || !formData.oldTenant || !formData.terminationDate) {
            alert("Bitte alle Felder ausfüllen"); // Use better UI later
            return;
        }

        await addApartment({
            ...formData as any,
            comments: [],
            checklist: initializeChecklist(),
            lastActivity: new Date().toISOString(),
            createdAt: new Date().toISOString()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[130] p-4 backdrop-blur-md">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-xl animate-in zoom-in duration-300 border-4 border-slate-50" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Neue Kündigung</h3>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Adresse</label>
                            <input
                                type="text"
                                placeholder="Straße, PLZ Ort"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-transparent font-black text-slate-800 text-lg outline-none"
                                autoFocus
                            />
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Objekt</label>
                            <input
                                type="text"
                                placeholder="Zimmeranzahl, Lage"
                                value={formData.objectName}
                                onChange={e => setFormData({ ...formData, objectName: e.target.value })}
                                className="w-full bg-transparent font-black text-slate-800 text-lg outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Alter Mieter</label>
                            <input
                                type="text"
                                placeholder="Vorname Nachname"
                                value={formData.oldTenant}
                                onChange={e => setFormData({ ...formData, oldTenant: e.target.value })}
                                className="w-full bg-transparent font-black text-slate-800 text-lg outline-none"
                            />
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Kündigung per</label>
                            <input
                                type="date"
                                value={formData.terminationDate}
                                onChange={e => setFormData({ ...formData, terminationDate: e.target.value })}
                                className="w-full bg-transparent font-black text-slate-800 text-lg outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Zuständigkeit</label>
                            <select
                                value={formData.responsible}
                                onChange={e => setFormData({ ...formData, responsible: e.target.value as Responsible })}
                                className="w-full bg-transparent font-black text-slate-800 text-lg outline-none cursor-pointer"
                            >
                                {TEAM_MEMBERS.map((m: string) => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Weitervermietung</label>
                            <select
                                value={formData.relettingOption}
                                onChange={e => setFormData({ ...formData, relettingOption: e.target.value as RelettingOption })}
                                className="w-full bg-transparent font-black text-slate-800 text-lg outline-none cursor-pointer"
                            >
                                {RELETTING_OPTIONS.map((o: string) => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-12">
                    <button onClick={onClose} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-3xl transition hover:bg-slate-200 uppercase tracking-widest">
                        Abbrechen
                    </button>
                    <button onClick={handleSubmit} className="flex-1 py-5 font-black text-white bg-blue-600 rounded-3xl shadow-2xl shadow-blue-200 transition active:scale-95 uppercase tracking-widest">
                        Erfassen
                    </button>
                </div>
            </div>
        </div>
    );
};
