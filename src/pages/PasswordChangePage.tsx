
import React, { useState } from 'react';
import { updatePassword, getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Key, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const PasswordChangePage = () => {
    const { user } = useAuthStore();
    const auth = getAuth();
    const addNotification = useNotificationStore(state => state.addNotification);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!user) return null;

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!auth.currentUser) {
            addNotification('Nicht authentifiziert', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            addNotification('Passwörter stimmen nicht überein', 'error');
            return;
        }

        if (newPassword.length < 6) {
            addNotification('Das Passwort muss mindestens 6 Zeichen lang sein', 'error');
            return;
        }

        setLoading(true);
        try {
            // 1. Update in Firebase Authentication
            await updatePassword(auth.currentUser, newPassword);

            // 2. Update in Firestore for logging/tracking
            if (db && user.email) {
                const userDocRef = doc(db, 'authorized_users', user.email.toLowerCase());
                await updateDoc(userDocRef, {
                    lastPasswordChange: new Date().toISOString()
                });
            }

            addNotification(t('profile.password_success', 'Passwort erfolgreich aktualisiert'), 'success');
            setNewPassword('');
            setConfirmPassword('');

            // Redirect to dashboard or profile after short delay
            setTimeout(() => navigate('/profile'), 1500);

        } catch (error: any) {
            console.error('Password change error:', error);
            if (error.code === 'auth/requires-recent-login') {
                addNotification(t('help.error_recent_login', 'Sicherheits-Timeout: Bitte loggen Sie sich erneut ein, um das Passwort zu ändern.'), 'error');
            } else {
                addNotification(t('actions.error', 'Fehler: ') + error.message, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 md:p-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Minimalist Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 shadow-xl shadow-blue-100 rounded-[1.5rem] text-white">
                    <Key className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">{t('profile.change_password', 'Passwort ändern')}</h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t('profile.security_desc_short', 'Erhöhen Sie die Sicherheit Ihres Kontos')}</p>
            </div>

            {/* Simple Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-slate-50 relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>

                <form onSubmit={handlePasswordUpdate} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 block ml-1 tracking-widest">{t('profile.new_password', 'Neues Passwort')}</label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="h-14 border-2 focus:ring-4 focus:ring-blue-500/10 rounded-2xl font-mono text-lg"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 block ml-1 tracking-widest">{t('profile.confirm_password', 'Passwort bestätigen')}</label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="h-14 border-2 focus:ring-4 focus:ring-blue-500/10 rounded-2xl font-mono text-lg"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    {t('actions.update_now', 'Jetzt Aktualisieren')}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
