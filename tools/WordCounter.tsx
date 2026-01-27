
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Trash2, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { TOOLS } from '../constants';

const WordCounter: React.FC = () => {
  const { lang, t } = useLanguage();
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const updateStats = (chars: number) => {
    const saved = localStorage.getItem('toolstation_stats');
    const stats = saved ? JSON.parse(saved) : { toolsUsed: 0, charsProcessed: 0, storageSaved: 0 };
    stats.toolsUsed += 1;
    stats.charsProcessed += chars;
    localStorage.setItem('toolstation_stats', JSON.stringify(stats));
  };

  useEffect(() => {
    if (text.length > 50) { // Only update stats for significant usage
      const debounce = setTimeout(() => updateStats(0), 10000); 
      return () => clearTimeout(debounce);
    }
  }, [text]);

  const getByteLength = (str: string, isThreeBytes: boolean = false) => {
    let bytes = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode <= 0x007f) bytes += 1;
      else if (charCode <= 0x07ff) bytes += 2;
      else bytes += isThreeBytes ? 3 : 2;
    }
    return bytes;
  };

  const stats = {
    charsWithSpace: text.length,
    charsNoSpace: text.replace(/\s/g, '').length,
    bytes2: getByteLength(text, false),
    bytes3: getByteLength(text, true),
    words: text.trim().split(/\s+/).filter(Boolean).length
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    updateStats(text.length); // Count stats when copying
    setTimeout(() => setCopied(false), 2000);
  };

  const nextTools = TOOLS.find(t => t.id === 'word-counter')?.nextTools || [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 p-3 bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Editor Canvas</span>
        <div className="flex gap-1.5">
          <button 
            onClick={copyToClipboard}
            className="px-3 py-1.5 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all border border-transparent hover:border-slate-200"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? t('common.copied') : t('common.copy')}
          </button>
          <button 
            onClick={() => setText('')}
            className="px-3 py-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all"
          >
            <Trash2 size={14} />
            {t('common.clear')}
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <textarea
          className="flex-1 p-6 bg-white dark:bg-slate-950 outline-none resize-none text-base border-r dark:border-slate-800 dark:text-slate-100 leading-relaxed font-medium placeholder:text-slate-300 dark:placeholder:text-slate-800"
          placeholder={t('word.editor_placeholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <div className="w-full md:w-72 shrink-0 p-6 bg-slate-50/50 dark:bg-slate-900/40 overflow-y-auto flex flex-col gap-6">
          <div className="space-y-6">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[10px]">{t('word.analysis')}</h3>
            <div className="grid grid-cols-1 gap-4">
              <StatBox label={t('word.with_space')} value={stats.charsWithSpace} primary />
              <StatBox label={t('word.no_space')} value={stats.charsNoSpace} />
              <div className="pt-4 border-t dark:border-slate-800">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase block mb-3 tracking-[0.2em]">{t('word.byte_calc')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <StatBox label="2Byte" value={stats.bytes2} small />
                  <StatBox label="3Byte" value={stats.bytes3} small />
                </div>
              </div>
              <StatBox label={t('word.words')} value={stats.words} />
            </div>
          </div>

          {/* Smart Workflow */}
          {text.length > 5 && (
            <div className="mt-auto pt-6 border-t dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles size={12} className="text-indigo-500" />
                {t('workflow.next_step')}
              </p>
              <div className="flex flex-col gap-2">
                {nextTools.map(toolId => {
                  const tool = TOOLS.find(t => t.id === toolId);
                  if (!tool) return null;
                  return (
                    <Link 
                      key={tool.id} 
                      to={`/tool/${tool.id}`}
                      className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold hover:border-indigo-500 transition-all shadow-sm group"
                    >
                      {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 14 })}
                      <span className="text-slate-700 dark:text-slate-300 flex-1">{tool.name[lang]}</span>
                      <ArrowRight size={12} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string, value: number, primary?: boolean, small?: boolean }> = ({ label, value, primary, small }) => (
  <div className={`p-4 rounded-xl border transition-all ${primary ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/10' : 'bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm'}`}>
    <p className={`font-bold mb-0.5 ${small ? 'text-[9px] uppercase tracking-wider' : 'text-[10px]'} ${primary ? 'text-indigo-100' : 'text-slate-400'}`}>{label}</p>
    <p className={`${small ? 'text-lg' : 'text-2xl'} font-black tracking-tight`}>
      {value.toLocaleString()}
    </p>
  </div>
);

export default WordCounter;
