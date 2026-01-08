import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Building2, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { loginWithFirebase, registerWithFirebase } from '@/lib/auth-logic';
import { useUISettings } from '@/store/useUISettings';

export const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state: any) => state.login);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const navigate = useNavigate();
    const settings = useUISettings(state => state.settings);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (name.trim() && password.trim()) {
            setLoading(true);
            try {
                if (auth && name.includes('@')) {
                    const profile = isRegistering
                        ? await registerWithFirebase(name, password)
                        : await loginWithFirebase(name, password);

                    login(name, profile.role);
                } else {
                    // Fallback for mock mode or username-only login
                    login(name, 'admin');
                }
                navigate('/');
            } catch (err: any) {
                console.error("Login error:", err);
                let message = err.message || "Anmeldung fehlgeschlagen.";
                if (message.includes('auth/configuration-not-found')) {
                    message = "Firebase Auth ist nicht richtig konfiguriert. Bitte 'Email/Passwort' im Firebase Console aktivieren.";
                }
                setError(message);
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
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                        {isRegistering ? "Konto erstellen" : settings.login.title}
                    </h1>
                    <p className="text-slate-400 font-medium">
                        {isRegistering ? "Starten Sie mit MietProzess" : settings.login.subtitle}
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Email-Adresse
                        </label>
                        <input
                            id="name"
                            type="email"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={settings.login.inputPlaceholder}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:font-medium placeholder:text-slate-300"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:font-medium placeholder:text-slate-300"
                            required
                        />
                        {error && <p className="text-red-500 text-xs font-bold mt-2 ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim() || !password.trim() || loading}
                        className="w-full bg-blue-600 text-white rounded-2xl py-4 font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-blue-200"
                    >
                        {loading ? 'Verarbeiten...' : (isRegistering ? 'Jetzt registrieren' : settings.login.button)}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>

                </form>

                <div className="mt-8 text-center space-y-4">
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        {isRegistering ? "Bereits ein Konto? Anmelden" : "Noch kein Konto? Hier registrieren"}
                    </button>
                    <p className="text-xs text-slate-300 font-bold">{settings.login.footer}</p>
                </div>
            </div>
        </div>
    );
};
