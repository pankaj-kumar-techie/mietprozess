import { useNavigate } from 'react-router-dom';
import { useUISettings } from '@/store/useUISettings';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Palette, Type, Layout } from 'lucide-react';

export const AdminBrandingPage = () => {
    const navigate = useNavigate();
    const { settings, updateSetting, resetToDefaults, isLoading } = useUISettings();

    const renderInput = (label: string, path: string, value: string, placeholder?: string) => (
        <div className="space-y-2" key={path}>
            <label className="text-sm font-bold text-slate-700">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => updateSetting(path, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            />
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Laden...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Palette className="w-7 h-7 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-800">Branding & Anpassung</h1>
                                <p className="text-slate-500 font-medium">App-Texte und UI-Elemente anpassen</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={resetToDefaults}
                                variant="outline"
                                className="gap-2 border-2 rounded-xl h-11 px-6"
                            >
                                <span className="font-bold">Zurücksetzen</span>
                            </Button>
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

                {/* Header Settings */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Layout className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Header Einstellungen</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderInput("App Titel", "header.title", settings.header.title, "z.B. MietProzess")}
                        {renderInput("Neue Kündigung Button", "header.newTermination", settings.header.newTermination, "z.B. Neue Kündigung erfassen")}
                        {renderInput("Export Button", "header.export", settings.header.export, "z.B. Daten Export")}
                        {renderInput("Hilfe Button", "header.help", settings.header.help, "z.B. Hilfe")}
                        {renderInput("Logout Button", "header.logout", settings.header.logout, "z.B. Abmelden")}
                    </div>
                </div>

                {/* Login Page Settings */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Type className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Login Page</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderInput("Login Titel", "login.title", settings.login.title, "z.B. Willkommen zurück")}
                        {renderInput("Login Untertitel", "login.subtitle", settings.login.subtitle, "z.B. Melden Sie sich an")}
                        {renderInput("Login Button", "login.button", settings.login.button, "z.B. Anmelden")}
                        {renderInput("Email Placeholder", "login.inputPlaceholder", settings.login.inputPlaceholder, "z.B. Email-Adresse")}
                        {renderInput("Footer Text", "login.footer", settings.login.footer, "z.B. © 2026 MietProzess")}
                    </div>
                </div>

                {/* Auto-Save Info */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-100 mb-1">Automatisches Speichern aktiv</p>
                            <p className="text-xl font-black">Alle Änderungen werden sofort gespeichert</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-bold">Live</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
