import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { STATUS_COLORS } from '@/types';
import type { Apartment, Status } from '@/types';
import { SortableApartmentCard } from './SortableApartmentCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
    status: Status;
    apartments: Apartment[];
    onCardClick: (id: string) => void;
    onCardDelete: (id: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, apartments, onCardClick, onCardDelete }) => {
    const { setNodeRef } = useDroppable({
        id: status,
    });

    const statusColorClass = STATUS_COLORS[status] || 'bg-gray-100 border-gray-300 text-gray-700';
    // Parse colors for the indicator dot
    const dotColorClass = statusColorClass.split(' ').find(c => c.startsWith('text-'))?.replace('text-', 'bg-') || 'bg-gray-400';

    return (
        <div ref={setNodeRef} className="flex-shrink-0 w-80 flex flex-col gap-6">
            <div className="flex items-center justify-between px-4">
                <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                    <span className={cn("w-3 h-3 rounded-full shadow-sm", dotColorClass)}></span>
                    {status}
                </h3>
                <span className="bg-white border-2 border-slate-100 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
                    {apartments.length}
                </span>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto pr-3 custom-scrollbar min-h-[100px]">
                <SortableContext
                    id={status}
                    items={apartments.map(a => a.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {apartments.map((apartment) => (
                        <SortableApartmentCard
                            key={apartment.id}
                            apartment={apartment}
                            onClick={() => onCardClick(apartment.id)}
                            onDelete={(e) => {
                                e.stopPropagation();
                                onCardDelete(apartment.id);
                            }}
                        />
                    ))}
                </SortableContext>
                {apartments.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                        Leer
                    </div>
                )}
            </div>
        </div>
    );
};
