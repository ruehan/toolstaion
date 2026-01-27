
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowRight, Star, Grid3X3, Zap, ShieldCheck, History, Construction } from 'lucide-react';
import { TOOLS } from '../constants';
import { Category } from '../types';
import { useLanguage } from '../LanguageContext';
import AdSlot from '../components/AdSlot';

const HomeView: React.FC = () => {
  const { category } = useParams<{ category: Category }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentToolIds, setRecentToolIds] = useState<string[]>([]);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem('recentTools');
    if (saved) {
      setRecentToolIds(JSON.parse(saved));
    }
  }, []);

  const recentTools = useMemo(() => {
    return recentToolIds
      .map(id => TOOLS.find(t => t.id === id))
      .filter((t): t is typeof TOOLS[0] => !!t);
  }, [recentToolIds]);

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

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-700">
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">
        {category ? `${t(`nav.${category}`)} - ToolStation` : "ToolStation - Free Private Utility Hub"}
      </h1>

      {/* Premium Hero Section */}
      <section className="shrink-0 relative overflow-hidden bg-white dark:bg-slate-950 border-b dark:border-slate-900">
        <div className="absolute inset-0 hero-pattern opacity-60" />
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-16 pt-24 pb-28 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-12 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-indigo-50/80 dark:bg-indigo-900/40 backdrop-blur-md text-indigo-600 dark:text-indigo-300 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border border-indigo-100/50 dark:border-indigo-800/50 shadow-sm">
              <ShieldCheck size={16} className="text-indigo-500" />
              <span>{t('app.safe_info')}</span>
            </div>
            
            <div className="space-y-6">
              <div className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] lg:max-w-4xl" aria-hidden="true">
                {category ? t(`nav.${category}`) : (
                  lang === 'ko' ? (
                    <>
                      모든 도구를 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-cyan-400">한 곳에서</span>
                    </>
                  ) : (
                    <>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-cyan-400">Station</span> for every utility
                    </>
                  )
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-lg md:text-2xl font-bold max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {t('app.desc')}
              </p>
            </div>
            
            {/* Search Input */}
            <div className="relative group max-w-2xl mx-auto lg:mx-0 transform transition-all focus-within:scale-[1.03] focus-within:-translate-y-1 duration-300">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-[3rem] blur opacity-15 group-focus-within:opacity-40 transition duration-500" />
              <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 overflow-hidden">
                <Search className="ml-8 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={28} />
                <input 
                  type="text"
                  placeholder={t('app.search_placeholder')}
                  className="w-full pl-6 pr-28 py-7 bg-transparent outline-none dark:text-white text-xl font-bold placeholder:text-slate-400 dark:placeholder:text-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search utilities"
                />
              </div>
            </div>
          </div>
          
          {/* Hero Ad Slot */}
          {!category && (
            <div className="w-full lg:w-[380px] shrink-0 hidden md:block">
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
                 <AdSlot className="h-[300px] !bg-white dark:!bg-slate-950 !border-none !rounded-[2.5rem] shadow-lg" type="square" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recent Tools Section */}
      {!category && !searchQuery && recentTools.length > 0 && (
        <section className="px-6 md:px-16 pt-12 pb-6 bg-slate-50/50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 shadow-sm">
                <History size={20} className="text-slate-400" />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest text-xs">{t('app.recent_tools')}</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {recentTools.map(tool => (
                <Link 
                  key={tool.id} 
                  to={`/tool/${tool.id}`}
                  className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-indigo-500 transition-all shrink-0 group"
                >
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 18 })}
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{tool.name[lang]}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid Content */}
      <section className="flex-1 px-6 md:px-16 pt-12 pb-32 bg-slate-50/50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                <Grid3X3 size={24} className="text-indigo-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {category ? t(`nav.${category}`) : t('app.popular_tools')}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('app.tools_active')}</span>
                </div>
              </div>
            </div>
            
            <div className="group relative flex items-center gap-4 px-7 py-3.5 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all cursor-default">
               <Zap size={20} className="text-amber-300 animate-pulse" />
               <span className="text-lg font-black tracking-tight">
                 {t('app.tools_available', { count: filteredTools.length })}
               </span>
            </div>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredTools.map((tool, idx) => (
                <React.Fragment key={tool.id}>
                  <ToolCard tool={tool} lang={lang} t={t} />
                  {(idx + 1) % 8 === 0 && (
                    <div className="col-span-full my-8">
                      <AdSlot className="h-44 shadow-sm" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-white dark:bg-slate-900/50 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
              <div className="bg-slate-50 dark:bg-slate-800 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm">
                <Search size={48} className="text-slate-200 dark:text-slate-700" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-2xl tracking-tight">No tools match your search criteria.</p>
              <button 
                onClick={() => setSearchQuery('')} 
                className="mt-8 px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Ad Section */}
      <div className="mt-auto px-6 md:px-16 pb-20 bg-slate-50/50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-5 mb-10">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.5em]">{t('common.advertisement')}</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          <AdSlot className="h-32" />
        </div>
      </div>
    </div>
  );
};

const ToolCard: React.FC<{ tool: any, lang: string, t: any }> = ({ tool, lang, t }) => (
  <Link 
    to={`/tool/${tool.id}`}
    className={`group p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${
      tool.disabled 
      ? 'opacity-80 grayscale-[0.5] border-slate-200 dark:border-slate-800 cursor-help' 
      : 'hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10'
    }`}
    aria-label={`${tool.name[lang]} - ${tool.description[lang]}`}
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />

    {tool.disabled && (
      <div className="absolute top-6 right-6 z-20">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-sm">
           <Construction size={10} />
           {lang === 'ko' ? '점검 중' : 'Maintenance'}
        </div>
      </div>
    )}

    <div className="space-y-10 relative z-10">
      <div className="flex items-start justify-between">
        <div className={`p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl transition-all duration-500 shadow-sm ${tool.disabled ? '' : 'group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-indigo-500/30 group-hover:scale-110 group-hover:-rotate-3'}`}>
          {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 36 })}
        </div>
        {!tool.disabled && (
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 text-slate-300 dark:text-slate-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 transition-all">
             <ArrowRight size={22} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h3 className={`font-black text-2xl text-slate-900 dark:text-slate-100 transition-colors tracking-tight leading-tight ${tool.disabled ? 'opacity-70' : 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
          {tool.name[lang]}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-bold">
          {tool.description[lang]}
        </p>
      </div>
    </div>
    
    <div className={`mt-10 pt-8 border-t dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 relative z-10`}>
      <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
        {tool.disabled ? (lang === 'ko' ? '일시 중단' : 'Paused') : t('common.launch')} <ArrowRight size={14} />
      </span>
    </div>
  </Link>
);

export default HomeView;
