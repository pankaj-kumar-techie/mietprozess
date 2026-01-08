import { useNavigate } from 'react-router-dom';
import { CONTENT } from '@/lib/content';
import { ArrowLeft, BookOpen, Layers, CheckCircle } from 'lucide-react';

export const Help = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-blue-600 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    {CONTENT.help.backButton}
                </button>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter mb-4">{CONTENT.help.title}</h1>
                    <p className="text-xl text-slate-500 font-medium">{CONTENT.help.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CONTENT.help.sections.map((section, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                {idx === 0 && <Layers className="w-6 h-6" />}
                                {idx === 1 && <BookOpen className="w-6 h-6" />}
                                {idx === 2 && <CheckCircle className="w-6 h-6" />}
                                {idx >= 3 && <Layers className="w-6 h-6" />}
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-3">{section.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">{section.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
