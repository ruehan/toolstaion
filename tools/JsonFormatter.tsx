
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, Check, Copy, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { TOOLS } from '../constants';

const JsonFormatter: React.FC = () => {
  const { lang, t } = useLanguage();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const updateStats = (chars: number) => {
    const saved = localStorage.getItem('toolstation_stats');
    const stats = saved ? JSON.parse(saved) : { toolsUsed: 0, charsProcessed: 0, storageSaved: 0 };
    stats.toolsUsed += 1;
    stats.charsProcessed += chars;
    localStorage.setItem('toolstation_stats', JSON.stringify(stats));
  };

  const formatJson = (indent: number = 2) => {
    try {
      if (!input.trim()) {
        setError(t('common.input_empty'));
        return;
      }
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setInput(formatted);
      setError(null);
      updateStats(formatted.length);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    updateStats(input.length);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextTools = TOOLS.find(t => t.id === 'json-formatter')?.nextTools || [];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
      <div className="shrink-0 p-3 bg-slate-50 dark:bg-slate-950 border-b dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => formatJson(2)}
            className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            {t('json.beautify_2')}
          </button>
          <button 
            onClick={() => formatJson(4)}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            {t('json.beautify_4')}
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={copyToClipboard}
            className="px-3 py-1.5 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all border border-transparent hover:border-slate-200"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-slate-900 dark:bg-slate-950">
        <textarea
          className={`w-full h-full p-6 font-mono text-sm text-indigo-300 dark:text-indigo-400 bg-transparent outline-none resize-none border-none leading-relaxed transition-colors ${error ? 'ring-2 ring-inset ring-rose-500/50' : ''}`}
          placeholder='{"paste": "your", "json": "here"}'
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          spellCheck={false}
        />
        
        {error && (
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-rose-500/95 backdrop-blur-md text-white rounded-xl shadow-xl flex items-start gap-3 border border-rose-400">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-bold text-xs uppercase tracking-widest mb-0.5">Parse Error</p>
              <p className="text-[11px] opacity-90 truncate">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Smart Workflow Footer */}
      <div className="shrink-0 p-3 bg-slate-50 dark:bg-slate-950 border-t dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <div className={`w-2 h-2 rounded-full ${error ? 'bg-rose-500' : input.length > 0 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          <span>{error ? 'Invalid JSON' : input.length > 0 ? 'Valid Format' : 'Idle'}</span>
        </div>
        
        {input.length > 10 && !error && (
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={10} className="text-indigo-500" /> {t('workflow.next_step')}
            </span>
            <div className="flex gap-1.5">
              {nextTools.slice(0, 2).map(id => {
                const tool = TOOLS.find(t => t.id === id);
                return tool ? (
                  <Link key={id} to={`/tool/${id}`} className="px-3 py-1 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-full text-[10px] font-bold text-slate-600 hover:border-indigo-500 transition-all flex items-center gap-1">
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

export default JsonFormatter;
