
import React, { useRef, useState } from 'react';
import { useApartmentStore } from '@/store/useApartmentStore';
import { useAuthStore } from '@/store/useAuthStore';
import { STATUS_OPTIONS, type Status, type Apartment } from '@/types';
import { NewTenantPopup } from '@/components/modals/NewTenantPopup';
import { DetailsHeader } from '@/components/feature/DetailsHeader';
import { StammdatenSection } from '@/components/feature/StammdatenSection';
import { ChecklistSection } from '@/components/feature/ChecklistSection';
import { CommentsSection } from '@/components/feature/CommentsSection';
import { isStatusComplete } from '@/lib/logic';
import { logActivity } from '@/services/userService';
import { useNotificationStore } from '@/store/useNotificationStore';

interface ApartmentDetailsModalProps {
    apartmentId: string;
    onClose: () => void;
    onNavigate?: (direction: 'next' | 'prev') => void;
}

export const ApartmentDetailsModal: React.FC<ApartmentDetailsModalProps> = ({ apartmentId, onClose, onNavigate }) => {
    const { apartments, updateApartment } = useApartmentStore();
    const user = useAuthStore(state => state.user);
    const apartment = apartments.find(a => a.id === apartmentId);
    const [showTenantPopup, setShowTenantPopup] = useState(false);
    const commentsRef = useRef<HTMLElement>(null);
    const addNotification = useNotificationStore(state => state.addNotification);

    if (!apartment) return null;

    const handleStatusChange = (newStatus: Status) => {
        // Check gating
        const currIdx = STATUS_OPTIONS.indexOf(apartment.status);
        const newIdx = STATUS_OPTIONS.indexOf(newStatus);
        if (newIdx > currIdx && !isStatusComplete(apartment, apartment.status)) {
            alert(`Bevor Sie zum Status "${newStatus}" wechseln können, müssen erst alle Aufgaben unter "${apartment.status}" erledigt sein.`);
            return;
        }

        const updates: Partial<Apartment> = { status: newStatus };

        // Track when apartment is completed
        if (newStatus === 'Abgeschlossen' && !apartment.completedAt) {
            updates.completedAt = new Date().toISOString();
        }

        updateApartment(apartment.id, updates);

        // Log activity
        logActivity('status_changed', {
            apartmentId: apartment.id,
            address: apartment.address,
            oldStatus: apartment.status,
            newStatus: newStatus
        });
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
                                onAutoStatusChange={(newStatus) => {
                                    handleStatusChange(newStatus as Status);
                                    addNotification(`Status automatisch auf "${newStatus}" fortgeschritten`, 'success');
                                }}
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

                {/* Fast Navigation Arrows */}
                {onNavigate && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
                            className="fixed left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 group"
                        >
                            <svg className="w-8 h-8 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
                            className="fixed right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 group"
                        >
                            <svg className="w-8 h-8 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </>
                )}
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
