
import { useNavigate } from 'react-router-dom';
import { Building2, FileDown, HelpCircle, Bell } from 'lucide-react';
import { UserProfileDropdown } from './UserProfileDropdown';
import { Button } from '@/components/ui/button';
import { exportApartmentsToExcel } from '@/lib/exportUtils';
import { useApartmentStore } from '@/store/useApartmentStore';
import APP_CONFIG from '@/config/app.config';

interface HeaderProps {
    onNewTermination: () => void;
}

export const Header = ({ onNewTermination }: HeaderProps) => {
    const navigate = useNavigate();
    const apartments = useApartmentStore(state => state.apartments);

    const handleExport = () => {
        exportApartmentsToExcel(apartments);
    };

    return (
        <header className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 sticky top-0 z-40 shadow-sm backdrop-blur-sm">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-slate-800 tracking-tight">{APP_CONFIG.app.name}</h1>
                                <p className="text-xs text-slate-500 font-medium">Property Management</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* New Termination Button */}
                        <Button
                            onClick={onNewTermination}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-bold shadow-lg shadow-green-200/50 transition-all hover:scale-105 active:scale-95 h-10 px-6"
                        >
                            <span className="hidden sm:inline">{APP_CONFIG.ui.text.header.newTermination}</span>
                            <span className="sm:hidden">Neu</span>
                        </Button>

                        {/* Secondary Actions */}
                        <div className="hidden md:flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1">
                            <Button
                                onClick={() => navigate('/notifications')}
                                variant="ghost"
                                className="h-8 px-3 hover:bg-slate-50 hover:text-orange-600 rounded-lg transition-all relative group"
                                title="Benachrichtigungen"
                            >
                                <div className="relative">
                                    <Bell className="w-4 h-4" />
                                </div>
                            </Button>
                            <Button
                                onClick={handleExport}
                                variant="ghost"
                                className="h-8 px-3 hover:bg-slate-50 hover:text-green-600 rounded-lg transition-all"
                            >
                                <FileDown className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => navigate('/help')}
                                variant="ghost"
                                className="h-8 px-3 hover:bg-slate-50 hover:text-green-600 rounded-lg transition-all"
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
