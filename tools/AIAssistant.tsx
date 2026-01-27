
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { lang, t } = useLanguage();

  const handleAIAction = async (promptType: 'grammar' | 'summarize' | 'professional' | 'translate') => {
    if (!input.trim()) {
      setError(t('common.input_empty'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let instruction = '';
      
      if (lang === 'ko') {
        switch (promptType) {
          case 'grammar': instruction = '다음 텍스트의 문법과 오타를 교정하고 자연스럽게 다듬어줘. 설명 없이 결과만 출력해: '; break;
          case 'summarize': instruction = '다음 내용을 핵심 위주로 짧게 요약해줘: '; break;
          case 'professional': instruction = '다음 텍스트를 비즈니스 상황에 맞는 정중하고 전문적인 말투로 바꿔줘. 결과만 출력해: '; break;
          case 'translate': instruction = '다음 텍스트를 영어로 번역해줘. 결과만 출력해: '; break;
        }
      } else {
        switch (promptType) {
          case 'grammar': instruction = 'Correct grammar and typos in the following text. Output only the result: '; break;
          case 'summarize': instruction = 'Summarize the following text briefly: '; break;
          case 'professional': instruction = 'Rewrite the following text in a professional business tone. Output only the result: '; break;
          case 'translate': instruction = 'Translate the following text into Korean. Output only the result: '; break;
        }
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: instruction + input,
      });

      setResult(response.text || '');
    } catch (err: any) {
      setError(err.message || (lang === 'ko' ? 'AI 요청 중 오류가 발생했습니다.' : 'AI error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-white dark:bg-slate-950">
      {/* Input Side */}
      <div className="w-full md:w-1/2 p-8 flex flex-col gap-5 border-b md:border-b-0 md:border-r dark:border-slate-800">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Input Context</label>
        <textarea
          className={`flex-1 min-h-0 p-5 bg-slate-50 dark:bg-slate-900 border ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 text-[15px] font-medium leading-relaxed dark:text-slate-100 transition-all resize-none`}
          placeholder={lang === 'ko' ? "내용을 입력하세요..." : "Paste your text here..."}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError(null);
          }}
        />
        
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center gap-2 text-xs font-bold border border-rose-100 dark:border-rose-900/30">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <ActionButton label={t('ai.grammar')} onClick={() => handleAIAction('grammar')} loading={loading} />
          <ActionButton label={t('ai.summarize')} onClick={() => handleAIAction('summarize')} loading={loading} />
          <ActionButton label={t('ai.professional')} onClick={() => handleAIAction('professional')} loading={loading} />
          <ActionButton label={t('ai.translate')} onClick={() => handleAIAction('translate')} loading={loading} />
        </div>
      </div>

      {/* Output Side */}
      <div className="w-full md:w-1/2 p-8 bg-slate-50/30 dark:bg-slate-900/30 flex flex-col gap-5 overflow-hidden">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Intelligence Insight</label>
          {result && (
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? t('common.copied') : t('common.copy')}
            </button>
          )}
        </div>
        
        <div className="flex-1 min-h-0 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-y-auto whitespace-pre-wrap dark:text-slate-200 relative shadow-sm leading-8 text-[16px] font-medium tracking-tight">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-500">
               <Loader2 className="animate-spin text-indigo-500" size={36} />
               <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{t('ai.processing')}</p>
            </div>
          ) : result ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
               {result}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-700 text-center space-y-4 opacity-50">
              <Sparkles size={48} className="mx-auto text-indigo-200 dark:text-indigo-900" />
              <p className="text-sm font-bold uppercase tracking-widest px-10">
                {lang === 'ko' ? 'AI 분석 대기 중' : 'Awaiting AI analysis'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ label: string, onClick: () => void, loading: boolean }> = ({ label, onClick, loading }) => (
  <button 
    disabled={loading}
    onClick={onClick}
    className="py-4 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-[13px] text-slate-700 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-all disabled:opacity-50 active:scale-95"
  >
    {label}
  </button>
);

export default AIAssistant;