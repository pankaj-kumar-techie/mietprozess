import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ApartmentCard } from '@/components/feature/ApartmentCard';
import type { Apartment } from '@/types';

interface SortableApartmentCardProps {
    apartment: Apartment;
    onClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
}

export const SortableApartmentCard: React.FC<SortableApartmentCardProps> = ({ apartment, onClick, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: apartment.id, data: { apartment } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <ApartmentCard
                apartment={apartment}
                onClick={onClick}
                onDelete={onDelete}
                isDragging={isDragging}
            />
        </div>
    );
};
