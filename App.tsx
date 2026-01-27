
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
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
  Info
} from 'lucide-react';
import HomeView from './pages/HomeView';
import ToolDetailView from './pages/ToolDetailView';
import LegalView from './pages/LegalView';
import { useLanguage } from './LanguageContext';
import Logo from './components/Logo';
import { TOOLS } from './constants';

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  // Dynamic SEO Title & Meta Update
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
      <header className="h-16 shrink-0 z-50 w-full border-b bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden"
              aria-label="Menu"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <Logo size="md" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-all border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
              aria-label="Switch Language"
            >
              <Languages size={14} />
              {lang === 'ko' ? 'EN' : 'KO'}
            </button>

            <button 
              onClick={() => setDarkMode(!isDarkMode)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex w-64 shrink-0 border-r bg-white dark:bg-slate-900 dark:border-slate-800 p-4 flex-col gap-2 overflow-y-auto">
          <NavLink to="/" icon={<Home size={18} />} label={t('nav.home')} active={location.pathname === '/'} />
          
          <nav className="mt-4 mb-2 flex flex-col gap-1">
            <div className="px-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t('nav.categories')}</div>
            <NavLink to="/category/image" icon={<Image size={18} />} label={t('nav.image')} active={location.pathname.includes('/image')} />
            <NavLink to="/category/text" icon={<Type size={18} />} label={t('nav.text')} active={location.pathname.includes('/text')} />
            <NavLink to="/category/dev" icon={<Code size={18} />} label={t('nav.dev')} active={location.pathname.includes('/dev')} />
            <NavLink to="/category/utility" icon={<Wrench size={18} />} label={t('nav.utility')} active={location.pathname.includes('/utility')} />
          </nav>
          
          <nav className="mt-8 mb-2 flex flex-col gap-1">
            <div className="px-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t('nav.resources')}</div>
            <NavLink to="/about" icon={<Info size={18} />} label={t('nav.about')} active={location.pathname === '/about'} />
            <NavLink to="/privacy" icon={<Shield size={18} />} label={t('nav.privacy')} active={location.pathname === '/privacy'} />
            <NavLink to="/terms" icon={<FileText size={18} />} label={t('nav.terms')} active={location.pathname === '/terms'} />
          </nav>
          
          <footer className="mt-auto pt-6 border-t dark:border-slate-800">
             <p className="px-3 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{t('footer.rights')}</p>
             <p className="px-3 mt-1 text-[9px] text-slate-500 font-bold">{t('footer.contact')}</p>
          </footer>
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col gap-8">
                <Logo size="md" />
                <nav className="flex flex-col gap-2">
                  <NavLink to="/" icon={<Home size={20} />} label={t('nav.home')} active={location.pathname === '/'} />
                  <NavLink to="/category/image" icon={<Image size={20} />} label={t('nav.image')} active={location.pathname.includes('/image')} />
                  <NavLink to="/category/text" icon={<Type size={20} />} label={t('nav.text')} active={location.pathname.includes('/text')} />
                  <NavLink to="/category/dev" icon={<Code size={20} />} label={t('nav.dev')} active={location.pathname.includes('/dev')} />
                  <NavLink to="/category/utility" icon={<Wrench size={20} />} label={t('nav.utility')} active={location.pathname.includes('/utility')} />
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                  <NavLink to="/about" icon={<Info size={20} />} label={t('nav.about')} active={location.pathname === '/about'} />
                  <NavLink to="/privacy" icon={<Shield size={20} />} label={t('nav.privacy')} active={location.pathname === '/privacy'} />
                </nav>
            </aside>
          </div>
        )}

        <main className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-950 flex flex-col overflow-y-auto overflow-x-hidden relative">
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

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
      active 
        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 font-black shadow-sm' 
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 hover:text-indigo-600'
    }`}
    aria-current={active ? 'page' : undefined}
  >
    <div className={active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
      {icon}
    </div>
    <span className="text-[13px] font-bold">{label}</span>
    {active && <ChevronRight className="ml-auto" size={14} />}
  </Link>
);

export default App;
