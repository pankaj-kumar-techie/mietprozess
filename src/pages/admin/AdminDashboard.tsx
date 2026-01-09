import { useNavigate } from 'react-router-dom';
import { Users, Palette, Settings as SettingsIcon, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AdminDashboard = () => {
    const navigate = useNavigate();

    const adminSections = [
        {
            id: 'users',
            title: 'Benutzerverwaltung',
            description: 'Benutzer hinzufügen, entfernen und Rollen verwalten',
            icon: Users,
            color: 'blue',
            path: '/admin/users'
        },
        {
            id: 'branding',
            title: 'Branding & Anpassung',
            description: 'App-Titel, Texte und UI-Elemente anpassen',
            icon: Palette,
            color: 'purple',
            path: '/admin/branding'
        },
        {
            id: 'settings',
            title: 'Systemeinstellungen',
            description: 'Erweiterte Konfiguration und Optionen',
            icon: SettingsIcon,
            color: 'green',
            path: '/admin/settings'
        },
        {
            id: 'security',
            title: 'Sicherheit & Rollen',
            description: 'Zugriffsrechte und Sicherheitseinstellungen',
            icon: Shield,
            color: 'red',
            path: '/admin/security'
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
            purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
            green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
            red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 mb-2">Admin Dashboard</h1>
                            <p className="text-slate-500 font-medium">Zentrale Verwaltung für MietProzess</p>
                        </div>
                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                            className="gap-2 border-2 rounded-xl h-11 px-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-bold">Zurück</span>
                        </Button>
                    </div>
                </div>

                {/* Admin Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {adminSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => navigate(section.path)}
                                className="group bg-white rounded-2xl shadow-lg border-2 border-slate-200 hover:border-slate-300 p-8 text-left transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(section.color)} rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                                            {section.title}
                                        </h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {section.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-100 mb-1">Admin-Zugriff aktiv</p>
                            <p className="text-2xl font-black">Vollständige Kontrolle</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
