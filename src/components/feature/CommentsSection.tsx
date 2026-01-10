import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import type { Apartment } from '@/types';
import { useNotificationStore } from '@/store/useNotificationStore';

interface CommentsSectionProps {
    apartment: Apartment;
    onAddComment: (text: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ apartment, onAddComment }) => {
    const [newCommentText, setNewCommentText] = useState('');
    const addNotification = useNotificationStore(state => state.addNotification);

    const sortedComments = useMemo(() => {
        return apartment.comments ? [...apartment.comments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];
    }, [apartment.comments]);

    const handleSubmit = () => {
        if (newCommentText.trim()) {
            onAddComment(newCommentText);
            setNewCommentText('');
            addNotification('Kommentar hinzugefügt', 'success');
        }
    };

    const formatDateTime = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return format(date, 'dd.MM.yyyy HH:mm');
    };

    return (
        <section className="mt-16 space-y-8">
            <h4 className="text-2xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter">
                <MessageSquare className="w-8 h-8 text-indigo-500" />
                Kommentare
            </h4>
            <div className="space-y-6">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        placeholder="Nachricht an das Team..."
                        className="flex-1 p-4 border-2 border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                    />
                    <button onClick={handleSubmit} className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95 uppercase tracking-widest">
                        Senden
                    </button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {sortedComments.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 font-medium italic border-2 border-dashed border-slate-200 rounded-3xl">Noch keine Kommentare vorhanden.</div>
                    ) : sortedComments.map((c, i) => (
                        <div key={i} className="bg-white p-5 rounded-3xl border-2 border-slate-50 shadow-sm group hover:border-indigo-100 transition-all">
                            <p className="text-slate-800 font-medium leading-relaxed mb-3">{c.text}</p>
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <span className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                    {c.author || c.user}
                                    {c.authorEmail && (
                                        <span className="text-[9px] normal-case opacity-70">({c.authorEmail})</span>
                                    )}
                                </span>
                                <span>{formatDateTime(c.timestamp)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
