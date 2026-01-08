import { TEAM_MEMBERS, STATUS_OPTIONS } from '@/types';
import type { Apartment, Responsible, Status } from '@/types';

interface StammdatenSectionProps {
    apartment: Apartment;
    onUpdate: (updates: Partial<Apartment>) => void;
}

export const StammdatenSection: React.FC<StammdatenSectionProps> = ({ apartment, onUpdate }) => {
    return (
        <div className="bg-slate-100/80 p-8 rounded-[2.5rem] border-2 border-slate-200 mb-12 shadow-inner">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-100/50 p-5 rounded-2xl border border-red-200 shadow-sm">
                            <label className="text-[10px] font-black text-red-500 uppercase mb-1 block tracking-wider">Alter Mieter</label>
                            <p className="font-black text-red-900 text-xl tracking-tight">{apartment.oldTenant}</p>
                        </div>
                        <div className="bg-red-100/50 p-5 rounded-2xl border border-red-200 shadow-sm">
                            <label className="text-[10px] font-black text-red-500 uppercase mb-1 block tracking-wider">Kündigung per</label>
                            <input
                                type="date"
                                value={apartment.terminationDate}
                                onChange={e => onUpdate({ terminationDate: e.target.value })}
                                className="w-full bg-transparent font-black text-red-900 text-xl outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top duration-500">
                        <div className="bg-green-100/50 p-5 rounded-2xl border border-green-200 shadow-sm">
                            <label className="text-[10px] font-black text-green-600 uppercase mb-1 block tracking-wider">Neuer Mieter</label>
                            <input
                                type="text"
                                placeholder="Noch offen..."
                                value={apartment.newTenant || ''}
                                onChange={e => onUpdate({ newTenant: e.target.value })}
                                className="w-full bg-transparent font-black text-green-800 text-xl outline-none placeholder-green-300"
                            />
                        </div>
                        <div className="bg-green-100/50 p-5 rounded-2xl border border-green-200 shadow-sm">
                            <label className="text-[10px] font-black text-green-600 uppercase mb-1 block tracking-wider">Mietbeginn</label>
                            <input
                                type="date"
                                value={apartment.rentalStart || ''}
                                onChange={e => onUpdate({ rentalStart: e.target.value })}
                                className="w-full bg-transparent font-black text-green-900 text-xl outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Status</label>
                        <select
                            value={apartment.status}
                            onChange={e => onUpdate({ status: e.target.value as Status })}
                            className="w-full bg-transparent font-black text-slate-800 text-xl outline-none cursor-pointer"
                        >
                            {STATUS_OPTIONS.map((s: string) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Zuständig</label>
                        <select
                            value={apartment.responsible}
                            onChange={e => onUpdate({ responsible: e.target.value as Responsible })}
                            className="w-full bg-transparent font-black text-slate-800 text-xl outline-none cursor-pointer"
                        >
                            {TEAM_MEMBERS.map((m: string) => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
