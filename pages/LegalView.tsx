
import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Sparkles, ShieldCheck, Box, MessageSquareMore } from 'lucide-react';

const LegalView: React.FC<{ type: 'about' | 'privacy' | 'terms' }> = ({ type }) => {
  const { lang, t } = useLanguage();

  const currentDate = "2026-01-27";

  const content = {
    about: {
      title: t('legal.about_title'),
      sections: [
        {
          h: t('legal.mission_h'),
          p: t('legal.mission_p')
        },
        {
          h: t('legal.security_h'),
          p: t('legal.security_p')
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
            <div className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles size={80} className="text-indigo-500" />
              </div>

              <div className="flex items-center gap-3">
                 <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
                    <Box size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {t('legal.beta_title')}
                    </h2>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Official Beta Phase</p>
                 </div>
              </div>

              <p className="text-[15px] text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                {t('legal.beta_desc')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-5 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl flex items-center gap-3">
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('legal.privacy_badge')}</span>
                 </div>
                 <div className="p-5 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl flex items-center gap-3">
                    <MessageSquareMore size={20} className="text-blue-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('legal.scale_badge')}</span>
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
