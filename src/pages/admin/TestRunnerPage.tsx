
import React, { useState, useEffect } from 'react';
import { runBusinessLogicTests, type TestResult } from '@/lib/tests';
import { Layout } from '@/components/dashboard/Layout';
import { CheckCircle, XCircle, Play, ShieldCheck, Wifi, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export const TestRunnerPage = () => {
    const [logicResults, setLogicResults] = useState<TestResult[]>([]);
    const [running, setRunning] = useState(false);

    // System Health States
    const [networkStatus, setNetworkStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

    // Data Seeding State
    const [seeding, setSeeding] = useState(false);

    const checkSystemHealth = async () => {
        setNetworkStatus('checking');
        setDbStatus('checking');

        // 1. Check Network
        if (navigator.onLine) {
            setNetworkStatus('online');
        } else {
            setNetworkStatus('offline');
        }

        // 2. Check Firebase Connection
        if (!db) {
            setDbStatus('error');
            return;
        }

        try {
            // Try to fetch 1 document from apartments to verify read access
            const q = query(collection(db, 'apartments'), limit(1));
            await getDocs(q);
            setDbStatus('connected');
        } catch (error) {
            console.error('DB Connection Failed:', error);
            setDbStatus('error');
        }
    };

    const runTests = () => {
        setRunning(true);
        checkSystemHealth();

        // Simulate slight delay for UX
        setTimeout(() => {
            const res = runBusinessLogicTests();
            setLogicResults(res);
            setRunning(false);
        }, 800);
    };

    const handleSeedData = async () => {
        if (!confirm('Achtung: Dies fügt Testdaten hinzu. Fortfahren?')) return;

        setSeeding(true);
        try {
            const { seedDatabase } = await import('@/services/adminService');
            await seedDatabase();
            alert('Daten erfolgreich generiert!');
        } catch (e) {
            console.error(e);
            alert('Fehler beim Generieren der Daten.');
        } finally {
            setSeeding(false);
        }
    };

    useEffect(() => {
        runTests();
    }, []);

    const allPassed = logicResults.length > 0 && logicResults.every(r => r.passed) && networkStatus === 'online' && dbStatus === 'connected';

    return (
        <Layout onNewTermination={() => { }}>
            <div className="max-w-5xl mx-auto p-8 font-sans">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                            <ShieldCheck className="w-10 h-10 text-blue-600" />
                            System-Diagnose & Tools
                        </h1>
                        <p className="text-slate-500 font-bold mt-2 ml-14">Integritätsprüfung & Wartung</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleSeedData}
                            disabled={seeding}
                            variant="outline"
                            className="border-2 border-purple-100 bg-purple-50 text-purple-700 font-bold hover:bg-purple-100"
                        >
                            {seeding ? 'Lade Daten...' : 'Testdaten laden'}
                        </Button>
                        <Button
                            onClick={runTests}
                            disabled={running}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200"
                        >
                            <Play className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
                            {running ? 'Prüfe System...' : 'Diagnose starten'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Connectivity & Health */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-slate-800">Verbindungsstatus</h2>

                        {/* Network Status */}
                        <div className={`p-6 rounded-2xl border-2 flex items-center gap-4 ${networkStatus === 'online' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${networkStatus === 'online' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                <Wifi className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Internetverbindung</h3>
                                <p className={`text-sm font-medium ${networkStatus === 'online' ? 'text-green-600' : 'text-red-500'}`}>
                                    {networkStatus === 'checking' ? 'Prüfe...' : networkStatus === 'online' ? 'Verbunden' : 'Keine Verbindung'}
                                </p>
                            </div>
                        </div>

                        {/* Database Status */}
                        <div className={`p-6 rounded-2xl border-2 flex items-center gap-4 ${dbStatus === 'connected' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dbStatus === 'connected' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Firebase Datenbank</h3>
                                <p className={`text-sm font-medium ${dbStatus === 'connected' ? 'text-green-600' : 'text-red-500'}`}>
                                    {dbStatus === 'checking' ? 'Prüfe...' : dbStatus === 'connected' ? 'Erreichbar (Lesezugriff OK)' : 'Verbindungsfehler'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Logic Tests */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-slate-800">Geschäftslogik (Automated)</h2>
                        <div className="space-y-3">
                            {logicResults.map((test, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${test.passed
                                        ? 'bg-white border-green-100 shadow-sm'
                                        : 'bg-red-50 border-red-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${test.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {test.passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-700 text-sm">{test.name}</h3>
                                            {!test.passed && (
                                                <p className="text-xs text-red-600 mt-1">{test.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${test.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {test.passed ? 'OK' : 'FAIL'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Banner */}
                {logicResults.length > 0 && (
                    <div className={`mt-8 p-6 rounded-2xl text-center font-black text-xl uppercase tracking-widest transition-all ${allPassed ? 'bg-green-600 text-white shadow-xl shadow-green-200' : 'bg-red-600 text-white'
                        }`}>
                        {allPassed ? 'System Status: Operational' : 'Achtung: Systemfehler gefunden'}
                    </div>
                )}
            </div>
        </Layout>
    );
};
