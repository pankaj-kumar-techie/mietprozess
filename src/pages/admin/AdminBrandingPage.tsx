
import APP_CONFIG from '@/config/app.config';

export const AdminBrandingPage = () => {
    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl border-4 border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                        <h1 className="text-3xl font-black mb-1">Branding Settings</h1>
                        <p className="text-purple-100 font-medium">UI Customization (Static Config)</p>
                    </div>

                    <div className="p-8">
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                            <p className="text-sm text-blue-800 font-medium">
                                <strong className="font-black">Note:</strong> UI customization is managed via a central configuration file.
                                All strings and settings are defined in <code className="bg-blue-100 px-2 py-1 rounded">src/config/app.config.ts</code>
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 mb-4">Current Static Configuration</h2>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <h3 className="text-sm font-black text-slate-600 mb-2">Header Settings</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-bold">App Name:</span> {APP_CONFIG.app.name}</p>
                                            <p><span className="font-bold">New Button:</span> {APP_CONFIG.ui.text.header.newTermination}</p>
                                            <p><span className="font-bold">Export:</span> {APP_CONFIG.ui.text.header.export}</p>
                                            <p><span className="font-bold">Help:</span> {APP_CONFIG.ui.text.header.help}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <h3 className="text-sm font-black text-slate-600 mb-2">Login Page Settings</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-bold">Email Placeholder:</span> {APP_CONFIG.ui.text.login.emailPlaceholder}</p>
                                            <p><span className="font-bold">Password Placeholder:</span> {APP_CONFIG.ui.text.login.passwordPlaceholder}</p>
                                            <p><span className="font-bold">Login Button:</span> {APP_CONFIG.ui.text.login.loginButton}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                                <p className="text-sm text-orange-800 font-medium">
                                    <strong className="font-black">To Change Branding:</strong> Edit the <code className="bg-orange-100 px-2 py-1 rounded">APP_CONFIG</code> object in <code className="bg-orange-100 px-2 py-1 rounded">src/config/app.config.ts</code> and rebuild.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
