import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Home } from "lucide-react"; // I need to verify if Home icon is exactly what was used. The SVGs in original were custom. I will use Lucide approximations.

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useApartmentStore } from '@/store/useApartmentStore';
import { LogOut, HelpCircle, Download, Settings } from 'lucide-react';
import { exportApartmentsToExcel } from '@/lib/exportUtils';
import { useNotificationStore } from '@/store/useNotificationStore';
import { NOTIFICATION_CONFIG } from '@/lib/notifications';
import { useUISettings } from '@/store/useUISettings';

interface HeaderProps {
    onNewTermination: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewTermination }) => {
    const navigate = useNavigate();
    const logout = useAuthStore((state: any) => state.logout);
    const apartments = useApartmentStore((state: any) => state.apartments);
    const addNotification = useNotificationStore(state => state.addNotification);
    const settings = useUISettings(state => state.settings);

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    const handleExport = () => {
        exportApartmentsToExcel(apartments);
        if (NOTIFICATION_CONFIG.export.enabled) {
            addNotification(NOTIFICATION_CONFIG.export.message, 'success');
        }
    }

    return (
        <header className="bg-white border-b sticky top-0 z-40 px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
                    <Home className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-slate-800 uppercase">{settings.header.title}</h1>
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-center">
                <Button
                    onClick={onNewTermination}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-sm h-auto py-3 px-8 order-last sm:order-none"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    {settings.header.newTermination}
                </Button>
                <div className="flex gap-2">
                    <Button
                        onClick={handleExport}
                        variant="ghost"
                        className="text-slate-500 font-bold hover:text-blue-600 gap-2 h-10 px-3"
                        title={settings.header.export}
                    >
                        <Download className="w-5 h-5" />
                        <span className="hidden lg:inline">{settings.header.export}</span>
                    </Button>
                    <Button
                        onClick={() => navigate('/help')}
                        variant="ghost"
                        className="text-slate-500 font-bold hover:text-blue-600 gap-2 h-10 px-3"
                        title={settings.header.help}
                    >
                        <HelpCircle className="w-5 h-5" />
                        <span className="hidden lg:inline">{settings.header.help}</span>
                    </Button>
                    <Button
                        onClick={() => navigate('/admin')}
                        variant="ghost"
                        className="text-slate-500 font-bold hover:text-blue-600 gap-2 h-10 px-3"
                        title="Admin"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="hidden lg:inline">Admin</span>
                    </Button>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="text-slate-500 font-bold hover:text-red-600 gap-2 h-10 px-3"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="hidden lg:inline">{settings.header.logout}</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};
