
import React, { useState } from 'react';
import { ImageIcon, Wand2, Download, AlertCircle, Loader2, Maximize2, Construction } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const AIImageGenerator: React.FC = () => {
  const { lang, t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    // BLOCK EXECUTION
    setError(lang === 'ko' ? '현재 이미지 생성 기능이 임시 점검 중입니다.' : 'Image generation is currently under maintenance.');
    return;
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-white dark:bg-slate-950 relative">
      {/* Maintenance Overlay */}
      <div className="absolute inset-0 z-50 bg-white/60 dark:bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
        <div className="p-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-[3rem] shadow-xl border border-indigo-100 dark:border-indigo-800 animate-bounce mb-8">
           <Construction size={64} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
          {lang === 'ko' ? '서비스 임시 점검 중' : 'Temporary Maintenance'}
        </h2>
        <p className="max-w-md text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8">
          {lang === 'ko' 
            ? '더 나은 서비스 제공을 위해 이미지 생성 기능을 잠시 점검하고 있습니다. 다른 유틸리티 도구들은 정상 이용 가능합니다.' 
            : 'We are temporarily checking the image generation feature to provide better service. Other utility tools are available.'}
        </p>
        <button 
          onClick={() => window.history.back()}
          className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
        >
          {lang === 'ko' ? '뒤로 가기' : 'Go Back'}
        </button>
      </div>

      {/* Configuration Panel (Visual only) */}
      <div className="w-full lg:w-[400px] shrink-0 p-8 border-b lg:border-b-0 lg:border-r dark:border-slate-800 flex flex-col gap-8 opacity-50 grayscale">
        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
             <Wand2 size={14} /> {lang === 'ko' ? '프롬프트 입력' : 'Describe your vision'}
          </label>
          <textarea disabled className="w-full p-6 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] h-48 text-[15px]" />
        </div>
        <button disabled className="w-full py-5 bg-slate-300 dark:bg-slate-800 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3">
          <ImageIcon size={24} />
          {t('img.generate')}
        </button>
      </div>

      {/* Preview Area (Visual only) */}
      <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950 opacity-30 grayscale">
         <div className="p-8 bg-white dark:bg-slate-900 rounded-full">
            <ImageIcon size={64} className="text-slate-200" />
         </div>
      </div>
    </div>
  );
};

export default AIImageGenerator;
