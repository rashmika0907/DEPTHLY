import { useState, useRef, useContext } from 'react';
import { Send, StopCircle, Copy, Check } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import LanguageContext from '../context/LanguageContext';
import MarkdownRenderer from '../components/MarkdownRenderer';

const Explore = () => {
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState('Intermediate');
    const [content, setContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const abortControllerRef = useRef(null);

    const { user } = useContext(AuthContext);
    const { language } = useContext(LanguageContext);

    const levels = ['Kids', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!topic) return;

        setIsGenerating(true);
        setContent('');
        setCopied(false);

        // Create new AbortController
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch('http://127.0.0.1:5000/api/gemini/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Assuming token is expected in body based on backend implementation
                },
                body: JSON.stringify({
                    topic,
                    level,
                    language,
                    token: user.token // Passing token in body as implemented in backend
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) throw new Error(response.statusText);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Buffer to hold incomplete data
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split('\n\n');
                // Keep the last part in the buffer as it might be incomplete
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);
                        if (!dataStr || dataStr.trim() === '') continue;

                        try {
                            const data = JSON.parse(dataStr);
                            if (data.chunk) {
                                setContent(prev => prev + data.chunk);
                            }
                            if (data.done) {
                                setIsGenerating(false);
                            }
                            if (data.error) {
                                console.error(data.error);
                                setContent(prev => prev + `\n\n**Error: ${data.error}**`);
                                setIsGenerating(false);
                            }
                        } catch (e) {
                            console.error('Error parsing JSON chunk', e);
                        }
                    }
                }
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Generation stopped by user');
            } else {
                console.error('Generation Error:', error);
                setContent(prev => prev + '\n\n**Error encountered during generation.**');
            }
            setIsGenerating(false);
        }
    };

    const stopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">

            {/* Input Section */}
            <div className="mb-12 text-center animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 py-2">
                    Dive Deeper.
                </h1>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto text-lg">
                    Choose a topic and a complexity level to generate a custom explanation tailored to your needs.
                </p>

                <form onSubmit={handleGenerate} className="glass-panel p-6 shadow-2xl shadow-blue-900/10">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="What do you want to learn today?"
                            className="input-primary flex-1 text-lg"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            disabled={isGenerating}
                        />
                        <button
                            type="submit"
                            disabled={isGenerating || !topic}
                            className="btn-primary flex items-center justify-center gap-2 md:w-auto w-full"
                        >
                            {isGenerating ? 'Thinking...' : 'Explain'}
                            {!isGenerating && <Send size={18} />}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                        {levels.map((lvl) => (
                            <button
                                key={lvl}
                                type="button"
                                onClick={() => setLevel(lvl)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${level === lvl
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </form>
            </div>

            {/* Output Section */}
            {(content || isGenerating) && (
                <div className="animate-slide-up">
                    <div className="glass-panel p-8 min-h-[200px] relative group">
                        {/* Header Actions */}
                        <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-blue-400 font-bold text-sm tracking-wider uppercase">{level}</span>
                                <span className="text-slate-600 text-xs">•</span>
                                <span className="text-slate-500 text-xs uppercase">{language}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {isGenerating ? (
                                    <button
                                        onClick={stopGeneration}
                                        className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 transition-colors"
                                    >
                                        <StopCircle size={14} /> Stop
                                    </button>
                                ) : (
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative">
                            <MarkdownRenderer content={content} />
                            {isGenerating && (
                                <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse align-middle"></span>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Explore;
