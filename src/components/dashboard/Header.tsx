
import { useNavigate } from 'react-router-dom';
import { Building2, HelpCircle, Bell, Plus } from 'lucide-react';
import { UserProfileDropdown } from './UserProfileDropdown';
import APP_CONFIG from '@/config/app.config';

interface HeaderProps {
    onNewTermination: () => void;
}

export const Header = ({ onNewTermination }: HeaderProps) => {
    const navigate = useNavigate();

    return (
        <header className="bg-white/80 border-b border-slate-100 sticky top-0 z-50 backdrop-blur-xl transition-all">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">

                {/* Brand Section */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <div
                        onClick={() => navigate('/')}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 cursor-pointer hover:scale-105 transition-transform active:scale-95"
                    >
                        <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="hidden xs:block">
                        <h1 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none">{APP_CONFIG.app.name}</h1>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase">Management Suite</p>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-4">

                    {/* Primary Action Button */}
                    <button
                        onClick={onNewTermination}
                        className="group relative flex items-center gap-2 bg-slate-900 text-white px-4 sm:px-6 h-10 sm:h-12 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 shrink-0"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" />
                        <span className="hidden md:inline">{APP_CONFIG.ui.text.header.newTermination}</span>
                        <span className="md:hidden">Neu</span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Hidden on very small screens, shown from SM up */}
                        <div className="hidden sm:flex items-center gap-1">
                            <button
                                onClick={() => navigate('/notifications')}
                                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all relative"
                            >
                                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <button
                                onClick={() => navigate('/help')}
                                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all"
                            >
                                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block"></div>

                        {/* Profile Dropdown */}
                        <UserProfileDropdown />
                    </div>
                </div>
            </div>
        </header>
    );
};
