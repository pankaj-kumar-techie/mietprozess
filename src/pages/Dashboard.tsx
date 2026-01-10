
import React, { useEffect, useState, useMemo } from 'react';
import { useApartmentStore } from '@/store/useApartmentStore';
import { Layout } from '@/components/dashboard/Layout';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { ApartmentList } from '@/components/dashboard/ApartmentList';
import { AddApartmentModal } from '@/components/modals/AddApartmentModal';
import { ApartmentDetailsModal } from '@/components/modals/ApartmentDetailsModal';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { shouldArchive } from '@/lib/logic';

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
    const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

    // Real-time subscription
    useEffect(() => {
        const unsubscribe = subscribeToApartments(() => { });
        return () => unsubscribe();
    }, [subscribeToApartments]);

    // FIX ISSUE C: Use useMemo for heavy filter/map/sort operations
    // This scales to 500+ items without performance lag on every re-render.
    const filteredApartments = useMemo(() => {
        return apartments.filter(a => {
            // Archive filtering
            if (!showArchived) {
                if (shouldArchive(a)) {
                    return false;
                }
            }

            const s = searchTerm.toLowerCase();
            const matchSearch = !searchTerm ||
                a.address.toLowerCase().includes(s) ||
                a.oldTenant.toLowerCase().includes(s) ||
                a.objectName.toLowerCase().includes(s) ||
                a.newTenant?.toLowerCase().includes(s);
            const matchResp = filterResponsible === 'Alle' || a.responsible === filterResponsible;
            return matchSearch && matchResp;
        }).map(a => {
            // Visual Transformation for Archive View
            if (showArchived && shouldArchive(a)) {
                return { ...a, status: 'Archiviert' as const };
            }
            return a;
        }).sort((a, b) => {
            // Global Sorting: Chronological by Kündigung per date
            if (!a.terminationDate) return 1;
            if (!b.terminationDate) return -1;
            return new Date(a.terminationDate).getTime() - new Date(b.terminationDate).getTime();
        });
    }, [apartments, showArchived, searchTerm, filterResponsible]);

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
                        if (newStatus === 'Abgeschlossen' && !ap.completedAt) {
                            updates.completedAt = new Date().toISOString();
                        }
                        updateApartment(ap.id, updates);
                    }}
                    onCardClick={(id) => setSelectedApartmentId(id)}
                    onCardDelete={(id) => setDeleteConfirmationId(id)}
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
                    onNavigate={(direction) => {
                        const currentIndex = filteredApartments.findIndex(a => a.id === selectedApartmentId);
                        if (currentIndex === -1) return;

                        let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
                        if (nextIndex >= filteredApartments.length) nextIndex = 0;
                        if (nextIndex < 0) nextIndex = filteredApartments.length - 1;

                        setSelectedApartmentId(filteredApartments[nextIndex].id);
                    }}
                />
            )}

            <ConfirmationModal
                isOpen={!!deleteConfirmationId}
                onClose={() => setDeleteConfirmationId(null)}
                onConfirm={() => {
                    if (deleteConfirmationId) {
                        deleteApartment(deleteConfirmationId);
                        setDeleteConfirmationId(null);
                    }
                }}
                title="Datensatz löschen?"
                description="Möchten Sie diesen Datensatz wirklich unwiderruflich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
                confirmText="Ja, löschen"
                variant="danger"
            />
        </Layout>
    );
};
