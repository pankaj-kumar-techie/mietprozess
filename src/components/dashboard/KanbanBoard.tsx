
import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import type {
    DragStartEvent,
    DragEndEvent,
    DropAnimation
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { STATUS_OPTIONS } from '@/types';
import type { Apartment, Status } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { ApartmentCard } from '@/components/feature/ApartmentCard'; // For overlay
import { isStatusComplete } from '@/lib/logic';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';

interface KanbanBoardProps {
    apartments: Apartment[];
    onStatusChange: (apartment: Apartment, newStatus: Status) => void;
    onCardClick: (id: string) => void;
    onCardDelete: (id: string) => void;
}

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ apartments, onStatusChange, onCardClick, onCardDelete }) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const addNotification = useNotificationStore(state => state.addNotification);
    const user = useAuthStore(state => state.user);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require slight movement to prevent drag on click
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = () => {
        // Only verify over logic if needed for visual placeholders, 
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeAp = apartments.find(a => a.id === active.id);

        if (!activeAp || !over) {
            setActiveId(null);
            return;
        }

        let targetStatus: Status | undefined;

        if (STATUS_OPTIONS.includes(over.id as any)) {
            targetStatus = over.id as Status;
        } else {
            const overAp = apartments.find(a => a.id === over.id);
            if (overAp) {
                targetStatus = overAp.status;
            }
        }

        if (targetStatus && targetStatus !== activeAp.status) {
            const currentIndex = STATUS_OPTIONS.indexOf(activeAp.status);
            const targetIndex = STATUS_OPTIONS.indexOf(targetStatus);

            // Rule 2 Check: Forward Move Validation
            if (targetIndex > currentIndex) {
                const currentStatusName = activeAp.status;
                const canMove = isStatusComplete(activeAp, currentStatusName);
                const isAdmin = user?.role === 'admin';

                // Admin Override Logic
                if (canMove || isAdmin) {
                    onStatusChange(activeAp, targetStatus);
                } else {
                    addNotification(`Aufgaben für "${currentStatusName}" noch nicht vollständig!`, 'error');
                    return; // Block move
                }
            } else {
                // Backward move is always allowed
                onStatusChange(activeAp, targetStatus);
            }
        }

        setActiveId(null);
    };

    const activeApartment = activeId ? apartments.find(a => a.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex-1 overflow-x-auto p-8 pt-4 flex gap-8 min-h-0 custom-scrollbar h-full">
                {STATUS_OPTIONS.map(status => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        apartments={
                            status === 'Archiviert'
                                ? apartments
                                    .filter(a => a.status === status)
                                    .sort((a, b) => (b.completedAt || b.createdAt || "").localeCompare(a.completedAt || a.createdAt || ""))
                                    .slice(0, 50)
                                : apartments.filter(a => a.status === status)
                        }
                        onCardClick={onCardClick}
                        onCardDelete={onCardDelete}
                    />
                ))}
            </div>

            {createPortal(
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeApartment ? (
                        <ApartmentCard
                            apartment={activeApartment}
                            onClick={() => { }}
                            onDelete={(e) => e.preventDefault()}
                            isDragging
                        />
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
};
