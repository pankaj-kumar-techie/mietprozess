
import { useState } from 'react';
import { updatePassword, updateProfile, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Shield, User, Key, Mail, ArrowLeft } from 'lucide-react';

export const Profile = () => {
    const { user } = useAuthStore();
    const auth = getAuth();
    const addNotification = useNotificationStore(state => state.addNotification);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            addNotification('Profil erfolgreich aktualisiert', 'success');
        } catch (error: any) {
            console.error('Profile update error:', error);
            addNotification('Fehler beim Aktualisieren: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;
        if (newPassword !== confirmPassword) {
            addNotification('Passwörter stimmen nicht überein', 'error');
            return;
        }
        if (newPassword.length < 6) {
            addNotification('Passwort muss mindestens 6 Zeichen lang sein', 'error');
            return;
        }

        setLoading(true);
        try {
            await updatePassword(auth.currentUser, newPassword);
            addNotification('Passwort erfolgreich geändert', 'success');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error('Password update error:', error);
            // Re-authentication handling might be needed for sensitive operations
            if (error.code === 'auth/requires-recent-login') {
                addNotification('Bitte melden Sie sich erneut an, um das Passwort zu ändern.', 'error');
            } else {
                addNotification('Fehler beim Ändern des Passworts: ' + error.message, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendResetEmail = async () => {
        if (!user.email) return;
        try {
            await sendPasswordResetEmail(auth, user.email);
            addNotification('Reset E-Mail wurde gesendet!', 'success');
        } catch (error: any) {
            addNotification('Fehler: ' + error.message, 'error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mein Profil</h1>
                        <p className="text-slate-500 font-medium">{user.role === 'admin' ? 'Administrator' : 'Benutzer'}</p>
                    </div>
                </div>
                <Button
                    onClick={() => window.history.back()}
                    variant="outline"
                    className="gap-2 border-2 rounded-xl h-11 px-6 font-bold text-slate-600 hover:text-slate-800"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Zurück
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Info */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 text-slate-800 mb-2">
                        <User className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold">Allgemeine Informationen</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="text-xs font-black uppercase text-slate-400 block mb-2 ml-1">Anzeigename</label>
                            <Input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Ihr Name"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase text-slate-400 block mb-2 ml-1">E-Mail-Adresse</label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-100 text-slate-500 font-bold">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </div>
                            <p className="text-xs text-slate-400 mt-2 ml-1">E-Mail kann nicht geändert werden.</p>
                        </div>

                        <div className="pt-2">
                            <Button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl">
                                Speichern
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Security */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 text-slate-800 mb-2">
                        <Shield className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-bold">Sicherheit</h2>
                    </div>

                    {/* Change Password Form */}
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="text-xs font-black uppercase text-slate-400 block mb-2 ml-1">Neues Passwort</label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase text-slate-400 block mb-2 ml-1">Passwort bestätigen</label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="font-mono"
                            />
                        </div>

                        <div className="pt-2">
                            <Button disabled={loading} type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-12 rounded-xl gap-2">
                                <Key className="w-4 h-4" />
                                Passwort ändern
                            </Button>
                        </div>
                    </form>

                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-bold text-slate-700 mb-2">Probleme beim Anmelden?</h3>
                        <Button onClick={handleSendResetEmail} variant="outline" className="w-full text-slate-600 hover:text-blue-600 border-slate-200">
                            Passwort-Reset E-Mail an mich senden
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
