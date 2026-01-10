
import React, { useState, useEffect } from 'react';
import { runBusinessLogicTests, type TestResult } from '@/lib/tests';
import { Layout } from '@/components/dashboard/Layout';
import { CheckCircle, XCircle, Play, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TestRunnerPage = () => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [running, setRunning] = useState(false);

    const runTests = () => {
        setRunning(true);
        // Simulate slight delay for UX
        setTimeout(() => {
            const res = runBusinessLogicTests();
            setResults(res);
            setRunning(false);
        }, 800);
    };

    useEffect(() => {
        runTests();
    }, []);

    const allPassed = results.length > 0 && results.every(r => r.passed);

    return (
        <Layout onNewTermination={() => { }}>
            <div className="max-w-4xl mx-auto p-8">
                <div className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-xl overflow-hidden p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                                <ShieldCheck className="w-10 h-10 text-green-600" />
                                System Integrity Checks
                            </h1>
                            <p className="text-slate-500 font-bold mt-2 ml-14">Automated Business Logic Verification</p>
                        </div>
                        <Button
                            onClick={runTests}
                            disabled={running}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-blue-200"
                        >
                            <Play className={`w-5 h-5 ${running ? 'animate-spin' : ''}`} />
                            {running ? 'Vefifying...' : 'Rerun Tests'}
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {results.map((test, idx) => (
                            <div
                                key={idx}
                                className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${test.passed
                                        ? 'bg-green-50/50 border-green-100'
                                        : 'bg-red-50/50 border-red-100'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${test.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {test.passed ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-800 text-lg">{test.name}</h3>
                                        <p className={`font-medium ${test.passed ? 'text-green-700' : 'text-red-700'}`}>
                                            {test.message}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${test.passed ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                    }`}>
                                    {test.passed ? 'PASSED' : 'FAILED'}
                                </div>
                            </div>
                        ))}
                    </div>

                    {results.length > 0 && (
                        <div className={`mt-8 p-6 rounded-2xl text-center font-black text-xl uppercase tracking-widest ${allPassed ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-red-600 text-white'
                            }`}>
                            {allPassed ? 'All Systems Operational' : 'Integrity Issues Detected'}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
