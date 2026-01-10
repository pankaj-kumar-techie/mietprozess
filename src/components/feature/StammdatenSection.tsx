
import React, { useState, useEffect } from 'react';
import { STATUS_OPTIONS } from '@/types';
import { getTeamMembers, type TeamMember } from '@/services/teamService';
import type { Apartment, Responsible, Status } from '@/types';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StammdatenSectionProps {
    apartment: Apartment;
    onUpdate: (updates: Partial<Apartment>) => void;
}

export const StammdatenSection: React.FC<StammdatenSectionProps> = ({ apartment, onUpdate }) => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loadingTeam, setLoadingTeam] = useState(true);

    // Local state for the form
    const [formData, setFormData] = useState({
        address: apartment.address,
        objectName: apartment.objectName,
        oldTenant: apartment.oldTenant,
        terminationDate: apartment.terminationDate,
        status: apartment.status,
        responsible: apartment.responsible
    });

    // Sync with prop if it changes (e.g. from outside update)
    useEffect(() => {
        setFormData({
            address: apartment.address,
            objectName: apartment.objectName,
            oldTenant: apartment.oldTenant,
            terminationDate: apartment.terminationDate,
            status: apartment.status,
            responsible: apartment.responsible
        });
    }, [apartment.id, apartment.address, apartment.objectName, apartment.oldTenant, apartment.terminationDate, apartment.status, apartment.responsible]);

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

    const hasChanges =
        formData.address !== apartment.address ||
        formData.objectName !== apartment.objectName ||
        formData.oldTenant !== apartment.oldTenant ||
        formData.terminationDate !== apartment.terminationDate ||
        formData.status !== apartment.status ||
        formData.responsible !== apartment.responsible;

    const handleSave = () => {
        if (!hasChanges) return;
        onUpdate(formData);
    };

    return (
        <div className="space-y-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-100 shadow-sm transition-all focus-within:border-blue-200 focus-within:bg-white group">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest group-focus-within:text-blue-500">Adresse</label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full bg-transparent font-black text-slate-800 text-sm outline-none placeholder:text-slate-300"
                        placeholder="Straße, Nr., PLZ"
                    />
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-100 shadow-sm transition-all focus-within:border-blue-200 focus-within:bg-white group">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest group-focus-within:text-blue-500">Objekt</label>
                    <input
                        type="text"
                        value={formData.objectName}
                        onChange={e => setFormData(prev => ({ ...prev, objectName: e.target.value }))}
                        className="w-full bg-transparent font-black text-slate-800 text-sm outline-none placeholder:text-slate-300"
                        placeholder="z.B. 3.5 Zimmer"
                    />
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-100 shadow-sm transition-all focus-within:border-blue-200 focus-within:bg-white group">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest group-focus-within:text-blue-500">Alter Mieter</label>
                    <input
                        type="text"
                        value={formData.oldTenant}
                        onChange={e => setFormData(prev => ({ ...prev, oldTenant: e.target.value }))}
                        className="w-full bg-transparent font-black text-slate-800 text-sm outline-none placeholder:text-slate-300"
                        placeholder="Name des Mieters"
                    />
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-100 shadow-sm transition-all focus-within:border-blue-200 focus-within:bg-white group">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest group-focus-within:text-blue-500">Kündigungsdatum</label>
                    <input
                        type="date"
                        value={formData.terminationDate}
                        onChange={e => setFormData(prev => ({ ...prev, terminationDate: e.target.value }))}
                        className="w-full bg-transparent font-black text-slate-800 text-sm outline-none cursor-pointer"
                    />
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-100 shadow-sm transition-all focus-within:border-blue-200 focus-within:bg-white group">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest group-focus-within:text-blue-500">Status</label>
                    <select
                        value={formData.status}
                        onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as Status }))}
                        className="w-full bg-transparent font-black text-slate-800 text-sm outline-none cursor-pointer"
                    >
                        {STATUS_OPTIONS.map((s: string) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-100 shadow-sm transition-all focus-within:border-blue-200 focus-within:bg-white group">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest group-focus-within:text-blue-500">
                        Zuständig {loadingTeam && '(Laden...)'}
                    </label>
                    <select
                        value={formData.responsible}
                        onChange={e => setFormData(prev => ({ ...prev, responsible: e.target.value as Responsible }))}
                        className="w-full bg-transparent font-black text-slate-800 text-sm outline-none cursor-pointer"
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

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={cn(
                        "flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-200/50",
                        hasChanges
                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-300"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    )}
                >
                    <Save className="w-4 h-4" />
                    Stammdaten aktualisieren
                </button>
            </div>
        </div>
    );
};
