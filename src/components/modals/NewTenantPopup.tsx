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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4 backdrop-blur-md" onClick={onCancel}>
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border-4 border-blue-600 animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Neuvermietung</h3>
                <p className="text-slate-500 text-sm mb-8 font-medium italic">Bitte Name und Mietbeginn zwingend erfassen.</p>

                <div className="space-y-4 mb-10">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Name des neuen Mieters</label>
                        <input
                            type="text"
                            autoFocus
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Vorname Nachname"
                            className="w-full bg-transparent font-black text-gray-800 text-lg outline-none"
                        />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Mietbeginn</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full bg-transparent font-black text-gray-800 text-lg outline-none"
                        />
                    </div>
                </div>

                <button
                    onClick={() => name.trim() && date && onSave(name, date)}
                    disabled={!name.trim() || !date}
                    className="w-full py-5 rounded-2xl font-black text-white bg-blue-600 shadow-xl disabled:bg-slate-300 transition active:scale-95 uppercase tracking-widest"
                >
                    Speichern & Fortfahren
                </button>
            </div>
        </div>
    );
};
