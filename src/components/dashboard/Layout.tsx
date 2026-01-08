import React from 'react';
import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
    onNewTermination: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNewTermination }) => {
    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans antialiased text-slate-900">
            <Header onNewTermination={onNewTermination} />
            <main className="flex-1 flex flex-col min-h-0">
                {children}
            </main>
        </div>
    );
};
