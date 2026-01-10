
export const SkeletonApartmentCard = () => {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-slate-100 flex flex-col gap-4 w-[300px] shrink-0 animate-pulse">
            <div className="flex justify-between items-start">
                <div className="flex gap-2">
                    <div className="w-16 h-5 bg-slate-200 rounded-md"></div>
                    <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                </div>
                <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
            </div>

            <div className="space-y-1">
                <div className="w-2/3 h-6 bg-slate-200 rounded-md"></div>
                <div className="w-1/2 h-4 bg-slate-200 rounded-md"></div>
            </div>

            <div className="pt-3 border-t border-dashed border-slate-200 space-y-2">
                <div className="w-full h-8 bg-slate-100 rounded-xl"></div>
                <div className="w-full h-8 bg-slate-100 rounded-xl"></div>
            </div>

            <div className="flex gap-2 mt-2">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            </div>
        </div>
    );
};
