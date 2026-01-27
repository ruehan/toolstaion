
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, Type, ArrowDownUp, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { TOOLS } from '../constants';

const TextConverter: React.FC = () => {
  const { lang, t } = useLanguage();
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStats = (chars: number) => {
    const saved = localStorage.getItem('toolstation_stats');
    const stats = saved ? JSON.parse(saved) : { toolsUsed: 0, charsProcessed: 0, storageSaved: 0 };
    stats.toolsUsed += 1;
    stats.charsProcessed += chars;
    localStorage.setItem('toolstation_stats', JSON.stringify(stats));
  };

  const convert = (type: 'upper' | 'lower' | 'capitalize' | 'camel' | 'snake') => {
    if (!text.trim()) {
      setError(t('common.input_empty'));
      return;
    }
    setError(null);
    let result = text;
    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'capitalize': 
        result = text.split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase()).join(' ');
        break;
      case 'camel':
        result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('_') || '';
        break;
    }
    setText(result);
    updateStats(result.length);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextTools = TOOLS.find(t => t.id === 'text-converter')?.nextTools || [];

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-white dark:bg-slate-950">
      <div className="w-full md:w-2/3 p-8 flex flex-col gap-6 border-b md:border-b-0 md:border-r dark:border-slate-800 overflow-y-auto">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Editor Canvas</label>
          <button onClick={copyToClipboard} className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 hover:underline">
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>
        <div className="flex-1 relative min-h-[350px]">
          <textarea
            className={`w-full h-full p-8 bg-slate-50 dark:bg-slate-900 border ${error ? 'border-rose-500' : 'dark:border-slate-800'} rounded-[2.5rem] outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-lg dark:text-white resize-none shadow-inner`}
            placeholder={t('word.editor_placeholder')}
            value={text}
            onChange={(e) => { setText(e.target.value); setError(null); }}
          />
        </div>

        {/* Smart Workflow */}
        {text.length > 5 && (
          <div className="pt-6 border-t dark:border-slate-800 animate-in slide-in-from-bottom-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={12} className="text-indigo-500" />
              {t('workflow.next_step')}
            </p>
            <div className="flex flex-wrap gap-2">
              {nextTools.map(toolId => {
                const tool = TOOLS.find(t => t.id === toolId);
                if (!tool) return null;
                return (
                  <Link 
                    key={tool.id} 
                    to={`/tool/${tool.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-xs font-bold hover:border-indigo-500 transition-all shadow-sm group"
                  >
                    {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 14 })}
                    <span className="text-slate-700 dark:text-slate-300">{tool.name[lang]}</span>
                    <ArrowRight size={12} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="w-full md:w-1/3 p-8 bg-slate-50/50 dark:bg-slate-900/20 space-y-6 overflow-y-auto">
        <h3 className="font-black text-slate-400 uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2">
          <ArrowDownUp size={16} className="text-indigo-500" /> Conversion Options
        </h3>
        
        <div className="space-y-3">
          <ConvertBtn label="UPPERCASE" onClick={() => convert('upper')} />
          <ConvertBtn label="lowercase" onClick={() => convert('lower')} />
          <ConvertBtn label="Capitalize Each" onClick={() => convert('capitalize')} />
          <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />
          <ConvertBtn label="camelCase" onClick={() => convert('camel')} />
          <ConvertBtn label="snake_case" onClick={() => convert('snake')} />
        </div>
      </div>
    </div>
  );
};

const ConvertBtn: React.FC<{ label: string, onClick: () => void }> = ({ label, onClick }) => (
  <button onClick={onClick} className="w-full p-5 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl text-left hover:border-indigo-500 transition-all shadow-sm font-bold text-slate-700 dark:text-slate-200">
    {label}
  </button>
);

export default TextConverter;
