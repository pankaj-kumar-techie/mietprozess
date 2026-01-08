import { useUISettings } from '@/store/useUISettings';
import { Save, RotateCcw, Layout, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Admin = () => {
    const { settings, updateSetting, resetToDefaults, isLoading } = useUISettings();

    if (isLoading) return <div className="p-8">Laden...</div>;


    const renderInput = (label: string, path: string, value: string) => (
        <div className="space-y-2 mb-6" key={path}>
            <label className="text-xs font-black uppercase text-slate-400">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => updateSetting(path, e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 focus:border-blue-500 outline-none transition-all"
            />
        </div>
    );

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-800">No-Code Admin</h1>
                    <p className="text-slate-400 font-medium">Passen Sie das Tool ohne Programmieren an.</p>
                </div>
                <Button onClick={resetToDefaults} variant="outline" className="gap-2 border-2 rounded-xl h-12">
                    <RotateCcw className="w-4 h-4" />
                    <span>Auf Standard zurücksetzen</span>
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Header Section */}
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 text-blue-600 mb-2">
                        <Layout className="w-6 h-6" />
                        <h2 className="text-xl font-black">Header & Board</h2>
                    </div>
                    {renderInput("App Titel", "header.title", settings.header.title)}
                    {renderInput("Button: Neue Kündigung", "header.newTermination", settings.header.newTermination)}
                    {renderInput("Button: Export", "header.export", settings.header.export)}
                </div>

                {/* Login Section */}
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 text-purple-600 mb-2">
                        <Type className="w-6 h-6" />
                        <h2 className="text-xl font-black">Login Page</h2>
                    </div>
                    {renderInput("Login Titel", "login.title", settings.login.title)}
                    {renderInput("Login Untertitel", "login.subtitle", settings.login.subtitle)}
                    {renderInput("Input Placeholder", "login.inputPlaceholder", settings.login.inputPlaceholder)}
                </div>
            </div>

            <footer className="bg-blue-50 p-6 rounded-2xl flex items-center justify-between">
                <p className="text-blue-700 font-bold text-sm">
                    Alle Änderungen werden sofort gespeichert und für alle Benutzer wirksam.
                </p>
                <div className="flex items-center gap-2 text-blue-500 font-black uppercase text-xs tracking-widest">
                    <Save className="w-4 h-4" />
                    <span>Auto-Save Aktiv</span>
                </div>
            </footer>
        </div>
    );
};
