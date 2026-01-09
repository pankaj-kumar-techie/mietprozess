import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useApartmentStore } from '@/store/useApartmentStore';
import { HelpCircle, Download } from 'lucide-react';
import { exportApartmentsToExcel } from '@/lib/exportUtils';
import { useNotificationStore } from '@/store/useNotificationStore';
import { NOTIFICATION_CONFIG } from '@/lib/notifications';
import { useUISettings } from '@/store/useUISettings';
import { UserProfileDropdown } from './UserProfileDropdown';

interface HeaderProps {
    onNewTermination: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewTermination }) => {
    const navigate = useNavigate();
    const apartments = useApartmentStore((state: any) => state.apartments);
    const addNotification = useNotificationStore(state => state.addNotification);
    const settings = useUISettings(state => state.settings);

    const handleExport = () => {
        exportApartmentsToExcel(apartments);
        if (NOTIFICATION_CONFIG.export.enabled) {
            addNotification(NOTIFICATION_CONFIG.export.message, 'success');
        }
    }

    return (
        <header className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 sticky top-0 z-40 shadow-sm backdrop-blur-sm">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight">{settings.header.title}</h1>
                            <p className="text-xs text-slate-500 font-medium">Kündigungsverwaltung</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Primary Action */}
                        <Button
                            onClick={onNewTermination}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-200/50 transition-all hover:scale-105 active:scale-95 h-10 px-6"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">{settings.header.newTermination}</span>
                            <span className="sm:hidden">Neu</span>
                        </Button>

                        {/* Secondary Actions */}
                        <div className="hidden md:flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1">
                            <Button
                                onClick={handleExport}
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg h-8 px-3"
                                title={settings.header.export}
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => navigate('/help')}
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg h-8 px-3"
                                title="Hilfe"
                            >
                                <HelpCircle className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* User Profile Dropdown */}
                        <UserProfileDropdown />
                    </div>
                </div>
            </div>
        </header>
    );
};
