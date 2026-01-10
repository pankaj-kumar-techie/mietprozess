
import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import APP_CONFIG from '@/config/app.config';

export const NetworkStatusHandler: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-lg flex items-start gap-4">
                <div className="p-1">
                    <WifiOff className="h-6 w-6 text-red-500" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-red-800">
                        {APP_CONFIG.ui.text.errors.network.title}
                    </h3>
                    <div className="mt-1 text-sm text-red-700">
                        <p>
                            {APP_CONFIG.ui.text.errors.network.message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
