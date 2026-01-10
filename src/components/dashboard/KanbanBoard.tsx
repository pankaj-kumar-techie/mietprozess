
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
import { ApartmentCard } from '@/components/feature/ApartmentCard';
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
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
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

            if (targetIndex > currentIndex) {
                const currentStatusName = activeAp.status;
                const canMove = isStatusComplete(activeAp, currentStatusName);
                const isAdmin = user?.role === 'admin';

                if (canMove || isAdmin) {
                    onStatusChange(activeAp, targetStatus);
                } else {
                    addNotification(`Aufgaben für "${currentStatusName}" noch nicht vollständig!`, 'error');
                    return;
                }
            } else {
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
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-8 pt-2 sm:pt-4 flex gap-4 sm:gap-8 min-h-0 custom-scrollbar h-full bg-slate-50/50">
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
                        <div className="scale-105 rotate-2 shadow-2xl opacity-90 cursor-grabbing">
                            <ApartmentCard
                                apartment={activeApartment}
                                onClick={() => { }}
                                onDelete={(e) => e.preventDefault()}
                                isDragging
                            />
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
};
