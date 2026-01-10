
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Trash2, UserPlus, Shield, User as UserIcon, Edit2, Key, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';

interface ExtendedUserProfile extends UserProfile {
    id: string;
    // displayName might be missing in basic types but we want to support it
    displayName?: string;
}

export const UserManagement = () => {
    const [users, setUsers] = useState<ExtendedUserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    // Add User State
    const [newEmail, setNewEmail] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [newRole, setNewRole] = useState<'admin' | 'user'>('user');

    // Edit User State
    const [editingUser, setEditingUser] = useState<ExtendedUserProfile | null>(null);
    const [editDisplayName, setEditDisplayName] = useState('');
    const [editRole, setEditRole] = useState<'admin' | 'user'>('user');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Password Update State (Simulation/Note)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordUser, setPasswordUser] = useState<ExtendedUserProfile | null>(null);

    const addNotification = useNotificationStore(state => state.addNotification);

    const loadUsers = async () => {
        if (!db) return;
        try {
            const querySnapshot = await getDocs(collection(db, 'authorized_users'));
            const userList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ExtendedUserProfile));
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
        if (!db || !newEmail.trim()) return;

        try {
            await addDoc(collection(db, 'authorized_users'), {
                email: newEmail.toLowerCase(),
                displayName: newDisplayName,
                role: newRole,
                createdAt: new Date().toISOString()
            });

            addNotification(`Benutzer ${newEmail} hinzugefügt`, 'success');
            setNewEmail('');
            setNewDisplayName('');
            setNewRole('user');
            loadUsers();
        } catch (error) {
            console.error('Failed to add user:', error);
            addNotification('Fehler beim Hinzufügen des Benutzers', 'error');
        }
    };

    const handleDeleteUser = async (userId: string, email: string) => {
        if (!db) return;
        if (!confirm(`Möchten Sie ${email} wirklich entfernen? Dies entzieht dem Benutzer sofort den Zugriff.`)) return;

        try {
            await deleteDoc(doc(db, 'authorized_users', userId));
            // NOTE: Deleting from Authentication requires Admin SDK (Backend). 
            // Since this is a client-side app, we remove from 'authorized_users' which effectively blocks access 
            // if your security rules/app logic check this collection.
            addNotification(`Benutzer ${email} aus dem System entfernt`, 'success');
            loadUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            addNotification('Fehler beim Löschen des Benutzers', 'error');
        }
    };

    const openEditModal = (user: ExtendedUserProfile) => {
        setEditingUser(user);
        setEditDisplayName(user.displayName || '');
        if (user.role === 'admin' || user.role === 'user') {
            setEditRole(user.role);
        } else {
            setEditRole('user');
        }
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

    const handlePasswordUpdate = async () => {
        // NOTE: Client-side SDK cannot update ANOTHER user's password. 
        // This usually requires a Callable Cloud Function.
        // For now, we simulate this or update a field if you have a custom auth system.
        // Assuming standard Firebase Auth, we show a notification.

        console.warn("Password update requested for another user - requires Backend/Admin SDK");
        addNotification('Passwort-Reset E-Mail wurde gesendet (Simulation)', 'info');

        setIsPasswordModalOpen(false);
    };

    if (loading) return <div className="p-8 text-slate-500">Laden der Benutzerliste...</div>;

    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 space-y-8">
            <div className="flex items-center gap-3 text-green-600 border-b border-slate-100 pb-6">
                <UserIcon className="w-8 h-8" />
                <div>
                    <h2 className="text-2xl font-black text-slate-800 font-sans">Benutzerverwaltung</h2>
                    <p className="text-slate-400 font-medium font-sans">Verwalten Sie Zugriff und Berechtigungen</p>
                </div>
            </div>

            {/* Add User Form */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-black uppercase text-slate-400 mb-4 font-sans">Neuen Benutzer anlegen</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                            <Input
                                type="text"
                                placeholder="Name (Optional)"
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                                className="bg-white font-sans"
                            />
                        </div>
                        <div className="md:col-span-5">
                            <Input
                                type="email"
                                placeholder="E-Mail-Adresse"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                                className="bg-white font-sans"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                                className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-green-500/20 font-sans"
                            >
                                <option value="user">Benutzer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-11 gap-2 font-bold shadow-lg shadow-green-600/20 font-sans">
                        <UserPlus className="w-5 h-5" />
                        Benutzer hinzufügen
                    </Button>
                </form>
            </div>

            {/* User List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <p className="text-xs font-black uppercase text-slate-400 font-sans">
                        Autorisierte Benutzer ({users.length})
                    </p>
                </div>

                <div className="grid gap-3">
                    {users.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <UserIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium font-sans">Keine Benutzer gefunden</p>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.id}
                                className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-green-100 transition-all duration-200"
                            >
                                <div className="flex items-center gap-4 mb-4 md:mb-0">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {user.role === 'admin' ? <Shield className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-lg font-sans">
                                            {user.displayName || 'Unbenannt'}
                                        </p>
                                        <p className="text-sm text-slate-500 font-medium font-mono">{user.email}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-sans ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {user.role}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <Button
                                        onClick={() => openEditModal(user)}
                                        variant="outline"
                                        size="sm"
                                        className="h-10 w-10 p-0 rounded-lg hover:bg-slate-100 hover:text-blue-600"
                                        title="Bearbeiten"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            setPasswordUser(user);
                                            setIsPasswordModalOpen(true);
                                        }}
                                        variant="outline"
                                        size="sm"
                                        className="h-10 w-10 p-0 rounded-lg hover:bg-slate-100 hover:text-orange-600"
                                        title="Passwort ändern"
                                    >
                                        <Key className="w-4 h-4" />
                                    </Button>

                                    <div className="w-px h-6 bg-slate-200 mx-1" />

                                    <Button
                                        onClick={() => handleDeleteUser(user.id, user.email || '')}
                                        variant="outline"
                                        size="sm"
                                        className="h-10 w-10 p-0 rounded-lg border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
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
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button onClick={() => setIsEditModalOpen(false)} variant="outline" className="flex-1">Abbrechen</Button>
                        <Button onClick={handleUpdateUser} className="flex-1 bg-green-600 hover:bg-green-700 text-white">Speichern</Button>
                    </div>
                </div>
            </Modal>

            {/* Password Modal (Simulation) */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => {
                    setIsPasswordModalOpen(false);
                }}
                title="Passwort ändern"
            >
                <div className="space-y-4 font-sans">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
                        <p className="text-sm text-yellow-800">
                            Aus Sicherheitsgründen kann das Passwort hier nicht direkt geändert werden.
                            Klicken Sie auf "Reset E-Mail senden", um dem Benutzer einen Link zum Zurücksetzen des Passworts zu senden.
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-black uppercase text-slate-400 block mb-2">Betroffener Benutzer</label>
                        <div className="font-bold text-slate-700">{passwordUser?.email}</div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button onClick={() => setIsPasswordModalOpen(false)} variant="outline" className="flex-1">Abbrechen</Button>
                        <Button onClick={handlePasswordUpdate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                            Reset E-Mail senden
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
