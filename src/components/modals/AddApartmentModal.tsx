import React, { useState, useEffect } from 'react';
import { useApartmentStore } from '@/store/useApartmentStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { Apartment, ChecklistItem, Responsible, RelettingOption } from '@/types';
import { STATUS_OPTIONS, RELETTING_OPTIONS } from '@/types';
import { getTeamMembers, type TeamMember } from '@/services/teamService';
import { logActivity } from '@/services/userService';
import { useNotificationStore } from '@/store/useNotificationStore';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { useTranslation } from 'react-i18next';

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
    { id: 'contract_signed', type: 'checkbox', text: 'Mietvertrag unterzeichnet retour' },
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
    const user = useAuthStore(state => state.user);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loadingTeam, setLoadingTeam] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addNotification = useNotificationStore(state => state.addNotification);
    const { t } = useTranslation();

    const [formData, setFormData] = useState<Partial<Apartment>>({
        address: '',
        objectName: '',
        oldTenant: '',
        terminationDate: '',
        status: STATUS_OPTIONS[0],
        responsible: '',
        relettingOption: RELETTING_OPTIONS[0] as RelettingOption,
    });

    useEffect(() => {
        const loadTeam = async () => {
            try {
                const members = await getTeamMembers();
                setTeamMembers(members);
                if (user && members.length > 0) {
                    const currentUserMember = members.find(m => m.email === user.email);
                    if (currentUserMember) {
                        setFormData(prev => ({ ...prev, responsible: currentUserMember.displayName as Responsible }));
                    } else if (members.length > 0) {
                        setFormData(prev => ({ ...prev, responsible: members[0].displayName as Responsible }));
                    }
                }
            } catch (error) {
                console.error('Failed to load team members:', error);
            } finally {
                setLoadingTeam(false);
            }
        };
        loadTeam();
    }, [user]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.address?.trim()) newErrors.address = 'Adresse ist erforderlich';
        if (!formData.objectName?.trim()) newErrors.objectName = 'Objekt ist erforderlich';
        if (!formData.oldTenant?.trim()) newErrors.oldTenant = 'Alter Mieter ist erforderlich';
        if (!formData.terminationDate) newErrors.terminationDate = 'Kündigungsdatum ist erforderlich';
        if (!formData.responsible) newErrors.responsible = 'Zuständigkeit ist erforderlich';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const newApartment: Apartment = {
                ...formData as any,
                comments: [],
                checklist: initializeChecklist(),
                lastActivity: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                createdBy: user?.email || 'system'
            };

            await addApartment(newApartment);

            await logActivity('apartment_created', {
                address: formData.address,
                responsible: formData.responsible,
                createdBy: user?.displayName || user?.email
            });

            addNotification('Datensatz erfolgreich erstellt!', 'success');
            onClose();
        } catch (error) {
            console.error('Submit failed:', error);
            addNotification('Fehler beim Erstellen des Datensatzes', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[130] p-4 backdrop-blur-md" onClick={onClose}>
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-xl animate-in zoom-in duration-300 border-4 border-slate-50" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg text-lg font-bold">
                        +
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Neue Kündigung</h3>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Adresse *</label>
                            <input
                                type="text"
                                placeholder="Straße, PLZ Ort"
                                value={formData.address}
                                onChange={e => { setFormData({ ...formData, address: e.target.value }); setErrors({ ...errors, address: '' }); }}
                                className={`w-full bg-transparent font-black text-slate-800 text-lg outline-none ${errors.address ? 'text-red-600' : ''}`}
                                autoFocus
                            />
                            {errors.address && <p className="text-red-600 text-xs font-bold mt-1">{errors.address}</p>}
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Objekt *</label>
                            <input
                                type="text"
                                placeholder="Zimmeranzahl, Lage"
                                value={formData.objectName}
                                onChange={e => { setFormData({ ...formData, objectName: e.target.value }); setErrors({ ...errors, objectName: '' }); }}
                                className={`w-full bg-transparent font-black text-slate-800 text-lg outline-none ${errors.objectName ? 'text-red-600' : ''}`}
                            />
                            {errors.objectName && <p className="text-red-600 text-xs font-bold mt-1">{errors.objectName}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Alter Mieter *</label>
                            <input
                                type="text"
                                placeholder="Vorname Nachname"
                                value={formData.oldTenant}
                                onChange={e => { setFormData({ ...formData, oldTenant: e.target.value }); setErrors({ ...errors, oldTenant: '' }); }}
                                className={`w-full bg-transparent font-black text-slate-800 text-lg outline-none ${errors.oldTenant ? 'text-red-600' : ''}`}
                            />
                            {errors.oldTenant && <p className="text-red-600 text-xs font-bold mt-1">{errors.oldTenant}</p>}
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Kündigung per *</label>
                            <input
                                type="date"
                                value={formData.terminationDate}
                                onChange={e => { setFormData({ ...formData, terminationDate: e.target.value }); setErrors({ ...errors, terminationDate: '' }); }}
                                className={`w-full bg-transparent font-black text-slate-800 text-lg outline-none ${errors.terminationDate ? 'text-red-600' : ''}`}
                            />
                            {errors.terminationDate && <p className="text-red-600 text-xs font-bold mt-1">{errors.terminationDate}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">
                                {t('apartment.responsible', 'Zuständigkeit')} * {loadingTeam && `(${t('actions.loading', 'Laden...')})`}
                            </label>
                            <CustomSelect
                                value={formData.responsible || ''}
                                onChange={val => { setFormData({ ...formData, responsible: val as Responsible }); setErrors({ ...errors, responsible: '' }); }}
                                options={[
                                    { value: '', label: t('actions.please_select', 'Bitte wählen') },
                                    ...teamMembers.map(m => ({ value: m.displayName, label: m.displayName }))
                                ]}
                                disabled={loadingTeam}
                                className="w-full"
                            />
                            {errors.responsible && <p className="text-red-600 text-xs font-bold mt-1">{errors.responsible}</p>}
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">
                                {t('apartment.reletting', 'Weitervermietung')}
                            </label>
                            <CustomSelect
                                value={formData.relettingOption || ''}
                                onChange={val => setFormData({ ...formData, relettingOption: val as RelettingOption })}
                                options={RELETTING_OPTIONS.map(o => ({ value: o, label: o }))}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-12">
                    <button disabled={isSubmitting} onClick={onClose} className="flex-1 py-5 font-black text-slate-500 bg-slate-100 rounded-3xl transition hover:bg-slate-200 uppercase tracking-widest disabled:opacity-50">
                        Abbrechen
                    </button>
                    <button disabled={isSubmitting} onClick={handleSubmit} className="flex-1 py-5 font-black text-white bg-blue-600 rounded-3xl shadow-2xl shadow-blue-200 transition active:scale-95 uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Erfasse...
                            </>
                        ) : 'Erfassen'}
                    </button>
                </div>
            </div>
        </div>
    );
};
