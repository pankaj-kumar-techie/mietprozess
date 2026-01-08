import { X, MessageSquare } from 'lucide-react';
import { STATUS_COLORS } from '@/types';
import type { Apartment } from '@/types';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

interface DetailsHeaderProps {
    apartment: Apartment;
    onClose: () => void;
    onScrollToComments: () => void;
}

export const DetailsHeader: React.FC<DetailsHeaderProps> = ({
    apartment, onClose, onScrollToComments
}) => {
    const days = differenceInDays(new Date(), new Date(apartment.lastActivity));
    const activityColor = days >= 15 ? 'text-red-600' : days >= 7 ? 'text-yellow-600' : 'text-black';

    const statusColorClass = STATUS_COLORS[apartment.status] || 'bg-white border-gray-200';
    const headerBg = statusColorClass.split(' ').find(c => c.startsWith('bg-')) || 'bg-white';


    return (
        <div className={cn("p-8 sticky top-0 z-20 border-b flex justify-between items-center transition-colors duration-500 shadow-sm", headerBg)}>
            <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">{apartment.address}</h3>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">{apartment.objectName}</p>
            </div>
            <div className="flex items-center gap-8">
                {apartment.comments?.length > 0 && (
                    <button
                        onClick={onScrollToComments}
                        className="bg-white/60 p-2 rounded-xl flex items-center gap-2 border border-white/80 shadow-sm text-indigo-600 hover:bg-white transition-all hover:scale-110"
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-black text-xs">{apartment.comments.length}</span>
                    </button>
                )}
                <div className="text-right bg-white/40 p-2 px-4 rounded-2xl border border-white/50">
                    <span className="text-[9px] font-black uppercase text-gray-400 block tracking-widest leading-none mb-1">Letzte Aktivität</span>
                    <span className={cn("font-black text-sm", activityColor)}>vor {days} Tag{days !== 1 ? 'en' : ''}</span>
                </div>
                <button onClick={onClose} className="p-3 bg-white hover:bg-gray-100 rounded-full transition shadow-md border border-slate-200">
                    <X className="h-6 w-6 text-gray-600" />
                </button>
            </div>

            {/* Navigation Buttons (Absolute to modal container ideally, passing props to parent layout or handled here?) 
          Actually keeping them fixed as per original code might be better in parent modal, but user asked for robust components.
          Original code put them fixed outside the scroll container. I'll handle that in the Parent Modal.
      */}
        </div>
    );
};
