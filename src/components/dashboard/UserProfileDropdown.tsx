import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { logoutFromFirebase } from '@/lib/auth-logic';
import { ChevronDown, User, Settings, Shield, LogOut } from 'lucide-react';

export const UserProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logoutFromFirebase();
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all"
            >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {(user.displayName || user.email).charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-slate-800">{user.displayName || user.email.split('@')[0]}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                                {(user.displayName || user.email).charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate">{user.displayName || user.email.split('@')[0]}</p>
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    {user.role === 'admin' ? (
                                        <>
                                            <Shield className="w-3 h-3 text-purple-600" />
                                            <span className="text-xs font-medium text-purple-600">Administrator</span>
                                        </>
                                    ) : (
                                        <>
                                            <User className="w-3 h-3 text-blue-600" />
                                            <span className="text-xs font-medium text-blue-600">Benutzer</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        {/* Admin Panel - Only for Admins */}
                        {user.role === 'admin' && (
                            <button
                                onClick={() => handleNavigation('/admin')}
                                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-purple-50 transition-colors text-left group"
                            >
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <Shield className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Admin Panel</p>
                                    <p className="text-xs text-slate-500">Einstellungen verwalten</p>
                                </div>
                            </button>
                        )}

                        {/* My Profile */}
                        <button
                            onClick={() => handleNavigation('/profile')}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left group"
                        >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Mein Profil</p>
                                <p className="text-xs text-slate-500">Profil bearbeiten</p>
                            </div>
                        </button>

                        {/* Settings */}
                        <button
                            onClick={() => handleNavigation('/settings')}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left group"
                        >
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                <Settings className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Einstellungen</p>
                                <p className="text-xs text-slate-500">Präferenzen anpassen</p>
                            </div>
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left group"
                        >
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                <LogOut className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-red-600">Abmelden</p>
                                <p className="text-xs text-red-500">Sitzung beenden</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
