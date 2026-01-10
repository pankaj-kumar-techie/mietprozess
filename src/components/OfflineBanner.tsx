
import { useEffect, useState } from 'react';
import { Wifi, CloudOff } from 'lucide-react';
import APP_CONFIG from '@/config/app.config';

export const OfflineBanner = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showReconnected, setShowReconnected] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowReconnected(true);
            setTimeout(() => setShowReconnected(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowReconnected(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline && !showReconnected) return null;

    return (
        <div className={`transition-all duration-300 ${isOnline ? 'bg-green-600' : 'bg-red-500'} text-white shadow-xl`}>
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
                {isOnline ? (
                    <>
                        <Wifi className="w-5 h-5 animate-bounce" />
                        <span className="font-bold">Verbindung wiederhergestellt</span>
                    </>
                ) : (
                    <>
                        <CloudOff className="w-5 h-5 animate-pulse" />
                        <span className="font-bold font-sans">
                            {APP_CONFIG.ui.text.errors.network.title}
                        </span>
                        <span className="hidden sm:inline text-white/90 text-sm font-sans">
                            - {APP_CONFIG.ui.text.errors.network.message}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};
