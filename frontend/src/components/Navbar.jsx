import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Compass, History as HistoryIcon, User } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import LanguageContext from '../context/LanguageContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { language, setLanguage, languages } = useContext(LanguageContext);
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path ? 'text-blue-400 bg-white/5' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5';

    return (
        <nav className="sticky top-4 z-50 mx-4 glass-panel px-6 py-4 flex items-center justify-between mb-8 border-slate-700/50">
            <div className="flex items-center gap-8">
                <Link to="/" className="text-2xl font-bold text-white tracking-tight">
                    Depthly
                </Link>
                <div className="flex gap-2">
                    <Link to="/explore" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive('/explore')}`}>
                        <Compass size={18} />
                        <span>Explore</span>
                    </Link>
                    <Link to="/history" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive('/history')}`}>
                        <HistoryIcon size={18} />
                        <span>History</span>
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-slate-800 border-none text-sm text-white rounded-lg px-3 py-1 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                >
                    {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>

                <div className="h-6 w-px bg-white/10"></div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden md:inline">{user.name}</span>
                    </div>
                    <button onClick={logout} className="p-2 text-slate-400 hover:text-blue-400 transition-colors" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
