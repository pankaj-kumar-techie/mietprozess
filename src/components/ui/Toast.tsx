import { useNotificationStore } from '@/store/useNotificationStore';
import { cn } from '@/lib/utils';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer = () => {
    const { notifications, removeNotification } = useNotificationStore();

    return (
        <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={cn(
                        "pointer-events-auto flex items-center gap-4 bg-white border-2 p-5 rounded-[1.5rem] shadow-2xl min-w-[320px] animate-in slide-in-from-right duration-500",
                        n.type === 'success' && "border-green-100 bg-green-50/30",
                        n.type === 'info' && "border-blue-100 bg-blue-50/30",
                        n.type === 'error' && "border-red-100 bg-red-50/30"
                    )}
                >
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-transform",
                        n.type === 'success' && "bg-green-500 text-white",
                        n.type === 'info' && "bg-blue-600 text-white",
                        n.type === 'error' && "bg-red-500 text-white"
                    )}>
                        {n.type === 'success' && <CheckCircle className="w-6 h-6" />}
                        {n.type === 'info' && <Info className="w-6 h-6" />}
                        {n.type === 'error' && <AlertCircle className="w-6 h-6" />}
                    </div>

                    <div className="flex-1">
                        <p className="font-black text-slate-800 text-sm">{n.message}</p>
                    </div>

                    <button
                        onClick={() => removeNotification(n.id)}
                        className="text-slate-300 hover:text-slate-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
};
