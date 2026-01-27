
import React, { useState } from 'react';
import { Database, Copy, Check, Trash2, AlertCircle, Play } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const SqlFormatter: React.FC = () => {
  const { t } = useLanguage();
  const [sql, setSql] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      .replace(/\s+OR\s+/gi, '\n  OR ')
      .replace(/\s+GROUP BY\s+/gi, '\nGROUP BY\n  ')
      .replace(/\s+ORDER BY\s+/gi, '\nORDER BY\n  ')
      .replace(/\s+LEFT JOIN\s+/gi, '\nLEFT JOIN\n  ')
      .replace(/\s+INNER JOIN\s+/gi, '\nINNER JOIN\n  ')
      .replace(/\s+INSERT INTO\s+/gi, 'INSERT INTO\n  ')
      .replace(/\s+VALUES\s+/gi, '\nVALUES\n  ')
      .replace(/\s+UPDATE\s+/gi, 'UPDATE\n  ')
      .replace(/\s+SET\s+/gi, '\nSET\n  ');

    setSql(formatted.trim());
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-900 dark:bg-slate-950">
      {/* Action Bar */}
      <div className="shrink-0 p-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={formatSql}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-black text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10 active:scale-95"
          >
            <Play size={16} fill="currentColor" />
            {t('sql.format')}
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">SQL Studio / Formatter</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all border ${
              copied 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-800'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {t('common.copy')}
          </button>
          <button 
            onClick={() => { setSql(''); setError(null); }}
            className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/40"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        <textarea
          className="w-full h-full p-10 font-mono text-[15px] bg-transparent text-emerald-400 dark:text-emerald-300 outline-none resize-none leading-relaxed selection:bg-indigo-500/30"
          placeholder="-- Paste your raw SQL query here...&#10;SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE orders.amount > 1000"
          value={sql}
          onChange={(e) => { setSql(e.target.value); setError(null); }}
          spellCheck={false}
        />
        
        {error && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 p-4 bg-rose-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 border border-rose-500">
            <AlertCircle size={20} />
            <p className="font-bold text-sm tracking-tight">{error}</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="shrink-0 px-6 py-3 bg-slate-800/50 dark:bg-slate-900 border-t dark:border-slate-800 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-5">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
             <span>Line Count: {sql.split('\n').length}</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
             <span>Characters: {sql.length}</span>
           </div>
        </div>
        <span>Ready for Execution</span>
      </div>
    </div>
  );
};

export default SqlFormatter;