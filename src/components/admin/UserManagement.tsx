import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/auth-logic';
import { Button } from '@/components/ui/button';
import { Trash2, UserPlus, Shield, User as UserIcon } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';

export const UserManagement = () => {
    const [users, setUsers] = useState<(UserProfile & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
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
        if (!db || !newEmail.trim()) return;

        try {
            await addDoc(collection(db, 'authorized_users'), {
                email: newEmail.toLowerCase(),
                role: newRole
            });
            addNotification(`Benutzer ${newEmail} hinzugefügt`, 'success');
            setNewEmail('');
            setNewRole('user');
            loadUsers();
        } catch (error) {
            console.error('Failed to add user:', error);
            addNotification('Fehler beim Hinzufügen des Benutzers', 'error');
        }
    };

    const handleDeleteUser = async (userId: string, email: string) => {
        if (!db) return;
        if (!confirm(`Möchten Sie ${email} wirklich entfernen?`)) return;

        try {
            await deleteDoc(doc(db, 'authorized_users', userId));
            addNotification(`Benutzer ${email} entfernt`, 'success');
            loadUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            addNotification('Fehler beim Löschen des Benutzers', 'error');
        }
    };

    const handleToggleRole = async (userId: string, currentRole: 'admin' | 'user') => {
        if (!db) return;
        const newRole = currentRole === 'admin' ? 'user' : 'admin';

        try {
            await updateDoc(doc(db, 'authorized_users', userId), { role: newRole });
            addNotification(`Rolle aktualisiert zu ${newRole}`, 'success');
            loadUsers();
        } catch (error) {
            console.error('Failed to update role:', error);
            addNotification('Fehler beim Aktualisieren der Rolle', 'error');
        }
    };

    if (loading) return <div className="p-8">Laden...</div>;

    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 space-y-6">
            <div className="flex items-center gap-3 text-green-600 mb-4">
                <UserIcon className="w-6 h-6" />
                <h2 className="text-xl font-black">Benutzerverwaltung</h2>
            </div>

            {/* Add User Form */}
            <form onSubmit={handleAddUser} className="space-y-4 p-6 bg-slate-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-xs font-black uppercase text-slate-400 block mb-2">
                            Email-Adresse
                        </label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="benutzer@example.com"
                            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase text-slate-400 block mb-2">
                            Rolle
                        </label>
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:border-blue-500 outline-none transition-all"
                        >
                            <option value="user">Benutzer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 rounded-xl h-12 gap-2">
                    <UserPlus className="w-5 h-5" />
                    Benutzer hinzufügen
                </Button>
            </form>

            {/* User List */}
            <div className="space-y-3">
                <p className="text-xs font-black uppercase text-slate-400">
                    Autorisierte Benutzer ({users.length})
                </p>
                {users.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">Keine Benutzer gefunden</p>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {user.role === 'admin' ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{user.email}</p>
                                    <p className="text-xs text-slate-400 uppercase font-black">{user.role}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleToggleRole(user.id, user.role)}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg"
                                >
                                    {user.role === 'admin' ? 'Als User' : 'Als Admin'}
                                </Button>
                                <Button
                                    onClick={() => handleDeleteUser(user.id, user.email)}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
