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
        fetchApartments,
        filterResponsible,
        searchTerm,
        updateApartment,
        deleteApartment
    } = useApartmentStore();

    const [currentView, setCurrentView] = useState<'kanban' | 'list'>('kanban');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(null);

    useEffect(() => {
        fetchApartments();
    }, [fetchApartments]);

    // Filter apartments for Kanban (List handles its own filtering inside because of table sort complexity, 
    // or we can lift it up. For Kanban we MUST filter pass-down)
    const filteredApartments = apartments.filter(a => {
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
            <FilterBar currentView={currentView} onViewChange={setCurrentView} />

            {currentView === 'kanban' ? (
                <KanbanBoard
                    apartments={filteredApartments}
                    onStatusChange={(ap, newStatus) => updateApartment(ap.id, { status: newStatus })}
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
