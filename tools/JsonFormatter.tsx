
import React, { useState } from 'react';
import { Code, Check, Copy, AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const JsonFormatter: React.FC = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (indent: number = 2) => {
    try {
      if (!input.trim()) {
        setError(t('common.input_empty'));
        return;
      }
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      <div className="shrink-0 p-3 bg-slate-50 dark:bg-slate-950 border-t dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${error ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : input.length > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-400'}`} />
          <span>{error ? 'Invalid JSON' : input.length > 0 ? 'Valid Format' : 'Idle'}</span>
        </div>
        <p>Real-time Client Validation</p>
      </div>
    </div>
  );
};

export default JsonFormatter;