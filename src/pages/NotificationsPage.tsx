
import { useState, useEffect } from 'react';
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { Bell, Activity, CheckCircle, AlertTriangle, FileText, User, Building2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { de, enUS } from 'date-fns/locale';

interface ActivityLog {
    id: string;
    type: 'create' | 'update' | 'delete' | 'comment' | 'status_change';
    message: string;
    details?: string;
    userName: string;
    userEmail: string;
    timestamp: any; // Firestore Timestamp
    apartmentId?: string;
    apartmentAddress?: string;
}

export const NotificationsPage = () => {
    const { user } = useAuthStore();
    const { t, i18n } = useTranslation();
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadActivities = async () => {
        if (!db) return;
        setLoading(true);
        try {
            const logsRef = collection(db, 'activity_logs');
            // Show only the last 50 activities for performance
            const q = query(logsRef, orderBy('timestamp', 'desc'), limit(50));

            const querySnapshot = await getDocs(q);
            const loadedLogs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ActivityLog[];

            setActivities(loadedLogs);
        } catch (error) {
            console.error("Failed to load activities", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActivities();
    }, [user]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'create': return <FileText className="w-5 h-5 text-green-500" />;
            case 'status_change': return <Activity className="w-5 h-5 text-blue-500" />;
            case 'comment': return <User className="w-5 h-5 text-purple-500" />;
            case 'delete': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            default: return <CheckCircle className="w-5 h-5 text-slate-500" />;
        }
    };

    const filteredActivities = activities.filter(log => {
        const s = searchTerm.toLowerCase();
        return !searchTerm ||
            log.message.toLowerCase().includes(s) ||
            log.details?.toLowerCase().includes(s) ||
            log.userName.toLowerCase().includes(s) ||
            log.apartmentAddress?.toLowerCase().includes(s);
    });

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                        <Bell className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('notifications.title', 'Benachrichtigungen')}</h1>
                        <p className="text-slate-500 font-medium">{t('notifications.subtitle', 'Aktivitäten des Teams')}</p>
                    </div>
                </div>
                <Button
                    onClick={() => window.history.back()}
                    variant="outline"
                    className="gap-2 border-2 rounded-xl h-11 px-6 font-bold text-slate-600 hover:text-slate-800"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t('actions.back', 'Zurück')}
                </Button>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 flex items-center gap-4 shadow-sm focus-within:border-blue-200 transition-all">
                <Activity className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder={t('notifications.search_placeholder', 'Suche nach Objekt, Person oder Aktivität...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent outline-none font-bold text-slate-700 placeholder:text-slate-300"
                />
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">{t('actions.loading', 'Laden...')}</div>
                ) : filteredActivities.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl p-12 text-center border border-dashed border-slate-200">
                        <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">Keine passenden Aktivitäten gefunden</h3>
                        <p className="text-slate-500">Versuchen Sie es mit einem anderen Suchbegriff.</p>
                    </div>
                ) : (
                    filteredActivities.map(log => (
                        <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 hover:border-blue-200 transition-colors">
                            <div className="mt-1 bg-slate-50 p-2 rounded-lg h-fit">
                                {getIcon(log.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-slate-800">{log.message}</h4>
                                    <span className="text-xs font-bold text-slate-400">
                                        {log.timestamp?.seconds
                                            ? format(new Date(log.timestamp.seconds * 1000), 'dd. MMM HH:mm', {
                                                locale: i18n.language.startsWith('de') ? de : enUS
                                            })
                                            : t('notifications.just_now', 'Gerade eben')}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{log.details}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    {log.apartmentAddress && (
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md text-xs font-medium text-slate-500">
                                            <Building2 className="w-3 h-3" />
                                            {log.apartmentAddress}
                                        </div>
                                    )}
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-50 rounded-md text-xs font-medium text-indigo-600">
                                        <User className="w-3 h-3" />
                                        {log.userName}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
