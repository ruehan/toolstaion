
import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Cpu, Key, Activity, ExternalLink, AlertTriangle, CheckCircle2, Box } from 'lucide-react';

const LegalView: React.FC<{ type: 'about' | 'privacy' | 'terms' }> = ({ type }) => {
  const { lang, t } = useLanguage();

  const currentDate = "2026-01-27";
  const rawKey = process.env.API_KEY || '';
  
  // Logic to identify if it's the playground system key or a user key
  const isSystemKey = rawKey === 'GEMINI_API_KEY' || !rawKey;
  const maskedKey = isSystemKey 
    ? (lang === 'ko' ? '시스템 관리 키 (Sandbox)' : 'System Managed (Sandbox)')
    : (rawKey.length > 15 ? `${rawKey.substring(0, 12)}...${rawKey.substring(rawKey.length - 4)}` : rawKey);

  const content = {
    about: {
      title: t('legal.about_title'),
      sections: [
        {
          h: lang === 'ko' ? '우리의 미션' : 'Our Mission',
          p: lang === 'ko' 
            ? 'ToolStation은 복잡한 설치 없이 브라우저에서 즉시 실행되는 고성능 유틸리티를 제공합니다. 사용자의 생산성을 높이는 동시에 개인정보 보호를 최우선 가치로 둡니다.'
            : 'ToolStation provides high-performance utilities that run instantly in your browser. We aim to enhance productivity while prioritizing user privacy above all else.'
        },
        {
          h: lang === 'ko' ? '데이터 보안' : 'Data Security',
          p: lang === 'ko'
            ? '모든 작업은 사용자의 기기(Client-side) 내에서만 처리됩니다. 어떠한 이미지나 텍스트도 우리의 서버에 기록되거나 전송되지 않습니다.'
            : 'All processing happens exclusively on your device (client-side). No images or text are ever logged or transmitted to our servers.'
        }
      ]
    },
    privacy: {
      title: t('legal.privacy_title'),
      sections: [
        {
          h: lang === 'ko' ? '데이터 수집 미실시' : 'No Data Collection',
          p: lang === 'ko'
            ? '우리는 사용자가 도구에 입력하는 어떠한 개인정보나 파일 데이터도 수집하지 않습니다. 모든 데이터 처리는 브라우저 메모리 내에서만 이루어집니다.'
            : 'We do not collect any personal information or file data you input into our tools. All data processing occurs strictly within your browser memory.'
        }
      ]
    },
    terms: {
      title: t('legal.terms_title'),
      sections: [
        {
          h: lang === 'ko' ? '서비스 이용' : 'Service Usage',
          p: lang === 'ko'
            ? '본 서비스는 무료로 제공되며 상업적, 비상업적 용도로 모두 사용 가능합니다. 단, 서비스의 오용이나 해킹 시도는 금지됩니다.'
            : 'This service is provided free of charge and can be used for both commercial and non-commercial purposes.'
        }
      ]
    }
  };

  const activeContent = content[type] || content.about;

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 p-8 md:p-20">
      <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter border-b-4 border-indigo-500 pb-4 w-fit">
          {activeContent.title}
        </h1>
        
        <div className="space-y-10">
          {activeContent.sections.map((section, i) => (
            <section key={i} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                {section.h}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                {section.p}
              </p>
            </section>
          ))}
        </div>

        {type === 'about' && (
          <div className="mt-20 space-y-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Activity size={16} className="text-indigo-500" />
                   {t('legal.sys_info')}
                </h2>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isSystemKey ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                   {isSystemKey ? <Box size={12} /> : <CheckCircle2 size={12} />}
                   {isSystemKey ? 'Sandbox Mode' : 'Production Mode'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Key size={12} /> {t('legal.api_key')}
                  </p>
                  <div className={`p-4 border dark:border-slate-800 rounded-2xl font-mono text-sm font-bold shadow-inner overflow-hidden text-ellipsis ${isSystemKey ? 'bg-slate-100 text-slate-500 dark:bg-slate-950' : 'bg-white text-indigo-600 dark:bg-slate-950 dark:text-indigo-400'}`}>
                    {maskedKey}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Cpu size={12} /> {t('legal.active_model')}
                  </p>
                  <div className="p-4 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl font-mono text-sm font-bold text-slate-700 dark:text-slate-300 shadow-inner">
                    gemini-3-flash-preview
                  </div>
                </div>
              </div>

              {/* Deployment Explanation for User */}
              <div className="space-y-4">
                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-black text-xs uppercase tracking-tight">
                    <AlertTriangle size={16} />
                    {lang === 'ko' ? '왜 내 API 키가 아닌가요?' : 'Why is this not my API key?'}
                  </div>
                  <p className="text-[12px] text-indigo-600 dark:text-indigo-400/80 leading-relaxed font-bold">
                    {lang === 'ko' 
                      ? '이 화면은 개발 환경의 "미리보기"이므로 시스템이 제공하는 임시 테스트 키를 사용 중입니다. 따라서 별도의 설정 없이도 AI 기능이 작동하는 것입니다.' 
                      : 'You are viewing this in a "Preview" environment which uses a built-in system key for testing purposes.'}
                  </p>
                </div>

                <div className="p-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest opacity-70">Vercel Deployment Guide</span>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-[10px] font-black underline flex items-center gap-1">GET YOUR KEY <ExternalLink size={10} /></a>
                  </div>
                  <p className="text-sm font-bold leading-snug">
                    {lang === 'ko' 
                      ? '본인의 Vercel에 배포하여 운영하시려면, Vercel 프로젝트 설정의 Environment Variables 메뉴에서 API_KEY를 직접 등록해야 정식으로 작동합니다.' 
                      : 'To use your own API quota, add API_KEY to your Vercel Project Settings > Environment Variables.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-12 border-t dark:border-slate-800 text-sm text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
          {t('common.last_updated')}: {currentDate}
        </div>
      </div>
    </div>
  );
};

export default LegalView;
