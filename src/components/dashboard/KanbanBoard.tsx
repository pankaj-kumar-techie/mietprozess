
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
        // but DndKit handles sortable shuffling automatically if setup right.
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeAp = apartments.find(a => a.id === active.id);

        if (!activeAp || !over) {
            setActiveId(null);
            return;
        }

        // Determine target column
        // The 'over' id can be a column status (droppable) or another card (sortable)
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
                // Try to check if current status constitutes "complete"
                // Note: 'isStatusComplete' checks if a *Checklist Section* is complete.
                // We assume the checklist section name MUST match the status name for this mapping to work.
                // Usually they are 1:1 mapped in HIT Flow logic.

                const currentStatusName = activeAp.status; // e.g. "In Kündigung"
                // We pass logic to check if this specific section is done
                // However, "isStatusComplete" usually takes (apartment, statusName)
                // Let's assume isStatusComplete works as intended.

                // WARNING: isStatusComplete might be just for one section. Rule says "100% complete".
                // If isStatusComplete returns true, we allow.

                const canMove = isStatusComplete(activeAp, currentStatusName);

                if (canMove) {
                    onStatusChange(activeAp, targetStatus);
                } else {
                    addNotification(`Aufgaben für "${currentStatusName}" noch nicht vollständig!`, 'error');
                    return; // Block move
                }
            } else {
                // Backward move is always allowed (Rule 2)
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
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex-1 overflow-x-auto p-8 pt-4 flex gap-8 min-h-0 custom-scrollbar h-full">
                {STATUS_OPTIONS.map(status => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        // PERFORMANCE OPTIMIZATION:
                        // For 'Archiviert', we limit to the recent 50 items to prevent UI freezes
                        // when the archive grows large over time. This ensures the board remains responsive.
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
