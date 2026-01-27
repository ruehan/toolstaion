
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightLeft, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { TOOLS } from '../constants';

const Base64Tool: React.FC = () => {
  const { lang, t } = useLanguage();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const updateStats = (chars: number) => {
    const saved = localStorage.getItem('toolstation_stats');
    const stats = saved ? JSON.parse(saved) : { toolsUsed: 0, charsProcessed: 0, storageSaved: 0 };
    stats.toolsUsed += 1;
    stats.charsProcessed += chars;
    localStorage.setItem('toolstation_stats', JSON.stringify(stats));
  };

  const process = (val: string, currentMode: 'encode' | 'decode') => {
    setInput(val);
    if (!val) {
      setOutput('');
      return;
    }
    try {
      let result = '';
      if (currentMode === 'encode') {
        result = btoa(val);
      } else {
        result = atob(val);
      }
      setOutput(result);
      updateStats(result.length);
    } catch (e) {
      setOutput(t('common.error') + ': Invalid Base64');
    }
  };

  const swapMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    process(output, newMode);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextTools = TOOLS.find(t => t.id === 'base64-tool')?.nextTools || [];

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-white dark:bg-slate-950">
      {/* Input Section */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col gap-6 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r dark:border-slate-800 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
             <h3 className="font-black text-slate-400 uppercase tracking-[0.2em] text-[11px]">Input Source</h3>
          </div>
          <button onClick={swapMode} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-black text-xs uppercase transition-all border border-indigo-100">
            <ArrowRightLeft size={16} /> {t('base64.swap')}
          </button>
        </div>
        <textarea
          className="flex-1 min-h-[300px] p-8 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-indigo-500/5 font-mono text-[15px] dark:text-slate-100 leading-relaxed resize-none shadow-inner"
          value={input}
          onChange={(e) => process(e.target.value, mode)}
          spellCheck={false}
        />
      </div>

      {/* Output Section */}
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-50/30 dark:bg-slate-950 flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
             <h3 className="font-black text-slate-400 uppercase tracking-[0.2em] text-[11px]">Output Result</h3>
          </div>
          <button onClick={copyToClipboard} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase border transition-all ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'}`}>
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>
        <div className="flex-1 min-h-[300px] p-8 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] font-mono text-[15px] dark:text-indigo-400 break-all whitespace-pre-wrap overflow-y-auto leading-relaxed shadow-sm">
          {output || <span className="text-slate-300 italic">Encoded/Decoded result...</span>}
        </div>

        {/* Smart Workflow */}
        {output.length > 5 && (
          <div className="pt-6 border-t dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={12} className="text-indigo-500" /> {t('workflow.next_step')}
            </p>
            <div className="flex flex-wrap gap-2">
              {nextTools.map(toolId => {
                const tool = TOOLS.find(t => t.id === toolId);
                if (!tool) return null;
                return (
                  <Link key={tool.id} to={`/tool/${tool.id}`} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-xs font-bold hover:border-indigo-500 shadow-sm group">
                    {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 14 })}
                    <span className="text-slate-700 dark:text-slate-300">{tool.name[lang]}</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Base64Tool;
