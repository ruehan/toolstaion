
import React, { useState } from 'react';
import { Copy, Check, Type, ArrowDownUp, AlertCircle } from 'lucide-react';

const TextConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = (type: 'upper' | 'lower' | 'capitalize' | 'camel' | 'snake') => {
    if (!text.trim()) {
      setError('변환할 텍스트가 없습니다. (No input text)');
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
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-2/3 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Input & Output</label>
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-sm text-indigo-600 font-bold hover:underline"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? '복사됨' : '전체 복사'}
          </button>
        </div>
        <div className="flex-1 relative min-h-[300px]">
          <textarea
            className={`w-full h-full p-6 bg-slate-50 dark:bg-slate-900 border ${error ? 'border-rose-500' : 'dark:border-slate-700'} rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 text-lg dark:text-white resize-none`}
            placeholder="변환할 텍스트를 여기에 입력하세요..."
            value={text}
            onChange={(e) => { setText(e.target.value); setError(null); }}
          />
          {error && (
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-rose-500 text-white rounded-xl shadow-lg flex items-center gap-2 text-sm font-bold animate-in slide-in-from-bottom-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-1/3 p-6 bg-slate-50/50 dark:bg-slate-900/20 border-l dark:border-slate-700 space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
          <ArrowDownUp size={18} className="text-indigo-500" /> 변환 옵션
        </h3>
        
        <div className="space-y-3">
          <ConvertBtn label="UPPERCASE" onClick={() => convert('upper')} description="대문자로 변환" />
          <ConvertBtn label="lowercase" onClick={() => convert('lower')} description="소문자로 변환" />
          <ConvertBtn label="Capitalize Each" onClick={() => convert('capitalize')} description="첫 글자만 대문자" />
          <div className="h-px bg-slate-200 dark:bg-slate-700 my-4" />
          <ConvertBtn label="camelCase" onClick={() => convert('camel')} description="카멜 케이스 (개발용)" />
          <ConvertBtn label="snake_case" onClick={() => convert('snake')} description="스네이크 케이스 (개발용)" />
        </div>
      </div>
    </div>
  );
};

const ConvertBtn: React.FC<{ label: string, onClick: () => void, description: string }> = ({ label, onClick, description }) => (
  <button 
    onClick={onClick}
    className="w-full p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl text-left hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all group shadow-sm"
  >
    <p className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{label}</p>
    <p className="text-xs text-slate-400">{description}</p>
  </button>
);

export default TextConverter;
