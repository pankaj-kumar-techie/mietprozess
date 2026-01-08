import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Building2, ArrowRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import { verifyWhitelist } from '@/lib/auth-logic';
import { useUISettings } from '@/store/useUISettings';

export const Login = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state: any) => state.login);
    const navigate = useNavigate();
    const settings = useUISettings(state => state.settings);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (name.trim()) {
            setLoading(true);
            try {
                // If Firebase is configured (API Key is present), we can do a whitelist check
                // We treat names with '@' as email attempts for production mode
                if (db && name.includes('@')) {
                    const profile = await verifyWhitelist(name);
                    if (!profile) {
                        setError("Diese Email-Adresse ist nicht autorisiert.");
                        setLoading(false);
                        return;
                    }
                    login(name, profile.role);
                } else {
                    login(name, 'admin'); // Default for mock mode
                }
                navigate('/');
            } catch (err) {
                console.error("Login error:", err);
                setError("Anmeldung fehlgeschlagen.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 w-full max-w-md border border-slate-100 animate-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-6 rotate-3">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">{settings.login.title}</h1>
                    <p className="text-slate-400 font-medium">{settings.login.subtitle}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            {db ? "Email-Adresse" : "Benutzername"}
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={settings.login.inputPlaceholder}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:font-medium placeholder:text-slate-300"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-xs font-bold mt-2 ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim() || loading}
                        className="w-full bg-blue-600 text-white rounded-2xl py-4 font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-blue-200"
                    >
                        {loading ? 'Anmelden...' : settings.login.button}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>

                </form>

                <div className="mt-12 text-center">
                    <p className="text-xs text-slate-300 font-bold">{settings.login.footer}</p>
                </div>
            </div>
        </div>
    );
};
