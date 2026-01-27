
import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

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

  const generatePassword = () => {
    let charset = '';
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.numbers) charset += '0123456789';
    if (options.symbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }

    if (!charset) return setPassword('');

    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(generated);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (length < 8) return { label: t('pass.strength_weak'), color: 'text-rose-500', icon: <ShieldAlert size={18} /> };
    if (length < 12) return { label: t('pass.strength_med'), color: 'text-amber-500', icon: <Shield size={18} /> };
    return { label: t('pass.strength_strong'), color: 'text-emerald-500', icon: <ShieldCheck size={18} /> };
  };

  const strength = getStrength();

  return (
    <div className="p-8 md:p-16 space-y-12 max-w-4xl mx-auto h-full overflow-y-auto hide-scrollbar">
      <div className="relative group">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-[2.5rem] blur-xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-8 shadow-sm">
          <input 
            type="text" 
            readOnly 
            value={password}
            className="w-full bg-transparent text-3xl md:text-5xl font-mono font-bold tracking-[0.05em] text-slate-900 dark:text-white outline-none text-center break-all leading-tight"
          />
          <div className="flex gap-4 shrink-0 w-full max-w-md">
            <button onClick={generatePassword} className="p-5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all active:rotate-90">
              <RefreshCw size={24} className="text-slate-500" />
            </button>
            <button 
              onClick={copyToClipboard}
              className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/10 active:scale-[0.98]"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? t('common.copied') : t('common.copy')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <label className="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[11px]">{t('pass.length')}</label>
              <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{length}</span>
            </div>
            <input 
              type="range" 
              min="4" 
              max="64" 
              value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className={`p-6 rounded-3xl flex items-center gap-4 border-2 ${strength.color.replace('text', 'border')} bg-white dark:bg-slate-900 shadow-sm transition-all`}>
            {strength.icon}
            <span className={`font-black text-sm uppercase tracking-wider ${strength.color}`}>{t('pass.strength')}: {strength.label}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[11px] mb-4">Configuration</h3>
          <OptionToggle 
            label={lang === 'ko' ? "영문 대문자 (ABC)" : "Uppercase (ABC)"} 
            checked={options.uppercase} 
            onChange={() => setOptions({...options, uppercase: !options.uppercase})} 
          />
          <OptionToggle 
            label={lang === 'ko' ? "영문 소문자 (abc)" : "Lowercase (abc)"} 
            checked={options.lowercase} 
            onChange={() => setOptions({...options, lowercase: !options.lowercase})} 
          />
          <OptionToggle 
            label={lang === 'ko' ? "숫자 포함 (123)" : "Numbers (123)"} 
            checked={options.numbers} 
            onChange={() => setOptions({...options, numbers: !options.numbers})} 
          />
          <OptionToggle 
            label={lang === 'ko' ? "특수문자 (!@#)" : "Symbols (!@#)"} 
            checked={options.symbols} 
            onChange={() => setOptions({...options, symbols: !options.symbols})} 
          />
          <OptionToggle 
            label={lang === 'ko' ? "유사 문자 제외" : "Exclude Similar"} 
            checked={options.excludeSimilar} 
            onChange={() => setOptions({...options, excludeSimilar: !options.excludeSimilar})} 
          />
        </div>
      </div>
    </div>
  );
};

const OptionToggle: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl cursor-pointer hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group">
    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{label}</span>
    <div className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
    </div>
  </label>
);

export default PasswordGenerator;