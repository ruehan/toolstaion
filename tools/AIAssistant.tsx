
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, Copy, Check, AlertCircle, AlertTriangle, X, Info, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { TOOLS } from '../constants';

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const { lang, t } = useLanguage();

  const updateStats = (chars: number) => {
    const saved = localStorage.getItem('toolstation_stats');
    const stats = saved ? JSON.parse(saved) : { toolsUsed: 0, charsProcessed: 0, storageSaved: 0 };
    stats.toolsUsed += 1;
    stats.charsProcessed += chars;
    localStorage.setItem('toolstation_stats', JSON.stringify(stats));
  };

  const handleAIAction = async (promptType: 'grammar' | 'summarize' | 'professional' | 'translate') => {
    if (!input.trim()) {
      setError(t('common.input_empty'));
      return;
    }

    if (!process.env.API_KEY) {
      setError(lang === 'ko' ? 'API 키가 없습니다.' : 'API Key is missing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let instruction = '';
      if (lang === 'ko') {
        switch (promptType) {
          case 'grammar': instruction = '다음 문법 교정: '; break;
          case 'summarize': instruction = '다음 요약: '; break;
          case 'professional': instruction = '다음 비즈니스 말투로: '; break;
          case 'translate': instruction = '다음 영문 번역: '; break;
        }
      } else {
        instruction = `${promptType}: `;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: instruction + input,
      });

      const outputText = response.text || '';
      setResult(outputText);
      updateStats(outputText.length);
    } catch (err: any) {
      if (err.message?.includes('429')) setShowQuotaModal(true);
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextTools = TOOLS.find(t => t.id === 'ai-assistant')?.nextTools || [];

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-white dark:bg-slate-950">
      {showQuotaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border dark:border-slate-800 animate-in zoom-in-95">
              <h2 className="text-2xl font-black mb-4">{t('error.quota_title')}</h2>
              <p className="text-slate-500 mb-8">{t('error.quota_desc')}</p>
              <button onClick={() => setShowQuotaModal(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black">{t('common.close')}</button>
           </div>
        </div>
      )}

      {/* Input Side */}
      <div className="w-full md:w-1/2 p-8 flex flex-col gap-5 border-b md:border-b-0 md:border-r dark:border-slate-800 overflow-y-auto">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Source Input</label>
        <textarea
          className="flex-1 min-h-[250px] p-5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none shadow-inner dark:text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <ActionButton label={t('ai.grammar')} onClick={() => handleAIAction('grammar')} loading={loading} />
          <ActionButton label={t('ai.summarize')} onClick={() => handleAIAction('summarize')} loading={loading} />
          <ActionButton label={t('ai.professional')} onClick={() => handleAIAction('professional')} loading={loading} />
          <ActionButton label={t('ai.translate')} onClick={() => handleAIAction('translate')} loading={loading} />
        </div>
      </div>

      {/* Result Side */}
      <div className="w-full md:w-1/2 p-8 bg-slate-50/30 dark:bg-slate-900/30 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">AI Response</label>
          {result && (
            <button onClick={copyToClipboard} className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 hover:underline">
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? t('common.copied') : t('common.copy')}
            </button>
          )}
        </div>
        
        <div className="flex-1 p-8 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] overflow-y-auto whitespace-pre-wrap dark:text-slate-200 relative shadow-sm leading-8">
          {loading ? (
             <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
             </div>
          ) : result || <div className="text-slate-300 dark:text-slate-700 italic">Result will appear here...</div>}
        </div>

        {/* Smart Workflow */}
        {result && !loading && (
          <div className="pt-4 border-t dark:border-slate-800 animate-in slide-in-from-bottom-2">
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
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold hover:border-indigo-500 transition-all shadow-sm group"
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
    </div>
  );
};

const ActionButton: React.FC<{ label: string, onClick: () => void, loading: boolean }> = ({ label, onClick, loading }) => (
  <button disabled={loading} onClick={onClick} className="py-4 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl font-bold text-xs hover:border-indigo-500 transition-all shadow-sm">
    {label}
  </button>
);

export default AIAssistant;
