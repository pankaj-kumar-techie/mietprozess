
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Building2, ArrowRight } from 'lucide-react';
import { loginWithFirebase } from '@/lib/auth-logic';
import APP_CONFIG from '@/config/app.config';
import { useTranslation } from 'react-i18next';

export const Login = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state: any) => state.login);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const getFriendlyErrorMessage = (error: any) => {
        // Safe access to error message
        const msg = error?.code || error?.message || String(error);
        if (msg.includes('network-request-failed') || msg.includes('network')) {
            return APP_CONFIG.ui.text.errors.network.firebase;
        }
        if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
            return t('login.error_credentials', 'E-Mail oder Passwort falsch. Bitte versuchen Sie es erneut.');
        }
        if (msg.includes('too-many-requests')) {
            return t('login.error_too_many_requests', 'Zu viele Versuche. Bitte warten Sie einen Moment.');
        }
        return t('login.error_generic', 'Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Eingaben.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const userProfile = await loginWithFirebase(email, password);
            if (userProfile) {
                login(userProfile);
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(getFriendlyErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 border-4 border-slate-50">
                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mb-6 shadow-lg shadow-green-200 transform hover:rotate-3 transition-transform duration-300">
                            <Building2 className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">
                            {APP_CONFIG.app.name}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            {APP_CONFIG.app.description}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 rounded-2xl animate-shake">
                            <p className="text-red-600 text-sm font-bold text-center">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                {APP_CONFIG.ui.text.login.emailPlaceholder}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder:text-slate-300"
                                placeholder="name@firma.de"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                {APP_CONFIG.ui.text.login.passwordPlaceholder}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder:text-slate-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest mt-4"
                        >
                            {loading ? t('login.loading', 'Anmelden...') : APP_CONFIG.ui.text.login.loginButton}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    {/* Google Login Removed */}

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-300 font-bold">{APP_CONFIG.app.copyright}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
