import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-3xl shadow-2xl border-4 border-slate-100 p-12 text-center">
                    {/* Error Icon */}
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-12 h-12 text-red-600" />
                    </div>

                    {/* Error Code */}
                    <h1 className="text-8xl font-black text-slate-800 mb-4">404</h1>

                    {/* Error Message */}
                    <h2 className="text-3xl font-black text-slate-800 mb-3">
                        Seite nicht gefunden
                    </h2>
                    <p className="text-lg text-slate-600 font-medium mb-8">
                        Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => navigate('/dashboard')}
                            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl h-12 px-8 font-bold shadow-lg hover:shadow-xl"
                        >
                            <Home className="w-5 h-5" />
                            Zum Dashboard
                        </Button>
                        <Button
                            onClick={() => navigate(-1)}
                            variant="outline"
                            className="border-2 rounded-xl h-12 px-8 font-bold"
                        >
                            Zurück
                        </Button>
                    </div>

                    {/* Help Text */}
                    <div className="mt-8 pt-8 border-t-2 border-slate-100">
                        <p className="text-sm text-slate-500 font-medium">
                            Wenn Sie glauben, dass dies ein Fehler ist, wenden Sie sich bitte an den Support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
