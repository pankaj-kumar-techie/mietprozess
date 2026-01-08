import React, { useRef, useState } from 'react';
import { useApartmentStore } from '@/store/useApartmentStore';
import { STATUS_COLORS, STATUS_OPTIONS } from '@/types';
import type { Status } from '@/types';
import { NewTenantPopup } from '@/components/modals/NewTenantPopup';
import { DetailsHeader } from '@/components/feature/DetailsHeader';
import { StammdatenSection } from '@/components/feature/StammdatenSection';
import { ChecklistSection } from '@/components/feature/ChecklistSection';
import { CommentsSection } from '@/components/feature/CommentsSection';
import { isStatusComplete } from '@/lib/logic';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApartmentDetailsModalProps {
    apartmentId: string;
    onClose: () => void;
}

export const ApartmentDetailsModal: React.FC<ApartmentDetailsModalProps> = ({ apartmentId, onClose }) => {
    const { apartments, updateApartment, filterResponsible, searchTerm } = useApartmentStore();
    const apartment = apartments.find(a => a.id === apartmentId);
    const [showTenantPopup, setShowTenantPopup] = useState(false);
    const commentsRef = useRef<HTMLElement>(null);

    if (!apartment) return null;

    // Navigation Logic (finding prev/next based on current filters)
    const filtered = apartments.filter(a => {
        const s = searchTerm.toLowerCase();
        const matchSearch = !searchTerm ||
            a.address.toLowerCase().includes(s) ||
            a.oldTenant.toLowerCase().includes(s) ||
            a.objectName.toLowerCase().includes(s) ||
            a.newTenant?.toLowerCase().includes(s);
        const matchResp = filterResponsible === 'Alle' || a.responsible === filterResponsible;
        return matchSearch && matchResp;
    });

    const currentIndex = filtered.findIndex(a => a.id === apartmentId);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < filtered.length - 1;



    const handleStatusChange = (newStatus: Status) => {
        // Check gating
        const currIdx = STATUS_OPTIONS.indexOf(apartment.status);
        const newIdx = STATUS_OPTIONS.indexOf(newStatus);
        if (newIdx > currIdx && !isStatusComplete(apartment, apartment.status)) {
            alert(`Bevor Sie zum Status "${newStatus}" wechseln können, müssen erst alle Aufgaben unter "${apartment.status}" erledigt sein.`);
            return;
        }
        updateApartment(apartment.id, { status: newStatus });
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm" onClick={onClose}>

                {/* Navigation Buttons (Visual only until wired up) */}
                {hasPrev && (
                    <button className="fixed left-6 md:left-12 top-1/2 -translate-y-1/2 w-16 h-16 bg-white shadow-2xl text-blue-600 rounded-full transition-all z-[110] hover:scale-110 active:scale-90 border border-slate-100 flex items-center justify-center group" onClick={(e) => { e.stopPropagation(); /* TODO: Wiring */ }}>
                        <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
                    </button>
                )}
                {hasNext && (
                    <button className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 w-16 h-16 bg-white shadow-2xl text-blue-600 rounded-full transition-all z-[110] hover:scale-110 active:scale-90 border border-slate-100 flex items-center justify-center group" onClick={(e) => { e.stopPropagation(); /* TODO: Wiring */ }}>
                        <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                    </button>
                )}

                <div className={cn("bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl h-full max-h-[92vh] overflow-y-auto border-t-[12px] animate-in slide-in-from-bottom duration-300", STATUS_COLORS[apartment.status]?.split(' ')[1] || 'border-gray-200')} onClick={e => e.stopPropagation()}>

                    <DetailsHeader
                        apartment={apartment}
                        onClose={onClose}
                        onScrollToComments={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    />

                    <div className="p-4 md:p-10">
                        <StammdatenSection
                            apartment={apartment}
                            onUpdate={(updates) => {
                                if (updates.status) handleStatusChange(updates.status as Status);
                                else updateApartment(apartment.id, updates);
                            }}
                        />

                        {/* Separator */}
                        <div className="flex items-center gap-6 mb-12">
                            <div className="h-1 bg-slate-200 flex-1 rounded-full"></div>
                            <span className="font-black text-slate-400 uppercase tracking-[0.5em] text-[10px] whitespace-nowrap">Prozess-Abwicklung</span>
                            <div className="h-1 bg-slate-200 flex-1 rounded-full"></div>
                        </div>

                        <ChecklistSection
                            apartment={apartment}
                            onUpdateChecklist={(list) => updateApartment(apartment.id, { checklist: list })}
                            onTriggerTenantPopup={() => setShowTenantPopup(true)}
                        />

                        <div ref={commentsRef as any}>
                            <CommentsSection
                                apartment={apartment}
                                onAddComment={(text) => {
                                    const newComments = [...(apartment.comments || []), { text, timestamp: new Date().toISOString(), user: 'System' }];
                                    updateApartment(apartment.id, { comments: newComments });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <NewTenantPopup
                show={showTenantPopup}
                onCancel={() => setShowTenantPopup(false)}
                initialName={apartment.newTenant}
                initialDate={apartment.rentalStart}
                onSave={(name, date) => {
                    updateApartment(apartment.id, { newTenant: name, rentalStart: date });
                    setShowTenantPopup(false);
                }}
            />
        </>
    );
};
