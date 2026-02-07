import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Trash2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext);

    const fetchHistory = async () => {
        if (!user || !user.token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('http://127.0.0.1:5000/api/history', config);
            setHistory(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching history:', error);
            setError(error.response?.data?.message || 'Failed to load history. Please ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = async () => {
        if (!window.confirm('Are you sure you want to clear your history?')) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete('http://127.0.0.1:5000/api/history', config);
            setHistory([]);
            setExpandedId(null);
            setError(null);
        } catch (error) {
            console.error('Error clearing history:', error);
            setError(error.response?.data?.message || 'Failed to clear history');
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [user, user?.token]); // Depend on user and user.token

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) return <div className="text-center mt-20 text-stone-500">Loading history...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <HistoryIcon className="text-blue-500" />
                    Your Learning Path
                </h1>
                {history.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="text-red-400 hover:text-red-300 flex items-center gap-2 text-sm px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 size={16} /> Clear History
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl mb-6 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={fetchHistory} className="text-sm font-bold underline hover:text-red-400">Retry</button>
                </div>
            )}

            {history.length === 0 ? (
                <div className="text-center py-20 text-slate-500 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                    <p>No history yet. Start exploring to create your library!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item._id} className="glass-panel overflow-hidden transition-all">
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => toggleExpand(item._id)}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-semibold text-lg text-white">{item.topic}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${item.level === 'Expert' ? 'border-purple-500 text-purple-400' :
                                            item.level === 'Kids' ? 'border-green-500 text-green-400' :
                                                'border-slate-600 text-slate-400'
                                            }`}>
                                            {item.level}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Calendar size={14} />
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                </div>

                                <div className="text-slate-400">
                                    {expandedId === item._id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </div>
                            </div>

                            {expandedId === item._id && (
                                <div className="px-6 pb-6 pt-2 border-t border-white/5 bg-slate-900/50 animate-fade-in">
                                    <MarkdownRenderer content={item.content} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
