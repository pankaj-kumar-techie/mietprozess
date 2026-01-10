
import React, { useState } from 'react';
import { updateProfile, getAuth } from 'firebase/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotificationStore } from '@/store/useNotificationStore';
import { User, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Profile = () => {
    const { user, login } = useAuthStore();
    const auth = getAuth();
    const addNotification = useNotificationStore(state => state.addNotification);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);

    if (!user) return null;

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;

        setLoading(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: displayName
            });

            // Update local store state
            if (user) {
                login({ ...user, displayName: displayName });
            }

            addNotification(t('profile.update_success', 'Profil erfolgreich aktualisiert'), 'success');
        } catch (error: any) {
            console.error('Profile update error:', error);
            addNotification(t('profile.update_error', 'Fehler beim Aktualisieren: ') + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg border-4 border-white">
                        {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('profile.title', 'Mein Profil')}</h1>
                        <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                            {user.role === 'admin' ? t('profile.role_admin', 'Administrator') : t('profile.role_user', 'Standard Benutzer')}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="gap-2 border-2 rounded-xl h-11 px-6 font-bold text-slate-600 hover:text-slate-800 transition-all hover:bg-slate-50 active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t('dashboard.title', 'Dashboard')}
                </Button>
            </div>

            <div className="space-y-6">
                {/* General Info */}
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border-4 border-slate-50 space-y-8">
                    <div className="flex items-center gap-3 text-slate-800">
                        <div className="p-2.5 bg-blue-50 rounded-xl">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight">{t('profile.general_info', 'Allgemeine Informationen')}</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 ml-1 tracking-widest">{t('profile.display_name', 'Anzeigename')}</label>
                            <Input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder={t('profile.name_placeholder', 'Ihr Name')}
                                className="h-12 border-2 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 ml-1 tracking-widest">{t('profile.email_address', 'E-Mail-Adresse')}</label>
                            <div className="flex items-center gap-3 px-4 py-4 bg-slate-50 rounded-xl border-2 border-slate-100 text-slate-500 font-bold text-sm shadow-inner group">
                                <Mail className="w-4 h-4 text-slate-300" />
                                {user.email}
                                <span className="ml-auto text-[9px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded uppercase font-black">{t('profile.locked', 'Gesperrt')}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 ml-1 font-medium">{t('profile.email_note', 'Die E-Mail-Adresse wird zur Anmeldung verwendet und kann nicht geändert werden.')}</p>
                        </div>

                        <div className="pt-4">
                            <Button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest text-xs"
                            >
                                {loading ? t('actions.saving', 'Speichere...') : t('profile.save_changes', 'Profil-Änderungen speichern')}
                            </Button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};
