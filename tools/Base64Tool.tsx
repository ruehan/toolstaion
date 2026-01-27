
import React, { useState } from 'react';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Base64Tool: React.FC = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const process = (val: string, currentMode: 'encode' | 'decode') => {
    setInput(val);
    if (!val) {
      setOutput('');
      return;
    }
    try {
      if (currentMode === 'encode') {
        setOutput(btoa(val));
      } else {
        setOutput(atob(val));
      }
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

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* Input Section */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col gap-6 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
             <h3 className="font-black text-slate-400 uppercase tracking-[0.2em] text-[11px]">
              Input Source
            </h3>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
               {mode === 'encode' ? t('base64.input_text') : t('base64.input_base64')}
            </p>
          </div>
          <button 
            onClick={swapMode}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-500/20"
          >
            <ArrowRightLeft size={16} />
            {t('base64.swap')}
          </button>
        </div>
        <textarea
          className="flex-1 min-h-0 p-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-mono text-[15px] dark:text-slate-100 leading-relaxed resize-none shadow-inner"
          placeholder={mode === 'encode' ? "Enter raw text to encode..." : "Paste Base64 string to decode..."}
          value={input}
          onChange={(e) => process(e.target.value, mode)}
          spellCheck={false}
        />
      </div>

      {/* Output Section */}
      <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-50/30 dark:bg-slate-950 flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
             <h3 className="font-black text-slate-400 uppercase tracking-[0.2em] text-[11px]">
              Output Result
            </h3>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
               {mode === 'encode' ? t('base64.input_base64') : t('base64.input_text')}
            </p>
          </div>
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all border ${
              copied 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? t('common.copied') : t('common.copy')}
          </button>
        </div>
        <div className="flex-1 min-h-0 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] font-mono text-[15px] dark:text-indigo-400 break-all whitespace-pre-wrap overflow-y-auto leading-relaxed shadow-sm">
          {output || <span className="text-slate-300 dark:text-slate-700 italic">Encoded/Decoded result will be displayed here...</span>}
        </div>
      </div>
    </div>
  );
};

export default Base64Tool;