
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowRight, Star, Grid3X3, Zap, ShieldCheck, History, Construction, Sparkles, Activity, FileText, HardDrive, ChevronRight } from 'lucide-react';
import { TOOLS } from '../constants';
import { Category } from '../types';
import { useLanguage } from '../LanguageContext';
import AdSlot from '../components/AdSlot';

interface LocalStats {
  toolsUsed: number;
  charsProcessed: number;
  storageSaved: number;
}

const HomeView: React.FC = () => {
  const { category } = useParams<{ category: Category }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentToolIds, setRecentToolIds] = useState<string[]>([]);
  const [stats, setStats] = useState<LocalStats>({ toolsUsed: 0, charsProcessed: 0, storageSaved: 0 });
  const { lang, t } = useLanguage();

  useEffect(() => {
    const savedTools = localStorage.getItem('recentTools');
    if (savedTools) setRecentToolIds(JSON.parse(savedTools));

    const savedStats = localStorage.getItem('toolstation_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const name = tool.name[lang].toLowerCase();
      const desc = tool.description[lang].toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = name.includes(query) || desc.includes(query);
      const matchesCategory = !category || tool.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, searchQuery, lang]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getThemeColorClass = (color?: string) => {
    const colors: Record<string, string> = {
      purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 group-hover:bg-purple-600',
      indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 group-hover:bg-indigo-600',
      blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-600',
      cyan: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 group-hover:bg-cyan-600',
      emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-600',
      pink: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20 group-hover:bg-pink-600',
      orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-600',
      teal: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20 group-hover:bg-teal-600',
      rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 group-hover:bg-rose-600',
      violet: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20 group-hover:bg-violet-600',
      amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 group-hover:bg-amber-600',
    };
    return colors[color || 'indigo'];
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-950 overflow-y-auto">
      {/* Reduced Hero Section with Side Ad */}
      <section className="shrink-0 relative overflow-hidden border-b dark:border-slate-900 bg-white dark:bg-slate-950">
        <div className="absolute inset-0 hero-pattern opacity-40" />
        <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-12 md:pt-16 md:pb-16 flex flex-col lg:flex-row items-center gap-12">
          {/* Main Content Column */}
          <div className="flex-1 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50/80 dark:bg-indigo-900/30 backdrop-blur-xl border border-indigo-100/50 dark:border-indigo-800/50 rounded-xl shadow-sm">
               <ShieldCheck size={16} className="text-indigo-600 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">{t('app.safe_info')}</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
                {category ? t(`nav.${category}`) : (
                  lang === 'ko' ? (
                    <>모든 도구를 <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">한 곳에서</span></>
                  ) : (
                    <><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">Station</span> for every utility</>
                  )
                )}
              </h1>
              <p className="text-base md:text-lg font-bold text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                {t('app.desc')}
              </p>
            </div>

            <div className="relative group max-w-2xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur-xl opacity-10 group-focus-within:opacity-20 transition duration-700" />
              <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2rem] shadow-xl overflow-hidden transition-all duration-500 focus-within:scale-[1.01]">
                <Search className="ml-6 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder={t('app.search_placeholder')}
                  className="w-full pl-4 pr-16 py-5 bg-transparent outline-none dark:text-white text-lg font-black placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Hero Side Ad */}
          <div className="hidden lg:block w-80 shrink-0">
            <AdSlot type="square" className="h-64 shadow-inner" />
          </div>
        </div>
      </section>

      {/* Activity Dashboard */}
      {!category && !searchQuery && (
        <section className="px-6 md:px-16 py-12 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                <Activity size={20} className="animate-pulse" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">{t('stats.title')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                icon={<Zap size={24} />} 
                label={t('stats.tools_used')} 
                value={stats.toolsUsed} 
                subValue="Times"
                gradient="from-indigo-600 to-blue-600" 
              />
              <StatCard 
                icon={<FileText size={24} />} 
                label={t('stats.chars_processed')} 
                value={stats.charsProcessed.toLocaleString()} 
                subValue="Chars"
                gradient="from-purple-600 to-pink-600" 
              />
              <StatCard 
                icon={<HardDrive size={24} />} 
                label={t('stats.storage_saved')} 
                value={formatSize(stats.storageSaved)} 
                subValue="Space"
                gradient="from-emerald-600 to-teal-600" 
              />
            </div>
          </div>
        </section>
      )}

      {/* Tools Grid Section */}
      <section className="px-6 md:px-16 pt-12 pb-32 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-md border dark:border-slate-800">
                <Grid3X3 size={24} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {category ? t(`nav.${category}`) : t('app.popular_tools')}
                </h2>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {t('app.tools_active')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                lang={lang} 
                t={t} 
                colorClass={getThemeColorClass(tool.themeColor)}
              />
            ))}
          </div>
        </div>

        {/* Bottom Ad Slot */}
        <div className="max-w-7xl mx-auto mt-20">
          <AdSlot type="banner" className="h-32 md:h-48" />
        </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, subValue: string, gradient: string }> = ({ icon, label, value, subValue, gradient }) => (
  <div className="group relative p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.05] group-hover:opacity-[0.1] transition-opacity rounded-full -mr-16 -mt-16`} />
    <div className="relative z-10 space-y-6">
      <div className={`p-4 bg-gradient-to-br ${gradient} text-white rounded-xl w-fit shadow-lg group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{subValue}</span>
        </div>
      </div>
    </div>
  </div>
);

const ToolCard: React.FC<{ tool: any, lang: string, t: any, colorClass: string }> = ({ tool, lang, t, colorClass }) => {
  const isAI = tool.id.includes('ai-');
  return (
    <Link 
      to={`/tool/${tool.id}`}
      className={`group relative p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 transition-all duration-500 flex flex-col justify-between overflow-hidden hover:border-indigo-500 hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.15)] hover:-translate-y-2 ${
        tool.disabled ? 'opacity-70 grayscale' : ''
      }`}
    >
      <div className="absolute top-6 right-6 z-20">
        {isAI && !tool.disabled && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg animate-pulse">
             <Sparkles size={10} /> {t('common.beta')}
          </div>
        )}
      </div>

      <div className="space-y-10">
        <div className={`p-6 rounded-2xl w-fit transition-all duration-500 group-hover:text-white group-hover:rotate-[8deg] ${colorClass}`}>
          {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 36 })}
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-indigo-600 transition-colors">
            {tool.name[lang]}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-bold">
            {tool.description[lang]}
          </p>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
          {t('common.launch')} <ArrowRight size={14} />
        </div>
        <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">
           <ChevronRight size={14} />
        </div>
      </div>
    </Link>
  );
};

export default HomeView;
