
import React from 'react';
import { useLanguage } from '../LanguageContext';

const LegalView: React.FC<{ type: 'about' | 'privacy' | 'terms' }> = ({ type }) => {
  const { lang, t } = useLanguage();

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
        },
        {
          h: lang === 'ko' ? '쿠키 및 광고' : 'Cookies and Advertising',
          p: lang === 'ko'
            ? '우리는 사이트 분석 및 광고 제공(Google AdSense)을 위해 익명의 쿠키를 사용할 수 있습니다. 사용자는 브라우저 설정에서 쿠키 거부를 선택할 수 있습니다.'
            : 'We may use anonymous cookies for site analysis and advertising (Google AdSense). Users can choose to reject cookies in their browser settings.'
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
            : 'This service is provided free of charge and can be used for both commercial and non-commercial purposes. Misuse or hacking attempts are prohibited.'
        },
        {
          h: lang === 'ko' ? '책임의 한계' : 'Disclaimer',
          p: lang === 'ko'
            ? '서비스 이용 과정에서 발생하는 결과에 대해 ToolStation은 법적 책임을 지지 않습니다. 중요 데이터는 사용 전에 반드시 백업하시기 바랍니다.'
            : 'ToolStation is not legally responsible for any outcomes resulting from the use of this service. Please ensure you back up critical data before use.'
        }
      ]
    }
  };

  const activeContent = content[type];

  // Updated to reflect the most current state in the 2026 timeline
  const currentDate = "2026-01-27";

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

        <div className="pt-12 border-t dark:border-slate-800 text-sm text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
          {t('common.last_updated')}: {currentDate}
        </div>
      </div>
    </div>
  );
};

export default LegalView;
