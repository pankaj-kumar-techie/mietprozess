
import React, { useState, useEffect } from 'react';

interface NewTenantPopupProps {
    show: boolean;
    onSave: (name: string, date: string) => void;
    initialName?: string;
    initialDate?: string;
    onCancel?: () => void;
}

export const NewTenantPopup: React.FC<NewTenantPopupProps> = ({ show, onSave, initialName, initialDate, onCancel }) => {
    const [name, setName] = useState(initialName || '');
    const [date, setDate] = useState(initialDate || '');

    useEffect(() => {
        if (show) {
            setName(initialName || '');
            setDate(initialDate || '');
        }
    }, [show, initialName, initialDate]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] p-4 backdrop-blur-sm" onClick={onCancel}>
            <div className="bg-white rounded-[2rem] shadow-2xl p-7 w-full max-w-sm border-4 border-blue-600 animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-black text-slate-800 mb-1 uppercase tracking-tight">Neuvermietung</h3>
                <p className="text-slate-400 text-[11px] mb-6 font-bold uppercase tracking-wide">Name und Mietbeginn sind erforderlich.</p>

                <div className="space-y-3 mb-8">
                    <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-100 focus-within:border-blue-200 transition-all">
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-0.5 block tracking-widest leading-none">Name des Mieters</label>
                        <input
                            type="text"
                            autoFocus
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Vorname Nachname"
                            className="w-full bg-transparent font-black text-slate-800 text-sm outline-none placeholder:text-slate-200"
                        />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-100 focus-within:border-blue-200 transition-all">
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-0.5 block tracking-widest leading-none">Mietbeginn</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full bg-transparent font-black text-slate-800 text-sm outline-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3.5 rounded-xl font-black text-slate-400 bg-slate-100 hover:bg-slate-200 transition active:scale-95 uppercase tracking-widest text-[11px]"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={() => name.trim() && date && onSave(name, date)}
                        disabled={!name.trim() || !date}
                        className="flex-[2] py-3.5 rounded-xl font-black text-white bg-blue-600 shadow-lg shadow-blue-100 disabled:bg-slate-200 disabled:shadow-none transition active:scale-95 uppercase tracking-widest text-[11px]"
                    >
                        Speichern
                    </button>
                </div>
            </div>
        </div>
    );
};
