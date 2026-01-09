import { STATUS_OPTIONS } from '@/types';
import { getTeamMembers, type TeamMember } from '@/services/teamService';
import { useState, useEffect } from 'react';
import type { Apartment, Responsible, Status } from '@/types';

interface StammdatenSectionProps {
    apartment: Apartment;
    onUpdate: (updates: Partial<Apartment>) => void;
}

export const StammdatenSection: React.FC<StammdatenSectionProps> = ({ apartment, onUpdate }) => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loadingTeam, setLoadingTeam] = useState(true);

    useEffect(() => {
        const loadTeam = async () => {
            try {
                const members = await getTeamMembers();
                setTeamMembers(members);
            } catch (error) {
                console.error('Failed to load team members:', error);
            } finally {
                setLoadingTeam(false);
            }
        };
        loadTeam();
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Adresse</label>
                    <input
                        type="text"
                        value={apartment.address}
                        onChange={e => onUpdate({ address: e.target.value })}
                        className="w-full bg-transparent font-black text-slate-800 text-xl outline-none"
                    />
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Objekt</label>
                    <input
                        type="text"
                        value={apartment.objectName}
                        onChange={e => onUpdate({ objectName: e.target.value })}
                        className="w-full bg-transparent font-black text-slate-800 text-xl outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Alter Mieter</label>
                    <input
                        type="text"
                        value={apartment.oldTenant}
                        onChange={e => onUpdate({ oldTenant: e.target.value })}
                        className="w-full bg-transparent font-black text-slate-800 text-xl outline-none"
                    />
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Kündigungsdatum</label>
                    <input
                        type="date"
                        value={apartment.terminationDate}
                        onChange={e => onUpdate({ terminationDate: e.target.value })}
                        className="w-full bg-transparent font-black text-slate-800 text-xl outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">
                        Zuständig {loadingTeam && '(Laden...)'}
                    </label>
                    <select
                        value={apartment.responsible}
                        onChange={e => onUpdate({ responsible: e.target.value as Responsible })}
                        className="w-full bg-transparent font-black text-slate-800 text-xl outline-none cursor-pointer"
                        disabled={loadingTeam}
                    >
                        {teamMembers.length === 0 && !loadingTeam && (
                            <option value="">Keine Benutzer verfügbar</option>
                        )}
                        {teamMembers.map((member) => (
                            <option key={member.id} value={member.displayName}>
                                {member.displayName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
