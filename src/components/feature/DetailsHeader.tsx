import { X } from 'lucide-react';
import { STATUS_COLORS } from '@/types';
import type { Apartment } from '@/types';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

interface DetailsHeaderProps {
    apartment: Apartment;
    onClose: () => void;
}

export const DetailsHeader: React.FC<DetailsHeaderProps> = ({
    apartment, onClose
}) => {
    const days = differenceInDays(new Date(), new Date(apartment.lastActivity));
    const activityColor = days >= 15 ? 'text-red-600' : days >= 7 ? 'text-yellow-600' : 'text-black';

    const statusColorClass = STATUS_COLORS[apartment.status] || 'bg-white border-gray-200';
    const headerBg = statusColorClass.split(' ').find(c => c.startsWith('bg-')) || 'bg-white';
    const borderColor = statusColorClass.split(' ').find(c => c.startsWith('border-')) || 'border-gray-200';

    return (
        <div className={cn("sticky top-0 z-10 p-6 md:p-8 rounded-t-[3rem] border-b-4", headerBg, borderColor)}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight truncate">
                            {apartment.address}
                        </h2>
                    </div>
                    <p className="text-sm md:text-base font-bold text-slate-600 mb-1">{apartment.objectName}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-widest">
                        <span className="text-slate-500">Alter Mieter: <span className="text-slate-700">{apartment.oldTenant}</span></span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">Kündigung: <span className="text-slate-700">{new Date(apartment.terminationDate).toLocaleDateString('de-DE')}</span></span>
                        <span className="text-slate-300">•</span>
                        <span className={cn("font-black", activityColor)}>
                            Letzte Aktivität: {days === 0 ? 'Heute' : `vor ${days} Tag${days > 1 ? 'en' : ''}`}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                    aria-label="Schließen"
                >
                    <X className="w-5 h-5 text-slate-600" />
                </button>
            </div>
        </div>
    );
};
