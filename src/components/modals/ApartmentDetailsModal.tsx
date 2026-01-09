import React, { useRef, useState } from 'react';
import { useApartmentStore } from '@/store/useApartmentStore';
import { useAuthStore } from '@/store/useAuthStore';
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
import { logActivity } from '@/services/userService';

interface ApartmentDetailsModalProps {
    apartmentId: string;
    onClose: () => void;
}

export const ApartmentDetailsModal: React.FC<ApartmentDetailsModalProps> = ({ apartmentId, onClose }) => {
    const { apartments, updateApartment, filterResponsible, searchTerm } = useApartmentStore();
    const user = useAuthStore(state => state.user);
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

        // Log activity
        logActivity('status_changed', {
            apartmentId: apartment.id,
            address: apartment.address,
            oldStatus: apartment.status,
            newStatus: newStatus
        });
    };

    const handlePrev = () => {
        if (hasPrev) {
            const prevApt = filtered[currentIndex - 1];
            onClose();
            setTimeout(() => window.dispatchEvent(new CustomEvent('openApartment', { detail: prevApt.id })), 50);
        }
    };

    const handleNext = () => {
        if (hasNext) {
            const nextApt = filtered[currentIndex + 1];
            onClose();
            setTimeout(() => window.dispatchEvent(new CustomEvent('openApartment', { detail: nextApt.id })), 50);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
                <div className="bg-white rounded-[3rem] w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl border-4 border-slate-100 flex flex-col" onClick={e => e.stopPropagation()}>
                    <DetailsHeader
                        apartment={apartment}
                        onClose={onClose}
                    />
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                                    onAddComment={async (text) => {
                                        const newComment = {
                                            text,
                                            timestamp: new Date().toISOString(),
                                            user: user?.displayName || user?.email || 'System',
                                            author: user?.displayName || user?.email?.split('@')[0] || 'Unknown',
                                            authorEmail: user?.email
                                        };
                                        const newComments = [...(apartment.comments || []), newComment];
                                        updateApartment(apartment.id, { comments: newComments });

                                        // Log activity
                                        await logActivity('comment_added', {
                                            apartmentId: apartment.id,
                                            address: apartment.address,
                                            comment: text
                                        });
                                    }}
                                />
                            </div>
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
