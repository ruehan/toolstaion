
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Copy, Check, ShieldCheck, ShieldAlert, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { TOOLS } from '../constants';

const PasswordGenerator: React.FC = () => {
  const { lang, t } = useLanguage();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false
  });
  const [copied, setCopied] = useState(false);

  const updateStats = () => {
    const saved = localStorage.getItem('toolstation_stats');
    const stats = saved ? JSON.parse(saved) : { toolsUsed: 0, charsProcessed: 0, storageSaved: 0 };
    stats.toolsUsed += 1;
    localStorage.setItem('toolstation_stats', JSON.stringify(stats));
  };

  const generatePassword = () => {
    let charset = '';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    if (options.excludeSimilar) charset = charset.replace(/[il1Lo0O]/g, '');
    if (!charset) return setPassword('');
    let generated = '';
    for (let i = 0; i < length; i++) generated += charset.charAt(Math.floor(Math.random() * charset.length));
    setPassword(generated);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    updateStats();
    setTimeout(() => setCopied(false), 2000);
  };

  const nextTools = TOOLS.find(t => t.id === 'password-generator')?.nextTools || [];

  return (
    <div className="p-8 md:p-16 space-y-12 max-w-4xl mx-auto h-full overflow-y-auto hide-scrollbar bg-white dark:bg-slate-950">
      <div className="relative group">
        <div className="absolute -inset-1.5 bg-indigo-500 rounded-[2.5rem] blur-xl opacity-10 group-hover:opacity-20 transition duration-1000" />
        <div className="relative p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-8 shadow-sm">
          <input type="text" readOnly value={password} className="w-full bg-transparent text-3xl md:text-5xl font-mono font-bold tracking-widest text-slate-900 dark:text-white outline-none text-center break-all" />
          <div className="flex gap-4 w-full max-w-md">
            <button onClick={generatePassword} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl active:rotate-90 transition-transform"><RefreshCw size={24} className="text-slate-500" /></button>
            <button onClick={copyToClipboard} className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              {copied ? <Check size={20} /> : <Copy size={20} />} {copied ? t('common.copied') : t('common.copy')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <label className="font-black text-slate-400 uppercase tracking-widest text-[11px]">{t('pass.length')}</label>
              <span className="text-4xl font-black text-indigo-600 tracking-tighter">{length}</span>
            </div>
            <input type="range" min="4" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
          
          {/* Smart Workflow Section */}
          <div className="pt-8 border-t dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={12} className="text-indigo-500" /> {t('workflow.next_step')}</p>
            <div className="flex flex-wrap gap-2">
              {nextTools.map(id => {
                const tool = TOOLS.find(t => t.id === id);
                return tool ? <Link key={id} to={`/tool/${id}`} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl text-xs font-bold hover:border-indigo-500 shadow-sm transition-all">{React.cloneElement(tool.icon as any, {size: 14})} {tool.name[lang]}</Link> : null;
              })}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-black text-slate-400 uppercase tracking-widest text-[11px] mb-4">Configuration</h3>
          <OptionToggle label="Uppercase (ABC)" checked={options.uppercase} onChange={() => setOptions({...options, uppercase: !options.uppercase})} />
          <OptionToggle label="Lowercase (abc)" checked={options.lowercase} onChange={() => setOptions({...options, lowercase: !options.lowercase})} />
          <OptionToggle label="Numbers (123)" checked={options.numbers} onChange={() => setOptions({...options, numbers: !options.numbers})} />
          <OptionToggle label="Symbols (!@#)" checked={options.symbols} onChange={() => setOptions({...options, symbols: !options.symbols})} />
        </div>
      </div>
    </div>
  );
};

const OptionToggle: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl cursor-pointer hover:bg-white dark:hover:bg-slate-800 border border-transparent transition-all">
    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
    <input type="checkbox" checked={checked} onChange={onChange} className="w-5 h-5 accent-indigo-600" />
  </label>
);

export default PasswordGenerator;
