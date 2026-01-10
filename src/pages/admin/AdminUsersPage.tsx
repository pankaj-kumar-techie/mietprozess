
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import type { UserProfile } from '@/store/useAuthStore';
import { createUserAccount } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Trash2, UserPlus, Shield, User as UserIcon, ArrowLeft, AlertTriangle, Eye, EyeOff, Edit2 } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';

export const AdminUsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<(UserProfile & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    // Create State
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState('');
    const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
    const [creating, setCreating] = useState(false);

    // Edit State
    const [editingUser, setEditingUser] = useState<(UserProfile & { id: string }) | null>(null);
    const [editDisplayName, setEditDisplayName] = useState('');
    const [editRole, setEditRole] = useState<'admin' | 'user'>('user');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null);

    const addNotification = useNotificationStore(state => state.addNotification);

    const loadUsers = async () => {
        if (!db) return;
        try {
            const querySnapshot = await getDocs(collection(db, 'authorized_users'));
            const userList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as UserProfile & { id: string }));
            setUsers(userList);
        } catch (error) {
            console.error('Failed to load users:', error);
            addNotification('Fehler beim Laden der Benutzer', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail.trim() || !newPassword.trim()) {
            addNotification('Email und Passwort sind erforderlich', 'error');
            return;
        }

        setCreating(true);
        try {
            await createUserAccount({
                email: newEmail,
                password: newPassword,
                displayName: newDisplayName.trim() || undefined,
                role: newRole
            });

            addNotification(`Benutzer ${newEmail} erfolgreich erstellt`, 'success');
            setNewEmail('');
            setNewPassword('');
            setNewDisplayName('');
            setNewRole('user');
            loadUsers();
        } catch (error: any) {
            console.error('Failed to add user:', error);
            addNotification(error.message || 'Fehler beim Hinzufügen des Benutzers', 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteUser = async (userId: string, email: string) => {
        if (!db) return;
        // Native confirm removed in favor of Modal

        try {
            await deleteDoc(doc(db, 'authorized_users', userId));
            addNotification(`Benutzer ${email} aus Whitelist entfernt`, 'success');
            loadUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            addNotification('Fehler beim Löschen des Benutzers', 'error');
        }
    };

    const openEditModal = (user: UserProfile & { id: string }) => {
        setEditingUser(user);
        setEditDisplayName(user.displayName || user.name || '');
        setEditRole(user.role || 'user');
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async () => {
        if (!db || !editingUser) return;

        try {
            await updateDoc(doc(db, 'authorized_users', editingUser.id), {
                displayName: editDisplayName,
                role: editRole
            });

            addNotification('Benutzerdaten aktualisiert', 'success');
            setIsEditModalOpen(false);
            loadUsers();
        } catch (error) {
            console.error('Failed to update user:', error);
            addNotification('Fehler beim Aktualisieren', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Laden...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                <UserIcon className="w-7 h-7 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-800">Benutzerverwaltung</h1>
                                <p className="text-slate-500 font-medium">Benutzer und Rollen verwalten</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => navigate('/admin')}
                                variant="outline"
                                className="gap-2 border-2 rounded-xl h-11 px-6"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="font-bold">Zurück</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-bold mb-1">Wichtiger Hinweis:</p>
                            <p>Das Löschen eines Benutzers entfernt nur die Autorisierung aus der Whitelist. Der Firebase Authentication Account bleibt bestehen.</p>
                        </div>
                    </div>
                </div>

                {/* Add User Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <h2 className="text-xl font-black text-slate-800 mb-6">Neuen Benutzer hinzufügen</h2>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">Email-Adresse *</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="benutzer@example.com"
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                    required
                                    disabled={creating}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">Passwort *</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Mindestens 6 Zeichen"
                                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 pr-12 text-slate-800 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                        required
                                        minLength={6}
                                        disabled={creating}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">Vollständiger Name (optional)</label>
                                <input
                                    type="text"
                                    value={newDisplayName}
                                    onChange={(e) => setNewDisplayName(e.target.value)}
                                    placeholder="Max Mustermann"
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                    disabled={creating}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">Rolle</label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                    disabled={creating}
                                >
                                    <option value="user">Benutzer</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl h-12 gap-2 font-bold" disabled={creating}>
                            <UserPlus className="w-5 h-5" />
                            {creating ? 'Wird erstellt...' : 'Benutzer hinzufügen'}
                        </Button>
                    </form>
                </div>

                {/* User List */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-slate-800">Autorisierte Benutzer ({users.length})</h2>
                    </div>
                    <div className="space-y-3">
                        {users.length === 0 ? (
                            <div className="text-center py-12">
                                <UserIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium">Keine Benutzer gefunden</p>
                            </div>
                        ) : (
                            users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {user.role === 'admin' ? <Shield className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Unbekannt')}</p>
                                            <p className="text-sm text-slate-500">{user.email || 'Keine Email'}</p>
                                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {user.role === 'admin' ? 'Administrator' : 'Benutzer'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => openEditModal(user)}
                                            variant="outline"
                                            size="sm"
                                            className="rounded-lg border-2 font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-100"
                                            title="Bearbeiten"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            onClick={() => setUserToDelete({ id: user.id, email: user.email || '' })}
                                            variant="outline"
                                            size="sm"
                                            className="rounded-lg text-red-600 hover:bg-red-50 border-2 border-red-200 hover:border-red-300"
                                            title="Löschen"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Benutzer bearbeiten"
                >
                    <div className="space-y-4 font-sans">
                        <div>
                            <label className="text-xs font-black uppercase text-slate-400 block mb-2">E-Mail (Nicht änderbar)</label>
                            <Input value={editingUser?.email || ''} disabled className="bg-slate-100 text-slate-500" />
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase text-slate-400 block mb-2">Anzeigename</label>
                            <Input
                                value={editDisplayName}
                                onChange={(e) => setEditDisplayName(e.target.value)}
                                placeholder="Name eingeben"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase text-slate-400 block mb-2">Rolle</label>
                            <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value as 'admin' | 'user')}
                                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:border-green-500 outline-none transition-all"
                            >
                                <option value="user">Benutzer</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        {/* Password Reset Section */}
                        <div className="pt-4 border-t border-slate-100">
                            <label className="text-xs font-black uppercase text-slate-400 block mb-3">Sicherheit (Passwort)</label>
                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <Shield className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                    <p className="text-xs text-orange-800 leading-relaxed">
                                        Aus Sicherheitsgründen können Passwörter hier nicht direkt geändert werden.
                                        Senden Sie dem Benutzer eine E-Mail zur Passwort-Zurücksetzung.
                                    </p>
                                </div>
                                <Button
                                    onClick={async () => {
                                        if (editingUser?.email) {
                                            try {
                                                await sendPasswordResetEmail(auth, editingUser.email);
                                                addNotification(`Reset-E-Mail an ${editingUser.email} gesendet`, 'success');
                                            } catch (e: any) {
                                                console.error(e);
                                                addNotification('Fehler beim Senden der E-Mail', 'error');
                                            }
                                        }
                                    }}
                                    variant="outline"
                                    className="w-full bg-white border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800 font-bold"
                                >
                                    Passwort-Reset E-Mail senden
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button onClick={() => setIsEditModalOpen(false)} variant="outline" className="flex-1">Abbrechen</Button>
                            <Button onClick={handleUpdateUser} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold">Speichern</Button>
                        </div>
                    </div>
                </Modal>

                <ConfirmationModal
                    isOpen={!!userToDelete}
                    onClose={() => setUserToDelete(null)}
                    onConfirm={() => {
                        if (userToDelete) {
                            handleDeleteUser(userToDelete.id, userToDelete.email);
                            setUserToDelete(null);
                        }
                    }}
                    title="Benutzer entfernen?"
                    description={`Möchten Sie ${userToDelete?.email} wirklich entfernen? Dies entfernt nur die Autorisierung. Der Firebase Account bleibt bestehen.`}
                    confirmText="Entfernen"
                    variant="danger"
                />
            </div>
        </div>
    );
};
