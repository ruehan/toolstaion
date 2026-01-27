
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Image, 
  Type, 
  Code, 
  Wrench, 
  Menu, 
  X, 
  Sun, 
  Moon,
  ChevronRight,
  Languages,
  Shield,
  FileText,
  Info,
  Activity
} from 'lucide-react';
import HomeView from './pages/HomeView';
import ToolDetailView from './pages/ToolDetailView';
import LegalView from './pages/LegalView';
import { useLanguage } from './LanguageContext';
import Logo from './components/Logo';
import { TOOLS } from './constants';

// Define NavLink to fix "Cannot find name 'NavLink'" errors
const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
      active 
        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' 
        : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
    }`}
  >
    <span className={active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>{icon}</span>
    <span>{label}</span>
  </Link>
);

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    let title = 'ToolStation - All-in-One Utility Hub';
    let description = t('app.desc');

    if (location.pathname.startsWith('/tool/')) {
      const toolId = location.pathname.split('/').pop();
      const tool = TOOLS.find(tool => tool.id === toolId);
      if (tool) {
        title = `${tool.name[lang]} | ToolStation`;
        description = tool.description[lang];
      }
    } else if (location.pathname.startsWith('/category/')) {
      const cat = location.pathname.split('/').pop();
      title = `${t(`nav.${cat}`)} | ToolStation`;
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
  }, [location, lang, t]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    setSidebarOpen(false);
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  }, [location]);

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden text-slate-900 dark:text-slate-100">
      <header className="h-14 shrink-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden transition-colors"
              aria-label="Menu"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
              className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-all border border-transparent active:scale-95"
              aria-label="Switch Language"
            >
              <Languages size={12} className="group-hover:rotate-12 transition-transform" />
              {lang === 'ko' ? 'ENGLISH' : '한국어'}
            </button>

            <button 
              onClick={() => setDarkMode(!isDarkMode)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`fixed inset-y-0 left-0 z-40 w-60 transform bg-white dark:bg-slate-900 dark:border-slate-800 border-r p-4 flex flex-col gap-1.5 transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <NavLink to="/" icon={<Home size={16} />} label={t('nav.home')} active={location.pathname === '/'} />
          
          <nav className="mt-4 mb-2 flex flex-col gap-1">
            <div className="px-2 mb-1 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t('nav.categories')}</div>
            <NavLink to="/category/image" icon={<Image size={16} />} label={t('nav.image')} active={location.pathname === '/category/image'} />
            <NavLink to="/category/text" icon={<Type size={16} />} label={t('nav.text')} active={location.pathname === '/category/text'} />
            <NavLink to="/category/dev" icon={<Code size={16} />} label={t('nav.dev')} active={location.pathname === '/category/dev'} />
            <NavLink to="/category/utility" icon={<Wrench size={16} />} label={t('nav.utility')} active={location.pathname === '/category/utility'} />
          </nav>

          <div className="mt-auto space-y-1 pt-4 border-t dark:border-slate-800">
             <NavLink to="/about" icon={<Info size={16} />} label={t('nav.about')} active={location.pathname === '/about'} />
             <NavLink to="/privacy" icon={<Shield size={16} />} label={t('nav.privacy')} active={location.pathname === '/privacy'} />
          </div>
        </aside>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 overflow-y-auto relative bg-white dark:bg-slate-950">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/category/:category" element={<HomeView />} />
            <Route path="/tool/:id" element={<ToolDetailView />} />
            <Route path="/about" element={<LegalView type="about" />} />
            <Route path="/privacy" element={<LegalView type="privacy" />} />
            <Route path="/terms" element={<LegalView type="terms" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
