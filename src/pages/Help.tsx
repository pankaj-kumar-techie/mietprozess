import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Help = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all font-bold text-slate-700"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Zurück zum Dashboard
                </button>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <h1 className="text-4xl font-black text-slate-800 mb-4">
                        Wie HIT Flow funktioniert
                    </h1>
                    <p className="text-slate-600 mb-8">
                        Eine kurze Anleitung zur Verwendung von HIT Flow
                    </p>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 mb-3">Dashboard & Kanban</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Die Hauptansicht ist ein Kanban-Board, auf dem Sie Wohnungen per Drag & Drop zwischen den Status verschieben können (In Kündigung, In Vermietung, Vertrag erstellt, Übergabe). Statusänderungen sind an die Vervollständigung der Checkliste gebunden.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-slate-800 mb-3">Wohnungsdetails</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Durch Klicken auf eine Karte öffnet sich das Detailmodal. Hier können Sie die Stammdaten bearbeiten, die dynamische Checkliste verwalten und Kommentare hinzufügen.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-slate-800 mb-3">Checklisten-Logik</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Die Checkliste ist dynamisch. Das Abschließen bestimmter Aufgaben (wie "Vertrag unterschrieben") löst automatische Popups aus (z.B. Abfrage des neuen Mieters).
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-slate-800 mb-3">Architektur (Für Entwickler)</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Erstellt mit React + Vite + Zustand + Firebase. Komponenten sind atomar und wiederverwendbar. Textinhalte sind in `content.ts` zentralisiert für einfache Updates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
