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
    if (days >= 15) return 'text-red-600';
    if (days >= 7) return 'text-yellow-600';
    return 'text-black';
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
                "bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group active:scale-[0.98] relative overflow-hidden cursor-pointer",
                isDragging && "opacity-50 rotate-3 scale-105 shadow-2xl"
            )}
        >
            <div className="absolute top-4 right-4 flex items-center gap-3">
                {apartment.comments?.length > 0 && (
                    <div className="text-indigo-400 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black">{apartment.comments.length}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 bg-slate-50 p-1 px-2 rounded-full border border-slate-100">
                    <Clock className={cn("w-3.5 h-3.5", activityColor)} />
                    <span className={cn("text-[10px] font-black", activityColor)}>{days}d</span>
                </div>
            </div>

            <h4 className="font-black text-slate-800 group-hover:text-blue-600 transition truncate text-base max-w-[70%] tracking-tight mb-1">
                {apartment.address}
            </h4>
            <p className="text-[11px] text-slate-400 font-bold truncate mb-5 italic tracking-tight">
                {apartment.objectName}
            </p>

            <div className="space-y-1.5">
                <div className="flex gap-1.5">
                    <div className="flex-1 bg-red-50 p-1.5 rounded-xl border border-red-100 truncate text-center shadow-inner">
                        <span className="text-[11px] font-black text-red-700 tracking-tight">{apartment.oldTenant}</span>
                    </div>
                    <div className="flex-1 bg-red-50 p-1.5 rounded-xl border border-red-100 truncate text-center shadow-inner">
                        <span className="text-[11px] font-black text-red-700 tracking-tight">{formatDate(apartment.terminationDate)}</span>
                    </div>
                </div>

                {(apartment.newTenant || apartment.rentalStart) && (
                    <div className="flex gap-1 animate-in slide-in-from-top duration-300">
                        <div className="flex-1 bg-green-50 p-1.5 rounded-xl border border-green-100 truncate text-center shadow-inner">
                            <span className="text-[11px] font-black text-green-700 tracking-tight">{apartment.newTenant || '-'}</span>
                        </div>
                        <div className="flex-1 bg-green-50 p-1.5 rounded-xl border border-green-100 truncate text-center shadow-inner">
                            <span className="text-[11px] font-black text-green-700 tracking-tight">
                                {apartment.rentalStart ? formatDate(apartment.rentalStart) : '-'}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-3 border-t mt-2 border-slate-50">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase truncate tracking-wider">{apartment.responsible}</span>
                    </div>

                    <button
                        onClick={onDelete}
                        className="text-slate-200 hover:text-red-500 transition-colors p-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
