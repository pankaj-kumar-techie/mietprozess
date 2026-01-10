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
    return format(new Date(dateStr), 'dd.MM.yyyy');
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
                "bg-white p-4 sm:p-5 rounded-[2rem] border-2 border-slate-50 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all group active:scale-[0.98] relative overflow-hidden cursor-pointer",
                isDragging && "opacity-50 rotate-2 scale-105 shadow-2xl z-50"
            )}
        >
            {/* Header Indicators */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                {apartment.comments?.length > 0 && (
                    <div className="bg-indigo-50 text-indigo-500 p-1.5 rounded-xl flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span className="text-[10px] font-black">{apartment.comments.length}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 px-2.5 rounded-xl border border-slate-100">
                    <Clock className={cn("w-3 h-3", activityColor)} />
                    <span className={cn("text-[10px] font-black", activityColor)}>{days}d</span>
                </div>
            </div>

            {/* Address & Info */}
            <div className="mb-4">
                <h4 className="font-black text-slate-800 group-hover:text-blue-600 transition truncate text-sm sm:text-base max-w-[75%] tracking-tight mb-0.5">
                    {apartment.address}
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-400 font-bold truncate tracking-tight">
                    {apartment.objectName}
                </p>
            </div>

            {/* Tenant Data Grid */}
            <div className="space-y-2">
                <div className="flex gap-2">
                    <div className="flex-1 bg-red-50/50 p-2 rounded-2xl border border-red-100/50 truncate text-center shadow-inner">
                        <span className="text-[10px] font-black text-red-700 tracking-tight uppercase block opacity-40 mb-0.5">Auszug</span>
                        <span className="text-[11px] font-black text-red-800 truncate">{apartment.oldTenant}</span>
                    </div>
                    <div className="flex-1 bg-red-50/50 p-2 rounded-2xl border border-red-100/50 truncate text-center shadow-inner">
                        <span className="text-[10px] font-black text-red-700 tracking-tight uppercase block opacity-40 mb-0.5">Datum</span>
                        <span className="text-[11px] font-black text-red-800">{formatDate(apartment.terminationDate)}</span>
                    </div>
                </div>

                {(apartment.newTenant || apartment.rentalStart) && (
                    <div className="flex gap-2 animate-in slide-in-from-top-1 duration-300">
                        <div className="flex-1 bg-green-50/50 p-2 rounded-2xl border border-green-100/50 truncate text-center shadow-inner">
                            <span className="text-[10px] font-black text-green-700 tracking-tight uppercase block opacity-40 mb-0.5">Einzug</span>
                            <span className="text-[11px] font-black text-green-800 truncate">{apartment.newTenant || '-'}</span>
                        </div>
                        <div className="flex-1 bg-green-50/50 p-2 rounded-2xl border border-green-100/50 truncate text-center shadow-inner">
                            <span className="text-[10px] font-black text-green-700 tracking-tight uppercase block opacity-40 mb-0.5">Datum</span>
                            <span className="text-[11px] font-black text-green-800">
                                {apartment.rentalStart ? formatDate(apartment.rentalStart) : '-'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 pt-4 border-t mt-4 border-slate-50">
                <div className="flex items-center gap-2 overflow-hidden bg-slate-50 px-2 py-1 rounded-lg">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="text-[9px] font-black text-slate-500 uppercase truncate tracking-wider">{apartment.responsible}</span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(e);
                    }}
                    className="text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all p-1.5 rounded-lg active:scale-75"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const TrashIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
