
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Copy, Check, Trash2, AlertCircle, Play, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { TOOLS } from '../constants';

const SqlFormatter: React.FC = () => {
  const { lang, t } = useLanguage();
  const [sql, setSql] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStats = (chars: number) => {
    const saved = localStorage.getItem('toolstation_stats');
    const stats = saved ? JSON.parse(saved) : { toolsUsed: 0, charsProcessed: 0, storageSaved: 0 };
    stats.toolsUsed += 1;
    stats.charsProcessed += chars;
    localStorage.setItem('toolstation_stats', JSON.stringify(stats));
  };

  const formatSql = () => {
    if (!sql.trim()) {
      setError(t('common.input_empty'));
      return;
    }
    setError(null);
    let formatted = sql
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ',\n  ')
      .replace(/\s+SELECT\s+/gi, 'SELECT\n  ')
      .replace(/\s+FROM\s+/gi, '\nFROM\n  ')
      .replace(/\s+WHERE\s+/gi, '\nWHERE\n  ')
      .replace(/\s+AND\s+/gi, '\n  AND ')
      .replace(/\s+ORDER BY\s+/gi, '\nORDER BY\n  ');

    const result = formatted.trim();
    setSql(result);
    updateStats(result.length);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextTools = TOOLS.find(t => t.id === 'sql-formatter')?.nextTools || [];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-900 dark:bg-slate-950">
      <div className="shrink-0 p-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between">
        <button onClick={formatSql} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-black text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
          <Play size={16} fill="currentColor" /> {t('sql.format')}
        </button>
        <div className="flex items-center gap-2">
          <button onClick={copyToClipboard} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase transition-all border ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200'}`}>
            {copied ? <Check size={16} /> : <Copy size={16} />} {t('common.copy')}
          </button>
          <button onClick={() => setSql('')} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={20} /></button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <textarea
          className="w-full h-full p-10 font-mono text-[15px] bg-transparent text-emerald-400 dark:text-emerald-300 outline-none resize-none leading-relaxed"
          value={sql}
          onChange={(e) => { setSql(e.target.value); setError(null); }}
          spellCheck={false}
        />
        {error && <div className="absolute bottom-10 left-1/2 -translate-x-1/2 p-4 bg-rose-600 text-white rounded-2xl animate-in slide-in-from-bottom-5"><p className="font-bold text-sm">{error}</p></div>}
      </div>

      {/* Footer Info & Workflow */}
      <div className="shrink-0 px-6 py-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-5 text-[10px] font-black text-slate-500 uppercase">
           <span>Line Count: {sql.split('\n').length}</span>
           <span>Characters: {sql.length}</span>
        </div>
        
        {sql.length > 10 && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Sparkles size={12} /> {t('workflow.next_step')}</span>
            <div className="flex gap-1.5">
              {nextTools.map(id => {
                const tool = TOOLS.find(t => t.id === id);
                return tool ? (
                  <Link key={id} to={`/tool/${id}`} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border dark:border-slate-700 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-500 flex items-center gap-1">
                    {tool.name[lang]} <ArrowRight size={10} />
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SqlFormatter;
