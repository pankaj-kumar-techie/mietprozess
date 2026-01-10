
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    BookOpen,
    Shield,
    User,
    Layout,
    CheckCircle2,
    Clock,
    AlertCircle,
    Lock,
    Zap,
    History,
    MessageCircle,
    HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export const Help = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'user' | 'admin' | 'errors'>('user');

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 animate-in fade-in duration-700">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Simplified Sticky Header */}
                <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl border-2 border-slate-100 shadow-sm sticky top-4 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">{t('help.title', 'HIT Flow Guide')}</h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('help.subtitle', 'System-Dokumentation v1.4')}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all font-bold text-slate-600 text-sm border border-slate-200 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('dashboard.title', 'Dashboard')}
                    </button>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-slate-50 space-y-2">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1 mb-4">Navigation</p>

                            <button
                                onClick={() => setActiveTab('user')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all group",
                                    activeTab === 'user' ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                <User className={cn("w-4 h-4", activeTab === 'user' ? "text-white" : "text-slate-400 group-hover:text-blue-500")} />
                                {t('help.user_guide', 'Benutzer-Guide')}
                            </button>

                            <button
                                onClick={() => setActiveTab('admin')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all group",
                                    activeTab === 'admin' ? "bg-purple-600 text-white shadow-lg shadow-purple-100" : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                <Shield className={cn("w-4 h-4", activeTab === 'admin' ? "text-white" : "text-slate-400 group-hover:text-purple-500")} />
                                {t('help.admin_privileges', 'Admin-Privilegien')}
                            </button>

                            <button
                                onClick={() => setActiveTab('errors')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all group",
                                    activeTab === 'errors' ? "bg-red-600 text-white shadow-lg shadow-red-100" : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                <AlertCircle className={cn("w-4 h-4", activeTab === 'errors' ? "text-white" : "text-slate-400 group-hover:text-red-500")} />
                                {t('help.error_lexicon', 'Fehler-Lexikon')}
                            </button>
                        </div>

                        {/* Quick Stats/Tip */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-[2rem] shadow-xl text-white">
                            <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                            <h3 className="text-sm font-black uppercase tracking-tight mb-2">Pro-Tipp</h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                Nutzen Sie die <span className="text-white font-bold">Schnellsuche (Shortcut: Strg+F)</span> auf dem Dashboard, um Wohnungen sofort nach Adresse oder Mieter zu filtern.
                            </p>
                        </div>
                    </div>

                    {/* Main Documentation Area */}
                    <div className="lg:col-span-9">
                        <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-slate-50 p-8 md:p-12 min-h-[600px]">

                            {/* USER GUIDE TAB */}
                            {activeTab === 'user' && (
                                <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                                    <header className="space-y-4">
                                        <div className="bg-blue-50 w-fit px-4 py-1.5 rounded-full text-blue-600 font-black text-[10px] uppercase tracking-widest border border-blue-100">
                                            {t('help.staff_manual', 'Handbuch für Mitarbeiter')}
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">{t('help.process_title', 'Der HIT Flow Prozess')}</h2>
                                        <p className="text-slate-500 font-medium max-w-2xl">
                                            {t('help.welcome_desc', 'Willkommen bei HIT Flow. Unser System führt Sie strukturiert durch den gesamten Kündigungs- und Vermietungsprozess einer Immobilie.')}
                                        </p>
                                    </header>

                                    {/* Stages Section */}
                                    <section className="space-y-6">
                                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                                            <Layout className="w-5 h-5 text-blue-500" />
                                            1. Die Pipeline (Phasen)
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { title: 'In Kündigung', desc: 'Verarbeitung der Kündigung. Bestätigung der Termine.', color: 'bg-red-50 text-red-700' },
                                                { title: 'In Vermietung', desc: 'Marketing aktiv, Suche nach Interessenten.', color: 'bg-yellow-50 text-yellow-700' },
                                                { title: 'Mietvertrag erstellt', desc: 'Interessent gefunden, Prüfung & Vertragsvorbereitung.', color: 'bg-green-50 text-green-700' },
                                                { title: 'Wohnung übergeben', desc: 'Vertrag unterschrieben, Übergabe geplant.', color: 'bg-blue-50 text-blue-700' },
                                                { title: 'Abgeschlossen', desc: 'Prozess beendet. Schlüssel übergeben.', color: 'bg-slate-100 text-slate-600' }
                                            ].map((stage, i) => (
                                                <div key={i} className="flex gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:bg-slate-50/50 transition-all group">
                                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0", stage.color)}>
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-800 text-sm mb-1">{stage.title}</h4>
                                                        <p className="text-xs text-slate-500 font-medium">{stage.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Page Specific Guides */}
                                    <section className="space-y-6 border-t border-slate-100 pt-8">
                                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                                            <div className="p-1 px-2 bg-blue-600 text-white rounded text-[10px] font-black">NEW</div>
                                            Modul-Anleitungen
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50">
                                                <h4 className="font-black text-blue-700 text-xs uppercase tracking-widest mb-2">Dashboard (Kanban & Liste)</h4>
                                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                                    Wechseln Sie zwischen der <span className="font-bold">Kanban-Ansicht</span> für visuelles Tracking und der <span className="font-bold">Listen-Ansicht</span> für tabellarische Auswertungen. Nutzen Sie die Schnellfilter, um Ihre verantwortlichen Objekte sofort zu finden.
                                                </p>
                                                <div className="mt-3 p-3 bg-white/60 rounded-xl border border-blue-100 flex items-start gap-3">
                                                    <Zap className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                                                    <p className="text-[10px] text-slate-500 leading-relaxed">
                                                        <span className="font-black text-blue-600 uppercase tracking-widest mr-1">Pro-Tipp:</span>
                                                        {t('help.pro_tip_search', 'Nutzen Sie die Schnellsuche (Shortcut: Strg+F) auf dem Dashboard, um Wohnungen sofort nach Adresse oder Mieter zu filtern.')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                                <h4 className="font-black text-slate-700 text-xs uppercase tracking-widest mb-2">Profil & Sicherheit</h4>
                                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                                    Aktualisieren Sie Ihren <span className="font-bold">Anzeigenamen</span> im Profil. Für Passwortänderungen nutzen Sie die dedizierte Sicherheitsseite, die Sie über das Benutzermenü erreichen.
                                                </p>
                                            </div>
                                            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                                <h4 className="font-black text-slate-700 text-xs uppercase tracking-widest mb-2">Aktivitäts-Log</h4>
                                                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                                    Verfolgen Sie alle Änderungen an Objekten im <span className="font-bold">Benachrichtigungs-Center</span>. Hier sehen Sie, wer wann welche Aufgabe erledigt oder einen Status geändert hat.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Smart Logic Section */}
                                    <section className="space-y-6 border-t border-slate-100 pt-8">
                                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                                            <Zap className="w-5 h-5 text-yellow-500" />
                                            2. Intelligente Regeln
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-800">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-black text-xs uppercase tracking-widest text-slate-700">Checklist-Gate</h4>
                                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                                    Sie können eine Karte nur dann in die nächste Spalte verschieben, wenn <span className="font-bold text-slate-700 text-xs">alle Aufgaben</span> im aktuellen Abschnitt erledigt sind.
                                                </p>
                                            </div>
                                            <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-800">
                                                    <Clock className="w-5 h-5 text-yellow-600" />
                                                </div>
                                                <h4 className="font-black text-xs uppercase tracking-widest text-slate-700">Ampelsystem</h4>
                                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                                    Karten färben sich bei Inaktivität: <br />
                                                    - <span className="text-slate-800">Schwarz:</span> &lt; 7 Tage<br />
                                                    - <span className="text-yellow-600">Gelb:</span> &gt; 7 Tage<br />
                                                    - <span className="text-red-600 font-bold">Rot:</span> &gt; 15 Tage
                                                </p>
                                            </div>
                                            <div className="p-6 bg-slate-50 rounded-3xl space-y-3">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-800">
                                                    <History className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-black text-xs uppercase tracking-widest text-slate-700">Auto-Archiv</h4>
                                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                                    Abgeschlossene Wohnungen werden nach <span className="font-bold">30 Tagen automatisch versteckt</span>. Nutzen Sie den "Archiv anzeigen" Schalter, um sie zu sehen.
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {/* ADMIN TAB */}
                            {activeTab === 'admin' && (
                                <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                                    <header className="space-y-4">
                                        <div className="bg-purple-50 w-fit px-4 py-1.5 rounded-full text-purple-600 font-black text-[10px] uppercase tracking-widest border border-purple-100">
                                            Management & Kontrolle
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Admin-Privilegien</h2>
                                        <p className="text-slate-500 font-medium max-w-2xl">
                                            Als Administrator haben Sie erweiterte Rechte zur Steuerung des Gesamtsystems und zur Überbrückung von Standardregeln.
                                        </p>
                                    </header>

                                    <div className="space-y-4">
                                        {[
                                            { icon: <Lock className="w-5 h-5" />, title: 'Status-Override', desc: 'Admins können Wohnungen verschieben, auch wenn die Checkliste noch nicht vollständig ist. Ideal für Spezialfälle oder Korrekturen.' },
                                            { icon: <Shield className="w-5 h-5" />, title: 'Benutzer-Management', desc: 'Hinzufügen und Entfernen von Teammitgliedern. Vergabe von Rollen (Admin / Standard).' },
                                            { icon: <Zap className="w-5 h-5" />, title: 'System-Diagnose', desc: 'Zugriff auf automatisierte Integritätstests, um sicherzustellen, dass alle Geschäftsregeln im System korrekt laufen.' },
                                            { icon: <History className="w-5 h-5" />, title: 'Audit Logs', desc: 'Einsicht in alle Aktivitäten des gesamten Teams (Letzte 50 Aktionen) auf der Benachrichtigungsseite.' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-6 p-6 bg-white border-2 border-slate-50 rounded-3xl hover:border-purple-100 transition-all shadow-sm">
                                                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                                                    {item.icon}
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">{item.title}</h4>
                                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ERROR GUIDE TAB */}
                            {activeTab === 'errors' && (
                                <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                                    <header className="space-y-4">
                                        <div className="bg-red-50 w-fit px-4 py-1.5 rounded-full text-red-600 font-black text-[10px] uppercase tracking-widest border border-red-100">
                                            Fehlerbehebung
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Was bedeuten diese Fehler?</h2>
                                        <p className="text-slate-500 font-medium max-w-2xl">
                                            Hier finden Sie Erklärungen zu den häufigsten Systemmeldungen und wie Sie damit umgehen.
                                        </p>
                                    </header>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                title: 'Aufgaben noch nicht vollständig!',
                                                reason: 'Checklist-Gating blockiert den Vorwärtsschub.',
                                                solution: 'Bitte alle Checkboxen im aktuellen Abschnitt abhaken. Admins können dies ignorieren.'
                                            },
                                            {
                                                title: 'Sicherheits-Timeout / Recent Login Required',
                                                reason: 'Besonders kritische Aktionen (z.B. Passwortänderung) erfordern eine frische Anmeldung.',
                                                solution: 'Einmal abmelden und sofort wieder anmelden, dann die Aktion erneut durchführen.'
                                            },
                                            {
                                                title: 'E-Mail Adresse: "Gesperrt"',
                                                reason: 'Die E-Mail ist Ihr eindeutiger Schlüssel im System.',
                                                solution: 'Dies ist kein Fehler, sondern ein Sicherheitsfeature. E-Mail Änderungen müssen über den Admin beantragt werden.'
                                            },
                                            {
                                                title: 'Kein Zugriff auf Modul (403)',
                                                reason: 'Ihre aktuelle Rolle erlaubt den Zugriff auf diesen Bereich nicht.',
                                                solution: 'Kontaktieren Sie Ihren Teamleiter, falls Sie Admin-Rechte benötigen.'
                                            }
                                        ].map((error, i) => (
                                            <div key={i} className="p-8 border-2 border-slate-100 rounded-3xl bg-slate-50/30 space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                                                        <AlertCircle className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight pt-1">{error.title}</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-12">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Warum?</span>
                                                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{error.reason}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Lösung</span>
                                                        <p className="text-xs text-slate-600 font-bold leading-relaxed">{error.solution}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Footer Guide Footer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                    {/* Decorative Background Icon */}
                    <HelpCircle className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12" />

                    <div className="relative z-10 space-y-2">
                        <h4 className="text-xl font-black tracking-tight">Immer noch Fragen?</h4>
                        <p className="text-sm text-slate-400 font-medium">Unser internes System ist auf intuitive Bedienung ausgelegt.</p>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-3">
                            <MessageCircle className="w-5 h-5 text-blue-400" />
                            <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Support Portal</p>
                                <p className="text-xs font-bold">it-support@hit-flow.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <p className="text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.4em] pt-8">PropTerm documentation system • Strictly Confidential</p> */}
            </div>
        </div>
    );
};
