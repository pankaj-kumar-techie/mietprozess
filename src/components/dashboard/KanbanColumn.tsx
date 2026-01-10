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
    const dotColorClass = statusColorClass.split(' ').find(c => c.startsWith('text-'))?.replace('text-', 'bg-') || 'bg-gray-400';

    return (
        <div ref={setNodeRef} className="flex-shrink-0 w-[280px] sm:w-[320px] flex flex-col h-full">
            <div className="flex items-center justify-between px-2 mb-6">
                <div className="flex items-center gap-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full shadow-inner", dotColorClass)}></div>
                    <h3 className="text-[11px] sm:text-[13px] font-black text-slate-800 uppercase tracking-[0.1em] whitespace-nowrap">
                        {status}
                    </h3>
                </div>
                <div className="bg-white border-2 border-slate-100 text-slate-700 text-[10px] font-black px-2.5 py-1 rounded-xl shadow-sm">
                    {apartments.length}
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar min-h-0">
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
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] bg-white group hover:border-blue-200 transition-all">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                            <PlusIcon className="w-4 h-4" />
                        </div>
                        Leer
                    </div>
                )}
            </div>
        </div>
    );
};

const PlusIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);
