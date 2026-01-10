
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { MessageSquare, Clock, User } from "lucide-react";
import type { Apartment } from "@/types";
import { cn } from "@/lib/utils";

interface ApartmentCardProps {
    apartment: Apartment;
    onClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
    isDragging?: boolean;
}

const getActivityColor = (days: number) => {
    if (days >= 15) return 'text-red-500';
    if (days >= 7) return 'text-yellow-600';
    return 'text-slate-400';
};

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'dd.MM');
};

const getDaysSince = (isoString?: string) => {
    if (!isoString) return 0;
    return differenceInDays(new Date(), new Date(isoString));
};

export const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onClick, onDelete, isDragging }) => {
    const days = getDaysSince(apartment.lastActivity);
    const activityColor = getActivityColor(days);

    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white p-3 rounded-[1.25rem] border-2 border-slate-50 shadow-sm hover:border-blue-200 transition-all group active:scale-[0.98] relative overflow-hidden cursor-pointer",
                isDragging && "opacity-50 rotate-2 scale-105 shadow-2xl z-50"
            )}
        >
            {/* Header Indicators */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                {apartment.comments?.length > 0 && (
                    <div className="bg-indigo-50 text-indigo-500 p-0.5 px-1.5 rounded-lg flex items-center gap-1">
                        <MessageSquare className="w-2 hs-2" />
                        <span className="text-[8px] font-black">{apartment.comments.length}</span>
                    </div>
                )}
                <div className="flex items-center gap-1 bg-slate-50 p-0.5 px-1.5 rounded-lg border border-slate-100">
                    <Clock className={cn("w-2 h-2", activityColor)} />
                    <span className={cn("text-[8px] font-black", activityColor)}>{days}d</span>
                </div>
            </div>

            {/* Address & Info */}
            <div className="mb-2">
                <h4 className="font-black text-slate-800 group-hover:text-blue-600 transition truncate text-[13px] tracking-tight mb-0.5 max-w-[70%]">
                    {apartment.address}
                </h4>
                <p className="text-[8px] text-slate-400 font-bold truncate tracking-tight uppercase">
                    {apartment.objectName}
                </p>
            </div>

            {/* Tenant Data Grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                <div className="bg-red-50/40 p-1 rounded-xl border border-red-100/30 truncate text-center">
                    <span className="text-[7px] font-black text-red-700 uppercase block opacity-40 leading-none mb-0.5">Auszug</span>
                    <span className="text-[9px] font-black text-red-800 truncate block leading-none">{formatDate(apartment.terminationDate)}</span>
                </div>
                {apartment.rentalStart ? (
                    <div className="bg-green-50/40 p-1 rounded-xl border border-green-100/30 truncate text-center">
                        <span className="text-[7px] font-black text-green-700 uppercase block opacity-40 leading-none mb-0.5">Einzug</span>
                        <span className="text-[9px] font-black text-green-800 truncate block leading-none">{formatDate(apartment.rentalStart)}</span>
                    </div>
                ) : (
                    <div className="bg-slate-50 p-1 rounded-xl border border-slate-100/50 truncate text-center">
                        <span className="text-[7px] font-black text-slate-400 uppercase block opacity-40 leading-none mb-0.5">Status</span>
                        <span className="text-[9px] font-black text-slate-300 italic block leading-none">Offen</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-50">
                <div className="flex items-center gap-1.5 overflow-hidden bg-slate-50/80 px-2 py-1 rounded-lg border border-slate-100">
                    <User className="w-2.5 h-2.5 text-slate-400" />
                    <span className="text-[8px] font-black text-slate-500 uppercase truncate tracking-wider">
                        {apartment.responsible?.split(' ')[0]}
                    </span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(e);
                    }}
                    className="text-slate-100 hover:text-red-500 hover:bg-red-50 transition-all p-1 rounded-lg active:scale-75"
                >
                    <TrashIcon className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

const TrashIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
