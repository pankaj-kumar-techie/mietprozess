
import React, { useEffect, useState } from 'react';
import { useApartmentStore } from '@/store/useApartmentStore';
import { Layout } from '@/components/dashboard/Layout';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { ApartmentList } from '@/components/dashboard/ApartmentList';

// Placeholder modals - will be implemented next
import { AddApartmentModal } from '@/components/modals/AddApartmentModal';
import { ApartmentDetailsModal } from '@/components/modals/ApartmentDetailsModal';

export const Dashboard: React.FC = () => {
    const {
        apartments,
        subscribeToApartments,
        filterResponsible,
        searchTerm,
        updateApartment,
        deleteApartment
    } = useApartmentStore();

    const [currentView, setCurrentView] = useState<'kanban' | 'list'>('kanban');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(null);
    const [showArchived, setShowArchived] = useState(false);

    // Real-time subscription - updates automatically without refresh!
    useEffect(() => {
        const unsubscribe = subscribeToApartments(() => {
            // Data automatically updated in store
        });
        return () => unsubscribe();
    }, [subscribeToApartments]);

    // Filter apartments
    const filteredApartments = apartments.filter(a => {
        // Archive filtering
        if (!showArchived) {
            // Check if apartment should be archived (30 days after completion)
            if (a.completedAt) {
                const completedDate = new Date(a.completedAt);
                const now = new Date();
                const daysSinceCompleted = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
                if (daysSinceCompleted >= 30) {
                    return false; // Hide archived apartments
                }
            }
        }

        // Search and responsibility filtering
        const s = searchTerm.toLowerCase();
        const matchSearch = !searchTerm ||
            a.address.toLowerCase().includes(s) ||
            a.oldTenant.toLowerCase().includes(s) ||
            a.objectName.toLowerCase().includes(s) ||
            a.newTenant?.toLowerCase().includes(s);
        const matchResp = filterResponsible === 'Alle' || a.responsible === filterResponsible;
        return matchSearch && matchResp;
    });

    return (
        <Layout onNewTermination={() => setShowAddModal(true)}>
            <FilterBar
                currentView={currentView}
                onViewChange={setCurrentView}
                showArchived={showArchived}
                onToggleArchived={() => setShowArchived(!showArchived)}
            />

            {currentView === 'kanban' ? (
                <KanbanBoard
                    apartments={filteredApartments}
                    onStatusChange={(ap, newStatus) => {
                        const updates: any = { status: newStatus };
                        // Rule 1: Set completedAt when moving to 'abgeschlossen'
                        if (newStatus === 'abgeschlossen' && !ap.completedAt) {
                            updates.completedAt = new Date().toISOString();
                        }
                        updateApartment(ap.id, updates);
                    }}
                    onCardClick={(id) => setSelectedApartmentId(id)}
                    onCardDelete={(id) => deleteApartment(id)}
                />
            ) : (
                <ApartmentList
                    onCardClick={(id) => setSelectedApartmentId(id)}
                />
            )}

            {/* Modals */}
            {showAddModal && <AddApartmentModal onClose={() => setShowAddModal(false)} />}

            {selectedApartmentId && (
                <ApartmentDetailsModal
                    apartmentId={selectedApartmentId}
                    onClose={() => setSelectedApartmentId(null)}
                />
            )}
        </Layout>
    );
};
